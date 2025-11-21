import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { useLocation } from "wouter";
import { ArrowRight, CheckCircle, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface CheckoutPageProps {
  tierName: string;
  price: number;
  priceId: string;
}

export default function CheckoutPage(props: CheckoutPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-[hsl(var(--hyper-violet))]/5 to-white flex items-center justify-center px-4 py-16">
        <Card className="max-w-md p-8 text-center bg-gradient-to-br from-white to-[hsl(var(--hyper-violet))]/5 border border-[hsl(var(--hyper-violet))]/20">
          <Lock className="w-12 h-12 text-[hsl(var(--hyper-violet))]/50 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Sign in required</h2>
          <p className="text-foreground/70 mb-6">Please sign in to complete your purchase</p>
          <Button onClick={() => setLocation("/login")} className="w-full">
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: props.priceId }),
      });

      if (!response.ok) throw new Error("Checkout failed");
      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process checkout. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title={`Checkout - ${props.tierName} | MetaHers`}
        description={`Complete your ${props.tierName} subscription purchase to unlock premium features`}
      />
      <div className="min-h-screen bg-gradient-to-b from-white via-[hsl(var(--hyper-violet))]/5 to-white py-16 px-4 flex items-center justify-center">
        <Card className="max-w-md w-full p-8 bg-gradient-to-br from-white to-[hsl(var(--hyper-violet))]/5 border border-[hsl(var(--hyper-violet))]/20">
          <h1 className="text-3xl font-bold text-foreground mb-2">{props.tierName}</h1>
          <p className="text-foreground/70 mb-8">Complete your subscription</p>

          <div className="space-y-4 mb-8 p-6 bg-white/50 rounded-lg border border-[hsl(var(--hyper-violet))]/10">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Monthly price</span>
              <span className="text-2xl bg-gradient-to-r from-[hsl(var(--hyper-violet))] to-[hsl(var(--cyber-fuchsia))] bg-clip-text text-transparent">
                ${props.price}/mo
              </span>
            </div>
            <div className="pt-4 border-t border-[hsl(var(--hyper-violet))]/10 space-y-2 text-sm text-foreground/70">
              <div className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-[hsl(var(--hyper-violet))]" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-[hsl(var(--hyper-violet))]" />
                <span>Secure payment processing</span>
              </div>
            </div>
          </div>

          <Button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full gap-2 bg-gradient-to-r from-[hsl(var(--hyper-violet))] to-[hsl(var(--cyber-fuchsia))] text-white mb-4"
            size="lg"
          >
            {isLoading ? "Processing..." : "Continue to Payment"}
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </Button>

          <Button
            onClick={() => setLocation("/waitlist")}
            variant="outline"
            className="w-full"
          >
            Go Back
          </Button>
        </Card>
      </div>
    </>
  );
}
