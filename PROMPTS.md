# \# Intervue AI — AI Development Prompts

# 

# This document records the prompts and AI-assisted development workflow used while building Intervue AI.

# 

# \## Project

# 

# \*\*Intervue AI — Adaptive Technical Interview Platform\*\*

# 

# Intervue AI is an adaptive technical interview system that uses a candidate profile, curriculum context, previous answers, and answer evaluations to dynamically determine the next interview question.

# 

# \---

# 

# \# 1. Project Architecture

# 

# \### Prompt

# 

# > Build an adaptive technical interview platform with a React/Vite frontend and a Python/FastAPI backend.

# >

# > The system should:

# > - analyze a candidate profile

# > - load curriculum information

# > - allocate interview topics

# > - generate technical questions

# > - evaluate candidate answers

# > - adapt follow-up questions based on performance

# > - generate a final technical assessment

# >

# > Keep the backend modular with separate models, services, LLM provider, and interview controller layers.

# 

# \### Result

# 

# The project was organized into:

# 

# ```text

# backend/

# ├── app/

# │   ├── data/

# │   ├── llm/

# │   ├── models/

# │   └── services/

# └── tests/

# 

# frontend/

# └── src/

# &#x20;   ├── components/

# &#x20;   ├── pages/

# &#x20;   ├── services/

# &#x20;   └── types/





2\. Candidate Model

Prompt



Create Pydantic models for a candidate profile containing member information, interview missions, and learning signals.



Member information should include:



id

name

job role

years of experience

education

status



Missions should contain:



day

title

passed

skipped

attempts



Signals should contain:



commit days

missions completed

missions completed on first try.

Generated implementation



The backend uses Pydantic models to represent candidate information and learning signals.



3\. Curriculum and Question Context

Prompt



Build a curriculum-driven question context service.



A generated interview question must only use the supplied curriculum context.



The context should include:



day

title

type

tools

objectives



The question generator should receive a candidate, interview topic, and curriculum.



Result



A dedicated question\_context.py service was created so that question generation remains grounded in the supplied curriculum.



4\. Adaptive Question Generator

Prompt



Generate exactly one technical interview question using the candidate profile, interview topic, curriculum objectives, difficulty category, and previous learning context.



Rules:



Ask exactly one question.

Ground the question in curriculum objectives.

Match the question to the candidate's experience.

Do not introduce technologies outside the supplied curriculum.

For probe topics, test deeper reasoning, trade-offs, implementation decisions, or troubleshooting.

For gap topics, test basic awareness.

Avoid trivia and definition-only questions.

Prefer practical engineering scenarios.

Return only the interview question.

Result



The question generation service was implemented in:



backend/app/services/question\_generator.py



Questions are generated through the LLM provider and returned as structured interview question objects.



5\. Gemini LLM Provider

Prompt



Create a reusable Gemini provider for the backend.



It should:



load GEMINI\_API\_KEY from environment variables

provide text generation

provide structured Pydantic-model generation

retry failed requests

raise meaningful errors when generation fails.

Result



The provider was implemented in:



backend/app/llm/provider.py



It exposes:



generate\_text()

generate\_structured()



The API key is loaded from .env and is not committed to the repository.



6\. Answer Evaluation

Prompt



Create an AI-based technical answer evaluator.



Evaluate:



Technical correctness

Reasoning depth

Practical understanding

Communication



Determine:



whether the candidate actually answered the question

classification: strong, partial, or weak

recommended next action: deepen, clarify, or fundamentals

strengths

weaknesses



A repeated interview question should not be considered a valid technical answer.



If the candidate does not actually answer the question:



answered = false

classification = weak

all technical dimensions = 1

recommended action = fundamentals.

Result



The evaluator was implemented as:



backend/app/services/answer\_evaluator.py



Structured LLM output is mapped to the AnswerEvaluation model.



7\. Adaptive Follow-Up Questions

Prompt



Generate an adaptive follow-up question based on the candidate's previous question, answer, evaluation, curriculum, and recommended action.



If the action is:



deepen



ask a harder follow-up

focus on reasoning, trade-offs, architecture, implementation details, or edge cases



clarify



ask a targeted question about the missing concept

do not repeat the previous question



fundamentals



check an underlying prerequisite

use a simpler but technically meaningful question



The follow-up must remain grounded in the curriculum.



Result



The adaptive follow-up generation logic was integrated into the interview flow.



Follow-up questions are generated from the evidence of the previous response rather than from a fixed sequence.



8\. Interview Controller

Prompt



Connect candidate analysis, adaptive topic allocation, question generation, answer evaluation, follow-up generation, and final assessment into a single interview controller.



The interview API should accept the current interview session and return the next interview state.



Result



The backend exposes the interview API through:



/api/interview



The controller coordinates the adaptive interview lifecycle.



9\. Final Assessment

Prompt



Generate a final technical assessment from the complete interview evidence.



The assessment should contain:



summary

strengths

gaps

next recommendation



Consider the complete interview rather than judging the candidate from a single answer.



Do not invent skills that were not demonstrated.



Return only structured assessment fields.



Result



The final assessment service was implemented in:



backend/app/services/final\_assessment.py



The assessment is generated after interview completion.



10\. React Frontend

Prompt



Build a professional technical interview interface for Intervue AI using React, TypeScript, Vite, and Tailwind CSS.



Create:



Dashboard

Interview screen

Assessment screen

navigation

progress indicators

question cards

evaluation panels

score/assessment components.



The interface should have a modern AI-product aesthetic with dark backgrounds, glass-style cards, purple/blue accents, clear typography, and responsive layouts.



Result



The frontend was organized into reusable React components:



frontend/src/

├── components/

│   ├── EvaluationPanel.tsx

│   ├── Navbar.tsx

│   ├── ProgressBar.tsx

│   ├── QuestionCard.tsx

│   ├── ScoreCard.tsx

│   └── TopicBadge.tsx

│

├── pages/

│   ├── Dashboard.tsx

│   ├── Interview.tsx

│   └── Assessment.tsx

│

├── services/

│   └── api.ts

│

└── types/

&#x20;   └── interview.ts

11\. Frontend TypeScript Debugging

Prompt



Run TypeScript type checking and fix all frontend API import/export mismatches.



During development, the type checker identified missing exports such as:



assessmentResult

analyzeAnswer

selectFollowUp



The frontend API layer was updated to match the backend-driven architecture.



Final verification:



npm run typecheck



completed without TypeScript errors.



12\. Backend Debugging

Prompt



Diagnose the FastAPI interview endpoint returning HTTP 500 errors and identify whether the failure originates in the frontend, backend, or Gemini provider.



The backend logs identified an LLM dependency issue and later a Gemini quota limitation.



The Gemini API returned:



429 RESOURCE\_EXHAUSTED



because the free-tier request quota for the selected model had been exhausted.



Fallback behavior was implemented for question generation and answer evaluation where appropriate.



13\. End-to-End Interview Testing

Prompt



Test the complete interview flow:



Start interview

Generate question 1

Submit answer

Evaluate answer

Generate adaptive follow-up

Continue through the interview

Complete all questions

Generate final assessment

Display assessment in the frontend.



The complete flow was tested through the local React frontend and FastAPI backend.



The system successfully progressed through the adaptive interview and displayed the final assessment.



14\. Git Repository Preparation

Prompt



Prepare the complete frontend and backend as a single public GitHub repository suitable for hackathon submission.



Ensure:



.env files are excluded

Python virtual environments are excluded

node\_modules are excluded

build artifacts are excluded

frontend and backend source code are included.



The final repository structure is:



intervue-ai/

├── backend/

│   ├── app/

│   ├── requirements.txt

│   └── tests

├── frontend/

│   ├── src/

│   ├── package.json

│   └── configuration files

├── .gitignore

└── PROMPTS.md

15\. Development Philosophy



The project was developed iteratively using AI-assisted coding and debugging.



The workflow was:



Idea

&#x20; ↓

Architecture

&#x20; ↓

Backend models

&#x20; ↓

Adaptive engine

&#x20; ↓

LLM integration

&#x20; ↓

Question generation

&#x20; ↓

Answer evaluation

&#x20; ↓

Adaptive follow-up

&#x20; ↓

Final assessment

&#x20; ↓

React frontend

&#x20; ↓

Integration

&#x20; ↓

Debugging

&#x20; ↓

End-to-end testing



AI assistance was used for:



architecture decisions

code generation

implementation

debugging

API integration

prompt engineering

TypeScript error resolution

backend error diagnosis

UI development

testing and refinement



The final implementation was manually tested locally and iteratively corrected based on actual runtime behavior.

