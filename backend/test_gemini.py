from app.llm.provider import generate_text


response = generate_text(
    "Explain RAG in exactly two sentences."
)

print("========== GEMINI RESPONSE ==========")
print(response)