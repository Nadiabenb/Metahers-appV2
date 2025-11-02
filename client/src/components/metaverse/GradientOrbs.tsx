import { motion } from "framer-motion";

interface GradientOrbsProps {
  prefersReducedMotion?: boolean;
}

export function GradientOrbs({ prefersReducedMotion = false }: GradientOrbsProps) {
  if (prefersReducedMotion) {
    return (
      <>
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-[#B565D8] via-[#E935C1] to-transparent rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-gradient-to-br from-[#00D9FF] via-[#FFD700] to-transparent rounded-full blur-3xl opacity-15" />
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-to-br from-[#E935C1] via-[#B565D8] to-transparent rounded-full blur-3xl opacity-10" />
      </>
    );
  }

  return (
    <>
      {/* Violet-Magenta Orb */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.35, 0.2],
          x: [0, 60, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-[#B565D8] via-[#E935C1] to-transparent rounded-full blur-3xl"
      />

      {/* Teal-Gold Orb */}
      <motion.div
        animate={{
          scale: [1.1, 1.5, 1.1],
          opacity: [0.15, 0.3, 0.15],
          x: [0, -80, 0],
          y: [0, 70, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-gradient-to-br from-[#00D9FF] via-[#FFD700] to-transparent rounded-full blur-3xl"
      />

      {/* Fuchsia-Violet Orb */}
      <motion.div
        animate={{
          scale: [1.1, 1.4, 1.1],
          opacity: [0.1, 0.25, 0.1],
          x: [0, -120, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
        className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-to-br from-[#E935C1] via-[#B565D8] to-transparent rounded-full blur-3xl"
      />
    </>
  );
}
