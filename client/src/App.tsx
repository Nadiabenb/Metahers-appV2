import { Switch, Route } from "wouter";
import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { Navigation } from "@/components/Navigation";
import { InstallPrompt } from "@/components/InstallPrompt";
import { EmailCaptureModal } from "@/components/EmailCaptureModal";
import { initializeApp } from "@/lib/storage";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import HomePage from "@/pages/HomePage";
import RitualsPage from "@/pages/RitualsPage";
import RitualDetailPage from "@/pages/RitualDetailPage";
import ShopPage from "@/pages/ShopPage";
import JournalPage from "@/pages/JournalPage";
import JournalHistoryPage from "@/pages/JournalHistoryPage";
import MetaMusePage from "@/pages/MetaMusePage";
import EventsPage from "@/pages/EventsPage";
import AccountPage from "@/pages/AccountPage";
import BlogPage from "@/pages/BlogPage";
import DailyNewsPage from "@/pages/DailyNewsPage";
import GlowUpLandingPage from "@/pages/GlowUpLandingPage";
import GlowUpOnboardingPage from "@/pages/GlowUpOnboardingPage";
import GlowUpDashboardPage from "@/pages/GlowUpDashboardPage";
import GlowUpJournalPage from "@/pages/GlowUpJournalPage";
import GlowUpCompletePage from "@/pages/GlowUpCompletePage";
import DiscoverPage from "@/pages/DiscoverPage";
import VIPCohortPage from "@/pages/VIPCohortPage";
import AdminQuizResultsPage from "@/pages/AdminQuizResultsPage";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/70">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/forgot-password" component={ForgotPasswordPage} />
      <Route path="/reset-password" component={ResetPasswordPage} />
      <Route path="/ai-glow-up-program" component={GlowUpLandingPage} />
      
      {/* Public routes - accessible to everyone */}
      <Route path="/blog" component={BlogPage} />
      <Route path="/daily" component={DailyNewsPage} />
      <Route path="/shop" component={ShopPage} />
      <Route path="/discover" component={DiscoverPage} />
      <Route path="/vip-cohort" component={VIPCohortPage} />
      <Route path="/rituals" component={RitualsPage} />
      
      {!isAuthenticated ? (
        <Route path="/" component={LandingPage} />
      ) : (
        <>
          <Route path="/" component={HomePage} />
          <Route path="/rituals" component={RitualsPage} />
          <Route path="/rituals/:slug" component={RitualDetailPage} />
          <Route path="/journal" component={JournalPage} />
          <Route path="/journal/history" component={JournalHistoryPage} />
          <Route path="/metamuse" component={MetaMusePage} />
          <Route path="/events" component={EventsPage} />
          <Route path="/account" component={AccountPage} />
          <Route path="/glow-up" component={GlowUpOnboardingPage} />
          <Route path="/glow-up/dashboard" component={GlowUpDashboardPage} />
          <Route path="/glow-up/journal" component={GlowUpJournalPage} />
          <Route path="/glow-up/complete" component={GlowUpCompletePage} />
          <Route path="/admin/quiz-results" component={AdminQuizResultsPage} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    initializeApp();

    // Disabled service worker for now to avoid issues in development
    // if ('serviceWorker' in navigator) {
    //   navigator.serviceWorker.register('/sw.js')
    //     .then((registration) => {
    //       console.log('SW registered:', registration);
    //     })
    //     .catch((error) => {
    //       console.log('SW registration failed:', error);
    //     });
    // }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Navigation />
          <Router />
          <InstallPrompt />
          <EmailCaptureModal />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
