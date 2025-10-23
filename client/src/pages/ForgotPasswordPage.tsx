import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetLink, setResetLink] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Reset Link Generated",
          description: "Check the link below to reset your password.",
        });
        // In development, show the reset link
        if (data.resetLink) {
          setResetLink(data.resetLink);
        }
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to request password reset",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <Card className="w-full max-w-md p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="font-cormorant text-4xl font-bold text-foreground mb-2">
              Reset Password
            </h1>
            <p className="text-muted-foreground">
              Enter your email and we'll generate a password reset link for you.
            </p>
          </div>

          {/* Form */}
          {!resetLink ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                    data-testid="input-email"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                data-testid="button-submit"
              >
                {isLoading ? "Generating Link..." : "Send Reset Link"}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm font-medium text-foreground mb-2">
                  Your Password Reset Link:
                </p>
                <a
                  href={resetLink}
                  className="text-sm text-primary hover:underline break-all"
                  data-testid="link-reset"
                >
                  {resetLink}
                </a>
              </div>
              <p className="text-xs text-muted-foreground">
                Note: In production, this link would be sent to your email. For now, click the link above to reset your password.
              </p>
            </div>
          )}

          {/* Back to Login */}
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => setLocation("/login")}
              className="gap-2"
              data-testid="link-back-to-login"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
