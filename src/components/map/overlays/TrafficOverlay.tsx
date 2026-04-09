import { useState, useEffect } from 'react';
import { Source, Layer } from 'react-map-gl/mapbox';
import { fetchTrafficIncidents } from '../../../services/api/traffic';

interface OverlayProps {
  onPopup: (info: { lng: number; lat: number; html: string } | null) => void;
}

export function TrafficOverlay({ onPopup }: OverlayProps) {
  void onPopup;
  const [data, setData] = useState<GeoJSON.FeatureCollection | null>(null);

  useEffect(() => {
    fetchTrafficIncidents()
      .then(({ incidents }) => {
        if (incidents.length === 0) return;
        setData({
          type: 'FeatureCollection',
          features: incidents.map((inc) => ({
            type: 'Feature' as const,
            geometry: { type: 'Point' as const, coordinates: [inc.longitude, inc.latitude] },
            properties: { type: inc.type, description: inc.description, road: inc.road, location: inc.location },
          })),
        });
      })
      .catch(() => {});
  }, []);

  if (!data) return null;

  return (
    <Source id="live-traffic" type="geojson" data={data}>
      <Layer
        id="live-traffic-pulse"
        type="circle"
        paint={{
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 10, 14, 18],
          'circle-color': '#F97316',
          'circle-opacity': 0.15,
        }}
      />
      <Layer
        id="live-traffic-dots"
        type="circle"
        paint={{
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 5, 14, 10],
          'circle-color': '#F97316',
          'circle-stroke-color': '#0A0A0A',
          'circle-stroke-width': 2,
          'circle-opacity': 0.9,
        }}
      />
    </Source>
  );
}
