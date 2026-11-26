from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="LEV Smart API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "LEV Smart API is running"}

from app.modules.ai_assistant.router import router as ai_router
app.include_router(ai_router)

# Register Courses module router (Team 2)
from app.modules.courses.router import router as courses_router
app.include_router(courses_router)

