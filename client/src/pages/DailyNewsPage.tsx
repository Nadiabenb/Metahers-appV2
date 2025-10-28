import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Share2, Calendar, Filter, TrendingUp, BookmarkPlus, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type NewsCategory = "AI" | "Crypto" | "NFT" | "Blockchain" | "Metaverse" | "Social" | "All";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: NewsCategory;
  date: string;
  metaphor: string;
  actionTip?: string;
  source?: string;
}

const sampleNews: NewsItem[] = [
  {
    id: "1",
    title: "OpenAI Launches GPT-5 with 'Memory Vault' Feature",
    summary: "Think of it like your AI assistant finally getting a diary. GPT-5 now remembers your past conversations, preferences, and work style—no more repeating yourself every single time. It's like upgrading from a goldfish to an elephant.",
    category: "AI",
    date: "2025-10-27",
    metaphor: "Your AI went from having amnesia to keeping a detailed journal about you.",
    actionTip: "If you use ChatGPT regularly, upgrade to GPT-5 to save hours of context-setting.",
  },
  {
    id: "2",
    title: "Bitcoin Hits New All-Time High of $120K",
    summary: "BTC just broke through $120K, and the crypto Twitter queens are celebrating like it's New Year's Eve. For context: that's higher than a Tesla Model S, a year of college tuition, or 600 Birkin bags (okay, maybe 2 Birkins). Digital gold is glowing.",
    category: "Crypto",
    date: "2025-10-27",
    metaphor: "Bitcoin is that friend who said 'trust me' in 2015 and now pulls up in a Lambo.",
    actionTip: "Don't FOMO buy at the peak. If you're new to crypto, start with dollar-cost averaging.",
  },
  {
    id: "3",
    title: "Nike Launches Web3 Sneaker Club with NFT Memberships",
    summary: "Nike's new 'Swoosh Society' is a members-only club where your NFT is your VIP pass. Get early access to limited drops, virtual sneaker designs you can wear in the metaverse, and IRL events. It's like Soho House, but for sneakerheads—and your membership card is on the blockchain.",
    category: "NFT",
    date: "2025-10-26",
    metaphor: "Your sneakers now come with a digital twin and a backstage pass to exclusive drops.",
    actionTip: "If you're into fashion + tech, explore how brands are using NFTs for loyalty programs.",
  },
  {
    id: "4",
    title: "Ethereum's 'Dencun' Upgrade Slashes Transaction Fees by 90%",
    summary: "Gas fees on Ethereum just went from 'ouch' to 'oh, that's it?' The Dencun upgrade is like switching from surge pricing on Uber to a monthly metro pass. Transactions that cost $50 now cost $5. Web3 just became way more accessible.",
    category: "Blockchain",
    date: "2025-10-26",
    metaphor: "Ethereum went from expensive Manhattan rent to affordable Brooklyn vibes.",
    actionTip: "Now's a great time to experiment with DeFi apps or mint NFTs without breaking the bank.",
  },
  {
    id: "5",
    title: "Decentraland Hosts First-Ever Virtual Fashion Week",
    summary: "Digital runways, avatar models, and NFT couture collections. Fashion Week in the metaverse means you can attend front row without leaving your couch, wearing virtual Balenciaga while sipping real champagne. The future is weird and fabulous.",
    category: "Metaverse",
    date: "2025-10-25",
    metaphor: "Fashion Week just went from 'you can't sit with us' to 'everyone's invited (if you have WiFi)'.",
  },
  {
    id: "6",
    title: "Instagram Tests 'AI Co-Pilot' for Content Creators",
    summary: "Instagram's new AI assistant helps you brainstorm captions, optimize posting times, and suggest trending audio. It's like having a social media manager in your pocket who never sleeps and doesn't charge $3K/month. Content creation just got a cheat code.",
    category: "Social",
    date: "2025-10-25",
    metaphor: "Your Instagram account now has a personal trainer who knows exactly when you'll go viral.",
    actionTip: "Creators: Test the AI suggestions but keep your authentic voice. Let AI handle data, you handle soul.",
  },
  {
    id: "7",
    title: "Apple Announces Vision Pro 2 with Crypto Wallet Integration",
    summary: "The next Vision Pro headset will let you manage your crypto portfolio, sign blockchain transactions, and browse NFT galleries—all in mixed reality. Your digital wallet just got a 3D glow-up. Web3 is officially entering the mainstream luxury tech space.",
    category: "Crypto",
    date: "2025-10-24",
    metaphor: "Apple just made crypto as sleek and intuitive as the iPhone. No more 'too technical' excuses.",
  },
];

const CATEGORY_COLORS: Record<NewsCategory, string> = {
  "AI": "text-[hsl(var(--liquid-gold))] bg-[hsl(var(--liquid-gold))]/10",
  "Crypto": "text-[hsl(var(--cyber-fuchsia))] bg-[hsl(var(--cyber-fuchsia))]/10",
  "NFT": "text-[hsl(var(--magenta-quartz))] bg-[hsl(var(--magenta-quartz))]/10",
  "Blockchain": "text-[hsl(var(--hyper-violet))] bg-[hsl(var(--hyper-violet))]/10",
  "Metaverse": "text-[hsl(var(--aurora-teal))] bg-[hsl(var(--aurora-teal))]/10",
  "Social": "text-[hsl(var(--liquid-gold))] bg-[hsl(var(--liquid-gold))]/10",
  "All": "text-foreground bg-muted",
};

export default function DailyNewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>("All");
  const { toast } = useToast();

  const filteredNews = selectedCategory === "All" 
    ? sampleNews 
    : sampleNews.filter(item => item.category === selectedCategory);

  const handleShare = async (item: NewsItem) => {
    const shareText = `${item.title}\n\n${item.metaphor}\n\n${item.summary}\n\nRead more on MetaHers Daily 💎`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: shareText,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied to clipboard! ✨",
        description: "Share this news with your community",
      });
    }
  };

  const handleWhatsAppShare = (item: NewsItem) => {
    const shareText = encodeURIComponent(
      `${item.title}\n\n${item.metaphor}\n\n${item.summary}\n\nRead more at MetaHers Daily 💎`
    );
    window.open(`https://wa.me/?text=${shareText}`, '_blank');
  };

  const categories: NewsCategory[] = ["All", "AI", "Crypto", "NFT", "Blockchain", "Metaverse", "Social"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <SEO
        title="MetaHers Daily - AI, Crypto & Web3 News for Women"
        description="Daily tech news written for women. Bite-sized updates on AI, crypto, blockchain, NFTs, and the metaverse—explained with metaphors that actually make sense."
        keywords="ai news for women, crypto news, web3 updates, nft news, blockchain news, tech news for women, metaverse news"
      />

      <div className="container mx-auto px-6 py-12 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-[hsl(var(--liquid-gold))]" />
            <Badge variant="secondary" className="text-sm">
              Updated Daily
            </Badge>
          </div>
          <h1 className="font-cormorant text-5xl md:text-6xl font-bold text-foreground mb-4">
            MetaHers Daily
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            Tech news for women who want the tea, not the textbook. AI, crypto, Web3, and the digital world—explained with metaphors that actually make sense.
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filter by topic:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "" : "hover-elevate"}
                data-testid={`button-filter-${category.toLowerCase()}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* News Feed */}
        <div className="space-y-6">
          {filteredNews.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="editorial-card border-0 hover-elevate" data-testid={`card-news-${item.id}`}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex-1 space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge 
                              variant="secondary" 
                              className={`${CATEGORY_COLORS[item.category]} text-xs font-medium`}
                              data-testid={`badge-category-${item.id}`}
                            >
                              {item.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(item.date), "MMM d")}
                            </span>
                          </div>
                          <h3 className="font-cormorant text-2xl font-bold text-foreground mb-2 leading-tight">
                            {item.title}
                          </h3>
                        </div>
                      </div>

                      {/* Metaphor Callout */}
                      <div className="editorial-card p-4 border-l-4 border-primary bg-primary/5">
                        <p className="text-sm font-medium italic text-foreground/90">
                          💡 {item.metaphor}
                        </p>
                      </div>

                      {/* Summary */}
                      <p className="text-foreground/80 leading-relaxed">
                        {item.summary}
                      </p>

                      {/* Action Tip */}
                      {item.actionTip && (
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                          <TrendingUp className="w-4 h-4 text-[hsl(var(--liquid-gold))] mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-foreground/80">
                            <span className="font-semibold">Action:</span> {item.actionTip}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShare(item)}
                          className="gap-2"
                          data-testid={`button-share-${item.id}`}
                        >
                          <Share2 className="w-3 h-3" />
                          Share
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleWhatsAppShare(item)}
                          className="gap-2 bg-[#25D366]/10 border-[#25D366]/30 hover:bg-[#25D366]/20"
                          data-testid={`button-whatsapp-${item.id}`}
                        >
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                          </svg>
                          WhatsApp
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No news in this category yet. Check back soon! ✨
            </p>
          </div>
        )}

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <Card className="editorial-card p-8 border-0">
            <div className="space-y-4">
              <Sparkles className="w-10 h-10 text-[hsl(var(--liquid-gold))] mx-auto" />
              <h3 className="font-cormorant text-3xl font-bold text-foreground">
                Want to Go Deeper?
              </h3>
              <p className="text-muted-foreground max-w-xl mx-auto">
                MetaHers Daily is just the beginning. Dive into guided AI & Web3 rituals designed to transform you from curious to confident.
              </p>
              <Button
                size="lg"
                onClick={() => window.location.href = "/rituals"}
                className="gap-2"
                data-testid="button-explore-rituals"
              >
                Explore Rituals
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
