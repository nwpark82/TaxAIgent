"""
Ledger and Dashboard schemas
"""
from datetime import date
from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel


class LedgerEntry(BaseModel):
    """간편장부 항목"""
    date: date
    description: str
    income: Decimal
    expense: Decimal
    category_name: Optional[str]
    evidence_type: str
    is_deductible: Optional[bool]


class LedgerResponse(BaseModel):
    """간편장부 응답"""
    entries: List[LedgerEntry]
    summary: "LedgerSummary"
    period: "PeriodInfo"


class LedgerSummary(BaseModel):
    """장부 요약"""
    total_income: Decimal
    total_expense: Decimal
    deductible_expense: Decimal
    non_deductible_expense: Decimal
    net_income: Decimal
    estimated_tax: Decimal


class PeriodInfo(BaseModel):
    """기간 정보"""
    start_date: date
    end_date: date
    year: int
    month: Optional[int] = None


class CategoryStats(BaseModel):
    """계정과목별 통계"""
    category_code: str
    category_name: str
    amount: Decimal
    count: int
    percentage: float


class MonthlyStats(BaseModel):
    """월별 통계"""
    year: int
    month: int
    income: Decimal
    expense: Decimal
    deductible: Decimal
    net: Decimal


class DashboardResponse(BaseModel):
    """대시보드 응답"""
    current_month: "CurrentMonthSummary"
    ytd: "YearToDateSummary"
    expense_by_category: List[CategoryStats]
    monthly_trend: List[MonthlyStats]


class CurrentMonthSummary(BaseModel):
    """이번 달 요약"""
    income: Decimal
    expense: Decimal
    deductible: Decimal
    net: Decimal
    expense_count: int


class YearToDateSummary(BaseModel):
    """연간 누계"""
    income: Decimal
    expense: Decimal
    deductible: Decimal
    estimated_tax: Decimal


class ExportRequest(BaseModel):
    """내보내기 요청"""
    format: str = "excel"  # excel, pdf
    start_date: date
    end_date: date


# Update forward references
LedgerResponse.model_rebuild()
DashboardResponse.model_rebuild()
