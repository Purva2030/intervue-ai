from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.models.interview import (
    InterviewRequest,
    InterviewResponse,
)

from app.services.interview_controller import (
    continue_interview,
    start_interview,
)


app = FastAPI(
    title="Intervue AI",
    description="Adaptive AI Technical Interviewer",
    version="0.1.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Intervue AI API is running"
    }


@app.post(
    "/api/interview",
    response_model=InterviewResponse,
)
def interview(
    request: InterviewRequest,
):

    try:

        # -------------------------------------------------
        # Start new interview
        # -------------------------------------------------

        if request.sessionId is None:

            if request.candidate is None:
                raise HTTPException(
                    status_code=400,
                    detail=(
                        "candidate is required "
                        "when starting an interview."
                    ),
                )

            return start_interview(
                request.candidate
            )

        # -------------------------------------------------
        # Continue existing interview
        # -------------------------------------------------

        return continue_interview(
            request.sessionId,
            request.message,
        )

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

    except Exception as error:

        print(
            f"Interview error: {error}"
        )

        raise HTTPException(
            status_code=500,
            detail="Interview processing failed.",
        )