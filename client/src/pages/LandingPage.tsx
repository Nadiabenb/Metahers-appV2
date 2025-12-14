import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import nadiaHeroPhoto from "@assets/IMG_1295_1762876265856.jpg";
import { useRef } from "react";
import { useLocation } from "wouter";

// ============================================
// SECTION 1: HERO
// ============================================
function HeroSection({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center px-6 py-20"
      style={{ background: "#FFFFFF" }}
      data-testid="section-hero"
    >
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight mb-6" style={{ color: '#000000' }}>
            MetaHersMind Spa
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl font-light mb-8" style={{ color: '#666666' }}>
            Where extraordinary women master AI & Web3 to build lives of freedom, wealth, and lasting impact.
          </p>

          {/* Key Stats Line */}
          <p className="text-sm uppercase tracking-[0.2em] mb-12" style={{ color: '#999999' }}>
            54 AI Rituals • 9 Learning Worlds • Sisterhood
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              onClick={() => onNavigate("/vision-board")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group px-8 py-3 rounded-md font-semibold text-base flex items-center gap-2 transition-all"
              style={{ background: '#000000', color: '#FFFFFF' }}
              data-testid="button-hero-primary"
            >
              Begin Your Vision
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              onClick={() => onNavigate("/voyages")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 rounded-md font-semibold text-base transition-all"
              style={{ background: '#FFFFFF', border: '1px solid #000000', color: '#000000' }}
              data-testid="button-hero-secondary"
            >
              Explore Voyages
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// SECTION 2: DISCOVER (Free Experience)
// ============================================
function DiscoverSection({ onNavigate }: { onNavigate: (path: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      ref={ref}
      className="py-20 lg:py-32 px-6 lg:px-16"
      style={{ background: "#FFFFFF" }}
      data-testid="section-discover"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm uppercase tracking-[0.2em] mb-4" style={{ color: '#999999' }}>
            Discover
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold mb-6" style={{ color: '#000000' }}>
            Crystallize Your
            <br />
            2026 Vision
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#666666' }}>
            An AI-powered ritual to define your intentions across seven sacred dimensions—Career, Wealth, Wellness, Learning, Relationships, Lifestyle, and Impact.
          </p>
        </motion.div>

        {/* 7 Dimensions Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 max-w-5xl mx-auto">
          {['Career', 'Wealth', 'Wellness', 'Learning', 'Love', 'Impact', 'Lifestyle'].map((dimension, i) => (
            <motion.div
              key={dimension}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-md text-center"
              style={{ background: '#F5F5F5' }}
            >
              <p className="text-sm font-medium" style={{ color: '#000000' }}>{dimension}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <motion.button
            onClick={() => onNavigate("/vision-board")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group px-8 py-3 rounded-md font-semibold flex items-center gap-2 transition-all mx-auto"
            style={{ background: '#000000', color: '#FFFFFF' }}
            data-testid="button-vision-cta"
          >
            Create Your Vision Board
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          <p className="text-sm mt-4" style={{ color: '#999999' }}>
            Free • AI-Powered • Find Your Vision Sisters
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// SECTION 3: THREE PATHS TO MASTERY
// ============================================
function TransformationSection({ onNavigate }: { onNavigate: (path: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const paths = [
    {
      title: "54 Transformational Rituals",
      subtitle: "9 Learning Worlds",
      description: "Master AI, Web3, Branding, NFTs, Metaverse, and more through beautiful, guided experiences designed for your success.",
      cta: "Explore Worlds",
      path: "/learning-hub",
    },
    {
      title: "Your Digital Empire",
      subtitle: "AI Agency Team",
      description: "7 specialized AI agents—Brand Strategist, Copywriter, Designer, and more—working 24/7 to build your business.",
      cta: "Meet Your Team",
      path: "/agency",
    },
    {
      title: "Newport Beach Experiences",
      subtitle: "Luxury Voyages",
      description: "Intimate gatherings aboard pink Duffy boats, beach picnics, and champagne brunches. Only 6 women per voyage.",
      cta: "View Voyages",
      path: "/voyages",
    },
  ];

  return (
    <section 
      ref={ref}
      className="py-20 lg:py-32 px-6 lg:px-16"
      style={{ background: "#FAFAF8" }}
      data-testid="section-transformation"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-semibold mb-6" style={{ color: '#000000' }}>
            Your Transformation Path
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#666666' }}>
            Three paths to mastery
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {paths.map((path, i) => (
            <motion.div
              key={path.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              onClick={() => onNavigate(path.path)}
              className="group cursor-pointer p-8 rounded-md transition-all hover:shadow-lg"
              style={{ background: '#FFFFFF', border: '1px solid #E5E5E5' }}
              data-testid={`card-path-${i}`}
            >
              <p className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: '#999999' }}>
                {path.subtitle}
              </p>
              <h3 className="text-2xl font-semibold mb-4" style={{ color: '#000000' }}>
                {path.title}
              </h3>
              <p className="text-base mb-6" style={{ color: '#666666' }}>
                {path.description}
              </p>
              <div className="flex items-center gap-2 font-medium group-hover:gap-3 transition-all">
                <span style={{ color: '#000000' }}>{path.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// SECTION 4: STATS
// ============================================
function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { value: "300+", label: "Women Guided" },
    { value: "2X", label: "Avg Income Growth" },
    { value: "54", label: "AI Rituals" },
    { value: "98%", label: "Would Recommend" },
  ];

  return (
    <section 
      ref={ref}
      className="py-20 px-6 lg:px-16"
      style={{ background: "#FFFFFF" }}
      data-testid="section-stats"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-5xl md:text-6xl font-bold mb-2" style={{ color: '#000000' }}>
                {stat.value}
              </p>
              <p className="text-sm uppercase tracking-wider" style={{ color: '#999999' }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// SECTION 5: TESTIMONIALS
// ============================================
function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const testimonials = [
    { 
      quote: "From charging $40/hour to $3K per project. Clients find ME now.", 
      name: "S",
      role: "Creative Director",
    },
    { 
      quote: "I have Saturday mornings back with my kids. AI handles the rest.", 
      name: "J",
      role: "Entrepreneur",
    },
    { 
      quote: "Prints, digital licenses, merch. Reaching Japan, Germany, Australia.", 
      name: "M",
      role: "Digital Artist",
    },
  ];

  return (
    <section 
      ref={ref}
      className="py-20 lg:py-32 px-6 lg:px-16"
      style={{ background: "#FAFAF8" }}
      data-testid="section-testimonials"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="p-8 rounded-md"
              style={{ background: '#FFFFFF', border: '1px solid #E5E5E5' }}
              data-testid={`testimonial-${i}`}
            >
              <p className="text-lg font-medium leading-relaxed mb-6" style={{ color: '#000000' }}>
                "{t.quote}"
              </p>
              <div>
                <p className="font-semibold" style={{ color: '#000000' }}>{t.name}</p>
                <p className="text-sm" style={{ color: '#999999' }}>{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// SECTION 6: FOUNDER
// ============================================
function FounderSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      ref={ref}
      className="py-20 lg:py-32 px-6 lg:px-16"
      style={{ background: "#FFFFFF" }}
      data-testid="section-founder"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-md overflow-hidden aspect-[4/5]">
              <img
                src={nadiaHeroPhoto}
                alt="Nadia - Founder of MetaHers"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-8 left-8">
                <p className="text-2xl font-semibold" style={{ color: '#FFFFFF' }}>Nadia</p>
                <p className="text-sm uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.8)' }}>Founder</p>
              </div>
            </div>
          </motion.div>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-sm uppercase tracking-[0.2em] mb-8" style={{ color: '#999999' }}>
              The Invitation
            </p>
            
            <blockquote className="text-3xl md:text-4xl font-semibold leading-tight mb-8" style={{ color: '#000000' }}>
              "I built this sanctuary for the woman I once needed to find."
            </blockquote>

            <p className="text-lg leading-relaxed" style={{ color: '#666666' }}>
              After coaching over 300 women—through group programs, events, and breakthrough calls—I saw brilliant women overwhelmed by technology, standing on the sidelines. MetaHers is different. It's about using AI and Web3 as tools for the life you actually want.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// SECTION 7: VOYAGES
// ============================================
function VoyagesSection({ onNavigate }: { onNavigate: (path: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      ref={ref}
      className="py-20 lg:py-32 px-6 lg:px-16"
      style={{ background: "#FAFAF8" }}
      data-testid="section-voyages"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div>
            <p className="text-sm uppercase tracking-[0.2em] mb-4" style={{ color: '#999999' }}>
              In-Person Luxury Experiences
            </p>
            <h2 className="text-4xl md:text-5xl font-semibold" style={{ color: '#000000' }}>
              MetaHers Voyages
            </h2>
          </div>
          <motion.button
            onClick={() => onNavigate("/voyages")}
            whileHover={{ scale: 1.02 }}
            className="group flex items-center gap-2 font-medium"
            style={{ color: '#000000' }}
            data-testid="button-voyages-all"
          >
            Explore All Voyages
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="mb-12 p-8 rounded-md text-center"
          style={{ background: '#FFFFFF', border: '1px solid #E5E5E5' }}
        >
          <p className="text-lg" style={{ color: '#666666' }}>
            Intimate gatherings in Newport Beach. Master AI, Crypto & Web3 aboard pink Duffy boats, at exclusive beach picnics, and over champagne brunches. Only 6 women per voyage.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "12", desc: "Unique Voyages" },
            { label: "6", desc: "Women Per Group" },
            { label: "Balboa", desc: "Island Location" },
            { label: "$497+", desc: "Starting Price" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-md text-center"
              style={{ background: '#FFFFFF', border: '1px solid #E5E5E5' }}
              data-testid={`voyage-stat-${i}`}
            >
              <p className="text-4xl font-bold mb-2" style={{ color: '#000000' }}>
                {item.label}
              </p>
              <p className="text-sm" style={{ color: '#999999' }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// SECTION 8: FINAL CTA
// ============================================
function FinalCTA({ onNavigate }: { onNavigate: (path: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      ref={ref}
      className="py-20 lg:py-32 px-6 lg:px-16"
      style={{ background: "#FFFFFF" }}
      data-testid="section-final-cta"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center"
      >
        <h2 className="text-4xl md:text-5xl font-semibold mb-6" style={{ color: '#000000' }}>
          Your Future Self
          <br />
          Is Already Here
        </h2>
        <p className="text-lg mb-10 max-w-2xl mx-auto" style={{ color: '#666666' }}>
          This isn't about learning. It's about becoming. AI mastery. Web3 confidence. A sanctuary of women building extraordinary lives together.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.button
            onClick={() => onNavigate("/vision-board")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group px-8 py-3 rounded-md font-semibold flex items-center gap-2"
            style={{ background: '#000000', color: '#FFFFFF' }}
            data-testid="button-final-primary"
          >
            Create Your Vision Board
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.button
            onClick={() => onNavigate("/voyages")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 rounded-md font-semibold transition-all"
            style={{ background: '#FFFFFF', border: '1px solid #000000', color: '#000000' }}
            data-testid="button-final-secondary"
          >
            Explore Voyages
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}

// ============================================
// MAIN LANDING PAGE
// ============================================
export default function LandingPage() {
  const [, setLocation] = useLocation();

  const handleNavigate = (path: string) => {
    setLocation(path);
  };

  return (
    <>
      <SEO
        title="MetaHers Mind Spa - Master AI & Web3 | Women's Tech Education"
        description="Where extraordinary women master AI & Web3 to build lives of freedom, wealth, and lasting impact. 54 AI rituals, 9 learning worlds, and luxury voyages."
      />
      
      <main className="overflow-x-hidden" style={{ background: "#FFFFFF" }}>
        <HeroSection onNavigate={handleNavigate} />
        <DiscoverSection onNavigate={handleNavigate} />
        <TransformationSection onNavigate={handleNavigate} />
        <StatsSection />
        <TestimonialsSection />
        <FounderSection />
        <VoyagesSection onNavigate={handleNavigate} />
        <FinalCTA onNavigate={handleNavigate} />
      </main>
    </>
  );
}
