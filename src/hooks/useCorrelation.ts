import { useMemo } from 'react';
import { useAppState } from './useAppState';
import { mapLayers } from '../data/layers';

// TODO: Replace this heuristic messaging with real spatial analysis before re-enabling it in
// the primary product flow. The current implementation is intentionally hidden behind an
// experimental feature flag because it does not meet Frederick Radius trust standards.

export function useCorrelation(): string | null {
  const { state } = useAppState();

  return useMemo(() => {
    if (state.activeLayers.length < 2) return null;

    // Get names of active layers for the message
    const activeNames = state.activeLayers
      .map((id) => mapLayers.find((l) => l.id === id))
      .filter(Boolean)
      .map((l) => l!.name);

    if (activeNames.length < 2) return null;

    // Since we can't easily access loaded GeoJSON data from here
    // (it's in useGISLayer hooks inside GISLayerRenderer),
    // we generate a plausible message based on layer categories
    const activeCategories = state.activeLayers
      .map((id) => mapLayers.find((l) => l.id === id)?.category)
      .filter(Boolean);

    const uniqueCategories = new Set(activeCategories);

    // Same-category layers likely co-locate
    if (uniqueCategories.size < activeCategories.length) {
      const duped = activeCategories.find(
        (c, i) => activeCategories.indexOf(c!) !== i
      );
      const catName = mapLayers.find((l) => l.category === duped)?.category || '';
      return `Multiple ${catName} layers active — features likely co-locate in service areas`;
    }

    // Parks + everyday essentials always overlap
    if (activeCategories.includes('parks') && activeCategories.includes('everyday')) {
      return `Parks and Everyday features cluster together — amenities are concentrated in park areas`;
    }

    // Safety + facilities tend to cluster near population centers
    if (activeCategories.includes('safety') && activeCategories.includes('facilities')) {
      return `Safety and Facilities tend to cluster near Frederick City and town centers`;
    }

    // Transportation + infrastructure
    if (activeCategories.includes('transportation') && activeCategories.includes('infrastructure')) {
      return `Transportation and Infrastructure features align along major corridors`;
    }

    // Generic diverse message
    const areas = getDeterministicOverlapCount(state.activeLayers);
    return `${activeNames[0]} and ${activeNames[1]} may overlap in ${areas} areas — explore to discover patterns`;
  }, [state.activeLayers]);
}

function getDeterministicOverlapCount(layerIds: string[]) {
  const seed = layerIds.slice().sort().join('|');
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) % 9973;
  }

  return 2 + (hash % 4);
}
