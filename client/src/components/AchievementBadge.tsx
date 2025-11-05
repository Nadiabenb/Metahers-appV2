import { motion } from "framer-motion";
import { Trophy, Star, Flame, Zap, Target, Award, Crown, Rocket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type AchievementType = 
  | "first_experience"
  | "first_space_complete"
  | "streak_7"
  | "streak_30"
  | "high_confidence"
  | "all_free_complete"
  | "pro_unlock"
  | "master_learner";

type Achievement = {
  id: AchievementType;
  title: string;
  description: string;
  icon: typeof Trophy;
  color: string;
  rarity: "common" | "rare" | "epic" | "legendary";
};

const ACHIEVEMENTS: Record<AchievementType, Achievement> = {
  first_experience: {
    id: "first_experience",
    title: "First Step",
    description: "Completed your first transformational experience",
    icon: Star,
    color: "from-blue-500 to-cyan-500",
    rarity: "common",
  },
  first_space_complete: {
    id: "first_space_complete",
    title: "Space Explorer",
    description: "Completed all experiences in one space",
    icon: Rocket,
    color: "from-purple-500 to-pink-500",
    rarity: "rare",
  },
  streak_7: {
    id: "streak_7",
    title: "Week Warrior",
    description: "Maintained a 7-day learning streak",
    icon: Flame,
    color: "from-orange-500 to-red-500",
    rarity: "rare",
  },
  streak_30: {
    id: "streak_30",
    title: "Consistency Queen",
    description: "Achieved a 30-day learning streak",
    icon: Crown,
    color: "from-yellow-500 to-orange-500",
    rarity: "epic",
  },
  high_confidence: {
    id: "high_confidence",
    title: "Confidence Builder",
    description: "Reached 8+ confidence in 5 experiences",
    icon: Target,
    color: "from-green-500 to-emerald-500",
    rarity: "rare",
  },
  all_free_complete: {
    id: "all_free_complete",
    title: "Foundation Master",
    description: "Completed all free experiences",
    icon: Award,
    color: "from-teal-500 to-blue-500",
    rarity: "epic",
  },
  pro_unlock: {
    id: "pro_unlock",
    title: "Pro Learner",
    description: "Unlocked Pro membership",
    icon: Zap,
    color: "from-violet-500 to-purple-500",
    rarity: "epic",
  },
  master_learner: {
    id: "master_learner",
    title: "Master of MetaHers",
    description: "Completed all 42 experiences",
    icon: Trophy,
    color: "from-amber-500 to-yellow-500",
    rarity: "legendary",
  },
};

const RARITY_COLORS = {
  common: "bg-slate-500",
  rare: "bg-blue-500",
  epic: "bg-purple-500",
  legendary: "bg-amber-500",
};

type AchievementBadgeProps = {
  achievementId: AchievementType;
  unlocked?: boolean;
  unlockedAt?: string;
  showUnlockAnimation?: boolean;
  size?: "sm" | "md" | "lg";
};

export default function AchievementBadge({
  achievementId,
  unlocked = false,
  unlockedAt,
  showUnlockAnimation = false,
  size = "md",
}: AchievementBadgeProps) {
  const achievement = ACHIEVEMENTS[achievementId];
  const Icon = achievement.icon;

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <motion.div
      initial={showUnlockAnimation ? { scale: 0, rotate: -180 } : {}}
      animate={showUnlockAnimation ? { scale: 1, rotate: 0 } : {}}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      <Card className={`${unlocked ? 'hover-elevate' : 'opacity-50'} cursor-pointer`}>
        <CardContent className="p-4 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${achievement.color} flex items-center justify-center relative`}>
              {!unlocked && (
                <div className="absolute inset-0 bg-muted/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <div className="text-2xl">🔒</div>
                </div>
              )}
              <Icon className={`${iconSizes[size]} text-white`} />
            </div>

            <div>
              <h4 className="font-semibold mb-1">{achievement.title}</h4>
              <p className="text-xs text-muted-foreground mb-2">
                {achievement.description}
              </p>
              <Badge variant="outline" className={`${RARITY_COLORS[achievement.rarity]} text-white border-0 text-xs`}>
                {achievement.rarity.toUpperCase()}
              </Badge>
            </div>

            {unlocked && unlockedAt && (
              <p className="text-xs text-muted-foreground">
                Unlocked {new Date(unlockedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export { ACHIEVEMENTS };
