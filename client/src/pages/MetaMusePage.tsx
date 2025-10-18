import { motion } from "framer-motion";
import { ExternalLink, MessageSquare, Sparkles } from "lucide-react";
import { CTAButton } from "@/components/CTAButton";
import metaMuseIllustration from "@assets/generated_images/MetaMuse_AI_assistant_illustration_941c00b9.png";

export default function MetaMusePage() {
  const handleOpenMetaMuse = () => {
    window.open(
      "https://chatgpt.com/g/g-676873de461c8191a95b58d1361b6fb6-metamuse-drop-one",
      "_blank"
    );
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-champagne">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6 shadow-md">
            <MessageSquare className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-onyx">
              AI-Powered Guidance
            </span>
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-onyx mb-6" data-testid="text-page-title">
            MetaMuse
          </h1>

          <p className="text-xl text-foreground/70 max-w-2xl mx-auto mb-12 leading-relaxed">
            Your personal AI guide for all things Web3, AI, and beyond. 
            Get instant answers, personalized guidance, and creative inspiration.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 100 }}
            className="mb-12"
          >
            <div className="w-64 h-64 mx-auto mb-8 animate-float">
              <img
                src={metaMuseIllustration}
                alt="MetaMuse AI"
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <CTAButton
              onClick={handleOpenMetaMuse}
              size="lg"
              className="text-lg px-8 py-6"
              dataTestId="button-open-metamuse"
            >
              <MessageSquare className="mr-2 w-5 h-5" />
              Open MetaMuse
              <ExternalLink className="ml-2 w-5 h-5" />
            </CTAButton>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {[
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: "Personalized",
                description: "Tailored guidance based on your learning journey",
              },
              {
                icon: <MessageSquare className="w-6 h-6" />,
                title: "Always Available",
                description: "24/7 access to AI-powered insights and support",
              },
              {
                icon: <ExternalLink className="w-6 h-6" />,
                title: "Deeply Integrated",
                description: "Connected to your rituals and journal entries",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="glass-card rounded-2xl p-6 text-center shadow-md"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-mint/30 to-mint/10 mb-4 text-mint-foreground">
                  {feature.icon}
                </div>
                <h3 className="font-serif text-lg font-semibold text-onyx mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-foreground/70">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
