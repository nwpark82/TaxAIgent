"""
Authentication schemas
"""
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class SignupRequest(BaseModel):
    """Email signup request"""
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    name: Optional[str] = Field(None, max_length=100)


class LoginRequest(BaseModel):
    """Email login request"""
    email: EmailStr
    password: str


class KakaoLoginRequest(BaseModel):
    """Kakao OAuth login request"""
    access_token: str


class RefreshTokenRequest(BaseModel):
    """Token refresh request"""
    refresh_token: str


class TokenResponse(BaseModel):
    """JWT token response"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class AuthResponse(BaseModel):
    """Authentication response with user info"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: "UserBasic"


class UserBasic(BaseModel):
    """Basic user info for auth response"""
    id: int
    email: Optional[str]
    name: Optional[str]
    provider: str

    class Config:
        from_attributes = True


# Update forward reference
AuthResponse.model_rebuild()
