import type { MapLayer } from '../types';
import type { SourceRegistryId } from './source-registry';

const ARCGIS_BASE = 'https://fcgis.frederickcountymd.gov/server_pub/rest/services';
const CITY_BASE = 'https://spires.cityoffrederick.com/arcgis/rest/services';
const MD_TRANSIT = 'https://mdgeodata.md.gov/imap/rest/services/Transportation/MD_LocalTransit/FeatureServer';
const AGOL = 'https://services5.arcgis.com/o8KSxSzYaulbGcFX/arcgis/rest/services';

type LayerSeed = Omit<
  MapLayer,
  'visible' | 'sourceId' | 'classification' | 'confidence' | 'cadence' | 'coverageArea' | 'summary'
> & {
  summary?: string;
  notes?: string;
};

function buildLayer(
  defaults: {
    sourceId: SourceRegistryId;
    coverageArea: string;
    confidence?: MapLayer['confidence'];
    classification?: MapLayer['classification'];
    cadence?: MapLayer['cadence'];
  },
  layer: LayerSeed
): MapLayer {
  return {
    visible: false,
    sourceId: defaults.sourceId,
    classification: defaults.classification ?? 'reference',
    confidence: defaults.confidence ?? 'official',
    cadence: defaults.cadence ?? 'unknown',
    coverageArea: defaults.coverageArea,
    summary: layer.summary ?? `${layer.name} reference layer.`,
    ...layer,
  };
}

const countyLayer = (layer: LayerSeed) =>
  buildLayer({ sourceId: 'frederick-county-gis', coverageArea: 'Frederick County, Maryland' }, layer);

const cityLayer = (layer: LayerSeed) =>
  buildLayer({ sourceId: 'city-of-frederick-gis', coverageArea: 'City of Frederick, Maryland' }, layer);

const stateLayer = (layer: LayerSeed) =>
  buildLayer({ sourceId: 'maryland-imap', coverageArea: 'Maryland statewide; use with Frederick-area map context' }, layer);

const hostedGovernmentLayer = (layer: LayerSeed) =>
  buildLayer(
    {
      sourceId: 'frederick-government-hosted-arcgis',
      coverageArea: 'Frederick County region',
      confidence: 'reference',
    },
    layer
  );

export const mapLayers: MapLayer[] = [
  countyLayer({ id: 'fire-stations', name: 'Fire Stations', icon: '🚒', category: 'safety', color: '#EF4444', endpoint: `${ARCGIS_BASE}/PublicSafety/FireAreas/MapServer/0`, type: 'point', summary: 'Frederick County fire station points from the county public safety GIS catalog.' }),
  countyLayer({ id: 'fire-hydrants', name: 'Fire Hydrants', icon: '🧯', category: 'safety', color: '#DC2626', endpoint: `${ARCGIS_BASE}/PublicSafety/FireHydrants/MapServer/0`, type: 'point', summary: 'County hydrant inventory reference layer.' }),
  countyLayer({ id: 'police-districts', name: 'Emergency Service Zones', icon: '🚔', category: 'safety', color: '#3B82F6', endpoint: `${ARCGIS_BASE}/PublicSafety/ESZ/MapServer/6`, type: 'polygon', summary: 'Frederick County Police Districts (ESZ) polygons.', notes: 'This is a jurisdictional boundary layer, not live public-safety activity.' }),
  countyLayer({ id: 'law-enforcement', name: 'Police Stations', icon: '👮', category: 'safety', color: '#1D4ED8', endpoint: `${ARCGIS_BASE}/PublicSafety/Law_Enforcement/MapServer/0`, type: 'point', summary: 'Law enforcement facility reference points.' }),
  countyLayer({ id: 'shelters', name: 'Emergency Shelters', icon: '🏠', category: 'safety', color: '#F97316', endpoint: `${ARCGIS_BASE}/PublicSafety/Shelters/MapServer/0`, type: 'point', summary: 'Emergency shelter locations published in county GIS.' }),
  countyLayer({ id: 'towers', name: 'Communication Towers', icon: '📡', category: 'safety', color: '#6366F1', endpoint: `${ARCGIS_BASE}/PublicSafety/Towers/MapServer/0`, type: 'point', summary: 'Public-safety communication tower reference points.' }),
  countyLayer({ id: 'flood-points', name: 'Roadway Flood Points', icon: '🌊', category: 'safety', color: '#0EA5E9', endpoint: `${ARCGIS_BASE}/PublicSafety/RoadwayFloodPoints/MapServer/0`, type: 'point', summary: 'Known roadway flood-prone points from county public safety GIS.' }),

  countyLayer({ id: 'libraries', name: 'Libraries', icon: '📚', category: 'facilities', color: '#8B5CF6', endpoint: `${ARCGIS_BASE}/Basemap/PointsOfInterest/MapServer/1`, type: 'point' }),
  countyLayer({ id: 'gov-facilities', name: 'Government Buildings', icon: '🏛️', category: 'facilities', color: '#6366F1', endpoint: `${ARCGIS_BASE}/Basemap/PointsOfInterest/MapServer/2`, type: 'point' }),
  countyLayer({ id: 'post-offices', name: 'Post Offices', icon: '📮', category: 'facilities', color: '#2563EB', endpoint: `${ARCGIS_BASE}/Basemap/PointsOfInterest/MapServer/5`, type: 'point' }),
  countyLayer({ id: 'community-facilities', name: 'Community Facilities', icon: '🏢', category: 'facilities', color: '#10B981', endpoint: `${ARCGIS_BASE}/PlanningAndPermitting/ComprehensivePlan/MapServer/5`, type: 'point' }),
  hostedGovernmentLayer({ id: 'hospitals', name: 'Hospitals & Medical', icon: '🏥', category: 'facilities', color: '#EC4899', endpoint: `${AGOL}/MedicalFacilities_public/FeatureServer/0`, type: 'point', summary: 'Hosted medical facility points associated with Frederick government publishers.' }),
  countyLayer({ id: 'nursing-homes', name: 'Nursing Homes', icon: '🏡', category: 'facilities', color: '#F472B6', endpoint: `${ARCGIS_BASE}/PublicSafety/NursingHomes/MapServer/0`, type: 'point' }),
  countyLayer({ id: 'senior-housing', name: 'Senior Housing', icon: '👴', category: 'facilities', color: '#A78BFA', endpoint: `${ARCGIS_BASE}/PlanningAndPermitting/Senior_Housing_Resources/MapServer/0`, type: 'point' }),
  hostedGovernmentLayer({ id: 'food-distribution', name: 'Food Distribution Sites', icon: '🍲', category: 'facilities', color: '#22C55E', endpoint: `${AGOL}/Food_Distribution_Sites/FeatureServer/0`, type: 'point' }),
  countyLayer({ id: 'farmers-markets', name: 'Farmers Markets', icon: '🥬', category: 'facilities', color: '#16A34A', endpoint: `${ARCGIS_BASE}/Basemap/PointsOfInterest/MapServer/0`, type: 'point' }),
  countyLayer({ id: 'hotels', name: 'Hotels', icon: '🏨', category: 'facilities', color: '#7C3AED', endpoint: `${ARCGIS_BASE}/Basemap/PointsOfInterest/MapServer/3`, type: 'point' }),
  countyLayer({ id: 'worship', name: 'Places of Worship', icon: '⛪', category: 'facilities', color: '#C084FC', endpoint: `${ARCGIS_BASE}/Basemap/PointsOfInterest/MapServer/4`, type: 'point' }),
  countyLayer({ id: 'shopping', name: 'Shopping Centers', icon: '🛒', category: 'facilities', color: '#E879F9', endpoint: `${ARCGIS_BASE}/Basemap/PointsOfInterest/MapServer/6`, type: 'point' }),
  countyLayer({ id: 'liquor', name: 'Liquor-Licensed Establishments', icon: '🍺', category: 'facilities', color: '#FBBF24', endpoint: `${ARCGIS_BASE}/PlanningAndPermitting/LiquorEstablishments/MapServer/0`, type: 'point', summary: 'County liquor-licensed establishment layer. Do not treat as a curated dining guide.' }),

  countyLayer({ id: 'schools', name: 'Schools', icon: '🏫', category: 'schools', color: '#F59E0B', endpoint: `${ARCGIS_BASE}/PublicSchools/EducationalFacilities/MapServer/0`, type: 'point' }),
  countyLayer({ id: 'school-districts-elem', name: 'Elementary Districts', icon: '📖', category: 'schools', color: '#FCD34D', endpoint: `${ARCGIS_BASE}/PublicSchools/SchoolDistricts/MapServer/0`, type: 'polygon' }),
  countyLayer({ id: 'school-districts-middle', name: 'Middle School Districts', icon: '📗', category: 'schools', color: '#FBBF24', endpoint: `${ARCGIS_BASE}/PublicSchools/SchoolDistricts/MapServer/1`, type: 'polygon' }),
  countyLayer({ id: 'school-districts-high', name: 'High School Districts', icon: '📘', category: 'schools', color: '#F59E0B', endpoint: `${ARCGIS_BASE}/PublicSchools/SchoolDistricts/MapServer/2`, type: 'polygon' }),

  countyLayer({ id: 'parks', name: 'County Parks', icon: '🌳', category: 'parks', color: '#22C55E', endpoint: `${ARCGIS_BASE}/ParksAndRecreation/Parks/MapServer/0`, type: 'point' }),
  hostedGovernmentLayer({ id: 'park-boundaries', name: 'Park Boundaries', icon: '🏞️', category: 'parks', color: '#16A34A', endpoint: `${AGOL}/County_Park_Boundaries/FeatureServer/0`, type: 'polygon' }),
  hostedGovernmentLayer({ id: 'trails', name: 'Trails', icon: '🥾', category: 'parks', color: '#15803D', endpoint: `${AGOL}/Trails/FeatureServer/0`, type: 'line' }),
  cityLayer({ id: 'city-bike-paths', name: 'City Bike Paths', icon: '🚴', category: 'parks', color: '#4ADE80', endpoint: `${CITY_BASE}/BikePaths/MapServer/0`, type: 'line' }),

  countyLayer({ id: 'watersheds', name: 'Watersheds', icon: '💧', category: 'environment', color: '#06B6D4', endpoint: `${ARCGIS_BASE}/Basemap/Hydrography/MapServer/9`, type: 'polygon' }),
  hostedGovernmentLayer({ id: 'streams', name: 'Streams & Rivers', icon: '🏞️', category: 'environment', color: '#0EA5E9', endpoint: `${AGOL}/Streams_Shapefile/FeatureServer/0`, type: 'line' }),
  countyLayer({ id: 'fema-floodplain', name: 'FEMA Floodplain', icon: '🌊', category: 'environment', color: '#0284C7', endpoint: `${ARCGIS_BASE}/PlanningAndPermitting/FEMAFloodplain/MapServer/0`, type: 'polygon', notes: 'Floodplain presence is not the same as flood risk clearance or insurance guidance.' }),
  countyLayer({ id: 'wetlands', name: 'Wetlands', icon: '🐸', category: 'environment', color: '#0D9488', endpoint: `${ARCGIS_BASE}/PlanningAndPermitting/Wetlands/MapServer/0`, type: 'polygon' }),
  countyLayer({ id: 'sinkholes', name: 'Sinkholes', icon: '⚠️', category: 'environment', color: '#DC2626', endpoint: `${ARCGIS_BASE}/DPW/Sinkholes/MapServer/0`, type: 'point' }),
  countyLayer({ id: 'steep-slopes', name: 'Steep Slopes', icon: '⛰️', category: 'environment', color: '#92400E', endpoint: `${ARCGIS_BASE}/PlanningAndPermitting/Steep_Slopes/MapServer/0`, type: 'polygon' }),
  countyLayer({ id: 'dams', name: 'Dams', icon: '🚧', category: 'environment', color: '#78716C', endpoint: `${ARCGIS_BASE}/DPW/Dams/MapServer/0`, type: 'point' }),
  countyLayer({ id: 'high-water', name: 'High Water Areas', icon: '💦', category: 'environment', color: '#38BDF8', endpoint: `${ARCGIS_BASE}/DPW/High_Water_Areas/MapServer/0`, type: 'point' }),
  countyLayer({ id: 'forest-resource', name: 'Forest Resources', icon: '🌲', category: 'environment', color: '#166534', endpoint: `${ARCGIS_BASE}/PlanningAndPermitting/ForestResource/MapServer/2`, type: 'polygon' }),

  countyLayer({ id: 'bridges', name: 'Bridges', icon: '🌉', category: 'transportation', color: '#F59E0B', endpoint: `${ARCGIS_BASE}/DPW/Bridges/MapServer/0`, type: 'point' }),
  stateLayer({ id: 'transit-stops', name: 'Transit Stops', icon: '🚏', category: 'transportation', color: '#14B8A6', endpoint: `${MD_TRANSIT}/16`, type: 'point' }),
  stateLayer({ id: 'transit-routes', name: 'Transit Routes', icon: '🚌', category: 'transportation', color: '#0D9488', endpoint: `${MD_TRANSIT}/17`, type: 'line' }),
  countyLayer({ id: 'traffic-signals', name: 'Traffic Signals', icon: '🚦', category: 'transportation', color: '#EAB308', endpoint: `${ARCGIS_BASE}/DPW/Traffic_Signals/MapServer/0`, type: 'point' }),
  countyLayer({ id: 'snow-routes', name: 'Snow Plow Routes', icon: '❄️', category: 'transportation', color: '#7DD3FC', endpoint: `${ARCGIS_BASE}/DPW/SnowRoutes/MapServer/0`, type: 'line' }),
  countyLayer({ id: 'bikeway-routes', name: 'SHA Bikeways', icon: '🚲', category: 'transportation', color: '#34D399', endpoint: `${ARCGIS_BASE}/DPW/SHA_Bikeway_Routes/MapServer/0`, type: 'line' }),
  countyLayer({ id: 'street-lighting', name: 'Street Lights', icon: '💡', category: 'transportation', color: '#FDE047', endpoint: `${ARCGIS_BASE}/DPW/Street_Lighting/MapServer/0`, type: 'point' }),
  hostedGovernmentLayer({ id: 'road-closures', name: 'Road Closures', icon: '🚧', category: 'transportation', color: '#EF4444', endpoint: `${AGOL}/RoadClosures_active_public/FeatureServer/0`, type: 'point', summary: 'Active closure reference points. Validate details before operational use.' }),
  countyLayer({ id: 'marc', name: 'MARC Rail', icon: '🚂', category: 'transportation', color: '#7C3AED', endpoint: `${ARCGIS_BASE}/DPW/MARC/MapServer/0`, type: 'point' }),

  countyLayer({ id: 'zoning', name: 'Zoning', icon: '🗺️', category: 'planning', color: '#A855F7', endpoint: `${ARCGIS_BASE}/PlanningAndPermitting/Zoning/MapServer/0`, type: 'polygon' }),
  countyLayer({ id: 'growth-boundaries', name: 'Growth Boundaries', icon: '📐', category: 'planning', color: '#C084FC', endpoint: `${ARCGIS_BASE}/PlanningAndPermitting/ComprehensivePlan/MapServer/2`, type: 'polygon' }),
  countyLayer({ id: 'land-use', name: 'Land Use', icon: '📊', category: 'planning', color: '#D946EF', endpoint: `${ARCGIS_BASE}/PlanningAndPermitting/LandUse/MapServer/0`, type: 'polygon' }),
  countyLayer({ id: 'dev-pipeline', name: 'Development Pipeline', icon: '🏗️', category: 'planning', color: '#F472B6', endpoint: `${ARCGIS_BASE}/PlanningAndPermitting/ResidentialDevelopmentPipeline/MapServer/0`, type: 'polygon', notes: 'Pipeline layers usually represent submitted or tracked development activity, not guaranteed construction.' }),
  countyLayer({ id: 'opportunity-zones', name: 'Opportunity Zones', icon: '💼', category: 'planning', color: '#FBBF24', endpoint: `${ARCGIS_BASE}/EconomicDevelopment/OpportunityZones/MapServer/0`, type: 'polygon' }),
  countyLayer({ id: 'ag-preservation', name: 'Ag Preservation', icon: '🌾', category: 'planning', color: '#84CC16', endpoint: `${ARCGIS_BASE}/PlanningAndPermitting/AgPreservation/MapServer/0`, type: 'polygon' }),

  countyLayer({ id: 'historic-sites', name: 'Historic Sites', icon: '🏰', category: 'historic', color: '#B45309', endpoint: `${ARCGIS_BASE}/PlanningAndPermitting/Historic_Sites/MapServer/0`, type: 'point' }),
  countyLayer({ id: 'historic-preservation', name: 'Historic Districts', icon: '🏛️', category: 'historic', color: '#D97706', endpoint: `${ARCGIS_BASE}/PlanningAndPermitting/Historic_Preservation/MapServer/0`, type: 'polygon' }),
  countyLayer({ id: 'cemeteries', name: 'Cemeteries', icon: '🪦', category: 'historic', color: '#78716C', endpoint: `${ARCGIS_BASE}/PlanningAndPermitting/Cemeteries/MapServer/0`, type: 'point' }),
  hostedGovernmentLayer({ id: 'historic-roads', name: 'Historic Roads', icon: '🛤️', category: 'historic', color: '#A16207', endpoint: `${AGOL}/Historic_Roads/FeatureServer/0`, type: 'line' }),

  countyLayer({ id: 'election-precincts', name: 'Election Precincts', icon: '🗳️', category: 'elections', color: '#7C3AED', endpoint: `${ARCGIS_BASE}/Elections/Elections/MapServer/2`, type: 'polygon', notes: 'Reference precinct geography only. Do not infer current polling changes without election-board verification.' }),
  countyLayer({ id: 'polling-places', name: 'Polling Places', icon: '📍', category: 'elections', color: '#8B5CF6', endpoint: `${ARCGIS_BASE}/Elections/Elections/MapServer/7`, type: 'point' }),

  countyLayer({ id: 'water-sewer', name: 'Water/Sewer Service', icon: '🚰', category: 'utilities', color: '#0891B2', endpoint: `${ARCGIS_BASE}/PlanningAndPermitting/WaterSewerServiceAreas/MapServer/0`, type: 'polygon' }),
  cityLayer({ id: 'city-sidewalks', name: 'Sidewalks (City)', icon: '🚶', category: 'utilities', color: '#94A3B8', endpoint: `${CITY_BASE}/Sidewalks/MapServer/0`, type: 'line' }),
  cityLayer({ id: 'city-fiber', name: 'Fiber Optic Lines', icon: '🔌', category: 'utilities', color: '#06B6D4', endpoint: `${CITY_BASE}/FiberLines/MapServer/0`, type: 'line' }),
  cityLayer({ id: 'lead-service-lines', name: 'Lead Service Lines', icon: '⚠️', category: 'utilities', color: '#DC2626', endpoint: `${CITY_BASE}/LeadServiceLines/MapServer/0`, type: 'line', summary: 'City lead service line inventory endpoint.', notes: 'This service returned a server error during the April 8, 2026 repo audit and should be monitored before release.' }),
  countyLayer({ id: 'recycling', name: 'Recycling Routes', icon: '♻️', category: 'utilities', color: '#22C55E', endpoint: `${ARCGIS_BASE}/SolidWasteAndRecycling/Recycle/MapServer/0`, type: 'polygon' }),
  countyLayer({ id: 'stormwater', name: 'Stormwater Facilities', icon: '🌧️', category: 'utilities', color: '#38BDF8', endpoint: `${ARCGIS_BASE}/EnergyAndEnvironment/SWMFacilityService/MapServer/0`, type: 'point' }),
  cityLayer({ id: 'ada-ramps', name: 'ADA Sidewalk Ramps', icon: '♿', category: 'utilities', color: '#2563EB', endpoint: `${CITY_BASE}/Sidewalks/MapServer/0`, type: 'point', notes: 'Uses the same source service as sidewalks and needs field-level validation before parcel-specific use.' }),
  cityLayer({ id: 'city-streetlights', name: 'City Street Lights', icon: '💡', category: 'utilities', color: '#FDE047', endpoint: `${CITY_BASE}/Electrical/MapServer/0`, type: 'point' }),
  cityLayer({ id: 'storm-drains', name: 'Storm Drain Inlets', icon: '🕳️', category: 'utilities', color: '#475569', endpoint: `${CITY_BASE}/CartegraphStorm/FeatureServer/2`, type: 'point' }),

  countyLayer({ id: 'trash-cans', name: 'Trash Cans', icon: '🗑️', category: 'everyday', color: '#78716C', endpoint: `${ARCGIS_BASE}/ParksAndRecreation/Assets/MapServer/6`, type: 'point', notes: 'Parks asset layers describe amenities, not countywide sanitation service coverage.' }),
  cityLayer({ id: 'drinking-fountains', name: 'Drinking Fountains', icon: '🚰', category: 'everyday', color: '#06B6D4', endpoint: `${CITY_BASE}/CartegraphWater/FeatureServer/4`, type: 'point' }),
  countyLayer({ id: 'benches', name: 'Park Benches', icon: '🪑', category: 'everyday', color: '#92400E', endpoint: `${ARCGIS_BASE}/ParksAndRecreation/Assets/MapServer/1`, type: 'point' }),
  countyLayer({ id: 'picnic-tables', name: 'Picnic Tables & Grills', icon: '🍖', category: 'everyday', color: '#B45309', endpoint: `${ARCGIS_BASE}/ParksAndRecreation/Assets/MapServer/6`, type: 'point' }),
  countyLayer({ id: 'playgrounds', name: 'Playground Equipment', icon: '🛝', category: 'everyday', color: '#F472B6', endpoint: `${ARCGIS_BASE}/ParksAndRecreation/Assets/MapServer/9`, type: 'point' }),
  countyLayer({ id: 'bike-racks', name: 'Bike Racks & Repair', icon: '🚲', category: 'everyday', color: '#10B981', endpoint: `${ARCGIS_BASE}/ParksAndRecreation/Assets/MapServer/6`, type: 'point' }),
  countyLayer({ id: 'portable-toilets', name: 'Portable Toilets', icon: '🚻', category: 'everyday', color: '#7C3AED', endpoint: `${ARCGIS_BASE}/ParksAndRecreation/Assets/MapServer/6`, type: 'point' }),
  countyLayer({ id: 'boat-ramps', name: 'Boat & Kayak Ramps', icon: '🛶', category: 'everyday', color: '#0EA5E9', endpoint: `${ARCGIS_BASE}/ParksAndRecreation/Assets/MapServer/6`, type: 'point' }),
  countyLayer({ id: 'park-lights', name: 'Park Lighting', icon: '🔦', category: 'everyday', color: '#FBBF24', endpoint: `${ARCGIS_BASE}/ParksAndRecreation/Assets/MapServer/5`, type: 'point' }),

  countyLayer({ id: 'ev-chargers', name: 'EV Charging Stations', icon: '⚡', category: 'infrastructure', color: '#22C55E', endpoint: `${ARCGIS_BASE}/DPW/FacilitiesAssets/MapServer/13`, type: 'point' }),
  countyLayer({ id: 'ped-buttons', name: 'Pedestrian Buttons', icon: '🔘', category: 'infrastructure', color: '#F59E0B', endpoint: `${ARCGIS_BASE}/DPW/Signals/MapServer/7`, type: 'point' }),
  countyLayer({ id: 'school-beacons', name: 'School Beacons', icon: '🏫', category: 'infrastructure', color: '#EF4444', endpoint: `${ARCGIS_BASE}/DPW/Traffic_Signals/MapServer/2`, type: 'point' }),
  countyLayer({ id: 'comm-towers', name: 'Cell/Communication Towers', icon: '📡', category: 'infrastructure', color: '#6366F1', endpoint: `${ARCGIS_BASE}/PublicSafety/Towers/MapServer/0`, type: 'point' }),
  countyLayer({ id: 'guardrails', name: 'Guardrails', icon: '🛡️', category: 'infrastructure', color: '#94A3B8', endpoint: `${ARCGIS_BASE}/DPW/Guardrail/MapServer/0`, type: 'line' }),
  cityLayer({ id: 'cultural-assets', name: 'Cultural Assets', icon: '🎭', category: 'infrastructure', color: '#EC4899', endpoint: `${CITY_BASE}/CulturalAssets/MapServer/0`, type: 'point' }),
];

export const layerCategories = [
  { id: 'safety', name: 'Public Safety', icon: '🛡️' },
  { id: 'facilities', name: 'Facilities & Services', icon: '🏛️' },
  { id: 'schools', name: 'Schools', icon: '🏫' },
  { id: 'parks', name: 'Parks & Trails', icon: '🌳' },
  { id: 'environment', name: 'Environment', icon: '🌿' },
  { id: 'transportation', name: 'Transportation', icon: '🚌' },
  { id: 'planning', name: 'Planning & Zoning', icon: '📐' },
  { id: 'historic', name: 'Historic & Cultural', icon: '🏰' },
  { id: 'elections', name: 'Elections', icon: '🗳️' },
  { id: 'utilities', name: 'Utilities & Infrastructure', icon: '🔌' },
  { id: 'everyday', name: 'Everyday Essentials', icon: '🗑️' },
  { id: 'infrastructure', name: 'Infrastructure Detail', icon: '⚡' },
] as const;
