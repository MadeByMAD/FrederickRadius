import { useEffect, useMemo, useState } from 'react';
import { computeAddressIntelligence, enrichWithGIS, type AddressIntelligence } from '../../services/address-intelligence';
import { getSourceMetadata } from '../../data/source-registry';
import { LoadingSpinner } from './LoadingSpinner';
import { DataTrustBadge } from './DataTrustBadge';
import type { DataFact } from '../../types';

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
        // Keep basic context and let the panel explain what is unavailable.
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [lat, lng, address]);

  const sourceLinks = useMemo(() => {
    if (!intel) return [];
    return [
      intel.municipalityEstimate.sourceId,
      intel.zoning.sourceId,
      intel.floodZone.sourceId,
    ]
      .filter(Boolean)
      .map((sourceId) => getSourceMetadata(sourceId!))
      .filter((source): source is NonNullable<typeof source> => Boolean(source));
  }, [intel]);

  if (!intel) return <LoadingSpinner />;

  const officialFacts: Array<{ label: string; icon: string; fact: DataFact<string> }> = [
    { label: 'Zoning', icon: '🗺️', fact: intel.zoning },
    { label: 'Floodplain', icon: '🌊', fact: intel.floodZone },
    { label: 'High School District', icon: '🏫', fact: intel.schoolDistrict },
    { label: 'Council District', icon: '🗳️', fact: intel.councilDistrict },
    { label: 'Fire Station', icon: '🚒', fact: intel.fireStation },
    { label: 'Police Jurisdiction', icon: '👮', fact: intel.policeJurisdiction },
    { label: 'Water / Sewer Area', icon: '🚰', fact: intel.waterSewer },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-accent/20 bg-gradient-to-br from-accent/12 via-bg-surface to-bg-elevated p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-bold text-text">{intel.address.split(',')[0]}</div>
            <div className="mt-1 text-xs text-text-secondary">{intel.address}</div>
          </div>
          <DataTrustBadge confidence="reference" />
        </div>
        <div className="mt-3 text-xs leading-5 text-text-secondary">
          Official overlays come from live Frederick County GIS queries when available. Municipality context remains approximate until official boundary geometry is integrated.
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <SummaryCard
          label="Municipality Estimate"
          value={intel.municipalityEstimate.value ?? 'Unresolved'}
          icon="📍"
          confidence={intel.municipalityEstimate.confidence}
          note={intel.municipalityEstimate.note}
        />
        <SummaryCard
          label="Nearest Municipality"
          value={`${intel.nearestMunicipality.name} (${intel.nearestMunicipality.distanceMiles} mi)`}
          icon="🧭"
          confidence={intel.nearestMunicipality.confidence}
          note={intel.nearestMunicipality.note}
        />
        <SummaryCard
          label="Distance to Frederick"
          value={`${intel.distanceToFrederickMiles} mi`}
          icon="📏"
          confidence="approximate"
          note="Straightforward distance from the selected point to the City of Frederick reference center."
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Official Overlay Lookups
          </h4>
          <span className="text-[10px] text-text-muted">
            {loading ? 'Refreshing live context…' : 'Live county GIS lookup'}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {officialFacts.map((item) => (
            <FactCard key={item.label} icon={item.icon} label={item.label} fact={item.fact} loading={loading} />
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-bg-surface p-3">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">Context Rules</div>
        <div className="mt-2 space-y-1.5 text-xs text-text-secondary">
          {intel.notes.map((note) => (
            <div key={note} className="flex items-start gap-2">
              <span className="mt-0.5 text-accent">•</span>
              <span>{note}</span>
            </div>
          ))}
        </div>
      </div>

      {sourceLinks.length > 0 && (
        <div className="rounded-lg bg-bg-elevated px-3 py-2">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">Sources</div>
          <div className="mt-2 space-y-1.5">
            {sourceLinks.map((source) => (
              <div key={source.id} className="text-xs text-text-secondary">
                <a
                  href={source.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-accent hover:text-accent-hover"
                >
                  {source.name}
                </a>
                <span className="text-text-muted"> · {source.coverageArea}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-lg bg-bg-elevated px-3 py-2 text-center">
        <span className="text-[10px] font-mono text-text-muted">
          {lat.toFixed(6)}°N, {Math.abs(lng).toFixed(6)}°W · queried {new Date(intel.dataRetrievedAt).toLocaleString()}
        </span>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  confidence,
  note,
}: {
  label: string;
  value: string;
  icon: string;
  confidence: DataFact<string>['confidence'];
  note?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-bg-surface p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          <span>{icon}</span>
          <span>{label}</span>
        </div>
        <DataTrustBadge confidence={confidence} />
      </div>
      <div className="mt-2 text-sm font-medium text-text">{value}</div>
      {note && <div className="mt-1 text-[10px] leading-4 text-text-muted">{note}</div>}
    </div>
  );
}

function FactCard({
  icon,
  label,
  fact,
  loading,
}: {
  icon: string;
  label: string;
  fact: DataFact<string>;
  loading: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-bg-surface p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          <span>{icon}</span>
          <span>{label}</span>
        </div>
        <DataTrustBadge confidence={fact.confidence} />
      </div>
      <div className="mt-2 text-sm font-medium text-text">
        {loading && fact.confidence === 'unavailable' ? (
          <div className="h-4 w-24 animate-pulse rounded bg-bg-hover" />
        ) : (
          fact.value ?? 'No value returned'
        )}
      </div>
      {fact.note && <div className="mt-1 text-[10px] leading-4 text-text-muted">{fact.note}</div>}
    </div>
  );
}
