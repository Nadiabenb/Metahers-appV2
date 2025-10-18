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
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="glass-card rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group"
      data-testid={`card-ritual-${ritual.slug}`}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-serif text-xl font-semibold text-onyx group-hover:text-primary transition-colors">
          {ritual.title}
        </h3>
        <PlanBadge tier={ritual.tier} />
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
        <Clock className="w-4 h-4" />
        <span>{ritual.duration_min} min</span>
      </div>

      <p className="text-sm text-foreground/70 line-clamp-2">
        {ritual.summary}
      </p>

      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="text-xs text-muted-foreground uppercase tracking-wide">
          {ritual.steps.length} Steps
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
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={`glass-card rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer ${
        isBundle ? "border-2 border-gold/30" : ""
      }`}
      data-testid={`card-product-${product.id}`}
    >
      {isBundle && (
        <div className="absolute -top-3 -right-3 bg-gold text-onyx px-3 py-1 rounded-full text-xs font-semibold shadow-md">
          Save $98
        </div>
      )}

      <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-champagne">
        <div className="w-full h-full flex items-center justify-center text-6xl">
          {product.image === "sheikha" && "🌙"}
          {product.image === "serenity" && "🍃"}
          {product.image === "floral" && "🌸"}
          {product.image === "bundle" && "✨"}
        </div>
      </div>

      <h3 className="font-serif text-xl font-semibold text-onyx mb-2">
        {product.name}
      </h3>

      {product.scents && product.scents.length > 0 && (
        <div className="text-sm text-muted-foreground mb-3 font-serif italic">
          {product.scents.join(" • ")}
        </div>
      )}

      <p className="text-sm text-foreground/70 mb-4 line-clamp-2">
        {product.description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-white/20">
        <div className="text-2xl font-semibold text-onyx">
          ${product.price}
        </div>
        <div className="text-xs text-muted-foreground uppercase tracking-wide">
          {isBundle ? "Collection" : "Ritual Bag"}
        </div>
      </div>
    </motion.div>
  );
}
