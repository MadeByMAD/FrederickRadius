import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { AppState, MapLayer } from '../types';
import { mapLayers } from '../data/layers';

interface AppContextType {
  state: AppState;
  layers: MapLayer[];
  dispatch: React.Dispatch<AppAction>;
}

/**
 * App-wide state is deliberately narrow. Panel/navigation state lives in the
 * URL via useAppRoute — this reducer only owns transient UI bits (sidebar,
 * layer panel, layer toggles) that are not meaningful to share or deep-link.
 */
type AppAction =
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'TOGGLE_LAYER'; layerId: string }
  | { type: 'SET_SEARCH'; query: string }
  | { type: 'SET_LAYER_OPACITY'; layerId: string; opacity: number }
  | { type: 'SET_LAYER_ORDER'; order: string[] }
  | { type: 'CLEAR_LAYERS' }
  | { type: 'TOGGLE_LAYER_PANEL' };

const initialState: AppState = {
  activeLayers: [],
  sidebarOpen: true,
  searchQuery: '',
  layerOpacity: {},
  layerOrder: [],
  layerPanelOpen: false,
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'TOGGLE_LAYER': {
      const isActive = state.activeLayers.includes(action.layerId);
      const active = isActive
        ? state.activeLayers.filter((id) => id !== action.layerId)
        : [...state.activeLayers, action.layerId];
      const order = isActive
        ? state.layerOrder.filter((id) => id !== action.layerId)
        : [action.layerId, ...state.layerOrder];
      return { ...state, activeLayers: active, layerOrder: order };
    }
    case 'SET_LAYER_OPACITY':
      return { ...state, layerOpacity: { ...state.layerOpacity, [action.layerId]: action.opacity } };
    case 'SET_LAYER_ORDER':
      return { ...state, layerOrder: action.order };
    case 'CLEAR_LAYERS':
      return { ...state, activeLayers: [], layerOrder: [], layerOpacity: {} };
    case 'TOGGLE_LAYER_PANEL':
      return { ...state, layerPanelOpen: !state.layerPanelOpen };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.query };
    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const layers = mapLayers.map((l) => ({
    ...l,
    visible: state.activeLayers.includes(l.id),
  }));

  return (
    <AppContext value={{ state, layers, dispatch }}>
      {children}
    </AppContext>
  );
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}
