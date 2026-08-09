import { BrainCircuit } from 'lucide-react';
import type { AppView } from '@/types/interview';

interface NavbarProps {
  view: AppView;
  onNavigate: (view: AppView) => void;
}

const navItems: { id: AppView; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'interview', label: 'Interview' },
  { id: 'assessment', label: 'Assessment' },
];

export default function Navbar({ view, onNavigate }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-200 bg-ink-50/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-button"
            style={{ background: 'linear-gradient(155deg, #9376ff 0%, #7c5cff 50%, #22d3c4 130%)' }}
          >
            <BrainCircuit className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <div className="flex flex-col items-start leading-none">
            <span className="font-display text-[15px] font-bold tracking-tight text-ink-900">
              Intervue<span className="text-brand-400"> AI</span>
            </span>
            <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-ink-400">
              Adaptive Interviews
            </span>
          </div>
        </button>

        <nav className="hidden items-center gap-1 sm:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                view === item.id
                  ? 'bg-brand-100 text-brand-300 shadow-glow-sm'
                  : 'text-ink-500 hover:bg-ink-100 hover:text-ink-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden text-xs font-medium text-ink-400 md:inline">
            Enterprise Demo
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-100 text-sm font-semibold text-ink-700 ring-1 ring-ink-200">
            SJ
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="flex items-center gap-1 border-t border-ink-200 px-3 py-2 sm:hidden">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-all ${
              view === item.id
                ? 'bg-brand-100 text-brand-300'
                : 'text-ink-500 hover:bg-ink-100'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
