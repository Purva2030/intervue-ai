import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Clock,
  GraduationCap,
  Lightbulb,
  Loader2,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';
import type {
  Candidate,
  LearningIntelligence,
  LearningTopic,
} from '@/types/interview';
import {
  candidate as candidateData,
  getLearningIntelligence,
} from '@/services/api';

interface DashboardProps {
  onStartInterview: () => void;
}

export default function Dashboard({ onStartInterview }: DashboardProps) {
  const [candidate] = useState<Candidate>(candidateData);
  const [intelligence, setIntelligence] = useState<LearningIntelligence | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getLearningIntelligence().then((data) => {
      if (active) {
        setIntelligence(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      {/* Candidate header */}
      <section className="animate-fade-in">
        <div className="card-lg overflow-hidden">
          <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-button"
              style={{ background: 'linear-gradient(155deg, #9376ff 0%, #7c5cff 55%, #22d3c4 140%)' }}
            >
              {candidate.avatarInitials}
            </div>
            <div className="flex-1">
              <h1 className="font-display text-2xl font-bold tracking-tight text-ink-900">
                {candidate.name}
              </h1>
              <p className="mt-0.5 text-sm font-medium text-ink-500">
                {candidate.role}
              </p>
              <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs font-medium text-ink-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {candidate.yearsExperience} years experience
                </span>
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5" />
                  {candidate.education}
                </span>
              </div>
            </div>
            <div className="hidden items-center gap-2 rounded-xl border border-ink-200 bg-ink-100/50 px-3.5 py-2 sm:flex">
              <span className="h-2 w-2 animate-glow-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_-1px_rgba(52,211,153,0.9)]" />
              <span className="text-xs font-medium text-ink-500">
                Ready for interview
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Intelligence */}
      <section className="mt-8 animate-fade-in" style={{ animationDelay: '80ms' }}>
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 text-brand-300">
            <Brain className="h-5 w-5" strokeWidth={2.1} />
          </span>
          <div>
            <h2 className="text-lg font-bold text-ink-900">
              Learning Intelligence
            </h2>
            <p className="text-xs font-medium text-ink-400">
              AI-analyzed history from your learning path
            </p>
          </div>
        </div>

        {loading ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="card relative h-48 overflow-hidden p-5"
              >
                <div className="absolute inset-0 shimmer-bg animate-shimmer" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {/* High Priority */}
            <PriorityColumn
              title="High Priority"
              subtitle="High-attempt topics"
              icon={Zap}
              iconClass="text-rose-300 bg-rose-500/12"
              topics={intelligence?.highPriority ?? []}
              accent="rose"
            />

            {/* Knowledge Gap */}
            <PriorityColumn
              title="Knowledge Gap"
              subtitle="Skipped or untested"
              icon={AlertTriangle}
              iconClass="text-amber-300 bg-amber-500/12"
              topics={intelligence?.knowledgeGaps ?? []}
              accent="amber"
            />

            {/* Strong Foundations */}
            <PriorityColumn
              title="Strong Foundations"
              subtitle="Completed confidently"
              icon={CheckCircle2}
              iconClass="text-emerald-300 bg-emerald-500/12"
              topics={intelligence?.strongFoundations ?? []}
              accent="emerald"
            />
          </div>
        )}
      </section>

      {/* CTA */}
      <section
        className="mt-8 animate-fade-in"
        style={{ animationDelay: '160ms' }}
      >
        <div className="card-lg relative overflow-hidden p-6 sm:p-8">
          <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 translate-x-12 -translate-y-12 rounded-full bg-brand-500/25 blur-[70px]" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-accent-500/20 blur-[70px]" />
          <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-300" />
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-300">
                  Adaptive Interview Ready
                </span>
              </div>
              <h3 className="mt-3 font-display text-xl font-bold text-ink-900 sm:text-2xl">
                Your interview is personalized using your learning history.
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                Intervue AI analyzed {intelligence?.highPriority.length ?? 0}{' '}
                high-attempt topics and {intelligence?.knowledgeGaps.length ?? 0}{' '}
                knowledge gaps. Questions will be dynamically allocated to probe
                exactly where it matters most.
              </p>
            </div>
            <button
              onClick={onStartInterview}
              className="btn-primary group w-full shrink-0 px-6 py-3.5 text-base sm:w-auto"
            >
              Start Adaptive Interview
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Pipeline visualization */}
      <section
        className="mt-8 animate-fade-in"
        style={{ animationDelay: '220ms' }}
      >
        <Pipeline />
      </section>
    </div>
  );
}

function PriorityColumn({
  title,
  subtitle,
  icon: Icon,
  iconClass,
  topics,
  accent,
}: {
  title: string;
  subtitle: string;
  icon: typeof Zap;
  iconClass: string;
  topics: LearningTopic[];
  accent: 'rose' | 'amber' | 'emerald';
}) {
  const ring: Record<string, string> = {
    rose: 'ring-rose-500/25',
    amber: 'ring-amber-500/25',
    emerald: 'ring-emerald-500/25',
  };

  return (
    <div className={`card card-tilt overflow-hidden ring-1 ${ring[accent]}`}>
      <div className="flex items-center gap-2.5 border-b border-ink-200 px-5 py-4">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconClass}`}>
          <Icon className="h-4 w-4" strokeWidth={2.2} />
        </span>
        <div>
          <h3 className="text-sm font-bold text-ink-900">{title}</h3>
          <p className="text-[11px] font-medium text-ink-400">{subtitle}</p>
        </div>
      </div>
      <ul className="divide-y divide-ink-200">
        {topics.map((topic) => (
          <li
            key={topic.id}
            className="flex items-start justify-between gap-3 px-5 py-4 transition-colors hover:bg-ink-100/40"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink-800">
                {topic.name}
              </p>
              {topic.detail && (
                <p className="mt-1 text-xs leading-relaxed text-ink-400">
                  {topic.detail}
                </p>
              )}
            </div>
            <div className="shrink-0 text-right">
              {topic.skipped ? (
                <span className="chip bg-amber-500/12 text-amber-300 ring-1 ring-amber-500/30">
                  Skipped
                </span>
              ) : topic.status === 'strong' ? (
                <span className="chip bg-emerald-500/12 text-emerald-300 ring-1 ring-emerald-500/30">
                  <CheckCircle2 className="h-3 w-3" />
                  1 attempt
                </span>
              ) : (
                <span className="chip bg-rose-500/12 text-rose-300 ring-1 ring-rose-500/30">
                  {topic.attempts} attempts
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Pipeline() {
  const steps = [
    { label: 'Learning History', icon: BookOpen },
    { label: 'AI Analysis', icon: Brain },
    { label: 'Interview Strategy', icon: Target },
    { label: 'Priority Question', icon: Zap },
    { label: 'Candidate Answer', icon: Lightbulb },
    { label: 'AI Evaluation', icon: Loader2 },
    { label: 'Adaptive Follow-up', icon: ArrowRight },
    { label: 'Final Assessment', icon: CheckCircle2 },
  ];

  return (
    <div className="card-lg p-6 sm:p-8">
      <h3 className="text-sm font-bold text-ink-900">How Intervue AI works</h3>
      <p className="mt-1 text-xs text-ink-400">
        The adaptive pipeline, from history to final assessment — signal flows
        left to right through each stage of the engine.
      </p>
      <div className="mt-7 flex items-start overflow-x-auto pb-3">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-start">
            <div className="flex w-20 flex-col items-center gap-2.5 sm:w-24">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-brand-200 bg-ink-100 shadow-card">
                <step.icon className="h-5 w-5 text-brand-300" strokeWidth={2} />
                {i === 0 && (
                  <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-glow-pulse rounded-full bg-accent-400 shadow-glow-cyan" />
                )}
              </div>
              <span className="text-center text-[10px] font-semibold leading-tight text-ink-500">
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="relative mt-[24px] h-px w-6 shrink-0 overflow-hidden bg-ink-200 sm:w-10">
                <div className="absolute inset-0 shimmer-bg animate-shimmer" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
