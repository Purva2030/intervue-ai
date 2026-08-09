from pydantic import BaseModel
from typing import Literal

from app.models.candidate import Candidate


class InterviewTopic(BaseModel):
    question_budget: int = 1
    day: int
    title: str
    category: Literal[
        "foundation",
        "probe",
        "gap",
        "context",
    ]
    attempts: int | None = None
    priority: int


class InterviewStrategy(BaseModel):
    candidate_id: str
    difficulty: Literal[
        "beginner",
        "intermediate",
        "advanced",
    ]
    target_questions: int
    topics: list[InterviewTopic]


class GeneratedQuestion(BaseModel):
    day: int
    topic: str
    question: str
    difficulty: Literal[
        "foundational",
        "intermediate",
        "advanced",
    ]
    purpose: Literal[
        "warmup",
        "depth_probe",
        "gap_check",
        "system_design",
        "capstone",
    ]


class AnswerEvaluation(BaseModel):
    answered: bool
    classification: Literal[
        "strong",
        "partial",
        "weak",

    ]

    technical_correctness: int
    reasoning_depth: int
    practical_understanding: int
    communication: int

    strengths: list[str]
    weaknesses: list[str]

    recommended_action: Literal[
        "deepen",
        "clarify",
        "fundamentals",
    ]

    feedback: str


class InterviewTurn(BaseModel):
    question: str
    answer: str
    evaluation: AnswerEvaluation | None = None
    day: int
    topic: str

class InterviewSession(BaseModel):
    session_id: str
    candidate_id: str
    candidate: Candidate

    current_question: GeneratedQuestion | None = None

    turns: list[InterviewTurn] = []

    question_count: int = 0
    max_questions: int = 10

    completed: bool = False

    # Interview strategy
    topics: list[InterviewTopic] = []
    current_topic_index: int = 0

    # Maximum one adaptive follow-up per topic
    topic_question_count: int = 0

class InterviewRequest(BaseModel):
    sessionId: str | None = None
    candidate: Candidate | None = None
    message: str = ""


class InterviewResponse(BaseModel):
    sessionId: str
    message: str
    done: bool
    assessment: FinalAssessment | None = None

class FinalAssessment(BaseModel):
    summary: str
    strengths: list[str]
    gaps: list[str]
    next: str