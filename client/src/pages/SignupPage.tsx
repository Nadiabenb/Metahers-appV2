import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { trackSignup } from "@/lib/analytics";
import { SEO } from "@/components/SEO";

const GOLD = "#C9A96E";
const NAVY = "#1A1A2E";
const BLUSH = "#FDF6F0";
const MUTED = "#8a7560";

const TRUST_POINTS = [
  "One AI agent matched to your goal — free",
  "Curated AI toolkit, no overwhelm",
  "Personalised learning path in 2 minutes",
];

export default function SignupPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [quizRitual, setQuizRitual] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    const quizEmail = localStorage.getItem("quiz_email");
    const quizName = localStorage.getItem("quiz_name");
    const matchedRitual = localStorage.getItem("quiz_matched_ritual");
    if (quizEmail) setFormData((p) => ({ ...p, email: quizEmail }));
    if (quizName) {
      const parts = quizName.split(" ");
      setFormData((p) => ({
        ...p,
        firstName: parts[0] || "",
        lastName: parts.slice(1).join(" ") || "",
      }));
    }
    if (matchedRitual) setQuizRitual(matchedRitual);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/auth/signup", {
        ...formData,
        quizUnlockedRitual: quizRitual || undefined,
      });

      let source = "direct";
      let tier = "free";
      if (localStorage.getItem("vip_cohort_interest") === "true") { source = "vip_cohort"; tier = "vip_cohort"; }
      else if (localStorage.getItem("executive_interest") === "true") { source = "executive"; tier = "executive"; }
      else if (quizRitual) { source = "quiz"; }

      trackSignup(source, tier);

      ["vip_cohort_interest", "executive_interest", "ai_builder_interest", "ai_builder_tier",
       "quiz_email", "quiz_name", "quiz_matched_ritual"].forEach((k) => localStorage.removeItem(k));

      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      const postSignupUpgradeTier = localStorage.getItem("post_signup_upgrade_tier");
      if (postSignupUpgradeTier) {
        localStorage.removeItem("post_signup_upgrade_tier");
        setLocation("/upgrade");
        return;
      }
      sessionStorage.setItem("metahers_signup_welcome", "true");
      setLocation("/dashboard");
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: BLUSH }}>
      <SEO
        title="Join MetaHers — Start Free"
        description="Create your free MetaHers account. Get matched with an AI agent, access the curated AI toolkit, and start your personalised learning path — no experience needed."
        keywords="join metahers, free AI community for women, AI tools for entrepreneurs, AI learning for women, solopreneur AI"
        type="website"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Join MetaHers",
          description: "Create a free account to join the MetaHers AI community for ambitious women.",
          potentialAction: { "@type": "RegisterAction", target: "https://app.metahers.ai/signup" },
        }}
      />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg"
        >
          {/* Wordmark */}
          <div className="text-center mb-8">
            <button
              onClick={() => setLocation("/")}
              className="text-2xl font-semibold tracking-tight mb-3 block mx-auto"
              style={{ fontFamily: "Georgia, 'Playfair Display', serif", color: NAVY }}
            >
              MetaHers
            </button>
            <h1
              className="text-3xl font-light mb-2"
              style={{ fontFamily: "Georgia, 'Playfair Display', serif", color: NAVY }}
            >
              {quizRitual ? "You're almost in." : "Join free. Start today."}
            </h1>
            <p className="text-sm" style={{ color: MUTED }}>
              {quizRitual
                ? "Create your account to unlock your matched experience."
                : "No credit card required."}
            </p>
          </div>

          {/* Quiz match banner */}
          {quizRitual && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 flex items-start gap-3 p-4 rounded-sm"
              style={{ background: `${GOLD}18`, border: `1px solid ${GOLD}40` }}
            >
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: GOLD }} />
              <p className="text-sm" style={{ color: NAVY }}>
                Your AI match is ready — create your account to unlock it.
              </p>
            </motion.div>
          )}

          {/* Card */}
          <div
            className="rounded-sm p-8"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E5D9CE",
              boxShadow: "0 2px 16px rgba(201,169,110,0.08)",
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                {(["firstName", "lastName"] as const).map((field) => (
                  <div key={field} className="space-y-1.5">
                    <label
                      htmlFor={field}
                      className="text-xs font-semibold uppercase tracking-widest"
                      style={{ color: MUTED }}
                    >
                      {field === "firstName" ? "First Name" : "Last Name"}
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
                        style={{ color: "#C4B49A" }}
                      />
                      <input
                        id={field}
                        type="text"
                        placeholder={field === "firstName" ? "Jane" : "Doe"}
                        value={formData[field]}
                        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                        autoComplete={field === "firstName" ? "given-name" : "family-name"}
                        className="w-full pl-9 pr-3 py-2.5 text-sm rounded-sm outline-none transition-all"
                        style={{
                          background: BLUSH,
                          border: "1px solid #E5D9CE",
                          color: NAVY,
                          fontFamily: "inherit",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = GOLD)}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#E5D9CE")}
                        data-testid={`input-${field === "firstName" ? "first" : "last"}-name`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: MUTED }}
                >
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: "#C4B49A" }}
                  />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-sm outline-none transition-all"
                    style={{
                      background: BLUSH,
                      border: "1px solid #E5D9CE",
                      color: NAVY,
                      fontFamily: "inherit",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = GOLD)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#E5D9CE")}
                    data-testid="input-email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: MUTED }}
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: "#C4B49A" }}
                  />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="8+ characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="w-full pl-10 pr-11 py-3 text-sm rounded-sm outline-none transition-all"
                    style={{
                      background: BLUSH,
                      border: "1px solid #E5D9CE",
                      color: NAVY,
                      fontFamily: "inherit",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = GOLD)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#E5D9CE")}
                    data-testid="input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: "#C4B49A" }}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs" style={{ color: "#B8A898" }}>
                  Must be at least 8 characters
                </p>
              </div>

              {/* Submit */}
              <p className="rounded-sm px-3 py-2 text-center text-xs font-medium" style={{ color: NAVY, background: `${GOLD}18`, border: `1px solid ${GOLD}30` }}>
                Get your free AI Starter Kit instantly after signup.
              </p>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-sm font-semibold uppercase tracking-widest text-xs mt-1 flex items-center justify-center gap-2 transition-opacity"
                style={{
                  background: GOLD,
                  color: NAVY,
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
                data-testid="button-signup"
              >
                {isLoading ? (
                  "Creating your account..."
                ) : (
                  <>
                    Create Free Account
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <p className="text-xs text-center pt-1" style={{ color: "#B8A898" }}>
                By joining, you agree to our{" "}
                <a href="/terms" style={{ color: MUTED }}>Terms</a>{" "}
                and{" "}
                <a href="/privacy" style={{ color: MUTED }}>Privacy Policy</a>.
              </p>
            </form>
          </div>

          {/* What you get — only show if not coming from quiz */}
          {!quizRitual && (
            <div className="mt-6 space-y-2.5">
              {TRUST_POINTS.map((point) => (
                <div key={point} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: `${GOLD}20` }}
                  >
                    <span style={{ color: GOLD, fontSize: "10px" }}>✦</span>
                  </div>
                  <p className="text-sm" style={{ color: MUTED }}>{point}</p>
                </div>
              ))}
            </div>
          )}

          {/* Footer link */}
          <p className="text-center text-sm mt-6" style={{ color: MUTED }}>
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium"
              style={{ color: NAVY }}
              data-testid="link-login"
            >
              Sign in →
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
