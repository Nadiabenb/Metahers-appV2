import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";
import { SEO } from "@/components/SEO";
import MetahersHeroVideo from "@/components/MetahersHeroVideo";
import { useRef, useState } from "react";
import { useLocation } from "wouter";

// Brand colors
const GOLD = "#C9A96E";
const GOLD_HOVER = "#B8943D";
const NAVY = "#1A1A2E";
const BLUSH = "#F2E0D6";
const BODY = "#2D2D3A";
const MUTED = "#6B6B7B";
const ROSE = "#8B2252";
const WARM_CARD = "#E8D5C4";

// Fade-up animation on scroll entry
function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// Shared label style (gold uppercase)
function GoldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{ color: GOLD, letterSpacing: "0.12em", fontWeight: 600, fontSize: "0.75rem" }}
      className="uppercase mb-3"
    >
      {children}
    </p>
  );
}

// ── Section 1: Hero ──────────────────────────────────────────────
function HeroSection({ onNavigate }: { onNavigate: (p: string) => void }) {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        width: "100%",
        height: "calc(100vh - 64px)",
        minHeight: 560,
        maxHeight: 780,
        background: "#FEFEFE",
      }}
      data-testid="section-hero"
    >
      <section
        aria-hidden="true"
        style={{ position: "absolute", inset: 0 }}
      >
        <MetahersHeroVideo />
      </section>

      <div
        className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center px-5 pb-10 text-center sm:pb-14"
        style={{
          background:
            "linear-gradient(180deg, rgba(254,254,254,0) 0%, rgba(254,254,254,0.94) 42%, #FEFEFE 100%)",
        }}
      >
        <p
          className="mb-2 text-xs font-semibold uppercase"
          style={{ color: GOLD, letterSpacing: "0.12em" }}
        >
          Free AI Starter Kit
        </p>
        <p
          className="mb-2 max-w-2xl text-base sm:text-lg"
          style={{ color: MUTED, fontFamily: "Inter, sans-serif", fontWeight: 300 }}
        >
          Get your free AI Starter Kit, agent match, and curated toolkit.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => onNavigate("/signup")}
            className="px-8 py-3 rounded-sm font-semibold transition-colors"
            style={{
              background: GOLD,
              color: NAVY,
              letterSpacing: "0.08em",
              fontSize: "0.875rem",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = GOLD_HOVER)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = GOLD)
            }
            data-testid="button-join-inner-circle"
          >
            Start Free
          </button>
          <button
            onClick={() => onNavigate("/concierge")}
            className="px-8 py-3 rounded-sm font-semibold transition-colors"
            style={{
              border: `1.5px solid ${GOLD}`,
              color: NAVY,
              background: "transparent",
              letterSpacing: "0.08em",
              fontSize: "0.875rem",
            }}
            data-testid="button-try-agent-free"
          >
            Try an Agent Free
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Section 2: Social Proof Bar ─────────────────────────────────
function SocialProofBar() {
  return (
    <section
      className="py-6 px-6 border-y"
      style={{ borderColor: "#E5D9CE", background: WARM_CARD }}
    >
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-6 text-sm">
        <span style={{ color: MUTED }}>As featured in</span>
        <span
          className="font-semibold"
          style={{ color: BODY, letterSpacing: "0.04em" }}
        >
          NBC News
        </span>
        <span style={{ color: GOLD }}>·</span>
        <span
          className="font-semibold"
          style={{ color: BODY, letterSpacing: "0.04em" }}
        >
          Tunisian National Radio
        </span>
      </div>
    </section>
  );
}

// ── Section 3: Four Pillars ──────────────────────────────────────
const PILLARS = [
  {
    title: "Learn AI",
    body: "Master AI tools with zero technical background.",
    icon: "✦",
  },
  {
    title: "Build with AI",
    body: "Create content, systems, and workflows that run on autopilot.",
    icon: "⬡",
  },
  {
    title: "Monetize with AI",
    body: "Turn AI skills into offers, revenue, and freedom.",
    icon: "◈",
  },
  {
    title: "Brand with AI",
    body: "Build a personal brand that commands attention.",
    icon: "◉",
  },
];

function PillarsSection() {
  return (
    <section className="py-24 px-6" style={{ background: "#FEFEFE" }}>
      <div className="max-w-5xl mx-auto">
        <FadeUp className="text-center mb-14">
          <GoldLabel>Why MetaHers</GoldLabel>
          <h2
            style={{
              fontFamily: "Playfair Display, Georgia, serif",
              fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
              color: NAVY,
              fontWeight: 700,
            }}
          >
            Not another tech community.
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map((p, i) => (
            <FadeUp key={p.title} delay={i * 0.1}>
              <div
                className="p-6 rounded-sm h-full"
                style={{
                  background: i % 2 === 0 ? WARM_CARD : BLUSH,
                  border: `1px solid #DDD0C4`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-4 text-lg"
                  style={{ background: GOLD, color: NAVY }}
                >
                  {p.icon}
                </div>
                <h3
                  className="font-semibold mb-2 text-base"
                  style={{ color: NAVY }}
                >
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
                  {p.body}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 4: Agent Suite ───────────────────────────────────────
const AGENTS = [
  { name: "Bella", role: "Digital Artist & Creative Director", accent: GOLD },
  { name: "Nova", role: "Build & Automation Specialist", accent: ROSE },
  { name: "Luna", role: "Marketing Maestro", accent: "#2A8E8E" },
  { name: "Sage", role: "AI Strategy & Learning Guide", accent: "#3A5FA0" },
  { name: "Noor", role: "Creative Ghostwriter", accent: "#B07A20" },
  { name: "Vita", role: "AI Wellness Coach", accent: "#C0533A" },
];

function AgentsSection({ onNavigate }: { onNavigate: (p: string) => void }) {
  return (
    <section className="py-24 px-6" style={{ background: BLUSH }}>
      <div className="max-w-5xl mx-auto">
        <FadeUp className="text-center mb-6">
          <GoldLabel>Your AI Suite</GoldLabel>
          <h2
            style={{
              fontFamily: "Playfair Display, Georgia, serif",
              fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
              color: NAVY,
              fontWeight: 700,
            }}
          >
            Meet your AI team.
          </h2>
          <p className="mt-3 text-base" style={{ color: MUTED }}>
            Each one built for a different part of your world.
          </p>
        </FadeUp>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {AGENTS.map((a, i) => (
            <FadeUp key={a.name} delay={i * 0.08}>
              <div
                className="p-5 rounded-sm flex items-center gap-4"
                style={{ background: "#FEFEFE", border: "1px solid #E5D9CE" }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                  style={{ background: a.accent, minWidth: 40 }}
                >
                  {a.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: NAVY }}>
                    {a.name}
                  </p>
                  <p className="text-xs" style={{ color: MUTED }}>
                    {a.role}
                  </p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp className="text-center">
          <button
            onClick={() => onNavigate("/concierge")}
            className="px-8 py-3 rounded-sm font-semibold"
            style={{
              border: `1.5px solid ${GOLD}`,
              color: NAVY,
              background: "transparent",
              letterSpacing: "0.08em",
              fontSize: "0.875rem",
            }}
          >
            Try an Agent Free
          </button>
        </FadeUp>
      </div>
    </section>
  );
}

// ── Section 5: AI Blueprint ──────────────────────────────────────
const BLUEPRINT_WEEKS = [
  "Audit + Blueprint",
  "Build Your Stack",
  "Systemize",
  "Launch + Monetize",
];

function BlueprintSection({ onNavigate }: { onNavigate: (p: string) => void }) {
  return (
    <section className="py-24 px-6" style={{ background: "#FEFEFE" }}>
      <div className="max-w-3xl mx-auto text-center">
        <FadeUp>
          <GoldLabel>The Fast Track</GoldLabel>
          <h2
            className="mb-4"
            style={{
              fontFamily: "Playfair Display, Georgia, serif",
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
              color: NAVY,
              fontWeight: 700,
            }}
          >
            Transform your business with AI in 4 weeks.
          </h2>
          <p className="mb-6 leading-relaxed" style={{ color: MUTED }}>
            The AI Blueprint is a private, 1:1 intensive with Nadia. You
            don&apos;t learn theory. You leave with AI systems running your
            business.
          </p>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="flex items-center justify-center gap-3 mb-8">
            <span
              className="text-3xl font-bold"
              style={{ color: NAVY, fontFamily: "Playfair Display, Georgia, serif" }}
            >
              $997
            </span>
            <span
              className="text-sm px-2 py-1 rounded-sm font-semibold"
              style={{ background: GOLD, color: NAVY }}
            >
              Founding Rate
            </span>
            <span
              className="text-lg line-through"
              style={{ color: MUTED }}
            >
              $1,997
            </span>
          </div>
        </FadeUp>

        <FadeUp delay={0.15}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            {BLUEPRINT_WEEKS.map((w, i) => (
              <div
                key={w}
                className="p-4 rounded-sm text-sm font-medium"
                style={{
                  background: BLUSH,
                  border: `1px solid #DDD0C4`,
                  color: BODY,
                }}
              >
                <p style={{ color: GOLD, fontSize: "0.7rem", fontWeight: 600 }}>
                  WEEK {i + 1}
                </p>
                <p className="mt-1">{w}</p>
              </div>
            ))}
          </div>
        </FadeUp>

        <FadeUp delay={0.2}>
          <button
            onClick={() => onNavigate("/ai-integration")}
            className="px-10 py-3 rounded-sm font-semibold transition-colors"
            style={{
              background: GOLD,
              color: NAVY,
              letterSpacing: "0.08em",
              fontSize: "0.875rem",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = GOLD_HOVER)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = GOLD)
            }
          >
            Apply Now
          </button>
          <p className="mt-3 text-xs" style={{ color: MUTED }}>
            Includes 3 months MetaHers Studio, with Kids Learning access
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

// ── Section 6: Membership Tiers ──────────────────────────────────
const TIERS = [
  {
    name: "AI Starter Kit",
    price: "Free",
    priceNote: "",
    highlight: false,
    features: [
      "Weekly MetaHers Signal",
      "Community access",
      "1 free AI concierge session",
      "Curated resources",
    ],
    cta: "Start Free",
    ctaPath: "/signup",
    disabled: false,
  },
  {
    name: "MetaHers Studio",
    price: "$29",
    priceNote: "/mo",
    highlight: true,
    features: [
      "Daily access to the AI concierge team",
      "Complete Learning Hub",
      "Kids Learning launch edition for families",
      "AI Toolkit + prompt library",
      "Monthly live implementation lab",
    ],
    cta: "Join Studio",
    ctaPath: "/upgrade",
    disabled: false,
  },
  {
    name: "Private Advisory",
    price: "$149",
    priceNote: "/mo",
    highlight: false,
    features: [
      "Everything in MetaHers Studio",
      "Priority question support",
      "Monthly private strategy review",
      "Concierge onboarding",
    ],
    cta: "Apply",
    ctaPath: "/signup",
    disabled: false,
  },
];

function TiersSection({ onNavigate }: { onNavigate: (p: string) => void }) {
  return (
    <section className="py-24 px-6" style={{ background: BLUSH }}>
      <div className="max-w-5xl mx-auto">
        <FadeUp className="text-center mb-14">
          <GoldLabel>Membership</GoldLabel>
          <h2
            className="mb-3"
            style={{
              fontFamily: "Playfair Display, Georgia, serif",
              fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
              color: NAVY,
              fontWeight: 700,
            }}
          >
            Start free. Grow with us.
          </h2>
          <p style={{ color: MUTED }}>
            Every MetaHers journey begins with the AI Starter Kit.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((t, i) => (
            <FadeUp key={t.name} delay={i * 0.1}>
              <div
                className="p-8 rounded-sm h-full flex flex-col"
                style={{
                  background: "#FEFEFE",
                  border: t.highlight
                    ? `2px solid ${GOLD}`
                    : "1px solid #DDD0C4",
                }}
              >
                {t.highlight && (
                  <p
                    className="text-xs font-semibold mb-3 uppercase"
                    style={{ color: GOLD, letterSpacing: "0.1em" }}
                  >
                    Recommended Start
                  </p>
                )}
                <h3
                  className="font-bold text-lg mb-1"
                  style={{ color: NAVY }}
                >
                  {t.name}
                </h3>
                <div className="mb-6">
                  <span
                    className="text-3xl font-bold"
                    style={{
                      fontFamily: "Playfair Display, Georgia, serif",
                      color: NAVY,
                    }}
                  >
                    {t.price}
                  </span>
                  {t.priceNote && (
                    <span className="text-sm" style={{ color: MUTED }}>
                      {t.priceNote}
                    </span>
                  )}
                </div>

                <ul className="space-y-2 mb-8 flex-1">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check
                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                        style={{ color: GOLD }}
                      />
                      <span style={{ color: BODY }}>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => !t.disabled && t.ctaPath && onNavigate(t.ctaPath)}
                  disabled={t.disabled}
                  className="w-full py-3 rounded-sm font-semibold text-sm transition-colors"
                  style={{
                    letterSpacing: "0.08em",
                    background: t.highlight ? GOLD : "transparent",
                    color: t.disabled ? MUTED : t.highlight ? NAVY : NAVY,
                    border: t.highlight ? "none" : `1.5px solid ${t.disabled ? "#DDD0C4" : GOLD}`,
                    cursor: t.disabled ? "not-allowed" : "pointer",
                    opacity: t.disabled ? 0.6 : 1,
                  }}
                >
                  {t.cta}
                </button>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 7: Founder ───────────────────────────────────────────
function FounderSection() {
  return (
    <section className="py-24 px-6" style={{ background: "#FEFEFE" }}>
      <div className="max-w-5xl mx-auto">
        <FadeUp>
          <div className="flex flex-col md:flex-row items-center md:items-stretch gap-12 md:gap-16">
            {/* Photo — full portrait */}
            <div className="flex-shrink-0 w-full md:w-auto flex justify-center">
              <img
                src="/images/nadia-founder.jpg"
                alt="Nadia, Founder and CEO of MetaHers"
                className="object-cover object-top w-full"
                style={{
                  maxWidth: 360,
                  borderRadius: "4px",
                  border: "1px solid #E5D9CE",
                  aspectRatio: "3 / 4",
                }}
              />
            </div>

            {/* Text */}
            <div className="flex flex-col justify-center">
              <GoldLabel>From the Founder</GoldLabel>
              <blockquote
                className="text-2xl md:text-3xl leading-relaxed mb-6 mt-3"
                style={{
                  fontFamily: "Playfair Display, Georgia, serif",
                  fontStyle: "italic",
                  color: NAVY,
                }}
              >
                "I spent a decade in luxury hospitality learning one thing: the
                best experiences feel personal. MetaHers brings that same
                philosophy to AI."
              </blockquote>
              <div style={{ width: 40, height: 2, background: GOLD, marginBottom: 20 }} />
              <p className="text-base font-semibold mb-1" style={{ color: NAVY }}>
                Nadia Maazaoui
              </p>
              <p className="text-sm" style={{ color: MUTED }}>
                Founder and CEO, MetaHers
              </p>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ── Section 8: Email Capture ─────────────────────────────────────
function EmailCaptureSection({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate("/signup");
  };

  return (
    <section className="py-24 px-6" style={{ background: BLUSH }}>
      <div className="max-w-2xl mx-auto text-center">
        <FadeUp>
          <h2
            className="mb-3"
            style={{
              fontFamily: "Playfair Display, Georgia, serif",
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              color: NAVY,
              fontWeight: 700,
            }}
          >
            Your AI journey starts here.
          </h2>
          <p className="mb-8 leading-relaxed" style={{ color: MUTED }}>
            Start with the AI Starter Kit. It&apos;s free, practical, and
            it&apos;s built for you.
          </p>
        </FadeUp>

        <FadeUp delay={0.1}>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="px-4 py-3 rounded-sm text-sm flex-1 max-w-xs outline-none"
              style={{
                border: `1px solid #DDD0C4`,
                color: BODY,
                background: "#FEFEFE",
              }}
            />
            <button
              type="submit"
              className="px-8 py-3 rounded-sm font-semibold text-sm transition-colors"
              style={{
                background: GOLD,
                color: NAVY,
                letterSpacing: "0.08em",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = GOLD_HOVER)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = GOLD)
              }
            >
              Join Free
            </button>
          </form>
        </FadeUp>
      </div>
    </section>
  );
}

// ── Section 9: Footer ────────────────────────────────────────────
function Footer({ onNavigate }: { onNavigate: (p: string) => void }) {
  return (
    <footer
      className="py-8 px-6"
      style={{
        borderTop: `1px solid #DDD0C4`,
        background: "#FEFEFE",
      }}
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span
          className="text-xl font-bold"
          style={{ fontFamily: "Playfair Display, Georgia, serif", color: NAVY }}
        >
          MetaHers
        </span>

        <div className="flex items-center gap-6 text-sm" style={{ color: MUTED }}>
          <a
            href="https://x.com/metahers"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: MUTED }}
          >
            X
          </a>
          <a
            href="https://instagram.com/metahers"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: MUTED }}
          >
            Instagram
          </a>
          <a
            href="https://t.me/metahers"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: MUTED }}
          >
            Telegram
          </a>
        </div>

        <div className="flex items-center gap-4 text-xs" style={{ color: MUTED }}>
          <span>2026 MetaHers. All rights reserved.</span>
          <button
            onClick={() => onNavigate("/privacy")}
            style={{ color: MUTED }}
          >
            Privacy
          </button>
          <button
            onClick={() => onNavigate("/terms")}
            style={{ color: MUTED }}
          >
            Terms
          </button>
        </div>
      </div>
    </footer>
  );
}

// ── Root ─────────────────────────────────────────────────────────
export default function LandingPage() {
  const [, navigate] = useLocation();
  const onNavigate = (path: string) => navigate(path);

  return (
    <>
      <SEO
        title="MetaHers | AI Community for Women"
        description="Join MetaHers, the luxury tech community making AI accessible to women. Learn, build, and monetize with AI. Six personal agents. One powerful ecosystem."
      />
      <div style={{ color: BODY, fontFamily: "system-ui, sans-serif" }}>
        <HeroSection onNavigate={onNavigate} />
        <SocialProofBar />
        <PillarsSection />
        <AgentsSection onNavigate={onNavigate} />
        <BlueprintSection onNavigate={onNavigate} />
        <TiersSection onNavigate={onNavigate} />
        <FounderSection />
        <EmailCaptureSection onNavigate={onNavigate} />
        <Footer onNavigate={onNavigate} />
      </div>
    </>
  );
}
