import { Activity, Crosshair, Gauge, ListChecks, Target } from 'lucide-react';
import type { InterviewIntelligencePanel } from '@/types/interview';
import ProgressBar from './ProgressBar';
import TopicBadge from './TopicBadge';

interface EvaluationPanelProps {
  intelligence: InterviewIntelligencePanel;
}

export default function EvaluationPanel({ intelligence }: EvaluationPanelProps) {
  const rows = [
    {
      icon: Target,
      label: 'Current Topic',
      value: intelligence.currentTopic,
    },
    {
      icon: Crosshair,
      label: 'Priority',
      value: <TopicBadge priority={intelligence.priority} />,
    },
    {
      icon: ListChecks,
      label: 'Questions Allocated',
      value: intelligence.questionsAllocated,
    },
    {
      icon: Gauge,
      label: 'Progress',
      value: (
        <span className="font-mono-num text-sm font-semibold text-ink-800">
          {intelligence.questionsCompleted} / {intelligence.questionsAllocated}
        </span>
      ),
    },
  ];

  return (
    <aside className="card sticky top-20 overflow-hidden">
      <div className="flex items-center gap-2.5 border-b border-ink-200 px-5 py-4">
        <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand-300">
          <Activity className="h-4 w-4" strokeWidth={2.2} />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 animate-glow-pulse rounded-full bg-accent-400 shadow-glow-cyan" />
        </span>
        <div>
          <h3 className="text-sm font-bold text-ink-900">
            Interview Intelligence
          </h3>
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-400">
            Live adaptive engine
          </p>
        </div>
      </div>

      <div className="px-5 py-4">
        <dl className="space-y-3.5">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-3">
              <dt className="flex items-center gap-2 text-xs font-medium text-ink-500">
                <row.icon className="h-3.5 w-3.5 text-ink-400" />
                {row.label}
              </dt>
              <dd className="text-sm font-semibold text-ink-800">{row.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-4">
          <ProgressBar
            value={intelligence.questionsCompleted}
            max={intelligence.questionsAllocated}
            label="Topic progress"
          />
        </div>

        <div className="mt-5 rounded-xl border border-brand-200 bg-brand-50 p-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-300">
            Allocation Reason
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink-600">
            “{intelligence.reason}”
          </p>
        </div>
      </div>
    </aside>
  );
}
