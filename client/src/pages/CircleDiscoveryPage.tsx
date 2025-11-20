import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Users, Heart, MessageCircle, Star, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";
import { useQuery } from "@tanstack/react-query";
import type { WomenProfileDB } from "@shared/schema";

export default function CircleDiscoveryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

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

  return (
    <>
      <SEO 
        title="Circle Discovery | MetaHers"
        description="Discover amazing women professionals, entrepreneurs, and creators on MetaHers Circle"
      />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[hsl(var(--hyper-violet))] via-background to-background py-12 px-4">
          <div className="max-w-7xl mx-auto text-center mb-8">
            <motion.h1 
              className="text-4xl font-serif font-bold text-gradient-violet mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              MetaHers Circle
            </motion.h1>
            <p className="text-lg text-foreground/70">
              Connect with ambitious women. Network. Grow. Thrive together.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-foreground/50" />
              <Input
                placeholder="Search by skills, interests, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
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
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Profiles Grid */}
        <div className="max-w-7xl mx-auto p-6">
          {filteredProfiles.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-foreground/30 mb-4" />
              <p className="text-foreground/70">No women found matching your search.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {filteredProfiles.map((profile) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card className="p-6 hover-elevate cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{profile.headline || "Profile"}</h3>
                        <p className="text-sm text-foreground/60">{profile.location}</p>
                      </div>
                      {profile.verifiedMember && (
                        <Badge className="bg-[hsl(var(--hyper-violet))]">
                          <Star className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-foreground/70 line-clamp-3 mb-4">
                      {profile.bio || "No bio yet"}
                    </p>

                    <div className="flex gap-2 mb-4">
                      {["Collaboration", "Mentorship", "Networking"].map(tag => (
                        profile.lookingFor?.includes(tag) && (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        )
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Message
                      </Button>
                      <Button size="sm" variant="ghost" className="gap-2">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
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
