
import { motion } from "framer-motion";
import { CareerCompanion } from "@/components/CareerCompanion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, Heart } from "lucide-react";

export default function CompanionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-cormorant text-4xl md:text-5xl font-bold metallic-text mb-4">
            Your Career Companion
          </h1>
          <p className="text-lg text-foreground max-w-2xl mx-auto">
            Meet your personal growth companion that evolves with your professional journey
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[hsl(var(--cyber-fuchsia))]" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-foreground">
                Your companion grows as you journal, learn, and connect. Each activity boosts different stats!
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[hsl(var(--aurora-teal))]" />
                  Evolution Stages
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-foreground">
                From Seedling to Radiant - watch your companion transform as you master new skills!
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Heart className="w-5 h-5 text-[hsl(var(--magenta-quartz))]" />
                  Unlock Rewards
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-foreground">
                Earn exclusive accessories and traits as you complete learning milestones!
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <CareerCompanion />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Care Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Badge variant="outline" className="mb-2">📖 Journal</Badge>
                  <p className="text-sm text-foreground">
                    Boosts <strong>Inspiration</strong>. Write regularly to keep your companion inspired!
                  </p>
                </div>

                <div>
                  <Badge variant="outline" className="mb-2">⚡ Learn</Badge>
                  <p className="text-sm text-foreground">
                    Boosts <strong>Growth & Mastery</strong>. Complete experiences to help your companion level up!
                  </p>
                </div>

                <div>
                  <Badge variant="outline" className="mb-2">🤝 Connect</Badge>
                  <p className="text-sm text-foreground">
                    Boosts <strong>Connection</strong>. Engage with the community to strengthen bonds!
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-foreground italic">
                    💡 <strong>Pro Tip:</strong> Balance all activities for the fastest evolution!
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
