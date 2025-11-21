import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Users, Heart, MessageCircle, Star, Filter, Briefcase, Zap, Users2, ArrowRight, CheckCircle, Sparkles, Globe, Target, Lightbulb, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useFavorites } from "@/hooks/useFavorites";
import type { WomenProfileDB } from "@shared/schema";

export default function CircleDiscoveryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [, setLocation] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const ITEMS_PER_PAGE = 6;

  const { data: profiles = [] } = useQuery<WomenProfileDB[]>({
    queryKey: ["/api/circle/profiles"],
  });

  const filteredProfiles = useMemo(() => {
    return profiles.filter(p => {
      const matchesSearch = !searchTerm || 
        p.headline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.bio?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = !selectedFilter || p.availability === selectedFilter;
      return matchesSearch && matchesFilter && p.visibility !== "private";
    });
  }, [profiles, searchTerm, selectedFilter]);

  const totalPages = Math.ceil(filteredProfiles.length / ITEMS_PER_PAGE);
  const paginatedProfiles = filteredProfiles.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const userProfile = profiles.find(p => p.userId === user?.id);

  return (
    <>
      <SEO 
        title="Circle Discovery | MetaHers"
        description="Discover amazing women professionals, entrepreneurs, and creators on MetaHers Circle - network, collaborate, and grow together"
      />
      <div className="min-h-screen bg-gradient-to-b from-white via-[hsl(var(--hyper-violet))]/5 to-white">
        {/* Hero Section with Stunning Gradient */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--hyper-violet))]/15 via-[hsl(var(--magenta-quartz))]/10 to-[hsl(var(--cyber-fuchsia))]/15 blur-3xl" />
          <div className="relative py-16 sm:py-20 px-4">
            <div className="max-w-7xl mx-auto">
              {/* Main Headline with Glass Effect */}
              <motion.div 
                className="text-center mb-12"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="inline-flex items-center justify-center gap-3 mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--hyper-violet))] to-[hsl(var(--cyber-fuchsia))] rounded-2xl blur-lg opacity-30" />
                    <div className="relative bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-white/50">
                      <Users2 className="w-8 h-8 bg-gradient-to-r from-[hsl(var(--hyper-violet))] to-[hsl(var(--cyber-fuchsia))] bg-clip-text text-transparent" />
                    </div>
                  </div>
                  <h1 className="text-5xl sm:text-6xl font-serif font-bold bg-gradient-to-r from-[hsl(var(--hyper-violet))] via-[hsl(var(--magenta-quartz))] to-[hsl(var(--cyber-fuchsia))] bg-clip-text text-transparent">
                    MetaHers Circle
                  </h1>
                </div>
                <p className="text-2xl sm:text-3xl font-semibold text-foreground mb-3">
                  Your Exclusive Network of Ambitious Women
                </p>
                <p className="text-base text-foreground/70 max-w-3xl mx-auto leading-relaxed">
                  Connect with brilliant entrepreneurs, creators, and tech professionals. Collaborate on projects. Trade skills. Build partnerships. Elevate your career.
                </p>
              </motion.div>

              {/* Value Props - Enhanced Cards */}
              <motion.div 
                className="grid sm:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <motion.div whileHover={{ y: -8, scale: 1.02 }} className="group">
                  <Card className="p-8 bg-gradient-to-br from-white to-[hsl(var(--hyper-violet))]/5 border border-[hsl(var(--hyper-violet))]/20 hover:border-[hsl(var(--hyper-violet))]/40 shadow-lg hover:shadow-xl transition-all">
                    <div className="flex gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[hsl(var(--hyper-violet))] to-[hsl(var(--magenta-quartz))] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-bold text-lg text-foreground pt-1">Discover Talent</h3>
                    </div>
                    <p className="text-sm text-foreground/70 leading-relaxed">Find collaborators, mentors, and team members who inspire you</p>
                  </Card>
                </motion.div>

                <motion.div whileHover={{ y: -8, scale: 1.02 }} className="group">
                  <Card className="p-8 bg-gradient-to-br from-white to-[hsl(var(--cyber-fuchsia))]/5 border border-[hsl(var(--cyber-fuchsia))]/20 hover:border-[hsl(var(--cyber-fuchsia))]/40 shadow-lg hover:shadow-xl transition-all">
                    <div className="flex gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--liquid-gold))] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Briefcase className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-bold text-lg text-foreground pt-1">Offer Services</h3>
                    </div>
                    <p className="text-sm text-foreground/70 leading-relaxed">Showcase your expertise and land projects or consulting gigs</p>
                  </Card>
                </motion.div>

                <motion.div whileHover={{ y: -8, scale: 1.02 }} className="group">
                  <Card className="p-8 bg-gradient-to-br from-white to-[hsl(var(--aurora-teal))]/5 border border-[hsl(var(--aurora-teal))]/20 hover:border-[hsl(var(--aurora-teal))]/40 shadow-lg hover:shadow-xl transition-all">
                    <div className="flex gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[hsl(var(--aurora-teal))] to-[hsl(var(--hyper-violet))] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-bold text-lg text-foreground pt-1">Trade Skills</h3>
                    </div>
                    <p className="text-sm text-foreground/70 leading-relaxed">Exchange knowledge, expertise, and build lasting relationships</p>
                  </Card>
                </motion.div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div 
                className="flex flex-wrap gap-4 justify-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {isAuthenticated ? (
                  <>
                    {!userProfile ? (
                      <Button 
                        size="lg" 
                        onClick={() => setLocation("/circle-profile")}
                        className="gap-2 bg-gradient-to-r from-[hsl(var(--hyper-violet))] to-[hsl(var(--cyber-fuchsia))] hover:shadow-xl text-white"
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
                      className="gap-2 border-[hsl(var(--cyber-fuchsia))]/30 hover:bg-[hsl(var(--cyber-fuchsia))]/5"
                    >
                      <Briefcase className="w-5 h-5" />
                      List a Service
                    </Button>
                  </>
                ) : (
                  <Button 
                    size="lg" 
                    onClick={() => setLocation("/signup")}
                    className="gap-2 bg-gradient-to-r from-[hsl(var(--hyper-violet))] to-[hsl(var(--cyber-fuchsia))] hover:shadow-xl text-white"
                  >
                    Join Circle Now
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                )}
              </motion.div>

              {/* How It Works */}
              {!userProfile && isAuthenticated && (
                <motion.div 
                  className="bg-gradient-to-r from-[hsl(var(--hyper-violet))]/10 to-[hsl(var(--cyber-fuchsia))]/10 border border-[hsl(var(--liquid-gold))]/30 rounded-2xl p-8 max-w-3xl mx-auto mb-8 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="font-bold text-2xl mb-6 flex items-center gap-3 text-foreground">
                    <Lightbulb className="w-6 h-6 text-[hsl(var(--liquid-gold))]" />
                    Quick Start - 2 Minutes to Get Started
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-[hsl(var(--hyper-violet))] to-[hsl(var(--magenta-quartz))] text-white font-bold">
                          1
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-base text-foreground">Create Your Profile</p>
                        <p className="text-sm text-foreground/70">Share your headline, bio, location, and what you're looking for in under 2 minutes</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--liquid-gold))] text-white font-bold">
                          2
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-base text-foreground">Explore & Connect</p>
                        <p className="text-sm text-foreground/70">Browse other women's profiles, message them, and start building your network</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-[hsl(var(--aurora-teal))] to-[hsl(var(--hyper-violet))] text-white font-bold">
                          3
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-base text-foreground">Offer & Discover</p>
                        <p className="text-sm text-foreground/70">List your services, trade skills, or post opportunities for the community</p>
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setLocation("/circle-profile")}
                    className="w-full mt-8 bg-gradient-to-r from-[hsl(var(--hyper-violet))] to-[hsl(var(--cyber-fuchsia))] text-white hover:shadow-lg gap-2"
                  >
                    Get Started Now
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}

              {/* Search Bar */}
              <div className="max-w-3xl mx-auto mb-8">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--hyper-violet))]/20 to-[hsl(var(--cyber-fuchsia))]/20 rounded-xl blur-lg group-focus-within:blur-xl transition-all" />
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/50" />
                    <Input
                      placeholder="Search by skills, interests, name, or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 h-14 bg-white/80 border border-[hsl(var(--hyper-violet))]/20 rounded-xl focus:border-[hsl(var(--hyper-violet))]/50 focus:bg-white"
                      data-testid="input-circle-search"
                    />
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="max-w-3xl mx-auto flex gap-2 flex-wrap justify-center mb-8">
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
                    {status === "active" ? "🔥 Active" : status === "passive" ? "👀 Open to Opportunities" : "🚫 Not Available"}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Profiles Section */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {filteredProfiles.length === 0 ? (
            <motion.div 
              className="text-center py-20 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="bg-gradient-to-br from-white to-[hsl(var(--hyper-violet))]/5 border border-[hsl(var(--hyper-violet))]/20 rounded-2xl p-12 max-w-md mx-auto shadow-lg">
                <div className="w-20 h-20 bg-gradient-to-br from-[hsl(var(--hyper-violet))]/20 to-[hsl(var(--cyber-fuchsia))]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-[hsl(var(--hyper-violet))]" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">No profiles found yet</h3>
                <p className="text-foreground/70 mb-6 text-base">
                  {isAuthenticated ? "Be one of the first to join this exclusive community!" : "Join MetaHers Circle to discover women professionals and grow together."}
                </p>
                {isAuthenticated ? (
                  <>
                    <p className="text-sm text-foreground/50 mb-6">Launch your profile and start connecting with amazing women</p>
                    <Button 
                      onClick={() => setLocation("/circle-profile")}
                      className="w-full gap-2 bg-gradient-to-r from-[hsl(var(--hyper-violet))] to-[hsl(var(--cyber-fuchsia))] text-white"
                      data-testid="button-create-first-profile"
                    >
                      Create Your Profile
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={() => setLocation("/signup")}
                    className="w-full gap-2 bg-gradient-to-r from-[hsl(var(--hyper-violet))] to-[hsl(var(--cyber-fuchsia))] text-white"
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
                <p className="text-base text-foreground/70">
                  Showing <span className="font-bold text-[hsl(var(--hyper-violet))]">{filteredProfiles.length}</span> amazing women {selectedFilter ? `(${selectedFilter})` : ''}
                </p>
              </motion.div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProfiles.map((profile, idx) => (
                  <motion.div
                    key={profile.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ y: -4 }}
                  >
                    <Card className="p-6 bg-gradient-to-br from-white to-[hsl(var(--hyper-violet))]/5 border border-[hsl(var(--hyper-violet))]/15 hover:border-[hsl(var(--cyber-fuchsia))]/30 shadow-md hover:shadow-lg h-full flex flex-col transition-all" data-testid={`card-profile-${profile.id}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-foreground">{profile.headline || "Profile"}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Globe className="w-4 h-4 text-foreground/50" />
                            <p className="text-sm text-foreground/60">{profile.location || "Location not specified"}</p>
                          </div>
                        </div>
                        {profile.verifiedMember && (
                          <Badge className="bg-gradient-to-r from-[hsl(var(--liquid-gold))] to-[hsl(var(--cyber-fuchsia))] text-white flex-shrink-0 gap-1" data-testid="badge-verified">
                            <Star className="w-3 h-3" />
                            Verified
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-foreground/70 line-clamp-3 mb-4 leading-relaxed">
                        {profile.bio || "No bio yet"}
                      </p>

                      <div className="flex gap-2 mb-4 flex-wrap">
                        {profile.lookingFor && typeof profile.lookingFor === 'string' && 
                          profile.lookingFor.split(',').slice(0, 2).map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs border-[hsl(var(--hyper-violet))]/20 bg-[hsl(var(--hyper-violet))]/5">
                              {tag.trim()}
                            </Badge>
                          ))
                        }
                      </div>

                      <div className="flex gap-2 mt-auto">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 gap-2 border-[hsl(var(--cyber-fuchsia))]/20 hover:bg-[hsl(var(--cyber-fuchsia))]/10"
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
            className="relative overflow-hidden mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--hyper-violet))]/20 via-[hsl(var(--magenta-quartz))]/15 to-[hsl(var(--cyber-fuchsia))]/20 blur-3xl" />
            <div className="relative bg-gradient-to-r from-[hsl(var(--hyper-violet))]/10 to-[hsl(var(--cyber-fuchsia))]/10 border-t border-b border-[hsl(var(--liquid-gold))]/20 py-12 px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h3 className="text-3xl font-serif font-bold text-foreground mb-4">Ready to Join This Amazing Community?</h3>
                <p className="text-foreground/70 mb-8 text-lg leading-relaxed">Create your profile to connect with brilliant women, share your expertise, and build meaningful relationships that elevate your career</p>
                <Button 
                  size="lg" 
                  onClick={() => setLocation("/circle-profile")}
                  className="gap-2 bg-gradient-to-r from-[hsl(var(--hyper-violet))] to-[hsl(var(--cyber-fuchsia))] text-white hover:shadow-xl"
                  data-testid="button-create-profile-footer"
                >
                  Create Your Profile Now
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}
