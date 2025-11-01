import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Calendar, Users, Sparkles, ArrowRight, Clock, Video, FileText } from "lucide-react";
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

export default function MemberWorkspacePage() {
  const { user } = useAuth();
  const tier = (user?.subscriptionTier || 'free') as SubscriptionTier;
  const plan = getPricingPlan(tier);
  
  const hasSanctuaryAccess = isSanctuaryTier(tier);
  const hasInnerCircleAccess = isInnerCircleTier(tier);
  const hasFoundersCircleAccess = isFoundersCircleTier(tier);

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

  const tierBadgeColors = {
    free: 'bg-muted text-muted-foreground',
    pro_monthly: 'bg-gradient-to-r from-[hsl(var(--hyper-violet))] to-[hsl(var(--magenta-quartz))] text-white',
    pro_annual: 'bg-gradient-to-r from-[hsl(var(--hyper-violet))] to-[hsl(var(--magenta-quartz))] text-white',
    sanctuary: 'bg-gradient-to-r from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--aurora-teal))] text-white',
    inner_circle: 'bg-gradient-to-r from-[hsl(var(--aurora-teal))] to-[hsl(var(--liquid-gold))] text-white',
    founders_circle: 'bg-gradient-to-r from-[hsl(var(--liquid-gold))] via-[hsl(var(--magenta-quartz))] to-[hsl(var(--hyper-violet))] text-white',
    vip_cohort: 'bg-gradient-to-r from-[hsl(var(--hyper-violet))] to-[hsl(var(--magenta-quartz))] text-white',
    executive: 'bg-gradient-to-r from-[hsl(var(--liquid-gold))] to-[hsl(var(--cyber-fuchsia))] text-white',
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <SEO
        title="Member Workspace - MetaHers Mind Spa"
        description="Access your exclusive member benefits, upcoming sessions, and personalized content. Your luxury learning sanctuary awaits."
        keywords="member dashboard, luxury learning, exclusive access"
      />
      
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header with Tier Badge */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 glass-card px-6 py-3 rounded-full mb-6">
              <Crown className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium tracking-wide uppercase">
                Member Workspace
              </span>
            </div>

            <h1 className="font-serif text-5xl font-bold text-gradient-violet mb-4" data-testid="text-page-title">
              Welcome Back, {user?.firstName || 'Member'}
            </h1>
            
            <div className="flex items-center justify-center gap-3 mb-6">
              <Badge className={`${tierBadgeColors[tier]} px-4 py-2 text-sm font-medium`} data-testid="badge-current-tier">
                {plan.badge && <Sparkles className="w-4 h-4 mr-2" />}
                {plan.displayName}
              </Badge>
              {tier !== 'founders_circle' && (
                <Link href="/upgrade">
                  <Button variant="ghost" size="sm" data-testid="button-upgrade">
                    Upgrade
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              )}
            </div>

            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              {plan.description}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upcoming Group Sessions - Sanctuary+ */}
              {hasSanctuaryAccess && (
                <Card className="editorial-card" data-testid="card-upcoming-sessions">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-primary" />
                          Upcoming Group Sessions
                        </CardTitle>
                        <CardDescription>
                          Your monthly ritual gatherings with fellow members
                        </CardDescription>
                      </div>
                      <Link href="/sessions">
                        <Button variant="ghost" size="sm" data-testid="button-view-all-sessions">
                          View All
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loadingSessions ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="bg-card/40 rounded-xl p-4 animate-pulse">
                            <div className="h-5 bg-muted rounded mb-2" />
                            <div className="h-4 bg-muted rounded" />
                          </div>
                        ))}
                      </div>
                    ) : upcomingSessions && upcomingSessions.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingSessions.slice(0, 3).map((session) => (
                          <div key={session.id} className="bg-card/40 backdrop-blur-sm rounded-xl p-4 border border-border hover-elevate" data-testid={`session-${session.id}`}>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h4 className="font-semibold text-foreground mb-1">
                                  {session.title}
                                </h4>
                                <p className="text-sm text-muted-foreground mb-3">
                                  {session.description}
                                </p>
                                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {format(parseISO(session.scheduledDate), 'MMM d, yyyy')}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {format(parseISO(session.scheduledDate), 'h:mm a')}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    {session.currentAttendees}/{session.maxCapacity} spots
                                  </span>
                                </div>
                              </div>
                              {session.zoomLink && (
                                <Button size="sm" variant="default" asChild data-testid={`button-join-${session.id}`}>
                                  <a href={session.zoomLink} target="_blank" rel="noopener noreferrer">
                                    <Video className="w-4 h-4 mr-2" />
                                    Join
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground mb-2">No upcoming sessions scheduled</p>
                        <p className="text-sm text-muted-foreground">
                          New sessions are added monthly. Check back soon!
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Upcoming 1:1 Bookings - Inner Circle+ */}
              {hasInnerCircleAccess && (
                <Card className="editorial-card" data-testid="card-upcoming-bookings">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-primary" />
                          Your 1:1 Sessions
                        </CardTitle>
                        <CardDescription>
                          Private sessions with the founder
                        </CardDescription>
                      </div>
                      <Link href="/bookings">
                        <Button variant="ghost" size="sm" data-testid="button-view-all-bookings">
                          View All
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loadingBookings ? (
                      <div className="space-y-4">
                        {[1, 2].map((i) => (
                          <div key={i} className="bg-card/40 rounded-xl p-4 animate-pulse">
                            <div className="h-5 bg-muted rounded mb-2" />
                            <div className="h-4 bg-muted rounded" />
                          </div>
                        ))}
                      </div>
                    ) : upcomingBookings && upcomingBookings.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingBookings.map((booking) => (
                          <div key={booking.id} className="bg-card/40 backdrop-blur-sm rounded-xl p-4 border border-border hover-elevate" data-testid={`booking-${booking.id}`}>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h4 className="font-semibold text-foreground mb-1 capitalize">
                                  {booking.bookingType.replace('_', ' ')} Session
                                </h4>
                                {booking.notes && (
                                  <p className="text-sm text-muted-foreground mb-3">
                                    {booking.notes}
                                  </p>
                                )}
                                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {format(parseISO(booking.scheduledDate), 'MMM d, yyyy')}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {format(parseISO(booking.scheduledDate), 'h:mm a')} ({booking.duration} min)
                                  </span>
                                  <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                                    {booking.status}
                                  </Badge>
                                </div>
                              </div>
                              {booking.meetingLink && booking.status === 'confirmed' && (
                                <Button size="sm" variant="default" asChild data-testid={`button-join-booking-${booking.id}`}>
                                  <a href={booking.meetingLink} target="_blank" rel="noopener noreferrer">
                                    <Video className="w-4 h-4 mr-2" />
                                    Join
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground mb-4">No upcoming 1:1 sessions booked</p>
                        <Button variant="default" asChild data-testid="button-book-session">
                          <Link href="/bookings/new">
                            Book Your First Session
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Upgrade Prompts for Lower Tiers */}
              {!hasSanctuaryAccess && (
                <Card className="editorial-card border-2 border-primary/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Unlock Group Sessions
                    </CardTitle>
                    <CardDescription>
                      Join our monthly ritual gatherings and connect with fellow members
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6">
                      Upgrade to The Sanctuary to access 90-minute monthly group sessions, exclusive content, and priority support.
                    </p>
                    <Button variant="default" asChild data-testid="button-upgrade-sanctuary">
                      <Link href="/account">
                        Upgrade to Sanctuary
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {!hasInnerCircleAccess && hasSanctuaryAccess && (
                <Card className="editorial-card border-2 border-primary/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-primary" />
                      Unlock 1:1 Access
                    </CardTitle>
                    <CardDescription>
                      Get personal guidance and direct access to the founder
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6">
                      Upgrade to The Inner Circle for quarterly 1:1 check-ins, founder insights, and intimate bi-weekly sessions.
                    </p>
                    <Button variant="default" asChild data-testid="button-upgrade-inner-circle">
                      <Link href="/account">
                        Join Inner Circle
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Your Tier Benefits */}
              <Card className="editorial-card">
                <CardHeader>
                  <CardTitle className="text-lg">Your Tier Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Founder Insights - Inner Circle+ */}
              {hasInnerCircleAccess && (
                <Card className="editorial-card" data-testid="card-founder-insights">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Founder Insights
                      </CardTitle>
                      <Link href="/insights">
                        <Button variant="ghost" size="sm" data-testid="button-view-all-insights">
                          All
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loadingInsights ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="bg-card/40 rounded-lg p-3 animate-pulse">
                            <div className="h-4 bg-muted rounded mb-2" />
                            <div className="h-3 bg-muted rounded" />
                          </div>
                        ))}
                      </div>
                    ) : insights && insights.length > 0 ? (
                      <div className="space-y-3">
                        {insights.slice(0, 5).map((insight) => (
                          <Link key={insight.id} href={`/insights/${insight.id}`}>
                            <div className="bg-card/40 backdrop-blur-sm rounded-lg p-3 border border-border hover-elevate cursor-pointer" data-testid={`insight-${insight.id}`}>
                              <h5 className="font-medium text-sm text-foreground mb-1 line-clamp-2">
                                {insight.title}
                              </h5>
                              <div className="flex items-center justify-between">
                                <Badge variant="secondary" className="text-xs">
                                  {insight.category}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {format(parseISO(insight.publishedAt), 'MMM d')}
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                        <p className="text-sm text-muted-foreground">
                          No insights published yet
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Quick Links */}
              <Card className="editorial-card">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Link href="/rituals">
                      <Button variant="ghost" className="w-full justify-start" data-testid="button-quick-link-rituals">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Explore Rituals
                      </Button>
                    </Link>
                    <Link href="/journal">
                      <Button variant="ghost" className="w-full justify-start" data-testid="button-quick-link-journal">
                        <FileText className="w-4 h-4 mr-2" />
                        Journal
                      </Button>
                    </Link>
                    {user?.isPro && (
                      <Link href="/thought-leadership">
                        <Button variant="ghost" className="w-full justify-start" data-testid="button-quick-link-thought-leadership">
                          <Crown className="w-4 h-4 mr-2" />
                          Thought Leadership
                        </Button>
                      </Link>
                    )}
                    <Link href="/account">
                      <Button variant="ghost" className="w-full justify-start" data-testid="button-quick-link-account">
                        <Users className="w-4 h-4 mr-2" />
                        Account Settings
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
