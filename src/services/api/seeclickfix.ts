export interface ServiceRequest {
  id: number;
  status: string;
  summary: string;
  description: string;
  lat: number;
  lng: number;
  address: string;
  created_at: string;
  acknowledged_at: string | null;
  closed_at: string | null;
  request_type: { id: number; title: string };
  media?: { image_square_100x100: string };
  rating: number;
}

let cache: { data: ServiceRequest[]; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000;

export async function fetch311Issues(): Promise<ServiceRequest[]> {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) return cache.data;

  // TODO: Separate City of Frederick coverage from countywide civic claims in the UI. This
  // endpoint primarily reflects the `frederick` place feed, not a verified countywide 311 system.
  const res = await fetch(
    'https://seeclickfix.com/api/v2/issues?place_url=frederick&per_page=50&status=open,acknowledged'
  );
  if (!res.ok) throw new Error(`SeeClickFix error: ${res.status}`);
  const json = await res.json();

  const issues: ServiceRequest[] = (json.issues || []).map(
    (i: Record<string, unknown>) => ({
      id: i.id,
      status: i.status,
      summary: i.summary,
      description: i.description,
      lat: i.lat,
      lng: i.lng,
      address: i.address,
      created_at: i.created_at,
      acknowledged_at: i.acknowledged_at,
      closed_at: i.closed_at,
      request_type: i.request_type,
      media: i.media,
      rating: i.rating,
    })
  );

  cache = { data: issues, timestamp: Date.now() };
  return issues;
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'open': return '#EF4444';
    case 'acknowledged': return '#F59E0B';
    case 'closed': return '#10B981';
    default: return '#6B7280';
  }
}
