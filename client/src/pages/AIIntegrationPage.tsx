import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight, Brain, Cpu, Layers, Target, Zap, Bot,
  CheckCircle, ChevronDown, Sparkles, Calendar, Clock, 
  Users, GraduationCap, Briefcase, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { trackCTAClick } from "@/lib/analytics";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: "easeOut" },
  }),
};

const deliverables = [
  {
    number: "01",
    icon: Cpu,
    title: "Strategic AI Workflow",
    desc: "A structured workflow aligned with your specific business model \u2014 not a generic template, but a blueprint built around how you operate.",
  },
  {
    number: "02",
    icon: Brain,
    title: "Prompt Intelligence System",
    desc: "Strategic prompt systems calibrated to your voice, positioning, and communication style so AI outputs feel like you \u2014 refined.",
  },
  {
    number: "03",
    icon: Layers,
    title: "Content Intelligence Layer",
    desc: "A content system that compounds your authority over time \u2014 generating, organizing, and repurposing your thinking at scale.",
  },
  {
    number: "04",
    icon: Target,
    title: "Decision-Support Frameworks",
    desc: "AI-powered frameworks that support your strategic decisions \u2014 so you think with more clarity and move with more confidence.",
  },
  {
    number: "05",
    icon: Zap,
    title: "Automation Architecture",
    desc: "Intelligent automation layers that reduce cognitive load on the tasks that drain you, so you can protect your energy for what only you can do.",
  },
  {
    number: "06",
    icon: Bot,
    title: "Custom AI Assistant",
    desc: "A custom AI assistant structure designed around your specific cognitive patterns \u2014 not a generic chatbot, but an extension of your thinking.",
  },
];

const outcomes = [
  {
    title: "Founder-Level AI Infrastructure",
    desc: "A fully architected system you own, understand, and can build on \u2014 not a setup that depends on someone else to maintain.",
  },
  {
    title: "Faster Execution, Deeper Output",
    desc: "You move faster without sacrificing the depth and nuance that makes your work distinctly yours.",
  },
  {
    title: "Elevated Brand Authority",
    desc: "AI-amplified output aligned with your positioning \u2014 content and communications that consistently reflect your highest thinking.",
  },
  {
    title: "Strategic Clarity",
    desc: "Decision fatigue and mental overhead shrink significantly when intelligent systems are doing the heavy cognitive lifting around you.",
  },
  {
    title: "A Scalable Foundation",
    desc: "Your AI Operating System is built to grow with your business \u2014 a living infrastructure, not a one-time fix.",
  },
];

const testimonials = [
  {
    text: "I needed a reboot to learn all about the latest applications \u2014 and this was just what I needed. When you take your foot off the gas, you get left behind. This session got me back in the game.",
    author: "Lululuna",
    handle: "@LululunaThrive",
  },
  {
    text: "MetaHers is poised to assist women understand and leverage new technology for their business. It\u2019s a busy and noisy space, and we need someone like Nadia to help make sense of how to apply these new tools in a real, structured way.",
    author: "Linda Rey",
    handle: "Founder, BizGlitch",
  },
  {
    text: "Crazy awesome energy \u2014 and in just a few hours, a full tour of Nadia\u2019s entire methodology and space. What started as a conversation became the beginning of a very cool partnership.",
    author: "Vicki",
    handle: "@Drapeta",
  },
  {
    text: "Nadia helped me finally get my head wrapped around things I just couldn\u2019t figure out on my own. I left with real clarity and understanding. Thank you for letting me pick your brain \u2014 it made a real difference.",
    author: "sourpower.eth",
    handle: "@sourpowww3r",
  },
];

const whoFitItems = [
  "You have tried AI tools but nothing has really stuck or integrated into how you actually work",
  "You feel behind technologically and want to close that gap \u2014 without becoming a tech person",
  "You value long-term authority and positioning, not quick hacks or surface-level shortcuts",
  "You understand that leverage is a leadership decision \u2014 and you are ready to make it",
  "You are launching, scaling, or already established \u2014 and you want AI to compound your advantage",
  "You want to own your systems \u2014 not rent them from someone else or stay dependent on a course",
];

const weeks = [
  {
    number: "01",
    title: "Architecture & Strategic Mapping",
    desc: "We map your entire business ecosystem \u2014 how you think, where you spend your cognitive energy, and where AI can create the most leverage. You leave Week 1 with a clear strategic architecture and a shared language for how your system will be built.",
    outcome: "Strategic clarity + system blueprint",
  },
  {
    number: "02",
    title: "System Design & Prompt Intelligence",
    desc: "We design and build your custom prompt systems \u2014 calibrated to your voice, your positioning, and the specific outputs that matter most in your business. By the end of this week, AI is already responding like an extension of you, not a generic assistant.",
    outcome: "Prompt library + content intelligence foundations",
  },
  {
    number: "03",
    title: "Integration & Workflow Alignment",
    desc: "We embed your new AI systems into the actual workflows of your day \u2014 your content creation, decision-making, communications, and execution rhythms. This is where your AI Operating System stops being a concept and starts running in the background of your business.",
    outcome: "Live, integrated AI workflows",
  },
  {
    number: "04",
    title: "Refinement, Optimization & Autonomy",
    desc: "We stress-test, refine, and optimize everything. You learn how to evolve the system yourself as your business grows \u2014 so this never becomes something you depend on anyone else to maintain. You leave autonomous, not dependent.",
    outcome: "Full ownership + autonomy to build further",
  },
];

const faqs = [
  {
    q: "What exactly do I get at the end of the four weeks?",
    a: "You leave with a fully built, personally calibrated AI Operating System \u2014 including custom prompt libraries, automated workflows, content intelligence tools, and decision-support frameworks. Everything is yours to own and evolve.",
  },
  {
    q: "Do I need to be technical to do this?",
    a: "Not at all. This experience is designed specifically for visionary women founders, not engineers. I translate the technology into your language and your workflow. You bring your expertise; I handle the architecture.",
  },
  {
    q: "How is this different from an AI course?",
    a: "Courses teach generic skills to large groups. This is private, 1:1 architecture work built around your specific business, leadership style, and goals. You don't learn about AI \u2014 you leave with a working system.",
  },
  {
    q: "What if I\u2019ve already tried using AI tools?",
    a: "Most founders have. The difference is integration vs. experimentation. We take what you\u2019ve tried and build it into a cohesive system that actually works within your day-to-day operations.",
  },
  {
    q: "Can I continue getting support after the four weeks?",
    a: "Yes. After the experience, you\u2019ll have the option to continue with ongoing strategic support. But the system you build is fully self-sustaining \u2014 you won\u2019t need me to keep it running.",
  },
  {
    q: "How many people do you work with at a time?",
    a: "This is intentionally limited. I only take a small number of private clients at any given time to ensure depth, presence, and quality. This is not scalable by design \u2014 and that\u2019s the point.",
  },
];

const credentials = [
  {
    icon: GraduationCap,
    title: "Education",
    text: "Computer Science degree (2008) \u00B7 Bachelor\u2019s, Master\u2019s & MBA in Hospitality Management",
  },
  {
    icon: Briefcase,
    title: "Leadership Background",
    text: "Hotel General Manager, Los Angeles \u00B7 Career built on operational systems thinking and technical problem-solving",
  },
  {
    icon: Brain,
    title: "Approach",
    text: "AI as infrastructure, not trend \u00B7 Systems designed around the individual founder\u2019s cognitive style and leadership",
  },
  {
    icon: Shield,
    title: "Mission",
    text: "Ensuring visionary women are at the forefront of technological evolution \u2014 not consuming it passively, but integrating it structurally",
  },
];

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-10" data-testid={`label-section-${children.toLowerCase().replace(/\s/g, '-')}`}>
      <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary">
        {children}
      </span>
      <div className="h-px w-12 bg-primary/40" />
    </div>
  );
}

export default function AIIntegrationPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleCTA = (source: string) => {
    trackCTAClick(`ai_integration_${source}`, '/signup', 'ai_integration');
    localStorage.setItem('ai_integration_interest', 'true');
    window.location.href = "/signup";
  };

  return (
    <div className="min-h-screen bg-background" data-testid="page-ai-integration">
      <SEO
        title="AI Integration Experience - Private 4-Week 1:1 System"
        description="A private, high-touch 4-week experience where we architect your personal AI Operating System. Built around how you think, decide, and lead. For visionary women founders ready to integrate AI structurally."
        keywords="ai integration, ai operating system, women founders, 1:1 ai coaching, ai strategy, prompt engineering, ai automation"
      />

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-black px-6 py-20">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(139,92,246,0.15) 0%, transparent 70%), radial-gradient(ellipse 40% 30% at 80% 80%, rgba(139,92,246,0.08) 0%, transparent 60%)"
        }} />

        <motion.p
          custom={0.2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="font-mono text-[11px] tracking-[0.22em] uppercase text-primary mb-8"
          data-testid="text-hero-eyebrow"
        >
          MetaHers \u00B7 AI Integration Experience
        </motion.p>

        <motion.h1
          custom={0.4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-light text-white leading-[0.95] tracking-tight mb-3"
          data-testid="text-hero-title"
        >
          META<em className="italic text-primary">HERS</em>
        </motion.h1>

        <motion.p
          custom={0.6}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="font-serif text-xl sm:text-2xl md:text-3xl font-light text-white/55 tracking-wide mb-12"
          data-testid="text-hero-subtitle"
        >
          AI Integration Experience
        </motion.p>

        <motion.div
          custom={0.8}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-wrap gap-3 justify-center mb-14"
        >
          {["Private", "4 Weeks", "High-Touch", "1:1"].map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="bg-transparent border-primary/30 text-primary/80 font-mono text-[11px] tracking-[0.15em] uppercase rounded-sm no-default-hover-elevate no-default-active-elevate"
              data-testid={`badge-tag-${tag.toLowerCase().replace(/\s/g, '-')}`}
            >
              {tag}
            </Badge>
          ))}
        </motion.div>

        <motion.p
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="font-serif text-xl sm:text-2xl md:text-3xl font-light italic text-white/75 max-w-2xl leading-relaxed mb-14"
          data-testid="text-hero-hook"
        >
          Most founders are experimenting with AI.<br />
          Very few are integrating it into how they think, decide, and lead.
        </motion.p>

        <motion.div custom={1.2} initial="hidden" animate="visible" variants={fadeUp}>
          <Button
            size="lg"
            onClick={() => handleCTA('hero')}
            className="font-mono text-xs tracking-[0.18em] uppercase"
            data-testid="button-cta-hero"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Book Your Discovery Call
          </Button>
        </motion.div>

        <motion.div
          custom={1.6}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-primary/40">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-primary/40 to-transparent animate-pulse" />
        </motion.div>
      </section>

      {/* PROBLEM */}
      <section className="py-20 md:py-28 px-6 bg-[#1a0b2e] border-t border-b border-white/5">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <SectionLabel>The Reality</SectionLabel>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light leading-tight text-white mb-12 max-w-2xl" data-testid="text-problem-headline">
              You know AI is important.<br />
              But the noise, the tools, the <em className="italic text-primary">"just use ChatGPT"</em> advice {"\u2014"} none of it was built for how you actually lead.
            </h2>
            <div className="text-base md:text-lg text-white/70 max-w-2xl leading-relaxed space-y-5">
              <p>The AI revolution is accelerating. But the way it is being taught is fragmented, overly technical, and completely disconnected from how visionary women actually build. You end up with a dozen tabs open, a graveyard of half-used tools, and no real system to show for it.</p>
              <p>You are not behind because you are not technical enough. You are behind because no one has taken the time to architect AI around how <em className="italic text-white">you</em> think, lead, and grow.</p>
              <p>That is what MetaHers exists to do.</p>
            </div>
            <div className="mt-12 pl-6 border-l-2 border-primary" data-testid="text-emphasis-line">
              <p className="font-serif text-xl sm:text-2xl md:text-3xl italic font-light text-white leading-snug">
                We do not replace the founder.<br />
                We elevate her operating system.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHAT WE BUILD */}
      <section className="py-20 md:py-28 px-6 bg-black text-white">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <SectionLabel>What We Build Together</SectionLabel>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light leading-tight text-white mb-5 max-w-2xl" data-testid="text-build-headline">
              Your Personal<br />AI Operating System
            </h2>
            <p className="text-base md:text-lg text-white/55 max-w-xl mb-16 leading-relaxed">
              Over four private weeks, we architect and integrate a system built entirely around your business, your voice, and your leadership style.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-px mb-16">
            {deliverables.map((item, i) => (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-white/[0.03] border border-primary/10 p-7 group hover:bg-primary/[0.05] hover:border-primary/25 transition-colors"
                data-testid={`card-deliverable-${item.number}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <item.icon className="w-4 h-4 text-primary/60" />
                  <span className="font-mono text-[11px] text-primary/60 tracking-wider">{item.number}</span>
                </div>
                <h3 className="font-serif text-xl font-medium text-white mb-2 leading-tight">{item.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-serif text-xl md:text-2xl italic font-light text-primary/80 text-center pt-10 border-t border-primary/15 leading-relaxed"
            data-testid="text-ownership-note"
          >
            You leave with full ownership. Nothing is rented. Nothing is dependent.<br />
            Everything is designed to be an extension of you.
          </motion.p>
        </div>
      </section>

      {/* MID CTA */}
      <div className="bg-black py-12 px-6 text-center border-t border-primary/10">
        <p className="font-serif text-lg md:text-xl italic font-light text-white/50 mb-6">
          Ready to stop experimenting and start integrating?
        </p>
        <Button
          size="lg"
          onClick={() => handleCTA('mid')}
          className="font-mono text-xs tracking-[0.18em] uppercase"
          data-testid="button-cta-mid"
        >
          Book Your Discovery Call
        </Button>
      </div>

      {/* OUTCOMES */}
      <section className="py-20 md:py-28 px-6 bg-background">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <SectionLabel>The Outcome</SectionLabel>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-white mb-14 leading-tight max-w-xl" data-testid="text-outcomes-headline">
              What changes by the end of four weeks
            </h2>
          </motion.div>

          <div className="flex flex-col max-w-2xl">
            {outcomes.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex items-start gap-5 py-7 border-b border-primary/15 first:border-t first:border-primary/15"
                data-testid={`row-outcome-${i}`}
              >
                <ArrowRight className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-serif text-xl font-medium text-white mb-1 leading-tight">{item.title}</h3>
                  <p className="text-sm text-white/60">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-14 pl-6 border-l-2 border-primary max-w-xl" data-testid="text-outcomes-close">
            <p className="font-serif text-xl sm:text-2xl md:text-3xl italic font-light text-white leading-snug">
              This is not surface-level productivity.<br />
              This is structural leverage.
            </p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 md:py-28 px-6 bg-[#1a0b2e] border-t border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <SectionLabel>What People Say</SectionLabel>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-white mb-14 leading-tight" data-testid="text-testimonials-headline">
              Women who've experienced<br />Nadia's work firsthand
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="relative h-full bg-white/5 border-white/10" data-testid={`card-testimonial-${i}`}>
                  <CardContent className="p-8 pt-12">
                    <span className="absolute top-3 left-6 font-serif text-7xl text-primary/20 leading-none select-none" aria-hidden="true">"</span>
                    <p className="font-serif text-lg italic font-light text-white/90 leading-relaxed mb-6">{t.text}</p>
                    <p className="font-mono text-[11px] tracking-wider uppercase text-primary">{t.author}</p>
                    <p className="text-xs text-white/50 mt-1">{t.handle}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO THIS IS FOR */}
      <section className="py-20 md:py-28 px-6 bg-background">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <SectionLabel>Who This Is For</SectionLabel>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-white mb-3 leading-tight max-w-xl" data-testid="text-who-headline">
              You are the right fit if&hellip;
            </h2>
            <p className="text-base md:text-lg text-white/60 max-w-xl mb-12 leading-relaxed">
              You are a visionary woman founder who has built something real {"\u2014"} and you are ready to operate at a higher level with intelligent systems behind you.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 border border-white/10 rounded-md overflow-hidden mb-12">
            {whoFitItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className={`flex items-start gap-3 p-5 text-sm text-white/70 leading-relaxed border-b border-white/10 ${i % 2 === 0 ? 'sm:border-r' : ''} ${i >= whoFitItems.length - 2 ? 'sm:border-b-0' : ''} ${i === whoFitItems.length - 1 ? 'border-b-0' : ''}`}
                data-testid={`item-who-fit-${i}`}
              >
                <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </motion.div>
            ))}
          </div>

          <Card className="border-2 border-primary/30 max-w-xl rounded-sm bg-primary/5" data-testid="text-who-not">
            <CardContent className="p-7">
              <p className="font-serif text-lg md:text-xl italic font-light text-white/90 leading-relaxed">
                This is not for casual experimentation.<br />
                This is for women who are ready to evolve how they operate.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* STRUCTURE / 4 WEEKS */}
      <section className="py-20 md:py-28 px-6 bg-black text-white">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <SectionLabel>The Experience</SectionLabel>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-white mb-4 max-w-lg leading-tight" data-testid="text-structure-headline">
              Four weeks.<br />One complete system.
            </h2>
          </motion.div>

          <div className="flex flex-wrap gap-x-6 gap-y-4 md:gap-8 mb-16 pb-10 border-b border-primary/15">
            {[
              { label: "Duration", value: "4 Weeks" },
              { label: "Format", value: "Private 1:1" },
              { label: "Sessions", value: "Weekly Deep Integration Calls" },
              { label: "Support", value: "Strategic support between sessions" },
              { label: "Deliverable", value: "Your fully architected AI Operating System" },
            ].map((meta) => (
              <div key={meta.label} className="flex flex-col gap-1" data-testid={`meta-${meta.label.toLowerCase()}`}>
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-primary/50">{meta.label}</span>
                <span className="text-sm text-white/75">{meta.value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col">
            {weeks.map((week, i) => (
              <motion.div
                key={week.number}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-4 md:gap-8 py-10 border-b border-primary/10 last:border-b-0"
                data-testid={`card-week-${week.number}`}
              >
                <span className="font-serif text-5xl md:text-6xl font-light text-primary/20 leading-none">{week.number}</span>
                <div>
                  <h3 className="font-serif text-2xl font-medium text-white mb-2 leading-tight">{week.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed max-w-xl mb-4">{week.desc}</p>
                  <Badge
                    variant="outline"
                    className="bg-primary/[0.08] border-primary/20 text-primary font-mono text-[11px] tracking-wider rounded-sm no-default-hover-elevate no-default-active-elevate"
                  >
                    You leave with: {week.outcome}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-serif text-xl md:text-2xl italic font-light text-white/60 text-center pt-14 border-t border-primary/10 leading-relaxed"
            data-testid="text-structure-close"
          >
            You do not leave dependent.<br />You leave integrated.
          </motion.p>
        </div>
      </section>

      {/* ABOUT NADIA */}
      <section className="py-20 md:py-28 px-6 bg-background">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <SectionLabel>About Nadia</SectionLabel>
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
              <div>
                <h2 className="font-serif text-3xl sm:text-4xl font-light text-white leading-tight mb-7" data-testid="text-about-headline">
                  Built by someone who thinks in systems.
                </h2>
                <div className="text-sm md:text-base text-white/60 leading-relaxed space-y-4">
                  <p>I'm Nadia Ben Brahim {"\u2014"} founder of MetaHers. I studied Computer Science and graduated in 2008, then spent the next decade building a career in luxury hospitality, rising from Front Office Manager to <strong className="text-white font-semibold">Hotel General Manager in Los Angeles</strong>.</p>
                  <p>Throughout that career, I became known for one thing above all else: <strong className="text-white font-semibold">systems thinking</strong>. I optimized operations, resolved complex technical problems independently, and integrated tools into real-world execution at the highest level.</p>
                  <p>When AI emerged, I did not approach it as a trend. I approached it as infrastructure.</p>
                  <p>MetaHers exists to translate advanced technology into structured, practical leverage for women founders who refuse to be left behind. I do not teach tools. I architect systems around how you think, lead, and grow.</p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {credentials.map((cred, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <Card className="border border-primary/20 rounded-sm bg-white/5" data-testid={`card-credential-${i}`}>
                      <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-1">
                          <cred.icon className="w-3.5 h-3.5 text-primary" />
                          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-primary">{cred.title}</span>
                        </div>
                        <p className="text-sm text-white/60 leading-relaxed">{cred.text}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* INVESTMENT */}
      <section className="py-20 md:py-28 px-6 bg-black text-white text-center" id="apply">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="flex items-center justify-center gap-3 mb-10">
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">Investment</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-white mb-4 leading-tight" data-testid="text-investment-headline">
              What this represents
            </h2>
            <p className="text-base text-white/50 max-w-xl mx-auto mb-12 leading-relaxed">
              Hiring a dedicated AI operations consultant or systems strategist runs $5,000{"\u2013"}$15,000+ for comparable private, hands-on work. This is four weeks of private 1:1 architecture built around you, with a fully owned system as the deliverable.
            </p>

            <div className="inline-flex flex-col items-center bg-white/[0.03] border border-primary/25 px-12 sm:px-16 py-12 rounded-sm mb-4" data-testid="card-price-block">
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary mb-4">Total Investment</span>
              <span className="font-serif text-6xl sm:text-7xl md:text-8xl font-light text-primary leading-none mb-3">$1,297</span>
              <div className="text-[13px] text-white/40 leading-relaxed text-center">
                4 weeks private 1:1 {"\u00B7"} Weekly deep integration calls<br />
                Strategic support between sessions {"\u00B7"} Full system ownership
              </div>
            </div>

            <p className="font-serif text-base md:text-lg italic font-light text-white/40 max-w-lg mx-auto mb-14 leading-relaxed">
              This is not a course. It is not a subscription. It is a private engagement with a defined outcome {"\u2014"} designed for women who are serious about building real leverage.
            </p>

            <div className="flex flex-col items-center gap-4">
              <Button
                size="lg"
                onClick={() => handleCTA('investment')}
                className="font-mono text-xs tracking-[0.18em] uppercase"
                data-testid="button-cta-investment"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book Your Discovery Call
              </Button>
              <span className="font-mono text-[11px] tracking-wider uppercase text-white/30">
                Application-based {"\u00B7"} Limited availability
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 px-6 bg-[#1a0b2e] border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <SectionLabel>Questions</SectionLabel>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-white mb-14 leading-tight" data-testid="text-faq-headline">
              Common questions,<br />honest answers.
            </h2>
          </motion.div>

          <div className="flex flex-col max-w-2xl">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="border-b border-white/10 first:border-t first:border-white/10"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-start justify-between gap-6 py-7 text-left group"
                  data-testid={`button-faq-${i}`}
                >
                  <span className={`font-serif text-lg md:text-xl font-medium leading-snug transition-colors ${openFaq === i ? 'text-primary' : 'text-white'}`}>
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-primary flex-shrink-0 mt-1 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-400 ease-in-out ${openFaq === i ? 'max-h-60 pb-7' : 'max-h-0'}`}
                >
                  <p className="text-sm md:text-base text-white/50 leading-relaxed pr-10">{faq.a}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-24 md:py-32 px-6 bg-black text-white text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 50% 60% at 50% 100%, rgba(139,92,246,0.12) 0%, transparent 70%)"
        }} />

        <div className="relative z-10 max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-white leading-tight mb-5" data-testid="text-final-headline">
              The founders who move <em className="italic text-primary">first</em> don't just adapt.
            </h2>
            <p className="text-base md:text-lg text-white/45 max-w-md mx-auto mb-12 leading-relaxed">
              They set the pace. They build the infrastructure. And they never look back.
            </p>

            <Button
              size="lg"
              onClick={() => handleCTA('final')}
              className="font-mono text-xs tracking-[0.18em] uppercase"
              data-testid="button-cta-final"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Begin Your Integration
            </Button>
          </motion.div>
        </div>
      </section>

      {/* FOOTER NOTE */}
      <div className="bg-black py-8 px-6 text-center border-t border-primary/10">
        <p className="font-mono text-[11px] tracking-wider text-white/20">
          MetaHers {"\u00B7"} AI Integration Experience {"\u00B7"} Private {"\u00B7"} By Application
        </p>
      </div>
    </div>
  );
}
