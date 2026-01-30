"""
Local Vector Store - FAISS 기반 로컬 벡터 검색
Pinecone 대신 로컬에서 벡터 검색을 수행합니다.
"""
import json
import pickle
from pathlib import Path
from typing import List, Dict, Optional
import numpy as np
import faiss

from app.services.embedding_service import embedding_service


class LocalVectorStore:
    """FAISS 기반 로컬 벡터 스토어"""

    _instance: Optional["LocalVectorStore"] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return

        self._index: Optional[faiss.IndexFlatIP] = None  # Inner Product (cosine with normalized vectors)
        self._documents: List[Dict] = []
        self._dimension: int = 1024  # KoE5 embedding dimension

        # 저장 경로 (한글 경로 문제 회피)
        self._data_dir = Path(__file__).parent.parent.parent / "data"
        self._store_dir = self._data_dir / "vector_store"
        self._index_path = self._store_dir / "faiss.index"
        self._docs_path = self._store_dir / "documents.pkl"

        # 인덱스 로드 시도
        self._load_or_build()
        self._initialized = True

    def _load_or_build(self):
        """저장된 인덱스 로드 또는 새로 빌드"""
        if self._index_path.exists() and self._docs_path.exists():
            print("Loading existing vector store...")
            self._load_index()
        else:
            print("Building new vector store from knowledge data...")
            self._build_from_knowledge()

    def _load_index(self):
        """저장된 인덱스 로드"""
        try:
            # numpy로 저장된 FAISS 인덱스 로드
            with open(self._index_path, "rb") as f:
                index_data = np.load(f)
            self._index = faiss.deserialize_index(index_data)

            with open(self._docs_path, "rb") as f:
                self._documents = pickle.load(f)

            print(f"Loaded {len(self._documents)} documents from vector store")
        except Exception as e:
            print(f"Failed to load index: {e}")
            self._build_from_knowledge()

    def _save_index(self):
        """인덱스 저장"""
        try:
            self._store_dir.mkdir(parents=True, exist_ok=True)

            # FAISS는 한글 경로에서 문제가 있으므로 numpy로 저장
            index_data = faiss.serialize_index(self._index)
            with open(self._index_path, "wb") as f:
                np.save(f, index_data)

            with open(self._docs_path, "wb") as f:
                pickle.dump(self._documents, f)

            print(f"Saved {len(self._documents)} documents to vector store")
        except Exception as e:
            print(f"Failed to save index: {e}")

    def _build_from_knowledge(self):
        """지식 데이터에서 벡터 스토어 빌드"""
        knowledge_dir = self._data_dir / "knowledge"

        if not knowledge_dir.exists():
            print(f"Knowledge directory not found: {knowledge_dir}")
            self._index = faiss.IndexFlatIP(self._dimension)
            return

        # 모든 JSON 파일 로드
        documents = []
        for json_file in knowledge_dir.glob("*.json"):
            print(f"Loading: {json_file.name}")
            with open(json_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                documents.extend(data)

        if not documents:
            print("No documents found!")
            self._index = faiss.IndexFlatIP(self._dimension)
            return

        print(f"Total documents: {len(documents)}")

        # 임베딩 생성
        print("Generating embeddings...")
        embeddings = []
        valid_documents = []

        for i, doc in enumerate(documents):
            text = self._prepare_text(doc)
            embedding = embedding_service.embed_text(text)

            if embedding is not None:
                embeddings.append(embedding)
                valid_documents.append(doc)

            if (i + 1) % 10 == 0:
                print(f"  Processed {i + 1}/{len(documents)} documents")

        if not embeddings:
            print("No embeddings generated!")
            self._index = faiss.IndexFlatIP(self._dimension)
            return

        # FAISS 인덱스 생성
        embeddings_array = np.array(embeddings, dtype=np.float32)

        # 정규화 (cosine similarity를 위해)
        faiss.normalize_L2(embeddings_array)

        self._index = faiss.IndexFlatIP(self._dimension)
        self._index.add(embeddings_array)
        self._documents = valid_documents

        print(f"Built index with {self._index.ntotal} vectors")

        # 저장
        self._save_index()

    def _prepare_text(self, doc: Dict) -> str:
        """문서 텍스트 준비"""
        if "question" in doc:
            return f"질문: {doc['question']}\n답변: {doc['content']}"
        return doc["content"]

    def search(
        self,
        query: str,
        top_k: int = 5,
        filter_dict: Optional[Dict] = None
    ) -> List[Dict]:
        """벡터 유사도 검색"""
        if self._index is None or self._index.ntotal == 0:
            return []

        # 쿼리 임베딩
        query_embedding = embedding_service.embed_text(query)
        if query_embedding is None:
            return []

        # 정규화
        query_array = np.array([query_embedding], dtype=np.float32)
        faiss.normalize_L2(query_array)

        # 검색
        scores, indices = self._index.search(query_array, min(top_k * 2, self._index.ntotal))

        # 결과 포맷팅
        results = []
        for score, idx in zip(scores[0], indices[0]):
            if idx < 0 or idx >= len(self._documents):
                continue

            doc = self._documents[idx]

            # 필터 적용
            if filter_dict and not self._match_filter(doc, filter_dict):
                continue

            results.append({
                "id": doc.get("id", f"doc_{idx}"),
                "score": float(score),
                "content": doc.get("content", ""),
                "source": doc.get("source", ""),
                "category": doc.get("category", ""),
                "subcategory": doc.get("subcategory", ""),
                "keywords": doc.get("keywords", []),
                "business_types": doc.get("business_types", []),
            })

            if len(results) >= top_k:
                break

        return results

    def _match_filter(self, doc: Dict, filter_dict: Dict) -> bool:
        """필터 조건 매칭"""
        for key, value in filter_dict.items():
            doc_value = doc.get(key)
            if doc_value is None:
                return False

            if isinstance(doc_value, list):
                if value not in doc_value and "all" not in doc_value:
                    return False
            elif doc_value != value:
                return False

        return True

    def rebuild(self):
        """인덱스 재빌드 (지식 데이터 변경 시)"""
        print("Rebuilding vector store...")
        self._build_from_knowledge()

    @property
    def document_count(self) -> int:
        """저장된 문서 수"""
        return len(self._documents)

    @property
    def is_ready(self) -> bool:
        """벡터 스토어 준비 상태"""
        return self._index is not None and self._index.ntotal > 0


# 전역 인스턴스
local_vector_store = LocalVectorStore()
