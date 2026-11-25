import os
from google import genai

async def generate_response(message: str) -> str:
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY is not configured")

    client = genai.Client(api_key=api_key)

    response = await client.aio.models.generate_content(
        model="gemini-3.8-flash",
        contents=message
    )

    return response.text or "No response generated."
