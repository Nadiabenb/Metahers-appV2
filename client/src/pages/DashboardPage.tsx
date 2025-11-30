import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { SEO } from "@/components/SEO";
import { WelcomeModal } from "@/components/WelcomeModal";
import { RecommendationWidget } from "@/components/RecommendationWidget";
import { PersonalizedRecommendations } from "@/components/PersonalizedRecommendations";
import { NextExperienceWidget } from "@/components/NextExperienceWidget";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Crown, Calendar, Users, Sparkles, ArrowRight, Clock, 
  Video, Trophy, Flame, Target, Star, TrendingUp, 
  Award, Zap, CheckCircle2, BookOpen
} from "lucide-react";
import { Link } from "wouter";
import { formatPrice, getPricingPlan, isSanctuaryTier, isInnerCircleTier, isFoundersCircleTier, type SubscriptionTier } from "@shared/pricing";
import { format, parseISO } from "date-fns";

type GroupSession = {
  id: string;
  title: string;
  description: string | null;
  sessionType: string;
  scheduledDate: string;
  duration: number;
  maxCapacity: number;
  currentAttendees: number;
  zoomLink: string | null;
  status: string;
};

type OneOnOneBooking = {
  id: string;
  scheduledDate: string;
  bookingType: string;
  duration: number;
  status: string;
  meetingLink: string | null;
  notes: string | null;
};

type FounderInsight = {
  id: string;
  title: string;
  content: string;
  category: string;
  minTierRequired: string;
  publishedAt: string;
  viewCount: number;
};

type Space = {
  id: string;
  name: string;
  slug: string;
  color: string;
  sortOrder: number;
};

type ExperienceProgress = {
  id: string;
  experienceId: string;
  completedSections: string[];
  confidenceScore: number | null;
  completedAt: string | null;
  startedAt: string;
};

type Experience = {
  id: string;
  title: string;
  slug: string;
  spaceId: string;
  tier: string;
  estimatedMinutes: number;
  content: {
    sections: Array<{ id: string }>;
  };
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);
  const tier = (user?.subscriptionTier || 'free') as SubscriptionTier;
  const plan = getPricingPlan(tier);
  
  const hasSanctuaryAccess = isSanctuaryTier(tier);
  const hasInnerCircleAccess = isInnerCircleTier(tier);
  const hasFoundersCircleAccess = isFoundersCircleTier(tier);

  useEffect(() => {
    if (user && !user.onboardingCompleted) {
      setShowWelcome(true);
    }
  }, [user]);

  // Fetch all required data
  const { data: upcomingSessions, isLoading: loadingSessions } = useQuery<GroupSession[]>({
    queryKey: ['/api/sessions/upcoming'],
    enabled: hasSanctuaryAccess,
  });

  const { data: upcomingBookings, isLoading: loadingBookings } = useQuery<OneOnOneBooking[]>({
    queryKey: ['/api/bookings/upcoming'],
    enabled: hasInnerCircleAccess,
  });

  const { data: insights, isLoading: loadingInsights } = useQuery<FounderInsight[]>({
    queryKey: ['/api/insights'],
    enabled: hasInnerCircleAccess,
  });

  const { data: spaces = [], isLoading: spacesLoading } = useQuery<Space[]>({
    queryKey: ["/api/spaces"],
  });

  const { data: allProgress = [], isLoading: progressLoading } = useQuery<ExperienceProgress[]>({
    queryKey: ["/api/progress/all"],
  });

  const { data: allExperiences = [], isLoading: experiencesLoading } = useQuery<Experience[]>({
    queryKey: ["/api/experiences/all"],
  });

  const handleCompleteOnboarding = async () => {
    try {
      await apiRequest('POST', '/api/auth/complete-onboarding', {});
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      setShowWelcome(false);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setShowWelcome(false);
    }
  };

  // Calculate statistics
  const completedExperiences = allProgress.filter(p => p.completedAt).length;
  const totalMinutesLearned = allProgress.reduce((sum, progress) => {
    const exp = allExperiences.find(e => e.id === progress.experienceId);
    if (exp && progress.completedAt) {
      return sum + exp.estimatedMinutes;
    }
    return sum;
  }, 0);

  const averageConfidence = allProgress.length > 0
    ? Math.round(allProgress.reduce((sum, p) => sum + (p.confidenceScore || 0), 0) / allProgress.length)
    : 0;

  const currentStreak = 7;

  const tierBadgeColors = {
    free: 'bg-muted text-foreground',
    pro_monthly: 'bg-gradient-to-r from-[hsl(var(--hyper-violet))] to-[hsl(var(--magenta-quartz))] text-white',
    pro_annual: 'bg-gradient-to-r from-[hsl(var(--hyper-violet))] to-[hsl(var(--magenta-quartz))] text-white',
    sanctuary: 'bg-gradient-to-r from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--aurora-teal))] text-white',
    inner_circle: 'bg-gradient-to-r from-[hsl(var(--aurora-teal))] to-[hsl(var(--liquid-gold))] text-white',
    founders_circle: 'bg-gradient-to-r from-[hsl(var(--liquid-gold))] via-[hsl(var(--magenta-quartz))] to-[hsl(var(--hyper-violet))] text-white',
    vip_cohort: 'bg-gradient-to-r from-[hsl(var(--hyper-violet))] to-[hsl(var(--magenta-quartz))] text-white',
    executive: 'bg-gradient-to-r from-[hsl(var(--liquid-gold))] to-[hsl(var(--cyber-fuchsia))] text-white',
  };

  const spaceProgress = spaces.map(space => {
    const spaceExperiences = allExperiences.filter(e => e.spaceId === space.id);
    const completedInSpace = allProgress.filter(p => {
      const exp = allExperiences.find(e => e.id === p.experienceId);
      return exp?.spaceId === space.id && p.completedAt;
    }).length;

    const progressPercent = spaceExperiences.length > 0
      ? (completedInSpace / spaceExperiences.length) * 100
      : 0;

    return {
      ...space,
      total: spaceExperiences.length,
      completed: completedInSpace,
      progressPercent,
    };
  }).sort((a, b) => a.sortOrder - b.sortOrder);

  const COLOR_CLASSES: Record<string, string> = {
    "hyper-violet": "from-[hsl(var(--hyper-violet))] to-[hsl(var(--magenta-quartz))]",
    "magenta-quartz": "from-[hsl(var(--magenta-quartz))] to-[hsl(var(--cyber-fuchsia))]",
    "cyber-fuchsia": "from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--aurora-teal))]",
    "aurora-teal": "from-[hsl(var(--aurora-teal))] to-[hsl(var(--liquid-gold))]",
    "liquid-gold": "from-[hsl(var(--liquid-gold))] to-[hsl(var(--hyper-violet))]",
  };

  return (
    <div className="min-h-screen relative bg-white py-8 px-4 sm:px-6 lg:px-8"
    >
      
      <div className="relative z-10">
      <SEO
        title="Dashboard - MetaHers Mind Spa"
        description="Your personalized dashboard for AI and Web3 learning, exclusive member benefits, and transformational progress tracking."
        keywords="member dashboard, AI learning, Web3 education, progress tracking"
      />

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="font-semibold text-4xl sm:text-5xl text-black mb-2" data-testid="text-dashboard-title">
                Welcome Back, {user?.firstName || 'Member'}
              </h1>
              <p className="text-lg text-foreground/70">
                Your sanctuary for growth and transformation
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className={`${tierBadgeColors[tier]} px-4 py-2 text-sm font-medium`} data-testid="badge-current-tier">
                {plan.badge && <Sparkles className="w-4 h-4 mr-2" />}
                {plan.displayName}
              </Badge>
              {tier !== 'founders_circle' && (
                <Link href="/upgrade">
                  <Button variant="default" size="sm" data-testid="button-upgrade">
                    Upgrade
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </motion.div>

        {/* Personalized Recommendations from Quiz */}
        <PersonalizedRecommendations />

        {/* Next Experience */}
        <NextExperienceWidget />

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="hover-elevate" data-testid="card-stat-streak">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Flame className="w-4 h-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentStreak} days</div>
              <p className="text-xs text-foreground">Keep it going!</p>
            </CardContent>
          </Card>

          <Card className="hover-elevate" data-testid="card-stat-completed">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Trophy className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedExperiences}</div>
              <p className="text-xs text-foreground">Experiences finished</p>
            </CardContent>
          </Card>

          <Card className="hover-elevate" data-testid="card-stat-time">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Invested</CardTitle>
              <Clock className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(totalMinutesLearned / 60)}h</div>
              <p className="text-xs text-foreground">{totalMinutesLearned} minutes</p>
            </CardContent>
          </Card>

          <Card className="hover-elevate" data-testid="card-stat-confidence">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confidence</CardTitle>
              <Star className="w-4 h-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageConfidence}%</div>
              <p className="text-xs text-foreground">Average score</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Next Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <RecommendationWidget />
            </motion.div>

            {/* Upcoming Sessions (Sanctuary+) */}
            {hasSanctuaryAccess && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.25 }}
              >
                <Card data-testid="card-upcoming-sessions">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Upcoming Group Sessions
                    </CardTitle>
                    <CardDescription>Join live sessions with fellow members</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loadingSessions ? (
                      <div className="text-sm text-foreground">Loading sessions...</div>
                    ) : upcomingSessions && upcomingSessions.length > 0 ? (
                      <div className="space-y-3">
                        {upcomingSessions.slice(0, 3).map((session) => (
                          <div key={session.id} className="flex items-start justify-between p-3 rounded-lg bg-muted/50 hover-elevate" data-testid={`session-${session.id}`}>
                            <div className="flex-1">
                              <h4 className="font-medium text-sm mb-1">{session.title}</h4>
                              <div className="flex items-center gap-4 text-xs text-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {format(parseISO(session.scheduledDate), 'MMM d, h:mm a')}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {session.duration} min
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {session.currentAttendees}/{session.maxCapacity}
                                </span>
                              </div>
                            </div>
                            {session.zoomLink && (
                              <a href={session.zoomLink} target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="sm" data-testid={`button-join-session-${session.id}`}>
                                  <Video className="w-4 h-4 mr-2" />
                                  Join
                                </Button>
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-foreground text-center py-8">
                        No upcoming sessions scheduled yet
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 1-on-1 Bookings (Inner Circle+) */}
            {hasInnerCircleAccess && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Card data-testid="card-upcoming-bookings">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      Your 1-on-1 Sessions
                    </CardTitle>
                    <CardDescription>Private coaching sessions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loadingBookings ? (
                      <div className="text-sm text-foreground">Loading bookings...</div>
                    ) : upcomingBookings && upcomingBookings.length > 0 ? (
                      <div className="space-y-3">
                        {upcomingBookings.slice(0, 3).map((booking) => (
                          <div key={booking.id} className="flex items-start justify-between p-3 rounded-lg bg-muted/50 hover-elevate" data-testid={`booking-${booking.id}`}>
                            <div className="flex-1">
                              <h4 className="font-medium text-sm mb-1 capitalize">{booking.bookingType.replace('_', ' ')}</h4>
                              <div className="flex items-center gap-4 text-xs text-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {format(parseISO(booking.scheduledDate), 'MMM d, h:mm a')}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {booking.duration} min
                                </span>
                              </div>
                            </div>
                            {booking.meetingLink && (
                              <a href={booking.meetingLink} target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="sm" data-testid={`button-join-booking-${booking.id}`}>
                                  <Video className="w-4 h-4 mr-2" />
                                  Join
                                </Button>
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-foreground text-center py-8">
                        No upcoming 1-on-1 sessions scheduled
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Learning Progress by Space */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.35 }}
            >
              <Card data-testid="card-space-progress">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Learning Spaces Progress
                  </CardTitle>
                  <CardDescription>Track your journey across all 6 spaces</CardDescription>
                </CardHeader>
                <CardContent>
                  {spacesLoading || progressLoading || experiencesLoading ? (
                    <div className="text-sm text-foreground">Loading progress...</div>
                  ) : (
                    <div className="space-y-4">
                      {spaceProgress.map((space) => (
                        <div key={space.id} className="space-y-2" data-testid={`space-progress-${space.slug}`}>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{space.name}</span>
                            <span className="text-xs text-foreground">
                              {space.completed} / {space.total} completed
                            </span>
                          </div>
                          <Progress value={space.progressPercent} className="h-2" />
                        </div>
                      ))}
                      <Link href="/world">
                        <Button variant="outline" className="w-full mt-4" data-testid="button-explore-spaces">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Explore All Spaces
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Quick Links & Insights */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card data-testid="card-quick-actions">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/journal">
                    <Button variant="outline" className="w-full justify-start" data-testid="button-journal">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Daily Journal
                    </Button>
                  </Link>
                  <Link href="/rituals">
                    <Button variant="outline" className="w-full justify-start" data-testid="button-rituals">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Browse Rituals
                    </Button>
                  </Link>
                  <Link href="/events">
                    <Button variant="outline" className="w-full justify-start" data-testid="button-events">
                      <Calendar className="w-4 h-4 mr-2" />
                      View Events
                    </Button>
                  </Link>
                  <Link href="/world">
                    <Button variant="outline" className="w-full justify-start" data-testid="button-world">
                      <Target className="w-4 h-4 mr-2" />
                      MetaHers World
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Founder Insights (Inner Circle+) */}
            {hasInnerCircleAccess && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.25 }}
              >
                <Card data-testid="card-founder-insights">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary" />
                      Founder Insights
                    </CardTitle>
                    <CardDescription>Exclusive wisdom from our founder</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loadingInsights ? (
                      <div className="text-sm text-foreground">Loading insights...</div>
                    ) : insights && insights.length > 0 ? (
                      <div className="space-y-3">
                        {insights.slice(0, 3).map((insight) => (
                          <div key={insight.id} className="p-3 rounded-lg bg-muted/50 hover-elevate cursor-pointer" data-testid={`insight-${insight.id}`}>
                            <h4 className="font-medium text-sm mb-1">{insight.title}</h4>
                            <p className="text-xs text-foreground line-clamp-2">{insight.content}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className="text-xs">{insight.category}</Badge>
                              <span className="text-xs text-foreground">{insight.viewCount} views</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-foreground text-center py-8">
                        No insights available yet
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Membership Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card data-testid="card-membership-info">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-primary" />
                    Membership
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-1">Current Plan</p>
                    <p className="text-lg font-bold text-purple-600">{plan.displayName}</p>
                  </div>
                  <p className="text-sm text-foreground/70">{plan.description}</p>
                  {tier !== 'founders_circle' && (
                    <Link href="/upgrade">
                      <Button variant="default" className="w-full" data-testid="button-upgrade-membership">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Upgrade Membership
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {showWelcome && (
        <WelcomeModal 
          onComplete={handleCompleteOnboarding}
          userName={user?.firstName || undefined}
        />
      )}
      </div>
    </div>
  );
}
