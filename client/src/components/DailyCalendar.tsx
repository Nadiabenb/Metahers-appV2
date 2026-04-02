import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, Share2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, addDays, subDays, startOfYear, differenceInDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";

// Empowering quotes for women entrepreneurs — covering ambition, AI as a tool, and sisterhood
const DAILY_QUOTES = [
  // Women empowerment & entrepreneurship
  "You don't need permission to build something great. You never did.",
  "The business you've been dreaming about deserves the energy you've been giving to doubt.",
  "Your ambition is not too much. The room was just too small.",
  "Every successful woman started before she felt ready.",
  "You are not too late. You are exactly on time.",
  "Your ideas deserve a seat at the table—build the table if you have to.",
  "The only ceiling in your business is the one you stop trying to reach.",
  "Confidence is not something you find. It's something you practice.",
  "Success looks different for every woman. Design yours.",
  "Your expertise is worth more than you're currently charging for it.",
  "You don't need to shrink to make others comfortable. Take up space.",
  "The world doesn't need fewer ambitious women. It needs more.",
  "Building a business is an act of courage. You are courageous.",
  "Your voice in the room changes what's possible in the room.",
  "Every no you hear is just redirecting you toward your yes.",
  "You are a business owner. Not a dreamer. Act like it.",
  "Show up for your business the way your business shows up for your clients.",
  "Your financial independence is a revolution. Keep going.",
  "The women who changed things didn't wait for things to change.",
  "You don't need to have it all figured out. You just need to take the next step.",
  "Your business is proof that your dreams are bigger than your fears.",
  "Own your story. It's the most powerful brand you have.",
  "The gap between where you are and where you want to be is simply action.",
  "You've already done hard things. This is just the next one.",
  "Stop waiting for someone to notice your potential. Act on it.",
  "Every woman who chose herself made the world a little more honest.",
  "Your standards are not too high. Your value is simply non-negotiable.",
  "Build something today that your future self will be grateful for.",
  "The entrepreneur in you is not a phase. She's the real you.",
  "Your boundaries protect your energy. Your energy builds your empire.",
  "You don't need a bigger platform. You need to use the one you have.",
  "Success is a habit. Start practicing it today.",
  "The most powerful thing you can invest in is yourself.",
  "Your skills, your time, your rules. That's what owning a business really means.",
  "There's no perfect moment to start. There's only now.",
  "You were made for more than just surviving. Thrive on purpose.",
  "Every decision you make for your business is an act of self-belief.",
  "Women who support women build unstoppable futures.",
  "The market doesn't need another voice. It needs yours.",
  "You are not behind. You are building something that takes time to do right.",
  // AI as an everyday tool
  "AI is not here to replace you. It's here to multiply you.",
  "You don't need to be a tech expert to benefit from AI. You just need to be curious.",
  "AI handles the routine so you can focus on the remarkable.",
  "Think of AI as the most productive assistant you've ever had—available around the clock.",
  "The women who thrive next will be the ones who learned to use AI as a partner.",
  "AI gives you your time back. What you do with it is entirely up to you.",
  "You don't need to understand how AI works. You need to understand how it works for you.",
  "Using AI is not cheating. It's called working smart.",
  "AI tools can draft, design, and research in minutes. Imagine what you can build with hours saved.",
  "Technology is most powerful in the hands of someone who knows what they want.",
  "AI is a tool. You are the vision. Together, there's nothing you can't create.",
  "Every hour AI saves you is an hour you can spend doing what only you can do.",
  "The future of business is human creativity amplified by smart tools.",
  "You already have the best ideas. AI helps you get them out faster.",
  "AI doesn't have your story, your insight, or your heart. Those are yours alone.",
  "Using new tools doesn't make you less authentic. It makes you more effective.",
  "The most successful entrepreneurs don't do everything. They use every tool available.",
  "AI learns from you. The more you use it, the more it serves your vision.",
  "Imagine a brainstorming partner who never gets tired. That's what AI can be for you.",
  "Technology meets you where you are. You don't need to be an expert to start.",
  "AI can't replace your relationships, your judgment, or your lived experience. Lead with those.",
  "The best AI strategy is simple: use it where it saves time, own it where it needs your heart.",
  "You don't need a degree to use AI tools. Just an open mind and a clear goal.",
  "Smart women use every resource available. AI is just the newest one.",
  "AI makes the impossible more possible for women building businesses on their own terms.",
  "Your creativity is the fuel. AI is the engine. You decide the destination.",
  "Every tool was once unfamiliar. Give yourself permission to learn this one.",
  "AI can handle your first draft. You provide the soul.",
  "Using AI is not a shortcut. It's an upgrade.",
  "The women changing their industries are using every advantage available. Be one of them.",
  // Growth, action & sisterhood
  "Progress over perfection. Every single time.",
  "Done is better than perfect. Perfect is the enemy of starting.",
  "The women around you are not your competition. They're your community.",
  "You don't need to have it all together to help someone else.",
  "Growth doesn't always feel like growth. Sometimes it feels like starting over.",
  "Every mistake you've made was also a lesson you didn't have to pay for twice.",
  "Resilience isn't about never falling. It's about always knowing you'll get back up.",
  "There's a version of you on the other side of this that you can't even imagine yet.",
  "Ask for help. Women who ask for help get further faster.",
  "One small step today creates the momentum you need tomorrow.",
  "The courage to begin is the hardest part. You've already found it before.",
  "When one woman rises, she carries others with her. Rise.",
  "Your season of learning is preparing you for your season of leading.",
  "Rest is not giving up. Rest is how you sustain the effort.",
  "The women who went before you opened doors. Keep them open for the ones behind you.",
  "You don't need more motivation. You need a smaller first step.",
  "Celebrate small wins. They are the foundation of big ones.",
  "Your community is your competitive advantage. Nurture it.",
  "Showing up consistently beats showing up perfectly.",
  "The most powerful investment you can make is in another woman's success.",
  "Learning new things isn't a sign you don't know enough. It's a sign you're paying attention.",
  "You don't have to do this alone. The right support changes everything.",
  "Your setback is someone else's inspiration. Share it.",
  "Clarity comes from action, not from waiting to feel ready.",
  "The sisterhood isn't just a network. It's a safety net.",
  "Comparison is the thief of progress. Stay in your own lane and accelerate.",
  "Every day you show up is a vote for the business you're building.",
];

interface DailyCalendarProps {
  className?: string;
}

export function DailyCalendar({ className = "" }: DailyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"forward" | "backward">("forward");
  const [favorites, setFavorites] = useState<number[]>([]);
  const { toast } = useToast();

  // Get quote index based on day of year (cycling through quotes)
  // Use proper modulo to handle negative numbers when navigating to previous years
  const dayOfYear = differenceInDays(currentDate, startOfYear(currentDate));
  const quoteIndex = ((dayOfYear % DAILY_QUOTES.length) + DAILY_QUOTES.length) % DAILY_QUOTES.length;
  const currentQuote = DAILY_QUOTES[quoteIndex] || DAILY_QUOTES[0]; // Fallback to first quote

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("calendar-favorites");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const handlePrevDay = () => {
    if (!isFlipping) {
      setFlipDirection("backward");
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentDate(prev => subDays(prev, 1));
        setIsFlipping(false);
      }, 300);
    }
  };

  const handleNextDay = () => {
    if (!isFlipping) {
      setFlipDirection("forward");
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentDate(prev => addDays(prev, 1));
        setIsFlipping(false);
      }, 300);
    }
  };

  const handleToday = () => {
    if (!isFlipping) {
      setFlipDirection("forward");
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentDate(new Date());
        setIsFlipping(false);
      }, 300);
    }
  };

  const toggleFavorite = () => {
    const newFavorites = favorites.includes(quoteIndex)
      ? favorites.filter(i => i !== quoteIndex)
      : [...favorites, quoteIndex];
    
    setFavorites(newFavorites);
    localStorage.setItem("calendar-favorites", JSON.stringify(newFavorites));
    
    toast({
      title: favorites.includes(quoteIndex) ? "Removed from favorites" : "Added to favorites",
      description: favorites.includes(quoteIndex) 
        ? "Quote removed from your collection" 
        : "Quote saved to your favorites",
    });
  };

  const handleShare = async () => {
    const shareText = `"${currentQuote}"\n\n— MetaHers Daily Calendar`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Daily Inspiration",
          text: shareText,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Copied to clipboard!",
          description: "Share this inspiration with your network",
        });
      } catch (err) {
        toast({
          title: "Could not copy",
          description: "Please try again",
          variant: "destructive",
        });
      }
    }
  };

  const isToday = format(currentDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
  const isFavorite = favorites.includes(quoteIndex);

  return (
    <div className={`relative ${className}`}>
      <div className="editorial-card p-4 relative overflow-visible">
        <div className="absolute inset-0 gradient-violet-fuchsia opacity-5" />
        
        {/* Calendar Header */}
        <div className="relative z-10 mb-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-cormorant text-lg font-bold text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Daily Inspiration
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevDay}
                disabled={isFlipping}
                data-testid="button-prev-day"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant={isToday ? "default" : "outline"}
                size="sm"
                onClick={handleToday}
                disabled={isFlipping || isToday}
                data-testid="button-today"
              >
                Today
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextDay}
                disabled={isFlipping}
                data-testid="button-next-day"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Flip Calendar Display */}
        <div className="relative z-10" style={{ perspective: "1000px" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={format(currentDate, "yyyy-MM-dd")}
              initial={{
                rotateX: flipDirection === "forward" ? -90 : 90,
                opacity: 0,
              }}
              animate={{
                rotateX: 0,
                opacity: 1,
              }}
              exit={{
                rotateX: flipDirection === "forward" ? 90 : -90,
                opacity: 0,
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className="relative"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Calendar Page */}
              <div className="bg-gradient-to-br from-card to-charcoal border border-primary/20 rounded-lg shadow-lg overflow-hidden">
                {/* Top Bar - Date Display */}
                <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-3 text-center border-b border-primary/30">
                  <div className="text-xs uppercase tracking-wider text-foreground font-medium">
                    {format(currentDate, "EEEE, MMMM d, yyyy")}
                  </div>
                </div>

                {/* Quote Display */}
                <div className="p-4 min-h-[120px] flex flex-col justify-center">
                  <div className="relative">
                    <div className="absolute -top-2 -left-1 text-3xl text-primary/20 font-serif">"</div>
                    <p className="text-sm md:text-base text-foreground/90 italic leading-relaxed pl-4 pr-2 font-light text-center">
                      {currentQuote}
                    </p>
                    <div className="absolute -bottom-2 -right-1 text-3xl text-primary/20 font-serif">"</div>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="px-3 pb-3 flex items-center justify-between border-t border-border/40 pt-3">
                  <div className="text-xs text-foreground uppercase tracking-wider">
                    Quote {quoteIndex + 1} of {DAILY_QUOTES.length}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleFavorite}
                      className={isFavorite ? "text-pink-500 h-8 w-8" : "h-8 w-8"}
                      data-testid="button-favorite"
                    >
                      <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleShare}
                      className="h-8 w-8"
                      data-testid="button-share"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Favorites Count */}
        {favorites.length > 0 && (
          <div className="relative z-10 mt-2 text-center text-xs text-foreground">
            ❤️ {favorites.length} favorite {favorites.length === 1 ? "quote" : "quotes"} saved
          </div>
        )}
      </div>
    </div>
  );
}
