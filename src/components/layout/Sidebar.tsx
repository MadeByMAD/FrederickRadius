import type { ComponentType } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  CloudSun,
  Compass,
  Droplets,
  GitCompareArrows,
  Landmark,
  Layers,
  Megaphone,
  SquareParking,
  TrafficCone,
  X,
} from 'lucide-react';
import { useAppState } from '../../hooks/useAppState';
import { useAppRoute, routes } from '../../hooks/useAppRoute';
import { municipalities } from '../../data/municipalities';
import { MunicipalityCard } from '../municipalities/MunicipalityCard';
import { MapControls } from '../map/MapControls';
import { SearchBar } from './SearchBar';
import { ThemeToggle } from '../shared/ThemeToggle';

type LucideIcon = ComponentType<{ className?: string; strokeWidth?: number }>;

interface Props {
  onStartTour?: () => void;
}

export function Sidebar({ onStartTour }: Props) {
  const { dispatch } = useAppState();
  const route = useAppRoute();
  const navigate = useNavigate();

  return (
    <div className="flex h-full w-80 flex-shrink-0 flex-col border-r border-border bg-bg lg:w-[340px]">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
              className="rounded p-1 text-text-muted hover:bg-bg-hover hover:text-text transition-colors lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
            <div>
              <h1 className="font-display text-xl font-semibold text-text leading-none">Frederick Radius</h1>
              <p className="mt-1 text-xs text-text-muted">Frederick County, Maryland</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
        <div className="mt-3">
          <SearchBar />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex-shrink-0 border-b border-border p-3">
        <div className="grid grid-cols-3 gap-1.5">
          <QuickAction Icon={CloudSun} label="Weather" onClick={() => navigate(routes.data('weather'))} />
          <QuickAction Icon={Droplets} label="Water" onClick={() => navigate(routes.data('water'))} />
          <QuickAction Icon={TrafficCone} label="Traffic" onClick={() => navigate(routes.data('traffic'))} />
          <QuickAction Icon={Landmark} label="Civic" onClick={() => navigate(routes.data('civic'))} />
          <QuickAction Icon={Megaphone} label="311" onClick={() => navigate(routes.data('reports'))} />
          <QuickAction Icon={SquareParking} label="Parking" onClick={() => navigate(routes.data('parking'))} />
          <QuickAction Icon={GitCompareArrows} label="Compare" onClick={() => navigate(routes.data('compare'))} />
          <QuickAction Icon={BarChart3} label="Dashboard" onClick={() => navigate(routes.data('dashboard'))} />
          <QuickAction
            Icon={Layers}
            label="Layers"
            onClick={() => {
              const el = document.getElementById('layer-controls');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Municipalities */}
        <div className="p-3">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Municipalities ({municipalities.length})
          </h3>
          <div className="space-y-1.5">
            {municipalities.map((m) => (
              <MunicipalityCard
                key={m.id}
                municipality={m}
                isSelected={route.municipalitySlug === m.id}
                onSelect={(id) => navigate(routes.municipality(id))}
              />
            ))}
          </div>
        </div>

        {/* Layer Controls */}
        <div id="layer-controls" className="border-t border-border p-3">
          <MapControls />
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-border px-4 py-3">
        {onStartTour && (
          <button
            onClick={onStartTour}
            className="w-full mb-2 flex items-center justify-center gap-2 rounded-lg border border-border bg-bg-elevated px-3 py-2 text-xs font-medium text-text hover:bg-bg-hover transition-colors"
          >
            <Compass className="h-3.5 w-3.5 text-accent" strokeWidth={2} />
            Take a tour of Frederick County
          </button>
        )}
        <div className="text-center text-[11px] leading-snug text-text-muted">
          Data from Frederick County GIS, NWS, USGS, Census, and Maryland CHART.
        </div>
      </div>
    </div>
  );
}

function QuickAction({ Icon, label, onClick }: { Icon: LucideIcon; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-1.5 rounded-lg p-2 text-center hover:bg-bg-hover transition-colors"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-bg-surface text-text-secondary group-hover:bg-accent-subtle group-hover:text-accent transition-colors">
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </span>
      <span className="text-[11px] font-medium text-text-secondary">{label}</span>
    </button>
  );
}
