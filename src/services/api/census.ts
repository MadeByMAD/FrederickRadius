/**
 * Census TIGER/Line boundary service.
 * Uses the TIGERweb REST API to fetch official municipality boundaries
 * for Frederick County, Maryland (FIPS 24021).
 *
 * Source: U.S. Census Bureau, TIGERweb
 * https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb
 */

import type { GeoJSONCollection } from '../../types';

const TIGERWEB_BASE = 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb';

// Incorporated Places layer — contains city/town boundaries
const PLACES_URL = `${TIGERWEB_BASE}/tigerWMS_Current/MapServer/28`;

// Frederick County FIPS = 24021 (State 24, County 021)

const MUNICIPALITY_NAME_MAP: Record<string, string> = {
  'Frederick': 'frederick',
  'Thurmont': 'thurmont',
  'Emmitsburg': 'emmitsburg',
  'Middletown': 'middletown',
  'Brunswick': 'brunswick',
  'Walkersville': 'walkersville',
  'Myersville': 'myersville',
  'Woodsboro': 'woodsboro',
  'New Market': 'new-market',
  'Mount Airy': 'mount-airy',
  'Burkittsville': 'burkittsville',
  'Rosemont': 'rosemont',
};

let cache: { data: GeoJSONCollection; timestamp: number } | null = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour — boundaries rarely change

/**
 * Fetch official municipality boundary polygons for Frederick County
 * from the Census Bureau's TIGERweb REST API.
 */
export async function fetchMunicipalityBoundaries(): Promise<GeoJSONCollection> {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return cache.data;
  }

  // The Places layer has no COUNTY field. Use a spatial query with
  // Frederick County's bounding box and filter by STATE='24'.
  // The bbox is slightly generous; we filter to our known municipalities after.
  const FREDERICK_BBOX = '-77.72,39.21,-77.12,39.72';

  const params = new URLSearchParams({
    where: `STATE='24'`,
    geometry: FREDERICK_BBOX,
    geometryType: 'esriGeometryEnvelope',
    inSR: '4326',
    spatialRel: 'esriSpatialRelIntersects',
    outFields: 'NAME,BASENAME,FUNCSTAT,AREALAND,AREAWATER,GEOID,LSADC',
    f: 'geojson',
    outSR: '4326',
    returnGeometry: 'true',
  });

  const url = `${PLACES_URL}/query?${params}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`TIGERweb error: ${res.status}`);
  }

  const json = await res.json();

  if (json.error) {
    throw new Error(`TIGERweb error: ${json.error.message}`);
  }

  const raw = json as GeoJSONCollection;

  // Filter to only our known Frederick County municipalities
  const knownNames = new Set(Object.keys(MUNICIPALITY_NAME_MAP));
  const data: GeoJSONCollection = {
    ...raw,
    features: raw.features.filter((f) => {
      const basename = (f.properties as Record<string, string>)?.BASENAME;
      return basename && knownNames.has(basename);
    }),
  };

  cache = { data, timestamp: Date.now() };
  return data;
}

/**
 * Match a TIGERweb place name to our municipality ID.
 * TIGERweb uses BASENAME (e.g., "Frederick") and LSADC for type.
 */
export function matchMunicipalityId(basename: string): string | null {
  return MUNICIPALITY_NAME_MAP[basename] ?? null;
}
