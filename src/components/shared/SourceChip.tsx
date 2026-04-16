import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { formatRelativeTime } from '../../lib/time';

interface Props {
  /** Short source label, e.g. "National Weather Service". */
  source: string;
  /** Public URL for the data provider. Optional. */
  url?: string;
  /** Last-fetched timestamp. null/undefined renders without the time fragment. */
  updatedAt?: Date | string | number | null;
  /** Optional human label for the refresh cadence, e.g. "every 15 min". */
  refreshCadence?: string;
  /** "live" | "stale" | "error" — drives the dot color. Default: live when updatedAt present. */
  status?: 'live' | 'stale' | 'error';
  className?: string;
}

const DOT_COLOR: Record<NonNullable<Props['status']>, string> = {
  live: 'var(--color-success)',
  stale: 'var(--color-warning)',
  error: 'var(--color-danger)',
};

export function SourceChip({ source, url, updatedAt, refreshCadence, status, className = '' }: Props) {
  const [, force] = useState(0);

  // Refresh the relative-time label every 30s so "3m ago" doesn't go stale.
  useEffect(() => {
    if (!updatedAt) return;
    const id = setInterval(() => force((n) => n + 1), 30_000);
    return () => clearInterval(id);
  }, [updatedAt]);

  const resolvedStatus: NonNullable<Props['status']> = status ?? (updatedAt ? 'live' : 'stale');
  const relative = updatedAt ? formatRelativeTime(updatedAt) : null;

  const sourceContent = url ? (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-text-secondary hover:text-text transition-colors"
    >
      {source}
      <ExternalLink className="h-3 w-3" strokeWidth={2} />
    </a>
  ) : (
    <span className="text-text-secondary">{source}</span>
  );

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-border bg-bg-elevated px-2.5 py-1 text-[11px] text-text-muted shadow-[var(--shadow-surface-1)] ${className}`}
    >
      <span
        className="inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full"
        style={{ backgroundColor: DOT_COLOR[resolvedStatus] }}
        aria-hidden
      />
      {relative && (
        <>
          <span className="text-text">Updated {relative}</span>
          <span className="text-border">·</span>
        </>
      )}
      <span>via {sourceContent}</span>
      {refreshCadence && (
        <>
          <span className="text-border">·</span>
          <span>{refreshCadence}</span>
        </>
      )}
    </div>
  );
}
