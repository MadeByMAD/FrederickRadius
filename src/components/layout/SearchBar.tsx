import { useState, useRef, useEffect } from 'react';
import { useSearch } from '../../hooks/useSearch';
import { useAppState } from '../../hooks/useAppState';
import { useMapFlyTo } from '../../hooks/useMapFlyTo';
import { municipalities } from '../../data/municipalities';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { results, loading, error, search } = useSearch();
  const { dispatch } = useAppState();
  const { flyTo: mapFlyTo } = useMapFlyTo();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleInput(value: string) {
    setQuery(value);
    clearTimeout(timerRef.current);
    if (value.trim().length > 2) {
      timerRef.current = setTimeout(() => {
        search(value);
        setShowResults(true);
      }, 400);
    } else {
      setShowResults(false);
    }
  }

  function handleSelect(lat: string, lon: string, name: string) {
    setShowResults(false);
    setQuery(name.split(',')[0]);
    mapFlyTo(parseFloat(lon), parseFloat(lat), 15);
    dispatch({
      type: 'ADDRESS_INTEL',
      lat: parseFloat(lat),
      lng: parseFloat(lon),
      address: name,
    });
  }

  function handleMunicipalitySelect(id: string) {
    setShowResults(false);
    dispatch({ type: 'SELECT_MUNICIPALITY', id });
  }

  const matchedMunis = query.trim().length > 0
    ? municipalities.filter((m) => m.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex items-center gap-2.5 rounded-2xl border border-border/50 bg-white/80 px-3.5 py-2.5 shadow-sm">
        <svg className="h-4 w-4 flex-shrink-0 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => query.length > 2 && setShowResults(true)}
          placeholder="Search Frederick..."
          className="w-full bg-transparent text-[15px] text-text placeholder-text-muted/60 outline-none"
        />
        {loading && (
          <div className="h-4 w-4 flex-shrink-0 animate-spin rounded-full border-2 border-border border-t-accent" />
        )}
      </div>

      {error && (
        <div className="mt-2 rounded-2xl border border-danger/20 bg-danger/8 px-3 py-2 text-[11px] leading-5 text-danger">
          {error}
        </div>
      )}

      {showResults && (matchedMunis.length > 0 || results.length > 0) && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-72 overflow-y-auto rounded-2xl border border-border/50 bg-white/95 backdrop-blur-lg p-1.5 shadow-xl">
          {matchedMunis.map((m) => (
            <button
              key={m.id}
              onClick={() => handleMunicipalitySelect(m.id)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-black/[0.04] active:bg-black/[0.06]"
            >
              <span className="text-base">📍</span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14px] font-medium text-text">{m.name}</div>
                <div className="text-[11px] text-text-muted">Municipality</div>
              </div>
            </button>
          ))}
          {results.map((r, i) => (
            <button
              key={i}
              onClick={() => handleSelect(r.lat, r.lon, r.display_name)}
              className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-black/[0.04] active:bg-black/[0.06]"
            >
              <span className="mt-0.5 text-base">📌</span>
              <div className="min-w-0">
                <div className="line-clamp-2 text-[14px] font-medium text-text">{r.display_name}</div>
                <div className="mt-0.5 text-[11px] text-text-muted">Address</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
