import { useState, useEffect } from 'react';
import { AlertOctagon, AlertTriangle, CheckCircle2, Cone, Zap } from 'lucide-react';
import { fetchTrafficIncidents, type TrafficIncident } from '../../services/api/traffic';
import { SkeletonFeed } from '../shared/Skeleton';
import { SourceChip } from '../shared/SourceChip';

function iconForIncident(type: string) {
  const t = type.toLowerCase();
  if (t.includes('crash') || t.includes('accident')) return Zap;
  if (t.includes('construction') || t.includes('work')) return Cone;
  if (t.includes('closure')) return AlertOctagon;
  return AlertTriangle;
}

export function TrafficPanel() {
  const [incidents, setIncidents] = useState<TrafficIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const data = await fetchTrafficIncidents();
        if (!cancelled) {
          setIncidents(data);
          setUpdatedAt(new Date());
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 3 * 60 * 1000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  if (loading) return <SkeletonFeed />;
  if (error) {
    return (
      <div className="space-y-3">
        <div className="rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger">{error}</div>
        <SourceChip source="Maryland CHART" url="https://chart.maryland.gov" status="error" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <SourceChip
        source="Maryland CHART"
        url="https://chart.maryland.gov"
        updatedAt={updatedAt}
        refreshCadence="every 3 min"
      />

      <div className="rounded-xl border border-border bg-bg-elevated p-4 text-center shadow-[var(--shadow-surface-1)]">
        <div className="font-display text-3xl font-semibold tabular-nums text-text">{incidents.length}</div>
        <div className="mt-0.5 text-xs text-text-muted">Active incidents in Frederick County</div>
      </div>

      {incidents.length === 0 ? (
        <div className="rounded-lg border border-success/30 bg-success/5 p-4 text-center">
          <CheckCircle2 className="mx-auto h-6 w-6 text-success" strokeWidth={2} />
          <div className="mt-1.5 text-sm text-success">No active traffic incidents</div>
        </div>
      ) : (
        <div className="space-y-2">
          {incidents.map((inc) => {
            const Icon = iconForIncident(inc.type);
            return (
              <div key={inc.id} className="rounded-lg border border-border bg-bg-surface p-3">
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-warning/10 text-warning">
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-text">{inc.type}</div>
                    {inc.description && (
                      <div className="mt-0.5 text-xs text-text-secondary line-clamp-2">{inc.description}</div>
                    )}
                    {inc.road && <div className="mt-1 text-xs text-text-muted">{inc.road}</div>}
                    {inc.location && <div className="text-xs text-text-muted">{inc.location}</div>}
                    {inc.startDate && (
                      <div className="mt-1 text-[11px] text-text-muted">
                        Started {new Date(inc.startDate).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
