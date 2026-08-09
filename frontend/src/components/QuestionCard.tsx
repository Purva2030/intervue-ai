import { AlertTriangle, ArrowUpRight, CheckCircle2, Layers } from 'lucide-react';
import type { InterviewQuestion } from '@/types/interview';
import TopicBadge from './TopicBadge';

interface QuestionCardProps {
  question: InterviewQuestion;
  questionNumber: number;
  totalQuestions: number;
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
}: QuestionCardProps) {
  return (
    <article className="card-lg card-tilt animate-scale-in overflow-hidden p-6 sm:p-8">
      {/* Topic header */}
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand-300">
          <Layers className="h-4 w-4" strokeWidth={2.2} />
        </span>
        <h2 className="text-sm font-semibold text-ink-900">
          {question.topicName}
        </h2>
        <TopicBadge priority={question.priority} />
        <TopicBadge difficulty={question.difficulty} variant="difficulty" />
        {question.isFollowUp && (
          <span className="chip bg-accent-500/12 text-accent-400 ring-1 ring-accent-500/30">
            <ArrowUpRight className="h-3 w-3" />
            ADAPTIVE FOLLOW-UP
          </span>
        )}
      </div>

      {/* Question number */}
      <div className="mt-6 flex items-center gap-2 font-mono-num text-xs font-medium uppercase tracking-[0.14em] text-ink-400">
        <span>
          Question {questionNumber} of {totalQuestions}
        </span>
      </div>

      {/* Title */}
      <h3 className="mt-2 font-display text-xl font-bold leading-snug text-ink-900 sm:text-2xl">
        {question.title}
      </h3>

      {/* Prompt */}
      <p className="mt-4 text-[15px] leading-relaxed text-ink-600">
        {question.prompt}
      </p>

      {/* Reason strip — surfaces adaptive logic */}
      <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-ink-200 bg-ink-100/60 p-3.5">
        {question.isFollowUp ? (
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
        ) : (
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
        )}
        <p className="text-[13px] leading-relaxed text-ink-500">
          <span className="font-semibold text-ink-700">
            Why this question:{' '}
          </span>
          {question.reason}
        </p>
      </div>
    </article>
  );
}
