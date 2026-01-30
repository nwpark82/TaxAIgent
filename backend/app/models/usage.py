"""
Usage model - 사용량 로그
"""
from datetime import datetime
from typing import Optional
from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class UsageLog(Base):
    """사용량 로그 테이블"""
    __tablename__ = "usage_logs"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    # Action info
    action_type: Mapped[str] = mapped_column(String(30), nullable=False)  # chat, expense, export
    channel: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    year_month: Mapped[str] = mapped_column(String(7), nullable=False, index=True)  # YYYY-MM

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="usage_logs")

    def __repr__(self):
        return f"<UsageLog(id={self.id}, action_type={self.action_type}, year_month={self.year_month})>"
