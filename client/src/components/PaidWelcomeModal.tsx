import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Crown, Star, Zap, Users, BookOpen, ArrowRight, CheckCircle } from "lucide-react";

interface PaidWelcomeModalProps {
  onComplete: () => void;
  userName?: string;
  tier: string;
}

export function PaidWelcomeModal({ onComplete, userName, tier }: PaidWelcomeModalProps) {
  const [step, setStep] = useState(0);
  const isPrivate = tier.includes('private');
  const firstName = userName || 'Founder';

  const studioSteps = [
    {
      icon: <Crown className="w-10 h-10" style={{ color: '#C9A96E' }} />,
      title: `You're in the Studio, ${firstName}.`,
      subtitle: "Your AI concierge team is ready.",
      body: "MetaHers Studio gives you daily access to six AI specialists — ARIA, Nova, Luna, Bella, Sage, and Noor — up to 40 messages a day. This is your creative and strategic edge.",
      list: null as null | { icon: React.ReactNode; text: string }[],
      cta: "Show me around",
    },
    {
      icon: <Zap className="w-10 h-10" style={{ color: '#C9A96E' }} />,
      title: "Here's what to do first.",
      subtitle: "Three moves that will make Studio click for you.",
      body: null as null | string,
      list: [
        { icon: <Star className="w-4 h-4" style={{ color: '#C9A96E' }} />, text: "Open the concierge and tell ARIA what you're working on right now" },
        { icon: <BookOpen className="w-4 h-4" style={{ color: '#6b8fd4' }} />, text: "Explore Prompt Studio — customize one prompt and send it to an agent today" },
        { icon: <Users className="w-4 h-4" style={{ color: '#6dbf91' }} />, text: "Check the schedule for the next Implementation Lab or Office Hours" },
      ],
      cta: "Got it — next",
    },
    {
      icon: <CheckCircle className="w-10 h-10" style={{ color: '#C9A96E' }} />,
      title: "Your team is ready when you are.",
      subtitle: null as null | string,
      body: "Six specialists. 40 messages a day. Prompt Studio, the learning hub, and live community sessions. You have everything you need. The only move left is to use it.",
      list: null as null | { icon: React.ReactNode; text: string }[],
      cta: "Take me to Studio →",
    },
  ];

  const privateSteps = [
    {
      icon: <Crown className="w-10 h-10" style={{ color: '#C9A96E' }} />,
      title: `Your Private Advisory is live, ${firstName}.`,
      subtitle: "Welcome to the most intimate tier of MetaHers.",
      body: "Private Advisory is built for founders who want depth — 150 daily messages, a monthly private strategy review with Nadia's team, priority concierge access, and exclusive templates and workflows.",
      list: null as null | { icon: React.ReactNode; text: string }[],
      cta: "Tell me more",
    },
    {
      icon: <Star className="w-10 h-10" style={{ color: '#C9A96E' }} />,
      title: "Start here.",
      subtitle: "Three things that will activate your Private Advisory.",
      body: null as null | string,
      list: [
        { icon: <Zap className="w-4 h-4" style={{ color: '#C9A96E' }} />, text: "Open the concierge and give ARIA the full picture of your business and goals" },
        { icon: <BookOpen className="w-4 h-4" style={{ color: '#6b8fd4' }} />, text: "Browse your Private Templates — built for complex business needs" },
        { icon: <Users className="w-4 h-4" style={{ color: '#6dbf91' }} />, text: "Book your first Private Strategy Review — message ARIA to schedule it" },
      ],
      cta: "Got it — next",
    },
    {
      icon: <CheckCircle className="w-10 h-10" style={{ color: '#C9A96E' }} />,
      title: "A personal note.",
      subtitle: null as null | string,
      body: "Nadia's team will be in touch within 24 hours to welcome you personally and help you get your first strategy session on the calendar. In the meantime — the concierge is live and your team is ready.",
      list: null as null | { icon: React.ReactNode; text: string }[],
      cta: "Open my Advisory →",
    },
  ];

  const steps = isPrivate ? privateSteps : studioSteps;
  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  const headerBg = isPrivate
    ? 'linear-gradient(135deg, #2d2520 0%, #3d2f28 100%)'
    : 'linear-gradient(135deg, #1A1A2E 0%, #2a1a3e 100%)';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <Card className="overflow-hidden shadow-2xl border-0">
            {/* Header */}
            <div className="p-8 text-center" style={{ background: headerBg }}>
              <div className="flex justify-center mb-4">
                {currentStep.icon}
              </div>
              <div
                className="text-xs font-semibold tracking-widest uppercase mb-2"
                style={{ color: 'rgba(201,169,110,0.7)' }}
              >
                {isPrivate ? 'Private Advisory' : 'MetaHers Studio'}
              </div>
              <h2
                className="text-xl font-bold leading-tight"
                style={{ color: '#ffffff', fontFamily: "Georgia, 'Playfair Display', serif" }}
              >
                {currentStep.title}
              </h2>
              {currentStep.subtitle && (
                <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {currentStep.subtitle}
                </p>
              )}
            </div>

            {/* Body */}
            <div className="p-8">
              {currentStep.body && (
                <p className="text-sm leading-relaxed mb-6" style={{ color: '#3a3030' }}>
                  {currentStep.body}
                </p>
              )}

              {currentStep.list && (
                <ul className="space-y-4 mb-6">
                  {currentStep.list.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 flex-shrink-0">{item.icon}</span>
                      <span className="text-sm leading-relaxed" style={{ color: '#3a3030' }}>
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Progress dots */}
              <div className="flex justify-center gap-2 mb-6">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: i === step ? '#C9A96E' : '#e5e0d8',
                      width: i === step ? '24px' : '8px',
                    }}
                  />
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={() => {
                  if (isLastStep) {
                    onComplete();
                  } else {
                    setStep(s => s + 1);
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded font-semibold text-sm transition-opacity hover:opacity-90"
                style={{ background: '#C9A96E', color: '#1A1A2E' }}
              >
                {currentStep.cta}
                <ArrowRight className="w-4 h-4" />
              </button>

              {step === 0 && (
                <button
                  onClick={onComplete}
                  className="w-full text-center text-xs mt-3 hover:underline"
                  style={{ color: '#aaa' }}
                >
                  Skip for now
                </button>
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
