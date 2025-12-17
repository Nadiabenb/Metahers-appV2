import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { VoyageDB } from "@shared/schema";
import { Button } from "@/components/ui/button";

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
  const [isDesktop, setIsDesktop] = useState(true);

  const sortedVoyages = useMemo(() => {
    return voyages.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
  }, [voyages]);

  const selectedVoyage = sortedVoyages.find((v) => v.id === selectedId) || sortedVoyages[0];
  const selectedColor = CATEGORY_INFO[selectedVoyage?.category as keyof typeof CATEGORY_INFO]?.color || PINK;

  useEffect(() => {
    if (!selectedId && sortedVoyages.length > 0 && !isLoading) {
      setSelectedId(sortedVoyages[0].id);
    }
  }, [sortedVoyages, selectedId, isLoading]);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // Desktop: Clean horizontal flow with elegant curve
  if (isDesktop) {
    const padding = 80;
    const svgWidth = 1400;
    const svgHeight = 280;
    const nodesPerRow = 6;
    const spacingX = (svgWidth - padding * 2) / (nodesPerRow - 1);
    const rowHeight = 100;
    const topY = 60;
    const bottomY = topY + rowHeight;

    // Position nodes in two clean rows
    const nodePositions = sortedVoyages.map((voyage, index) => {
      const isTopRow = index < nodesPerRow;
      const posInRow = isTopRow ? index : index - nodesPerRow;
      const x = padding + posInRow * spacingX;
      const y = isTopRow ? topY : bottomY;
      return { x, y };
    });

    // Create smooth SVG path connecting nodes
    let pathData = `M ${nodePositions[0].x} ${nodePositions[0].y}`;
    for (let i = 1; i < nodePositions.length; i++) {
      const curr = nodePositions[i];
      const prev = nodePositions[i - 1];
      const midX = (prev.x + curr.x) / 2;
      // Create smooth curve with subtle wave
      const waveOffset = i % 2 === 0 ? 30 : -30;
      pathData += ` Q ${midX} ${(prev.y + curr.y) / 2 + waveOffset} ${curr.x} ${curr.y}`;
    }

    return (
      <div className="relative py-24 px-6 lg:px-16 flex flex-col items-center">
        <svg width={svgWidth} height={svgHeight} className="relative" style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={`${PINK}40`} />
              <stop offset="50%" stopColor={`${LAVENDER}40`} />
              <stop offset="100%" stopColor={`${PINK}40`} />
            </linearGradient>
            <filter id="pathGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Connection line */}
          <path
            d={pathData}
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            filter="url(#pathGlow)"
            opacity="0.8"
          />

          {/* Nodes */}
          {sortedVoyages.map((voyage, index) => {
            const pos = nodePositions[index];
            const isSelected = selectedId === voyage.id;
            const color = CATEGORY_INFO[voyage.category as keyof typeof CATEGORY_INFO]?.color || PINK;

            return (
              <g key={voyage.id}>
                {/* Outer glow ring (selected) */}
                {isSelected && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={26}
                    fill="none"
                    stroke={color}
                    strokeWidth="1"
                    opacity="0.4"
                    style={{
                      animation: "pulse-ring 2s ease-in-out infinite",
                    }}
                  />
                )}

                {/* Node circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={18}
                  fill={isSelected ? color : "rgba(255,255,255,0.08)"}
                  stroke={isSelected ? color : "rgba(255,255,255,0.25)"}
                  strokeWidth="2"
                  style={{ cursor: "pointer", transition: "all 0.3s ease" }}
                  onClick={() => setSelectedId(voyage.id)}
                  onMouseEnter={(e) => {
                    const target = e.currentTarget;
                    target.style.r = "22";
                    target.style.filter = `drop-shadow(0 0 12px ${color})`;
                  }}
                  onMouseLeave={(e) => {
                    const target = e.currentTarget;
                    target.style.r = isSelected ? "18" : "18";
                    target.style.filter = "none";
                  }}
                />

                {/* Number text */}
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dy="0.3em"
                  fontSize="13"
                  fontWeight="bold"
                  fill={isSelected ? "#0A0A0A" : "rgba(255,255,255,0.7)"}
                  style={{ pointerEvents: "none", userSelect: "none" }}
                  fontFamily="Inter, sans-serif"
                >
                  {voyage.sequenceNumber.toString().padStart(2, "0")}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Detail Panel */}
        <AnimatePresence>
          {selectedVoyage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-20 max-w-2xl mx-auto p-8 rounded-2xl w-full"
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
                  {selectedVoyage.maxCapacity - selectedVoyage.currentBookings <= 0
                    ? "Fully Booked"
                    : `${selectedVoyage.maxCapacity - selectedVoyage.currentBookings} spots available`}
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

        <style>{`
          @keyframes pulse-ring {
            0%, 100% { r: 26; stroke-width: 1; opacity: 0.4; }
            50% { r: 32; stroke-width: 1; opacity: 0.1; }
          }
        `}</style>
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
