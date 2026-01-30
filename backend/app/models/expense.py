"""
Expense models - 지출 내역
"""
from datetime import datetime, date
from decimal import Decimal
from typing import Optional
from sqlalchemy import String, Boolean, Integer, Date, DateTime, Text, ForeignKey, Numeric, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Expense(Base):
    """지출 테이블"""
    __tablename__ = "expenses"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    category_id: Mapped[Optional[int]] = mapped_column(ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)

    # Basic info
    date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    description: Mapped[str] = mapped_column(String(200), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    vat_amount: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 2), nullable=True)

    # Payment & Evidence
    payment_method: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)  # card, cash, transfer
    evidence_type: Mapped[str] = mapped_column(String(20), default="card", nullable=False)
    is_deductible: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    vendor: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)  # 가맹점

    # AI Classification
    ai_classified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    ai_category_id: Mapped[Optional[int]] = mapped_column(ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    ai_confidence: Mapped[Optional[Decimal]] = mapped_column(Numeric(3, 2), nullable=True)
    ai_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_confirmed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Source
    source: Mapped[str] = mapped_column(String(20), default="manual", nullable=False, index=True)
    memo: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Linked data
    linked_chat_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    # Relationships
    user = relationship("User", back_populates="expenses")
    category = relationship("Category", foreign_keys=[category_id], back_populates="expenses")
    ai_category = relationship("Category", foreign_keys=[ai_category_id])
    images = relationship("ExpenseImage", back_populates="expense", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Expense(id={self.id}, description={self.description}, amount={self.amount})>"


class ExpenseImage(Base):
    """지출 첨부 이미지 테이블"""
    __tablename__ = "expense_images"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    expense_id: Mapped[int] = mapped_column(ForeignKey("expenses.id", ondelete="CASCADE"), nullable=False, index=True)

    # Image info
    image_url: Mapped[str] = mapped_column(String(500), nullable=False)
    thumbnail_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    file_size: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    mime_type: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    # OCR result
    ocr_result: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    expense = relationship("Expense", back_populates="images")

    def __repr__(self):
        return f"<ExpenseImage(id={self.id}, expense_id={self.expense_id})>"
