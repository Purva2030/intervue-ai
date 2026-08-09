from app.models.candidate import Candidate
from app.models.curriculum import Curriculum
from app.models.interview import InterviewStrategy, InterviewTopic


def determine_difficulty(candidate: Candidate) -> str:
    """
    Determine interview depth from professional experience.
    """

    experience = candidate.member.yearsExperience

    if experience >= 8:
        return "advanced"
    elif experience >= 3:
        return "intermediate"
    else:
        return "beginner"


def classify_topic(mission) -> tuple[str, int]:
    """
    Classify a topic using the candidate's learning history.
    """

    # Skipped topics are knowledge gaps.
    if mission.skipped:
        return "gap", 2

    # Explicit failures deserve investigation.
    if mission.passed is False:
        return "probe", 5

    # Multiple attempts indicate possible difficulty.
    if mission.attempts is not None and mission.attempts >= 3:
        return "probe", 5

    # First-attempt success indicates a strong foundation.
    if mission.attempts == 1:
        return "foundation", 2

    return "foundation", 1


def build_interview_strategy(
    candidate: Candidate,
    curriculum: Curriculum,
) -> InterviewStrategy:

    difficulty = determine_difficulty(candidate)

    candidate_missions = {
        mission.day: mission
        for mission in candidate.missions
    }

    topics = []

    for day in curriculum.days:

        mission = candidate_missions.get(day.day)

        # Only use curriculum topics represented
        # in the candidate profile.
        if mission is None:
            continue

        category, priority = classify_topic(mission)

        # High-risk topics get two questions.
        if category == "probe":
            question_budget = 2

        # Knowledge gaps get one direct question.
        elif category == "gap":
            question_budget = 1

        # Foundation topics get one question.
        else:
            question_budget = 1

        topics.append(
            InterviewTopic(
                day=day.day,
                title=day.title,
                category=category,
                attempts=mission.attempts,
                priority=priority,
                question_budget=question_budget,
            )
        )

    # ---------------------------------------------------------
    # Prioritize topics by interview purpose.
    #
    # probe       → demonstrated difficulty
    # gap         → skipped/unknown
    # foundation → demonstrated competence
    # ---------------------------------------------------------

    category_order = {
        "probe": 0,
        "gap": 1,
        "foundation": 2,
    }

    topics.sort(
        key=lambda topic: (
            category_order.get(topic.category, 3),
            -topic.priority,
            topic.day,
        )
    )

    # ---------------------------------------------------------
    # Allocate the 10-question interview budget.
    # ---------------------------------------------------------

    selected = []
    remaining_budget = 10

    for topic in topics:

        if remaining_budget <= 0:
            break

        allocated_questions = min(
            topic.question_budget,
            remaining_budget,
        )

        topic.question_budget = allocated_questions

        selected.append(topic)

        remaining_budget -= allocated_questions

    return InterviewStrategy(
        candidate_id=candidate.member.id,
        difficulty=difficulty,
        target_questions=10,
        topics=selected,
    )