import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, Share2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, addDays, subDays, startOfYear, differenceInDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";

// Empowering quotes for women in tech/web3/crypto/blockchain
const DAILY_QUOTES = [
  "The blockchain doesn't care if you're a woman. It only cares if your code works. Own your power.",
  "In Web3, you're not breaking the glass ceiling—you're building a new architecture without one.",
  "Smart contracts, smarter women. The future of finance is being written by us.",
  "Every NFT you create is proof of your digital legacy. Make it count.",
  "The metaverse is our canvas. Paint your vision boldly, beautifully, and without apology.",
  "Crypto isn't just about money—it's about autonomy. Take yours.",
  "Your wallet, your keys, your future. Financial independence looks stunning on you.",
  "AI amplifies what you already are: brilliant, strategic, and unstoppable.",
  "In the digital world, your voice has no volume limit. Use it to build empires.",
  "Blockchain is transparency. Be the woman who demands it everywhere.",
  "The best time to learn Web3 was yesterday. The second best time is right now.",
  "Your code can change lives. Your vision can change systems. Your presence changes everything.",
  "Decentralization means no one can tell you 'no' anymore. Build accordingly.",
  "The metaverse rewards creators, not gatekeepers. You're a creator.",
  "Smart women build smart contracts. The revolution is coded in our language.",
  "NFTs give artists royalties forever. Women artists deserve nothing less.",
  "In crypto, past performance doesn't predict future returns. Neither does your past define your future.",
  "The only blockchain you need permission to join is the one you haven't discovered yet.",
  "Web3 is about ownership. Own your work, own your worth, own your narrative.",
  "Every DAO is a new chance to build governance differently. Lead that change.",
  "Your Bitcoin doesn't care about your gender. It just holds its value. Be like Bitcoin.",
  "The future of work is decentralized. Design it on your terms.",
  "Minting your first NFT is like publishing your first book. You're an author of the digital age.",
  "In the metaverse, you can be anything. Choose powerful.",
  "Crypto winters prepare you for eternal springs. Keep building.",
  "The best DeFi strategy is the one you understand completely. Study, then execute.",
  "Blockchain records everything permanently. Make sure your contributions are recorded too.",
  "AI won't replace you. But a woman who uses AI might. Be that woman.",
  "The next unicorn startup will be founded by someone like you. Why not you?",
  "Web3 communities thrive on collaboration, not competition. Your success elevates us all.",
  "Digital scarcity creates digital value. You're both scarce and valuable.",
  "The metaverse is being built right now. Your blueprint matters.",
  "Tokenomics is just economics redesigned. You can learn this. You can lead this.",
  "Every great innovation starts with 'What if?' Ask boldly.",
  "Your DAO vote matters as much as any whale's. Democracy, decentralized.",
  "The blockchain never sleeps, and neither does your potential.",
  "In Web3, reputation is portable. Build yours deliberately.",
  "NFT communities are built on shared vision. Share yours loudly.",
  "The metaverse has unlimited real estate. Claim your space.",
  "Staking isn't just for crypto—stake your claim in this industry.",
  "Your digital identity is yours to design. Make it iconic.",
  "Smart contracts eliminate the need for trust. Build trustlessly.",
  "The future is decentralized, tokenized, and female-led. Step forward.",
  "Your airdrop isn't just free tokens—it's recognition. You're recognized.",
  "In crypto, volatility is opportunity. In life, disruption is growth.",
  "Gas fees are temporary. Your on-chain legacy is forever.",
  "The whitepaper you write today could be the standard tomorrow.",
  "Layer 2 solutions make everything faster. Be a layer 2 solution in life.",
  "Your validator node keeps the network secure. Your voice keeps the industry progressing.",
  "Interoperability connects different chains. Connection connects different women. Bridge both.",
  "The yield you're farming isn't just APY—it's your financial autonomy growing.",
  "Every genesis block needs a founder. Found something.",
  "Your proof of work is visible. Your proof of stake is undeniable.",
  "The halving happens on schedule. Your growth happens on your timeline.",
  "Cold storage protects your assets. Boundaries protect your energy. Secure both.",
  "A bear market tests conviction. You have conviction.",
  "The lightning network makes transactions instant. Make your impact just as fast.",
  "Your hardware wallet is fortress. Your boundaries are fortresses too. Guard both.",
  "Consensus mechanisms vary. Your self-consensus is non-negotiable: you belong here.",
  "Every fork creates new possibilities. Embrace the pivot.",
  "Your private keys unlock your wealth. Your unique perspective unlocks innovation.",
  "Market cap measures value. Your self-worth is immeasurable.",
  "The mining difficulty adjusts. So does your strategy. Stay adaptable.",
  "Your oracle brings off-chain data on-chain. Bring your real-world wisdom to tech.",
  "Cross-chain bridges connect ecosystems. You connect communities.",
  "The mempool is temporary congestion. Your potential is permanent expansion.",
  "Your diamond hands hold through volatility. Your steady hands build through chaos.",
  "The airdrop meta rewards early believers. Believe in yourself early.",
  "Your governance proposal can change protocol. Your voice can change culture.",
  "Flash loans demonstrate capital efficiency. Demonstrate life efficiency.",
  "The liquidity pool needs both tokens. Teams need both men and women. Add yourself.",
  "Your slippage tolerance has limits. So do your boundaries. Set both.",
  "Impermanent loss is temporary. The lessons are permanent.",
  "The bonding curve defines value. You define your own worth.",
  "Your wrapped tokens bridge ecosystems. Your networked relationships bridge industries.",
  "The gas war drives fees higher. Your standards drive quality higher.",
  "Your testnet experiments cost nothing. Real-world experiments teach everything.",
  "The mainnet launch is just the beginning. So is today.",
  "Your token vesting schedule builds trust. Your consistent presence builds legacy.",
  "The rug pull is a failure of character. Your character is solid.",
  "Your HODL strategy is long-term. Your vision is too.",
  "The FOMO is real. The opportunity is realer. Choose wisely.",
  "Your bag is your portfolio. Your skills are your real wealth.",
  "The moon is the destination. Excellence is the journey.",
  "Your alpha is your edge. Your authenticity is your alpha.",
  "The degen plays are risky. The strategic plays are rewarding. Know the difference.",
  "Your 10x isn't just returns—it's growth, influence, and impact.",
  "The wagmi spirit is collective. We all make it, together.",
  "Your anon account protects privacy. Your public presence inspires visibility. Balance both.",
  "The ser/madam debate is tired. 'Boss' is gender-neutral. Be one.",
  "Your ngmi fear is just doubt. Your wagmi certainty is conviction.",
  "The gm ritual builds community. The good work ritual builds empires.",
  "Your pfp represents you. Your portfolio represents your choices.",
  "The Discord is your workspace. The deals happen in the DMs. Show up everywhere.",
  "Your Twitter thread could go viral. Your product should too.",
  "The probably nothing becomes definitely something. Your work is something.",
  "Your rare trait is authenticity. Your floor price is non-negotiable self-worth."
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
      <div className="editorial-card p-8 relative overflow-visible">
        <div className="absolute inset-0 gradient-violet-fuchsia opacity-5" />
        
        {/* Calendar Header */}
        <div className="relative z-10 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-cormorant text-2xl font-bold text-foreground flex items-center gap-2">
              <Calendar className="w-6 h-6 text-primary" />
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
              <div className="bg-gradient-to-br from-card to-charcoal border-2 border-primary/20 rounded-xl shadow-2xl overflow-hidden">
                {/* Top Bar - Date Display */}
                <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-6 text-center border-b-2 border-primary/30">
                  <div className="text-sm uppercase tracking-wider text-muted-foreground mb-1 font-medium">
                    {format(currentDate, "EEEE")}
                  </div>
                  <div className="font-cormorant text-6xl font-bold text-foreground">
                    {format(currentDate, "d")}
                  </div>
                  <div className="text-lg uppercase tracking-wide text-foreground/80 mt-1">
                    {format(currentDate, "MMMM yyyy")}
                  </div>
                </div>

                {/* Quote Display */}
                <div className="p-8 min-h-[280px] flex flex-col justify-center">
                  <div className="relative">
                    <div className="absolute -top-4 -left-2 text-6xl text-primary/20 font-serif">"</div>
                    <p className="text-lg md:text-xl text-foreground/90 italic leading-relaxed pl-8 pr-4 font-light text-center">
                      {currentQuote}
                    </p>
                    <div className="absolute -bottom-4 -right-2 text-6xl text-primary/20 font-serif">"</div>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="px-6 pb-6 flex items-center justify-between border-t border-border/40 pt-6">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    Quote {quoteIndex + 1} of {DAILY_QUOTES.length}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleFavorite}
                      className={isFavorite ? "text-pink-500" : ""}
                      data-testid="button-favorite"
                    >
                      <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleShare}
                      data-testid="button-share"
                    >
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Favorites Count */}
        {favorites.length > 0 && (
          <div className="relative z-10 mt-4 text-center text-sm text-muted-foreground">
            ❤️ {favorites.length} favorite {favorites.length === 1 ? "quote" : "quotes"} saved
          </div>
        )}
      </div>
    </div>
  );
}
