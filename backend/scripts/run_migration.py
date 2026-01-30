"""
DB 마이그레이션 실행 스크립트
"""
import sys
import os
from pathlib import Path

# 프로젝트 루트를 Python path에 추가
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))
os.chdir(project_root)

from alembic.config import Config
from alembic import command

def main():
    print("=" * 60)
    print("Alembic 마이그레이션 실행")
    print("=" * 60)

    # alembic.ini 경로
    alembic_cfg = Config(str(project_root / "alembic.ini"))

    # 마이그레이션 실행
    print("\n마이그레이션 적용 중...")
    command.upgrade(alembic_cfg, "head")

    print("\n" + "=" * 60)
    print("마이그레이션 완료!")
    print("=" * 60)

if __name__ == "__main__":
    main()
