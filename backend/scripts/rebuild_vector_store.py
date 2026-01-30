"""
벡터 스토어 재빌드 스크립트
지식 데이터 변경 후 실행하여 FAISS 인덱스를 재구축합니다.
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

from app.services.local_vector_store import LocalVectorStore


def main():
    print("=" * 60)
    print("벡터 스토어 재빌드")
    print("=" * 60)

    # 기존 인덱스 파일 삭제
    store_dir = project_root / "data" / "vector_store"
    if store_dir.exists():
        for f in store_dir.glob("*"):
            f.unlink()
            print(f"삭제: {f.name}")

    # 새로 빌드
    print("\n새로운 벡터 스토어 빌드 중...")

    # 싱글톤 인스턴스 초기화 리셋
    LocalVectorStore._instance = None

    # 새 인스턴스 생성 (자동으로 빌드됨)
    store = LocalVectorStore()

    print("\n" + "=" * 60)
    print(f"완료! 총 {store.document_count}개 문서 인덱싱됨")
    print("=" * 60)


if __name__ == "__main__":
    main()
