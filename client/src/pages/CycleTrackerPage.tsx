import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, startOfWeek, endOfWeek, parseISO } from "date-fns";
import { Calendar, Droplet, Heart, Activity, Moon, Plus, ChevronLeft, ChevronRight, Sparkles, Zap, X, Check, Smile, Frown, Meh, AlertCircle, Battery, CloudRain, Flame, Coffee, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { MenstrualCycle, DailySymptom } from "@shared/schema";

const MOODS = [
  { value: "happy", label: "Happy", Icon: Smile },
  { value: "calm", label: "Calm", Icon: Heart },
  { value: "anxious", label: "Anxious", Icon: AlertCircle },
  { value: "tired", label: "Tired", Icon: Battery },
  { value: "irritable", label: "Irritable", Icon: Flame },
  { value: "sad", label: "Sad", Icon: Frown },
  { value: "energetic", label: "Energetic", Icon: Zap },
  { value: "neutral", label: "Neutral", Icon: Meh },
];

const SYMPTOMS = [
  { value: "cramps", label: "Cramps", Icon: Flame },
  { value: "headache", label: "Headache", Icon: AlertCircle },
  { value: "bloating", label: "Bloating", Icon: Circle },
  { value: "fatigue", label: "Fatigue", Icon: Battery },
  { value: "breast_tenderness", label: "Breast Tenderness", Icon: Heart },
  { value: "acne", label: "Acne", Icon: Circle },
  { value: "mood_swings", label: "Mood Swings", Icon: CloudRain },
  { value: "cravings", label: "Cravings", Icon: Coffee },
  { value: "insomnia", label: "Insomnia", Icon: Moon },
  { value: "back_pain", label: "Back Pain", Icon: Activity },
];

const FLOW_INTENSITIES = [
  { value: "spotting", label: "Spotting", color: "bg-pink-200" },
  { value: "light", label: "Light", color: "bg-pink-300" },
  { value: "medium", label: "Medium", color: "bg-pink-400" },
  { value: "heavy", label: "Heavy", color: "bg-pink-500" },
];

type Predictions = {
  nextPeriodStart: string | null;
  nextPeriodEnd: string | null;
  fertileWindowStart: string | null;
  fertileWindowEnd: string | null;
  averageCycleLength: number | null;
  averagePeriodLength: number | null;
  cyclesAnalyzed?: number;
  message?: string;
};

export default function CycleTrackerPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showLogPeriod, setShowLogPeriod] = useState(false);
  const [showLogSymptoms, setShowLogSymptoms] = useState(false);
  const { toast } = useToast();

  const { data: cycles = [], isLoading: cyclesLoading } = useQuery<MenstrualCycle[]>({
    queryKey: ["/api/cycles"],
  });

  const { data: predictions } = useQuery<Predictions>({
    queryKey: ["/api/cycles/predictions"],
  });

  const { data: symptoms = [] } = useQuery<DailySymptom[]>({
    queryKey: ["/api/symptoms"],
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const cycleDates = useMemo(() => {
    const dates = new Map<string, { type: "period" | "fertile" | "predicted"; cycle?: MenstrualCycle }>();
    
    cycles.forEach((cycle) => {
      const start = parseISO(cycle.startDate);
      const end = cycle.endDate ? parseISO(cycle.endDate) : addDays(start, (cycle.periodLength || 5) - 1);
      const days = eachDayOfInterval({ start, end });
      days.forEach((day) => {
        dates.set(format(day, "yyyy-MM-dd"), { type: "period", cycle });
      });
    });

    if (predictions?.nextPeriodStart && predictions?.nextPeriodEnd) {
      const predStart = parseISO(predictions.nextPeriodStart);
      const predEnd = parseISO(predictions.nextPeriodEnd);
      const predDays = eachDayOfInterval({ start: predStart, end: predEnd });
      predDays.forEach((day) => {
        const key = format(day, "yyyy-MM-dd");
        if (!dates.has(key)) {
          dates.set(key, { type: "predicted" });
        }
      });
    }

    if (predictions?.fertileWindowStart && predictions?.fertileWindowEnd) {
      const fertileStart = parseISO(predictions.fertileWindowStart);
      const fertileEnd = parseISO(predictions.fertileWindowEnd);
      const fertileDays = eachDayOfInterval({ start: fertileStart, end: fertileEnd });
      fertileDays.forEach((day) => {
        const key = format(day, "yyyy-MM-dd");
        if (!dates.has(key)) {
          dates.set(key, { type: "fertile" });
        }
      });
    }

    return dates;
  }, [cycles, predictions]);

  const symptomsByDate = useMemo(() => {
    const map = new Map<string, DailySymptom>();
    symptoms.forEach((s) => map.set(s.date, s));
    return map;
  }, [symptoms]);

  const getDayClasses = (day: Date) => {
    const dateStr = format(day, "yyyy-MM-dd");
    const cycleInfo = cycleDates.get(dateStr);
    const hasSymptoms = symptomsByDate.has(dateStr);
    
    let classes = "relative w-10 h-10 flex items-center justify-center rounded-full transition-all cursor-pointer hover-elevate ";
    
    if (!isSameMonth(day, currentMonth)) {
      classes += "text-foreground/30 ";
    } else if (isToday(day)) {
      classes += "ring-2 ring-primary ring-offset-2 ring-offset-background ";
    }
    
    if (cycleInfo?.type === "period") {
      classes += "bg-pink-500/80 text-white ";
    } else if (cycleInfo?.type === "predicted") {
      classes += "bg-pink-300/50 text-pink-900 dark:text-pink-100 border-2 border-dashed border-pink-400 ";
    } else if (cycleInfo?.type === "fertile") {
      classes += "bg-green-400/50 text-green-900 dark:text-green-100 ";
    }
    
    return { classes, hasSymptoms, cycleInfo };
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setShowLogSymptoms(true);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-3">
              <Heart className="w-4 h-4 text-pink-500" />
              <span className="text-xs font-medium tracking-wide uppercase">
                Wellness Tracking
              </span>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3 text-gradient-violet" data-testid="text-page-title">
              Cycle Tracker
            </h1>
            <p className="text-base text-foreground/80 max-w-2xl mx-auto mb-4">
              Track your menstrual cycle, symptoms, and wellness patterns
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                    data-testid="button-prev-month"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <h2 className="text-xl font-semibold" data-testid="text-current-month">
                    {format(currentMonth, "MMMM yyyy")}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                    data-testid="button-next-month"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-foreground/60 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day) => {
                    const { classes, hasSymptoms, cycleInfo } = getDayClasses(day);
                    return (
                      <div
                        key={day.toISOString()}
                        className={classes}
                        onClick={() => handleDayClick(day)}
                        data-testid={`calendar-day-${format(day, "yyyy-MM-dd")}`}
                      >
                        {format(day, "d")}
                        {hasSymptoms && (
                          <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-pink-500/80" />
                    <span className="text-sm text-foreground/70">Period</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-pink-300/50 border-2 border-dashed border-pink-400" />
                    <span className="text-sm text-foreground/70">Predicted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-400/50" />
                    <span className="text-sm text-foreground/70">Fertile Window</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-sm text-foreground/70">Logged Symptoms</span>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-pink-500" />
                    Predictions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {predictions?.nextPeriodStart ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-foreground/70">Next Period</span>
                        <Badge variant="secondary" data-testid="text-next-period">
                          {format(parseISO(predictions.nextPeriodStart), "MMM d")}
                        </Badge>
                      </div>
                      {predictions.fertileWindowStart && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-foreground/70">Fertile Window</span>
                          <Badge variant="outline" className="text-green-600" data-testid="text-fertile-window">
                            {format(parseISO(predictions.fertileWindowStart), "MMM d")} - {format(parseISO(predictions.fertileWindowEnd!), "MMM d")}
                          </Badge>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-foreground/70">Avg Cycle</span>
                        <span className="text-sm font-medium" data-testid="text-avg-cycle">{predictions.averageCycleLength} days</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-foreground/60">
                      Log at least 2 cycles to see predictions
                    </p>
                  )}
                </CardContent>
              </Card>

              <Dialog open={showLogPeriod} onOpenChange={setShowLogPeriod}>
                <DialogTrigger asChild>
                  <Button className="w-full gap-2" data-testid="button-log-period">
                    <Droplet className="w-4 h-4" />
                    Log Period
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Log Period</DialogTitle>
                  </DialogHeader>
                  <LogPeriodForm onSuccess={() => setShowLogPeriod(false)} />
                </DialogContent>
              </Dialog>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground/70">Cycles Logged</span>
                    <span className="text-sm font-medium" data-testid="text-cycles-count">{cycles.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground/70">Symptoms Logged</span>
                    <span className="text-sm font-medium" data-testid="text-symptoms-count">{symptoms.length} days</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>

      <Dialog open={showLogSymptoms} onOpenChange={setShowLogSymptoms}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Log for {selectedDate ? format(selectedDate, "MMMM d, yyyy") : ""}
            </DialogTitle>
          </DialogHeader>
          {selectedDate && (
            <LogSymptomsForm
              date={format(selectedDate, "yyyy-MM-dd")}
              existingSymptom={symptomsByDate.get(format(selectedDate, "yyyy-MM-dd"))}
              onSuccess={() => setShowLogSymptoms(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function LogPeriodForm({ onSuccess }: { onSuccess: () => void }) {
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState("");
  const [flowIntensity, setFlowIntensity] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/cycles", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cycles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cycles/predictions"] });
      toast({ title: "Period logged successfully" });
      onSuccess();
    },
    onError: () => {
      toast({ title: "Failed to log period", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      startDate,
      endDate: endDate || null,
      flowIntensity: flowIntensity || null,
      notes: notes || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="startDate">Start Date</Label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
          required
          data-testid="input-start-date"
        />
      </div>
      <div>
        <Label htmlFor="endDate">End Date (optional)</Label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
          data-testid="input-end-date"
        />
      </div>
      <div>
        <Label>Flow Intensity</Label>
        <div className="flex gap-2 mt-2">
          {FLOW_INTENSITIES.map((flow) => (
            <Button
              key={flow.value}
              type="button"
              variant={flowIntensity === flow.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFlowIntensity(flow.value)}
              className="flex-1"
              data-testid={`button-flow-${flow.value}`}
            >
              {flow.label}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional notes..."
          className="mt-1"
          data-testid="input-notes"
        />
      </div>
      <Button type="submit" className="w-full" disabled={mutation.isPending} data-testid="button-submit-period">
        {mutation.isPending ? "Saving..." : "Log Period"}
      </Button>
    </form>
  );
}

function LogSymptomsForm({ date, existingSymptom, onSuccess }: { date: string; existingSymptom?: DailySymptom; onSuccess: () => void }) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(
    (existingSymptom?.symptoms as string[]) || []
  );
  const [mood, setMood] = useState(existingSymptom?.mood || "");
  const [energyLevel, setEnergyLevel] = useState(existingSymptom?.energyLevel || 5);
  const [stressLevel, setStressLevel] = useState(existingSymptom?.stressLevel || 5);
  const [sleepHours, setSleepHours] = useState<number>(Number(existingSymptom?.sleepHours) || 7);
  const [waterIntake, setWaterIntake] = useState(existingSymptom?.waterIntake || 8);
  const [notes, setNotes] = useState(existingSymptom?.notes || "");
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/symptoms", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/symptoms"] });
      toast({ title: "Symptoms logged successfully" });
      onSuccess();
    },
    onError: () => {
      toast({ title: "Failed to log symptoms", variant: "destructive" });
    },
  });

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      date,
      symptoms: selectedSymptoms,
      mood: mood || null,
      energyLevel,
      stressLevel,
      sleepHours,
      waterIntake,
      notes: notes || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
      <div>
        <Label className="mb-2 block">Mood</Label>
        <div className="grid grid-cols-4 gap-2">
          {MOODS.map((m) => (
            <Button
              key={m.value}
              type="button"
              variant={mood === m.value ? "default" : "outline"}
              size="sm"
              onClick={() => setMood(m.value)}
              className="flex flex-col gap-1 h-auto py-2"
              data-testid={`button-mood-${m.value}`}
            >
              <m.Icon className="w-5 h-5" />
              <span className="text-xs">{m.label}</span>
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-2 block">Symptoms</Label>
        <div className="grid grid-cols-2 gap-2">
          {SYMPTOMS.map((s) => (
            <Button
              key={s.value}
              type="button"
              variant={selectedSymptoms.includes(s.value) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleSymptom(s.value)}
              className="justify-start gap-2"
              data-testid={`button-symptom-${s.value}`}
            >
              <s.Icon className="w-4 h-4" />
              <span className="text-xs">{s.label}</span>
              {selectedSymptoms.includes(s.value) && <Check className="w-3 h-3 ml-auto" />}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="flex justify-between">
            <span>Energy Level</span>
            <span className="text-foreground/60">{energyLevel}/10</span>
          </Label>
          <Slider
            value={[energyLevel]}
            onValueChange={([v]) => setEnergyLevel(v)}
            min={1}
            max={10}
            step={1}
            className="mt-2"
            data-testid="slider-energy"
          />
        </div>
        <div>
          <Label className="flex justify-between">
            <span>Stress Level</span>
            <span className="text-foreground/60">{stressLevel}/10</span>
          </Label>
          <Slider
            value={[stressLevel]}
            onValueChange={([v]) => setStressLevel(v)}
            min={1}
            max={10}
            step={1}
            className="mt-2"
            data-testid="slider-stress"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="flex justify-between">
            <span>Sleep (hours)</span>
            <span className="text-foreground/60">{sleepHours}h</span>
          </Label>
          <Slider
            value={[sleepHours]}
            onValueChange={([v]) => setSleepHours(v)}
            min={0}
            max={12}
            step={0.5}
            className="mt-2"
            data-testid="slider-sleep"
          />
        </div>
        <div>
          <Label className="flex justify-between">
            <span>Water (glasses)</span>
            <span className="text-foreground/60">{waterIntake}</span>
          </Label>
          <Slider
            value={[waterIntake]}
            onValueChange={([v]) => setWaterIntake(v)}
            min={0}
            max={16}
            step={1}
            className="mt-2"
            data-testid="slider-water"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="symptom-notes">Notes</Label>
        <Textarea
          id="symptom-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How are you feeling today?"
          className="mt-1"
          data-testid="input-symptom-notes"
        />
      </div>

      <Button type="submit" className="w-full" disabled={mutation.isPending} data-testid="button-submit-symptoms">
        {mutation.isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
