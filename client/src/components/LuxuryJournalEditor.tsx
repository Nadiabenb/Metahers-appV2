import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles,
  Heart,
  Star,
  Trophy,
  Save,
  Plus,
  X,
  CheckCircle2,
  Circle,
  Calendar,
  Droplet,
  Dumbbell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { StructuredJournalContent, JournalTodoItem, JournalEvent } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface LuxuryJournalEditorProps {
  selectedDate?: string;
}

const MOODS = [
  { emoji: "😊", label: "Happy", value: "happy" },
  { emoji: "😌", label: "Peaceful", value: "peaceful" },
  { emoji: "💪", label: "Motivated", value: "motivated" },
  { emoji: "🤔", label: "Reflective", value: "reflective" },
  { emoji: "😢", label: "Sad", value: "sad" },
  { emoji: "😰", label: "Anxious", value: "anxious" },
  { emoji: "😴", label: "Tired", value: "tired" },
  { emoji: "✨", label: "Inspired", value: "inspired" },
];

export function LuxuryJournalEditor({ selectedDate }: LuxuryJournalEditorProps = {}) {
  const { toast } = useToast();
  const dateStr = selectedDate || new Date().toISOString().split('T')[0];
  
  // State
  const [mood, setMood] = useState<string>("");
  const [todos, setTodos] = useState<JournalTodoItem[]>([]);
  const [gratitude, setGratitude] = useState<string[]>([]);
  const [wins, setWins] = useState<string[]>([]);
  const [freeformNotes, setFreeformNotes] = useState("");
  const [events, setEvents] = useState<JournalEvent[]>([]);
  const [waterIntake, setWaterIntake] = useState(0);
  const [fitnessGoals, setFitnessGoals] = useState("");
  const [fitnessTracking, setFitnessTracking] = useState("");
  
  // Input states
  const [newTodo, setNewTodo] = useState("");
  const [newGratitude, setNewGratitude] = useState("");
  const [newWin, setNewWin] = useState("");
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventTime, setNewEventTime] = useState("");
  
  // Track loading and dirty state
  const isLoading = useRef(true);
  const hasUserEdits = useRef(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevDateStr = useRef<string>(dateStr);

  // Fetch journal data
  const { data: journalData } = useQuery({
    queryKey: ["/api/journal", dateStr],
    queryFn: async () => {
      const res = await fetch(`/api/journal?date=${dateStr}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch journal");
      return await res.json();
    },
  });

  // Load data when fetched or date changes
  useEffect(() => {
    // Only flush if date actually changed and we have pending edits
    if (prevDateStr.current !== dateStr) {
      // Flush any pending saves for the PREVIOUS date before switching
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // If user had edits, save immediately using the PREVIOUS date
      if (hasUserEdits.current) {
        const flushDate = prevDateStr.current;
        const flushData = {
          structuredContent: {
            todos,
            gratitude,
            wins,
            freeformNotes,
            events,
            waterIntake,
            fitnessGoals,
            fitnessTracking,
          },
          mood,
        };
        
        // Flush save synchronously for previous date
        fetch(`/api/journal`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            ...flushData,
            content: "",
            date: flushDate,
            streak: 0,
          }),
        }).then(() => {
          queryClient.invalidateQueries({ queryKey: ["/api/journal/entries"] });
        }).catch((error) => {
          console.error("Flush error:", error);
        });
      }
      
      // Update prevDateStr to current
      prevDateStr.current = dateStr;
    }
    
    // Mark as loading and reset dirty flag
    isLoading.current = true;
    hasUserEdits.current = false;
    
    // Always clear state first when date changes
    setTodos([]);
    setGratitude([]);
    setWins([]);
    setFreeformNotes("");
    setMood("");
    setEvents([]);
    setWaterIntake(0);
    setFitnessGoals("");
    setFitnessTracking("");
    
    // Then load data if it exists
    if (journalData && typeof journalData === 'object') {
      if ('structuredContent' in journalData && journalData.structuredContent) {
        const data = journalData.structuredContent as StructuredJournalContent;
        if (data.todos) setTodos(data.todos);
        if (data.gratitude) setGratitude(data.gratitude);
        if (data.wins) setWins(data.wins);
        if (data.freeformNotes) setFreeformNotes(data.freeformNotes);
        if (data.events) setEvents(data.events);
        if (data.waterIntake !== undefined) setWaterIntake(data.waterIntake);
        if (data.fitnessGoals) setFitnessGoals(data.fitnessGoals);
        if (data.fitnessTracking) setFitnessTracking(data.fitnessTracking);
      }
      
      if ('mood' in journalData && journalData.mood) {
        setMood(journalData.mood as string);
      }
    }
    
    // Mark loading as complete immediately - user edits will set hasUserEdits
    isLoading.current = false;
  }, [journalData, dateStr]);

  // Save function
  const saveJournal = useCallback(async () => {
    // Only save if we have user edits (not during initial data load)
    if (!hasUserEdits.current) return;

    const structuredContent: StructuredJournalContent = {
      todos,
      gratitude,
      wins,
      freeformNotes,
      events,
      waterIntake,
      fitnessGoals,
      fitnessTracking,
    };

    try {
      const response = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          content: "",
          structuredContent,
          date: dateStr,
          mood,
          streak: (journalData && typeof journalData === 'object' && 'streak' in journalData ? journalData.streak : 0) || 0,
        }),
      });

      if (!response.ok) throw new Error("Failed to save journal");
      queryClient.invalidateQueries({ queryKey: ["/api/journal/entries"] });
    } catch (error) {
      console.error("Save error:", error);
    }
  }, [todos, gratitude, wins, freeformNotes, events, waterIntake, fitnessGoals, fitnessTracking, mood, journalData, dateStr]);

  // Auto-save with debounce - only runs if user has made edits
  useEffect(() => {
    if (!hasUserEdits.current) return;
    
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => saveJournal(), 2000);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [todos, gratitude, wins, freeformNotes, events, waterIntake, fitnessGoals, fitnessTracking, mood, saveJournal]);

  // Helper functions - all mark dirty flag
  const addTodo = () => {
    if (newTodo.trim()) {
      hasUserEdits.current = true;
      setTodos([...todos, { id: Date.now().toString(), text: newTodo.trim(), completed: false }]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id: string) => {
    hasUserEdits.current = true;
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const removeTodo = (id: string) => {
    hasUserEdits.current = true;
    setTodos(todos.filter(t => t.id !== id));
  };

  const addGratitude = () => {
    if (newGratitude.trim()) {
      hasUserEdits.current = true;
      setGratitude([...gratitude, newGratitude.trim()]);
      setNewGratitude("");
    }
  };

  const removeGratitude = (index: number) => {
    hasUserEdits.current = true;
    setGratitude(gratitude.filter((_, i) => i !== index));
  };

  const addWin = () => {
    if (newWin.trim()) {
      hasUserEdits.current = true;
      setWins([...wins, newWin.trim()]);
      setNewWin("");
    }
  };

  const removeWin = (index: number) => {
    hasUserEdits.current = true;
    setWins(wins.filter((_, i) => i !== index));
  };
  
  const handleMoodChange = (value: string) => {
    hasUserEdits.current = true;
    setMood(value);
  };
  
  const handleNotesChange = (value: string) => {
    hasUserEdits.current = true;
    setFreeformNotes(value);
  };
  
  const addEvent = () => {
    if (newEventTitle.trim()) {
      hasUserEdits.current = true;
      setEvents([...events, {
        id: Date.now().toString(),
        time: newEventTime,
        title: newEventTitle.trim(),
      }]);
      setNewEventTitle("");
      setNewEventTime("");
    }
  };
  
  const removeEvent = (id: string) => {
    hasUserEdits.current = true;
    setEvents(events.filter(e => e.id !== id));
  };
  
  const handleWaterClick = (glassIndex: number) => {
    hasUserEdits.current = true;
    setWaterIntake(waterIntake === glassIndex + 1 ? glassIndex : glassIndex + 1);
  };
  
  const handleFitnessGoalsChange = (value: string) => {
    hasUserEdits.current = true;
    setFitnessGoals(value);
  };
  
  const handleFitnessTrackingChange = (value: string) => {
    hasUserEdits.current = true;
    setFitnessTracking(value);
  };

  // Calculate completion stats
  const completedTodos = todos.filter(t => t.completed).length;
  const totalTodos = todos.length;
  const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Mood Selection */}
      <Card className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 gradient-violet-fuchsia opacity-5" />
        <div className="relative z-10">
          <h3 className="font-cormorant text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[hsl(var(--liquid-gold))]" />
            How are you feeling today?
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {MOODS.map((m) => (
              <motion.button
                key={m.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleMoodChange(m.value)}
                className={`
                  p-4 rounded-xl flex flex-col items-center gap-2 transition-all
                  ${mood === m.value
                    ? "bg-primary text-primary-foreground shadow-lg ring-2 ring-primary ring-offset-2 ring-offset-background"
                    : "bg-muted hover-elevate"
                  }
                `}
                data-testid={`button-mood-${m.value}`}
              >
                <span className="text-3xl">{m.emoji}</span>
                <span className="text-xs font-medium">{m.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </Card>

      {/* Todos */}
      <Card className="p-6">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-cormorant text-2xl font-bold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-[hsl(var(--cyber-fuchsia))]" />
              Today's Priorities
            </h3>
            {totalTodos > 0 && (
              <div className="text-sm text-muted-foreground">
                {completedTodos}/{totalTodos} • {completionRate}%
              </div>
            )}
          </div>
          
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="What needs your attention today?"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
              data-testid="input-new-todo"
            />
            <Button onClick={addTodo} size="icon" data-testid="button-add-todo">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <AnimatePresence>
              {todos.map((todo) => (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg transition-all
                    ${todo.completed ? "bg-muted/50" : "bg-muted hover-elevate"}
                  `}
                >
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                    data-testid={`checkbox-todo-${todo.id}`}
                  />
                  <span className={`flex-1 ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
                    {todo.text}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTodo(todo.id)}
                    className="hover:text-destructive"
                    data-testid={`button-delete-todo-${todo.id}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </Card>

      {/* Gratitude */}
      <Card className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 gradient-violet-magenta opacity-5" />
        <div className="relative z-10">
          <h3 className="font-cormorant text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Heart className="w-6 h-6 text-[hsl(var(--magenta-quartz))]" />
            Gratitude
          </h3>
          
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="What are you grateful for today?"
              value={newGratitude}
              onChange={(e) => setNewGratitude(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addGratitude()}
              data-testid="input-new-gratitude"
            />
            <Button onClick={addGratitude} size="icon" data-testid="button-add-gratitude">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <AnimatePresence>
              {gratitude.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted hover-elevate"
                >
                  <Heart className="w-5 h-5 text-[hsl(var(--magenta-quartz))] flex-shrink-0 mt-0.5" />
                  <span className="flex-1">{item}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeGratitude(index)}
                    className="hover:text-destructive"
                    data-testid={`button-delete-gratitude-${index}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </Card>

      {/* Wins */}
      <Card className="p-6">
        <h3 className="font-cormorant text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-[hsl(var(--liquid-gold))]" />
          Today's Wins
        </h3>
        
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Celebrate your wins, big or small..."
            value={newWin}
            onChange={(e) => setNewWin(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addWin()}
            data-testid="input-new-win"
          />
          <Button onClick={addWin} size="icon" data-testid="button-add-win">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <AnimatePresence>
            {wins.map((win, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted hover-elevate"
              >
                <Star className="w-5 h-5 text-[hsl(var(--liquid-gold))] flex-shrink-0 mt-0.5" />
                <span className="flex-1">{win}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeWin(index)}
                  className="hover:text-destructive"
                  data-testid={`button-delete-win-${index}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Card>

      {/* Free-form Notes */}
      <Card className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 gradient-violet-fuchsia opacity-5" />
        <div className="relative z-10">
          <h3 className="font-cormorant text-2xl font-bold text-foreground mb-4">
            Your Thoughts & Reflections
          </h3>
          <Textarea
            placeholder="Let your thoughts flow freely... What's on your mind today?"
            value={freeformNotes}
            onChange={(e) => handleNotesChange(e.target.value)}
            rows={8}
            className="resize-none"
            data-testid="textarea-notes"
          />
          <div className="mt-2 text-xs text-muted-foreground text-right">
            {freeformNotes.split(/\s+/).filter(w => w.length > 0).length} words
          </div>
        </div>
      </Card>

      {/* Events & Meetings */}
      <Card className="p-8 neon-border-aurora relative overflow-hidden">
        <div className="absolute inset-0 gradient-aurora-teal opacity-5" />
        <div className="relative z-10">
          <h3 className="font-cormorant text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[hsl(var(--aurora-teal))]" />
            Events & Meetings
          </h3>
          <div className="space-y-3 mb-4">
            {events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-3 rounded-lg hover-elevate group"
              >
                <div className="flex-1">
                  {event.time && (
                    <div className="text-sm text-muted-foreground font-medium mb-1" data-testid={`text-event-time-${event.id}`}>
                      {event.time}
                    </div>
                  )}
                  <div className="text-foreground" data-testid={`text-event-title-${event.id}`}>
                    {event.title}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeEvent(event.id)}
                  data-testid={`button-remove-event-${event.id}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              type="time"
              value={newEventTime}
              onChange={(e) => setNewEventTime(e.target.value)}
              className="w-32"
              data-testid="input-new-event-time"
            />
            <Input
              placeholder="Event or meeting title..."
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addEvent()}
              className="flex-1"
              data-testid="input-new-event-title"
            />
            <Button onClick={addEvent} size="icon" data-testid="button-add-event">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Water Intake & Fitness */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Water Intake */}
        <Card className="p-8 neon-border-cyber relative overflow-hidden">
          <div className="absolute inset-0 gradient-cyber-fuchsia opacity-5" />
          <div className="relative z-10">
            <h3 className="font-cormorant text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Droplet className="w-6 h-6 text-blue-500" />
              Water Intake
            </h3>
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                {[...Array(8)].map((_, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleWaterClick(i)}
                    className={`w-10 h-10 rounded-full transition-all ${
                      i < waterIntake
                        ? "bg-blue-500/20 border-2 border-blue-500"
                        : "bg-muted border-2 border-muted-foreground/20"
                    }`}
                    data-testid={`button-water-${i}`}
                  >
                    <Droplet
                      className={`w-5 h-5 mx-auto ${
                        i < waterIntake ? "text-blue-500 fill-blue-500" : "text-muted-foreground"
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {waterIntake} / 8 glasses • Goal: 8 glasses per day
              </p>
            </div>
          </div>
        </Card>

        {/* Fitness Goals */}
        <Card className="p-8 neon-border-magenta relative overflow-hidden">
          <div className="absolute inset-0 gradient-magenta-quartz opacity-5" />
          <div className="relative z-10">
            <h3 className="font-cormorant text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Dumbbell className="w-6 h-6 text-[hsl(var(--magenta-quartz))]" />
              Fitness
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Today's Goals</label>
                <Textarea
                  placeholder="What are your fitness goals today?"
                  value={fitnessGoals}
                  onChange={(e) => handleFitnessGoalsChange(e.target.value)}
                  rows={3}
                  className="resize-none"
                  data-testid="textarea-fitness-goals"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Workout Log</label>
                <Textarea
                  placeholder="Log your workouts, steps, or activities..."
                  value={fitnessTracking}
                  onChange={(e) => handleFitnessTrackingChange(e.target.value)}
                  rows={3}
                  className="resize-none"
                  data-testid="textarea-fitness-tracking"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Auto-save indicator */}
      <div className="text-center text-sm text-muted-foreground">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>All changes are automatically saved</span>
        </motion.div>
      </div>
    </div>
  );
}
