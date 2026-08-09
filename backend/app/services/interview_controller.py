from app.models.candidate import Candidate
from app.models.interview import (
    InterviewRequest,
    InterviewResponse,
    InterviewTurn,
)

from app.services.answer_evaluator import evaluate_answer
from app.services.adaptive_engine import generate_followup
from app.services.curriculum_loader import load_curriculum
from app.services.final_assessment import generate_final_assessment
from app.services.interview_session import (
    create_session,
    get_session,
    save_session,
)
from app.services.interview_strategy import build_interview_strategy
from app.services.question_generator import generate_question


def start_interview(
    candidate: Candidate,
) -> InterviewResponse:

    curriculum = load_curriculum()

    strategy = build_interview_strategy(
        candidate,
        curriculum,
    )

    first_topic = strategy.topics[0]

    first_question = generate_question(
        candidate,
        first_topic,
        curriculum,
    )

    session = create_session(
        candidate,
        first_question,
        strategy.topics,
    )

    return InterviewResponse(
        sessionId=session.session_id,
        message=first_question.question,
        done=False,
    )


def continue_interview(
    session_id: str,
    message: str,
) -> InterviewResponse:

    session = get_session(session_id)

    if session.completed:
        return InterviewResponse(
            sessionId=session.session_id,
            message="The interview has already been completed.",
            done=True,
        )

    if not message.strip():
        raise ValueError(
            "Candidate message cannot be empty."
        )

    current_question = session.current_question

    if current_question is None:
        raise ValueError(
            "Session does not have a current question."
        )

    # ---------------------------------------------------------
    # 1. Evaluate candidate answer
    # ---------------------------------------------------------

    evaluation = evaluate_answer(
        current_question.question,
        message,
    )

    # ---------------------------------------------------------
    # 2. Store interview turn
    # ---------------------------------------------------------

    session.turns.append(
        InterviewTurn(
            question=current_question.question,
            answer=message,
            evaluation=evaluation,
            day=current_question.day,
            topic=current_question.topic,
        )
    )

    # ---------------------------------------------------------
    # 3. Check maximum question count
    # ---------------------------------------------------------

    if session.question_count >= session.max_questions:

        session.completed = True

        assessment = generate_final_assessment(
            session
        )

        save_session(session)

        return InterviewResponse(
            sessionId=session.session_id,
            message="Thank you. The interview is complete.",
            done=True,
            assessment=assessment,
        )

    # ---------------------------------------------------------
    # 4. Get current topic
    # ---------------------------------------------------------

    current_topic = session.topics[
        session.current_topic_index
    ]

    curriculum = load_curriculum()

    # ---------------------------------------------------------
    # 5. Generate one adaptive follow-up
    # ---------------------------------------------------------

            # ---------------------------------------------------------
    # 5. Determine whether the current topic has questions left
    # ---------------------------------------------------------

    current_topic = session.topics[
        session.current_topic_index
    ]

    curriculum = load_curriculum()

    if (
        session.topic_question_count
        < current_topic.question_budget
    ):

        # The current topic still has interview budget.
        # Generate an adaptive follow-up.

        next_question = generate_followup(
            candidate=session.candidate,
            topic=current_topic,
            previous_question=current_question.question,
            previous_answer=message,
            evaluation=evaluation,
            curriculum=curriculum,
        )

        session.topic_question_count += 1

    else:

        # -----------------------------------------------------
        # Move to the next topic
        # -----------------------------------------------------

        next_topic_index = (
            session.current_topic_index + 1
        )

        # No more topics.
        if next_topic_index >= len(session.topics):

            session.completed = True

            assessment = generate_final_assessment(
                session
            )

            save_session(session)

            return InterviewResponse(
                sessionId=session.session_id,
                message="Thank you. The interview is complete.",
                done=True,
                assessment=assessment,
            )

        session.current_topic_index = next_topic_index

        next_topic = session.topics[
            session.current_topic_index
        ]

        # First question for the new topic.
        session.topic_question_count = 1

        next_question = generate_question(
            candidate=session.candidate,
            topic=next_topic,
            curriculum=curriculum,
        )# ---------------------------------------------------------
    # 7. Save next question
    # ---------------------------------------------------------

    session.current_question = next_question
    session.question_count += 1

    save_session(session)

    return InterviewResponse(
        sessionId=session.session_id,
        message=next_question.question,
        done=False,
    )