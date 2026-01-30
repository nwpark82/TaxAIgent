"""
Expense service - 지출 관리 비즈니스 로직
"""
from datetime import date, datetime
from decimal import Decimal
from typing import Optional, List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, and_
from sqlalchemy.orm import selectinload

from app.models.expense import Expense
from app.models.category import Category
from app.schemas.expense import ExpenseCreate, ExpenseUpdate
from app.services.classifier_service import classifier_service
from app.services.user_service import UserService


class ExpenseService:
    """Expense service"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, user_id: int, data: ExpenseCreate) -> Expense:
        """Create new expense"""
        # Check usage limit
        user_service = UserService(self.db)
        if not await user_service.check_usage_limit(user_id, "expense"):
            raise ValueError("이번 달 지출 등록 횟수를 모두 사용하셨습니다")

        expense = Expense(
            user_id=user_id,
            date=data.date,
            description=data.description,
            amount=data.amount,
            vat_amount=data.vat_amount,
            category_id=data.category_id,
            payment_method=data.payment_method,
            evidence_type=data.evidence_type,
            vendor=data.vendor,
            memo=data.memo,
        )

        # If category is set, determine is_deductible from category
        if data.category_id:
            category = await self._get_category(data.category_id)
            if category:
                expense.is_deductible = category.is_deductible

        self.db.add(expense)
        await self.db.commit()
        await self.db.refresh(expense)

        # Log usage
        await user_service.log_usage(user_id, "expense")

        # Load relationships
        return await self.get_by_id(expense.id, user_id)

    async def get_by_id(self, expense_id: int, user_id: int) -> Optional[Expense]:
        """Get expense by ID"""
        result = await self.db.execute(
            select(Expense)
            .options(
                selectinload(Expense.category),
                selectinload(Expense.ai_category)
            )
            .where(Expense.id == expense_id, Expense.user_id == user_id)
        )
        return result.scalar_one_or_none()

    async def get_list(
        self,
        user_id: int,
        page: int = 1,
        size: int = 20,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        category_id: Optional[int] = None,
        is_deductible: Optional[bool] = None
    ) -> Tuple[List[Expense], int, Decimal]:
        """Get expense list with filters"""
        # Base query
        query = select(Expense).where(Expense.user_id == user_id)

        # Apply filters
        if start_date:
            query = query.where(Expense.date >= start_date)
        if end_date:
            query = query.where(Expense.date <= end_date)
        if category_id:
            query = query.where(Expense.category_id == category_id)
        if is_deductible is not None:
            query = query.where(Expense.is_deductible == is_deductible)

        # Get total count
        count_query = select(func.count(Expense.id)).where(Expense.user_id == user_id)
        if start_date:
            count_query = count_query.where(Expense.date >= start_date)
        if end_date:
            count_query = count_query.where(Expense.date <= end_date)
        if category_id:
            count_query = count_query.where(Expense.category_id == category_id)
        if is_deductible is not None:
            count_query = count_query.where(Expense.is_deductible == is_deductible)

        total_result = await self.db.execute(count_query)
        total = total_result.scalar()

        # Get total amount
        sum_query = select(func.sum(Expense.amount)).where(Expense.user_id == user_id)
        if start_date:
            sum_query = sum_query.where(Expense.date >= start_date)
        if end_date:
            sum_query = sum_query.where(Expense.date <= end_date)
        if category_id:
            sum_query = sum_query.where(Expense.category_id == category_id)
        if is_deductible is not None:
            sum_query = sum_query.where(Expense.is_deductible == is_deductible)

        sum_result = await self.db.execute(sum_query)
        total_amount = sum_result.scalar() or Decimal("0")

        # Get paginated results
        query = query.options(
            selectinload(Expense.category),
            selectinload(Expense.ai_category)
        )
        query = query.order_by(desc(Expense.date), desc(Expense.id))
        query = query.offset((page - 1) * size).limit(size)

        result = await self.db.execute(query)
        items = result.scalars().all()

        return list(items), total, total_amount

    async def update(self, expense_id: int, user_id: int, data: ExpenseUpdate) -> Optional[Expense]:
        """Update expense"""
        expense = await self.get_by_id(expense_id, user_id)
        if not expense:
            return None

        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(expense, field, value)

        # If category is updated, update is_deductible
        if data.category_id:
            category = await self._get_category(data.category_id)
            if category and data.is_deductible is None:
                expense.is_deductible = category.is_deductible

        expense.updated_at = datetime.utcnow()
        await self.db.commit()
        return await self.get_by_id(expense_id, user_id)

    async def delete(self, expense_id: int, user_id: int) -> bool:
        """Delete expense"""
        expense = await self.get_by_id(expense_id, user_id)
        if not expense:
            return False

        await self.db.delete(expense)
        await self.db.commit()
        return True

    async def classify(self, expense_id: int, user_id: int) -> Optional[Expense]:
        """Classify expense using AI"""
        expense = await self.get_by_id(expense_id, user_id)
        if not expense:
            return None

        # Get classification
        result = await classifier_service.classify(
            description=expense.description,
            amount=expense.amount,
            vendor=expense.vendor
        )

        # Get category by code
        category = await self._get_category_by_code(result.category_code)

        # Update expense with AI classification
        expense.ai_classified = True
        expense.ai_category_id = category.id if category else None
        expense.ai_confidence = Decimal(str(result.confidence))
        expense.ai_reason = result.reason

        # If not manually set, apply AI classification
        if not expense.is_confirmed and not expense.category_id:
            expense.category_id = category.id if category else None
            expense.is_deductible = result.is_deductible

        expense.updated_at = datetime.utcnow()
        await self.db.commit()
        return await self.get_by_id(expense_id, user_id)

    async def classify_description(
        self,
        description: str,
        amount: Optional[Decimal] = None,
        vendor: Optional[str] = None
    ) -> dict:
        """Classify expense description without saving"""
        result = await classifier_service.classify(
            description=description,
            amount=amount,
            vendor=vendor
        )
        return {
            "category_code": result.category_code,
            "category_name": result.category_name,
            "is_deductible": result.is_deductible,
            "confidence": result.confidence,
            "reason": result.reason
        }

    async def _get_category(self, category_id: int) -> Optional[Category]:
        """Get category by ID"""
        result = await self.db.execute(
            select(Category).where(Category.id == category_id)
        )
        return result.scalar_one_or_none()

    async def _get_category_by_code(self, code: str) -> Optional[Category]:
        """Get category by code"""
        result = await self.db.execute(
            select(Category).where(Category.code == code.upper())
        )
        return result.scalar_one_or_none()
