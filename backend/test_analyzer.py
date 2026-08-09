import json

from app.models.candidate import Candidate
from app.services.candidate_analyzer import analyze_candidate


with open("app/data/candidates.json", "r", encoding="utf-8") as file:
    data = json.load(file)


raw_candidate = data["candidates"][0]

candidate = Candidate(**raw_candidate)

profile = analyze_candidate(candidate)

print(json.dumps(profile, indent=2))

from app.services.curriculum_loader import load_curriculum
from app.services.interview_strategy import build_interview_strategy


curriculum = load_curriculum()

strategy = build_interview_strategy(
    candidate,
    curriculum
)

print("\n")
print("========== INTERVIEW STRATEGY ==========")
print(strategy.model_dump_json(indent=2))