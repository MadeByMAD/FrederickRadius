import { useState, useCallback, useMemo, useRef } from 'react';
import Map, { Source, Layer, Popup, NavigationControl, ScaleControl, GeolocateControl } from 'react-map-gl/mapbox';
import type { MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAppState } from '../../hooks/useAppState';
import { municipalityReferencePoints, municipalities } from '../../data/municipalities';
import { FREDERICK_COUNTY_CENTER, FREDERICK_COUNTY_ZOOM } from '../../data/municipalities';
import { GISLayerRenderer } from './GISLayerRenderer';
import { useMunicipalityBoundaries } from '../../hooks/useMunicipalityBoundaries';
import { Live311Overlay } from './overlays/Live311Overlay';
import { TrafficOverlay } from './overlays/TrafficOverlay';
import { WaterGaugeOverlay } from './overlays/WaterGaugeOverlay';
import { ParkingOverlay } from './overlays/ParkingOverlay';
import { RadiusExplorer } from '../shared/RadiusExplorer';
import { motion } from 'framer-motion';
import type { MapMouseEvent } from 'react-map-gl/mapbox';
import { MapSetupState } from './MapSetupState';

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
  const mapRef = useRef<MapRef>(null);
  const [popup, setPopup] = useState<PopupInfo | null>(null);
  const [is3D, setIs3D] = useState(true);
  const [viewState, setViewState] = useState(INITIAL_VIEW);
  const hasMapboxToken = MAPBOX_TOKEN.trim().length > 0;

  const onMapLoad = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    if (!map.getSource('mapbox-dem')) {
      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14,
      });
    }
    map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
  }, []);

  const muniData = useMemo(() => municipalityReferencePoints, []);
  const { boundaries: tigerBoundaries } = useMunicipalityBoundaries();

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
  const focusedPanel = state.slidePanelContent;
  const showTrafficOverlay = focusedPanel === 'traffic' || state.activeWorkflowId === 'mobility-access';
  const showWaterOverlay = focusedPanel === 'water' || state.activeWorkflowId === 'storm-flood';
  const showReportsOverlay = focusedPanel === 'reports';
  const showParkingOverlay = focusedPanel === 'parking';

  if (selectedMuni && viewState.longitude !== selectedMuni.centroid[0]) {
    // Will be handled by controlled viewState
  }

  if (!hasMapboxToken) {
    return (
      <MapSetupState onOpenPanel={(content) => dispatch({ type: 'OPEN_PANEL', content })} />
    );
  }

  return (
    <div className="relative h-full w-full">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        onLoad={onMapLoad}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        style={{ width: '100%', height: '100%' }}
        minZoom={8}
        maxZoom={18}
        maxPitch={70}
        interactiveLayerIds={['municipality-points']}
        onClick={onMuniClick}
        onContextMenu={onContextMenu}
        cursor="auto"
        reuseMaps
      >

        {/* Official municipality boundaries (Census TIGER/Line) */}
        {tigerBoundaries && (
          <Source id="tiger-boundaries" type="geojson" data={tigerBoundaries}>
            <Layer
              id="tiger-boundary-fill"
              type="fill"
              paint={{
                'fill-color': '#3B82F6',
                'fill-opacity': 0.06,
              }}
            />
            <Layer
              id="tiger-boundary-outline"
              type="line"
              paint={{
                'line-color': '#3B82F6',
                'line-width': ['interpolate', ['linear'], ['zoom'], 8, 0.8, 12, 2],
                'line-opacity': 0.5,
                'line-dasharray': [2, 1],
              }}
            />
          </Source>
        )}

        {/* Municipality reference points */}
        <Source id="municipalities" type="geojson" data={muniData}>
          <Layer
            id="municipality-points"
            type="circle"
            paint={{
              'circle-color': '#3B82F6',
              'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 4, 12, 9],
              'circle-stroke-color': '#07111c',
              'circle-stroke-width': 2,
              'circle-opacity': 0.92,
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
              'text-color': '#F0ECE6',
              'text-halo-color': 'rgba(10, 10, 10, 0.9)',
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
            'fill-extrusion-color': '#1A1A2E',
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': ['get', 'min_height'],
            'fill-extrusion-opacity': 0.6,
          }}
        />

        {/* GIS Data Layers (60 toggleable) */}
        <GISLayerRenderer />

        {/* Focused operational / context overlays */}
        {showReportsOverlay && <Live311Overlay onPopup={setPopup} />}
        {showTrafficOverlay && <TrafficOverlay onPopup={setPopup} />}
        {showWaterOverlay && <WaterGaugeOverlay onPopup={setPopup} />}
        {showParkingOverlay && <ParkingOverlay onPopup={setPopup} />}

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

      <div className="pointer-events-none absolute left-3 bottom-3 z-10 max-w-xs rounded-lg border border-border/70 bg-bg-elevated/90 px-3 py-2 text-[10px] leading-4 text-text-muted backdrop-blur-md">
        {tigerBoundaries
          ? 'Municipality boundaries from U.S. Census TIGER/Line. Dots are centroid reference points.'
          : 'Municipal map markers are centroid references only. Official boundary geometry is loading.'}
      </div>

      {(showTrafficOverlay || showWaterOverlay || showReportsOverlay || showParkingOverlay) && (
        <div className="pointer-events-none absolute left-3 top-3 z-10 max-w-sm rounded-lg border border-border/70 bg-bg-elevated/90 px-3 py-2 text-[10px] leading-4 text-text-muted backdrop-blur-md">
          Focused map overlay:
          {' '}
          {showTrafficOverlay ? 'CHART traffic. ' : ''}
          {showWaterOverlay ? 'USGS gauges. ' : ''}
          {showReportsOverlay ? 'SeeClickFix reports. ' : ''}
          {showParkingOverlay ? 'Manual parking reference. ' : ''}
          These overlays appear only when the related panel or civic view is active.
        </div>
      )}

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
