import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/use-window-size";

interface ConfettiCelebrationProps {
  trigger: boolean;
  duration?: number;
}

export function ConfettiCelebration({ trigger, duration = 3000 }: ConfettiCelebrationProps) {
  const [isActive, setIsActive] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (trigger) {
      setIsActive(true);
      const timeout = setTimeout(() => {
        setIsActive(false);
      }, duration);
      return () => clearTimeout(timeout);
    }
  }, [trigger, duration]);

  if (!isActive) return null;

  return (
    <Confetti
      width={width}
      height={height}
      recycle={false}
      numberOfPieces={300}
      colors={["#5611A7", "#FF3B9C", "#FF8F5B", "#F8D57E", "#8B5CF6", "#EC4899"]}
      gravity={0.3}
      data-testid="confetti-celebration"
    />
  );
}
