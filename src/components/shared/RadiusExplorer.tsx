import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Source, Layer, Marker } from 'react-map-gl/mapbox';
import { useNavigate } from 'react-router-dom';
import * as turf from '@turf/turf';
import { municipalities } from '../../data/municipalities';
import { routes } from '../../hooks/useAppRoute';

interface Props {
  center: [number, number]; // [lng, lat]
  onClose: () => void;
}

export function RadiusExplorer({ center, onClose }: Props) {
  const [radiusMiles, setRadiusMiles] = useState(3);
  const navigate = useNavigate();

  // Generate circle GeoJSON
  const circleData = useMemo(() => {
    const circle = turf.circle(center, radiusMiles, { units: 'miles', steps: 64 });
    return circle;
  }, [center, radiusMiles]);

  // Find municipalities within radius
  const nearbyMunis = useMemo(() => {
    return municipalities.filter((m) => {
      const dist = turf.distance(
        turf.point(center),
        turf.point(m.centroid),
        { units: 'miles' }
      );
      return dist <= radiusMiles;
    }).map((m) => ({
      ...m,
      distance: turf.distance(turf.point(center), turf.point(m.centroid), { units: 'miles' }),
    })).sort((a, b) => a.distance - b.distance);
  }, [center, radiusMiles]);

  const totalPop = nearbyMunis.reduce((sum, m) => sum + m.population, 0);

  return (
    <>
      {/* Map overlay — radius circle */}
      <Source id="radius-circle" type="geojson" data={circleData}>
        <Layer
          id="radius-fill"
          type="fill"
          paint={{
            'fill-color': '#3B82F6',
            'fill-opacity': 0.08,
          }}
        />
        <Layer
          id="radius-border"
          type="line"
          paint={{
            'line-color': '#3B82F6',
            'line-width': 2,
            'line-dasharray': [3, 2],
            'line-opacity': 0.6,
          }}
        />
      </Source>

      {/* Center pin */}
      <Marker longitude={center[0]} latitude={center[1]}>
        <motion.div
          initial={{ scale: 0, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className="w-6 h-6 rounded-full bg-accent border-2 border-white shadow-lg shadow-accent/30"
        />
      </Marker>

      {/* Control panel */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 w-80 max-w-[calc(100vw-2rem)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl shadow-2xl p-4 space-y-3"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-text">Radius Explorer</h3>
              <p className="text-[10px] text-text-muted">
                {nearbyMunis.length} municipalit{nearbyMunis.length === 1 ? 'y' : 'ies'} within {radiusMiles} mi
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded p-1 text-text-muted hover:text-text hover:bg-bg-hover transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-text-muted">Radius</span>
              <span className="text-sm font-bold text-accent tabular-nums">{radiusMiles} miles</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={15}
              step={0.5}
              value={radiusMiles}
              onChange={(e) => setRadiusMiles(parseFloat(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none bg-border cursor-pointer accent-accent"
            />
            <div className="flex justify-between text-[9px] text-text-muted mt-0.5">
              <span>0.5 mi</span>
              <span>15 mi</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-bg-elevated p-2 text-center">
              <div className="text-base font-bold text-accent">{nearbyMunis.length}</div>
              <div className="text-[9px] text-text-muted">Towns</div>
            </div>
            <div className="rounded-lg bg-bg-elevated p-2 text-center">
              <div className="text-base font-bold text-success">{totalPop > 1000 ? `${(totalPop / 1000).toFixed(0)}K` : totalPop}</div>
              <div className="text-[9px] text-text-muted">People</div>
            </div>
            <div className="rounded-lg bg-bg-elevated p-2 text-center">
              <div className="text-base font-bold text-warning">{Math.round(Math.PI * radiusMiles * radiusMiles)}</div>
              <div className="text-[9px] text-text-muted">mi²</div>
            </div>
          </div>

          {/* Nearby municipalities */}
          {nearbyMunis.length > 0 && (
            <div className="max-h-32 overflow-y-auto space-y-1">
              {nearbyMunis.map((m) => (
                <button
                  key={m.id}
                  onClick={() => navigate(routes.municipality(m.id))}
                  className="flex items-center justify-between w-full rounded-lg px-2.5 py-1.5 text-left hover:bg-bg-hover transition-colors"
                >
                  <span className="text-xs text-text truncate">{m.name}</span>
                  <span className="text-[10px] text-text-muted tabular-nums">{m.distance.toFixed(1)} mi</span>
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}
