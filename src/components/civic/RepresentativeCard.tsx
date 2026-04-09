import type { Representative } from '../../types';
import {
  countyRepresentatives,
  stateRepresentatives,
  federalRepresentatives,
  CIVIC_DIRECTORY_NOTE,
} from '../../data/civic';
import { DataTrustBadge } from '../shared/DataTrustBadge';

export function RepresentativesPanel() {
  const groups = [
    { label: 'County Government', reps: countyRepresentatives },
    { label: 'Frederick County State Delegation', reps: stateRepresentatives },
    { label: 'Federal', reps: federalRepresentatives },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-bg-surface p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
            Directory Scope
          </div>
          <DataTrustBadge confidence="reference" />
        </div>
        <div className="mt-2 text-xs leading-5 text-text-secondary">{CIVIC_DIRECTORY_NOTE}</div>
      </div>

      {groups.map((group) => (
        <div key={group.label}>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
            {group.label}
          </h4>
          <div className="space-y-1">
            {group.reps.map((rep) => (
              <RepCard key={`${group.label}-${rep.name}-${rep.district ?? 'none'}`} rep={rep} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function RepCard({ rep }: { rep: Representative }) {
  return (
    <div className="rounded-lg border border-border bg-bg-surface p-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-sm font-medium text-text truncate">{rep.name}</div>
          <div className="text-xs text-text-muted">
            {rep.title}
            {rep.district && ` · ${rep.district}`}
            {rep.party && ` (${rep.party})`}
          </div>
          {rep.verifiedDate && (
            <div className="mt-1 text-[10px] text-text-muted">Verified {rep.verifiedDate}</div>
          )}
        </div>

        {rep.sourceUrl && (
          <a
            href={rep.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 rounded border border-border bg-bg-elevated px-2 py-1 text-[10px] font-medium text-accent hover:bg-bg-hover"
          >
            Source
          </a>
        )}
      </div>
    </div>
  );
}
