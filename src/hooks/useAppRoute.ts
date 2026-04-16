import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type PanelKind =
  | 'municipality'
  | 'weather'
  | 'water'
  | 'traffic'
  | 'reports'
  | 'parking'
  | 'civic'
  | 'compare'
  | 'dashboard'
  | 'address-intel';

const DATA_PANELS: PanelKind[] = [
  'weather',
  'water',
  'traffic',
  'reports',
  'parking',
  'civic',
  'compare',
  'dashboard',
];

export interface AppRoute {
  panel: PanelKind | null;
  municipalitySlug: string | null;
  address: { lat: number; lng: number; addressText: string } | null;
}

/**
 * Compute which panel, municipality, or address the URL currently points to.
 * The URL is the single source of truth for navigation state; components read
 * from here rather than from a reducer field.
 */
export function useAppRoute(): AppRoute {
  const location = useLocation();
  const pathname = location.pathname;

  const muniMatch = pathname.match(/^\/m\/([^/]+)/);
  if (muniMatch) {
    return { panel: 'municipality', municipalitySlug: muniMatch[1], address: null };
  }

  const dataMatch = pathname.match(/^\/data\/([^/]+)/);
  if (dataMatch && (DATA_PANELS as string[]).includes(dataMatch[1])) {
    return { panel: dataMatch[1] as PanelKind, municipalitySlug: null, address: null };
  }

  const addrMatch = pathname.match(/^\/address\/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (addrMatch) {
    const lng = parseFloat(addrMatch[1]);
    const lat = parseFloat(addrMatch[2]);
    const addressText = new URLSearchParams(location.search).get('q')
      ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    return { panel: 'address-intel', municipalitySlug: null, address: { lat, lng, addressText } };
  }

  return { panel: null, municipalitySlug: null, address: null };
}

/** Convenience helpers that produce canonical URLs for each destination. */
export const routes = {
  home: () => '/',
  municipality: (slug: string) => `/m/${slug}`,
  data: (panel: Exclude<PanelKind, 'municipality' | 'address-intel'>) => `/data/${panel}`,
  address: (lng: number, lat: number, q?: string) =>
    `/address/${lng},${lat}${q ? `?q=${encodeURIComponent(q)}` : ''}`,
} as const;

/** A navigate() wrapper that closes the current panel by returning to `/`. */
export function useClosePanel() {
  const navigate = useNavigate();
  return useCallback(() => navigate(routes.home()), [navigate]);
}
