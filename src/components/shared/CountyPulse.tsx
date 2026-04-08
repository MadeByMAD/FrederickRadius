import { useState, useEffect } from 'react';
import { useWeather } from '../../hooks/useWeather';
import { useWaterLevels } from '../../hooks/useWaterLevels';
import { getWeatherEmoji } from '../../services/api/weather';
import { useAppState } from '../../hooks/useAppState';

export function CountyPulse() {
  const [expanded, setExpanded] = useState(false);
  const [time, setTime] = useState(new Date());
  const { forecast, alerts } = useWeather();
  const { gauges } = useWaterLevels();
  const { dispatch } = useAppState();

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const current = forecast[0];
  const greeting = getGreeting(time);
  const avgGaugeHeight = gauges.length > 0
    ? gauges.reduce((sum, g) => {
        const h = g.values.find((v) => v.parameterCode === '00065');
        return sum + (h ? h.value : 0);
      }, 0) / gauges.length
    : 0;

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
      <button
        onClick={() => setExpanded(!expanded)}
        className="rounded-2xl bg-bg-elevated/90 border border-border/50 backdrop-blur-md shadow-lg px-4 py-2 flex items-center gap-3 hover:bg-bg-hover/90 transition-all group"
      >
        {/* Pulse dot */}
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success" />
        </span>

        <span className="text-xs text-text-secondary">{greeting}</span>

        {current && (
          <>
            <span className="text-xs text-border">|</span>
            <span className="text-xs text-text">
              {getWeatherEmoji(current.shortForecast)} {current.temperature}°{current.temperatureUnit}
            </span>
          </>
        )}

        {alerts.length > 0 && (
          <>
            <span className="text-xs text-border">|</span>
            <span className="text-xs text-warning">⚠️ {alerts.length} alert{alerts.length > 1 ? 's' : ''}</span>
          </>
        )}

        <svg
          className={`h-3 w-3 text-text-muted transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="mt-2 rounded-2xl bg-bg-elevated/95 border border-border/50 backdrop-blur-md shadow-2xl p-4 w-80 animate-slide-in">
          <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
            Frederick County Pulse
          </div>

          <div className="grid grid-cols-2 gap-2">
            <PulseCard
              icon="🌤️"
              label="Weather"
              value={current ? `${current.temperature}°${current.temperatureUnit}` : '...'}
              detail={current?.shortForecast || 'Loading...'}
              onClick={() => { dispatch({ type: 'OPEN_PANEL', content: 'weather' }); setExpanded(false); }}
            />
            <PulseCard
              icon="💧"
              label="Avg Stream Level"
              value={avgGaugeHeight > 0 ? `${avgGaugeHeight.toFixed(1)} ft` : '...'}
              detail={`${gauges.length} active gauges`}
              onClick={() => { dispatch({ type: 'OPEN_PANEL', content: 'water' }); setExpanded(false); }}
            />
            <PulseCard
              icon="🚗"
              label="Traffic"
              value="Live"
              detail="CHART incidents"
              onClick={() => { dispatch({ type: 'OPEN_PANEL', content: 'traffic' }); setExpanded(false); }}
            />
            <PulseCard
              icon="📢"
              label="311 Reports"
              value="Active"
              detail="SeeClickFix issues"
              onClick={() => { dispatch({ type: 'OPEN_PANEL', content: 'reports' }); setExpanded(false); }}
            />
          </div>

          {alerts.length > 0 && (
            <div className="mt-3 space-y-1">
              {alerts.slice(0, 2).map((a, i) => (
                <div key={i} className="rounded-lg bg-warning/10 border border-warning/20 px-3 py-2">
                  <div className="text-xs font-medium text-warning">⚠️ {a.event}</div>
                  <div className="text-[10px] text-text-muted mt-0.5 line-clamp-1">{a.headline}</div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-3 flex items-center justify-between text-[10px] text-text-muted">
            <span>{time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
            <span>All data sources live</span>
          </div>
        </div>
      )}
    </div>
  );
}

function PulseCard({ icon, label, value, detail, onClick }: {
  icon: string; label: string; value: string; detail: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl bg-bg-surface border border-border p-2.5 text-left hover:bg-bg-hover transition-colors"
    >
      <div className="flex items-center gap-1.5">
        <span className="text-sm">{icon}</span>
        <span className="text-[10px] text-text-muted">{label}</span>
      </div>
      <div className="mt-1 text-base font-bold text-text">{value}</div>
      <div className="text-[10px] text-text-muted">{detail}</div>
    </button>
  );
}

function getGreeting(date: Date): string {
  const hour = date.getHours();
  const day = date.toLocaleDateString('en-US', { weekday: 'long' });
  if (hour < 12) return `Good morning — ${day}`;
  if (hour < 17) return `Good afternoon — ${day}`;
  return `Good evening — ${day}`;
}
