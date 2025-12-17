import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { VoyageDB } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const LAVENDER = "#D8BFD8";
const PINK = "#E879F9";
const DARK_BG = "#0D0B14";

const CATEGORY_INFO = {
  AI: { color: PINK },
  Crypto: { color: "#FFD700" },
  Web3: { color: "#8B5CF6" },
  AI_Branding: { color: LAVENDER },
};

interface VoyagesRouteMapProps {
  voyages: VoyageDB[];
  isLoading?: boolean;
}

export function VoyagesRouteMap({ voyages, isLoading }: VoyagesRouteMapProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const sortedVoyages = useMemo(() => {
    return voyages.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
  }, [voyages]);

  const selectedVoyage = sortedVoyages.find((v) => v.id === selectedId) || sortedVoyages[0];
  const selectedColor = CATEGORY_INFO[selectedVoyage?.category as keyof typeof CATEGORY_INFO]?.color || PINK;

  // Set default selected on first render
  if (!selectedId && sortedVoyages.length > 0 && !isLoading) {
    setSelectedId(sortedVoyages[0].id);
  }

  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;

  if (isLoading) {
    return (
      <div className="py-24 text-center" style={{ color: "rgba(255,255,255,0.6)" }}>
        Loading voyages...
      </div>
    );
  }

  if (sortedVoyages.length === 0) {
    return (
      <div className="py-24 text-center" style={{ color: "rgba(255,255,255,0.6)" }}>
        No voyages available.
      </div>
    );
  }

  // Desktop: Horizontal route with gentle curve
  if (isDesktop) {
    const nodeSpacing = 120;
    const startX = 40;
    const totalWidth = startX * 2 + sortedVoyages.length * nodeSpacing;
    const svgHeight = 300;
    const lineY = svgHeight / 2;

    // Generate smooth curve path
    let pathData = `M ${startX} ${lineY}`;
    for (let i = 1; i < sortedVoyages.length; i++) {
      const x = startX + i * nodeSpacing;
      const curve = 20 * Math.sin((i * Math.PI) / sortedVoyages.length);
      pathData += ` Q ${x - nodeSpacing / 2} ${lineY + curve} ${x} ${lineY}`;
    }

    return (
      <div className="relative py-24 px-6 lg:px-16 overflow-x-auto">
        <div className="relative min-w-max mx-auto">
          {/* SVG Route Line */}
          <svg width={totalWidth} height={svgHeight} className="absolute top-0 left-0">
            <path
              d={pathData}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
              fill="none"
            />
          </svg>

          {/* Nodes */}
          <div className="relative flex gap-0" style={{ width: `${totalWidth}px`, height: `${svgHeight}px` }}>
            {sortedVoyages.map((voyage, index) => {
              const x = startX + index * nodeSpacing;
              const isSelected = selectedId === voyage.id;
              const color = CATEGORY_INFO[voyage.category as keyof typeof CATEGORY_INFO]?.color || PINK;

              return (
                <motion.button
                  key={voyage.id}
                  className="absolute flex flex-col items-center cursor-pointer"
                  style={{ left: `${x}px`, top: `${lineY - 30}px` }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedId(voyage.id)}
                  data-testid={`node-voyage-${voyage.id}`}
                >
                  {/* Node Circle */}
                  <motion.div
                    className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{
                      background: isSelected ? color : "rgba(255,255,255,0.05)",
                      border: `2px solid ${isSelected ? color : "rgba(255,255,255,0.2)"}`,
                      color: isSelected ? "#0A0A0A" : "rgba(255,255,255,0.6)",
                      boxShadow: isSelected ? `0 0 30px ${color}40` : "none",
                    }}
                    animate={{
                      scale: isSelected ? 1.1 : 1,
                      boxShadow: isSelected
                        ? `0 0 30px ${color}40, 0 0 60px ${color}20`
                        : "0 0 0px rgba(0,0,0,0)",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {voyage.sequenceNumber.toString().padStart(2, "0")}
                  </motion.div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Detail Panel - below the route */}
        <AnimatePresence>
          {selectedVoyage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-32 max-w-2xl mx-auto p-8 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${selectedColor}30`,
              }}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] font-semibold mb-2" style={{ color: selectedColor }}>
                    {selectedVoyage.sequenceNumber.toString().padStart(2, "0")} — {selectedVoyage.category.replace("_", " ")}
                  </p>
                  <h2
                    className="text-3xl font-light text-white"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    {selectedVoyage.title}
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] font-semibold mb-2" style={{ color: selectedColor }}>
                    Theme
                  </p>
                  <p className="text-sm text-white/80">{selectedVoyage.category}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] font-semibold mb-2" style={{ color: selectedColor }}>
                    Format
                  </p>
                  <p className="text-sm text-white/80">{selectedVoyage.venueType?.replace(/_/g, " ") || "In-person"}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.15em] font-semibold mb-2" style={{ color: selectedColor }}>
                  Location
                </p>
                <p className="text-sm text-white/80">{selectedVoyage.location}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.15em] font-semibold mb-2" style={{ color: selectedColor }}>
                  Description
                </p>
                <p className="text-sm text-white/80 leading-relaxed">{selectedVoyage.description}</p>
              </div>

              <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/10">
                <span className="text-xs text-white/60">
                  {(selectedVoyage.maxCapacity - selectedVoyage.currentBookings <= 0
                    ? "Fully Booked"
                    : `${selectedVoyage.maxCapacity - selectedVoyage.currentBookings} spots available`)}
                </span>
                <Button
                  className="px-6 font-semibold uppercase tracking-wider text-xs"
                  style={{ background: selectedColor, color: "#0A0A0A" }}
                  data-testid="button-request-voyage"
                >
                  Request Invitation
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Mobile: Vertical route
  return (
    <div className="relative py-16 px-6">
      <div className="max-w-md mx-auto">
        {/* Vertical line */}
        <div className="absolute left-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

        {/* Nodes */}
        <div className="relative space-y-12">
          {sortedVoyages.map((voyage) => {
            const isSelected = selectedId === voyage.id;
            const color = CATEGORY_INFO[voyage.category as keyof typeof CATEGORY_INFO]?.color || PINK;

            return (
              <motion.button
                key={voyage.id}
                className="relative flex gap-4 text-left cursor-pointer"
                onClick={() => setSelectedId(voyage.id)}
                data-testid={`node-voyage-mobile-${voyage.id}`}
              >
                {/* Node Circle */}
                <motion.div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0"
                  style={{
                    background: isSelected ? color : "rgba(255,255,255,0.05)",
                    border: `2px solid ${isSelected ? color : "rgba(255,255,255,0.2)"}`,
                    color: isSelected ? "#0A0A0A" : "rgba(255,255,255,0.6)",
                  }}
                  animate={{
                    scale: isSelected ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {voyage.sequenceNumber.toString().padStart(2, "0")}
                </motion.div>

                {/* Title */}
                <div className="pt-2 flex-1">
                  <p
                    className="text-sm font-semibold text-white group-hover:text-white transition-colors"
                    style={{
                      color: isSelected ? color : "rgba(255,255,255,0.8)",
                    }}
                  >
                    {voyage.title}
                  </p>
                  <p className="text-xs text-white/60 mt-1">{voyage.category.replace("_", " ")}</p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Detail Panel - Mobile */}
        <AnimatePresence>
          {selectedVoyage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-12 p-6 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${selectedColor}30`,
              }}
            >
              <div>
                <p className="text-xs uppercase tracking-[0.2em] font-semibold mb-2" style={{ color: selectedColor }}>
                  {selectedVoyage.sequenceNumber.toString().padStart(2, "0")} — {selectedVoyage.category.replace("_", " ")}
                </p>
                <h2 className="text-2xl font-light text-white mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
                  {selectedVoyage.title}
                </h2>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] font-semibold mb-1" style={{ color: selectedColor }}>
                    Theme
                  </p>
                  <p className="text-xs text-white/80">{selectedVoyage.category}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] font-semibold mb-1" style={{ color: selectedColor }}>
                    Format
                  </p>
                  <p className="text-xs text-white/80">{selectedVoyage.venueType?.replace(/_/g, " ") || "In-person"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] font-semibold mb-1" style={{ color: selectedColor }}>
                    Location
                  </p>
                  <p className="text-xs text-white/80">{selectedVoyage.location}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.15em] font-semibold mb-2" style={{ color: selectedColor }}>
                  Description
                </p>
                <p className="text-xs text-white/80 leading-relaxed">{selectedVoyage.description}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-[10px] text-white/60">
                  {selectedVoyage.maxCapacity - selectedVoyage.currentBookings <= 0
                    ? "Fully Booked"
                    : `${selectedVoyage.maxCapacity - selectedVoyage.currentBookings} spots`}
                </span>
                <Button
                  size="sm"
                  className="px-4 font-semibold uppercase tracking-wider text-[10px] h-8"
                  style={{ background: selectedColor, color: "#0A0A0A" }}
                  data-testid="button-request-voyage-mobile"
                >
                  Request
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
