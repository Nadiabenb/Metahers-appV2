import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {  ChevronLeft, ChevronRight, Calendar, CheckCircle2, Circle, Sparkles } from "lucide-react";
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
  
  // Sync currentMonth when selectedDate changes from outside (e.g., "Jump to today")
  useEffect(() => {
    setCurrentMonth(selectedDate);
  }, [selectedDate]);

  // Fetch journal entries for the current month to show which days have entries
  const firstDay = startOfMonth(currentMonth);
  const lastDay = endOfMonth(currentMonth);
  const { data: entries } = useQuery<Array<{ date: string }>>({
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

  const hasEntry = (date: Date) => {
    if (!entries) return false;
    const dateStr = format(date, "yyyy-MM-dd");
    return entries.some(entry => entry.date === dateStr);
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
              <h3 className="font-cormorant text-2xl font-bold text-foreground">
                {format(currentMonth, "MMMM yyyy")}
              </h3>
              <p className="text-sm text-muted-foreground">Select a date to journal</p>
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

        {/* Calendar Grid */}
        <div className="space-y-2">
          {/* Week days */}
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map(day => (
              <div
                key={day}
                className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wide py-2"
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
                      : hasJournalEntry
                      ? "bg-muted hover-elevate text-foreground"
                      : "hover-elevate text-muted-foreground"
                    }
                  `}
                  data-testid={`button-date-${format(day, "yyyy-MM-dd")}`}
                >
                  <span className={`text-sm font-medium ${isSelected ? "font-bold" : ""}`}>
                    {dayNum}
                  </span>
                  
                  {/* Entry indicator */}
                  {hasJournalEntry && !isSelected && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                      <CheckCircle2 className="w-3 h-3 text-[hsl(var(--aurora-teal))]" />
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
        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground pt-2 border-t border-border/40">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--aurora-teal))]" />
            <span>Has entry</span>
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
