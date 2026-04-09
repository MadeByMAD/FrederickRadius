import { describe, expect, it } from 'vitest';
import { reducer, initialState } from './app-state-reducer';

describe('app-state reducer', () => {
  it('applies a civic workflow as the active map view', () => {
    const next = reducer(initialState, {
      type: 'APPLY_WORKFLOW',
      workflowId: 'storm-flood',
      layerIds: ['flood-points', 'fema-floodplain'],
      summary: 'Use gauges for current conditions and flood geography for context.',
    });

    expect(next.activeLayers).toEqual(['flood-points', 'fema-floodplain']);
    expect(next.layerOrder).toEqual(['flood-points', 'fema-floodplain']);
    expect(next.activeWorkflowId).toBe('storm-flood');
    expect(next.workflowSummary).toContain('flood geography');
  });

  it('clears the active workflow when a user manually toggles a layer', () => {
    const withWorkflow = reducer(initialState, {
      type: 'APPLY_WORKFLOW',
      workflowId: 'planning-growth',
      layerIds: ['zoning'],
      summary: 'Planning context',
    });

    const next = reducer(withWorkflow, {
      type: 'TOGGLE_LAYER',
      layerId: 'land-use',
    });

    expect(next.activeLayers).toEqual(['zoning', 'land-use']);
    expect(next.activeWorkflowId).toBeNull();
    expect(next.workflowSummary).toBeNull();
  });

  it('resets workflow and layer state on clear', () => {
    const withWorkflow = reducer(initialState, {
      type: 'APPLY_WORKFLOW',
      workflowId: 'civic-services',
      layerIds: ['libraries', 'gov-facilities'],
      summary: 'Civic services context',
    });

    const next = reducer(withWorkflow, { type: 'CLEAR_LAYERS' });

    expect(next.activeLayers).toEqual([]);
    expect(next.layerOrder).toEqual([]);
    expect(next.activeWorkflowId).toBeNull();
    expect(next.workflowSummary).toBeNull();
  });
});
