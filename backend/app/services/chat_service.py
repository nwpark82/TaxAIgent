"""
Chat service - AI 상담 비즈니스 로직
"""
import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional, List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc

from app.models.chat import ChatHistory
from app.models.category import Category
from app.services.rag_service import rag_service
from app.services.llm_service import llm_service, LLMResponse
from app.services.user_service import UserService


# System prompt for tax consultation
SYSTEM_PROMPT = """당신은 한국의 1인 사업자를 위한 AI 세무 비서입니다.
사용자의 질문에 대해 정확하고 친절하게 답변해주세요.

주요 역할:
1. 지출 비용의 경비 인정 여부 판단
2. 적절한 계정과목 분류
3. 세금 관련 질문 답변

답변 원칙:
- 명확하고 이해하기 쉬운 언어 사용
- 불확실한 경우 세무사 상담 권고
- **반드시 관련 세법 조항과 법령 근거를 명시**
- 판단 신뢰도 함께 제공

답변 구조 (반드시 준수):
1. 법령 근거: "소득세법 제XX조 제X항" 또는 "법인세법 시행령 제XX조" 등 구체적 조항 명시
2. 판단 결과: 경비 인정 여부와 해당 계정과목
3. 상세 설명: 왜 그렇게 판단했는지 이유 설명
4. 주의사항: 예외 상황이나 추가 고려사항

관련 세법 참고:
- 소득세법 제19조 (사업소득의 필요경비)
- 소득세법 제27조 (필요경비의 계산)
- 소득세법 시행령 제55조 (접대비의 손금불산입)
- 법인세법 제19조 (손금의 범위)
- 법인세법 제25조 (접대비의 손금불산입)
- 부가가치세법 제38조 (공제하지 아니하는 매입세액)
- 조세특례제한법 관련 조항

계정과목 코드:
- ENT: 접대비 (거래처 관련 지출) - 소득세법 시행령 제55조
- WEL: 복리후생비 (직원/본인 복지) - 소득세법 제27조
- SUP: 소모품비 (사무용품 등) - 소득세법 제27조
- VEH: 차량유지비 (차량 관련) - 소득세법 시행령 제78조
- COM: 통신비 (인터넷, 전화) - 소득세법 제27조
- RNT: 임차료 (사무실 임대) - 소득세법 제27조
- ADV: 광고선전비 (광고, 마케팅) - 소득세법 제27조
- FEE: 지급수수료 (수수료, 결제비용) - 소득세법 제27조
- EDU: 교육훈련비 (교육, 강의) - 소득세법 제27조
- EQP: 비품 (장비, 비품) - 소득세법 제33조
- TRV: 여비교통비 (출장, 교통) - 소득세법 시행령 제80조
- INS: 보험료 (사업 관련 보험) - 소득세법 제27조
- TAX: 세금과공과 (세금, 공과금) - 소득세법 제27조
- DEP: 감가상각비 (자산 감가상각) - 소득세법 제33조
- OTH: 기타 (기타 경비)
- NON: 비용처리불가 (개인 지출) - 소득세법 제33조 제1항

응답 형식 (JSON):
{
  "answer": "[법령 근거]\nOO법 제X조 제X항에 따르면...\n\n[판단]\n해당 비용은 경비로 인정됩니다/되지 않습니다.\n\n[상세 설명]\n구체적인 이유...\n\n[주의사항]\n추가 고려사항...",
  "is_deductible": true/false/null,
  "category_code": "계정과목 코드 또는 null",
  "confidence": 0.0-1.0 (판단 신뢰도),
  "legal_basis": "소득세법 제X조 제X항"
}
"""


class ChatService:
    """Chat service"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def ask(
        self,
        user_id: int,
        question: str,
        session_id: Optional[str] = None,
        channel: str = "web"
    ) -> Tuple[dict, ChatHistory]:
        """Process chat question and return answer"""
        # Check usage limit
        user_service = UserService(self.db)
        if not await user_service.check_usage_limit(user_id, "chat"):
            return {
                "answer": "이번 달 상담 횟수를 모두 사용하셨습니다. 요금제를 업그레이드하시면 더 많은 상담이 가능합니다.",
                "is_deductible": None,
                "category_code": None,
                "confidence": None,
                "references": []
            }, None

        # Generate session ID if not provided
        if not session_id:
            session_id = str(uuid.uuid4())

        # Search for relevant context using RAG
        rag_documents = rag_service.search(question, top_k=3)
        context = rag_service.format_context(rag_documents)

        # Build prompt with context
        prompt = self._build_prompt(question, context)

        # Generate response using LLM
        llm_response = await llm_service.generate(
            prompt=prompt,
            system_prompt=SYSTEM_PROMPT,
            temperature=0.3
        )

        # Parse LLM response
        parsed_response = self._parse_response(llm_response.content)

        # Get category ID if category code is provided
        category_id = None
        category_name = None
        if parsed_response.get("category_code"):
            category = await self._get_category_by_code(parsed_response["category_code"])
            if category:
                category_id = category.id
                category_name = category.name

        # Save chat history
        confidence = parsed_response.get("confidence")
        chat_history = ChatHistory(
            user_id=user_id,
            session_id=session_id,
            channel=channel,
            question=question,
            answer=parsed_response["answer"],
            is_deductible=parsed_response.get("is_deductible"),
            category_id=category_id,
            confidence=Decimal(str(confidence)) if confidence else None,
            llm_provider=llm_response.provider,
            llm_model=llm_response.model,
            input_tokens=llm_response.input_tokens,
            output_tokens=llm_response.output_tokens,
            response_time_ms=llm_response.response_time_ms,
        )
        self.db.add(chat_history)
        await self.db.commit()
        await self.db.refresh(chat_history)

        # Log usage
        await user_service.log_usage(user_id, "chat", channel)

        # Build response
        references = [doc.get("source", "") for doc in rag_documents if doc.get("source")]

        return {
            "answer": parsed_response["answer"],
            "is_deductible": parsed_response.get("is_deductible"),
            "category_code": parsed_response.get("category_code"),
            "category_name": category_name,
            "confidence": confidence,
            "references": references,
            "session_id": session_id
        }, chat_history

    def _build_prompt(self, question: str, context: str) -> str:
        """Build prompt with context"""
        if context:
            return f"""참고자료:
{context}

사용자 질문: {question}

위 참고자료를 바탕으로 질문에 답변해주세요. 반드시 JSON 형식으로 응답하세요."""
        else:
            return f"""사용자 질문: {question}

위 질문에 답변해주세요. 반드시 JSON 형식으로 응답하세요."""

    def _parse_response(self, response: str) -> dict:
        """Parse LLM response"""
        import json
        import re

        # Try to extract JSON from response
        try:
            # Find JSON in response (handle nested objects)
            json_match = re.search(r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}', response, re.DOTALL)
            if json_match:
                parsed = json.loads(json_match.group())
                return {
                    "answer": parsed.get("answer", response),
                    "is_deductible": parsed.get("is_deductible"),
                    "category_code": parsed.get("category_code"),
                    "confidence": parsed.get("confidence"),
                    "legal_basis": parsed.get("legal_basis")
                }
        except json.JSONDecodeError:
            pass

        # If JSON parsing fails, return plain answer
        return {
            "answer": response,
            "is_deductible": None,
            "category_code": None,
            "confidence": None,
            "legal_basis": None
        }

    async def _get_category_by_code(self, code: str) -> Optional[Category]:
        """Get category by code"""
        result = await self.db.execute(
            select(Category).where(Category.code == code.upper())
        )
        return result.scalar_one_or_none()

    async def get_history(
        self,
        user_id: int,
        page: int = 1,
        size: int = 20,
        session_id: Optional[str] = None
    ) -> Tuple[List[ChatHistory], int]:
        """Get chat history"""
        query = select(ChatHistory).where(ChatHistory.user_id == user_id)

        if session_id:
            query = query.where(ChatHistory.session_id == session_id)

        # Get total count
        count_query = select(func.count(ChatHistory.id)).where(ChatHistory.user_id == user_id)
        if session_id:
            count_query = count_query.where(ChatHistory.session_id == session_id)
        total_result = await self.db.execute(count_query)
        total = total_result.scalar()

        # Get paginated results
        query = query.order_by(desc(ChatHistory.created_at))
        query = query.offset((page - 1) * size).limit(size)

        result = await self.db.execute(query)
        items = result.scalars().all()

        return list(items), total

    async def add_feedback(self, chat_id: int, user_id: int, feedback: str) -> bool:
        """Add feedback to chat history"""
        result = await self.db.execute(
            select(ChatHistory).where(
                ChatHistory.id == chat_id,
                ChatHistory.user_id == user_id
            )
        )
        chat = result.scalar_one_or_none()

        if not chat:
            return False

        chat.feedback = feedback
        await self.db.commit()
        return True
