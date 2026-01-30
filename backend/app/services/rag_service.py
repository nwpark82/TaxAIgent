"""
RAG service - 벡터 검색 기반 문서 검색
로컬 FAISS 또는 Pinecone 벡터 검색을 지원합니다.
"""
from typing import List, Dict, Optional
from pinecone import Pinecone

from app.core.config import settings
from app.services.embedding_service import embedding_service


class RAGService:
    """RAG service - 로컬 또는 클라우드 벡터 검색"""

    _instance: Optional["RAGService"] = None
    _pinecone_index = None
    _local_store = None
    _use_local: bool = True

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        if hasattr(self, "_initialized") and self._initialized:
            return

        self._initialized = True
        self._init_backend()

    def _init_backend(self):
        """벡터 검색 백엔드 초기화"""
        # Pinecone API 키가 있으면 Pinecone 사용 시도
        if settings.PINECONE_API_KEY:
            try:
                pc = Pinecone(api_key=settings.PINECONE_API_KEY)
                self._pinecone_index = pc.Index(settings.PINECONE_INDEX_NAME)
                self._use_local = False
                print(f"Using Pinecone: {settings.PINECONE_INDEX_NAME}")
                return
            except Exception as e:
                print(f"Pinecone connection failed: {e}")

        # 로컬 벡터 스토어 사용
        print("Using local FAISS vector store")
        self._use_local = True
        self._init_local_store()

    def _init_local_store(self):
        """로컬 벡터 스토어 초기화 (지연 로딩)"""
        if self._local_store is None:
            from app.services.local_vector_store import local_vector_store
            self._local_store = local_vector_store
            print(f"Local vector store loaded: {self._local_store.document_count} documents")

    def search(
        self,
        query: str,
        top_k: int = 5,
        filter_dict: Optional[Dict] = None,
        namespace: str = "tax_rules"
    ) -> List[Dict]:
        """벡터 유사도 검색"""
        if self._use_local:
            return self._search_local(query, top_k, filter_dict)
        else:
            return self._search_pinecone(query, top_k, filter_dict, namespace)

    def _search_local(
        self,
        query: str,
        top_k: int,
        filter_dict: Optional[Dict]
    ) -> List[Dict]:
        """로컬 FAISS 검색"""
        self._init_local_store()

        if not self._local_store.is_ready:
            return self._get_fallback_context(query)

        results = self._local_store.search(query, top_k, filter_dict)

        if not results:
            return self._get_fallback_context(query)

        return results

    def _search_pinecone(
        self,
        query: str,
        top_k: int,
        filter_dict: Optional[Dict],
        namespace: str
    ) -> List[Dict]:
        """Pinecone 검색"""
        if self._pinecone_index is None:
            return self._get_fallback_context(query)

        # 쿼리 임베딩 생성
        query_embedding = embedding_service.embed_text(query)
        if query_embedding is None:
            return self._get_fallback_context(query)

        try:
            # Pinecone 검색
            results = self._pinecone_index.query(
                vector=query_embedding,
                top_k=top_k,
                filter=filter_dict,
                namespace=namespace,
                include_metadata=True
            )

            # 결과 포맷팅
            documents = []
            for match in results.get("matches", []):
                documents.append({
                    "id": match["id"],
                    "score": match["score"],
                    "content": match.get("metadata", {}).get("content", ""),
                    "source": match.get("metadata", {}).get("source", ""),
                    "category": match.get("metadata", {}).get("category", ""),
                })

            return documents if documents else self._get_fallback_context(query)

        except Exception as e:
            print(f"Pinecone search error: {e}")
            return self._get_fallback_context(query)

    def _get_fallback_context(self, query: str = "") -> List[Dict]:  # noqa: ARG002
        """폴백 컨텍스트 (벡터 검색 실패 시)"""
        return [
            {
                "id": "fallback_1",
                "score": 1.0,
                "content": """
한국 세법 기본 원칙:
1. 사업과 직접 관련된 지출만 경비 인정
2. 적격증빙(세금계산서, 카드영수증 등) 필요
3. 접대비는 한도 있음 (기본 1,200만원 + 매출 비례)
4. 개인적 지출은 경비 불인정
5. 복리후생비는 사회통념상 적정 범위 내 인정
                """,
                "source": "기본 세법 원칙",
                "category": "general"
            }
        ]

    def format_context(self, documents: List[Dict]) -> str:
        """검색 결과를 컨텍스트 문자열로 포맷팅"""
        if not documents:
            return ""

        context_parts = []
        for i, doc in enumerate(documents, 1):
            source = doc.get("source", "")
            source_str = f"\n출처: {source}" if source else ""
            context_parts.append(f"[참고자료 {i}]\n{doc['content']}{source_str}")

        return "\n\n".join(context_parts)

    @property
    def is_ready(self) -> bool:
        """RAG 서비스 준비 상태"""
        if self._use_local:
            self._init_local_store()
            return self._local_store is not None and self._local_store.is_ready
        else:
            return self._pinecone_index is not None

    @property
    def backend_info(self) -> str:
        """현재 사용 중인 백엔드 정보"""
        if self._use_local:
            self._init_local_store()
            count = self._local_store.document_count if self._local_store else 0
            return f"Local FAISS ({count} documents)"
        else:
            return f"Pinecone ({settings.PINECONE_INDEX_NAME})"


# 전역 인스턴스
rag_service = RAGService()
