import { mapLayers } from '../../data/layers';
import { sourceRegistry } from '../../data/source-registry';

interface Props {
  onComplete: () => void;
}

export function WelcomeScreen({ onComplete }: Props) {
  const sourceCount = Object.keys(sourceRegistry).length;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#F5F0E8] text-text">
      <div className="w-full max-w-sm px-8 text-center">
        {/* Logo / Brand */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[20px] bg-text text-2xl text-[#F5F0E8] shadow-lg">
          FR
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-text">
          Frederick Radius
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-text-secondary">
          Your local atlas for Frederick County. Weather, places, events, civic info, and {mapLayers.length}+ GIS layers from {sourceCount} public sources.
        </p>

        {/* Quick stats */}
        <div className="mt-6 flex justify-center gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-text">{mapLayers.length}</div>
            <div className="text-[11px] text-text-muted">Map layers</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-text">{sourceCount}</div>
            <div className="text-[11px] text-text-muted">Data sources</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-text">12</div>
            <div className="text-[11px] text-text-muted">Municipalities</div>
          </div>
        </div>

        <button
          onClick={onComplete}
          className="mt-8 w-full rounded-2xl bg-text px-6 py-3.5 text-[15px] font-semibold text-[#F5F0E8] active:scale-[0.97] transition-transform"
        >
          Get Started
        </button>

        <div className="mt-3 text-[12px] text-text-muted">
          Press Enter to continue
        </div>
      </div>
    </div>
  );
}
