import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useTransform, animate, type PanInfo } from 'framer-motion';
import { useHaptics } from '../../hooks/useHaptics';

export type SnapPoint = 'peek' | 'half' | 'full';

// Heights for each snap point (from bottom of screen)
const SNAP_HEIGHTS = {
  peek: 120,   // Just search bar + quick actions
  half: typeof window !== 'undefined' ? window.innerHeight * 0.5 : 400,
  full: typeof window !== 'undefined' ? window.innerHeight - 44 : 760,
};

function getSnapHeights() {
  if (typeof window === 'undefined') return SNAP_HEIGHTS;
  return {
    peek: 120,
    half: window.innerHeight * 0.5,
    full: window.innerHeight - 44,
  };
}

interface Props {
  snap: SnapPoint;
  onSnapChange: (snap: SnapPoint) => void;
  peekContent: ReactNode;
  children: ReactNode;
}

export function BottomSheet({ snap, onSnapChange, peekContent, children }: Props) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const { snap: hapticSnap } = useHaptics();
  const heights = getSnapHeights();

  const y = useMotionValue(0);
  const sheetHeight = heights[snap];

  // Opacity for overlay backdrop
  const backdropOpacity = useTransform(
    y,
    [-heights.full, -heights.half, -heights.peek],
    [0.5, 0.2, 0]
  );

  function handleDragEnd(_: unknown, info: PanInfo) {
    const velocity = info.velocity.y;
    const currentHeight = sheetHeight - info.offset.y;

    // Velocity-based snapping
    if (velocity < -500) {
      // Flicked up fast
      if (snap === 'peek') onSnapChange('half');
      else if (snap === 'half') onSnapChange('full');
      hapticSnap();
      return;
    }
    if (velocity > 500) {
      // Flicked down fast
      if (snap === 'full') onSnapChange('half');
      else if (snap === 'half') onSnapChange('peek');
      hapticSnap();
      return;
    }

    // Position-based snapping
    const snapPoints = [
      { point: 'peek' as const, height: heights.peek },
      { point: 'half' as const, height: heights.half },
      { point: 'full' as const, height: heights.full },
    ];

    let closest = snapPoints[0];
    let closestDist = Infinity;
    for (const sp of snapPoints) {
      const dist = Math.abs(currentHeight - sp.height);
      if (dist < closestDist) {
        closest = sp;
        closestDist = dist;
      }
    }

    if (closest.point !== snap) {
      hapticSnap();
    }
    onSnapChange(closest.point);

    // Animate y back to 0 (the sheet height change handles the rest)
    animate(y, 0, { type: 'spring', stiffness: 300, damping: 30 });
  }

  return (
    <>
      {/* Backdrop (only visible in half/full) */}
      {snap !== 'peek' && (
        <motion.div
          className="fixed inset-0 z-40 bg-black"
          style={{ opacity: backdropOpacity }}
          onClick={() => onSnapChange('peek')}
        />
      )}

      {/* Sheet */}
      <motion.div
        ref={sheetRef}
        className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-2xl bg-bg border-t border-border shadow-2xl"
        style={{ y }}
        animate={{ height: sheetHeight }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        drag="y"
        dragConstraints={{ top: -(heights.full - sheetHeight), bottom: heights.peek }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
      >
        {/* Handle */}
        <div className="flex-shrink-0 flex justify-center pt-2 pb-1 cursor-grab active:cursor-grabbing touch-none">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Peek content (always visible) */}
        <div className="flex-shrink-0 px-4 pb-2">
          {peekContent}
        </div>

        {/* Scrollable content (visible in half/full) */}
        {snap !== 'peek' && (
          <div
            className="flex-1 overflow-y-auto overscroll-contain px-4 pb-[env(safe-area-inset-bottom,16px)]"
            onTouchStart={(e) => e.stopPropagation()} // Prevent drag interference with scroll
          >
            {children}
          </div>
        )}
      </motion.div>
    </>
  );
}
