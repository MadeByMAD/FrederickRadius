import type { GeoJSONCollection } from '../../types';

// TODO: Move ArcGIS querying behind a backend normalization layer that can validate schemas,
// limit fields, track per-layer freshness, and avoid shipping raw `outFields=*` payloads.
const QUERY_PARAMS = 'where=1%3D1&outFields=*&f=geojson&outSR=4326';

const featureCache = new Map<string, { data: GeoJSONCollection; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export async function fetchArcGISLayer(endpoint: string): Promise<GeoJSONCollection> {
  const cached = featureCache.get(endpoint);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const url = `${endpoint}/query?${QUERY_PARAMS}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`ArcGIS error: ${res.status} for ${endpoint}`);
  const json = await res.json();

  // ArcGIS sometimes returns an error object instead of GeoJSON
  if (json.error) {
    throw new Error(`ArcGIS error: ${json.error.message}`);
  }

  const data = json as GeoJSONCollection;
  featureCache.set(endpoint, { data, timestamp: Date.now() });
  return data;
}

export function getFeatureLabel(properties: Record<string, unknown>): string {
  // Try common field names
  const nameFields = ['NAME', 'Name', 'name', 'FACILITY', 'Facility', 'STATION', 'Station', 'LABEL', 'Label', 'DESCRIPTION', 'StopName', 'RouteName'];
  for (const field of nameFields) {
    if (properties[field] && typeof properties[field] === 'string') {
      return properties[field] as string;
    }
  }
  return 'Feature';
}

export function getFeatureDetails(properties: Record<string, unknown>): Array<{ key: string; value: string }> {
  const skip = new Set(['OBJECTID', 'ObjectId', 'Shape', 'Shape_Length', 'Shape_Area', 'GlobalID', 'SHAPE', 'FID']);
  const details: Array<{ key: string; value: string }> = [];

  for (const [key, value] of Object.entries(properties)) {
    if (skip.has(key) || value === null || value === undefined || value === '') continue;
    details.push({
      key: key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim(),
      value: String(value),
    });
  }

  return details.slice(0, 8);
}
