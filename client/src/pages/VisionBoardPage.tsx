import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, Target, Lightbulb, Users, ArrowRight, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

type Phase = "welcome" | "intention" | "creation" | "reveal";

const LIFE_DIMENSIONS = [
  { id: "career", label: "Career & Purpose", icon: Target, color: "bg-purple-100 text-purple-700" },
  { id: "wealth", label: "Wealth & Abundance", icon: Sparkles, color: "bg-amber-100 text-amber-700" },
  { id: "learning", label: "Learning & Growth", icon: Lightbulb, color: "bg-blue-100 text-blue-700" },
  { id: "wellness", label: "Wellness & Energy", icon: Heart, color: "bg-green-100 text-green-700" },
  { id: "relationships", label: "Relationships", icon: Users, color: "bg-pink-100 text-pink-700" },
  { id: "lifestyle", label: "Lifestyle & Freedom", icon: Sparkles, color: "bg-indigo-100 text-indigo-700" },
  { id: "impact", label: "Impact & Legacy", icon: Target, color: "bg-orange-100 text-orange-700" },
];

export default function VisionBoardPage() {
  const [phase, setPhase] = useState<Phase>("welcome");
  const [isMuted, setIsMuted] = useState(true);
  const [isBreathing, setIsBreathing] = useState(false);
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([]);
  const [coreWord, setCoreWord] = useState("");
  const [futureSelfMessage, setFutureSelfMessage] = useState("");
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const toggleDimension = (id: string) => {
    setSelectedDimensions(prev => 
      prev.includes(id) 
        ? prev.filter(d => d !== id)
        : [...prev, id]
    );
  };

  const startBreathingExercise = () => {
    setIsBreathing(true);
    setTimeout(() => {
      setIsBreathing(false);
      setPhase("intention");
    }, 12000);
  };

  return (
    <div className="min-h-screen bg-white">
      <AnimatePresence mode="wait">
        {phase === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col"
          >
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Badge className="mb-6 bg-purple-100 text-purple-700 border-0 px-4 py-2">
                  <Sparkles className="w-4 h-4 mr-2" />
                  MetaHers Annual Vision Board Event
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-black mb-6 tracking-tight"
              >
                Your Year in Focus
                <span className="block text-purple-600">2026</span>
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-gray-600 max-w-2xl mb-8"
              >
                An AI-powered, self-guided vision board experience designed to help you 
                clarify your dreams, set powerful intentions, and connect with women 
                who share your aspirations.
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button
                  onClick={startBreathingExercise}
                  size="lg"
                  className="bg-black hover:bg-gray-900 text-white px-8 py-6 text-lg uppercase tracking-wider"
                  data-testid="button-start-vision"
                >
                  Begin Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-16 grid grid-cols-3 gap-8 text-center"
              >
                <div>
                  <p className="text-3xl font-bold text-black">3</p>
                  <p className="text-sm text-gray-500 uppercase tracking-wider">Phases</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-black">AI</p>
                  <p className="text-sm text-gray-500 uppercase tracking-wider">Powered</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-black">∞</p>
                  <p className="text-sm text-gray-500 uppercase tracking-wider">Connections</p>
                </div>
              </motion.div>
            </div>

            {isBreathing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
              >
                <div className="text-center text-white">
                  <motion.div
                    animate={{
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: 2,
                      ease: "easeInOut",
                    }}
                    className="w-32 h-32 rounded-full bg-purple-600/30 mx-auto mb-8 flex items-center justify-center"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.3, 1],
                      }}
                      transition={{
                        duration: 4,
                        repeat: 2,
                        ease: "easeInOut",
                      }}
                      className="w-20 h-20 rounded-full bg-purple-600/50"
                    />
                  </motion.div>
                  <p className="text-xl font-light">Take a deep breath...</p>
                  <p className="text-gray-400 mt-2">Preparing your sacred space</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {phase === "intention" && (
          <motion.div
            key="intention"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen py-16 px-4"
          >
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <Badge className="mb-4 bg-purple-100 text-purple-700 border-0">
                  Phase 1: Intention
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-semibold text-black mb-4">
                  Set Your Intentions for 2026
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Let's start by exploring what matters most to you. 
                  Your AI Muse will help guide this reflection.
                </p>
              </div>

              <Card className="mb-8 border-gray-200">
                <CardContent className="p-6">
                  <label className="block text-sm font-semibold text-black uppercase tracking-wider mb-3">
                    If you could capture 2026 in one word, what would it be?
                  </label>
                  <input
                    type="text"
                    value={coreWord}
                    onChange={(e) => setCoreWord(e.target.value)}
                    placeholder="e.g., Expansion, Liberation, Creation..."
                    className="w-full px-4 py-3 text-lg border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    data-testid="input-core-word"
                  />
                </CardContent>
              </Card>

              <Card className="mb-8 border-gray-200">
                <CardContent className="p-6">
                  <label className="block text-sm font-semibold text-black uppercase tracking-wider mb-3">
                    If you met your future self a year from now, what would she tell you?
                  </label>
                  <textarea
                    value={futureSelfMessage}
                    onChange={(e) => setFutureSelfMessage(e.target.value)}
                    placeholder="Close your eyes, imagine meeting yourself in December 2026..."
                    rows={4}
                    className="w-full px-4 py-3 text-lg border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    data-testid="input-future-self"
                  />
                </CardContent>
              </Card>

              <div className="mb-8">
                <h3 className="text-sm font-semibold text-black uppercase tracking-wider mb-4">
                  Select the areas you want to focus on (choose 3-5)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {LIFE_DIMENSIONS.map((dim) => {
                    const Icon = dim.icon;
                    const isSelected = selectedDimensions.includes(dim.id);
                    return (
                      <button
                        key={dim.id}
                        onClick={() => toggleDimension(dim.id)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          isSelected 
                            ? "border-purple-600 bg-purple-50" 
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        data-testid={`button-dimension-${dim.id}`}
                      >
                        <div className={`w-10 h-10 rounded-lg ${dim.color} flex items-center justify-center mb-2`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-medium text-black">{dim.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setPhase("welcome")}
                  className="border-gray-200"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setPhase("creation")}
                  disabled={!coreWord || selectedDimensions.length < 3}
                  className="bg-black hover:bg-gray-900 text-white"
                  data-testid="button-continue-creation"
                >
                  Continue to Creation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {phase === "creation" && (
          <motion.div
            key="creation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen py-16 px-4"
          >
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <Badge className="mb-4 bg-purple-100 text-purple-700 border-0">
                  Phase 2: Creation
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-semibold text-black mb-4">
                  Your AI Muse is Crafting Your Vision
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Based on your intentions, we're generating personalized vision tiles.
                  You can customize, regenerate, or add your own.
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 mb-8">
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-6"
                    />
                    <p className="text-lg font-medium text-black mb-2">
                      Creating your personalized vision board...
                    </p>
                    <p className="text-gray-500">
                      Your word: <span className="text-purple-600 font-semibold">{coreWord}</span>
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Focus areas: {selectedDimensions.map(d => 
                        LIFE_DIMENSIONS.find(dim => dim.id === d)?.label
                      ).join(", ")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-500 mb-4">
                  Full AI-powered vision board creation coming soon!
                </p>
                <Button
                  onClick={() => setPhase("reveal")}
                  className="bg-black hover:bg-gray-900 text-white"
                  data-testid="button-preview-reveal"
                >
                  Preview Reveal Experience
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {phase === "reveal" && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen py-16 px-4"
          >
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Badge className="mb-6 bg-purple-100 text-purple-700 border-0">
                  Phase 3: Reveal & Connect
                </Badge>
                
                <h2 className="text-3xl sm:text-4xl font-semibold text-black mb-6">
                  Your 2026 Vision is Complete!
                </h2>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 mb-8">
                  <p className="text-xl text-gray-700 mb-4">
                    Your core word: <span className="text-purple-600 font-bold text-2xl">{coreWord || "Expansion"}</span>
                  </p>
                  <p className="text-gray-600">
                    Vision board generation and community matching features are coming soon!
                  </p>
                </div>

                <Card className="border-purple-200 bg-purple-50/50 mb-8">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-black mb-3 flex items-center justify-center gap-2">
                      <Users className="w-5 h-5 text-purple-600" />
                      Vision Sisters (Coming Soon)
                    </h3>
                    <p className="text-gray-600 text-sm">
                      After your board is complete, our AI will match you with 2-3 women 
                      who share your goals and aspirations. Build accountability partnerships 
                      and join themed circles together.
                    </p>
                  </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => setPhase("welcome")}
                    variant="outline"
                    className="border-gray-200"
                  >
                    Start Over
                  </Button>
                  <Button
                    onClick={() => setLocation("/")}
                    className="bg-black hover:bg-gray-900 text-white"
                    data-testid="button-back-home"
                  >
                    Back to Home
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
