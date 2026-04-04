
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Lock, ArrowRight, Sparkles, Crown, Ship } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

export function UserJourneyMap() {
  const { user } = useAuth();
  const tier = user?.subscriptionTier || 'free';

  const stages = [
    {
      id: 1,
      title: "Vision Discovery",
      subtitle: "Start Free",
      icon: Sparkles,
      status: user ? 'complete' : 'current',
      actions: [
        { label: "Vision Board", href: "/vision-board", completed: !!user?.onboardingCompleted },
        { label: "Take Quiz", href: "/onboarding/quiz", completed: !!user?.onboardingCompleted },
        { label: "Free Ritual", href: "/rituals", completed: false },
      ],
      color: "from-purple-500 to-pink-500",
    },
    {
      id: 2,
      title: "Core Membership",
      subtitle: "$79/month",
      icon: Crown,
      status: tier !== 'free' ? 'complete' : 'locked',
      actions: [
        { label: "Content Library", href: "/learning-hub", locked: tier === 'free' },
        { label: "MetaMuse AI", href: "/companion", locked: tier === 'free' },
        { label: "AI Journal", href: "/journal", locked: tier === 'free' },
      ],
      color: "from-violet-500 to-purple-500",
    },
    {
      id: 3,
      title: "Premium Experiences",
      subtitle: "Voyages & Cohorts",
      icon: Ship,
      status: 'locked',
      actions: [
        { label: "Newport Voyages", href: "/voyages", locked: false },
        { label: "AI Mastery Cohort", href: "/ai-mastery", locked: false },
        { label: "1:1 Founder Session", href: "/executive", locked: false },
      ],
      color: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Your Journey to Mastery</h2>
        <p className="text-muted-foreground">Follow this path to unlock your full potential</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isComplete = stage.status === 'complete';
          const isCurrent = stage.status === 'current';
          const isLocked = stage.status === 'locked';

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className={`p-6 relative ${isCurrent ? 'ring-2 ring-purple-500' : ''}`}>
                {/* Status Badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  {isComplete && (
                    <Badge className="bg-green-500 text-white">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Complete
                    </Badge>
                  )}
                  {isCurrent && (
                    <Badge className="bg-purple-500 text-white">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Current
                    </Badge>
                  )}
                  {isLocked && (
                    <Badge variant="secondary">
                      <Lock className="w-3 h-3 mr-1" />
                      Locked
                    </Badge>
                  )}
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${stage.color} flex items-center justify-center`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-center mb-1">{stage.title}</h3>
                <p className="text-sm text-muted-foreground text-center mb-6">{stage.subtitle}</p>

                {/* Actions */}
                <div className="space-y-2">
                  {stage.actions.map((action, i) => (
                    <Link key={i} href={action.locked ? '#' : action.href}>
                      <button
                        disabled={action.locked}
                        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center gap-2">
                          {action.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : action.locked ? (
                            <Lock className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                          )}
                          <span className="text-sm font-medium">{action.label}</span>
                        </div>
                        {!action.locked && <ArrowRight className="w-4 h-4" />}
                      </button>
                    </Link>
                  ))}
                </div>

                {/* Upgrade CTA for locked stages */}
                {isLocked && stage.id === 2 && (
                  <Link href="/upgrade">
                    <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                      Upgrade Now
                    </button>
                  </Link>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
