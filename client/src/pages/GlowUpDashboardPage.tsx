import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Check, Sparkles, Copy, Save, Book, ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";
import { glowUpLessons } from "@shared/glowUpData";

export default function GlowUpDashboardPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [gptResponse, setGptResponse] = useState("");
  const [publicPostDraft, setPublicPostDraft] = useState("");

  const { data: profile } = useQuery<any>({
    queryKey: ['/api/glow-up/profile'],
  });

  const { data: progress } = useQuery<any>({
    queryKey: ['/api/glow-up/progress'],
  });

  const { data: journalEntries } = useQuery<any>({
    queryKey: ['/api/glow-up/journal'],
  });

  const saveJournalMutation = useMutation({
    mutationFn: (data: { day: number; gptResponse: string; publicPostDraft: string }) =>
      apiRequest('POST', '/api/glow-up/journal', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/glow-up/journal'] });
      toast({
        title: "Saved! ✨",
        description: "Your responses have been saved to your journal.",
      });
    },
  });

  const markDayCompleteMutation = useMutation({
    mutationFn: (day: number) =>
      apiRequest('POST', '/api/glow-up/progress', { day }),
    onSuccess: (_, day) => {
      queryClient.invalidateQueries({ queryKey: ['/api/glow-up/progress'] });
      toast({
        title: `Day ${day} Complete! 🎉`,
        description: day === 14 ? "You've completed the entire program!" : "Ready for the next lesson!",
      });
      setExpandedDay(null);
      setGptResponse("");
      setPublicPostDraft("");
      
      if (day === 14) {
        setTimeout(() => setLocation("/glow-up/complete"), 1500);
      }
    },
  });

  if (!profile || !progress) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Complete onboarding first</p>
          <Button onClick={() => setLocation("/glow-up")} data-testid="button-start-onboarding">
            Start Onboarding
          </Button>
        </Card>
      </div>
    );
  }

  const completedDays = progress.completedDays || [];
  const progressPercentage = (completedDays.length / 14) * 100;

  const isDayUnlocked = (day: number): boolean => {
    if (day === 1) return true;
    return completedDays.includes(day - 1);
  };

  const isDayCompleted = (day: number): boolean => {
    return completedDays.includes(day);
  };

  const handleSaveJournal = (day: number) => {
    if (!gptResponse.trim() && !publicPostDraft.trim()) {
      toast({
        title: "Nothing to save",
        description: "Add some content before saving",
        variant: "destructive",
      });
      return;
    }
    saveJournalMutation.mutate({ day, gptResponse, publicPostDraft });
  };

  const handleMarkComplete = (day: number) => {
    markDayCompleteMutation.mutate(day);
  };

  const handleCopyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied! ✓",
      description: `${type} copied to clipboard`,
    });
  };

  const mergePlaceholders = (template: string): string => {
    return template
      .replace(/{name}/g, profile.name)
      .replace(/{brandType}/g, profile.brandType)
      .replace(/{niche}/g, profile.niche)
      .replace(/{platform}/g, profile.platform)
      .replace(/{goal}/g, profile.goal);
  };

  const handleExpandDay = (day: number) => {
    if (!isDayUnlocked(day)) return;
    
    if (expandedDay === day) {
      setExpandedDay(null);
      setGptResponse("");
      setPublicPostDraft("");
    } else {
      setExpandedDay(day);
      const existing = journalEntries?.find((e: any) => e.day === day);
      setGptResponse(existing?.gptResponse || "");
      setPublicPostDraft(existing?.publicPostDraft || "");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-cormorant text-4xl md:text-5xl font-bold metallic-text">
                AI Glow-Up Program
              </h1>
              <p className="text-muted-foreground mt-2">
                Welcome, {profile.name}! {completedDays.length} of 14 days complete
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setLocation("/glow-up/journal")}
              className="gap-2"
              data-testid="button-view-journal"
            >
              <Book className="w-4 h-4" />
              My Journal
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
        </div>

        <div className="grid gap-4">
          {glowUpLessons.map((lesson) => {
            const isUnlocked = isDayUnlocked(lesson.day);
            const isCompleted = isDayCompleted(lesson.day);
            const isExpanded = expandedDay === lesson.day;

            return (
              <motion.div
                key={lesson.day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: lesson.day * 0.05 }}
              >
                <Card
                  className={`overflow-hidden ${isUnlocked ? 'hover-elevate cursor-pointer' : 'opacity-60'}`}
                  onClick={() => handleExpandDay(lesson.day)}
                  data-testid={`card-day-${lesson.day}`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                          isCompleted
                            ? 'bg-gradient-to-br from-[hsl(var(--liquid-gold))]/30 to-[hsl(var(--cyber-fuchsia))]/20'
                            : isUnlocked
                            ? 'bg-primary/10'
                            : 'bg-muted'
                        }`}>
                          {isCompleted ? (
                            <Check className="w-6 h-6 text-[hsl(var(--liquid-gold))]" />
                          ) : isUnlocked ? (
                            <Calendar className="w-6 h-6 text-primary" />
                          ) : (
                            <Lock className="w-6 h-6 text-muted-foreground" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <Badge variant={isCompleted ? "default" : "outline"}>
                              Day {lesson.day}
                            </Badge>
                            {isCompleted && (
                              <Badge variant="secondary" className="gap-1">
                                <Check className="w-3 h-3" />
                                Complete
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-cormorant text-2xl font-bold mb-2">
                            {lesson.title}
                          </h3>
                          <p className="text-muted-foreground line-clamp-2">
                            {lesson.lesson.substring(0, 150)}...
                          </p>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-6 pt-6 border-t space-y-6"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-primary" />
                              Today's Lesson
                            </h4>
                            <p className="text-sm leading-relaxed">{lesson.lesson}</p>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-primary" />
                                AI Prompt Task
                              </h4>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCopyToClipboard(mergePlaceholders(lesson.gptPromptTemplate), "Prompt")}
                                className="gap-2"
                                data-testid={`button-copy-prompt-${lesson.day}`}
                              >
                                <Copy className="w-3 h-3" />
                                Copy Prompt
                              </Button>
                            </div>
                            <div className="p-4 rounded-lg bg-muted/50 border">
                              <p className="text-sm">{mergePlaceholders(lesson.gptPromptTemplate)}</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-3">Your AI Response</h4>
                            <Textarea
                              placeholder="Paste or write your AI-generated response here..."
                              value={gptResponse}
                              onChange={(e) => setGptResponse(e.target.value)}
                              rows={6}
                              data-testid={`textarea-gpt-response-${lesson.day}`}
                            />
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold">Share Template</h4>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCopyToClipboard(lesson.shareCaption, "Caption")}
                                className="gap-2"
                                data-testid={`button-copy-caption-${lesson.day}`}
                              >
                                <Copy className="w-3 h-3" />
                                Copy Caption
                              </Button>
                            </div>
                            <div className="p-4 rounded-lg bg-muted/50 border mb-3">
                              <p className="text-sm">{lesson.shareCaption}</p>
                            </div>
                            <Textarea
                              placeholder="Customize your public post here..."
                              value={publicPostDraft}
                              onChange={(e) => setPublicPostDraft(e.target.value)}
                              rows={4}
                              data-testid={`textarea-post-draft-${lesson.day}`}
                            />
                          </div>

                          <div className="flex gap-3 pt-4">
                            <Button
                              onClick={() => handleSaveJournal(lesson.day)}
                              variant="outline"
                              className="gap-2"
                              disabled={saveJournalMutation.isPending}
                              data-testid={`button-save-journal-${lesson.day}`}
                            >
                              <Save className="w-4 h-4" />
                              Save to Journal
                            </Button>
                            {!isCompleted && (
                              <Button
                                onClick={() => handleMarkComplete(lesson.day)}
                                className="gap-2"
                                disabled={markDayCompleteMutation.isPending}
                                data-testid={`button-complete-day-${lesson.day}`}
                              >
                                Mark Complete
                                <ArrowRight className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
