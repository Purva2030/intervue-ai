import json

from app.models.candidate import Candidate

from app.services.curriculum_loader import load_curriculum
from app.services.interview_strategy import build_interview_strategy
from app.services.question_generator import generate_question


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
# Select the first topic
# ---------------------------------------------------------

topic = next(
    topic
    for topic in strategy.topics
    if topic.day == 12
)


# ---------------------------------------------------------
# Generate question
# ---------------------------------------------------------

question = generate_question(
    candidate,
    topic,
    curriculum,
)


print("\n========== GENERATED QUESTION ==========")

print(
    json.dumps(
        question.model_dump(),
        indent=2,
    )
)