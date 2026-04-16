import { motion } from 'framer-motion';

const shimmer = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: { duration: 1.8, repeat: Infinity, ease: 'linear' as const },
  },
};

function SkeletonBase({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`rounded bg-bg-hover ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(90deg, transparent 30%, var(--skeleton-highlight) 50%, transparent 70%)',
        backgroundSize: '200% 100%',
      }}
      animate={shimmer.animate}
    />
  );
}

export function SkeletonText({ lines = 1, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBase
          key={i}
          className={`h-3 ${i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-lg border border-border bg-bg-surface p-3 space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <SkeletonBase className="h-4 w-32" />
        <SkeletonBase className="h-5 w-14 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <SkeletonBase className="h-14 rounded-lg" />
        <SkeletonBase className="h-14 rounded-lg" />
      </div>
      <SkeletonText lines={2} />
    </div>
  );
}

export function SkeletonWeather() {
  return (
    <div className="space-y-3">
      <div className="rounded-lg bg-bg-elevated p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <SkeletonBase className="h-8 w-24" />
            <SkeletonBase className="h-3 w-32" />
            <SkeletonBase className="h-3 w-20" />
          </div>
          <SkeletonBase className="h-12 w-12 rounded-full" />
        </div>
      </div>
      <div className="space-y-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between rounded bg-bg-surface px-3 py-2">
            <SkeletonBase className="h-3 w-24" />
            <SkeletonBase className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonGauges() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonFeed() {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonBase key={i} className="h-16 rounded-lg" />
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-border bg-bg-surface p-3 space-y-2">
          <SkeletonBase className="h-4 w-3/4" />
          <SkeletonBase className="h-3 w-1/2" />
          <SkeletonBase className="h-3 w-1/3" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonIntel() {
  return (
    <div className="space-y-4">
      <SkeletonBase className="h-24 rounded-xl" />
      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonBase key={i} className="h-16 rounded-lg" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonBase key={i} className="h-20 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
