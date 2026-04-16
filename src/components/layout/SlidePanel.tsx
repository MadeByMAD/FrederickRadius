import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { slideInRight } from '../../lib/motion';
import { useClosePanel, type AppRoute } from '../../hooks/useAppRoute';
import { ErrorBoundary } from '../shared/ErrorBoundary';
import { PanelContent } from './AppShell';

const PANEL_TITLES: Record<string, string> = {
  municipality: 'Municipality',
  weather: 'Weather',
  water: 'Water Levels',
  traffic: 'Traffic',
  reports: '311 Service Requests',
  parking: 'Parking',
  civic: 'Civic',
  compare: 'Compare Municipalities',
  dashboard: 'County Dashboard',
  'address-intel': 'Address Intelligence',
};

export function SlidePanel({ route }: { route: AppRoute }) {
  const closePanel = useClosePanel();
  if (!route.panel) return null;

  const title = PANEL_TITLES[route.panel] ?? 'Details';

  return (
    <motion.div
      variants={slideInRight}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex h-full w-96 flex-shrink-0 flex-col border-l border-border bg-bg shadow-[var(--shadow-surface-2)]"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="font-display text-base font-semibold text-text">{title}</h2>
        <button
          onClick={closePanel}
          className="rounded p-1 text-text-muted hover:bg-bg-hover hover:text-text transition-colors"
          aria-label="Close panel"
        >
          <X className="h-5 w-5" strokeWidth={2} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <ErrorBoundary>
          <PanelContent route={route} />
        </ErrorBoundary>
      </div>
    </motion.div>
  );
}
