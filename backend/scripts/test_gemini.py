"""
Gemini API 테스트 스크립트
"""
import sys
import io
from pathlib import Path

# Windows 콘솔 UTF-8 출력 설정
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# 프로젝트 루트를 Python path에 추가
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

import google.generativeai as genai
from app.core.config import settings

print("=" * 60)
print("Gemini API 테스트")
print("=" * 60)

print(f"\nGEMINI_API_KEY: {settings.GEMINI_API_KEY[:10]}..." if settings.GEMINI_API_KEY else "설정 안됨")
print(f"GEMINI_MODEL: {settings.GEMINI_MODEL}")

if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

    try:
        model = genai.GenerativeModel(settings.GEMINI_MODEL)
        response = model.generate_content("Say hello in Korean")
        print(f"\n응답: {response.text}")
        print("\n✅ Gemini API 정상 작동!")
    except Exception as e:
        print(f"\n❌ Gemini API 에러: {e}")
else:
    print("\n❌ GEMINI_API_KEY가 설정되지 않았습니다.")
