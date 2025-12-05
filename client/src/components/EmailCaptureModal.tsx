import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export function EmailCaptureModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const hasSeenModal = localStorage.getItem("emailCaptureShown");
    const hasSubmittedEmail = localStorage.getItem("emailCaptureSubmitted");

    if (!hasSeenModal && !hasSubmittedEmail) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        localStorage.setItem("emailCaptureShown", "true");
      }, 15000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/email-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        localStorage.setItem("emailCaptureSubmitted", "true");
        setIsSubmitted(true);

        setTimeout(() => {
          setIsVisible(false);
        }, 8000);
      } else {
        const data = await response.json().catch(() => ({ message: "Failed to submit" }));
        setError(data.message || "Failed to submit email. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg"
          >
            <Card className="p-8 relative overflow-hidden">
              <div className="absolute inset-0 gradient-violet-magenta opacity-5" />

              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-foreground hover:text-foreground transition-colors"
                data-testid="button-close-modal"
              >
                <X className="w-5 h-5" />
              </button>

              {!isSubmitted ? (
                <div className="relative z-10">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--liquid-gold))]/30 to-[hsl(var(--cyber-fuchsia))]/20 mx-auto mb-6">
                    <Sparkles className="w-8 h-8 text-[hsl(var(--liquid-gold))]" />
                  </div>

                  <h2 className="font-cormorant text-3xl md:text-4xl font-bold text-center mb-4 metallic-text">
                    Get Beta Access
                  </h2>
                  <p className="text-center text-foreground/80 mb-6">
                    Join our exclusive beta program and unlock free Pro access. Enter your email to receive your private beta code.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground" />
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError("");
                        }}
                        className="pl-10"
                        required
                        disabled={isSubmitting}
                        data-testid="input-email-capture"
                      />
                    </div>

                    {error && (
                      <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md p-3">
                        {error}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full gap-2"
                      size="lg"
                      disabled={isSubmitting || !email}
                      data-testid="button-submit-email"
                    >
                      <Sparkles className="w-5 h-5" />
                      {isSubmitting ? "Submitting..." : "Get My Beta Code"}
                    </Button>
                  </form>

                  <p className="text-xs text-center text-foreground mt-4">
                    Your exclusive beta code will be revealed instantly after signup.
                  </p>
                </div>
              ) : (
                <div className="relative z-10 text-center py-8">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[hsl(var(--aurora-teal))]/20 mx-auto mb-6">
                    <Sparkles className="w-8 h-8 text-[hsl(var(--liquid-gold))]" />
                  </div>

                  <h2 className="font-cormorant text-3xl font-bold mb-4 metallic-text">
                    Welcome to the Beta!
                  </h2>
                  <p className="text-foreground/80 mb-4">
                    Your exclusive beta code is:
                  </p>
                  <div className="bg-gradient-to-r from-[hsl(var(--cyber-fuchsia))]/10 to-[hsl(var(--liquid-gold))]/10 border-2 border-[hsl(var(--liquid-gold))]/30 rounded-lg p-4 mb-6">
                    <code className="text-2xl md:text-3xl font-bold text-[hsl(var(--liquid-gold))] tracking-wider font-mono" data-testid="text-beta-code">
                      MetaMuse2025
                    </code>
                  </div>
                  <p className="text-sm text-foreground/70 mb-2">
                    Go to your <span className="font-semibold">Account</span> page and enter this code to unlock Pro features for free!
                  </p>
                  <p className="text-xs text-foreground">
                    This window will close automatically...
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}