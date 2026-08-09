import json

from app.models.candidate import Candidate

from app.services.curriculum_loader import load_curriculum
from app.services.interview_strategy import build_interview_strategy
from app.services.question_generator import generate_question
from app.services.interview_session import create_session


# ---------------------------------------------------------
# Load candidate
# ---------------------------------------------------------

with open(
    "app/data/candidates.json",
    "r",
    encoding="utf-8",
) as file:
    data = json.load(file)


candidate = Candidate(
    **data["candidates"][0]
)


# ---------------------------------------------------------
# Load curriculum
# ---------------------------------------------------------

curriculum = load_curriculum()


# ---------------------------------------------------------
# Build interview strategy
# ---------------------------------------------------------

strategy = build_interview_strategy(
    candidate,
    curriculum,
)


# ---------------------------------------------------------
# Select first topic
# ---------------------------------------------------------

topic = strategy.topics[0]


# ---------------------------------------------------------
# Generate first question
# ---------------------------------------------------------

first_question = generate_question(
    candidate,
    topic,
    curriculum,
)


# ---------------------------------------------------------
# Create interview session
# ---------------------------------------------------------

session = create_session(
    candidate,
    first_question,
)


# ---------------------------------------------------------
# Display session
# ---------------------------------------------------------

print("\n========== INTERVIEW SESSION ==========")

print(f"Session ID: {session.session_id}")
print(f"Candidate: {session.candidate.member.name}")
print(f"Candidate ID: {session.candidate_id}")
print(f"Question Count: {session.question_count}")
print(f"Completed: {session.completed}")

print("\n========== CURRENT QUESTION ==========")

print(
    session.current_question.model_dump_json(
        indent=2
    )
)