import { useAppState } from '../../hooks/useAppState';
import { municipalities } from '../../data/municipalities';
import { MunicipalityCard } from '../municipalities/MunicipalityCard';
import { MapControls } from '../map/MapControls';
import { SearchBar } from './SearchBar';

interface Props {
  onOpenPanel: (content: 'weather' | 'water' | 'civic' | 'rewards' | 'traffic' | 'reports' | 'parking' | 'compare' | 'dashboard') => void;
  onStartTour?: () => void;
}

export function Sidebar({ onOpenPanel, onStartTour }: Props) {
  const { state, dispatch } = useAppState();

  return (
    <div className="flex h-full w-80 flex-shrink-0 flex-col border-r border-border bg-bg lg:w-[340px]">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
              className="rounded p-1 text-text-muted hover:bg-bg-hover hover:text-text transition-colors lg:hidden"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-bold text-text tracking-tight">Frederick Radius</h1>
              <p className="text-xs text-text-muted">Frederick County, Maryland</p>
            </div>
          </div>
          <div className="rounded-full border border-border bg-bg-surface px-2.5 py-1 text-[10px] font-medium text-text-muted">
            Trust-first build
          </div>
        </div>
        <div className="mt-3">
          <SearchBar />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex-shrink-0 border-b border-border p-3">
        <div className="grid grid-cols-3 gap-1.5">
          <QuickAction icon="🌤️" label="Weather" onClick={() => onOpenPanel('weather')} />
          <QuickAction icon="💧" label="Water" onClick={() => onOpenPanel('water')} />
          <QuickAction icon="🚗" label="Traffic" onClick={() => onOpenPanel('traffic')} />
          <QuickAction icon="🏛️" label="Civic" onClick={() => onOpenPanel('civic')} />
          <QuickAction icon="📢" label="311" onClick={() => onOpenPanel('reports')} />
          <QuickAction icon="🅿️" label="Parking" onClick={() => onOpenPanel('parking')} />
          <QuickAction icon="⚖️" label="Compare" onClick={() => onOpenPanel('compare')} />
          <QuickAction icon="📊" label="Dashboard" onClick={() => onOpenPanel('dashboard')} />
        </div>
        <div className="mt-1.5 grid grid-cols-1">
          <QuickAction icon="📑" label="Map Layers" onClick={() => {
            const el = document.getElementById('layer-controls');
            el?.scrollIntoView({ behavior: 'smooth' });
          }} />
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
                isSelected={state.selectedMunicipality === m.id}
                onSelect={(id) => dispatch({ type: 'SELECT_MUNICIPALITY', id })}
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
      <div className="flex-shrink-0 border-t border-border px-4 py-2">
        {onStartTour && (
          <button
            onClick={onStartTour}
            className="w-full mb-2 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-accent/10 to-success/10 border border-accent/20 px-3 py-2 text-xs font-medium text-accent hover:from-accent/20 hover:to-success/20 transition-all"
          >
            <span>🧭</span> Take a Tour of Frederick County
          </button>
        )}
        <div className="text-center text-[10px] text-text-muted">
          Official feeds and manual reference data are intentionally shown with different trust levels.
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 rounded-lg p-2 text-center hover:bg-bg-hover transition-colors"
    >
      <span className="text-lg">{icon}</span>
      <span className="text-[10px] text-text-muted">{label}</span>
    </button>
  );
}
