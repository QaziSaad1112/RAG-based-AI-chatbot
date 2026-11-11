from retriever import search_documents
from llm import generate_answer


def get_chat_response(question):

    question_lower = question.lower().strip()
    if not question_lower:
        return "Please enter a question."

    # 1. Greetings
    greetings = [
        "hello", "hi", "hey", "hallo",
        "salam", "assalamualaikum",
        "good morning", "good evening",
        "good afternoon"
    ]

    if question_lower in greetings:
        return "Hello! I am the SyedShayan.com AI Assistant. How can I help you with information about our website?"

    # 2. Search only in website data
    results = search_documents(question, top_k=5)

    if results and results["documents"][0]:

        documents = results["documents"][0]
        distances = results["distances"][0]

        relevant_documents = [
            document
            for document, distance in zip(documents, distances)
            if distance <= 0.65
        ]

        if relevant_documents:

            context = "\n\n".join(relevant_documents)

            return generate_answer(
                context,
                question,
                "website"
            )

    # 3. No relevant website information found
    return (
        "I'm here to assist with information about SyedShayan.com only. "
        "I couldn't find relevant information about your question in our website data. "
        "Please ask something related to our website."
    )