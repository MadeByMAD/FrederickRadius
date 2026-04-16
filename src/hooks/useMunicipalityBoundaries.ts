import { useEffect, useState } from 'react';
import type { FeatureCollection, Feature, Polygon, MultiPolygon } from 'geojson';
import { municipalities } from '../data/municipalities';
import type { Municipality } from '../types';

/**
 * Maps the GIS `MUNIC` field value to our municipality id. Frederick
 * County GIS uses display names ("New Market", "Frederick City") while
 * our catalog uses slug ids ("new-market", "frederick").
 */
const GIS_NAME_TO_ID: Record<string, string> = {
  'Frederick City': 'frederick',
  'Thurmont': 'thurmont',
  'Emmitsburg': 'emmitsburg',
  'Middletown': 'middletown',
  'Brunswick': 'brunswick',
  'Walkersville': 'walkersville',
  'Myersville': 'myersville',
  'Woodsboro': 'woodsboro',
  'New Market': 'new-market',
  'Mount Airy': 'mount-airy',
  'Burkittsville': 'burkittsville',
  'Rosemont': 'rosemont',
};

const EMPTY: FeatureCollection = { type: 'FeatureCollection', features: [] };

export function useMunicipalityBoundaries() {
  const [data, setData] = useState<FeatureCollection>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch('/municipalities.geojson', { cache: 'force-cache' });
        if (!res.ok) throw new Error(`Failed to load boundaries (${res.status})`);
        const raw = (await res.json()) as FeatureCollection;

        const merged: Feature<Polygon | MultiPolygon, Municipality & { gisName: string }>[] = [];
        for (const feature of raw.features) {
          const gisName = (feature.properties?.MUNIC as string) ?? '';
          const id = GIS_NAME_TO_ID[gisName];
          if (!id) continue;
          const meta = municipalities.find((m) => m.id === id);
          if (!meta) continue;
          merged.push({
            ...feature,
            properties: { ...meta, gisName },
          } as Feature<Polygon | MultiPolygon, Municipality & { gisName: string }>);
        }

        if (!cancelled) {
          setData({ type: 'FeatureCollection', features: merged });
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load boundaries');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { data, loading, error };
}
