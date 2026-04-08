import { useState, useEffect, useCallback } from 'react';
import { municipalities } from '../../data/municipalities';

interface Props {
  onClose: () => void;
}

const TOUR_STOPS = [
  { ...municipalities.find((m) => m.id === 'frederick')!, zoom: 13, pitch: 55, bearing: -20 },
  { ...municipalities.find((m) => m.id === 'thurmont')!, zoom: 14, pitch: 50, bearing: 10 },
  { ...municipalities.find((m) => m.id === 'emmitsburg')!, zoom: 14, pitch: 50, bearing: -15 },
  { ...municipalities.find((m) => m.id === 'middletown')!, zoom: 14, pitch: 55, bearing: 20 },
  { ...municipalities.find((m) => m.id === 'brunswick')!, zoom: 14, pitch: 50, bearing: -10 },
  { ...municipalities.find((m) => m.id === 'walkersville')!, zoom: 14, pitch: 50, bearing: 5 },
  { ...municipalities.find((m) => m.id === 'myersville')!, zoom: 14.5, pitch: 55, bearing: -25 },
  { ...municipalities.find((m) => m.id === 'woodsboro')!, zoom: 14.5, pitch: 50, bearing: 0 },
  { ...municipalities.find((m) => m.id === 'new-market')!, zoom: 14.5, pitch: 50, bearing: 15 },
  { ...municipalities.find((m) => m.id === 'mount-airy')!, zoom: 14, pitch: 50, bearing: -5 },
  { ...municipalities.find((m) => m.id === 'burkittsville')!, zoom: 15, pitch: 55, bearing: -30 },
  { ...municipalities.find((m) => m.id === 'rosemont')!, zoom: 15, pitch: 50, bearing: 10 },
].filter(Boolean);

export function GuidedTour({ onClose }: Props) {
  const [currentStop, setCurrentStop] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const stop = TOUR_STOPS[currentStop];

  const flyToStop = useCallback((index: number) => {
    const s = TOUR_STOPS[index];
    if (!s) return;
    const flyTo = (window as unknown as Record<string, (lng: number, lat: number, zoom?: number) => void>).__mapFlyTo;
    if (flyTo) flyTo(s.centroid[0], s.centroid[1], s.zoom || 14);
  }, []);

  // Auto-advance
  useEffect(() => {
    if (!isPlaying) return;

    flyToStop(currentStop);

    const timer = setTimeout(() => {
      if (currentStop < TOUR_STOPS.length - 1) {
        setCurrentStop((c) => c + 1);
      } else {
        setIsPlaying(false);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentStop, isPlaying, flyToStop]);

  function handlePrev() {
    if (currentStop > 0) {
      setCurrentStop((c) => c - 1);
      setIsPlaying(false);
    }
  }

  function handleNext() {
    if (currentStop < TOUR_STOPS.length - 1) {
      setCurrentStop((c) => c + 1);
      setIsPlaying(false);
    }
  }

  if (!stop) return null;

  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 w-96 max-w-[calc(100vw-2rem)]">
      <div className="glass rounded-2xl shadow-2xl overflow-hidden glow-border">
        {/* Progress bar */}
        <div className="h-0.5 bg-border/30">
          <div
            className="h-full bg-gradient-to-r from-accent to-success transition-all duration-500"
            style={{ width: `${((currentStop + 1) / TOUR_STOPS.length) * 100}%` }}
          />
        </div>

        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🧭</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Tour Stop {currentStop + 1} of {TOUR_STOPS.length}
              </span>
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

          {/* Municipality Info */}
          <div className="animate-fade-up" key={currentStop}>
            <h3 className="text-lg font-bold text-text">{stop.name}</h3>
            <div className="mt-1 flex items-center gap-3 text-xs text-text-muted">
              <span>Pop. {stop.population.toLocaleString()}</span>
              <span>·</span>
              <span>{stop.area} mi²</span>
              <span>·</span>
              <span>Median Income ${(stop.medianIncome / 1000).toFixed(0)}k</span>
            </div>
            <p className="mt-2 text-xs text-text-secondary line-clamp-2">{stop.description}</p>
          </div>

          {/* Controls */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentStop === 0}
              className="rounded-lg px-3 py-1.5 text-xs text-text-secondary hover:text-text hover:bg-bg-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="rounded-full bg-accent/10 border border-accent/30 px-4 py-1.5 text-xs font-medium text-accent hover:bg-accent/20 transition-colors"
            >
              {isPlaying ? '⏸ Pause' : '▶ Play'}
            </button>

            <button
              onClick={handleNext}
              disabled={currentStop === TOUR_STOPS.length - 1}
              className="rounded-lg px-3 py-1.5 text-xs text-text-secondary hover:text-text hover:bg-bg-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>

          {/* Dot indicators */}
          <div className="mt-3 flex justify-center gap-1">
            {TOUR_STOPS.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrentStop(i); setIsPlaying(false); }}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentStop ? 'w-4 bg-accent' : i < currentStop ? 'w-1.5 bg-accent/40' : 'w-1.5 bg-border'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
