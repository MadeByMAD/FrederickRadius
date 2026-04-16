import type { ComponentType } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Building2,
  CircleDollarSign,
  Database,
  Luggage,
  Store,
  Users,
} from 'lucide-react';
import { staggerContainer, staggerItem } from '../../lib/motion';
import { municipalities } from '../../data/municipalities';

type LucideIcon = ComponentType<{ className?: string; strokeWidth?: number }>;

interface Stat {
  label: string;
  display: string;
  Icon: LucideIcon;
}

const COUNTY_STATS: Stat[] = [
  { label: 'Population', display: '305K+', Icon: Users },
  { label: 'Businesses', display: '4,500+', Icon: Store },
  { label: 'Annual Visitors', display: '1.9M', Icon: Luggage },
  { label: 'Economic Impact', display: '$560M', Icon: CircleDollarSign },
  { label: 'Municipalities', display: '12', Icon: Building2 },
  { label: 'Data Sources', display: '500+', Icon: Database },
];

const ECONOMIC_HIGHLIGHTS = [
  { label: 'Median Household Income', value: '$120,458', context: '33% above national median', trend: 'up' as const },
  { label: 'Median Home Value', value: '$437,700', context: 'Strong real estate market', trend: 'up' as const },
  { label: 'Unemployment Rate', value: '2.5%', context: 'Well below national average', trend: 'down' as const },
  { label: 'Labor Force', value: '153,799', context: 'Highly educated workforce', trend: 'stable' as const },
];

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'stable' }) {
  if (trend === 'up') return <ArrowUp className="h-3.5 w-3.5 text-success" strokeWidth={2} />;
  if (trend === 'down') return <ArrowDown className="h-3.5 w-3.5 text-success" strokeWidth={2} />;
  return <ArrowRight className="h-3.5 w-3.5 text-text-muted" strokeWidth={2} />;
}

export function CountyDashboard() {
  const totalPop = municipalities.reduce((sum, m) => sum + m.population, 0);

  return (
    <div className="space-y-6">
      {/* Hero stats grid */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-3 gap-2"
      >
        {COUNTY_STATS.map((stat) => (
          <motion.div
            key={stat.label}
            variants={staggerItem}
            className="rounded-xl border border-border bg-bg-elevated p-3 text-center shadow-[var(--shadow-surface-1)]"
          >
            <span className="mx-auto mb-2 flex h-7 w-7 items-center justify-center rounded-md bg-accent-subtle text-accent">
              <stat.Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
            </span>
            <div className="font-display text-lg font-semibold tabular-nums text-text">
              {stat.display}
            </div>
            <div className="mt-0.5 text-[10px] uppercase tracking-wider text-text-muted">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Economic highlights */}
      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Economic Indicators
        </h4>
        <div className="space-y-1.5">
          {ECONOMIC_HIGHLIGHTS.map((item) => (
            <div key={item.label} className="rounded-lg border border-border bg-bg-surface p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs text-text-muted">{item.label}</div>
                  <div className="mt-0.5 font-display text-base font-semibold text-text">{item.value}</div>
                </div>
                <TrendIcon trend={item.trend} />
              </div>
              <div className="mt-1 text-[11px] text-text-muted">{item.context}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Municipality breakdown */}
      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Municipality Population Share
        </h4>
        <div className="space-y-1.5">
          {municipalities
            .slice()
            .sort((a, b) => b.population - a.population)
            .slice(0, 6)
            .map((m) => {
              const pct = (m.population / totalPop) * 100;
              return (
                <div key={m.id} className="flex items-center gap-3">
                  <div className="w-24 truncate text-xs text-text">
                    {m.name.replace(/^(City of |Town of |Village of )/, '')}
                  </div>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-bg-hover">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full bg-accent"
                    />
                  </div>
                  <div className="w-16 text-right text-xs tabular-nums text-text-muted">
                    {m.population.toLocaleString()}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Data sources summary */}
      <div className="rounded-xl border border-border bg-bg-elevated p-4 shadow-[var(--shadow-surface-1)]">
        <div className="mb-2 text-sm font-semibold text-text">Powered by public data</div>
        <dl className="grid grid-cols-2 gap-y-1.5 text-xs text-text-secondary">
          <dt>Frederick County GIS</dt>
          <dd className="text-right text-text-muted">198 services</dd>
          <dt>City of Frederick GIS</dt>
          <dd className="text-right text-text-muted">67 services</dd>
          <dt>Maryland iMAP</dt>
          <dd className="text-right text-text-muted">120+ layers</dd>
          <dt>Federal APIs</dt>
          <dd className="text-right text-text-muted">Census, FEMA, NPS, BLS</dd>
          <dt>Real-time feeds</dt>
          <dd className="text-right text-text-muted">NWS, USGS, CHART, 311</dd>
        </dl>
      </div>

      <div className="text-center text-xs text-text-muted">
        Sources: Census ACS 2023, BLS, Frederick County Economic Development.
      </div>
    </div>
  );
}
