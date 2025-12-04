import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, Target, Lightbulb, Users, ArrowRight, RefreshCw, Check, Download, Share2, Palette, Pencil, Star, Crown, Globe, Briefcase, DollarSign, Book, HeartPulse, HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequestJson, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { VisionBoardDB, VisionTileDB } from "@shared/schema";

type Phase = "welcome" | "intention" | "creation" | "reveal";

const LIFE_DIMENSIONS = [
  { id: "career", label: "Career & Purpose", icon: Briefcase, color: "bg-purple-100 text-purple-700", description: "Your professional growth and impact" },
  { id: "wealth", label: "Wealth & Abundance", icon: DollarSign, color: "bg-purple-50 text-purple-600", description: "Financial freedom and prosperity" },
  { id: "learning", label: "Learning & Growth", icon: Book, color: "bg-purple-100 text-purple-700", description: "Skills, knowledge, and personal development" },
  { id: "wellness", label: "Wellness & Energy", icon: HeartPulse, color: "bg-purple-50 text-purple-600", description: "Physical health and vitality" },
  { id: "relationships", label: "Relationships", icon: Heart, color: "bg-purple-100 text-purple-700", description: "Love, family, and meaningful connections" },
  { id: "lifestyle", label: "Lifestyle & Freedom", icon: HomeIcon, color: "bg-purple-50 text-purple-600", description: "How you want to live daily" },
  { id: "impact", label: "Impact & Legacy", icon: Globe, color: "bg-purple-100 text-purple-700", description: "The difference you want to make" },
];

export default function VisionBoardPage() {
  const [phase, setPhase] = useState<Phase>("welcome");
  const [isBreathing, setIsBreathing] = useState(false);
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([]);
  const [coreWord, setCoreWord] = useState("");
  const [futureSelfMessage, setFutureSelfMessage] = useState("");
  const [currentBoardId, setCurrentBoardId] = useState<string | null>(null);
  const [generatedTiles, setGeneratedTiles] = useState<VisionTileDB[]>([]);
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: existingBoard, isLoading: loadingBoard } = useQuery<{ board: VisionBoardDB; tiles: VisionTileDB[] } | null>({
    queryKey: ["/api/vision-board", 2026],
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (existingBoard?.board) {
      setCoreWord(existingBoard.board.coreWord || "");
      setFutureSelfMessage(existingBoard.board.futureSelfMessage || "");
      setSelectedDimensions((existingBoard.board.focusDimensions as string[]) || []);
      setCurrentBoardId(existingBoard.board.id);
      setGeneratedTiles(existingBoard.tiles || []);
      
      if (existingBoard.board.status === "complete") {
        setPhase("reveal");
      } else if (existingBoard.board.status === "tiles_created" && existingBoard.tiles?.length > 0) {
        setPhase("creation");
      } else if (existingBoard.board.status === "intention_set") {
        setPhase("intention");
      }
    }
  }, [existingBoard]);

  const saveBoardMutation = useMutation<VisionBoardDB, Error, { coreWord: string; futureSelfMessage: string; focusDimensions: string[]; status?: string }>({
    mutationFn: async (data) => {
      return await apiRequestJson<VisionBoardDB>("POST", "/api/vision-board", {
        year: 2026,
        ...data
      });
    },
    onSuccess: (data) => {
      setCurrentBoardId(data.id);
      queryClient.invalidateQueries({ queryKey: ["/api/vision-board", 2026] });
    },
    onError: (error) => {
      toast({
        title: "Error saving vision board",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const generateTilesMutation = useMutation<{ tiles: VisionTileDB[] }, Error, string>({
    mutationFn: async (boardId) => {
      return await apiRequestJson<{ tiles: VisionTileDB[] }>("POST", `/api/vision-board/${boardId}/generate-tiles`, {});
    },
    onSuccess: (data) => {
      setGeneratedTiles(data.tiles);
      queryClient.invalidateQueries({ queryKey: ["/api/vision-board", 2026] });
    },
    onError: (error) => {
      toast({
        title: "Error generating vision tiles",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const completeBoardMutation = useMutation<VisionBoardDB, Error, string>({
    mutationFn: async (boardId) => {
      return await apiRequestJson<VisionBoardDB>("POST", `/api/vision-board/${boardId}/complete`, {});
    },
    onSuccess: () => {
      setPhase("reveal");
      queryClient.invalidateQueries({ queryKey: ["/api/vision-board", 2026] });
      toast({
        title: "Vision Board Complete!",
        description: "Your 2026 vision is now set. Time to make it happen!"
      });
    }
  });

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
    }, 8000);
  };

  const handleContinueToCreation = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your vision board",
        variant: "destructive"
      });
      setLocation("/login?redirect=/vision-board");
      return;
    }

    try {
      const savedBoard = await saveBoardMutation.mutateAsync({
        coreWord,
        futureSelfMessage,
        focusDimensions: selectedDimensions,
        status: "intention_set"
      });

      setPhase("creation");
      
      if (savedBoard?.id) {
        setCurrentBoardId(savedBoard.id);
        generateTilesMutation.mutate(savedBoard.id);
      }
    } catch (error) {
      console.error("Error saving board:", error);
    }
  };

  const handleCompleteBoard = () => {
    if (currentBoardId) {
      completeBoardMutation.mutate(currentBoardId);
    }
  };

  const getDimensionIcon = (dimensionId: string) => {
    const dim = LIFE_DIMENSIONS.find(d => d.id === dimensionId);
    return dim?.icon || Star;
  };

  const getDimensionColor = (dimensionId: string) => {
    const dim = LIFE_DIMENSIONS.find(d => d.id === dimensionId);
    return dim?.color || "bg-gray-100 text-gray-700";
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

            <AnimatePresence>
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
                        repeat: 1,
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
                          repeat: 1,
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
            </AnimatePresence>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {LIFE_DIMENSIONS.map((dim) => {
                    const Icon = dim.icon;
                    const isSelected = selectedDimensions.includes(dim.id);
                    return (
                      <button
                        key={dim.id}
                        onClick={() => toggleDimension(dim.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          isSelected 
                            ? "border-purple-600 bg-purple-50" 
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        data-testid={`button-dimension-${dim.id}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg ${dim.color} flex items-center justify-center flex-shrink-0`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-black">{dim.label}</p>
                            <p className="text-sm text-gray-500 mt-0.5">{dim.description}</p>
                          </div>
                          {isSelected && (
                            <Check className="w-5 h-5 text-purple-600 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {selectedDimensions.length > 0 && (
                  <p className="text-sm text-gray-500 mt-3">
                    {selectedDimensions.length} area{selectedDimensions.length !== 1 ? "s" : ""} selected
                    {selectedDimensions.length < 3 && " (select at least 3)"}
                  </p>
                )}
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
                  onClick={handleContinueToCreation}
                  disabled={!coreWord || selectedDimensions.length < 3 || saveBoardMutation.isPending}
                  className="bg-black hover:bg-gray-900 text-white"
                  data-testid="button-continue-creation"
                >
                  {saveBoardMutation.isPending ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Continue to Creation
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
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
                  {generateTilesMutation.isPending ? "Your AI Muse is Crafting Your Vision" : "Your Vision Tiles"}
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {generateTilesMutation.isPending 
                    ? "Based on your intentions, we're generating personalized vision tiles..."
                    : "Review your AI-generated vision tiles. You can customize them to make them truly yours."}
                </p>
              </div>

              {generateTilesMutation.isPending ? (
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
                        Generating {selectedDimensions.length} vision tiles
                      </p>
                    </div>
                  </div>
                </div>
              ) : generatedTiles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {generatedTiles.map((tile, index) => {
                    const Icon = getDimensionIcon(tile.dimension);
                    const colorClass = getDimensionColor(tile.dimension);
                    return (
                      <motion.div
                        key={tile.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="h-full border-gray-200 hover:border-purple-300 transition-all overflow-hidden">
                          <div className={`h-2 ${colorClass.replace('text-', 'bg-').split(' ')[0]}`} />
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {LIFE_DIMENSIONS.find(d => d.id === tile.dimension)?.label}
                              </Badge>
                            </div>
                            <CardTitle className="text-lg mt-3">{tile.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-600 italic text-sm mb-4">
                              "{tile.affirmation}"
                            </p>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="flex-1" disabled>
                                <Pencil className="w-3 h-3 mr-1" />
                                Edit
                              </Button>
                              <Button size="sm" variant="outline" disabled>
                                <Palette className="w-3 h-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">
                    No tiles generated yet. Click below to generate your vision tiles.
                  </p>
                  <Button
                    onClick={() => currentBoardId && generateTilesMutation.mutate(currentBoardId)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={!currentBoardId}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Vision Tiles
                  </Button>
                </div>
              )}

              {generatedTiles.length > 0 && (
                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setPhase("intention")}
                    className="border-gray-200"
                  >
                    Back to Intentions
                  </Button>
                  <Button
                    onClick={() => setPhase("reveal")}
                    className="bg-black hover:bg-gray-900 text-white"
                    data-testid="button-continue-reveal"
                  >
                    Complete My Vision
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
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
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-12"
              >
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Badge className="mb-6 bg-purple-100 text-purple-700 border-0 px-4 py-2">
                    <Crown className="w-4 h-4 mr-2" />
                    Your 2026 Vision Board
                  </Badge>
                </motion.div>
                
                <motion.h2 
                  className="text-4xl sm:text-5xl font-semibold text-black mb-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {coreWord || "Your Vision"}
                </motion.h2>

                <motion.p 
                  className="text-gray-600 max-w-xl mx-auto"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Your intentions are set. Your vision is clear. Now it's time to make it happen.
                </motion.p>
              </motion.div>

              {generatedTiles.length > 0 && (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  {generatedTiles.map((tile, index) => {
                    const Icon = getDimensionIcon(tile.dimension);
                    const colorClass = getDimensionColor(tile.dimension);
                    return (
                      <motion.div
                        key={tile.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                      >
                        <Card className="h-full bg-gradient-to-br from-white to-gray-50 border-gray-200 overflow-hidden">
                          <div className={`h-1.5 ${colorClass.replace('text-', 'bg-').split(' ')[0]}`} />
                          <CardContent className="p-5">
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`w-8 h-8 rounded-lg ${colorClass} flex items-center justify-center`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <span className="text-xs text-gray-500 uppercase tracking-wider">
                                {LIFE_DIMENSIONS.find(d => d.id === tile.dimension)?.label}
                              </span>
                            </div>
                            <h3 className="font-semibold text-black mb-2">{tile.title}</h3>
                            <p className="text-sm text-gray-600 italic">"{tile.affirmation}"</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 mb-8">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold text-black mb-2 flex items-center justify-center gap-2">
                      <Users className="w-5 h-5 text-purple-600" />
                      Vision Sisters
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Connect with women who share your goals and build accountability partnerships.
                    </p>
                    <Badge variant="outline" className="border-purple-300 text-purple-700">
                      Coming Soon
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
              >
                <Button
                  variant="outline"
                  onClick={() => setPhase("creation")}
                  className="border-gray-200"
                >
                  Edit My Board
                </Button>
                <Button
                  onClick={handleCompleteBoard}
                  disabled={completeBoardMutation.isPending}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  data-testid="button-complete-board"
                >
                  {completeBoardMutation.isPending ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  Complete & Save
                </Button>
                <Button
                  onClick={() => setLocation("/")}
                  className="bg-black hover:bg-gray-900 text-white"
                  data-testid="button-back-home"
                >
                  Back to Home
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
