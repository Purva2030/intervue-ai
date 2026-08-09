import json
from pathlib import Path

from app.models.curriculum import Curriculum


CURRICULUM_PATH = (
    Path(__file__).resolve().parent.parent
    / "data"
    / "curriculum.json"
)


def load_curriculum() -> Curriculum:
    with open(CURRICULUM_PATH, "r", encoding="utf-8") as file:
        data = json.load(file)

    return Curriculum(**data)


def get_day(curriculum: Curriculum, day_number: int):
    for day in curriculum.days:
        if day.day == day_number:
            return day

    return None
