import { useState, useEffect } from 'react';
import { fetchArcGISLayer } from '../services/api/arcgis';
import type { GeoJSONCollection } from '../types';

export function useGISLayer(endpoint: string, enabled: boolean) {
  const [data, setData] = useState<GeoJSONCollection | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (data) return; // Already loaded — ArcGIS cache handles freshness
    if (error) return;

    let cancelled = false;

    fetchArcGISLayer(endpoint)
      .then((geojson) => {
        if (!cancelled) setData(geojson);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load');
      });

    return () => { cancelled = true; };
  }, [data, enabled, endpoint, error]);

  const loading = enabled && data === null && error === null;
  return { data, loading, error };
}
