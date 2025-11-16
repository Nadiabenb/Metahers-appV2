
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageLoadRevealProps {
  children: ReactNode;
  delay?: number;
}

/**
 * High-impact page load reveal with staggered animations
 * Implements the "one well-orchestrated page load" principle
 */
export function PageLoadReveal({ children, delay = 0 }: PageLoadRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay: delay,
        ease: [0.22, 1, 0.36, 1], // Custom easing for luxury feel
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Container for staggered reveals - use for hero sections
 */
export function StaggeredReveal({ children }: { children: ReactNode[] }) {
  return (
    <>
      {children.map((child, index) => (
        <PageLoadReveal key={index} delay={index * 0.15}>
          {child}
        </PageLoadReveal>
      ))}
    </>
  );
}
