
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Heart, 
  BookOpen, 
  Users, 
  Trophy,
  Crown,
  Zap,
  TrendingUp
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { CompanionDB } from "@shared/schema";

const STAGE_EMOJIS = {
  seedling: "🌱",
  sprout: "🌿",
  blooming: "🌸",
  flourishing: "🌺",
  radiant: "✨"
};

const MOOD_EMOJIS = {
  excited: "🤩",
  curious: "🤔",
  focused: "🎯",
  energized: "⚡",
  peaceful: "😌",
  celebrated: "🎉"
};

export function CareerCompanion() {
  const { toast } = useToast();
  const [showAccessories, setShowAccessories] = useState(false);

  const { data: companion, isLoading } = useQuery<CompanionDB>({
    queryKey: ["/api/companion"],
  });

  const feedMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/companion/feed"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companion"] });
      toast({
        title: "Companion fed! 💚",
        description: "Your Muse loves when you journal your thoughts.",
      });
    },
  });

  const playMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/companion/play"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companion"] });
      toast({
        title: "Playtime! 🎮",
        description: "Your Muse grows stronger with each learning session.",
      });
    },
  });

  const socializeMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/companion/socialize"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companion"] });
      toast({
        title: "Connected! 🤝",
        description: "Your Muse thrives on community engagement.",
      });
    },
  });

  if (isLoading || !companion) {
    return (
      <Card className="editorial-card">
        <CardContent className="p-6">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-32 h-32 bg-muted rounded-full" />
            <div className="h-4 w-32 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalStats = companion.growth + companion.inspiration + companion.connection + companion.mastery;
  const averageHealth = totalStats / 4;

  return (
    <Card className="editorial-card overflow-hidden">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <Badge variant="outline" className="mb-2">
            {companion.stage.charAt(0).toUpperCase() + companion.stage.slice(1)} Stage
          </Badge>
          
          <motion.div
            className="text-8xl my-4 cursor-pointer"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            {STAGE_EMOJIS[companion.stage as keyof typeof STAGE_EMOJIS]}
          </motion.div>

          <h3 className="font-cormorant text-2xl font-bold mb-1">
            {companion.name}
          </h3>
          <p className="text-sm text-foreground flex items-center justify-center gap-2">
            Feeling {companion.currentMood} 
            <span>{MOOD_EMOJIS[companion.currentMood as keyof typeof MOOD_EMOJIS]}</span>
          </p>
        </div>

        {/* Stats */}
        <div className="space-y-3 mb-6">
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[hsl(var(--aurora-teal))]" />
                Growth
              </span>
              <span>{companion.growth}%</span>
            </div>
            <Progress value={companion.growth} className="h-2" />
          </div>

          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[hsl(var(--cyber-fuchsia))]" />
                Inspiration
              </span>
              <span>{companion.inspiration}%</span>
            </div>
            <Progress value={companion.inspiration} className="h-2" />
          </div>

          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[hsl(var(--hyper-violet))]" />
                Connection
              </span>
              <span>{companion.connection}%</span>
            </div>
            <Progress value={companion.connection} className="h-2" />
          </div>

          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[hsl(var(--liquid-gold))]" />
                Mastery
              </span>
              <span>{companion.mastery}%</span>
            </div>
            <Progress value={companion.mastery} className="h-2" />
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => feedMutation.mutate()}
            disabled={feedMutation.isPending}
            className="flex flex-col h-auto py-3"
          >
            <BookOpen className="w-5 h-5 mb-1" />
            <span className="text-xs">Journal</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => playMutation.mutate()}
            disabled={playMutation.isPending}
            className="flex flex-col h-auto py-3"
          >
            <Zap className="w-5 h-5 mb-1" />
            <span className="text-xs">Learn</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => socializeMutation.mutate()}
            disabled={socializeMutation.isPending}
            className="flex flex-col h-auto py-3"
          >
            <Users className="w-5 h-5 mb-1" />
            <span className="text-xs">Connect</span>
          </Button>
        </div>

        {/* Accessories */}
        {companion.unlockedAccessories && companion.unlockedAccessories.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAccessories(!showAccessories)}
              className="w-full flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Crown className="w-4 h-4" />
                Accessories ({companion.unlockedAccessories.length})
              </span>
              <Sparkles className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
