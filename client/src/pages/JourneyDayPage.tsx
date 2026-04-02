import { useRoute } from "wouter";
import { CURRICULUM } from "@shared/curriculum";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, Target, Lightbulb, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function JourneyDayPage() {
  const [, params] = useRoute("/journey/day-:dayNumber");
  const dayNumber = parseInt(params?.dayNumber || "1");
  const dayData = CURRICULUM.find(d => d.day === dayNumber);

  if (!dayData) {
    window.location.href = "/thought-leadership";
    return null;
  }

  const nextDay = CURRICULUM.find(d => d.day === dayNumber + 1);
  const prevDay = CURRICULUM.find(d => d.day === dayNumber - 1);

  const phaseColors = {
    foundation: "text-[hsl(var(--liquid-gold))] bg-[hsl(var(--liquid-gold))]/10",
    visibility: "text-[hsl(var(--cyber-fuchsia))] bg-[hsl(var(--cyber-fuchsia))]/10",
    authority: "text-[hsl(var(--hyper-violet))] bg-[hsl(var(--hyper-violet))]/10"
  };

  const seoTitle = `Day ${dayNumber}: ${dayData.title} | 30-Day Personal Branding Journey`;
  const seoDescription = `${dayData.discovery.headline}. ${dayData.discovery.whyItMatters.substring(0, 100)}... Learn personal branding for women in tech through the MetaHers 30-day thought leadership program.`;
  const seoKeywords = `personal branding day ${dayNumber}, ${dayData.title.toLowerCase()}, women in tech, thought leadership, personal brand development, ${dayData.phase} phase branding`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": `Day ${dayNumber}: ${dayData.title}`,
    "description": seoDescription,
    "provider": {
      "@type": "Organization",
      "name": "MetaHers",
      "url": "https://metahers.ai"
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "courseWorkload": "PT1D"
    },
    "about": {
      "@type": "Thing",
      "name": "Personal Branding for Women in Tech"
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        type="article"
        url={`https://metahers.ai/journey/day-${dayNumber}`}
        schema={schema}
      />

      {/* Header */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 gradient-violet-fuchsia opacity-5" />
        <div className="container mx-auto max-w-4xl px-6 py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-xs">
                Day {dayNumber} of 30
              </Badge>
              <Badge className={`${phaseColors[dayData.phase]} text-xs capitalize`}>
                {dayData.phase} Phase
              </Badge>
            </div>
            <h1 className="font-cormorant text-5xl md:text-6xl font-bold text-foreground">
              {dayData.title}
            </h1>
            <p className="text-xl text-foreground font-light">
              {dayData.discovery.headline}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-6 py-12 space-y-8">
        {/* Discovery Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="editorial-card border-0">
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[hsl(var(--liquid-gold))]/10">
                <BookOpen className="w-5 h-5 text-[hsl(var(--liquid-gold))]" />
              </div>
              <h2 className="font-cormorant text-2xl font-bold text-foreground">
                Discovery
              </h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Today's Teaching
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  {dayData.discovery.teaching}
                </p>
              </div>

              <div className="editorial-card p-6 bg-card/50 border-l-4 border-primary">
                <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[hsl(var(--liquid-gold))]" />
                  Why This Matters
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  {dayData.discovery.whyItMatters}
                </p>
              </div>

              {dayData.discovery.founderStory && (
                <div className="italic text-foreground border-l-4 border-[hsl(var(--cyber-fuchsia))] pl-6 py-2">
                  <p className="text-sm mb-1 font-medium text-foreground">Founder's Insight:</p>
                  <p className="leading-relaxed">{dayData.discovery.founderStory}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Practice Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="editorial-card border-0">
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[hsl(var(--cyber-fuchsia))]/10">
                <Lightbulb className="w-5 h-5 text-[hsl(var(--cyber-fuchsia))]" />
              </div>
              <h2 className="font-cormorant text-2xl font-bold text-foreground">
                Practice
              </h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Your Prompt
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  {dayData.practice.prompt}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Guiding Questions
                </h3>
                <ul className="space-y-2">
                  {dayData.practice.guidingQuestions.map((question, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-primary mt-1">●</span>
                      <span className="text-foreground/80">{question}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="editorial-card p-4 bg-[hsl(var(--aurora-teal))]/5 border border-[hsl(var(--aurora-teal))]/20">
                <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-[hsl(var(--aurora-teal))]" />
                  Success Criteria
                </h3>
                <p className="text-sm text-foreground/80">
                  {dayData.practice.successCriteria}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content Focus Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="editorial-card border-0 relative overflow-hidden">
            <div className="absolute inset-0 gradient-violet-fuchsia opacity-5" />
            <CardContent className="p-8 relative z-10">
              <h2 className="font-cormorant text-2xl font-bold text-foreground mb-6">
                Today's Content Creation
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-foreground mb-1">Topic</p>
                  <p className="text-lg font-medium text-foreground">{dayData.contentFocus.topic}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground mb-1">Angle</p>
                  <p className="text-foreground/80">{dayData.contentFocus.angle}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground mb-2">Recommended Platforms</p>
                  <div className="flex flex-wrap gap-2">
                    {dayData.contentFocus.platforms.map((platform) => (
                      <Badge key={platform} variant="secondary" className="text-xs">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4 pt-8 border-t border-border">
          {prevDay ? (
            <Button
              variant="outline"
              onClick={() => window.location.href = `/journey/day-${prevDay.day}`}
              className="gap-2"
              data-testid="button-prev-day"
            >
              <ArrowLeft className="w-4 h-4" />
              Day {prevDay.day}: {prevDay.title}
            </Button>
          ) : (
            <div />
          )}

          {nextDay ? (
            <Button
              onClick={() => window.location.href = `/journey/day-${nextDay.day}`}
              className="gap-2 ml-auto"
              data-testid="button-next-day"
            >
              Day {nextDay.day}: {nextDay.title}
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={() => window.location.href = `/thought-leadership`}
              className="gap-2 ml-auto"
              data-testid="button-complete-journey"
            >
              Complete Journey
              <Sparkles className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* CTA */}
        <div className="mt-12">
          <Card className="editorial-card p-8 text-center border-0 relative overflow-hidden">
            <div className="absolute inset-0 gradient-violet-fuchsia opacity-10" />
            <div className="relative z-10 space-y-4">
              <Sparkles className="w-12 h-12 text-[hsl(var(--liquid-gold))] mx-auto" />
              <h3 className="font-cormorant text-3xl font-bold text-foreground">
                Ready to Start Your 30-Day Journey?
              </h3>
              <p className="text-foreground max-w-2xl mx-auto">
                Join MetaHers Pro to unlock the complete 30-day thought leadership journey with AI-powered content generation, daily guidance, and personalized coaching.
              </p>
              <Button
                size="lg"
                onClick={() => window.location.href = "/thought-leadership"}
                className="mt-4"
                data-testid="button-start-journey"
              >
                Explore the Journey
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
