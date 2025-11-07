import { motion } from "framer-motion";
import { Trophy, Sparkles, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";

interface SectionCompleteCelebrationProps {
  sectionTitle: string;
  isExperienceComplete: boolean;
  onClose: () => void;
  spaceColor: string;
}

export default function SectionCompleteCelebration({
  sectionTitle,
  isExperienceComplete,
  onClose,
  spaceColor,
}: SectionCompleteCelebrationProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      {isExperienceComplete && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          colors={[
            "hsl(var(--hyper-violet))",
            "hsl(var(--magenta-quartz))",
            "hsl(var(--cyber-fuchsia))",
            "hsl(var(--aurora-teal))",
            "hsl(var(--liquid-gold))",
          ]}
        />
      )}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-background via-background to-primary/10 border border-border p-8 text-center shadow-2xl">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{
                  x: Math.random() * 100 + "%",
                  y: "100%",
                  rotate: Math.random() * 360,
                }}
                animate={{
                  y: "-20%",
                  rotate: Math.random() * 720,
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              >
                <Star className="w-4 h-4 text-primary" />
              </motion.div>
            ))}
          </div>

          <div className="relative z-10">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", damping: 15 }}
              className="mb-6"
            >
              {isExperienceComplete ? (
                <div className="relative inline-block">
                  <Trophy className="w-20 h-20 mx-auto text-[hsl(var(--liquid-gold))]" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-2 -right-2"
                  >
                    <Sparkles className="w-8 h-8 text-[hsl(var(--aurora-teal))]" />
                  </motion.div>
                </div>
              ) : (
                <CheckCircle2 className="w-20 h-20 mx-auto text-[hsl(var(--aurora-teal))]" />
              )}
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-serif text-3xl font-bold mb-3"
            >
              {isExperienceComplete ? "Experience Complete!" : "Section Complete!"}
            </motion.h2>

            {/* Message */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground mb-6"
            >
              {isExperienceComplete ? (
                <>
                  You've completed all sections of this transformational experience. You're now equipped with valuable new skills and insights!
                </>
              ) : (
                <>
                  Excellent work on <span className="font-semibold text-foreground">"{sectionTitle}"</span>. You're making great progress!
                </>
              )}
            </motion.p>

            {/* Stats/Encouragement */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 mb-6"
            >
              <p className="text-sm italic text-muted-foreground">
                {isExperienceComplete
                  ? "Transformation happens through consistent action. You're building the future you deserve!"
                  : "Every section completed is another step toward mastery. Keep going!"}
              </p>
            </motion.div>

            {/* Close button */}
            {!isExperienceComplete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="gap-2"
                  data-testid="button-close-celebration"
                >
                  Continue Learning
                  <Sparkles className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
