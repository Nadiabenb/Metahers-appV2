import { useState } from "react";
import { useLocation } from "wouter";
import { blogArticles, BlogArticle } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, Clock, Sparkles, BookOpen, ArrowRight, ShoppingBag } from "lucide-react";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";

import aiStylistImg from "@assets/generated_images/Woman_AI_Stylist_Editorial_b38cb15d.png";
import cryptoWalletImg from "@assets/generated_images/Woman_Crypto_Wallet_Luxury_64773c22.png";
import nftGalleryImg from "@assets/generated_images/Woman_NFT_Gallery_Fashion_58da388a.png";
import metaverseHomeImg from "@assets/generated_images/Woman_Metaverse_Virtual_Space_45ef040a.png";
import blockchainNetworkImg from "@assets/generated_images/Woman_Blockchain_Network_Tech_ea561a21.png";
import web3EvolutionImg from "@assets/generated_images/Woman_Web3_Future_Tech_a7d9fd8d.png";
import ritualBagsImg from "@assets/generated_images/Luxury_ritual_bags_editorial_f8e3e90d.png";
import aiAgentsImg from "@assets/generated_images/Women_and_AI_agents_editorial_80c3f4c1.png";

const IMAGE_MAP: Record<string, string> = {
  "ai-agents": aiAgentsImg,
  "ritual-bags": ritualBagsImg,
  "ai-stylist": aiStylistImg,
  "crypto-wallet": cryptoWalletImg,
  "nft-gallery": nftGalleryImg,
  "metaverse-home": metaverseHomeImg,
  "blockchain-network": blockchainNetworkImg,
  "web3-evolution": web3EvolutionImg,
};

const CATEGORY_COLORS: Record<string, string> = {
  "AI": "text-[hsl(var(--liquid-gold))] bg-[hsl(var(--liquid-gold))]/10",
  "Web3": "text-[hsl(var(--hyper-violet))] bg-[hsl(var(--hyper-violet))]/10",
  "Crypto": "text-[hsl(var(--cyber-fuchsia))] bg-[hsl(var(--cyber-fuchsia))]/10",
  "NFT": "text-[hsl(var(--magenta-quartz))] bg-[hsl(var(--magenta-quartz))]/10",
  "Metaverse": "text-[hsl(var(--aurora-teal))] bg-[hsl(var(--aurora-teal))]/10",
  "Blockchain": "text-[hsl(var(--hyper-violet))] bg-[hsl(var(--hyper-violet))]/10",
};

function ArticleContent({ article }: { article: BlogArticle }) {
  const { isAuthenticated } = useAuth();

  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 px-6 py-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <Badge 
          variant="secondary" 
          className={`${CATEGORY_COLORS[article.category]} font-medium tracking-wide`}
          data-testid="badge-category"
        >
          {article.category}
        </Badge>
        <h1 className="font-cormorant text-5xl md:text-6xl font-bold text-foreground leading-tight">
          {article.title}
        </h1>
        <p className="text-xl text-muted-foreground font-light italic">
          {article.subtitle}
        </p>
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            {article.author}
          </span>
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {format(parseISO(article.publishDate), "MMMM d, yyyy")}
          </span>
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {article.readTime} min read
          </span>
        </div>
      </div>

      {/* Featured Image */}
      <div className="relative rounded-2xl overflow-hidden aspect-video editorial-card">
        <img 
          src={IMAGE_MAP[article.image] || aiStylistImg} 
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-overlay-vertical" />
      </div>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        {article.content.map((block, index) => {
          switch (block.type) {
            case "paragraph":
              return (
                <p 
                  key={index} 
                  className="text-foreground/90 leading-relaxed text-lg mb-6 font-light"
                  data-testid={`paragraph-${index}`}
                >
                  {block.text}
                </p>
              );
            case "heading":
              return (
                <h2 
                  key={index} 
                  className="font-cormorant text-3xl font-bold text-foreground mt-12 mb-6"
                  data-testid={`heading-${index}`}
                >
                  {block.text}
                </h2>
              );
            case "quote":
              return (
                <blockquote 
                  key={index} 
                  className="editorial-card p-8 my-8 border-l-4 border-primary relative overflow-hidden"
                  data-testid={`quote-${index}`}
                >
                  <div className="absolute inset-0 gradient-violet-fuchsia opacity-5" />
                  <Sparkles className="w-8 h-8 text-[hsl(var(--liquid-gold))] mb-4 relative z-10" />
                  <p className="text-2xl font-cormorant italic text-foreground relative z-10 leading-relaxed">
                    {block.text}
                  </p>
                </blockquote>
              );
            case "list":
              return (
                <div key={index} className="my-8">
                  <p className="text-foreground/90 mb-4 font-medium">{block.text}</p>
                  <ul className="space-y-3 ml-6">
                    {block.items?.map((item, i) => (
                      <li 
                        key={i} 
                        className="text-foreground/80 leading-relaxed flex items-start gap-3"
                        data-testid={`list-item-${i}`}
                      >
                        <span className="text-primary mt-1.5">●</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            default:
              return null;
          }
        })}
      </div>

      {/* CTA Section */}
      <div className="mt-16 border-t border-border pt-12">
        <Card className="editorial-card p-8 md:p-12 relative overflow-hidden border-0">
          <div className="absolute inset-0 gradient-violet-fuchsia opacity-5" />
          <div className="relative z-10 text-center space-y-6">
            <Sparkles className="w-12 h-12 text-[hsl(var(--liquid-gold))] mx-auto" />
            <h3 className="font-cormorant text-3xl md:text-4xl font-bold text-foreground">
              Ready to Transform Your Digital Journey?
            </h3>
            
            {!isAuthenticated ? (
              <>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Get access to guided AI & Web3 rituals, an AI-powered journal, and exclusive content designed for women who want to lead in the digital age.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                  <Button 
                    size="lg"
                    onClick={() => handleNavigation("/signup")}
                    className="gap-2 min-w-[200px]"
                    data-testid="button-cta-signup"
                  >
                    Start Your Journey
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    onClick={() => handleNavigation("/shop")}
                    className="gap-2 min-w-[200px]"
                    data-testid="button-cta-shop"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Explore Drop 001
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground/80">
                  Drop 001 ritual bags include instant Pro membership + exclusive AI unlocks
                </p>
              </>
            ) : (
              <>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Continue your journey with our limited edition ritual bags—handmade luxury meets AI-powered transformation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                  <Button 
                    size="lg"
                    onClick={() => handleNavigation("/rituals")}
                    className="gap-2 min-w-[200px]"
                    data-testid="button-cta-rituals"
                  >
                    Explore Rituals
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    onClick={() => handleNavigation("/shop")}
                    className="gap-2 min-w-[200px]"
                    data-testid="button-cta-shop-auth"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Shop Drop 001
                  </Button>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  const categories = ["All", ...Array.from(new Set(blogArticles.map(a => a.category)))];
  const featuredArticles = blogArticles.filter(a => a.featured);
  const heroArticle = featuredArticles[0];

  const filteredArticles = selectedCategory === "All" 
    ? blogArticles 
    : blogArticles.filter(a => a.category === selectedCategory);

  if (expandedArticle) {
    const article = blogArticles.find(a => a.slug === expandedArticle);
    if (article) {
      return (
        <div className="min-h-screen bg-background">
          <div className="container mx-auto max-w-7xl">
            <Button
              variant="ghost"
              onClick={() => setExpandedArticle(null)}
              className="my-8"
              data-testid="button-back-to-blog"
            >
              ← Back to Blog
            </Button>
            <ArticleContent article={article} />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <SEO
        title="MetaHers Daily - AI & Web3 Blog for Women"
        description="Discover AI and Web3 insights written for women in tech. Learn about AI prompts, blockchain, NFTs, crypto, and the metaverse with luxury editorial content."
        keywords="AI blog, Web3 blog, women in tech, AI articles, blockchain guide, NFT news, crypto for women, metaverse updates"
      />
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-violet-fuchsia opacity-10" />
        <div className="container mx-auto max-w-7xl px-6 py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <h1 className="font-cormorant text-6xl md:text-7xl lg:text-8xl font-bold text-foreground">
              MetaHers Daily
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-3xl mx-auto">
              Your insider's guide to Web3, AI, crypto, and the digital frontier—written for women, by women
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-6 mt-12">
        {/* Hero Article */}
        {heroArticle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
            data-testid="hero-article"
          >
            <Card 
              className="editorial-card overflow-hidden group cursor-pointer hover-elevate active-elevate-2 border-0"
              onClick={() => setExpandedArticle(heroArticle.slug)}
              data-testid={`card-article-${heroArticle.slug}`}
            >
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative aspect-video md:aspect-auto overflow-hidden">
                  <img 
                    src={IMAGE_MAP[heroArticle.image] || aiStylistImg}
                    alt={heroArticle.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 gradient-overlay-vertical" />
                  <Badge 
                    className={`absolute top-4 left-4 ${CATEGORY_COLORS[heroArticle.category]} font-medium`}
                    data-testid="badge-hero-category"
                  >
                    {heroArticle.category}
                  </Badge>
                </div>
                <CardContent className="p-8 md:p-12 flex flex-col justify-center">
                  <Badge variant="outline" className="w-fit mb-4 border-primary/30">
                    Featured
                  </Badge>
                  <h2 className="font-cormorant text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
                    {heroArticle.title}
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6 font-light leading-relaxed">
                    {heroArticle.subtitle}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {format(parseISO(heroArticle.publishDate), "MMM d, yyyy")}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {heroArticle.readTime} min read
                    </span>
                  </div>
                  <Button 
                    variant="default" 
                    className="w-fit"
                    data-testid="button-read-article"
                  >
                    Read Article
                  </Button>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat)}
              className={`toggle-elevate ${selectedCategory === cat ? 'toggle-elevated' : ''}`}
              data-testid={`button-category-${cat.toLowerCase()}`}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article, index) => (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              data-testid={`article-${article.slug}`}
            >
              <Card 
                className="editorial-card overflow-hidden group cursor-pointer h-full flex flex-col hover-elevate active-elevate-2 border-0"
                onClick={() => setExpandedArticle(article.slug)}
                data-testid={`card-article-${article.slug}`}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={IMAGE_MAP[article.image] || aiStylistImg}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 gradient-overlay-vertical" />
                  <Badge 
                    className={`absolute top-3 left-3 ${CATEGORY_COLORS[article.category]} font-medium text-xs`}
                    data-testid={`badge-category-${article.slug}`}
                  >
                    {article.category}
                  </Badge>
                </div>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <h3 className="font-cormorant text-2xl font-bold text-foreground mb-3 leading-tight line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 font-light line-clamp-2 flex-1">
                    {article.subtitle}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/40">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {format(parseISO(article.publishDate), "MMM d")}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {article.readTime} min
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
