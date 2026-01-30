"""
Chat API endpoints
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.chat import (
    ChatRequest,
    ChatResponse,
    ChatHistoryItem,
    ChatHistoryList,
    FeedbackRequest,
)
from app.services.chat_service import ChatService

router = APIRouter(prefix="/chat", tags=["AI 상담"])


@router.post("/ask", response_model=ChatResponse)
async def ask_question(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    AI 세무 상담

    비용처리 가능 여부, 계정과목 분류 등 세무 관련 질문에 답변합니다.

    - **question**: 질문 내용 (최대 2000자)
    - **session_id**: 세션 ID (선택, 대화 연속성 유지용)
    """
    chat_service = ChatService(db)
    response, _ = await chat_service.ask(
        user_id=current_user.id,
        question=request.question,
        session_id=request.session_id,
        channel="web"
    )
    return ChatResponse(**response)


@router.get("/history", response_model=ChatHistoryList)
async def get_chat_history(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    session_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    상담 내역 조회

    - **page**: 페이지 번호 (기본값: 1)
    - **size**: 페이지 크기 (기본값: 20, 최대: 100)
    - **session_id**: 특정 세션의 대화만 조회 (선택)
    """
    chat_service = ChatService(db)
    items, total = await chat_service.get_history(
        user_id=current_user.id,
        page=page,
        size=size,
        session_id=session_id
    )

    # Convert to response items
    history_items = []
    for item in items:
        category_name = None
        if item.category:
            category_name = item.category.name

        history_items.append(ChatHistoryItem(
            id=item.id,
            question=item.question,
            answer=item.answer,
            is_deductible=item.is_deductible,
            category_name=category_name,
            confidence=float(item.confidence) if item.confidence else None,
            channel=item.channel,
            created_at=item.created_at
        ))

    return ChatHistoryList(
        items=history_items,
        total=total,
        page=page,
        size=size
    )


@router.post("/feedback")
async def add_feedback(
    request: FeedbackRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    상담 피드백 추가

    - **chat_id**: 상담 ID
    - **feedback**: 피드백 (good/bad)
    """
    chat_service = ChatService(db)
    success = await chat_service.add_feedback(
        chat_id=request.chat_id,
        user_id=current_user.id,
        feedback=request.feedback
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="상담 내역을 찾을 수 없습니다"
        )

    return {"message": "피드백이 등록되었습니다"}
