"""
Embedding service - KoE5 임베딩
"""
from typing import List, Optional
import numpy as np
from sentence_transformers import SentenceTransformer

from app.core.config import settings


class EmbeddingService:
    """KoE5 embedding service"""

    _instance: Optional["EmbeddingService"] = None
    _model: Optional[SentenceTransformer] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        if self._model is None:
            self._load_model()

    def _load_model(self):
        """Load KoE5 model"""
        try:
            print(f"Loading embedding model: {settings.EMBEDDING_MODEL}")
            self._model = SentenceTransformer(settings.EMBEDDING_MODEL)
            print("Embedding model loaded successfully")
        except Exception as e:
            print(f"Failed to load embedding model: {e}")
            self._model = None

    def embed_text(self, text: str) -> Optional[List[float]]:
        """Embed single text"""
        if self._model is None:
            return None

        try:
            embedding = self._model.encode(text, normalize_embeddings=True)
            return embedding.tolist()
        except Exception as e:
            print(f"Embedding error: {e}")
            return None

    def embed_texts(self, texts: List[str]) -> Optional[List[List[float]]]:
        """Embed multiple texts"""
        if self._model is None:
            return None

        try:
            embeddings = self._model.encode(texts, normalize_embeddings=True)
            return embeddings.tolist()
        except Exception as e:
            print(f"Batch embedding error: {e}")
            return None

    def compute_similarity(self, embedding1: List[float], embedding2: List[float]) -> float:
        """Compute cosine similarity between two embeddings"""
        vec1 = np.array(embedding1)
        vec2 = np.array(embedding2)
        return float(np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2)))


# Global instance
embedding_service = EmbeddingService()
