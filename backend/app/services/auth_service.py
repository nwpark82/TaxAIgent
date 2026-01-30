"""
Authentication service - 인증 비즈니스 로직
"""
from datetime import datetime
from typing import Optional
import httpx
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
from app.core.security import get_password_hash, verify_password, generate_tokens, decode_token
from app.models.user import User
from app.models.plan import Plan, Subscription


class AuthService:
    """Authentication service"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def signup(self, email: str, password: str, name: Optional[str] = None) -> tuple[User, dict]:
        """Register new user with email"""
        # Check if email already exists
        result = await self.db.execute(select(User).where(User.email == email))
        existing_user = result.scalar_one_or_none()
        if existing_user:
            raise ValueError("이미 등록된 이메일입니다")

        # Create user
        user = User(
            email=email,
            password_hash=get_password_hash(password),
            name=name or email.split("@")[0],
            provider="email",
            status="active",
        )
        self.db.add(user)
        await self.db.flush()

        # Create free subscription
        await self._create_free_subscription(user.id)

        await self.db.commit()
        await self.db.refresh(user)

        # Generate tokens
        tokens = generate_tokens(user.id)
        return user, tokens

    async def login(self, email: str, password: str) -> tuple[User, dict]:
        """Login with email and password"""
        result = await self.db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()

        if not user:
            raise ValueError("이메일 또는 비밀번호가 올바르지 않습니다")

        if not user.password_hash:
            raise ValueError("소셜 로그인으로 가입된 계정입니다")

        if not verify_password(password, user.password_hash):
            raise ValueError("이메일 또는 비밀번호가 올바르지 않습니다")

        if user.status != "active":
            raise ValueError("비활성화된 계정입니다")

        # Update last login
        user.last_login_at = datetime.utcnow()
        await self.db.commit()

        # Generate tokens
        tokens = generate_tokens(user.id)
        return user, tokens

    async def kakao_login(self, access_token: str) -> tuple[User, dict]:
        """Login or register with Kakao OAuth"""
        # Get Kakao user info
        kakao_user = await self._get_kakao_user_info(access_token)
        if not kakao_user:
            raise ValueError("카카오 인증에 실패했습니다")

        kakao_id = str(kakao_user.get("id"))
        kakao_account = kakao_user.get("kakao_account", {})
        profile = kakao_account.get("profile", {})

        # Check if user exists with this Kakao ID
        result = await self.db.execute(
            select(User).where(
                User.provider == "kakao",
                User.provider_id == kakao_id
            )
        )
        user = result.scalar_one_or_none()

        if user:
            # Update last login
            user.last_login_at = datetime.utcnow()
            await self.db.commit()
        else:
            # Create new user
            email = kakao_account.get("email")
            name = profile.get("nickname")

            user = User(
                email=email or f"kakao_{kakao_id}@taxaigent.kr",
                name=name or "카카오 사용자",
                provider="kakao",
                provider_id=kakao_id,
                status="active",
                email_verified_at=datetime.utcnow(),
            )
            self.db.add(user)
            await self.db.flush()

            # Create free subscription
            await self._create_free_subscription(user.id)

            await self.db.commit()
            await self.db.refresh(user)

        # Generate tokens
        tokens = generate_tokens(user.id)
        return user, tokens

    async def refresh_token(self, refresh_token: str) -> dict:
        """Refresh access token using refresh token"""
        payload = decode_token(refresh_token)
        if not payload:
            raise ValueError("유효하지 않은 토큰입니다")

        if payload.get("type") != "refresh":
            raise ValueError("리프레시 토큰이 아닙니다")

        user_id = payload.get("sub")
        if not user_id:
            raise ValueError("유효하지 않은 토큰입니다")

        # Verify user exists and is active
        result = await self.db.execute(select(User).where(User.id == int(user_id)))
        user = result.scalar_one_or_none()

        if not user or user.status != "active":
            raise ValueError("유효하지 않은 사용자입니다")

        # Generate new tokens
        tokens = generate_tokens(user.id)
        return tokens

    async def _get_kakao_user_info(self, access_token: str) -> Optional[dict]:
        """Get user info from Kakao API"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    "https://kapi.kakao.com/v2/user/me",
                    headers={"Authorization": f"Bearer {access_token}"},
                    timeout=10.0
                )
                if response.status_code == 200:
                    return response.json()
                return None
        except Exception:
            return None

    async def _create_free_subscription(self, user_id: int) -> None:
        """Create free plan subscription for new user"""
        # Get free plan
        result = await self.db.execute(select(Plan).where(Plan.code == "free"))
        free_plan = result.scalar_one_or_none()

        if free_plan:
            subscription = Subscription(
                user_id=user_id,
                plan_id=free_plan.id,
                status="active",
                started_at=datetime.utcnow(),
            )
            self.db.add(subscription)
