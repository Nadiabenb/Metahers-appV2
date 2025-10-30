import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Copy, Check, ExternalLink, Lock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { BrandOnboarding } from "@/components/BrandOnboarding";
import { DailyDiscovery } from "@/components/DailyDiscovery";
import { GuidedPractice } from "@/components/GuidedPractice";
import type { CurriculumDay } from "@shared/curriculum";

type Post = {
  id: string;
  dayNumber: number;
  topic: string;
  dailyStory: string;
  contentLong: string;
  contentMedium: string;
  contentShort: string;
  status: string;
  publishedToMetaHers: boolean;
  publishedToExternal: boolean;
  createdAt: string;
  publishedAt?: string;
};

type Progress = {
  currentDay: number;
  completedDays: number[];
  lessonsCompleted: number[];
  practicesSubmitted: number[];
  practiceReflections: Record<number, string>;
  currentStreak: number;
  longestStreak: number;
  totalPostsGenerated: number;
  totalPostsPublished: number;
  journeyStatus: string;
  brandOnboardingCompleted?: boolean;
};

export default function ThoughtLeadershipPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Fetch progress
  const { data: progress, isLoading: progressLoading, error: progressError } = useQuery<Progress>({
    queryKey: ['/api/thought-leadership/progress'],
  });

  // Fetch curriculum for current day
  const { data: curriculumDay } = useQuery<CurriculumDay>({
    queryKey: ['/api/thought-leadership/curriculum', progress?.currentDay],
    enabled: !!progress?.currentDay,
  });

  // Fetch posts
  const { data: posts = [], isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ['/api/thought-leadership/posts'],
  });

  // Brand profile mutation
  const brandProfileMutation = useMutation({
    mutationFn: async (profile: any) => {
      return apiRequest('PUT', '/api/thought-leadership/brand-profile', profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/thought-leadership/progress'] });
      toast({
        title: "Brand Profile Saved!",
        description: "Let's start building your brand in public!",
      });
    },
  });

  // Generate content mutation (with practice reflection)
  const generateMutation = useMutation({
    mutationFn: async (practiceReflection: string) => {
      return apiRequest('POST', '/api/thought-leadership/generate', {
        practiceReflection,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/thought-leadership/posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/thought-leadership/progress'] });
      toast({
        title: "Content Generated!",
        description: `Your Day ${progress?.currentDay || 1} content is ready below.`,
      });
      setTimeout(() => {
        contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
    },
    onError: (error: any) => {
      console.error('Generation error:', error);
      const errorMessage = error?.message || error?.toString() || "Unknown error occurred";
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  // Publish mutation
  const publishMutation = useMutation({
    mutationFn: async ({ postId, publishTo }: { postId: string; publishTo: string }) => {
      return apiRequest('POST', `/api/thought-leadership/posts/${postId}/publish`, { publishTo });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/thought-leadership/posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/thought-leadership/progress'] });
      toast({
        title: "Published!",
        description: "Your post is now live.",
      });
    },
  });

  const copyToClipboard = (content: string, format: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
    toast({
      title: "Copied!",
      description: `${format} content copied to clipboard.`,
    });
  };

  const handleDayClick = (day: number) => {
    const post = posts.find(p => p.dayNumber === day);
    if (post) {
      setSelectedPost(post);
    }
  };

  const currentDayPost = posts.find(p => p.dayNumber === progress?.currentDay);
  const isPracticeSubmitted = progress?.practicesSubmitted?.includes(progress?.currentDay || 0);
  const existingReflection = progress?.practiceReflections?.[progress?.currentDay || 0];

  // Show brand onboarding if not completed
  if (progress && !progress.brandOnboardingCompleted) {
    return (
      <BrandOnboarding
        onComplete={(profile) => brandProfileMutation.mutate(profile)}
        isLoading={brandProfileMutation.isPending}
      />
    );
  }

  // Show Pro upsell if not Pro
  if (progressError && (progressError as any).message === 'Pro subscription required') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-6">
        <SEO
          title="30-Day Thought Leadership Journey - Pro Feature - MetaHers"
          description="Build your online brand authority with our 30-day guided journey"
        />
        <Card className="max-w-lg editorial-card">
          <CardHeader className="text-center">
            <Lock className="w-16 h-16 mx-auto mb-4 text-primary" />
            <CardTitle className="font-cormorant text-3xl mb-2">Pro Feature</CardTitle>
            <p className="text-muted-foreground">
              The 30-Day Brand Authority Journey is available exclusively for Pro members.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-foreground/80 space-y-2">
              <p>Unlock access to:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Personalized curriculum teaching brand fundamentals</li>
                <li>Daily Discovery lessons from the founder</li>
                <li>Guided Practice reflective exercises</li>
                <li>AI-powered content generation for 3 platforms</li>
                <li>30-day journey to build AI-searchable authority</li>
              </ul>
            </div>
            <Link href="/pricing">
              <Button className="w-full" size="lg" data-testid="button-upgrade">
                <Sparkles className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (progressLoading || !progress || !curriculumDay) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  // Determine phase info
  const phaseConfig = {
    foundation: { label: 'Foundation Ritual', days: '1-10', color: 'hyper-violet' },
    visibility: { label: 'Visibility Sanctuary', days: '11-20', color: 'cyber-fuchsia' },
    authority: { label: 'Authority Amplification', days: '21-30', color: 'liquid-gold' },
  };
  const currentPhase = phaseConfig[curriculumDay.phase];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="30-Day Brand Authority Journey - MetaHers"
        description="Transform your online presence through guided daily lessons and AI-powered content creation"
      />

      <div className="max-w-5xl mx-auto py-12 px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <Badge variant="outline" className="mb-4" data-testid="badge-current-phase">
            {currentPhase.label} · Days {currentPhase.days}
          </Badge>
          <h1 className="font-cormorant text-5xl font-bold text-foreground mb-4">
            30-Day Brand Authority Journey
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Build your digital presence one intentional day at a time
          </p>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-primary">{progress.currentDay}</div>
              <div className="text-sm text-muted-foreground">Current Day</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-primary">{progress.completedDays.length}</div>
              <div className="text-sm text-muted-foreground">Days Complete</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-primary">{progress.currentStreak}</div>
              <div className="text-sm text-muted-foreground">Current Streak</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-primary">{progress.totalPostsGenerated}</div>
              <div className="text-sm text-muted-foreground">Posts Created</div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Discovery */}
        {!lessonCompleted && (
          <DailyDiscovery
            curriculumDay={curriculumDay}
            onComplete={() => setLessonCompleted(true)}
            isCompleted={progress.lessonsCompleted?.includes(progress.currentDay)}
          />
        )}

        {/* Guided Practice */}
        {lessonCompleted && !isPracticeSubmitted && (
          <GuidedPractice
            curriculumDay={curriculumDay}
            onSubmit={(reflection) => generateMutation.mutate(reflection)}
            isLoading={generateMutation.isPending}
            existingReflection={existingReflection}
          />
        )}

        {/* Today's Generated Content */}
        {currentDayPost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
            ref={contentRef}
          >
            <Card className="editorial-card border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <CardTitle className="font-cormorant text-2xl">Your Content is Ready</CardTitle>
                  <Badge variant="default">Day {currentDayPost.dayNumber}</Badge>
                </div>
                <p className="text-muted-foreground">
                  {currentDayPost.topic}
                </p>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="long" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="long" data-testid="tab-substack">Substack</TabsTrigger>
                    <TabsTrigger value="medium" data-testid="tab-linkedin">LinkedIn</TabsTrigger>
                    <TabsTrigger value="short" data-testid="tab-twitter">Twitter</TabsTrigger>
                  </TabsList>

                  <TabsContent value="long" className="space-y-4">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <div dangerouslySetInnerHTML={{ __html: currentDayPost.contentLong.replace(/\n/g, '<br/>').replace(/##\s+/g, '<h2>').replace(/<br\/><h2>/g, '<h2>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(currentDayPost.contentLong, 'Substack')}
                      data-testid="button-copy-long"
                    >
                      {copiedFormat === 'Substack' ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      {copiedFormat === 'Substack' ? 'Copied!' : 'Copy to Clipboard'}
                    </Button>
                  </TabsContent>

                  <TabsContent value="medium" className="space-y-4">
                    <div className="text-sm text-foreground/90 whitespace-pre-wrap">
                      {currentDayPost.contentMedium}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(currentDayPost.contentMedium, 'LinkedIn')}
                      data-testid="button-copy-medium"
                    >
                      {copiedFormat === 'LinkedIn' ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      {copiedFormat === 'LinkedIn' ? 'Copied!' : 'Copy to Clipboard'}
                    </Button>
                  </TabsContent>

                  <TabsContent value="short" className="space-y-4">
                    <div className="text-sm text-foreground/90 whitespace-pre-wrap">
                      {currentDayPost.contentShort.split('[TWEET BREAK]').map((tweet, i) => (
                        <div key={i} className="mb-4 p-4 rounded-lg bg-accent/30 border border-accent-border">
                          {tweet.trim()}
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(currentDayPost.contentShort, 'Twitter')}
                      data-testid="button-copy-short"
                    >
                      {copiedFormat === 'Twitter' ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      {copiedFormat === 'Twitter' ? 'Copied!' : 'Copy to Clipboard'}
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* 30-Day Calendar */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-cormorant text-2xl">Your Journey</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                const isCompleted = progress.completedDays.includes(day);
                const isCurrent = day === progress.currentDay;
                const hasPost = posts.some(p => p.dayNumber === day);

                return (
                  <button
                    key={day}
                    onClick={() => hasPost && handleDayClick(day)}
                    disabled={!hasPost}
                    className={`
                      aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all
                      ${isCurrent ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
                      ${isCompleted ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'}
                      ${hasPost && !isCurrent ? 'hover-elevate cursor-pointer' : ''}
                      ${!hasPost ? 'opacity-30 cursor-not-allowed' : ''}
                    `}
                    data-testid={`day-${day}`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Post Dialog */}
        <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            {selectedPost && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>Day {selectedPost.dayNumber}</Badge>
                    <Badge variant="outline">{selectedPost.status}</Badge>
                  </div>
                  <DialogTitle className="font-cormorant text-2xl">{selectedPost.topic}</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="long" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="long">Substack</TabsTrigger>
                    <TabsTrigger value="medium">LinkedIn</TabsTrigger>
                    <TabsTrigger value="short">Twitter</TabsTrigger>
                  </TabsList>

                  <TabsContent value="long" className="space-y-4">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <div dangerouslySetInnerHTML={{ __html: selectedPost.contentLong.replace(/\n/g, '<br/>').replace(/##\s+/g, '<h2>').replace(/<br\/><h2>/g, '<h2>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(selectedPost.contentLong, 'Substack')}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </TabsContent>

                  <TabsContent value="medium" className="space-y-4">
                    <div className="text-sm whitespace-pre-wrap">{selectedPost.contentMedium}</div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(selectedPost.contentMedium, 'LinkedIn')}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </TabsContent>

                  <TabsContent value="short" className="space-y-4">
                    <div className="text-sm whitespace-pre-wrap">
                      {selectedPost.contentShort.split('[TWEET BREAK]').map((tweet, i) => (
                        <div key={i} className="mb-4 p-4 rounded-lg bg-accent/30">
                          {tweet.trim()}
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(selectedPost.contentShort, 'Twitter')}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
