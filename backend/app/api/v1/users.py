"""
User API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.user import (
    UserResponse,
    UserUpdate,
    BusinessInfoUpdate,
    UserWithSubscription,
    UserDashboard,
    SubscriptionInfo,
    UsageInfo,
)
from app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["사용자"])


@router.get("/me", response_model=UserWithSubscription)
async def get_me(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    내 정보 조회

    현재 로그인한 사용자의 정보와 구독 정보를 반환합니다.
    """
    user_service = UserService(db)
    user = await user_service.get_user_with_subscription(current_user.id)

    subscription_info = None
    if user.subscription:
        subscription_info = SubscriptionInfo(
            plan_code=user.subscription.plan.code,
            plan_name=user.subscription.plan.name,
            status=user.subscription.status,
            started_at=user.subscription.started_at,
            expires_at=user.subscription.expires_at
        )

    return UserWithSubscription(
        id=user.id,
        email=user.email,
        name=user.name,
        provider=user.provider,
        business_type=user.business_type,
        business_name=user.business_name,
        business_number=user.business_number,
        tax_type=user.tax_type,
        profile_image=user.profile_image,
        is_admin=user.is_admin,
        status=user.status,
        is_verified=user.email_verified_at is not None,
        created_at=user.created_at,
        subscription=subscription_info
    )


@router.put("/me", response_model=UserResponse)
async def update_me(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    프로필 수정

    - **name**: 이름
    - **profile_image**: 프로필 이미지 URL
    - **marketing_agree**: 마케팅 수신 동의
    """
    user_service = UserService(db)
    user = await user_service.update_profile(current_user, data)
    return UserResponse.model_validate(user)


@router.put("/me/business", response_model=UserResponse)
async def update_business_info(
    data: BusinessInfoUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    사업자 정보 수정

    - **business_type**: 사업자 유형 (freelancer, sole_proprietor)
    - **business_name**: 상호명
    - **business_number**: 사업자등록번호
    - **tax_type**: 세금 유형 (general, simplified)
    """
    user_service = UserService(db)
    user = await user_service.update_business_info(current_user, data)
    return UserResponse.model_validate(user)


@router.get("/me/dashboard", response_model=UserDashboard)
async def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    대시보드 정보 조회

    사용자 정보, 구독 정보, 이번 달 사용량을 반환합니다.
    """
    user_service = UserService(db)
    user = await user_service.get_user_with_subscription(current_user.id)
    subscription_info = await user_service.get_subscription_info(current_user.id)
    usage_info = await user_service.get_usage_info(current_user.id)

    return UserDashboard(
        user=UserResponse.model_validate(user),
        subscription=subscription_info,
        usage=usage_info
    )


@router.get("/me/usage", response_model=UsageInfo)
async def get_usage(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    이번 달 사용량 조회
    """
    user_service = UserService(db)
    return await user_service.get_usage_info(current_user.id)
