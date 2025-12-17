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

  // Desktop: Spiral/Looped route
  if (isDesktop) {
    const centerX = 600;
    const centerY = 400;
    const maxRadius = 350;
    const minRadius = 80;
    const radiusStep = (maxRadius - minRadius) / (sortedVoyages.length - 1);

    // Calculate positions in a spiral
    const nodePositions = sortedVoyages.map((voyage, index) => {
      const angle = (index * 360) / sortedVoyages.length * (Math.PI / 180) + (index * 20) * (Math.PI / 180);
      const radius = minRadius + index * radiusStep;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      return { x, y };
    });

    // Create SVG path connecting all nodes
    let pathData = `M ${nodePositions[0].x} ${nodePositions[0].y}`;
    for (let i = 1; i < nodePositions.length; i++) {
      const prev = nodePositions[i - 1];
      const curr = nodePositions[i];
      const cpx = (prev.x + curr.x) / 2;
      const cpy = (prev.y + curr.y) / 2;
      pathData += ` Q ${cpx} ${cpy} ${curr.x} ${curr.y}`;
    }
    // Close the loop
    const last = nodePositions[nodePositions.length - 1];
    const first = nodePositions[0];
    const cpx = (last.x + first.x) / 2;
    const cpy = (last.y + first.y) / 2;
    pathData += ` Q ${cpx} ${cpy} ${first.x} ${first.y}`;

    const svgWidth = 1200;
    const svgHeight = 800;

    return (
      <div className="relative py-24 px-6 lg:px-16 flex flex-col items-center">
        {/* SVG Canvas with route line and nodes */}
        <div className="relative w-full flex justify-center">
          <svg width={svgWidth} height={svgHeight} className="relative">
            {/* Decorative background gradient */}
            <defs>
              <radialGradient id="routeGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={`${PINK}10`} />
                <stop offset="100%" stopColor={`${PINK}00`} />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background glow */}
            <circle cx={centerX} cy={centerY} r={maxRadius + 50} fill="url(#routeGradient)" />

            {/* Route line with gradient */}
            <path
              d={pathData}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="2"
              fill="none"
              filter="url(#glow)"
              style={{ opacity: 0.8 }}
            />

            {/* Render nodes */}
            {sortedVoyages.map((voyage, index) => {
              const pos = nodePositions[index];
              const isSelected = selectedId === voyage.id;
              const color = CATEGORY_INFO[voyage.category as keyof typeof CATEGORY_INFO]?.color || PINK;

              return (
                <g key={voyage.id}>
                  {/* Node glow (when selected) */}
                  {isSelected && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={28}
                      fill={color}
                      opacity="0.15"
                      style={{
                        animation: "pulse 2s ease-in-out infinite",
                      }}
                    />
                  )}

                  {/* Node circle */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={20}
                    fill={isSelected ? color : "rgba(255,255,255,0.05)"}
                    stroke={isSelected ? color : "rgba(255,255,255,0.2)"}
                    strokeWidth="2"
                    style={{ cursor: "pointer", transition: "all 0.3s ease" }}
                    onClick={() => setSelectedId(voyage.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.15)";
                      e.currentTarget.style.filter = `drop-shadow(0 0 15px ${color})`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.filter = "none";
                    }}
                  />

                  {/* Node number text */}
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dy="0.3em"
                    fontSize="12"
                    fontWeight="bold"
                    fill={isSelected ? "#0A0A0A" : "rgba(255,255,255,0.7)"}
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    {voyage.sequenceNumber.toString().padStart(2, "0")}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Detail Panel - below the route */}
        <AnimatePresence>
          {selectedVoyage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-16 max-w-2xl mx-auto p-8 rounded-2xl w-full"
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

        <style>{`
          @keyframes pulse {
            0%, 100% { r: 28; opacity: 0.15; }
            50% { r: 35; opacity: 0.25; }
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
