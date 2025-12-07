import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "wouter";
import { 
  Sparkles, 
  Building2, 
  TrendingUp, 
  FileText, 
  Image, 
  Video, 
  Mail, 
  Calendar,
  Plus,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Instagram,
  Linkedin,
  Youtube,
  Hash,
  Target,
  Palette
} from "lucide-react";
import { SiTiktok, SiPinterest, SiSubstack } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { AgencyBusinessDB, AgencySessionDB, AgencyStrategyDB, AgencyAssetDB } from "@shared/schema";

const businessFormSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  brandStory: z.string().optional(),
  industry: z.string().optional(),
  targetAudience: z.string().optional(),
  products: z.string().optional(),
  aestheticPreferences: z.string().optional(),
  contentStyle: z.string().optional(),
  uniqueValueProp: z.string().optional(),
  brandVoice: z.string().optional(),
  goals: z.array(z.string()).optional(),
  platforms: z.array(z.string()).optional(),
});

type BusinessFormData = z.infer<typeof businessFormSchema>;

const GOALS = [
  { id: 'brand_growth', label: 'Brand Growth' },
  { id: 'sales', label: 'Drive Sales' },
  { id: 'content_creation', label: 'Content Creation' },
  { id: 'automation', label: 'Automation' },
  { id: 'authority', label: 'Build Authority' },
  { id: 'consistency', label: 'Stay Consistent' },
];

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', icon: Instagram },
  { id: 'tiktok', label: 'TikTok', icon: SiTiktok },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { id: 'x', label: 'X (Twitter)', icon: Hash },
  { id: 'pinterest', label: 'Pinterest', icon: SiPinterest },
  { id: 'youtube', label: 'YouTube', icon: Youtube },
  { id: 'substack', label: 'Substack', icon: SiSubstack },
];

const CONTENT_STYLES = [
  { value: 'professional', label: 'Professional & Polished' },
  { value: 'casual', label: 'Casual & Friendly' },
  { value: 'playful', label: 'Playful & Fun' },
  { value: 'luxurious', label: 'Luxurious & Premium' },
  { value: 'educational', label: 'Educational & Informative' },
];

function getPlatformIcon(platform: string) {
  const platformData = PLATFORMS.find(p => p.id === platform);
  if (platformData) {
    const Icon = platformData.icon;
    return <Icon className="h-4 w-4" />;
  }
  return <Hash className="h-4 w-4" />;
}

function BusinessOnboardingForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram']);

  const form = useForm<BusinessFormData>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      businessName: '',
      brandStory: '',
      industry: '',
      targetAudience: '',
      products: '',
      aestheticPreferences: '',
      contentStyle: 'professional',
      uniqueValueProp: '',
      brandVoice: '',
      goals: [],
      platforms: ['instagram'],
    },
  });

  const createBusinessMutation = useMutation({
    mutationFn: async (data: BusinessFormData) => {
      const response = await apiRequest('POST', '/api/agency/business', {
        ...data,
        goals: selectedGoals,
        platforms: selectedPlatforms,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/agency/businesses'] });
      toast({ title: "Business profile created", description: "Your AI agency is ready to work" });
      onSuccess();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create business profile", variant: "destructive" });
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => createBusinessMutation.mutate(data))} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Your business name" {...field} data-testid="input-business-name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Wellness, Tech, Fashion" {...field} data-testid="input-industry" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="brandStory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand Story</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us about your brand's journey, mission, and what makes you unique..." 
                  className="min-h-[100px]"
                  {...field} 
                  data-testid="input-brand-story"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="targetAudience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Audience</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your ideal customer - their demographics, interests, pain points..." 
                  className="min-h-[80px]"
                  {...field} 
                  data-testid="input-target-audience"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="products"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Products / Services</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="What do you offer? List your main products or services..." 
                  className="min-h-[80px]"
                  {...field} 
                  data-testid="input-products"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="space-y-3">
          <Label>Goals</Label>
          <div className="flex flex-wrap gap-2">
            {GOALS.map(goal => (
              <Badge
                key={goal.id}
                variant={selectedGoals.includes(goal.id) ? "default" : "outline"}
                className="cursor-pointer toggle-elevate"
                onClick={() => {
                  setSelectedGoals(prev => 
                    prev.includes(goal.id) 
                      ? prev.filter(g => g !== goal.id)
                      : [...prev, goal.id]
                  );
                }}
                data-testid={`badge-goal-${goal.id}`}
              >
                {goal.label}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Platforms</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PLATFORMS.map(platform => {
              const Icon = platform.icon;
              const isSelected = selectedPlatforms.includes(platform.id);
              return (
                <div
                  key={platform.id}
                  className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                    isSelected 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => {
                    setSelectedPlatforms(prev => 
                      prev.includes(platform.id) 
                        ? prev.filter(p => p !== platform.id)
                        : [...prev, platform.id]
                    );
                  }}
                  data-testid={`platform-${platform.id}`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm">{platform.label}</span>
                  {isSelected && <CheckCircle2 className="h-4 w-4 text-primary ml-auto" />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="contentStyle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content Style</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-content-style">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CONTENT_STYLES.map(style => (
                      <SelectItem key={style.value} value={style.value}>{style.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="aestheticPreferences"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Aesthetic Preferences</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Minimalist, Bold, Feminine" {...field} data-testid="input-aesthetic" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="uniqueValueProp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unique Value Proposition</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="What makes you different from competitors?" 
                  className="min-h-[80px]"
                  {...field} 
                  data-testid="input-uvp"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full" 
          disabled={createBusinessMutation.isPending}
          data-testid="button-create-business"
        >
          {createBusinessMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Create Business Profile
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

function SessionProgress({ session }: { session: AgencySessionDB }) {
  const statusColors = {
    pending: 'bg-yellow-500',
    running: 'bg-blue-500',
    completed: 'bg-green-500',
    failed: 'bg-red-500',
  };

  const statusIcons = {
    pending: Clock,
    running: Loader2,
    completed: CheckCircle2,
    failed: AlertCircle,
  };

  const StatusIcon = statusIcons[session.status as keyof typeof statusIcons] || Clock;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <StatusIcon className={`h-5 w-5 ${session.status === 'running' ? 'animate-spin' : ''}`} />
            {session.sessionType === 'full_package' ? 'Full Agency Package' : session.sessionType}
          </CardTitle>
          <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
            {session.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{session.progress}%</span>
          </div>
          <Progress value={session.progress || 0} className="h-2" />
          {session.currentAgent && session.status === 'running' && (
            <p className="text-sm text-muted-foreground mt-2">
              Currently running: <span className="capitalize font-medium">{session.currentAgent.replace('_', ' ')}</span> agent
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function StrategyDisplay({ strategy }: { strategy: AgencyStrategyDB }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Brand Strategy
        </CardTitle>
        <CardDescription>Generated positioning and content strategy</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {strategy.brandPositioning && (
          <div>
            <h4 className="font-semibold mb-2">Brand Positioning</h4>
            <p className="text-muted-foreground">{strategy.brandPositioning}</p>
          </div>
        )}

        {strategy.messagingPillars && (strategy.messagingPillars as any[]).length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Messaging Pillars</h4>
            <div className="grid gap-2">
              {(strategy.messagingPillars as any[]).map((pillar, i) => (
                <div key={i} className="p-3 bg-muted rounded-lg">
                  <p className="font-medium">{pillar.pillar}</p>
                  <p className="text-sm text-muted-foreground">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {strategy.contentPillars && (strategy.contentPillars as any[]).length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Content Pillars</h4>
            <div className="flex flex-wrap gap-2">
              {(strategy.contentPillars as any[]).map((pillar, i) => (
                <Badge key={i} variant="outline">{pillar.name}</Badge>
              ))}
            </div>
          </div>
        )}

        {strategy.keyMessages && (strategy.keyMessages as string[]).length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Key Messages</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {(strategy.keyMessages as string[]).map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        {strategy.toneGuidelines && (
          <div>
            <h4 className="font-semibold mb-2">Tone Guidelines</h4>
            <p className="text-muted-foreground">{strategy.toneGuidelines}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AssetCard({ asset }: { asset: AgencyAssetDB }) {
  const typeIcons = {
    post: FileText,
    carousel: Image,
    reel_script: Video,
    tiktok_script: Video,
    email: Mail,
    newsletter: Mail,
    image_prompt: Palette,
  };

  const Icon = typeIcons[asset.assetType as keyof typeof typeIcons] || FileText;

  return (
    <Card className="hover-elevate">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">{asset.title || asset.assetType}</CardTitle>
          </div>
          {asset.platform && (
            <Badge variant="outline" className="gap-1">
              {getPlatformIcon(asset.platform)}
              <span className="capitalize">{asset.platform}</span>
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {asset.hook && (
          <p className="text-sm font-medium mb-2 text-primary">{asset.hook}</p>
        )}
        {asset.content && (
          <p className="text-sm text-muted-foreground line-clamp-3">{asset.content}</p>
        )}
        {asset.hashtags && (asset.hashtags as string[]).length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {(asset.hashtags as string[]).slice(0, 5).map((tag, i) => (
              <span key={i} className="text-xs text-primary">{tag}</span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between mt-4">
          <Badge variant={asset.isApproved ? "default" : "secondary"}>
            {asset.isApproved ? "Approved" : "Pending Review"}
          </Badge>
          {asset.cta && (
            <span className="text-xs text-muted-foreground">CTA: {asset.cta}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function BusinessDashboard({ business }: { business: AgencyBusinessDB }) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: sessions } = useQuery<AgencySessionDB[]>({
    queryKey: ['/api/agency/business', business.id, 'sessions'],
  });

  const { data: strategies } = useQuery<AgencyStrategyDB[]>({
    queryKey: ['/api/agency/business', business.id, 'strategies'],
  });

  const { data: assets } = useQuery<AgencyAssetDB[]>({
    queryKey: ['/api/agency/business', business.id, 'assets'],
  });

  const startSessionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/agency/session/start', {
        businessId: business.id,
        sessionType: 'full_package',
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/agency/business', business.id, 'sessions'] });
      toast({ title: "Agency session started", description: "Your AI team is now working on your content" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to start session", variant: "destructive" });
    },
  });

  const latestSession = sessions?.[0];
  const latestStrategy = strategies?.[0];
  const posts = assets?.filter(a => a.assetType === 'post') || [];
  const videos = assets?.filter(a => ['reel_script', 'tiktok_script'].includes(a.assetType)) || [];
  const emails = assets?.filter(a => ['email', 'newsletter'].includes(a.assetType)) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{business.businessName}</h2>
          <p className="text-muted-foreground">{business.industry}</p>
        </div>
        <Button 
          onClick={() => startSessionMutation.mutate()}
          disabled={startSessionMutation.isPending || latestSession?.status === 'running'}
          data-testid="button-start-session"
        >
          {startSessionMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {latestSession?.status === 'running' ? 'Generating...' : 'Generate Content'}
        </Button>
      </div>

      {latestSession && <SessionProgress session={latestSession} />}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="strategy" data-testid="tab-strategy">Strategy</TabsTrigger>
          <TabsTrigger value="content" data-testid="tab-content">Content</TabsTrigger>
          <TabsTrigger value="videos" data-testid="tab-videos">Videos</TabsTrigger>
          <TabsTrigger value="emails" data-testid="tab-emails">Emails</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{posts.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Video Scripts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{videos.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Emails</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{emails.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sessions?.length || 0}</div>
              </CardContent>
            </Card>
          </div>

          {!latestSession && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Ready to generate content?</h3>
                <p className="text-muted-foreground text-center mb-4 max-w-md">
                  Click the button above to activate your AI agency team. They will create 
                  strategy, social posts, video scripts, visuals, and email sequences for your brand.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="strategy" className="mt-4">
          {latestStrategy ? (
            <StrategyDisplay strategy={latestStrategy} />
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No strategy yet</h3>
                <p className="text-muted-foreground text-center">
                  Start an agency session to generate your brand strategy
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="content" className="mt-4">
          {posts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {posts.map(post => (
                <AssetCard key={post.id} asset={post} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                <p className="text-muted-foreground text-center">
                  Start an agency session to generate social media posts
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="videos" className="mt-4">
          {videos.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {videos.map(video => (
                <AssetCard key={video.id} asset={video} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Video className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No video scripts yet</h3>
                <p className="text-muted-foreground text-center">
                  Start an agency session to generate TikTok and Reel scripts
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="emails" className="mt-4">
          {emails.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {emails.map(email => (
                <AssetCard key={email.id} asset={email} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Mail className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No emails yet</h3>
                <p className="text-muted-foreground text-center">
                  Start an agency session to generate email sequences
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AgencyDashboardPage() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);

  const { data: businesses, isLoading } = useQuery<AgencyBusinessDB[]>({
    queryKey: ['/api/agency/businesses'],
  });

  const selectedBusiness = businesses?.find(b => b.id === selectedBusinessId) || businesses?.[0];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            AI Digital Agency
          </h1>
          <p className="text-muted-foreground mt-1">
            Your personal team of AI agents creating content, strategy, and visuals
          </p>
        </div>

        <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-business">
              <Plus className="mr-2 h-4 w-4" />
              Add Business
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Business Profile</DialogTitle>
            </DialogHeader>
            <BusinessOnboardingForm onSuccess={() => setShowOnboarding(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {businesses && businesses.length > 0 ? (
        <div className="space-y-6">
          {businesses.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {businesses.map(business => (
                <Button
                  key={business.id}
                  variant={selectedBusiness?.id === business.id ? "default" : "outline"}
                  onClick={() => setSelectedBusinessId(business.id)}
                  className="whitespace-nowrap"
                  data-testid={`button-business-${business.id}`}
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  {business.businessName}
                </Button>
              ))}
            </div>
          )}

          {selectedBusiness && <BusinessDashboard business={selectedBusiness} />}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Building2 className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome to Your AI Agency</h2>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Create your first business profile to unlock your personal team of AI agents. 
              They'll generate strategy, content, visuals, and more.
            </p>
            <Button onClick={() => setShowOnboarding(true)} size="lg" data-testid="button-get-started">
              <Sparkles className="mr-2 h-5 w-5" />
              Get Started
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
