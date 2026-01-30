"""
LLM API 연결 테스트 스크립트
Gemini와 OpenAI 모두 테스트
"""
import sys
import io
import asyncio
from pathlib import Path

# Windows 콘솔 UTF-8 출력 설정
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# 프로젝트 루트를 Python path에 추가
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

import google.generativeai as genai
from openai import AsyncOpenAI
from app.core.config import settings

print("=" * 60)
print("LLM API 연결 테스트")
print("=" * 60)

# 설정 확인
print("\n[설정 확인]")
print(f"GEMINI_API_KEY: {settings.GEMINI_API_KEY[:15]}..." if settings.GEMINI_API_KEY else "GEMINI_API_KEY: 설정 안됨")
print(f"GEMINI_MODEL: {settings.GEMINI_MODEL}")
print(f"OPENAI_API_KEY: {settings.OPENAI_API_KEY[:15]}..." if settings.OPENAI_API_KEY else "OPENAI_API_KEY: 설정 안됨")
print(f"OPENAI_MODEL: {settings.OPENAI_MODEL}")

# 1. Gemini 테스트
print("\n" + "-" * 60)
print("[1] Gemini API 테스트 (무료 회원용)")
print("-" * 60)

if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)
    try:
        model = genai.GenerativeModel(settings.GEMINI_MODEL)
        response = model.generate_content("Say 'Hello' in Korean in one word")
        print(f"✅ Gemini 연결 성공!")
        print(f"   응답: {response.text.strip()}")
    except Exception as e:
        print(f"❌ Gemini 연결 실패: {e}")
else:
    print("❌ GEMINI_API_KEY가 설정되지 않았습니다.")

# 2. OpenAI 테스트
print("\n" + "-" * 60)
print("[2] OpenAI API 테스트 (유료 회원용)")
print("-" * 60)

async def test_openai():
    if settings.OPENAI_API_KEY:
        client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        try:
            response = await client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[{"role": "user", "content": "Say 'Hello' in Korean in one word"}],
                max_tokens=10
            )
            print(f"✅ OpenAI 연결 성공!")
            print(f"   응답: {response.choices[0].message.content.strip()}")
        except Exception as e:
            print(f"❌ OpenAI 연결 실패: {e}")
    else:
        print("❌ OPENAI_API_KEY가 설정되지 않았습니다.")

asyncio.run(test_openai())

print("\n" + "=" * 60)
print("테스트 완료!")
print("=" * 60)
