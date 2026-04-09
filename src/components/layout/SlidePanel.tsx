import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useAppState } from '../../hooks/useAppState';
import { slideInRight } from '../../lib/motion';
import { MunicipalityProfile } from '../municipalities/MunicipalityProfile';
import { MunicipalityCompare } from '../municipalities/MunicipalityCompare';
import { WeatherPanel } from '../data-layers/WeatherPanel';
import { WaterLevelsPanel } from '../data-layers/WaterLevelsPanel';
import { TrafficPanel } from '../data-layers/TrafficPanel';
import { ReportsPanel } from '../data-layers/ReportsPanel';
import { CountyDashboard } from '../data-layers/CountyDashboard';
import { ParkingPanel } from '../data-layers/ParkingPanel';
import { MeetingCalendar } from '../civic/MeetingCalendar';
import { RepresentativesPanel } from '../civic/RepresentativeCard';
import { RewardsPanel } from '../rewards/RewardsPanel';
import { AddressIntelligencePanel } from '../shared/AddressIntelligencePanel';
import { ErrorBoundary } from '../shared/ErrorBoundary';
import type { RewardsState } from '../../types';
import { productFeatures } from '../../config/features';

const PANEL_TITLES: Record<string, string> = {
  municipality: 'Municipality',
  weather: 'Weather',
  water: 'Water Levels',
  traffic: 'Traffic',
  reports: '311 Service Requests',
  parking: 'Parking',
  civic: 'Civic Directory & Meetings',
  rewards: 'Rewards',
  compare: 'Compare Municipalities',
  dashboard: 'County Dashboard',
  'address-intel': 'Location Context',
  search: 'Search Results',
};

interface Props {
  rewards: RewardsState;
}

export function SlidePanel({ rewards }: Props) {
  const { state, dispatch } = useAppState();

  if (!state.slidePanelOpen || !state.slidePanelContent) return null;

  const title = PANEL_TITLES[state.slidePanelContent] || 'Details';

  return (
    <motion.div
      variants={slideInRight}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex h-full w-96 flex-shrink-0 flex-col border-l border-border bg-bg">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-text">{title}</h2>
        <button
          onClick={() => dispatch({ type: 'CLOSE_PANEL' })}
          className="rounded p-1 text-text-muted hover:bg-bg-hover hover:text-text transition-colors"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <ErrorBoundary>
          <PanelContent type={state.slidePanelContent} rewards={rewards} />
        </ErrorBoundary>
      </div>
    </motion.div>
  );
}

function PanelContent({ type, rewards }: { type: string; rewards: RewardsState }): ReactNode {
  const { state } = useAppState();

  switch (type) {
    case 'municipality':
      return <MunicipalityProfile />;
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
    case 'civic':
      return <CivicContent />;
    case 'compare':
      return <MunicipalityCompare />;
    case 'dashboard':
      return <CountyDashboard />;
    case 'rewards':
      return productFeatures.experimentalExploration
        ? <RewardsPanel rewards={rewards} />
        : <ExperimentalFeatureNotice />;
    case 'address-intel':
      return state.addressIntel ? (
        <AddressIntelligencePanel
          lat={state.addressIntel.lat}
          lng={state.addressIntel.lng}
          address={state.addressIntel.address}
        />
      ) : <div className="text-sm text-text-secondary">Search for an address to inspect location context and source-backed overlays.</div>;
    default:
      return <div className="text-sm text-text-secondary">Select an item to view details</div>;
  }
}

function CivicContent() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-text">Upcoming Meetings</h3>
        <MeetingCalendar />
      </div>
      <div>
        <h3 className="mb-3 text-sm font-semibold text-text">Your Representatives</h3>
        <RepresentativesPanel />
      </div>
    </div>
  );
}

function ExperimentalFeatureNotice() {
  return (
    <div className="rounded-lg border border-border bg-bg-surface p-4 text-sm text-text-secondary">
      Exploration rewards are disabled in the trust-first build. If they return, they should stay clearly experimental and never outrank civic utility.
    </div>
  );
}
