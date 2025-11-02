import { motion, useMotionValue } from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface ParticleProps {
  index: number;
  mousePosRef: React.RefObject<{ x: number; y: number }>;
}

function Particle({ index, mousePosRef }: ParticleProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [mounted, setMounted] = useState(false);
  const [animateTargets] = useState(() => ({
    xOffset: (Math.random() - 0.5) * 100,
    yOffset: (Math.random() - 0.5) * 100,
    duration: 10 + Math.random() * 10
  }));

  useEffect(() => {
    if (typeof window !== 'undefined') {
      x.set(Math.random() * window.innerWidth);
      y.set(Math.random() * window.innerHeight);
      setMounted(true);
    }
  }, [x, y]);

  useEffect(() => {
    if (!mounted || !mousePosRef.current) return;

    const interval = setInterval(() => {
      const mousePos = mousePosRef.current;
      if (!mousePos) return;

      const dx = mousePos.x - x.get();
      const dy = mousePos.y - y.get();
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 200 && distance > 0) {
        const force = (200 - distance) / 200;
        x.set(x.get() - dx * force * 0.1);
        y.set(y.get() - dy * force * 0.1);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [mounted, mousePosRef, x, y]);

  if (!mounted) return null;

  const initialX = x.get();
  const initialY = y.get();

  return (
    <motion.div
      style={{ x, y }}
      animate={{
        x: [initialX, initialX + animateTargets.xOffset],
        y: [initialY, initialY + animateTargets.yOffset],
      }}
      transition={{
        duration: animateTargets.duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
      className="absolute w-1 h-1 bg-[hsl(var(--liquid-gold))] rounded-full blur-sm opacity-60"
    />
  );
}

interface ParticleFieldProps {
  count?: number;
  prefersReducedMotion?: boolean;
}

export function ParticleField({ count = 50, prefersReducedMotion = false }: ParticleFieldProps) {
  const mousePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (prefersReducedMotion || typeof window === 'undefined') return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <Particle key={i} index={i} mousePosRef={mousePosRef} />
      ))}
    </div>
  );
}
