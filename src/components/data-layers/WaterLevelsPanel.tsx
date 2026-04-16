import { useWaterLevels } from '../../hooks/useWaterLevels';
import { getWaterLevelStatus } from '../../services/api/water';
import { SkeletonGauges } from '../shared/Skeleton';
import { SourceChip } from '../shared/SourceChip';

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

        return (
          <div key={gauge.siteCode} className="rounded-lg border border-border bg-bg-surface p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h4 className="text-sm font-medium text-text truncate">{gauge.siteName}</h4>
                <p className="text-xs text-text-muted">USGS {gauge.siteCode}</p>
              </div>
              {status && (
                <span
                  className="flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{ backgroundColor: `${status.color}20`, color: status.color }}
                >
                  {status.label}
                </span>
              )}
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2">
              {latestHeight && (
                <div className="rounded bg-bg-elevated p-2">
                  <div className="text-xs text-text-muted">Gauge Height</div>
                  <div className="text-lg font-semibold text-text">{latestHeight.value.toFixed(2)} ft</div>
                </div>
              )}
              {latestDischarge && (
                <div className="rounded bg-bg-elevated p-2">
                  <div className="text-xs text-text-muted">Discharge</div>
                  <div className="text-lg font-semibold text-text">{latestDischarge.value.toFixed(0)} cfs</div>
                </div>
              )}
            </div>

            {/* Mini sparkline of recent readings */}
            {heightValues.length > 1 && (
              <div className="mt-2">
                <Sparkline values={heightValues.map((v) => v.value)} color="var(--color-info)" />
              </div>
            )}

            {latestHeight && (
              <div className="mt-1.5 text-xs text-text-muted">
                Last updated: {new Date(latestHeight.dateTime).toLocaleTimeString()}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const h = 30;
  const w = 200;

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: `${h}px` }}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
