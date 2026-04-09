import type { Municipality } from '../../types';

interface Props {
  municipality: Municipality;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function MunicipalityCard({ municipality: m, isSelected, onSelect }: Props) {
  return (
    <button
      onClick={() => onSelect(m.id)}
      className={`w-full rounded-lg border p-3 text-left transition-all ${
        isSelected
          ? 'border-accent bg-accent/10'
          : 'border-border bg-bg-surface hover:border-border hover:bg-bg-hover'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="truncate text-sm font-medium text-text">{m.name}</h4>
          <p className="mt-0.5 text-xs text-text-secondary">
            Population snapshot {m.population.toLocaleString()} &middot; {m.area} mi²
          </p>
        </div>
        <div className="flex-shrink-0 rounded border border-border bg-bg-elevated px-1.5 py-0.5 text-[10px] text-text-muted">
          Manual ref
        </div>
      </div>
    </button>
  );
}
