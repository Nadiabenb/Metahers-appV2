
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, CheckCircle, UserCheck, Crown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

interface AdminStats {
  totalUsers: number;
  freeUsers: number;
  proUsers: number;
  vipUsers: number;
  activeUsers: number;
  totalExperiences: number;
  totalCompletions: number;
}

export default function AdminDashboardPage() {
  const [, setLocation] = useLocation();

  const { data: stats, isLoading } = useQuery<AdminStats>({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await fetch('/api/admin/stats', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    },
  });

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Users (7d)',
      value: stats?.activeUsers || 0,
      icon: UserCheck,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Free Tier',
      value: stats?.freeUsers || 0,
      icon: Star,
      color: 'text-gray-500',
      bgColor: 'bg-gray-50',
    },
    {
      title: 'Pro Tier',
      value: stats?.proUsers || 0,
      icon: Crown,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'VIP Tier',
      value: stats?.vipUsers || 0,
      icon: Crown,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Experiences',
      value: stats?.totalExperiences || 0,
      icon: BookOpen,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Total Completions',
      value: stats?.totalCompletions || 0,
      icon: CheckCircle,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(7)].map((_, i) => (
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
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Button onClick={() => setLocation('/admin/users')}>
              Manage Users
            </Button>
            <Button onClick={() => setLocation('/admin/experiences')} variant="outline">
              Manage Experiences
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {stat.value.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => setLocation('/admin/experiences?action=create')}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Create New Experience
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => setLocation('/admin/spaces?action=create')}
              >
                <Star className="mr-2 h-4 w-4" />
                Create New Space
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => setLocation('/admin/users?filter=recent')}
              >
                <Users className="mr-2 h-4 w-4" />
                View Recent Signups
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => setLocation('/admin/audit-logs')}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                View Audit Logs
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">User Engagement</span>
                <span className="text-sm font-semibold text-green-600">
                  {stats ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Completions/User</span>
                <span className="text-sm font-semibold text-blue-600">
                  {stats && stats.totalUsers > 0 
                    ? (stats.totalCompletions / stats.totalUsers).toFixed(1) 
                    : 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pro Conversion</span>
                <span className="text-sm font-semibold text-purple-600">
                  {stats && stats.totalUsers > 0
                    ? Math.round(((stats.proUsers + stats.vipUsers) / stats.totalUsers) * 100)
                    : 0}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
