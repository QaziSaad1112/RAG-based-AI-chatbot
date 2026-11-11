def create_documents(df):
    documents = []
    metadatas = []
    for _, row in df.iterrows():
        title = row['title']
        question = row['question']
        content = row['content']
        document = f"Title: {title}\nQuestion: {question}\nContent: {content}"
        documents.append(document)

        metadata = {
            "source_page": str(row['source_page']),
            "source_url": str(row['source_url']),
            "category": str(row['category']),
            "section": str(row['section'])
        }

        metadatas.append(metadata)
        print(f"Document Created: {document}")
        print(f"Metadata: {metadata}")

    return documents, metadatas