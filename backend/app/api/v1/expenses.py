"""
Expense API endpoints
"""
from datetime import date
from decimal import Decimal
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.expense import (
    ExpenseCreate,
    ExpenseUpdate,
    ExpenseResponse,
    ExpenseList,
    ClassifyRequest,
    ClassifyResponse,
    CategoryInfo,
)
from app.services.expense_service import ExpenseService

router = APIRouter(prefix="/expenses", tags=["지출 관리"])


def _expense_to_response(expense) -> ExpenseResponse:
    """Convert expense model to response"""
    category = None
    if expense.category:
        category = CategoryInfo(
            id=expense.category.id,
            code=expense.category.code,
            name=expense.category.name,
            is_deductible=expense.category.is_deductible
        )

    ai_category = None
    if expense.ai_category:
        ai_category = CategoryInfo(
            id=expense.ai_category.id,
            code=expense.ai_category.code,
            name=expense.ai_category.name,
            is_deductible=expense.ai_category.is_deductible
        )

    return ExpenseResponse(
        id=expense.id,
        date=expense.date,
        description=expense.description,
        amount=expense.amount,
        vat_amount=expense.vat_amount,
        category=category,
        payment_method=expense.payment_method,
        evidence_type=expense.evidence_type,
        vendor=expense.vendor,
        memo=expense.memo,
        is_deductible=expense.is_deductible,
        ai_classified=expense.ai_classified,
        ai_category=ai_category,
        ai_confidence=float(expense.ai_confidence) if expense.ai_confidence else None,
        ai_reason=expense.ai_reason,
        is_confirmed=expense.is_confirmed,
        created_at=expense.created_at,
        updated_at=expense.updated_at
    )


@router.post("", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
async def create_expense(
    request: ExpenseCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    지출 등록

    - **date**: 지출일
    - **description**: 내용
    - **amount**: 금액
    - **vat_amount**: 부가세 (선택)
    - **category_id**: 계정과목 ID (선택)
    - **payment_method**: 결제수단 (선택)
    - **evidence_type**: 증빙유형 (none, card, cash_receipt, tax_invoice)
    - **vendor**: 가맹점 (선택)
    - **memo**: 메모 (선택)
    """
    expense_service = ExpenseService(db)
    try:
        expense = await expense_service.create(current_user.id, request)
        return _expense_to_response(expense)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("", response_model=ExpenseList)
async def get_expenses(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    category_id: Optional[int] = None,
    is_deductible: Optional[bool] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    지출 목록 조회

    - **page**: 페이지 번호
    - **size**: 페이지 크기
    - **start_date**: 시작일 (YYYY-MM-DD)
    - **end_date**: 종료일 (YYYY-MM-DD)
    - **category_id**: 계정과목 필터
    - **is_deductible**: 경비인정 여부 필터
    """
    expense_service = ExpenseService(db)
    items, total, total_amount = await expense_service.get_list(
        user_id=current_user.id,
        page=page,
        size=size,
        start_date=start_date,
        end_date=end_date,
        category_id=category_id,
        is_deductible=is_deductible
    )

    return ExpenseList(
        items=[_expense_to_response(item) for item in items],
        total=total,
        page=page,
        size=size,
        total_amount=total_amount
    )


@router.get("/{expense_id}", response_model=ExpenseResponse)
async def get_expense(
    expense_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """지출 상세 조회"""
    expense_service = ExpenseService(db)
    expense = await expense_service.get_by_id(expense_id, current_user.id)

    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="지출 내역을 찾을 수 없습니다"
        )

    return _expense_to_response(expense)


@router.put("/{expense_id}", response_model=ExpenseResponse)
async def update_expense(
    expense_id: int,
    request: ExpenseUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """지출 수정"""
    expense_service = ExpenseService(db)
    expense = await expense_service.update(expense_id, current_user.id, request)

    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="지출 내역을 찾을 수 없습니다"
        )

    return _expense_to_response(expense)


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_expense(
    expense_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """지출 삭제"""
    expense_service = ExpenseService(db)
    success = await expense_service.delete(expense_id, current_user.id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="지출 내역을 찾을 수 없습니다"
        )


@router.post("/{expense_id}/classify", response_model=ExpenseResponse)
async def classify_expense(
    expense_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """AI 지출 분류 (기존 지출)"""
    expense_service = ExpenseService(db)
    expense = await expense_service.classify(expense_id, current_user.id)

    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="지출 내역을 찾을 수 없습니다"
        )

    return _expense_to_response(expense)


@router.post("/classify", response_model=ClassifyResponse)
async def classify_description(
    request: ClassifyRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    AI 지출 분류 (미리보기)

    지출 내용만으로 계정과목을 분류합니다. 저장하지 않고 분류 결과만 반환합니다.
    """
    expense_service = ExpenseService(db)
    result = await expense_service.classify_description(
        description=request.description,
        amount=request.amount,
        vendor=request.vendor
    )
    return ClassifyResponse(**result)
