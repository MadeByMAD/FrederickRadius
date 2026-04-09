import { municipalities } from '../../data/municipalities';
import { mapLayers } from '../../data/layers';
import { sourceRegistry } from '../../data/source-registry';
import { DataTrustBadge } from '../shared/DataTrustBadge';
import { CivicWorkflowDeck } from '../shared/CivicWorkflowDeck';

const sources = Object.values(sourceRegistry);

const summaryCards = [
  { label: 'Source Registry', value: String(sources.length), detail: 'Documented sources in code', confidence: 'reference' as const },
  { label: 'Official Sources', value: String(sources.filter((source) => source.official).length), detail: 'Government-published feeds or catalogs', confidence: 'official' as const },
  { label: 'Operational Feeds', value: String(sources.filter((source) => source.classification === 'operational').length), detail: 'Weather, water, traffic', confidence: 'official' as const },
  { label: 'Map Layers', value: String(mapLayers.length), detail: 'Layer definitions with trust metadata', confidence: 'reference' as const },
  { label: 'Municipal Profiles', value: String(municipalities.length), detail: 'Manual reference snapshots', confidence: 'reference' as const },
  { label: 'Manual Inputs', value: String(sources.filter((source) => source.authority === 'manual').length), detail: 'Still need an ingestion workflow', confidence: 'approximate' as const },
];

const releaseBlockers = [
  'Official municipal boundary geometry is not integrated, so jurisdiction lookup remains approximate.',
  'Civic meetings and representative directories are still maintained as manual snapshots.',
  'ArcGIS layer freshness, service health, and fetched timestamps are not surfaced per layer yet.',
  'There is no backend normalization, validation, or cache layer for brittle third-party feeds.',
  'Crime and 911 data architecture is not implemented and must not be implied by the current UI.',
];

export function CountyDashboard() {
  const totalPopulation = municipalities.reduce((sum, municipality) => sum + municipality.population, 0);

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-bg-surface p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-lg font-semibold text-text">Trust & Coverage Overview</div>
            <div className="mt-1 text-sm text-text-secondary">
              This dashboard focuses on source posture and product readiness, not unsupported county brag metrics.
            </div>
          </div>
          <DataTrustBadge confidence="reference" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-border bg-bg-elevated p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-[10px] uppercase tracking-wider text-text-muted">{card.label}</div>
              <DataTrustBadge confidence={card.confidence} />
            </div>
            <div className="mt-2 text-2xl font-bold text-text">{card.value}</div>
            <div className="mt-1 text-[11px] leading-4 text-text-muted">{card.detail}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-bg-surface p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-text">Recommended Civic Views</div>
            <div className="mt-1 text-xs leading-5 text-text-secondary">
              These are the product-level starting points Frederick Radius should optimize for. They reduce layer overload and make trust boundaries part of the experience.
            </div>
          </div>
          <DataTrustBadge confidence="reference" />
        </div>
        <div className="mt-4">
          <CivicWorkflowDeck />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {sources.map((source) => (
          <div key={source.id} className="rounded-lg border border-border bg-bg-surface p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-text">{source.name}</div>
                <div className="text-xs text-text-muted">{source.owner}</div>
              </div>
              <DataTrustBadge confidence={source.official ? 'official' : source.authority === 'derived' ? 'approximate' : 'reference'} />
            </div>
            <div className="mt-2 text-xs leading-5 text-text-secondary">{source.notes}</div>
            {source.riskNotes && (
              <div className="mt-2 rounded-md bg-bg-elevated px-2 py-1.5 text-[11px] leading-4 text-text-muted">
                Risk: {source.riskNotes}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-bg-surface p-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Public Safety Posture</div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <BoundaryCard
            title="Available now"
            detail="Stations, shelters, ESZ boundaries, roadway flood points, weather alerts, and traffic disruptions can support public-safety context."
          />
          <BoundaryCard
            title="Not available now"
            detail="Frederick Radius still does not have a verified countywide calls-for-service, crime incident, or live 911 product surface."
          />
          <BoundaryCard
            title="Safe use"
            detail="Use current public-safety layers as reference geography and emergency context, not as proof of live incidents or operational response."
          />
          <BoundaryCard
            title="Next threshold"
            detail="No operational crime or 911 surface should ship until verified sources, privacy rules, and a backend normalization layer exist."
          />
        </div>
      </div>

      <div className="rounded-xl border border-amber-300/20 bg-amber-300/8 p-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-amber-100">Current Release Blockers</div>
        <div className="mt-3 space-y-2">
          {releaseBlockers.map((blocker) => (
            <div key={blocker} className="flex items-start gap-2 text-xs leading-5 text-amber-50/90">
              <span className="mt-0.5">•</span>
              <span>{blocker}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Municipality Reference Snapshot
          </h4>
          <span className="text-[10px] text-text-muted">Manual demographic data, verified in repo on 2026-04-08</span>
        </div>
        <div className="space-y-1.5">
          {municipalities
            .slice()
            .sort((left, right) => right.population - left.population)
            .slice(0, 6)
            .map((municipality) => {
              const share = (municipality.population / totalPopulation) * 100;
              return (
                <div key={municipality.id} className="flex items-center gap-3">
                  <div className="w-24 text-xs text-text truncate">
                    {municipality.name.replace(/^(City of |Town of |Village of )/, '')}
                  </div>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-bg-hover">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${share}%` }} />
                  </div>
                  <div className="w-16 text-right text-xs text-text-muted tabular-nums">
                    {municipality.population.toLocaleString()}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

function BoundaryCard({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-lg bg-bg-elevated p-3">
      <div className="text-xs font-semibold text-text">{title}</div>
      <div className="mt-1 text-xs leading-5 text-text-secondary">{detail}</div>
    </div>
  );
}
