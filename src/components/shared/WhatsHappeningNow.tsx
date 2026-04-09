import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWeather } from '../../hooks/useWeather';
import { getWeatherEmoji } from '../../services/api/weather';
import { useAppState } from '../../hooks/useAppState';
import { staggerContainer, staggerItem } from '../../lib/motion';
import { municipalities } from '../../data/municipalities';

interface Suggestion {
  icon: string;
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
  const [featuredMunicipality] = useState(
    () => municipalities.find((municipality) => municipality.id === 'frederick') ?? municipalities[0]
  );

  const suggestions: Suggestion[] = [];

  // Time-aware suggestions
  if (timeOfDay === 'morning') {
    suggestions.push(
      { icon: '🥕', title: 'Farmers markets', subtitle: 'County reference layer', action: () => dispatch({ type: 'TOGGLE_LAYER', layerId: 'farmers-markets' }), color: '#F59E0B' },
      { icon: '🌤️', title: 'Today\'s forecast', subtitle: current ? `${current.temperature}° ${current.shortForecast}` : 'Loading...', action: () => dispatch({ type: 'OPEN_PANEL', content: 'weather' }), color: '#3B82F6' },
    );
  } else if (timeOfDay === 'afternoon') {
    suggestions.push(
      { icon: '🌳', title: 'Explore nearby parks', subtitle: 'County park reference layers', action: () => dispatch({ type: 'TOGGLE_LAYER', layerId: 'parks' }), color: '#10B981' },
      { icon: '🚗', title: 'Traffic conditions', subtitle: 'CHART feed filtered to Frederick area', action: () => dispatch({ type: 'OPEN_PANEL', content: 'traffic' }), color: '#F97316' },
    );
  } else if (timeOfDay === 'evening') {
    suggestions.push(
      { icon: '🍺', title: 'Dinner & drinks', subtitle: 'Restaurants with liquor licenses', action: () => dispatch({ type: 'TOGGLE_LAYER', layerId: 'liquor' }), color: '#FBBF24' },
      { icon: '🏛️', title: 'Civic meetings', subtitle: 'Manual meeting snapshot', action: () => dispatch({ type: 'OPEN_PANEL', content: 'civic' }), color: '#8B5CF6' },
    );
  } else {
    suggestions.push(
      { icon: '💧', title: 'Stream levels', subtitle: '9 USGS gauges active', action: () => dispatch({ type: 'OPEN_PANEL', content: 'water' }), color: '#06B6D4' },
      { icon: '🛡️', title: 'Safety resources', subtitle: 'Fire station reference layer', action: () => dispatch({ type: 'TOGGLE_LAYER', layerId: 'fire-stations' }), color: '#EF4444' },
    );
  }

  // Always-relevant suggestions
  suggestions.push(
      { icon: '📢', title: '311 service requests', subtitle: 'Community reports, mostly city', action: () => dispatch({ type: 'OPEN_PANEL', content: 'reports' }), color: '#EF4444' },
      {
        icon: '📍',
        title: `Review ${featuredMunicipality.name.replace(/^(City of |Town of |Village of )/, '')}`,
        subtitle: 'Manual municipality profile snapshot',
        action: () => dispatch({ type: 'SELECT_MUNICIPALITY', id: featuredMunicipality.id }),
        color: '#3B82F6',
      },
  );

  return (
    <div className="space-y-4">
      {/* Greeting */}
      <div>
        <h2 className="text-lg font-bold text-text">{GREETINGS[timeOfDay]}</h2>
        <p className="text-xs text-text-muted">
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
          <div className="flex items-center gap-2 text-sm font-medium text-warning">
            <span>⚠️</span> {alerts[0].event}
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
            className="rounded-xl bg-bg-surface border border-border p-3 text-left hover:bg-bg-hover transition-colors active:bg-bg-hover"
          >
            <div className="text-xl mb-1.5">{s.icon}</div>
            <div className="text-sm font-medium text-text">{s.title}</div>
            <div className="text-[10px] text-text-muted mt-0.5">{s.subtitle}</div>
          </motion.button>
        ))}
      </motion.div>

      {/* Quick explore */}
      <div className="rounded-xl bg-gradient-to-r from-accent/10 to-success/10 border border-accent/20 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-text">12 municipalities to explore</div>
            <div className="text-xs text-text-muted mt-0.5">Municipal boundaries are not wired yet, so the map uses reference points and manual profile snapshots.</div>
          </div>
          <span className="text-2xl">🧭</span>
        </div>
      </div>
    </div>
  );
}
