
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Heart, Star, Trophy, Save, Plus, X, CheckCircle2,
  Calendar, Droplet, Dumbbell, MessageCircle, Crown, Tag as TagIcon,
  Brain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { StructuredJournalContent, JournalTodoItem, JournalEvent } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { canAccessSignatureFeatures } from "@/lib/tierAccess";

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

interface UnifiedJournalEditorProps {
  selectedDate?: string;
}

export function UnifiedJournalEditor({ selectedDate }: UnifiedJournalEditorProps = {}) {
  const { toast } = useToast();
  const { user } = useAuth();
  const isPro = canAccessSignatureFeatures(user?.subscriptionTier);
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
  const [tags, setTags] = useState<string[]>([]);
  const [aiInsights, setAiInsights] = useState<any>(null);
  
  // Input states
  const [newTodo, setNewTodo] = useState("");
  const [newGratitude, setNewGratitude] = useState("");
  const [newWin, setNewWin] = useState("");
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventTime, setNewEventTime] = useState("");
  const [newTag, setNewTag] = useState("");
  
  const isLoading = useRef(true);
  const hasUserEdits = useRef(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevDateStr = useRef<string>(dateStr);

  const { data: journalData } = useQuery({
    queryKey: ["/api/journal", dateStr],
    queryFn: async () => {
      const res = await fetch(`/api/journal?date=${dateStr}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch journal");
      return await res.json();
    },
  });

  useEffect(() => {
    if (prevDateStr.current !== dateStr) {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (hasUserEdits.current) {
        saveJournal();
      }
      prevDateStr.current = dateStr;
    }
    
    isLoading.current = true;
    hasUserEdits.current = false;
    
    // Reset state
    setTodos([]);
    setGratitude([]);
    setWins([]);
    setFreeformNotes("");
    setMood("");
    setEvents([]);
    setWaterIntake(0);
    setFitnessGoals("");
    setFitnessTracking("");
    setTags([]);
    
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
      
      if ('mood' in journalData && journalData.mood) setMood(journalData.mood as string);
      if ('tags' in journalData && journalData.tags) setTags(journalData.tags as string[]);
    }
    
    isLoading.current = false;
  }, [journalData, dateStr]);

  const saveJournal = useCallback(async () => {
    if (!hasUserEdits.current) return;

    const structuredContent: StructuredJournalContent = {
      todos, gratitude, wins, freeformNotes, events,
      waterIntake, fitnessGoals, fitnessTracking,
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
          tags,
          streak: (journalData && typeof journalData === 'object' && 'streak' in journalData ? journalData.streak : 0) || 0,
        }),
      });

      if (!response.ok) throw new Error("Failed to save journal");
      queryClient.invalidateQueries({ queryKey: ["/api/journal/entries"] });

      // Get AI insights if Pro
      if (freeformNotes.trim().length > 50 && isPro && !aiInsights) {
        const res = await apiRequest('POST', '/api/journal/analyze', { content: freeformNotes });
        const insights = await res.json();
        setAiInsights(insights);
      }
    } catch (error) {
      console.error("Save error:", error);
    }
  }, [todos, gratitude, wins, freeformNotes, events, waterIntake, fitnessGoals, fitnessTracking, mood, tags, journalData, dateStr, isPro, aiInsights]);

  useEffect(() => {
    if (!hasUserEdits.current) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => saveJournal(), 2000);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [todos, gratitude, wins, freeformNotes, events, waterIntake, fitnessGoals, fitnessTracking, mood, tags, saveJournal]);

  const markDirty = () => { hasUserEdits.current = true; };

  const addTodo = () => {
    if (newTodo.trim()) {
      markDirty();
      setTodos([...todos, { id: Date.now().toString(), text: newTodo.trim(), completed: false }]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id: string) => {
    markDirty();
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const removeTodo = (id: string) => {
    markDirty();
    setTodos(todos.filter(t => t.id !== id));
  };

  const addGratitude = () => {
    if (newGratitude.trim()) {
      markDirty();
      setGratitude([...gratitude, newGratitude.trim()]);
      setNewGratitude("");
    }
  };

  const removeGratitude = (index: number) => {
    markDirty();
    setGratitude(gratitude.filter((_, i) => i !== index));
  };

  const addWin = () => {
    if (newWin.trim()) {
      markDirty();
      setWins([...wins, newWin.trim()]);
      setNewWin("");
    }
  };

  const removeWin = (index: number) => {
    markDirty();
    setWins(wins.filter((_, i) => i !== index));
  };

  const addEvent = () => {
    if (newEventTitle.trim()) {
      markDirty();
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
    markDirty();
    setEvents(events.filter(e => e.id !== id));
  };

  const handleWaterClick = (glassIndex: number) => {
    markDirty();
    setWaterIntake(waterIntake === glassIndex + 1 ? glassIndex : glassIndex + 1);
  };

  const handleMoodChange = (value: string) => {
    markDirty();
    setMood(value);
  };

  const handleNotesChange = (value: string) => {
    markDirty();
    setFreeformNotes(value);
  };

  const handleFitnessGoalsChange = (value: string) => {
    markDirty();
    setFitnessGoals(value);
  };

  const handleFitnessTrackingChange = (value: string) => {
    markDirty();
    setFitnessTracking(value);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
      markDirty();
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    markDirty();
    setTags(tags.filter(t => t !== tag));
  };

  const completedTodos = todos.filter(t => t.completed).length;
  const totalTodos = todos.length;
  const wordCount = freeformNotes.split(/\s+/).filter(w => w.length > 0).length;

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
                className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                  mood === m.value
                    ? "bg-primary text-primary-foreground shadow-lg ring-2 ring-primary"
                    : "bg-muted hover-elevate"
                }`}
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-cormorant text-2xl font-bold text-foreground flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-[hsl(var(--cyber-fuchsia))]" />
            Today's Priorities
          </h3>
          {totalTodos > 0 && (
            <div className="text-sm text-foreground">
              {completedTodos}/{totalTodos}
            </div>
          )}
        </div>
        
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="What needs your attention?"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
          />
          <Button onClick={addTodo} size="icon">
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
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  todo.completed ? "bg-muted/50" : "bg-muted hover-elevate"
                }`}
              >
                <Checkbox checked={todo.completed} onCheckedChange={() => toggleTodo(todo.id)} />
                <span className={`flex-1 ${todo.completed ? "line-through text-foreground" : ""}`}>
                  {todo.text}
                </span>
                <Button variant="ghost" size="icon" onClick={() => removeTodo(todo.id)}>
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Card>

      {/* Gratitude & Wins - Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-cormorant text-2xl font-bold mb-4 flex items-center gap-2">
            <Heart className="w-6 h-6 text-[hsl(var(--magenta-quartz))]" />
            Gratitude
          </h3>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="I'm grateful for..."
              value={newGratitude}
              onChange={(e) => setNewGratitude(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addGratitude()}
            />
            <Button onClick={addGratitude} size="icon"><Plus className="w-4 h-4" /></Button>
          </div>
          <div className="space-y-2">
            <AnimatePresence>
              {gratitude.map((item, index) => (
                <motion.div key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted hover-elevate">
                  <Heart className="w-5 h-5 text-[hsl(var(--magenta-quartz))] flex-shrink-0 mt-0.5" />
                  <span className="flex-1">{item}</span>
                  <Button variant="ghost" size="icon" onClick={() => removeGratitude(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-cormorant text-2xl font-bold mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-[hsl(var(--liquid-gold))]" />
            Today's Wins
          </h3>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Celebrate your wins..."
              value={newWin}
              onChange={(e) => setNewWin(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addWin()}
            />
            <Button onClick={addWin} size="icon"><Plus className="w-4 h-4" /></Button>
          </div>
          <div className="space-y-2">
            <AnimatePresence>
              {wins.map((win, index) => (
                <motion.div key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted hover-elevate">
                  <Star className="w-5 h-5 text-[hsl(var(--liquid-gold))] flex-shrink-0 mt-0.5" />
                  <span className="flex-1">{win}</span>
                  <Button variant="ghost" size="icon" onClick={() => removeWin(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Card>
      </div>

      {/* Free-form Notes */}
      <Card className="p-6">
        <h3 className="font-cormorant text-2xl font-bold mb-4">Your Thoughts & Reflections</h3>
        <Textarea
          placeholder="Let your thoughts flow freely..."
          value={freeformNotes}
          onChange={(e) => handleNotesChange(e.target.value)}
          rows={8}
          className="resize-none"
        />
        <div className="mt-2 text-xs text-foreground text-right">{wordCount} words</div>
      </Card>

      {/* Tags */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <TagIcon className="w-4 h-4" />
          <span className="text-sm font-medium">Tags</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="pl-3 pr-1">
              {tag}
              <button onClick={() => handleRemoveTag(tag)} className="ml-1">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {tags.length < 5 && (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="Add tag..."
                className="w-24 px-2 py-1 text-sm bg-transparent border border-border/40 rounded-md"
              />
              <Button size="icon" variant="ghost" onClick={handleAddTag} className="h-6 w-6">
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Events & Water/Fitness */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-cormorant text-2xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[hsl(var(--aurora-teal))]" />
            Events & Meetings
          </h3>
          <div className="space-y-3 mb-4">
            {events.map((event) => (
              <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg hover-elevate group">
                <div className="flex-1">
                  {event.time && <div className="text-sm text-foreground mb-1">{event.time}</div>}
                  <div>{event.title}</div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeEvent(event.id)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input type="time" value={newEventTime} onChange={(e) => setNewEventTime(e.target.value)} className="w-32" />
            <Input placeholder="Event title..." value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addEvent()} className="flex-1" />
            <Button onClick={addEvent} size="icon"><Plus className="w-4 h-4" /></Button>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-cormorant text-xl font-bold mb-4 flex items-center gap-2">
              <Droplet className="w-5 h-5 text-blue-500" />
              Water Intake
            </h3>
            <div className="flex gap-2 flex-wrap">
              {[...Array(8)].map((_, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => handleWaterClick(i)}
                  className={`w-10 h-10 rounded-full transition-all ${
                    i < waterIntake ? "bg-blue-500/20 border-2 border-blue-500" : "bg-muted border-2 border-muted-foreground/20"
                  }`}
                >
                  <Droplet className={`w-5 h-5 mx-auto ${i < waterIntake ? "text-blue-500 fill-blue-500" : "text-foreground"}`} />
                </motion.button>
              ))}
            </div>
            <p className="text-sm text-foreground mt-3">{waterIntake} / 8 glasses</p>
          </Card>

          <Card className="p-6">
            <h3 className="font-cormorant text-xl font-bold mb-4 flex items-center gap-2">
              <Dumbbell className="w-5 h-5" />
              Fitness
            </h3>
            <Textarea placeholder="Today's goals..." value={fitnessGoals}
              onChange={(e) => handleFitnessGoalsChange(e.target.value)} rows={2} className="mb-3" />
            <Textarea placeholder="Workout log..." value={fitnessTracking}
              onChange={(e) => handleFitnessTrackingChange(e.target.value)} rows={2} />
          </Card>
        </div>
      </div>

      {/* AI Insights (Pro) */}
      {isPro && aiInsights && (
        <Card className="p-6 bg-gradient-to-br from-[hsl(var(--aurora-teal))]/5 to-[hsl(var(--aurora-teal))]/10">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-[hsl(var(--aurora-teal))]" />
            <h3 className="font-semibold">AI Insights</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-foreground/70 mb-1">Summary</p>
              <p className="text-sm">{aiInsights.summary}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground/70 mb-1">Sentiment</p>
              <Badge variant="secondary" className="capitalize">{aiInsights.sentiment}</Badge>
            </div>
            {aiInsights.encouragement && (
              <p className="text-sm italic pt-2 border-t">"{aiInsights.encouragement}"</p>
            )}
          </div>
        </Card>
      )}

      <div className="text-center text-sm text-foreground">
        <motion.div className="flex items-center justify-center gap-2">
          <Save className="w-4 h-4" />
          <span>All changes are automatically saved</span>
        </motion.div>
      </div>
    </div>
  );
}
