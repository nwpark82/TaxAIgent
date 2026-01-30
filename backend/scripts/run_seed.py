"""
시드 데이터 삽입 스크립트
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

from app.core.database import AsyncSessionLocal
from app.core.seed import run_seeds


async def main():
    print("=" * 60)
    print("시드 데이터 삽입")
    print("=" * 60)

    async with AsyncSessionLocal() as db:
        await run_seeds(db)

    print("\n" + "=" * 60)
    print("시드 데이터 삽입 완료!")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
