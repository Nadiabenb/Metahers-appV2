
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function StickyLeadBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const hasSubmitted = localStorage.getItem("emailCaptureSubmitted");
    const hasDismissed = localStorage.getItem("stickyBarDismissed");
    
    if (!hasSubmitted && !hasDismissed) {
      // Show after 3 seconds
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/email-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'sticky_lead_bar' }),
      });

      if (response.ok) {
        localStorage.setItem("emailCaptureSubmitted", "true");
        setIsSuccess(true);
        setTimeout(() => setIsVisible(false), 5000);
      }
    } catch (err) {
      console.error('Failed to submit email:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("stickyBarDismissed", "true");
    
    // Re-show after 5 minutes if not submitted
    setTimeout(() => {
      const hasSubmitted = localStorage.getItem("emailCaptureSubmitted");
      if (!hasSubmitted) {
        localStorage.removeItem("stickyBarDismissed");
        setIsVisible(true);
      }
    }, 300000);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              {!isSuccess ? (
                <>
                  <div className="flex items-center gap-3 flex-1">
                    <Download className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-semibold hidden sm:block">
                      FREE DOWNLOAD: 7 AI Prompts That Will 10X Your Productivity 🚀
                    </p>
                    <p className="text-sm font-semibold sm:hidden">
                      Get Free AI Guide 🚀
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="flex items-center gap-2 flex-shrink-0">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-48 sm:w-64 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
                      required
                      disabled={isSubmitting}
                    />
                    <Button
                      type="submit"
                      size="sm"
                      className="bg-white text-purple-600 hover:bg-white/90 font-semibold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Get It Free"}
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </form>
                </>
              ) : (
                <div className="flex items-center justify-center gap-2 flex-1">
                  <p className="text-sm font-semibold">
                    ✓ Success! Check your email for your free AI guide + beta access code
                  </p>
                </div>
              )}

              <button
                onClick={handleDismiss}
                className="text-white hover:text-white/80 transition-colors flex-shrink-0"
                aria-label="Dismiss"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
