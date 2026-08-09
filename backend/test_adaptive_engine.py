import json

from app.models.candidate import Candidate
from app.models.interview import AnswerEvaluation

from app.services.adaptive_engine import generate_followup
from app.services.curriculum_loader import load_curriculum
from app.services.interview_strategy import build_interview_strategy


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
# Build strategy
# ---------------------------------------------------------

strategy = build_interview_strategy(
    candidate,
    curriculum,
)


# ---------------------------------------------------------
# Use Day 12 probe topic
# ---------------------------------------------------------

topic = next(
    topic
    for topic in strategy.topics
    if topic.day == 12
)


# ---------------------------------------------------------
# Previous question
# ---------------------------------------------------------

previous_question = """
You are finalizing a production-ready system prompt for an
enterprise chatbot using prompt templates, and you need to
choose between a Few-Shot variation and a Chain-of-Thought
variation.

How would you design a systematic evaluation framework using
a fixed test set to quantitatively benchmark these prompt
variations across accuracy, compliance, and performance
metrics?
"""


# ---------------------------------------------------------
# Candidate answer
# ---------------------------------------------------------

previous_answer = """
I would create a fixed evaluation dataset that represents
production traffic and includes complex and high-risk cases.

I would evaluate both prompts on the same dataset using
accuracy, compliance, latency, token usage and cost.

I would establish minimum compliance and latency thresholds.
If Chain-of-Thought gives only a small accuracy improvement
while increasing cost significantly, I would choose Few-Shot.
"""


# ---------------------------------------------------------
# Previous evaluation
# ---------------------------------------------------------

evaluation = AnswerEvaluation(
    classification="strong",
    technical_correctness=8,
    reasoning_depth=8,
    practical_understanding=8,
    communication=9,
    strengths=[
        "Strong evaluation structure",
        "Good production trade-off reasoning",
    ],
    weaknesses=[
        "Did not explain detailed compliance scoring",
        "Did not discuss dynamic prompt routing",
    ],
    recommended_action="deepen",
    feedback="Candidate demonstrates strong practical understanding.",
)


# ---------------------------------------------------------
# Generate adaptive follow-up
# ---------------------------------------------------------

followup = generate_followup(
    candidate=candidate,
    topic=topic,
    previous_question=previous_question,
    previous_answer=previous_answer,
    evaluation=evaluation,
    curriculum=curriculum,
)


print("\n========== ADAPTIVE FOLLOW-UP ==========")

print(
    followup.model_dump_json(
        indent=2
    )
)