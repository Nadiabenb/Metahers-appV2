import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, type ButtonProps } from "@/components/ui/button";

interface Ripple {
  x: number;
  y: number;
  id: number;
}

interface RippleButtonProps extends ButtonProps {
  rippleColor?: string;
}

export function RippleButton({ 
  children, 
  rippleColor = "rgba(139, 92, 246, 0.4)",
  className,
  onClick,
  ...props 
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleIdRef = useRef(0);
  const lastClickRef = useRef(0);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const now = Date.now();
    
    // Throttle rapid clicks to avoid render thrash
    if (now - lastClickRef.current < 100) {
      onClick?.(e);
      return;
    }
    lastClickRef.current = now;

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple: Ripple = {
      x,
      y,
      id: rippleIdRef.current++,
    };

    setRipples((prev) => {
      // Limit to 3 concurrent ripples for performance
      const limited = prev.length >= 3 ? prev.slice(1) : prev;
      return [...limited, newRipple];
    });

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    onClick?.(e);
  };

  return (
    <Button
      {...props}
      className={`relative overflow-hidden ${className || ""}`}
      onClick={handleClick}
    >
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: ripple.x,
              top: ripple.y,
              width: 20,
              height: 20,
              borderRadius: "50%",
              backgroundColor: rippleColor,
              pointerEvents: "none",
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </AnimatePresence>
      {children}
    </Button>
  );
}
