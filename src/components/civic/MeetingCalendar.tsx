import { upcomingMeetings, MEETING_SNAPSHOT_NOTE } from '../../data/civic';
import { DataTrustBadge } from '../shared/DataTrustBadge';

const TYPE_COLORS: Record<string, string> = {
  council: '#3B82F6',
  planning: '#10B981',
  appeals: '#F59E0B',
  other: '#6B7280',
};

const TYPE_LABELS: Record<string, string> = {
  council: 'County Council',
  planning: 'Planning',
  appeals: 'Board of Appeals',
  other: 'Other',
};

export function MeetingCalendar() {
  const sorted = [...upcomingMeetings].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-border bg-bg-surface p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
            Calendar Status
          </div>
          <DataTrustBadge confidence="reference" />
        </div>
        <div className="mt-2 text-xs leading-5 text-text-secondary">{MEETING_SNAPSHOT_NOTE}</div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {Object.entries(TYPE_LABELS).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1.5 text-xs text-text-muted">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: TYPE_COLORS[key] }} />
            {label}
          </div>
        ))}
      </div>

      <div className="space-y-1.5">
        {sorted.map((meeting) => {
          const isPast = meeting.date < today;
          const isToday = meeting.date === today;

          return (
            <div
              key={meeting.id}
              className={`rounded-lg border p-3 transition-colors ${
                isToday
                  ? 'border-accent/50 bg-accent/5'
                  : isPast
                    ? 'border-border/50 bg-bg-surface/50 opacity-60'
                    : 'border-border bg-bg-surface'
              }`}
            >
              <div className="flex items-start gap-2">
                <div
                  className="mt-1 h-2 w-2 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: TYPE_COLORS[meeting.type] }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-text truncate">{meeting.title}</h4>
                    {isToday && (
                      <span className="flex-shrink-0 rounded bg-accent/20 px-1.5 py-0.5 text-[10px] font-medium text-accent">
                        TODAY
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-text-muted">
                    <span>
                      {new Date(`${meeting.date}T00:00:00`).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span>{meeting.time}</span>
                  </div>
                  <div className="mt-0.5 text-xs text-text-muted truncate">{meeting.location}</div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div className="text-[10px] text-text-muted">
                      {meeting.verifiedDate ? `Verified ${meeting.verifiedDate}` : 'Manual reference'}
                    </div>
                    {meeting.sourceUrl && (
                      <a
                        href={meeting.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-medium text-accent hover:text-accent-hover"
                      >
                        Official calendar
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
