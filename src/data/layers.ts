import type { MapLayer } from '../types';

const ARCGIS_BASE = 'https://fcgis.frederickcountymd.gov/server_pub/rest/services';
const CITY_BASE = 'https://spires.cityoffrederick.com/arcgis/rest/services';
const MD_TRANSIT = 'https://mdgeodata.md.gov/imap/rest/services/Transportation/MD_LocalTransit/FeatureServer';
const AGOL = 'https://services5.arcgis.com/o8KSxSzYaulbGcFX/arcgis/rest/services';

export const mapLayers: MapLayer[] = [
  // ── PUBLIC SAFETY ──────────────────────────────
  { id: 'fire-stations', name: 'Fire Stations', icon: '🚒', category: 'safety', visible: false, color: '#EF4444', endpoint: `${ARCGIS_BASE}/PublicSafety/FireAreas/MapServer/0`, type: 'point' },
  { id: 'fire-hydrants', name: 'Fire Hydrants', icon: '🧯', category: 'safety', visible: false, color: '#DC2626', endpoint: `${ARCGIS_BASE}/PublicSafety/FireHydrants/MapServer/0`, type: 'point' },
  { id: 'police-districts', name: 'Police Districts', icon: '🚔', category: 'safety', visible: false, color: '#3B82F6', endpoint: `${ARCGIS_BASE}/PublicSafety/ESZ/MapServer/6`, type: 'polygon' },
  { id: 'law-enforcement', name: 'Police Stations', icon: '👮', category: 'safety', visible: false, color: '#1D4ED8', endpoint: `${ARCGIS_BASE}/PublicSafety/Law_Enforcement/MapServer/0`, type: 'point' },
  { id: 'shelters', name: 'Emergency Shelters', icon: '🏠', category: 'safety', visible: false, color: '#F97316', endpoint: `${ARCGIS_BASE}/PublicSafety/Shelters/MapServer/0`, type: 'point' },
  { id: 'towers', name: 'Communication Towers', icon: '📡', category: 'safety', visible: false, color: '#6366F1', endpoint: `${ARCGIS_BASE}/PublicSafety/Towers/MapServer/0`, type: 'point' },
  { id: 'flood-points', name: 'Roadway Flood Points', icon: '🌊', category: 'safety', visible: false, color: '#0EA5E9', endpoint: `${ARCGIS_BASE}/PublicSafety/RoadwayFloodPoints/MapServer/0`, type: 'point' },

  // ── FACILITIES & SERVICES ──────────────────────
  { id: 'libraries', name: 'Libraries', icon: '📚', category: 'facilities', visible: false, color: '#8B5CF6', endpoint: `${ARCGIS_BASE}/Basemap/PointsOfInterest/MapServer/1`, type: 'point' },
  { id: 'gov-facilities', name: 'Government Buildings', icon: '🏛️', category: 'facilities', visible: false, color: '#6366F1', endpoint: `${ARCGIS_BASE}/Basemap/PointsOfInterest/MapServer/2`, type: 'point' },
  { id: 'post-offices', name: 'Post Offices', icon: '📮', category: 'facilities', visible: false, color: '#2563EB', endpoint: `${ARCGIS_BASE}/Basemap/PointsOfInterest/MapServer/5`, type: 'point' },
  { id: 'community-facilities', name: 'Community Facilities', icon: '🏢', category: 'facilities', visible: false, color: '#10B981', endpoint: `${ARCGIS_BASE}/PlanningAndPermitting/ComprehensivePlan/MapServer/5`, type: 'point' },
  { id: 'hospitals', name: 'Hospitals & Medical', icon: '🏥', category: 'facilities', visible: false, color: '#EC4899', endpoint: `${AGOL}/MedicalFacilities_public/FeatureServer/0`, type: 'point' },
  { id: 'nursing-homes', name: 'Nursing Homes', icon: '🏡', category: 'facilities', visible: false, color: '#F472B6', endpoint: `${ARCGIS_BASE}/PublicSafety/NursingHomes/MapServer/0`, type: 'point' },
  { id: 'senior-housing', name: 'Senior Housing', icon: '👴', category: 'facilities', visible: false, color: '#A78BFA', endpoint: `${ARCGIS_BASE}/PlanningAndPermitting/Senior_Housing_Resources/MapServer/0`, type: 'point' },
  { id: 'food-distribution', name: 'Food Distribution Sites', icon: '🍲', category: 'facilities', visible: false, color: '#22C55E', endpoint: `${AGOL}/Food_Distribution_Sites/FeatureServer/0`, type: 'point' },
  { id: 'farmers-markets', name: 'Farmers Markets', icon: '🥬', category: 'facilities', visible: false, color: '#16A34A', endpoint: `${ARCGIS_BASE}/Basemap/PointsOfInterest/MapServer/0`, type: 'point' },
  { id: 'hotels', name: 'Hotels', icon: '🏨', category: 'facilities', visible: false, color: '#7C3AED', endpoint: `${ARCGIS_BASE}/Basemap/PointsOfInterest/MapServer/3`, type: 'point' },
  { id: 'worship', name: 'Places of Worship', icon: '⛪', category: 'facilities', visible: false, color: '#C084FC', endpoint: `${ARCGIS_BASE}/Basemap/PointsOfInterest/MapServer/4`, type: 'point' },
  { id: 'shopping', name: 'Shopping Centers', icon: '🛒', category: 'facilities', visible: false, color: '#E879F9', endpoint: `${ARCGIS_BASE}/Basemap/PointsOfInterest/MapServer/6`, type: 'point' },
  { id: 'liquor', name: 'Bars & Restaurants (Liquor)', icon: '🍺', category: 'facilities', visible: false, color: '#FBBF24', endpoint: `${ARCGIS_BASE}/PlanningAndPermitting/LiquorEstablishments/MapServer/0`, type: 'point' },

  // ── SCHOOLS ────────────────────────────────────
  { id: 'schools', name: 'Schools', icon: '🏫', category: 'schools', visible: false, color: '#F59E0B', endpoint: `${ARCGIS_BASE}/PublicSchools/EducationalFacilities/MapServer/0`, type: 'point' },
  { id: 'school-districts-elem', name: 'Elementary Districts', icon: '📖', category: 'schools', visible: false, color: '#FCD34D', endpoint: `${ARCGIS_BASE}/PublicSchools/SchoolDistricts/MapServer/0`, type: 'polygon' },
  { id: 'school-districts-middle', name: 'Middle School Districts', icon: '📗', category: 'schools', visible: false, color: '#FBBF24', endpoint: `${ARCGIS_BASE}/PublicSchools/SchoolDistricts/MapServer/1`, type: 'polygon' },
  { id: 'school-districts-high', name: 'High School Districts', icon: '📘', category: 'schools', visible: false, color: '#F59E0B', endpoint: `${ARCGIS_BASE}/PublicSchools/SchoolDistricts/MapServer/2`, type: 'polygon' },

  // ── PARKS & RECREATION ─────────────────────────
  { id: 'parks', name: 'County Parks', icon: '🌳', category: 'parks', visible: false, color: '#22C55E', endpoint: `${ARCGIS_BASE}/ParksAndRecreation/Parks/MapServer/0`, type: 'point' },
  { id: 'park-boundaries', name: 'Park Boundaries', icon: '🏞️', category: 'parks', visible: false, color: '#16A34A', endpoint: `${AGOL}/County_Park_Boundaries/FeatureServer/0`, type: 'polygon' },
  { id: 'trails', name: 'Trails', icon: '🥾', category: 'parks', visible: false, color: '#15803D', endpoint: `${AGOL}/Trails/FeatureServer/0`, type: 'line' },
  { id: 'city-bike-paths', name: 'City Bike Paths', icon: '🚴', category: 'parks', visible: false, color: '#4ADE80', endpoint: `${CITY_BASE}/BikePaths/MapServer/0`, type: 'line' },

  // ── ENVIRONMENT ────────────────────────────────
  { id: 'watersheds', name: 'Watersheds', icon: '💧', category: 'environment', visible: false, color: '#06B6D4', endpoint: `${ARCGIS_BASE}/Basemap/Hydrography/MapServer/9`, type: 'polygon' },
  { id: 'streams', name: 'Streams & Rivers', icon: '🏞️', category: 'environment', visible: false, color: '#0EA5E9', endpoint: `${AGOL}/Streams_Shapefile/FeatureServer/0`, type: 'line' },
  { id: 'fema-floodplain', name: 'FEMA Floodplain', icon: '🌊', category: 'environment', visible: false, color: '#0284C7', endpoint: `${ARCGIS_BASE}/PlanningAndPermitting/FEMAFloodplain/MapServer/0`, type: 'polygon' },
  { id: 'wetlands', name: 'Wetlands', icon: '🐸', category: 'environment', visible: false, color: '#0D9488', endpoint: `${ARCGIS_BASE}/PlanningAndPermitting/Wetlands/MapServer/0`, type: 'polygon' },
  { id: 'sinkholes', name: 'Sinkholes', icon: '⚠️', category: 'environment', visible: false, color: '#DC2626', endpoint: `${ARCGIS_BASE}/DPW/Sinkholes/MapServer/0`, type: 'point' },
  { id: 'steep-slopes', name: 'Steep Slopes', icon: '⛰️', category: 'environment', visible: false, color: '#92400E', endpoint: `${ARCGIS_BASE}/PlanningAndPermitting/Steep_Slopes/MapServer/0`, type: 'polygon' },
  { id: 'dams', name: 'Dams', icon: '🚧', category: 'environment', visible: false, color: '#78716C', endpoint: `${ARCGIS_BASE}/DPW/Dams/MapServer/0`, type: 'point' },
  { id: 'high-water', name: 'High Water Areas', icon: '💦', category: 'environment', visible: false, color: '#38BDF8', endpoint: `${ARCGIS_BASE}/DPW/High_Water_Areas/MapServer/0`, type: 'point' },
  { id: 'forest-resource', name: 'Forest Resources', icon: '🌲', category: 'environment', visible: false, color: '#166534', endpoint: `${ARCGIS_BASE}/PlanningAndPermitting/ForestResource/MapServer/2`, type: 'polygon' },

  // ── TRANSPORTATION ─────────────────────────────
  { id: 'bridges', name: 'Bridges', icon: '🌉', category: 'transportation', visible: false, color: '#F59E0B', endpoint: `${ARCGIS_BASE}/DPW/Bridges/MapServer/0`, type: 'point' },
  { id: 'transit-stops', name: 'Transit Stops', icon: '🚏', category: 'transportation', visible: false, color: '#14B8A6', endpoint: `${MD_TRANSIT}/16`, type: 'point' },
  { id: 'transit-routes', name: 'Transit Routes', icon: '🚌', category: 'transportation', visible: false, color: '#0D9488', endpoint: `${MD_TRANSIT}/17`, type: 'line' },
  { id: 'traffic-signals', name: 'Traffic Signals', icon: '🚦', category: 'transportation', visible: false, color: '#EAB308', endpoint: `${ARCGIS_BASE}/DPW/Traffic_Signals/MapServer/0`, type: 'point' },
  { id: 'snow-routes', name: 'Snow Plow Routes', icon: '❄️', category: 'transportation', visible: false, color: '#7DD3FC', endpoint: `${ARCGIS_BASE}/DPW/SnowRoutes/MapServer/0`, type: 'line' },
  { id: 'bikeway-routes', name: 'SHA Bikeways', icon: '🚲', category: 'transportation', visible: false, color: '#34D399', endpoint: `${ARCGIS_BASE}/DPW/SHA_Bikeway_Routes/MapServer/0`, type: 'line' },
  { id: 'street-lighting', name: 'Street Lights', icon: '💡', category: 'transportation', visible: false, color: '#FDE047', endpoint: `${ARCGIS_BASE}/DPW/Street_Lighting/MapServer/0`, type: 'point' },
  { id: 'road-closures', name: 'Road Closures', icon: '🚧', category: 'transportation', visible: false, color: '#EF4444', endpoint: `${AGOL}/RoadClosures_active_public/FeatureServer/0`, type: 'point' },
  { id: 'marc', name: 'MARC Rail', icon: '🚂', category: 'transportation', visible: false, color: '#7C3AED', endpoint: `${ARCGIS_BASE}/DPW/MARC/MapServer/0`, type: 'point' },

  // ── PLANNING & ZONING ──────────────────────────
  { id: 'zoning', name: 'Zoning', icon: '🗺️', category: 'planning', visible: false, color: '#A855F7', endpoint: `${ARCGIS_BASE}/PlanningAndPermitting/Zoning/MapServer/0`, type: 'polygon' },
  { id: 'growth-boundaries', name: 'Growth Boundaries', icon: '📐', category: 'planning', visible: false, color: '#C084FC', endpoint: `${ARCGIS_BASE}/PlanningAndPermitting/ComprehensivePlan/MapServer/2`, type: 'polygon' },
  { id: 'land-use', name: 'Land Use', icon: '📊', category: 'planning', visible: false, color: '#D946EF', endpoint: `${ARCGIS_BASE}/PlanningAndPermitting/LandUse/MapServer/0`, type: 'polygon' },
  { id: 'dev-pipeline', name: 'Development Pipeline', icon: '🏗️', category: 'planning', visible: false, color: '#F472B6', endpoint: `${ARCGIS_BASE}/PlanningAndPermitting/ResidentialDevelopmentPipeline/MapServer/0`, type: 'polygon' },
  { id: 'opportunity-zones', name: 'Opportunity Zones', icon: '💼', category: 'planning', visible: false, color: '#FBBF24', endpoint: `${ARCGIS_BASE}/EconomicDevelopment/OpportunityZones/MapServer/0`, type: 'polygon' },
  { id: 'ag-preservation', name: 'Ag Preservation', icon: '🌾', category: 'planning', visible: false, color: '#84CC16', endpoint: `${ARCGIS_BASE}/PlanningAndPermitting/AgPreservation/MapServer/0`, type: 'polygon' },

  // ── HISTORIC & CULTURAL ────────────────────────
  { id: 'historic-sites', name: 'Historic Sites', icon: '🏰', category: 'historic', visible: false, color: '#B45309', endpoint: `${ARCGIS_BASE}/PlanningAndPermitting/Historic_Sites/MapServer/0`, type: 'point' },
  { id: 'historic-preservation', name: 'Historic Districts', icon: '🏛️', category: 'historic', visible: false, color: '#D97706', endpoint: `${ARCGIS_BASE}/PlanningAndPermitting/Historic_Preservation/MapServer/0`, type: 'polygon' },
  { id: 'cemeteries', name: 'Cemeteries', icon: '🪦', category: 'historic', visible: false, color: '#78716C', endpoint: `${ARCGIS_BASE}/PlanningAndPermitting/Cemeteries/MapServer/0`, type: 'point' },
  { id: 'historic-roads', name: 'Historic Roads', icon: '🛤️', category: 'historic', visible: false, color: '#A16207', endpoint: `${AGOL}/Historic_Roads/FeatureServer/0`, type: 'line' },

  // ── ELECTIONS ───────────────────────────────────
  { id: 'election-precincts', name: 'Election Precincts', icon: '🗳️', category: 'elections', visible: false, color: '#7C3AED', endpoint: `${ARCGIS_BASE}/Elections/Elections/MapServer/2`, type: 'polygon' },
  { id: 'polling-places', name: 'Polling Places', icon: '📍', category: 'elections', visible: false, color: '#8B5CF6', endpoint: `${ARCGIS_BASE}/Elections/Elections/MapServer/7`, type: 'point' },

  // ── UTILITIES & INFRASTRUCTURE ─────────────────
  { id: 'water-sewer', name: 'Water/Sewer Service', icon: '🚰', category: 'utilities', visible: false, color: '#0891B2', endpoint: `${ARCGIS_BASE}/PlanningAndPermitting/WaterSewerServiceAreas/MapServer/0`, type: 'polygon' },
  { id: 'city-sidewalks', name: 'Sidewalks (City)', icon: '🚶', category: 'utilities', visible: false, color: '#94A3B8', endpoint: `${CITY_BASE}/Sidewalks/MapServer/0`, type: 'line' },
  { id: 'city-fiber', name: 'Fiber Optic Lines', icon: '🔌', category: 'utilities', visible: false, color: '#06B6D4', endpoint: `${CITY_BASE}/FiberLines/MapServer/0`, type: 'line' },
  { id: 'lead-service-lines', name: 'Lead Service Lines', icon: '⚠️', category: 'utilities', visible: false, color: '#DC2626', endpoint: `${CITY_BASE}/LeadServiceLines/MapServer/0`, type: 'line' },
  { id: 'recycling', name: 'Recycling Routes', icon: '♻️', category: 'utilities', visible: false, color: '#22C55E', endpoint: `${ARCGIS_BASE}/SolidWasteAndRecycling/Recycle/MapServer/0`, type: 'polygon' },
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
] as const;
