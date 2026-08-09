import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Dashboard from '@/pages/Dashboard';
import Interview from '@/pages/Interview';
import Assessment from '@/pages/Assessment';
import type { AppView } from '@/types/interview';

export default function App() {
  const [view, setView] = useState<AppView>('dashboard');

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink-50">
      {/* Ambient depth layer: fixed dot grid + soft floating glow orbs sit
          behind every screen so glass cards have something to catch. */}
      <div className="pointer-events-none fixed inset-0 -z-10 grid-dot opacity-40" />
      <div className="pointer-events-none fixed -top-32 left-[-10%] -z-10 h-96 w-96 animate-float rounded-full bg-brand-500/20 blur-[100px]" />
      <div
        className="pointer-events-none fixed -right-24 top-1/3 -z-10 h-80 w-80 animate-float rounded-full bg-accent-500/14 blur-[100px]"
        style={{ animationDelay: '-3s' }}
      />

      <Navbar view={view} onNavigate={setView} />
      <main className="relative">
        {view === 'dashboard' && (
          <Dashboard onStartInterview={() => setView('interview')} />
        )}
        {view === 'interview' && (
          <Interview onComplete={() => setView('assessment')} />
        )}
        {view === 'assessment' && (
          <Assessment onRestart={() => setView('dashboard')} />
        )}
      </main>
      <footer className="relative border-t border-ink-200">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-medium text-ink-400">
            Intervue AI — Adaptive technical interviews powered by learning
            intelligence
          </p>
        </div>
      </footer>
    </div>
  );
}
