import { MapProvider } from 'react-map-gl/mapbox';
import { AppProvider } from './context/app-state';
import { AppShell } from './components/layout/AppShell';

export default function App() {
  return (
    <AppProvider>
      <MapProvider>
        <AppShell />
      </MapProvider>
    </AppProvider>
  );
}
