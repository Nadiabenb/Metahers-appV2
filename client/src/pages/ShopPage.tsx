import { motion } from "framer-motion";
import { shopProducts } from "@shared/schema";
import { ShopCard } from "@/components/MenuCard";
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

  const handlePurchase = () => {
    window.open("https://metahers.gumroad.com/l/metahers", "_blank");
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-16"
        >
          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-gradient-gold mb-6" data-testid="text-page-title">
            Unwrap your ritual
          </h1>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto leading-relaxed" data-testid="text-page-subtitle">
            Each MetaHers bag blends beauty, scent, and AI intelligence. 
            Every set includes a rare crown candle that unlocks your full AI Squad.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {shopProducts.filter(p => p.type === "bag").map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
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
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-2" data-testid={`text-product-name-${product.id}`}>
                    {product.name}
                  </h3>
                  
                  {product.scents && product.scents.length > 0 && (
                    <div className="text-sm text-muted-foreground mb-4 font-serif italic" data-testid={`text-product-scents-${product.id}`}>
                      Scent: {product.scents.join(" • ")}
                    </div>
                  )}
                  
                  <p className="text-sm text-foreground/80 mb-6" data-testid={`text-product-description-${product.id}`}>
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="text-3xl font-bold text-primary" data-testid={`text-product-price-${product.id}`}>
                      ${product.price}
                    </div>
                    <button
                      onClick={handlePurchase}
                      className="rounded-full bg-primary text-primary-foreground px-6 py-2 font-semibold hover-elevate active-elevate-2 transition-all duration-200"
                      data-testid={`button-buy-${product.id}`}
                    >
                      Purchase
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="relative"
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
                    Best Value - Save $98
                  </div>
                  
                  <h2 className="font-serif text-4xl font-bold text-foreground mb-4" data-testid="text-bundle-title">
                    Trio Bundle
                  </h2>
                  
                  <p className="text-lg text-foreground/80 mb-6" data-testid="text-bundle-description">
                    Get all three Ritual Bags in one luxurious collection. 
                    The complete MetaHers experience with three unique scent journeys 
                    and full access to your AI Squad.
                  </p>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-2 text-foreground/80">
                      <div className="w-2 h-2 rounded-full bg-[hsl(var(--aurora-teal))]" />
                      <span>Sheikha, Serenity & Floral Ritual Bags</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground/80">
                      <div className="w-2 h-2 rounded-full bg-[hsl(var(--aurora-teal))]" />
                      <span>18-piece collection + 3 crown candles</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground/80">
                      <div className="w-2 h-2 rounded-full bg-[hsl(var(--aurora-teal))]" />
                      <span>Full AI Squad access via MetaMuse</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-border">
                    <div>
                      <div className="text-sm text-muted-foreground line-through mb-1" data-testid="text-bundle-original-price">
                        $597
                      </div>
                      <div className="text-4xl font-bold text-primary" data-testid="text-bundle-price">
                        $499
                      </div>
                    </div>
                    <button
                      onClick={handlePurchase}
                      className="rounded-full bg-[hsl(var(--liquid-gold))] text-background px-8 py-3 font-semibold text-lg hover-elevate active-elevate-2 transition-all duration-200 shadow-lg"
                      data-testid="button-buy-trio-bundle"
                    >
                      Get Bundle
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
