import { useMemo } from 'react';
import { Source, Layer } from 'react-map-gl/mapbox';
import { dataManifest } from '../../../data/data-manifest';

interface OverlayProps {
  onPopup: (info: { lng: number; lat: number; html: string } | null) => void;
}

export function ParkingOverlay({ onPopup }: OverlayProps) {
  void onPopup;
  const data = useMemo<GeoJSON.FeatureCollection>(
    () => ({
      type: 'FeatureCollection',
      features: dataManifest.parking.garages.map((g) => ({
        type: 'Feature' as const,
        geometry: { type: 'Point' as const, coordinates: [g.lng, g.lat] },
        properties: { name: g.name, address: g.address },
      })),
    }),
    []
  );

  return (
    <Source id="parking-garages" type="geojson" data={data}>
      <Layer
        id="parking-garages-dots"
        type="circle"
        paint={{
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 4, 15, 10],
          'circle-color': '#8B5CF6',
          'circle-stroke-color': '#0A0A0A',
          'circle-stroke-width': 2,
        }}
      />
    </Source>
  );
}
