import type { AppState } from '../types';
import type { AppAction } from './app-state-context';

export const initialState: AppState = {
  selectedMunicipality: null,
  activeLayers: [],
  sidebarOpen: true,
  slidePanelOpen: false,
  slidePanelContent: null,
  searchQuery: '',
  layerOpacity: {},
  layerOrder: [],
  activeWorkflowId: null,
  workflowSummary: null,
  discoverSummary: null,
  layerPanelOpen: false,
};

export function reducer(state: AppState, action: AppAction): AppState {
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
      const isActive = state.activeLayers.includes(action.layerId);
      const active = isActive
        ? state.activeLayers.filter((id) => id !== action.layerId)
        : [...state.activeLayers, action.layerId];
      const order = isActive
        ? state.layerOrder.filter((id) => id !== action.layerId)
        : [action.layerId, ...state.layerOrder];
      return {
        ...state,
        activeLayers: active,
        layerOrder: order,
        activeWorkflowId: null,
        workflowSummary: null,
        discoverSummary: null,
      };
    }
    case 'SET_LAYER_OPACITY':
      return { ...state, layerOpacity: { ...state.layerOpacity, [action.layerId]: action.opacity } };
    case 'SET_LAYER_ORDER':
      return { ...state, layerOrder: action.order };
    case 'APPLY_WORKFLOW':
      return {
        ...state,
        activeLayers: action.layerIds,
        layerOrder: action.layerIds,
        activeWorkflowId: action.workflowId,
        workflowSummary: action.summary,
        discoverSummary: null,
      };
    case 'DISCOVER':
      return {
        ...state,
        activeLayers: action.layerIds,
        layerOrder: action.layerIds,
        layerOpacity: action.opacities,
        activeWorkflowId: null,
        workflowSummary: null,
        discoverSummary: action.summary,
      };
    case 'CLEAR_LAYERS':
      return {
        ...state,
        activeLayers: [],
        layerOrder: [],
        layerOpacity: {},
        activeWorkflowId: null,
        workflowSummary: null,
        discoverSummary: null,
      };
    case 'TOGGLE_LAYER_PANEL':
      return { ...state, layerPanelOpen: !state.layerPanelOpen };
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
