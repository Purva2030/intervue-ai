from app.services.curriculum_loader import load_curriculum
from app.services.question_context import build_question_context


curriculum = load_curriculum()

context = build_question_context(
    curriculum,
    10
)

print("========== QUESTION CONTEXT ==========")
print(f"Day: {context['day']}")
print(f"Title: {context['title']}")
print(f"Type: {context['type']}")
print(f"Tools: {', '.join(context['tools'])}")

print("\nObjectives:")

for objective in context["objectives"]:
    print(f"- {objective}")