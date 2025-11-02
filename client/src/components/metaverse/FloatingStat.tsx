import { motion } from "framer-motion";

interface FloatingStatProps {
  value: string;
  label: string;
  delay?: number;
  className?: string;
}

export function FloatingStat({ value, label, delay = 0, className = "" }: FloatingStatProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      whileHover={{ y: -8, boxShadow: "0 20px 60px rgba(181,101,216,0.4)" }}
      className={`backdrop-blur-xl bg-white/5 rounded-2xl p-8 border border-white/10 text-center ${className}`}
    >
      <div className="text-6xl font-bold font-serif bg-gradient-to-r from-[#FFD700] via-[#FFF] to-[#FFD700] bg-clip-text text-transparent mb-2">
        {value}
      </div>
      <div className="text-foreground/70 text-lg">{label}</div>
    </motion.div>
  );
}
