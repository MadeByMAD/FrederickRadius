import type { AppState } from '../types';

export type WorkflowReadiness = 'ready-now' | 'reference-first' | 'research-only';

export interface CivicWorkflow {
  id: string;
  title: string;
  icon: string;
  description: string;
  sourceSummary: string;
  trustNote: string;
  readiness: WorkflowReadiness;
  layerIds: string[];
  recommendedPanel?: NonNullable<AppState['slidePanelContent']>;
}

export const civicWorkflows: CivicWorkflow[] = [
  {
    id: 'storm-flood',
    title: 'Storm & Flood Readiness',
    icon: '🌧️',
    description: 'Combine live gauges with flood geography and high-water references before or during heavy rain.',
    sourceSummary: 'USGS water + NWS weather + county GIS',
    trustNote: 'Current conditions come from USGS and NWS. Floodplain and flood-point layers are reference geography, not live closure confirmation.',
    readiness: 'ready-now',
    recommendedPanel: 'water',
    layerIds: ['flood-points', 'high-water', 'fema-floodplain', 'watersheds', 'streams'],
  },
  {
    id: 'mobility-access',
    title: 'Mobility & Access',
    icon: '🚌',
    description: 'See how traffic, transit, sidewalks, and closures intersect in Frederick-area movement patterns.',
    sourceSummary: 'CHART + state transit + county/city GIS',
    trustNote: 'Traffic is near-real-time from CHART. Transit, sidewalks, and closures are reference layers with uneven freshness across sources.',
    readiness: 'ready-now',
    recommendedPanel: 'traffic',
    layerIds: ['road-closures', 'transit-routes', 'transit-stops', 'city-sidewalks', 'traffic-signals', 'bridges'],
  },
  {
    id: 'civic-services',
    title: 'Civic Services & Facilities',
    icon: '🏛️',
    description: 'Start with the civic places residents actually use: libraries, government offices, shelters, and community facilities.',
    sourceSummary: 'County GIS + manual civic snapshot',
    trustNote: 'Facility locations are official reference geography. Meetings and representatives still rely on manual snapshots until a sync pipeline exists.',
    readiness: 'reference-first',
    recommendedPanel: 'civic',
    layerIds: ['gov-facilities', 'libraries', 'community-facilities', 'shelters', 'post-offices'],
  },
  {
    id: 'planning-growth',
    title: 'Planning & Growth Context',
    icon: '📐',
    description: 'Use zoning, land use, growth boundaries, utility service areas, and the development pipeline together.',
    sourceSummary: 'County planning and permitting GIS',
    trustNote: 'These layers support context and review. They are not legal advice, permit status confirmation, or guaranteed construction outcomes.',
    readiness: 'ready-now',
    recommendedPanel: 'dashboard',
    layerIds: ['zoning', 'land-use', 'growth-boundaries', 'dev-pipeline', 'water-sewer'],
  },
  {
    id: 'public-safety-reference',
    title: 'Public Safety Reference',
    icon: '🛡️',
    description: 'Use stations, ESZ boundaries, shelters, and flood points as reference infrastructure only.',
    sourceSummary: 'County public-safety GIS',
    trustNote: 'This is not dispatch activity, crime reporting, or 911 visibility. It is reference geography that should stay clearly separate from operational public-safety data.',
    readiness: 'reference-first',
    recommendedPanel: 'dashboard',
    layerIds: ['fire-stations', 'law-enforcement', 'police-districts', 'shelters', 'flood-points'],
  },
];
