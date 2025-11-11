import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Smartphone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocalStorage } from "@/lib/storage";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    const isDismissed = LocalStorage.isInstallPromptDismissed();
    let androidPromptTimer: NodeJS.Timeout | null = null;
    let iOSPromptTimer: NodeJS.Timeout | null = null;
    
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      if (!isDismissed) {
        // Delay showing prompt until user has been engaged for 30 seconds
        androidPromptTimer = setTimeout(() => {
          setShowPrompt(true);
        }, 30000);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    // For iOS devices, show custom prompt after engagement
    const isStandalone = (window.navigator as any).standalone;
    if (iOS && !isDismissed && !isStandalone) {
      iOSPromptTimer = setTimeout(() => {
        setShowPrompt(true);
      }, 30000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      if (androidPromptTimer) clearTimeout(androidPromptTimer);
      if (iOSPromptTimer) clearTimeout(iOSPromptTimer);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowPrompt(false);
      LocalStorage.setInstallPromptDismissed(true);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    LocalStorage.setInstallPromptDismissed(true);
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50"
          data-testid="install-prompt"
        >
          <div className="editorial-card p-6 shadow-2xl neon-glow-violet relative overflow-hidden">
            <div className="absolute inset-0 gradient-violet-magenta opacity-5" />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-1">
                      Install MetaHers Mind Spa
                    </h3>
                    <p className="text-sm text-foreground/70 mb-3">
                      {isIOS 
                        ? "Access your AI learning journey offline, anytime."
                        : "Get faster access, offline support, and push notifications."}
                    </p>
                    {isIOS && (
                      <div className="flex items-start gap-2 p-3 bg-background/50 rounded-lg border border-border/50">
                        <Smartphone className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground">
                          Tap <span className="font-semibold">Share</span> → <span className="font-semibold">Add to Home Screen</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleDismiss}
                  className="ml-2 p-1 hover-elevate rounded-full shrink-0"
                  data-testid="button-dismiss-install"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {!isIOS && (
                <Button
                  onClick={handleInstall}
                  className="w-full gap-2 gold-shimmer"
                  size="lg"
                  data-testid="button-install-app"
                >
                  <Download className="w-5 h-5" />
                  Install App
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
