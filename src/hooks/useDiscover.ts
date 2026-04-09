import { useCallback } from 'react';
import { useAppState } from './useAppState';
import { mapLayers } from '../data/layers';
import { useHaptics } from './useHaptics';

export function useDiscover() {
  const { dispatch } = useAppState();
  const { success } = useHaptics();

  const discover = useCallback(() => {
    // TODO: Replace random layer bundles with curated, source-aware scenario presets before
    // promoting this feature outside experimental mode.
    const count = 3 + Math.floor(Math.random() * 2); // 3 or 4
    const categories = [...new Set(mapLayers.map((l) => l.category))];
    const selected: string[] = [];
    const usedCategories = new Set<string>();

    // Prefer diverse categories
    while (selected.length < count) {
      const pool = mapLayers.filter(
        (l) =>
          !selected.includes(l.id) &&
          (selected.length < categories.length ? !usedCategories.has(l.category) : true)
      );
      if (pool.length === 0) break;
      const pick = pool[Math.floor(Math.random() * pool.length)];
      selected.push(pick.id);
      usedCategories.add(pick.category);
    }

    // Varied opacities (60-90%)
    const opacities: Record<string, number> = {};
    for (const id of selected) {
      opacities[id] = 60 + Math.floor(Math.random() * 31);
    }

    // Summary
    const names = selected.map((id) => mapLayers.find((l) => l.id === id)!.name);
    const summary = names.join(' + ');

    dispatch({ type: 'DISCOVER', layerIds: selected, opacities, summary });
    success();
  }, [dispatch, success]);

  return { discover };
}
