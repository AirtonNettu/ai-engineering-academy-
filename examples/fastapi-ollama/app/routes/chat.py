from fastapi import APIRouter, HTTPException, Request
from app.models import ChatRequest, ChatResponse
from app.integrations.ollama import ServiceError

router = APIRouter()


@router.post("/api/chat", response_model=ChatResponse)
async def chat(body: ChatRequest, request: Request) -> ChatResponse:
    service = request.app.state.ollama
    try:
        answer = await service.generate(body.message)
    except ServiceError as exc:
        raise HTTPException(status_code=exc.status, detail=exc.detail) from exc
    return ChatResponse(answer=answer, model=service.model)
