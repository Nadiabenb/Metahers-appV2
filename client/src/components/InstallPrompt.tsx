import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocalStorage } from "@/lib/storage";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const isDismissed = LocalStorage.isInstallPromptDismissed();
    
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      if (!isDismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
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
          <div className="glass-card rounded-2xl p-6 shadow-2xl border-2 border-white/40">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-serif text-lg font-semibold text-onyx mb-2">
                  Install MetaHers Mind Spa
                </h3>
                <p className="text-sm text-foreground/70">
                  Add to your home screen for quick access to your rituals and journal.
                </p>
              </div>
              <button
                onClick={handleDismiss}
                className="ml-2 p-1 hover-elevate rounded-full"
                data-testid="button-dismiss-install"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <Button
              onClick={handleInstall}
              className="w-full gap-2"
              size="lg"
              data-testid="button-install-app"
            >
              <Download className="w-5 h-5" />
              Install App
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
