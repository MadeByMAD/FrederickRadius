import { createContext } from 'react';
import type { AppState, MapLayer } from '../types';

export interface AppContextType {
  state: AppState;
  layers: MapLayer[];
  dispatch: React.Dispatch<AppAction>;
}

export type AppAction =
  | { type: 'SELECT_MUNICIPALITY'; id: string | null }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'OPEN_PANEL'; content: AppState['slidePanelContent'] }
  | { type: 'CLOSE_PANEL' }
  | { type: 'TOGGLE_LAYER'; layerId: string }
  | { type: 'SET_SEARCH'; query: string }
  | { type: 'ADDRESS_INTEL'; lat: number; lng: number; address: string }
  | { type: 'SET_LAYER_OPACITY'; layerId: string; opacity: number }
  | { type: 'SET_LAYER_ORDER'; order: string[] }
  | { type: 'APPLY_WORKFLOW'; workflowId: string; layerIds: string[]; summary: string }
  | { type: 'DISCOVER'; layerIds: string[]; opacities: Record<string, number>; summary: string }
  | { type: 'CLEAR_LAYERS' }
  | { type: 'TOGGLE_LAYER_PANEL' };

export const AppContext = createContext<AppContextType | null>(null);
