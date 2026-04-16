import { useState, useEffect } from 'react';
import type { WaterGauge } from '../types';
import { fetchWaterLevels } from '../services/api/water';

export function useWaterLevels() {
  const [gauges, setGauges] = useState<WaterGauge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchWaterLevels();
        if (!cancelled) {
          setGauges(data);
          setUpdatedAt(new Date());
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load water data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    const interval = setInterval(load, 15 * 60 * 1000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  return { gauges, loading, error, updatedAt };
}
