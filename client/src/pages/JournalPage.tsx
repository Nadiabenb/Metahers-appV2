import { motion } from "framer-motion";
import { BookOpen, Flame } from "lucide-react";
import { JournalEditor } from "@/components/JournalEditor";
import { useJournal } from "@/hooks/useJournal";

export default function JournalPage() {
  const { streak } = useJournal();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-champagne">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-4 shadow-md">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-onyx">
                Your Personal Space
              </span>
            </div>

            <h1 className="font-serif text-5xl font-bold text-onyx mb-4" data-testid="text-page-title">
              Daily Journal
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Capture your thoughts, reflections, and insights as you journey through rituals.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 shadow-md mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wide mb-1">
                    Current Streak
                  </div>
                  <div className="text-2xl font-bold text-onyx" data-testid="text-streak">
                    {streak} {streak === 1 ? 'day' : 'days'}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-muted-foreground uppercase tracking-wide mb-1">
                  Next Milestone
                </div>
                <div className="text-lg font-semibold text-onyx">
                  {streak < 7 ? '7 days 🎯' : streak < 30 ? '30 days 🏆' : 'Champion! 👑'}
                </div>
              </div>
            </div>
          </div>

          <JournalEditor />

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
