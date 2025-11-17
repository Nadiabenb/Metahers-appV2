
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Zap, DollarSign, Clock, TrendingUp, Users, RefreshCw, Database } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart, Cell } from 'recharts';

interface AIStats {
  totalCost: number;
  totalRequests: number;
  totalTokens: number;
  cacheHitRate: number;
  avgLatency: number;
}

interface UsageByType {
  promptType: string;
  totalCost: number;
  requestCount: number;
  avgLatency: number;
}

interface TopSpender {
  userId: string;
  email: string;
  tier: string;
  totalCost: number;
  requestCount: number;
}

const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#6366F1'];

export default function AIDashboardPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: stats, refetch: refetchStats } = useQuery<AIStats>({
    queryKey: ['admin-ai-stats'],
    queryFn: async () => {
      const response = await fetch('/api/admin/ai/stats', { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch AI stats');
      return response.json();
    },
  });

  const { data: usageByType = [] } = useQuery<UsageByType[]>({
    queryKey: ['admin-ai-usage-by-type'],
    queryFn: async () => {
      const response = await fetch('/api/admin/ai/usage-by-type', { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch usage by type');
      return response.json();
    },
  });

  const { data: topSpenders = [] } = useQuery<TopSpender[]>({
    queryKey: ['admin-ai-top-spenders'],
    queryFn: async () => {
      const response = await fetch('/api/admin/ai/top-spenders', { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch top spenders');
      return response.json();
    },
  });

  const handleClearCache = async () => {
    try {
      const response = await fetch('/api/admin/ai/clear-cache', {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to clear cache');
      toast({ title: 'Cache cleared successfully' });
      refetchStats();
    } catch (error) {
      toast({ title: 'Failed to clear cache', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation('/admin')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                <Zap className="h-10 w-10 text-purple-600" />
                AI Usage Analytics
              </h1>
              <p className="text-gray-600 mt-2">Monitor AI costs, performance, and usage patterns</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refetchStats()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleClearCache}>
              <Database className="h-4 w-4 mr-2" />
              Clear Cache
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-green-50">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  This Month
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">Total Cost</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${(stats?.totalCost || 0).toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-50">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">API Requests</p>
                <p className="text-3xl font-bold text-gray-900">
                  {(stats?.totalRequests || 0).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-purple-50">
                  <Database className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">Cache Hit Rate</p>
                <p className="text-3xl font-bold text-gray-900">
                  {(stats?.cacheHitRate || 0).toFixed(1)}%
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-amber-50">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">Avg Latency</p>
                <p className="text-3xl font-bold text-gray-900">
                  {(stats?.avgLatency || 0).toFixed(0)}ms
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage by Type */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Usage by Prompt Type</CardTitle>
              <CardDescription>Requests and cost breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={usageByType}>
                  <XAxis 
                    dataKey="promptType" 
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickFormatter={(value) => value.replace(/_/g, ' ')}
                  />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    formatter={(value: any) => [`$${Number(value).toFixed(4)}`, 'Cost']}
                  />
                  <Bar dataKey="totalCost" radius={[8, 8, 0, 0]}>
                    {usageByType.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Request Volume by Type</CardTitle>
              <CardDescription>Number of API calls per prompt type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={usageByType}>
                  <XAxis 
                    dataKey="promptType" 
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickFormatter={(value) => value.replace(/_/g, ' ')}
                  />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    formatter={(value: any) => [Number(value).toLocaleString(), 'Requests']}
                  />
                  <Bar dataKey="requestCount" fill="#6366F1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Spenders */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Top AI Users
            </CardTitle>
            <CardDescription>Users with highest AI usage this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSpenders.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No usage data available</p>
              ) : (
                topSpenders.map((spender, index) => (
                  <div
                    key={spender.userId}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{spender.email}</div>
                        <div className="text-sm text-gray-500">
                          {spender.requestCount} requests
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-1">
                        {spender.tier.toUpperCase()}
                      </Badge>
                      <div className="text-lg font-bold text-gray-900">
                        ${spender.totalCost.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Performance Insights */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Cost Efficiency</div>
                <div className="text-2xl font-bold text-green-600">
                  {stats && stats.totalRequests > 0
                    ? `$${(stats.totalCost / stats.totalRequests).toFixed(4)}`
                    : '$0.00'}
                </div>
                <div className="text-xs text-gray-500">per request</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Total Tokens</div>
                <div className="text-2xl font-bold text-blue-600">
                  {((stats?.totalTokens || 0) / 1000).toFixed(1)}K
                </div>
                <div className="text-xs text-gray-500">tokens processed</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Cache Savings</div>
                <div className="text-2xl font-bold text-purple-600">
                  {stats ? ((stats.cacheHitRate / 100) * stats.totalCost).toFixed(2) : '0.00'}
                </div>
                <div className="text-xs text-gray-500">estimated saved</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
