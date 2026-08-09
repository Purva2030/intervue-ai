import { useEffect, useState } from 'react';
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Loader2,
  Send,
  Sparkles,
  Wand2,
} from 'lucide-react';

import EvaluationPanel from '@/components/EvaluationPanel';
import QuestionCard from '@/components/QuestionCard';

interface InterviewProps {
  onComplete: () => void;
}

interface BackendQuestion {
  day: number;
  topic: string;
  question: string;
  difficulty: 'foundational' | 'intermediate' | 'advanced';
  purpose:
    | 'warmup'
    | 'depth_probe'
    | 'gap_check'
    | 'system_design'
    | 'capstone';
}

interface BackendAssessment {
  summary: string;
  strengths: string[];
  gaps: string[];
  next: string;
}

interface InterviewResponse {
  sessionId: string;
  message: string;
  done: boolean;
  assessment?: BackendAssessment | null;
}

interface UIQuestion {
  id: string;
  index: number;
  topicId: string;
  topicName: string;
  priority: 'high' | 'medium' | 'low';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  title: string;
  prompt: string;
  format: 'open' | 'follow-up';
  reason: string;
  isFollowUp: boolean;
}

interface Intelligence {
  currentTopic: string;
  priority: 'high' | 'medium' | 'low';
  questionsAllocated: number;
  questionsCompleted: number;
  reason: string;
}

function buildCandidatePayload() {
  return {
    member: {
      id: 'CAND-001',
      name: 'Sarah Johnson',
      jobRole: 'Senior Data Engineer',
      yearsExperience: 9,
      education: 'MS Computer Science',
      status: 'active',
    },

    missions: [
      {
        day: 7,
        title: 'Embeddings Explained',
        passed: true,
        skipped: false,
        attempts: 1,
      },
      {
        day: 8,
        title: 'Vector Databases Overview',
        passed: true,
        skipped: false,
        attempts: 1,
      },
      {
        day: 10,
        title: 'Retrieval & Matching Engine',
        passed: true,
        skipped: false,
        attempts: 2,
      },
      {
        day: 12,
        title: 'Prompt Engineering Fundamentals',
        passed: true,
        skipped: false,
        attempts: 4,
      },
      {
        day: 16,
        title: 'Chatbot Backend & API Integration',
        passed: true,
        skipped: false,
        attempts: 1,
      },
      {
        day: 22,
        title: 'Multi-Agent Orchestration',
        passed: true,
        skipped: false,
        attempts: 2,
      },
      {
        day: 23,
        title: 'Model Context Protocol (MCP)',
        passed: true,
        skipped: false,
        attempts: 2,
      },
      {
        day: 28,
        title: 'Docker & Kubernetes Deployment',
        passed: true,
        skipped: false,
        attempts: 3,
      },
      {
        day: 29,
        title: 'Monitoring, Logging & Observability',
        passed: null,
        skipped: true,
        attempts: null,
      },
      {
        day: 31,
        title: 'Capstone Project & Final Demo',
        passed: true,
        skipped: false,
        attempts: 1,
      },
    ],

    signals: {
      commitDays: 28,
      missionsCompleted: 30,
      missionsFirstTry: 20,
    },
  };
}

function mapDifficulty(
  difficulty: BackendQuestion['difficulty'],
): 'beginner' | 'intermediate' | 'advanced' {
  if (difficulty === 'foundational') {
    return 'intermediate';
  }

  return difficulty;
}

function mapQuestion(
  response: InterviewResponse,
  previousQuestion: UIQuestion | null,
): UIQuestion {
  const questionNumber = previousQuestion
    ? previousQuestion.index + 1
    : 1;

  const topic = previousQuestion?.topicName ?? 'Adaptive Interview';

  return {
    id: `question-${questionNumber}-${Date.now()}`,
    index: questionNumber,
    topicId: topic.toLowerCase().replace(/\s+/g, '-'),
    topicName: topic,
    priority: previousQuestion?.priority ?? 'high',
    difficulty: previousQuestion?.difficulty ?? 'advanced',
    title: previousQuestion?.title ?? 'Technical Interview Question',
    prompt: response.message,
    format: previousQuestion ? 'follow-up' : 'open',
    reason:
      previousQuestion
        ? 'Generated adaptively from your previous response.'
        : 'Selected by the adaptive interview strategy.',
    isFollowUp: Boolean(previousQuestion),
  };
}

export default function Interview({ onComplete }: InterviewProps) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [question, setQuestion] = useState<UIQuestion | null>(null);
  const [answer, setAnswer] = useState('');
  const [phase, setPhase] = useState<
    'starting' | 'awaiting-answer' | 'analyzing' | 'follow-up-selected'
  >('starting');

  const [questionNumber, setQuestionNumber] = useState(1);

  const [intelligence, setIntelligence] = useState<Intelligence>({
    currentTopic: 'Prompt Engineering Fundamentals',
    priority: 'high',
    questionsAllocated: 2,
    questionsCompleted: 0,
    reason: 'Selected from the candidate learning profile.',
  });

  useEffect(() => {
    startInterview();
  }, []);

  async function startInterview() {
    try {
      setPhase('starting');

      const response = await fetch('http://127.0.0.1:8000/api/interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: null,
          candidate: buildCandidatePayload(),
          message: '',
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`);
      }

      const data: InterviewResponse = await response.json();

      const firstQuestion: UIQuestion = {
        id: 'question-1',
        index: 1,
        topicId: 'prompt-engineering',
        topicName: 'Prompt Engineering Fundamentals',
        priority: 'high',
        difficulty: 'advanced',
        title: 'Adaptive Technical Question',
        prompt: data.message,
        format: 'open',
        reason: 'Selected by the adaptive interview strategy.',
        isFollowUp: false,
      };

      setSessionId(data.sessionId);
      setQuestion(firstQuestion);
      setQuestionNumber(1);

      setIntelligence({
        currentTopic: 'Prompt Engineering Fundamentals',
        priority: 'high',
        questionsAllocated: 2,
        questionsCompleted: 0,
        reason:
          'Candidate required multiple attempts on this topic, so the adaptive engine is probing deeper.',
      });

      setPhase('awaiting-answer');
    } catch (error) {
      console.error('Failed to start interview:', error);
      setPhase('awaiting-answer');
    }
  }

  async function handleSubmit() {
    if (!answer.trim() || !sessionId || !question) {
      return;
    }

    const submittedAnswer = answer.trim();

    setAnswer('');
    setPhase('analyzing');

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/interview',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            message: submittedAnswer,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`);
      }

      const data: InterviewResponse = await response.json();

      if (data.done) {
        if (data.assessment) {
          sessionStorage.setItem(
            'interviewAssessment',
            JSON.stringify(data.assessment),
          );
        }

        setPhase('follow-up-selected');

        setTimeout(() => {
          onComplete();
        }, 1000);

        return;
      }

      setPhase('follow-up-selected');

      setIntelligence((previous) => ({
        ...previous,
        questionsCompleted:
          previous.questionsCompleted + 1,
      }));

      setTimeout(() => {
        const nextQuestion = mapQuestion(data, question);

        setQuestion(nextQuestion);
        setQuestionNumber((previous) => previous + 1);
        setPhase('awaiting-answer');
      }, 1200);
    } catch (error) {
      console.error('Failed to submit answer:', error);
      setPhase('awaiting-answer');
    }
  }

  if (phase === 'starting' || !question) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center px-4">
        <div className="card-lg w-full max-w-xl p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100">
            <Loader2 className="h-7 w-7 animate-spin text-brand-500" />
          </div>

          <h2 className="mt-5 text-lg font-bold text-ink-900">
            Preparing your adaptive interview…
          </h2>

          <p className="mt-2 text-sm text-ink-500">
            Intervue AI is analyzing the candidate profile and selecting
            the first technical question.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-button"
            style={{
              background:
                'linear-gradient(155deg, #9376ff 0%, #7c5cff 50%, #22d3c4 130%)',
            }}
          >
            <BrainCircuit className="h-5 w-5" strokeWidth={2.2} />
          </span>

          <div>
            <p className="font-display text-sm font-bold tracking-tight text-ink-900">
              INTERVUE AI
            </p>

            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-400">
              Adaptive Interview Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-ink-200 bg-ink-100/50 px-3.5 py-2 shadow-card">
          <span className="text-xs font-medium text-ink-400">
            Question
          </span>

          <span className="font-mono-num text-sm font-bold text-ink-900">
            {questionNumber}
          </span>

          <span className="text-xs font-medium text-ink-400">
            / 10
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-400 transition-all duration-700 ease-out"
          style={{
            width: `${Math.min((questionNumber / 10) * 100, 100)}%`,
          }}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main column */}
        <div className="min-w-0">
          <QuestionCard
            key={question.id}
            question={question}
            questionNumber={questionNumber}
            totalQuestions={10}
          />

          {/* Answer */}
          <div className="mt-6 card-lg p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <label
                htmlFor="answer"
                className="text-sm font-bold text-ink-900"
              >
                Your Answer
              </label>

              <span className="font-mono-num text-xs font-medium text-ink-400">
                {answer.length} characters
              </span>
            </div>

            <textarea
              id="answer"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              disabled={phase !== 'awaiting-answer'}
              placeholder="Type your detailed response here. Walk through your reasoning step by step…"
              className="mt-3 min-h-[180px] w-full rounded-xl border border-ink-200 bg-ink-50/60 px-4 py-3.5 text-[15px] leading-relaxed text-ink-800 placeholder:text-ink-400 transition-all focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:opacity-60"
            />

            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-ink-400">
                Take your time — structured reasoning is rewarded.
              </p>

              <button
                onClick={handleSubmit}
                disabled={
                  !answer.trim() ||
                  phase !== 'awaiting-answer'
                }
                className="btn-primary"
              >
                <Send className="h-4 w-4" />
                Submit Answer
              </button>
            </div>
          </div>

          {phase === 'analyzing' && <AnalyzingState />}

          {phase === 'follow-up-selected' && (
            <FollowUpState />
          )}
        </div>

        {/* Intelligence */}
        <div className="lg:py-0">
          <EvaluationPanel intelligence={intelligence} />
        </div>
      </div>
    </div>
  );
}

function AnalyzingState() {
  return (
    <div className="mt-6 card-lg animate-scale-in overflow-hidden p-6 sm:p-8">
      <div className="flex items-center gap-4">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-100">
          <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
        </div>

        <div>
          <h3 className="text-base font-bold text-ink-900">
            Analyzing your response…
          </h3>

          <p className="mt-0.5 text-sm text-ink-500">
            Intervue AI is evaluating correctness, reasoning depth,
            and knowledge gaps.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {[
          'Parsing technical correctness',
          'Mapping reasoning chains',
          'Detecting knowledge boundaries',
          'Selecting adaptive follow-up',
        ].map((step, index) => (
          <div
            key={step}
            className="flex items-center gap-3 animate-fade-in"
            style={{ animationDelay: `${index * 350}ms` }}
          >
            <div className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse" />
            <span className="text-xs font-medium text-ink-500">
              {step}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-ink-100">
        <div className="h-full w-1/3 rounded-full bg-brand-500 animate-pulse" />
      </div>
    </div>
  );
}

function FollowUpState() {
  return (
    <div className="mt-6 card-lg animate-scale-in overflow-hidden border-brand-200 p-6 sm:p-8">
      <div className="flex items-center gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-button"
          style={{
            background:
              'linear-gradient(155deg, #9376ff 0%, #7c5cff 50%, #22d3c4 130%)',
          }}
        >
          <Wand2 className="h-6 w-6" strokeWidth={2.1} />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-300" />

            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-300">
              Adaptive Engine
            </span>
          </div>

          <h3 className="mt-1 text-base font-bold text-ink-900">
            Adaptive follow-up selected
          </h3>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-ink-600">
        Your response has been evaluated. Intervue AI is using the
        evaluation to determine the next question and difficulty.
      </p>

      <div className="mt-5 flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 p-3.5">
        <ArrowRight className="h-4 w-4 text-brand-300" />

        <span className="text-xs font-medium text-brand-300">
          Preparing next technical probe…
        </span>
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-xs text-ink-400">
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />

        Response evaluated

        <span className="mx-1.5">·</span>

        <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-400" />

        Loading next question
      </div>
    </div>
  );
}