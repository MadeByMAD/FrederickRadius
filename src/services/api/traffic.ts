export interface TrafficIncident {
  id: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  type: string;
  severity: string;
  startDate: string;
  road: string;
}

export interface TrafficFeed {
  incidents: TrafficIncident[];
  warning: string | null;
  lastUpdated: number | null;
}

interface ChartTrafficEvent {
  closed?: boolean;
  county?: string;
  createTime?: number;
  description?: string;
  direction?: string;
  id?: string;
  incidentType?: string;
  lanesStatus?: string;
  lastCachedDataUpdateTime?: number;
  lat?: number;
  lon?: number;
  name?: string;
  opCenter?: string;
  startDateTime?: number;
  trafficAlert?: boolean;
}

interface ChartTrafficResponse {
  data?: ChartTrafficEvent[];
}

const CHART_JSON_URL = 'https://chartexp1.sha.maryland.gov/CHARTExportClientService/getEventMapDataJSON.do';
const PROXY_URL = import.meta.env.VITE_CHART_PROXY_URL?.trim();
const TRAFFIC_URL = PROXY_URL || (import.meta.env.DEV ? '/api/chart/incidents' : CHART_JSON_URL);

let incidentCache: { data: TrafficFeed; timestamp: number } | null = null;
const CACHE_TTL = 3 * 60 * 1000;

// Frederick County bounding box for filtering
const FC_BOUNDS = { minLat: 39.1, maxLat: 39.75, minLng: -77.8, maxLng: -77.0 };

export async function fetchTrafficIncidents(): Promise<TrafficFeed> {
  if (incidentCache && Date.now() - incidentCache.timestamp < CACHE_TTL) {
    return incidentCache.data;
  }

  try {
    const res = await fetch(TRAFFIC_URL);
    if (!res.ok) throw new Error(`CHART error: ${res.status}`);
    const json = (await res.json()) as ChartTrafficResponse;

    const incidents = (json.data || [])
      .filter((event) => isFrederickCountyEvent(event) && !event.closed)
      .map((event) => ({
        id: event.id || `${event.lat}-${event.lon}-${event.createTime || event.startDateTime || 'traffic'}`,
        description: event.description || event.name || '',
        location: [event.direction ? `${event.direction}bound` : null, event.opCenter || event.county || null]
          .filter(Boolean)
          .join(' · '),
        latitude: event.lat || 0,
        longitude: event.lon || 0,
        type: event.incidentType || event.name || 'Traffic Incident',
        severity: event.trafficAlert ? 'Traffic Alert' : event.lanesStatus || '',
        startDate: normalizeChartTimestamp(event.startDateTime || event.createTime),
        road: event.name || '',
      }))
      .sort((left, right) => {
        const leftTime = left.startDate ? new Date(left.startDate).getTime() : 0;
        const rightTime = right.startDate ? new Date(right.startDate).getTime() : 0;
        return rightTime - leftTime;
      });

    const lastUpdated = (json.data || []).reduce<number | null>(
      (latest, event) => {
        if (!event.lastCachedDataUpdateTime) return latest;
        return latest === null ? event.lastCachedDataUpdateTime : Math.max(latest, event.lastCachedDataUpdateTime);
      },
      null
    );

    const payload: TrafficFeed = { incidents, warning: null, lastUpdated };
    incidentCache = { data: payload, timestamp: Date.now() };
    return payload;
  } catch (error) {
    const payload: TrafficFeed = {
      incidents: [],
      warning: getTrafficWarning(error),
      lastUpdated: null,
    };
    incidentCache = { data: payload, timestamp: Date.now() };
    return payload;
  }
}

function isFrederickCountyEvent(event: ChartTrafficEvent) {
  const lat = event.lat || 0;
  const lng = event.lon || 0;

  return lat >= FC_BOUNDS.minLat
    && lat <= FC_BOUNDS.maxLat
    && lng >= FC_BOUNDS.minLng
    && lng <= FC_BOUNDS.maxLng;
}

function normalizeChartTimestamp(timestamp?: number) {
  if (!timestamp) return '';
  return new Date(timestamp).toISOString();
}

function getTrafficWarning(error: unknown) {
  const fallback = 'Live Maryland CHART traffic data is currently unavailable.';
  const details = error instanceof Error ? error.message : '';

  if (TRAFFIC_URL === CHART_JSON_URL) {
    return 'Live Maryland CHART traffic data needs a proxy in production. Set `VITE_CHART_PROXY_URL` to a same-origin endpoint or deploy a reverse proxy for the CHART JSON feed.';
  }

  return details ? `${fallback} ${details}` : fallback;
}
