import type { ScoreBreakdown } from '@/types/interview';

interface ScoreCardProps {
  breakdown: ScoreBreakdown;
  delay?: number;
}

const categoryAccent: Record<string, string> = {
  technical: 'text-brand-300',
  reasoning: 'text-accent-400',
  practical: 'text-emerald-300',
  communication: 'text-amber-300',
};

const categoryRing: Record<string, string> = {
  technical: 'ring-brand-200',
  reasoning: 'ring-accent-500/25',
  practical: 'ring-emerald-500/25',
  communication: 'ring-amber-500/25',
};

const categoryBar: Record<string, string> = {
  technical: 'from-brand-400 to-brand-600',
  reasoning: 'from-accent-400 to-accent-600',
  practical: 'from-emerald-400 to-emerald-500',
  communication: 'from-amber-400 to-amber-500',
};

const categoryGlow: Record<string, string> = {
  technical: 'shadow-[0_0_14px_-3px_rgba(124,92,255,0.75)]',
  reasoning: 'shadow-[0_0_14px_-3px_rgba(34,211,196,0.75)]',
  practical: 'shadow-[0_0_14px_-3px_rgba(52,211,153,0.75)]',
  communication: 'shadow-[0_0_14px_-3px_rgba(251,191,36,0.75)]',
};

export default function ScoreCard({ breakdown, delay = 0 }: ScoreCardProps) {
  const pct = Math.round((breakdown.score / breakdown.max) * 100);
  const accent = categoryAccent[breakdown.category] ?? 'text-brand-300';
  const ring = categoryRing[breakdown.category] ?? 'ring-brand-200';
  const bar = categoryBar[breakdown.category] ?? 'from-brand-400 to-brand-600';
  const glow = categoryGlow[breakdown.category] ?? '';

  return (
    <div
      className={`card card-tilt animate-slide-up p-5 ring-1 ${ring}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-baseline justify-between">
        <h4 className="text-sm font-semibold text-ink-700">
          {breakdown.label}
        </h4>
        <div className="flex items-baseline gap-0.5 font-mono-num">
          <span className={`text-2xl font-bold ${accent}`}>
            {breakdown.score}
          </span>
          <span className="text-sm font-medium text-ink-400">
            /{breakdown.max}
          </span>
        </div>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${bar} ${glow} transition-all duration-1000 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className="mt-3 text-xs leading-relaxed text-ink-400">
        {breakdown.description}
      </p>
    </div>
  );
}
