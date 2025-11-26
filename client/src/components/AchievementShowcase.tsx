import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import AchievementBadge, { AchievementType } from "./AchievementBadge";

type UserAchievement = {
  achievementKey: AchievementType;
  unlockedAt: string;
};

type AchievementShowcaseProps = {
  achievements: UserAchievement[];
  allAchievements?: AchievementType[];
};

const DEFAULT_ACHIEVEMENTS: AchievementType[] = [
  "first_experience",
  "first_space_complete",
  "streak_7",
  "streak_30",
  "high_confidence",
  "all_free_complete",
  "pro_unlock",
  "master_learner",
];

export default function AchievementShowcase({
  achievements,
  allAchievements = DEFAULT_ACHIEVEMENTS,
}: AchievementShowcaseProps) {
  const unlockedKeys = new Set(achievements.map(a => a.achievementKey));
  const unlockedCount = achievements.length;
  const totalCount = allAchievements.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Trophy className="w-8 h-8 text-primary" />
          <div>
            <h2 className="text-2xl font-serif font-bold">Achievements</h2>
            <p className="text-sm text-foreground">
              {unlockedCount} of {totalCount} unlocked
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-primary">
            {Math.round((unlockedCount / totalCount) * 100)}%
          </p>
          <p className="text-xs text-foreground">Complete</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {allAchievements.map((achievementId, index) => {
          const achievement = achievements.find(a => a.achievementKey === achievementId);
          const isUnlocked = unlockedKeys.has(achievementId);

          return (
            <motion.div
              key={achievementId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <AchievementBadge
                achievementId={achievementId}
                unlocked={isUnlocked}
                unlockedAt={achievement?.unlockedAt}
                size="md"
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
