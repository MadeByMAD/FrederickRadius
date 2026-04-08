import { useState, useEffect, useRef } from 'react';
import { fetch311Issues } from '../../services/api/seeclickfix';
import { fetchTrafficIncidents } from '../../services/api/traffic';
import { useAppState } from '../../hooks/useAppState';

interface ActivityItem {
  id: string;
  icon: string;
  text: string;
  detail: string;
  time: string;
  color: string;
  source: string;
  lat?: number;
  lng?: number;
}

export function LiveActivityFeed() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { dispatch } = useAppState();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const activities: ActivityItem[] = [];

      try {
        const issues = await fetch311Issues();
        for (const issue of issues.slice(0, 15)) {
          activities.push({
            id: `311-${issue.id}`,
            icon: issue.status === 'open' ? '🔴' : '🟡',
            text: issue.summary || 'Service Request',
            detail: issue.request_type?.title || 'General',
            time: timeAgo(issue.created_at),
            color: issue.status === 'open' ? '#EF4444' : '#F59E0B',
            source: '311',
            lat: issue.lat,
            lng: issue.lng,
          });
        }
      } catch { /* ignore */ }

      try {
        const incidents = await fetchTrafficIncidents();
        for (const inc of incidents.slice(0, 10)) {
          activities.push({
            id: `traffic-${inc.id}`,
            icon: '🚧',
            text: inc.type,
            detail: inc.road || inc.location || '',
            time: inc.startDate ? timeAgo(inc.startDate) : 'Active',
            color: '#F97316',
            source: 'Traffic',
            lat: inc.latitude,
            lng: inc.longitude,
          });
        }
      } catch { /* ignore */ }

      // Sort by most recent
      activities.sort((a, b) => {
        if (a.time.includes('min') && b.time.includes('hr')) return -1;
        if (a.time.includes('hr') && b.time.includes('min')) return 1;
        return 0;
      });

      setItems(activities);
      setLoading(false);
    }

    load();
    const interval = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  function handleItemClick(item: ActivityItem) {
    if (item.lat && item.lng) {
      const flyTo = (window as unknown as Record<string, (lng: number, lat: number, zoom?: number) => void>).__mapFlyTo;
      if (flyTo) flyTo(item.lng, item.lat, 15);
    }
    if (item.source === '311') dispatch({ type: 'OPEN_PANEL', content: 'reports' });
    if (item.source === 'Traffic') dispatch({ type: 'OPEN_PANEL', content: 'traffic' });
  }

  return (
    <div className="absolute bottom-12 right-3 z-10">
      <button
        onClick={() => setVisible(!visible)}
        className="glass rounded-full px-3 py-2 flex items-center gap-2 hover:bg-bg-hover/90 transition-all shadow-lg"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute h-full w-full rounded-full bg-accent opacity-75" />
          <span className="relative h-2 w-2 rounded-full bg-accent" />
        </span>
        <span className="text-xs text-text-secondary">Live Feed</span>
        {items.length > 0 && (
          <span className="rounded-full bg-accent/20 text-accent text-[10px] font-bold px-1.5">{items.length}</span>
        )}
      </button>

      {visible && (
        <div className="absolute bottom-12 right-0 w-80 rounded-2xl glass shadow-2xl overflow-hidden animate-fade-up">
          <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative h-2 w-2 rounded-full bg-success" />
              </span>
              <span className="text-xs font-semibold text-text">Live Activity</span>
            </div>
            <span className="text-[10px] text-text-muted">{items.length} events</span>
          </div>

          <div ref={scrollRef} className="max-h-72 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center">
                <div className="h-5 w-5 mx-auto animate-spin rounded-full border-2 border-border border-t-accent" />
                <p className="mt-2 text-xs text-text-muted">Loading activity...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="p-6 text-center text-xs text-text-muted">No recent activity</div>
            ) : (
              items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-bg-hover/50 transition-colors text-left border-b border-border/30 last:border-0"
                >
                  <span className="text-xs mt-0.5 flex-shrink-0">{item.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-text truncate">{item.text}</div>
                    <div className="text-[10px] text-text-muted truncate">{item.detail}</div>
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-end gap-0.5">
                    <span className="text-[9px] text-text-muted">{item.time}</span>
                    <span
                      className="rounded-full px-1.5 py-0.5 text-[8px] font-medium"
                      style={{ backgroundColor: `${item.color}15`, color: item.color }}
                    >
                      {item.source}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}hr ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
