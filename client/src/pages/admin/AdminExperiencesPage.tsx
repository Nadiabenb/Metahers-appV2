
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { ArrowLeft, Plus, Edit, Trash2, Copy, Search, Filter, Crown } from 'lucide-react';

interface Experience {
  id: string;
  spaceId: string;
  title: string;
  slug: string;
  description: string;
  tier: string;
  estimatedMinutes: number;
  sortOrder: number;
  isActive: boolean;
  learningObjectives: string[];
  content: {
    sections: Array<{
      id: string;
      title: string;
      type: string;
      content: string;
    }>;
  };
}

interface Space {
  id: string;
  name: string;
  slug: string;
}

export default function AdminExperiencesPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [spaceFilter, setSpaceFilter] = useState<string>('');
  const [tierFilter, setTierFilter] = useState<string>('');
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch spaces
  const { data: spaces = [] } = useQuery<Space[]>({
    queryKey: ['admin-spaces'],
    queryFn: async () => {
      const response = await fetch('/api/admin/spaces', { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch spaces');
      return response.json();
    },
  });

  // Fetch experiences
  const { data: experiences = [], isLoading } = useQuery<Experience[]>({
    queryKey: ['admin-experiences', spaceFilter, tierFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (spaceFilter) params.append('spaceId', spaceFilter);
      if (tierFilter) params.append('tier', tierFilter);

      const response = await fetch(`/api/admin/experiences?${params}`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch experiences');
      return response.json();
    },
  });

  // Create experience mutation
  const createExperienceMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/admin/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create experience');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experiences'] });
      toast({ title: 'Success', description: 'Experience created successfully' });
      setEditDialogOpen(false);
      setSelectedExperience(null);
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create experience', variant: 'destructive' });
    },
  });

  // Update experience mutation
  const updateExperienceMutation = useMutation({
    mutationFn: async ({ experienceId, data }: { experienceId: string; data: any }) => {
      const response = await fetch(`/api/admin/experiences/${experienceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update experience');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experiences'] });
      toast({ title: 'Success', description: 'Experience updated successfully' });
      setEditDialogOpen(false);
      setSelectedExperience(null);
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update experience', variant: 'destructive' });
    },
  });

  // Delete experience mutation
  const deleteExperienceMutation = useMutation({
    mutationFn: async (experienceId: string) => {
      const response = await fetch(`/api/admin/experiences/${experienceId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete experience');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experiences'] });
      toast({ title: 'Success', description: 'Experience deleted successfully' });
      setDeleteDialogOpen(false);
      setSelectedExperience(null);
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete experience', variant: 'destructive' });
    },
  });

  // Duplicate experience mutation
  const duplicateExperienceMutation = useMutation({
    mutationFn: async (experienceId: string) => {
      const response = await fetch(`/api/admin/experiences/${experienceId}/duplicate`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to duplicate experience');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experiences'] });
      toast({ title: 'Success', description: 'Experience duplicated successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to duplicate experience', variant: 'destructive' });
    },
  });

  // Filter experiences by search
  const filteredExperiences = experiences.filter(exp =>
    exp.title.toLowerCase().includes(search.toLowerCase()) ||
    exp.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (experience: Experience) => {
    setSelectedExperience(experience);
    setEditDialogOpen(true);
  };

  const handleDelete = (experience: Experience) => {
    setSelectedExperience(experience);
    setDeleteDialogOpen(true);
  };

  const handleDuplicate = (experienceId: string) => {
    duplicateExperienceMutation.mutate(experienceId);
  };

  const handleUpdate = () => {
    if (!selectedExperience) return;
    
    const data = {
      id: selectedExperience.id || crypto.randomUUID(),
      spaceId: selectedExperience.spaceId,
      title: selectedExperience.title,
      slug: selectedExperience.slug || selectedExperience.title.toLowerCase().replace(/\s+/g, '-'),
      description: selectedExperience.description,
      tier: selectedExperience.tier,
      estimatedMinutes: selectedExperience.estimatedMinutes,
      sortOrder: selectedExperience.sortOrder,
      isActive: selectedExperience.isActive,
      learningObjectives: selectedExperience.learningObjectives || [],
      content: selectedExperience.content || { sections: [] },
      personalizationEnabled: false,
    };

    if (selectedExperience.id) {
      updateExperienceMutation.mutate({
        experienceId: selectedExperience.id,
        data,
      });
    } else {
      createExperienceMutation.mutate(data);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="grid gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation('/admin')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">Experience Management</h1>
          </div>
          <Button onClick={() => {
            setSelectedExperience({
              id: '',
              spaceId: spaces[0]?.id || '',
              title: '',
              slug: '',
              description: '',
              tier: 'free',
              estimatedMinutes: 30,
              sortOrder: experiences.length + 1,
              isActive: true,
              learningObjectives: [],
              content: { sections: [] }
            } as Experience);
            setEditDialogOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            New Experience
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search experiences..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="space">Space</Label>
                <Select value={spaceFilter} onValueChange={setSpaceFilter}>
                  <SelectTrigger id="space">
                    <SelectValue placeholder="All spaces" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All spaces</SelectItem>
                    {spaces.map((space) => (
                      <SelectItem key={space.id} value={space.id}>
                        {space.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tier">Tier</Label>
                <Select value={tierFilter} onValueChange={setTierFilter}>
                  <SelectTrigger id="tier">
                    <SelectValue placeholder="All tiers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All tiers</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Experiences List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredExperiences.length} of {experiences.length} experiences
            </p>
          </div>

          {filteredExperiences.map((experience) => (
            <Card key={experience.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle>{experience.title}</CardTitle>
                      {experience.tier === 'pro' && (
                        <Badge variant="secondary" className="gap-1">
                          <Crown className="h-3 w-3" />
                          PRO
                        </Badge>
                      )}
                      {!experience.isActive && (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                    </div>
                    <CardDescription>{experience.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(experience)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDuplicate(experience.id)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(experience)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Space</p>
                    <p className="font-medium">
                      {spaces.find(s => s.id === experience.spaceId)?.name || 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Duration</p>
                    <p className="font-medium">{experience.estimatedMinutes} minutes</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Sections</p>
                    <p className="font-medium">{experience.content.sections.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Experience</DialogTitle>
              <DialogDescription>
                Update the experience details
              </DialogDescription>
            </DialogHeader>

            {selectedExperience && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="space">Space</Label>
                  <Select
                    value={selectedExperience.spaceId}
                    onValueChange={(value) =>
                      setSelectedExperience({ ...selectedExperience, spaceId: value })
                    }
                  >
                    <SelectTrigger id="space">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {spaces.map((space) => (
                        <SelectItem key={space.id} value={space.id}>
                          {space.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={selectedExperience.title}
                    onChange={(e) =>
                      setSelectedExperience({ ...selectedExperience, title: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={selectedExperience.description}
                    onChange={(e) =>
                      setSelectedExperience({ ...selectedExperience, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tier">Tier</Label>
                    <Select
                      value={selectedExperience.tier}
                      onValueChange={(value) =>
                        setSelectedExperience({ ...selectedExperience, tier: value })
                      }
                    >
                      <SelectTrigger id="tier">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="pro">Pro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={selectedExperience.estimatedMinutes}
                      onChange={(e) =>
                        setSelectedExperience({
                          ...selectedExperience,
                          estimatedMinutes: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={selectedExperience.isActive}
                    onChange={(e) =>
                      setSelectedExperience({
                        ...selectedExperience,
                        isActive: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Experience</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedExperience?.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => selectedExperience && deleteExperienceMutation.mutate(selectedExperience.id)}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
