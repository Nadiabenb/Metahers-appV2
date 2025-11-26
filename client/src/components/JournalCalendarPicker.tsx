import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {  ChevronLeft, ChevronRight, Calendar, CheckCircle2, Circle, Sparkles, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths } from "date-fns";
import { useQuery } from "@tanstack/react-query";

interface JournalCalendarPickerProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  className?: string;
}

export function JournalCalendarPicker({ selectedDate, onDateSelect, className = "" }: JournalCalendarPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  
  // Sync currentMonth when selectedDate changes from outside (e.g., "Jump to today")
  useEffect(() => {
    setCurrentMonth(selectedDate);
  }, [selectedDate]);

  // Fetch journal entries for the current month to show which days have entries
  const firstDay = startOfMonth(currentMonth);
  const lastDay = endOfMonth(currentMonth);
  const { data: entries } = useQuery<Array<{ date: string; mood: string | null }>>({
    queryKey: ["/api/journal/entries", format(currentMonth, "yyyy-MM")],
    queryFn: async () => {
      const res = await fetch(`/api/journal/list?month=${format(currentMonth, "yyyy-MM")}`, {
        credentials: "include",
      });
      if (!res.ok) return [];
      return await res.json();
    },
  });

  const daysInMonth = eachDayOfInterval({ start: firstDay, end: lastDay });
  const startDayOfWeek = firstDay.getDay();

  const handlePrevMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    onDateSelect(today);
  };

  const handleMonthYearSelect = (month: number, year: number) => {
    const newDate = new Date(year, month, 1);
    setCurrentMonth(newDate);
    setShowMonthPicker(false);
  };

  // Generate months and years for quick picker
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i); // 2 years ago to 2 years ahead

  const hasEntry = (date: Date) => {
    if (!entries) return false;
    const dateStr = format(date, "yyyy-MM-dd");
    return entries.some(entry => entry.date === dateStr);
  };

  const getMood = (date: Date): string | null => {
    if (!entries) return null;
    const dateStr = format(date, "yyyy-MM-dd");
    const entry = entries.find(entry => entry.date === dateStr);
    return entry?.mood || null;
  };

  // Mood color mapping (jewel-tone neon palette)
  const getMoodColor = (mood: string | null): { bg: string; border: string; text: string } => {
    if (!mood) return { bg: "", border: "", text: "" };
    
    const moodColors: Record<string, { bg: string; border: string; text: string }> = {
      happy: { 
        bg: "bg-[hsl(var(--liquid-gold))]/15",
        border: "border-[hsl(var(--liquid-gold))]", 
        text: "text-[hsl(var(--liquid-gold))]"
      },
      peaceful: { 
        bg: "bg-[hsl(var(--aurora-teal))]/15", 
        border: "border-[hsl(var(--aurora-teal))]",
        text: "text-[hsl(var(--aurora-teal))]"
      },
      motivated: { 
        bg: "bg-[hsl(var(--hyper-violet))]/15", 
        border: "border-[hsl(var(--hyper-violet))]",
        text: "text-[hsl(var(--hyper-violet))]"
      },
      reflective: { 
        bg: "bg-[hsl(var(--magenta-quartz))]/15", 
        border: "border-[hsl(var(--magenta-quartz))]",
        text: "text-[hsl(var(--magenta-quartz))]"
      },
      sad: { 
        bg: "bg-blue-400/15", 
        border: "border-blue-400",
        text: "text-blue-400"
      },
      anxious: { 
        bg: "bg-orange-400/15", 
        border: "border-orange-400",
        text: "text-orange-400"
      },
      tired: { 
        bg: "bg-gray-400/15", 
        border: "border-gray-400",
        text: "text-gray-400"
      },
      inspired: { 
        bg: "bg-[hsl(var(--cyber-fuchsia))]/15", 
        border: "border-[hsl(var(--cyber-fuchsia))]",
        text: "text-[hsl(var(--cyber-fuchsia))]"
      },
    };
    
    return moodColors[mood] || { bg: "", border: "", text: "" };
  };

  // Check if a date is part of ANY consecutive streak (2+ days)
  const isPartOfStreak = (date: Date): boolean => {
    if (!entries || entries.length === 0) return false;
    
    const dateStr = format(date, "yyyy-MM-dd");
    
    // Build a Set of all entry dates for quick lookup
    const entryDates = new Set(entries.map(e => e.date));
    
    // Check if this date has an entry
    if (!entryDates.has(dateStr)) return false;
    
    // Check if the previous day has an entry
    const prevDay = new Date(date);
    prevDay.setDate(prevDay.getDate() - 1);
    const prevDayStr = format(prevDay, "yyyy-MM-dd");
    
    // Check if the next day has an entry
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDayStr = format(nextDay, "yyyy-MM-dd");
    
    // Part of a streak if either adjacent day has an entry
    return entryDates.has(prevDayStr) || entryDates.has(nextDayStr);
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(var(--liquid-gold))]/20 to-[hsl(var(--cyber-fuchsia))]/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[hsl(var(--liquid-gold))]" />
            </div>
            <div>
              <button
                onClick={() => setShowMonthPicker(!showMonthPicker)}
                className="font-cormorant text-2xl font-bold text-foreground hover:text-primary transition-colors cursor-pointer text-left"
                data-testid="button-toggle-month-picker"
              >
                {format(currentMonth, "MMMM yyyy")}
              </button>
              <p className="text-sm text-foreground">
                {showMonthPicker ? "Choose month & year" : "Select a date to journal"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevMonth}
              data-testid="button-prev-month"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToday}
              data-testid="button-today"
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextMonth}
              data-testid="button-next-month"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Month/Year Quick Picker */}
        {showMonthPicker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border/40 pt-4 mt-4"
          >
            <div className="grid grid-cols-3 gap-2 mb-4">
              {months.map((month, index) => (
                <Button
                  key={month}
                  variant={currentMonth.getMonth() === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleMonthYearSelect(index, currentMonth.getFullYear())}
                  className="text-xs"
                  data-testid={`button-month-${index}`}
                >
                  {month.substring(0, 3)}
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-5 gap-2">
              {years.map((year) => (
                <Button
                  key={year}
                  variant={currentMonth.getFullYear() === year ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleMonthYearSelect(currentMonth.getMonth(), year)}
                  data-testid={`button-year-${year}`}
                >
                  {year}
                </Button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Calendar Grid */}
        <div className="space-y-2">
          {/* Week days */}
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map(day => (
              <div
                key={day}
                className="text-center text-xs font-medium text-foreground uppercase tracking-wide py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: startDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            
            {/* Actual days */}
            {daysInMonth.map((day) => {
              const isSelected = isSameDay(day, selectedDate);
              const isTodayDay = isToday(day);
              const hasJournalEntry = hasEntry(day);
              const dayNum = format(day, "d");
              const dayMood = getMood(day);
              const moodColors = getMoodColor(dayMood);
              const partOfStreak = isPartOfStreak(day);

              return (
                <motion.button
                  key={day.toISOString()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onDateSelect(day)}
                  className={`
                    aspect-square rounded-lg flex flex-col items-center justify-center p-1 relative
                    transition-all duration-200
                    ${isSelected 
                      ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary ring-offset-2 ring-offset-background" 
                      : isTodayDay
                      ? "bg-accent text-accent-foreground border-2 border-primary/50"
                      : hasJournalEntry && dayMood
                      ? `${moodColors.bg} border-2 ${moodColors.border} hover-elevate ${moodColors.text}`
                      : hasJournalEntry
                      ? "bg-muted hover-elevate text-foreground"
                      : "hover-elevate text-foreground"
                    }
                  `}
                  data-testid={`button-date-${format(day, "yyyy-MM-dd")}`}
                >
                  <span className={`text-sm font-medium ${isSelected ? "font-bold" : ""}`}>
                    {dayNum}
                  </span>
                  
                  {/* Entry indicator */}
                  {hasJournalEntry && !isSelected && !partOfStreak && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                      <CheckCircle2 className="w-3 h-3 text-[hsl(var(--aurora-teal))]" />
                    </div>
                  )}
                  
                  {/* Streak indicator (fire emoji) */}
                  {partOfStreak && !isSelected && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                      <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                    </div>
                  )}
                  
                  {/* Today indicator */}
                  {isTodayDay && !isSelected && (
                    <div className="absolute top-0.5 right-0.5">
                      <Sparkles className="w-2.5 h-2.5 text-[hsl(var(--liquid-gold))]" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-xs text-foreground pt-2 border-t border-border/40 flex-wrap">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--aurora-teal))]" />
            <span>Entry</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            <span>Streak</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--liquid-gold))]" />
            <span>Today</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-primary" />
            <span>Selected</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
