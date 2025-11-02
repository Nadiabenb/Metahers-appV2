import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface PortalButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  showIcon?: boolean;
  variant?: "primary" | "outline";
  className?: string;
  testId?: string;
}

export function PortalButton({
  onClick,
  children,
  showIcon = true,
  variant = "primary",
  className = "",
  testId
}: PortalButtonProps) {
  if (variant === "primary") {
    return (
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.08, boxShadow: "0 0 40px rgba(255,215,0,0.6)" }}
        whileTap={{ scale: 0.95 }}
        className={`relative w-full sm:w-auto px-12 py-6 rounded-full overflow-hidden group ${className}`}
        data-testid={testId}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] via-[#FFF] to-[#FFD700] bg-[size:200%_100%]" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-50"
          animate={{
            x: ['-100%', '200%']
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 0.5
          }}
        />
        <span className="relative z-10 font-bold text-xl text-background flex items-center gap-3 justify-center">
          {children}
          {showIcon && <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />}
        </span>
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className={`w-full sm:w-auto px-12 py-6 rounded-full backdrop-blur-2xl bg-white/5 border-2 border-[hsl(var(--liquid-gold))]/50 text-foreground font-bold text-xl flex items-center justify-center gap-3 relative overflow-hidden group ${className}`}
      data-testid={testId}
    >
      {children}
    </motion.button>
  );
}
