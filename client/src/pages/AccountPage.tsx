import { motion } from "framer-motion";
import { User, Settings, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStats } from "@/hooks/useStats";
import { useAuth } from "@/hooks/useAuth";

export default function AccountPage() {
  const { data: stats, isLoading } = useStats();
  const { user } = useAuth();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-champagne">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6 shadow-md">
              <User className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-onyx">
                Profile & Settings
              </span>
            </div>

            <h1 className="font-serif text-5xl font-bold text-onyx mb-4" data-testid="text-page-title">
              Your Account
            </h1>
            <p className="text-lg text-foreground/70">
              Manage your profile, preferences, and subscription
            </p>
          </div>

          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-8 shadow-md">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blush to-mint flex items-center justify-center text-3xl shadow-md">
                  👤
                </div>
                <div className="flex-1">
                  <h2 className="font-serif text-2xl font-semibold text-onyx mb-1">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : user?.firstName || 'Welcome Back'}
                  </h2>
                  <p className="text-foreground/70">
                    {user?.email || 'Your MetaHers journey continues'}
                  </p>
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white/40 rounded-xl p-4 animate-pulse">
                      <div className="h-8 bg-muted rounded mb-2" />
                      <div className="h-4 bg-muted rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/40 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-onyx mb-1" data-testid="text-completed-rituals">
                      {stats?.completedRituals || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Rituals Started
                    </div>
                  </div>
                  <div className="bg-white/40 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-onyx mb-1" data-testid="text-journal-entries">
                      {stats?.journalEntries || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Journal Entries
                    </div>
                  </div>
                  <div className="bg-white/40 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-onyx mb-1" data-testid="text-streak-days">
                      {stats?.streak || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Day Streak
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="glass-card rounded-2xl p-8 shadow-md">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="font-serif text-xl font-semibold text-onyx mb-2">
                    Subscription Status
                  </h3>
                  <p className="text-foreground/70">
                    {user?.isPro ? 'Pro Plan - Access to all rituals' : 'Free Plan - Access to 1 ritual'}
                  </p>
                </div>
                <div className={`glass-card px-3 py-1 rounded-full text-sm font-medium ${user?.isPro ? 'bg-gold/20 text-gold' : ''}`}>
                  {user?.isPro ? 'Pro' : 'Free'}
                </div>
              </div>

              {!user?.isPro && (
                <div className="bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/30 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                      <Crown className="w-6 h-6 text-gold" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-serif text-lg font-semibold text-onyx mb-2">
                        Upgrade to Pro
                      </h4>
                      <p className="text-sm text-foreground/70 mb-4">
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

            <div className="glass-card rounded-2xl p-8 shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="w-5 h-5 text-primary" />
                <h3 className="font-serif text-xl font-semibold text-onyx">
                  Settings
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-white/20">
                  <div>
                    <div className="font-medium text-onyx">Email Notifications</div>
                    <div className="text-sm text-muted-foreground">
                      Receive updates about new rituals
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">Coming soon</div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-white/20">
                  <div>
                    <div className="font-medium text-onyx">Privacy Settings</div>
                    <div className="text-sm text-muted-foreground">
                      Manage your data and privacy
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">Coming soon</div>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium text-onyx">Connected Accounts</div>
                    <div className="text-sm text-muted-foreground">
                      Link external services
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">Coming soon</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
