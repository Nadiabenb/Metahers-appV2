import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  Target, 
  Rocket, 
  Crown, 
  CheckCircle2,
  Clock,
  DollarSign,
  ArrowRight,
  Zap,
  Code2,
  Heart,
  Brain,
  Shield
} from "lucide-react";
import { Link } from "wouter";

export default function FoundersSanctuary() {
  const milestones = [
    {
      stage: "CLARITY",
      subtitle: "Weeks 1-4",
      icon: Brain,
      color: "from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--magenta-quartz))]",
      headline: "Crystal-Clear Vision",
      items: [
        "Define the problem your AI/Web3 solution solves—with precision",
        "Validate your ideal customer through strategic research",
        "Craft a magnetic value proposition that makes investors lean in",
        "Map your competitive landscape in the AI/Web3 space",
      ]
    },
    {
      stage: "CREATION",
      subtitle: "Weeks 5-8",
      icon: Code2,
      color: "from-[hsl(var(--hyper-violet))] to-[hsl(var(--aurora-teal))]",
      headline: "Build Your Future",
      items: [
        "Build your MVP using our AI-powered App Atelier (unlimited access)",
        "Acquire your first 10 passionate beta users",
        "Implement AI features that create real value",
        "Master the product feedback loop",
      ]
    },
    {
      stage: "MOMENTUM",
      subtitle: "Weeks 9-12",
      icon: Rocket,
      color: "from-[hsl(var(--aurora-teal))] to-[hsl(var(--liquid-gold))]",
      headline: "Scale With Confidence",
      items: [
        "Launch your revenue model (subscription, API, or marketplace)",
        "Hit $1K MRR—your first proof of product-market fit",
        "Build repeatable customer acquisition systems",
        "Perfect your investor pitch and graduation presentation",
      ]
    }
  ];

  const struggles = [
    {
      icon: Brain,
      title: "You're Brilliant—But Scattered",
      desc: "You have 12 brilliant AI ideas. Zero launched products. The problem? You don't need more ideas—you need a system that helps you pick ONE and execute flawlessly."
    },
    {
      icon: Shield,
      title: "Tech Bros Don't Get It",
      desc: "Networking events are exhausting. Pitch competitions are designed for Stanford grads with VC connections. You need a sanctuary where brilliant women are the norm, not the exception."
    },
    {
      icon: Target,
      title: "You're Building Alone in the Dark",
      desc: "No co-founder. No technical team. Just you, YouTube tutorials, and imposter syndrome. You need expert guidance without giving up equity or creative control."
    },
    {
      icon: TrendingUp,
      title: "You're Tracking the Wrong Things",
      desc: "Instagram followers ≠ customers. Website traffic ≠ revenue. Newsletter subscribers ≠ traction. You need someone to help you focus on metrics that actually matter."
    }
  ];

  const included = [
    { 
      icon: Heart, 
      title: "Personal Founder Mentorship", 
      desc: "Direct access to Nadia, MetaHers founder. This isn't a faceless course—it's human-powered guidance from someone who's built what you're building." 
    },
    { 
      icon: Brain, 
      title: "AI Milestone Prioritization", 
      desc: "Our AI analyzes your progress weekly and tells you exactly what to focus on next. No more decision paralysis." 
    },
    { 
      icon: Code2, 
      title: "Unlimited App Atelier Access", 
      desc: "Build your MVP with our AI coding coach. Premium tier unlocked for all Sanctuary members—build without limits." 
    },
    { 
      icon: TrendingUp, 
      title: "Real-Time Traction Dashboard", 
      desc: "Track the metrics that actually matter: revenue, active users, and product-market fit signals." 
    },
    { 
      icon: Users, 
      title: "Elite Female Founder Circle", 
      desc: "Your cohort of 100 brilliant women building AI/Web3 startups. Matched by industry and stage." 
    },
    { 
      icon: Zap, 
      title: "Weekly Expert Sessions", 
      desc: "Live office hours with successful AI founders, growth experts, and investors who actually fund women." 
    },
    { 
      icon: Crown, 
      title: "Investor Demo Day", 
      desc: "Graduate with a polished pitch deck and present to our curated panel of investors actively funding female founders." 
    },
    { 
      icon: Sparkles, 
      title: "Lifetime MetaHers Membership", 
      desc: "After graduation, you're part of our founder alumni network forever. Continue accessing events, mentorship, and community." 
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--hyper-violet))]/10 via-transparent to-[hsl(var(--cyber-fuchsia))]/10" />
        
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <Badge className="bg-gradient-to-r from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--hyper-violet))] text-white border-0">
              <Crown className="w-3 h-3 mr-1" />
              Winter 2026 Cohort Now Accepting Applications
            </Badge>
            
            <h1 className="font-cormorant text-5xl md:text-7xl font-bold metallic-text">
              Founder's Sanctuary
            </h1>
            
            <p className="text-2xl md:text-3xl text-foreground/90 max-w-3xl mx-auto font-light">
              The 12-Week Accelerator Where Brilliant Women Transform AI/Web3 Ideas Into Profitable Businesses
            </p>
            
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed">
              Imagine: 12 weeks from now, you're launching your AI product. Real users. Real revenue. Real traction. No technical co-founder required. No VC pressure. Just you, our proven system, and a community of exceptional women building the future.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button 
                size="lg"
                className="bg-gradient-to-br from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--hyper-violet))] hover:opacity-90 transition-opacity text-base px-8"
                data-testid="button-apply-now"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Apply for Winter 2026
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="text-base px-8"
                data-testid="button-learn-more"
              >
                Download Program Overview
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 text-sm text-foreground/60">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[hsl(var(--cyber-fuchsia))]" />
                <span>Applications close December 15, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[hsl(var(--cyber-fuchsia))]" />
                <span>Limited to 100 founders · 23 spots remaining</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Struggles Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="font-cormorant text-4xl md:text-5xl font-bold metallic-text mb-6">
            If This Sounds Familiar, You're in the Right Place
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            These are the real struggles facing brilliant women building AI/Web3 startups. We've designed every aspect of Founder's Sanctuary to solve them.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {struggles.map((struggle, index) => {
            const Icon = struggle.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="h-full hover-elevate">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[hsl(var(--cyber-fuchsia))]/20 to-[hsl(var(--hyper-violet))]/20 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-[hsl(var(--cyber-fuchsia))]" />
                      </div>
                      {struggle.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/70 leading-relaxed">{struggle.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Journey Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="font-cormorant text-4xl md:text-5xl font-bold metallic-text mb-6">
            Your 12-Week Transformation
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            Three stages. Eleven milestones. One outcome: A launched AI/Web3 product with real users and revenue.
          </p>
        </motion.div>

        <div className="space-y-8">
          {milestones.map((milestone, index) => {
            const Icon = milestone.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.15 }}
              >
                <Card className="overflow-hidden hover-elevate">
                  <div className={`h-2 bg-gradient-to-r ${milestone.color}`} />
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${milestone.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <Badge variant="outline" className="text-xs">{milestone.subtitle}</Badge>
                          <Badge className="bg-gradient-to-r from-[hsl(var(--cyber-fuchsia))]/20 to-[hsl(var(--hyper-violet))]/20 text-foreground border-0 text-xs">
                            Stage {index + 1}/3
                          </Badge>
                        </div>
                        <CardTitle className="text-3xl font-cormorant metallic-text">{milestone.stage}</CardTitle>
                        <p className="text-sm text-foreground/60 mt-1">{milestone.headline}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {milestone.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-[hsl(var(--cyber-fuchsia))] flex-shrink-0 mt-0.5" />
                          <span className="text-foreground/80 leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* What's Included */}
      <section className="max-w-6xl mx-auto px-4 py-20 bg-gradient-to-br from-[hsl(var(--hyper-violet))]/5 to-[hsl(var(--cyber-fuchsia))]/5 rounded-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="font-cormorant text-4xl md:text-5xl font-bold metallic-text mb-6">
            Everything You Need to Launch
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            This isn't just a course. It's a complete founder support system designed for women building AI/Web3 companies.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {included.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card className="h-full hover-elevate">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[hsl(var(--cyber-fuchsia))]/20 to-[hsl(var(--hyper-violet))]/20 flex items-center justify-center mb-3">
                      <Icon className="w-6 h-6 text-[hsl(var(--cyber-fuchsia))]" />
                    </div>
                    <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground/70 leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Human-Powered AI Callout */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="overflow-hidden bg-gradient-to-br from-[hsl(var(--hyper-violet))]/10 to-[hsl(var(--cyber-fuchsia))]/10 border-[hsl(var(--cyber-fuchsia))]/30">
            <CardContent className="p-8 md:p-12">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--hyper-violet))] flex items-center justify-center flex-shrink-0">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-cormorant text-2xl md:text-3xl font-bold metallic-text mb-2">
                    This is a Human-Powered AI Experience
                  </h3>
                  <p className="text-foreground/70 leading-relaxed">
                    Yes, we use AI to help you build faster. But at the core? This is personal, founder-to-founder mentorship. You'll have direct access to Nadia (MetaHers founder) throughout the entire 12 weeks. Weekly calls. Slack access. Real support from someone who's walked this path.
                  </p>
                </div>
              </div>
              <div className="bg-background/50 rounded-xl p-6 border border-[hsl(var(--cyber-fuchsia))]/20">
                <p className="text-sm text-foreground/60 italic">
                  "I built MetaHers as a solo founder while working full-time. I know the isolation, the imposter syndrome, the late nights wondering if you're building the right thing. Founder's Sanctuary is everything I wish existed when I started—a sanctuary where brilliant women get the guidance, community, and tools they deserve."
                </p>
                <p className="text-sm font-medium mt-3 text-foreground/80">— Nadia, Founder of MetaHers</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Pricing CTA */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="overflow-hidden border-2 border-[hsl(var(--cyber-fuchsia))]/30 shadow-2xl">
            <div className="h-2 bg-gradient-to-r from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--hyper-violet))]" />
            <CardContent className="p-8 md:p-12 text-center space-y-6">
              <Badge className="bg-gradient-to-r from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--hyper-violet))] text-white border-0">
                Winter 2026 Cohort · Starts January 5
              </Badge>
              
              <h3 className="font-cormorant text-3xl md:text-4xl font-bold metallic-text">
                Ready to Launch Your AI/Web3 Business?
              </h3>

              <div className="flex items-baseline justify-center gap-2">
                <span className="text-6xl font-bold metallic-text">$990</span>
                <span className="text-foreground/60">for 12 weeks</span>
              </div>

              <div className="space-y-2">
                <p className="text-foreground/80 max-w-xl mx-auto leading-relaxed">
                  That's $82.50/week for personal founder mentorship, unlimited AI coaching, expert sessions, investor access, and a lifetime female founder network.
                </p>
                <p className="text-sm text-foreground/60">
                  (Compare: Average accelerator = $20K+ for 8% equity. We take zero equity.)
                </p>
              </div>

              <div className="space-y-3 pt-6">
                <Button 
                  size="lg"
                  className="w-full md:w-auto bg-gradient-to-br from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--hyper-violet))] hover:opacity-90 transition-opacity text-base px-10"
                  data-testid="button-apply-bottom"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Apply Now · 23 Spots Remaining
                </Button>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-foreground/60 pt-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[hsl(var(--cyber-fuchsia))]" />
                    <span>Applications close Dec 15, 2025</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[hsl(var(--cyber-fuchsia))]" />
                    <span>Program starts Jan 5, 2026</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[hsl(var(--cyber-fuchsia))]" />
                    <span>100% remote, async-friendly</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Link to App Atelier */}
      <section className="max-w-6xl mx-auto px-4 py-16 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-[hsl(var(--hyper-violet))]/10 to-[hsl(var(--cyber-fuchsia))]/10 border-[hsl(var(--cyber-fuchsia))]/20 hover-elevate">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--hyper-violet))] flex items-center justify-center shadow-xl flex-shrink-0">
                  <Code2 className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-cormorant text-2xl md:text-3xl font-bold metallic-text mb-3">
                    Build Your MVP With App Atelier
                  </h3>
                  <p className="text-foreground/70 mb-4 leading-relaxed">
                    All Founder's Sanctuary members get unlimited access to App Atelier—our AI coding coach that helps you build your MVP without a technical co-founder. No more waiting on developers. Build it yourself during the program.
                  </p>
                  <Link href="/app-atelier">
                    <Button variant="outline" className="hover-elevate" data-testid="link-app-atelier">
                      Try App Atelier (Free 5 Messages)
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}
