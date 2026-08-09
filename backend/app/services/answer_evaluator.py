from app.models.interview import AnswerEvaluation
from app.llm.provider import generate_structured


def build_evaluation_prompt(
    question: str,
    answer: str,
) -> str:

    return f"""
You are a senior technical interviewer evaluating a candidate's answer.

QUESTION:
{question}

CANDIDATE ANSWER:
{answer}

First determine whether the candidate actually answered the question.

Set answered=false if the response:

- repeats the interview question
- asks a question instead of answering
- is empty or meaningless
- says they do not know without providing relevant reasoning
- consists primarily of the interviewer prompt copied back

Set answered=true if the candidate provides a genuine response
that attempts to address the technical question, even if the
response is incomplete or partially incorrect.

Do not treat a repeated question as a technically correct answer.

Evaluate the answer objectively.

Score each dimension from 1 to 10:

1. Technical correctness
2. Reasoning depth
3. Practical understanding
4. Communication

Classification:

- strong: technically correct and demonstrates meaningful reasoning
- partial: some correct understanding but important gaps remain
- weak: incorrect, superficial, or unable to demonstrate understanding

Determine the best next action:

- deepen: candidate is strong; ask a harder or more specific follow-up
- clarify: candidate has partial understanding; probe the unclear area
- fundamentals: candidate appears weak; check an underlying concept

If answered=false:

- classification must be "weak"
- technical_correctness should be 1
- reasoning_depth should be 1
- practical_understanding should be 1
- recommended_action should be "fundamentals"
- explain that the candidate did not provide a technical answer

Also identify specific strengths and weaknesses.

Provide concise professional feedback.

Return the evaluation using the required structured schema.
"""


def fallback_evaluation(
    question: str,
    answer: str,
) -> AnswerEvaluation:

    answer_clean = answer.strip()

    # ---------------------------------------------------------
    # Empty answer
    # ---------------------------------------------------------

    if not answer_clean:
        return AnswerEvaluation(
            answered=False,
            classification="weak",
            technical_correctness=1,
            reasoning_depth=1,
            practical_understanding=1,
            communication=1,
            strengths=[],
            weaknesses=[
                "No technical answer was provided."
            ],
            recommended_action="fundamentals",
            feedback=(
                "The candidate did not provide a technical "
                "response to the question."
            ),
        )

    # ---------------------------------------------------------
    # Very short / meaningless answer
    # ---------------------------------------------------------

    if len(answer_clean.split()) < 5:
        return AnswerEvaluation(
            answered=False,
            classification="weak",
            technical_correctness=1,
            reasoning_depth=1,
            practical_understanding=1,
            communication=2,
            strengths=[],
            weaknesses=[
                "The response is too short to demonstrate "
                "technical understanding."
            ],
            recommended_action="fundamentals",
            feedback=(
                "The candidate did not provide enough technical "
                "reasoning to evaluate the answer."
            ),
        )

    # ---------------------------------------------------------
    # Detect whether candidate mostly repeated the question
    # ---------------------------------------------------------

    question_words = set(
        question.lower()
        .replace("?", "")
        .replace(",", "")
        .replace(".", "")
        .split()
    )

    answer_words = set(
        answer_clean.lower()
        .replace("?", "")
        .replace(",", "")
        .replace(".", "")
        .split()
    )

    if question_words:
        overlap = len(
            question_words.intersection(answer_words)
        ) / len(question_words)

        if overlap > 0.75:
            return AnswerEvaluation(
                answered=False,
                classification="weak",
                technical_correctness=1,
                reasoning_depth=1,
                practical_understanding=1,
                communication=2,
                strengths=[],
                weaknesses=[
                    "The response primarily repeats the "
                    "interview question."
                ],
                recommended_action="fundamentals",
                feedback=(
                    "The candidate repeated the question instead "
                    "of providing a technical answer."
                ),
            )

    # ---------------------------------------------------------
    # Basic local fallback evaluation
    #
    # This is intentionally conservative.
    # Its purpose is to keep the interview running when
    # the external LLM is unavailable.
    # ---------------------------------------------------------

    word_count = len(answer_clean.split())

    # Longer answers generally provide more opportunity
    # to demonstrate reasoning.
    if word_count >= 120:
        technical_score = 7
        reasoning_score = 7
        practical_score = 7
        communication_score = 7

        classification = "strong"
        recommended_action = "deepen"

        strengths = [
            "Provided a detailed technical response.",
            "Demonstrated meaningful reasoning."
        ]

        weaknesses = [
            "AI-based detailed verification was unavailable."
        ]

        feedback = (
            "The response demonstrates a reasonable level of "
            "technical depth and provides enough detail to support "
            "a deeper follow-up."
        )

    elif word_count >= 50:
        technical_score = 6
        reasoning_score = 6
        practical_score = 6
        communication_score = 6

        classification = "partial"
        recommended_action = "clarify"

        strengths = [
            "Attempted to address the technical problem.",
            "Provided some relevant reasoning."
        ]

        weaknesses = [
            "The response could provide more technical detail "
            "and implementation reasoning."
        ]

        feedback = (
            "The candidate provided a relevant response, but "
            "additional probing is recommended to assess technical "
            "depth and practical understanding."
        )

    else:
        technical_score = 5
        reasoning_score = 4
        practical_score = 4
        communication_score = 5

        classification = "partial"
        recommended_action = "clarify"

        strengths = [
            "Attempted to answer the technical question."
        ]

        weaknesses = [
            "Limited technical detail.",
            "Reasoning and implementation decisions were not "
            "explained in sufficient depth."
        ]

        feedback = (
            "The candidate attempted the question, but the response "
            "is relatively brief. A clarification or follow-up probe "
            "is recommended."
        )

    return AnswerEvaluation(
        answered=True,
        classification=classification,
        technical_correctness=technical_score,
        reasoning_depth=reasoning_score,
        practical_understanding=practical_score,
        communication=communication_score,
        strengths=strengths,
        weaknesses=weaknesses,
        recommended_action=recommended_action,
        feedback=feedback,
    )


def evaluate_answer(
    question: str,
    answer: str,
) -> AnswerEvaluation:

    prompt = build_evaluation_prompt(
        question,
        answer,
    )

    # ---------------------------------------------------------
    # Try real Gemini evaluation first.
    # ---------------------------------------------------------

    try:

        return generate_structured(
            prompt,
            AnswerEvaluation,
        )

    except Exception as error:

        # -----------------------------------------------------
        # Gemini unavailable.
        # Continue using local fallback evaluation.
        # -----------------------------------------------------

        print(
            "Gemini unavailable for answer evaluation. "
            f"Using fallback evaluation. Reason: {error}"
        )

        return fallback_evaluation(
            question,
            answer,
        )