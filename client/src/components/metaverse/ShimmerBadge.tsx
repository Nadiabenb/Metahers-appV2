import { motion } from "framer-motion";

interface ShimmerBadgeProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function ShimmerBadge({ children, icon, className = "" }: ShimmerBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.3 }}
      className={`inline-flex items-center gap-3 backdrop-blur-2xl bg-gradient-to-r from-white/10 to-white/5 px-8 py-4 rounded-full border border-[hsl(var(--liquid-gold))]/30 relative overflow-hidden group ${className}`}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{
          x: ['-100%', '200%']
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 2
        }}
      />
      {icon}
      <span className="text-base font-medium tracking-widest uppercase relative z-10">
        {children}
      </span>
    </motion.div>
  );
}
