import chromadb
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "chroma_db"
client = chromadb.PersistentClient(path=str(DB_PATH))
collection = client.get_or_create_collection(name="my_collection",metadata={"hnsw:space": "cosine"})

def create_vector_database(documents, embeddings, metadatas):
    ids = [str(i) for i in range(len(documents))]
    collection.upsert(ids=ids, documents=documents, embeddings=embeddings.tolist(), metadatas=metadatas)
    return collection