import { useAppState } from '../../hooks/useAppState';
import { layerCategories } from '../../data/layers';

export function MapControls() {
  const { layers, dispatch } = useAppState();

  const grouped = layerCategories.map((cat) => ({
    ...cat,
    layers: layers.filter((l) => l.category === cat.id),
  }));

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Data Layers</h3>
      <div className="rounded-lg border border-border bg-bg-surface px-3 py-2 text-[11px] leading-5 text-text-secondary">
        These are raw layer toggles. Use curated civic views in the desktop layer panel when you want a clearer, source-bounded starting point.
      </div>
      {grouped.map((group) => (
        <div key={group.id}>
          <div className="mb-1 flex items-center gap-1.5 text-xs text-text-muted">
            <span>{group.icon}</span>
            <span>{group.name}</span>
          </div>
          <div className="space-y-0.5">
            {group.layers.map((layer) => (
              <button
                key={layer.id}
                onClick={() => dispatch({ type: 'TOGGLE_LAYER', layerId: layer.id })}
                className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm transition-colors ${
                  layer.visible
                    ? 'bg-bg-hover text-text'
                    : 'text-text-secondary hover:bg-bg-hover hover:text-text'
                }`}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: layer.visible ? layer.color : 'transparent',
                    border: `1.5px solid ${layer.color}`,
                  }}
                />
                <span className="truncate">{layer.icon} {layer.name}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
