import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  createdAt: number;
}

export function CursorSparkles() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const sparkleIdRef = useRef(0);
  const lastSparkleTimeRef = useRef(0);
  const prefersReducedMotion = useReducedMotion();
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastSparkleTimeRef.current < 50) return;
      lastSparkleTimeRef.current = now;

      const newSparkle: Sparkle = {
        id: sparkleIdRef.current++,
        x: e.clientX,
        y: e.clientY,
        createdAt: now,
      };

      setSparkles((prev) => [...prev, newSparkle]);
    };

    window.addEventListener("mousemove", handleMouseMove);

    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setSparkles((prev) => prev.filter((s) => now - s.createdAt < 800));
    }, 100);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(cleanupInterval);
    };
  }, [prefersReducedMotion, isTouchDevice]);

  if (prefersReducedMotion || isTouchDevice) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            initial={{ opacity: 1, scale: 0 }}
            animate={{ opacity: 0, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: sparkle.x - 4,
              top: sparkle.y - 4,
            }}
            className="w-2 h-2 rounded-full"
          >
            <div className="w-full h-full bg-gradient-to-br from-[#FF3B9C] via-[#8B5CF6] to-[#00D9FF] rounded-full blur-[1px]" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
