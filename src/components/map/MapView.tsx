import { useState, useCallback, useEffect } from 'react';
import Map, {
  Source,
  Layer,
  Popup,
  NavigationControl,
  ScaleControl,
  GeolocateControl,
} from 'react-map-gl/mapbox';
import { useNavigate } from 'react-router-dom';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useTheme } from '../../hooks/useTheme';
import { useMunicipalityBoundaries } from '../../hooks/useMunicipalityBoundaries';
import { useGISLayer } from '../../hooks/useGISLayer';
import { useAppRoute, routes } from '../../hooks/useAppRoute';
import { municipalities } from '../../data/municipalities';
import { FREDERICK_COUNTY_CENTER, FREDERICK_COUNTY_ZOOM } from '../../data/municipalities';
import { GISLayerRenderer } from './GISLayerRenderer';
import { Live311Overlay } from './overlays/Live311Overlay';
import { TrafficOverlay } from './overlays/TrafficOverlay';
import { WaterGaugeOverlay } from './overlays/WaterGaugeOverlay';
import { ParkingOverlay } from './overlays/ParkingOverlay';
import { MapPlaceCard } from './MapPlaceCard';
import { RadiusExplorer } from '../shared/RadiusExplorer';
import { motion } from 'framer-motion';
import type { MapMouseEvent } from 'react-map-gl/mapbox';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

// Frederick County GIS endpoints for permanent cartographic overlays.
const ENDPOINTS = {
  parks: 'https://services5.arcgis.com/o8KSxSzYaulbGcFX/arcgis/rest/services/County_Park_Boundaries/FeatureServer/0',
  streams: 'https://services5.arcgis.com/o8KSxSzYaulbGcFX/arcgis/rest/services/Streams_Shapefile/FeatureServer/0',
} as const;

const INITIAL_VIEW = {
  longitude: FREDERICK_COUNTY_CENTER[0],
  latitude: FREDERICK_COUNTY_CENTER[1],
  zoom: FREDERICK_COUNTY_ZOOM,
  pitch: 45,
  bearing: -10,
};

interface PopupInfo {
  lng: number;
  lat: number;
  html: string;
}

interface MapViewProps {
  radiusCenter?: [number, number] | null;
  onCloseRadius?: () => void;
}

export function MapView({ radiusCenter, onCloseRadius }: MapViewProps = {}) {
  const { resolved: theme } = useTheme();
  const { data: muniData } = useMunicipalityBoundaries();
  const { data: parkData } = useGISLayer(ENDPOINTS.parks, true);
  const { data: streamData } = useGISLayer(ENDPOINTS.streams, true);
  const route = useAppRoute();
  const navigate = useNavigate();
  const [popup, setPopup] = useState<PopupInfo | null>(null);
  const [placeCard, setPlaceCard] = useState<{ slug: string; lng: number; lat: number } | null>(null);
  const [is3D, setIs3D] = useState(true);
  const [viewState, setViewState] = useState(INITIAL_VIEW);
  const [hoveredMuni, setHoveredMuni] = useState<string | null>(null);

  const isDark = theme === 'dark';
  const mapStyle = isDark ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11';

  // Brand cartography tokens. Paint arrays cannot read CSS vars, so we
  // switch to literal hex per theme — same values as the CSS theme tokens.
  const inkColor = isDark ? '#F2EDE3' : '#1A1613';
  const inkHalo = isDark ? 'rgba(15, 13, 11, 0.9)' : 'rgba(250, 248, 244, 0.95)';
  const accent = isDark ? '#D4344A' : '#8B1F2F';
  const buildingColor = isDark ? '#1F1914' : '#E6DFD1';
  const buildingTop = isDark ? '#332A22' : '#CFC5B0';
  const parkFill = isDark ? '#1F3525' : '#C8DCC1';
  const parkStroke = isDark ? '#2F5238' : '#6F9C7A';
  const streamColor = isDark ? '#3B8FB0' : '#5AA3C2';

  const selectedSlug = route.municipalitySlug;
  const activeSlug = placeCard?.slug ?? selectedSlug ?? hoveredMuni;

  // Boundary click: show a place card at the cursor. Navigating to the
  // full profile now happens from a CTA on the card, not on every click.
  const onMuniClick = useCallback((e: MapMouseEvent) => {
    const feature = e.features?.[0];
    const id = feature?.properties?.id as string | undefined;
    if (!id) return;
    setPlaceCard({ slug: id, lng: e.lngLat.lng, lat: e.lngLat.lat });
  }, []);

  const onMapMouseMove = useCallback((e: MapMouseEvent) => {
    const feature = e.features?.[0];
    setHoveredMuni((feature?.properties?.id as string | undefined) ?? null);
  }, []);

  // Right-click for Address Intelligence
  const onContextMenu = useCallback(
    (e: MapMouseEvent) => {
      const q = `${e.lngLat.lat.toFixed(5)}, ${e.lngLat.lng.toFixed(5)} (Frederick County)`;
      navigate(routes.address(e.lngLat.lng, e.lngLat.lat, q));
    },
    [navigate]
  );

  // Fly the camera to the selected municipality whenever the URL changes.
  useEffect(() => {
    if (!route.municipalitySlug) return;
    const muni = municipalities.find((m) => m.id === route.municipalitySlug);
    if (!muni) return;
    setViewState((v) => ({
      ...v,
      longitude: muni.centroid[0],
      latitude: muni.centroid[1],
      zoom: muni.area > 5 ? 12 : 13.5,
      pitch: 50,
    }));
    setPlaceCard(null);
  }, [route.municipalitySlug]);

  return (
    <div className="relative h-full w-full">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle={mapStyle}
        style={{ width: '100%', height: '100%' }}
        minZoom={8}
        maxZoom={18}
        maxPitch={70}
        terrain={{ source: 'mapbox-dem', exaggeration: 1.35 }}
        fog={{
          color: isDark ? 'rgb(15, 13, 11)' : 'rgb(250, 248, 244)',
          'high-color': isDark ? 'rgb(40, 30, 22)' : 'rgb(230, 220, 200)',
          'horizon-blend': 0.06,
          'space-color': isDark ? 'rgb(10, 8, 6)' : 'rgb(255, 253, 247)',
          'star-intensity': 0,
        }}
        light={{ anchor: 'viewport', color: 'white', intensity: 0.4 }}
        interactiveLayerIds={['municipality-fills']}
        onClick={onMuniClick}
        onMouseMove={onMapMouseMove}
        onContextMenu={onContextMenu}
        cursor={hoveredMuni ? 'pointer' : 'auto'}
        reuseMaps
      >
        <Source
          id="mapbox-dem"
          type="raster-dem"
          url="mapbox://mapbox.mapbox-terrain-dem-v1"
          tileSize={512}
          maxzoom={14}
        />

        {/* Hydrography — stream lines tinted to the theme */}
        {streamData && (
          <Source id="streams" type="geojson" data={streamData}>
            <Layer
              id="streams-line"
              type="line"
              paint={{
                'line-color': streamColor,
                'line-width': ['interpolate', ['linear'], ['zoom'], 9, 0.4, 13, 1.2, 16, 2.4],
                'line-opacity': ['interpolate', ['linear'], ['zoom'], 9, 0.35, 13, 0.7, 16, 0.9],
                'line-blur': 0.3,
              }}
            />
          </Source>
        )}

        {/* Parks — clay-green fills that adapt to theme */}
        {parkData && (
          <Source id="parks" type="geojson" data={parkData}>
            <Layer
              id="parks-fill"
              type="fill"
              paint={{
                'fill-color': parkFill,
                'fill-opacity': ['interpolate', ['linear'], ['zoom'], 9, 0.55, 14, 0.75],
              }}
            />
            <Layer
              id="parks-outline"
              type="line"
              paint={{
                'line-color': parkStroke,
                'line-width': 0.6,
                'line-opacity': 0.6,
              }}
            />
          </Source>
        )}

        {/* Municipality boundaries + active highlight */}
        <Source id="municipalities" type="geojson" data={muniData} promoteId="id">
          {/* Base fill for every municipality */}
          <Layer
            id="municipality-fills"
            type="fill"
            paint={{
              'fill-color': accent,
              'fill-opacity': [
                'case',
                ['==', ['get', 'id'], activeSlug ?? ''],
                isDark ? 0.28 : 0.18,
                isDark ? 0.08 : 0.05,
              ],
            }}
          />
          {/* Soft outer glow on the active municipality */}
          <Layer
            id="municipality-glow"
            type="line"
            paint={{
              'line-color': accent,
              'line-width': [
                'case',
                ['==', ['get', 'id'], activeSlug ?? ''],
                8,
                0,
              ],
              'line-opacity': 0.18,
              'line-blur': 6,
            }}
          />
          {/* Boundary lines — thin on all, thicker and solid on the active one */}
          <Layer
            id="municipality-borders"
            type="line"
            paint={{
              'line-color': accent,
              'line-width': [
                'case',
                ['==', ['get', 'id'], activeSlug ?? ''],
                2.4,
                1.25,
              ],
              'line-opacity': [
                'case',
                ['==', ['get', 'id'], activeSlug ?? ''],
                0.95,
                0.55,
              ],
            }}
          />
          {/* Place labels tuned to the brand ink + halo */}
          <Layer
            id="municipality-labels"
            type="symbol"
            layout={{
              'text-field': ['get', 'name'],
              'text-size': ['interpolate', ['linear'], ['zoom'], 8, 11, 11, 14, 14, 18],
              'text-font': ['DIN Pro Medium', 'Arial Unicode MS Bold'],
              'text-letter-spacing': 0.02,
              'text-anchor': 'center',
              'text-allow-overlap': false,
              'text-padding': 10,
              'text-transform': 'uppercase',
            }}
            paint={{
              'text-color': [
                'case',
                ['==', ['get', 'id'], activeSlug ?? ''],
                accent,
                inkColor,
              ],
              'text-halo-color': inkHalo,
              'text-halo-width': 1.8,
              'text-halo-blur': 0.6,
            }}
          />
        </Source>

        {/* 3D Buildings — height-graduated fill for a richer downtown view */}
        <Layer
          id="3d-buildings"
          source="composite"
          source-layer="building"
          type="fill-extrusion"
          minzoom={14}
          filter={['==', 'extrude', 'true']}
          paint={{
            'fill-extrusion-color': [
              'interpolate', ['linear'], ['get', 'height'],
              0, buildingColor,
              50, buildingTop,
              200, buildingTop,
            ],
            'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 14, 0, 15.5, ['get', 'height']],
            'fill-extrusion-base': ['get', 'min_height'],
            'fill-extrusion-opacity': 0.85,
            'fill-extrusion-vertical-gradient': true,
          }}
        />

        <GISLayerRenderer />

        <Live311Overlay onPopup={setPopup} />
        <TrafficOverlay onPopup={setPopup} />
        <WaterGaugeOverlay onPopup={setPopup} />
        <ParkingOverlay onPopup={setPopup} />

        {/* Legacy HTML popup for overlay markers */}
        {popup && (
          <Popup
            longitude={popup.lng}
            latitude={popup.lat}
            onClose={() => setPopup(null)}
            closeButton
            maxWidth="300px"
            anchor="bottom"
          >
            <div dangerouslySetInnerHTML={{ __html: popup.html }} />
          </Popup>
        )}

        {/* Municipality place-card popup */}
        {placeCard && (
          <Popup
            longitude={placeCard.lng}
            latitude={placeCard.lat}
            onClose={() => setPlaceCard(null)}
            closeButton={false}
            maxWidth="none"
            anchor="bottom"
            offset={12}
            className="fr-place-popup"
          >
            <MapPlaceCard
              slug={placeCard.slug}
              onClose={() => setPlaceCard(null)}
              onOpen={() => {
                navigate(routes.municipality(placeCard.slug));
                setPlaceCard(null);
              }}
            />
          </Popup>
        )}

        {/* Radius Explorer overlay */}
        {radiusCenter && (
          <RadiusExplorer center={radiusCenter} onClose={() => onCloseRadius?.()} />
        )}

        <NavigationControl position="bottom-right" visualizePitch />
        <ScaleControl position="bottom-left" unit="imperial" />
        <GeolocateControl position="bottom-right" trackUserLocation />
      </Map>

      {/* 2D / 3D Toggle */}
      <div className="absolute top-3 right-3 z-10 flex gap-1">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIs3D(false);
            setViewState((v) => ({ ...v, pitch: 0, bearing: 0 }));
          }}
          className={`rounded-full glass px-3 py-1.5 text-xs font-medium transition-colors ${
            !is3D ? 'text-accent' : 'text-text-secondary hover:text-text'
          }`}
        >
          2D
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIs3D(true);
            setViewState((v) => ({ ...v, pitch: 55, bearing: -15 }));
          }}
          className={`rounded-full glass px-3 py-1.5 text-xs font-medium transition-colors ${
            is3D ? 'text-accent' : 'text-text-secondary hover:text-text'
          }`}
        >
          3D
        </motion.button>
      </div>
    </div>
  );
}
