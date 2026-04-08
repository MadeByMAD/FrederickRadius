import { useState, useEffect } from 'react';

interface Props {
  onComplete: () => void;
}

const STATS = [
  { label: 'Municipalities', value: 12, suffix: '' },
  { label: 'Data Endpoints', value: 500, suffix: '+' },
  { label: 'Map Layers', value: 60, suffix: '' },
  { label: 'Live Feeds', value: 9, suffix: '' },
];

export function WelcomeScreen({ onComplete }: Props) {
  const [phase, setPhase] = useState<'logo' | 'stats' | 'ready' | 'exit'>('logo');
  const [counters, setCounters] = useState(STATS.map(() => 0));

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('stats'), 800);
    const t2 = setTimeout(() => setPhase('ready'), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Animate counters
  useEffect(() => {
    if (phase !== 'stats' && phase !== 'ready') return;

    const duration = 1200;
    const steps = 30;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCounters(STATS.map((s) => Math.round(s.value * eased)));
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [phase]);

  function handleEnter() {
    setPhase('exit');
    setTimeout(onComplete, 500);
  }

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center transition-opacity duration-500 ${
        phase === 'exit' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ background: 'radial-gradient(ellipse at center, #111827 0%, #0A0A0A 70%)' }}
    >
      {/* Ambient glow rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: '600px', height: '600px',
            background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
            animation: 'pulse 4s ease-in-out infinite',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: '900px', height: '900px',
            background: 'radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 60%)',
            animation: 'pulse 6s ease-in-out infinite 1s',
          }}
        />
      </div>

      <div className="relative text-center max-w-lg px-6">
        {/* Logo / Title */}
        <div className={`transition-all duration-700 ${phase === 'logo' ? 'scale-110' : 'scale-100'}`}>
          {/* Compass Icon */}
          <div className="mx-auto mb-6 w-20 h-20 relative">
            <svg viewBox="0 0 100 100" className="w-full h-full animate-spin" style={{ animationDuration: '20s' }}>
              <circle cx="50" cy="50" r="45" fill="none" stroke="#3B82F6" strokeWidth="1.5" opacity="0.3" />
              <circle cx="50" cy="50" r="33" fill="none" stroke="#3B82F6" strokeWidth="1" opacity="0.2" strokeDasharray="4 3" />
              <circle cx="50" cy="50" r="20" fill="none" stroke="#3B82F6" strokeWidth="1.5" opacity="0.4" strokeDasharray="6 4" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-accent animate-glow" />
            </div>
          </div>

          <h1 className="text-4xl font-bold tracking-tight">
            <span className="text-text">Frederick </span>
            <span className="bg-gradient-to-r from-accent to-success bg-clip-text text-transparent">Radius</span>
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Civic Intelligence for Frederick County, Maryland
          </p>
        </div>

        {/* Stats */}
        <div
          className={`mt-10 grid grid-cols-4 gap-4 transition-all duration-700 ${
            phase === 'logo' ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}
        >
          {STATS.map((stat, i) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-text tabular-nums">
                {counters[i]}{stat.suffix}
              </div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Enter Button */}
        <div
          className={`mt-10 transition-all duration-700 ${
            phase === 'ready' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <button
            onClick={handleEnter}
            className="group relative inline-flex items-center gap-2 rounded-full bg-accent/10 border border-accent/30 px-8 py-3 text-sm font-medium text-accent hover:bg-accent/20 hover:border-accent/50 transition-all"
          >
            <span>Explore Frederick County</span>
            <svg className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          <p className="mt-4 text-[10px] text-text-muted">
            Press <kbd className="rounded bg-bg-surface border border-border px-1.5 py-0.5 text-[9px]">Enter</kbd> or click to begin
          </p>
        </div>
      </div>
    </div>
  );
}
