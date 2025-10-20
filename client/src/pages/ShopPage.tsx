import { motion } from "framer-motion";
import { shopProducts } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Sparkles, CheckCircle2 } from "lucide-react";
import sheikhaBag from "@assets/generated_images/Sheikha_Ritual_Bag_product_c23c112a.png";
import serenityBag from "@assets/generated_images/Serenity_Ritual_Bag_product_343cd620.png";
import floralBag from "@assets/generated_images/Floral_Ritual_Bag_product_60ad94ef.png";
import trioBundle from "@assets/generated_images/Trio_Bundle_collection_product_693bd7b6.png";

export default function ShopPage() {
  const productImages: Record<string, string> = {
    sheikha: sheikhaBag,
    serenity: serenityBag,
    floral: floralBag,
    bundle: trioBundle,
  };

  const productTags: Record<string, { emoji: string; tag: string }> = {
    "sheikha-bag": { emoji: "🖤", tag: "A royal, empowering ritual." },
    "serenity-bag": { emoji: "💜", tag: "A calming, refreshing ritual." },
    "floral-bag": { emoji: "🌹", tag: "A soft, romantic ritual." },
  };

  const handlePurchase = () => {
    window.open("https://metahers.gumroad.com/l/metahers", "_blank");
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-16"
        >
          <h1 className="font-cormorant text-5xl sm:text-6xl font-bold text-foreground mb-6" data-testid="text-page-title">
            MetaHers Ritual Bags
          </h1>
          <p className="text-xl text-foreground/90 max-w-3xl mx-auto leading-relaxed mb-8" data-testid="text-page-subtitle">
            Your self-care meets your digital glow-up.<br />
            Each Ritual Bag blends luxury wellness with personal AI guidance.<br />
            When you purchase one, you instantly become a <span className="text-primary font-semibold">MetaHers Pro Member</span> — unlocking live sessions, your AI-powered journal, and exclusive digital tools for women.
          </p>

          {/* Pro Membership Benefits */}
          <div className="max-w-2xl mx-auto editorial-card p-8 mb-12">
            <div className="absolute inset-0 gradient-violet-fuchsia opacity-5" />
            <h3 className="font-cormorant text-2xl font-bold text-foreground mb-6 relative z-10">Pro Membership includes:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left relative z-10">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80">Weekly AI Glow-Up Sessions</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80">AI-Powered Journal access</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80">Private MetaHers Mind Spa community</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80">Step-by-step AI tools for your goals</span>
              </div>
            </div>
          </div>

          <Button
            onClick={handlePurchase}
            size="lg"
            className="text-lg"
            data-testid="button-shop-ritual-bags"
          >
            Shop Ritual Bags
          </Button>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-20"
        >
          <div className="text-center mb-10">
            <h2 className="font-cormorant text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
              <Sparkles className="w-8 h-8 text-[hsl(var(--liquid-gold))]" />
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { step: "1", text: "Choose your Ritual Bag." },
              { step: "2", text: "Scan the QR code inside to activate your MetaHers Pro Membership." },
              { step: "3", text: "Access your digital tools, Glow-Up sessions, and AI Journal instantly." },
              { step: "4", text: "Enjoy your ritual products while learning to glow in life and online." },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary text-primary font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <p className="text-foreground/80 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Individual Ritual Bags */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {shopProducts.filter(p => p.type === "bag").map((product, index) => {
            const tagInfo = productTags[product.id];
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                className="relative"
              >
                <div className="aspect-square rounded-2xl overflow-hidden mb-4 neon-glow-subtle">
                  <img
                    src={productImages[product.image]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    data-testid={`img-product-${product.id}`}
                  />
                </div>
                
                <div className="editorial-card p-6 relative overflow-hidden">
                  <div className="absolute inset-0 gradient-magenta-fuchsia opacity-5" />
                  <div className="relative z-10">
                    <h3 className="font-cormorant text-2xl font-semibold text-foreground mb-2" data-testid={`text-product-name-${product.id}`}>
                      {tagInfo?.emoji} {product.name}
                    </h3>
                    
                    {tagInfo && (
                      <p className="text-sm text-primary/90 mb-3 italic" data-testid={`text-product-tag-${product.id}`}>
                        {tagInfo.tag}
                      </p>
                    )}
                    
                    {product.scents && product.scents.length > 0 && (
                      <div className="text-sm text-muted-foreground mb-4 font-serif" data-testid={`text-product-scents-${product.id}`}>
                        Scent: {product.scents.join(" • ")}
                      </div>
                    )}
                    
                    <p className="text-sm text-foreground/80 mb-6 leading-relaxed" data-testid={`text-product-description-${product.id}`}>
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="text-3xl font-bold text-primary" data-testid={`text-product-price-${product.id}`}>
                        ${product.price}
                      </div>
                      <Button
                        onClick={handlePurchase}
                        data-testid={`button-buy-${product.id}`}
                      >
                        Add to Bag
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Trio Bundle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="relative mb-20"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-[hsl(var(--liquid-gold))]/30 via-[hsl(var(--cyber-fuchsia))]/20 to-[hsl(var(--liquid-gold))]/30 rounded-2xl blur-lg" />
          <div className="relative editorial-card p-8 neon-glow-gold">
            <div className="absolute inset-0 gradient-teal-gold opacity-5" />
            <div className="relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="aspect-square rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={productImages.bundle}
                    alt="Trio Bundle"
                    className="w-full h-full object-cover"
                    data-testid="img-product-trio-bundle"
                  />
                </div>

                <div>
                  <div className="inline-block bg-[hsl(var(--liquid-gold))] text-background px-4 py-1 rounded-full text-sm font-semibold mb-4 shadow-md" data-testid="badge-bundle-savings">
                    ✨ Save $98 — full MetaHers experience
                  </div>
                  
                  <h2 className="font-cormorant text-4xl font-bold text-foreground mb-4" data-testid="text-bundle-title">
                    Trio Bundle
                  </h2>
                  
                  <p className="text-lg text-foreground/80 mb-6 leading-relaxed" data-testid="text-bundle-description">
                    {shopProducts.find(p => p.id === "trio-bundle")?.description}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-border">
                    <div>
                      <div className="text-sm text-muted-foreground line-through mb-1" data-testid="text-bundle-original-price">
                        $597
                      </div>
                      <div className="text-4xl font-bold text-primary" data-testid="text-bundle-price">
                        $499
                      </div>
                    </div>
                    <Button
                      onClick={handlePurchase}
                      className="bg-[hsl(var(--liquid-gold))] hover:bg-[hsl(var(--liquid-gold))]/90 text-background px-8 py-3 text-lg"
                      data-testid="button-buy-trio-bundle"
                    >
                      Get Bundle
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
          className="text-center"
        >
          <div className="editorial-card p-12 relative overflow-hidden">
            <div className="absolute inset-0 gradient-violet-fuchsia opacity-10" />
            <div className="relative z-10">
              <h2 className="font-cormorant text-4xl md:text-5xl font-bold text-foreground mb-4">
                💖 Glow inside and online.
              </h2>
              <p className="text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
                Join MetaHers — where self-care meets smart tech for women.
              </p>
              <Button
                onClick={handlePurchase}
                size="lg"
                className="text-lg"
                data-testid="button-become-pro-member"
              >
                Become a Pro Member
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
