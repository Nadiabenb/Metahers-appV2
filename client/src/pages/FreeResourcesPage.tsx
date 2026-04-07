
import { motion } from "framer-motion";
import { Download, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { useLocation } from "wouter";

export default function FreeResourcesPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/email-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'free_resources_page' }),
      });

      if (response.ok) {
        localStorage.setItem("emailCaptureSubmitted", "true");
        setIsSuccess(true);
      }
    } catch (err) {
      console.error('Failed to submit email:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    "7 AI prompts that save 10+ hours per week",
    "Step-by-step Web3 getting started guide",
    "Exclusive beta access code (worth $297/year)",
    "Invitation to our sisterhood community",
    "Weekly AI & Web3 tips & opportunities"
  ];

  return (
    <>
      <SEO 
        title="Free AI Resources for Women - MetaHers"
        description="Get your free AI mastery guide, Web3 starter kit, and exclusive beta access. Join 500+ women building their AI-powered future."
      />
      
      <div className="min-h-screen py-20 px-6" style={{ background: '#0D0B14' }}>
        <div className="container mx-auto max-w-4xl">
          {!isSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Hero */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: '#161225' }}>
                  <Sparkles className="w-4 h-4 text-[#E879F9]" />
                  <span className="text-sm font-semibold text-[#E879F9]">FREE RESOURCES</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  Your AI Mastery Toolkit
                </h1>
                
                <p className="text-xl mb-4" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Everything you need to start building your AI-powered future—completely free.
                </p>
                
                <p className="text-lg" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Join 500+ women who are already transforming their careers and businesses with AI.
                </p>
              </div>

              {/* What You Get */}
              <Card className="p-8 mb-8 shadow-xl" style={{ background: '#161225' }}>
                <h2 className="text-2xl font-bold mb-6 text-center text-white">Here's What You Get Instantly:</h2>
                
                <div className="space-y-4 mb-8">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-lg" style={{ color: 'rgba(255,255,255,0.7)' }}>{benefit}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Email Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="text-lg p-6"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white text-lg py-6"
                    disabled={isSubmitting}
                  >
                    <Download className="w-5 h-5 mr-2" />
                    {isSubmitting ? "Sending to Your Inbox..." : "Send Me The Free Resources"}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  
                  <p className="text-sm text-center" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    No spam. Unsubscribe anytime. We respect your inbox.
                  </p>
                </form>
              </Card>

              {/* Social Proof */}
              <div className="text-center">
                <p className="mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>Trusted by 500+ women entrepreneurs & professionals</p>
                <div className="flex items-center justify-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-2xl">★</span>
                  ))}
                  <span className="ml-2 font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>4.9/5 from our community</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(34,197,94,0.15)' }}>
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              
              <h2 className="text-4xl font-bold mb-4 text-white">Check Your Email!</h2>
              
              <p className="text-xl mb-8" style={{ color: 'rgba(255,255,255,0.7)' }}>
                We just sent your free resources to <strong>{email}</strong>
              </p>
              
              <Card className="p-6 max-w-xl mx-auto mb-8" style={{ background: '#161225' }}>
                <h3 className="font-semibold mb-4 text-white">What's in your inbox:</h3>
                <ul className="space-y-2 text-left">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>AI Prompts Guide (PDF)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Web3 Starter Kit</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Beta Access Code: <strong>MetaMuse2025</strong></span>
                  </li>
                </ul>
              </Card>
              
              <div className="space-y-4">
                <Button
                  size="lg"
                  onClick={() => navigate("/vision-board")}
                  className="bg-gradient-to-r from-purple-600 to-pink-500"
                >
                  Start Your Vision Board Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Can't find the email? Check your spam folder or{" "}
                  <a href="mailto:nadia@metahers.ai" className="text-[#E879F9] underline">contact us</a>
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
