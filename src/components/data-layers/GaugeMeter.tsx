import { motion } from 'framer-motion';

interface Props {
  /** Current reading. */
  value: number;
  /** Minimum observed reading, for the left end of the arc. */
  min: number;
  /** Maximum observed reading, for the right end of the arc. */
  max: number;
  /** Unit label shown beneath the value ("ft", "cfs", etc.). */
  unit: string;
  /** Short qualitative label for the current position ("Normal", "Elevated"). */
  statusLabel?: string;
  /** Status color keyed from the reading classifier. */
  statusColor?: string;
}

/**
 * Semicircle gauge meter — 180° arc from min → max with a colored gradient
 * (cool → warm), a needle at the current value, and a big center readout.
 * A small status chip underneath gives the qualitative call, since raw
 * stream heights are meaningless to a non-specialist reader.
 */
export function GaugeMeter({
  value,
  min,
  max,
  unit,
  statusLabel,
  statusColor,
}: Props) {
  const safeRange = Math.max(max - min, 0.001);
  const pct = Math.max(0, Math.min(1, (value - min) / safeRange));
  // 180° arc: -90° (left) → 90° (right). Needle angle in degrees.
  const needleDeg = -90 + pct * 180;
  const gradientId = `gauge-grad-${Math.round(min * 100)}-${Math.round(max * 100)}`;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 120" className="h-24 w-full max-w-[240px]" aria-hidden>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-success)" stopOpacity="0.65" />
            <stop offset="55%" stopColor="var(--color-info)" stopOpacity="0.75" />
            <stop offset="100%" stopColor="var(--color-danger)" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* Background arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          stroke="var(--color-border)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
        {/* Gradient arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          stroke={`url(#${gradientId})`}
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />

        {/* Min / max ticks */}
        <text x="20" y="115" textAnchor="middle" className="fill-text-muted" fontSize="9">
          {min.toFixed(1)}
        </text>
        <text x="180" y="115" textAnchor="middle" className="fill-text-muted" fontSize="9">
          {max.toFixed(1)}
        </text>

        {/* Needle */}
        <motion.g
          initial={{ rotate: -90 }}
          animate={{ rotate: needleDeg }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          style={{ transformOrigin: '100px 100px', transformBox: 'fill-box' }}
        >
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="32"
            stroke="var(--color-text)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="100" cy="100" r="5" fill="var(--color-text)" />
          <circle cx="100" cy="100" r="2.5" fill="var(--color-bg-elevated)" />
        </motion.g>
      </svg>

      <div className="-mt-6 flex flex-col items-center">
        <div className="font-display text-2xl font-semibold leading-none tabular-nums text-text">
          {value.toFixed(2)}
          <span className="ml-1 text-sm font-normal text-text-muted">{unit}</span>
        </div>
        {statusLabel && (
          <span
            className="mt-1.5 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
            style={{
              background: statusColor ? `${statusColor}22` : 'var(--color-accent-subtle)',
              color: statusColor ?? 'var(--color-accent)',
            }}
          >
            {statusLabel}
          </span>
        )}
      </div>
    </div>
  );
}
