import { motion } from "framer-motion";
import { Sparkles, Users, Video, MessageCircle, Award, CheckCircle, Zap, Code2, Palette, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { OptimizedImage } from "@/components/OptimizedImage";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { trackCTAClick } from "@/lib/analytics";
import heroImage from "@assets/generated_images/VIP_Cohort_hero_background_d42d4ea1.png";

export default function AIBuilderRetreatPage() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="AI Builder's Retreat - Vibe Coding with AI Tools"
        description="Discover vibe coding and build your own app with AI. Learn Replit Agent, Claude, ChatGPT in an intimate circle ($399) or private 1:1 sessions ($999)."
        keywords="vibe coding, ai builder, replit agent, claude artifacts, chatgpt, no-code, women in tech, ai learning"
      />

      {/* Hero Section */}
      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <OptimizedImage
          src={heroImage}
          alt="AI Builder's Retreat"
          className="absolute inset-0 w-full h-full object-cover"
          priority
        />
        <div className="absolute inset-0 gradient-overlay-vertical" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Badge className="bg-primary/20 text-primary border-primary/30 backdrop-blur-md mb-4">
              <Code2 className="w-3 h-3 mr-1" />
              Vibe Coding with AI
            </Badge>
            
            <h1 className="font-cormorant text-6xl md:text-7xl lg:text-8xl font-bold text-white drop-shadow-2xl">
              AI Builder's Retreat
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 font-light max-w-3xl mx-auto drop-shadow-lg">
              Master AI coding tools (Replit Agent, Claude, ChatGPT) and build the app you need—no pressure, pure creative flow
            </p>

            <div className="flex flex-col sm:flex-row gap-6 items-center justify-center pt-6">
              {/* Group Retreat */}
              <div className="bg-background/80 backdrop-blur-lg rounded-2xl p-6 border-2 border-primary/30">
                <div className="text-center">
                  <Badge className="mb-2">
                    <Users className="w-3 h-3 mr-1" />
                    Intimate Circle
                  </Badge>
                  <div className="text-5xl font-bold text-white drop-shadow-lg mb-1">$399</div>
                  <div className="text-white/80 text-sm mb-4">4-Week Group Journey</div>
                  <Button 
                    size="lg" 
                    onClick={() => {
                      trackCTAClick('ai_builder_group_hero_cta', '/signup', 'ai_builder_group');
                      localStorage.setItem('ai_builder_interest', 'true');
                      localStorage.setItem('ai_builder_tier', 'group');
                      window.location.href = "/signup";
                    }}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                    data-testid="button-join-builder-group"
                  >
                    <Sparkles className="w-4 h-4" />
                    Join Group Retreat
                  </Button>
                </div>
              </div>

              {/* 1:1 Private */}
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-lg rounded-2xl p-6 border-2 border-primary">
                <div className="text-center">
                  <Badge className="mb-2 bg-primary text-primary-foreground">
                    <Zap className="w-3 h-3 mr-1" />
                    Private Suite
                  </Badge>
                  <div className="text-5xl font-bold text-white drop-shadow-lg mb-1">$999</div>
                  <div className="text-white/80 text-sm mb-4">6-Week 1:1 Journey</div>
                  <Button 
                    size="lg" 
                    onClick={() => {
                      trackCTAClick('ai_builder_private_hero_cta', '/signup', 'ai_builder_private');
                      localStorage.setItem('ai_builder_interest', 'true');
                      localStorage.setItem('ai_builder_tier', 'private');
                      window.location.href = "/signup";
                    }}
                    className="w-full bg-white text-background hover:bg-white/90 gap-2"
                    data-testid="button-join-builder-private"
                  >
                    <Sparkles className="w-4 h-4" />
                    Reserve Private Suite
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 max-w-6xl">
        {/* What is Vibe Coding? */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="font-cormorant text-5xl font-bold text-foreground mb-4">
              What is Vibe Coding?
            </h2>
            <p className="text-xl text-foreground max-w-3xl mx-auto">
              Forget traditional coding stress. Vibe coding is about creative flow—partnering with AI tools to bring your app vision to life without pressure or overwhelm
            </p>
          </div>

          <Card className="editorial-card border-primary/20">
            <CardContent className="p-10">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                    <Code2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-cormorant text-xl font-bold text-foreground mb-2">
                    No Pressure
                  </h3>
                  <p className="text-sm text-foreground">
                    Learn at your own pace in a calm, supportive sanctuary. No coding experience needed.
                  </p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                    <Palette className="w-8 h-8" />
                  </div>
                  <h3 className="font-cormorant text-xl font-bold text-foreground mb-2">
                    Pure Creativity
                  </h3>
                  <p className="text-sm text-foreground">
                    AI handles the technical complexity. You focus on your vision and creative decisions.
                  </p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                    <Rocket className="w-8 h-8" />
                  </div>
                  <h3 className="font-cormorant text-xl font-bold text-foreground mb-2">
                    Real Results
                  </h3>
                  <p className="text-sm text-foreground">
                    Build and publish your own app—not a tutorial project, YOUR actual business app.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Tools You'll Master */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="font-cormorant text-5xl font-bold text-foreground mb-4">
              AI Tools You'll Master
            </h2>
            <p className="text-xl text-foreground">
              Discover the most powerful AI coding assistants through hands-on creation
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Replit Agent",
                description: "Build and deploy full apps with natural language. Your app goes live instantly.",
                highlight: "Best for: Complete apps from idea to deployment"
              },
              {
                title: "Claude Artifacts",
                description: "Create beautiful UI components and interfaces through conversation.",
                highlight: "Best for: Designing your app's look and feel"
              },
              {
                title: "ChatGPT & Codex",
                description: "Solve problems, debug issues, and learn coding concepts in plain English.",
                highlight: "Best for: Problem-solving and learning"
              },
              {
                title: "Google AI Studio",
                description: "Experiment with advanced AI models and integrate them into your app.",
                highlight: "Best for: Adding AI features to your app"
              },
            ].map((tool, index) => (
              <Card key={index} className="editorial-card border-0 hover-elevate">
                <CardContent className="p-6">
                  <h3 className="font-cormorant text-2xl font-bold text-foreground mb-2">
                    {tool.title}
                  </h3>
                  <p className="text-foreground mb-3">
                    {tool.description}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {tool.highlight}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Group vs 1:1 Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="font-cormorant text-5xl font-bold text-foreground mb-4">
              Choose Your Journey
            </h2>
            <p className="text-xl text-foreground">
              Group energy or private sanctuary—both paths get you to a published app
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Group Retreat */}
            <Card className="editorial-card border-primary/20 border-2">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <Badge className="mb-3">
                    <Users className="w-3 h-3 mr-1" />
                    Intimate Circle - $399
                  </Badge>
                  <h3 className="font-cormorant text-3xl font-bold text-foreground mb-2">
                    Group Retreat
                  </h3>
                  <p className="text-foreground text-sm">
                    4 weeks • Max 10 women • Weekly live sessions
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {[
                    "Weekly 90-min live build sessions",
                    "Learn one AI tool per week",
                    "Private Discord for support",
                    "Session recordings",
                    "Starter templates library",
                    "Build & publish your app",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  size="lg"
                  onClick={() => {
                    trackCTAClick('ai_builder_group_compare_cta', '/signup', 'ai_builder_group');
                    localStorage.setItem('ai_builder_interest', 'true');
                    localStorage.setItem('ai_builder_tier', 'group');
                    window.location.href = "/signup";
                  }}
                  className="w-full bg-primary hover:bg-primary/90 gap-2"
                  data-testid="button-join-builder-group-compare"
                >
                  <Sparkles className="w-4 h-4" />
                  Join Group Retreat
                </Button>
              </CardContent>
            </Card>

            {/* Private Suite */}
            <Card className="editorial-card border-primary border-2">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <Badge className="mb-3 bg-primary text-primary-foreground">
                    <Zap className="w-3 h-3 mr-1" />
                    Private Suite - $999
                  </Badge>
                  <h3 className="font-cormorant text-3xl font-bold text-foreground mb-2">
                    1:1 Private Sessions
                  </h3>
                  <p className="text-foreground text-sm">
                    6-8 weeks • Weekly 1:1 sessions • Priority support
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {[
                    "Everything in Group Retreat PLUS:",
                    "Weekly 1:1 sessions (60 min)",
                    "Custom app scoping call",
                    "Personalized code reviews",
                    "Priority support (24h response)",
                    "Your specific business app",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className={`text-foreground text-sm ${index === 0 ? 'font-bold' : ''}`}>{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  size="lg"
                  onClick={() => {
                    trackCTAClick('ai_builder_private_compare_cta', '/signup', 'ai_builder_private');
                    localStorage.setItem('ai_builder_interest', 'true');
                    localStorage.setItem('ai_builder_tier', 'private');
                    window.location.href = "/signup";
                  }}
                  className="w-full bg-primary hover:bg-primary/90 gap-2"
                  data-testid="button-join-builder-private-compare"
                >
                  <Sparkles className="w-4 h-4" />
                  Reserve Private Suite
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* The 4-Week Group Journey */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="font-cormorant text-5xl font-bold text-foreground mb-4">
              The 4-Week Group Journey
            </h2>
            <p className="text-xl text-foreground">
              Master one AI tool per week through gentle, hands-on practice
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                week: 1,
                title: "Replit Agent Discovery",
                description: "Experience building with Replit Agent. Deploy your first AI-built app in minutes."
              },
              {
                week: 2,
                title: "Claude Artifacts Creation",
                description: "Design beautiful UI components. Learn to craft the perfect prompts for visual design."
              },
              {
                week: 3,
                title: "ChatGPT Problem-Solving",
                description: "Debug issues, understand code, and solve challenges with conversational AI."
              },
              {
                week: 4,
                title: "Polish & Publish",
                description: "Integrate everything you've learned. Publish your app and share your journey."
              },
            ].map((week, index) => (
              <Card key={index} className="editorial-card border-0">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-2xl font-bold text-primary-foreground">
                        {week.week}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-cormorant text-2xl font-bold text-foreground mb-2">
                        Week {week.week}: {week.title}
                      </h3>
                      <p className="text-foreground">
                        {week.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <Card className="editorial-card border-2 border-primary/20">
            <CardContent className="p-12">
              <h2 className="font-cormorant text-4xl font-bold text-foreground mb-4">
                Ready to Build Your App?
              </h2>
              <p className="text-xl text-foreground mb-8 max-w-2xl mx-auto">
                Choose your path: intimate group energy or private sanctuary. Both get you to a published app.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => {
                    trackCTAClick('ai_builder_group_final_cta', '/signup', 'ai_builder_group');
                    localStorage.setItem('ai_builder_interest', 'true');
                    localStorage.setItem('ai_builder_tier', 'group');
                    window.location.href = "/signup";
                  }}
                  className="gap-2 bg-primary hover:bg-primary/90"
                  data-testid="button-join-builder-group-final"
                >
                  <Users className="w-4 h-4" />
                  Join Group Retreat - $399
                </Button>
                <Button 
                  size="lg"
                  onClick={() => {
                    trackCTAClick('ai_builder_private_final_cta', '/signup', 'ai_builder_private');
                    localStorage.setItem('ai_builder_interest', 'true');
                    localStorage.setItem('ai_builder_tier', 'private');
                    window.location.href = "/signup";
                  }}
                  className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  data-testid="button-join-builder-private-final"
                >
                  <Zap className="w-4 h-4" />
                  Reserve Private Suite - $999
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
