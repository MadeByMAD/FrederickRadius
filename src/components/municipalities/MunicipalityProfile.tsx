import { municipalities } from '../../data/municipalities';

export function MunicipalityProfile({ slug }: { slug?: string | null }) {
  const muni = municipalities.find((m) => m.id === slug);
  if (!muni) return null;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-text">{muni.name}</h2>
        <p className="mt-1 text-sm text-text-secondary">{muni.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <StatBox label="Population" value={muni.population.toLocaleString()} />
        <StatBox label="Area" value={`${muni.area} mi²`} />
        <StatBox label="Median Income" value={`$${muni.medianIncome.toLocaleString()}`} />
        <StatBox label="Median Age" value={muni.medianAge.toString()} />
      </div>

      {muni.officials && muni.officials.length > 0 && (
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">Officials</h3>
          <div className="space-y-1.5">
            {muni.officials.map((o, i) => (
              <div key={i} className="flex items-center justify-between rounded bg-bg-elevated px-3 py-2">
                <span className="text-sm text-text">{o.name}</span>
                <span className="text-xs text-text-muted">{o.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {muni.website && (
        <a
          href={muni.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg border border-border bg-bg-surface px-3 py-2 text-sm text-accent hover:bg-bg-hover transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Official Website
        </a>
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
