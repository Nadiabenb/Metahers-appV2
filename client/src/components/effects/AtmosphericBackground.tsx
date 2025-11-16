
import { motion } from "framer-motion";

interface AtmosphericBackgroundProps {
  variant?: "mesh" | "noise" | "gradient-orbs" | "particles";
  intensity?: "subtle" | "medium" | "dramatic";
  color?: string; // CSS custom property like "var(--hyper-violet)"
}

/**
 * Atmospheric backgrounds that create depth and context
 * Avoids flat solid colors in favor of textured, layered visuals
 */
export function AtmosphericBackground({ 
  variant = "mesh", 
  intensity = "medium",
  color = "var(--hyper-violet)"
}: AtmosphericBackgroundProps) {
  const opacityMap = {
    subtle: 0.03,
    medium: 0.08,
    dramatic: 0.15
  };

  const opacity = opacityMap[intensity];

  if (variant === "mesh") {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Gradient mesh overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(circle at 20% 30%, ${color} 0%, transparent 50%),
                        radial-gradient(circle at 80% 70%, var(--magenta-quartz) 0%, transparent 50%),
                        radial-gradient(circle at 50% 50%, var(--aurora-teal) 0%, transparent 50%)`
          }}
        />
        {/* Noise texture */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
            mixBlendMode: "overlay"
          }}
        />
      </div>
    );
  }

  if (variant === "gradient-orbs") {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            opacity: opacity
          }}
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, var(--cyber-fuchsia) 0%, transparent 70%)`,
            opacity: opacity
          }}
        />
      </div>
    );
  }

  // Default geometric pattern
  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
        opacity: opacity,
        maskImage: "radial-gradient(ellipse at center, black 0%, transparent 80%)"
      }}
    />
  );
}
