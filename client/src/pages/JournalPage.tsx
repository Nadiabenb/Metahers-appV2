import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Flame, History, Calendar } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { LuxuryJournalEditor } from "@/components/LuxuryJournalEditor";
import { JournalCalendarPicker } from "@/components/JournalCalendarPicker";
import { DailyCalendar } from "@/components/DailyCalendar";
import { useJournal } from "@/hooks/useJournal";
import { format } from "date-fns";

export default function JournalPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const { streak } = useJournal(dateStr);

  const isToday = format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-3 neon-glow-violet">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium tracking-wide uppercase">
                Your Personal Space
              </span>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl font-bold text-gradient-violet mb-3" data-testid="text-page-title">
              Daily AI-Powered Journal
            </h1>
            <p className="text-base text-foreground/80 max-w-2xl mx-auto mb-4">
              MetaHers Mind Spa: Calendar, Notebook & Daily Inspiration
            </p>
            <div className="flex gap-2 justify-center flex-wrap">
              <Button
                variant={showCalendar ? "default" : "outline"}
                size="sm"
                onClick={() => setShowCalendar(!showCalendar)}
                data-testid="button-toggle-calendar"
              >
                <Calendar className="w-4 h-4 mr-2" />
                {showCalendar ? "Hide Calendar" : "Calendar"}
              </Button>
              <Link href="/journal/history">
                <Button variant="outline" size="sm" data-testid="button-view-history">
                  <History className="w-4 h-4 mr-2" />
                  History
                </Button>
              </Link>
            </div>
          </div>

          {/* Top Section - Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {/* Daily Inspiration - Takes 2 columns on large screens */}
            <div className="lg:col-span-2">
              <DailyCalendar />
            </div>

            {/* Streak Card - Takes 1 column */}
            <div className="editorial-card p-4 relative overflow-hidden h-full flex flex-col justify-center">
              <div className="absolute inset-0 gradient-violet-magenta opacity-5" />
              <div className="relative z-10">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--liquid-gold))]/30 to-[hsl(var(--cyber-fuchsia))]/10 flex items-center justify-center">
                    <Flame className="w-6 h-6 text-[hsl(var(--liquid-gold))]" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Current Streak
                    </div>
                    <div className="text-3xl font-bold text-foreground" data-testid="text-streak">
                      {streak}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {streak === 1 ? 'day' : 'days'}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    {streak < 7 ? '🎯 Next: 7 days' : streak < 30 ? '🏆 Next: 30 days' : '👑 Champion!'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Picker */}
          {showCalendar && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <JournalCalendarPicker
                selectedDate={selectedDate}
                onDateSelect={(date) => {
                  setSelectedDate(date);
                  setShowCalendar(false);
                }}
              />
            </motion.div>
          )}

          {/* Current Date Display & Journal Editor */}
          <div className="editorial-card p-6">
            <div className="mb-6 text-center">
              <h2 className="font-cormorant text-2xl md:text-3xl font-bold text-foreground mb-2">
                {format(selectedDate, "EEEE, MMMM d, yyyy")}
              </h2>
              {!isToday && (
                <p className="text-sm text-muted-foreground">
                  Viewing past entry • <button
                    onClick={() => setSelectedDate(new Date())}
                    className="text-primary hover:underline"
                    data-testid="button-back-to-today"
                  >
                    Jump to today
                  </button>
                </p>
              )}
            </div>

            <LuxuryJournalEditor selectedDate={dateStr} />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-center text-xs text-muted-foreground"
          >
            <p>Your journal entries are securely saved to your account.</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
