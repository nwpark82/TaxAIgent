"""
Chat model - 상담 내역
"""
from datetime import datetime
from decimal import Decimal
from typing import Optional
from sqlalchemy import String, Boolean, Integer, DateTime, Text, ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class ChatHistory(Base):
    """상담 내역 테이블"""
    __tablename__ = "chat_histories"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    session_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)

    # Chat info
    channel: Mapped[str] = mapped_column(String(20), nullable=False)  # kakao, web
    question: Mapped[str] = mapped_column(Text, nullable=False)
    answer: Mapped[str] = mapped_column(Text, nullable=False)

    # AI Response
    is_deductible: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    category_id: Mapped[Optional[int]] = mapped_column(ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    confidence: Mapped[Optional[Decimal]] = mapped_column(Numeric(3, 2), nullable=True)

    # LLM info
    llm_provider: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    llm_model: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    input_tokens: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    output_tokens: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    response_time_ms: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    # User feedback
    feedback: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)  # good, bad

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    # Relationships
    user = relationship("User", back_populates="chat_histories")
    category = relationship("Category", back_populates="chat_histories")

    def __repr__(self):
        return f"<ChatHistory(id={self.id}, channel={self.channel})>"
