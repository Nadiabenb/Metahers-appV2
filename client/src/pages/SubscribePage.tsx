import { useEffect, useState } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { motion } from "framer-motion";
import { Crown, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/account?subscription=success`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full gap-2"
        size="lg"
        data-testid="button-complete-payment"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Crown className="w-5 h-5" />
            Subscribe to Pro - $19.99/month
          </>
        )}
      </Button>
      <p className="text-xs text-muted-foreground text-center">
        Your subscription will renew automatically each month. You can cancel anytime.
      </p>
    </form>
  );
}

export default function SubscribePage() {
  const [clientSecret, setClientSecret] = useState("");
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    apiRequest("POST", "/api/create-subscription", {})
      .then((res) => res.json())
      .then((data) => {
        if (data.alreadySubscribed) {
          // User already has active subscription, redirect to account
          setIsLoading(false);
          toast({
            title: "Already Subscribed",
            description: "You already have an active Pro subscription!",
          });
          setTimeout(() => {
            setLocation("/account");
          }, 1500);
        } else if (data.clientSecret) {
          setClientSecret(data.clientSecret);
          setIsLoading(false);
        } else {
          toast({
            title: "Error",
            description: "Failed to initialize payment. Please try again.",
            variant: "destructive",
          });
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error("Failed to create subscription:", error);
        toast({
          title: "Error",
          description: "Failed to initialize payment. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      });
  }, [toast, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-champagne">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-foreground/70">Setting up your subscription...</p>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-champagne">
        <div className="text-center">
          <p className="text-foreground/70 mb-4">Unable to load payment form.</p>
          <Button onClick={() => setLocation("/account")} data-testid="button-back-account">
            Back to Account
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-champagne">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Button
            variant="ghost"
            onClick={() => setLocation("/account")}
            className="mb-8 gap-2"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Account
          </Button>

          <div className="glass-card rounded-2xl p-8 shadow-md mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                <Crown className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h1 className="font-serif text-3xl font-bold text-onyx" data-testid="text-page-title">
                  Upgrade to Pro
                </h1>
                <p className="text-foreground/70">
                  Unlock all rituals and premium features
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/30 rounded-xl p-6 mb-6">
              <h3 className="font-serif text-xl font-semibold text-onyx mb-4">
                What's included with Pro:
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-mint flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-onyx" />
                  </div>
                  <div>
                    <div className="font-medium text-onyx">All 5 Guided Rituals</div>
                    <div className="text-sm text-foreground/70">
                      Full access to AI Prompting, Blockchain, Crypto, NFTs, and Metaverse rituals
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-mint flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-onyx" />
                  </div>
                  <div>
                    <div className="font-medium text-onyx">MetaMuse AI Squad</div>
                    <div className="text-sm text-foreground/70">
                      Personalized AI guidance powered by ChatGPT
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-mint flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-onyx" />
                  </div>
                  <div>
                    <div className="font-medium text-onyx">Priority Support</div>
                    <div className="text-sm text-foreground/70">
                      Get help when you need it with dedicated support
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-mint flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-onyx" />
                  </div>
                  <div>
                    <div className="font-medium text-onyx">Future Updates</div>
                    <div className="text-sm text-foreground/70">
                      Early access to new rituals and features
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-8 shadow-md">
            <h2 className="font-serif text-2xl font-semibold text-onyx mb-6">
              Payment Details
            </h2>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm />
            </Elements>
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Payments are processed securely by Stripe. Your card information is never stored on our servers.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
