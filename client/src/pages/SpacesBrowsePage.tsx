import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowRight, Lock, CheckCircle2, Bot, Globe, Gem, Compass, Palette,
  Heart, Code2, Crown, ShoppingCart, Sparkles, Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/hooks/useAuth";
import { spaceImages } from "@/lib/imageManifest";
import { canAccessSignatureFeatures } from "@/lib/tierAccess";

type Space = {
  id: string;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
};

type Experience = {
  id: string;
  spaceId: string;
  tier: string;
};

const PILLAR_LABELS: Record<string, string> = {
  ai: "Learn AI",
  moms: "Learn AI",
  branding: "Brand with AI",
  web3: "Build with AI",
  crypto: "Build with AI",
  metaverse: "Build with AI",
  nfts: "Build with AI",
  "app-atelier": "Build with AI",
  "founders-club": "Monetize with AI",
  "digital-boutique": "Monetize with AI",
  "digital-sales": "Monetize with AI",
};

const PILLAR_ORDER = ["All", "Learn AI", "Brand with AI", "Build with AI", "Monetize with AI"];

const SPACE_VALUE_PROPS: Record<string, { outcomes: string[] }> = {
  web3: { outcomes: ["Understand blockchain fundamentals", "Navigate Web3 confidently", "Build your first dApp"] },
  crypto: { outcomes: ["Master NFT creation & trading", "Understand cryptocurrency", "Launch digital collections"] },
  ai: { outcomes: ["Build AI-powered workflows", "Master ChatGPT & tools", "Automate your business"] },
  metaverse: { outcomes: ["Navigate virtual worlds", "Understand digital ownership", "Create metaverse presence"] },
  nfts: { outcomes: ["Mint and sell NFTs", "Build a digital collection", "Monetize your creativity"] },
  branding: { outcomes: ["Build magnetic personal brand", "Stand out as thought leader", "Attract ideal clients"] },
  moms: { outcomes: ["Balance tech career & family", "Build flexible income", "Join supportive community"] },
  "app-atelier": { outcomes: ["Build apps with AI", "No coding required", "Launch in days, not months"] },
  "founders-club": { outcomes: ["Turn idea into reality", "Build profitable business", "Get founder mentorship"] },
  "digital-boutique": { outcomes: ["Launch online store in 3 days", "Master Instagram Shopping", "Scale with paid ads"] },
  "digital-sales": { outcomes: ["Launch online store in 3 days", "Master Instagram Shopping", "Scale with paid ads"] },
};

function getSpaceIcon(name: string) {
  if (name === "AI") return Bot;
  if (name === "Web3") return Globe;
  if (name === "NFT/Blockchain/Crypto") return Gem;
  if (name === "Metaverse") return Compass;
  if (name === "NFTs") return Layers;
  if (name === "Branding") return Palette;
  if (name === "Moms") return Heart;
  if (name === "App Atelier") return Code2;
  if (name === "Founder's Club") return Crown;
  if (name === "Digital Boutique") return ShoppingCart;
  return Sparkles;
}

const GOLD = "#C9A96E";

export default function SpacesBrowsePage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("All");

  const isProUser = canAccessSignatureFeatures(user?.subscriptionTier);

  const { data: spaces = [], isLoading: spacesLoading } = useQuery<Space[]>({
    queryKey: ["/api/spaces"],
  });

  const { data: experiences = [], isLoading: experiencesLoading } = useQuery<Experience[]>({
    queryKey: ["/api/experiences/all"],
  });

  const filteredSpaces = spaces
    .filter((s) => s.isActive !== false)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .filter((space) => {
      if (activeFilter === "All") return true;
      return PILLAR_LABELS[space.slug] === activeFilter;
    });

  return (
    <div className="min-h-screen" style={{ background: "#0D0B14" }} data-testid="spaces-browse-page">
      <SEO
        title="Explore Learning Spaces - MetaHers"
        description="Browse all 10 MetaHers learning spaces. Master AI, Web3, branding, and more with transformational rituals designed for women entrepreneurs."
      />

      {/* Hero */}
      <section className="pt-20 pb-12 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/10 pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="text-xs uppercase tracking-[0.25em] mb-4"
            style={{ color: GOLD }}
          >
            Your Learning Universe
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white mb-5"
            style={{ letterSpacing: "-0.03em" }}
          >
            Explore All{" "}
            <span style={{ color: "#E879F9" }}>Spaces</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-lg font-light"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            Ten transformational spaces to master AI, Web3, and build wealth, influence, and impact.
          </motion.p>
        </div>
      </section>

      {/* Category Filter Pills */}
      <section className="pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide flex-wrap">
            {PILLAR_ORDER.map((label) => (
              <button
                key={label}
                onClick={() => setActiveFilter(label)}
                className="shrink-0 px-4 py-1.5 text-xs font-medium transition-colors"
                style={{
                  borderRadius: "9999px",
                  background: activeFilter === label ? GOLD : "#1C1926",
                  color: activeFilter === label ? "#1A1A2E" : "rgba(255,255,255,0.5)",
                  border: activeFilter === label ? "none" : "1px solid rgba(255,255,255,0.08)",
                }}
                data-testid={`filter-pill-${label.toLowerCase().replace(/\s/g, "-")}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Spaces Grid */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {spacesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-96 animate-pulse"
                  style={{ background: "#161225", borderRadius: 0 }}
                />
              ))}
            </div>
          ) : filteredSpaces.length === 0 ? (
            <div className="text-center py-20">
              <p style={{ color: "rgba(255,255,255,0.4)" }}>No spaces found for this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSpaces.map((space, index) => {
                const isLocked = !isProUser && space.sortOrder > 2;
                const valueProp = SPACE_VALUE_PROPS[space.slug] || {
                  outcomes: ["Master core concepts", "Build practical skills", "Transform your career"],
                };
                const spaceExperiences = experiences.filter((e) => e.spaceId === space.id);
                const freeCount = spaceExperiences.filter((e) => e.tier === "free").length;
                const totalCount = spaceExperiences.length;
                const SpaceIcon = getSpaceIcon(space.name);

                return (
                  <motion.div
                    key={space.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group"
                    data-testid={`space-card-${space.slug}`}
                  >
                    <div className={`relative h-full ${isLocked ? "opacity-75" : ""}`}>
                      {isLocked && (
                        <div
                          className="absolute inset-0 z-10 flex items-center justify-center"
                          style={{ background: "rgba(13,11,20,0.9)" }}
                        >
                          <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-center px-6"
                          >
                            <div
                              className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                              style={{ background: "#161225" }}
                            >
                              <Lock className="w-5 h-5 text-[#C8A2D8]" />
                            </div>
                            <p className="font-medium text-sm mb-2 text-white">Pro Access Required</p>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setLocation("/upgrade");
                              }}
                              className="text-xs uppercase tracking-wider"
                              style={{ background: "#1A1A2E", color: "#fff" }}
                              data-testid={`unlock-space-${space.slug}`}
                            >
                              Upgrade
                            </Button>
                          </motion.div>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          if (!isLocked) setLocation(`/spaces/${space.slug}`);
                        }}
                        disabled={isLocked}
                        className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] focus-visible:ring-offset-2"
                        data-testid={`button-space-${space.slug}`}
                      >
                        <div
                          className="border border-white/10 hover:border-white/20 transition-all duration-300 h-full flex flex-col group-hover:shadow-lg"
                          style={{ background: "#161225" }}
                        >
                          {spaceImages[space.slug] ? (
                            <div className="relative w-full aspect-[4/3] overflow-hidden">
                              <img
                                src={spaceImages[space.slug].src}
                                alt={spaceImages[space.slug].alt}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                              <div className="absolute top-4 left-4 flex gap-2">
                                {!isLocked && !experiencesLoading && freeCount > 0 && (
                                  <span
                                    className="px-2 py-1 text-white text-xs font-medium uppercase tracking-wider"
                                    style={{ background: "rgba(232,121,249,0.9)" }}
                                  >
                                    {freeCount} Free
                                  </span>
                                )}
                              </div>

                              <div className="absolute bottom-4 left-4">
                                <h3 className="text-xl font-semibold text-white mb-1">{space.name}</h3>
                                <span className="text-sm text-white/80">{totalCount} Rituals</span>
                              </div>
                            </div>
                          ) : (
                            <div
                              className="relative w-full aspect-[4/3] flex flex-col items-center justify-center"
                              style={{ background: "#0D0B14" }}
                            >
                              <SpaceIcon className="w-12 h-12 mb-2 text-[#E879F9]" />
                              <h3 className="text-xl font-semibold text-white">{space.name}</h3>
                              <span className="text-sm text-white/60 mt-1">{totalCount} Rituals</span>
                            </div>
                          )}

                          <div className="p-6 flex flex-col flex-1">
                            <p
                              className="text-sm mb-4 line-clamp-2"
                              style={{ color: "rgba(255,255,255,0.7)" }}
                            >
                              {space.description}
                            </p>

                            <div className="flex-1 mb-4">
                              <ul className="space-y-2">
                                {valueProp.outcomes.slice(0, 3).map((outcome, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-2 text-sm"
                                    style={{ color: "rgba(255,255,255,0.7)" }}
                                  >
                                    <CheckCircle2 className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                                    <span>{outcome}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="pt-4 border-t border-white/10">
                              <span className="text-sm font-medium text-white uppercase tracking-wider group-hover:text-[#E879F9] transition-colors flex items-center gap-2">
                                {isLocked ? "Unlock Access" : "Begin Ritual"}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA for free users */}
      {!isProUser && (
        <section className="pb-20 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div
              className="p-8 border border-white/10"
              style={{ background: "#161225" }}
            >
              <h2
                className="text-2xl font-light text-white mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Unlock Every Space
              </h2>
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.6)" }}>
                MetaHers Studio members get the complete Learning Hub, AI concierge team, toolkit, and monthly implementation support.
              </p>
              <Button
                onClick={() => setLocation("/upgrade")}
                className="font-semibold uppercase tracking-widest text-xs px-8"
                style={{ background: GOLD, color: "#1A1A2E" }}
                data-testid="button-upgrade-spaces"
              >
                Explore Studio
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
