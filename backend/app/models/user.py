"""
User model - 사용자 정보
"""
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Boolean, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class User(Base):
    """사용자 테이블"""
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)

    # OAuth
    provider: Mapped[str] = mapped_column(String(20), default="email", nullable=False)
    provider_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # Business info
    business_type: Mapped[Optional[str]] = mapped_column(String(50), nullable=True, index=True)
    business_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    business_number: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    tax_type: Mapped[str] = mapped_column(String(20), default="general", nullable=True)

    # Profile
    profile_image: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    marketing_agree: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Role & Status
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="active", nullable=False, index=True)
    email_verified_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    last_login_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    # Relationships
    expenses = relationship("Expense", back_populates="user", cascade="all, delete-orphan")
    income_records = relationship("IncomeRecord", back_populates="user", cascade="all, delete-orphan")
    chat_histories = relationship("ChatHistory", back_populates="user", cascade="all, delete-orphan")
    subscription = relationship("Subscription", back_populates="user", uselist=False)
    usage_logs = relationship("UsageLog", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    notification_setting = relationship("NotificationSetting", back_populates="user", uselist=False)

    @property
    def is_verified(self) -> bool:
        """이메일 인증 여부"""
        return self.email_verified_at is not None

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email})>"
