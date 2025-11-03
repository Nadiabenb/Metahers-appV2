import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Sparkles, Globe, Boxes, Coins, Image, Megaphone, ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

type Space = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  sortOrder: number;
  isActive: boolean;
};

const ICON_MAP: Record<string, any> = {
  Globe,
  Sparkles,
  Boxes,
  Coins,
  Image,
  Megaphone,
};

const COLOR_CLASSES: Record<string, string> = {
  "hyper-violet": "from-[hsl(var(--hyper-violet))] to-[hsl(var(--magenta-quartz))]",
  "magenta-quartz": "from-[hsl(var(--magenta-quartz))] to-[hsl(var(--cyber-fuchsia))]",
  "cyber-fuchsia": "from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--aurora-teal))]",
  "aurora-teal": "from-[hsl(var(--aurora-teal))] to-[hsl(var(--liquid-gold))]",
  "liquid-gold": "from-[hsl(var(--liquid-gold))] to-[hsl(var(--hyper-violet))]",
};

export default function MetaHersWorldPage() {
  const { user } = useAuth();

  const { data: spaces = [], isLoading } = useQuery<Space[]>({
    queryKey: ["/api/spaces"],
  });

  const isProUser = user?.isPro || user?.subscriptionTier !== "free";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl mb-6 text-gradient-gold">
            Welcome to MetaHers World
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Six immersive spaces designed to transform how you understand and leverage technology.
            Each space offers personalized learning experiences adapted to your unique needs and goals.
          </p>
          <div className="flex justify-center gap-4">
            <Badge variant="outline" className="text-base px-6 py-2">
              AI-Powered Personalization
            </Badge>
            <Badge variant="outline" className="text-base px-6 py-2">
              Always Updated
            </Badge>
            <Badge variant="outline" className="text-base px-6 py-2">
              Real Results
            </Badge>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-8 animate-pulse">
                <div className="h-12 w-12 bg-muted rounded-lg mb-4" />
                <div className="h-6 bg-muted rounded mb-3 w-3/4" />
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded w-5/6" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spaces.map((space) => {
              const IconComponent = ICON_MAP[space.icon] || Sparkles;
              const gradientClass = COLOR_CLASSES[space.color] || COLOR_CLASSES["hyper-violet"];
              const isLocked = !isProUser && space.sortOrder > 2;

              return (
                <Card
                  key={space.id}
                  className="group relative overflow-hidden hover-elevate active-elevate-2 transition-all duration-300"
                  data-testid={`card-space-${space.slug}`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-5 group-hover:opacity-10 transition-opacity`}
                  />

                  <div className="relative p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${gradientClass}`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      {isLocked && (
                        <Lock className="w-5 h-5 text-muted-foreground" data-testid={`icon-locked-${space.slug}`} />
                      )}
                    </div>

                    <h3 className="font-serif text-2xl mb-3 group-hover:text-primary transition-colors" data-testid={`text-space-name-${space.slug}`}>
                      {space.name}
                    </h3>

                    <p className="text-muted-foreground mb-6" data-testid={`text-space-description-${space.slug}`}>
                      {space.description}
                    </p>

                    {isLocked ? (
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          Pro tier required
                        </p>
                        <Link href="/upgrade">
                          <Button variant="outline" className="w-full group/btn" data-testid={`button-upgrade-${space.slug}`}>
                            Unlock This Space
                            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <Link href={`/world/${space.slug}`}>
                        <Button className="w-full group/btn" data-testid={`button-enter-${space.slug}`}>
                          Enter {space.name}
                          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    )}

                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        6 Transformational Experiences
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-16 text-center">
          <Card className="p-8 max-w-2xl mx-auto bg-gradient-to-br from-card to-card/50">
            <h3 className="font-serif text-2xl mb-4">How MetaHers World Works</h3>
            <div className="space-y-4 text-left">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Choose Your Space</h4>
                  <p className="text-muted-foreground text-sm">
                    Select the technology area you want to master
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Answer Personalization Questions</h4>
                  <p className="text-muted-foreground text-sm">
                    AI asks about your needs, goals, and current knowledge level
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Get Custom Guidance</h4>
                  <p className="text-muted-foreground text-sm">
                    Receive tailored learning paths, tool recommendations, and practical next steps
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Track Your Transformation</h4>
                  <p className="text-muted-foreground text-sm">
                    Monitor confidence, business impact, and milestones achieved
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
