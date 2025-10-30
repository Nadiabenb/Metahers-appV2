import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Sparkles, Calendar, TrendingUp, Zap, Copy, Check, ExternalLink, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

type Post = {
  id: string;
  dayNumber: number;
  topic: string;
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
  currentStreak: number;
  longestStreak: number;
  totalPostsGenerated: number;
  totalPostsPublished: number;
  journeyStatus: string;
};

export default function ThoughtLeadershipPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // Fetch progress (will return 403 if not Pro)
  const { data: progress, isLoading: progressLoading, error: progressError } = useQuery<Progress>({
    queryKey: ['/api/thought-leadership/progress'],
  });

  // Fetch posts
  const { data: posts = [], isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ['/api/thought-leadership/posts'],
  });

  // Generate content mutation
  const generateMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/thought-leadership/generate', {
        niche: 'AI and Web3',
        dayNumber: progress?.currentDay || 1,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/thought-leadership/posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/thought-leadership/progress'] });
      toast({
        title: "Content Generated!",
        description: `Day ${progress?.currentDay || 1} content is ready for you to review.`,
      });
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

  const currentDayPost = posts.find(p => p.dayNumber === progress?.currentDay);

  // Show Pro upsell if not Pro
  if (progressError && (progressError as any).message === 'Pro subscription required') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-6">
        <SEO
          title="30-Day Thought Leadership Journey - Pro Feature - MetaHers"
          description="Build your authority with AI-generated content. Upgrade to Pro to access the 30-Day Journey."
        />
        <Card className="editorial-card max-w-2xl">
          <CardContent className="p-12 text-center">
            <Lock className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="font-cormorant text-4xl font-bold text-foreground mb-4">
              Pro Feature: 30-Day Thought Leadership Journey
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Build your authority with AI-generated content in 30 days. Daily prompts, multi-platform formatting, and streak tracking to keep you accountable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing">
                <Button size="lg" className="bg-primary hover:bg-primary/90" data-testid="button-upgrade-pro">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="lg" data-testid="button-back-home">
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (progressLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <SEO
        title="30-Day Thought Leadership Journey - MetaHers"
        description="Build your authority with AI-generated content. 30 days of daily publishing made effortless."
      />

      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-cormorant text-5xl font-bold text-foreground mb-2">
            30-Day Thought Leadership Journey
          </h1>
          <p className="text-xl text-muted-foreground">
            Daily AI-powered content to build your authority and visibility
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="editorial-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current Day</p>
                  <p className="text-3xl font-bold text-foreground">{progress?.currentDay || 1}</p>
                </div>
                <Calendar className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="editorial-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current Streak</p>
                  <p className="text-3xl font-bold text-primary">{progress?.currentStreak || 0} 🔥</p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="editorial-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Posts Generated</p>
                  <p className="text-3xl font-bold text-foreground">{progress?.totalPostsGenerated || 0}</p>
                </div>
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="editorial-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Published</p>
                  <p className="text-3xl font-bold text-foreground">{progress?.totalPostsPublished || 0}</p>
                </div>
                <Zap className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Calendar View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="editorial-card">
            <CardHeader>
              <CardTitle>Your 30-Day Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 md:grid-cols-10 gap-2">
                {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                  const isCompleted = progress?.completedDays.includes(day);
                  const isCurrent = day === progress?.currentDay;
                  
                  return (
                    <div
                      key={day}
                      className={`
                        aspect-square rounded-lg flex items-center justify-center text-sm font-semibold
                        transition-all duration-200 hover-elevate cursor-pointer
                        ${isCurrent ? 'bg-primary text-primary-foreground ring-2 ring-primary' : ''}
                        ${isCompleted && !isCurrent ? 'bg-primary/20 text-primary' : ''}
                        ${!isCompleted && !isCurrent ? 'bg-muted text-muted-foreground' : ''}
                      `}
                      data-testid={`day-${day}`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Generate Today's Content */}
        {!currentDayPost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <Card className="editorial-card border-2 border-primary/30">
              <CardContent className="p-8 text-center">
                <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="font-cormorant text-2xl font-bold text-foreground mb-2">
                  Ready for Day {progress?.currentDay}?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Generate your AI-powered content in 3 formats: Substack, LinkedIn, and Twitter
                </p>
                <Button
                  size="lg"
                  onClick={() => generateMutation.mutate()}
                  disabled={generateMutation.isPending}
                  className="bg-primary hover:bg-primary/90"
                  data-testid="button-generate-content"
                >
                  {generateMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Day {progress?.currentDay} Content
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Today's Generated Content */}
        {currentDayPost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <Card className="editorial-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Day {currentDayPost.dayNumber}: {currentDayPost.topic}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Generated {new Date(currentDayPost.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={currentDayPost.publishedToMetaHers ? "default" : "secondary"}>
                    {currentDayPost.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="long" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="long">Substack/Medium</TabsTrigger>
                    <TabsTrigger value="medium">LinkedIn</TabsTrigger>
                    <TabsTrigger value="short">Twitter/X</TabsTrigger>
                  </TabsList>

                  <TabsContent value="long" className="mt-4">
                    <div className="bg-muted/30 p-6 rounded-lg mb-4 max-h-96 overflow-y-auto">
                      <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: currentDayPost.contentLong.replace(/\n/g, '<br/>') }} />
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(currentDayPost.contentLong, 'Substack')}
                      data-testid="button-copy-long"
                    >
                      {copiedFormat === 'Substack' ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      Copy for Substack
                    </Button>
                  </TabsContent>

                  <TabsContent value="medium" className="mt-4">
                    <div className="bg-muted/30 p-6 rounded-lg mb-4 max-h-96 overflow-y-auto whitespace-pre-wrap">
                      {currentDayPost.contentMedium}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(currentDayPost.contentMedium, 'LinkedIn')}
                      data-testid="button-copy-medium"
                    >
                      {copiedFormat === 'LinkedIn' ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      Copy for LinkedIn
                    </Button>
                  </TabsContent>

                  <TabsContent value="short" className="mt-4">
                    <div className="bg-muted/30 p-6 rounded-lg mb-4 whitespace-pre-wrap">
                      {currentDayPost.contentShort}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(currentDayPost.contentShort, 'Twitter')}
                      data-testid="button-copy-short"
                    >
                      {copiedFormat === 'Twitter' ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      Copy for Twitter
                    </Button>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-4 mt-6">
                  <Button
                    onClick={() => publishMutation.mutate({ postId: currentDayPost.id, publishTo: 'metahers' })}
                    disabled={publishMutation.isPending || currentDayPost.publishedToMetaHers}
                    data-testid="button-publish-metahers"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {currentDayPost.publishedToMetaHers ? 'Published to MetaHers' : 'Publish to MetaHers'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => publishMutation.mutate({ postId: currentDayPost.id, publishTo: 'external' })}
                    disabled={publishMutation.isPending || currentDayPost.publishedToExternal}
                    data-testid="button-mark-published-external"
                  >
                    {currentDayPost.publishedToExternal ? 'Marked as Published' : 'Mark as Published Externally'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Previous Posts */}
        {posts.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="font-cormorant text-3xl font-bold text-foreground mb-4">Your Posts</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {posts
                .filter(p => p.id !== currentDayPost?.id)
                .map((post) => (
                  <Card key={post.id} className="editorial-card hover-elevate cursor-pointer" onClick={() => setSelectedPost(post)}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Badge variant="secondary" className="mb-2">Day {post.dayNumber}</Badge>
                          <CardTitle className="text-lg">{post.topic}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {post.publishedToMetaHers && (
                          <Badge variant="default">Published</Badge>
                        )}
                      </div>
                    </CardHeader>
                  </Card>
                ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
