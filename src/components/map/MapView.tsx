import { useEffect, useRef, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import { useAppState } from '../../hooks/useAppState';
import { municipalityBoundaries, municipalities } from '../../data/municipalities';
import { FREDERICK_COUNTY_CENTER, FREDERICK_COUNTY_ZOOM } from '../../data/municipalities';
import { fetchArcGISLayer, getFeatureLabel, getFeatureDetails } from '../../services/api/arcgis';
import { fetch311Issues } from '../../services/api/seeclickfix';
import { fetchTrafficIncidents } from '../../services/api/traffic';
import { fetchWaterLevels } from '../../services/api/water';
import { dataManifest } from '../../data/data-manifest';

// 3D-enabled dark style with terrain
const STYLE_3D: maplibregl.StyleSpecification = {
  version: 8,
  name: 'Frederick Radius Dark 3D',
  glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
  sources: {
    'carto-dark': {
      type: 'raster',
      tiles: ['https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'],
      tileSize: 256,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com">CARTO</a>',
      maxzoom: 19,
    },
    terrain: {
      type: 'raster-dem',
      tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
      tileSize: 256,
      maxzoom: 15,
      encoding: 'terrarium',
      attribution: '&copy; <a href="https://github.com/tilezen/joerd">Mapzen/Tilezen</a>',
    },
    hillshade: {
      type: 'raster-dem',
      tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
      tileSize: 256,
      maxzoom: 15,
      encoding: 'terrarium',
    },
  },
  terrain: {
    source: 'terrain',
    exaggeration: 1.5,
  },
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: { 'background-color': '#0A0A0A' },
    },
    {
      id: 'carto-dark',
      type: 'raster',
      source: 'carto-dark',
      minzoom: 0,
      maxzoom: 19,
      paint: { 'raster-opacity': 0.85 },
    },
    {
      id: 'hillshade',
      type: 'hillshade',
      source: 'hillshade',
      paint: {
        'hillshade-shadow-color': '#000000',
        'hillshade-highlight-color': '#1a1a2e',
        'hillshade-accent-color': '#3B82F6',
        'hillshade-exaggeration': 0.3,
        'hillshade-illumination-direction': 315,
      },
    },
  ],
};

export function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const loadedLayersRef = useRef<Set<string>>(new Set());
  const { state, layers, dispatch } = useAppState();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: STYLE_3D,
      center: FREDERICK_COUNTY_CENTER,
      zoom: FREDERICK_COUNTY_ZOOM,
      minZoom: 8,
      maxZoom: 18,
      pitch: 45,
      bearing: -10,
      maxPitch: 70,
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-right');
    map.addControl(new maplibregl.ScaleControl({ unit: 'imperial' }), 'bottom-left');
    map.addControl(new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
    }), 'bottom-right');

    map.on('load', () => {
      // ── Municipality Boundaries ──
      map.addSource('municipalities', {
        type: 'geojson',
        data: municipalityBoundaries,
      });

      // 3D extruded municipality fills
      map.addLayer({
        id: 'municipality-extrusion',
        type: 'fill-extrusion',
        source: 'municipalities',
        paint: {
          'fill-extrusion-color': '#3B82F6',
          'fill-extrusion-height': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            800,
            400,
          ],
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': 0.15,
        },
      });

      map.addLayer({
        id: 'municipality-borders',
        type: 'line',
        source: 'municipalities',
        paint: {
          'line-color': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            '#60A5FA',
            '#3B82F6',
          ],
          'line-width': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            3,
            1.5,
          ],
          'line-opacity': 0.8,
        },
      });

      map.addLayer({
        id: 'municipality-labels',
        type: 'symbol',
        source: 'municipalities',
        layout: {
          'text-field': ['get', 'name'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 9, 10, 12, 14],
          'text-font': ['Open Sans Regular'],
          'text-anchor': 'center',
          'text-allow-overlap': false,
          'text-padding': 10,
        },
        paint: {
          'text-color': '#F0ECE6',
          'text-halo-color': 'rgba(10, 10, 10, 0.9)',
          'text-halo-width': 2,
        },
      });

      // ── Hover & Click ──
      let hoveredId: number | null = null;

      map.on('mousemove', 'municipality-extrusion', (e) => {
        if (e.features && e.features.length > 0) {
          map.getCanvas().style.cursor = 'pointer';
          if (hoveredId !== null) {
            map.setFeatureState({ source: 'municipalities', id: hoveredId }, { hover: false });
          }
          hoveredId = e.features[0].id as number;
          map.setFeatureState({ source: 'municipalities', id: hoveredId }, { hover: true });
        }
      });

      map.on('mouseleave', 'municipality-extrusion', () => {
        map.getCanvas().style.cursor = '';
        if (hoveredId !== null) {
          map.setFeatureState({ source: 'municipalities', id: hoveredId }, { hover: false });
          hoveredId = null;
        }
      });

      map.on('click', 'municipality-extrusion', (e) => {
        if (e.features && e.features.length > 0) {
          const props = e.features[0].properties;
          if (props?.id) {
            dispatch({ type: 'SELECT_MUNICIPALITY', id: props.id as string });
          }
        }
      });

      // ── Load Live Data Overlays ──
      loadLiveOverlays(map);

      // ── Water Gauge Markers ──
      loadWaterGaugeMarkers(map);
    });

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sync GIS Layers ──
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    for (const layer of layers) {
      const sourceId = `gis-${layer.id}`;
      const layerId = `gis-layer-${layer.id}`;

      if (layer.visible && !loadedLayersRef.current.has(layer.id)) {
        loadedLayersRef.current.add(layer.id);

        fetchArcGISLayer(layer.endpoint)
          .then((geojson) => {
            if (!map.getSource(sourceId)) {
              map.addSource(sourceId, { type: 'geojson', data: geojson });

              if (layer.type === 'point') {
                map.addLayer({
                  id: layerId,
                  type: 'circle',
                  source: sourceId,
                  paint: {
                    'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 3, 14, 7],
                    'circle-color': layer.color,
                    'circle-stroke-color': '#0A0A0A',
                    'circle-stroke-width': 1.5,
                    'circle-opacity': 0.9,
                  },
                });
              } else if (layer.type === 'polygon') {
                map.addLayer({
                  id: layerId,
                  type: 'fill',
                  source: sourceId,
                  paint: { 'fill-color': layer.color, 'fill-opacity': 0.12 },
                });
                map.addLayer({
                  id: `${layerId}-outline`,
                  type: 'line',
                  source: sourceId,
                  paint: { 'line-color': layer.color, 'line-width': 1.5, 'line-opacity': 0.5 },
                });
              } else if (layer.type === 'line') {
                map.addLayer({
                  id: layerId,
                  type: 'line',
                  source: sourceId,
                  paint: { 'line-color': layer.color, 'line-width': 2.5, 'line-opacity': 0.8 },
                });
              }

              // Popups for point layers
              if (layer.type === 'point') {
                map.on('click', layerId, (e) => {
                  if (e.features && e.features.length > 0) {
                    const props = e.features[0].properties || {};
                    const label = getFeatureLabel(props as Record<string, unknown>);
                    const details = getFeatureDetails(props as Record<string, unknown>);
                    showPopup(map, e.lngLat, `
                      <div style="max-width:260px">
                        <div style="font-weight:600;font-size:14px;margin-bottom:4px">${layer.icon} ${label}</div>
                        <div style="font-size:11px;color:#9CA3AF;margin-bottom:6px">${layer.name}</div>
                        ${details.map((d) => `<div style="font-size:12px;margin-bottom:2px"><span style="color:#6B7280">${d.key}:</span> ${d.value}</div>`).join('')}
                      </div>
                    `);
                  }
                });
                map.on('mouseenter', layerId, () => { map.getCanvas().style.cursor = 'pointer'; });
                map.on('mouseleave', layerId, () => { map.getCanvas().style.cursor = ''; });
              }
            }
          })
          .catch((err) => {
            console.warn(`Failed to load layer ${layer.id}:`, err);
            loadedLayersRef.current.delete(layer.id);
          });
      } else if (!layer.visible && map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', 'none');
        if (map.getLayer(`${layerId}-outline`)) {
          map.setLayoutProperty(`${layerId}-outline`, 'visibility', 'none');
        }
      } else if (layer.visible && map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', 'visible');
        if (map.getLayer(`${layerId}-outline`)) {
          map.setLayoutProperty(`${layerId}-outline`, 'visibility', 'visible');
        }
      }
    }
  }, [layers]);

  // ── Fly to municipality ──
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !state.selectedMunicipality) return;
    const muni = municipalities.find((m) => m.id === state.selectedMunicipality);
    if (muni) {
      map.flyTo({
        center: muni.centroid,
        zoom: muni.area > 5 ? 12 : 13.5,
        pitch: 50,
        bearing: 0,
        duration: 1500,
      });
    }
  }, [state.selectedMunicipality]);

  // ── Expose flyTo ──
  const flyTo = useCallback((lng: number, lat: number, zoom = 14) => {
    mapRef.current?.flyTo({ center: [lng, lat], zoom, pitch: 50, duration: 1200 });
  }, []);

  useEffect(() => {
    (window as unknown as Record<string, unknown>).__mapFlyTo = flyTo;
    return () => { delete (window as unknown as Record<string, unknown>).__mapFlyTo; };
  }, [flyTo]);

  // ── Popup helper ──
  function showPopup(map: maplibregl.Map, lngLat: maplibregl.LngLatLike, html: string) {
    if (popupRef.current) popupRef.current.remove();
    popupRef.current = new maplibregl.Popup({ closeButton: true, maxWidth: '300px' })
      .setLngLat(lngLat)
      .setHTML(html)
      .addTo(map);
  }

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="h-full w-full" />

      {/* 3D Pitch Reset Button */}
      <button
        onClick={() => mapRef.current?.flyTo({ pitch: 0, bearing: 0, duration: 800 })}
        className="absolute top-3 right-3 z-10 rounded-lg bg-bg-elevated/90 border border-border px-2.5 py-1.5 text-xs text-text-secondary hover:text-text hover:bg-bg-hover transition-colors backdrop-blur-sm"
        title="Reset view to 2D"
      >
        2D
      </button>
      <button
        onClick={() => mapRef.current?.flyTo({ pitch: 55, bearing: -15, duration: 800 })}
        className="absolute top-3 right-14 z-10 rounded-lg bg-bg-elevated/90 border border-border px-2.5 py-1.5 text-xs text-text-secondary hover:text-text hover:bg-bg-hover transition-colors backdrop-blur-sm"
        title="Switch to 3D view"
      >
        3D
      </button>
    </div>
  );
}

// ── Live Data Overlays ──
function loadLiveOverlays(map: maplibregl.Map) {
  // 311 Service Requests as a GeoJSON layer
  fetch311Issues()
    .then((issues) => {
      const geojson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: issues
          .filter((i) => i.lat && i.lng)
          .map((i) => ({
            type: 'Feature' as const,
            geometry: { type: 'Point' as const, coordinates: [i.lng, i.lat] },
            properties: {
              summary: i.summary || 'Service Request',
              status: i.status,
              type: i.request_type?.title || 'General',
              address: i.address || '',
              date: new Date(i.created_at).toLocaleDateString(),
            },
          })),
      };

      map.addSource('live-311', { type: 'geojson', data: geojson });
      map.addLayer({
        id: 'live-311-circles',
        type: 'circle',
        source: 'live-311',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 3, 14, 8],
          'circle-color': [
            'match', ['get', 'status'],
            'open', '#EF4444',
            'acknowledged', '#F59E0B',
            'closed', '#10B981',
            '#6B7280',
          ],
          'circle-stroke-color': '#0A0A0A',
          'circle-stroke-width': 2,
          'circle-opacity': 0.85,
        },
      });
      // Pulsing effect for open issues
      map.addLayer({
        id: 'live-311-pulse',
        type: 'circle',
        source: 'live-311',
        filter: ['==', ['get', 'status'], 'open'],
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 6, 14, 14],
          'circle-color': '#EF4444',
          'circle-opacity': 0.2,
          'circle-stroke-width': 0,
        },
      });

      map.on('click', 'live-311-circles', (e) => {
        if (e.features?.[0]) {
          const p = e.features[0].properties!;
          const statusColor = p.status === 'open' ? '#EF4444' : p.status === 'acknowledged' ? '#F59E0B' : '#10B981';
          const html = `
            <div style="max-width:250px">
              <div style="font-weight:600;font-size:13px;margin-bottom:4px">📢 ${p.summary}</div>
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
                <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${statusColor}"></span>
                <span style="font-size:11px;color:#9CA3AF;text-transform:capitalize">${p.status}</span>
                <span style="font-size:11px;color:#6B7280">${p.type}</span>
              </div>
              ${p.address ? `<div style="font-size:11px;color:#9CA3AF">${p.address}</div>` : ''}
              <div style="font-size:10px;color:#6B7280;margin-top:4px">${p.date}</div>
            </div>
          `;
          if (e.lngLat) {
            const popup = new maplibregl.Popup({ closeButton: true, maxWidth: '280px' })
              .setLngLat(e.lngLat).setHTML(html).addTo(map);
            popup; // keep reference alive
          }
        }
      });
      map.on('mouseenter', 'live-311-circles', () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', 'live-311-circles', () => { map.getCanvas().style.cursor = ''; });
    })
    .catch(() => { /* silently fail */ });

  // Traffic Incidents
  fetchTrafficIncidents()
    .then((incidents) => {
      if (incidents.length === 0) return;
      const geojson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: incidents.map((inc) => ({
          type: 'Feature' as const,
          geometry: { type: 'Point' as const, coordinates: [inc.longitude, inc.latitude] },
          properties: {
            type: inc.type,
            description: inc.description,
            road: inc.road,
            location: inc.location,
          },
        })),
      };

      map.addSource('live-traffic', { type: 'geojson', data: geojson });
      map.addLayer({
        id: 'live-traffic-circles',
        type: 'circle',
        source: 'live-traffic',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 5, 14, 10],
          'circle-color': '#F97316',
          'circle-stroke-color': '#0A0A0A',
          'circle-stroke-width': 2,
          'circle-opacity': 0.9,
        },
      });
      map.addLayer({
        id: 'live-traffic-pulse',
        type: 'circle',
        source: 'live-traffic',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 10, 14, 18],
          'circle-color': '#F97316',
          'circle-opacity': 0.15,
        },
      });

      map.on('click', 'live-traffic-circles', (e) => {
        if (e.features?.[0]) {
          const p = e.features[0].properties!;
          const html = `
            <div style="max-width:250px">
              <div style="font-weight:600;font-size:13px;margin-bottom:4px">🚧 ${p.type}</div>
              ${p.description ? `<div style="font-size:12px;color:#F0ECE6;margin-bottom:4px">${p.description}</div>` : ''}
              ${p.road ? `<div style="font-size:11px;color:#9CA3AF">${p.road}</div>` : ''}
              ${p.location ? `<div style="font-size:11px;color:#6B7280">${p.location}</div>` : ''}
            </div>
          `;
          if (e.lngLat) new maplibregl.Popup({ closeButton: true }).setLngLat(e.lngLat).setHTML(html).addTo(map);
        }
      });
      map.on('mouseenter', 'live-traffic-circles', () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', 'live-traffic-circles', () => { map.getCanvas().style.cursor = ''; });
    })
    .catch(() => {});

  // Parking Garages
  const garageGeojson: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: dataManifest.parking.garages.map((g) => ({
      type: 'Feature' as const,
      geometry: { type: 'Point' as const, coordinates: [g.lng, g.lat] },
      properties: { name: g.name, address: g.address },
    })),
  };

  map.addSource('parking-garages', { type: 'geojson', data: garageGeojson });
  map.addLayer({
    id: 'parking-garages-layer',
    type: 'circle',
    source: 'parking-garages',
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 4, 15, 10],
      'circle-color': '#8B5CF6',
      'circle-stroke-color': '#0A0A0A',
      'circle-stroke-width': 2,
    },
  });

  map.on('click', 'parking-garages-layer', (e) => {
    if (e.features?.[0]) {
      const p = e.features[0].properties!;
      const html = `
        <div><div style="font-weight:600;font-size:13px">🅿️ ${p.name}</div>
        <div style="font-size:11px;color:#9CA3AF;margin-top:2px">${p.address}</div>
        <div style="font-size:10px;color:#6B7280;margin-top:4px">$1/hr | Weekday max $12</div></div>
      `;
      if (e.lngLat) new maplibregl.Popup({ closeButton: true }).setLngLat(e.lngLat).setHTML(html).addTo(map);
    }
  });
  map.on('mouseenter', 'parking-garages-layer', () => { map.getCanvas().style.cursor = 'pointer'; });
  map.on('mouseleave', 'parking-garages-layer', () => { map.getCanvas().style.cursor = ''; });
}

// ── Water Gauge Markers with pulsing animation ──
function loadWaterGaugeMarkers(map: maplibregl.Map) {
  fetchWaterLevels()
    .then((gauges) => {
      const geojson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: gauges
          .filter((g) => g.latitude && g.longitude)
          .map((g) => {
            const height = g.values.find((v) => v.parameterCode === '00065');
            const discharge = g.values.find((v) => v.parameterCode === '00060');
            return {
              type: 'Feature' as const,
              geometry: { type: 'Point' as const, coordinates: [g.longitude, g.latitude] },
              properties: {
                name: g.siteName,
                siteCode: g.siteCode,
                height: height ? height.value.toFixed(2) : 'N/A',
                discharge: discharge ? discharge.value.toFixed(0) : 'N/A',
                heightUnit: 'ft',
                dischargeUnit: 'cfs',
              },
            };
          }),
      };

      map.addSource('water-gauges', { type: 'geojson', data: geojson });

      // Outer pulse ring
      map.addLayer({
        id: 'water-gauges-pulse',
        type: 'circle',
        source: 'water-gauges',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 8, 14, 16],
          'circle-color': '#06B6D4',
          'circle-opacity': 0.2,
        },
      });

      // Main dot
      map.addLayer({
        id: 'water-gauges-dots',
        type: 'circle',
        source: 'water-gauges',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 4, 14, 8],
          'circle-color': '#06B6D4',
          'circle-stroke-color': '#0A0A0A',
          'circle-stroke-width': 2,
        },
      });

      map.on('click', 'water-gauges-dots', (e) => {
        if (e.features?.[0]) {
          const p = e.features[0].properties!;
          const html = `
            <div style="max-width:250px">
              <div style="font-weight:600;font-size:13px;margin-bottom:4px">💧 ${p.name}</div>
              <div style="font-size:11px;color:#9CA3AF;margin-bottom:6px">USGS ${p.siteCode}</div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
                <div style="background:#141414;padding:6px;border-radius:6px">
                  <div style="font-size:10px;color:#6B7280">Height</div>
                  <div style="font-size:16px;font-weight:600;color:#F0ECE6">${p.height} ${p.heightUnit}</div>
                </div>
                <div style="background:#141414;padding:6px;border-radius:6px">
                  <div style="font-size:10px;color:#6B7280">Discharge</div>
                  <div style="font-size:16px;font-weight:600;color:#F0ECE6">${p.discharge} ${p.dischargeUnit}</div>
                </div>
              </div>
            </div>
          `;
          if (e.lngLat) new maplibregl.Popup({ closeButton: true }).setLngLat(e.lngLat).setHTML(html).addTo(map);
        }
      });
      map.on('mouseenter', 'water-gauges-dots', () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', 'water-gauges-dots', () => { map.getCanvas().style.cursor = ''; });
    })
    .catch(() => {});
}
