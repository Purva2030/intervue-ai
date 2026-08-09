from app.models.candidate import Candidate


def analyze_candidate(candidate: Candidate) -> dict:
    passed = []
    failed = []
    skipped = []

    for mission in candidate.missions:
        if mission.skipped:
            skipped.append(mission)
        elif mission.passed is False:
            failed.append(mission)
        elif mission.passed is True:
            passed.append(mission)

    high_attempt_topics = [
        mission
        for mission in passed
        if mission.attempts is not None and mission.attempts >= 3
    ]

    return {
        "candidate": {
            "id": candidate.member.id,
            "name": candidate.member.name,
            "role": candidate.member.jobRole,
            "experience": candidate.member.yearsExperience,
            "education": candidate.member.education,
        },
        "learning_profile": {
            "passed_topics": [
                {
                    "day": m.day,
                    "title": m.title,
                    "attempts": m.attempts,
                }
                for m in passed
            ],
            "failed_topics": [
                {
                    "day": m.day,
                    "title": m.title,
                    "attempts": m.attempts,
                }
                for m in failed
            ],
            "skipped_topics": [
                {
                    "day": m.day,
                    "title": m.title,
                }
                for m in skipped
            ],
            "high_attempt_topics": [
                {
                    "day": m.day,
                    "title": m.title,
                    "attempts": m.attempts,
                }
                for m in high_attempt_topics
            ],
        },
        "signals": {
            "commit_days": candidate.signals.commitDays,
            "missions_completed": candidate.signals.missionsCompleted,
            "missions_first_try": candidate.signals.missionsFirstTry,
        },
    }