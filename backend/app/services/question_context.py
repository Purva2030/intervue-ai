from app.models.curriculum import Curriculum


def build_question_context(
    curriculum: Curriculum,
    topic_day: int,
) -> dict:

    day = next(
        (
            item
            for item in curriculum.days
            if item.day == topic_day
        ),
        None,
    )

    if day is None:
        raise ValueError(
            f"Curriculum day {topic_day} not found"
        )

    return {
        "day": day.day,
        "title": day.title,
        "type": day.type,
        "tools": day.tools,
        "objectives": day.objectives,
    }