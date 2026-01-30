"""
Classifier service - AI 지출 분류
"""
from typing import Optional
from decimal import Decimal
from dataclasses import dataclass

from app.services.llm_service import llm_service


@dataclass
class ClassificationResult:
    """Classification result"""
    category_code: str
    category_name: str
    is_deductible: bool
    confidence: float
    reason: str


CLASSIFICATION_PROMPT = """당신은 한국의 세무 전문가입니다. 아래 지출 내역을 분석하여 적절한 계정과목으로 분류해주세요.

계정과목 목록:
- ENT: 접대비 (거래처 식사, 선물 등)
- WEL: 복리후생비 (직원/본인 식사, 건강검진 등)
- SUP: 소모품비 (사무용품, 소모성 물품)
- VEH: 차량유지비 (주유, 수리, 보험 등)
- COM: 통신비 (전화, 인터넷, 우편)
- RNT: 임차료 (사무실, 장비 임대)
- ADV: 광고선전비 (광고, 마케팅, 판촉)
- FEE: 지급수수료 (결제수수료, 서비스수수료)
- EDU: 교육훈련비 (교육, 세미나, 도서)
- EQP: 비품 (장비, 가구)
- TRV: 여비교통비 (출장, 교통비)
- INS: 보험료 (사업 보험)
- TAX: 세금과공과 (세금, 공과금)
- DEP: 감가상각비 (자산 감가상각)
- OTH: 기타 (분류 어려운 경비)
- NON: 비용처리불가 (개인적 지출)

지출 내역:
- 내용: {description}
- 금액: {amount}원
- 가맹점: {vendor}

다음 JSON 형식으로 응답하세요:
{{
  "category_code": "계정과목 코드",
  "category_name": "계정과목 이름",
  "is_deductible": true/false,
  "confidence": 0.0-1.0,
  "reason": "분류 이유 (간단히)"
}}
"""

CATEGORY_NAMES = {
    "ENT": "접대비",
    "WEL": "복리후생비",
    "SUP": "소모품비",
    "VEH": "차량유지비",
    "COM": "통신비",
    "RNT": "임차료",
    "ADV": "광고선전비",
    "FEE": "지급수수료",
    "EDU": "교육훈련비",
    "EQP": "비품",
    "TRV": "여비교통비",
    "INS": "보험료",
    "TAX": "세금과공과",
    "DEP": "감가상각비",
    "OTH": "기타",
    "NON": "비용처리불가",
}


class ClassifierService:
    """AI expense classifier"""

    async def classify(
        self,
        description: str,
        amount: Optional[Decimal] = None,
        vendor: Optional[str] = None
    ) -> ClassificationResult:
        """Classify expense using AI"""
        # Build prompt
        prompt = CLASSIFICATION_PROMPT.format(
            description=description,
            amount=f"{amount:,.0f}" if amount else "미입력",
            vendor=vendor or "미입력"
        )

        # Get LLM response
        response = await llm_service.generate(
            prompt=prompt,
            temperature=0.2,
            max_tokens=500
        )

        # Parse response
        return self._parse_classification(response.content)

    def _parse_classification(self, response: str) -> ClassificationResult:
        """Parse classification response"""
        import json
        import re

        try:
            # Extract JSON from response
            json_match = re.search(r'\{[^{}]*\}', response, re.DOTALL)
            if json_match:
                parsed = json.loads(json_match.group())

                category_code = parsed.get("category_code", "OTH").upper()
                if category_code not in CATEGORY_NAMES:
                    category_code = "OTH"

                return ClassificationResult(
                    category_code=category_code,
                    category_name=CATEGORY_NAMES.get(category_code, "기타"),
                    is_deductible=parsed.get("is_deductible", True) and category_code != "NON",
                    confidence=min(max(parsed.get("confidence", 0.5), 0), 1),
                    reason=parsed.get("reason", "AI 자동 분류")
                )
        except (json.JSONDecodeError, KeyError):
            pass

        # Default fallback
        return ClassificationResult(
            category_code="OTH",
            category_name="기타",
            is_deductible=True,
            confidence=0.3,
            reason="자동 분류 실패, 기타로 분류됨"
        )


# Global instance
classifier_service = ClassifierService()
