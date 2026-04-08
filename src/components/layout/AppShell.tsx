import { useEffect } from 'react';
import { useAppState } from '../../hooks/useAppState';
import { useRewards } from '../../hooks/useRewards';
import { MapView } from '../map/MapView';
import { Sidebar } from './Sidebar';
import { SlidePanel } from './SlidePanel';
import { CommandPalette } from '../shared/CommandPalette';
import { CountyPulse } from '../shared/CountyPulse';

export function AppShell() {
  const { state, dispatch } = useAppState();
  const { rewards, visitMunicipality, earnBadge } = useRewards();

  const handleOpenPanel = (content: 'weather' | 'water' | 'civic' | 'rewards' | 'traffic' | 'reports' | 'parking' | 'compare') => {
    dispatch({ type: 'OPEN_PANEL', content });
    if (content === 'weather') earnBadge('weather-watcher');
    if (content === 'water') earnBadge('water-monitor');
    if (content === 'civic') earnBadge('civic-minded');
  };

  useEffect(() => {
    if (state.selectedMunicipality) {
      visitMunicipality(state.selectedMunicipality);
    }
  }, [state.selectedMunicipality, visitMunicipality]);

  return (
    <div className="flex h-full">
      {/* Command Palette — Cmd+K */}
      <CommandPalette />

      {/* Mobile sidebar toggle */}
      {!state.sidebarOpen && (
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          className="fixed left-3 top-3 z-50 rounded-lg glass p-2.5 shadow-lg hover:bg-bg-hover transition-colors"
        >
          <svg className="h-5 w-5 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Mobile sidebar overlay */}
      {state.sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 lg:relative lg:z-auto transition-transform duration-200 ${
        state.sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:hidden'
      }`}>
        <Sidebar onOpenPanel={handleOpenPanel} points={rewards.points} />
      </div>

      {/* Map */}
      <div className="relative flex-1 min-w-0">
        <MapView />
        <CountyPulse />

        {/* Cmd+K hint */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
          <div className="glass rounded-full px-3 py-1.5 flex items-center gap-2 text-[10px] text-text-muted">
            <kbd className="rounded bg-bg-surface border border-border px-1 py-0.5 text-[9px]">⌘K</kbd>
            <span>Quick search</span>
          </div>
        </div>
      </div>

      {/* Slide Panel */}
      {state.slidePanelOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => dispatch({ type: 'CLOSE_PANEL' })}
          />
          <div className="fixed inset-y-0 right-0 z-40 lg:relative lg:z-auto">
            <SlidePanel rewards={rewards} />
          </div>
        </>
      )}
    </div>
  );
}
