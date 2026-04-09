import { useReducer, type ReactNode } from 'react';
import { mapLayers } from '../data/layers';
import { AppContext } from './app-state-context';
import { initialState, reducer } from './app-state-reducer';

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const layers = mapLayers.map((layer) => ({
    ...layer,
    visible: state.activeLayers.includes(layer.id),
  }));

  return (
    <AppContext value={{ state, layers, dispatch }}>
      {children}
    </AppContext>
  );
}
