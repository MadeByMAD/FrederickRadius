import { useState, useEffect } from 'react';
import { Source, Layer } from 'react-map-gl/mapbox';
import { fetchWaterLevels } from '../../../services/api/water';

interface OverlayProps {
  onPopup: (info: { lng: number; lat: number; html: string } | null) => void;
}

export function WaterGaugeOverlay({ onPopup }: OverlayProps) {
  void onPopup;
  const [data, setData] = useState<GeoJSON.FeatureCollection | null>(null);

  useEffect(() => {
    fetchWaterLevels()
      .then((gauges) => {
        setData({
          type: 'FeatureCollection',
          features: gauges
            .filter((g) => g.latitude && g.longitude)
            .map((g) => {
              const height = g.values.find((v) => v.parameterCode === '00065');
              const discharge = g.values.find((v) => v.parameterCode === '00060');
              return {
                type: 'Feature' as const,
                geometry: { type: 'Point' as const, coordinates: [g.longitude, g.latitude] },
                properties: {
                  name: g.siteName,
                  siteCode: g.siteCode,
                  height: height ? height.value.toFixed(2) : 'N/A',
                  discharge: discharge ? discharge.value.toFixed(0) : 'N/A',
                },
              };
            }),
        });
      })
      .catch(() => {});
  }, []);

  if (!data) return null;

  return (
    <Source id="water-gauges" type="geojson" data={data}>
      <Layer
        id="water-gauges-pulse"
        type="circle"
        paint={{
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 8, 14, 16],
          'circle-color': '#06B6D4',
          'circle-opacity': 0.2,
        }}
      />
      <Layer
        id="water-gauges-dots"
        type="circle"
        paint={{
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 4, 14, 8],
          'circle-color': '#06B6D4',
          'circle-stroke-color': '#0A0A0A',
          'circle-stroke-width': 2,
        }}
      />
    </Source>
  );
}
