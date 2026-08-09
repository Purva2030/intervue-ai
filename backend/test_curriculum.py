from app.services.curriculum_loader import load_curriculum


curriculum = load_curriculum()

print("Cohort:")
print(curriculum.cohort)

print("\nModules:")

for module in curriculum.modules:
    print(
        f"Module {module.n}: "
        f"{module.title} "
        f"(Days {module.days[0]}-{module.days[-1]})"
    )

print("\nExample Day:")

day = next(
    day for day in curriculum.days
    if day.day == 10
)

print(f"Day {day.day}: {day.title}")
print(f"Type: {day.type}")
print(f"Tools: {', '.join(day.tools)}")
print("Objectives:")

for objective in day.objectives:
    print(f"  - {objective}")