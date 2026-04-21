
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Search, RefreshCw, X, Mail, Trash2, ChevronRight } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────
interface MemberRow {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  subscriptionTier: string;
  createdAt: string;
  persona: string | null;
  quizRole: string | null;
  quizGoal: string | null;
  quizExperienceLevel: string | null;
  quizPainPoint: string | null;
  quizCompletedAt: string | null;
  agentMessages: number;
  lastAgentUsed: string | null;
  lastAgentId: string | null;
  emailsSent: number;
  emailsTotal: number;
  journalEntries: number;
  notesCount: number;
  memberStatus: 'active' | 'at_risk' | 'silent' | 'converted';
  lastActive: string | null;
}

interface MemberDetail {
  user: any;
  quiz: any;
  agent: any;
  conversations: any[];
  emails: any[];
  experiences: any[];
  rituals: any[];
  journal: any;
  notes: any[];
}

// ── Constants ───────────────────────────────────────────────────────────
const TIER_STYLES: Record<string, { label: string; cls: string }> = {
  free:              { label: 'Inner Circle', cls: 'bg-gray-100 text-gray-600' },
  signature_monthly: { label: 'Signature',    cls: 'bg-amber-50 text-amber-700' },
  private_monthly:   { label: 'Private',      cls: 'bg-purple-50 text-purple-700' },
  ai_blueprint:      { label: 'Blueprint',    cls: 'bg-blue-50 text-blue-700' },
  // Legacy aliases
  pro:               { label: 'Signature',    cls: 'bg-amber-50 text-amber-700' },
  pro_monthly:       { label: 'Signature',    cls: 'bg-amber-50 text-amber-700' },
  pro_annual:        { label: 'Signature',    cls: 'bg-amber-50 text-amber-700' },
  vip:               { label: 'Private',      cls: 'bg-purple-50 text-purple-700' },
  sanctuary:         { label: 'Private',      cls: 'bg-purple-50 text-purple-700' },
  inner_circle:      { label: 'Inner Circle', cls: 'bg-gray-100 text-gray-600' },
  vip_cohort:        { label: 'Private',      cls: 'bg-purple-50 text-purple-700' },
  founders_circle:   { label: 'Private',      cls: 'bg-purple-50 text-purple-700' },
  executive:         { label: 'Private',      cls: 'bg-purple-50 text-purple-700' },
};

const STATUS_STYLES: Record<string, { label: string; cls: string }> = {
  active:    { label: 'Active',    cls: 'bg-green-50 text-green-700' },
  at_risk:   { label: 'At Risk',   cls: 'bg-amber-50 text-amber-700' },
  silent:    { label: 'Silent',    cls: 'bg-gray-100 text-gray-500' },
  converted: { label: 'Converted', cls: 'bg-purple-50 text-purple-700' },
};

const PERSONA_STYLES: Record<string, string> = {
  builder:  'bg-blue-50 text-blue-700',
  creative: 'bg-pink-50 text-pink-700',
  mom:      'bg-rose-50 text-rose-700',
};

const GOAL_LABELS: Record<string, string> = {
  learn_ai: 'Learn AI', build_ai: 'Build with AI',
  monetize_ai: 'Monetize with AI', brand_ai: 'Brand with AI',
};
const PAIN_LABELS: Record<string, string> = {
  overwhelmed: 'Overwhelmed', tech_scared: 'Tech anxiety',
  no_time: 'No time', imposter_syndrome: 'Imposter syndrome',
};
const LEVEL_LABELS: Record<string, string> = {
  beginner: 'Beginner', intermediate: 'Some experience',
  comfortable: 'Comfortable', advanced: 'Advanced',
};
const EMAIL_LABELS: Record<string, string> = {
  day_1: 'Welcome', day_2: 'First win', day_3: 'Meet the team',
  day_5: 'Engage', day_8: 'Social proof', day_10: 'Convert', day_14: 'Personal note',
};
const AGENT_LABELS: Record<string, string> = {
  aria: 'ARIA', bella: 'Bella', luna: 'Luna',
  nova: 'Nova', sage: 'Sage', noor: 'Noor',
};

// ── Helper ──────────────────────────────────────────────────────────────
function timeAgo(date: string | null): string {
  if (!date) return '—';
  const d = new Date(date);
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return d.toLocaleDateString();
}

// ── Member Detail Drawer ────────────────────────────────────────────────
function MemberDrawer({ userId, onClose }: { userId: string; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [newNote, setNewNote] = useState('');
  const [tierEdit, setTierEdit] = useState('');

  const { data, isLoading } = useQuery<MemberDetail>({
    queryKey: ['member-detail', userId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/users/${userId}/detail`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load');
      return res.json();
    },
    retry: false,
  });

  const addNoteMutation = useMutation({
    mutationFn: async (note: string) => {
      const res = await fetch(`/api/admin/users/${userId}/notes`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note }),
      });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member-detail', userId] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setNewNote('');
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      await fetch(`/api/admin/users/${userId}/notes/${noteId}`, {
        method: 'DELETE', credentials: 'include',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member-detail', userId] });
    },
  });

  const updateTierMutation = useMutation({
    mutationFn: async (tier: string) => {
      const res = await fetch(`/api/admin/users/${userId}/tier`, {
        method: 'PATCH', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionTier: tier }),
      });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member-detail', userId] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setTierEdit('');
    },
  });

  const user = data?.user;
  const tier = user?.subscriptionTier || 'free';
  const tierStyle = TIER_STYLES[tier] || TIER_STYLES.free;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="w-full max-w-lg bg-white shadow-2xl overflow-y-auto h-full" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            {isLoading ? <div className="h-5 w-40 bg-gray-100 rounded animate-pulse" /> : (
              <p className="font-semibold text-gray-900">{user?.firstName || ''} {user?.lastName || ''}</p>
            )}
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-50 rounded animate-pulse" />)}
          </div>
        ) : !data ? (
          <div className="p-6 text-center text-gray-400 text-sm">Failed to load member data</div>
        ) : (
          <div className="p-6 space-y-6">

            {/* Profile */}
            <section>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Profile</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Tier</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tierStyle.cls}`}>{tierStyle.label}</span>
                  </div>
                  <Select value={tierEdit || tier} onValueChange={v => { setTierEdit(v); updateTierMutation.mutate(v); }}>
                    <SelectTrigger className="h-6 text-xs mt-2 w-full border-0 bg-transparent p-0 text-gray-400">
                      <SelectValue placeholder="Change tier..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Inner Circle</SelectItem>
                      <SelectItem value="signature_monthly">Signature</SelectItem>
                      <SelectItem value="private_monthly">Private</SelectItem>
                      <SelectItem value="ai_blueprint">Blueprint</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Joined</p>
                  <p className="font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</p>
                  <p className="text-xs text-gray-400">{timeAgo(user?.createdAt)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Agent messages</p>
                  <p className="font-medium text-lg">{data.agent?.messageCount || 0}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Journal entries</p>
                  <p className="font-medium text-lg">{data.journal?.count || 0}</p>
                  {data.journal?.streak > 0 && <p className="text-xs text-amber-600">{data.journal.streak} day streak</p>}
                </div>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(user?.email || '')}
                className="mt-2 text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
              >
                <Mail className="w-3 h-3" /> Copy email
              </button>
            </section>

            {/* Quiz */}
            <section>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Quiz answers</p>
              {!data.quiz ? (
                <p className="text-sm text-gray-400 italic">Quiz not completed</p>
              ) : (
                <div className="space-y-2 text-sm">
                  {[
                    { label: 'Goal', value: GOAL_LABELS[data.quiz.goal] || data.quiz.goal },
                    { label: 'Role', value: data.quiz.role },
                    { label: 'Experience', value: LEVEL_LABELS[data.quiz.experienceLevel] || data.quiz.experienceLevel },
                    { label: 'Pain point', value: PAIN_LABELS[data.quiz.painPoint] || data.quiz.painPoint },
                    { label: 'Learning style', value: data.quiz.learningStyle },
                    { label: 'Time available', value: data.quiz.timeAvailability },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between py-1.5 border-b border-gray-50">
                      <span className="text-gray-400">{row.label}</span>
                      <span className="font-medium capitalize">{row.value || '—'}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Agent conversations */}
            <section>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                Agent activity <span className="text-gray-300 font-normal normal-case">({data.conversations.length} conversations)</span>
              </p>
              {data.conversations.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No conversations yet</p>
              ) : (
                <div className="space-y-2">
                  {data.conversations.slice(0, 8).map((c: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-50">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                          {AGENT_LABELS[c.agentId] || c.agentId}
                        </span>
                        <span className="text-gray-500 text-xs truncate max-w-32">{c.title}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-400 text-xs">{c.messageCount} msgs</span>
                        <span className="text-gray-300 text-xs ml-2">{timeAgo(c.lastMessageAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Email sequence */}
            <section>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Email sequence</p>
              {data.emails.length === 0 ? (
                <p className="text-sm text-gray-400 italic">Not in sequence</p>
              ) : (
                <div className="space-y-1.5">
                  {['day_1','day_2','day_3','day_5','day_8','day_10','day_14'].map(key => {
                    const email = data.emails.find((e: any) => e.emailKey === key);
                    const sent = email?.sentAt;
                    const skipped = email?.persona === 'upgraded';
                    return (
                      <div key={key} className="flex items-center justify-between text-sm py-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${sent ? 'bg-green-400' : skipped ? 'bg-gray-200' : 'bg-amber-300'}`} />
                          <span className="text-gray-600">{EMAIL_LABELS[key]}</span>
                          {email?.variant && <span className="text-xs text-purple-400">{email.variant}</span>}
                        </div>
                        <span className="text-xs text-gray-400">
                          {sent ? `Sent ${timeAgo(sent)}` : skipped ? 'Skipped' : email ? `Due ${new Date(email.scheduledFor).toLocaleDateString()}` : '—'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Learning */}
            <section>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                Learning <span className="text-gray-300 font-normal normal-case">({data.experiences.length} experiences, {data.rituals.length} rituals)</span>
              </p>
              {data.experiences.length === 0 && data.rituals.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No learning activity</p>
              ) : (
                <div className="space-y-1.5 text-sm">
                  {data.experiences.slice(0, 5).map((e: any, i: number) => (
                    <div key={i} className="flex items-center justify-between py-1 border-b border-gray-50">
                      <span className="text-gray-600">{e.experienceId}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${e.completedAt ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                        {e.completedAt ? 'Completed' : `${(e.completedSections || []).length} sections`}
                      </span>
                    </div>
                  ))}
                  {data.rituals.length > 0 && (
                    <p className="text-xs text-gray-400 pt-1">{data.rituals.length} ritual{data.rituals.length !== 1 ? 's' : ''} started</p>
                  )}
                </div>
              )}
            </section>

            {/* Notes */}
            <section>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Admin notes</p>
              <div className="space-y-2 mb-3">
                {data.notes.length === 0 && (
                  <p className="text-sm text-gray-400 italic">No notes yet</p>
                )}
                {data.notes.map((n: any) => (
                  <div key={n.id} className="bg-gray-50 rounded-lg p-3 text-sm relative group">
                    <p className="text-gray-700 pr-6">{n.note}</p>
                    <p className="text-xs text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
                    <button
                      onClick={() => deleteNoteMutation.mutate(n.id)}
                      className="absolute top-2 right-2 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Textarea
                  placeholder="Add a note..."
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  className="text-sm resize-none h-16"
                />
                <Button
                  size="sm"
                  onClick={() => newNote.trim() && addNoteMutation.mutate(newNote)}
                  disabled={!newNote.trim() || addNoteMutation.isPending}
                  className="shrink-0"
                >
                  Save
                </Button>
              </div>
            </section>

          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────
export default function AdminUsersPage() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [personaFilter, setPersonaFilter] = useState('all');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { data: users = [], isLoading, isError, error, refetch } = useQuery<MemberRow[]>({
    queryKey: ['admin-users', search, tierFilter, statusFilter, personaFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (tierFilter !== 'all') params.append('tier', tierFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (personaFilter !== 'all') params.append('persona', personaFilter);
      const res = await fetch(`/api/admin/users?${params}`, { credentials: 'include' });
      if (!res.ok) { const t = await res.text(); throw new Error(`${res.status}: ${t}`); }
      return res.json();
    },
    retry: false,
  });

  const counts = {
    all: users.length,
    active: users.filter(u => u.memberStatus === 'active').length,
    at_risk: users.filter(u => u.memberStatus === 'at_risk').length,
    silent: users.filter(u => u.memberStatus === 'silent').length,
    converted: users.filter(u => u.memberStatus === 'converted').length,
  };

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
              <h1 className="text-3xl font-bold text-gray-900">Members</h1>
              <p className="text-gray-500 text-sm mt-0.5">{users.length} member{users.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        </div>

        {/* Status filter pills */}
        <div className="flex gap-2 flex-wrap">
          {(['all', 'active', 'at_risk', 'silent', 'converted'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                statusFilter === s
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {s === 'all' ? 'All' : s === 'at_risk' ? 'At Risk' : s.charAt(0).toUpperCase() + s.slice(1)}
              <span className="ml-1.5 opacity-60">{counts[s]}</span>
            </button>
          ))}
        </div>

        {/* Search + filters */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search name or email..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
              </div>
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Tier" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All tiers</SelectItem>
                  <SelectItem value="free">Inner Circle</SelectItem>
                  <SelectItem value="signature_monthly">Signature</SelectItem>
                  <SelectItem value="private_monthly">Private</SelectItem>
                  <SelectItem value="ai_blueprint">Blueprint</SelectItem>
                </SelectContent>
              </Select>
              <Select value={personaFilter} onValueChange={setPersonaFilter}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Persona" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All personas</SelectItem>
                  <SelectItem value="builder">Builder</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="mom">Mom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-gray-400 text-sm">Loading members...</div>
            ) : isError ? (
              <div className="p-8 text-center">
                <p className="text-red-500 text-sm font-medium mb-1">Failed to load members</p>
                <p className="text-gray-400 text-xs font-mono">{(error as Error)?.message}</p>
              </div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No members found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Member</th>
                      <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Tier</th>
                      <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Persona</th>
                      <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                      <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Agent msgs</th>
                      <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Emails</th>
                      <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Last active</th>
                      <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Joined</th>
                      <th className="py-3 px-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => {
                      const tier = TIER_STYLES[user.subscriptionTier] || TIER_STYLES.free;
                      const status = STATUS_STYLES[user.memberStatus] || STATUS_STYLES.silent;
                      return (
                        <tr
                          key={user.id}
                          className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedUserId(user.id)}
                        >
                          <td className="py-3 px-4">
                            <div className="font-medium text-sm text-gray-900">
                              {user.firstName || ''} {user.lastName || ''}
                              {!user.firstName && !user.lastName && <span className="text-gray-400 italic">No name</span>}
                            </div>
                            <div className="text-xs text-gray-400">{user.email}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tier.cls}`}>{tier.label}</span>
                          </td>
                          <td className="py-3 px-4">
                            {user.persona ? (
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${PERSONA_STYLES[user.persona] || 'bg-gray-100 text-gray-500'}`}>
                                {user.persona}
                              </span>
                            ) : <span className="text-xs text-gray-300">—</span>}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.cls}`}>{status.label}</span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {user.agentMessages > 0 ? user.agentMessages : <span className="text-gray-300">0</span>}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {user.emailsTotal > 0 ? `${user.emailsSent}/${user.emailsTotal}` : <span className="text-gray-300">—</span>}
                          </td>
                          <td className="py-3 px-4 text-xs text-gray-400">{timeAgo(user.lastActive)}</td>
                          <td className="py-3 px-4 text-xs text-gray-400">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                          </td>
                          <td className="py-3 px-4">
                            <ChevronRight className="w-4 h-4 text-gray-300" />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Member detail drawer */}
      {selectedUserId && (
        <MemberDrawer userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
      )}
    </div>
  );
}
