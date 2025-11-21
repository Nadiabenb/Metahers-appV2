import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { SEO } from "@/components/SEO";
import { ArrowLeft, Upload, CheckCircle, Sparkles } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import type { WomenProfileDB } from "@shared/schema";

export default function CircleProfilePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    headline: "",
    bio: "",
    location: "",
    lookingFor: "",
    availability: "passive" as const,
    skills: "",
    website: "",
    visibility: "public" as const,
  });

  const { data: profile, isLoading } = useQuery<WomenProfileDB | null>({
    queryKey: ["/api/circle/profile"],
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        headline: profile.headline || "",
        bio: profile.bio || "",
        location: profile.location || "",
        lookingFor: profile.lookingFor || "",
        availability: profile.availability || "passive",
        skills: profile.skills || "",
        website: profile.website || "",
        visibility: profile.visibility || "public",
      });
    }
  }, [profile]);

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/circle/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to save profile");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/circle/profile"] });
      toast({
        title: "Success!",
        description: "Your profile has been saved. Welcome to MetaHers Circle!",
      });
      setIsEditing(false);
      setTimeout(() => setLocation("/circle"), 1000);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-[hsl(var(--hyper-violet))]/5 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[hsl(var(--hyper-violet))]/20 border-t-[hsl(var(--hyper-violet))] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground/60">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const hasProfile = !!profile;

  return (
    <>
      <SEO 
        title={hasProfile ? "Edit Profile | MetaHers Circle" : "Create Profile | MetaHers Circle"}
        description="Complete your MetaHers Circle profile and join our community of ambitious women professionals"
      />
      <div className="min-h-screen bg-gradient-to-b from-white via-[hsl(var(--hyper-violet))]/5 to-white py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={() => setLocation("/circle")}
              className="gap-2"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Circle
            </Button>
            {hasProfile && !isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                className="gap-2"
                data-testid="button-edit-profile"
              >
                <Sparkles className="w-4 h-4" />
                Edit Profile
              </Button>
            )}
          </div>

          {/* View Profile */}
          {hasProfile && !isEditing && (
            <div className="space-y-6">
              <Card className="p-8 bg-gradient-to-br from-white to-[hsl(var(--hyper-violet))]/5 border border-[hsl(var(--hyper-violet))]/20">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-4xl font-bold text-foreground mb-2">{formData.headline}</h1>
                    <p className="text-lg text-foreground/60">{formData.location}</p>
                  </div>
                  {profile?.verifiedMember && (
                    <Badge className="bg-gradient-to-r from-[hsl(var(--liquid-gold))] to-[hsl(var(--cyber-fuchsia))] text-white">
                      Verified Member
                    </Badge>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-foreground mb-3">About</h3>
                    <p className="text-foreground/70 leading-relaxed">{formData.bio}</p>
                  </div>

                  {formData.skills && (
                    <div>
                      <h3 className="font-bold text-foreground mb-3">Skills & Expertise</h3>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.split(',').map((skill, idx) => (
                          <Badge key={idx} variant="outline" className="border-[hsl(var(--hyper-violet))]/30 bg-[hsl(var(--hyper-violet))]/5">
                            {skill.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.lookingFor && (
                    <div>
                      <h3 className="font-bold text-foreground mb-3">Looking For</h3>
                      <div className="flex flex-wrap gap-2">
                        {formData.lookingFor.split(',').map((item, idx) => (
                          <Badge key={idx} className="bg-gradient-to-r from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--liquid-gold))] text-white">
                            {item.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[hsl(var(--hyper-violet))]/20">
                    <div>
                      <p className="text-sm text-foreground/60 mb-1">Availability</p>
                      <Badge className="bg-[hsl(var(--aurora-teal))]/20 text-[hsl(var(--aurora-teal))] border border-[hsl(var(--aurora-teal))]/30">
                        {formData.availability === "active" ? "🔥 Active" : "👀 Open to Opportunities"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60 mb-1">Visibility</p>
                      <Badge variant="outline">
                        {formData.visibility === "public" ? "🌍 Public" : "🔒 Private"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="grid sm:grid-cols-2 gap-4">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setLocation("/circle")}
                  className="gap-2"
                  data-testid="button-view-circle"
                >
                  View Circle Community
                </Button>
                <Button
                  size="lg"
                  onClick={() => setLocation("/circle-services")}
                  className="gap-2 bg-gradient-to-r from-[hsl(var(--hyper-violet))] to-[hsl(var(--cyber-fuchsia))] text-white"
                  data-testid="button-list-services"
                >
                  List Your Services
                </Button>
              </div>
            </div>
          )}

          {/* Create/Edit Form */}
          {(!hasProfile || isEditing) && (
            <Card className="p-8 bg-gradient-to-br from-white to-[hsl(var(--hyper-violet))]/5 border border-[hsl(var(--hyper-violet))]/20">
              <h1 className="text-3xl font-bold mb-2 text-foreground">
                {hasProfile ? "Edit Your Profile" : "Create Your Profile"}
              </h1>
              <p className="text-foreground/60 mb-8">
                {hasProfile ? "Update your profile to reflect your latest expertise and interests" : "Tell the Circle about yourself in 2 minutes"}
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-2 block">
                      Headline (e.g., AI/Web3 Entrepreneur)
                    </label>
                    <Input
                      value={formData.headline}
                      onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                      placeholder="Your professional headline"
                      required
                      data-testid="input-headline"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground mb-2 block">
                      Location
                    </label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="City, Country"
                      data-testid="input-location"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">
                    Bio
                  </label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself, your experience, and what you're passionate about..."
                    className="min-h-24"
                    required
                    data-testid="input-bio"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">
                    Skills & Expertise (comma-separated)
                  </label>
                  <Input
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    placeholder="AI, Web3, Product Management, Branding, etc."
                    data-testid="input-skills"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">
                    Looking For (comma-separated)
                  </label>
                  <Input
                    value={formData.lookingFor}
                    onChange={(e) => setFormData({ ...formData, lookingFor: e.target.value })}
                    placeholder="Co-founder, Investors, Mentors, Team Members, etc."
                    data-testid="input-looking-for"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-2 block">
                      Availability
                    </label>
                    <select
                      value={formData.availability}
                      onChange={(e) => setFormData({ ...formData, availability: e.target.value as any })}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-white focus:outline-none focus:ring-2 focus:ring-[hsl(var(--hyper-violet))]/20"
                      data-testid="select-availability"
                    >
                      <option value="active">🔥 Active (Seeking Opportunities)</option>
                      <option value="passive">👀 Open to Opportunities</option>
                      <option value="not-available">🚫 Not Available</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground mb-2 block">
                      Visibility
                    </label>
                    <select
                      value={formData.visibility}
                      onChange={(e) => setFormData({ ...formData, visibility: e.target.value as any })}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-white focus:outline-none focus:ring-2 focus:ring-[hsl(var(--hyper-violet))]/20"
                      data-testid="select-visibility"
                    >
                      <option value="public">🌍 Public (Visible to Circle)</option>
                      <option value="private">🔒 Private (Hidden)</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  {hasProfile && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="flex-1"
                      data-testid="button-cancel"
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="flex-1 gap-2 bg-gradient-to-r from-[hsl(var(--hyper-violet))] to-[hsl(var(--cyber-fuchsia))] text-white"
                    data-testid="button-save-profile"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {createMutation.isPending ? "Saving..." : hasProfile ? "Update Profile" : "Create Profile"}
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
