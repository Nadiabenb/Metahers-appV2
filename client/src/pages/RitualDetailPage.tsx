import { useRoute, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Sparkles } from "lucide-react";
import { rituals } from "@shared/schema";
import { RitualStepper } from "@/components/RitualStepper";
import { PlanBadge } from "@/components/PlanBadge";
import { ProgressRing } from "@/components/ProgressRing";
import { Button } from "@/components/ui/button";
import { useRitualProgress } from "@/hooks/useRitualProgress";
import { useAuth } from "@/hooks/useAuth";
import { SEO } from "@/components/SEO";

export default function RitualDetailPage() {
  const [, params] = useRoute("/rituals/:slug");
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const ritual = rituals.find(r => r.slug === params?.slug);
  const { completedSteps, isLoading } = useRitualProgress(ritual?.slug || "");

  const progress = ritual
    ? (completedSteps.length / ritual.steps.length) * 100
    : 0;

  const isQuizUnlocked = user?.quizUnlockedRitual === ritual?.slug;

  if (!ritual) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
            Ritual not found
          </h1>
          <Button onClick={() => setLocation("/rituals")} data-testid="button-back-rituals">
            Back to Rituals
          </Button>
        </div>
      </div>
    );
  }

  const seoTitle = ritual.title;
  const seoDescription = `${ritual.summary} Learn through ${ritual.steps.length} guided steps in ${ritual.duration_min} minutes.`;
  const slug = params?.slug;

  const seoKeywords = `${ritual.title}, ${ritual.category}, AI learning, Web3 education, women in tech, ${ritual.title.toLowerCase()} course`;

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": ritual.title,
    "description": ritual.description,
    "provider": {
      "@type": "Organization",
      "name": "MetaHers",
      "url": "https://metahers.ai"
    },
    "educationalLevel": "Beginner",
    "timeRequired": `PT${ritual.duration}M`,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "courseWorkload": `PT${ritual.duration}M`
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is this course suitable for beginners?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Our rituals are designed for complete beginners with no prior tech experience. Each ritual includes step-by-step guidance and hands-on practice."
        }
      },
      {
        "@type": "Question",
        "name": "How long does this ritual take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `This ritual takes approximately ${ritual.duration} minutes to complete at your own pace.`
        }
      },
      {
        "@type": "Question",
        "name": "What will I learn?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": ritual.description
        }
      },
      {
        "@type": "Question",
        "name": "Do I need any special tools or software?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No special tools required! Everything you need is provided within the ritual interface."
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://metahers.ai"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Rituals",
        "item": "https://metahers.ai/rituals"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": ritual.title,
        "item": `https://metahers.ai/rituals/${slug}`
      }
    ]
  };


  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        type="article"
        url={`https://metahers.ai/rituals/${slug}`}
        schema={[courseSchema, faqSchema, breadcrumbSchema]}
      />
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="ghost"
            onClick={() => setLocation("/rituals")}
            className="mb-8 gap-2"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Rituals
          </Button>

          <div className="editorial-card p-8 mb-8 relative overflow-hidden">
            <div className="absolute inset-0 gradient-violet-magenta opacity-5" />
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="font-serif text-4xl font-bold text-foreground mb-2" data-testid="text-ritual-title">
                        {ritual.title}
                      </h1>
                      <div className="flex items-center gap-4 text-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span data-testid="text-duration">{ritual.duration_min} minutes</span>
                        </div>
                      </div>
                    </div>
                    <PlanBadge tier={ritual.tier} />
                  </div>

                  <p className="text-lg text-foreground/80 mb-6" data-testid="text-summary">
                    {ritual.summary}
                  </p>

                  {isQuizUnlocked && (
                    <div className="bg-gradient-to-r from-[hsl(var(--hyper-violet))]/10 via-[hsl(var(--magenta-quartz))]/10 to-[hsl(var(--liquid-gold))]/10 border border-[hsl(var(--liquid-gold))]/30 rounded-xl p-4 mb-6" data-testid="alert-quiz-unlocked">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-[hsl(var(--liquid-gold))]" />
                        <p className="text-sm font-semibold text-foreground">
                          Quiz Discovery Gift!
                        </p>
                      </div>
                      <p className="text-sm text-foreground/80">
                        This ritual was unlocked via your personalized quiz. Complete all steps to book your FREE 1:1 session with the founder.
                      </p>
                    </div>
                  )}

                  {ritual.tier === "pro" && !isQuizUnlocked && (
                    <div className="bg-[hsl(var(--liquid-gold))]/10 border border-[hsl(var(--liquid-gold))]/30 rounded-xl p-4 mb-6" data-testid="alert-pro-required">
                      <p className="text-sm text-foreground">
                        <strong>Pro Ritual:</strong> Steps 3-5 require Pro access.
                        Unlock with a Ritual Bag purchase.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center gap-4">
                  {isLoading ? (
                    <div className="w-32 h-32 rounded-full bg-muted animate-pulse" />
                  ) : (
                    <ProgressRing progress={progress} />
                  )}
                  <div className="text-center">
                    <div className="text-sm text-foreground uppercase tracking-wide mb-1">
                      Progress
                    </div>
                    <div className="font-semibold text-foreground" data-testid="text-progress">
                      {completedSteps.length} of {ritual.steps.length} steps
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
              Ritual Steps
            </h2>
            <RitualStepper
              steps={ritual.steps}
              ritualSlug={ritual.slug}
              isPro={ritual.tier === "pro"}
            />
          </div>

          {progress === 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="editorial-card p-8 text-center relative overflow-hidden"
              data-testid="completion-celebration"
            >
              <div className="absolute inset-0 gradient-teal-gold opacity-10" />
              <div className="relative z-10">
                <div className="text-6xl mb-4">✨</div>
                <h3 className="font-serif text-3xl font-bold text-primary mb-3">
                  Ritual Complete!
                </h3>
                <p className="text-foreground/80 mb-6">
                  Congratulations on completing {ritual.title}. Take a moment to reflect in your journal.
                </p>

                {isQuizUnlocked && (
                  <div className="bg-gradient-to-r from-[hsl(var(--hyper-violet))]/10 via-[hsl(var(--magenta-quartz))]/10 to-[hsl(var(--liquid-gold))]/10 border border-[hsl(var(--liquid-gold))]/30 rounded-xl p-6 mb-6">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Sparkles className="w-6 h-6 text-[hsl(var(--liquid-gold))]" />
                      <h4 className="font-serif text-xl font-bold text-foreground">
                        Claim Your FREE 1:1 Session
                      </h4>
                    </div>
                    <p className="text-foreground/80 mb-4">
                      You've completed your quiz-matched ritual! Now book your complimentary discovery call with the founder.
                    </p>
                    <Button
                      size="lg"
                      onClick={() => window.open('https://calendly.com/metahers/discovery', '_blank')}
                      className="gap-2 bg-[hsl(var(--gold-highlight))] text-black"
                      data-testid="button-book-calendly"
                    >
                      Book Your Session
                    </Button>
                  </div>
                )}

                <Button
                  size="lg"
                  variant={isQuizUnlocked ? "outline" : "default"}
                  onClick={() => setLocation("/journal")}
                  className="gap-2"
                  data-testid="button-go-journal"
                >
                  Open Journal
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}