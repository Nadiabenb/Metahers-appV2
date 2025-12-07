import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { Crown, Sparkles, TrendingUp, ArrowRight, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

const DARK_BG = "#0A0614";
const DARK_CARD = "#1A1625";
const LAVENDER = "#C8A2D8";
const PINK = "#E879F9";

export default function TierSelectionPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const tiers = [
    {
      id: "free",
      name: "Vision Discovery",
      price: "Free",
      description: "Your entry into the sanctuary",
      features: [
        "Vision Board ritual (2026)",
        "7 life dimensions",
        "AI-powered insights",
        "Daily reflections",
      ],
      icon: Sparkles,
      cta: "Begin Free",
      highlighted: false,
    },
    {
      id: "core",
      name: "Core Membership",
      price: "$79",
      period: "/month",
      description: "Transform with AI & community",
      features: [
        "Learning Hub (9 Worlds)",
        "54 rituals & experiences",
        "MetaMuse AI companion",
        "Journal with streaks",
        "Monthly community calls",
        "Vision Board + unlimited updates",
      ],
      icon: Crown,
      cta: "Join Membership",
      highlighted: true,
    },
    {
      id: "premium",
      name: "AI Mastery Cohort",
      price: "$699",
      period: "or 3×$233",
      description: "Master AI like a founder",
      features: [
        "12-week intensive program",
        "Weekly live labs",
        "App Atelier sprints",
        "Executive accountability groups",
        "Direct Nadia access",
        "Core Membership included",
      ],
      icon: TrendingUp,
      cta: "Apply to Cohort",
      highlighted: false,
    },
  ];

  const handleSelectTier = async (tierId: string) => {
    if (tierId === "free") {
      // Free tier - just mark onboarding as complete and redirect to dashboard
      setIsLoading(true);
      try {
        await apiRequest("/api/auth/complete-onboarding", {
          method: "POST",
          body: JSON.stringify({ tier: "free" }),
        });
        queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
        navigate("/dashboard");
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to complete onboarding",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } else if (tierId === "core") {
      // Core Membership - navigate to checkout with price ID
      navigate("/checkout/core/price_core_monthly");
    } else if (tierId === "premium") {
      // Premium Cohort - navigate to checkout with price ID
      navigate("/checkout/premium/price_premium_cohort");
    }
  };

  return (
    <>
      <SEO
        title="Choose Your Journey | MetaHers Mind Spa"
        description="Select your learning path: Vision Discovery (free), Core Membership ($79/mo), or AI Mastery Cohort ($699)"
      />
      <div
        className="min-h-screen py-16 px-4 lg:px-16"
        style={{ background: DARK_BG }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <p
              className="text-sm uppercase tracking-[0.3em] mb-6"
              style={{ color: PINK }}
            >
              Your Transformation Awaits
            </p>
            <h1
              className="text-5xl lg:text-6xl mb-6 leading-tight"
              style={{
                fontFamily: "Playfair Display, serif",
                color: "#FFFFFF",
                fontWeight: 300,
              }}
            >
              Choose Your{" "}
              <span className="italic" style={{ color: LAVENDER }}>
                Sanctuary Level
              </span>
            </h1>
            <p
              className="text-lg font-light max-w-2xl mx-auto"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              Start free with Vision Board. Grow with community. Master with
              mentorship.
            </p>
          </motion.div>

          {/* Tier Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {tiers.map((tier, i) => {
              const IconComponent = tier.icon;
              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  whileHover={tier.highlighted ? { y: -8 } : {}}
                >
                  <Card
                    className="relative p-8 border h-full flex flex-col transition-all"
                    style={{
                      borderColor: tier.highlighted
                        ? LAVENDER
                        : "rgba(255,255,255,0.1)",
                      background: tier.highlighted
                        ? `linear-gradient(135deg, ${PINK}10 0%, ${LAVENDER}05 100%)`
                        : "rgba(255,255,255,0.02)",
                      boxShadow: tier.highlighted
                        ? `0 8px 32px ${PINK}20`
                        : "none",
                    }}
                    data-testid={`card-tier-${tier.id}`}
                  >
                    {/* Badge */}
                    {tier.highlighted && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold uppercase tracking-wider"
                        style={{
                          background: PINK,
                          color: "#0A0A0A",
                        }}
                      >
                        Most Popular
                      </motion.div>
                    )}

                    {/* Icon */}
                    <div className="mb-6">
                      <IconComponent
                        className="w-8 h-8"
                        style={{ color: tier.highlighted ? PINK : LAVENDER }}
                      />
                    </div>

                    {/* Title & Description */}
                    <div className="mb-6">
                      <h3
                        className="text-2xl font-semibold mb-2"
                        style={{ color: "#FFFFFF" }}
                      >
                        {tier.name}
                      </h3>
                      <p
                        className="text-sm"
                        style={{ color: "rgba(255,255,255,0.5)" }}
                      >
                        {tier.description}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="mb-8 pb-8 border-b flex-1" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                      <div className="flex items-baseline gap-2">
                        <span
                          className="text-5xl font-light"
                          style={{ color: LAVENDER }}
                        >
                          {tier.price}
                        </span>
                        {tier.period && (
                          <span
                            className="text-sm"
                            style={{ color: "rgba(255,255,255,0.5)" }}
                          >
                            {tier.period}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-8 space-y-3">
                      {tier.features.map((feature, j) => (
                        <motion.div
                          key={j}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.15 + j * 0.08 }}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle
                            className="w-4 h-4 mt-1 flex-shrink-0"
                            style={{ color: PINK }}
                          />
                          <span
                            className="text-sm"
                            style={{ color: "rgba(255,255,255,0.7)" }}
                          >
                            {feature}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <motion.button
                      onClick={() => handleSelectTier(tier.id)}
                      disabled={isLoading && selectedTier === tier.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 text-sm font-semibold uppercase tracking-wider transition-all rounded-md"
                      style={{
                        background: tier.highlighted
                          ? `linear-gradient(135deg, ${PINK} 0%, ${LAVENDER} 100%)`
                          : "rgba(255,255,255,0.1)",
                        color: tier.highlighted ? "#0A0A0A" : "#FFFFFF",
                        cursor:
                          isLoading && selectedTier === tier.id
                            ? "not-allowed"
                            : "pointer",
                        opacity:
                          isLoading && selectedTier === tier.id ? 0.7 : 1,
                      }}
                      data-testid={`button-select-tier-${tier.id}`}
                    >
                      {isLoading && selectedTier === tier.id
                        ? "Processing..."
                        : tier.cta}
                    </motion.button>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Footer Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            <p className="text-sm">
              All plans include access to Vision Board. You can upgrade or
              downgrade anytime.
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
