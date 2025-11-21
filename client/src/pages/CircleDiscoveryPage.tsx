import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Users, Heart, MessageCircle, Star, Filter, Briefcase, Zap, Users2, ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import type { WomenProfileDB } from "@shared/schema";

export default function CircleDiscoveryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const { isAuthenticated, user } = useAuth();

  const { data: profiles = [] } = useQuery<WomenProfileDB[]>({
    queryKey: ["/api/circle/profiles"],
  });

  const filteredProfiles = profiles.filter(p => {
    const matchesSearch = !searchTerm || 
      p.headline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.bio?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !selectedFilter || p.availability === selectedFilter;
    return matchesSearch && matchesFilter && p.visibility !== "private";
  });

  const userProfile = profiles.find(p => p.userId === user?.id);

  return (
    <>
      <SEO 
        title="Circle Discovery | MetaHers"
        description="Discover amazing women professionals, entrepreneurs, and creators on MetaHers Circle - network, collaborate, and grow together"
      />
      <div className="min-h-screen bg-background">
        {/* Hero Section with Onboarding */}
        <div className="bg-gradient-to-b from-[hsl(var(--hyper-violet))] via-background to-background py-16 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Main Headline */}
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Users2 className="w-8 h-8 text-[hsl(var(--hyper-violet))]" />
                <h1 className="text-5xl font-serif font-bold">MetaHers Circle</h1>
              </div>
              <p className="text-xl text-foreground/80 mb-3">
                Your exclusive network of ambitious women. Connect. Collaborate. Grow together.
              </p>
              <p className="text-base text-foreground/60 max-w-2xl mx-auto">
                MetaHers Circle is a professional community where women entrepreneurs, creators, and tech professionals discover opportunities, trade skills, build partnerships, and elevate their careers.
              </p>
            </motion.div>

            {/* Value Props */}
            <motion.div 
              className="grid md:grid-cols-3 gap-4 mb-12 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-5 bg-white/5 border-white/10 hover-elevate">
                <div className="flex gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[hsl(var(--hyper-violet))]/20 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-[hsl(var(--hyper-violet))]" />
                  </div>
                  <h3 className="font-semibold text-sm">Discover Talent</h3>
                </div>
                <p className="text-xs text-foreground/60">Find collaborators, mentors, and team members in your industry</p>
              </Card>

              <Card className="p-5 bg-white/5 border-white/10 hover-elevate">
                <div className="flex gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[hsl(var(--cyber-fuchsia))]/20 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-[hsl(var(--cyber-fuchsia))]" />
                  </div>
                  <h3 className="font-semibold text-sm">Offer Services</h3>
                </div>
                <p className="text-xs text-foreground/60">Showcase your skills and land projects or consulting opportunities</p>
              </Card>

              <Card className="p-5 bg-white/5 border-white/10 hover-elevate">
                <div className="flex gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[hsl(var(--aurora-teal))]/20 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-[hsl(var(--aurora-teal))]" />
                  </div>
                  <h3 className="font-semibold text-sm">Trade Skills</h3>
                </div>
                <p className="text-xs text-foreground/60">Exchange skills, knowledge, and expertise with other members</p>
              </Card>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-wrap gap-3 justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {isAuthenticated ? (
                <>
                  {!userProfile ? (
                    <Button 
                      size="lg" 
                      onClick={() => setLocation("/circle-profile")}
                      className="gap-2 bg-[hsl(var(--hyper-violet))] hover:bg-[hsl(var(--hyper-violet))]/90"
                    >
                      <Sparkles className="w-5 h-5" />
                      Create Your Profile
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  ) : null}
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => setLocation("/circle-services")}
                    className="gap-2"
                  >
                    <Briefcase className="w-5 h-5" />
                    List a Service
                  </Button>
                </>
              ) : (
                <Button 
                  size="lg" 
                  onClick={() => setLocation("/signup")}
                  className="gap-2 bg-[hsl(var(--hyper-violet))] hover:bg-[hsl(var(--hyper-violet))]/90"
                >
                  Join Circle Now
                  <ArrowRight className="w-5 h-5" />
                </Button>
              )}
            </motion.div>

            {/* How It Works */}
            {!userProfile && isAuthenticated && (
              <motion.div 
                className="bg-white/5 border border-white/10 rounded-xl p-6 max-w-2xl mx-auto mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[hsl(var(--hyper-violet))]" />
                  Quick Start - 2 Minutes to Get Started
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-[hsl(var(--hyper-violet))] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">1. Create Your Profile</p>
                      <p className="text-xs text-foreground/60">Share your headline, bio, location, and what you're looking for</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-[hsl(var(--cyber-fuchsia))] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">2. Explore & Connect</p>
                      <p className="text-xs text-foreground/60">Browse other women's profiles, message them, and build your network</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-[hsl(var(--aurora-teal))] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">3. Offer & Discover</p>
                      <p className="text-xs text-foreground/60">List your services, trade skills, or post opportunities for the community</p>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => setLocation("/circle-profile")}
                  className="w-full mt-6 bg-[hsl(var(--hyper-violet))] hover:bg-[hsl(var(--hyper-violet))]/90 gap-2"
                >
                  Get Started Now
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            )}

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-foreground/50" />
                <Input
                  placeholder="Search by skills, interests, name, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                  data-testid="input-circle-search"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="max-w-2xl mx-auto flex gap-2 flex-wrap justify-center">
              <Button
                variant={selectedFilter === null ? "default" : "outline"}
                onClick={() => setSelectedFilter(null)}
                size="sm"
                className="gap-2"
                data-testid="button-filter-all"
              >
                <Filter className="w-4 h-4" />
                All
              </Button>
              {["active", "passive", "not-available"].map(status => (
                <Button
                  key={status}
                  variant={selectedFilter === status ? "default" : "outline"}
                  onClick={() => setSelectedFilter(status)}
                  size="sm"
                  data-testid={`button-filter-${status}`}
                >
                  {status === "active" ? "Active" : status === "passive" ? "Open to Opportunities" : "Not Available"}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Profiles Section */}
        <div className="max-w-7xl mx-auto p-6">
          {filteredProfiles.length === 0 ? (
            <motion.div 
              className="text-center py-20 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="bg-white/5 border border-white/10 rounded-xl p-12 max-w-md mx-auto">
                <Users className="w-16 h-16 mx-auto text-foreground/20 mb-6" />
                <h3 className="text-xl font-semibold mb-3">No profiles found yet</h3>
                <p className="text-foreground/60 mb-6">
                  {isAuthenticated ? "You're looking at an exclusive community. Be one of the first to join!" : "Join MetaHers Circle to discover women professionals and grow your network."}
                </p>
                {isAuthenticated ? (
                  <>
                    <p className="text-sm text-foreground/50 mb-4">👋 Be the first to create a profile and start connecting</p>
                    <Button 
                      onClick={() => setLocation("/circle-profile")}
                      className="w-full gap-2 bg-[hsl(var(--hyper-violet))] hover:bg-[hsl(var(--hyper-violet))]/90"
                      data-testid="button-create-first-profile"
                    >
                      Create Your Profile
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={() => setLocation("/signup")}
                    className="w-full gap-2 bg-[hsl(var(--hyper-violet))] hover:bg-[hsl(var(--hyper-violet))]/90"
                    data-testid="button-signup-circle"
                  >
                    Join Circle
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          ) : (
            <>
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-sm text-foreground/60">
                  Showing <span className="font-semibold text-foreground">{filteredProfiles.length}</span> profile{filteredProfiles.length !== 1 ? 's' : ''} {selectedFilter ? `(${selectedFilter})` : ''}
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-6">
                {filteredProfiles.map((profile, idx) => (
                  <motion.div
                    key={profile.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="p-6 hover-elevate cursor-pointer h-full flex flex-col" data-testid={`card-profile-${profile.id}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{profile.headline || "Profile"}</h3>
                          <p className="text-sm text-foreground/60">{profile.location || "Location not specified"}</p>
                        </div>
                        {profile.verifiedMember && (
                          <Badge className="bg-[hsl(var(--hyper-violet))] flex-shrink-0" data-testid="badge-verified">
                            <Star className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-foreground/70 line-clamp-3 mb-4">
                        {profile.bio || "No bio yet"}
                      </p>

                      <div className="flex gap-2 mb-4 flex-wrap">
                        {profile.lookingFor && typeof profile.lookingFor === 'string' && 
                          profile.lookingFor.split(',').slice(0, 2).map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {tag.trim()}
                            </Badge>
                          ))
                        }
                      </div>

                      <div className="flex gap-2 mt-auto">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 gap-2"
                          data-testid={`button-message-${profile.id}`}
                        >
                          <MessageCircle className="w-4 h-4" />
                          Message
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="gap-2"
                          data-testid={`button-favorite-${profile.id}`}
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* CTA Footer Section */}
        {filteredProfiles.length > 0 && isAuthenticated && !userProfile && (
          <motion.div 
            className="bg-gradient-to-r from-[hsl(var(--hyper-violet))]/10 to-[hsl(var(--cyber-fuchsia))]/10 border-t border-white/10 py-12 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-2xl font-serif font-bold mb-4">Ready to join this amazing community?</h3>
              <p className="text-foreground/70 mb-6">Create your profile to connect with women professionals, share your expertise, and build meaningful relationships</p>
              <Button 
                size="lg" 
                onClick={() => setLocation("/circle-profile")}
                className="gap-2 bg-[hsl(var(--hyper-violet))] hover:bg-[hsl(var(--hyper-violet))]/90"
                data-testid="button-create-profile-footer"
              >
                Create Your Profile Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}
