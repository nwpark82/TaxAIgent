"""
User schemas
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    """Base user schema"""
    email: Optional[EmailStr] = None
    name: Optional[str] = Field(None, max_length=100)


class UserUpdate(BaseModel):
    """User profile update"""
    name: Optional[str] = Field(None, max_length=100)
    profile_image: Optional[str] = Field(None, max_length=500)
    marketing_agree: Optional[bool] = None


class BusinessInfoUpdate(BaseModel):
    """Business info update"""
    business_type: Optional[str] = Field(None, max_length=50)  # freelancer, sole_proprietor
    business_name: Optional[str] = Field(None, max_length=100)
    business_number: Optional[str] = Field(None, max_length=20)
    tax_type: Optional[str] = Field(None, max_length=20)  # general, simplified


class UserResponse(BaseModel):
    """User response"""
    id: int
    email: Optional[str]
    name: Optional[str]
    provider: str
    business_type: Optional[str]
    business_name: Optional[str]
    business_number: Optional[str]
    tax_type: Optional[str]
    profile_image: Optional[str]
    is_admin: bool
    status: str  # active, inactive, suspended
    is_verified: bool  # computed from email_verified_at
    created_at: datetime

    class Config:
        from_attributes = True


class UserWithSubscription(UserResponse):
    """User with subscription info"""
    subscription: Optional["SubscriptionInfo"] = None


class SubscriptionInfo(BaseModel):
    """Subscription info for user response"""
    plan_code: str
    plan_name: str
    status: str
    started_at: datetime
    expires_at: Optional[datetime]

    class Config:
        from_attributes = True


class UsageInfo(BaseModel):
    """Usage info for current month"""
    chat_used: int = 0
    chat_limit: int = -1  # -1 means unlimited
    expense_used: int = 0
    expense_limit: int = -1
    export_used: int = 0
    export_limit: int = -1


class UserDashboard(BaseModel):
    """User dashboard info"""
    user: UserResponse
    subscription: Optional[SubscriptionInfo]
    usage: UsageInfo


# Update forward reference
UserWithSubscription.model_rebuild()
