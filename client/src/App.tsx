import { Switch, Route, useLocation } from "wouter";
import { useEffect, lazy, Suspense } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { trackPageView } from "@/lib/analytics";
import { Navigation } from "@/components/Navigation";
import { InstallPrompt } from "@/components/InstallPrompt";
import { ThemeProvider } from "@/components/ThemeProvider";
import { initializeApp } from "@/lib/storage";

import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";

const HomePage = lazy(() => import("@/pages/HomePage"));
const RitualsPage = lazy(() => import("@/pages/RitualsPage"));
const RitualDetailPage = lazy(() => import("@/pages/RitualDetailPage"));
const ShopPage = lazy(() => import("@/pages/ShopPage"));
const JournalPage = lazy(() => import("@/pages/JournalPage"));
const JournalHistoryPage = lazy(() => import("@/pages/JournalHistoryPage"));
const MetaMusePage = lazy(() => import("@/pages/MetaMusePage"));
const EventsPage = lazy(() => import("@/pages/EventsPage"));
const AccountPage = lazy(() => import("@/pages/AccountPage"));
const BlogPage = lazy(() => import("@/pages/BlogPage"));
const DailyNewsPage = lazy(() => import("@/pages/DailyNewsPage"));
const GlowUpLandingPage = lazy(() => import("@/pages/GlowUpLandingPage"));
const GlowUpOnboardingPage = lazy(() => import("@/pages/GlowUpOnboardingPage"));
const GlowUpDashboardPage = lazy(() => import("@/pages/GlowUpDashboardPage"));
const GlowUpJournalPage = lazy(() => import("@/pages/GlowUpJournalPage"));
const GlowUpCompletePage = lazy(() => import("@/pages/GlowUpCompletePage"));
const DiscoverPage = lazy(() => import("@/pages/DiscoverPage"));
const VIPCohortPage = lazy(() => import("@/pages/VIPCohortPage"));
const ExecutivePage = lazy(() => import("@/pages/ExecutivePage"));
const AIBuilderRetreatPage = lazy(() => import("@/pages/AIBuilderRetreatPage"));
const ThoughtLeadershipPage = lazy(() => import("@/pages/ThoughtLeadershipPage"));
const JourneyDayPage = lazy(() => import("@/pages/JourneyDayPage"));
const AdminQuizResultsPage = lazy(() => import("@/pages/AdminQuizResultsPage"));
const MemberWorkspacePage = lazy(() => import("@/pages/MemberWorkspacePage"));
const UpgradePage = lazy(() => import("@/pages/UpgradePage"));
const PromptPlaygroundPage = lazy(() => import("@/pages/PromptPlaygroundPage"));
const CareerPathGeneratorPage = lazy(() => import("@/pages/CareerPathGeneratorPage"));
const MetaHersWorldPage = lazy(() => import("@/pages/MetaHersWorldPage"));
const SpaceDetailPage = lazy(() => import("@/pages/SpaceDetailPage"));
const ExperienceDetailPage = lazy(() => import("@/pages/ExperienceDetailPage"));
const ProgressDashboardPage = lazy(() => import("@/pages/ProgressDashboardPage"));
const AIPromptLibraryPage = lazy(() => import("@/pages/AIPromptLibraryPage"));
const AppAtelierPage = lazy(() => import("@/pages/AppAtelier"));
const CompanionPage = lazy(() => import("@/pages/CompanionPage"));
const FoundersSanctuaryPage = lazy(() => import("@/pages/FoundersSanctuary"));
const NotFound = lazy(() => import("@/pages/not-found"));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();

  useEffect(() => {
    trackPageView(location, document.title);
  }, [location]);

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
    <Suspense fallback={<LoadingFallback />}>
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/signup" component={SignupPage} />
        <Route path="/forgot-password" component={ForgotPasswordPage} />
        <Route path="/reset-password" component={ResetPasswordPage} />
        <Route path="/ai-glow-up-program" component={GlowUpLandingPage} />

        {/* Public routes - accessible to everyone */}
        <Route path="/blog" component={BlogPage} />
        <Route path="/daily" component={DailyNewsPage} />
        <Route path="/playground" component={PromptPlaygroundPage} />
        <Route path="/career-path" component={CareerPathGeneratorPage} />
        <Route path="/upgrade" component={UpgradePage} />
        <Route path="/shop" component={ShopPage} />
        <Route path="/discover" component={DiscoverPage} />
        <Route path="/vip-cohort" component={VIPCohortPage} />
        <Route path="/executive" component={ExecutivePage} />
        <Route path="/ai-builder" component={AIBuilderRetreatPage} />
        <Route path="/app-atelier" component={AppAtelierPage} />
        <Route path="/founders-sanctuary" component={FoundersSanctuaryPage} />
        <Route path="/rituals" component={RitualsPage} />
        <Route path="/journey/day-:dayNumber" component={JourneyDayPage} />

        {/* Conversion-Optimized Landing Page for Ads */}
        <Route path="/" component={LandingPage} />

        {/* MetaHers World - Internal Hub */}
        <Route path="/world" component={MetaHersWorldPage} />

        {/* Space Detail Pages - Public */}
        <Route path="/spaces/:slug" component={SpaceDetailPage} />

        {/* Experience Detail Pages - Public */}
        <Route path="/experiences/:slug" component={ExperienceDetailPage} />

        {/* Progress Dashboard - Public but enhanced for auth users */}
        <Route path="/progress" component={ProgressDashboardPage} />

        {/* AI Prompt Library - Public resource */}
        <Route path="/ai-prompts" component={AIPromptLibraryPage} />

        {isAuthenticated && (
          <>
            <Route path="/home" component={HomePage} />
            <Route path="/workspace" component={MemberWorkspacePage} />
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
            <Route path="/thought-leadership" component={ThoughtLeadershipPage} />
            <Route path="/admin/quiz-results" component={AdminQuizResultsPage} />
          </>
        )}
        {/* Add the companion route here */}
        <Route path="/companion" component={CompanionPage} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
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
      <ThemeProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-background overflow-x-hidden">
            <Navigation />
            <Router />
            <InstallPrompt />
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;