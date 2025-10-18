import { Switch, Route } from "wouter";
import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/Navigation";
import { InstallPrompt } from "@/components/InstallPrompt";
import { initializeApp } from "@/lib/storage";
import HomePage from "@/pages/HomePage";
import RitualsPage from "@/pages/RitualsPage";
import RitualDetailPage from "@/pages/RitualDetailPage";
import ShopPage from "@/pages/ShopPage";
import JournalPage from "@/pages/JournalPage";
import MetaMusePage from "@/pages/MetaMusePage";
import EventsPage from "@/pages/EventsPage";
import AccountPage from "@/pages/AccountPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/rituals" component={RitualsPage} />
      <Route path="/rituals/:slug" component={RitualDetailPage} />
      <Route path="/shop" component={ShopPage} />
      <Route path="/journal" component={JournalPage} />
      <Route path="/metamuse" component={MetaMusePage} />
      <Route path="/events" component={EventsPage} />
      <Route path="/account" component={AccountPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    initializeApp();

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration);
        })
        .catch((error) => {
          console.log('SW registration failed:', error);
        });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-champagne">
          <Navigation />
          <Router />
          <InstallPrompt />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
