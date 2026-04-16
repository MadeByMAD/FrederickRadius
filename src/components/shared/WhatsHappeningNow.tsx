import { useState, type ComponentType } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Beer,
  CloudSun,
  Coffee,
  Compass,
  Droplets,
  Landmark,
  MapPin,
  Megaphone,
  ShieldAlert,
  TrafficCone,
  Trees,
} from 'lucide-react';
import { useWeather } from '../../hooks/useWeather';
import { getWeatherEmoji } from '../../services/api/weather';
import { useAppState } from '../../hooks/useAppState';
import { staggerContainer, staggerItem } from '../../lib/motion';
import { municipalities } from '../../data/municipalities';

type LucideIcon = ComponentType<{ className?: string; strokeWidth?: number }>;

interface Suggestion {
  Icon: LucideIcon;
  title: string;
  subtitle: string;
  action: () => void;
  color: string;
}

function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

const GREETINGS = {
  morning: 'Good morning',
  afternoon: 'Good afternoon',
  evening: 'Good evening',
  night: 'Late night',
};

export function WhatsHappeningNow() {
  const timeOfDay = getTimeOfDay();
  const { forecast, alerts } = useWeather();
  const { dispatch } = useAppState();
  const current = forecast[0];
  const [randomMuni] = useState(() =>
    municipalities[Math.floor(Math.random() * municipalities.length)]
  );

  const suggestions: Suggestion[] = [];

  // Time-aware suggestions
  if (timeOfDay === 'morning') {
    suggestions.push(
      { Icon: Coffee, title: 'Morning coffee spots', subtitle: 'Cafes & bakeries nearby', action: () => dispatch({ type: 'TOGGLE_LAYER', layerId: 'farmers-markets' }), color: 'var(--color-warning)' },
      { Icon: CloudSun, title: "Today's forecast", subtitle: current ? `${current.temperature}° ${current.shortForecast}` : 'Loading...', action: () => dispatch({ type: 'OPEN_PANEL', content: 'weather' }), color: 'var(--color-info)' },
    );
  } else if (timeOfDay === 'afternoon') {
    suggestions.push(
      { Icon: Trees, title: 'Explore nearby parks', subtitle: '618+ miles of trails', action: () => dispatch({ type: 'TOGGLE_LAYER', layerId: 'parks' }), color: 'var(--color-success)' },
      { Icon: TrafficCone, title: 'Traffic conditions', subtitle: 'Live CHART incidents', action: () => dispatch({ type: 'OPEN_PANEL', content: 'traffic' }), color: 'var(--color-warning)' },
    );
  } else if (timeOfDay === 'evening') {
    suggestions.push(
      { Icon: Beer, title: 'Dinner & drinks', subtitle: 'Restaurants with liquor licenses', action: () => dispatch({ type: 'TOGGLE_LAYER', layerId: 'liquor' }), color: 'var(--color-gold)' },
      { Icon: Landmark, title: 'Civic meetings tonight', subtitle: 'Council, planning, appeals', action: () => dispatch({ type: 'OPEN_PANEL', content: 'civic' }), color: 'var(--color-accent)' },
    );
  } else {
    suggestions.push(
      { Icon: Droplets, title: 'Stream levels', subtitle: '9 USGS gauges active', action: () => dispatch({ type: 'OPEN_PANEL', content: 'water' }), color: 'var(--color-info)' },
      { Icon: ShieldAlert, title: 'Safety resources', subtitle: 'Fire, police, shelters', action: () => dispatch({ type: 'TOGGLE_LAYER', layerId: 'fire-stations' }), color: 'var(--color-danger)' },
    );
  }

  // Always-relevant suggestions
  suggestions.push(
    { Icon: Megaphone, title: '311 service requests', subtitle: "What's being reported", action: () => dispatch({ type: 'OPEN_PANEL', content: 'reports' }), color: 'var(--color-danger)' },
    {
      Icon: MapPin,
      title: `Explore ${randomMuni.name.replace(/^(City of |Town of |Village of )/, '')}`,
      subtitle: `Pop. ${randomMuni.population.toLocaleString()}`,
      action: () => dispatch({ type: 'SELECT_MUNICIPALITY', id: randomMuni.id }),
      color: 'var(--color-accent)',
    },
  );

  return (
    <div className="space-y-4">
      {/* Greeting */}
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-text">{GREETINGS[timeOfDay]}</h2>
        <p className="mt-0.5 text-xs text-text-muted">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          {current && ` · ${getWeatherEmoji(current.shortForecast)} ${current.temperature}°${current.temperatureUnit}`}
        </p>
      </div>

      {/* Weather alerts */}
      {alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-xl border border-warning/30 bg-warning/10 p-3"
        >
          <div className="inline-flex items-center gap-2 text-sm font-medium text-warning">
            <AlertTriangle className="h-4 w-4" strokeWidth={2} />
            {alerts[0].event}
          </div>
          <p className="mt-1 text-xs text-text-secondary line-clamp-2">{alerts[0].headline}</p>
        </motion.div>
      )}

      {/* Smart suggestions */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 gap-2"
      >
        {suggestions.map((s, i) => (
          <motion.button
            key={i}
            variants={staggerItem}
            whileTap={{ scale: 0.97 }}
            onClick={s.action}
            className="rounded-xl border border-border bg-bg-elevated p-3 text-left shadow-[var(--shadow-surface-1)] hover:bg-bg-hover transition-colors"
          >
            <span
              className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ backgroundColor: 'var(--color-accent-subtle)', color: s.color }}
            >
              <s.Icon className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <div className="text-sm font-medium text-text">{s.title}</div>
            <div className="mt-0.5 text-[11px] text-text-muted">{s.subtitle}</div>
          </motion.button>
        ))}
      </motion.div>

      {/* Quick explore */}
      <div className="rounded-xl border border-border bg-bg-elevated p-4 shadow-[var(--shadow-surface-1)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-text">12 municipalities to explore</div>
            <div className="mt-0.5 text-xs text-text-muted">Right-click the map to look up any address.</div>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-subtle text-accent">
            <Compass className="h-5 w-5" strokeWidth={1.75} />
          </span>
        </div>
      </div>
    </div>
  );
}
