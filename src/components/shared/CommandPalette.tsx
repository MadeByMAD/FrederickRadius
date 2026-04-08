import { useState, useEffect, useRef, useCallback } from 'react';
import { municipalities } from '../../data/municipalities';
import { mapLayers, layerCategories } from '../../data/layers';
import { useAppState } from '../../hooks/useAppState';
import type { AppState } from '../../types';

interface Command {
  id: string;
  label: string;
  description: string;
  icon: string;
  category: string;
  action: () => void;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { dispatch } = useAppState();

  // Build command list
  const commands = useCallback((): Command[] => {
    const cmds: Command[] = [];

    // Municipalities
    for (const m of municipalities) {
      cmds.push({
        id: `muni-${m.id}`,
        label: m.name,
        description: `Pop. ${m.population.toLocaleString()} · ${m.area} mi²`,
        icon: '📍',
        category: 'Municipalities',
        action: () => dispatch({ type: 'SELECT_MUNICIPALITY', id: m.id }),
      });
    }

    // Panels
    const panels: Array<{ content: AppState['slidePanelContent']; label: string; icon: string; desc: string }> = [
      { content: 'weather', label: 'Weather Forecast', icon: '🌤️', desc: 'NWS 7-day forecast and alerts' },
      { content: 'water', label: 'Stream Gauges', icon: '💧', desc: '9 USGS water level monitors' },
      { content: 'traffic', label: 'Traffic Incidents', icon: '🚗', desc: 'Live Maryland CHART data' },
      { content: 'reports', label: '311 Service Requests', icon: '📢', desc: 'SeeClickFix open issues' },
      { content: 'parking', label: 'Parking', icon: '🅿️', desc: 'ParkMobile zones and garages' },
      { content: 'civic', label: 'Civic Info', icon: '🏛️', desc: 'Meetings and representatives' },
      { content: 'rewards', label: 'Rewards & Badges', icon: '⭐', desc: 'Your civic engagement score' },
    ];
    for (const p of panels) {
      cmds.push({
        id: `panel-${p.content}`,
        label: p.label,
        description: p.desc,
        icon: p.icon,
        category: 'Data Panels',
        action: () => dispatch({ type: 'OPEN_PANEL', content: p.content }),
      });
    }

    // Map layers
    for (const layer of mapLayers) {
      const cat = layerCategories.find((c) => c.id === layer.category);
      cmds.push({
        id: `layer-${layer.id}`,
        label: layer.name,
        description: `${cat?.name || 'Layer'} · Toggle on map`,
        icon: layer.icon,
        category: 'Map Layers',
        action: () => dispatch({ type: 'TOGGLE_LAYER', layerId: layer.id }),
      });
    }

    // Quick actions
    cmds.push({
      id: 'action-3d',
      label: 'Switch to 3D View',
      description: 'Tilt the map to 3D perspective',
      icon: '🗻',
      category: 'Actions',
      action: () => {
        const flyTo = (window as unknown as Record<string, (lng: number, lat: number, zoom?: number) => void>).__mapFlyTo;
        if (flyTo) flyTo(-77.41, 39.41, 10);
      },
    });
    cmds.push({
      id: 'action-reset',
      label: 'Reset Map View',
      description: 'Return to county overview',
      icon: '🔄',
      category: 'Actions',
      action: () => {
        const flyTo = (window as unknown as Record<string, (lng: number, lat: number, zoom?: number) => void>).__mapFlyTo;
        if (flyTo) flyTo(-77.41, 39.41, 10);
        dispatch({ type: 'CLOSE_PANEL' });
      },
    });

    return cmds;
  }, [dispatch]);

  // Filter
  const filtered = query.trim()
    ? commands().filter((c) =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.description.toLowerCase().includes(query.toLowerCase()) ||
        c.category.toLowerCase().includes(query.toLowerCase())
      )
    : commands();

  // Group by category
  const grouped = new Map<string, Command[]>();
  for (const cmd of filtered.slice(0, 20)) {
    const existing = grouped.get(cmd.category) || [];
    existing.push(cmd);
    grouped.set(cmd.category, existing);
  }

  // Keyboard shortcut
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
        setQuery('');
        setSelectedIndex(0);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Arrow key navigation
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
          setOpen(false);
        }
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, filtered, selectedIndex]);

  // Reset selection on query change
  useEffect(() => { setSelectedIndex(0); }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />

      {/* Palette */}
      <div className="relative w-full max-w-xl rounded-2xl border border-border bg-bg-elevated shadow-2xl overflow-hidden animate-slide-in">
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <svg className="h-5 w-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search municipalities, layers, data, actions..."
            className="flex-1 bg-transparent text-base text-text placeholder-text-muted outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-bg-surface border border-border px-1.5 py-0.5 text-[10px] text-text-muted">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-sm text-text-muted">No results for "{query}"</div>
          ) : (
            Array.from(grouped.entries()).map(([category, cmds]) => (
              <div key={category}>
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                  {category}
                </div>
                {cmds.map((cmd) => {
                  const idx = filtered.indexOf(cmd);
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => { cmd.action(); setOpen(false); }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                        isSelected ? 'bg-accent/10 text-text' : 'text-text-secondary hover:bg-bg-hover'
                      }`}
                    >
                      <span className="text-lg flex-shrink-0">{cmd.icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className={`text-sm font-medium truncate ${isSelected ? 'text-text' : ''}`}>
                          {cmd.label}
                        </div>
                        <div className="text-xs text-text-muted truncate">{cmd.description}</div>
                      </div>
                      {isSelected && (
                        <kbd className="flex-shrink-0 rounded bg-bg-surface border border-border px-1.5 py-0.5 text-[10px] text-text-muted">
                          ↵
                        </kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3 text-[10px] text-text-muted">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <div className="text-[10px] text-text-muted">{filtered.length} results</div>
        </div>
      </div>
    </div>
  );
}
