import type { AppState } from '../../types';
import { mapLayers } from '../../data/layers';
import { municipalities } from '../../data/municipalities';
import { sourceRegistry } from '../../data/source-registry';

interface MapSetupStateProps {
  onOpenPanel: (content: NonNullable<AppState['slidePanelContent']>) => void;
}

const QUICK_STATS = [
  { label: 'Municipalities', value: String(municipalities.length), tone: 'from-sky-400/35 to-transparent' },
  { label: 'Source Registry', value: String(Object.keys(sourceRegistry).length), tone: 'from-emerald-400/35 to-transparent' },
  { label: 'Map Layers', value: String(mapLayers.length), tone: 'from-amber-300/35 to-transparent' },
];

const READY_NOW = [
  'County dashboard and municipality profiles with trust notes',
  'Curated civic views that bundle layers around real local use cases',
  'Weather, water, traffic, 311, civic, and parking panels',
  'Search, command palette, and documented source inventory',
];

export function MapSetupState({ onOpenPanel }: MapSetupStateProps) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#07111c] text-text">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.24),_transparent_42%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(16,185,129,0.18),_transparent_28%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(7,17,28,0.72),_rgba(9,22,36,0.92))]" />

      <div className="relative flex h-full flex-col justify-between gap-6 p-5 md:p-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-[11px] font-medium tracking-[0.18em] text-sky-100 uppercase">
            Map Setup Needed
          </div>

          <div className="mt-5 max-w-xl">
            <h2 className="font-sans text-3xl font-semibold tracking-tight md:text-5xl">
              The civic data layer is usable now. The interactive map still needs a token.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-6 text-slate-300 md:text-base">
              Add <code className="rounded bg-white/8 px-1.5 py-0.5 text-sky-100">VITE_MAPBOX_TOKEN</code> in
              <code className="ml-1 rounded bg-white/8 px-1.5 py-0.5 text-sky-100">.env.local</code> to unlock the
              interactive Frederick County map. The rest of the experience is already usable without it.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onOpenPanel('dashboard')}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-transform hover:-translate-y-0.5"
            >
              Open County Dashboard
            </button>
            <button
              onClick={() => onOpenPanel('weather')}
              className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-white/10"
            >
              Check Live Weather
            </button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.9fr]">
          <div className="grid gap-3 sm:grid-cols-3">
            {QUICK_STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-white/8 bg-white/[0.06] p-4 backdrop-blur-xl"
              >
                <div className={`mb-4 h-20 rounded-2xl bg-gradient-to-br ${stat.tone}`} />
                <div className="text-3xl font-semibold tracking-tight text-white">{stat.value}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-white/8 bg-black/20 p-5 backdrop-blur-xl">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-200">
              Available Right Now
            </div>
            <div className="mt-3 space-y-3">
              {READY_NOW.map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm text-slate-200">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/12 text-emerald-200">
                    ✓
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
