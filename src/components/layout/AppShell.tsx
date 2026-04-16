import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BarChart3,
  ChevronRight,
  Compass,
  Crosshair,
  Layers,
  Menu,
  Search,
} from 'lucide-react';
import { useAppState } from '../../hooks/useAppState';
import { useAppRoute, useClosePanel, routes } from '../../hooks/useAppRoute';
import { MapView } from '../map/MapView';
import { Sidebar } from './Sidebar';
import { SlidePanel } from './SlidePanel';
import { BottomSheet, type SnapPoint } from './BottomSheet';
import { CommandPalette } from '../shared/CommandPalette';
import { CountyPulse } from '../shared/CountyPulse';
import { LayerPanel } from '../layers/LayerPanel';
import { LiveActivityFeed } from '../shared/LiveActivityFeed';
import { WelcomeScreen } from '../shared/WelcomeScreen';
import { GuidedTour } from '../shared/GuidedTour';
import { SearchBar } from './SearchBar';
import { MunicipalityCard } from '../municipalities/MunicipalityCard';
import { municipalities } from '../../data/municipalities';

// Mobile panel content (rendered inside BottomSheet)
import { WeatherPanel } from '../data-layers/WeatherPanel';
import { WaterLevelsPanel } from '../data-layers/WaterLevelsPanel';
import { TrafficPanel } from '../data-layers/TrafficPanel';
import { ReportsPanel } from '../data-layers/ReportsPanel';
import { ParkingPanel } from '../data-layers/ParkingPanel';
import { MeetingCalendar } from '../civic/MeetingCalendar';
import { RepresentativesPanel } from '../civic/RepresentativeCard';
import { MunicipalityProfile } from '../municipalities/MunicipalityProfile';
import { MunicipalityCompare } from '../municipalities/MunicipalityCompare';
import { AddressIntelligencePanel } from '../shared/AddressIntelligencePanel';
import { CountyDashboard } from '../data-layers/CountyDashboard';
import { WhatsHappeningNow } from '../shared/WhatsHappeningNow';
import { WidgetStrip } from '../shared/WidgetStrip';
import { ErrorBoundary } from '../shared/ErrorBoundary';
import { ThemeToggle } from '../shared/ThemeToggle';
import type { AppRoute } from '../../hooks/useAppRoute';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 768px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(!e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

export function AppShell() {
  const { state, dispatch } = useAppState();
  const route = useAppRoute();
  const navigate = useNavigate();
  const closePanel = useClosePanel();
  const isMobile = useIsMobile();
  const [showWelcome, setShowWelcome] = useState(() => !sessionStorage.getItem('fr-welcomed'));
  const [showTour, setShowTour] = useState(false);
  const [bottomSheetSnap, setBottomSheetSnap] = useState<SnapPoint>('peek');
  const [radiusCenter, setRadiusCenter] = useState<[number, number] | null>(null);

  // When a panel route opens on mobile, expand the bottom sheet.
  useEffect(() => {
    if (route.panel && isMobile) setBottomSheetSnap('full');
  }, [route.panel, isMobile]);

  // Enter key skips welcome
  useEffect(() => {
    if (!showWelcome) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') { setShowWelcome(false); sessionStorage.setItem('fr-welcomed', '1'); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showWelcome]);

  if (showWelcome) {
    return <WelcomeScreen onComplete={() => { setShowWelcome(false); sessionStorage.setItem('fr-welcomed', '1'); }} />;
  }

  // ── MOBILE LAYOUT ──
  if (isMobile) {
    return (
      <div className="h-full w-full relative">
        <CommandPalette />

        {/* Full-screen Map */}
        <div className="h-full w-full">
          <ErrorBoundary fallback={<MapErrorFallback />}>
            <MapView radiusCenter={radiusCenter} onCloseRadius={() => setRadiusCenter(null)} />
          </ErrorBoundary>
          <CountyPulse />
          {showTour && <GuidedTour onClose={() => setShowTour(false)} />}

          {/* Radius Explorer button */}
          <button
            onClick={() => setRadiusCenter(radiusCenter ? null : [-77.4105, 39.4143])}
            className={`absolute top-14 right-3 z-10 glass rounded-full px-3 py-1.5 inline-flex items-center gap-1.5 text-xs font-medium transition-colors ${
              radiusCenter ? 'text-accent' : 'text-text-secondary hover:text-text'
            }`}
            aria-label="Toggle radius explorer"
          >
            <Crosshair className="h-3.5 w-3.5" strokeWidth={2} />
            Radius
          </button>
        </div>

        {/* Bottom Sheet */}
        <BottomSheet
          snap={bottomSheetSnap}
          onSnapChange={setBottomSheetSnap}
          peekContent={
            <div className="space-y-2">
              <SearchBar />
              <WidgetStrip />
            </div>
          }
        >
          {/* Sheet scrollable content */}
          {route.panel ? (
            <div>
              <button
                onClick={() => { closePanel(); setBottomSheetSnap('half'); }}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-accent mb-3 py-1 hover:text-accent-hover transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
                Back
              </button>
              <ErrorBoundary>
                <PanelContent route={route} />
              </ErrorBoundary>
            </div>
          ) : (
            <div className="space-y-4">
              <WhatsHappeningNow />

              {/* County stats quick access */}
              <button
                onClick={() => navigate(routes.data('dashboard'))}
                className="w-full rounded-xl border border-border bg-bg-elevated p-3 text-left shadow-[var(--shadow-surface-1)] hover:bg-bg-hover transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-accent-subtle text-accent">
                      <BarChart3 className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-text">County Dashboard</div>
                      <div className="text-[11px] text-text-muted truncate">305K residents · 4,500+ businesses · $560M impact</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 flex-shrink-0 text-text-muted" strokeWidth={2} />
                </div>
              </button>

              {/* Municipalities */}
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Municipalities
                </h3>
                <button onClick={() => navigate(routes.data('compare'))} className="text-xs font-medium text-accent">
                  Compare
                </button>
              </div>
              {municipalities.map((m) => (
                <MunicipalityCard
                  key={m.id}
                  municipality={m}
                  isSelected={route.municipalitySlug === m.id}
                  onSelect={(id) => navigate(routes.municipality(id))}
                />
              ))}
              <button
                onClick={() => setShowTour(true)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-bg-elevated px-3 py-2.5 text-xs font-medium text-text hover:bg-bg-hover transition-colors"
              >
                <Compass className="h-3.5 w-3.5 text-accent" strokeWidth={2} />
                Take a tour of Frederick County
              </button>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-[11px] uppercase tracking-wider text-text-muted">Appearance</span>
                <ThemeToggle />
              </div>
            </div>
          )}
        </BottomSheet>
      </div>
    );
  }

  // ── DESKTOP LAYOUT ──
  const slidePanelOpen = route.panel !== null;
  return (
    <div className="flex h-full">
      <CommandPalette />

      {!state.sidebarOpen && (
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          className="fixed left-3 top-3 z-50 glass rounded-lg p-2.5 shadow-[var(--shadow-surface-2)] hover:bg-bg-hover transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5 text-text" strokeWidth={2} />
        </button>
      )}

      {state.sidebarOpen && (
        <Sidebar onStartTour={() => setShowTour(true)} />
      )}

      <div className="relative flex-1 min-w-0">
        <ErrorBoundary fallback={<MapErrorFallback />}>
          <MapView radiusCenter={radiusCenter} onCloseRadius={() => setRadiusCenter(null)} />
        </ErrorBoundary>
        <CountyPulse />
        <LiveActivityFeed />
        {showTour && <GuidedTour onClose={() => setShowTour(false)} />}

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
          <div className="glass rounded-full px-3 py-1.5 flex items-center gap-2 text-[11px] text-text-muted">
            <Search className="h-3 w-3" strokeWidth={2} />
            <span>Search</span>
            <kbd className="rounded bg-bg-surface border border-border px-1 py-0.5 text-[9px] font-sans">⌘K</kbd>
          </div>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_LAYER_PANEL' })}
            className={`glass rounded-full px-3 py-1.5 inline-flex items-center gap-1.5 text-[11px] transition-colors ${
              state.layerPanelOpen ? 'text-accent' : 'text-text-muted hover:text-text'
            }`}
          >
            <Layers className="h-3 w-3" strokeWidth={2} />
            Layers
          </button>
          <button
            onClick={() => setShowTour(true)}
            className="glass rounded-full px-3 py-1.5 inline-flex items-center gap-1.5 text-[11px] text-text-muted hover:text-text transition-colors"
          >
            <Compass className="h-3 w-3" strokeWidth={2} />
            Tour
          </button>
        </div>
      </div>

      <AnimatePresence>
        {state.layerPanelOpen && !slidePanelOpen && <LayerPanel />}
      </AnimatePresence>

      <AnimatePresence>
        {slidePanelOpen && <SlidePanel route={route} />}
      </AnimatePresence>
    </div>
  );
}

function MapErrorFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-bg-surface p-6 text-center">
      <div className="max-w-sm">
        <div className="text-sm font-medium text-text">The map failed to load</div>
        <p className="mt-1 text-xs text-text-muted">
          This usually means the Mapbox token is missing or rate-limited. Check your network and try reloading.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-white hover:bg-accent-hover"
        >
          Reload
        </button>
      </div>
    </div>
  );
}

export function PanelContent({ route }: { route: AppRoute }) {
  switch (route.panel) {
    case 'municipality':
      return <MunicipalityProfile slug={route.municipalitySlug} />;
    case 'weather':
      return <WeatherPanel />;
    case 'water':
      return <WaterLevelsPanel />;
    case 'traffic':
      return <TrafficPanel />;
    case 'reports':
      return <ReportsPanel />;
    case 'parking':
      return <ParkingPanel />;
    case 'compare':
      return <MunicipalityCompare />;
    case 'dashboard':
      return <CountyDashboard />;
    case 'civic':
      return (
        <div className="space-y-6">
          <div><h3 className="mb-3 text-sm font-semibold text-text">Upcoming Meetings</h3><MeetingCalendar /></div>
          <div><h3 className="mb-3 text-sm font-semibold text-text">Representatives</h3><RepresentativesPanel /></div>
        </div>
      );
    case 'address-intel':
      return route.address ? (
        <AddressIntelligencePanel
          lat={route.address.lat}
          lng={route.address.lng}
          address={route.address.addressText}
        />
      ) : null;
    default:
      return null;
  }
}
