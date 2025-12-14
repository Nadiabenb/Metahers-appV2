import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  FileText, 
  Video, 
  Mail, 
  Plus,
  Loader2,
  CheckCircle2,
  Clock,
  Calendar,
  Instagram,
  Linkedin,
  Youtube,
  Hash,
  PenLine,
  Send,
  Eye,
  Copy,
  MoreHorizontal,
  ChevronRight,
  Lightbulb,
  Megaphone,
  Heart
} from "lucide-react";
import { SiTiktok } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";
import type { AgencyBusinessDB, AgencySessionDB, AgencyAssetDB } from "@shared/schema";

const businessFormSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  industry: z.string().optional(),
  targetAudience: z.string().optional(),
  brandVoice: z.string().optional(),
});

type BusinessFormData = z.infer<typeof businessFormSchema>;

const QUICK_ACTIONS = [
  {
    id: 'social_post',
    title: 'Create a Post',
    description: 'Instagram, LinkedIn, or X post',
    icon: PenLine,
    color: '#E879F9',
    prompt: 'What topic would you like to post about?',
  },
  {
    id: 'email',
    title: 'Write an Email',
    description: 'Newsletter or promo email',
    icon: Mail,
    color: '#3B82F6',
    prompt: 'What\'s the purpose of this email?',
  },
  {
    id: 'video_script',
    title: 'Video Script',
    description: 'Reel or TikTok script',
    icon: Video,
    color: '#22C55E',
    prompt: 'What should the video be about?',
  },
  {
    id: 'content_ideas',
    title: 'Get Ideas',
    description: 'Content inspiration for the week',
    icon: Lightbulb,
    color: '#F59E0B',
    prompt: 'What theme or topic do you want ideas for?',
  },
];

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', icon: Instagram },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { id: 'tiktok', label: 'TikTok', icon: SiTiktok },
  { id: 'x', label: 'X', icon: Hash },
  { id: 'youtube', label: 'YouTube', icon: Youtube },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function QuickSetupForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  
  const form = useForm<BusinessFormData>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      businessName: '',
      industry: '',
      targetAudience: '',
      brandVoice: 'friendly',
    },
  });

  const createBusinessMutation = useMutation({
    mutationFn: async (data: BusinessFormData) => {
      const response = await apiRequest('POST', '/api/agency/business', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/agency/businesses'] });
      toast({ title: "You're all set!", description: "Let's create some content" });
      onSuccess();
    },
    onError: () => {
      toast({ title: "Something went wrong", description: "Please try again", variant: "destructive" });
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => createBusinessMutation.mutate(data))} className="space-y-5">
        <FormField
          control={form.control}
          name="businessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What's your business called?</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Sarah's Wellness Studio" {...field} data-testid="input-business-name" />
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
              <FormLabel>What do you do?</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Life coaching, handmade jewelry, fitness" {...field} data-testid="input-industry" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="targetAudience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Who are your customers?</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Busy moms, young professionals" {...field} data-testid="input-audience" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="brandVoice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How do you like to sound?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-voice">
                    <SelectValue placeholder="Select your style" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="friendly">Friendly & Warm</SelectItem>
                  <SelectItem value="professional">Professional & Polished</SelectItem>
                  <SelectItem value="playful">Playful & Fun</SelectItem>
                  <SelectItem value="inspiring">Inspiring & Motivational</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full" 
          disabled={createBusinessMutation.isPending}
          data-testid="button-get-started"
        >
          {createBusinessMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          Get Started
        </Button>
      </form>
    </Form>
  );
}

function CreateContentDialog({ 
  action, 
  business, 
  open, 
  onOpenChange 
}: { 
  action: typeof QUICK_ACTIONS[0]; 
  business: AgencyBusinessDB;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('instagram');

  const generateMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/agency/session/start', {
        businessId: business.id,
        sessionType: action.id,
        topic,
        platform,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/agency/business', business.id, 'sessions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/agency/business', business.id, 'assets'] });
      toast({ title: "Creating your content...", description: "This will take just a moment" });
      onOpenChange(false);
      setTopic('');
    },
    onError: () => {
      toast({ title: "Something went wrong", description: "Please try again", variant: "destructive" });
    },
  });

  const Icon = action.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${action.color}15` }}
            >
              <Icon className="w-5 h-5" style={{ color: action.color }} />
            </div>
            <div>
              <DialogTitle>{action.title}</DialogTitle>
              <DialogDescription>{action.description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>{action.prompt}</Label>
            <Textarea 
              placeholder="e.g., Tips for staying productive while working from home"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="min-h-[80px]"
              data-testid="input-topic"
            />
          </div>

          {(action.id === 'social_post' || action.id === 'video_script') && (
            <div className="space-y-2">
              <Label>Platform</Label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.slice(0, action.id === 'video_script' ? 3 : 4).map((p) => {
                  const PlatformIcon = p.icon;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPlatform(p.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                        platform === p.id 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      data-testid={`platform-${p.id}`}
                    >
                      <PlatformIcon className="w-4 h-4" />
                      <span className="text-sm">{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <Button 
            onClick={() => generateMutation.mutate()}
            disabled={!topic.trim() || generateMutation.isPending}
            className="w-full"
            data-testid="button-generate"
          >
            {generateMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Create Content
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ContentCard({ asset }: { asset: AgencyAssetDB }) {
  const { toast } = useToast();
  
  const typeLabels: Record<string, string> = {
    post: 'Social Post',
    reel_script: 'Reel Script',
    tiktok_script: 'TikTok Script',
    email: 'Email',
    newsletter: 'Newsletter',
  };

  const typeIcons: Record<string, any> = {
    post: FileText,
    reel_script: Video,
    tiktok_script: Video,
    email: Mail,
    newsletter: Mail,
  };

  const Icon = typeIcons[asset.assetType] || FileText;

  const copyToClipboard = () => {
    const text = asset.content || '';
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Content copied to clipboard" });
  };

  return (
    <Card className="hover-elevate">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{typeLabels[asset.assetType] || asset.assetType}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost" onClick={copyToClipboard} data-testid={`copy-${asset.id}`}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {asset.hook && (
          <p className="font-medium text-sm mb-2 text-primary">{asset.hook}</p>
        )}
        
        <p className="text-sm text-muted-foreground line-clamp-4">
          {asset.content}
        </p>

        {asset.platform && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t">
            <span className="text-xs text-muted-foreground capitalize flex items-center gap-1">
              {asset.platform === 'instagram' && <Instagram className="w-3 h-3" />}
              {asset.platform === 'linkedin' && <Linkedin className="w-3 h-3" />}
              {asset.platform === 'tiktok' && <SiTiktok className="w-3 h-3" />}
              {asset.platform}
            </span>
            {asset.isApproved && (
              <span className="text-xs text-green-600 flex items-center gap-1 ml-auto">
                <CheckCircle2 className="w-3 h-3" /> Ready
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ContentStudio({ business }: { business: AgencyBusinessDB }) {
  const [selectedAction, setSelectedAction] = useState<typeof QUICK_ACTIONS[0] | null>(null);

  const { data: assets, isLoading: assetsLoading } = useQuery<AgencyAssetDB[]>({
    queryKey: ['/api/agency/business', business.id, 'assets'],
  });

  const { data: sessions } = useQuery<AgencySessionDB[]>({
    queryKey: ['/api/agency/business', business.id, 'sessions'],
  });

  const recentAssets = assets?.slice(0, 6) || [];
  const hasRunningSession = sessions?.some(s => s.status === 'running');

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Content Studio | MetaHers"
        description="Create social posts, emails, and video scripts for your business in seconds."
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-1">
            {getGreeting()}, {business.businessName.split(' ')[0]}
          </h1>
          <p className="text-muted-foreground">What would you like to create today?</p>
        </div>

        {/* Running Session Indicator */}
        {hasRunningSession && (
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="p-4 flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <div>
                <p className="font-medium text-sm">Creating your content...</p>
                <p className="text-xs text-muted-foreground">This usually takes about 30 seconds</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => setSelectedAction(action)}
                className="p-4 rounded-xl border bg-card hover-elevate text-left transition-all group"
                data-testid={`action-${action.id}`}
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: `${action.color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: action.color }} />
                </div>
                <h3 className="font-medium text-sm mb-0.5">{action.title}</h3>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </button>
            );
          })}
        </div>

        {/* Recent Content */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Your Recent Content</h2>
            {recentAssets.length > 0 && (
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                View all <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>

          {assetsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : recentAssets.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {recentAssets.map((asset) => (
                <ContentCard key={asset.id} asset={asset} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-1">No content yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose an action above to create your first piece of content
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Tips Section */}
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-pink-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm mb-1">Quick tip</p>
                <p className="text-sm text-muted-foreground">
                  Consistency beats perfection. Try creating one post per day to build your audience. 
                  Your AI assistant can help you stay on track.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Powered By Footer */}
        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
            <Sparkles className="w-3 h-3" />
            Powered by AI to help you grow
          </p>
        </div>
      </div>

      {/* Create Content Dialog */}
      {selectedAction && (
        <CreateContentDialog
          action={selectedAction}
          business={business}
          open={!!selectedAction}
          onOpenChange={(open) => !open && setSelectedAction(null)}
        />
      )}
    </div>
  );
}

function WelcomeScreen({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <SEO 
        title="Content Studio | MetaHers"
        description="Create social posts, emails, and video scripts for your business in seconds."
      />
      
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Welcome to Content Studio</h1>
          <p className="text-muted-foreground">
            Your AI assistant for creating posts, emails, and videos. Let's set things up in 30 seconds.
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <QuickSetupForm onSuccess={onComplete} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AgencyDashboardPage() {
  const { data: businesses, isLoading } = useQuery<AgencyBusinessDB[]>({
    queryKey: ['/api/agency/businesses'],
  });

  const activeBusiness = businesses?.[0];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!activeBusiness) {
    return <WelcomeScreen onComplete={() => {}} />;
  }

  return <ContentStudio business={activeBusiness} />;
}
