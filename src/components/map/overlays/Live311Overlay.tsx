import { useState, useEffect } from 'react';
import { Source, Layer } from 'react-map-gl/mapbox';
import { fetch311Issues } from '../../../services/api/seeclickfix';

interface OverlayProps {
  onPopup: (info: { lng: number; lat: number; html: string } | null) => void;
}

export function Live311Overlay({ onPopup }: OverlayProps) {
  void onPopup;
  const [issues, setIssues] = useState<GeoJSON.FeatureCollection | null>(null);

  useEffect(() => {
    fetch311Issues()
      .then((data) => {
        const fc: GeoJSON.FeatureCollection = {
          type: 'FeatureCollection',
          features: data
            .filter((i) => i.lat && i.lng)
            .map((i) => ({
              type: 'Feature' as const,
              geometry: { type: 'Point' as const, coordinates: [i.lng, i.lat] },
              properties: {
                summary: i.summary || 'Service Request',
                status: i.status,
                type: i.request_type?.title || 'General',
                address: i.address || '',
                date: new Date(i.created_at).toLocaleDateString(),
              },
            })),
        };
        setIssues(fc);
      })
      .catch(() => {});
  }, []);

  if (!issues) return null;

  return (
    <Source id="live-311" type="geojson" data={issues}>
      <Layer
        id="live-311-pulse"
        type="circle"
        filter={['==', ['get', 'status'], 'open']}
        paint={{
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 6, 14, 14],
          'circle-color': '#EF4444',
          'circle-opacity': 0.2,
        }}
      />
      <Layer
        id="live-311-dots"
        type="circle"
        paint={{
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 3, 14, 8],
          'circle-color': [
            'match', ['get', 'status'],
            'open', '#EF4444',
            'acknowledged', '#F59E0B',
            'closed', '#10B981',
            '#6B7280',
          ],
          'circle-stroke-color': '#0A0A0A',
          'circle-stroke-width': 2,
          'circle-opacity': 0.85,
        }}
      />
    </Source>
  );
}
