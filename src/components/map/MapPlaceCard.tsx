import { ArrowRight, Globe, X } from 'lucide-react';
import { municipalities } from '../../data/municipalities';
import { classifyMunicipality, stripTitlePrefix } from '../../lib/municipalityStyle';

interface Props {
  slug: string;
  onClose: () => void;
  onOpen: () => void;
}

/**
 * Place-card style popup that renders when a municipality polygon is
 * clicked on the map. Acts as a lightweight preview; "Open details"
 * navigates to the full municipality profile.
 */
export function MapPlaceCard({ slug, onClose, onOpen }: Props) {
  const muni = municipalities.find((m) => m.id === slug);
  if (!muni) return null;

  const style = classifyMunicipality(muni);

  return (
    <div className="w-[300px] overflow-hidden rounded-2xl border border-border bg-bg-elevated shadow-[var(--shadow-surface-3)]">
      {/* Hero band — color keyed to classification, with a subtle ring motif */}
      <div
        className="relative h-16 overflow-hidden"
        style={{ background: style.gradient }}
      >
        <RingMotif />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-bg-elevated/70 text-text-secondary backdrop-blur hover:bg-bg-elevated hover:text-text transition-colors"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
        <div className="absolute left-3 bottom-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-white/95 drop-shadow-sm">
          {style.classification} · Frederick County
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-display text-2xl font-semibold leading-tight tracking-tight text-text">
          {stripTitlePrefix(muni.name)}
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-text-muted line-clamp-2">
          {muni.description}
        </p>

        <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3">
          <Stat label="Population" value={formatPopulation(muni.population)} />
          <Stat label="Area" value={`${muni.area} mi²`} />
          <Stat label="Median inc." value={`$${Math.round(muni.medianIncome / 1000)}k`} />
        </dl>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={onOpen}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-accent px-3 py-2 text-xs font-medium text-white shadow-[var(--shadow-surface-1)] hover:bg-accent-hover transition-colors"
          >
            Open details
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
          {muni.website && (
            <a
              href={muni.website}
              target="_blank"
              rel="noreferrer"
              aria-label="Official website"
              title="Official website"
              className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-border bg-bg-elevated text-text-secondary hover:bg-bg-hover hover:text-text transition-colors"
            >
              <Globe className="h-3.5 w-3.5" strokeWidth={2} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wider text-text-muted">{label}</dt>
      <dd className="mt-0.5 font-display text-sm font-semibold tabular-nums text-text">{value}</dd>
    </div>
  );
}

/** Stylized rings that echo the Frederick Radius brand mark. */
function RingMotif() {
  return (
    <svg
      className="absolute -right-6 -top-4 h-24 w-24 text-white/20"
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden
    >
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="1" />
      <circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" />
      <circle cx="50" cy="50" r="18" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function formatPopulation(n: number): string {
  if (n >= 10000) return `${Math.round(n / 1000)}k`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toLocaleString();
}
