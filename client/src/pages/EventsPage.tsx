import { motion } from "framer-motion";
import { Calendar, Video } from "lucide-react";

export default function EventsPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-champagne">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6 shadow-md">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-onyx">
                One-on-One Guidance
              </span>
            </div>

            <h1 className="font-serif text-5xl font-bold text-onyx mb-4" data-testid="text-page-title">
              Book Your Discovery Call
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-8">
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
            className="glass-card rounded-2xl overflow-hidden shadow-lg"
          >
            <div className="bg-gradient-to-br from-blush/30 to-champagne/30 p-6 border-b border-white/20">
              <h2 className="font-serif text-2xl font-semibold text-onyx">
                Schedule Your Call
              </h2>
              <p className="text-sm text-foreground/70 mt-2">
                Select a date and time that works best for you
              </p>
            </div>

            <div className="bg-white/50 p-2">
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
