import type { Feature, Polygon, MultiPolygon, Point, FeatureCollection } from 'geojson';

export type SourceAuthority =
  | 'official'
  | 'government-hosted'
  | 'community'
  | 'third-party'
  | 'manual'
  | 'derived';

export type DataCadence =
  | 'live'
  | 'near-real-time'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'annual'
  | 'manual'
  | 'static'
  | 'unknown';

export type DataClassification =
  | 'operational'
  | 'reference'
  | 'community-report'
  | 'derived'
  | 'manual-snapshot';

export type ConfidenceLabel =
  | 'official'
  | 'reference'
  | 'approximate'
  | 'experimental'
  | 'unavailable';

export interface DataSourceMetadata {
  id: string;
  name: string;
  owner: string;
  sourceUrl: string;
  authority: SourceAuthority;
  official: boolean;
  classification: DataClassification;
  cadence: DataCadence;
  coverageArea: string;
  lastVerified?: string;
  notes?: string;
  riskNotes?: string;
}

export interface DataFact<T> {
  value: T | null;
  confidence: ConfidenceLabel;
  sourceId?: string;
  note?: string;
}

export interface Municipality {
  id: string;
  name: string;
  fips: string;
  population: number;
  medianIncome: number;
  medianAge: number;
  area: number; // sq miles
  centroid: [number, number]; // [lng, lat]
  description: string;
  website?: string;
  officials?: Official[];
  sourceId?: string;
  dataNote?: string;
  verifiedDate?: string;
}

export interface MunicipalityFeature extends Feature<Polygon | MultiPolygon | Point> {
  properties: Municipality;
}

export interface Official {
  name: string;
  title: string;
  email?: string;
  phone?: string;
}

export interface WeatherForecast {
  name: string;
  temperature: number;
  temperatureUnit: string;
  windSpeed: string;
  windDirection: string;
  shortForecast: string;
  detailedForecast: string;
  icon: string;
  isDaytime: boolean;
}

export interface WeatherAlert {
  id: string;
  event: string;
  headline: string;
  severity: string;
  description: string;
  expires: string;
}

export interface WaterGauge {
  siteCode: string;
  siteName: string;
  latitude: number;
  longitude: number;
  values: WaterReading[];
}

export interface WaterReading {
  value: number;
  dateTime: string;
  unit: string;
  parameterCode: string;
  parameterName: string;
}

export interface GISFeature extends Feature<Point | Polygon | MultiPolygon> {
  properties: Record<string, unknown>;
}

export interface MapLayer {
  id: string;
  name: string;
  icon: string;
  category: 'safety' | 'facilities' | 'schools' | 'parks' | 'environment' | 'transportation' | 'planning' | 'historic' | 'elections' | 'utilities' | 'everyday' | 'infrastructure';
  visible: boolean;
  color: string;
  endpoint: string;
  type: 'point' | 'polygon' | 'line';
  sourceId: string;
  classification: DataClassification;
  confidence: Exclude<ConfidenceLabel, 'unavailable'>;
  cadence: DataCadence;
  coverageArea: string;
  summary: string;
  notes?: string;
}

export interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  boundingbox: string[];
}

export interface RewardsState {
  points: number;
  municipalitiesVisited: string[];
  badges: Badge[];
  actions: RewardAction[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
}

export interface RewardAction {
  type: string;
  points: number;
  timestamp: string;
  description: string;
}

export interface Meeting {
  id: string;
  title: string;
  body: string;
  date: string;
  time: string;
  location: string;
  type: 'council' | 'planning' | 'appeals' | 'other';
  status?: 'manual-snapshot' | 'official-link';
  sourceUrl?: string;
  verifiedDate?: string;
}

export interface Representative {
  name: string;
  title: string;
  level: 'county' | 'state' | 'federal';
  district?: string;
  party?: string;
  phone?: string;
  email?: string;
  website?: string;
  sourceUrl?: string;
  verifiedDate?: string;
}

export interface AppState {
  selectedMunicipality: string | null;
  activeLayers: string[];
  sidebarOpen: boolean;
  slidePanelOpen: boolean;
  slidePanelContent: 'municipality' | 'search' | 'civic' | 'rewards' | 'weather' | 'water' | 'traffic' | 'reports' | 'parking' | 'compare' | 'address-intel' | 'dashboard' | null;
  addressIntel?: { lat: number; lng: number; address: string };
  searchQuery: string;
  layerOpacity: Record<string, number>;
  layerOrder: string[];
  activeWorkflowId: string | null;
  workflowSummary: string | null;
  discoverSummary: string | null;
  layerPanelOpen: boolean;
}

export type GeoJSONCollection = FeatureCollection;
