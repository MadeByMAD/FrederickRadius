import { classifyMunicipality, stripTitlePrefix } from '../../lib/municipalityStyle';
import type { Municipality } from '../../types';

interface Props {
  municipality: Municipality;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function MunicipalityCard({ municipality: m, isSelected, onSelect }: Props) {
  const style = classifyMunicipality(m);
  return (
    <button
      onClick={() => onSelect(m.id)}
      aria-pressed={isSelected}
      className={`group relative w-full overflow-hidden rounded-xl border bg-bg-elevated text-left shadow-[var(--shadow-surface-1)] transition-all hover:-translate-y-[1px] hover:shadow-[var(--shadow-surface-2)] ${
        isSelected ? 'border-accent ring-2 ring-accent/20' : 'border-border'
      }`}
    >
      <div
        className="h-1.5 w-full"
        style={{ background: style.gradient }}
        aria-hidden
      />

      <div className="p-3">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex h-4 items-center rounded-full px-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-white"
            style={{ background: style.accent }}
          >
            {style.classification}
          </span>
          <span className="text-[10px] text-text-muted tabular-nums">
            Pop. {m.population.toLocaleString()}
          </span>
        </div>

        <h4 className="mt-1 font-display text-base font-semibold leading-tight tracking-tight text-text">
          {stripTitlePrefix(m.name)}
        </h4>

        <div className="mt-1.5 flex items-center gap-3 text-[11px] text-text-muted tabular-nums">
          <span>{m.area} mi²</span>
          <span aria-hidden>·</span>
          <span>${Math.round(m.medianIncome / 1000)}k median</span>
          <span aria-hidden>·</span>
          <span>age {m.medianAge.toFixed(1)}</span>
        </div>
      </div>
    </button>
  );
}
