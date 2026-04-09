import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  delay: number;
  shape: 'circle' | 'square';
}

export function Confetti({ trigger }: { trigger: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!trigger) return;

    const frame = window.requestAnimationFrame(() => {
      setParticles(
        Array.from({ length: 30 }, (_, index) => ({
          id: index,
          x: (Math.random() - 0.5) * 300,
          y: -(Math.random() * 200 + 100),
          rotation: Math.random() * 720 - 360,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          size: Math.random() * 8 + 4,
          delay: Math.random() * 0.3,
          shape: Math.random() > 0.5 ? 'circle' : 'square',
        }))
      );
    });
    const timer = window.setTimeout(() => setParticles([]), 2000);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [trigger]);

  return (
    <AnimatePresence>
      {particles.length > 0 && (
        <div className="fixed inset-0 z-[300] pointer-events-none flex items-center justify-center">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 }}
              animate={{
                x: p.x,
                y: p.y,
                scale: 0,
                rotate: p.rotation,
                opacity: 0,
              }}
              transition={{
                duration: 1.2,
                delay: p.delay,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              style={{
                position: 'absolute',
                width: p.size,
                height: p.size,
                borderRadius: p.shape === 'circle' ? '50%' : '2px',
                backgroundColor: p.color,
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
