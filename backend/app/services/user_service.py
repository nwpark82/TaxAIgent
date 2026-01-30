"""
User service - 사용자 비즈니스 로직
"""
from datetime import datetime
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from app.models.user import User
from app.models.plan import Plan, Subscription
from app.models.usage import UsageLog
from app.schemas.user import UserUpdate, BusinessInfoUpdate, SubscriptionInfo, UsageInfo


class UserService:
    """User service"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user_with_subscription(self, user_id: int) -> Optional[User]:
        """Get user with subscription and plan info"""
        result = await self.db.execute(
            select(User)
            .options(selectinload(User.subscription).selectinload(Subscription.plan))
            .where(User.id == user_id)
        )
        return result.scalar_one_or_none()

    async def update_profile(self, user: User, data: UserUpdate) -> User:
        """Update user profile"""
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)
        user.updated_at = datetime.utcnow()
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def update_business_info(self, user: User, data: BusinessInfoUpdate) -> User:
        """Update business info"""
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)
        user.updated_at = datetime.utcnow()
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def get_subscription_info(self, user_id: int) -> Optional[SubscriptionInfo]:
        """Get user subscription info"""
        result = await self.db.execute(
            select(Subscription)
            .options(selectinload(Subscription.plan))
            .where(Subscription.user_id == user_id)
        )
        subscription = result.scalar_one_or_none()

        if not subscription:
            return None

        return SubscriptionInfo(
            plan_code=subscription.plan.code,
            plan_name=subscription.plan.name,
            status=subscription.status,
            started_at=subscription.started_at,
            expires_at=subscription.expires_at
        )

    async def get_usage_info(self, user_id: int) -> UsageInfo:
        """Get current month usage info"""
        year_month = datetime.utcnow().strftime("%Y-%m")

        # Get usage counts by action type
        result = await self.db.execute(
            select(UsageLog.action_type, func.count(UsageLog.id))
            .where(UsageLog.user_id == user_id, UsageLog.year_month == year_month)
            .group_by(UsageLog.action_type)
        )
        usage_counts = {row[0]: row[1] for row in result.all()}

        # Get user's plan limits
        sub_result = await self.db.execute(
            select(Subscription)
            .options(selectinload(Subscription.plan))
            .where(Subscription.user_id == user_id)
        )
        subscription = sub_result.scalar_one_or_none()

        limits = {}
        if subscription and subscription.plan and subscription.plan.limits:
            limits = subscription.plan.limits

        return UsageInfo(
            chat_used=usage_counts.get("chat", 0),
            chat_limit=limits.get("chat_monthly", -1),
            expense_used=usage_counts.get("expense", 0),
            expense_limit=limits.get("expense_monthly", -1),
            export_used=usage_counts.get("export", 0),
            export_limit=limits.get("export_monthly", -1),
        )

    async def log_usage(self, user_id: int, action_type: str, channel: Optional[str] = None) -> None:
        """Log usage action"""
        year_month = datetime.utcnow().strftime("%Y-%m")
        usage_log = UsageLog(
            user_id=user_id,
            action_type=action_type,
            channel=channel,
            year_month=year_month
        )
        self.db.add(usage_log)
        await self.db.commit()

    async def check_usage_limit(self, user_id: int, action_type: str) -> bool:
        """Check if user has remaining usage for action type"""
        usage_info = await self.get_usage_info(user_id)

        if action_type == "chat":
            if usage_info.chat_limit == -1:
                return True
            return usage_info.chat_used < usage_info.chat_limit
        elif action_type == "expense":
            if usage_info.expense_limit == -1:
                return True
            return usage_info.expense_used < usage_info.expense_limit
        elif action_type == "export":
            if usage_info.export_limit == -1:
                return True
            return usage_info.export_used < usage_info.export_limit

        return True
