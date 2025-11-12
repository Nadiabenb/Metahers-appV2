import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { type Ritual, type ShopProduct } from "@shared/schema";
import { PlanBadge } from "./PlanBadge";

interface RitualCardProps {
  ritual: Ritual;
  onClick?: () => void;
}

interface ShopCardProps {
  product: ShopProduct;
  onClick?: () => void;
}

export function RitualCard({ ritual, onClick }: RitualCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="editorial-card p-6 cursor-pointer group hover-elevate transition-all duration-300 relative overflow-hidden"
      data-testid={`card-ritual-${ritual.slug}`}
    >
      <div className="absolute inset-0 gradient-violet-magenta opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
            {ritual.title}
          </h3>
          <PlanBadge tier={ritual.tier} />
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Clock className="w-4 h-4" />
          <span>{ritual.duration_min} min</span>
        </div>

        <p className="text-sm text-foreground/80 line-clamp-2">
          {ritual.summary}
        </p>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">
            {ritual.steps.length} Steps
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ShopCard({ product, onClick }: ShopCardProps) {
  const isBundle = product.type === "bundle";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={`editorial-card p-6 cursor-pointer hover-elevate transition-all duration-300 relative overflow-hidden ${
        isBundle ? "neon-glow-gold" : ""
      }`}
      data-testid={`card-product-${product.id}`}
    >
      {isBundle && (
        <div className="absolute -top-3 -right-3 bg-[hsl(var(--gold-highlight))] text-black px-3 py-1 rounded-full text-xs font-semibold shadow-md">
          Save $98
        </div>
      )}
      
      <div className="absolute inset-0 gradient-magenta-fuchsia opacity-5 transition-opacity duration-300" />

      <div className="relative z-10">
        <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-card/30 backdrop-blur-sm">
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {product.image === "sheikha" && "🌙"}
            {product.image === "serenity" && "🍃"}
            {product.image === "floral" && "🌸"}
            {product.image === "bundle" && "✨"}
          </div>
        </div>

        <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
          {product.name}
        </h3>

        {product.scents && product.scents.length > 0 && (
          <div className="text-sm text-muted-foreground mb-3 font-serif italic">
            {product.scents.join(" • ")}
          </div>
        )}

        <p className="text-sm text-foreground/80 mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="text-2xl font-semibold text-primary">
            ${product.price}
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide">
            {isBundle ? "Collection" : "Ritual Bag"}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
