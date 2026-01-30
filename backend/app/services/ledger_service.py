"""
Ledger service - 장부/통계 비즈니스 로직
"""
from datetime import date, datetime
from decimal import Decimal
from typing import List, Tuple, Optional
from calendar import monthrange
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, extract
from sqlalchemy.orm import selectinload

from app.models.expense import Expense
from app.models.income import IncomeRecord
from app.models.category import Category
from app.schemas.ledger import (
    LedgerEntry, LedgerSummary, PeriodInfo,
    CategoryStats, MonthlyStats,
    CurrentMonthSummary, YearToDateSummary
)


class LedgerService:
    """Ledger service"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_ledger(
        self,
        user_id: int,
        start_date: date,
        end_date: date
    ) -> Tuple[List[LedgerEntry], LedgerSummary, PeriodInfo]:
        """Get ledger entries for period"""
        entries = []

        # Get expenses
        expense_query = (
            select(Expense)
            .options(selectinload(Expense.category))
            .where(
                Expense.user_id == user_id,
                Expense.date >= start_date,
                Expense.date <= end_date
            )
            .order_by(Expense.date)
        )
        expense_result = await self.db.execute(expense_query)
        expenses = expense_result.scalars().all()

        for exp in expenses:
            entries.append(LedgerEntry(
                date=exp.date,
                description=exp.description,
                income=Decimal("0"),
                expense=exp.amount,
                category_name=exp.category.name if exp.category else None,
                evidence_type=exp.evidence_type,
                is_deductible=exp.is_deductible
            ))

        # Get income
        income_query = (
            select(IncomeRecord)
            .where(
                IncomeRecord.user_id == user_id,
                IncomeRecord.date >= start_date,
                IncomeRecord.date <= end_date
            )
            .order_by(IncomeRecord.date)
        )
        income_result = await self.db.execute(income_query)
        incomes = income_result.scalars().all()

        for inc in incomes:
            entries.append(LedgerEntry(
                date=inc.date,
                description=inc.description,
                income=inc.amount,
                expense=Decimal("0"),
                category_name="매출",
                evidence_type=inc.evidence_type,
                is_deductible=None
            ))

        # Sort by date
        entries.sort(key=lambda x: x.date)

        # Calculate summary
        total_income = sum(e.income for e in entries)
        total_expense = sum(e.expense for e in entries)
        deductible_expense = sum(e.expense for e in entries if e.is_deductible is True)
        non_deductible_expense = sum(e.expense for e in entries if e.is_deductible is False)
        net_income = total_income - deductible_expense

        # Simple tax estimation (simplified for MVP)
        estimated_tax = self._estimate_tax(net_income)

        summary = LedgerSummary(
            total_income=total_income,
            total_expense=total_expense,
            deductible_expense=deductible_expense,
            non_deductible_expense=non_deductible_expense,
            net_income=net_income,
            estimated_tax=estimated_tax
        )

        period = PeriodInfo(
            start_date=start_date,
            end_date=end_date,
            year=start_date.year,
            month=start_date.month if start_date.month == end_date.month else None
        )

        return entries, summary, period

    async def get_dashboard(self, user_id: int) -> dict:
        """Get dashboard data"""
        today = date.today()
        year = today.year
        month = today.month

        # Current month dates
        month_start = date(year, month, 1)
        month_end = date(year, month, monthrange(year, month)[1])

        # Year start
        year_start = date(year, 1, 1)

        # Current month summary
        current_month = await self._get_month_summary(user_id, month_start, month_end)

        # YTD summary
        ytd = await self._get_ytd_summary(user_id, year_start, today)

        # Expense by category (current month)
        category_stats = await self._get_category_stats(user_id, month_start, month_end)

        # Monthly trend (last 6 months)
        monthly_trend = await self._get_monthly_trend(user_id, 6)

        return {
            "current_month": current_month,
            "ytd": ytd,
            "expense_by_category": category_stats,
            "monthly_trend": monthly_trend
        }

    async def _get_month_summary(
        self,
        user_id: int,
        start_date: date,
        end_date: date
    ) -> CurrentMonthSummary:
        """Get current month summary"""
        # Income
        income_result = await self.db.execute(
            select(func.coalesce(func.sum(IncomeRecord.amount), 0))
            .where(
                IncomeRecord.user_id == user_id,
                IncomeRecord.date >= start_date,
                IncomeRecord.date <= end_date
            )
        )
        income = income_result.scalar() or Decimal("0")

        # Expenses
        expense_query = (
            select(
                func.coalesce(func.sum(Expense.amount), 0),
                func.count(Expense.id)
            )
            .where(
                Expense.user_id == user_id,
                Expense.date >= start_date,
                Expense.date <= end_date
            )
        )
        expense_result = await self.db.execute(expense_query)
        expense_row = expense_result.one()
        expense = expense_row[0] or Decimal("0")
        expense_count = expense_row[1] or 0

        # Deductible
        deductible_result = await self.db.execute(
            select(func.coalesce(func.sum(Expense.amount), 0))
            .where(
                Expense.user_id == user_id,
                Expense.date >= start_date,
                Expense.date <= end_date,
                Expense.is_deductible == True
            )
        )
        deductible = deductible_result.scalar() or Decimal("0")

        return CurrentMonthSummary(
            income=income,
            expense=expense,
            deductible=deductible,
            net=income - deductible,
            expense_count=expense_count
        )

    async def _get_ytd_summary(
        self,
        user_id: int,
        start_date: date,
        end_date: date
    ) -> YearToDateSummary:
        """Get year-to-date summary"""
        # Income
        income_result = await self.db.execute(
            select(func.coalesce(func.sum(IncomeRecord.amount), 0))
            .where(
                IncomeRecord.user_id == user_id,
                IncomeRecord.date >= start_date,
                IncomeRecord.date <= end_date
            )
        )
        income = income_result.scalar() or Decimal("0")

        # Expenses
        expense_result = await self.db.execute(
            select(func.coalesce(func.sum(Expense.amount), 0))
            .where(
                Expense.user_id == user_id,
                Expense.date >= start_date,
                Expense.date <= end_date
            )
        )
        expense = expense_result.scalar() or Decimal("0")

        # Deductible
        deductible_result = await self.db.execute(
            select(func.coalesce(func.sum(Expense.amount), 0))
            .where(
                Expense.user_id == user_id,
                Expense.date >= start_date,
                Expense.date <= end_date,
                Expense.is_deductible == True
            )
        )
        deductible = deductible_result.scalar() or Decimal("0")

        net_income = income - deductible
        estimated_tax = self._estimate_tax(net_income)

        return YearToDateSummary(
            income=income,
            expense=expense,
            deductible=deductible,
            estimated_tax=estimated_tax
        )

    async def _get_category_stats(
        self,
        user_id: int,
        start_date: date,
        end_date: date
    ) -> List[CategoryStats]:
        """Get expense stats by category"""
        result = await self.db.execute(
            select(
                Category.code,
                Category.name,
                func.sum(Expense.amount),
                func.count(Expense.id)
            )
            .join(Expense.category)
            .where(
                Expense.user_id == user_id,
                Expense.date >= start_date,
                Expense.date <= end_date
            )
            .group_by(Category.id, Category.code, Category.name)
            .order_by(func.sum(Expense.amount).desc())
        )
        rows = result.all()

        total = sum(row[2] or 0 for row in rows)
        stats = []
        for row in rows:
            amount = row[2] or Decimal("0")
            stats.append(CategoryStats(
                category_code=row[0],
                category_name=row[1],
                amount=amount,
                count=row[3] or 0,
                percentage=float(amount / total * 100) if total > 0 else 0
            ))

        return stats

    async def _get_monthly_trend(self, user_id: int, months: int) -> List[MonthlyStats]:
        """Get monthly trend for last N months"""
        today = date.today()
        trends = []

        for i in range(months - 1, -1, -1):
            # Calculate month
            year = today.year
            month = today.month - i
            while month <= 0:
                month += 12
                year -= 1

            month_start = date(year, month, 1)
            month_end = date(year, month, monthrange(year, month)[1])

            # Income
            income_result = await self.db.execute(
                select(func.coalesce(func.sum(IncomeRecord.amount), 0))
                .where(
                    IncomeRecord.user_id == user_id,
                    IncomeRecord.date >= month_start,
                    IncomeRecord.date <= month_end
                )
            )
            income = income_result.scalar() or Decimal("0")

            # Expense
            expense_result = await self.db.execute(
                select(func.coalesce(func.sum(Expense.amount), 0))
                .where(
                    Expense.user_id == user_id,
                    Expense.date >= month_start,
                    Expense.date <= month_end
                )
            )
            expense = expense_result.scalar() or Decimal("0")

            # Deductible
            deductible_result = await self.db.execute(
                select(func.coalesce(func.sum(Expense.amount), 0))
                .where(
                    Expense.user_id == user_id,
                    Expense.date >= month_start,
                    Expense.date <= month_end,
                    Expense.is_deductible == True
                )
            )
            deductible = deductible_result.scalar() or Decimal("0")

            trends.append(MonthlyStats(
                year=year,
                month=month,
                income=income,
                expense=expense,
                deductible=deductible,
                net=income - deductible
            ))

        return trends

    def _estimate_tax(self, net_income: Decimal) -> Decimal:
        """Estimate income tax (simplified Korean tax brackets)"""
        if net_income <= 0:
            return Decimal("0")

        income = float(net_income)

        # 2024 Korean income tax brackets (simplified)
        brackets = [
            (14000000, 0.06),
            (50000000, 0.15),
            (88000000, 0.24),
            (150000000, 0.35),
            (300000000, 0.38),
            (500000000, 0.40),
            (1000000000, 0.42),
            (float('inf'), 0.45)
        ]

        tax = 0
        prev_limit = 0
        for limit, rate in brackets:
            if income <= limit:
                tax += (income - prev_limit) * rate
                break
            else:
                tax += (limit - prev_limit) * rate
                prev_limit = limit

        return Decimal(str(int(tax)))
