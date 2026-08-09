from app.models.candidate import Candidate
from app.models.curriculum import Curriculum
from app.models.interview import GeneratedQuestion, InterviewTopic

from app.llm.provider import generate_text
from app.services.question_context import build_question_context


def build_question_prompt(
    candidate: Candidate,
    topic: InterviewTopic,
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

    return f"""
You are a senior technical interviewer.

Your task is to generate ONE interview question for the candidate.

CANDIDATE
Name: {candidate.member.name}
Role: {candidate.member.jobRole}
Experience: {candidate.member.yearsExperience} years
Education: {candidate.member.education}

INTERVIEW CONTEXT
Difficulty level: {topic.category}
Topic category: {topic.category}
Attempts on this topic: {topic.attempts}

CURRICULUM
Day: {context["day"]}
Topic: {context["title"]}
Type: {context["type"]}

Tools:
{", ".join(context["tools"])}

Curriculum objectives:
{objectives}

QUESTION RULES

1. Ask exactly ONE question.
2. Ground the question in the curriculum objectives.
3. Match the question to the candidate's professional experience.
4. Do not ask about technologies or concepts outside the supplied
   curriculum context.
5. If this is a PROBE topic, test deeper reasoning, trade-offs,
   implementation decisions, or troubleshooting.
6. If this is a GAP topic, test basic awareness rather than assuming
   mastery.
7. Do not mention the candidate's attempt count.
8. Do not provide an answer.
9. Avoid trivia and definition-only questions.
10. Prefer practical engineering scenarios.
11. The question should allow the candidate to explain their reasoning.

Return ONLY the interview question.
"""


def generate_question(
    candidate: Candidate,
    topic: InterviewTopic,
    curriculum: Curriculum,
) -> GeneratedQuestion:

    prompt = build_question_prompt(
        candidate,
        topic,
        curriculum,
    )

    try:
        question = generate_text(prompt).strip()

        if not question:
            raise ValueError(
                "LLM returned an empty question."
            )

    except Exception as error:
        print(
            f"Gemini unavailable. Using fallback question. "
            f"Reason: {error}"
        )

        question = get_fallback_question(topic)

    return GeneratedQuestion(
        day=topic.day,
        topic=topic.title,
        question=question,
        difficulty=(
            "advanced"
            if topic.category == "probe"
            else "intermediate"
        ),
        purpose=(
            "depth_probe"
            if topic.category == "probe"
            else "warmup"
        ),
    )

def get_fallback_question(
    topic: InterviewTopic,
) -> str:

    fallback_questions = {

        7: (
            "How would you generate embeddings for document "
            "chunks in a production pipeline, store them with "
            "their source metadata, and validate that semantically "
            "related content is represented appropriately?"
        ),

        8: (
            "You are choosing between a local vector database "
            "and a managed vector database for a production RAG "
            "system. What operational and architectural factors "
            "would drive your decision?"
        ),

        10: (
            "How would you design a retrieval and matching pipeline "
            "for a RAG system, and what techniques would you use "
            "to improve retrieval quality when the initial results "
            "are not relevant?"
        ),

        12: (
            "When evaluating Zero-Shot, Few-Shot, and Chain-of-Thought "
            "prompting for a production chatbot, how would you design "
            "a benchmark to compare factual accuracy, compliance, "
            "latency, and token cost, and how would those measurements "
            "influence your final choice?"
        ),

        16: (
            "How would you design a production FastAPI backend for "
            "an AI chatbot, including API boundaries, error handling, "
            "request validation, and integration with an external "
            "language model service?"
        ),

        22: (
            "How would you architect a multi-agent system where "
            "different agents handle specialized tasks while a "
            "controller coordinates execution and prevents conflicting "
            "or unnecessary agent calls?"
        ),

        23: (
            "How would you use the Model Context Protocol to provide "
            "an AI application with controlled access to external "
            "tools or data sources while maintaining clear boundaries "
            "between the model and those tools?"
        ),

        28: (
            "When deploying a FastAPI service on Kubernetes, how would "
            "you design container health checks and rolling updates "
            "to prevent dropped requests and maintain availability "
            "during deployments?"
        ),

        29: (
            "For a new production microservice, which metrics, logs, "
            "and traces would you instrument first, and how would you "
            "use them to diagnose a slow or failing request?"
        ),

        31: (
            "Walk through the architecture of your final AI system, "
            "including the major components, data flow, model "
            "integration, evaluation strategy, and the main production "
            "trade-offs you would consider."
        ),
    }

    return fallback_questions.get(
        topic.day,
        (
            f"Explain how you would design and implement a "
            f"production-ready solution for {topic.title}, "
            f"including the key engineering trade-offs and "
            f"failure cases you would consider."
        ),
    )