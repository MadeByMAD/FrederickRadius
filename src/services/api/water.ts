import type { WaterGauge } from '../../types';

const BASE_URL = 'https://waterservices.usgs.gov/nwis/iv/';

// All 9 active USGS gauges in Frederick County
const GAUGE_SITES = [
  '01637500', // Catoctin Creek near Middletown
  '01638500', // Potomac River at Point of Rocks
  '01639000', // Monocacy River at Bridgeport
  '01642190', // Monocacy River at Monocacy Blvd
  '01642198', // Carroll Creek near Frederick
  '01642600', // Linganore Creek near Frederick
  '01643000', // Monocacy River at Jug Bridge
  '01643500', // Bennett Creek at Park Mills
  '01643580', // Monocacy River near Dickerson
];

let gaugeCache: { data: WaterGauge[]; timestamp: number } | null = null;
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

export async function fetchWaterLevels(): Promise<WaterGauge[]> {
  if (gaugeCache && Date.now() - gaugeCache.timestamp < CACHE_TTL) {
    return gaugeCache.data;
  }

  const params = new URLSearchParams({
    format: 'json',
    sites: GAUGE_SITES.join(','),
    parameterCd: '00065,00060', // gauge height + discharge
    siteStatus: 'active',
  });

  const res = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) throw new Error(`USGS Water API error: ${res.status}`);
  const json = await res.json();

  const timeSeries = json.value?.timeSeries || [];
  const gaugeMap = new Map<string, WaterGauge>();

  for (const series of timeSeries) {
    const siteCode = series.sourceInfo?.siteCode?.[0]?.value;
    const siteName = series.sourceInfo?.siteName || 'Unknown';
    const lat = parseFloat(series.sourceInfo?.geoLocation?.geogLocation?.latitude || '0');
    const lng = parseFloat(series.sourceInfo?.geoLocation?.geogLocation?.longitude || '0');
    const paramCode = series.variable?.variableCode?.[0]?.value || '';
    const paramName = series.variable?.variableName || '';
    const unit = series.variable?.unit?.unitCode || '';

    if (!gaugeMap.has(siteCode)) {
      gaugeMap.set(siteCode, {
        siteCode,
        siteName,
        latitude: lat,
        longitude: lng,
        values: [],
      });
    }

    const gauge = gaugeMap.get(siteCode)!;
    const values = series.values?.[0]?.value || [];

    for (const v of values.slice(-12)) { // Last 12 readings
      gauge.values.push({
        value: parseFloat(v.value),
        dateTime: v.dateTime,
        unit,
        parameterCode: paramCode,
        parameterName: paramName,
      });
    }
  }

  const gauges = Array.from(gaugeMap.values());
  gaugeCache = { data: gauges, timestamp: Date.now() };
  return gauges;
}
