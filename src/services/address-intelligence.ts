import * as turf from '@turf/turf';
import { municipalities } from '../data/municipalities';
import type { DataFact } from '../types';

const COUNTY_GIS_SOURCE_ID = 'frederick-county-gis';
const APPROXIMATE_SOURCE_ID = 'approximate-municipality-reference';

export interface AddressIntelligence {
  address: string;
  lat: number;
  lng: number;
  municipalityEstimate: DataFact<string>;
  nearestMunicipality: {
    name: string;
    distanceMiles: number;
    confidence: 'approximate';
    sourceId: string;
    note: string;
  };
  distanceToFrederickMiles: number;
  zoning: DataFact<string>;
  floodZone: DataFact<string>;
  schoolDistrict: DataFact<string>;
  councilDistrict: DataFact<string>;
  fireStation: DataFact<string>;
  policeJurisdiction: DataFact<string>;
  waterSewer: DataFact<string>;
  dataRetrievedAt: string;
  notes: string[];
}

const OFFICIAL_NOT_READY_NOTE =
  'Live official lookup not returned yet or the intersecting layer returned no feature.';

function unavailableFact(sourceId: string, note = OFFICIAL_NOT_READY_NOTE): DataFact<string> {
  return {
    value: null,
    confidence: 'unavailable',
    sourceId,
    note,
  };
}

function officialFact(value: string, sourceId: string): DataFact<string> {
  return {
    value,
    confidence: 'official',
    sourceId,
  };
}

export function computeAddressIntelligence(
  lat: number,
  lng: number,
  address: string
): AddressIntelligence {
  const point = turf.point([lng, lat]);
  const frederickCenter = turf.point([-77.4105, 39.4143]);

  let nearest = { name: municipalities[0]?.name ?? 'Unknown', distance: Number.POSITIVE_INFINITY, area: 0 };

  for (const municipality of municipalities) {
    const distance = turf.distance(point, turf.point(municipality.centroid), { units: 'miles' });
    if (distance < nearest.distance) {
      nearest = { name: municipality.name, distance, area: municipality.area };
    }
  }

  const estimatedRadiusMiles = Math.max(Math.sqrt(nearest.area) * 0.7, 0.5);
  const estimatedMunicipality =
    nearest.distance <= estimatedRadiusMiles
      ? {
          value: nearest.name,
          confidence: 'approximate' as const,
          sourceId: APPROXIMATE_SOURCE_ID,
          note: 'Derived from municipality centroids and manual area snapshots. This is directional context, not an official boundary lookup.',
        }
      : {
          value: null,
          confidence: 'unavailable' as const,
          sourceId: APPROXIMATE_SOURCE_ID,
          note: 'Official municipality boundaries are not wired yet, so the app cannot confidently assign a municipality here.',
        };

  return {
    address,
    lat,
    lng,
    municipalityEstimate: estimatedMunicipality,
    nearestMunicipality: {
      name: nearest.name,
      distanceMiles: Number(nearest.distance.toFixed(1)),
      confidence: 'approximate',
      sourceId: APPROXIMATE_SOURCE_ID,
      note: 'Nearest municipality is measured from centroid distance only.',
    },
    distanceToFrederickMiles: Number(
      turf.distance(point, frederickCenter, { units: 'miles' }).toFixed(1)
    ),
    zoning: unavailableFact(COUNTY_GIS_SOURCE_ID),
    floodZone: unavailableFact(COUNTY_GIS_SOURCE_ID),
    schoolDistrict: unavailableFact(COUNTY_GIS_SOURCE_ID),
    councilDistrict: unavailableFact(COUNTY_GIS_SOURCE_ID),
    fireStation: unavailableFact(COUNTY_GIS_SOURCE_ID),
    policeJurisdiction: unavailableFact(COUNTY_GIS_SOURCE_ID),
    waterSewer: unavailableFact(COUNTY_GIS_SOURCE_ID, 'Water and sewer lookup is not wired yet.'),
    dataRetrievedAt: new Date().toISOString(),
    notes: [
      'Official overlay fields below come from live county GIS point-in-polygon queries when available.',
      'Municipality context is approximate until official municipal boundary geometry is added.',
    ],
  };
}

export async function enrichWithGIS(intel: AddressIntelligence): Promise<AddressIntelligence> {
  const { lat, lng } = intel;
  const base = 'https://fcgis.frederickcountymd.gov/server_pub/rest/services';
  const geom = encodeURIComponent(JSON.stringify({ x: lng, y: lat, spatialReference: { wkid: 4326 } }));
  const params = `geometry=${geom}&geometryType=esriGeometryPoint&spatialRel=esriSpatialRelIntersects&outFields=*&f=json&returnGeometry=false&inSR=4326`;

  const queries = [
    { key: 'zoning', url: `${base}/PlanningAndPermitting/Zoning/MapServer/0/query?${params}`, field: 'ZONING' },
    { key: 'floodZone', url: `${base}/PlanningAndPermitting/FEMAFloodplain/MapServer/0/query?${params}`, field: 'FLD_ZONE' },
    { key: 'councilDistrict', url: `${base}/Elections/Elections/MapServer/1/query?${params}`, field: 'NAME' },
    { key: 'fireStation', url: `${base}/PublicSafety/FireAreas/MapServer/1/query?${params}`, field: 'NAME' },
    { key: 'policeJurisdiction', url: `${base}/PublicSafety/ESZ/MapServer/6/query?${params}`, field: 'JURIS' },
    { key: 'schoolDistrict', url: `${base}/PublicSchools/SchoolDistricts/MapServer/2/query?${params}`, field: 'NAME' },
    { key: 'waterSewer', url: `${base}/PlanningAndPermitting/WaterSewerServiceAreas/MapServer/0/query?${params}`, field: 'SERVICEAREA' },
  ] as const;

  const results = await Promise.allSettled(
    queries.map(async (query) => {
      const response = await fetch(query.url);
      if (!response.ok) {
        return { key: query.key, fact: unavailableFact(COUNTY_GIS_SOURCE_ID, `County GIS query failed with ${response.status}.`) };
      }

      const json = await response.json();
      const feature = json.features?.[0];
      const rawValue =
        feature?.attributes?.[query.field]
        ?? feature?.attributes?.Name
        ?? feature?.attributes?.LABEL
        ?? null;

      if (rawValue === null || rawValue === undefined || rawValue === '') {
        return {
          key: query.key,
          fact: unavailableFact(
            COUNTY_GIS_SOURCE_ID,
            'County GIS returned no intersecting feature. Treat this as incomplete context, not clearance.'
          ),
        };
      }

      return {
        key: query.key,
        fact: officialFact(String(rawValue), COUNTY_GIS_SOURCE_ID),
      };
    })
  );

  const enriched: AddressIntelligence = {
    ...intel,
    dataRetrievedAt: new Date().toISOString(),
  };

  for (const result of results) {
    if (result.status === 'fulfilled') {
      switch (result.value.key) {
        case 'zoning':
          enriched.zoning = result.value.fact;
          break;
        case 'floodZone':
          enriched.floodZone = result.value.fact;
          break;
        case 'schoolDistrict':
          enriched.schoolDistrict = result.value.fact;
          break;
        case 'councilDistrict':
          enriched.councilDistrict = result.value.fact;
          break;
        case 'fireStation':
          enriched.fireStation = result.value.fact;
          break;
        case 'policeJurisdiction':
          enriched.policeJurisdiction = result.value.fact;
          break;
        case 'waterSewer':
          enriched.waterSewer = result.value.fact;
          break;
      }
    }
  }

  return enriched;
}
