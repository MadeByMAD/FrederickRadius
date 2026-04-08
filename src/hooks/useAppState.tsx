import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { AppState, MapLayer } from '../types';
import { mapLayers } from '../data/layers';

interface AppContextType {
  state: AppState;
  layers: MapLayer[];
  dispatch: React.Dispatch<AppAction>;
}

type AppAction =
  | { type: 'SELECT_MUNICIPALITY'; id: string | null }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'OPEN_PANEL'; content: AppState['slidePanelContent'] }
  | { type: 'CLOSE_PANEL' }
  | { type: 'TOGGLE_LAYER'; layerId: string }
  | { type: 'SET_SEARCH'; query: string }
  | { type: 'ADDRESS_INTEL'; lat: number; lng: number; address: string };

const initialState: AppState = {
  selectedMunicipality: null,
  activeLayers: [],
  sidebarOpen: true,
  slidePanelOpen: false,
  slidePanelContent: null,
  searchQuery: '',
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SELECT_MUNICIPALITY':
      return {
        ...state,
        selectedMunicipality: action.id,
        slidePanelOpen: action.id !== null,
        slidePanelContent: action.id !== null ? 'municipality' : null,
      };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'OPEN_PANEL':
      return { ...state, slidePanelOpen: true, slidePanelContent: action.content };
    case 'CLOSE_PANEL':
      return { ...state, slidePanelOpen: false, slidePanelContent: null, selectedMunicipality: null };
    case 'TOGGLE_LAYER': {
      const active = state.activeLayers.includes(action.layerId)
        ? state.activeLayers.filter((id) => id !== action.layerId)
        : [...state.activeLayers, action.layerId];
      return { ...state, activeLayers: active };
    }
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.query };
    case 'ADDRESS_INTEL':
      return {
        ...state,
        slidePanelOpen: true,
        slidePanelContent: 'address-intel',
        addressIntel: { lat: action.lat, lng: action.lng, address: action.address },
      };
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
