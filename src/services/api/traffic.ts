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

let incidentCache: { data: TrafficIncident[]; timestamp: number } | null = null;
const CACHE_TTL = 3 * 60 * 1000;

// Frederick County bounding box for filtering
const FC_BOUNDS = { minLat: 39.1, maxLat: 39.75, minLng: -77.8, maxLng: -77.0 };

export async function fetchTrafficIncidents(): Promise<TrafficIncident[]> {
  if (incidentCache && Date.now() - incidentCache.timestamp < CACHE_TTL) {
    return incidentCache.data;
  }

  try {
    const res = await fetch('https://chart.maryland.gov/DataFeeds/GetIncidentXml');
    if (!res.ok) throw new Error(`CHART error: ${res.status}`);
    const text = await res.text();

    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml');
    const items = xml.querySelectorAll('Incident, item, Event');

    const incidents: TrafficIncident[] = [];
    items.forEach((item) => {
      const lat = parseFloat(getXmlText(item, 'Latitude, latitude, lat') || '0');
      const lng = parseFloat(getXmlText(item, 'Longitude, longitude, lon, lng') || '0');

      if (lat >= FC_BOUNDS.minLat && lat <= FC_BOUNDS.maxLat &&
          lng >= FC_BOUNDS.minLng && lng <= FC_BOUNDS.maxLng) {
        incidents.push({
          id: getXmlText(item, 'Id, id, EventId') || String(Math.random()),
          description: getXmlText(item, 'Description, description, Synopsis') || '',
          location: getXmlText(item, 'Location, location, LocationDescription') || '',
          latitude: lat,
          longitude: lng,
          type: getXmlText(item, 'Type, type, EventType') || 'Unknown',
          severity: getXmlText(item, 'Severity, severity') || '',
          startDate: getXmlText(item, 'StartDate, startDate, StartTime') || '',
          road: getXmlText(item, 'Road, road, Route') || '',
        });
      }
    });

    incidentCache = { data: incidents, timestamp: Date.now() };
    return incidents;
  } catch {
    return [];
  }
}

function getXmlText(parent: Element, selectors: string): string | null {
  for (const sel of selectors.split(',').map((s) => s.trim())) {
    const el = parent.querySelector(sel);
    if (el?.textContent) return el.textContent.trim();
  }
  return null;
}
