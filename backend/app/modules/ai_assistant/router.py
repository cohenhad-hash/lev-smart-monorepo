from fastapi import APIRouter, HTTPException
from .schemas import ChatRequest, ChatResponse
from .service import generate_response

router = APIRouter(prefix="/api/ai", tags=["AI Assistant"])

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        reply = await generate_response(request.message)
        return ChatResponse(reply=reply)
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception:
        raise HTTPException(status_code=502, detail="AI service request failed")
