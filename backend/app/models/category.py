"""
Category model - 계정과목
"""
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Boolean, Integer, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Category(Base):
    """계정과목 테이블"""
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String(10), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    name_en: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    parent_code: Mapped[Optional[str]] = mapped_column(String(10), nullable=True, index=True)

    # Flags
    is_deductible: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    vat_deductible: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, index=True)

    # Display
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    expenses = relationship("Expense", foreign_keys="[Expense.category_id]", back_populates="category")
    chat_histories = relationship("ChatHistory", back_populates="category")

    def __repr__(self):
        return f"<Category(code={self.code}, name={self.name})>"
