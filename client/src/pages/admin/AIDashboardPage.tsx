
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { ArrowLeft, Zap, MessageSquare, Users, AlertCircle, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

const AGENT_LABELS: Record<string, string> = {
  aria: 'ARIA', bella: 'Bella', luna: 'Luna',
  nova: 'Nova', sage: 'Sage', noor: 'Noor',
};

const AGENT_COLORS: Record<string, string> = {
  aria: '#C9A96E', bella: '#D4537E', luna: '#EF9F27',
  nova: '#1D9E75', sage: '#534AB7', noor: '#D85A30',
};

const TIER_LABELS: Record<string, string> = {
  free: 'Inner Circle', signature_monthly: 'Signature',
  private_monthly: 'Private', ai_blueprint: 'Blueprint',
  // Legacy tier aliases
  pro: 'Signature', pro_monthly: 'Signature', pro_annual: 'Signature',
  vip: 'Private', sanctuary: 'Private',
  inner_circle: 'Inner Circle', vip_cohort: 'Private',
  founders_circle: 'Private', executive: 'Private',
};

const TIER_COLORS: Record<string, string> = {
  free: '#888780', signature_monthly: '#C9A96E',
  private_monthly: '#534AB7', ai_blueprint: '#378ADD',
  // Legacy — map to their current equivalents
  pro: '#C9A96E', pro_monthly: '#C9A96E', pro_annual: '#C9A96E',
  vip: '#534AB7', sanctuary: '#534AB7',
  inner_circle: '#888780', vip_cohort: '#534AB7',
  founders_circle: '#534AB7', executive: '#534AB7',
};

function timeAgo(date: string | null): string {
  if (!date) return '—';
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

interface AIStats {
  totals: {
    totalMessages: number;
    totalUsersEverUsed: number;
    messages7d: number;
    activeUsers7d: number;
    messagesToday: number;
    newConversations7d: number;
    usersAtFreeLimit: number;
  };
  agentBreakdown: { agentId: string; totalMessages: number; totalConversations: number; uniqueUsers: number }[];
  dailyVolume: { date: string; messages: number; activeUsers: number }[];
  tierSplit: { tier: string | null; totalMessages: number; userCount: number }[];
  topUsers: { userId: string; email: string | null; firstName: string | null; subscriptionTier: string | null; messageCount: number; lastUsedAt: string | null; lastAgentId: string | null }[];
}

export default function AIDashboardPage() {
  const [, setLocation] = useLocation();

  const { data, isLoading, isError, error, refetch } = useQuery<AIStats>({
    queryKey: ['admin-ai-stats-v2'],
    queryFn: async () => {
      const res = await fetch('/api/admin/ai/stats', { credentials: 'include' });
      if (!res.ok) { const t = await res.text(); throw new Error(`${res.status}: ${t}`); }
      return res.json();
    },
    retry: false,
  });

  const t = data?.totals;

  const statCards = [
    { label: 'Total messages', value: t?.totalMessages ?? '—', sub: `${t?.messages7d ?? 0} this week`, icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Today', value: t?.messagesToday ?? '—', sub: 'messages sent today', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Active members (7d)', value: t?.activeUsers7d ?? '—', sub: `of ${t?.totalUsersEverUsed ?? 0} ever used`, icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'At free limit', value: t?.usersAtFreeLimit ?? '—', sub: 'upgrade opportunity', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation('/admin')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Zap className="h-8 w-8 text-purple-600" />
                AI Team Analytics
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">Concierge usage across all members</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        </div>

        {isError && (
          <div className="p-4 bg-red-50 rounded-lg text-sm">
            <p className="text-red-600 font-medium">Failed to load AI stats</p>
            <p className="text-red-400 font-mono text-xs mt-1">{(error as Error)?.message}</p>
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(s => {
            const Icon = s.icon;
            return (
              <Card key={s.label} className="border-none shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${s.bg}`}>
                      <Icon className={`h-5 w-5 ${s.color}`} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{typeof s.value === 'number' ? s.value.toLocaleString() : s.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Daily volume chart */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Message volume — last 14 days</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-48 bg-gray-50 rounded animate-pulse" />
            ) : (data?.dailyVolume || []).length === 0 ? (
              <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data?.dailyVolume || []}>
                  <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} />
                  <YAxis stroke="#9CA3AF" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Line type="monotone" dataKey="messages" stroke="#8B5CF6" strokeWidth={2.5} dot={false} name="Messages" />
                  <Line type="monotone" dataKey="activeUsers" stroke="#C9A96E" strokeWidth={2} dot={false} name="Active members" strokeDasharray="4 2" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Agent breakdown */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Usage by specialist</CardTitle>
              <CardDescription className="text-xs">Total messages per agent</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-48 bg-gray-50 rounded animate-pulse" />
              ) : (data?.agentBreakdown || []).length === 0 ? (
                <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No data yet</div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={data?.agentBreakdown || []} barSize={32}>
                      <XAxis dataKey="agentId" stroke="#9CA3AF" fontSize={11} tickFormatter={v => AGENT_LABELS[v] || v} />
                      <YAxis stroke="#9CA3AF" fontSize={11} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                        labelFormatter={v => AGENT_LABELS[v as string] || v}
                      />
                      <Bar dataKey="totalMessages" radius={[6, 6, 0, 0]} name="Messages">
                        {(data?.agentBreakdown || []).map((entry, i) => (
                          <Cell key={i} fill={AGENT_COLORS[entry.agentId] || '#8B5CF6'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-3 space-y-1.5">
                    {(data?.agentBreakdown || []).map(a => (
                      <div key={a.agentId} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ background: AGENT_COLORS[a.agentId] || '#8B5CF6' }} />
                          <span className="text-gray-600 font-medium">{AGENT_LABELS[a.agentId] || a.agentId}</span>
                        </div>
                        <div className="flex gap-3 text-gray-400">
                          <span>{a.totalMessages.toLocaleString()} msgs</span>
                          <span>{a.uniqueUsers} users</span>
                          <span>{a.totalConversations} convos</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Tier split */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Usage by membership tier</CardTitle>
              <CardDescription className="text-xs">Where messages are coming from</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-48 bg-gray-50 rounded animate-pulse" />
              ) : (data?.tierSplit || []).length === 0 ? (
                <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No data yet</div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={data?.tierSplit || []} barSize={40}>
                      <XAxis dataKey="tier" stroke="#9CA3AF" fontSize={11} tickFormatter={v => TIER_LABELS[v] || v} />
                      <YAxis stroke="#9CA3AF" fontSize={11} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                        labelFormatter={v => TIER_LABELS[v as string] || v}
                      />
                      <Bar dataKey="totalMessages" radius={[6, 6, 0, 0]} name="Messages">
                        {(data?.tierSplit || []).map((entry, i) => (
                          <Cell key={i} fill={TIER_COLORS[entry.tier || 'free'] || '#888780'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-3 space-y-1.5">
                    {(data?.tierSplit || []).map(t => (
                      <div key={t.tier} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ background: TIER_COLORS[t.tier || 'free'] || '#888780' }} />
                          <span className="text-gray-600 font-medium">{TIER_LABELS[t.tier || 'free'] || t.tier}</span>
                        </div>
                        <div className="flex gap-3 text-gray-400">
                          <span>{t.totalMessages.toLocaleString()} msgs</span>
                          <span>{t.userCount} members</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

        </div>

        {/* Top active members */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Most active members</CardTitle>
            <CardDescription className="text-xs">Ranked by total messages sent</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 text-center text-gray-400 text-sm">Loading...</div>
            ) : (data?.topUsers || []).length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-sm">No usage data yet</div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="py-2.5 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">#</th>
                    <th className="py-2.5 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Member</th>
                    <th className="py-2.5 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Tier</th>
                    <th className="py-2.5 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Messages</th>
                    <th className="py-2.5 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Last agent</th>
                    <th className="py-2.5 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Last active</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.topUsers || []).map((u, i) => {
                    const tierStyle: Record<string, string> = {
                      free: 'bg-gray-100 text-gray-600',
                      signature_monthly: 'bg-amber-50 text-amber-700',
                      private_monthly: 'bg-purple-50 text-purple-700',
                      ai_blueprint: 'bg-blue-50 text-blue-700',
                    };
                    const ts = tierStyle[u.subscriptionTier || 'free'] || tierStyle.free;
                    return (
                      <tr key={u.userId} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-400 font-medium">{i + 1}</td>
                        <td className="py-3 px-4">
                          <div className="text-sm font-medium text-gray-900">{u.firstName || '—'}</div>
                          <div className="text-xs text-gray-400">{u.email}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ts}`}>
                            {TIER_LABELS[u.subscriptionTier || 'free'] || u.subscriptionTier}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm font-semibold text-gray-900">{u.messageCount.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          {u.lastAgentId ? (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                              {AGENT_LABELS[u.lastAgentId] || u.lastAgentId}
                            </span>
                          ) : <span className="text-gray-300 text-xs">—</span>}
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-400">{timeAgo(u.lastUsedAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
