import { useState, useMemo, type ComponentType, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Droplets, Landmark, Sunrise, UtensilsCrossed } from 'lucide-react';
import { useWeather } from '../../hooks/useWeather';
import { useWaterLevels } from '../../hooks/useWaterLevels';
import { getWeatherEmoji } from '../../services/api/weather';
import { getWaterLevelStatus } from '../../services/api/water';
import { useAppState } from '../../hooks/useAppState';
import { upcomingMeetings } from '../../data/civic';

type LucideIcon = ComponentType<{ className?: string; strokeWidth?: number }>;

interface Widget {
  id: string;
  icon: ReactNode;
  label: string;
  value: string;
  detail: string;
  color: string;
  onClick: () => void;
}

function iconNode(Icon: LucideIcon) {
  return <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />;
}

export function WidgetStrip() {
  const { forecast, alerts } = useWeather();
  const { gauges } = useWaterLevels();
  const { dispatch } = useAppState();
  const [now] = useState(() => new Date());

  const widgets = useMemo<Widget[]>(() => {
    const w: Widget[] = [];
    const current = forecast[0];

    // Weather — NWS-derived glyph still reads as useful info at a glance.
    if (current) {
      w.push({
        id: 'weather',
        icon: <span className="text-sm leading-none">{getWeatherEmoji(current.shortForecast)}</span>,
        label: 'Now',
        value: `${current.temperature}°${current.temperatureUnit}`,
        detail: current.shortForecast,
        color: 'var(--color-info)',
        onClick: () => dispatch({ type: 'OPEN_PANEL', content: 'weather' }),
      });
    }

    // Alerts
    if (alerts.length > 0) {
      w.push({
        id: 'alert',
        icon: iconNode(AlertTriangle),
        label: 'Alert',
        value: alerts[0].event,
        detail: 'Active weather alert',
        color: 'var(--color-warning)',
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
        icon: iconNode(Landmark),
        label: daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil}d`,
        value: nextMeeting.title.replace('County Council ', '').replace(' Session', ''),
        detail: `${nextMeeting.time} · ${meetDate.toLocaleDateString('en-US', { weekday: 'short' })}`,
        color: 'var(--color-accent)',
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
        const status = getWaterLevelStatus(withHeight.height);
        w.push({
          id: 'water',
          icon: iconNode(Droplets),
          label: status.label,
          value: `${withHeight.height.toFixed(1)} ft`,
          detail: withHeight.name.split(' at ')[0] || 'Stream gauge',
          color: status.color,
          onClick: () => dispatch({ type: 'OPEN_PANEL', content: 'water' }),
        });
      }
    }

    // Time of day suggestion
    const hour = now.getHours();
    if (hour >= 6 && hour < 10) {
      w.push({
        id: 'suggest',
        icon: iconNode(Sunrise),
        label: 'Morning',
        value: 'Farmers Markets',
        detail: 'Open today nearby',
        color: 'var(--color-warning)',
        onClick: () => dispatch({ type: 'TOGGLE_LAYER', layerId: 'farmers-markets' }),
      });
    } else if (hour >= 17 && hour < 21) {
      w.push({
        id: 'suggest',
        icon: iconNode(UtensilsCrossed),
        label: 'Evening',
        value: 'Dining spots',
        detail: '250+ licensed venues',
        color: 'var(--color-gold)',
        onClick: () => dispatch({ type: 'TOGGLE_LAYER', layerId: 'liquor' }),
      });
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
            <div className="flex items-center gap-1.5 mb-1" style={{ color: widget.color }}>
              {widget.icon}
              <span className="text-[10px] font-medium uppercase tracking-wider">
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
