import { dataManifest } from '../../data/data-manifest';
import { useMapFlyTo } from '../../hooks/useMapFlyTo';
import { DataStatusNotice } from '../shared/DataStatusNotice';

export function ParkingPanel() {
  const garages = dataManifest.parking.garages;
  const { flyTo } = useMapFlyTo();

  return (
    <div className="space-y-3">
      <DataStatusNotice
        sourceId="manual-parking-reference"
        detail="Parking guidance in this panel is a manual reference. Real-time garage availability and enforcement status are not integrated."
      />

      <div className="rounded-lg border border-accent/30 bg-accent/5 p-3">
        <div className="flex items-center gap-2 text-sm font-medium text-accent">
          <span>&#x1F17F;&#xFE0F;</span> ParkMobile Only
        </div>
        <p className="mt-1 text-xs text-text-secondary">
          Frederick City has transitioned to ParkMobile for all street parking.
          Zones {dataManifest.parking.parkMobileZones.start}-{dataManifest.parking.parkMobileZones.end}.
        </p>
      </div>

      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Parking Garages
        </h4>
        <div className="space-y-2">
          {garages.map((garage) => (
            <button
              key={garage.name}
              className="w-full rounded-lg border border-border bg-bg-surface p-3 text-left hover:bg-bg-hover transition-colors"
              onClick={() => flyTo(garage.lng, garage.lat, 17)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-text">{garage.name}</div>
                  <div className="text-xs text-text-muted">{garage.address}</div>
                </div>
                <svg className="h-4 w-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-bg-elevated p-3">
        <h4 className="text-xs font-semibold text-text-secondary mb-2">How ParkMobile Works</h4>
        <ol className="space-y-1.5 text-xs text-text-secondary">
          <li className="flex gap-2"><span className="font-bold text-accent">1.</span> Find a space with a green ParkMobile sign</li>
          <li className="flex gap-2"><span className="font-bold text-accent">2.</span> Note the zone number (1601-1640)</li>
          <li className="flex gap-2"><span className="font-bold text-accent">3.</span> Pay via ParkMobile app, web, or phone</li>
          <li className="flex gap-2"><span className="font-bold text-accent">4.</span> Extend time remotely if needed</li>
        </ol>
      </div>

      <div className="text-xs text-text-muted text-center">
        Garage availability is not integrated in this app yet. Use official City parking tools to confirm current conditions.
      </div>
    </div>
  );
}
