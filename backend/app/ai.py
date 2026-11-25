import json
import os

from fastapi import APIRouter, HTTPException
from google import genai
from pydantic import BaseModel

router = APIRouter(prefix="/ai", tags=["AI Assistant"])

# Nom du modèle Gemini (modifiable sans toucher au code via GEMINI_MODEL dans .env)
MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")


class ExplainRequest(BaseModel):
    submission_text: str          # le travail rendu par l'étudiant
    rubric_expectation: str       # ce que le מחוון attendait
    feedback_comment: str = ""    # la remarque du prof


class ExplainResponse(BaseModel):
    explanation: str                   # l'explication en hébreu simple
    quote: str | None = None           # citation exacte de l'erreur dans le travail
    error_location: str | None = None  # où se trouve l'erreur (ligne/paragraphe)


PROMPT = """אתה עוזר הוראה. הסבר לסטודנט בעברית פשוטה וקצרה מה הבעיה בעבודה שלו ואיך לתקן אותה.

מה המחוון ציפה:
{rubric}

הערת המרצה:
{comment}

העבודה שהוגשה:
{submission}

החזר JSON בלבד במבנה הזה:
{{"explanation": "ההסבר", "quote": "ציטוט מדויק מהעבודה או null", "error_location": "איפה הטעות או null"}}
"""


@router.post("/explain", response_model=ExplainResponse)
def explain(req: ExplainRequest):
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise HTTPException(500, "GOOGLE_API_KEY is missing in .env")

    client = genai.Client(api_key=api_key)
    prompt = PROMPT.format(
        rubric=req.rubric_expectation,
        comment=req.feedback_comment or "אין",
        submission=req.submission_text,
    )
    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=prompt,
            config={"response_mime_type": "application/json"},
        )
        data = json.loads(response.text)
    except Exception as e:
        raise HTTPException(502, f"AI error: {e}")

    return ExplainResponse(**data)
