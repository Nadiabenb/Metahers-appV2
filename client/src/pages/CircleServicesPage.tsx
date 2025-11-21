import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { ArrowLeft, Plus, Star, DollarSign, Briefcase, Lock } from "lucide-react";
import type { CircleService } from "@shared/schema";
import { motion } from "framer-motion";

export default function CircleServicesPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [showForm, setShowForm] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-[hsl(var(--cyber-fuchsia))]/5 to-white flex items-center justify-center px-4 py-16">
        <Card className="max-w-md p-8 text-center bg-gradient-to-br from-white to-[hsl(var(--cyber-fuchsia))]/5 border border-[hsl(var(--cyber-fuchsia))]/20">
          <Lock className="w-12 h-12 text-[hsl(var(--cyber-fuchsia))]/50 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Sign in required</h2>
          <p className="text-foreground/70 mb-6">You must be logged in to view and list services</p>
          <Button onClick={() => setLocation("/login")} className="w-full">
            Sign In
          </Button>
        </Card>
      </div>
    );
  }
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "consulting",
    pricing: "",
    deliveryTime: "",
  });

  const { data: services = [] } = useQuery<CircleService[]>({
    queryKey: ["/api/circle/services"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/circle/service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create service");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/circle/services"] });
      toast({
        title: "Service Listed!",
        description: "Your service is now visible to the Circle community",
      });
      setFormData({ title: "", description: "", category: "consulting", pricing: "", deliveryTime: "" });
      setShowForm(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to list service. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const categories = [
    { value: "consulting", label: "💼 Consulting" },
    { value: "mentoring", label: "🎓 Mentoring" },
    { value: "design", label: "🎨 Design" },
    { value: "development", label: "💻 Development" },
    { value: "marketing", label: "📱 Marketing" },
    { value: "writing", label: "✍️ Writing" },
  ];

  return (
    <>
      <SEO 
        title="Services Marketplace | MetaHers Circle"
        description="Browse and list professional services from women experts in the MetaHers Circle community"
      />
      <div className="min-h-screen bg-gradient-to-b from-white via-[hsl(var(--cyber-fuchsia))]/5 to-white py-6 sm:py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8 sm:mb-12">
            <div>
              <Button
                variant="ghost"
                onClick={() => setLocation("/circle")}
                className="gap-2 mb-4"
                data-testid="button-back"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Circle
              </Button>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--liquid-gold))] bg-clip-text text-transparent mb-2">
                Services Marketplace
              </h1>
              <p className="text-foreground/70 text-sm sm:text-base">Discover and offer professional services within the Circle</p>
            </div>
            <Button
              size="lg"
              onClick={() => setShowForm(!showForm)}
              className="gap-2 bg-gradient-to-r from-[hsl(var(--hyper-violet))] to-[hsl(var(--cyber-fuchsia))] text-white w-full sm:w-auto"
              data-testid="button-list-service"
            >
              <Plus className="w-5 h-5" />
              List a Service
            </Button>
          </div>

          {/* Create Service Form */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <Card className="p-8 bg-gradient-to-br from-white to-[hsl(var(--cyber-fuchsia))]/5 border border-[hsl(var(--cyber-fuchsia))]/20">
                <h2 className="text-2xl font-bold mb-6 text-foreground">List Your Service</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-foreground mb-2 block">
                        Service Title
                      </label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., AI Strategy Consultation"
                        required
                        data-testid="input-service-title"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-foreground mb-2 block">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-input bg-white focus:outline-none focus:ring-2 focus:ring-[hsl(var(--cyber-fuchsia))]/20"
                        data-testid="select-category"
                      >
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground mb-2 block">
                      Description
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="What do you offer? Who is it for? What are the deliverables?"
                      className="min-h-24"
                      required
                      data-testid="input-service-description"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-foreground mb-2 block">
                        Pricing (e.g., $500/month or Negotiable)
                      </label>
                      <Input
                        value={formData.pricing}
                        onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                        placeholder="$500/month"
                        data-testid="input-pricing"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-foreground mb-2 block">
                        Delivery Time
                      </label>
                      <select
                        value={formData.deliveryTime}
                        onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-input bg-white focus:outline-none focus:ring-2 focus:ring-[hsl(var(--cyber-fuchsia))]/20"
                        data-testid="select-delivery"
                      >
                        <option value="">Select delivery time</option>
                        <option value="1week">1 week</option>
                        <option value="2weeks">2 weeks</option>
                        <option value="1month">1 month</option>
                        <option value="ongoing">Ongoing</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      className="flex-1"
                      data-testid="button-cancel"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createMutation.isPending}
                      className="flex-1 bg-gradient-to-r from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--liquid-gold))] text-white"
                      data-testid="button-submit-service"
                    >
                      {createMutation.isPending ? "Listing..." : "List Service"}
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}

          {/* Services Grid */}
          {services.length === 0 ? (
            <div className="text-center py-16">
              <Briefcase className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">No services listed yet</h3>
              <p className="text-foreground/60 mb-6">Be the first to offer your expertise to the Circle</p>
              <Button
                onClick={() => setShowForm(true)}
                className="gap-2 bg-gradient-to-r from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--liquid-gold))] text-white"
                data-testid="button-list-first-service"
              >
                <Plus className="w-4 h-4" />
                List Your Service
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, idx) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="p-6 bg-gradient-to-br from-white to-[hsl(var(--cyber-fuchsia))]/5 border border-[hsl(var(--cyber-fuchsia))]/20 hover:border-[hsl(var(--liquid-gold))]/30 shadow-md hover:shadow-lg h-full flex flex-col transition-all" data-testid={`card-service-${service.id}`}>
                    <div className="flex items-start justify-between mb-3">
                      <Badge className="bg-gradient-to-r from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--liquid-gold))] text-white">
                        {categories.find(c => c.value === service.category)?.label || service.category}
                      </Badge>
                      <Star className="w-4 h-4 text-[hsl(var(--liquid-gold))]" />
                    </div>

                    <h3 className="font-bold text-lg text-foreground mb-2">{service.title}</h3>
                    <p className="text-sm text-foreground/70 line-clamp-3 mb-4 flex-1">{service.description}</p>

                    <div className="space-y-3 pt-4 border-t border-[hsl(var(--cyber-fuchsia))]/20">
                      {service.pricing && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-[hsl(var(--liquid-gold))]" />
                          <span className="text-sm font-semibold text-foreground">{service.pricing}</span>
                        </div>
                      )}
                      {service.deliveryTime && (
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-[hsl(var(--cyber-fuchsia))]" />
                          <span className="text-sm text-foreground/70">{service.deliveryTime}</span>
                        </div>
                      )}
                    </div>

                    <Button
                      size="sm"
                      className="w-full mt-4 gap-2 border-[hsl(var(--cyber-fuchsia))]/30 hover:bg-[hsl(var(--cyber-fuchsia))]/10"
                      variant="outline"
                      data-testid={`button-inquire-${service.id}`}
                    >
                      Inquire Now
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
