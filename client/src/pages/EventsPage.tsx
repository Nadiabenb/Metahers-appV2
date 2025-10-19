import { motion } from "framer-motion";
import { Calendar, Video } from "lucide-react";

export default function EventsPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 glass-card px-6 py-3 rounded-full mb-6 neon-glow-violet">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium tracking-wide uppercase">
                One-on-One Guidance
              </span>
            </div>

            <h1 className="font-serif text-5xl font-bold text-gradient-violet mb-4" data-testid="text-page-title">
              Book Your Discovery Call
            </h1>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-8">
              Connect with our team for personalized guidance on your MetaHers journey. 
              Discuss rituals, products, and how we can support your growth.
            </p>

            <div className="flex items-center justify-center gap-8 mb-12">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Video className="w-5 h-5" />
                <span className="text-sm">30 min video call</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-5 h-5" />
                <span className="text-sm">Choose your time</span>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="editorial-card overflow-hidden relative"
          >
            <div className="absolute inset-0 gradient-magenta-fuchsia opacity-5" />
            <div className="relative z-10">
              <div className="bg-gradient-to-br from-[hsl(var(--hyper-violet))]/10 to-[hsl(var(--magenta-quartz))]/10 p-6 border-b border-border">
                <h2 className="font-serif text-2xl font-semibold text-foreground">
                  Schedule Your Call
                </h2>
                <p className="text-sm text-foreground/80 mt-2">
                  Select a date and time that works best for you
                </p>
              </div>

              <div className="bg-card/30 p-2">
                <iframe
                  src="https://calendly.com/nadia-metahers/discovery-call"
                  width="100%"
                  height="700"
                  frameBorder="0"
                  className="rounded-lg"
                  title="Schedule Discovery Call"
                  data-testid="iframe-calendly"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center text-sm text-muted-foreground"
          >
            <p>All calls are conducted via video conferencing • No preparation needed</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
