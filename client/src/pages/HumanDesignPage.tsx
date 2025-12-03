import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Sparkles, 
  Star, 
  Sun, 
  Moon, 
  Heart, 
  Compass, 
  Brain, 
  Zap, 
  Shield,
  Target,
  Users,
  Briefcase,
  ArrowRight,
  MapPin,
  Calendar,
  Clock,
  ChevronDown,
  Check,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SEO } from "@/components/SEO";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

// Form validation schema
const birthDataSchema = z.object({
  birthDate: z.string().min(1, "Birth date is required"),
  birthTime: z.string().min(1, "Birth time is required for accurate reading"),
  birthLocation: z.string().min(1, "Birth location is required"),
});

type BirthDataForm = z.infer<typeof birthDataSchema>;

// City suggestion type
interface CityOption {
  name: string;
  latitude: number;
  longitude: number;
}

// Human Design reading type
interface HumanDesignReading {
  type: string;
  strategy: string;
  authority: string;
  profile: string;
  profileDescription: string;
  definition: string;
  centers: {
    head: { defined: boolean; theme: string };
    ajna: { defined: boolean; theme: string };
    throat: { defined: boolean; theme: string };
    g: { defined: boolean; theme: string };
    heart: { defined: boolean; theme: string };
    sacral: { defined: boolean; theme: string };
    solarPlexus: { defined: boolean; theme: string };
    spleen: { defined: boolean; theme: string };
    root: { defined: boolean; theme: string };
  };
  definedGates: number[];
  channels: string[];
  incarnationCross: string;
  incarnationCrossDescription: string;
  typeDescription: string;
  strategyDescription: string;
  authorityDescription: string;
  lifeTheme: string;
  notSelfTheme: string;
  signature: string;
  strengths: string[];
  challenges: string[];
  careerGuidance: string;
  relationshipInsights: string;
  birthData: {
    date: string;
    time: string;
    location: string;
    timezone: string;
  };
}

// Type colors
const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Generator': { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
  'Manifesting Generator': { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' },
  'Projector': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  'Manifestor': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
  'Reflector': { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
};

// Center component for the bodygraph
function CenterNode({ 
  name, 
  defined, 
  position, 
  onClick 
}: { 
  name: string; 
  defined: boolean; 
  position: { top: string; left: string }; 
  onClick: () => void;
}) {
  const centerNames: Record<string, string> = {
    head: 'Head',
    ajna: 'Ajna',
    throat: 'Throat',
    g: 'G Center',
    heart: 'Heart',
    sacral: 'Sacral',
    solarPlexus: 'Solar Plexus',
    spleen: 'Spleen',
    root: 'Root',
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`absolute w-12 h-12 rounded-lg flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
        defined 
          ? 'bg-purple-600 text-white shadow-lg shadow-purple-300' 
          : 'bg-white border-2 border-gray-300 text-gray-600'
      }`}
      style={{ top: position.top, left: position.left }}
      data-testid={`center-${name}`}
    >
      {centerNames[name]?.charAt(0) || name.charAt(0).toUpperCase()}
    </motion.button>
  );
}

// City search is now dynamic via API - removed old static list to avoid duplicate key warnings

// City search input component with smart debouncing
function CitySearchInput({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<CityOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    
    if (timer) {
      clearTimeout(timer);
    }

    if (q.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    const newTimer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/cities/search?q=${encodeURIComponent(q)}`);
        const cities = await response.json();
        setSuggestions(cities || []);
      } catch (error) {
        console.error("City search error:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
    setTimer(newTimer);
  };

  const handleSelect = (cityName: string) => {
    onChange(cityName);
    setSearchQuery("");
    setSuggestions([]);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Search your birth city..."
          className="w-full border border-purple-200 rounded-md px-3 py-2 text-sm outline-none bg-white focus:border-purple-500 hover:border-purple-300 transition"
          data-testid="input-city-search"
        />
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <div className="space-y-1 max-h-64 overflow-y-auto p-2">
          {isLoading && <p className="text-sm text-gray-500 text-center py-3">Searching worldwide cities...</p>}
          {!isLoading && suggestions.length === 0 && searchQuery.length >= 2 && (
            <p className="text-sm text-gray-500 text-center py-3">No cities found</p>
          )}
          {!isLoading && searchQuery.length < 2 && (
            <p className="text-xs text-gray-400 text-center py-3">Type 2+ characters to search</p>
          )}
          {suggestions.map((city, idx) => (
            <button
              key={`${city.name}-${idx}`}
              onClick={() => handleSelect(city.name)}
              className="w-full text-left px-3 py-2 rounded hover:bg-purple-50 text-sm transition text-gray-800"
              data-testid={`city-option-${idx}`}
            >
              {city.name}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function HumanDesignPage() {
  // Restore reading from sessionStorage on page load
  const [reading, setReading] = useState<HumanDesignReading | null>(() => {
    const stored = typeof window !== 'undefined' ? sessionStorage.getItem('humanDesignReading') : null;
    return stored ? JSON.parse(stored) : null;
  });
  const [selectedCenter, setSelectedCenter] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>('type');
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  const form = useForm<BirthDataForm>({
    resolver: zodResolver(birthDataSchema),
    defaultValues: {
      birthDate: "",
      birthTime: "",
      birthLocation: "",
    },
  });

  const generateReading = useMutation({
    mutationFn: async (data: BirthDataForm) => {
      const response = await apiRequest("POST", "/api/human-design/calculate", data);
      return response.json();
    },
    onSuccess: (data) => {
      setReading(data);
      // Save to sessionStorage so it persists across navigation
      sessionStorage.setItem('humanDesignReading', JSON.stringify(data));
    },
  });

  const onSubmit = (data: BirthDataForm) => {
    generateReading.mutate(data);
  };

  // Center positions for bodygraph visualization
  const centerPositions: Record<string, { top: string; left: string }> = {
    head: { top: '5%', left: '50%' },
    ajna: { top: '18%', left: '50%' },
    throat: { top: '32%', left: '50%' },
    g: { top: '48%', left: '50%' },
    heart: { top: '45%', left: '30%' },
    spleen: { top: '60%', left: '25%' },
    sacral: { top: '65%', left: '50%' },
    solarPlexus: { top: '60%', left: '75%' },
    root: { top: '82%', left: '50%' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white">
      <SEO
        title="Unlock Your Human Design - MetaHers Mind Spa"
        description="Discover your unique Human Design blueprint based on your exact birth data. Get personalized insights into your type, strategy, authority, and life purpose."
        keywords="human design, birth chart, energy type, strategy, authority, life purpose, self-discovery"
        url="https://metahers.ai/human-design"
      />

      {/* Hero Section */}
      <section className="relative py-20 px-6 lg:px-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 right-10 w-64 h-64 bg-purple-200 rounded-full blur-3xl opacity-30"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-20 left-10 w-80 h-80 bg-pink-200 rounded-full blur-3xl opacity-20"
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-purple-100 text-purple-700 border-purple-200 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Discover Your Blueprint
            </Badge>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-black mb-6">
              Unlock Your{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Human Design
              </span>
            </h1>
            
            <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
              Your unique energetic blueprint reveals how you're designed to make decisions, 
              interact with others, and fulfill your life purpose. Enter your birth data for 
              an accurate, personalized reading.
            </p>
          </motion.div>

          {/* Birth Data Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="max-w-xl mx-auto p-8 border-2 border-purple-200 shadow-xl">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-700">
                          <Calendar className="w-4 h-4 text-purple-600" />
                          Birth Date
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            className="border-purple-200 focus:border-purple-500"
                            data-testid="input-birth-date"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="birthTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-700">
                          <Clock className="w-4 h-4 text-purple-600" />
                          Birth Time (as accurate as possible)
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="time" 
                            {...field} 
                            className="border-purple-200 focus:border-purple-500"
                            data-testid="input-birth-time"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="birthLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-700">
                          <MapPin className="w-4 h-4 text-purple-600" />
                          Birth Location
                        </FormLabel>
                        <FormControl>
                          <CitySearchInput 
                            value={field.value} 
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={generateReading.isPending}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold py-4 text-lg"
                    data-testid="button-generate-reading"
                  >
                    {generateReading.isPending ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        Generate My Reading
                        <Sparkles className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Reading Results */}
      <AnimatePresence>
        {reading && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6 }}
            className="py-16 px-6 lg:px-16"
          >
            <div className="max-w-6xl mx-auto">
              {/* Preview Section - Visible to Everyone */}
              <div className="text-center mb-12 p-8 bg-gradient-to-b from-purple-50 to-white rounded-2xl border-2 border-purple-200">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Badge 
                    className={`text-lg px-6 py-3 mb-4 ${TYPE_COLORS[reading.type]?.bg} ${TYPE_COLORS[reading.type]?.text} ${TYPE_COLORS[reading.type]?.border} border-2`}
                  >
                    You are a {reading.type}
                  </Badge>
                </motion.div>
                <h2 className="text-4xl font-bold text-black mb-4">
                  {reading.profile}
                </h2>
                <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-6">
                  {reading.typeDescription}
                </p>
                
                {/* Preview Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Strategy', value: reading.strategy, icon: Compass },
                    { label: 'Authority', value: reading.authority, icon: Brain },
                    { label: 'Signature', value: reading.signature, icon: Heart },
                    { label: 'Not-Self', value: reading.notSelfTheme, icon: Shield },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card className="p-4 text-center border-2 border-purple-100">
                        <stat.icon className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">{stat.label}</p>
                        <p className="font-bold text-gray-900">{stat.value}</p>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Full Reading - Gated Behind Authentication */}
              {isAuthenticated ? (
                <>
                  {/* Two Column Layout */}
                  <div className="grid lg:grid-cols-2 gap-8">
                {/* Left: Bodygraph Visualization */}
                <Card className="p-8 border-2 border-purple-200">
                  <h3 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
                    <Sun className="w-6 h-6 text-purple-600" />
                    Your Bodygraph
                  </h3>
                  
                  <div className="relative h-96 bg-gradient-to-b from-purple-50 to-white rounded-xl">
                    {Object.entries(reading.centers).map(([name, center]) => (
                      <CenterNode
                        key={name}
                        name={name}
                        defined={center.defined}
                        position={centerPositions[name]}
                        onClick={() => setSelectedCenter(selectedCenter === name ? null : name)}
                      />
                    ))}
                    
                    {/* Connection lines would go here - simplified for now */}
                  </div>

                  {/* Selected Center Info */}
                  <AnimatePresence>
                    {selectedCenter && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 p-4 bg-purple-50 rounded-lg"
                      >
                        <h4 className="font-bold text-purple-700 mb-2 capitalize">
                          {selectedCenter === 'g' ? 'G Center' : selectedCenter === 'solarPlexus' ? 'Solar Plexus' : selectedCenter} Center
                          <Badge className={`ml-2 ${reading.centers[selectedCenter as keyof typeof reading.centers].defined ? 'bg-purple-600' : 'bg-gray-400'}`}>
                            {reading.centers[selectedCenter as keyof typeof reading.centers].defined ? 'Defined' : 'Undefined'}
                          </Badge>
                        </h4>
                        <p className="text-sm text-gray-700">
                          {reading.centers[selectedCenter as keyof typeof reading.centers].theme}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>

                {/* Right: Detailed Reading */}
                <div className="space-y-4">
                  {/* Expandable Sections */}
                  {[
                    { id: 'type', title: 'Your Type & Strategy', icon: Target, content: reading.strategyDescription },
                    { id: 'authority', title: 'Your Authority', icon: Brain, content: reading.authorityDescription },
                    { id: 'profile', title: 'Your Profile', icon: Users, content: reading.profileDescription },
                    { id: 'cross', title: 'Incarnation Cross', icon: Compass, content: reading.incarnationCrossDescription },
                    { id: 'career', title: 'Career Guidance', icon: Briefcase, content: reading.careerGuidance },
                    { id: 'relationships', title: 'Relationship Insights', icon: Heart, content: reading.relationshipInsights },
                  ].map((section) => (
                    <motion.div key={section.id} layout>
                      <Card 
                        className={`border-2 transition-colors cursor-pointer ${
                          expandedSection === section.id ? 'border-purple-400' : 'border-purple-100 hover:border-purple-200'
                        }`}
                        onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                      >
                        <div className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <section.icon className="w-5 h-5 text-purple-600" />
                            <h4 className="font-bold text-gray-900">{section.title}</h4>
                          </div>
                          <motion.div
                            animate={{ rotate: expandedSection === section.id ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          </motion.div>
                        </div>
                        
                        <AnimatePresence>
                          {expandedSection === section.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 text-gray-700">
                                {section.content}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Strengths & Challenges */}
              <div className="grid md:grid-cols-2 gap-8 mt-12">
                <Card className="p-6 border-2 border-green-200 bg-green-50">
                  <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Your Strengths
                  </h3>
                  <ul className="space-y-2">
                    {reading.strengths.map((strength, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-6 border-2 border-amber-200 bg-amber-50">
                  <h3 className="text-xl font-bold text-amber-700 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Growth Edges
                  </h3>
                  <ul className="space-y-2">
                    {reading.challenges.map((challenge, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700">
                        <ArrowRight className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        {challenge}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              {/* Defined Gates & Channels */}
              <Card className="mt-12 p-8 border-2 border-purple-200">
                <h3 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
                  <Star className="w-6 h-6 text-purple-600" />
                  Your Defined Gates & Channels
                </h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold text-gray-700 mb-3">Active Gates</h4>
                    <div className="flex flex-wrap gap-2">
                      {reading.definedGates.map((gate) => (
                        <Badge key={gate} className="bg-purple-100 text-purple-700 border border-purple-300">
                          Gate {gate}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-700 mb-3">Defined Channels</h4>
                    {reading.channels.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {reading.channels.map((channel) => (
                          <Badge key={channel} className="bg-pink-100 text-pink-700 border border-pink-300">
                            {channel}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No complete channels defined</p>
                    )}
                  </div>
                </div>
              </Card>

                  {/* CTA for Authenticated Users */}
                  <div className="mt-12 text-center">
                    <Card className="inline-block p-8 border-2 border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50">
                      <h3 className="text-2xl font-bold text-black mb-4">
                        Want to Go Deeper?
                      </h3>
                      <p className="text-gray-700 mb-6 max-w-lg">
                        Explore how your Human Design connects with AI tools, business strategy, and personal transformation in your full Member Dashboard.
                      </p>
                      <Button
                        onClick={() => setLocation('/dashboard')}
                        className="bg-black hover:bg-gray-900 text-white font-bold uppercase tracking-wider px-8"
                        data-testid="button-explore-dashboard"
                      >
                        Go to Dashboard
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Card>
                  </div>
                </>
              ) : (
                // Sign-in Gate for Unauthenticated Users
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mt-12 p-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl border-3 border-purple-300 text-center"
                >
                  <Lock className="w-16 h-16 text-purple-600 mx-auto mb-6" />
                  <h3 className="text-3xl font-bold text-black mb-4">
                    Unlock Your Full Human Design Reading
                  </h3>
                  <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
                    You've seen your type and strategy. Sign in to access your complete personalized reading including:
                  </p>
                  <ul className="text-left max-w-md mx-auto mb-8 space-y-3">
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">Your detailed bodygraph visualization</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">Authority & decision-making guidance</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">Career and relationship insights</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">All 9 centers & defined gates analysis</span>
                    </li>
                  </ul>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={() => setLocation('/login')}
                      className="bg-black hover:bg-gray-900 text-white font-bold uppercase tracking-wider px-8 py-3 text-lg"
                      data-testid="button-sign-in-reading"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => setLocation('/signup')}
                      variant="outline"
                      className="border-2 border-black text-black hover:bg-black hover:text-white font-bold uppercase tracking-wider px-8 py-3 text-lg"
                      data-testid="button-create-account-reading"
                    >
                      Create Account
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Info Section (shown when no reading yet) */}
      {!reading && (
        <section className="py-16 px-6 lg:px-16 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-black mb-12">
              What is Human Design?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Sun,
                  title: "Your Energetic Blueprint",
                  description: "Human Design combines astrology, I Ching, Kabbalah, and the chakra system to reveal your unique energetic makeup."
                },
                {
                  icon: Compass,
                  title: "Decision-Making Clarity",
                  description: "Discover your personal authority - the reliable way your body communicates correct decisions for you."
                },
                {
                  icon: Users,
                  title: "Relationship Dynamics",
                  description: "Understand how you interact with others, where you're open to influence, and where you have consistent energy."
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="p-6 text-center border-2 border-purple-100 hover:border-purple-300 transition-colors h-full">
                    <item.icon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-black mb-2">{item.title}</h3>
                    <p className="text-gray-700">{item.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* 5 Types */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-center text-black mb-8">The 5 Human Design Types</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { type: 'Generator', percent: '37%', color: 'orange' },
                  { type: 'Manifesting Generator', percent: '33%', color: 'amber' },
                  { type: 'Projector', percent: '20%', color: 'blue' },
                  { type: 'Manifestor', percent: '9%', color: 'red' },
                  { type: 'Reflector', percent: '1%', color: 'purple' },
                ].map((item) => (
                  <Card 
                    key={item.type} 
                    className={`p-4 text-center border-2 ${TYPE_COLORS[item.type]?.border} ${TYPE_COLORS[item.type]?.bg}`}
                  >
                    <p className={`font-bold ${TYPE_COLORS[item.type]?.text}`}>{item.type}</p>
                    <p className="text-sm text-gray-600">{item.percent} of population</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
