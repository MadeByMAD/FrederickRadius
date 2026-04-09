import type { SearchResult } from '../types';

// TODO: Route address search through a backend broker that can prioritize official county/city
// geocoders, normalize responses, and cache results. Browser-side Nominatim is acceptable for
// prototyping but not for a high-trust production civic product.
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

// Frederick County bounding box
const VIEWBOX = '-77.8,39.1,-77.0,39.75';

let lastSearch = 0;
const RATE_LIMIT_MS = 1100; // Nominatim requires 1 req/sec

export async function geocodeAddress(query: string): Promise<SearchResult[]> {
  const now = Date.now();
  const wait = RATE_LIMIT_MS - (now - lastSearch);
  if (wait > 0) {
    await new Promise((r) => setTimeout(r, wait));
  }
  lastSearch = Date.now();

  const params = new URLSearchParams({
    q: query,
    format: 'json',
    countrycodes: 'us',
    viewbox: VIEWBOX,
    bounded: '1',
    limit: '8',
    addressdetails: '1',
  });

  const res = await fetch(`${NOMINATIM_URL}?${params}`, {
    headers: {
      'User-Agent': 'FrederickRadius/1.0',
    },
  });

  if (!res.ok) throw new Error(`Geocoding error: ${res.status}`);
  return res.json();
}

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const now = Date.now();
  const wait = RATE_LIMIT_MS - (now - lastSearch);
  if (wait > 0) {
    await new Promise((r) => setTimeout(r, wait));
  }
  lastSearch = Date.now();

  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString(),
    format: 'json',
  });

  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?${params}`,
    { headers: { 'User-Agent': 'FrederickRadius/1.0' } }
  );

  if (!res.ok) return 'Unknown location';
  const json = await res.json();
  return json.display_name || 'Unknown location';
}
