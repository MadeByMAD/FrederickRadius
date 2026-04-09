import { mapLayers } from '../../data/layers';
import { municipalities } from '../../data/municipalities';
import { sourceRegistry } from '../../data/source-registry';

interface Props {
  onComplete: () => void;
}

const trustCards = [
  {
    title: 'Official feeds first',
    body: 'Weather, water, traffic, and county GIS layers should be treated differently from community reports and manual snapshots.',
  },
  {
    title: 'Guided civic views',
    body: 'Start from curated local questions like flood readiness, planning context, or civic services before dropping into the raw layer catalog.',
  },
  {
    title: 'Uncertainty stays visible',
    body: 'If Frederick Radius only has a manual snapshot or an approximate lookup, the interface should say so directly.',
  },
  {
    title: 'Serious before flashy',
    body: 'The goal is civic utility and local context, not novelty mechanics or inflated county marketing claims.',
  },
];

export function WelcomeScreen({ onComplete }: Props) {
  const sourceCount = Object.keys(sourceRegistry).length;
  const officialCount = Object.values(sourceRegistry).filter((source) => source.official).length;

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),_transparent_40%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(160deg,_rgba(7,17,28,0.9),_rgba(8,14,24,1))]" />

      <div className="relative mx-auto flex min-h-full max-w-5xl flex-col justify-center px-6 py-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-surface px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-text-secondary">
            Civic Intelligence Preview
          </div>
          <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">
            Frederick Radius
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-text-secondary">
            A trust-first civic and place context product for Frederick County and the City of Frederick. The strongest sources are official feeds and GIS catalogs. The weakest areas are still clearly labeled manual or approximate.
          </p>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-3">
          <MetricCard label="Sources in registry" value={String(sourceCount)} detail="Documented in code with authority, cadence, and risk notes" />
          <MetricCard label="Official sources" value={String(officialCount)} detail="Government-published feeds or catalogs" />
          <MetricCard label="Configured layers" value={String(mapLayers.length)} detail={`${municipalities.length} municipality profiles with manual snapshot notes`} />
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {trustCards.map((card) => (
            <div key={card.title} className="rounded-2xl border border-border bg-bg-surface p-5">
              <div className="text-sm font-semibold text-text">{card.title}</div>
              <div className="mt-2 text-sm leading-6 text-text-secondary">{card.body}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            onClick={onComplete}
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition-transform hover:-translate-y-0.5"
          >
            Open Frederick Radius
          </button>
          <div className="text-xs text-text-muted">
            Map interactions require a Mapbox token. The rest of the product remains usable without one.
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-border bg-bg-surface p-4">
      <div className="text-[11px] uppercase tracking-[0.18em] text-text-muted">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-text">{value}</div>
      <div className="mt-2 text-xs leading-5 text-text-secondary">{detail}</div>
    </div>
  );
}
