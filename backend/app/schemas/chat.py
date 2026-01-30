"""
Chat schemas
"""
from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    """Chat request"""
    question: str = Field(..., min_length=1, max_length=2000)
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    """Chat response"""
    answer: str
    is_deductible: Optional[bool] = None
    category_code: Optional[str] = None
    category_name: Optional[str] = None
    confidence: Optional[float] = None
    references: List[str] = []
    session_id: Optional[str] = None


class ChatHistoryItem(BaseModel):
    """Chat history item"""
    id: int
    question: str
    answer: str
    is_deductible: Optional[bool]
    category_name: Optional[str]
    confidence: Optional[float]
    channel: str
    created_at: datetime

    class Config:
        from_attributes = True


class ChatHistoryList(BaseModel):
    """Chat history list response"""
    items: List[ChatHistoryItem]
    total: int
    page: int
    size: int


class FeedbackRequest(BaseModel):
    """Chat feedback request"""
    chat_id: int
    feedback: str = Field(..., pattern="^(good|bad)$")
