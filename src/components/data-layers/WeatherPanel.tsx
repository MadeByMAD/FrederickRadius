import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useWeather } from '../../hooks/useWeather';
import { getWeatherEmoji } from '../../services/api/weather';
import { SkeletonWeather } from '../shared/Skeleton';
import { SourceChip } from '../shared/SourceChip';
import { fadeUp, staggerContainer, staggerItem } from '../../lib/motion';

export function WeatherPanel() {
  const { forecast, alerts, loading, error, updatedAt } = useWeather();

  if (loading) return <SkeletonWeather />;
  if (error) {
    return (
      <div className="space-y-3">
        <div className="rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger">{error}</div>
        <SourceChip source="National Weather Service" url="https://www.weather.gov" status="error" />
      </div>
    );
  }

  const current = forecast[0];

  return (
    <motion.div variants={fadeUp} initial="initial" animate="animate" className="space-y-3">
      <SourceChip
        source="National Weather Service"
        url="https://www.weather.gov"
        updatedAt={updatedAt}
        refreshCadence="every 30 min"
      />

      {alerts.length > 0 && (
        <div className="space-y-1.5">
          {alerts.map((a) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-lg border border-warning/30 bg-warning/10 p-2.5"
            >
              <div className="inline-flex items-center gap-2 text-sm font-medium text-warning">
                <AlertTriangle className="h-4 w-4" strokeWidth={2} />
                {a.event}
              </div>
              <p className="mt-1 text-xs text-text-secondary">{a.headline}</p>
            </motion.div>
          ))}
        </div>
      )}

      {current && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border border-border bg-bg-elevated p-4 shadow-[var(--shadow-surface-1)]"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="font-display text-4xl font-semibold tabular-nums text-text">
                {current.temperature}°{current.temperatureUnit}
              </div>
              <div className="mt-1 text-sm text-text-secondary">{current.shortForecast}</div>
              <div className="mt-0.5 text-xs text-text-muted">
                Wind {current.windSpeed} {current.windDirection}
              </div>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
              className="text-4xl leading-none"
              aria-hidden
            >
              {getWeatherEmoji(current.shortForecast)}
            </motion.div>
          </div>
        </motion.div>
      )}

      <div className="space-y-1">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">7-Day Forecast</h4>
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-1">
          {forecast.slice(1, 8).map((f, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              className="flex items-center justify-between rounded bg-bg-surface px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{getWeatherEmoji(f.shortForecast)}</span>
                <span className="text-sm text-text">{f.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text">{f.temperature}°</span>
                <span className="text-xs text-text-muted">{f.shortForecast}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

    </motion.div>
  );
}
