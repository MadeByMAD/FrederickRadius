import { motion } from 'framer-motion';
import { useAppState } from '../../hooks/useAppState';
import type { MapLayer } from '../../types';
import { getSourceMetadata } from '../../data/source-registry';
import { DataTrustBadge } from '../shared/DataTrustBadge';

interface Props {
  layer: MapLayer;
  opacity: number;
}

export function LayerItem({ layer, opacity }: Props) {
  const { dispatch } = useAppState();
  const source = getSourceMetadata(layer.sourceId);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="flex items-center gap-2 rounded-lg bg-bg-surface border border-border px-2.5 py-2 group"
    >
      {/* Drag handle */}
      <span className="text-text-muted cursor-grab active:cursor-grabbing text-xs select-none">≡</span>

      {/* Color dot */}
      <span
        className="h-2.5 w-2.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: layer.color }}
      />

      <div className="min-w-0 flex-1">
        <div className="truncate text-xs text-text">
          {layer.icon} {layer.name}
        </div>
        <div className="mt-1 flex items-center gap-1.5">
          <DataTrustBadge confidence={layer.confidence} />
          <span className="truncate text-[10px] text-text-muted">
            {source?.name ?? layer.sourceId}
          </span>
        </div>
        <div className="mt-1 line-clamp-2 text-[10px] leading-4 text-text-muted">
          {layer.notes ?? layer.summary}
        </div>
      </div>

      {/* Opacity slider */}
      <input
        type="range"
        min={10}
        max={100}
        value={opacity}
        onChange={(e) =>
          dispatch({ type: 'SET_LAYER_OPACITY', layerId: layer.id, opacity: parseInt(e.target.value) })
        }
        className="w-14 h-1 rounded-full appearance-none bg-border cursor-pointer accent-accent flex-shrink-0"
        title={`${opacity}%`}
      />

      {/* Opacity value */}
      <span className="text-[9px] text-text-muted w-6 text-right tabular-nums flex-shrink-0">
        {opacity}%
      </span>

      {/* Remove */}
      <button
        onClick={() => dispatch({ type: 'TOGGLE_LAYER', layerId: layer.id })}
        className="text-text-muted hover:text-danger transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  );
}
