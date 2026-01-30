"""
Authentication API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.auth import (
    SignupRequest,
    LoginRequest,
    KakaoLoginRequest,
    RefreshTokenRequest,
    TokenResponse,
    AuthResponse,
    UserBasic,
)
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["인증"])


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(request: SignupRequest, db: AsyncSession = Depends(get_db)):
    """
    이메일 회원가입

    - **email**: 이메일 주소
    - **password**: 비밀번호 (최소 8자)
    - **name**: 이름 (선택)
    """
    auth_service = AuthService(db)
    try:
        user, tokens = await auth_service.signup(
            email=request.email,
            password=request.password,
            name=request.name
        )
        return AuthResponse(
            access_token=tokens["access_token"],
            refresh_token=tokens["refresh_token"],
            token_type=tokens["token_type"],
            user=UserBasic.model_validate(user)
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest, db: AsyncSession = Depends(get_db)):
    """
    이메일 로그인

    - **email**: 이메일 주소
    - **password**: 비밀번호
    """
    auth_service = AuthService(db)
    try:
        user, tokens = await auth_service.login(
            email=request.email,
            password=request.password
        )
        return AuthResponse(
            access_token=tokens["access_token"],
            refresh_token=tokens["refresh_token"],
            token_type=tokens["token_type"],
            user=UserBasic.model_validate(user)
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@router.post("/kakao", response_model=AuthResponse)
async def kakao_login(request: KakaoLoginRequest, db: AsyncSession = Depends(get_db)):
    """
    카카오 로그인

    - **access_token**: 카카오 액세스 토큰
    """
    auth_service = AuthService(db)
    try:
        user, tokens = await auth_service.kakao_login(access_token=request.access_token)
        return AuthResponse(
            access_token=tokens["access_token"],
            refresh_token=tokens["refresh_token"],
            token_type=tokens["token_type"],
            user=UserBasic.model_validate(user)
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(request: RefreshTokenRequest, db: AsyncSession = Depends(get_db)):
    """
    토큰 갱신

    - **refresh_token**: 리프레시 토큰
    """
    auth_service = AuthService(db)
    try:
        tokens = await auth_service.refresh_token(refresh_token=request.refresh_token)
        return TokenResponse(**tokens)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
