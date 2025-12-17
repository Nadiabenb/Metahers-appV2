import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Eye, 
  Users, 
  DollarSign, 
  Calendar, 
  MapPin,
  Ship,
  TreePine,
  UtensilsCrossed,
  ArrowLeft,
  Save,
  X,
  Clock,
  Brain,
  Coins,
  Globe,
  Palette,
  AlertCircle,
  Check,
  Mail,
  ThumbsUp,
  ThumbsDown,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import type { VoyageDB, VoyageInvitationRequestDB } from "@shared/schema";

type VoyageWithStats = VoyageDB & {
  confirmedBookings: number;
  waitlistCount: number;
};

type VoyageStats = {
  totalVoyages: number;
  upcomingVoyages: number;
  totalBookings: number;
  totalRevenue: number;
  totalWaitlist: number;
};

const CATEGORIES = [
  { id: "AI", label: "AI Mastery", icon: Brain },
  { id: "Crypto", label: "Crypto", icon: Coins },
  { id: "Web3", label: "Web3", icon: Globe },
  { id: "AI_Branding", label: "AI Branding", icon: Palette },
];

const VENUE_TYPES = [
  { id: "Duffy_Boat", label: "Pink Duffy Boat", icon: Ship },
  { id: "Picnic", label: "Beach Picnic", icon: TreePine },
  { id: "Brunch", label: "Luxury Brunch", icon: UtensilsCrossed },
];

const STATUS_OPTIONS = [
  { id: "upcoming", label: "Upcoming" },
  { id: "full", label: "Full" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const emptyVoyage = {
  title: "",
  category: "AI",
  venueType: "Duffy_Boat",
  description: "",
  date: "",
  time: "2:00 PM",
  duration: "3 hours",
  location: "Balboa Island Ferry Terminal, Balboa",
  latitude: "33.6075",
  longitude: "-117.8989",
  price: 49700,
  maxCapacity: 6,
  learningObjectives: [""],
  included: [""],
  heroImage: "",
  status: "upcoming",
  sequenceNumber: 1,
  hostName: "Melissa",
  hostImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
};

export default function AdminVoyagesPage() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editingVoyage, setEditingVoyage] = useState<Partial<VoyageDB> | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("voyages");
  const [invitationFilter, setInvitationFilter] = useState<"all" | "pending" | "approved" | "declined">("pending");
  const [respondingToId, setRespondingToId] = useState<string | null>(null);
  const [responseNotes, setResponseNotes] = useState("");

  const { data: voyages, isLoading } = useQuery<VoyageWithStats[]>({
    queryKey: ['/api/admin/voyages'],
  });

  const { data: stats } = useQuery<VoyageStats>({
    queryKey: ['/api/admin/voyages-stats'],
  });

  const { data: invitations, isLoading: invitationsLoading } = useQuery<(VoyageInvitationRequestDB & { voyageTitle: string })[]>({
    queryKey: ['/api/admin/voyages/invitations'],
  });

  const createMutation = useMutation({
    mutationFn: async (voyage: Partial<VoyageDB>) => {
      return apiRequest('POST', '/api/admin/voyages', voyage);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/voyages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/voyages-stats'] });
      setIsEditing(false);
      setEditingVoyage(null);
      toast({ title: "Voyage created successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to create voyage", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<VoyageDB> }) => {
      return apiRequest('PATCH', `/api/admin/voyages/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/voyages'] });
      setIsEditing(false);
      setEditingVoyage(null);
      toast({ title: "Voyage updated successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to update voyage", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/admin/voyages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/voyages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/voyages-stats'] });
      setDeleteConfirmId(null);
      toast({ title: "Voyage deleted successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to delete voyage", description: error.message, variant: "destructive" });
    },
  });

  const approveInvitationMutation = useMutation({
    mutationFn: async ({ id, adminNotes }: { id: string; adminNotes: string }) => {
      return apiRequest('PATCH', `/api/admin/voyages/invitations/${id}`, { status: 'approved', adminNotes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/voyages/invitations'] });
      setRespondingToId(null);
      setResponseNotes("");
      toast({ title: "Invitation approved!" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to approve invitation", description: error.message, variant: "destructive" });
    },
  });

  const declineInvitationMutation = useMutation({
    mutationFn: async ({ id, adminNotes }: { id: string; adminNotes: string }) => {
      return apiRequest('PATCH', `/api/admin/voyages/invitations/${id}`, { status: 'declined', adminNotes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/voyages/invitations'] });
      setRespondingToId(null);
      setResponseNotes("");
      toast({ title: "Invitation declined!" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to decline invitation", description: error.message, variant: "destructive" });
    },
  });

  const handleSave = () => {
    if (!editingVoyage) return;

    const voyageData = {
      ...editingVoyage,
      price: typeof editingVoyage.price === 'string' ? parseInt(editingVoyage.price as string) * 100 : editingVoyage.price,
      maxCapacity: typeof editingVoyage.maxCapacity === 'string' ? parseInt(editingVoyage.maxCapacity as string) : editingVoyage.maxCapacity,
      sequenceNumber: typeof editingVoyage.sequenceNumber === 'string' ? parseInt(editingVoyage.sequenceNumber as string) : editingVoyage.sequenceNumber,
      learningObjectives: (editingVoyage.learningObjectives as string[])?.filter(o => o.trim() !== '') || [],
      included: (editingVoyage.included as string[])?.filter(i => i.trim() !== '') || [],
      date: editingVoyage.date ? new Date(editingVoyage.date as unknown as string) : new Date(),
    };

    if (editingVoyage.id) {
      updateMutation.mutate({ id: editingVoyage.id, updates: voyageData });
    } else {
      createMutation.mutate(voyageData);
    }
  };

  const handleAddObjective = () => {
    if (!editingVoyage) return;
    const objectives = [...(editingVoyage.learningObjectives as string[] || []), ""];
    setEditingVoyage({ ...editingVoyage, learningObjectives: objectives });
  };

  const handleAddIncluded = () => {
    if (!editingVoyage) return;
    const included = [...(editingVoyage.included as string[] || []), ""];
    setEditingVoyage({ ...editingVoyage, included: included });
  };

  const VenueIcon = ({ type }: { type: string }) => {
    const venue = VENUE_TYPES.find(v => v.id === type);
    if (!venue) return <Ship className="w-4 h-4" />;
    const Icon = venue.icon;
    return <Icon className="w-4 h-4" />;
  };

  if (isEditing && editingVoyage) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => { setIsEditing(false); setEditingVoyage(null); }}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">{editingVoyage.id ? 'Edit Voyage' : 'Create New Voyage'}</h1>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={editingVoyage.title || ""}
                      onChange={(e) => setEditingVoyage({ ...editingVoyage, title: e.target.value })}
                      placeholder="AI Mastery: From Curious to Confident"
                      data-testid="input-voyage-title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sequenceNumber">Sequence Number</Label>
                    <Input
                      id="sequenceNumber"
                      type="number"
                      value={editingVoyage.sequenceNumber || 1}
                      onChange={(e) => setEditingVoyage({ ...editingVoyage, sequenceNumber: parseInt(e.target.value) })}
                      data-testid="input-voyage-sequence"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={editingVoyage.category || "AI"}
                      onValueChange={(value) => setEditingVoyage({ ...editingVoyage, category: value })}
                    >
                      <SelectTrigger data-testid="select-voyage-category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="venueType">Venue Type</Label>
                    <Select
                      value={editingVoyage.venueType || "Duffy_Boat"}
                      onValueChange={(value) => setEditingVoyage({ ...editingVoyage, venueType: value })}
                    >
                      <SelectTrigger data-testid="select-voyage-venue">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VENUE_TYPES.map(venue => (
                          <SelectItem key={venue.id} value={venue.id}>{venue.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={editingVoyage.status || "upcoming"}
                      onValueChange={(value) => setEditingVoyage({ ...editingVoyage, status: value })}
                    >
                      <SelectTrigger data-testid="select-voyage-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map(status => (
                          <SelectItem key={status.id} value={status.id}>{status.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editingVoyage.description || ""}
                    onChange={(e) => setEditingVoyage({ ...editingVoyage, description: e.target.value })}
                    placeholder="Describe the voyage experience..."
                    rows={4}
                    data-testid="input-voyage-description"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Schedule & Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="datetime-local"
                      value={editingVoyage.date ? new Date(editingVoyage.date as Date).toISOString().slice(0, 16) : ""}
                      onChange={(e) => setEditingVoyage({ ...editingVoyage, date: new Date(e.target.value) })}
                      data-testid="input-voyage-date"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Display Time</Label>
                    <Input
                      id="time"
                      value={editingVoyage.time || "2:00 PM"}
                      onChange={(e) => setEditingVoyage({ ...editingVoyage, time: e.target.value })}
                      placeholder="2:00 PM"
                      data-testid="input-voyage-time"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={editingVoyage.duration || "3 hours"}
                      onChange={(e) => setEditingVoyage({ ...editingVoyage, duration: e.target.value })}
                      placeholder="3 hours"
                      data-testid="input-voyage-duration"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={editingVoyage.location || ""}
                    onChange={(e) => setEditingVoyage({ ...editingVoyage, location: e.target.value })}
                    placeholder="Balboa Island Ferry Terminal, Balboa"
                    data-testid="input-voyage-location"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      value={editingVoyage.latitude?.toString() || "33.6075"}
                      onChange={(e) => setEditingVoyage({ ...editingVoyage, latitude: e.target.value })}
                      data-testid="input-voyage-latitude"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      value={editingVoyage.longitude?.toString() || "-117.8989"}
                      onChange={(e) => setEditingVoyage({ ...editingVoyage, longitude: e.target.value })}
                      data-testid="input-voyage-longitude"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing & Capacity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (in dollars)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={editingVoyage.price ? (editingVoyage.price as number) / 100 : 497}
                      onChange={(e) => setEditingVoyage({ ...editingVoyage, price: parseInt(e.target.value) * 100 })}
                      data-testid="input-voyage-price"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxCapacity">Max Capacity</Label>
                    <Input
                      id="maxCapacity"
                      type="number"
                      value={editingVoyage.maxCapacity || 6}
                      onChange={(e) => setEditingVoyage({ ...editingVoyage, maxCapacity: parseInt(e.target.value) })}
                      data-testid="input-voyage-capacity"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Objectives</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(editingVoyage.learningObjectives as string[] || []).map((objective, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={objective}
                      onChange={(e) => {
                        const objectives = [...(editingVoyage.learningObjectives as string[])];
                        objectives[index] = e.target.value;
                        setEditingVoyage({ ...editingVoyage, learningObjectives: objectives });
                      }}
                      placeholder={`Learning objective ${index + 1}`}
                      data-testid={`input-objective-${index}`}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const objectives = (editingVoyage.learningObjectives as string[]).filter((_, i) => i !== index);
                        setEditingVoyage({ ...editingVoyage, learningObjectives: objectives });
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={handleAddObjective} data-testid="button-add-objective">
                  <Plus className="w-4 h-4 mr-2" /> Add Objective
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(editingVoyage.included as string[] || []).map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={item}
                      onChange={(e) => {
                        const included = [...(editingVoyage.included as string[])];
                        included[index] = e.target.value;
                        setEditingVoyage({ ...editingVoyage, included: included });
                      }}
                      placeholder={`Included item ${index + 1}`}
                      data-testid={`input-included-${index}`}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const included = (editingVoyage.included as string[]).filter((_, i) => i !== index);
                        setEditingVoyage({ ...editingVoyage, included: included });
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={handleAddIncluded} data-testid="button-add-included">
                  <Plus className="w-4 h-4 mr-2" /> Add Item
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Images & Host</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="heroImage">Hero Image URL</Label>
                  <Input
                    id="heroImage"
                    value={editingVoyage.heroImage || ""}
                    onChange={(e) => setEditingVoyage({ ...editingVoyage, heroImage: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    data-testid="input-voyage-hero-image"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hostName">Host Name</Label>
                    <Input
                      id="hostName"
                      value={editingVoyage.hostName || "Melissa"}
                      onChange={(e) => setEditingVoyage({ ...editingVoyage, hostName: e.target.value })}
                      data-testid="input-voyage-host-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hostImage">Host Image URL</Label>
                    <Input
                      id="hostImage"
                      value={editingVoyage.hostImage || ""}
                      onChange={(e) => setEditingVoyage({ ...editingVoyage, hostImage: e.target.value })}
                      data-testid="input-voyage-host-image"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => { setIsEditing(false); setEditingVoyage(null); }}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={createMutation.isPending || updateMutation.isPending}
                data-testid="button-save-voyage"
              >
                <Save className="w-4 h-4 mr-2" />
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Voyage"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredInvitations = invitations?.filter(inv => 
    invitationFilter === 'all' ? true : inv.status === invitationFilter
  ) || [];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Voyage Management</h1>
              <p className="text-muted-foreground">Create, edit, and track your MetaHers Voyages</p>
            </div>
          </div>
          <Button 
            onClick={() => { setEditingVoyage(emptyVoyage as any); setIsEditing(true); }}
            data-testid="button-create-voyage"
          >
            <Plus className="w-4 h-4 mr-2" /> Create Voyage
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList>
            <TabsTrigger value="voyages">Voyages</TabsTrigger>
            <TabsTrigger value="invitations" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Invitation Requests {filteredInvitations.length > 0 && <Badge variant="destructive">{filteredInvitations.length}</Badge>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="voyages" className="mt-6">

        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                  <Ship className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Voyages</p>
                  <p className="text-2xl font-bold">{stats?.totalVoyages || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                  <p className="text-2xl font-bold">{stats?.upcomingVoyages || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bookings</p>
                  <p className="text-2xl font-bold">{stats?.totalBookings || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900">
                  <DollarSign className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold">{formatPrice(stats?.totalRevenue || 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-pink-100 dark:bg-pink-900">
                  <Clock className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Waitlist</p>
                  <p className="text-2xl font-bold">{stats?.totalWaitlist || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

          <Card>
            <CardHeader>
              <CardTitle>All Voyages</CardTitle>
            </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-16 w-24 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                    <Skeleton className="h-9 w-20" />
                  </div>
                ))}
              </div>
            ) : voyages && voyages.length > 0 ? (
              <div className="space-y-4">
                {voyages.map((voyage) => (
                  <div
                    key={voyage.id}
                    className="flex items-center gap-4 p-4 rounded-lg border hover-elevate"
                    data-testid={`voyage-row-${voyage.id}`}
                  >
                    <div className="w-24 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {voyage.heroImage ? (
                        <img src={voyage.heroImage} alt={voyage.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Ship className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{voyage.title}</h3>
                        <Badge variant={voyage.status === 'upcoming' ? 'default' : voyage.status === 'full' ? 'destructive' : 'secondary'}>
                          {voyage.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <VenueIcon type={voyage.venueType} />
                          {voyage.venueType.replace('_', ' ')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(voyage.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {voyage.location}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="text-muted-foreground">Price</p>
                        <p className="font-semibold">{formatPrice(voyage.price)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Booked</p>
                        <p className="font-semibold">{voyage.currentBookings}/{voyage.maxCapacity}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Waitlist</p>
                        <p className="font-semibold">{voyage.waitlistCount}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/voyages/${voyage.slug}`}>
                        <Button variant="ghost" size="icon" data-testid={`button-view-${voyage.id}`}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => { setEditingVoyage(voyage); setIsEditing(true); }}
                        data-testid={`button-edit-${voyage.id}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setDeleteConfirmId(voyage.id)}
                        data-testid={`button-delete-${voyage.id}`}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Ship className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No voyages yet</h3>
                <p className="text-muted-foreground mb-4">Create your first voyage to get started</p>
                <Button onClick={() => { setEditingVoyage(emptyVoyage as any); setIsEditing(true); }}>
                  <Plus className="w-4 h-4 mr-2" /> Create Voyage
                </Button>
              </div>
            )}
          </CardContent>
          </Card>
          </TabsContent>

          <TabsContent value="invitations" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle>Invitation Requests</CardTitle>
                  <Select value={invitationFilter} onValueChange={(v: any) => setInvitationFilter(v)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Requests</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="declined">Declined</SelectItem>
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent>
                  {invitationsLoading ? (
                    <div className="space-y-4">{[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}</div>
                  ) : filteredInvitations.length > 0 ? (
                    <div className="space-y-4">
                      {filteredInvitations.map((inv) => (
                        <div key={inv.id} className="p-4 border rounded-lg space-y-3" data-testid={`invitation-row-${inv.id}`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-semibold">{inv.userName || inv.userEmail}</p>
                              <p className="text-sm text-muted-foreground">{inv.userEmail}</p>
                              <p className="text-sm font-medium text-blue-600 mt-1">{inv.voyageTitle}</p>
                            </div>
                            <Badge variant={inv.status === 'pending' ? 'outline' : inv.status === 'approved' ? 'default' : 'destructive'}>
                              {inv.status}
                            </Badge>
                          </div>
                          {inv.message && (
                            <div className="text-sm bg-muted p-3 rounded italic">"{inv.message}"</div>
                          )}
                          {inv.adminNotes && (
                            <div className="text-sm border-l-2 border-purple-600 pl-3">
                              <p className="text-xs text-muted-foreground">Admin notes:</p>
                              <p>{inv.adminNotes}</p>
                            </div>
                          )}
                          {inv.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setRespondingToId(inv.id)}
                                data-testid={`button-respond-${inv.id}`}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" /> Review
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">No {invitationFilter !== 'all' ? invitationFilter : ''} invitations</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              Delete Voyage
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this voyage? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteConfirmId && deleteMutation.mutate(deleteConfirmId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!respondingToId} onOpenChange={() => { setRespondingToId(null); setResponseNotes(""); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Respond to Invitation Request</DialogTitle>
            <DialogDescription>Approve or decline this invitation with optional notes</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="notes">Admin Notes (optional)</Label>
              <Textarea
                id="notes"
                value={responseNotes}
                onChange={(e) => setResponseNotes(e.target.value)}
                placeholder="Add any notes for your records..."
                className="min-h-24"
                data-testid="textarea-invitation-notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRespondingToId(null); setResponseNotes(""); }}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => respondingToId && declineInvitationMutation.mutate({ id: respondingToId, adminNotes: responseNotes })}
              disabled={declineInvitationMutation.isPending}
              data-testid="button-decline-invitation"
            >
              <ThumbsDown className="w-4 h-4 mr-2" /> Decline
            </Button>
            <Button
              onClick={() => respondingToId && approveInvitationMutation.mutate({ id: respondingToId, adminNotes: responseNotes })}
              disabled={approveInvitationMutation.isPending}
              data-testid="button-approve-invitation"
            >
              <ThumbsUp className="w-4 h-4 mr-2" /> Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
