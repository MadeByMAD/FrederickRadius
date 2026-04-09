import { getConfidenceLabel } from '../../data/source-registry';
import type { ConfidenceLabel } from '../../types';

const styles: Record<ConfidenceLabel, string> = {
  official: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
  reference: 'border-sky-400/30 bg-sky-400/10 text-sky-100',
  approximate: 'border-amber-300/30 bg-amber-300/10 text-amber-100',
  experimental: 'border-fuchsia-300/30 bg-fuchsia-300/10 text-fuchsia-100',
  unavailable: 'border-border bg-bg-surface text-text-muted',
};

export function DataTrustBadge({ confidence }: { confidence: ConfidenceLabel }) {
  return (
    <span className={`rounded-full border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] ${styles[confidence]}`}>
      {getConfidenceLabel(confidence)}
    </span>
  );
}
