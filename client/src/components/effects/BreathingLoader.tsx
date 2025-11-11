import { motion, useReducedMotion } from "framer-motion";

interface BreathingLoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function BreathingLoader({ size = "md", className = "" }: BreathingLoaderProps) {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };
  
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className={`flex items-center justify-center ${className}`} data-testid="breathing-loader">
        <div className={`${sizeMap[size]} rounded-full bg-gradient-to-br from-primary via-secondary to-accent opacity-70`} />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`} data-testid="breathing-loader">
      <motion.div
        className={`${sizeMap[size]} rounded-full relative`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/30"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Middle ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-secondary/40"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.8, 0.2, 0.8],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
        
        {/* Inner core */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-secondary to-accent"
          animate={{
            scale: [0.8, 1, 0.8],
            opacity: [1, 0.6, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </motion.div>
    </div>
  );
}
