import { useState } from "react";
import { motion } from "framer-motion";
import { User, Settings, Crown, Sparkles, Volume2, VolumeX, Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SEO } from "@/components/SEO";
import { useStats } from "@/hooks/useStats";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ProgressChart } from "@/components/stats/ProgressChart";
import { MoodChart } from "@/components/stats/MoodChart";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { useNotifications } from "@/hooks/useNotifications";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function AccountPage() {
  const { data: stats, isLoading } = useStats();
  const { user } = useAuth();
  const { toast } = useToast();
  const [betaCode, setBetaCode] = useState("");
  const { soundsEnabled, toggleSounds, playSound } = useSoundEffects();
  const { notificationsEnabled, permission, toggleNotifications, isSupported } = useNotifications();

  const { data: journalStats } = useQuery<{ moodDistribution: Record<string, number> }>({
    queryKey: ['/api/journal/stats'],
    enabled: !!user,
  });

  const { data: progressData } = useQuery<Array<{ date: string; count: number }>>({
    queryKey: ['/api/analytics/progress'],
    enabled: !!user,
  });

  const activateBetaCodeMutation = useMutation({
    mutationFn: (code: string) =>
      apiRequest('POST', '/api/auth/activate-beta-code', { code }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      toast({
        title: "Pro Access Activated",
        description: "Welcome to MetaHers Pro. All features unlocked!",
      });
      setBetaCode("");
    },
    onError: (error: any) => {
      toast({
        title: "Activation Failed",
        description: error.message || "Invalid beta code. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleActivateBetaCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (betaCode.trim()) {
      activateBetaCodeMutation.mutate(betaCode);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <SEO
        title="My Account & Subscription"
        description="Manage your MetaHers Mind Spa account, subscription, and preferences. Upgrade to Pro for full access to all rituals and features."
        keywords="account settings, subscription management, upgrade to pro"
      />
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 glass-card px-6 py-3 rounded-full mb-6 neon-glow-violet">
              <User className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium tracking-wide uppercase">
                Profile & Settings
              </span>
            </div>

            <h1 className="font-serif text-5xl font-bold text-gradient-violet mb-4" data-testid="text-page-title">
              Your Account
            </h1>
            <p className="text-lg text-foreground/80">
              Manage your profile, preferences, and subscription
            </p>
          </div>

          <div className="space-y-6">
            <div className="editorial-card p-8 relative overflow-hidden">
              <div className="absolute inset-0 gradient-violet-magenta opacity-5" />
              <div className="relative z-10">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[hsl(var(--hyper-violet))] to-[hsl(var(--aurora-teal))] flex items-center justify-center text-3xl shadow-lg">
                    👤
                  </div>
                  <div className="flex-1">
                    <h2 className="font-serif text-2xl font-semibold text-foreground mb-1">
                      {user?.firstName && user?.lastName 
                        ? `${user.firstName} ${user.lastName}` 
                        : user?.firstName || 'Welcome Back'}
                    </h2>
                    <p className="text-foreground/80">
                      {user?.email || 'Your MetaHers journey continues'}
                    </p>
                  </div>
                </div>

                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-card/40 rounded-xl p-4 animate-pulse">
                        <div className="h-8 bg-muted rounded mb-2" />
                        <div className="h-4 bg-muted rounded" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-card/40 backdrop-blur-sm rounded-xl p-4 text-center border border-border">
                      <div className="text-3xl font-bold text-foreground mb-1" data-testid="text-completed-rituals">
                        {stats?.completedRituals || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Rituals Started
                      </div>
                    </div>
                    <div className="bg-card/40 backdrop-blur-sm rounded-xl p-4 text-center border border-border">
                      <div className="text-3xl font-bold text-foreground mb-1" data-testid="text-journal-entries">
                        {stats?.journalEntries || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Journal Entries
                      </div>
                    </div>
                    <div className="bg-card/40 backdrop-blur-sm rounded-xl p-4 text-center border border-border">
                      <div className="text-3xl font-bold text-foreground mb-1" data-testid="text-streak-days">
                        {stats?.streak || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Day Streak
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Analytics Charts */}
            {progressData && progressData.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                <ProgressChart
                  data={progressData}
                  title="Journal Activity (Last 14 Days)"
                  color="hsl(var(--hyper-violet))"
                />
                {journalStats?.moodDistribution && Object.keys(journalStats.moodDistribution).length > 0 && (
                  <MoodChart
                    data={Object.entries(journalStats.moodDistribution).map(([mood, count]) => ({
                      mood: mood.charAt(0).toUpperCase() + mood.slice(1),
                      count
                    }))}
                  />
                )}
              </div>
            )}

            <div className="editorial-card p-8 relative overflow-hidden">
              <div className="absolute inset-0 gradient-teal-gold opacity-5" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                      App Settings
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Customize your MetaHers experience
                    </p>
                  </div>
                  <Settings className="w-5 h-5 text-muted-foreground" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50">
                    <div className="flex items-center gap-3">
                      {soundsEnabled ? (
                        <Volume2 className="w-5 h-5 text-primary" />
                      ) : (
                        <VolumeX className="w-5 h-5 text-muted-foreground" />
                      )}
                      <div>
                        <Label htmlFor="sound-toggle" className="text-sm font-medium text-foreground cursor-pointer">
                          Sound Effects
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Subtle audio feedback for interactions
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="sound-toggle"
                      checked={soundsEnabled}
                      onCheckedChange={() => {
                        toggleSounds();
                        playSound('click');
                      }}
                      data-testid="switch-sound-effects"
                    />
                  </div>

                  {isSupported && (
                    <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50">
                      <div className="flex items-center gap-3">
                        {notificationsEnabled ? (
                          <Bell className="w-5 h-5 text-primary" />
                        ) : (
                          <BellOff className="w-5 h-5 text-muted-foreground" />
                        )}
                        <div>
                          <Label htmlFor="notification-toggle" className="text-sm font-medium text-foreground cursor-pointer">
                            Push Notifications
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {permission === 'denied' 
                              ? 'Notifications blocked - enable in browser settings'
                              : 'Get notified about achievements and milestones'}
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="notification-toggle"
                        checked={notificationsEnabled}
                        disabled={permission === 'denied'}
                        onCheckedChange={() => {
                          playSound('click');
                          toggleNotifications();
                        }}
                        data-testid="switch-notifications"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="editorial-card p-8 relative overflow-hidden">
              <div className="absolute inset-0 gradient-teal-gold opacity-5" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                      Subscription Status
                    </h3>
                    <p className="text-foreground/80">
                      {user?.isPro ? 'Pro Plan - Access to all rituals' : 'Free Plan - Access to 1 ritual'}
                    </p>
                  </div>
                  <div className={`backdrop-blur-md px-3 py-1 rounded-full text-sm font-medium border ${user?.isPro ? 'bg-[hsl(var(--liquid-gold))]/20 text-[hsl(var(--liquid-gold))] border-[hsl(var(--liquid-gold))]/30' : 'bg-card/50 text-foreground border-border'}`}>
                    {user?.isPro ? 'Pro' : 'Free'}
                  </div>
                </div>

                {!user?.isPro && (
                  <div className="bg-gradient-to-br from-[hsl(var(--liquid-gold))]/10 to-[hsl(var(--cyber-fuchsia))]/5 border border-[hsl(var(--liquid-gold))]/30 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-[hsl(var(--liquid-gold))]/20 flex items-center justify-center flex-shrink-0">
                        <Crown className="w-6 h-6 text-[hsl(var(--liquid-gold))]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-serif text-lg font-semibold text-foreground mb-2">
                          Upgrade to Pro
                        </h4>
                        <p className="text-sm text-foreground/80 mb-4">
                          Unlock all 5 rituals, exclusive content, and MetaMuse AI Squad access. 
                          Available with any Ritual Bag purchase.
                        </p>
                        <div className="flex gap-3">
                          <Button
                            onClick={() => window.open("https://buy.stripe.com/aFa28s2mvbYo4N44qA3Nm08", "_blank")}
                            className="gap-2"
                            data-testid="button-upgrade"
                          >
                            <Crown className="w-4 h-4" />
                            Subscribe Now - $19.99/mo
                          </Button>
                          <Button
                            onClick={() => window.location.href = "/shop"}
                            variant="outline"
                            className="gap-2"
                            data-testid="button-view-shop"
                          >
                            View Shop
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="editorial-card p-8 relative overflow-hidden">
              <div className="absolute inset-0 gradient-magenta-fuchsia opacity-5" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <Settings className="w-5 h-5 text-primary" />
                  <h3 className="font-serif text-xl font-semibold text-foreground">
                    Settings
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <div className="font-medium text-foreground">Email Notifications</div>
                      <div className="text-sm text-muted-foreground">
                        Receive updates about new rituals
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">Coming soon</div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <div className="font-medium text-foreground">Privacy Settings</div>
                      <div className="text-sm text-muted-foreground">
                        Manage your data and privacy
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">Coming soon</div>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <div className="font-medium text-foreground">Connected Accounts</div>
                      <div className="text-sm text-muted-foreground">
                        Link external services
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">Coming soon</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
