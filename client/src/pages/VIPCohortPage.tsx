import { motion } from "framer-motion";
import { Crown, Users, Video, MessageCircle, Gift, Award, CheckCircle, Sparkles, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { OptimizedImage } from "@/components/OptimizedImage";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { trackCTAClick } from "@/lib/analytics";
import heroImage from "@assets/generated_images/VIP_Cohort_hero_background_d42d4ea1.png";

export default function VIPCohortPage() {
  const { data: capacity, isLoading } = useQuery({
    queryKey: ['/api/cohort-capacity/vip_cohort'],
  });

  const spotsRemaining = capacity?.spotsRemaining ?? 3;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="VIP Cohort Experience - 4-Week Guided AI & Web3 Program"
        description="Join a limited cohort of 10 ambitious women for 4 weeks of intensive AI & Web3 mentorship with the MetaHers founder. Live office hours, private community, and your own ritual bag included."
        keywords="vip cohort, ai mentorship, web3 coaching, women in tech, luxury learning program"
      />

      {/* Hero Section */}
      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <OptimizedImage
          src={heroImage}
          alt="Luxury VIP Cohort Experience"
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
              <Sparkles className="w-3 h-3 mr-1" />
              Limited to 10 Women
            </Badge>
            
            <h1 className="font-cormorant text-6xl md:text-7xl lg:text-8xl font-bold text-white drop-shadow-2xl">
              VIP Cohort Experience
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 font-light max-w-3xl mx-auto drop-shadow-lg">
              4 weeks of intensive AI & Web3 mentorship with direct founder access, live office hours, and a private community of ambitious women
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
              <div className="text-center">
                <div className="text-5xl font-bold text-white drop-shadow-lg">$197</div>
                <div className="text-white/80 text-sm mt-1">One-time investment</div>
              </div>
              <Button 
                size="lg" 
                onClick={() => {
                  trackCTAClick('vip_cohort_hero_cta', '/signup', 'vip_cohort');
                  localStorage.setItem('vip_cohort_interest', 'true');
                  window.location.href = "/signup";
                }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 px-8 py-6 text-lg"
                data-testid="button-join-vip-hero"
              >
                <Crown className="w-5 h-5" />
                Secure Your Spot
              </Button>
            </div>

            {!isLoading && (
              <p className="text-white/70 text-sm">
                🔥 Only <span className="font-bold text-white">{spotsRemaining} {spotsRemaining === 1 ? 'spot' : 'spots'} remaining</span> in this cohort
              </p>
            )}
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 max-w-6xl">
        {/* What's Included */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="font-cormorant text-5xl font-bold text-foreground mb-4">
              What's Included
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to master AI & Web3 in 4 transformative weeks
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Video,
                title: "4 Live Office Hours",
                description: "Weekly group calls with the founder. Ask anything, get personalized guidance.",
              },
              {
                icon: Users,
                title: "Private VIP Community",
                description: "Exclusive Slack/Discord with your cohort. Network, collaborate, grow together.",
              },
              {
                icon: Gift,
                title: "Ritual Bag Worth $150",
                description: "Handmade luxury bag with curated products and AI unlock codes.",
              },
              {
                icon: Award,
                title: "Certificate of Completion",
                description: "Showcase your expertise. LinkedIn-ready credential.",
              },
            ].map((feature, index) => (
              <Card key={index} className="editorial-card border-0 hover-elevate">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-cormorant text-xl font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-light">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* The 4-Week Journey */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="font-cormorant text-5xl font-bold text-foreground mb-4">
              Your 4-Week Journey
            </h2>
            <p className="text-xl text-muted-foreground">
              A structured path from AI beginner to confident creator
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                week: 1,
                title: "AI Mastery Foundations",
                description: "Learn ChatGPT, prompt engineering, and AI-powered productivity. Complete your first ritual.",
              },
              {
                week: 2,
                title: "Web3 Essentials",
                description: "Understand blockchain, NFTs, and crypto. Set up your wallet and explore DAOs.",
              },
              {
                week: 3,
                title: "Building in Public",
                description: "Create your first AI project. Share your Web3 journey. Get founder feedback.",
              },
              {
                week: 4,
                title: "Launch & Lead",
                description: "Present your final project. Network with your cohort. Plan your next chapter.",
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
                      <p className="text-muted-foreground">
                        {week.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Everything You Get */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <Card className="editorial-card border-2 border-primary/20">
            <CardContent className="p-10">
              <div className="text-center mb-8">
                <h2 className="font-cormorant text-4xl font-bold text-foreground mb-4">
                  Complete Package
                </h2>
                <p className="text-muted-foreground">
                  Everything included in your $197 VIP Cohort investment
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "4 weeks of guided ritual progression",
                  "4 live group office hours with founder",
                  "Private VIP community (Slack/Discord)",
                  "Exclusive ritual bag (worth $150)",
                  "Weekly accountability check-ins",
                  "Certificate of completion",
                  "Lifetime access to cohort materials",
                  "Full Pro subscription access (4 weeks)",
                  "Early access to new rituals",
                  "Priority email support",
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-6 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-cormorant text-3xl font-bold text-foreground">
                      Total Value: $500+
                    </div>
                    <div className="text-muted-foreground">
                      Your investment: Only $197
                    </div>
                  </div>
                  <Button 
                    size="lg"
                    onClick={() => {
                      localStorage.setItem('vip_cohort_interest', 'true');
                      window.location.href = "/signup";
                    }}
                    className="bg-primary hover:bg-primary/90 gap-2"
                    data-testid="button-join-vip-package"
                  >
                    <Crown className="w-4 h-4" />
                    Join VIP Cohort
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Is This Right For You? */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="font-cormorant text-5xl font-bold text-foreground mb-4">
              Is This Right For You?
            </h2>
            <p className="text-xl text-muted-foreground">
              Perfect for ambitious women who want intensive, guided learning
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="editorial-card border-primary/20 border-2">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="font-cormorant text-2xl font-bold text-foreground mb-4">
                    Perfect If You...
                  </h3>
                </div>
                <ul className="space-y-3 text-foreground">
                  <li>✨ Want to master AI & Web3 FAST</li>
                  <li>💎 Value direct founder mentorship</li>
                  <li>🚀 Are ready to commit 4-6 hours/week</li>
                  <li>👯 Love learning in community</li>
                  <li>🎯 Have specific business goals</li>
                  <li>💰 See this as an investment, not an expense</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="editorial-card border-border">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted text-muted-foreground mb-4">
                    <MessageCircle className="w-8 h-8" />
                  </div>
                  <h3 className="font-cormorant text-2xl font-bold text-foreground mb-4">
                    Not Right If You...
                  </h3>
                </div>
                <ul className="space-y-3 text-muted-foreground">
                  <li>⏰ Prefer self-paced learning</li>
                  <li>🎧 Can't attend live sessions</li>
                  <li>💸 Want the lowest price option</li>
                  <li>🦥 Aren't ready to take action</li>
                  <li>🤔 Just want to "check it out"</li>
                  <li>📚 Prefer Pro monthly subscription</li>
                </ul>
                <div className="mt-6 text-center">
                  <Link href="/account">
                    <Button variant="outline" data-testid="link-pro-monthly">
                      View Pro Monthly Instead →
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="font-cormorant text-5xl font-bold text-foreground mb-4">
              Common Questions
            </h2>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {[
              {
                q: "When does the next cohort start?",
                a: "Cohorts launch monthly. The next one starts on the 1st of next month. Spots fill fast!",
              },
              {
                q: "What if I can't make a live session?",
                a: "All sessions are recorded and posted in the private community within 24 hours. But live attendance is highly encouraged for Q&A.",
              },
              {
                q: "Is the ritual bag included?",
                a: "Yes! Your exclusive ritual bag ships within 7 days of joining. It's worth $150 alone.",
              },
              {
                q: "Can I upgrade from Pro Monthly?",
                a: "Absolutely! Your monthly subscription will be paused during the cohort, and you get 4 weeks of Pro access included.",
              },
              {
                q: "What's the refund policy?",
                a: "7-day money-back guarantee. If you attend the first office hour and it's not for you, we'll refund 100%.",
              },
            ].map((faq, index) => (
              <Card key={index} className="editorial-card border-0">
                <CardContent className="p-6">
                  <h3 className="font-cormorant text-xl font-bold text-foreground mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-muted-foreground">
                    {faq.a}
                  </p>
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
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center"
        >
          <Card className="editorial-card border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-12">
              <Crown className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="font-cormorant text-4xl font-bold text-foreground mb-4">
                Ready to Join the VIP Cohort?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Limited to 10 women per cohort. When spots fill, you'll wait until next month.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-6">
                <Button 
                  size="lg"
                  onClick={() => {
                    trackCTAClick('vip_cohort_final_cta', '/signup', 'vip_cohort');
                    localStorage.setItem('vip_cohort_interest', 'true');
                    window.location.href = "/signup";
                  }}
                  className="bg-primary hover:bg-primary/90 gap-2 px-10 py-6 text-lg"
                  data-testid="button-join-vip-final"
                >
                  <Crown className="w-5 h-5" />
                  Secure Your Spot - $197
                </Button>
              </div>

              <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                Next cohort starts {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
