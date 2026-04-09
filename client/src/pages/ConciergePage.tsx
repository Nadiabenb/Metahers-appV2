import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { APIError, apiRequestJson } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Lock, MessageSquare, Plus, SendHorizonal, Sparkles } from "lucide-react";
import {
  CONCIERGE_AGENTS,
  getConciergeAgent,
  type ConciergeAgentId,
} from "@/lib/conciergeAgentData";

type UsageResponse = {
  usage: {
    messageCount: number;
    lastUsedAt: string | null;
    lastAgentId: ConciergeAgentId | null;
  };
  agents: Array<{
    agentId: ConciergeAgentId;
    name: string;
    hasAccess: boolean;
  }>;
};

type AgentMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

type AgentConversation = {
  id: string;
  userId: string;
  agentId: ConciergeAgentId;
  title: string;
  messages: AgentMessage[];
  messageCount: number;
  createdAt?: string;
  updatedAt?: string;
};

type ConversationsResponse = {
  conversations: AgentConversation[];
};

type GreetResponse = {
  greeting: string;
  conversation: AgentConversation;
  model: string;
};

type ChatResponse = {
  response: string;
  conversation: AgentConversation;
  model: string;
};

const gold = "#C9A96E";

export default function ConciergePage() {
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuth();
  const [selectedAgentId, setSelectedAgentId] = useState<ConciergeAgentId>("aria");
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [gateMessage, setGateMessage] = useState<string | null>(null);

  const usageQuery = useQuery<UsageResponse>({
    queryKey: ["/api/agents/usage"],
    enabled: isAuthenticated,
  });

  const conversationsQuery = useQuery<ConversationsResponse>({
    queryKey: ["/api/agents/conversations", selectedAgentId],
    queryFn: () => apiRequestJson<ConversationsResponse>("GET", `/api/agents/conversations/${selectedAgentId}`),
    enabled: isAuthenticated,
  });

  const selectedAgent = getConciergeAgent(selectedAgentId);
  const agentAccess = useMemo(() => {
    const match = usageQuery.data?.agents.find((agent) => agent.agentId === selectedAgentId);
    return match?.hasAccess ?? false;
  }, [usageQuery.data?.agents, selectedAgentId]);

  useEffect(() => {
    const list = conversationsQuery.data?.conversations || [];
    if (list.length === 0) {
      setSelectedConversationId(null);
      return;
    }

    if (!selectedConversationId || !list.some((item) => item.id === selectedConversationId)) {
      setSelectedConversationId(list[0].id);
    }
  }, [conversationsQuery.data?.conversations, selectedConversationId]);

  const activeConversation = useMemo(() => {
    const list = conversationsQuery.data?.conversations || [];
    return list.find((item) => item.id === selectedConversationId) || list[0] || null;
  }, [conversationsQuery.data?.conversations, selectedConversationId]);

  const refreshAgentData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["/api/agents/usage"] }),
      queryClient.invalidateQueries({ queryKey: ["/api/agents/conversations", selectedAgentId] }),
    ]);
  };

  const newConversationMutation = useMutation({
    mutationFn: async () => apiRequestJson<AgentConversation>(
      "POST",
      `/api/agents/conversations/${selectedAgentId}/new`,
      { title: `New ${selectedAgent.name} chat` },
    ),
    onSuccess: async (conversation) => {
      setGateMessage(null);
      setSelectedConversationId(conversation.id);
      await refreshAgentData();
    },
    onError: (error) => {
      if (error instanceof APIError && error.status === 403) {
        setGateMessage("Noor is a Private-tier specialist. Upgrade to unlock this workspace.");
      }
    },
  });

  const greetMutation = useMutation({
    mutationFn: async () => apiRequestJson<GreetResponse>("POST", "/api/agents/greet", { agentId: selectedAgentId }),
    onSuccess: async (result) => {
      setGateMessage(null);
      setSelectedConversationId(result.conversation.id);
      await refreshAgentData();
    },
    onError: (error) => {
      if (error instanceof APIError && error.status === 403) {
        setGateMessage("This specialist is available on Private.");
      }
    },
  });

  const chatMutation = useMutation({
    mutationFn: async () => apiRequestJson<ChatResponse>("POST", "/api/agents/chat", {
      agentId: selectedAgentId,
      message: draft.trim(),
      conversationId: activeConversation?.id,
    }),
    onSuccess: async (result) => {
      setGateMessage(null);
      setDraft("");
      setSelectedConversationId(result.conversation.id);
      await refreshAgentData();
    },
    onError: (error) => {
      if (error instanceof APIError && error.status === 403) {
        if (error.code === "CONCIERGE_FREE_LIMIT_REACHED") {
          setGateMessage("You have reached the free concierge limit (10 total messages). Upgrade to continue.");
          return;
        }
        if (error.code === "CONCIERGE_DAILY_LIMIT_REACHED") {
          const resetsAt = error.details?.resetsAt as string | undefined;
          const resetText = resetsAt ? ` Resets at ${new Date(resetsAt).toLocaleString()}.` : "";
          setGateMessage(`Daily concierge limit reached.${resetText}`);
          return;
        }
        setGateMessage(error.message || "Chat is temporarily unavailable.");
      }
    },
  });

  const submitting =
    newConversationMutation.isPending || greetMutation.isPending || chatMutation.isPending;

  const handleSend = () => {
    if (!draft.trim() || !agentAccess || submitting) {
      return;
    }
    chatMutation.mutate();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0D0B14] text-white">
        <SEO title="Concierge Beta — MetaHers" description="The new concierge beta workspace for MetaHers members." />
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-light mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Concierge Beta
          </h1>
          <p className="text-white/60 mb-8">
            Sign in to access ARIA and your specialist AI concierge workspace.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/login"><Button>Log In</Button></Link>
            <Link href="/signup"><Button variant="outline">Create Account</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0B14] text-white">
      <SEO title="Concierge Beta — MetaHers" description="ARIA + specialist concierge chat in one workspace." />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Card className="mb-6 border-[rgba(201,169,110,0.28)] bg-[#13111C]">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
              <div>
                <Badge className="mb-3 bg-[rgba(201,169,110,0.15)] text-[#DCC28D] border border-[rgba(201,169,110,0.35)]">
                  Concierge Beta
                </Badge>
                <h1 className="text-3xl sm:text-5xl font-light mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                  ARIA, ready when you are.
                </h1>
                <p className="text-white/60 max-w-2xl">
                  {user?.firstName ? `${user.firstName}, ` : ""}enter through ARIA, then move into specialist chat threads for strategy, build, marketing, creative direction, and writing.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4 min-w-[220px]">
                <p className="text-xs uppercase tracking-widest text-white/45 mb-1">Usage</p>
                <p className="text-2xl font-semibold">{usageQuery.data?.usage.messageCount ?? 0}</p>
                <p className="text-xs text-white/50">messages sent across all concierge agents</p>
                {usageQuery.data?.usage.lastAgentId ? (
                  <p className="text-xs text-white/60 mt-2">
                    Last specialist: {getConciergeAgent(usageQuery.data.usage.lastAgentId).name}
                  </p>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          <Card className="border-white/10 bg-[#13111C]">
            <CardHeader>
              <CardTitle className="text-base font-medium">Specialist Directory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {CONCIERGE_AGENTS.map((agent) => {
                const access = usageQuery.data?.agents.find((row) => row.agentId === agent.id)?.hasAccess ?? false;
                const selected = selectedAgentId === agent.id;
                return (
                  <button
                    key={agent.id}
                    onClick={() => {
                      setSelectedAgentId(agent.id);
                      setGateMessage(null);
                    }}
                    className={`w-full text-left rounded-xl border p-3 transition ${
                      selected ? "border-white/35 bg-white/10" : "border-white/10 bg-black/10 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3">
                        <div className="text-xl">{agent.emoji}</div>
                        <div>
                          <p className="font-medium" style={{ color: selected ? "#fff" : agent.accent }}>{agent.name}</p>
                          <p className="text-xs text-white/55">{agent.role}</p>
                        </div>
                      </div>
                      {!access && <Lock className="w-4 h-4 text-[#D6B37A]" />}
                    </div>
                    <p className="text-xs text-white/55 mt-2">{agent.tagline}</p>
                  </button>
                );
              })}
              <Separator className="bg-white/10" />
              <Link href="/agents">
                <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Open Legacy GPT Agents
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#13111C]">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="text-xl" style={{ color: selectedAgent.accent }}>
                    {selectedAgent.name}
                  </CardTitle>
                  <p className="text-sm text-white/60 mt-1">{selectedAgent.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/20 bg-transparent hover:bg-white/10"
                    onClick={() => newConversationMutation.mutate()}
                    disabled={!agentAccess || submitting}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    New
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!agentAccess ? (
                <div className="rounded-xl border border-[rgba(201,169,110,0.35)] bg-[rgba(201,169,110,0.08)] p-5">
                  <p className="font-medium text-[#E4C891] mb-2">Private-tier specialist</p>
                  <p className="text-sm text-white/70 mb-4">
                    {selectedAgent.name} is currently unlocked for Private members.
                  </p>
                  <Link href="/upgrade">
                    <Button className="bg-[rgba(201,169,110,1)] text-[#1A1A2E] hover:opacity-90">
                      Upgrade to Private
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="rounded-xl border border-white/10 bg-black/20">
                    <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-white/70">
                        <MessageSquare className="w-4 h-4" />
                        Conversation
                      </div>
                      {conversationsQuery.data?.conversations.length ? (
                        <select
                          className="bg-transparent text-xs border border-white/20 rounded-md px-2 py-1 text-white/80"
                          value={activeConversation?.id || ""}
                          onChange={(e) => setSelectedConversationId(e.target.value)}
                        >
                          {(conversationsQuery.data?.conversations || []).map((item) => (
                            <option key={item.id} value={item.id} className="text-black">
                              {item.title}
                            </option>
                          ))}
                        </select>
                      ) : null}
                    </div>

                    <ScrollArea className="h-[320px] sm:h-[420px]">
                      <div className="p-4 space-y-3">
                        {activeConversation?.messages?.length ? (
                          activeConversation.messages.map((msg, index) => (
                            <div
                              key={`${msg.timestamp}-${index}`}
                              className={`max-w-[90%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                                msg.role === "user"
                                  ? "ml-auto bg-white text-black"
                                  : "bg-white/10 text-white"
                              }`}
                            >
                              {msg.content}
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12">
                            <p className="text-white/65 mb-3">
                              Start with a personalized {selectedAgent.name} greeting.
                            </p>
                            <Button
                              variant="outline"
                              className="border-white/20 bg-transparent hover:bg-white/10"
                              onClick={() => greetMutation.mutate()}
                              disabled={submitting}
                            >
                              <Sparkles className="w-4 h-4 mr-2" />
                              Generate Greeting
                            </Button>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>

                  {gateMessage ? (
                    <div className="rounded-lg border border-[rgba(201,169,110,0.35)] bg-[rgba(201,169,110,0.08)] p-3 text-sm text-[#E4C891]">
                      {gateMessage}
                    </div>
                  ) : null}

                  <div className="flex items-end gap-2">
                    <Textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder={`Message ${selectedAgent.name}...`}
                      className="min-h-[86px] bg-black/20 border-white/20 text-white placeholder:text-white/40"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                    />
                    <Button
                      className="shrink-0 bg-[rgba(201,169,110,1)] text-[#1A1A2E] hover:opacity-90"
                      onClick={handleSend}
                      disabled={!draft.trim() || submitting}
                    >
                      <SendHorizonal className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
