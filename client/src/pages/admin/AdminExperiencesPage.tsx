
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Edit, Copy, Trash2, Plus } from 'lucide-react';

interface Experience {
  id: string;
  title: string;
  spaceId: string;
  difficulty: string;
  estimatedMinutes: number;
  tier: string;
  isPublished: boolean;
  completionsCount?: number;
}

export default function AdminExperiencesPage() {
  const [, setLocation] = useLocation();
  const [spaceFilter, setSpaceFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const { data: experiences = [], isLoading } = useQuery<Experience[]>({
    queryKey: ['admin-experiences', spaceFilter, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (spaceFilter) params.append('spaceId', spaceFilter);
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/admin/experiences?${params}`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch experiences');
      return response.json();
    },
  });

  const { data: spaces = [] } = useQuery({
    queryKey: ['admin-spaces'],
    queryFn: async () => {
      const response = await fetch('/api/admin/spaces', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch spaces');
      return response.json();
    },
  });

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
          <Button onClick={() => setLocation('/admin/experiences/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Create Experience
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Select value={spaceFilter} onValueChange={setSpaceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by space" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Spaces</SelectItem>
                  {spaces.map((space: any) => (
                    <SelectItem key={space.id} value={space.id}>
                      {space.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Space</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading experiences...
                    </TableCell>
                  </TableRow>
                ) : experiences.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No experiences found
                    </TableCell>
                  </TableRow>
                ) : (
                  experiences.map((exp) => (
                    <TableRow key={exp.id}>
                      <TableCell className="font-medium">{exp.title}</TableCell>
                      <TableCell>
                        {spaces.find((s: any) => s.id === exp.spaceId)?.name || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{exp.difficulty}</Badge>
                      </TableCell>
                      <TableCell>{exp.estimatedMinutes} min</TableCell>
                      <TableCell>
                        <Badge variant={exp.tier === 'pro' ? 'default' : 'secondary'}>
                          {exp.tier.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={exp.isPublished ? 'default' : 'outline'}>
                          {exp.isPublished ? 'Published' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setLocation(`/admin/experiences/${exp.id}/edit`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
