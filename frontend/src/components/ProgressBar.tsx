interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  variant?: 'default' | 'compact';
}

export default function ProgressBar({
  value,
  max,
  label,
  variant = 'default',
}: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  const isCompact = variant === 'compact';

  return (
    <div className="w-full">
      {!isCompact && label && (
        <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-ink-500">
          <span>{label}</span>
          <span className="font-mono-num text-ink-700">
            {value} / {max}
          </span>
        </div>
      )}
      <div
        className={`w-full overflow-hidden rounded-full bg-ink-100 shadow-[0_1px_2px_rgba(0,0,0,0.4)_inset] ${
          isCompact ? 'h-1.5' : 'h-2'
        }`}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-400 shadow-[0_0_10px_-2px_rgba(124,92,255,0.8)] transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
