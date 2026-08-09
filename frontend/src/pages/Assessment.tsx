import { useEffect, useState } from 'react';
import {
  Award,
  CheckCircle2,
  Download,
  Eye,
  Lightbulb,
  Loader2,
  RefreshCw,
} from 'lucide-react';

interface AssessmentResult {
  summary: string;
  strengths: string[];
  gaps: string[];
  next: string;
}

interface AssessmentProps {
  onRestart: () => void;
}

export default function Assessment({ onRestart }: AssessmentProps) {
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem('interviewAssessment');

    if (stored) {
      try {
        const data = JSON.parse(stored);
        setResult(data);
      } catch (error) {
        console.error('Failed to parse assessment:', error);
      }
    }

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-24">
        <div className="flex flex-col items-center gap-3 text-ink-400">
          <Loader2 className="h-7 w-7 animate-spin-slow text-brand-400" />
          <p className="text-sm font-medium">
            Compiling assessment…
          </p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-4 py-24 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/12 text-amber-300">
          <Eye className="h-7 w-7" />
        </div>

        <h1 className="mt-4 text-2xl font-bold text-ink-900">
          Assessment Not Available
        </h1>

        <p className="mt-2 max-w-md text-sm text-ink-500">
          The interview assessment could not be loaded.
          Please complete the interview again.
        </p>

        <button
          onClick={onRestart}
          className="btn-primary mt-6"
        >
          <RefreshCw className="h-4 w-4" />
          Restart Interview
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

      {/* Header */}
      <section className="animate-fade-in text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/12 text-emerald-300 ring-1 ring-emerald-500/30">
          <Award className="h-7 w-7" strokeWidth={2.1} />
        </div>

        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink-900">
          Interview Complete
        </h1>

        <p className="mt-1.5 text-sm font-medium text-ink-500">
          AI-generated technical assessment
        </p>
      </section>

      {/* Overall Assessment */}
      <section className="mt-8 animate-scale-in">
        <div className="card-lg mx-auto max-w-4xl overflow-hidden p-6 sm:p-8">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand-300">
              <Award className="h-4 w-4" />
            </span>

            <h2 className="text-sm font-bold text-ink-900">
              Overall Assessment
            </h2>
          </div>

          <p className="mt-5 text-[15px] leading-relaxed text-ink-600">
            {result.summary}
          </p>
        </div>
      </section>

      {/* Strengths & Gaps */}
      <section className="mt-8 grid gap-4 lg:grid-cols-2">

        {/* Strengths */}
        <div className="card-lg animate-slide-up p-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/12 text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
            </span>

            <h3 className="text-sm font-bold text-ink-900">
              Strengths
            </h3>
          </div>

          <ul className="mt-4 space-y-3">
            {result.strengths.map((strength, index) => (
              <li
                key={`${strength}-${index}`}
                className="flex items-start gap-2.5"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />

                <span className="text-sm leading-relaxed text-ink-600">
                  {strength}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Knowledge Gaps */}
        <div className="card-lg animate-slide-up p-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/12 text-amber-300">
              <Eye className="h-4 w-4" />
            </span>

            <h3 className="text-sm font-bold text-ink-900">
              Knowledge Gaps
            </h3>
          </div>

          <ul className="mt-4 space-y-3">
            {result.gaps.map((gap, index) => (
              <li
                key={`${gap}-${index}`}
                className="flex items-start gap-2.5"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />

                <span className="text-sm leading-relaxed text-ink-600">
                  {gap}
                </span>
              </li>
            ))}
          </ul>
        </div>

      </section>

      {/* AI Recommendation */}
      <section className="mt-8 card-lg animate-slide-up overflow-hidden p-6 sm:p-8">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white shadow-button"
            style={{
              background:
                'linear-gradient(155deg, #9376ff 0%, #7c5cff 50%, #22d3c4 130%)',
            }}
          >
            <Lightbulb className="h-4 w-4" />
          </span>

          <h3 className="text-sm font-bold text-ink-900">
            AI Recommendation
          </h3>
        </div>

        <p className="mt-4 text-[15px] leading-relaxed text-ink-600">
          {result.next}
        </p>
      </section>

      {/* Actions */}
      <section className="mt-8 flex animate-fade-in flex-col gap-3 sm:flex-row sm:justify-center">

        <button
          className="btn-primary"
          onClick={() => window.print()}
        >
          <Download className="h-4 w-4" />
          Download Assessment
        </button>

        <button
          onClick={() => {
            sessionStorage.removeItem('interviewAssessment');
            onRestart();
          }}
          className="btn-ghost"
        >
          <RefreshCw className="h-4 w-4" />
          Restart Interview
        </button>

      </section>

    </div>
  );
}