import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Heart, Star, Zap, Users, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { quizQuestions, matchRitual, getRitualBySlug } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";
import { Input } from "@/components/ui/input";
import { trackCTAClick, trackQuizComplete } from "@/lib/analytics";

export default function DiscoverPage() {
  const [stage, setStage] = useState<"intro" | "quiz" | "results" | "email-capture">("intro");
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

    // Track quiz start
    trackCTAClick('quiz_start', '/discover', 'free');

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
    // Calculate matched ritual
    const ritual = matchRitual(finalAnswers);
    setMatchedRitualSlug(ritual);

    // If user is logged in, submit immediately and show results
    if (user) {
      setIsSubmitting(true);
      try {
        await apiRequest("POST", "/api/quiz/submit", {
          name: name || "Spa Member",
          email: user.email,
          answers: finalAnswers,
        });
        trackQuizComplete(ritual);
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
    } else {
      // Show email capture modal for non-logged-in users
      setStage("email-capture");
    }
  };

  const handleEmailSubmit = async () => {
    // Validate email
    if (!email || !email.includes('@')) {
      toast({
        title: "Email Required",
        description: "Please enter a valid email to unlock your results.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Submit quiz with email
      await apiRequest("POST", "/api/quiz/submit", {
        name: name || "Spa Member",
        email: email,
        answers: answers,
      });

      // Track quiz completion
      trackQuizComplete(matchedRitualSlug);

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
      <div className="min-h-screen relative py-12 px-4 sm:px-6 lg:px-8" style={{ background: '#0D0B14' }}
      >
        
        <div className="relative z-10">
          <SEO
            title="Discover Your Perfect AI & Web3 Ritual - Free Quiz"
            description="Discover your perfect AI & Web3 learning path in 2 minutes. Free personalized quiz matches you with hands-on rituals for beginners. Start learning today!"
            keywords="AI quiz, Web3 assessment, personalized learning, AI course finder, blockchain quiz, tech education quiz"
          />
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

            <h1 className="font-semibold text-5xl sm:text-6xl md:text-7xl text-white leading-tight">
              Discover Your Ritual
            </h1>

            <p className="text-xl sm:text-2xl max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Take this personalized quiz to discover which MetaHers ritual unlocks your potential—
              <span className="text-purple-600 font-semibold"> plus a FREE 1:1 session with the founder</span>.
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

            <Button
              size="lg"
              onClick={handleStartQuiz}
              className="gap-2 px-8 py-6 text-lg bg-[hsl(var(--gold-highlight))] text-black rounded-full shadow-xl hover:scale-105 transition-transform"
              data-testid="button-start-quiz"
            >
              Start Quiz - 90 Seconds
              <ArrowRight className="w-5 h-5" />
            </Button>

            <p className="text-sm text-foreground">
              Limited to MetaHers WhatsApp community members • Takes 2 minutes
            </p>
          </motion.div>
          </div>
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
            <div className="flex justify-between text-sm text-foreground mb-2">
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

  // Email capture stage (shown after quiz, before results for non-logged-in users)
  if (stage === "email-capture") {
    const matchedRitual = getRitualBySlug(matchedRitualSlug);

    return (
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 glass-card px-6 py-3 rounded-full neon-glow-violet mb-4">
              <Sparkles className="w-5 h-5 text-[hsl(var(--liquid-gold))]" />
              <span className="text-sm font-medium tracking-wider uppercase">
                Quiz Complete!
              </span>
            </div>

            <h1 className="font-semibold text-4xl sm:text-5xl text-white leading-tight">
              Your Perfect Ritual Is Ready
            </h1>

            <Card className="p-8 neon-glow-magenta space-y-6">
              {/* Blurred preview */}
              <div className="relative">
                <div className="filter blur-sm opacity-50 pointer-events-none">
                  <h3 className="font-serif text-2xl font-bold mb-3">{matchedRitual?.title}</h3>
                  <p className="text-foreground/70">{matchedRitual?.summary}</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-3 px-6">
                    <Star className="w-12 h-12 text-[hsl(var(--liquid-gold))] mx-auto animate-pulse" />
                    <p className="font-serif text-xl font-bold text-foreground">
                      Unlock Your Results
                    </p>
                  </div>
                </div>
              </div>

              {/* Value props */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border/40">
                <div className="text-center">
                  <Sparkles className="w-6 h-6 text-[hsl(var(--aurora-teal))] mx-auto mb-2" />
                  <p className="text-sm text-foreground/80">Personalized Match</p>
                </div>
                <div className="text-center">
                  <Zap className="w-6 h-6 text-[hsl(var(--liquid-gold))] mx-auto mb-2" />
                  <p className="text-sm text-foreground/80">Instant Access</p>
                </div>
                <div className="text-center">
                  <Crown className="w-6 h-6 text-[hsl(var(--magenta-quartz))] mx-auto mb-2" />
                  <p className="text-sm text-foreground/80">FREE 1:1 Session</p>
                </div>
              </div>

              {/* Email capture form */}
              <div className="space-y-4 pt-4">
                <Input
                  type="text"
                  placeholder="Your name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-center"
                  data-testid="input-email-capture-name"
                />
                <Input
                  type="email"
                  placeholder="Enter your email to unlock results"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-center text-lg"
                  required
                  data-testid="input-email-capture-email"
                  onKeyDown={(e) => e.key === 'Enter' && handleEmailSubmit()}
                />
                <Button
                  size="lg"
                  onClick={handleEmailSubmit}
                  disabled={isSubmitting || !email || !email.includes('@')}
                  className="w-full gap-2 bg-[hsl(var(--gold-highlight))] text-black hover:scale-105 transition-transform"
                  data-testid="button-unlock-results"
                >
                  {isSubmitting ? "Unlocking..." : "Unlock My Results"}
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <p className="text-xs text-foreground">
                  We'll email you your ritual + 1:1 session link. No spam, ever.
                </p>
              </div>
            </Card>

            {/* Trust signals */}
            <div className="flex items-center justify-center gap-2 text-sm text-foreground">
              <Users className="w-4 h-4" />
              <span>Join 2,500+ women mastering AI & Web3</span>
            </div>
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
                <div key={step.id} className="flex items-center gap-3 text-left">
                  <div className="w-6 h-6 rounded-full bg-[hsl(var(--liquid-gold))]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-[hsl(var(--liquid-gold))]">{index + 1}</span>
                  </div>
                  <span className="text-foreground/80">{step.title}</span>
                </div>
              ))}
            </div>

            {/* Social Proof Section */}
            <div className="bg-gradient-to-r from-[hsl(var(--hyper-violet))]/5 via-[hsl(var(--magenta-quartz))]/5 to-[hsl(var(--cyber-fuchsia))]/5 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Users className="w-5 h-5 text-[hsl(var(--liquid-gold))]" />
                <h3 className="font-serif text-lg font-bold text-foreground">
                  Join 500+ Women Learning AI & Web3
                </h3>
              </div>
              <div className="space-y-3">
                <div className="text-sm text-foreground/80 italic">
                  "This quiz matched me perfectly! The AI ritual transformed how I approach content creation." <span className="text-[hsl(var(--liquid-gold))]">— Sarah M., Marketing Manager</span>
                </div>
                <div className="text-sm text-foreground/80 italic">
                  "Finally, tech education that doesn't feel overwhelming. The Forbes-meets-Vogue aesthetic makes learning actually enjoyable." <span className="text-[hsl(var(--liquid-gold))]">— Jessica R., Entrepreneur</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-r from-[hsl(var(--hyper-violet))]/10 via-[hsl(var(--magenta-quartz))]/10 to-[hsl(var(--liquid-gold))]/10 rounded-xl mb-6">
              <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                🎁 Your Special Gift
              </h3>
              <p className="text-foreground/80 mb-3">
                This ritual is now unlocked in your account! Complete it to schedule your FREE 1:1 session with the founder.
              </p>
              <p className="text-sm text-foreground">
                We'll also send you a WhatsApp message with next steps.
              </p>
            </div>

            <div className="space-y-6">
              {/* Primary CTA */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <Button
                    size="lg"
                    onClick={() => window.location.href = "/rituals"}
                    className="gap-2 bg-[hsl(var(--gold-highlight))] text-black"
                    data-testid="button-go-to-rituals"
                  >
                    Start Your Ritual
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                ) : (
                  <>
                    <Button
                      size="lg"
                      onClick={() => {
                        // Store matched ritual in localStorage for signup flow
                        localStorage.setItem('quiz_matched_ritual', matchedRitualSlug);
                        localStorage.setItem('quiz_email', email);
                        localStorage.setItem('quiz_name', name);
                        window.location.href = "/signup";
                      }}
                      className="gap-2 bg-[hsl(var(--gold-highlight))] text-black"
                      data-testid="button-signup-claim"
                    >
                      Create Free Account
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => {
                        // Store matched ritual for login flow
                        localStorage.setItem('quiz_matched_ritual', matchedRitualSlug);
                        window.location.href = "/login";
                      }}
                      data-testid="button-login-claim"
                    >
                      Already Have an Account?
                    </Button>
                  </>
                )}
              </div>

              {/* VIP Cohort Upsell - Only for non-users */}
              {!user && (
                <div className="border-t border-border/40 pt-6">
                  <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-xl p-6 border-2 border-primary/20">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Crown className="w-5 h-5 text-primary" />
                      <h3 className="font-cormorant text-xl font-bold text-foreground">
                        Want Guided Mentorship?
                      </h3>
                    </div>
                    <p className="text-center text-foreground/80 mb-4">
                      Skip self-paced learning. Get <span className="font-bold">4 weeks of intensive 1:1 coaching</span>, live office hours, and a luxury ritual bag for just $197.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                      <Button
                        size="lg"
                        onClick={() => window.location.href = "/vip-cohort"}
                        className="gap-2 bg-primary hover:bg-primary/90"
                        data-testid="button-vip-cohort-upsell"
                      >
                        <Crown className="w-4 h-4" />
                        Join VIP Cohort - $197
                      </Button>
                      <span className="text-sm text-foreground">
                        🔥 Only 3 spots left
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Button
            variant="ghost"
            onClick={() => {
              trackCTAClick('quiz_restart', '/discover', 'free');
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