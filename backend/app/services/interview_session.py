from uuid import uuid4

from app.models.candidate import Candidate
from app.models.interview import (
    GeneratedQuestion,
    InterviewSession,
    InterviewTopic,

)


_sessions: dict[str, InterviewSession] = {}


def create_session(
    candidate: Candidate,
    first_question: GeneratedQuestion,
    topics: list[InterviewTopic],
) -> InterviewSession:

    session_id = str(uuid4())

    session = InterviewSession(
        session_id=session_id,
        candidate_id=candidate.member.id,
        candidate=candidate,
        current_question=first_question,
        question_count=1,
        topics=topics,
        current_topic_index=0,
        topic_question_count=1,
        max_questions=10,
    )

    _sessions[session_id] = session

    return session
def get_session(
    session_id: str,
) -> InterviewSession:

    session = _sessions.get(session_id)

    if session is None:
        raise ValueError(
            f"Interview session '{session_id}' not found."
        )

    return session


def save_session(
    session: InterviewSession,
) -> None:

    _sessions[session.session_id] = session