from pathlib import Path

from data_loader import load_data
from preprocessing import clean_data
from document_processor import create_documents
from embeddings import generate_embeddings
from vector_database import create_vector_database
from retriever import search_documents

BASE_DIR = Path(__file__).resolve().parent.parent

file_path = BASE_DIR / "data" / "syedshayan_dataset_final.csv"

df = load_data(str(file_path))

cleaned_df = clean_data(df)

print("CSV Columns:", cleaned_df.columns.tolist())

documents, metadatas = create_documents(cleaned_df)

embeddings = generate_embeddings(documents)

collection = create_vector_database(
    documents,
    embeddings,
    metadatas
)

print("Saved Documents:", collection.count())

query = "What is SyedShayan.com?"

results = search_documents(query)

documents = results["documents"][0]
distances = results["distances"][0]
metadatas = results["metadatas"][0]

for i, document in enumerate(documents):

    print(f"\nResult {i + 1}")
    print("Document:", document)
    print("Distance:", distances[i])
    print("Source:", metadatas[i]["source_page"])
    print("URL:", metadatas[i]["source_url"])

print("Total Stored Documents:", collection.count())