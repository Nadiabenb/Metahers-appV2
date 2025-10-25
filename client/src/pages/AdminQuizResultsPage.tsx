import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Sparkles, Mail, Calendar, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import type { QuizSubmissionDB } from "@shared/schema";

export default function AdminQuizResultsPage() {
  const { user } = useAuth();
  
  const { data: submissions, isLoading } = useQuery<QuizSubmissionDB[]>({
    queryKey: ["/api/quiz/admin/all"],
    enabled: !!user,
  });

  // Simple admin check - only allow specific email
  if (user?.email !== "hello@metahers.ai" && user?.email !== "metahers@gmail.com") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="p-8 text-center">
          <h1 className="font-serif text-2xl font-bold text-foreground mb-4">
            Access Denied
          </h1>
          <p className="text-foreground/80">
            You don't have permission to view this page.
          </p>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/70">Loading quiz submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-8 h-8 text-[hsl(var(--liquid-gold))]" />
            <h1 className="font-serif text-4xl font-bold text-foreground" data-testid="heading-admin-quiz">
              Quiz Submissions
            </h1>
          </div>

          <div className="grid gap-4 mb-8">
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Submissions</p>
                  <p className="text-3xl font-bold text-foreground" data-testid="stat-total">
                    {submissions?.length || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Claimed (Signed Up)</p>
                  <p className="text-3xl font-bold text-[hsl(var(--aurora-teal))]" data-testid="stat-claimed">
                    {submissions?.filter(s => s.claimed).length || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Completed Rituals</p>
                  <p className="text-3xl font-bold text-[hsl(var(--liquid-gold))]" data-testid="stat-completed">
                    {submissions?.filter(s => s.ritualCompleted).length || 0}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            {submissions && submissions.length === 0 && (
              <Card className="p-12 text-center">
                <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  No Submissions Yet
                </h3>
                <p className="text-muted-foreground">
                  Quiz submissions will appear here once users complete the discovery quiz.
                </p>
              </Card>
            )}

            {submissions?.map((submission) => (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6" data-testid={`submission-${submission.id}`}>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-serif text-xl font-bold text-foreground">
                          {submission.name}
                        </h3>
                        {submission.claimed && (
                          <Badge className="bg-[hsl(var(--aurora-teal))]/20 text-[hsl(var(--aurora-teal))]">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Claimed
                          </Badge>
                        )}
                        {!submission.claimed && (
                          <Badge variant="secondary">
                            <XCircle className="w-3 h-3 mr-1" />
                            Unclaimed
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Mail className="w-4 h-4" />
                        <span data-testid={`email-${submission.id}`}>{submission.email}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {submission.createdAt 
                            ? format(new Date(submission.createdAt), "MMM d, yyyy 'at' h:mm a")
                            : "Unknown date"}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">Matched Ritual:</span>
                          <Badge className="bg-[hsl(var(--liquid-gold))]/20 text-[hsl(var(--liquid-gold))]">
                            {submission.matchedRitual}
                          </Badge>
                        </div>

                        {submission.ritualCompleted && (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-[hsl(var(--aurora-teal))]" />
                            <span className="text-sm text-foreground/80">Ritual completed</span>
                          </div>
                        )}

                        {submission.oneOnOneBooked && (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-[hsl(var(--aurora-teal))]" />
                            <span className="text-sm text-foreground/80">1:1 session booked</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="md:text-right">
                      <p className="text-xs text-muted-foreground mb-2">User ID</p>
                      <p className="text-xs font-mono text-foreground/60">
                        {submission.userId || "Not signed up"}
                      </p>
                    </div>
                  </div>

                  {/* Show quiz answers in a collapsed format */}
                  <details className="mt-4 pt-4 border-t border-border">
                    <summary className="text-sm font-semibold text-foreground cursor-pointer hover:text-[hsl(var(--liquid-gold))] transition-colors">
                      View Quiz Answers
                    </summary>
                    <div className="mt-3 space-y-2 text-sm">
                      {Object.entries(submission.answers || {}).map(([questionId, answerId]) => (
                        <div key={questionId} className="flex gap-2">
                          <span className="text-muted-foreground min-w-24">{questionId}:</span>
                          <span className="text-foreground/80">{answerId as string}</span>
                        </div>
                      ))}
                    </div>
                  </details>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
