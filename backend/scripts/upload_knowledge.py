"""
Knowledge base upload script for Pinecone
세무 지식 데이터를 Pinecone에 업로드하는 스크립트
"""
import json
import os
import sys
from pathlib import Path
from typing import List, Dict
import time

# 프로젝트 루트를 path에 추가
sys.path.insert(0, str(Path(__file__).parent.parent))

from pinecone import Pinecone, ServerlessSpec
from app.core.config import settings
from app.services.embedding_service import embedding_service


def load_knowledge_files(data_dir: str) -> List[Dict]:
    """Load all knowledge JSON files from directory"""
    documents = []
    data_path = Path(data_dir)

    if not data_path.exists():
        print(f"Data directory not found: {data_path}")
        return documents

    for json_file in data_path.glob("*.json"):
        print(f"Loading: {json_file.name}")
        with open(json_file, "r", encoding="utf-8") as f:
            data = json.load(f)
            documents.extend(data)

    print(f"Total documents loaded: {len(documents)}")
    return documents


def create_index_if_not_exists(pc: Pinecone, index_name: str, dimension: int = 1024):
    """Create Pinecone index if it doesn't exist"""
    existing_indexes = [idx.name for idx in pc.list_indexes()]

    if index_name not in existing_indexes:
        print(f"Creating index: {index_name}")
        pc.create_index(
            name=index_name,
            dimension=dimension,
            metric="cosine",
            spec=ServerlessSpec(
                cloud="aws",
                region="us-east-1"
            )
        )
        # Wait for index to be ready
        time.sleep(10)
        print(f"Index created: {index_name}")
    else:
        print(f"Index already exists: {index_name}")


def prepare_document_text(doc: Dict) -> str:
    """Prepare document text for embedding"""
    # FAQ의 경우 질문과 답변 모두 포함
    if "question" in doc:
        return f"질문: {doc['question']}\n답변: {doc['content']}"
    return doc["content"]


def upload_documents(pc: Pinecone, index_name: str, documents: List[Dict], batch_size: int = 50):
    """Upload documents to Pinecone index"""
    index = pc.Index(index_name)

    total_uploaded = 0
    failed = 0

    # Process in batches
    for i in range(0, len(documents), batch_size):
        batch = documents[i:i + batch_size]
        vectors = []

        for doc in batch:
            try:
                # Generate embedding
                text = prepare_document_text(doc)
                embedding = embedding_service.embed_text(text)

                if embedding is None:
                    print(f"Failed to generate embedding for: {doc['id']}")
                    failed += 1
                    continue

                # Prepare metadata
                metadata = {
                    "content": doc["content"][:1000],  # Pinecone metadata size limit
                    "category": doc.get("category", ""),
                    "subcategory": doc.get("subcategory", ""),
                    "source": doc.get("source", ""),
                    "keywords": ",".join(doc.get("keywords", [])),
                    "business_types": ",".join(doc.get("business_types", [])),
                }

                # FAQ specific fields
                if "question" in doc:
                    metadata["question"] = doc["question"]
                if "code" in doc:
                    metadata["code"] = doc["code"]

                vectors.append({
                    "id": doc["id"],
                    "values": embedding,
                    "metadata": metadata
                })

            except Exception as e:
                print(f"Error processing {doc['id']}: {e}")
                failed += 1
                continue

        # Upsert batch
        if vectors:
            try:
                index.upsert(vectors=vectors, namespace="tax_rules")
                total_uploaded += len(vectors)
                print(f"Uploaded batch {i//batch_size + 1}: {len(vectors)} vectors (Total: {total_uploaded})")
            except Exception as e:
                print(f"Error upserting batch: {e}")
                failed += len(vectors)

        # Rate limiting
        time.sleep(0.5)

    return total_uploaded, failed


def main():
    """Main function"""
    print("=" * 50)
    print("Tax Knowledge Base Upload Script")
    print("=" * 50)

    # Check API key
    if not settings.PINECONE_API_KEY:
        print("\nError: PINECONE_API_KEY not configured!")
        print("Please set PINECONE_API_KEY in your .env file")
        return

    # Check embedding model
    print("\nChecking embedding model...")
    test_embedding = embedding_service.embed_text("테스트")
    if test_embedding is None:
        print("Error: Embedding model not working!")
        return
    print(f"Embedding dimension: {len(test_embedding)}")

    # Initialize Pinecone
    print("\nInitializing Pinecone...")
    pc = Pinecone(api_key=settings.PINECONE_API_KEY)

    # Create index if needed
    index_name = settings.PINECONE_INDEX
    create_index_if_not_exists(pc, index_name, dimension=len(test_embedding))

    # Load knowledge data
    print("\nLoading knowledge data...")
    data_dir = Path(__file__).parent.parent / "data" / "knowledge"
    documents = load_knowledge_files(str(data_dir))

    if not documents:
        print("No documents to upload!")
        return

    # Upload documents
    print("\nUploading documents to Pinecone...")
    uploaded, failed = upload_documents(pc, index_name, documents)

    # Summary
    print("\n" + "=" * 50)
    print("Upload Complete!")
    print(f"  Successfully uploaded: {uploaded}")
    print(f"  Failed: {failed}")
    print("=" * 50)

    # Verify
    print("\nVerifying index...")
    index = pc.Index(index_name)
    stats = index.describe_index_stats()
    print(f"Index stats: {stats}")


if __name__ == "__main__":
    main()
