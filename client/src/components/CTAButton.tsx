import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { type ReactNode } from "react";

interface CTAButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "outline";
  size?: "default" | "lg" | "sm";
  className?: string;
  dataTestId?: string;
}

export function CTAButton({ 
  children, 
  onClick, 
  href, 
  variant = "default",
  size = "lg",
  className = "",
  dataTestId
}: CTAButtonProps) {
  const handleClick = () => {
    if (href) {
      window.location.href = href;
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button
        onClick={handleClick}
        variant={variant}
        size={size}
        className={`rounded-full shadow-lg ${className}`}
        data-testid={dataTestId}
      >
        {children}
      </Button>
    </motion.div>
  );
}
