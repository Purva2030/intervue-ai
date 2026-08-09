from app.models.candidate import Candidate
from app.models.curriculum import Curriculum
from app.models.interview import (
    AnswerEvaluation,
    GeneratedQuestion,
    InterviewTopic,
)

from app.llm.provider import generate_structured
from app.services.question_context import build_question_context


def build_followup_prompt(
    candidate: Candidate,
    topic: InterviewTopic,
    previous_question: str,
    previous_answer: str,
    evaluation: AnswerEvaluation,
    curriculum: Curriculum,
) -> str:

    context = build_question_context(
        curriculum,
        topic.day,
    )

    objectives = "\n".join(
        f"- {objective}"
        for objective in context["objectives"]
    )

    strengths = "\n".join(
        f"- {item}"
        for item in evaluation.strengths
    )

    weaknesses = "\n".join(
        f"- {item}"
        for item in evaluation.weaknesses
    )

    return f"""
You are a senior technical interviewer conducting an
adaptive technical interview.

CANDIDATE
Name: {candidate.member.name}
Role: {candidate.member.jobRole}
Experience: {candidate.member.yearsExperience} years

CURRICULUM
Day {context["day"]}: {context["title"]}

Objectives:
{objectives}

PREVIOUS QUESTION
{previous_question}

CANDIDATE ANSWER
{previous_answer}

ANSWER EVALUATION
Classification: {evaluation.classification}
Technical correctness: {evaluation.technical_correctness}/10
Reasoning depth: {evaluation.reasoning_depth}/10
Practical understanding: {evaluation.practical_understanding}/10
Communication: {evaluation.communication}/10

Strengths:
{strengths}

Weaknesses:
{weaknesses}

Recommended action:
{evaluation.recommended_action}

ADAPTATION RULES

If the recommended action is "deepen":

- Ask a harder follow-up.
- Focus on technical reasoning, trade-offs, architecture,
  implementation details, or edge cases.
- Build directly on the candidate's previous answer.

If the recommended action is "clarify":

- Ask a targeted question about the specific missing concept.
- Do not repeat the previous question.
- Do not unnecessarily increase difficulty.

If the recommended action is "fundamentals":

- Check an underlying prerequisite concept.
- Use a simpler but technically meaningful question.
- Do not embarrass or criticize the candidate.

GENERAL RULES

1. Ask exactly ONE question.
2. The question must follow naturally from the previous answer.
3. Stay grounded in the supplied curriculum.
4. Do not mention the candidate's score or evaluation.
5. Do not reveal the evaluation process.
6. Do not provide the answer.
7. Avoid generic questions.
8. Do not restart the interview.
"""


def generate_fallback_followup(
    topic: InterviewTopic,
    evaluation: AnswerEvaluation,
) -> GeneratedQuestion:

    if evaluation.recommended_action == "deepen":

        question = (
            f"Building on your previous answer about {topic.title}, "
            f"what specific trade-offs or failure cases would you "
            f"consider when implementing this in a production system?"
        )

        purpose = "depth_probe"
        difficulty = "advanced"

    elif evaluation.recommended_action == "clarify":

        question = (
            f"Can you explain in more detail how you would handle "
            f"the main technical challenge involved in {topic.title} "
            f"and why you would choose that approach?"
        )

        purpose = "depth_probe"
        difficulty = "intermediate"

    else:

        question = (
            f"Before going deeper into {topic.title}, "
            f"can you explain the core concept you would need "
            f"to understand first and how it is used in practice?"
        )

        purpose = "warmup"
        difficulty = "intermediate"

    return GeneratedQuestion(
        day=topic.day,
        topic=topic.title,
        question=question,
        difficulty=difficulty,
        purpose=purpose,
    )


def generate_followup(
    candidate: Candidate,
    topic: InterviewTopic,
    previous_question: str,
    previous_answer: str,
    evaluation: AnswerEvaluation,
    curriculum: Curriculum,
) -> GeneratedQuestion:

    prompt = build_followup_prompt(
        candidate=candidate,
        topic=topic,
        previous_question=previous_question,
        previous_answer=previous_answer,
        evaluation=evaluation,
        curriculum=curriculum,
    )

    try:

        return generate_structured(
            prompt,
            GeneratedQuestion,
        )

    except Exception as error:

        print(
            "Gemini unavailable for follow-up generation. "
            f"Using fallback question. Reason: {error}"
        )

        return generate_fallback_followup(
            topic=topic,
            evaluation=evaluation,
        )