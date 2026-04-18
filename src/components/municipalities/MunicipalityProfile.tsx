import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { municipalities } from '../../data/municipalities';
import {
  classifyMunicipality,
  personInitials,
  stripTitlePrefix,
} from '../../lib/municipalityStyle';
import { fadeUp, staggerContainer, staggerItem } from '../../lib/motion';

export function MunicipalityProfile({ slug }: { slug?: string | null }) {
  const muni = municipalities.find((m) => m.id === slug);
  if (!muni) return null;

  const style = classifyMunicipality(muni);

  return (
    <motion.div variants={fadeUp} initial="initial" animate="animate" className="space-y-5">
      {/* Hero */}
      <div
        className="relative -mx-4 -mt-4 h-40 overflow-hidden"
        style={{ background: style.gradient }}
      >
        <HeroRings />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent p-4">
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/90">
            {style.classification} · Frederick County, MD
          </div>
          <h2 className="mt-1 font-display text-3xl font-semibold leading-none tracking-tight text-white drop-shadow-sm">
            {stripTitlePrefix(muni.name)}
          </h2>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-text-secondary">{muni.description}</p>

      {/* Stats grid */}
      <motion.dl
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 gap-2"
      >
        <Stat label="Population" value={muni.population.toLocaleString()} detail="residents" />
        <Stat label="Area" value={`${muni.area}`} detail="square miles" />
        <Stat
          label="Median Income"
          value={`$${Math.round(muni.medianIncome / 1000)}k`}
          detail="household"
        />
        <Stat label="Median Age" value={muni.medianAge.toFixed(1)} detail="years" />
      </motion.dl>

      {/* Officials */}
      {muni.officials && muni.officials.length > 0 && (
        <section>
          <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
            Officials
          </h3>
          <ul className="space-y-1.5">
            {muni.officials.map((o, i) => (
              <li
                key={i}
                className="flex items-center gap-3 rounded-lg border border-border bg-bg-elevated p-2.5 shadow-[var(--shadow-surface-1)]"
              >
                <span
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full font-display text-sm font-semibold text-white"
                  style={{ background: style.accent }}
                  aria-hidden
                >
                  {personInitials(o.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-text">{o.name}</div>
                  <div className="truncate text-[11px] text-text-muted">{o.title}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Website */}
      {muni.website && (
        <a
          href={muni.website}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-bg-elevated px-4 py-2.5 text-sm font-medium text-text shadow-[var(--shadow-surface-1)] hover:bg-bg-hover transition-colors"
        >
          Visit the official site
          <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
        </a>
      )}
    </motion.div>
  );
}

function Stat({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <motion.div
      variants={staggerItem}
      className="rounded-xl border border-border bg-bg-elevated p-3 shadow-[var(--shadow-surface-1)]"
    >
      <dt className="text-[10px] uppercase tracking-wider text-text-muted">{label}</dt>
      <dd className="mt-1 font-display text-xl font-semibold tabular-nums leading-none text-text">
        {value}
      </dd>
      {detail && <div className="mt-1 text-[11px] text-text-muted">{detail}</div>}
    </motion.div>
  );
}

function HeroRings() {
  return (
    <svg
      className="absolute -right-10 -top-10 h-56 w-56 text-white/15"
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden
    >
      <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="50" cy="50" r="36" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 3" />
      <circle cx="50" cy="50" r="24" stroke="currentColor" strokeWidth="0.6" />
      <circle cx="50" cy="50" r="12" stroke="currentColor" strokeWidth="0.6" strokeDasharray="1 2" />
    </svg>
  );
}
