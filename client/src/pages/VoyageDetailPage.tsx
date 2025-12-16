import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  Anchor, 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  CheckCircle2,
  ArrowLeft,
  Ship,
  UtensilsCrossed,
  TreePine,
  Star,
  Shield,
  CreditCard,
  ChevronRight,
  Sparkles,
  Gift,
  Wine,
  Wifi,
  Laptop,
  BookOpen,
  Heart,
  Share2,
  Navigation
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { VoyageDB } from "@shared/schema";
import visionVoyageHeroImage from "@assets/IMG_2725_1765913672730.png";

const VENUE_ICONS = {
  Duffy_Boat: Ship,
  Picnic: TreePine,
  Brunch: UtensilsCrossed,
};

const CATEGORY_STYLES = {
  AI: "voyage-category-ai",
  Crypto: "voyage-category-crypto",
  Web3: "voyage-category-web3",
  AI_Branding: "voyage-category-branding",
};

const INCLUDED_ICONS: Record<string, typeof Gift> = {
  champagne: Wine,
  wifi: Wifi,
  device: Laptop,
  materials: BookOpen,
  gift: Gift,
  default: Sparkles,
};

function getIncludedIcon(item: string) {
  const lower = item.toLowerCase();
  if (lower.includes('champagne') || lower.includes('wine') || lower.includes('drink')) return Wine;
  if (lower.includes('wifi') || lower.includes('internet')) return Wifi;
  if (lower.includes('laptop') || lower.includes('device') || lower.includes('ipad')) return Laptop;
  if (lower.includes('material') || lower.includes('guide') || lower.includes('workbook')) return BookOpen;
  if (lower.includes('gift') || lower.includes('bag') || lower.includes('swag')) return Gift;
  return Sparkles;
}

function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const diff = target - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="voyage-countdown justify-center">
      {[
        { value: timeLeft.days, label: 'Days' },
        { value: timeLeft.hours, label: 'Hours' },
        { value: timeLeft.minutes, label: 'Mins' },
        { value: timeLeft.seconds, label: 'Secs' },
      ].map((unit, i) => (
        <div key={i} className="voyage-countdown-unit">
          <span className="voyage-countdown-value">{unit.value.toString().padStart(2, '0')}</span>
          <span className="voyage-countdown-label">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}

function BookingCard({ voyage }: { voyage: VoyageDB }) {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  
  const spotsLeft = voyage.maxCapacity - voyage.currentBookings;
  const isFull = spotsLeft <= 0;

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Check if user has already requested
  const { data: requestStatus } = useQuery<{ hasRequested: boolean; status?: string }>({
    queryKey: ['/api/voyages/invitation-request', voyage.id],
    enabled: isAuthenticated,
  });

  const requestMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/voyages/invitation-request', { 
        voyageId: voyage.id,
        message: requestMessage 
      });
      return res.json();
    },
    onSuccess: (data) => {
      setShowRequestModal(false);
      setRequestMessage('');
      queryClient.invalidateQueries({ queryKey: ['/api/voyages/invitation-request', voyage.id] });
      toast({
        title: "Request Submitted!",
        description: data.message || "We'll review your request and be in touch soon.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Request Failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    },
  });

  const handleRequestInvitation = () => {
    if (!isAuthenticated) {
      setLocation('/login?redirect=/voyages/' + voyage.slug);
      return;
    }
    setShowRequestModal(true);
  };

  const hasAlreadyRequested = requestStatus?.hasRequested;
  const requestStatusText = requestStatus?.status;

  return (
    <>
      <div className="voyage-booking-card sticky top-24 space-y-6">
        <div className="text-center pb-4 border-b border-border">
          <p className="text-sm text-muted-foreground mb-2">Exclusive Experience</p>
          <p className="text-lg font-semibold">Invitation Only</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-purple-500" />
            <div>
              <p className="font-medium">{formatDate(voyage.date)}</p>
              <p className="text-sm text-muted-foreground">{voyage.time} • {voyage.duration}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-purple-500" />
            <div>
              <p className="font-medium">{voyage.location}</p>
              <a 
                href={`https://maps.google.com/?q=${voyage.latitude},${voyage.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-500 hover:underline flex items-center gap-1"
              >
                Get Directions <Navigation className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Availability
            </span>
            <span className={`font-medium ${isFull ? 'text-red-500' : 'text-green-500'}`}>
              {isFull ? 'Full' : `${spotsLeft} of ${voyage.maxCapacity} spots`}
            </span>
          </div>
          <div className="voyage-spots-indicator">
            <div 
              className="voyage-spots-fill" 
              style={{ width: `${(voyage.currentBookings / voyage.maxCapacity) * 100}%` }}
            />
          </div>
        </div>
        
        {hasAlreadyRequested ? (
          <div className="space-y-3">
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 text-center">
              <CheckCircle2 className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="font-medium text-purple-400">Request Submitted</p>
              <p className="text-sm text-muted-foreground mt-1">
                {requestStatusText === 'pending' && "We're reviewing your request..."}
                {requestStatusText === 'approved' && "Your invitation has been approved!"}
                {requestStatusText === 'declined' && "Unfortunately, this voyage is at capacity."}
              </p>
            </div>
          </div>
        ) : isFull ? (
          <Button className="w-full voyage-waitlist h-14 text-lg" data-testid="button-join-waitlist">
            Join Waitlist
          </Button>
        ) : (
          <Button 
            className="w-full voyage-cta h-14"
            onClick={handleRequestInvitation}
            data-testid="button-request-invitation"
          >
            Request Invitation
          </Button>
        )}
        
        <div className="space-y-3">
          <div className="voyage-trust-badge">
            <Shield className="w-4 h-4" />
            <span>Curated for Women Leaders</span>
          </div>
          <div className="voyage-trust-badge">
            <Heart className="w-4 h-4" />
            <span>Intimate & Intentional</span>
          </div>
        </div>
      </div>

      {/* Request Invitation Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-xl"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Request Your Invitation</h3>
              <p className="text-muted-foreground text-sm">
                Share a bit about yourself and why you'd like to join this exclusive experience.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Tell us about yourself (optional)
                </label>
                <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="I'm a founder building... I'm excited about this voyage because..."
                  className="w-full h-32 bg-background border border-border rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  data-testid="textarea-request-message"
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowRequestModal(false)}
                  data-testid="button-cancel-request"
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 voyage-cta"
                  onClick={() => requestMutation.mutate()}
                  disabled={requestMutation.isPending}
                  data-testid="button-submit-request"
                >
                  {requestMutation.isPending ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

function VoyageDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <Skeleton className="h-[50vh] w-full" />
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div>
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VoyageDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: voyage, isLoading, error } = useQuery<VoyageDB>({
    queryKey: ['/api/voyages', slug],
    enabled: !!slug,
  });

  if (isLoading) return <VoyageDetailSkeleton />;
  
  if (error || !voyage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Anchor className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Voyage Not Found</h2>
          <p className="text-muted-foreground mb-6">This voyage may have sailed off into the sunset.</p>
          <Link href="/voyages">
            <Button className="voyage-cta">Browse All Voyages</Button>
          </Link>
        </div>
      </div>
    );
  }

  const VenueIcon = VENUE_ICONS[voyage.venueType as keyof typeof VENUE_ICONS] || Ship;
  const categoryStyle = CATEGORY_STYLES[voyage.category as keyof typeof CATEGORY_STYLES] || "";
  const learningObjectives = (voyage.learningObjectives as string[]) || [];
  const included = (voyage.included as string[]) || [];

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-purple-600/80 to-pink-600/80"
          style={{
            backgroundImage: voyage.slug === 'metahers-vision-voyage' 
              ? `url(${visionVoyageHeroImage})`
              : voyage.heroImage ? `url(${voyage.heroImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-end z-10">
          <div className="container mx-auto px-4 pb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-white/70 text-sm">
                <Link href="/" className="hover:text-white">Home</Link>
                <ChevronRight className="w-4 h-4" />
                <Link href="/voyages" className="hover:text-white">Voyages</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white">{voyage.title}</span>
              </nav>
              
              <div className="flex flex-wrap items-center gap-3">
                <span className={`voyage-badge ${categoryStyle}`}>
                  {voyage.category.replace('_', ' ')}
                </span>
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                  <VenueIcon className="w-3 h-3 mr-1" />
                  {voyage.venueType.replace('_', ' ')}
                </Badge>
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                  Voyage {voyage.sequenceNumber} of 12
                </Badge>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold text-white max-w-3xl">
                {voyage.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{formatDate(voyage.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{voyage.time} • {voyage.duration}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Back Button */}
        <Link href="/voyages" className="absolute top-6 left-6 z-20">
          <Button variant="ghost" className="bg-white/10 hover:bg-white/20 text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            All Voyages
          </Button>
        </Link>
        
        {/* Share Button */}
        <div className="absolute top-6 right-6 z-20 flex gap-2">
          <Button variant="ghost" size="icon" className="bg-white/10 hover:bg-white/20 text-white">
            <Heart className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="bg-white/10 hover:bg-white/20 text-white">
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </section>
      
      {/* Countdown Banner */}
      <section className="py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm uppercase tracking-wider mb-2 opacity-80">Your Voyage Begins In</p>
          <CountdownTimer targetDate={new Date(voyage.date)} />
        </div>
      </section>
      
      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-10">
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold mb-4">About This Voyage</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {voyage.description}
                </p>
              </motion.div>
              
              {/* Learning Objectives */}
              {learningObjectives.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-2xl font-bold mb-6">What You'll Master</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {learningObjectives.map((objective, index) => (
                      <div key={index} className="voyage-objective flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                        <span>{objective}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* What's Included */}
              {included.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-2xl font-bold mb-6">What's Included</h2>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {included.map((item, index) => {
                      const Icon = getIncludedIcon(item);
                      return (
                        <div key={index} className="voyage-included">
                          <div className="voyage-included-icon">
                            <Icon className="w-5 h-5" />
                          </div>
                          <span>{item}</span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
              
              {/* Location */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold mb-6">Location</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shrink-0">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{voyage.location}</h3>
                        <p className="text-muted-foreground mb-3">Newport Beach, California</p>
                        <a 
                          href={`https://maps.google.com/?q=${voyage.latitude},${voyage.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-purple-500 hover:underline"
                        >
                          <Navigation className="w-4 h-4" />
                          Get Directions
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* FAQ */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="space-y-2">
                  <AccordionItem value="item-1" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      What should I bring?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Just bring yourself and a fully charged device (laptop or tablet). We provide all materials, refreshments, and everything else you need for a luxurious learning experience.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      What's the cancellation policy?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Full refund up to 7 days before the voyage. 50% refund 3-7 days before. No refund within 3 days, but you can transfer your spot to someone else.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      Do I need prior experience?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Not at all! Our voyages are designed for all experience levels. We'll send you a pre-voyage questionnaire to tailor the experience to your needs.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      What if the voyage is full?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Join our waitlist! You'll be first to know if a spot opens up. We also offer similar voyages throughout the year.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            </div>
            
            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <BookingCard voyage={voyage} />
            </div>
          </div>
        </div>
      </section>
      
      {/* Mobile Sticky Booking Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border lg:hidden z-50">
        <div className="container mx-auto flex items-center justify-center">
          <Button 
            className="voyage-cta flex-1 max-w-xs"
            data-testid="button-book-now-mobile"
          >
            Request Invitation
          </Button>
        </div>
      </div>
    </div>
  );
}
