import { motion } from "framer-motion";
import { Crown, Video, MessageCircle, BookOpen, Award, CheckCircle, Sparkles, Calendar, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { OptimizedImage } from "@/components/OptimizedImage";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { trackCTAClick } from "@/lib/analytics";
import heroImage from "@assets/generated_images/Executive_woman_in_luxury_tech_office_8ad88ef4.png";

export default function ExecutivePage() {
  const { data: capacity, isLoading } = useQuery({
    queryKey: ['/api/cohort-capacity/executive'],
  });

  const spotsRemaining = capacity?.spotsRemaining ?? 2;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Executive Suite - Premium 1:1 AI & Web3 Journey"
        description="Premium one-on-one sanctuary with the MetaHers founder. Two private sessions, custom AI & Web3 playbook, direct access for 30 days, and personalized discovery tailored to your vision."
        keywords="executive suite, ai guidance, web3 journey, 1:1 sessions, personalized experience, women entrepreneurs"
      />

      {/* Hero Section */}
      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <OptimizedImage
          src={heroImage}
          alt="Executive Intensive Premium Mentorship"
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
              Premium 1:1 Experience
            </Badge>
            
            <h1 className="font-cormorant text-6xl md:text-7xl lg:text-8xl font-bold text-white drop-shadow-2xl">
              Executive Suite
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 font-light max-w-3xl mx-auto drop-shadow-lg">
              Two private 1:1 sessions with the founder, bespoke AI & Web3 playbook, and 30 days of gentle support
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
              <div className="text-center">
                <div className="text-5xl font-bold text-white drop-shadow-lg">$499</div>
                <div className="text-white/80 text-sm mt-1">One-time investment</div>
              </div>
              <Button 
                size="lg" 
                onClick={() => {
                  trackCTAClick('executive_hero_cta', '/signup', 'executive');
                  localStorage.setItem('executive_interest', 'true');
                  window.location.href = "/signup";
                }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 px-8 py-6 text-lg"
                data-testid="button-join-executive-hero"
              >
                <Crown className="w-5 h-5" />
                Reserve Your Private Suite
              </Button>
            </div>

            {!isLoading && spotsRemaining > 0 && (
              <p className="text-white/70 text-sm">
                🔥 <span className="font-bold text-white">Only {spotsRemaining} {spotsRemaining === 1 ? 'space' : 'spaces'} remaining</span> this month
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
              Bespoke guidance designed for ambitious women entrepreneurs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Video,
                title: "2 Private 1:1 Sessions",
                description: "90-minute intimate sessions with the founder. Your vision, your pace.",
              },
              {
                icon: BookOpen,
                title: "Bespoke AI Playbook",
                description: "Personalized AI & Web3 journey tailored to your unique vision.",
              },
              {
                icon: MessageCircle,
                title: "30 Days Gentle Support",
                description: "Private Slack/WhatsApp access to the founder. Get guidance when you need it.",
              },
              {
                icon: Award,
                title: "Everything in VIP",
                description: "All VIP Retreat benefits included: sanctuary, Pro access, ritual bag.",
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
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Who This Is For */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="font-cormorant text-5xl font-bold text-foreground mb-4">
              Who This Is For
            </h2>
            <p className="text-xl text-muted-foreground">
              Premium mentorship for women who demand the best
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
                  <li>💎 Run your own business or lead a team</li>
                  <li>🎯 Need AI & Web3 tailored to YOUR industry</li>
                  <li>⚡ Want direct 1:1 founder access</li>
                  <li>🚀 Are ready to implement immediately</li>
                  <li>📈 Value premium, personalized guidance</li>
                  <li>💰 See this as a business investment</li>
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
                  <li>📚 Prefer group learning over 1:1</li>
                  <li>💸 Want the most affordable option</li>
                  <li>🏃 Need general knowledge, not custom strategy</li>
                  <li>🎓 Are just beginning your tech journey</li>
                  <li>⏰ Don't have time for implementation</li>
                  <li>🤷 Aren't ready to take decisive action</li>
                </ul>
                <div className="mt-6 text-center">
                  <Link href="/vip-cohort">
                    <Button variant="outline" data-testid="link-vip-cohort">
                      View VIP Cohort Instead →
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="font-cormorant text-5xl font-bold text-foreground mb-4">
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Discovery Session",
                description: "90-minute deep dive into your business, goals, and biggest AI & Web3 opportunities.",
              },
              {
                step: "2",
                title: "Custom Playbook",
                description: "Receive your personalized AI & Web3 implementation strategy within 7 days.",
              },
              {
                step: "3",
                title: "Implementation Call",
                description: "Second 90-minute session to refine strategy, troubleshoot, and ensure success.",
              },
            ].map((item, index) => (
              <Card key={index} className="editorial-card border-0 text-center">
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-2xl font-bold mb-6">
                    {item.step}
                  </div>
                  <h3 className="font-cormorant text-2xl font-bold text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Plus: 30 days of direct WhatsApp/Slack access to the founder for questions, feedback, and ongoing support.
            </p>
          </div>
        </motion.div>

        {/* Testimonials */}
        <TestimonialsSection />

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
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
                q: "How is this different from VIP Cohort?",
                a: "VIP Cohort is group-based with 4 office hours. Executive is 100% personalized: two private 1:1 sessions focused entirely on YOUR business, plus a custom playbook.",
              },
              {
                q: "When can we schedule the sessions?",
                a: "After booking, you'll receive a calendar link to schedule both sessions at times that work for you. Sessions are recorded for your reference.",
              },
              {
                q: "What if I need help between sessions?",
                a: "You get 30 days of direct WhatsApp/Slack access to the founder. Ask questions, get feedback, troubleshoot issues in real-time.",
              },
              {
                q: "Do I get the VIP Cohort benefits too?",
                a: "Yes! Executive includes everything in VIP: the $150 ritual bag, private community access, 3 months Pro subscription, and all VIP perks.",
              },
              {
                q: "What's the refund policy?",
                a: "If you complete the first session and feel it's not right, we'll refund 50%. We're confident in the value, but we also want you to feel great about the investment.",
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

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <Card className="editorial-card border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-12">
              <Crown className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="font-cormorant text-4xl font-bold text-foreground mb-4">
                Ready for Executive-Level Mentorship?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Book your first strategy session and get a custom AI & Web3 playbook tailored to your business.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-6">
                <Button 
                  size="lg"
                  onClick={() => {
                    trackCTAClick('executive_final_cta', '/signup', 'executive');
                    localStorage.setItem('executive_interest', 'true');
                    window.location.href = "/signup";
                  }}
                  className="bg-primary hover:bg-primary/90 gap-2 px-10 py-6 text-lg"
                  data-testid="button-join-executive-final"
                >
                  <Crown className="w-5 h-5" />
                  Book Your Session - $499
                </Button>
              </div>

              <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                Schedule your first session within 7 days of booking
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
