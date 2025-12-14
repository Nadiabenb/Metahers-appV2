import { useState, useRef, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, useInView } from "framer-motion";
import { 
  Sparkles, 
  Building2, 
  FileText, 
  Image, 
  Video, 
  Mail, 
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
  Palette,
  Code2,
  Rocket,
  Database,
  Layers,
  Zap,
  BarChart3,
  Star,
  Crown,
  Cpu,
  Globe,
  Brush
} from "lucide-react";
import { SiTiktok, SiPinterest, SiSubstack } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";
import type { AgencyBusinessDB, AgencySessionDB, AgencyStrategyDB, AgencyAssetDB } from "@shared/schema";

// Brand Colors - Match Landing Page
const LAVENDER = "#D8BFD8";
const PINK = "#E879F9";
const DARK_BG = "#0D0B14";

// Shared ambient effects from landing page
function AmbientGlow() {
  return (
    <>
      <motion.div
        className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${PINK}08 0%, transparent 70%)`,
          filter: 'blur(100px)',
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${LAVENDER}06 0%, transparent 70%)`,
          filter: 'blur(120px)',
        }}
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
    </>
  );
}

function FloatingParticle({ delay = 0, duration = 20 }: { delay?: number; duration?: number }) {
  const randomX = useMemo(() => Math.random() * 100, []);
  const randomY = useMemo(() => Math.random() * 100, []);
  const size = useMemo(() => Math.random() * 2 + 1, []);
  
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: `${randomX}%`,
        top: `${randomY}%`,
        background: `linear-gradient(135deg, ${PINK} 0%, ${LAVENDER} 100%)`,
      }}
      animate={{ y: [0, -80, 0], opacity: [0, 0.6, 0], scale: [0, 1, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-24 h-px" style={{ background: `linear-gradient(90deg, transparent, ${LAVENDER}30, transparent)` }} />
      <Star className="w-3 h-3 mx-4" style={{ color: LAVENDER, opacity: 0.4 }} />
      <div className="w-24 h-px" style={{ background: `linear-gradient(90deg, transparent, ${LAVENDER}30, transparent)` }} />
    </div>
  );
}

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

// 7 Replit-Powered AI Agents
const AI_AGENTS = [
  {
    id: 'code',
    name: 'Code Agent',
    description: 'AI-powered code generation, debugging & refactoring',
    icon: Code2,
    color: PINK,
    capabilities: ['Generate Components', 'Debug Issues', 'Refactor Code'],
  },
  {
    id: 'deploy',
    name: 'Deploy Agent',
    description: 'One-click publishing & hosting management',
    icon: Rocket,
    color: '#22C55E',
    capabilities: ['Auto Deploy', 'Domain Setup', 'SSL Certificates'],
  },
  {
    id: 'database',
    name: 'Database Agent',
    description: 'PostgreSQL management & data operations',
    icon: Database,
    color: '#3B82F6',
    capabilities: ['Schema Design', 'Query Optimization', 'Data Migration'],
  },
  {
    id: 'design',
    name: 'Design Agent',
    description: 'UI/UX generation & styling assistance',
    icon: Brush,
    color: LAVENDER,
    capabilities: ['Generate Layouts', 'Color Systems', 'Responsive Design'],
  },
  {
    id: 'content',
    name: 'Content Agent',
    description: 'Copywriting, posts & marketing materials',
    icon: FileText,
    color: '#F59E0B',
    capabilities: ['Social Posts', 'Email Sequences', 'Blog Articles'],
  },
  {
    id: 'integration',
    name: 'Integration Agent',
    description: 'Third-party connections & API setup',
    icon: Layers,
    color: '#8B5CF6',
    capabilities: ['Stripe Setup', 'Auth Systems', 'API Connections'],
  },
  {
    id: 'analytics',
    name: 'Analytics Agent',
    description: 'Performance insights & optimization',
    icon: BarChart3,
    color: '#EC4899',
    capabilities: ['Track Metrics', 'User Insights', 'Growth Reports'],
  },
];

function getPlatformIcon(platform: string) {
  const platformData = PLATFORMS.find(p => p.id === platform);
  if (platformData) {
    const Icon = platformData.icon;
    return <Icon className="h-4 w-4" />;
  }
  return <Hash className="h-4 w-4" />;
}

// Agent Card Component
function AgentCard({ agent, isActive = false }: { agent: typeof AI_AGENTS[0]; isActive?: boolean }) {
  const Icon = agent.icon;
  
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="relative p-6 rounded-xl border transition-all duration-300"
      style={{
        background: `linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)`,
        borderColor: isActive ? agent.color : 'rgba(255,255,255,0.1)',
        boxShadow: isActive ? `0 0 30px ${agent.color}20` : 'none',
      }}
      data-testid={`agent-card-${agent.id}`}
    >
      <div className="flex items-start gap-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: `${agent.color}15` }}
        >
          <Icon className="w-6 h-6" style={{ color: agent.color }} />
        </div>
        <div className="flex-1">
          <h3 
            className="text-lg font-semibold mb-1"
            style={{ color: '#FFFFFF' }}
          >
            {agent.name}
          </h3>
          <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {agent.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {agent.capabilities.map((cap) => (
              <span
                key={cap}
                className="text-xs px-2 py-1 rounded-full"
                style={{ 
                  background: `${agent.color}10`,
                  color: agent.color,
                  border: `1px solid ${agent.color}30`,
                }}
              >
                {cap}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {isActive && (
        <motion.div
          className="absolute top-3 right-3"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Zap className="w-4 h-4" style={{ color: agent.color }} />
        </motion.div>
      )}
    </motion.div>
  );
}

// Hero Section
function HeroSection({ onGetStarted }: { onGetStarted: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section 
      ref={ref}
      className="relative py-20 lg:py-28 overflow-hidden"
      style={{ background: DARK_BG }}
    >
      <AmbientGlow />
      
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.5} duration={18 + Math.random() * 8} />
        ))}
      </div>

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-3 mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            >
              <Cpu className="w-5 h-5" style={{ color: PINK }} />
            </motion.div>
            <span 
              className="text-xs font-light tracking-[0.25em] uppercase"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              Powered by Replit AI
            </span>
          </div>

          <h1 
            className="text-4xl lg:text-6xl mb-6 leading-[1.1]"
            style={{ 
              fontFamily: 'Playfair Display, serif',
              color: '#FFFFFF',
              fontWeight: 300,
            }}
          >
            Your AI <span className="italic" style={{ color: PINK }}>Agency</span>
            <span className="block mt-2">Team Awaits</span>
          </h1>
          
          <p 
            className="text-lg lg:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            7 specialized AI agents—powered by Replit's infrastructure—working 24/7 
            to build your digital empire. Code, deploy, design, and scale with elegance.
          </p>

          <motion.button
            onClick={onGetStarted}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group px-10 py-4 inline-flex items-center gap-3 rounded-full"
            style={{ 
              background: `linear-gradient(135deg, ${PINK} 0%, ${LAVENDER} 100%)`, 
              color: '#0A0A0A' 
            }}
            data-testid="button-hero-cta"
          >
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold text-sm uppercase tracking-[0.15em]">
              Activate Your Agency
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

// Agent Collective Section
function AgentCollectiveSection({ currentAgent }: { currentAgent?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      ref={ref}
      className="relative py-20 px-6 overflow-hidden"
      style={{ background: `linear-gradient(180deg, ${DARK_BG} 0%, rgba(20, 17, 28, 1) 100%)` }}
    >
      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-xs uppercase tracking-[0.25em] mb-4" style={{ color: PINK }}>
            The Collective
          </p>
          <h2 
            className="text-3xl lg:text-4xl mb-4"
            style={{ fontFamily: 'Playfair Display, serif', color: '#FFFFFF', fontWeight: 300 }}
          >
            Meet Your <span className="italic" style={{ color: LAVENDER }}>AI Team</span>
          </h2>
          <p className="text-base font-light max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Each agent specializes in a Replit capability, working together to build your vision.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AI_AGENTS.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
            >
              <AgentCard agent={agent} isActive={currentAgent === agent.id} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Styled Business Onboarding Form
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
    <div 
      className="p-6 rounded-2xl"
      style={{ 
        background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`,
        border: `1px solid rgba(255,255,255,0.1)`,
      }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => createBusinessMutation.mutate(data))} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel style={{ color: 'rgba(255,255,255,0.8)' }}>Business Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Your business name" 
                      {...field} 
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      data-testid="input-business-name" 
                    />
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
                  <FormLabel style={{ color: 'rgba(255,255,255,0.8)' }}>Industry</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Wellness, Tech, Fashion" 
                      {...field} 
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      data-testid="input-industry" 
                    />
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
                <FormLabel style={{ color: 'rgba(255,255,255,0.8)' }}>Brand Story</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Tell us about your brand's journey, mission, and what makes you unique..." 
                    className="min-h-[100px] bg-white/5 border-white/10 text-white placeholder:text-white/40"
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
                <FormLabel style={{ color: 'rgba(255,255,255,0.8)' }}>Target Audience</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe your ideal customer..." 
                    className="min-h-[80px] bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    {...field} 
                    data-testid="input-target-audience"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="space-y-3">
            <Label style={{ color: 'rgba(255,255,255,0.8)' }}>Goals</Label>
            <div className="flex flex-wrap gap-2">
              {GOALS.map(goal => (
                <motion.button
                  key={goal.id}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-full text-sm transition-all"
                  style={{
                    background: selectedGoals.includes(goal.id) 
                      ? `linear-gradient(135deg, ${PINK} 0%, ${LAVENDER} 100%)`
                      : 'rgba(255,255,255,0.05)',
                    color: selectedGoals.includes(goal.id) ? '#0A0A0A' : 'rgba(255,255,255,0.7)',
                    border: `1px solid ${selectedGoals.includes(goal.id) ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
                  }}
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
                </motion.button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label style={{ color: 'rgba(255,255,255,0.8)' }}>Platforms</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PLATFORMS.map(platform => {
                const Icon = platform.icon;
                const isSelected = selectedPlatforms.includes(platform.id);
                return (
                  <motion.div
                    key={platform.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-colors"
                    style={{
                      background: isSelected ? `${PINK}15` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isSelected ? PINK : 'rgba(255,255,255,0.1)'}`,
                    }}
                    onClick={() => {
                      setSelectedPlatforms(prev => 
                        prev.includes(platform.id) 
                          ? prev.filter(p => p !== platform.id)
                          : [...prev, platform.id]
                      );
                    }}
                    data-testid={`platform-${platform.id}`}
                  >
                    <Icon className="h-5 w-5" style={{ color: isSelected ? PINK : 'rgba(255,255,255,0.6)' }} />
                    <span className="text-sm" style={{ color: isSelected ? PINK : 'rgba(255,255,255,0.7)' }}>
                      {platform.label}
                    </span>
                    {isSelected && <CheckCircle2 className="h-4 w-4 ml-auto" style={{ color: PINK }} />}
                  </motion.div>
                );
              })}
            </div>
          </div>

          <FormField
            control={form.control}
            name="contentStyle"
            render={({ field }) => (
              <FormItem>
                <FormLabel style={{ color: 'rgba(255,255,255,0.8)' }}>Content Style</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger 
                      className="bg-white/5 border-white/10 text-white"
                      data-testid="select-content-style"
                    >
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

          <motion.button
            type="submit"
            disabled={createBusinessMutation.isPending}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-xl font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2"
            style={{ 
              background: `linear-gradient(135deg, ${PINK} 0%, ${LAVENDER} 100%)`, 
              color: '#0A0A0A',
              opacity: createBusinessMutation.isPending ? 0.7 : 1,
            }}
            data-testid="button-create-business"
          >
            {createBusinessMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Activate AI Agency
              </>
            )}
          </motion.button>
        </form>
      </Form>
    </div>
  );
}

// Styled Session Progress
function SessionProgress({ session }: { session: AgencySessionDB }) {
  const statusColors = {
    pending: '#F59E0B',
    running: PINK,
    completed: '#22C55E',
    failed: '#EF4444',
  };

  const statusIcons = {
    pending: Clock,
    running: Loader2,
    completed: CheckCircle2,
    failed: AlertCircle,
  };

  const StatusIcon = statusIcons[session.status as keyof typeof statusIcons] || Clock;
  const statusColor = statusColors[session.status as keyof typeof statusColors] || PINK;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl"
      style={{
        background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`,
        border: `1px solid ${statusColor}40`,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <StatusIcon 
            className={`h-5 w-5 ${session.status === 'running' ? 'animate-spin' : ''}`}
            style={{ color: statusColor }}
          />
          <h3 className="text-lg font-semibold" style={{ color: '#FFFFFF' }}>
            {session.sessionType === 'full_package' ? 'Full Agency Package' : session.sessionType}
          </h3>
        </div>
        <span 
          className="px-3 py-1 rounded-full text-xs uppercase tracking-wider"
          style={{ background: `${statusColor}20`, color: statusColor }}
        >
          {session.status}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>Progress</span>
          <span className="font-medium" style={{ color: statusColor }}>{session.progress}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${PINK}, ${LAVENDER})` }}
            initial={{ width: 0 }}
            animate={{ width: `${session.progress || 0}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        {session.currentAgent && session.status === 'running' && (
          <p className="text-sm mt-3" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Currently running: <span className="capitalize font-medium" style={{ color: PINK }}>{session.currentAgent.replace('_', ' ')}</span> agent
          </p>
        )}
      </div>
    </motion.div>
  );
}

// Styled Strategy Display
function StrategyDisplay({ strategy }: { strategy: AgencyStrategyDB }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl"
      style={{
        background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`,
        border: `1px solid rgba(255,255,255,0.1)`,
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${PINK}15` }}
        >
          <Target className="h-5 w-5" style={{ color: PINK }} />
        </div>
        <div>
          <h3 className="text-lg font-semibold" style={{ color: '#FFFFFF' }}>Brand Strategy</h3>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Generated positioning and content strategy</p>
        </div>
      </div>

      <div className="space-y-6">
        {strategy.brandPositioning && (
          <div>
            <h4 className="font-semibold mb-2" style={{ color: LAVENDER }}>Brand Positioning</h4>
            <p style={{ color: 'rgba(255,255,255,0.7)' }}>{strategy.brandPositioning}</p>
          </div>
        )}

        {strategy.messagingPillars && (strategy.messagingPillars as any[]).length > 0 && (
          <div>
            <h4 className="font-semibold mb-3" style={{ color: LAVENDER }}>Messaging Pillars</h4>
            <div className="grid gap-3">
              {(strategy.messagingPillars as any[]).map((pillar, i) => (
                <div 
                  key={i} 
                  className="p-4 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <p className="font-medium mb-1" style={{ color: '#FFFFFF' }}>{pillar.pillar}</p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {strategy.contentPillars && (strategy.contentPillars as any[]).length > 0 && (
          <div>
            <h4 className="font-semibold mb-3" style={{ color: LAVENDER }}>Content Pillars</h4>
            <div className="flex flex-wrap gap-2">
              {(strategy.contentPillars as any[]).map((pillar, i) => (
                <span 
                  key={i}
                  className="px-3 py-1 rounded-full text-sm"
                  style={{ background: `${PINK}15`, color: PINK, border: `1px solid ${PINK}30` }}
                >
                  {pillar.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {strategy.keyMessages && (strategy.keyMessages as string[]).length > 0 && (
          <div>
            <h4 className="font-semibold mb-3" style={{ color: LAVENDER }}>Key Messages</h4>
            <ul className="space-y-2">
              {(strategy.keyMessages as string[]).map((msg, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Star className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: PINK }} />
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>{msg}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Styled Asset Card
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
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="p-5 rounded-xl transition-all"
      style={{
        background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`,
        border: `1px solid rgba(255,255,255,0.1)`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" style={{ color: PINK }} />
          <h4 className="font-medium" style={{ color: '#FFFFFF' }}>{asset.title || asset.assetType}</h4>
        </div>
        {asset.platform && (
          <span 
            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)' }}
          >
            {getPlatformIcon(asset.platform)}
            <span className="capitalize">{asset.platform}</span>
          </span>
        )}
      </div>
      
      {asset.hook && (
        <p className="text-sm font-medium mb-2" style={{ color: PINK }}>{asset.hook}</p>
      )}
      {asset.content && (
        <p className="text-sm line-clamp-3" style={{ color: 'rgba(255,255,255,0.6)' }}>{asset.content}</p>
      )}
      {asset.hashtags && (asset.hashtags as string[]).length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {(asset.hashtags as string[]).slice(0, 5).map((tag, i) => (
            <span key={i} className="text-xs" style={{ color: LAVENDER }}>{tag}</span>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <span 
          className="px-2 py-1 rounded-full text-xs"
          style={{ 
            background: asset.isApproved ? '#22C55E20' : 'rgba(255,255,255,0.05)',
            color: asset.isApproved ? '#22C55E' : 'rgba(255,255,255,0.5)',
          }}
        >
          {asset.isApproved ? "Approved" : "Pending Review"}
        </span>
        {asset.cta && (
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>CTA: {asset.cta}</span>
        )}
      </div>
    </motion.div>
  );
}

// Business Dashboard
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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 
            className="text-2xl lg:text-3xl mb-1"
            style={{ fontFamily: 'Playfair Display, serif', color: '#FFFFFF', fontWeight: 400 }}
          >
            {business.businessName}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>{business.industry}</p>
        </div>
        <motion.button
          onClick={() => startSessionMutation.mutate()}
          disabled={startSessionMutation.isPending || latestSession?.status === 'running'}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 disabled:opacity-50"
          style={{ 
            background: `linear-gradient(135deg, ${PINK} 0%, ${LAVENDER} 100%)`, 
            color: '#0A0A0A' 
          }}
          data-testid="button-start-session"
        >
          {startSessionMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {latestSession?.status === 'running' ? 'Generating...' : 'Generate Content'}
        </motion.button>
      </div>

      {latestSession && <SessionProgress session={latestSession} />}

      <SectionDivider />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Posts', value: posts.length, icon: FileText },
          { label: 'Video Scripts', value: videos.length, icon: Video },
          { label: 'Emails', value: emails.length, icon: Mail },
          { label: 'Sessions', value: sessions?.length || 0, icon: Zap },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 rounded-xl text-center"
            style={{
              background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`,
              border: `1px solid rgba(255,255,255,0.08)`,
            }}
          >
            <stat.icon className="w-5 h-5 mx-auto mb-2" style={{ color: PINK }} />
            <div className="text-2xl font-bold mb-1" style={{ color: '#FFFFFF' }}>{stat.value}</div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div 
        className="p-1 rounded-xl inline-flex gap-1"
        style={{ background: 'rgba(255,255,255,0.05)' }}
      >
        {['overview', 'strategy', 'content', 'videos', 'emails'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize"
            style={{
              background: activeTab === tab ? `linear-gradient(135deg, ${PINK} 0%, ${LAVENDER} 100%)` : 'transparent',
              color: activeTab === tab ? '#0A0A0A' : 'rgba(255,255,255,0.6)',
            }}
            data-testid={`tab-${tab}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          !latestSession ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-12 rounded-2xl text-center"
              style={{
                background: `linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)`,
                border: `1px dashed rgba(255,255,255,0.1)`,
              }}
            >
              <Sparkles className="h-12 w-12 mx-auto mb-4" style={{ color: PINK, opacity: 0.6 }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#FFFFFF' }}>Ready to generate content?</h3>
              <p className="max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Click the button above to activate your AI agency team. They'll create 
                strategy, social posts, video scripts, visuals, and email sequences for your brand.
              </p>
            </motion.div>
          ) : (
            <div className="text-center py-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Check the Strategy, Content, Videos, and Emails tabs to see your generated assets.
            </div>
          )
        )}

        {activeTab === 'strategy' && (
          latestStrategy ? (
            <StrategyDisplay strategy={latestStrategy} />
          ) : (
            <div 
              className="p-12 rounded-2xl text-center"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)' }}
            >
              <Target className="h-12 w-12 mx-auto mb-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#FFFFFF' }}>No strategy yet</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)' }}>Start an agency session to generate your brand strategy</p>
            </div>
          )
        )}

        {activeTab === 'content' && (
          posts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {posts.map(post => (
                <AssetCard key={post.id} asset={post} />
              ))}
            </div>
          ) : (
            <div 
              className="p-12 rounded-2xl text-center"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)' }}
            >
              <FileText className="h-12 w-12 mx-auto mb-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#FFFFFF' }}>No posts yet</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)' }}>Start an agency session to generate social media posts</p>
            </div>
          )
        )}

        {activeTab === 'videos' && (
          videos.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {videos.map(video => (
                <AssetCard key={video.id} asset={video} />
              ))}
            </div>
          ) : (
            <div 
              className="p-12 rounded-2xl text-center"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)' }}
            >
              <Video className="h-12 w-12 mx-auto mb-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#FFFFFF' }}>No video scripts yet</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)' }}>Start an agency session to generate TikTok and Reel scripts</p>
            </div>
          )
        )}

        {activeTab === 'emails' && (
          emails.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {emails.map(email => (
                <AssetCard key={email.id} asset={email} />
              ))}
            </div>
          ) : (
            <div 
              className="p-12 rounded-2xl text-center"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)' }}
            >
              <Mail className="h-12 w-12 mx-auto mb-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#FFFFFF' }}>No emails yet</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)' }}>Start an agency session to generate email sequences</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

// Main Page Component
export default function AgencyDashboardPage() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);

  const { data: businesses, isLoading } = useQuery<AgencyBusinessDB[]>({
    queryKey: ['/api/agency/businesses'],
  });

  const selectedBusiness = businesses?.find(b => b.id === selectedBusinessId) || businesses?.[0];

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ background: DARK_BG }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-8 w-8" style={{ color: PINK }} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: DARK_BG }}>
      <SEO 
        title="AI Digital Agency | MetaHers Mind Spa"
        description="Your personal team of 7 AI agents powered by Replit—creating content, strategy, and visuals for your business 24/7."
      />

      {!businesses || businesses.length === 0 ? (
        <>
          <HeroSection onGetStarted={() => setShowOnboarding(true)} />
          <AgentCollectiveSection />
          
          <section className="relative py-20 px-6 overflow-hidden" style={{ background: DARK_BG }}>
            <AmbientGlow />
            <div className="relative max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <h2 
                  className="text-3xl lg:text-4xl mb-4"
                  style={{ fontFamily: 'Playfair Display, serif', color: '#FFFFFF', fontWeight: 300 }}
                >
                  Create Your <span className="italic" style={{ color: PINK }}>Business Profile</span>
                </h2>
                <p className="font-light" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  Tell us about your brand, and we'll deploy your AI team.
                </p>
              </motion.div>

              <BusinessOnboardingForm onSuccess={() => setShowOnboarding(false)} />
            </div>
          </section>
        </>
      ) : (
        <>
          {/* Header */}
          <div 
            className="relative py-12 px-6 overflow-hidden"
            style={{ background: `linear-gradient(180deg, ${DARK_BG} 0%, rgba(20, 17, 28, 1) 100%)` }}
          >
            <AmbientGlow />
            <div className="relative max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${PINK}20 0%, ${LAVENDER}20 100%)` }}
                >
                  <Crown className="w-6 h-6" style={{ color: PINK }} />
                </div>
                <div>
                  <h1 
                    className="text-2xl lg:text-3xl"
                    style={{ fontFamily: 'Playfair Display, serif', color: '#FFFFFF', fontWeight: 400 }}
                  >
                    AI Digital Agency
                  </h1>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    Powered by Replit AI
                  </p>
                </div>
              </div>

              <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
                <DialogTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2"
                    style={{ 
                      background: 'rgba(255,255,255,0.05)',
                      border: `1px solid ${PINK}50`,
                      color: PINK,
                    }}
                    data-testid="button-add-business"
                  >
                    <Plus className="h-4 w-4" />
                    Add Business
                  </motion.button>
                </DialogTrigger>
                <DialogContent 
                  className="max-w-2xl max-h-[90vh] overflow-y-auto"
                  style={{ background: DARK_BG, border: `1px solid rgba(255,255,255,0.1)` }}
                >
                  <DialogHeader>
                    <DialogTitle style={{ color: '#FFFFFF', fontFamily: 'Playfair Display, serif' }}>
                      Create Business Profile
                    </DialogTitle>
                  </DialogHeader>
                  <BusinessOnboardingForm onSuccess={() => setShowOnboarding(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Business Selector */}
          {businesses.length > 1 && (
            <div className="px-6 py-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto pb-2">
                {businesses.map(business => (
                  <motion.button
                    key={business.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedBusinessId(business.id)}
                    className="px-4 py-2 rounded-xl whitespace-nowrap flex items-center gap-2 text-sm"
                    style={{
                      background: selectedBusiness?.id === business.id 
                        ? `linear-gradient(135deg, ${PINK} 0%, ${LAVENDER} 100%)`
                        : 'rgba(255,255,255,0.05)',
                      color: selectedBusiness?.id === business.id ? '#0A0A0A' : 'rgba(255,255,255,0.7)',
                      border: `1px solid ${selectedBusiness?.id === business.id ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
                    }}
                    data-testid={`button-business-${business.id}`}
                  >
                    <Building2 className="h-4 w-4" />
                    {business.businessName}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="max-w-6xl mx-auto px-6 py-8">
            {selectedBusiness && <BusinessDashboard business={selectedBusiness} />}
          </div>

          <SectionDivider />

          {/* Agent Collective (collapsed view) */}
          <AgentCollectiveSection currentAgent={undefined} />
        </>
      )}
    </div>
  );
}
