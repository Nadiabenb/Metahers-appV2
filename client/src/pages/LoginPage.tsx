import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { SEO } from "@/components/SEO";

const GOLD = "#C9A96E";
const NAVY = "#1A1A2E";
const BLUSH = "#FDF6F0";
const MUTED = "#8a7560";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/auth/login", formData);
      await queryClient.refetchQueries({ queryKey: ["/api/auth/user"] });
      setLocation("/dashboard");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: BLUSH }}
    >
      <SEO
        title="Log In — MetaHers"
        description="Sign in to your MetaHers account to access your AI agents, learning curriculum, and AI toolkit."
        keywords="login, sign in, metahers member access, AI community for women"
        type="website"
      />

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Wordmark */}
          <div className="text-center mb-10">
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
              Welcome back.
            </h1>
            <p className="text-sm" style={{ color: MUTED }}>
              Sign in to your account
            </p>
          </div>

          {/* Card */}
          <div
            className="rounded-sm p-8"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E5D9CE",
              boxShadow: "0 2px 16px rgba(201,169,110,0.08)",
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
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
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: MUTED }}
                  >
                    Password
                  </label>
                  <a
                    href="/forgot-password"
                    className="text-xs transition-colors"
                    style={{ color: GOLD }}
                    data-testid="link-forgot-password"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: "#C4B49A" }}
                  />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    autoComplete="current-password"
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
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "#C4B49A" }}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-sm font-semibold uppercase tracking-widest text-xs mt-2 flex items-center justify-center gap-2 transition-opacity"
                style={{
                  background: GOLD,
                  color: NAVY,
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
                data-testid="button-login"
              >
                {isLoading ? (
                  "Signing in..."
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer link */}
          <p className="text-center text-sm mt-6" style={{ color: MUTED }}>
            Don't have an account?{" "}
            <a
              href="/signup"
              className="font-medium transition-colors"
              style={{ color: NAVY }}
              data-testid="link-signup"
            >
              Join free →
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
