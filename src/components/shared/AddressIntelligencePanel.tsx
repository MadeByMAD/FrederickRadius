import { useState, useEffect } from 'react';
import { computeAddressIntelligence, enrichWithGIS, type AddressIntelligence } from '../../services/address-intelligence';
import { LoadingSpinner } from './LoadingSpinner';

interface Props {
  lat: number;
  lng: number;
  address: string;
}

export function AddressIntelligencePanel({ lat, lng, address }: Props) {
  const [intel, setIntel] = useState<AddressIntelligence | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const basic = computeAddressIntelligence(lat, lng, address);
      if (!cancelled) setIntel(basic);

      try {
        const enriched = await enrichWithGIS(basic);
        if (!cancelled) setIntel(enriched);
      } catch {
        // Keep basic intel
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [lat, lng, address]);

  if (!intel) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-xl bg-gradient-to-br from-accent/20 via-bg-surface to-success/10 border border-accent/20 p-4">
        <div className="text-lg font-bold text-text">{intel.address.split(',')[0]}</div>
        <div className="mt-1 text-xs text-text-secondary">{intel.address}</div>
        <div className="mt-2 flex items-center gap-3">
          <Chip color="#3B82F6">{intel.municipality || 'Unincorporated'}</Chip>
          <Chip color="#10B981">{intel.distanceToCity} mi to Frederick</Chip>
        </div>
      </div>

      {/* Location Grid */}
      <div className="grid grid-cols-2 gap-2">
        <IntelCard icon="🗺️" label="Zoning" value={intel.zoning} loading={loading} />
        <IntelCard icon="🌊" label="Flood Zone" value={intel.floodZone} fallback="Not in floodplain" loading={loading} />
        <IntelCard icon="🏫" label="High School District" value={intel.schoolDistrict} loading={loading} />
        <IntelCard icon="🗳️" label="Council District" value={intel.councilDistrict} loading={loading} />
        <IntelCard icon="🚒" label="Fire Station" value={intel.fireStation} loading={loading} />
        <IntelCard icon="👮" label="Police" value={intel.policeJurisdiction} loading={loading} />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2">
        <StatCard label="Parks Nearby" value={intel.nearbyParks} unit="within 2 mi" icon="🌳" />
        <StatCard label="Schools" value={intel.nearbySchools} unit="within 2 mi" icon="🏫" />
        <StatCard label="Transit" value={intel.nearbyTransit} unit="stops" icon="🚏" />
      </div>

      {/* Insights */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Insights</h4>
        <InsightRow icon="🚶" text={intel.walkabilityNote} />
        <InsightRow icon="⛰️" text={intel.elevationNote} />
        {intel.waterSewer && <InsightRow icon="🚰" text={`Water/Sewer: ${intel.waterSewer}`} />}
        {intel.floodZone && intel.floodZone !== 'X' && (
          <InsightRow icon="⚠️" text={`In FEMA ${intel.floodZone} flood zone — flood insurance may be required`} color="warning" />
        )}
      </div>

      {/* Coordinates */}
      <div className="rounded-lg bg-bg-elevated px-3 py-2 text-center">
        <span className="text-[10px] font-mono text-text-muted">
          {lat.toFixed(6)}°N, {Math.abs(lng).toFixed(6)}°W
        </span>
      </div>
    </div>
  );
}

function Chip({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span
      className="rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {children}
    </span>
  );
}

function IntelCard({ icon, label, value, fallback, loading }: {
  icon: string; label: string; value: string | null; fallback?: string; loading: boolean;
}) {
  return (
    <div className="rounded-lg bg-bg-surface border border-border p-2.5">
      <div className="flex items-center gap-1.5 text-xs text-text-muted">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <div className="mt-1 text-sm font-medium text-text">
        {loading && !value ? (
          <div className="h-4 w-20 animate-pulse rounded bg-bg-hover" />
        ) : (
          value || fallback || '—'
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, unit, icon }: { label: string; value: number; unit: string; icon: string }) {
  return (
    <div className="rounded-lg bg-bg-elevated p-2.5 text-center">
      <div className="text-sm">{icon}</div>
      <div className="text-lg font-bold text-text">{value}</div>
      <div className="text-[10px] text-text-muted">{label}</div>
      <div className="text-[9px] text-text-muted">{unit}</div>
    </div>
  );
}

function InsightRow({ icon, text, color }: { icon: string; text: string; color?: string }) {
  return (
    <div className={`flex items-start gap-2 rounded-lg px-3 py-2 ${
      color === 'warning' ? 'bg-warning/10 border border-warning/20' : 'bg-bg-surface'
    }`}>
      <span className="text-sm flex-shrink-0">{icon}</span>
      <span className={`text-xs ${color === 'warning' ? 'text-warning' : 'text-text-secondary'}`}>{text}</span>
    </div>
  );
}
