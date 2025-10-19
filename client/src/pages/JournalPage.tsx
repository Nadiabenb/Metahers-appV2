import { motion } from "framer-motion";
import { BookOpen, Flame, History } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { EnhancedJournalEditor } from "@/components/EnhancedJournalEditor";
import { useJournal } from "@/hooks/useJournal";

export default function JournalPage() {
  const { streak } = useJournal();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 glass-card px-6 py-3 rounded-full mb-4 neon-glow-violet">
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium tracking-wide uppercase">
                Your Personal Space
              </span>
            </div>

            <h1 className="font-serif text-5xl font-bold text-gradient-violet mb-4" data-testid="text-page-title">
              Daily Journal
            </h1>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-4">
              Capture your thoughts, reflections, and insights as you journey through rituals.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/journal/history">
                <Button variant="outline" data-testid="button-view-history">
                  <History className="w-4 h-4 mr-2" />
                  View History
                </Button>
              </Link>
            </div>
          </div>

          <div className="editorial-card p-6 mb-8 relative overflow-hidden">
            <div className="absolute inset-0 gradient-violet-magenta opacity-5" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--liquid-gold))]/30 to-[hsl(var(--cyber-fuchsia))]/10 flex items-center justify-center">
                    <Flame className="w-6 h-6 text-[hsl(var(--liquid-gold))]" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wide mb-1">
                      Current Streak
                    </div>
                    <div className="text-2xl font-bold text-foreground" data-testid="text-streak">
                      {streak} {streak === 1 ? 'day' : 'days'}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-muted-foreground uppercase tracking-wide mb-1">
                    Next Milestone
                  </div>
                  <div className="text-lg font-semibold text-foreground">
                    {streak < 7 ? '7 days 🎯' : streak < 30 ? '30 days 🏆' : 'Champion! 👑'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <EnhancedJournalEditor />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center text-sm text-muted-foreground"
          >
            <p>Your journal entries are securely saved to your account.</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
