import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Heart, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { quizQuestions, matchRitual, getRitualBySlug } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function DiscoverPage() {
  const [stage, setStage] = useState<"intro" | "quiz" | "results">("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [matchedRitualSlug, setMatchedRitualSlug] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleStartQuiz = () => {
    // Pre-fill name and email if logged in
    if (user) {
      setName(`${user.firstName || ""} ${user.lastName || ""}`.trim());
      setEmail(user.email);
    }
    setStage("quiz");
  };

  const handleAnswer = (questionId: string, answerId: string) => {
    const newAnswers = { ...answers, [questionId]: answerId };
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      setTimeout(() => {
        handleQuizComplete(newAnswers);
      }, 300);
    }
  };

  const handleQuizComplete = async (finalAnswers: Record<string, string>) => {
    setIsSubmitting(true);
    
    try {
      // Calculate matched ritual
      const ritual = matchRitual(finalAnswers);
      setMatchedRitualSlug(ritual);

      // Submit to backend
      await apiRequest("POST", "/api/quiz/submit", {
        name: name || "Unknown",
        email: email || "noemail@example.com",
        answers: finalAnswers,
      });

      setStage("results");
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast({
        title: "Submission Error",
        description: "Failed to submit quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  if (stage === "intro") {
    return (
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-8"
          >
            <div className="inline-flex items-center gap-2 glass-card px-6 py-3 rounded-full neon-glow-violet mb-4">
              <Sparkles className="w-5 h-5 text-[hsl(var(--liquid-gold))]" />
              <span className="text-sm font-medium tracking-wider uppercase">
                WhatsApp Exclusive
              </span>
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-gradient-gold leading-tight">
              Discover Your Ritual
            </h1>

            <p className="text-xl sm:text-2xl text-foreground/90 max-w-2xl mx-auto leading-relaxed">
              Take this personalized quiz to discover which MetaHers ritual unlocks your potential—
              <span className="text-gradient-magenta font-semibold"> plus a FREE 1:1 session with the founder</span>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto my-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="editorial-card p-6"
              >
                <Heart className="w-8 h-8 text-[hsl(var(--liquid-gold))] mb-3 mx-auto" />
                <h3 className="font-serif text-lg font-semibold mb-2">Personalized Match</h3>
                <p className="text-sm text-foreground/80">
                  5 thoughtful questions to find your perfect ritual
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="editorial-card p-6"
              >
                <Star className="w-8 h-8 text-[hsl(var(--liquid-gold))] mb-3 mx-auto" />
                <h3 className="font-serif text-lg font-semibold mb-2">Free Ritual Unlock</h3>
                <p className="text-sm text-foreground/80">
                  Your matched ritual is unlocked immediately
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="editorial-card p-6"
              >
                <Zap className="w-8 h-8 text-[hsl(var(--liquid-gold))] mb-3 mx-auto" />
                <h3 className="font-serif text-lg font-semibold mb-2">1:1 with Founder</h3>
                <p className="text-sm text-foreground/80">
                  Book your personal session after completing the ritual
                </p>
              </motion.div>
            </div>

            {!user && (
              <div className="space-y-4 max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-6 py-3 rounded-full bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--liquid-gold))]/50"
                  data-testid="input-quiz-name"
                />
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-3 rounded-full bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--liquid-gold))]/50"
                  data-testid="input-quiz-email"
                />
              </div>
            )}

            <Button
              size="lg"
              onClick={handleStartQuiz}
              disabled={!user && (!name || !email)}
              className="gap-2 px-8 py-6 text-lg bg-[hsl(var(--liquid-gold))] text-background rounded-full shadow-xl"
              data-testid="button-start-quiz"
            >
              Begin Your Discovery
              <ArrowRight className="w-5 h-5" />
            </Button>

            <p className="text-sm text-muted-foreground">
              Limited to MetaHers WhatsApp community members • Takes 2 minutes
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (stage === "quiz") {
    const question = quizQuestions[currentQuestion];

    return (
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-card rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[hsl(var(--hyper-violet))] via-[hsl(var(--magenta-quartz))] to-[hsl(var(--liquid-gold))]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Question Card */}
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-8 md:p-12 neon-glow-violet">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
                {question.question}
              </h2>

              <div className="space-y-4">
                {question.options.map((option, index) => (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleAnswer(question.id, option.id)}
                    disabled={isSubmitting}
                    className="w-full text-left p-6 rounded-xl bg-card/50 border-2 border-border hover-elevate active-elevate-2 transition-all group"
                    data-testid={`option-${option.id}`}
                  >
                    <span className="text-lg text-foreground group-hover:text-[hsl(var(--liquid-gold))] transition-colors">
                      {option.text}
                    </span>
                  </motion.button>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Results stage
  const matchedRitual = getRitualBySlug(matchedRitualSlug);

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-8"
        >
          <div className="inline-flex items-center gap-2 glass-card px-6 py-3 rounded-full neon-glow-violet mb-4">
            <Sparkles className="w-5 h-5 text-[hsl(var(--liquid-gold))]" />
            <span className="text-sm font-medium tracking-wider uppercase">
              Your Perfect Match
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-gradient-gold leading-tight">
            {matchedRitual?.title}
          </h1>

          <Card className="p-8 md:p-12 neon-glow-magenta">
            <Badge className="mb-6" variant={matchedRitual?.tier === "pro" ? "default" : "secondary"}>
              {matchedRitual?.tier === "pro" ? "Pro Ritual" : "Free Ritual"}
            </Badge>
            
            <p className="text-xl text-foreground/90 mb-6">
              {matchedRitual?.summary}
            </p>

            <div className="space-y-2 mb-8">
              <h3 className="font-serif text-lg font-semibold text-foreground/80 mb-3">What You'll Learn:</h3>
              {matchedRitual?.steps.map((step, index) => (
                <div key={index} className="flex items-center gap-3 text-left">
                  <div className="w-6 h-6 rounded-full bg-[hsl(var(--liquid-gold))]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-[hsl(var(--liquid-gold))]">{index + 1}</span>
                  </div>
                  <span className="text-foreground/80">{step}</span>
                </div>
              ))}
            </div>

            <div className="p-6 bg-gradient-to-r from-[hsl(var(--hyper-violet))]/10 via-[hsl(var(--magenta-quartz))]/10 to-[hsl(var(--liquid-gold))]/10 rounded-xl mb-6">
              <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                🎁 Your Special Gift
              </h3>
              <p className="text-foreground/80 mb-3">
                This ritual is now unlocked in your account! Complete it to schedule your FREE 1:1 session with the founder.
              </p>
              <p className="text-sm text-muted-foreground">
                We'll also send you a WhatsApp message with next steps.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Button
                  size="lg"
                  onClick={() => window.location.href = "/rituals"}
                  className="gap-2 bg-[hsl(var(--liquid-gold))] text-background"
                  data-testid="button-go-to-rituals"
                >
                  Start Your Ritual
                  <ArrowRight className="w-5 h-5" />
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    onClick={() => window.location.href = "/signup"}
                    className="gap-2 bg-[hsl(var(--liquid-gold))] text-background"
                    data-testid="button-signup-claim"
                  >
                    Create Account to Claim
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => window.location.href = "/login"}
                    data-testid="button-login-claim"
                  >
                    Already Have an Account?
                  </Button>
                </>
              )}
            </div>
          </Card>

          <Button
            variant="ghost"
            onClick={() => {
              setStage("intro");
              setCurrentQuestion(0);
              setAnswers({});
            }}
            data-testid="button-retake-quiz"
          >
            Retake Quiz
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
