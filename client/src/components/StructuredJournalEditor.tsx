import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckSquare, 
  Heart, 
  Bell, 
  Star, 
  Trophy, 
  Calendar, 
  Droplet,
  Dumbbell,
  Plus,
  X,
  Check,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { StructuredJournalContent, JournalTodoItem, JournalEvent } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function StructuredJournalEditor() {
  const { toast } = useToast();
  
  // State for all journal sections
  const [todos, setTodos] = useState<JournalTodoItem[]>([]);
  const [gratitude, setGratitude] = useState<string[]>([]);
  const [reminders, setReminders] = useState<string[]>([]);
  const [highlights, setHighlights] = useState("");
  const [wins, setWins] = useState<string[]>([]);
  const [events, setEvents] = useState<JournalEvent[]>([]);
  const [waterIntake, setWaterIntake] = useState(0);
  const [fitnessGoals, setFitnessGoals] = useState("");
  const [fitnessTracking, setFitnessTracking] = useState("");
  const [freeformNotes, setFreeformNotes] = useState("");
  
  // Input states for adding new items
  const [newTodo, setNewTodo] = useState("");
  const [newGratitude, setNewGratitude] = useState("");
  const [newReminder, setNewReminder] = useState("");
  const [newWin, setNewWin] = useState("");
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventTime, setNewEventTime] = useState("");

  // Fetch journal data
  const { data: journalData } = useQuery({
    queryKey: ["/api/journal"],
  });

  // Load data when fetched
  useEffect(() => {
    if (journalData && typeof journalData === 'object' && 'structuredContent' in journalData && journalData.structuredContent) {
      const data = journalData.structuredContent as StructuredJournalContent;
      setTodos(data.todos || []);
      setGratitude(data.gratitude || []);
      setReminders(data.reminders || []);
      setHighlights(data.highlights || "");
      setWins(data.wins || []);
      setEvents(data.events || []);
      setWaterIntake(data.waterIntake || 0);
      setFitnessGoals(data.fitnessGoals || "");
      setFitnessTracking(data.fitnessTracking || "");
      setFreeformNotes(data.freeformNotes || "");
    }
  }, [journalData]);

  // Save journal mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      const structuredContent: StructuredJournalContent = {
        todos,
        gratitude,
        reminders,
        highlights,
        wins,
        events,
        waterIntake,
        fitnessGoals,
        fitnessTracking,
        freeformNotes,
      };

      const response = await fetch("/api/journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          content: "", // Legacy field
          structuredContent,
          streak: (journalData && typeof journalData === 'object' && 'streak' in journalData ? journalData.streak : 0) || 0,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save journal");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal"] });
      toast({
        title: "Saved",
        description: "Your journal entry has been saved",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save journal entry",
        variant: "destructive",
      });
    },
  });

  // Auto-save on changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      saveMutation.mutate();
    }, 2000);

    return () => clearTimeout(timer);
  }, [todos, gratitude, reminders, highlights, wins, events, waterIntake, fitnessGoals, fitnessTracking, freeformNotes]);

  // Todo functions
  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now().toString(), text: newTodo.trim(), completed: false }]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const removeTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  // Gratitude functions
  const addGratitude = () => {
    if (newGratitude.trim()) {
      setGratitude([...gratitude, newGratitude.trim()]);
      setNewGratitude("");
    }
  };

  const removeGratitude = (index: number) => {
    setGratitude(gratitude.filter((_, i) => i !== index));
  };

  // Reminder functions
  const addReminder = () => {
    if (newReminder.trim()) {
      setReminders([...reminders, newReminder.trim()]);
      setNewReminder("");
    }
  };

  const removeReminder = (index: number) => {
    setReminders(reminders.filter((_, i) => i !== index));
  };

  // Win functions
  const addWin = () => {
    if (newWin.trim()) {
      setWins([...wins, newWin.trim()]);
      setNewWin("");
    }
  };

  const removeWin = (index: number) => {
    setWins(wins.filter((_, i) => i !== index));
  };

  // Event functions
  const addEvent = () => {
    if (newEventTitle.trim()) {
      setEvents([
        ...events,
        {
          id: Date.now().toString(),
          title: newEventTitle.trim(),
          time: newEventTime,
          notes: "",
        },
      ]);
      setNewEventTitle("");
      setNewEventTime("");
    }
  };

  const removeEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-cormorant text-3xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          Today's Journey
        </h2>
        <Button
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
          size="sm"
          data-testid="button-save-journal"
        >
          {saveMutation.isPending ? "Saving..." : "Save Now"}
        </Button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* To-Do List */}
        <Card className="p-6">
          <h3 className="font-cormorant text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-primary" />
            To-Do List
          </h3>
          <div className="space-y-3">
            {todos.map((todo) => (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 group"
              >
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                  data-testid={`checkbox-todo-${todo.id}`}
                />
                <span
                  className={`flex-1 ${todo.completed ? "line-through text-muted-foreground" : "text-foreground"}`}
                  data-testid={`text-todo-${todo.id}`}
                >
                  {todo.text}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                  onClick={() => removeTodo(todo.id)}
                  data-testid={`button-remove-todo-${todo.id}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
            <div className="flex gap-2 mt-4">
              <Input
                placeholder="Add a task..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTodo()}
                data-testid="input-new-todo"
              />
              <Button onClick={addTodo} size="icon" data-testid="button-add-todo">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Gratitude List */}
        <Card className="p-6">
          <h3 className="font-cormorant text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            Gratitude
          </h3>
          <div className="space-y-2">
            {gratitude.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-2 group"
              >
                <span className="text-pink-500 mt-1">❤️</span>
                <span className="flex-1 text-foreground" data-testid={`text-gratitude-${index}`}>
                  {item}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                  onClick={() => removeGratitude(index)}
                  data-testid={`button-remove-gratitude-${index}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
            <div className="flex gap-2 mt-4">
              <Input
                placeholder="I'm grateful for..."
                value={newGratitude}
                onChange={(e) => setNewGratitude(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addGratitude()}
                data-testid="input-new-gratitude"
              />
              <Button onClick={addGratitude} size="icon" data-testid="button-add-gratitude">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Reminders */}
        <Card className="p-6">
          <h3 className="font-cormorant text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-secondary" />
            Reminders
          </h3>
          <div className="space-y-2">
            {reminders.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-2 group"
              >
                <Bell className="w-4 h-4 text-secondary mt-1" />
                <span className="flex-1 text-foreground" data-testid={`text-reminder-${index}`}>
                  {item}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                  onClick={() => removeReminder(index)}
                  data-testid={`button-remove-reminder-${index}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
            <div className="flex gap-2 mt-4">
              <Input
                placeholder="Don't forget to..."
                value={newReminder}
                onChange={(e) => setNewReminder(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addReminder()}
                data-testid="input-new-reminder"
              />
              <Button onClick={addReminder} size="icon" data-testid="button-add-reminder">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Wins */}
        <Card className="p-6">
          <h3 className="font-cormorant text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Wins Today
          </h3>
          <div className="space-y-2">
            {wins.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-2 group"
              >
                <Trophy className="w-4 h-4 text-yellow-500 mt-1" />
                <span className="flex-1 text-foreground" data-testid={`text-win-${index}`}>
                  {item}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                  onClick={() => removeWin(index)}
                  data-testid={`button-remove-win-${index}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
            <div className="flex gap-2 mt-4">
              <Input
                placeholder="Celebrate your win..."
                value={newWin}
                onChange={(e) => setNewWin(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addWin()}
                data-testid="input-new-win"
              />
              <Button onClick={addWin} size="icon" data-testid="button-add-win">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Events */}
        <Card className="p-6">
          <h3 className="font-cormorant text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Events & Schedule
          </h3>
          <div className="space-y-3">
            {events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 group p-2 rounded hover-elevate"
              >
                <div className="flex-1">
                  {event.time && (
                    <div className="text-xs text-muted-foreground mb-1" data-testid={`text-event-time-${event.id}`}>
                      {event.time}
                    </div>
                  )}
                  <div className="text-foreground font-medium" data-testid={`text-event-title-${event.id}`}>
                    {event.title}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                  onClick={() => removeEvent(event.id)}
                  data-testid={`button-remove-event-${event.id}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
            <div className="space-y-2 mt-4">
              <div className="flex gap-2">
                <Input
                  type="time"
                  value={newEventTime}
                  onChange={(e) => setNewEventTime(e.target.value)}
                  className="w-32"
                  data-testid="input-new-event-time"
                />
                <Input
                  placeholder="Event title..."
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
          </div>
        </Card>

        {/* Water Intake Tracker */}
        <Card className="p-6">
          <h3 className="font-cormorant text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Droplet className="w-5 h-5 text-blue-500" />
            Water Intake
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex gap-2 flex-wrap">
                {[...Array(8)].map((_, i) => (
                  <Button
                    key={i}
                    variant={i < waterIntake ? "default" : "outline"}
                    size="icon"
                    onClick={() => setWaterIntake(i < waterIntake ? i : i + 1)}
                    data-testid={`button-water-${i}`}
                  >
                    <Droplet className={`w-4 h-4 ${i < waterIntake ? "fill-current" : ""}`} />
                  </Button>
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground" data-testid="text-water-count">
              {waterIntake} of 8 glasses ({waterIntake * 8}oz)
            </p>
          </div>
        </Card>
      </div>

      {/* Full-Width Sections */}
      <div className="space-y-6">
        {/* Daily Highlights */}
        <Card className="p-6">
          <h3 className="font-cormorant text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            Daily Highlights
          </h3>
          <Textarea
            placeholder="What made today special? Capture the moments that matter..."
            value={highlights}
            onChange={(e) => setHighlights(e.target.value)}
            className="min-h-[120px] resize-none"
            data-testid="textarea-highlights"
          />
        </Card>

        {/* Fitness Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-cormorant text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-primary" />
              Fitness Goals
            </h3>
            <Textarea
              placeholder="What are your fitness goals today?"
              value={fitnessGoals}
              onChange={(e) => setFitnessGoals(e.target.value)}
              className="min-h-[100px] resize-none"
              data-testid="textarea-fitness-goals"
            />
          </Card>

          <Card className="p-6">
            <h3 className="font-cormorant text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              Fitness Tracking
            </h3>
            <Textarea
              placeholder="Log your workouts, steps, or activities..."
              value={fitnessTracking}
              onChange={(e) => setFitnessTracking(e.target.value)}
              className="min-h-[100px] resize-none"
              data-testid="textarea-fitness-tracking"
            />
          </Card>
        </div>

        {/* Freeform Notes */}
        <Card className="p-6">
          <h3 className="font-cormorant text-xl font-bold text-foreground mb-4">
            Additional Notes
          </h3>
          <Textarea
            placeholder="Any other thoughts, reflections, or notes for today..."
            value={freeformNotes}
            onChange={(e) => setFreeformNotes(e.target.value)}
            className="min-h-[150px] resize-none"
            data-testid="textarea-freeform-notes"
          />
        </Card>
      </div>
    </div>
  );
}
