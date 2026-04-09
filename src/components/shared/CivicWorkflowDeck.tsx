import { civicWorkflows, type CivicWorkflow, type WorkflowReadiness } from '../../data/workflows';
import { useAppState } from '../../hooks/useAppState';

interface Props {
  compact?: boolean;
}

const readinessStyles: Record<WorkflowReadiness, string> = {
  'ready-now': 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100',
  'reference-first': 'border-sky-400/30 bg-sky-400/10 text-sky-100',
  'research-only': 'border-amber-300/30 bg-amber-300/10 text-amber-100',
};

const readinessLabels: Record<WorkflowReadiness, string> = {
  'ready-now': 'Ready now',
  'reference-first': 'Reference first',
  'research-only': 'Research only',
};

export function CivicWorkflowDeck({ compact = false }: Props) {
  const { state, dispatch } = useAppState();

  function applyWorkflow(workflow: CivicWorkflow) {
    dispatch({
      type: 'APPLY_WORKFLOW',
      workflowId: workflow.id,
      layerIds: workflow.layerIds,
      summary: workflow.trustNote,
    });
  }

  return (
    <div className={compact ? 'grid gap-2' : 'grid gap-3 md:grid-cols-2 xl:grid-cols-1'}>
      {civicWorkflows.map((workflow) => {
        const isActive = state.activeWorkflowId === workflow.id;

        return (
          <div
            key={workflow.id}
            className={`rounded-xl border p-3 ${isActive ? 'border-accent/40 bg-accent/5' : 'border-border bg-bg-surface'}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-base">{workflow.icon}</span>
                  <div className="text-sm font-semibold text-text">{workflow.title}</div>
                </div>
                <div className="mt-1 text-xs leading-5 text-text-secondary">
                  {workflow.description}
                </div>
              </div>
              <WorkflowReadinessBadge readiness={workflow.readiness} />
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-text-muted">
              <span>{workflow.layerIds.length} layers</span>
              <span>•</span>
              <span>{workflow.sourceSummary}</span>
              {workflow.recommendedPanel ? (
                <>
                  <span>•</span>
                  <span>Pair with {formatPanelName(workflow.recommendedPanel)}</span>
                </>
              ) : null}
            </div>

            <div className="mt-3 rounded-lg bg-bg-elevated px-3 py-2 text-[11px] leading-5 text-text-secondary">
              {workflow.trustNote}
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="text-[10px] text-text-muted">
                {isActive ? 'Applied to the current map' : 'Use as a starting point'}
              </div>
              <button
                onClick={() => applyWorkflow(workflow)}
                className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors ${
                  isActive
                    ? 'bg-accent text-slate-950'
                    : 'border border-border bg-bg-elevated text-text hover:bg-bg-hover'
                }`}
              >
                {isActive ? 'Applied' : 'Apply view'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function WorkflowReadinessBadge({ readiness }: { readiness: WorkflowReadiness }) {
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] ${readinessStyles[readiness]}`}>
      {readinessLabels[readiness]}
    </span>
  );
}

function formatPanelName(panel: NonNullable<CivicWorkflow['recommendedPanel']>) {
  switch (panel) {
    case 'water':
      return 'Water panel';
    case 'traffic':
      return 'Traffic panel';
    case 'civic':
      return 'Civic panel';
    case 'dashboard':
      return 'County dashboard';
    default:
      return `${panel} panel`;
  }
}
