import { useEffect, useState } from "react";
import { AlertCircle, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NetworkErrorBoundary({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowNotification(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      {children}
      
      {!isOnline && showNotification && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto max-w-sm z-50">
          <div className="bg-red-900/90 backdrop-blur-md border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-100 mb-2">You're offline</p>
              <p className="text-red-200 text-sm mb-3">Some features may not be available. Check your connection.</p>
              <Button 
                size="sm" 
                onClick={() => setShowNotification(false)}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
