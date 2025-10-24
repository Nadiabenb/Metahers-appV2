import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { shopProducts } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Sparkles, CheckCircle2, ShoppingBag, Package, Flame, Droplets, Flower2, Shirt, Wind, Blend, Gem, Zap } from "lucide-react";

// Product image mapping - 3 images per product for carousel
const productImageSets: Record<string, string[]> = {
  "sheikha-bag": [
    "https://i.ibb.co/wMqxK7r/CC6D738B-75D3-449A-A2CD-AE13833711A4-1761327881533.png",
    "https://i.ibb.co/zmJGpSZ/236F6505-F528-4C27-8C09-8BD994F646AE-1761327881533.png",
    "https://i.ibb.co/fDbk8Cm/53214468-D744-44D4-B67E-7B255CCAF54B-3-1761327881533.png",
  ],
  "serenity-bag": [
    "https://i.ibb.co/Wp5rKGt/25B5A72F-9B01-4E01-A5DB-DEC993F39104-1761327881533.png",
    "https://i.ibb.co/fMWJ75y/61904215-07FB-4E6B-9B18-F1CF23F3A7D2-1761327881533.png",
    "https://i.ibb.co/GcLLLj2/F2CBAB9F-EC8C-4122-9D4C-F90589A9B70D-1761327881533.png",
  ],
  "floral-bag": [
    "https://i.ibb.co/jG5TZYK/F789EA16-979A-4C2E-A621-682F00F3A8BC-1761327881533.png",
    "https://i.ibb.co/25qSzDZ/147F88B6-8B76-424A-BFF2-2B04F4B3E886-1761327881533.png",
    "https://i.ibb.co/cwrKrcP/D9A54C83-6671-4B61-A992-033C10310041-1761327881533.png",
  ],
};

interface ProductCarouselProps {
  images: string[];
  productId: string;
  productName: string;
}

function ProductCarousel({ images, productId, productName }: ProductCarouselProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Auto-cycle through images on hover
  const handleMouseEnter = () => {
    setIsHovering(true);
    let index = 0;
    intervalRef.current = window.setInterval(() => {
      index = (index + 1) % images.length;
      setCurrentImage(index);
    }, 1000); // Change image every 1 second
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setCurrentImage(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <div
      className="relative aspect-square rounded-2xl overflow-hidden neon-glow-subtle cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-testid={`carousel-${productId}`}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={currentImage}
          src={images[currentImage]}
          alt={`${productName} - View ${currentImage + 1}`}
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          data-testid={`img-product-${productId}-${currentImage}`}
        />
      </AnimatePresence>

      {/* Image indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentImage
                ? "bg-white w-6"
                : "bg-white/40"
            }`}
            data-testid={`indicator-${productId}-${index}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function ShopPage() {
  const handlePurchase = () => {
    window.open("https://metahers.gumroad.com/l/metahers", "_blank");
  };

  const bags = shopProducts.filter(p => p.type === "bag");

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Drop 001 Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-4 neon-glow-violet">
            <Package className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium tracking-wide uppercase">
              Limited Edition
            </span>
          </div>

          <h1 className="font-serif text-5xl md:text-6xl font-bold text-gradient-violet mb-4" data-testid="text-page-title">
            MetaHers Mind Spa<br/>Drop 001
          </h1>
          <p className="text-xl text-foreground/90 max-w-3xl mx-auto leading-relaxed mb-6" data-testid="text-page-subtitle">
            Handmade. Intentional. Soul-led.<br/>
            18 exclusive Ritual Kits • 6 of each design • AI-guided experiences
          </p>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Each bag unlocks a mystery AI ritual + instant MetaHers Pro Membership
          </p>
        </motion.div>

        {/* What's Inside Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-16"
        >
          <div className="editorial-card p-8 relative overflow-hidden">
            <div className="absolute inset-0 gradient-violet-fuchsia opacity-5" />
            <div className="relative z-10">
              <h2 className="font-cormorant text-3xl font-bold text-foreground mb-6 text-center flex items-center justify-center gap-3">
                <Gem className="w-8 h-8 text-[hsl(var(--liquid-gold))]" />
                Inside Every MetaHers Ritual Bag
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {[
                  { Icon: Flame, text: "Mystery Reveal Ritual Candle" },
                  { Icon: Droplets, text: "Botanical Bath Tea" },
                  { Icon: Flower2, text: "Handmade Loofah Soap" },
                  { Icon: Sparkles, text: "Whipped Body Butter" },
                  { Icon: Wind, text: "Body & Hair Mist" },
                  { Icon: Blend, text: "Perfume Oil Roll-On" },
                  { Icon: ShoppingBag, text: "Reusable Jute Bag" },
                  { Icon: Zap, text: "AI Ritual Unlock (QR)" },
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <item.Icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-foreground/80">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Individual Ritual Bags */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {bags.map((product, index) => {
            const images = productImageSets[product.id] || [];
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                className="relative"
              >
                {/* Limited Edition Badge */}
                <div className="absolute -top-3 -right-3 z-20 bg-[hsl(var(--liquid-gold))] text-background px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  Only {product.stock} left
                </div>

                <ProductCarousel
                  images={images}
                  productId={product.id}
                  productName={product.name}
                />
                
                <div className="editorial-card p-6 mt-4 relative overflow-hidden">
                  <div className="absolute inset-0 gradient-magenta-fuchsia opacity-5" />
                  <div className="relative z-10">
                    <h3 className="font-cormorant text-2xl font-semibold text-foreground mb-2" data-testid={`text-product-name-${product.id}`}>
                      {product.name}
                    </h3>
                    
                    {product.theme && (
                      <p className="text-sm text-primary/90 mb-3 italic" data-testid={`text-product-theme-${product.id}`}>
                        {product.theme}
                      </p>
                    )}
                    
                    {product.scents && product.scents.length > 0 && (
                      <div className="text-sm text-muted-foreground mb-4 font-serif" data-testid={`text-product-scents-${product.id}`}>
                        Scent notes: {product.scents.join(" • ")}
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
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Get Yours
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* AI Ritual Experience Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="mb-16"
        >
          <div className="editorial-card p-8 relative overflow-hidden">
            <div className="absolute inset-0 gradient-teal-gold opacity-5" />
            <div className="relative z-10">
              <h2 className="font-cormorant text-3xl font-bold text-foreground mb-6 text-center flex items-center justify-center gap-3">
                <Zap className="w-8 h-8 text-[hsl(var(--cyber-fuchsia))]" />
                What's an AI-Guided Ritual?
              </h2>
              <p className="text-center text-foreground/80 mb-8 max-w-2xl mx-auto">
                Each candle reveals a secret symbol. Scan the QR code inside your bag to unlock one of the following AI experiences:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {[
                  { title: "Daily Glow AI", desc: "Journaling + Vision Prompts" },
                  { title: "Cosmic Birth Chart", desc: "GPT-powered astrology reading" },
                  { title: "Affirmation Sequences", desc: "Custom voice & tone for you" },
                  { title: "Crown Unlock", desc: "Access full AI Squad + 1:1 with founder" },
                  { title: "VIP Circle Access", desc: "Exclusive MetaHers community" },
                ].map((ritual, index) => (
                  <div key={index} className="text-center p-4 rounded-lg bg-card/50 border border-border/40">
                    <h4 className="font-semibold text-foreground mb-2">{ritual.title}</h4>
                    <p className="text-sm text-muted-foreground">{ritual.desc}</p>
                  </div>
                ))}
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
              <h2 className="font-cormorant text-4xl md:text-5xl font-bold text-foreground mb-4 flex items-center justify-center gap-3 flex-wrap">
                <Sparkles className="w-10 h-10 text-primary" />
                Handmade for your glow-up journey
              </h2>
              <p className="text-xl text-foreground/80 mb-6 max-w-2xl mx-auto">
                Drop 001 • 18 kits only • Each purchase unlocks MetaHers Pro
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                Limited edition. Intentionally crafted. Soul-led wellness meets AI-powered growth.
              </p>
              <Button
                onClick={handlePurchase}
                size="lg"
                className="text-lg"
                data-testid="button-shop-now"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Shop Drop 001
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
