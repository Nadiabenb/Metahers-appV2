import { useState, useEffect } from "react";
import { useScroll, useTransform } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { VoyageDB } from "@shared/schema";
import { SEO } from "@/components/SEO";

const DARK_BG = "#0D0B14";
const PINK = "#E879F9";
const LAVENDER = "#D8BFD8";

const CATEGORY_INFO = {
  AI: { color: PINK, label: "AI Mastery" },
  Crypto: { color: "#FFD700", label: "Crypto" },
  Web3: { color: "#8B5CF6", label: "Web3" },
  AI_Branding: { color: LAVENDER, label: "AI Branding" },
};

function HeroSection() {
  const [showContent, setShowContent] = useState(false);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.section
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: DARK_BG, opacity }}
    >
      {/* Ambient background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${PINK}10 0%, transparent 70%)`,
        }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl px-6">
        <AnimatePresence>
          {showContent && (
            <>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm uppercase tracking-[0.3em] mb-8"
                style={{ color: PINK }}
              >
                Twelve Transformational Experiences
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-6xl lg:text-7xl font-light mb-6 text-white"
                style={{ fontFamily: "Playfair Display, serif", lineHeight: 1.2 }}
              >
                Your Voyage
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg font-light mb-12"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                Journey through intimate, invitation-only experiences designed for women stepping boldly into the future.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <button
                  onClick={() => {
                    document.getElementById("voyages-grid")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="group inline-flex items-center gap-3 px-8 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider"
                  style={{ background: `linear-gradient(135deg, ${PINK}, ${LAVENDER})`, color: "#0A0A0A" }}
                  data-testid="button-explore-voyages"
                >
                  Explore Voyages
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          <span className="text-xs uppercase tracking-[0.2em]">Scroll to explore</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

export default function VoyagesPage() {
  const { data: voyages, isLoading } = useQuery<VoyageDB[]>({
    queryKey: ["/api/voyages"],
  });

  const [selectedVoyage, setSelectedVoyage] = useState<VoyageDB | null>(null);

  const sortedVoyages = voyages?.sort((a, b) => a.sequenceNumber - b.sequenceNumber) || [];

  useEffect(() => {
    if (sortedVoyages.length > 0 && !selectedVoyage) {
      setSelectedVoyage(sortedVoyages[0]);
    }
  }, [sortedVoyages]);

  const selectedColor =
    selectedVoyage && CATEGORY_INFO[selectedVoyage.category as keyof typeof CATEGORY_INFO]
      ? CATEGORY_INFO[selectedVoyage.category as keyof typeof CATEGORY_INFO].color
      : PINK;

  return (
    <div className="min-h-screen" style={{ background: DARK_BG }}>
      <SEO
        title="Voyages | MetaHers Mind Spa"
        description="Twelve transformational experiences designed for women stepping into the future, thoughtfully, together."
      />

      <HeroSection />

      {/* Voyages Grid Section */}
      <section id="voyages-grid" className="relative py-32 px-6 lg:px-16" style={{ background: DARK_BG }}>
        {/* Subtle background glow */}
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${LAVENDER}05 0%, transparent 70%)`,
            filter: "blur(80px)",
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        />

        <div className="relative max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20 text-center"
          >
            <p className="text-sm uppercase tracking-[0.2em] mb-4" style={{ color: PINK }}>
              The Collection
            </p>
            <h2 className="text-5xl font-light text-white mb-6" style={{ fontFamily: "Playfair Display, serif" }}>
              Twelve Journeys
            </h2>
            <p className="text-lg font-light max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.7)" }}>
              Each voyage is carefully crafted to inspire transformation. Click any journey to explore its details.
            </p>
          </motion.div>

          {/* Voyages Grid - 3 columns */}
          {isLoading ? (
            <div className="text-center py-24" style={{ color: "rgba(255,255,255,0.5)" }}>
              Loading your voyages...
            </div>
          ) : sortedVoyages.length === 0 ? (
            <div className="text-center py-24" style={{ color: "rgba(255,255,255,0.5)" }}>
              No voyages available yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {sortedVoyages.map((voyage, index) => {
                const categoryInfo =
                  CATEGORY_INFO[voyage.category as keyof typeof CATEGORY_INFO] || CATEGORY_INFO.AI;
                const isSelected = selectedVoyage?.id === voyage.id;

                return (
                  <motion.button
                    key={voyage.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedVoyage(voyage)}
                    className="text-left group relative overflow-hidden rounded-lg p-8 h-80 flex flex-col justify-between transition-all duration-300"
                    style={{
                      background: isSelected
                        ? `linear-gradient(135deg, ${categoryInfo.color}15 0%, ${categoryInfo.color}05 100%)`
                        : "rgba(255,255,255,0.03)",
                      border: isSelected ? `1px solid ${categoryInfo.color}40` : "1px solid rgba(255,255,255,0.1)",
                    }}
                    data-testid={`voyage-card-${voyage.id}`}
                  >
                    {/* Background glow on hover */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        background: `radial-gradient(circle at 50% 50%, ${categoryInfo.color}10 0%, transparent 70%)`,
                      }}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />

                    {/* Content */}
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <span
                          className="text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full"
                          style={{
                            background: `${categoryInfo.color}20`,
                            color: categoryInfo.color,
                          }}
                        >
                          {voyage.sequenceNumber.toString().padStart(2, "0")}
                        </span>
                        <span
                          className="text-xs uppercase tracking-[0.15em] font-semibold"
                          style={{ color: categoryInfo.color }}
                        >
                          {categoryInfo.label}
                        </span>
                      </div>

                      <h3
                        className="text-2xl font-light text-white mb-4 group-hover:text-white transition-colors"
                        style={{ fontFamily: "Playfair Display, serif" }}
                      >
                        {voyage.title}
                      </h3>

                      <p className="text-sm font-light" style={{ color: "rgba(255,255,255,0.6)" }}>
                        {voyage.location}
                      </p>
                    </div>

                    {/* Arrow indicator */}
                    <div className="relative z-10 flex items-center gap-2" style={{ color: categoryInfo.color }}>
                      <span className="text-xs uppercase tracking-[0.15em] font-semibold">View journey</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedVoyage && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedVoyage(null)}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl p-8 lg:p-12"
              style={{ background: DARK_BG, border: `1px solid ${selectedColor}30` }}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedVoyage(null)}
                className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-lg transition-colors"
                data-testid="button-close-voyage-modal"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Content */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <span
                    className="text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full"
                    style={{
                      background: `${selectedColor}20`,
                      color: selectedColor,
                    }}
                  >
                    {selectedVoyage.sequenceNumber.toString().padStart(2, "0")}
                  </span>
                  <span className="text-xs uppercase tracking-[0.15em] font-semibold" style={{ color: selectedColor }}>
                    {CATEGORY_INFO[selectedVoyage.category as keyof typeof CATEGORY_INFO]?.label || selectedVoyage.category}
                  </span>
                </div>

                <h2
                  className="text-4xl font-light text-white mb-6"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  {selectedVoyage.title}
                </h2>

                <p className="text-lg font-light mb-8" style={{ color: "rgba(255,255,255,0.75)" }}>
                  {selectedVoyage.description}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-white/10">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] font-semibold mb-2" style={{ color: selectedColor }}>
                    Format
                  </p>
                  <p className="text-white">{selectedVoyage.venueType?.replace(/_/g, " ") || "In-person"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] font-semibold mb-2" style={{ color: selectedColor }}>
                    Location
                  </p>
                  <p className="text-white">{selectedVoyage.location}</p>
                </div>
              </div>

              {/* CTA */}
              <div className="flex items-center justify-between">
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {selectedVoyage.maxCapacity - selectedVoyage.currentBookings > 0
                    ? `${selectedVoyage.maxCapacity - selectedVoyage.currentBookings} spots available`
                    : "Fully Booked"}
                </p>
                <Button
                  className="px-8 font-semibold uppercase tracking-wider text-sm"
                  style={{ background: selectedColor, color: "#0A0A0A" }}
                  data-testid="button-request-voyage"
                >
                  Request Invitation
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
