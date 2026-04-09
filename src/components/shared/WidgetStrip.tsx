import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useWeather } from '../../hooks/useWeather';
import { useWaterLevels } from '../../hooks/useWaterLevels';
import { getWeatherEmoji } from '../../services/api/weather';
import { useAppState } from '../../hooks/useAppState';
import { upcomingMeetings } from '../../data/civic';

interface Widget {
  id: string;
  icon: string;
  label: string;
  value: string;
  detail: string;
  color: string;
  onClick: () => void;
}

export function WidgetStrip() {
  const { forecast, alerts } = useWeather();
  const { gauges } = useWaterLevels();
  const { dispatch } = useAppState();
  const [now] = useState(() => new Date());

  const widgets = useMemo<Widget[]>(() => {
    const w: Widget[] = [];
    const current = forecast[0];

    // Weather
    if (current) {
      w.push({
        id: 'weather',
        icon: getWeatherEmoji(current.shortForecast),
        label: 'Now',
        value: `${current.temperature}°${current.temperatureUnit}`,
        detail: current.shortForecast,
        color: '#3B82F6',
        onClick: () => dispatch({ type: 'OPEN_PANEL', content: 'weather' }),
      });
    }

    // Alerts
    if (alerts.length > 0) {
      w.push({
        id: 'alert',
        icon: '⚠️',
        label: 'Alert',
        value: alerts[0].event,
        detail: 'NWS weather alert',
        color: '#F59E0B',
        onClick: () => dispatch({ type: 'OPEN_PANEL', content: 'weather' }),
      });
    }

    // Next meeting
    const today = now.toISOString().split('T')[0];
    const nextMeeting = upcomingMeetings
      .filter((m) => m.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))[0];
    if (nextMeeting) {
      const meetDate = new Date(nextMeeting.date + 'T00:00:00');
      const daysUntil = Math.ceil((meetDate.getTime() - now.getTime()) / 86400000);
      w.push({
        id: 'meeting',
        icon: '🏛️',
        label: daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil}d`,
        value: nextMeeting.title.replace('County Council ', '').replace(' Session', ''),
        detail: `Manual civic snapshot · ${nextMeeting.time}`,
        color: '#8B5CF6',
        onClick: () => dispatch({ type: 'OPEN_PANEL', content: 'civic' }),
      });
    }

    // Water level (highest gauge)
    if (gauges.length > 0) {
      const withHeight = gauges
        .map((g) => {
          const h = g.values.find((v) => v.parameterCode === '00065');
          return { name: g.siteName, height: h?.value || 0 };
        })
        .sort((a, b) => b.height - a.height)[0];

      if (withHeight) {
        w.push({
          id: 'water',
          icon: '💧',
          label: 'USGS',
          value: `${withHeight.height.toFixed(1)} ft`,
          detail: withHeight.name.split(' at ')[0] || 'Stream gauge',
          color: '#06B6D4',
          onClick: () => dispatch({ type: 'OPEN_PANEL', content: 'water' }),
        });
      }
    }

    // Time of day suggestion
    const hour = now.getHours();
    if (hour >= 6 && hour < 10) {
      w.push({ id: 'suggest', icon: '☀️', label: 'Morning', value: 'Farmers Markets', detail: 'Reference layer', color: '#F59E0B', onClick: () => dispatch({ type: 'TOGGLE_LAYER', layerId: 'farmers-markets' }) });
    } else if (hour >= 17 && hour < 21) {
      w.push({ id: 'suggest', icon: '🍽️', label: 'Evening', value: 'Liquor-licensed venues', detail: 'County reference layer', color: '#EC4899', onClick: () => dispatch({ type: 'TOGGLE_LAYER', layerId: 'liquor' }) });
    }

    return w;
  }, [forecast, alerts, gauges, now, dispatch]);

  if (widgets.length === 0) return null;

  return (
    <div className="overflow-x-auto scrollbar-none -mx-4 px-4">
      <div className="flex gap-2 pb-1" style={{ width: 'max-content' }}>
        {widgets.map((widget, i) => (
          <motion.button
            key={widget.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={widget.onClick}
            className="flex-shrink-0 rounded-xl glass border border-border/50 p-2.5 text-left min-w-[130px] hover:bg-bg-hover/50 transition-colors"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-sm">{widget.icon}</span>
              <span className="text-[9px] font-medium uppercase tracking-wider" style={{ color: widget.color }}>
                {widget.label}
              </span>
            </div>
            <div className="text-sm font-semibold text-text truncate">{widget.value}</div>
            <div className="text-[10px] text-text-muted truncate">{widget.detail}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
