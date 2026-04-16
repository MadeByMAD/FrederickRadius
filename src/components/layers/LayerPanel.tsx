import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Layers as LayersIcon, X } from 'lucide-react';
import { useAppState } from '../../hooks/useAppState';
import { layerCategories, mapLayers } from '../../data/layers';
import { LayerItem } from './LayerItem';
import { CorrelationIndicator } from './CorrelationIndicator';
import { slideInRight } from '../../lib/motion';

export function LayerPanel() {
  const { state, dispatch } = useAppState();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const activeLayers = state.layerOrder
    .map((id) => mapLayers.find((l) => l.id === id))
    .filter(Boolean) as typeof mapLayers;

  const activeCount = state.activeLayers.length;
  const totalCount = mapLayers.length;

  function toggleCategory(catId: string) {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  }

  const grouped = layerCategories.map((cat) => ({
    ...cat,
    layers: mapLayers.filter((l) => l.category === cat.id && !state.activeLayers.includes(l.id)),
  }));

  return (
    <motion.div
      variants={slideInRight}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex h-full w-72 flex-shrink-0 flex-col border-l border-border bg-bg"
    >
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-text">
            <LayersIcon className="h-4 w-4 text-accent" strokeWidth={1.75} />
            <h2 className="text-sm font-semibold">Data Layers</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-accent-subtle text-accent text-[10px] font-medium px-2 py-0.5 tabular-nums">
              {activeCount}/{totalCount}
            </span>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_LAYER_PANEL' })}
              className="rounded p-1 text-text-muted hover:text-text hover:bg-bg-hover transition-colors"
              aria-label="Close layer panel"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Clear all button */}
        {activeCount > 0 && (
          <button
            onClick={() => dispatch({ type: 'CLEAR_LAYERS' })}
            className="w-full text-xs text-text-muted hover:text-danger transition-colors py-1"
          >
            Clear all layers ({activeCount})
          </button>
        )}

        {/* Active Layers */}
        {activeLayers.length > 0 && (
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary mb-2">
              Active
            </h3>
            <div className="space-y-1.5">
              <AnimatePresence>
                {activeLayers.map((layer) => (
                  <LayerItem
                    key={layer.id}
                    layer={layer}
                    opacity={state.layerOpacity[layer.id] ?? 100}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Correlation */}
        <CorrelationIndicator />

        {/* Available Layers by Category */}
        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary mb-2">
            Available
          </h3>
          {grouped.map((group) => {
            if (group.layers.length === 0) return null;
            const isExpanded = expandedCategories.has(group.id);

            return (
              <div key={group.id} className="mb-1">
                <button
                  onClick={() => toggleCategory(group.id)}
                  className="flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-xs text-text-muted hover:text-text hover:bg-bg-hover transition-colors"
                >
                  <motion.span
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    className="flex h-3 w-3 flex-shrink-0 items-center justify-center"
                  >
                    <ChevronRight className="h-3 w-3" strokeWidth={2} />
                  </motion.span>
                  <span>{group.icon}</span>
                  <span className="flex-1 text-left">{group.name}</span>
                  <span className="text-[10px] text-text-muted tabular-nums">{group.layers.length}</span>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden ml-2"
                    >
                      {group.layers.map((layer) => (
                        <button
                          key={layer.id}
                          onClick={() => dispatch({ type: 'TOGGLE_LAYER', layerId: layer.id })}
                          className="flex w-full items-center gap-2 rounded px-2 py-1 text-left text-xs text-text-secondary hover:bg-bg-hover hover:text-text transition-colors"
                        >
                          <span
                            className="h-2 w-2 rounded-full flex-shrink-0 border"
                            style={{ borderColor: layer.color }}
                          />
                          <span className="truncate">{layer.icon} {layer.name}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
