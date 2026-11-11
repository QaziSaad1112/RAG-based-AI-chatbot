
from pathlib import Path
import chromadb
from embeddings import generate_embeddings

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "chroma_db"

client = chromadb.PersistentClient(path=str(DB_PATH))
collection = client.get_collection(name="my_collection")


def search_documents(query, top_k=5):

    query_embedding = generate_embeddings([query])

    total_documents = collection.count()

    if total_documents == 0:
        return {"documents": [[]],"distances": [[]],"metadatas": [[]]}

    results = collection.query(
        query_embeddings=query_embedding.tolist(),
        n_results=min(top_k, total_documents),
        include=["documents", "metadatas", "distances"]
    )

    return results
