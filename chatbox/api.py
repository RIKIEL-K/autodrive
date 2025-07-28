import os
import traceback
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from openai import OpenAI

# Crée un client compatible avec openai>=1.0.0
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI(title="Chatbot - Autodrive")

class ChatRequest(BaseModel):
    question: str
    chat_context: List[str]
    doc_context: str

class ChatResponse(BaseModel):
    answer: str

@app.post("/chat/ask", response_model=ChatResponse)
def ask_question(req: ChatRequest):
    try:
        print("Requête reçue dans /chat/ask")
        print("🔹 Question:", req.question)
        print("🔹 Chat context:", req.chat_context)
        print("🔹 Doc context:", req.doc_context[:100], "...")

        prompt = f"""
Tu es un assistant virtuel pour un service de commande de taxi. Sois clair et professionnel.

Informations utiles : {req.doc_context}

Historique :
{chr(10).join(req.chat_context)}

Question du client : {req.question}
"""

        print("Envoi à OpenAI...")
        completion = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                { "role": "user", "content": prompt }
            ]
        )

        response = completion.choices[0].message.content.strip()
        print("Réponse reçue:", response)
        return { "answer": response }

    except Exception as e:
        print("Une erreur est survenue :")
        traceback.print_exc()
        return {
            "answer": "Une erreur s'est produite avec notre assistant IA. Veuillez réessayer plus tard."
        }
@app.get("/health")
def health_check():
    return {"status": "ok"}