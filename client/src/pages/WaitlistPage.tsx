import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Sparkles, Crown, Zap, Users, CheckCircle, ArrowRight, TrendingUp } from "lucide-react";

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [selectedTier, setSelectedTier] = useState<"free" | "studio" | "blueprint">("studio");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/email-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, type: `waitlist-${selectedTier}` }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setEmail("");
        setName("");
        toast({
          title: "Welcome to the Waitlist! 🚀",
          description: `You're in line for ${selectedTier === 'free' ? 'AI Starter Kit' : selectedTier === 'studio' ? 'MetaHers Studio' : 'The AI Blueprint'} access`,
        });
        setTimeout(() => setIsSuccess(false), 5000);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join waitlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const tiers = [
    {
      id: "free",
      name: "AI Starter Kit",
      price: "Free",
      icon: Sparkles,
      color: "from-[hsl(var(--hyper-violet))]",
      features: [
        "Weekly MetaHers Signal",
        "1 free AI concierge session",
        "10 starter prompts",
        "Toolkit preview",
        "Community access",
      ],
    },
    {
      id: "studio",
      name: "MetaHers Studio",
      price: "$29/mo",
      icon: Crown,
      color: "from-[hsl(var(--magenta-quartz))]",
      highlight: true,
      features: [
        "Daily AI concierge access",
        "Monthly live implementation lab",
        "Monthly group Q&A or office hours",
        "Complete Learning Hub",
        "AI Toolkit and prompt library",
      ],
    },
    {
      id: "blueprint",
      name: "The AI Blueprint",
      price: "$997",
      icon: TrendingUp,
      color: "from-[hsl(var(--liquid-gold))]",
      features: [
        "4 private implementation sessions",
        "AI workflow audit",
        "Custom AI operating system map",
        "Personalized prompt library",
        "3 months MetaHers Studio included",
      ],
    },
  ];

  return (
    <>
      <SEO 
        title="MetaHers Offers | MetaHers"
        description="Join the MetaHers offer list for AI Starter Kit, MetaHers Studio, and The AI Blueprint."
      />
      <div className="min-h-screen bg-gradient-to-b from-white via-[hsl(var(--hyper-violet))]/5 to-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="mb-4 inline-flex gap-2 px-4 py-2 bg-gradient-to-r from-[hsl(var(--hyper-violet))]/20 to-[hsl(var(--cyber-fuchsia))]/20 border border-[hsl(var(--liquid-gold))]/30 text-foreground">
              <Zap className="w-4 h-4 text-[hsl(var(--liquid-gold))]" />
              Limited Early Access
            </Badge>
            <h1 className="text-5xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-[hsl(var(--hyper-violet))] via-[hsl(var(--magenta-quartz))] to-[hsl(var(--cyber-fuchsia))] bg-clip-text text-transparent">
              Build Your AI Operating System
            </h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Start with practical AI support, join the monthly implementation Studio, or apply for the private Blueprint intensive.
            </p>
          </motion.div>

          {/* Tiers */}
          <div className="grid lg:grid-cols-3 gap-6 mb-16">
            {tiers.map((tier, idx) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                onClick={() => setSelectedTier(tier.id as any)}
                className="cursor-pointer"
              >
                <Card className={`relative p-8 h-full transition-all ${
                  selectedTier === tier.id
                    ? "ring-2 ring-[hsl(var(--liquid-gold))] bg-gradient-to-br from-white to-[hsl(var(--liquid-gold))]/10"
                    : "bg-gradient-to-br from-white to-[hsl(var(--hyper-violet))]/5 hover:border-[hsl(var(--liquid-gold))]/50"
                } border border-[hsl(var(--hyper-violet))]/20`}>
                  {tier.highlight && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <Badge className="bg-gradient-to-r from-[hsl(var(--liquid-gold))] to-[hsl(var(--cyber-fuchsia))] text-white">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tier.color} to-[hsl(var(--cyber-fuchsia))] flex items-center justify-center`}>
                      <tier.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-2xl text-foreground">{tier.name}</h3>
                  </div>

                  <p className="text-3xl font-bold text-foreground mb-1">{tier.price}</p>
                  <p className="text-sm text-foreground/60 mb-6">
                    {tier.id === "free" ? "start today" : tier.id === "blueprint" ? "one-time" : "billed monthly"}
                  </p>

                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex gap-2 text-sm text-foreground/70">
                        <CheckCircle className="w-4 h-4 text-[hsl(var(--liquid-gold))] flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => setSelectedTier(tier.id as any)}
                    variant={selectedTier === tier.id ? "default" : "outline"}
                    className="w-full gap-2"
                    data-testid={`button-select-${tier.id}`}
                  >
                    {selectedTier === tier.id ? "Selected" : "Select"} {tier.name}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Form */}
          <motion.div 
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-12 bg-gradient-to-br from-white to-[hsl(var(--hyper-violet))]/10 border border-[hsl(var(--hyper-violet))]/20">
              {!isSuccess ? (
                <>
                  <h2 className="text-3xl font-bold text-foreground mb-2">Join the Waitlist</h2>
                  <p className="text-foreground/70 mb-8">Get early access and special founding member pricing</p>

                  <form onSubmit={handleJoinWaitlist} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-foreground mb-2 block">Full Name</label>
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Jane Doe"
                          required
                          data-testid="input-waitlist-name"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-foreground mb-2 block">Email Address</label>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="jane@example.com"
                          required
                          data-testid="input-waitlist-email"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-foreground mb-2 block">
                        Interested in {selectedTier === 'free' ? 'AI Starter Kit' : selectedTier === 'studio' ? 'MetaHers Studio' : 'The AI Blueprint'}
                      </label>
                      <div className="p-4 bg-[hsl(var(--hyper-violet))]/5 rounded-lg border border-[hsl(var(--hyper-violet))]/20">
                        <p className="text-sm text-foreground/70">
                          Get exclusive founding member pricing when we launch
                        </p>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-[hsl(var(--hyper-violet))] to-[hsl(var(--cyber-fuchsia))] text-white gap-2 h-12"
                      data-testid="button-join-waitlist"
                    >
                      <Users className="w-4 h-4" />
                      {isLoading ? "Joining..." : "Join Waitlist"}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">You're on the Waitlist! 🎉</h3>
                  <p className="text-foreground/70 mb-4">
                    We'll be in touch soon with your founding member offer
                  </p>
                  <Badge className="bg-gradient-to-r from-[hsl(var(--hyper-violet))] to-[hsl(var(--cyber-fuchsia))] text-white">
                    Founding Member Pricing Locked In
                  </Badge>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}
