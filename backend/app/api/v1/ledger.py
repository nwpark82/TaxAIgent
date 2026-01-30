"""
Ledger and Dashboard API endpoints
"""
from datetime import date
from calendar import monthrange
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
import io

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.ledger import (
    LedgerResponse, DashboardResponse, ExportRequest
)
from app.services.ledger_service import LedgerService
from app.services.user_service import UserService

router = APIRouter(tags=["장부/통계"])


@router.get("/ledger", response_model=LedgerResponse)
async def get_ledger(
    year: int = Query(..., ge=2020, le=2100),
    month: Optional[int] = Query(None, ge=1, le=12),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    간편장부 조회

    - **year**: 연도
    - **month**: 월 (선택, 없으면 연간)
    """
    ledger_service = LedgerService(db)

    if month:
        start_date = date(year, month, 1)
        end_date = date(year, month, monthrange(year, month)[1])
    else:
        start_date = date(year, 1, 1)
        end_date = date(year, 12, 31)

    entries, summary, period = await ledger_service.get_ledger(
        user_id=current_user.id,
        start_date=start_date,
        end_date=end_date
    )

    return LedgerResponse(
        entries=entries,
        summary=summary,
        period=period
    )


@router.get("/ledger/export")
async def export_ledger(
    year: int = Query(..., ge=2020, le=2100),
    month: Optional[int] = Query(None, ge=1, le=12),
    format: str = Query("excel", pattern="^(excel|csv)$"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    장부 내보내기

    - **year**: 연도
    - **month**: 월 (선택)
    - **format**: 파일 형식 (excel, csv)
    """
    # Check usage limit
    user_service = UserService(db)
    if not await user_service.check_usage_limit(current_user.id, "export"):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="이번 달 내보내기 횟수를 모두 사용하셨습니다"
        )

    ledger_service = LedgerService(db)

    if month:
        start_date = date(year, month, 1)
        end_date = date(year, month, monthrange(year, month)[1])
        filename = f"ledger_{year}_{month:02d}"
    else:
        start_date = date(year, 1, 1)
        end_date = date(year, 12, 31)
        filename = f"ledger_{year}"

    entries, summary, _ = await ledger_service.get_ledger(
        user_id=current_user.id,
        start_date=start_date,
        end_date=end_date
    )

    if format == "csv":
        # Generate CSV
        output = io.StringIO()
        output.write("날짜,내용,수입,지출,계정과목,증빙유형,경비인정\n")
        for entry in entries:
            deductible = "O" if entry.is_deductible else ("X" if entry.is_deductible is False else "-")
            output.write(f"{entry.date},{entry.description},{entry.income},{entry.expense},{entry.category_name or ''},{entry.evidence_type},{deductible}\n")

        output.write(f"\n요약\n")
        output.write(f"총 수입,{summary.total_income}\n")
        output.write(f"총 지출,{summary.total_expense}\n")
        output.write(f"경비인정액,{summary.deductible_expense}\n")
        output.write(f"순이익,{summary.net_income}\n")
        output.write(f"예상세금,{summary.estimated_tax}\n")

        content = output.getvalue().encode('utf-8-sig')
        media_type = "text/csv"
        filename = f"{filename}.csv"

    else:
        # Generate Excel using openpyxl if available, otherwise fallback to CSV
        try:
            from openpyxl import Workbook
            from openpyxl.utils.dataframe import dataframe_to_rows

            wb = Workbook()
            ws = wb.active
            ws.title = "간편장부"

            # Headers
            ws.append(["날짜", "내용", "수입", "지출", "계정과목", "증빙유형", "경비인정"])

            # Data
            for entry in entries:
                deductible = "O" if entry.is_deductible else ("X" if entry.is_deductible is False else "-")
                ws.append([
                    str(entry.date),
                    entry.description,
                    float(entry.income),
                    float(entry.expense),
                    entry.category_name or "",
                    entry.evidence_type,
                    deductible
                ])

            # Summary
            ws.append([])
            ws.append(["요약"])
            ws.append(["총 수입", float(summary.total_income)])
            ws.append(["총 지출", float(summary.total_expense)])
            ws.append(["경비인정액", float(summary.deductible_expense)])
            ws.append(["순이익", float(summary.net_income)])
            ws.append(["예상세금", float(summary.estimated_tax)])

            output = io.BytesIO()
            wb.save(output)
            content = output.getvalue()
            media_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            filename = f"{filename}.xlsx"

        except ImportError:
            # Fallback to CSV if openpyxl not available
            return await export_ledger(year, month, "csv", current_user, db)

    # Log usage
    await user_service.log_usage(current_user.id, "export")

    return StreamingResponse(
        io.BytesIO(content),
        media_type=media_type,
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@router.get("/dashboard", response_model=DashboardResponse)
async def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    대시보드 데이터 조회

    이번 달 요약, 연간 누계, 카테고리별 지출, 월별 추이를 반환합니다.
    """
    ledger_service = LedgerService(db)
    data = await ledger_service.get_dashboard(current_user.id)
    return DashboardResponse(**data)


@router.get("/categories")
async def get_categories(db: AsyncSession = Depends(get_db)):
    """
    계정과목 목록 조회

    지출 분류에 사용할 수 있는 계정과목 목록을 반환합니다.
    """
    from sqlalchemy import select
    from app.models.category import Category

    result = await db.execute(
        select(Category).order_by(Category.sort_order)
    )
    categories = result.scalars().all()

    return [
        {
            "id": cat.id,
            "code": cat.code,
            "name": cat.name,
            "name_en": cat.name_en,
            "description": cat.description,
            "is_deductible": cat.is_deductible
        }
        for cat in categories
    ]
