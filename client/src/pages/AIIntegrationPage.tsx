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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SEO } from "@/components/SEO";
import { trackCTAClick } from "@/lib/analytics";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
    icon: Calendar,
    title: "4 x 60-min 1:1 Strategy Sessions",
    desc: "Private weekly sessions with Nadia, each with a clear agenda and outcome. Not coaching — structured co-building.",
  },
  {
    number: "02",
    icon: Brain,
    title: "Async Support Between Sessions",
    desc: "Loom walkthroughs, voice notes, and chat support between calls so momentum never stalls.",
  },
  {
    number: "03",
    icon: Layers,
    title: "Personalized AI Blueprint Document",
    desc: "A fully documented AI strategy built around your business model, cognitive style, and goals. Yours to keep and evolve.",
  },
  {
    number: "04",
    icon: Target,
    title: "Custom Prompt Library for Your Business",
    desc: "A library of prompts written specifically for your voice, workflows, and outputs — not generic templates.",
  },
  {
    number: "05",
    icon: Zap,
    title: "Tool Setup Done With You",
    desc: "We configure your actual tools together — no homework left half-done. You finish each week with working systems.",
  },
  {
    number: "06",
    icon: Cpu,
    title: "3 Months MetaHers Studio",
    desc: "Full access to the Learning Hub, AI concierge team, toolkit, and prompt library for three months after the Blueprint wraps.",
  },
];

const outcomes = [
  {
    title: "Founder-Level AI Infrastructure",
    desc: "A fully architected system you own, understand, and can build on — not a setup that depends on someone else to maintain.",
  },
  {
    title: "Faster Execution, Deeper Output",
    desc: "You move faster without sacrificing the depth and nuance that makes your work distinctly yours.",
  },
  {
    title: "Elevated Brand Authority",
    desc: "AI-amplified output aligned with your positioning — content and communications that consistently reflect your highest thinking.",
  },
  {
    title: "Strategic Clarity",
    desc: "Decision fatigue and mental overhead shrink significantly when intelligent systems are doing the heavy cognitive lifting around you.",
  },
  {
    title: "A Scalable Foundation",
    desc: "Your AI Operating System is built to grow with your business — a living infrastructure, not a one-time fix.",
  },
];

const testimonials = [
  {
    text: "I needed a reboot to learn all about the latest applications — and this was just what I needed. When you take your foot off the gas, you get left behind. This session got me back in the game.",
    author: "Lululuna",
    handle: "@LululunaThrive",
  },
  {
    text: "MetaHers is poised to assist women understand and leverage new technology for their business. It’s a busy and noisy space, and we need someone like Nadia to help make sense of how to apply these new tools in a real, structured way.",
    author: "Linda Rey",
    handle: "Founder, BizGlitch",
  },
  {
    text: "Crazy awesome energy — and in just a few hours, a full tour of Nadia’s entire methodology and space. What started as a conversation became the beginning of a very cool partnership.",
    author: "Vicki",
    handle: "@Drapeta",
  },
  {
    text: "Nadia helped me finally get my head wrapped around things I just couldn’t figure out on my own. I left with real clarity and understanding. Thank you for letting me pick your brain — it made a real difference.",
    author: "sourpower.eth",
    handle: "@sourpowww3r",
  },
];

const whoFitItems = [
  "You have tried AI tools but nothing has really stuck or integrated into how you actually work",
  "You feel behind technologically and want to close that gap — without becoming a tech person",
  "You value long-term authority and positioning, not quick hacks or surface-level shortcuts",
  "You understand that leverage is a leadership decision — and you are ready to make it",
  "You are launching, scaling, or already established — and you want AI to compound your advantage",
  "You want to own your systems — not rent them from someone else or stay dependent on a course",
];

const weeks = [
  {
    number: "01",
    title: "Audit + Blueprint",
    desc: "We audit how you currently work, where AI can create the most leverage, and build a personalized blueprint for your system. You leave Week 1 with a clear strategic architecture and a shared language for how your system will be built.",
    outcome: "Strategic clarity + system blueprint",
  },
  {
    number: "02",
    title: "Build Your AI Stack",
    desc: "We design and build your custom prompt systems and tool stack — calibrated to your voice, your positioning, and the specific outputs that matter most in your business. AI starts responding like an extension of you, not a generic assistant.",
    outcome: "Prompt library + AI stack configured",
  },
  {
    number: "03",
    title: "Systemize + Automate",
    desc: "We embed your new AI systems into the actual workflows of your day — content creation, decision-making, communications, and execution rhythms. This is where your AI blueprint stops being a concept and starts running in the background of your business.",
    outcome: "Live, integrated AI workflows",
  },
  {
    number: "04",
    title: "Launch + Monetize",
    desc: "We stress-test, refine, and optimize everything. You learn how to evolve the system yourself and — if it applies to your business — how to package and monetize your AI expertise. You leave autonomous and ready to build further.",
    outcome: "Full ownership + monetization strategy",
  },
];

const faqs = [
  {
    q: "What exactly do I get at the end of the four weeks?",
    a: "You leave with a fully built, personally calibrated AI Operating System — including custom prompt libraries, automated workflows, content intelligence tools, and decision-support frameworks. Everything is yours to own and evolve.",
  },
  {
    q: "Do I need to be technical to do this?",
    a: "Not at all. This experience is designed specifically for visionary women founders, not engineers. I translate the technology into your language and your workflow. You bring your expertise; I handle the architecture.",
  },
  {
    q: "How is this different from an AI course?",
    a: "Courses teach generic skills to large groups. This is private, 1:1 architecture work built around your specific business, leadership style, and goals. You don't learn about AI — you leave with a working system.",
  },
  {
    q: "What if I’ve already tried using AI tools?",
    a: "Most founders have. The difference is integration vs. experimentation. We take what you’ve tried and build it into a cohesive system that actually works within your day-to-day operations.",
  },
  {
    q: "Can I continue getting support after the four weeks?",
    a: "Yes. After the experience, you’ll have the option to continue with ongoing strategic support. But the system you build is fully self-sustaining — you won’t need me to keep it running.",
  },
  {
    q: "How many people do you work with at a time?",
    a: "This is intentionally limited. I only take a small number of private clients at any given time to ensure depth, presence, and quality. This is not scalable by design — and that’s the point.",
  },
];

const credentials = [
  {
    icon: GraduationCap,
    title: "Education",
    text: "Computer Science degree (2008) · Bachelor’s, Master’s & MBA in Hospitality Management",
  },
  {
    icon: Briefcase,
    title: "Leadership Background",
    text: "Hotel General Manager, Los Angeles · Career built on operational systems thinking and technical problem-solving",
  },
  {
    icon: Brain,
    title: "Approach",
    text: "AI as infrastructure, not trend · Systems designed around the individual founder’s cognitive style and leadership",
  },
  {
    icon: Shield,
    title: "Mission",
    text: "Ensuring visionary women are at the forefront of technological evolution — not consuming it passively, but integrating it structurally",
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
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    businessName: "",
    businessDescription: "",
    challenge: "",
    successVision: "",
    source: "",
    revenueRange: "",
  });

  const handleCTA = (source: string) => {
    trackCTAClick(`ai_integration_${source}`, '#blueprint-application', 'ai_integration');
    document.getElementById('blueprint-application')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiRequest('POST', '/api/blueprint/apply', form);
      setSubmitted(true);
      toast({
        title: "Application submitted",
        description: "Your next step is to book your AI Blueprint discovery call.",
      });
    } catch (err: any) {
      toast({ title: "Submission failed", description: err.message || "Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F6]" data-testid="page-ai-integration">
      <SEO
        title="The AI Blueprint - 4-Week 1:1 with Nadia"
        description="4 weeks. 1:1 with Nadia. A complete AI system built around your business and life. $997 founding rate."
        keywords="ai blueprint, ai operating system, women founders, 1:1 ai coaching, ai strategy, prompt engineering, ai automation"
      />

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden px-6 py-20 bg-[#FAF8F6]">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(201,169,110,0.10) 0%, transparent 70%), radial-gradient(ellipse 40% 30% at 80% 80%, rgba(201,169,110,0.06) 0%, transparent 60%)"
        }} />

        <motion.p
          custom={0.2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="font-mono text-[11px] tracking-[0.22em] uppercase text-primary mb-8"
          data-testid="text-hero-eyebrow"
        >
          MetaHers · The AI Blueprint
        </motion.p>

        <motion.h1
          custom={0.4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-light text-[#1A1A2E] leading-[0.95] tracking-tight mb-3"
          data-testid="text-hero-title"
        >
          META<em className="italic text-primary">HERS</em>
        </motion.h1>

        <motion.p
          custom={0.6}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="font-serif text-xl sm:text-2xl md:text-3xl font-light text-[#4A4A5E] tracking-wide mb-12"
          data-testid="text-hero-subtitle"
        >
          The AI Blueprint
        </motion.p>

        <motion.div
          custom={0.8}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-wrap gap-3 justify-center mb-14"
        >
          {["4 Weeks", "1:1 with Nadia", "$997", "Founding Rate"].map((tag) => (
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
          className="font-serif text-xl sm:text-2xl md:text-3xl font-light italic text-[#4A4A5E] max-w-2xl leading-relaxed mb-14"
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
            Apply Now
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
      <section className="py-20 md:py-28 px-6 border-t border-b border-[#C9A96E]/20 bg-[#FAF8F6]">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <SectionLabel>The Reality</SectionLabel>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light leading-tight text-[#1A1A2E] mb-12 max-w-2xl" data-testid="text-problem-headline">
              You know AI is important.<br />
              But the noise, the tools, the <em className="italic text-primary">"just use ChatGPT"</em> advice {"—"} none of it was built for how you actually lead.
            </h2>
            <div className="text-base md:text-lg text-[#4A4A5E] max-w-2xl leading-relaxed space-y-5">
              <p>The AI revolution is accelerating. But the way it is being taught is fragmented, overly technical, and completely disconnected from how visionary women actually build. You end up with a dozen tabs open, a graveyard of half-used tools, and no real system to show for it.</p>
              <p>You are not behind because you are not technical enough. You are behind because no one has taken the time to architect AI around how <em className="italic text-[#1A1A2E]">you</em> think, lead, and grow.</p>
              <p>That is what MetaHers exists to do.</p>
            </div>
            <div className="mt-12 pl-6 border-l-2 border-primary" data-testid="text-emphasis-line">
              <p className="font-serif text-xl sm:text-2xl md:text-3xl italic font-light text-[#1A1A2E] leading-snug">
                We do not replace the founder.<br />
                We elevate her operating system.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHAT WE BUILD */}
      <section className="py-20 md:py-28 px-6 bg-[#FAF8F6]">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <SectionLabel>What We Build Together</SectionLabel>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light leading-tight text-[#1A1A2E] mb-5 max-w-2xl" data-testid="text-build-headline">
              Your Personal<br />AI Operating System
            </h2>
            <p className="text-base md:text-lg text-[#4A4A5E] max-w-xl mb-16 leading-relaxed">
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
                className="bg-white border border-[#C9A96E]/20 shadow-sm p-7 group hover:bg-[#FAF8F6] hover:border-[#C9A96E]/40 transition-colors"
                data-testid={`card-deliverable-${item.number}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <item.icon className="w-4 h-4 text-primary/60" />
                  <span className="font-mono text-[11px] text-primary/60 tracking-wider">{item.number}</span>
                </div>
                <h3 className="font-serif text-xl font-medium text-[#1A1A2E] mb-2 leading-tight">{item.title}</h3>
                <p className="text-sm text-[#9A8A7E] leading-relaxed">{item.desc}</p>
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
      <div className="py-12 px-6 text-center border-t border-[#C9A96E]/10 bg-white">
        <p className="font-serif text-lg md:text-xl italic font-light text-[#4A4A5E] mb-6">
          Ready to stop experimenting and start integrating?
        </p>
        <Button
          size="lg"
          onClick={() => handleCTA('mid')}
          className="font-mono text-xs tracking-[0.18em] uppercase"
          data-testid="button-cta-mid"
        >
          Apply Now
        </Button>
      </div>

      {/* OUTCOMES */}
      <section className="py-20 md:py-28 px-6 bg-[#FAF8F6]">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <SectionLabel>The Outcome</SectionLabel>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#1A1A2E] mb-14 leading-tight max-w-xl" data-testid="text-outcomes-headline">
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
                  <h3 className="font-serif text-xl font-medium text-[#1A1A2E] mb-1 leading-tight">{item.title}</h3>
                  <p className="text-sm text-[#4A4A5E]">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-14 pl-6 border-l-2 border-primary max-w-xl" data-testid="text-outcomes-close">
            <p className="font-serif text-xl sm:text-2xl md:text-3xl italic font-light text-[#1A1A2E] leading-snug">
              This is not surface-level productivity.<br />
              This is structural leverage.
            </p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 md:py-28 px-6 border-t border-b border-[#C9A96E]/20 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <SectionLabel>What People Say</SectionLabel>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#1A1A2E] mb-14 leading-tight" data-testid="text-testimonials-headline">
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
                <Card className="relative h-full bg-white border border-[#C9A96E]/20 shadow-sm" data-testid={`card-testimonial-${i}`}>
                  <CardContent className="p-8 pt-12">
                    <span className="absolute top-3 left-6 font-serif text-7xl text-primary/20 leading-none select-none" aria-hidden="true">"</span>
                    <p className="font-serif text-lg italic font-light text-[#4A4A5E] leading-relaxed mb-6">{t.text}</p>
                    <p className="font-mono text-[11px] tracking-wider uppercase text-primary">{t.author}</p>
                    <p className="text-xs text-[#9A8A7E] mt-1">{t.handle}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO THIS IS FOR */}
      <section className="py-20 md:py-28 px-6 bg-[#FAF8F6]">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <SectionLabel>Who This Is For</SectionLabel>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#1A1A2E] mb-3 leading-tight max-w-xl" data-testid="text-who-headline">
              You are the right fit if&hellip;
            </h2>
            <p className="text-base md:text-lg text-[#4A4A5E] max-w-xl mb-12 leading-relaxed">
              You are a visionary woman founder who has built something real {"—"} and you are ready to operate at a higher level with intelligent systems behind you.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 border border-[#C9A96E]/20 rounded-md overflow-hidden mb-12">
            {whoFitItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className={`flex items-start gap-3 p-5 text-sm text-[#4A4A5E] leading-relaxed border-b border-[#C9A96E]/20 ${i % 2 === 0 ? 'sm:border-r' : ''} ${i >= whoFitItems.length - 2 ? 'sm:border-b-0' : ''} ${i === whoFitItems.length - 1 ? 'border-b-0' : ''}`}
                data-testid={`item-who-fit-${i}`}
              >
                <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </motion.div>
            ))}
          </div>

          <Card className="border-2 border-[#C9A96E]/30 max-w-xl rounded-sm bg-[#F2E0D6]/20" data-testid="text-who-not">
            <CardContent className="p-7">
              <p className="font-serif text-lg md:text-xl italic font-light text-[#1A1A2E] leading-relaxed">
                This is not for casual experimentation.<br />
                This is for women who are ready to evolve how they operate.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* STRUCTURE / 4 WEEKS */}
      <section className="py-20 md:py-28 px-6 bg-[#FAF8F6]">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <SectionLabel>The Experience</SectionLabel>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#1A1A2E] mb-4 max-w-lg leading-tight" data-testid="text-structure-headline">
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
                <span className="text-sm text-[#4A4A5E]">{meta.value}</span>
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
                  <h3 className="font-serif text-2xl font-medium text-[#1A1A2E] mb-2 leading-tight">{week.title}</h3>
                  <p className="text-sm text-[#9A8A7E] leading-relaxed max-w-xl mb-4">{week.desc}</p>
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
            className="font-serif text-xl md:text-2xl italic font-light text-[#4A4A5E] text-center pt-14 border-t border-[#C9A96E]/10 leading-relaxed"
            data-testid="text-structure-close"
          >
            You do not leave dependent.<br />You leave integrated.
          </motion.p>
        </div>
      </section>

      {/* ABOUT NADIA */}
      <section className="py-20 md:py-28 px-6 bg-[#FAF8F6]">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <SectionLabel>About Nadia</SectionLabel>
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
              <div>
                <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#1A1A2E] leading-tight mb-7" data-testid="text-about-headline">
                  Built by someone who thinks in systems.
                </h2>
                <div className="text-sm md:text-base text-[#4A4A5E] leading-relaxed space-y-4">
                  <p>I'm Nadia Ben Brahim {"—"} founder of MetaHers. I studied Computer Science and graduated in 2008, then spent the next decade building a career in luxury hospitality, rising from Front Office Manager to <strong className="text-[#1A1A2E] font-semibold">Hotel General Manager in Los Angeles</strong>.</p>
                  <p>Throughout that career, I became known for one thing above all else: <strong className="text-[#1A1A2E] font-semibold">systems thinking</strong>. I optimized operations, resolved complex technical problems independently, and integrated tools into real-world execution at the highest level.</p>
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
                    <Card className="border border-[#C9A96E]/20 rounded-sm bg-white shadow-sm" data-testid={`card-credential-${i}`}>
                      <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-1">
                          <cred.icon className="w-3.5 h-3.5 text-primary" />
                          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-primary">{cred.title}</span>
                        </div>
                        <p className="text-sm text-[#4A4A5E] leading-relaxed">{cred.text}</p>
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
      <section className="py-20 md:py-28 px-6 text-center bg-[#FAF8F6]">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="flex items-center justify-center gap-3 mb-10">
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">Investment</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#1A1A2E] mb-4 leading-tight" data-testid="text-investment-headline">
              What this represents
            </h2>
            <p className="text-base text-[#4A4A5E] max-w-xl mx-auto mb-12 leading-relaxed">
              Hiring a dedicated AI operations consultant or systems strategist runs $5,000{"–"}$15,000+ for comparable private, hands-on work. This is four weeks of private 1:1 architecture built around you, with a fully owned system as the deliverable.
            </p>

            <div className="inline-flex flex-col items-center bg-white border border-[#C9A96E]/25 shadow-sm px-12 sm:px-16 py-12 rounded-sm mb-4" data-testid="card-price-block">
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary mb-4">Founding Rate</span>
              <div className="flex items-baseline gap-4 mb-3">
                <span className="font-serif text-6xl sm:text-7xl md:text-8xl font-light text-primary leading-none">$997</span>
                <span className="font-serif text-3xl font-light line-through text-[#9A8A7E]/50">$1,997</span>
              </div>
              <div className="text-[13px] text-[#9A8A7E] leading-relaxed text-center mb-3">
                4 x 60-min 1:1 sessions {"·"} Async support between sessions<br />
                Custom prompt library {"·"} Full system ownership
              </div>
              <span className="font-mono text-[11px] tracking-wider uppercase text-primary/60">
                Includes 3 months MetaHers Studio
              </span>
            </div>

            <p className="font-serif text-base md:text-lg italic font-light text-[#4A4A5E]/70 max-w-lg mx-auto mb-14 leading-relaxed">
              This is not a course. It is not a subscription. It is a private engagement with a defined outcome {"—"} designed for women who are serious about building real leverage.
            </p>

            <div className="flex flex-col items-center gap-4">
              <Button
                size="lg"
                onClick={() => handleCTA('investment')}
                className="font-mono text-xs tracking-[0.18em] uppercase"
                data-testid="button-cta-investment"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Apply Now
              </Button>
              <span className="font-mono text-[11px] tracking-wider uppercase text-[#9A8A7E]">
                Application-based {"·"} Limited availability
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 px-6 border-t border-[#C9A96E]/20 bg-[#FAF8F6]">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <SectionLabel>Questions</SectionLabel>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#1A1A2E] mb-14 leading-tight" data-testid="text-faq-headline">
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
                className="border-b border-[#C9A96E]/15 first:border-t first:border-[#C9A96E]/15"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-start justify-between gap-6 py-7 text-left group"
                  data-testid={`button-faq-${i}`}
                >
                  <span className={`font-serif text-lg md:text-xl font-medium leading-snug transition-colors ${openFaq === i ? 'text-[#C9A96E]' : 'text-[#1A1A2E]'}`}>
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-primary flex-shrink-0 mt-1 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-400 ease-in-out ${openFaq === i ? 'max-h-60 pb-7' : 'max-h-0'}`}
                >
                  <p className="text-sm md:text-base text-[#4A4A5E] leading-relaxed pr-10">{faq.a}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* APPLICATION FORM */}
      <section id="blueprint-application" className="relative py-24 md:py-32 px-6 overflow-hidden bg-[#FAF8F6]">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 50% 60% at 50% 100%, rgba(201,169,110,0.08) 0%, transparent 70%)"
        }} />

        <div className="relative z-10 max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="text-center mb-12">
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary mb-4">The AI Blueprint</p>
              <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#1A1A2E] leading-tight mb-4" data-testid="text-apply-headline">
                Apply for The AI Blueprint
              </h2>
              <p className="text-base text-[#4A4A5E] max-w-md mx-auto leading-relaxed">
                4 weeks. 1:1 with Nadia. Tell us about your business so we can determine if the Blueprint is the right fit.
              </p>
            </div>

            {submitted ? (
              <div className="text-center py-14 px-6 border border-primary/20 rounded-sm" style={{ background: 'rgba(201,169,110,0.05)' }} data-testid="div-apply-confirmation">
                <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-serif text-3xl sm:text-4xl font-light text-[#1A1A2E] mb-4">Application submitted</h3>
                <p className="text-[#4A4A5E] text-sm md:text-base max-w-md mx-auto leading-relaxed mb-8">
                  Nadia will personally review your answers. To move faster, book your AI Blueprint discovery call now.
                </p>
                <Button
                  size="lg"
                  asChild
                  className="font-mono text-xs tracking-[0.18em] uppercase"
                  data-testid="button-book-discovery-call"
                >
                  <a href="https://calendly.com/nadia-metahers/discovery-call" target="_blank" rel="noreferrer">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Discovery Call
                  </a>
                </Button>
                <p className="text-[#9A8A7E] font-mono text-[11px] tracking-wider mt-5">
                  You’ll also receive a confirmation email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="form-blueprint-apply">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm text-[#4A4A5E] font-mono tracking-wide">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
                      className="bg-white border-[#C9A96E]/20 text-[#1A1A2E] placeholder:text-[#9A8A7E] focus:border-[#C9A96E]/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm text-[#4A4A5E] font-mono tracking-wide">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="you@yourbusiness.com"
                      className="bg-white border-[#C9A96E]/20 text-[#1A1A2E] placeholder:text-[#9A8A7E] focus:border-[#C9A96E]/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessName" className="text-sm text-[#4A4A5E] font-mono tracking-wide">Business Name</Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    value={form.businessName}
                    onChange={handleChange}
                    placeholder="Your business or brand name"
                    className="bg-white border-[#C9A96E]/20 text-[#1A1A2E] placeholder:text-[#9A8A7E] focus:border-[#C9A96E]/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessDescription" className="text-sm text-[#4A4A5E] font-mono tracking-wide">What does your business do? *</Label>
                  <Textarea
                    id="businessDescription"
                    name="businessDescription"
                    value={form.businessDescription}
                    onChange={handleChange}
                    required
                    rows={3}
                    placeholder="Describe your business in 2-3 sentences"
                    className="bg-white border-[#C9A96E]/20 text-[#1A1A2E] placeholder:text-[#9A8A7E] focus:border-[#C9A96E]/50 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="challenge" className="text-sm text-[#4A4A5E] font-mono tracking-wide">What's your biggest challenge with AI right now? *</Label>
                  <Textarea
                    id="challenge"
                    name="challenge"
                    value={form.challenge}
                    onChange={handleChange}
                    required
                    rows={3}
                    placeholder="Be specific — what's not working or what feels unclear?"
                    className="bg-white border-[#C9A96E]/20 text-[#1A1A2E] placeholder:text-[#9A8A7E] focus:border-[#C9A96E]/50 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="successVision" className="text-sm text-[#4A4A5E] font-mono tracking-wide">What would success look like after 4 weeks? *</Label>
                  <Textarea
                    id="successVision"
                    name="successVision"
                    value={form.successVision}
                    onChange={handleChange}
                    required
                    rows={3}
                    placeholder="Describe the outcome you're hoping for"
                    className="bg-white border-[#C9A96E]/20 text-[#1A1A2E] placeholder:text-[#9A8A7E] focus:border-[#C9A96E]/50 resize-none"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="revenueRange" className="text-sm text-[#4A4A5E] font-mono tracking-wide">Monthly Revenue Range</Label>
                    <select
                      id="revenueRange"
                      name="revenueRange"
                      value={form.revenueRange}
                      onChange={handleChange}
                      className="w-full h-10 px-3 rounded-md text-sm bg-white border border-[#C9A96E]/20 text-[#1A1A2E] focus:outline-none focus:border-[#C9A96E]/50"
                    >
                      <option value="" className="bg-white">Select range</option>
                      <option value="pre-revenue" className="bg-white">Pre-revenue</option>
                      <option value="under-1k" className="bg-white">Under $1K/mo</option>
                      <option value="1k-5k" className="bg-white">$1K – $5K/mo</option>
                      <option value="5k-10k" className="bg-white">$5K – $10K/mo</option>
                      <option value="10k-plus" className="bg-white">$10K+/mo</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="source" className="text-sm text-[#4A4A5E] font-mono tracking-wide">How did you hear about MetaHers?</Label>
                    <select
                      id="source"
                      name="source"
                      value={form.source}
                      onChange={handleChange}
                      className="w-full h-10 px-3 rounded-md text-sm bg-white border border-[#C9A96E]/20 text-[#1A1A2E] focus:outline-none focus:border-[#C9A96E]/50"
                    >
                      <option value="" className="bg-white">Select source</option>
                      <option value="instagram" className="bg-white">Instagram</option>
                      <option value="x-twitter" className="bg-white">X / Twitter</option>
                      <option value="google" className="bg-white">Google</option>
                      <option value="referral" className="bg-white">Friend / Referral</option>
                      <option value="newsletter" className="bg-white">Newsletter</option>
                      <option value="other" className="bg-white">Other</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={submitting}
                    size="lg"
                    className="w-full font-mono text-xs tracking-[0.18em] uppercase"
                    style={{ background: '#C9A96E', color: '#1A1A2E' }}
                    data-testid="button-submit-application"
                  >
                    {submitting ? "Submitting..." : "Submit Application"}
                  </Button>
                  <p className="text-center text-[#9A8A7E] font-mono text-[11px] tracking-wider mt-4">
                    Application-based · Limited availability · No payment required to apply
                  </p>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* FOOTER NOTE */}
      <div className="py-8 px-6 text-center border-t border-primary/10 bg-[#FAF8F6]">
        <p className="font-mono text-[11px] tracking-wider text-[#9A8A7E]">
          MetaHers · The AI Blueprint · Private · By Application
        </p>
      </div>
    </div>
  );
}
