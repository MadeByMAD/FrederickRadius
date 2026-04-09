import { getSourceMetadata } from '../../data/source-registry';
import { DataTrustBadge } from './DataTrustBadge';

interface Props {
  sourceId: string;
  loadedAt?: string | number | null;
  detail?: string;
}

export function DataStatusNotice({ sourceId, loadedAt, detail }: Props) {
  const source = getSourceMetadata(sourceId);
  if (!source) return null;

  const confidence = source.official
    ? 'official'
    : source.authority === 'derived'
      ? 'approximate'
      : 'reference';

  return (
    <div className="rounded-lg border border-border bg-bg-surface p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          {source.sourceUrl ? (
            <a
              href={source.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-text underline decoration-border/60 underline-offset-2 hover:text-accent"
            >
              {source.name}
            </a>
          ) : (
            <div className="text-xs font-medium text-text">{source.name}</div>
          )}
          <div className="mt-0.5 text-[10px] leading-4 text-text-muted">
            {formatAuthority(source.authority)} · {formatClassification(source.classification)}
          </div>
          <div className="text-[10px] leading-4 text-text-muted">
            {source.coverageArea} · {formatCadence(source.cadence)}
          </div>
        </div>
        <DataTrustBadge confidence={confidence} />
      </div>

      {(loadedAt || detail) && (
        <div className="mt-2 text-[10px] leading-4 text-text-secondary">
          {loadedAt ? `Loaded ${formatLoadedAt(loadedAt)}` : null}
          {loadedAt && detail ? ' · ' : null}
          {detail ?? null}
        </div>
      )}
    </div>
  );
}

function formatCadence(cadence: string) {
  return cadence.replace(/-/g, ' ');
}

function formatAuthority(authority: string) {
  return authority.replace(/-/g, ' ');
}

function formatClassification(classification: string) {
  return classification.replace(/-/g, ' ');
}

function formatLoadedAt(value: string | number) {
  const date = typeof value === 'number' ? new Date(value) : new Date(value);
  if (Number.isNaN(date.getTime())) return 'recently';
  return date.toLocaleString();
}
