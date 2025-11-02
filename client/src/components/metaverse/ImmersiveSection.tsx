import { motion, useReducedMotion } from "framer-motion";

interface ImmersiveSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ImmersiveSection({ children, className = "", delay = 0 }: ImmersiveSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-200px" }}
      transition={{ duration: 1, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
