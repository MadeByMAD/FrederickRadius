import { useState, useRef, useEffect } from 'react';
import { useSearch } from '../../hooks/useSearch';
import { useAppState } from '../../hooks/useAppState';
import { municipalities } from '../../data/municipalities';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { results, loading, search } = useSearch();
  const { dispatch } = useAppState();
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
    const flyTo = (window as unknown as Record<string, (lng: number, lat: number, zoom?: number) => void>).__mapFlyTo;
    if (flyTo) flyTo(parseFloat(lon), parseFloat(lat), 15);
    // Trigger Address Intelligence
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

  // Filter municipalities by query
  const matchedMunis = query.trim().length > 0
    ? municipalities.filter((m) =>
        m.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex items-center gap-2 rounded-lg border border-border bg-bg-surface px-3 py-2">
        <svg className="h-4 w-4 text-text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => query.length > 2 && setShowResults(true)}
          placeholder="Search addresses, places, municipalities..."
          className="w-full bg-transparent text-sm text-text placeholder-text-muted outline-none"
        />
        {loading && (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-accent flex-shrink-0" />
        )}
      </div>

      {showResults && (matchedMunis.length > 0 || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto rounded-lg border border-border bg-bg-elevated shadow-lg">
          {matchedMunis.length > 0 && (
            <>
              <div className="px-3 py-1.5 text-xs text-text-muted">Municipalities</div>
              {matchedMunis.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleMunicipalitySelect(m.id)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-bg-hover transition-colors"
                >
                  <span className="text-accent">●</span>
                  <span className="text-text">{m.name}</span>
                  <span className="ml-auto text-xs text-text-muted">Pop. {m.population.toLocaleString()}</span>
                </button>
              ))}
            </>
          )}
          {results.length > 0 && (
            <>
              <div className="px-3 py-1.5 text-xs text-text-muted">Addresses</div>
              {results.map((r, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(r.lat, r.lon, r.display_name)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-bg-hover transition-colors"
                >
                  <svg className="h-3.5 w-3.5 text-text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-text truncate">{r.display_name}</span>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
