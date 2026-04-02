import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";
import { Mail, CheckCircle, Sparkles, TrendingUp, Users, Zap } from "lucide-react";

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/email-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setEmail("");
        toast({
          title: "Welcome! 🎉",
          description: "You've been added to our exclusive newsletter",
        });
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        toast({
          title: "Error",
          description: "Failed to subscribe. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Newsletter | MetaHers"
        description="Join our exclusive newsletter for insider tips, AI breakthroughs, Web3 insights, and exclusive content for women professionals"
      />
      <div className="min-h-screen bg-gradient-to-b from-white via-[hsl(var(--liquid-gold))]/5 to-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center justify-center gap-3 mb-6 px-4 py-2 bg-gradient-to-r from-[hsl(var(--hyper-violet))]/20 to-[hsl(var(--liquid-gold))]/20 rounded-full border border-[hsl(var(--liquid-gold))]/30">
              <Mail className="w-5 h-5 text-[hsl(var(--liquid-gold))]" />
              <span className="text-sm font-semibold text-foreground">AI & Web3 for Women</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-[hsl(var(--hyper-violet))] via-[hsl(var(--magenta-quartz))] to-[hsl(var(--cyber-fuchsia))] bg-clip-text text-transparent">
              Stay Ahead of the Curve
            </h1>
            <p className="text-xl text-foreground/70 mb-2 max-w-2xl mx-auto">
              Get weekly insights on AI breakthroughs, Web3 opportunities, and exclusive strategies for women building the future
            </p>
            <p className="text-sm text-foreground/50">Join 10K+ women professionals in tech & entrepreneurship</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Benefits */}
            <motion.div 
              className="lg:col-span-2 space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 bg-gradient-to-br from-white to-[hsl(var(--hyper-violet))]/5 border border-[hsl(var(--hyper-violet))]/20">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[hsl(var(--hyper-violet))] to-[hsl(var(--magenta-quartz))] flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground mb-1">Weekly AI Insights</h3>
                    <p className="text-sm text-foreground/70">Get the latest AI trends, tools, and applications tailored for your business</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-white to-[hsl(var(--cyber-fuchsia))]/5 border border-[hsl(var(--cyber-fuchsia))]/20">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--liquid-gold))] flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground mb-1">Web3 & Crypto Updates</h3>
                    <p className="text-sm text-foreground/70">Stay informed about blockchain innovations and Web3 opportunities for women entrepreneurs</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-white to-[hsl(var(--aurora-teal))]/5 border border-[hsl(var(--aurora-teal))]/20">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[hsl(var(--aurora-teal))] to-[hsl(var(--hyper-violet))] flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground mb-1">Exclusive Community Access</h3>
                    <p className="text-sm text-foreground/70">Connect with like-minded women professionals and get VIP access to MetaHers Circle</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-white to-[hsl(var(--liquid-gold))]/5 border border-[hsl(var(--liquid-gold))]/20">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[hsl(var(--liquid-gold))] to-[hsl(var(--cyber-fuchsia))] flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground mb-1">Exclusive Deals & Resources</h3>
                    <p className="text-sm text-foreground/70">First access to courses, tools, and partnerships negotiated for our community</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-8 bg-gradient-to-br from-white to-[hsl(var(--liquid-gold))]/10 border border-[hsl(var(--liquid-gold))]/30 sticky top-4">
                {!isSuccess ? (
                  <>
                    <h2 className="font-bold text-2xl text-foreground mb-2">Join Now</h2>
                    <p className="text-sm text-foreground/60 mb-6">No spam. Unsubscribe anytime.</p>
                    
                    <form onSubmit={handleSubscribe} className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-foreground mb-2 block">Email Address</label>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          required
                          data-testid="input-newsletter-email"
                        />
                      </div>
                      
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-[hsl(var(--hyper-violet))] to-[hsl(var(--liquid-gold))] text-white gap-2"
                        data-testid="button-subscribe"
                      >
                        <Mail className="w-4 h-4" />
                        {isLoading ? "Subscribing..." : "Subscribe Now"}
                      </Button>
                    </form>

                    <p className="text-xs text-foreground/50 text-center mt-4">
                      Join 10,000+ women in tech building the future
                    </p>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="font-bold text-lg text-foreground mb-2">Welcome aboard! 🎉</h3>
                    <p className="text-sm text-foreground/70">Check your email for exclusive content</p>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
