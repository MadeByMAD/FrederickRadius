import { useState, useCallback } from 'react';
import Map, { Source, Layer, Popup, NavigationControl, ScaleControl, GeolocateControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAppState } from '../../hooks/useAppState';
import { useTheme } from '../../hooks/useTheme';
import { useMunicipalityBoundaries } from '../../hooks/useMunicipalityBoundaries';
import { municipalities } from '../../data/municipalities';
import { FREDERICK_COUNTY_CENTER, FREDERICK_COUNTY_ZOOM } from '../../data/municipalities';
import { GISLayerRenderer } from './GISLayerRenderer';
import { Live311Overlay } from './overlays/Live311Overlay';
import { TrafficOverlay } from './overlays/TrafficOverlay';
import { WaterGaugeOverlay } from './overlays/WaterGaugeOverlay';
import { ParkingOverlay } from './overlays/ParkingOverlay';
import { RadiusExplorer } from '../shared/RadiusExplorer';
import { motion } from 'framer-motion';
import type { MapMouseEvent } from 'react-map-gl/mapbox';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

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
  const { state, dispatch } = useAppState();
  const { resolved: theme } = useTheme();
  const { data: muniData } = useMunicipalityBoundaries();
  const [popup, setPopup] = useState<PopupInfo | null>(null);
  const [is3D, setIs3D] = useState(true);
  const [viewState, setViewState] = useState(INITIAL_VIEW);

  const isDark = theme === 'dark';
  const mapStyle = isDark ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11';
  const boundaryColor = isDark ? '#D4344A' : '#8B1F2F';
  const labelColor = isDark ? '#F2EDE3' : '#1A1613';
  const labelHalo = isDark ? 'rgba(15, 13, 11, 0.9)' : 'rgba(250, 248, 244, 0.9)';
  const buildingColor = isDark ? '#1A1A2E' : '#D9D2C4';

  // Municipality click
  const onMuniClick = useCallback(
    (e: MapMouseEvent) => {
      const feature = e.features?.[0];
      if (feature?.properties?.id) {
        dispatch({ type: 'SELECT_MUNICIPALITY', id: feature.properties.id as string });
        const muni = municipalities.find((m) => m.id === feature.properties!.id);
        if (muni) {
          setViewState((v) => ({
            ...v,
            longitude: muni.centroid[0],
            latitude: muni.centroid[1],
            zoom: muni.area > 5 ? 12 : 13.5,
            pitch: 50,
          }));
        }
      }
    },
    [dispatch]
  );

  // Right-click for Address Intelligence
  const onContextMenu = useCallback(
    (e: MapMouseEvent) => {
      dispatch({
        type: 'ADDRESS_INTEL',
        lat: e.lngLat.lat,
        lng: e.lngLat.lng,
        address: `${e.lngLat.lat.toFixed(5)}, ${e.lngLat.lng.toFixed(5)} (Frederick County)`,
      });
    },
    [dispatch]
  );

  // Fly to selected municipality
  const selectedMuni = state.selectedMunicipality
    ? municipalities.find((m) => m.id === state.selectedMunicipality)
    : null;

  if (selectedMuni && viewState.longitude !== selectedMuni.centroid[0]) {
    // Will be handled by controlled viewState
  }

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
        terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
        interactiveLayerIds={['municipality-fills']}
        onClick={onMuniClick}
        onContextMenu={onContextMenu}
        cursor="auto"
        reuseMaps
      >
        {/* Terrain DEM Source */}
        <Source
          id="mapbox-dem"
          type="raster-dem"
          url="mapbox://mapbox.mapbox-terrain-dem-v1"
          tileSize={512}
          maxzoom={14}
        />

        {/* Municipality Boundaries */}
        <Source id="municipalities" type="geojson" data={muniData}>
          <Layer
            id="municipality-fills"
            type="fill"
            paint={{
              'fill-color': boundaryColor,
              'fill-opacity': isDark ? 0.12 : 0.08,
            }}
          />
          <Layer
            id="municipality-borders"
            type="line"
            paint={{
              'line-color': boundaryColor,
              'line-width': 1.5,
              'line-opacity': 0.7,
            }}
          />
          <Layer
            id="municipality-labels"
            type="symbol"
            layout={{
              'text-field': ['get', 'name'],
              'text-size': ['interpolate', ['linear'], ['zoom'], 9, 10, 12, 14],
              'text-font': ['DIN Pro Regular', 'Arial Unicode MS Regular'],
              'text-anchor': 'center',
              'text-allow-overlap': false,
              'text-padding': 10,
            }}
            paint={{
              'text-color': labelColor,
              'text-halo-color': labelHalo,
              'text-halo-width': 2,
            }}
          />
        </Source>

        {/* 3D Buildings at high zoom */}
        <Layer
          id="3d-buildings"
          source="composite"
          source-layer="building"
          type="fill-extrusion"
          minzoom={14}
          paint={{
            'fill-extrusion-color': buildingColor,
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': ['get', 'min_height'],
            'fill-extrusion-opacity': 0.6,
          }}
        />

        {/* GIS Data Layers (60 toggleable) */}
        <GISLayerRenderer />

        {/* Live Data Overlays */}
        <Live311Overlay onPopup={setPopup} />
        <TrafficOverlay onPopup={setPopup} />
        <WaterGaugeOverlay onPopup={setPopup} />
        <ParkingOverlay onPopup={setPopup} />

        {/* Popup */}
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

        {/* Radius Explorer overlay */}
        {radiusCenter && (
          <RadiusExplorer center={radiusCenter} onClose={() => onCloseRadius?.()} />
        )}

        {/* Controls */}
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
          className={`rounded-lg glass px-2.5 py-1.5 text-xs font-medium transition-colors ${
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
          className={`rounded-lg glass px-2.5 py-1.5 text-xs font-medium transition-colors ${
            is3D ? 'text-accent' : 'text-text-secondary hover:text-text'
          }`}
        >
          3D
        </motion.button>
      </div>
    </div>
  );
}
