import type { Priority, Difficulty } from '@/types/interview';

interface TopicBadgeProps {
  priority?: Priority;
  difficulty?: Difficulty;
  label?: string;
  variant?: 'priority' | 'difficulty' | 'custom';
}

const priorityStyles: Record<Priority, { label: string; className: string }> = {
  high: {
    label: 'HIGH PRIORITY',
    className: 'bg-rose-500/12 text-rose-300 ring-1 ring-rose-500/30',
  },
  medium: {
    label: 'MEDIUM PRIORITY',
    className: 'bg-amber-500/12 text-amber-300 ring-1 ring-amber-500/30',
  },
  low: {
    label: 'LOW PRIORITY',
    className: 'bg-ink-100 text-ink-500 ring-1 ring-ink-200',
  },
};

const difficultyStyles: Record<Difficulty, { label: string; className: string }> = {
  beginner: {
    label: 'BEGINNER',
    className: 'bg-emerald-500/12 text-emerald-300 ring-1 ring-emerald-500/30',
  },
  intermediate: {
    label: 'INTERMEDIATE',
    className: 'bg-brand-100 text-brand-300 ring-1 ring-brand-200',
  },
  advanced: {
    label: 'ADVANCED',
    className: 'bg-gradient-to-br from-brand-500 to-accent-500 text-white ring-1 ring-white/20 shadow-glow-sm',
  },
};

export default function TopicBadge({
  priority,
  difficulty,
  label,
  variant = 'priority',
}: TopicBadgeProps) {
  if (variant === 'custom' && label) {
    return (
      <span className="chip bg-ink-100 text-ink-500 ring-1 ring-ink-200">
        {label}
      </span>
    );
  }

  if (variant === 'difficulty' && difficulty) {
    const s = difficultyStyles[difficulty];
    return <span className={`chip ${s.className}`}>{s.label}</span>;
  }

  if (priority) {
    const s = priorityStyles[priority];
    return <span className={`chip ${s.className}`}>{s.label}</span>;
  }

  return null;
}
