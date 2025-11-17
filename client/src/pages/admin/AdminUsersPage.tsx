
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, ArrowLeft, Edit, Trash2, Crown, Plus, Download, Filter, MoreVertical, UserCog, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

interface User {
  id: string;
  email: string;
  fullName: string | null;
  subscriptionTier: string;
  isPro: boolean;
  isAdmin: boolean;
  createdAt: string;
  lastLogin: string | null;
}

export default function AdminUsersPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['admin-users', search, tierFilter, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (tierFilter) params.append('tier', tierFilter);
      if (statusFilter === 'active') params.append('active', 'true');

      const response = await fetch(`/api/admin/users?${params}`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: any }) => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({ title: 'User updated successfully' });
      setEditDialogOpen(false);
    },
    onError: () => {
      toast({ title: 'Failed to update user', variant: 'destructive' });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({ title: 'User deleted successfully' });
      setDeleteDialogOpen(false);
    },
    onError: () => {
      toast({ title: 'Failed to delete user', variant: 'destructive' });
    },
  });

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleUpdateUser = () => {
    if (!selectedUser) return;
    updateUserMutation.mutate({
      userId: selectedUser.id,
      data: {
        subscriptionTier: selectedUser.subscriptionTier,
        isPro: selectedUser.subscriptionTier !== 'free',
        isAdmin: selectedUser.isAdmin,
      },
    });
  };

  const getTierBadge = (tier: string) => {
    const variants: Record<string, any> = {
      free: { variant: 'outline', color: 'text-gray-600' },
      pro: { variant: 'secondary', color: 'text-purple-600' },
      vip: { variant: 'default', color: 'text-amber-600' },
      sanctuary: { variant: 'default', color: 'text-blue-600' },
      inner_circle: { variant: 'default', color: 'text-indigo-600' },
      founders_circle: { variant: 'default', color: 'text-pink-600' },
    };
    return variants[tier] || variants.free;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation('/admin')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <UserCog className="h-8 w-8 text-purple-600" />
                User Management
              </h1>
              <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Invite User
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="text-sm text-gray-600">Total Users</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{users.length}</div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="text-sm text-gray-600">Pro Members</div>
              <div className="text-2xl font-bold text-purple-600 mt-1">
                {users.filter(u => u.subscriptionTier !== 'free').length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="text-sm text-gray-600">Active Today</div>
              <div className="text-2xl font-bold text-green-600 mt-1">
                {users.filter(u => u.lastLogin).length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="text-sm text-gray-600">Admins</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">
                {users.filter(u => u.isAdmin).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by email or name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Tiers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Tiers</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="sanctuary">Sanctuary</SelectItem>
                  <SelectItem value="inner_circle">Inner Circle</SelectItem>
                  <SelectItem value="founders_circle">Founders Circle</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-none shadow-lg">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">User</TableHead>
                  <TableHead className="font-semibold">Tier</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Joined</TableHead>
                  <TableHead className="font-semibold">Last Login</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => {
                    const tierBadge = getTierBadge(user.subscriptionTier);
                    return (
                      <TableRow key={user.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                              {user.email[0].toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium">{user.fullName || 'N/A'}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={tierBadge.variant} className={tierBadge.color}>
                            {user.subscriptionTier.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {user.isAdmin && (
                              <Shield className="h-4 w-4 text-amber-500" />
                            )}
                            <Badge variant={user.lastLogin ? 'default' : 'outline'}>
                              {user.lastLogin ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {user.lastLogin
                            ? new Date(user.lastLogin).toLocaleDateString()
                            : 'Never'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user subscription and permissions
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={selectedUser.email} disabled />
              </div>
              <div className="space-y-2">
                <Label>Subscription Tier</Label>
                <Select
                  value={selectedUser.subscriptionTier}
                  onValueChange={(value) =>
                    setSelectedUser({ ...selectedUser, subscriptionTier: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="sanctuary">Sanctuary</SelectItem>
                    <SelectItem value="inner_circle">Inner Circle</SelectItem>
                    <SelectItem value="founders_circle">Founders Circle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isAdmin"
                  checked={selectedUser.isAdmin}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, isAdmin: e.target.checked })
                  }
                  className="rounded"
                />
                <Label htmlFor="isAdmin">Admin Access</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedUser && deleteUserMutation.mutate(selectedUser.id)}
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
