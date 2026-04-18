import { useWaterLevels } from '../../hooks/useWaterLevels';
import { getWaterLevelStatus } from '../../services/api/water';
import { SkeletonGauges } from '../shared/Skeleton';
import { SourceChip } from '../shared/SourceChip';
import { GaugeMeter } from './GaugeMeter';
import { formatRelativeTime } from '../../lib/time';

export function WaterLevelsPanel() {
  const { gauges, loading, error, updatedAt } = useWaterLevels();

  if (loading) return <SkeletonGauges />;
  if (error) {
    return (
      <div className="space-y-3">
        <div className="rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger">{error}</div>
        <SourceChip source="USGS Water Services" url="https://waterservices.usgs.gov" status="error" />
      </div>
    );
  }

  if (gauges.length === 0) {
    return (
      <div className="space-y-3">
        <div className="rounded-lg border border-border bg-bg-surface p-4 text-sm text-text-secondary">
          No active gauges found.
        </div>
        <SourceChip source="USGS Water Services" url="https://waterservices.usgs.gov" updatedAt={updatedAt} />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <SourceChip
        source="USGS Water Services"
        url="https://waterservices.usgs.gov"
        updatedAt={updatedAt}
        refreshCadence="every 15 min"
      />

      {gauges.map((gauge) => {
        const heightValues = gauge.values.filter((v) => v.parameterCode === '00065');
        const dischargeValues = gauge.values.filter((v) => v.parameterCode === '00060');
        const latestHeight = heightValues[heightValues.length - 1];
        const latestDischarge = dischargeValues[dischargeValues.length - 1];
        const status = latestHeight ? getWaterLevelStatus(latestHeight.value) : null;

        // Gauge domain: observed 24h min/max with a small headroom pad so
        // the needle rarely pins to either end. If we have only one reading
        // we widen the band so the meter still looks well-formed.
        const obsMin = heightValues.length ? Math.min(...heightValues.map((v) => v.value)) : 0;
        const obsMax = heightValues.length ? Math.max(...heightValues.map((v) => v.value)) : 1;
        const span = Math.max(obsMax - obsMin, 0.5);
        const domainMin = Math.max(0, obsMin - span * 0.15);
        const domainMax = obsMax + span * 0.15;

        return (
          <div key={gauge.siteCode} className="rounded-xl border border-border bg-bg-elevated p-4 shadow-[var(--shadow-surface-1)]">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h4 className="truncate font-display text-sm font-semibold text-text">
                  {gauge.siteName}
                </h4>
                <p className="text-[11px] text-text-muted">USGS #{gauge.siteCode}</p>
              </div>
            </div>

            {latestHeight && (
              <div className="mt-3">
                <GaugeMeter
                  value={latestHeight.value}
                  min={domainMin}
                  max={domainMax}
                  unit="ft"
                  statusLabel={status?.label}
                  statusColor={status?.color}
                />
              </div>
            )}

            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3">
              <Stat
                label="24h range"
                value={heightValues.length > 1 ? `${obsMin.toFixed(2)}–${obsMax.toFixed(2)} ft` : '—'}
              />
              <Stat
                label="Discharge"
                value={latestDischarge ? `${Math.round(latestDischarge.value).toLocaleString()} cfs` : '—'}
              />
            </div>

            {heightValues.length > 1 && (
              <div className="mt-3">
                <div className="mb-1 text-[10px] uppercase tracking-wider text-text-muted">
                  Last 24 hours
                </div>
                <Sparkline values={heightValues.map((v) => v.value)} />
              </div>
            )}

            {latestHeight && (
              <div className="mt-2 text-[11px] text-text-muted">
                Reading {formatRelativeTime(latestHeight.dateTime)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-text-muted">{label}</div>
      <div className="mt-0.5 font-display text-sm font-semibold tabular-nums text-text">{value}</div>
    </div>
  );
}

function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const h = 36;
  const w = 240;

  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 6) - 3;
      return `${x},${y}`;
    })
    .join(' ');

  const areaPoints = `0,${h} ${points} ${w},${h}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-9 w-full">
      <polygon points={areaPoints} fill="var(--color-info)" opacity="0.12" />
      <polyline
        points={points}
        fill="none"
        stroke="var(--color-info)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
