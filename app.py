import sys
from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent

BACKEND_DIR = BASE_DIR / "backend"
FRONTEND_DIR = BASE_DIR / "frontend"

sys.path.insert(0, str(BACKEND_DIR))

from rag_pipeline import get_chat_response

app = FastAPI()


class ChatRequest(BaseModel):
    question: str


@app.get("/")
def home():
    return FileResponse(FRONTEND_DIR / "index.html")


@app.post("/chat")
def chat(request: ChatRequest):
    answer = get_chat_response(request.question)
    return {"answer": answer}


app.mount(
    "/",
    StaticFiles(directory=FRONTEND_DIR),
    name="frontend"
)

# .\.venv\Scripts\python.exe -m uvicorn app:app --reload   
