import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Book, ArrowLeft, Copy, Edit2, Calendar, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";
import { glowUpLessons } from "@shared/glowUpData";
import type { GlowUpJournalDB } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";

export default function GlowUpJournalPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [editedResponse, setEditedResponse] = useState("");
  const [editedDraft, setEditedDraft] = useState("");

  const { data: journalEntries } = useQuery<GlowUpJournalDB[]>({
    queryKey: ['/api/glow-up/journal'],
  });

  const updateJournalMutation = useMutation({
    mutationFn: (data: { day: number; gptResponse: string; publicPostDraft: string }) =>
      apiRequest('POST', '/api/glow-up/journal', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/glow-up/journal'] });
      toast({
        title: "Updated! ✨",
        description: "Your journal entry has been updated.",
      });
      setEditingDay(null);
    },
  });

  const handleCopyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied! ✓",
      description: `${type} copied to clipboard`,
    });
  };

  const handleStartEdit = (entry: any) => {
    setEditingDay(entry.day);
    setEditedResponse(entry.gptResponse || "");
    setEditedDraft(entry.publicPostDraft || "");
  };

  const handleSaveEdit = (day: number) => {
    updateJournalMutation.mutate({
      day,
      gptResponse: editedResponse,
      publicPostDraft: editedDraft,
    });
  };

  const handleCancelEdit = () => {
    setEditingDay(null);
    setEditedResponse("");
    setEditedDraft("");
  };

  // Check if user is Pro
  if (user && !user.isPro) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
        <Card className="w-full max-w-2xl p-8 md:p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[hsl(var(--liquid-gold))]/30 to-[hsl(var(--cyber-fuchsia))]/20 mb-6">
            <Crown className="w-10 h-10 text-[hsl(var(--liquid-gold))]" />
          </div>
          
          <h1 className="font-cormorant text-4xl md:text-5xl font-bold metallic-text mb-4">
            Pro Feature
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            The AI Glow-Up Program is exclusive to Pro members. Upgrade to unlock your 14-day brand transformation journey.
          </p>
          
          <Button
            size="lg"
            className="gap-2"
            onClick={() => setLocation("/account")}
            data-testid="button-upgrade-pro"
          >
            <Crown className="w-5 h-5" />
            Upgrade to Pro
          </Button>
        </Card>
      </div>
    );
  }

  if (!journalEntries || journalEntries.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => setLocation("/glow-up/dashboard")}
            className="mb-6 gap-2"
            data-testid="button-back-dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>

          <Card className="p-12 text-center">
            <Book className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-cormorant text-3xl font-bold mb-2">Your Journal is Empty</h2>
            <p className="text-muted-foreground mb-6">
              Start completing days in the dashboard to build your brand journal.
            </p>
            <Button onClick={() => setLocation("/glow-up/dashboard")} data-testid="button-goto-dashboard">
              Go to Dashboard
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-cormorant text-4xl md:text-5xl font-bold metallic-text mb-2">
              My Glow-Up Journal
            </h1>
            <p className="text-muted-foreground">
              {journalEntries.length} {journalEntries.length === 1 ? 'entry' : 'entries'} saved
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setLocation("/glow-up/dashboard")}
            className="gap-2"
            data-testid="button-back-to-dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Button>
        </div>

        <div className="grid gap-6">
          {journalEntries.map((entry: any) => {
            const lesson = glowUpLessons.find((l) => l.day === entry.day);
            const isEditing = editingDay === entry.day;

            return (
              <motion.div
                key={entry.day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: entry.day * 0.05 }}
              >
                <Card className="overflow-hidden" data-testid={`journal-entry-${entry.day}`}>
                  <div className="p-6 space-y-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="default">Day {entry.day}</Badge>
                          <Badge variant="outline" className="gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(entry.updatedAt || entry.createdAt).toLocaleDateString()}
                          </Badge>
                        </div>
                        <h3 className="font-cormorant text-2xl font-bold">
                          {lesson?.title}
                        </h3>
                      </div>
                      {!isEditing && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStartEdit(entry)}
                          className="gap-2"
                          data-testid={`button-edit-entry-${entry.day}`}
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </Button>
                      )}
                    </div>

                    {entry.gptResponse && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                            AI Response
                          </h4>
                          {!isEditing && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCopyToClipboard(entry.gptResponse, "AI Response")}
                              className="gap-2"
                              data-testid={`button-copy-response-${entry.day}`}
                            >
                              <Copy className="w-3 h-3" />
                              Copy
                            </Button>
                          )}
                        </div>
                        {isEditing ? (
                          <Textarea
                            value={editedResponse}
                            onChange={(e) => setEditedResponse(e.target.value)}
                            rows={8}
                            data-testid={`textarea-edit-response-${entry.day}`}
                          />
                        ) : (
                          <div className="p-4 rounded-lg bg-muted/50 border">
                            <p className="text-sm whitespace-pre-wrap">{entry.gptResponse}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {entry.publicPostDraft && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                            Public Post Draft
                          </h4>
                          {!isEditing && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCopyToClipboard(entry.publicPostDraft, "Post Draft")}
                              className="gap-2"
                              data-testid={`button-copy-draft-${entry.day}`}
                            >
                              <Copy className="w-3 h-3" />
                              Copy
                            </Button>
                          )}
                        </div>
                        {isEditing ? (
                          <Textarea
                            value={editedDraft}
                            onChange={(e) => setEditedDraft(e.target.value)}
                            rows={5}
                            data-testid={`textarea-edit-draft-${entry.day}`}
                          />
                        ) : (
                          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                            <p className="text-sm whitespace-pre-wrap">{entry.publicPostDraft}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {isEditing && (
                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={() => handleSaveEdit(entry.day)}
                          disabled={updateJournalMutation.isPending}
                          data-testid={`button-save-edit-${entry.day}`}
                        >
                          Save Changes
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleCancelEdit}
                          data-testid={`button-cancel-edit-${entry.day}`}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
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
