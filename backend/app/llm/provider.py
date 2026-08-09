import os
import time
from typing import TypeVar

from dotenv import load_dotenv
from google import genai
from pydantic import BaseModel


load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise RuntimeError(
        "GEMINI_API_KEY is not configured in .env"
    )

client = genai.Client(api_key=api_key)

MODEL_NAME = "gemini-3.6-flash"

T = TypeVar("T", bound=BaseModel)


def generate_text(prompt: str) -> str:
    max_attempts = 3

    for attempt in range(max_attempts):
        try:
            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt,
            )

            if not response.text:
                raise RuntimeError(
                    "Gemini returned an empty response."
                )

            return response.text.strip()

        except Exception as error:

            error_text = str(error)

            # Quota exhaustion is not a transient failure.
            # Retrying immediately will not help.
            if (
                "429" in error_text
                or "RESOURCE_EXHAUSTED" in error_text
            ):
                raise RuntimeError(
                    f"Gemini quota exhausted: {error}"
                ) from error

            if attempt == max_attempts - 1:
                raise RuntimeError(
                    f"Gemini request failed after "
                    f"{max_attempts} attempts: {error}"
                ) from error

            wait_time = 2 ** attempt

            print(
                f"Gemini request failed "
                f"(attempt {attempt + 1}/{max_attempts}). "
                f"Retrying in {wait_time}s..."
            )

            time.sleep(wait_time)
def generate_structured(
    prompt: str,
    response_schema: type[T],
) -> T:

    max_attempts = 3

    for attempt in range(max_attempts):
        try:
            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt,
                config={
                    "response_mime_type": "application/json",
                    "response_schema": response_schema,
                },
            )

            if not response.parsed:
                raise RuntimeError(
                    "Gemini returned no structured response."
                )

            return response.parsed

        except Exception as error:

            if attempt == max_attempts - 1:
                raise RuntimeError(
                    f"Structured Gemini request failed "
                    f"after {max_attempts} attempts: {error}"
                ) from error

            wait_time = 2 ** attempt

            print(
                f"Structured Gemini request failed "
                f"(attempt {attempt + 1}/{max_attempts}). "
                f"Retrying in {wait_time}s..."
            )

            time.sleep(wait_time)