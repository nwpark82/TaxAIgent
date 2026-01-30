"""
LLM service - Gemini/GPT 라우터
"""
import time
from typing import Optional, Dict, Any
from dataclasses import dataclass
import google.generativeai as genai
from openai import AsyncOpenAI

from app.core.config import settings


@dataclass
class LLMResponse:
    """LLM response data"""
    content: str
    provider: str
    model: str
    input_tokens: int
    output_tokens: int
    response_time_ms: int


class LLMService:
    """LLM service with fallback support"""

    def __init__(self):
        self._init_clients()

    def _init_clients(self):
        """Initialize LLM clients"""
        # Gemini
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.gemini_model = genai.GenerativeModel(settings.GEMINI_MODEL)
        else:
            self.gemini_model = None

        # OpenAI
        if settings.OPENAI_API_KEY:
            self.openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        else:
            self.openai_client = None

    async def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.3,
        max_tokens: int = 1000
    ) -> LLMResponse:
        """Generate response using primary LLM with fallback"""
        # Try Gemini first
        if self.gemini_model:
            response = await self._generate_gemini(prompt, system_prompt, temperature, max_tokens)
            if response:
                return response

        # Fallback to OpenAI
        if self.openai_client:
            response = await self._generate_openai(prompt, system_prompt, temperature, max_tokens)
            if response:
                return response

        # No LLM available
        return LLMResponse(
            content="죄송합니다. 현재 AI 서비스를 이용할 수 없습니다. 잠시 후 다시 시도해주세요.",
            provider="none",
            model="none",
            input_tokens=0,
            output_tokens=0,
            response_time_ms=0
        )

    async def _generate_gemini(
        self,
        prompt: str,
        system_prompt: Optional[str],
        temperature: float,
        max_tokens: int
    ) -> Optional[LLMResponse]:
        """Generate using Gemini"""
        try:
            start_time = time.time()

            # Combine system prompt with user prompt
            full_prompt = prompt
            if system_prompt:
                full_prompt = f"{system_prompt}\n\n{prompt}"

            response = self.gemini_model.generate_content(
                full_prompt,
                generation_config=genai.GenerationConfig(
                    temperature=temperature,
                    max_output_tokens=max_tokens,
                )
            )

            response_time_ms = int((time.time() - start_time) * 1000)

            # Estimate tokens (Gemini doesn't always provide exact counts)
            input_tokens = len(full_prompt) // 4
            output_tokens = len(response.text) // 4

            return LLMResponse(
                content=response.text,
                provider="gemini",
                model=settings.GEMINI_MODEL,
                input_tokens=input_tokens,
                output_tokens=output_tokens,
                response_time_ms=response_time_ms
            )

        except Exception as e:
            print(f"Gemini error: {e}")
            return None

    async def _generate_openai(
        self,
        prompt: str,
        system_prompt: Optional[str],
        temperature: float,
        max_tokens: int
    ) -> Optional[LLMResponse]:
        """Generate using OpenAI"""
        try:
            start_time = time.time()

            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            messages.append({"role": "user", "content": prompt})

            response = await self.openai_client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
            )

            response_time_ms = int((time.time() - start_time) * 1000)

            return LLMResponse(
                content=response.choices[0].message.content,
                provider="openai",
                model=settings.OPENAI_MODEL,
                input_tokens=response.usage.prompt_tokens,
                output_tokens=response.usage.completion_tokens,
                response_time_ms=response_time_ms
            )

        except Exception as e:
            print(f"OpenAI error: {e}")
            return None


# Global instance
llm_service = LLMService()
