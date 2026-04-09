import { municipalities } from '../../data/municipalities';
import { getSourceMetadata } from '../../data/source-registry';
import { useAppState } from '../../hooks/useAppState';
import { DataTrustBadge } from '../shared/DataTrustBadge';

export function MunicipalityProfile() {
  const { state } = useAppState();
  const municipality = municipalities.find((item) => item.id === state.selectedMunicipality);
  if (!municipality) return null;

  const source = municipality.sourceId ? getSourceMetadata(municipality.sourceId) : null;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-bg-surface p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-text">{municipality.name}</h2>
            <p className="mt-1 text-sm text-text-secondary">{municipality.description}</p>
          </div>
          <DataTrustBadge confidence="reference" />
        </div>

        <div className="mt-3 rounded-lg border border-amber-300/20 bg-amber-300/8 px-3 py-2 text-xs leading-5 text-amber-50/90">
          {municipality.dataNote ?? 'Municipality metrics are currently a manual snapshot.'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <StatBox label="Population Snapshot" value={municipality.population.toLocaleString()} />
        <StatBox label="Area" value={`${municipality.area} mi²`} />
        <StatBox label="Median Household Income" value={`$${municipality.medianIncome.toLocaleString()}`} />
        <StatBox label="Median Age" value={municipality.medianAge.toString()} />
      </div>

      {municipality.website && (
        <a
          href={municipality.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg border border-border bg-bg-surface px-3 py-2 text-sm text-accent hover:bg-bg-hover transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Official municipal website
        </a>
      )}

      {source && (
        <div className="rounded-lg bg-bg-elevated px-3 py-2">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">Source</div>
          <div className="mt-2 text-xs text-text-secondary">
            <a
              href={source.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent hover:text-accent-hover"
            >
              {source.name}
            </a>
            <span className="text-text-muted"> · verified {municipality.verifiedDate ?? source.lastVerified ?? 'unknown date'}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-bg-elevated p-2.5">
      <div className="text-xs text-text-muted">{label}</div>
      <div className="mt-0.5 text-base font-semibold text-text">{value}</div>
    </div>
  );
}
