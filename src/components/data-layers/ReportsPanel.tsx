import { useState, useEffect } from 'react';
import { fetch311Issues, getStatusColor, type ServiceRequest } from '../../services/api/seeclickfix';
import { SkeletonFeed } from '../shared/Skeleton';
import { DataStatusNotice } from '../shared/DataStatusNotice';

export function ReportsPanel() {
  const [issues, setIssues] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedAt, setLoadedAt] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetch311Issues();
        if (!cancelled) {
          setIssues(data);
          setLoadedAt(Date.now());
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
        <DataStatusNotice
          sourceId="seeclickfix-frederick"
          loadedAt={loadedAt}
          detail="This is a community report feed focused mostly on Frederick City issues, not an official countywide 311 system."
        />
        <div className="p-3 text-sm text-danger">{error}</div>
      </div>
    );
  }

  const openCount = issues.filter((i) => i.status === 'open').length;
  const ackCount = issues.filter((i) => i.status === 'acknowledged').length;

  return (
    <div className="space-y-3">
      <DataStatusNotice
        sourceId="seeclickfix-frederick"
        loadedAt={loadedAt}
        detail="Community-submitted SeeClickFix issues are useful situational signals but do not represent countywide service coverage."
      />

      <div className="grid grid-cols-3 gap-2">
        <StatBox label="Open" value={openCount} color="#EF4444" />
        <StatBox label="In Progress" value={ackCount} color="#F59E0B" />
        <StatBox label="Total" value={issues.length} color="#3B82F6" />
      </div>

      <div className="space-y-2">
        {issues.map((issue) => (
          <div key={issue.id} className="rounded-lg border border-border bg-bg-surface p-3">
            <div className="flex items-start gap-2">
              <span
                className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full"
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
                <div className="mt-1 flex items-center gap-3 text-[10px] text-text-muted">
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
        <div className="p-4 text-center text-sm text-text-secondary">No open service requests</div>
      )}
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-lg bg-bg-elevated p-2.5 text-center">
      <div className="text-lg font-bold" style={{ color }}>{value}</div>
      <div className="text-[10px] text-text-muted">{label}</div>
    </div>
  );
}
