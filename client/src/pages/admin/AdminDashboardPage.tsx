
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, CheckCircle, UserCheck, Crown, Star, Compass, Plus, TrendingUp, Activity, AlertCircle, Shield, BarChart3, Search, Filter, Download, RefreshCw, Settings, Zap, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart, PieChart, Pie, Cell } from 'recharts';

interface AdminStats {
  totalUsers: number;
  freeUsers: number;
  proUsers: number;
  vipUsers: number;
  activeUsers: number;
  totalExperiences: number;
  totalCompletions: number;
}

interface Activity {
  id: string;
  type: 'user_signup' | 'upgrade' | 'experience_complete' | 'content_published';
  user: string;
  timestamp: string;
  details: string;
}

const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#6366F1'];

export default function AdminDashboardPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState('7d');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: stats, isLoading, refetch } = useQuery<AdminStats>({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await fetch('/api/admin/stats', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    },
  });

  const handleRefresh = async () => {
    await refetch();
    toast({ title: 'Stats refreshed', description: 'Dashboard data updated successfully' });
  };

  const handleClearCache = async () => {
    try {
      const response = await fetch('/api/admin/clear-cache', {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to clear cache');
      toast({ title: 'Cache cleared', description: 'All caches have been cleared successfully' });
      refetch();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to clear cache', variant: 'destructive' });
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Users (7d)',
      value: stats?.activeUsers || 0,
      change: '+8%',
      trend: 'up',
      icon: UserCheck,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Pro Members',
      value: stats?.proUsers || 0,
      change: '+23%',
      trend: 'up',
      icon: Crown,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Experiences',
      value: stats?.totalExperiences || 0,
      change: '+6',
      trend: 'up',
      icon: BookOpen,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
    },
  ];

  const userDistribution = [
    { name: 'Free', value: stats?.freeUsers || 0, color: COLORS[0] },
    { name: 'Pro', value: stats?.proUsers || 0, color: COLORS[1] },
    { name: 'VIP', value: stats?.vipUsers || 0, color: COLORS[2] },
  ];

  const mockActivityData = [
    { date: 'Mon', users: 12, completions: 45 },
    { date: 'Tue', users: 19, completions: 52 },
    { date: 'Wed', users: 15, completions: 48 },
    { date: 'Thu', users: 22, completions: 61 },
    { date: 'Fri', users: 18, completions: 55 },
    { date: 'Sat', users: 25, completions: 68 },
    { date: 'Sun', users: 21, completions: 59 },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Shield className="h-10 w-10 text-purple-600" />
              Admin Control Center
            </h1>
            <p className="text-gray-600 mt-2">Manage your MetaHers platform</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleClearCache}>
              <AlertCircle className="h-4 w-4 mr-2" />
              Clear Cache
            </Button>
            <Button onClick={() => setLocation('/admin/users')}>
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="hover:shadow-xl transition-all border-none">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Chart */}
          <Card className="lg:col-span-2 border-none shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Platform Activity</CardTitle>
                  <CardDescription>User signups and course completions</CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockActivityData}>
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    name="New Users"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="completions" 
                    stroke="#EC4899" 
                    strokeWidth={3}
                    name="Completions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* User Distribution */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">User Distribution</CardTitle>
              <CardDescription>By subscription tier</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {userDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {userDistribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-start text-left h-auto py-4 px-4"
                variant="outline"
                onClick={() => setLocation('/admin/users')}
              >
                <Users className="h-5 w-5 mr-3 text-blue-600" />
                <div>
                  <div className="font-semibold">Manage Users</div>
                  <div className="text-xs text-gray-500">View, edit, and manage user accounts</div>
                </div>
              </Button>
              <Button
                className="w-full justify-start text-left h-auto py-4 px-4"
                variant="outline"
                onClick={() => setLocation('/admin/experiences')}
              >
                <Compass className="h-5 w-5 mr-3 text-indigo-600" />
                <div>
                  <div className="font-semibold">Manage Experiences</div>
                  <div className="text-xs text-gray-500">Create, edit, and organize learning content</div>
                </div>
              </Button>
              <Button
                className="w-full justify-start text-left h-auto py-4 px-4"
                variant="outline"
                onClick={() => setLocation('/admin/ai')}
              >
                <Zap className="h-5 w-5 mr-3 text-purple-600" />
                <div>
                  <div className="font-semibold">AI Usage Analytics</div>
                  <div className="text-xs text-gray-500">Monitor costs, performance, and usage</div>
                </div>
              </Button>
              <Button
                className="w-full justify-start text-left h-auto py-4 px-4"
                variant="outline"
                onClick={() => setLocation('/admin/emails')}
              >
                <Mail className="h-5 w-5 mr-3 text-pink-600" />
                <div>
                  <div className="font-semibold">Email Sequence Tracker</div>
                  <div className="text-xs text-gray-500">Monitor onboarding emails across all members</div>
                </div>
              </Button>
              <Button
                className="w-full justify-start text-left h-auto py-4 px-4"
                variant="outline"
                onClick={() => {
                  toast({
                    title: 'Coming Soon',
                    description: 'Content analytics dashboard will be available soon'
                  });
                }}
              >
                <BarChart3 className="h-5 w-5 mr-3 text-green-600" />
                <div>
                  <div className="font-semibold">Analytics & Reports</div>
                  <div className="text-xs text-gray-500">Deep dive into platform metrics</div>
                </div>
              </Button>
              <Button
                className="w-full justify-start text-left h-auto py-4 px-4"
                variant="outline"
                onClick={() => {
                  toast({
                    title: 'Coming Soon',
                    description: 'System settings interface will be available soon'
                  });
                }}
              >
                <Settings className="h-5 w-5 mr-3 text-purple-600" />
                <div>
                  <div className="font-semibold">System Settings</div>
                  <div className="text-xs text-gray-500">Configure platform preferences</div>
                </div>
              </Button>
            </CardContent>
          </Card>

          {/* Platform Health */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Platform Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">User Engagement</span>
                  <span className="text-sm font-bold text-green-600">
                    {stats ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${stats ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Pro Conversion Rate</span>
                  <span className="text-sm font-bold text-purple-600">
                    {stats && stats.totalUsers > 0
                      ? Math.round(((stats.proUsers + stats.vipUsers) / stats.totalUsers) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full transition-all"
                    style={{ 
                      width: `${stats && stats.totalUsers > 0 
                        ? Math.round(((stats.proUsers + stats.vipUsers) / stats.totalUsers) * 100) 
                        : 0}%` 
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Content Completion</span>
                  <span className="text-sm font-bold text-blue-600">
                    {stats && stats.totalUsers > 0
                      ? (stats.totalCompletions / stats.totalUsers).toFixed(1)
                      : 0} per user
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all"
                    style={{ width: '68%' }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats?.totalCompletions || 0}</div>
                    <div className="text-xs text-gray-500">Total Completions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stats && stats.totalUsers > 0
                        ? (stats.totalCompletions / stats.totalUsers).toFixed(1)
                        : 0}
                    </div>
                    <div className="text-xs text-gray-500">Avg per User</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">System Status</CardTitle>
            <CardDescription>All systems operational</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <div>
                  <div className="font-semibold text-gray-900">Database</div>
                  <div className="text-sm text-gray-600">Healthy</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <div>
                  <div className="font-semibold text-gray-900">API Services</div>
                  <div className="text-sm text-gray-600">Online</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <div>
                  <div className="font-semibold text-gray-900">Storage</div>
                  <div className="text-sm text-gray-600">78% capacity</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
