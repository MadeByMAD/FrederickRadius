import { useState, useEffect } from 'react';
import { fetchTrafficIncidents, type TrafficFeed, type TrafficIncident } from '../../services/api/traffic';
import { SkeletonFeed } from '../shared/Skeleton';
import { DataStatusNotice } from '../shared/DataStatusNotice';

export function TrafficPanel() {
  const [feed, setFeed] = useState<TrafficFeed | null>(null);
  const [incidents, setIncidents] = useState<TrafficIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedAt, setLoadedAt] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTrafficIncidents();
        if (!cancelled) {
          setFeed(data);
          setIncidents(data.incidents);
          setLoadedAt(Date.now());
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
        <DataStatusNotice
          sourceId="maryland-chart"
          loadedAt={loadedAt}
          detail="This panel filters a statewide CHART feed to Frederick-area coordinates. It is not a verified county jurisdiction feed."
        />
        <div className="p-3 text-sm text-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <DataStatusNotice
        sourceId="maryland-chart"
        loadedAt={loadedAt}
        detail="Incidents are filtered from a statewide feed using Frederick-area coordinates, not a verified county operations boundary."
      />

      {feed?.warning && (
        <div className="rounded-lg border border-warning/30 bg-warning/8 p-3 text-xs leading-5 text-warning">
          {feed.warning}
        </div>
      )}

      <div className="rounded-lg bg-bg-elevated p-3 text-center">
        <div className="text-2xl font-bold text-text">{incidents.length}</div>
        <div className="text-xs text-text-muted">Active incidents in Frederick-area map bounds</div>
      </div>

      {incidents.length === 0 && !feed?.warning ? (
        <div className="rounded-lg border border-success/30 bg-success/5 p-4 text-center">
          <div className="text-lg">&#x2705;</div>
          <div className="mt-1 text-sm text-success">No active traffic incidents</div>
        </div>
      ) : incidents.length === 0 ? (
        <div className="rounded-lg border border-border bg-bg-surface p-4 text-center">
          <div className="text-lg">&#x26A0;&#xFE0F;</div>
          <div className="mt-1 text-sm text-text">Traffic feed unavailable</div>
          <div className="mt-1 text-xs text-text-muted">
            The traffic panel is ready, but the live CHART feed could not be reached from this environment.
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {incidents.map((inc) => (
            <div key={inc.id} className="rounded-lg border border-border bg-bg-surface p-3">
              <div className="flex items-start gap-2">
                <span className="text-sm">
                  {inc.type.toLowerCase().includes('crash') || inc.type.toLowerCase().includes('accident') ? '💥' :
                   inc.type.toLowerCase().includes('construction') || inc.type.toLowerCase().includes('work') ? '🚧' :
                   inc.type.toLowerCase().includes('closure') ? '🛑' : '⚠️'}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-text">{inc.type}</div>
                  {inc.description && (
                    <div className="mt-0.5 text-xs text-text-secondary line-clamp-2">{inc.description}</div>
                  )}
                  {inc.road && (
                    <div className="mt-1 text-xs text-text-muted">{inc.road}</div>
                  )}
                  {inc.location && (
                    <div className="text-xs text-text-muted">{inc.location}</div>
                  )}
                  {inc.startDate && (
                    <div className="mt-1 text-[10px] text-text-muted">
                      Started: {new Date(inc.startDate).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
