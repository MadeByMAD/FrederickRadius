import { describe, expect, it } from 'vitest';
import { civicWorkflows } from './workflows';
import { mapLayers } from './layers';

describe('civic workflows', () => {
  const layerIds = new Set(mapLayers.map((layer) => layer.id));

  it('only references existing map layers', () => {
    for (const workflow of civicWorkflows) {
      for (const layerId of workflow.layerIds) {
        expect(layerIds.has(layerId)).toBe(true);
      }
    }
  });

  it('keeps public-safety workflow explicitly reference-oriented', () => {
    const workflow = civicWorkflows.find((item) => item.id === 'public-safety-reference');

    expect(workflow).toBeDefined();
    expect(workflow?.readiness).toBe('reference-first');
    expect(workflow?.trustNote.toLowerCase()).toContain('not dispatch activity');
    expect(workflow?.trustNote.toLowerCase()).toContain('911');
  });
});
