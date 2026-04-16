import type { Feature, Polygon, MultiPolygon, Point, FeatureCollection } from 'geojson';

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
}

export interface MunicipalityFeature extends Feature<Polygon | MultiPolygon> {
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
}

export interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  boundingbox: string[];
}

export interface Meeting {
  id: string;
  title: string;
  body: string;
  date: string;
  time: string;
  location: string;
  type: 'council' | 'planning' | 'appeals' | 'other';
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
}

export interface AppState {
  activeLayers: string[];
  sidebarOpen: boolean;
  searchQuery: string;
  layerOpacity: Record<string, number>;
  layerOrder: string[];
  layerPanelOpen: boolean;
}

export type GeoJSONCollection = FeatureCollection;
