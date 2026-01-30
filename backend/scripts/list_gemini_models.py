"""
Gemini 사용 가능한 모델 목록 조회
"""
import sys
import io
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

import google.generativeai as genai
from app.core.config import settings

print("Gemini 사용 가능한 모델 목록")
print("=" * 60)

if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

    try:
        for model in genai.list_models():
            if 'generateContent' in model.supported_generation_methods:
                print(f"- {model.name}")
    except Exception as e:
        print(f"에러: {e}")
else:
    print("GEMINI_API_KEY가 설정되지 않았습니다.")
