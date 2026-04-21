import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Mail, Clock, CheckCircle, XCircle, Search, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

const EMAIL_KEYS = ['day_1', 'day_2', 'day_3', 'day_5', 'day_8', 'day_10', 'day_14'];

const EMAIL_LABELS: Record<string, string> = {
  day_1: 'Welcome',
  day_2: 'First win',
  day_3: 'Meet the team',
  day_5: 'Engage (fork)',
  day_8: 'Social proof',
  day_10: 'Convert',
  day_14: 'Personal note',
};

const PERSONA_COLORS: Record<string, string> = {
  builder: 'bg-blue-50 text-blue-700',
  creative: 'bg-purple-50 text-purple-700',
  mom: 'bg-pink-50 text-pink-700',
  upgraded: 'bg-green-50 text-green-700',
  unknown: 'bg-gray-50 text-gray-500',
};

const TIER_COLORS: Record<string, string> = {
  free: 'bg-gray-100 text-gray-600',
  signature_monthly: 'bg-amber-50 text-amber-700',
  private_monthly: 'bg-purple-50 text-purple-700',
  ai_blueprint: 'bg-blue-50 text-blue-700',
};

interface EmailRow {
  id: string;
  emailKey: string;
  scheduledFor: string;
  sentAt: string | null;
  persona: string | null;
  variant: string | null;
}

interface UserSequence {
  userId: string;
  email: string;
  firstName: string | null;
  tier: string | null;
  persona: string | null;
  emailsSent: number;
  emailsPending: number;
  emailsTotal: number;
  emails: EmailRow[];
}

interface SequenceData {
  stats: {
    totalScheduled: number;
    totalSent: number;
    totalPending: number;
    uniqueUsers: number;
  };
  users: UserSequence[];
}

function ProgressDots({ emails }: { emails: EmailRow[] }) {
  const byKey = new Map(emails.map(e => [e.emailKey, e]));
  return (
    <div className="flex gap-1.5 items-center">
      {EMAIL_KEYS.map(key => {
        const email = byKey.get(key);
        const sent = email?.sentAt;
        const skipped = email?.persona === 'upgraded';
        return (
          <div
            key={key}
            title={`${EMAIL_LABELS[key]}${sent ? ' — sent' : skipped ? ' — skipped (upgraded)' : ' — pending'}`}
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold
              ${sent ? 'bg-green-500 text-white' : skipped ? 'bg-gray-200 text-gray-400' : 'bg-gray-100 text-gray-400 border border-gray-200'}`}
          >
            {key.replace('day_', '')}
          </div>
        );
      })}
    </div>
  );
}

function UserRow({ user }: { user: UserSequence }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="py-3 px-4">
          <div className="font-medium text-sm text-gray-900">{user.firstName || '—'}</div>
          <div className="text-xs text-gray-500">{user.email}</div>
        </td>
        <td className="py-3 px-4">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TIER_COLORS[user.tier || 'free'] || TIER_COLORS.free}`}>
            {user.tier?.replace('_monthly', '').replace('_', ' ') || 'free'}
          </span>
        </td>
        <td className="py-3 px-4">
          {user.persona ? (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PERSONA_COLORS[user.persona] || PERSONA_COLORS.unknown}`}>
              {user.persona}
            </span>
          ) : <span className="text-xs text-gray-400">pending</span>}
        </td>
        <td className="py-3 px-4">
          <ProgressDots emails={user.emails} />
        </td>
        <td className="py-3 px-4 text-sm text-gray-600">
          {user.emailsSent}/{user.emailsTotal}
        </td>
        <td className="py-3 px-4">
          <button className="text-gray-400 hover:text-gray-600">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-gray-100">
          <td colSpan={6} className="px-4 py-3 bg-gray-50">
            <div className="grid grid-cols-7 gap-2">
              {EMAIL_KEYS.map(key => {
                const email = user.emails.find(e => e.emailKey === key);
                const sent = email?.sentAt;
                const skipped = email?.persona === 'upgraded';
                const scheduledFor = email?.scheduledFor ? new Date(email.scheduledFor) : null;
                const sentAt = email?.sentAt ? new Date(email.sentAt) : null;
                return (
                  <div key={key} className={`rounded-lg p-3 border text-xs ${sent ? 'bg-green-50 border-green-100' : skipped ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-100'}`}>
                    <div className="font-medium text-gray-700 mb-1">{EMAIL_LABELS[key]}</div>
                    <div className="text-gray-500 mb-1">{key}</div>
                    {email?.variant && (
                      <div className="text-purple-600 font-medium mb-1">{email.variant}</div>
                    )}
                    {sent ? (
                      <div className="text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {sentAt?.toLocaleDateString()}
                      </div>
                    ) : skipped ? (
                      <div className="text-gray-400 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        skipped
                      </div>
                    ) : (
                      <div className="text-amber-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {scheduledFor?.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function AdminEmailSequencePage() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [personaFilter, setPersonaFilter] = useState('all');

  const { data, isLoading, isError, error, refetch } = useQuery<SequenceData>({
    queryKey: ['admin-email-sequence', search, statusFilter, personaFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (personaFilter !== 'all') params.append('persona', personaFilter);
      const res = await fetch(`/api/admin/email-sequence?${params}`, { credentials: 'include' });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status}: ${text}`);
      }
      return res.json();
    },
    retry: false,
  });

  const backfillMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/admin/email-sequence/backfill', {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Backfill failed');
      return res.json();
    },
    onSuccess: (data) => {
      refetch();
      alert(`Backfill complete — ${data.enrolled} members enrolled${data.failed > 0 ? `, ${data.failed} failed` : ''}.`);
    },
    onError: () => {
      alert('Backfill failed — check server logs.');
    },
  });

  const stats = data?.stats;
  const users = data?.users || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation('/admin')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Mail className="h-8 w-8 text-purple-600" />
                Email Sequence Tracker
              </h1>
              <p className="text-gray-500 mt-1 text-sm">Monitor onboarding sequence delivery across all members</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => backfillMutation.mutate()}
              disabled={backfillMutation.isPending}
            >
              {backfillMutation.isPending ? 'Enrolling...' : 'Enrol existing members'}
            </Button>
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Members in sequence', value: stats?.uniqueUsers ?? '—', color: 'text-blue-600' },
            { label: 'Emails scheduled', value: stats?.totalScheduled ?? '—', color: 'text-gray-600' },
            { label: 'Emails sent', value: stats?.totalSent ?? '—', color: 'text-green-600' },
            { label: 'Emails pending', value: stats?.totalPending ?? '—', color: 'text-amber-600' },
          ].map(s => (
            <Card key={s.label} className="border-none shadow-sm">
              <CardContent className="p-5">
                <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="skipped">Skipped</SelectItem>
                </SelectContent>
              </Select>
              <Select value={personaFilter} onValueChange={setPersonaFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Persona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All personas</SelectItem>
                  <SelectItem value="builder">Builder</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="mom">Mom</SelectItem>
                  <SelectItem value="upgraded">Upgraded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-700">
              {users.length} member{users.length !== 1 ? 's' : ''}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
            ) : isError ? (
              <div className="p-8 text-center">
                <p className="text-red-500 text-sm font-medium mb-1">Failed to load sequence data</p>
                <p className="text-gray-400 text-xs font-mono">{(error as Error)?.message}</p>
                <p className="text-gray-400 text-xs mt-2">Check that ADMIN_EMAILS is set in Replit Secrets and includes your email.</p>
              </div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">
                No members in sequence yet.<br/>
                <span className="text-xs mt-1 block">Click "Enrol existing members" above to add current members, or sign up a new test account.</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Member</th>
                      <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Tier</th>
                      <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Persona</th>
                      <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Progress</th>
                      <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Sent</th>
                      <th className="py-3 px-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <UserRow key={user.userId} user={user} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-6 text-xs text-gray-500 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500" />
            Sent
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-100 border border-gray-200" />
            Pending
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-200" />
            Skipped (upgraded)
          </div>
        </div>

      </div>
    </div>
  );
}
