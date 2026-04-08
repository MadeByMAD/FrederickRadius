import { useEffect, useState } from 'react';
import { useAppState } from '../../hooks/useAppState';
import { useRewards } from '../../hooks/useRewards';
import { MapView } from '../map/MapView';
import { Sidebar } from './Sidebar';
import { SlidePanel } from './SlidePanel';
import { CommandPalette } from '../shared/CommandPalette';
import { CountyPulse } from '../shared/CountyPulse';
import { LiveActivityFeed } from '../shared/LiveActivityFeed';
import { WelcomeScreen } from '../shared/WelcomeScreen';
import { GuidedTour } from '../shared/GuidedTour';

export function AppShell() {
  const { state, dispatch } = useAppState();
  const { rewards, visitMunicipality, earnBadge } = useRewards();
  const [showWelcome, setShowWelcome] = useState(() => {
    return !sessionStorage.getItem('fr-welcomed');
  });
  const [showTour, setShowTour] = useState(false);

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

  // Enter key skips welcome
  useEffect(() => {
    if (!showWelcome) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        setShowWelcome(false);
        sessionStorage.setItem('fr-welcomed', '1');
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showWelcome]);

  if (showWelcome) {
    return (
      <WelcomeScreen
        onComplete={() => {
          setShowWelcome(false);
          sessionStorage.setItem('fr-welcomed', '1');
        }}
      />
    );
  }

  return (
    <div className="flex h-full">
      {/* Command Palette */}
      <CommandPalette />

      {/* Mobile sidebar toggle */}
      {!state.sidebarOpen && (
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          className="fixed left-3 top-3 z-50 glass rounded-lg p-2.5 shadow-lg hover:bg-bg-hover transition-colors"
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
        <Sidebar
          onOpenPanel={handleOpenPanel}
          points={rewards.points}
          onStartTour={() => setShowTour(true)}
        />
      </div>

      {/* Map */}
      <div className="relative flex-1 min-w-0">
        <MapView />
        <CountyPulse />
        <LiveActivityFeed />

        {/* Guided Tour */}
        {showTour && <GuidedTour onClose={() => setShowTour(false)} />}

        {/* Bottom bar */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
          <div className="glass rounded-full px-3 py-1.5 flex items-center gap-2 text-[10px] text-text-muted">
            <kbd className="rounded bg-bg-surface border border-border px-1 py-0.5 text-[9px]">⌘K</kbd>
            <span>Search</span>
          </div>
          <button
            onClick={() => setShowTour(true)}
            className="glass rounded-full px-3 py-1.5 text-[10px] text-text-muted hover:text-text transition-colors"
          >
            🧭 Tour
          </button>
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
