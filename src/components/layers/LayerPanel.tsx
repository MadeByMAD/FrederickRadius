import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../../hooks/useAppState';
import { layerCategories, mapLayers } from '../../data/layers';
import { LayerItem } from './LayerItem';
import { DiscoverButton } from './DiscoverButton';
import { CorrelationIndicator } from './CorrelationIndicator';
import { slideInRight } from '../../lib/motion';
import { productFeatures } from '../../config/features';
import { CivicWorkflowDeck } from '../shared/CivicWorkflowDeck';
import { getSourceMetadata } from '../../data/source-registry';
import { DataTrustBadge } from '../shared/DataTrustBadge';

export function LayerPanel() {
  const { state, dispatch } = useAppState();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [catalogQuery, setCatalogQuery] = useState('');

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

  const grouped = useMemo(() => {
    const query = catalogQuery.trim().toLowerCase();

    return layerCategories.map((cat) => ({
      ...cat,
      layers: mapLayers.filter((layer) => {
        if (layer.category !== cat.id || state.activeLayers.includes(layer.id)) return false;
        if (!query) return true;
        const sourceName = getSourceMetadata(layer.sourceId)?.name.toLowerCase() ?? '';
        return [
          layer.name,
          layer.summary,
          layer.notes,
          sourceName,
          cat.name,
        ]
          .filter((value): value is string => Boolean(value))
          .some((value) => value.toLowerCase().includes(query));
      }),
    }));
  }, [catalogQuery, state.activeLayers]);

  const availableCount = grouped.reduce((sum, group) => sum + group.layers.length, 0);

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
          <div className="flex items-center gap-2">
            <span className="text-sm">◆</span>
            <h2 className="text-sm font-semibold text-text">Data Layers</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-accent/10 text-accent text-[10px] font-bold px-2 py-0.5 tabular-nums">
              {activeCount}/{totalCount}
            </span>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_LAYER_PANEL' })}
              className="rounded p-1 text-text-muted hover:text-text hover:bg-bg-hover transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <div className="rounded-lg border border-border bg-bg-surface px-3 py-2">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
            Layer Trust
          </div>
          <p className="mt-1 text-xs text-text-secondary">
            Layers now carry source and confidence metadata. Use public-safety and infrastructure layers as reference geography, not live operations.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-bg-surface p-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
            Start With A Civic View
          </div>
          <p className="mt-1 text-xs leading-5 text-text-secondary">
            Frederick Radius should answer questions, not just expose a catalog. These curated views bundle only the layers needed for one local use case and tell you what they are not.
          </p>
          <div className="mt-3">
            <CivicWorkflowDeck compact />
          </div>
        </div>

        {productFeatures.experimentalExploration && <DiscoverButton />}

        {state.activeWorkflowId && state.workflowSummary && (
          <div className="rounded-lg border border-accent/25 bg-accent/5 px-3 py-2">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-accent">
              Active Civic View
            </div>
            <p className="mt-1 text-xs leading-5 text-text-secondary">{state.workflowSummary}</p>
          </div>
        )}

        {/* Discover Summary */}
        <AnimatePresence>
          {state.discoverSummary && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-lg bg-gradient-to-r from-accent/5 to-success/5 border border-accent/20 px-3 py-2"
            >
              <div className="text-[10px] font-semibold uppercase tracking-wider text-accent mb-0.5">
                Active Discovery
              </div>
              <p className="text-xs text-text-secondary">{state.discoverSummary}</p>
            </motion.div>
          )}
        </AnimatePresence>

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

        {productFeatures.experimentalExploration && <CorrelationIndicator />}

        {/* Available Layers by Category */}
        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary mb-2">
            Raw Layer Catalog
          </h3>
          <div className="mb-2 rounded-lg border border-border bg-bg-surface px-3 py-2">
            <input
              type="text"
              value={catalogQuery}
              onChange={(e) => setCatalogQuery(e.target.value)}
              placeholder="Filter layers by name, purpose, or source..."
              className="w-full bg-transparent text-xs text-text placeholder-text-muted outline-none"
            />
          </div>
          <div className="mb-2 text-[10px] text-text-muted">
            {availableCount} layers in catalog. Use civic views first; use the raw catalog when you need to inspect a specific source layer.
          </div>
          {grouped.map((group) => {
            if (group.layers.length === 0) return null;
            const isExpanded = catalogQuery.trim().length > 0 || expandedCategories.has(group.id);

            return (
              <div key={group.id} className="mb-1">
                <button
                  onClick={() => toggleCategory(group.id)}
                  className="flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-xs text-text-muted hover:text-text hover:bg-bg-hover transition-colors"
                >
                  <motion.svg
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    className="h-3 w-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </motion.svg>
                  <span>{group.icon}</span>
                  <span className="flex-1 text-left">{group.name}</span>
                  <span className="text-[9px] text-text-muted tabular-nums">{group.layers.length}</span>
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
                          className="w-full rounded-lg px-2 py-2 text-left text-xs text-text-secondary hover:bg-bg-hover hover:text-text transition-colors"
                        >
                          <div className="flex items-start gap-2">
                            <span
                              className="mt-1.5 h-2 w-2 rounded-full flex-shrink-0 border"
                              style={{ borderColor: layer.color }}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-xs text-text">
                                {layer.icon} {layer.name}
                              </div>
                              <div className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-text-muted">
                                {layer.summary}
                              </div>
                              <div className="mt-1 flex items-center gap-1.5">
                                <DataTrustBadge confidence={layer.confidence} />
                                <span className="truncate text-[10px] text-text-muted">
                                  {getSourceMetadata(layer.sourceId)?.name ?? layer.sourceId}
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
          {availableCount === 0 && (
            <div className="rounded-lg border border-border bg-bg-surface px-3 py-4 text-xs text-text-muted">
              No layers match this filter. Try a different source, category, or civic question.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
