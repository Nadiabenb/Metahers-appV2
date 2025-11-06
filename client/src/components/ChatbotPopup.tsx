import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Zap, Compass, TrendingUp, ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { trackCTAClick } from "@/lib/analytics";

export function ChatbotPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Show chatbot after 3 seconds on first visit
    const hasSeenBot = localStorage.getItem('metahers_chatbot_seen');
    
    if (!hasSeenBot) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasShown(true);
        localStorage.setItem('metahers_chatbot_seen', 'true');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    setIsOpen(false);
  };

  const handleReopen = () => {
    setIsMinimized(false);
    setIsOpen(true);
  };

  const handleQuickAction = (path: string, action: string) => {
    trackCTAClick(`chatbot_${action}`, path);
    setLocation(path);
    handleClose();
  };

  const welcomeMessages = [
    "Hey gorgeous! 👋 Welcome to MetaHers Mind Spa!",
    "Ready to glow up your AI & Web3 skills?",
    "I'm here to help you navigate your transformation journey ✨"
  ];

  const quickActions = [
    {
      icon: Sparkles,
      label: "Try AI Tools",
      path: "/playground",
      action: "try_ai_tools",
      gradient: "from-cyan-500 to-blue-600"
    },
    {
      icon: TrendingUp,
      label: "AI Glow-Up Program",
      path: "/ai-glow-up-program",
      action: "glow_up",
      gradient: "from-pink-500 to-rose-600"
    },
    {
      icon: Compass,
      label: "Explore Spaces",
      path: "/discover",
      action: "discover",
      gradient: "from-violet-500 to-purple-600"
    },
    {
      icon: Zap,
      label: "Start Learning",
      path: "/rituals",
      action: "rituals",
      gradient: "from-amber-500 to-orange-600"
    }
  ];

  return (
    <>
      {/* Minimized Button */}
      <AnimatePresence>
        {isMinimized && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleReopen}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--hyper-violet))] to-[hsl(var(--cyber-fuchsia))] shadow-2xl flex items-center justify-center border-2 border-white/20"
            data-testid="button-chatbot-reopen"
          >
            <MessageCircle className="w-7 h-7 text-white" />
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-[hsl(var(--hyper-violet))] to-[hsl(var(--cyber-fuchsia))] blur-xl opacity-60"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 0.8, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chatbot Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)]"
            data-testid="chatbot-popup"
          >
            {/* Chat Card */}
            <div className="relative backdrop-blur-2xl bg-background/95 border-2 border-white/20 rounded-3xl shadow-2xl overflow-hidden">
              {/* Gradient Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--hyper-violet))]/20 via-transparent to-[hsl(var(--cyber-fuchsia))]/20 pointer-events-none" />
              
              {/* Header */}
              <div className="relative p-6 pb-4 border-b border-white/10">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <motion.div
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-[hsl(var(--hyper-violet))] to-[hsl(var(--cyber-fuchsia))] flex items-center justify-center shadow-lg flex-shrink-0"
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(181, 101, 216, 0.5)",
                        "0 0 30px rgba(233, 53, 193, 0.7)",
                        "0 0 20px rgba(181, 101, 216, 0.5)",
                      ]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Sparkles className="w-7 h-7 text-white" />
                  </motion.div>

                  {/* Messages */}
                  <div className="flex-1">
                    <h3 className="font-serif text-lg font-bold text-gradient-violet mb-2">
                      Your MetaHers Guide
                    </h3>
                    <div className="space-y-2">
                      {welcomeMessages.map((message, index) => (
                        <motion.p
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.3 }}
                          className="text-sm text-foreground/90"
                        >
                          {message}
                        </motion.p>
                      ))}
                    </div>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={handleClose}
                    className="text-foreground/50 hover:text-foreground transition-colors"
                    data-testid="button-chatbot-close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="relative p-6">
                <p className="text-sm font-semibold text-foreground/70 mb-4">
                  Where would you like to start?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <motion.button
                        key={action.action}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleQuickAction(action.path, action.action)}
                        className="relative p-4 rounded-xl bg-white/5 border-2 border-white/10 hover:border-white/30 hover:bg-white/10 transition-all text-left group overflow-hidden"
                        data-testid={`chatbot-action-${action.action}`}
                      >
                        {/* Gradient Icon */}
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg mb-2`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        
                        {/* Label */}
                        <p className="text-sm font-medium text-foreground">
                          {action.label}
                        </p>

                        {/* Hover Arrow */}
                        <motion.div
                          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                          initial={false}
                        >
                          <ArrowRight className="w-4 h-4 text-foreground/50" />
                        </motion.div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Minimize Button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="mt-4"
                >
                  <Button
                    onClick={handleMinimize}
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs text-foreground/60 hover:text-foreground"
                    data-testid="button-chatbot-minimize"
                  >
                    I'll explore on my own for now
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
