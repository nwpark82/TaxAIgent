"""
Expense schemas
"""
from datetime import date, datetime
from decimal import Decimal
from typing import Optional, List
from pydantic import BaseModel, Field


class ExpenseCreate(BaseModel):
    """Expense creation request"""
    date: date
    description: str = Field(..., min_length=1, max_length=200)
    amount: Decimal = Field(..., gt=0)
    vat_amount: Optional[Decimal] = Field(None, ge=0)
    category_id: Optional[int] = None
    payment_method: Optional[str] = Field(None, max_length=30)
    evidence_type: str = Field(default="none", max_length=20)
    vendor: Optional[str] = Field(None, max_length=100)
    memo: Optional[str] = None


class ExpenseUpdate(BaseModel):
    """Expense update request"""
    date: Optional[date] = None
    description: Optional[str] = Field(None, max_length=200)
    amount: Optional[Decimal] = Field(None, gt=0)
    vat_amount: Optional[Decimal] = Field(None, ge=0)
    category_id: Optional[int] = None
    payment_method: Optional[str] = Field(None, max_length=30)
    evidence_type: Optional[str] = Field(None, max_length=20)
    vendor: Optional[str] = Field(None, max_length=100)
    memo: Optional[str] = None
    is_deductible: Optional[bool] = None
    is_confirmed: Optional[bool] = None


class CategoryInfo(BaseModel):
    """Category info for expense response"""
    id: int
    code: str
    name: str
    is_deductible: bool

    class Config:
        from_attributes = True


class ExpenseResponse(BaseModel):
    """Expense response"""
    id: int
    date: date
    description: str
    amount: Decimal
    vat_amount: Optional[Decimal]
    category: Optional[CategoryInfo]
    payment_method: Optional[str]
    evidence_type: str
    vendor: Optional[str]
    memo: Optional[str]
    is_deductible: Optional[bool]
    ai_classified: bool
    ai_category: Optional[CategoryInfo]
    ai_confidence: Optional[float]
    ai_reason: Optional[str]
    is_confirmed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ExpenseList(BaseModel):
    """Expense list response"""
    items: List[ExpenseResponse]
    total: int
    page: int
    size: int
    total_amount: Decimal


class ClassifyRequest(BaseModel):
    """AI classification request"""
    description: str = Field(..., min_length=1, max_length=500)
    amount: Optional[Decimal] = None
    vendor: Optional[str] = None


class ClassifyResponse(BaseModel):
    """AI classification response"""
    category_code: str
    category_name: str
    is_deductible: bool
    confidence: float
    reason: str


class ExpenseStats(BaseModel):
    """Expense statistics"""
    total_amount: Decimal
    deductible_amount: Decimal
    non_deductible_amount: Decimal
    expense_count: int
    by_category: List[dict]
