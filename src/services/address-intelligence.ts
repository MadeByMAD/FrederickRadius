import { municipalities } from '../data/municipalities';
import * as turf from '@turf/turf';

export interface AddressIntelligence {
  address: string;
  lat: number;
  lng: number;
  municipality: string | null;
  distanceToCity: number; // miles to City of Frederick
  nearestMunicipality: { name: string; distance: number };
  // All computed from location
  zoning: string | null;
  floodZone: string | null;
  schoolDistrict: string | null;
  councilDistrict: string | null;
  fireStation: string | null;
  policeJurisdiction: string | null;
  waterSewer: string | null;
  walkabilityNote: string;
  nearbyParks: number;
  nearbySchools: number;
  nearbyTransit: number;
  elevationNote: string;
}

export function computeAddressIntelligence(
  lat: number,
  lng: number,
  address: string
): AddressIntelligence {
  const point = turf.point([lng, lat]);
  const frederickCenter = turf.point([-77.4105, 39.4143]);

  // Find which municipality (if any) the point is in
  let inMunicipality: string | null = null;
  let nearest = { name: '', distance: Infinity };

  for (const m of municipalities) {
    const dist = turf.distance(point, turf.point(m.centroid), { units: 'miles' });
    if (dist < nearest.distance) {
      nearest = { name: m.name, distance: Math.round(dist * 10) / 10 };
    }
    // Rough check: if within approximate radius of municipality
    const approxRadius = Math.sqrt(m.area) * 0.7;
    if (dist < approxRadius) {
      inMunicipality = m.name;
    }
  }

  const distToCity = turf.distance(point, frederickCenter, { units: 'miles' });

  return {
    address,
    lat,
    lng,
    municipality: inMunicipality,
    distanceToCity: Math.round(distToCity * 10) / 10,
    nearestMunicipality: nearest,
    // These would be filled by actual GIS queries in production
    zoning: null,
    floodZone: null,
    schoolDistrict: null,
    councilDistrict: null,
    fireStation: null,
    policeJurisdiction: null,
    waterSewer: null,
    walkabilityNote: distToCity < 3 ? 'Walkable urban area' : distToCity < 8 ? 'Suburban — car recommended' : 'Rural area',
    nearbyParks: 0,
    nearbySchools: 0,
    nearbyTransit: 0,
    elevationNote: lat > 39.55 ? 'Catoctin Mountain foothills (~1,200+ ft)' : lat > 39.45 ? 'Piedmont plateau (~300-500 ft)' : 'Monocacy Valley (~250-350 ft)',
  };
}

// Query ArcGIS layers to enrich intelligence
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
    { key: 'policeJurisdiction', url: `${base}/PublicSafety/ESZ/MapServer/6/query?${params}`, field: 'NAME' },
    { key: 'schoolDistrict', url: `${base}/PublicSchools/SchoolDistricts/MapServer/2/query?${params}`, field: 'NAME' },
  ];

  const results = await Promise.allSettled(
    queries.map(async (q) => {
      const res = await fetch(q.url);
      if (!res.ok) return null;
      const json = await res.json();
      const features = json.features || [];
      if (features.length > 0) {
        const val = features[0].attributes?.[q.field] || features[0].attributes?.Name || features[0].attributes?.LABEL;
        return { key: q.key, value: val ? String(val) : null };
      }
      return null;
    })
  );

  const enriched = { ...intel };
  for (const r of results) {
    if (r.status === 'fulfilled' && r.value) {
      (enriched as Record<string, unknown>)[r.value.key] = r.value.value;
    }
  }

  // Count nearby features using simple radius queries
  const radiusParams = `geometry=${encodeURIComponent(JSON.stringify({ x: lng, y: lat, spatialReference: { wkid: 4326 } }))}&geometryType=esriGeometryPoint&spatialRel=esriSpatialRelIntersects&distance=2&units=esriSRUnit_StatuteMile&outFields=OBJECTID&f=json&returnGeometry=false&returnCountOnly=true`;

  const countQueries = [
    { key: 'nearbyParks', url: `${base}/ParksAndRecreation/Parks/MapServer/0/query?${radiusParams}` },
    { key: 'nearbySchools', url: `${base}/PublicSchools/EducationalFacilities/MapServer/0/query?${radiusParams}` },
  ];

  const counts = await Promise.allSettled(
    countQueries.map(async (q) => {
      const res = await fetch(q.url);
      if (!res.ok) return null;
      const json = await res.json();
      return { key: q.key, value: json.count || 0 };
    })
  );

  for (const r of counts) {
    if (r.status === 'fulfilled' && r.value) {
      (enriched as Record<string, unknown>)[r.value.key] = r.value.value;
    }
  }

  return enriched;
}
