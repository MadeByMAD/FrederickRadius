import { useState, useEffect } from 'react';
import { fetch311Issues, getStatusColor, type ServiceRequest } from '../../services/api/seeclickfix';
import { SkeletonFeed } from '../shared/Skeleton';
import { SourceChip } from '../shared/SourceChip';

export function ReportsPanel() {
  const [issues, setIssues] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const data = await fetch311Issues();
        if (!cancelled) {
          setIssues(data);
          setUpdatedAt(new Date());
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <SkeletonFeed />;
  if (error) {
    return (
      <div className="space-y-3">
        <div className="rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger">{error}</div>
        <SourceChip source="SeeClickFix" url="https://seeclickfix.com" status="error" />
      </div>
    );
  }

  const openCount = issues.filter((i) => i.status === 'open').length;
  const ackCount = issues.filter((i) => i.status === 'acknowledged').length;

  return (
    <div className="space-y-3">
      <SourceChip
        source="SeeClickFix"
        url="https://seeclickfix.com"
        updatedAt={updatedAt}
        refreshCadence="every 5 min"
      />

      <div className="grid grid-cols-3 gap-2">
        <StatBox label="Open" value={openCount} tone="danger" />
        <StatBox label="In Progress" value={ackCount} tone="warning" />
        <StatBox label="Total" value={issues.length} tone="text" />
      </div>

      <div className="space-y-2">
        {issues.map((issue) => (
          <div key={issue.id} className="rounded-lg border border-border bg-bg-surface p-3">
            <div className="flex items-start gap-2">
              <span
                className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full"
                style={{ backgroundColor: getStatusColor(issue.status) }}
              />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-text">{issue.summary || 'Service Request'}</div>
                <div className="mt-0.5 text-xs text-text-muted">
                  {issue.request_type?.title || 'General'}
                </div>
                {issue.address && (
                  <div className="mt-1 text-xs text-text-secondary">{issue.address}</div>
                )}
                <div className="mt-1 flex items-center gap-3 text-[11px] text-text-muted">
                  <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                  <span className="capitalize">{issue.status}</span>
                  {issue.rating > 0 && <span>+{issue.rating} votes</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {issues.length === 0 && (
        <div className="rounded-lg border border-border bg-bg-surface p-4 text-center text-sm text-text-secondary">
          No open service requests.
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, tone }: { label: string; value: number; tone: 'danger' | 'warning' | 'text' }) {
  const color = tone === 'danger' ? 'var(--color-danger)' : tone === 'warning' ? 'var(--color-warning)' : 'var(--color-text)';
  return (
    <div className="rounded-lg border border-border bg-bg-elevated p-2.5 text-center shadow-[var(--shadow-surface-1)]">
      <div className="font-display text-lg font-semibold tabular-nums" style={{ color }}>
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-text-muted">{label}</div>
    </div>
  );
}
