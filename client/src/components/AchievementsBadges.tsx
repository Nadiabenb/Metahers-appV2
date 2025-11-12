import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Award, 
  Flame, 
  Trophy, 
  Star, 
  Target, 
  Zap,
  BookOpen,
  Tag as TagIcon,
  Heart
} from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Achievement {
  id: string;
  achievementKey: string;
  unlockedAt: string;
}

const ACHIEVEMENT_DEFINITIONS = [
  {
    key: 'first_entry',
    title: 'First Steps',
    description: 'Write your first journal entry',
    icon: BookOpen,
    color: 'text-[hsl(var(--aurora-teal))]',
    requirement: '1 entry',
  },
  {
    key: 'streak_3',
    title: 'Building Momentum',
    description: 'Maintain a 3-day writing streak',
    icon: Flame,
    color: 'text-[hsl(var(--cyber-fuchsia))]',
    requirement: '3 day streak',
  },
  {
    key: 'streak_7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day writing streak',
    icon: Star,
    color: 'text-[hsl(var(--liquid-gold))]',
    requirement: '7 day streak',
  },
  {
    key: 'streak_30',
    title: 'Consistency Champion',
    description: 'Maintain a 30-day writing streak',
    icon: Trophy,
    color: 'text-[hsl(var(--liquid-gold))]',
    requirement: '30 day streak',
  },
  {
    key: 'word_warrior_1k',
    title: 'Word Warrior',
    description: 'Write 1,000 total words',
    icon: Target,
    color: 'text-[hsl(var(--aurora-teal))]',
    requirement: '1,000 words',
  },
  {
    key: 'word_warrior_5k',
    title: 'Prolific Writer',
    description: 'Write 5,000 total words',
    icon: Zap,
    color: 'text-[hsl(var(--hyper-violet))]',
    requirement: '5,000 words',
  },
  {
    key: 'mood_master',
    title: 'Emotional Explorer',
    description: 'Record all 5 different moods',
    icon: Heart,
    color: 'text-[hsl(var(--magenta-quartz))]',
    requirement: '5 moods tracked',
  },
  {
    key: 'tag_explorer',
    title: 'Tag Master',
    description: 'Use 10 different tags',
    icon: TagIcon,
    color: 'text-[hsl(var(--hyper-violet))]',
    requirement: '10 unique tags',
  },
  {
    key: 'consistent_writer',
    title: 'Dedicated Journaler',
    description: 'Write 10 journal entries',
    icon: Award,
    color: 'text-[hsl(var(--aurora-teal))]',
    requirement: '10 entries',
  },
];

export function AchievementsBadges() {
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const { toast } = useToast();

  // Fetch unlocked achievements
  const { data: achievements = [], isLoading } = useQuery<Achievement[]>({
    queryKey: ['/api/achievements'],
  });

  // Check for new achievements
  const checkAchievements = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/achievements/check', {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to check achievements');
      }
      return response.json();
    },
    onSuccess: (data: any) => {
      if (data.newlyUnlocked && data.newlyUnlocked.length > 0) {
        setNewAchievements(data.newlyUnlocked);
        
        // Show celebration toast
        toast({
          title: "🎉 Achievement Unlocked!",
          description: `You've unlocked ${data.newlyUnlocked.length} new achievement(s)!`,
          duration: 5000,
        });
        
        // Refresh achievements list
        queryClient.invalidateQueries({ queryKey: ['/api/achievements'] });
      }
    },
  });

  // Check achievements on mount
  useEffect(() => {
    checkAchievements.mutate();
  }, []);

  const unlockedKeys = new Set(achievements.map(a => a.achievementKey));
  const unlockedCount = achievements.length;
  const totalCount = ACHIEVEMENT_DEFINITIONS.length;

  if (isLoading) {
    return (
      <Card data-testid="card-achievements-loading">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Sparkles className="w-6 h-6 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="card-achievements">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Achievements
          </div>
          <Badge variant="secondary" data-testid="badge-achievement-count">
            {unlockedCount} / {totalCount}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACHIEVEMENT_DEFINITIONS.map((achievement) => {
            const isUnlocked = unlockedKeys.has(achievement.key);
            const isNew = newAchievements.some(a => a.achievementKey === achievement.key);
            const Icon = achievement.icon;

            return (
              <motion.div
                key={achievement.key}
                initial={isNew ? { scale: 0.8, rotate: -10 } : false}
                animate={isNew ? { 
                  scale: [0.8, 1.1, 1], 
                  rotate: [-10, 5, 0],
                  transition: { duration: 0.5 }
                } : false}
                data-testid={`achievement-${achievement.key}`}
              >
                <div
                  className={`
                    relative p-4 rounded-lg border-2 transition-all
                    ${isUnlocked 
                      ? 'bg-card border-primary shadow-md hover-elevate' 
                      : 'bg-muted/30 border-muted opacity-60'
                    }
                  `}
                >
                  {isUnlocked && isNew && (
                    <motion.div
                      className="absolute -top-2 -right-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Badge variant="default" className="bg-[hsl(var(--gold-highlight))] text-black">
                        NEW!
                      </Badge>
                    </motion.div>
                  )}
                  
                  <div className="flex items-start gap-3">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center
                      ${isUnlocked 
                        ? 'bg-primary/10' 
                        : 'bg-muted/50'
                      }
                    `}>
                      <Icon 
                        className={`w-6 h-6 ${isUnlocked ? achievement.color : 'text-muted-foreground'}`} 
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className={`font-semibold mb-1 ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {achievement.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        {achievement.description}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {achievement.requirement}
                      </Badge>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {unlockedCount === totalCount && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-[hsl(var(--liquid-gold))]/10 border-2 border-[hsl(var(--liquid-gold))]/30 rounded-lg text-center"
            data-testid="all-achievements-unlocked"
          >
            <Trophy className="w-12 h-12 mx-auto mb-2 text-[hsl(var(--liquid-gold))]" />
            <h3 className="text-lg font-bold text-[hsl(var(--liquid-gold))] mb-1">
              Achievement Master!
            </h3>
            <p className="text-sm text-muted-foreground">
              You've unlocked all achievements. Your dedication is inspiring!
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
