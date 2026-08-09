from app.models.interview import (
    FinalAssessment,
    InterviewSession,
)

from app.llm.provider import generate_structured


def build_assessment_prompt(
    session: InterviewSession,
) -> str:

    turns = []

    for index, turn in enumerate(
        session.turns,
        start=1,
    ):

        evaluation = turn.evaluation

        if evaluation is None:
            continue

        turns.append(
            f"""
QUESTION {index}
Topic: {turn.topic}
Day: {turn.day}

Question:
{turn.question}

Candidate Answer:
{turn.answer}

Answered: {evaluation.answered}

Evaluation:
Classification: {evaluation.classification}
Technical Correctness: {evaluation.technical_correctness}/10
Reasoning Depth: {evaluation.reasoning_depth}/10
Practical Understanding: {evaluation.practical_understanding}/10
Communication: {evaluation.communication}/10

Strengths:
{", ".join(evaluation.strengths)}

Weaknesses:
{", ".join(evaluation.weaknesses)}
"""
        )

    interview_history = "\n".join(turns)

    return f"""
You are a senior technical hiring evaluator.

Create a final interview assessment based ONLY on
the interview evidence provided below.

Candidate:
{session.candidate.member.name}

Role:
{session.candidate.member.jobRole}

Experience:
{session.candidate.member.yearsExperience} years

Interview evidence:
{interview_history}

Return a concise professional assessment.

Required fields:

summary:
A concise overall assessment of the candidate's
technical performance.

strengths:
Specific technical strengths demonstrated during
the interview.

gaps:
Specific technical weaknesses or knowledge gaps
demonstrated during the interview.

next:
A practical recommendation for what the candidate
should work on next.

Rules:

1. Do not invent skills that were not demonstrated.
2. Do not judge the candidate based only on one answer.
3. Consider the complete interview.
4. Mention recurring patterns where appropriate.
5. Keep the assessment useful to a technical recruiter.
6. Return only the required structured fields.
"""


def generate_fallback_assessment(
    session: InterviewSession,
) -> FinalAssessment:

    evaluations = [
        turn.evaluation
        for turn in session.turns
        if turn.evaluation is not None
    ]

    if not evaluations:

        return FinalAssessment(
            summary=(
                "The interview was completed, but there was "
                "insufficient evaluation data to produce a "
                "detailed technical assessment."
            ),
            strengths=[],
            gaps=[
                "Insufficient interview evidence for detailed assessment."
            ],
            next=(
                "Complete another technical assessment with "
                "additional evaluated responses."
            ),
        )

    strengths = []
    weaknesses = []

    for evaluation in evaluations:

        for strength in evaluation.strengths:
            if strength not in strengths:
                strengths.append(strength)

        for weakness in evaluation.weaknesses:
            if weakness not in weaknesses:
                weaknesses.append(weakness)

    strong_count = sum(
        1
        for evaluation in evaluations
        if evaluation.classification == "strong"
    )

    partial_count = sum(
        1
        for evaluation in evaluations
        if evaluation.classification == "partial"
    )

    weak_count = sum(
        1
        for evaluation in evaluations
        if evaluation.classification == "weak"
    )

    total = len(evaluations)

    if strong_count > partial_count and strong_count > weak_count:

        summary = (
            f"The candidate demonstrated strong technical performance "
            f"across the interview, with {strong_count} of {total} "
            f"evaluated responses classified as strong."
        )

    elif weak_count > strong_count:

        summary = (
            f"The candidate demonstrated several areas requiring "
            f"further development. {weak_count} of {total} "
            f"evaluated responses were classified as weak."
        )

    else:

        summary = (
            f"The candidate demonstrated mixed technical performance "
            f"across the interview, with {strong_count} strong, "
            f"{partial_count} partial, and {weak_count} weak "
            f"responses."
        )

    if not strengths:

        strengths = [
            "Completed the adaptive technical interview."
        ]

    if not weaknesses:

        weaknesses = [
            "No specific recurring technical weakness was identified."
        ]

    if weak_count > 0 or partial_count > 0:

        next_step = (
            "Review the technical areas identified in the interview "
            "and practice applying those concepts to realistic "
            "production scenarios."
        )

    else:

        next_step = (
            "Continue developing advanced system-design and "
            "production engineering skills through increasingly "
            "complex technical scenarios."
        )

    return FinalAssessment(
        summary=summary,
        strengths=strengths[:5],
        gaps=weaknesses[:5],
        next=next_step,
    )


def generate_final_assessment(
    session: InterviewSession,
) -> FinalAssessment:

    prompt = build_assessment_prompt(
        session,
    )

    try:

        return generate_structured(
            prompt,
            FinalAssessment,
        )

    except Exception as error:

        print(
            "Gemini unavailable for final assessment. "
            f"Using fallback assessment. Reason: {error}"
        )

        return generate_fallback_assessment(
            session,
        )