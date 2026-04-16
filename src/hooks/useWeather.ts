import { useState, useEffect } from 'react';
import type { WeatherForecast, WeatherAlert } from '../types';
import { fetchForecast, fetchAlerts } from '../services/api/weather';

export function useWeather() {
  const [forecast, setForecast] = useState<WeatherForecast[]>([]);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const [f, a] = await Promise.all([fetchForecast(), fetchAlerts()]);
        if (!cancelled) {
          setForecast(f);
          setAlerts(a);
          setUpdatedAt(new Date());
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load weather');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    const interval = setInterval(load, 30 * 60 * 1000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  return { forecast, alerts, loading, error, updatedAt };
}
