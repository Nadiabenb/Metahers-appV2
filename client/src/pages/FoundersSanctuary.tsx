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
  Code2
} from "lucide-react";
import { Link } from "wouter";

export default function FoundersSanctuary() {
  const milestones = [
    {
      stage: "CLARITY STAGE",
      weeks: "Weeks 1-4",
      icon: Target,
      color: "from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--magenta-quartz))]",
      items: [
        "Define your problem statement with crystal clarity",
        "Validate your target customer through research",
        "Craft your unique value proposition",
      ]
    },
    {
      stage: "CREATION STAGE",
      weeks: "Weeks 5-8",
      icon: Code2,
      color: "from-[hsl(var(--hyper-violet))] to-[hsl(var(--aurora-teal))]",
      items: [
        "Build your MVP with AI-assisted tools",
        "Acquire your first 10 passionate users",
        "Establish systematic feedback loops",
      ]
    },
    {
      stage: "MOMENTUM STAGE",
      weeks: "Weeks 9-12",
      icon: Rocket,
      color: "from-[hsl(var(--aurora-teal))] to-[hsl(var(--liquid-gold))]",
      items: [
        "Implement your revenue model strategy",
        "Hit your first $1K monthly recurring revenue",
        "Build repeatable customer acquisition",
      ]
    }
  ];

  const struggles = [
    {
      icon: Sparkles,
      title: "Drowning in Advice",
      desc: "Every guru says something different. Should you focus on product or marketing? B2B or B2C? Build or outsource?"
    },
    {
      icon: Users,
      title: "Founder Loneliness",
      desc: "Networking events are 90% men talking over you. You need women who actually understand what you're building."
    },
    {
      icon: Target,
      title: "Decision Paralysis",
      desc: "You have 47 things on your to-do list. Which one actually moves the needle? How do you even know?"
    },
    {
      icon: TrendingUp,
      title: "Wrong Metrics",
      desc: "You're tracking downloads, not revenue. Followers, not customers. Activity, not traction."
    }
  ];

  const included = [
    { icon: Sparkles, title: "AI Milestone Prioritization", desc: "Know exactly what to build next" },
    { icon: TrendingUp, title: "Progress Analytics Dashboard", desc: "Track real traction, not vanity metrics" },
    { icon: Users, title: "Female Founder Community", desc: "Matched by industry and stage" },
    { icon: Zap, title: "Weekly Expert Office Hours", desc: "Learn from successful founders" },
    { icon: Code2, title: "App Atelier AI Coach", desc: "Build your MVP with unlimited AI guidance" },
    { icon: Crown, title: "VIP Investor Panel", desc: "Pitch to top investors at graduation" },
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
              12-Week Accelerator
            </Badge>
            
            <h1 className="font-cormorant text-5xl md:text-7xl font-bold metallic-text">
              Founder's Sanctuary
            </h1>
            
            <p className="text-2xl md:text-3xl text-foreground/80 max-w-3xl mx-auto">
              The 12-Week Program Where Female Founders Go From Idea to Traction
            </p>
            
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
              MetaHers' luxury accelerator: AI-powered milestone tracking, expert coaching, and a community of brilliant women building the future.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg"
                className="bg-gradient-to-br from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--hyper-violet))] hover:opacity-90 transition-opacity"
                data-testid="button-apply-now"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Apply for Winter 2026
              </Button>
              <Button 
                size="lg"
                variant="outline"
                data-testid="button-learn-more"
              >
                Learn More
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <div className="flex items-center justify-center gap-6 pt-4 text-sm text-foreground/60">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Applications close Dec 15</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Limited to 100 founders</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Struggles Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="font-cormorant text-4xl md:text-5xl font-bold metallic-text mb-4">
            If You're a Female Founder, You Know These Struggles
          </h2>
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
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(var(--cyber-fuchsia))]/20 to-[hsl(var(--hyper-violet))]/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[hsl(var(--cyber-fuchsia))]" />
                      </div>
                      {struggle.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/70">{struggle.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Journey Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="font-cormorant text-4xl md:text-5xl font-bold metallic-text mb-4">
            Your 12-Week Transformation
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            11 Milestones. 3 Stages. One Goal: Launch Your Profitable Business.
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
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${milestone.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-2">{milestone.weeks}</Badge>
                        <CardTitle className="text-2xl">{milestone.stage}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {milestone.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-[hsl(var(--cyber-fuchsia))] flex-shrink-0 mt-0.5" />
                          <span className="text-foreground/80">{item}</span>
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
      <section className="max-w-6xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="font-cormorant text-4xl md:text-5xl font-bold metallic-text mb-4">
            Everything Included
          </h2>
          <p className="text-lg text-foreground/60">
            Premium support for your entire founder journey
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground/70">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="overflow-hidden border-2 border-[hsl(var(--cyber-fuchsia))]/30">
            <div className="h-2 bg-gradient-to-r from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--hyper-violet))]" />
            <CardContent className="p-8 md:p-12 text-center space-y-6">
              <Badge className="bg-gradient-to-r from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--hyper-violet))] text-white border-0">
                Winter 2026 Cohort
              </Badge>
              
              <h3 className="font-cormorant text-3xl md:text-4xl font-bold metallic-text">
                Ready to Build Your Business?
              </h3>

              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-bold">$990</span>
                <span className="text-foreground/60">/ 12 weeks</span>
              </div>

              <p className="text-foreground/70 max-w-xl mx-auto">
                That's $82.50/month for AI coaching, expert mentorship, female founder community, and everything you need to launch.
              </p>

              <div className="space-y-3 pt-4">
                <Button 
                  size="lg"
                  className="w-full md:w-auto bg-gradient-to-br from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--hyper-violet))] hover:opacity-90 transition-opacity"
                  data-testid="button-apply-bottom"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Apply Now - Limited Spots
                </Button>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-foreground/60 pt-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[hsl(var(--cyber-fuchsia))]" />
                    <span>Applications close Dec 15</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[hsl(var(--cyber-fuchsia))]" />
                    <span>Program starts Jan 5, 2026</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Link to App Atelier */}
      <section className="max-w-6xl mx-auto px-4 py-16">
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
                  <h3 className="font-cormorant text-2xl md:text-3xl font-bold mb-2">
                    Build Your MVP with App Atelier
                  </h3>
                  <p className="text-foreground/70 mb-4">
                    All Founder's Sanctuary members get unlimited access to our AI coding coach. Build your MVP during the program with expert AI guidance.
                  </p>
                  <Link href="/app-atelier">
                    <Button variant="outline" data-testid="link-app-atelier">
                      Explore App Atelier
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
