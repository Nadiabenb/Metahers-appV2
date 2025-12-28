import { Switch, Route, useLocation } from "wouter";
import { useEffect, lazy, Suspense } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { trackPageView } from "@/lib/analytics";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { NetworkErrorBoundary } from "@/components/NetworkErrorBoundary";
import { InstallPrompt } from "@/components/InstallPrompt";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CursorSparkles } from "@/components/effects/CursorSparkles";
import { BreathingLoader } from "@/components/effects/BreathingLoader";
import { initializeApp } from "@/lib/storage";
import { CustomCursor } from "@/components/effects/CustomCursor";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";

// Admin Pages
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminExperiencesPage from "@/pages/admin/AdminExperiencesPage";
import AdminVoyagesPage from "@/pages/admin/AdminVoyagesPage";

const HomePage = lazy(() => import("@/pages/HomePage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
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
const AIMasteryPage = lazy(() => import("@/pages/AIMasteryPage"));
const DiscoverPage = lazy(() => import("@/pages/DiscoverPage"));
const VIPCohortPage = lazy(() => import("@/pages/VIPCohortPage"));
const ExecutivePage = lazy(() => import("@/pages/ExecutivePage"));
const AIBuilderRetreatPage = lazy(() => import("@/pages/AIBuilderRetreatPage"));
const ThoughtLeadershipPage = lazy(() => import("@/pages/ThoughtLeadershipPage"));
const JourneyDayPage = lazy(() => import("@/pages/JourneyDayPage"));
const RetroCameraPage = lazy(() => import("@/pages/RetroCameraPage"));
const AdminQuizResultsPage = lazy(() => import("@/pages/AdminQuizResultsPage"));
const UpgradePage = lazy(() => import("@/pages/UpgradePage"));
const PromptPlaygroundPage = lazy(() => import("@/pages/PromptPlaygroundPage"));
const CareerPathGeneratorPage = lazy(() => import("@/pages/CareerPathGeneratorPage"));
const MetaHersWorldPage = lazy(() => import("@/pages/MetaHersWorldPage"));
const SpaceDetailPage = lazy(() => import("@/pages/SpaceDetailPage"));
const ExperienceDetailPage = lazy(() => import("@/pages/ExperienceDetailPage"));
const AIPromptLibraryPage = lazy(() => import("@/pages/AIPromptLibraryPage"));
const AppAtelierPage = lazy(() => import("@/pages/AppAtelier"));
const CompanionPage = lazy(() => import("@/pages/CompanionPage"));
const FoundersSanctuaryPage = lazy(() => import("@/pages/FoundersSanctuary"));
const RetreatPage = lazy(() => import("@/pages/RetreatPage"));
const ProgressDashboardPage = lazy(() => import("@/pages/ProgressDashboardPage"));
const CircleDiscoveryPage = lazy(() => import("@/pages/CircleDiscoveryPage"));
const CircleProfilePage = lazy(() => import("@/pages/CircleProfilePage"));
const CircleServicesPage = lazy(() => import("@/pages/CircleServicesPage"));
const CircleMessagingPage = lazy(() => import("@/pages/CircleMessagingPage"));
const NewsletterPage = lazy(() => import("@/pages/NewsletterPage"));
const WaitlistPage = lazy(() => import("@/pages/WaitlistPage"));
const CheckoutPage = lazy(() => import("@/pages/CheckoutPage"));
const OnboardingQuizPage = lazy(() => import("@/pages/OnboardingQuizPage"));
const TierSelectionPage = lazy(() => import("@/pages/TierSelectionPage"));
const PrivacyPolicyPage = lazy(() => import("@/pages/PrivacyPolicyPage"));
const TermsOfServicePage = lazy(() => import("@/pages/TermsOfServicePage"));
const LearningHubPage = lazy(() => import("@/pages/LearningHubPage"));
const VisionBoardPage = lazy(() => import("@/pages/VisionBoardPage"));
const FreeResourcesPage = lazy(() => import("@/pages/FreeResourcesPage"));
const AgencyDashboardPage = lazy(() => import("@/pages/AgencyDashboardPage"));
const VoyagesPage = lazy(() => import("@/pages/VoyagesPage"));
const VoyageDetailPage = lazy(() => import("@/pages/VoyageDetailPage"));
const VoyageSuccessPage = lazy(() => import("@/pages/VoyageSuccessPage"));
const NotFound = lazy(() => import("@/pages/not-found"));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <BreathingLoader size="lg" />
    </div>
  );
}

function Redirect({ to }: { to: string }) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation(to);
  }, [to, setLocation]);

  return <LoadingFallback />;
}

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [location] = useLocation();

  useEffect(() => {
    trackPageView(location, document.title);
  }, [location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <BreathingLoader size="lg" className="mb-4" />
          <p className="text-foreground/70">Preparing your sanctuary...</p>
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
        <Route path="/retreat" component={RetreatPage} />
        <Route path="/blog" component={BlogPage} />
        <Route path="/daily" component={DailyNewsPage} />
        <Route path="/playground" component={PromptPlaygroundPage} />
        <Route path="/career-path" component={CareerPathGeneratorPage} />
        <Route path="/upgrade" component={UpgradePage} />
        <Route path="/shop" component={ShopPage} />
        <Route path="/retro-camera" component={RetroCameraPage} />
        <Route path="/vip-cohort" component={VIPCohortPage} />
        <Route path="/executive" component={ExecutivePage} />
        <Route path="/ai-builder" component={AIBuilderRetreatPage} />
        <Route path="/app-atelier" component={AppAtelierPage} />
        <Route path="/founders-sanctuary" component={FoundersSanctuaryPage} />
        <Route path="/ai-mastery" component={AIMasteryPage} />
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

        {/* AI Prompt Library - Public resource */}
        <Route path="/ai-prompts" component={AIPromptLibraryPage} />

        {/* Companion - Public */}
        <Route path="/companion" component={CompanionPage} />

        {/* Newsletter & Waitlist - Public */}
        <Route path="/newsletter" component={NewsletterPage} />
        <Route path="/waitlist" component={WaitlistPage} />

        {/* Legal Pages - Public */}
        <Route path="/privacy" component={PrivacyPolicyPage} />
        <Route path="/terms" component={TermsOfServicePage} />
        <Route path="/checkout/:tier/:priceId" component={(props: any) => {
          const tiers = { pro: { name: 'Pro', price: 29 }, sanctuary: { name: 'Sanctuary', price: 99 }, 'inner-circle': { name: 'Inner Circle', price: 299 } };
          const tier = tiers[props.tier as keyof typeof tiers];
          return tier ? <CheckoutPage tierName={tier.name} price={tier.price} priceId={props.priceId} /> : <NotFound />;
        }} />

        {/* AI Mastery Program Learning Hub - Public */}
        <Route path="/learning-hub" component={LearningHubPage} />

        {/* Vision Board Builder - Public */}
        <Route path="/vision-board" component={VisionBoardPage} />

        {/* Free Resources Page - Public */}
        <Route path="/free-resources" component={FreeResourcesPage} />

        {/* Circle - Networking (public accessible) */}
        <Route path="/circle" component={CircleDiscoveryPage} />

        {/* AI Digital Agency - Public */}
        <Route path="/agency" component={AgencyDashboardPage} />

        {isAuthenticated ? (
          <>
            {/* Tier Selection Onboarding */}
            <Route path="/onboarding/tier-selection" component={TierSelectionPage} />

            {/* Onboarding Quiz */}
            <Route path="/onboarding/quiz" component={OnboardingQuizPage} />

            {/* Circle - Authenticated Routes */}
            <Route path="/circle-profile" component={CircleProfilePage} />
            <Route path="/circle-services" component={CircleServicesPage} />
            <Route path="/circle-messaging" component={CircleMessagingPage} />

            {/* Main Dashboard - Unified view */}
            <Route path="/dashboard" component={DashboardPage} />

            {/* Admin Routes */}
            <Route path="/admin" component={AdminDashboardPage} />
            <Route path="/admin/users" component={AdminUsersPage} />
            <Route path="/admin/experiences" component={AdminExperiencesPage} />
            <Route path="/admin/voyages" component={AdminVoyagesPage} />
            <Route path="/admin/ai" component={() => {
              const AIDashboard = lazy(() => import('@/pages/admin/AIDashboardPage'));
              return <AIDashboard />;
            }} />

            {/* Redirect authenticated users to dashboard */}
            <Route path="/home">{() => <Redirect to="/dashboard" />}</Route>
            <Route path="/workspace">{() => <Redirect to="/dashboard" />}</Route>
            <Route path="/progress">{() => <Redirect to="/dashboard" />}</Route>

            {/* Authenticated routes */}
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

            {/* MetaHers Voyages */}
            <Route path="/voyages" component={VoyagesPage} />
            <Route path="/voyages/:slug" component={VoyageDetailPage} />
            <Route path="/voyages/success" component={VoyageSuccessPage} />
          </>
        ) : (
          <>
            {/* Public fallback for legacy routes when not authenticated */}
            <Route path="/dashboard">{() => <Redirect to="/login" />}</Route>
            <Route path="/home" component={HomePage} />
            <Route path="/workspace">{() => <Redirect to="/login" />}</Route>
            <Route path="/progress">{() => <Redirect to="/login" />}</Route>

            {/* Public MetaHers Voyages */}
            <Route path="/voyages" component={VoyagesPage} />
            <Route path="/voyages/:slug" component={VoyageDetailPage} />
            <Route path="/voyages/success" component={VoyageSuccessPage} />
          </>
        )}
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
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <NetworkErrorBoundary>
              <ErrorBoundary fallback={
                <div className="min-h-screen flex items-center justify-center p-4">
                  <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Unable to load app</h2>
                    <p className="text-muted-foreground mb-4">Please refresh the page</p>
                    <Button onClick={() => window.location.reload()}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              }>
                <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
                  <CursorSparkles />
                  <CustomCursor />
                  <Navigation />
                  <main className="flex-1">
                    <Router />
                  </main>
                  <Footer />
                  <InstallPrompt />
                </div>
                <Toaster />
              </ErrorBoundary>
            </NetworkErrorBoundary>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;