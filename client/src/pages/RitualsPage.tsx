import { motion, useReducedMotion } from "framer-motion";
import { useLocation } from "wouter";
import { rituals } from "@shared/schema";
import { RitualCard } from "@/components/MenuCard";
import { SEO } from "@/components/SEO";
import { ParticleField, GradientOrbs, TiltCard, PortalButton, ShimmerBadge, ImmersiveSection } from "@/components/metaverse";
import { Sparkles } from "lucide-react";

export default function RitualsPage() {
  const [, setLocation] = useLocation();
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <SEO
        title="AI & Web3 Learning Rituals"
        description="Explore guided learning rituals for AI prompting, blockchain, cryptocurrency, NFTs, and the metaverse. Each ritual offers calm, structured tech education for women."
        keywords="AI learning, Web3 courses, blockchain tutorial, NFT guide, crypto education, AI prompts course, metaverse guide"
      />

      {/* Particle field background */}
      <ParticleField count={30} prefersReducedMotion={prefersReducedMotion || false} />

      {/* Hero section with gradient orbs */}
      <div className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Morphing gradient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <GradientOrbs prefersReducedMotion={prefersReducedMotion || false} />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(181,101,216,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(181,101,216,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <ImmersiveSection className="text-center mb-32">
            <ShimmerBadge
              icon={<Sparkles className="w-6 h-6 text-[hsl(var(--liquid-gold))]" />}
              className="mb-12"
            >
              Guided Learning Journeys
            </ShimmerBadge>

            <h1 
              className="font-serif text-7xl sm:text-8xl md:text-9xl font-bold mb-12 bg-gradient-to-r from-[#B565D8] via-[#FF00FF] to-[#E935C1] bg-clip-text text-transparent py-2 leading-tight" 
              data-testid="text-page-title"
              style={{
                textShadow: '0 0 80px rgba(181,101,216,0.5), 0 0 120px rgba(233,53,193,0.3)',
              }}
            >
              Your Rituals
            </h1>
            
            <p className="text-2xl sm:text-3xl text-foreground/90 max-w-4xl mx-auto leading-relaxed font-light" data-testid="text-page-subtitle">
              Each ritual is a guided journey through the future of technology.
              <br />
              <span className="text-[hsl(var(--liquid-gold))]">Serene. Structured. Transformative.</span>
            </p>
          </ImmersiveSection>

          {/* Ritual cards in 3D */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12" data-testid="grid-rituals">
            {rituals.map((ritual, index) => (
              <TiltCard
                key={ritual.slug}
                delay={index * 0.1}
                prefersReducedMotion={prefersReducedMotion || false}
              >
                <RitualCard
                  ritual={ritual}
                  onClick={() => setLocation(`/rituals/${ritual.slug}`)}
                />
              </TiltCard>
            ))}
          </div>

          {/* CTA Section */}
          <ImmersiveSection className="mt-40" delay={0.3}>
            <div 
              className="text-center backdrop-blur-2xl bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-16 border border-white/10 relative overflow-hidden group"
              data-testid="card-upgrade-cta"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#B565D8]/20 to-transparent opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.5 }}
              />
              
              <div className="relative z-10">
                <h3 className="font-serif text-5xl font-bold bg-gradient-to-r from-[#FFD700] via-[#FFF] to-[#FFD700] bg-clip-text text-transparent mb-6 py-2 leading-tight">
                  Ready to unlock all rituals?
                </h3>
                <p className="text-2xl text-foreground/80 mb-12 max-w-2xl mx-auto">
                  Get instant access to all Pro rituals plus exclusive Ritual Bags in our shop.
                </p>
                
                <PortalButton
                  onClick={() => setLocation("/shop")}
                  testId="button-visit-shop"
                  showIcon={true}
                >
                  Visit Shop
                </PortalButton>
              </div>
            </div>
          </ImmersiveSection>
        </div>
      </div>
    </div>
  );
}
