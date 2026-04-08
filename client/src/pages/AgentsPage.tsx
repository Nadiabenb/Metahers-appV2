import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ExternalLink, Crown, Lock, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { SEO } from "@/components/SEO";
import { isSignatureTier } from "@shared/pricing";
import {
  AGENTS,
  FREE_AGENT_BY_GOAL,
  SIGNATURE_ONLY_AGENTS,
  type Agent,
  type AgentId,
} from "@/lib/agentData";

const GOLD = "#C9A96E";
const GOLD_BTN = "font-semibold uppercase tracking-widest text-xs px-6";
const GOLD_STYLE = { background: GOLD, color: "#1A1A2E" };

function AgentCard({
  agent,
  isUnlocked,
}: {
  agent: Agent;
  isUnlocked: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card
        className="h-full flex flex-col transition-all duration-200"
        style={{
          background: "#13111C",
          border: isUnlocked
            ? `1px solid ${agent.color}50`
            : "1px solid rgba(255,255,255,0.07)",
          opacity: isUnlocked ? 1 : 0.72,
        }}
      >
        <CardContent className="p-6 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: `${agent.color}20` }}
              >
                {agent.emoji}
              </div>
              <div>
                <h3
                  className="text-white font-medium text-base"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {agent.name}
                </h3>
                <p className="text-xs mt-0.5" style={{ color: agent.color }}>
                  {agent.role}
                </p>
              </div>
            </div>
            {!isUnlocked && (
              <div
                className="flex items-center gap-1 px-2 py-1 rounded flex-shrink-0"
                style={{
                  background: `${GOLD}15`,
                  color: GOLD,
                  border: `1px solid ${GOLD}25`,
                }}
              >
                <Crown className="w-3 h-3" />
                <span
                  className="font-medium tracking-wider uppercase hidden sm:inline"
                  style={{ fontSize: "9px" }}
                >
                  Signature
                </span>
              </div>
            )}
          </div>

          {/* Tagline */}
          <p className="text-white/35 text-xs italic mb-3">{agent.tagline}</p>

          {/* Description */}
          <p className="text-white/55 text-sm leading-relaxed mb-4">
            {agent.description}
          </p>

          {/* Specialties */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {agent.specialties.map((s) => (
              <span
                key={s}
                className="text-xs px-2.5 py-0.5 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  color: "rgba(255,255,255,0.40)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {s}
              </span>
            ))}
          </div>

          {/* Example prompts toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs mb-3 transition-colors w-fit"
            style={{ color: expanded ? GOLD : "rgba(255,255,255,0.30)" }}
          >
            {expanded ? (
              <>
                <ChevronUp className="w-3 h-3" /> Hide example prompts
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" /> See example prompts
              </>
            )}
          </button>

          {expanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 space-y-2"
            >
              {agent.examplePrompts.map((prompt, i) => (
                <div
                  key={i}
                  className="text-xs p-3 rounded-lg leading-relaxed"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    color: "rgba(255,255,255,0.50)",
                    borderLeft: `2px solid ${agent.color}50`,
                  }}
                >
                  "{prompt}"
                </div>
              ))}
            </motion.div>
          )}

          {/* Spacer to push CTA to bottom */}
          <div className="flex-1" />

          {/* CTA */}
          <div className="mt-4">
            {isUnlocked ? (
              <a
                href={agent.gptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button
                  className={`${GOLD_BTN} w-full gap-2`}
                  style={GOLD_STYLE}
                >
                  Talk to {agent.name}
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </a>
            ) : (
              <Link href="/upgrade">
                <Button
                  variant="ghost"
                  className="w-full text-xs uppercase tracking-widest font-semibold border transition-colors"
                  style={{
                    color: "rgba(255,255,255,0.30)",
                    borderColor: "rgba(255,255,255,0.09)",
                  }}
                >
                  <Lock className="w-3 h-3 mr-2" />
                  Unlock with Signature
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function AgentsPage() {
  const { user } = useAuth();
  const isPaid = isSignatureTier((user?.subscriptionTier as any) || "free");

  const { data: quizData } = useQuery<{ goal: string } | null>({
    queryKey: ["/api/onboarding/quiz"],
    enabled: !!user && !isPaid,
  });

  const freeAgentId: AgentId | null =
    quizData?.goal ? (FREE_AGENT_BY_GOAL[quizData.goal] ?? null) : null;

  const freeAgent = freeAgentId ? AGENTS.find((a) => a.id === freeAgentId) : null;

  const isUnlocked = (agent: Agent): boolean => {
    if (isPaid) return true;
    if (SIGNATURE_ONLY_AGENTS.includes(agent.id)) return false;
    return agent.id === freeAgentId;
  };

  // Unlocked agent first, then the rest
  const sortedAgents = [...AGENTS].sort((a, b) => {
    const au = isUnlocked(a);
    const bu = isUnlocked(b);
    if (au && !bu) return -1;
    if (!au && bu) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen" style={{ background: "#0D0B14" }}>
      <SEO
        title="AI Agents — MetaHers"
        description="Six AI specialists built for ambitious women. Meet your team."
      />

      <div className="max-w-5xl mx-auto py-10 px-6">
        {/* Page header */}
        <div className="mb-10">
          <p
            className="text-xs uppercase tracking-widest mb-3"
            style={{ color: GOLD }}
          >
            Your AI Team
          </p>
          <h1
            className="text-4xl sm:text-5xl font-light text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Meet your agents.
          </h1>
          <p className="text-white/45 text-base max-w-xl leading-relaxed">
            Six AI specialists, each built for a different part of your business.
            Click any unlocked agent to open a conversation directly in ChatGPT.
          </p>

          {/* Access banner — free users */}
          {!isPaid && (
            <div
              className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-xl"
              style={{
                background: "#13111C",
                border: "1px solid rgba(201,169,110,0.20)",
              }}
            >
              <div>
                <p className="text-white text-sm font-medium mb-1">
                  {freeAgent
                    ? `${freeAgent.name} is matched to your goal and ready to talk.`
                    : "Complete your quiz to unlock your matched agent."}
                </p>
                <p className="text-white/35 text-xs">
                  Signature members unlock all 6 agents — from $29/month.
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {!freeAgent && (
                  <Link href="/onboarding/quiz">
                    <Button
                      variant="ghost"
                      className="text-xs uppercase tracking-widest font-semibold"
                      style={{ color: GOLD }}
                    >
                      Take the quiz
                    </Button>
                  </Link>
                )}
                <Link href="/upgrade">
                  <Button className={`${GOLD_BTN} gap-1.5`} style={GOLD_STYLE}>
                    <Crown className="w-3 h-3" />
                    Unlock all 6
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Access banner — paid users */}
          {isPaid && (
            <div
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium"
              style={{
                background: `${GOLD}15`,
                color: GOLD,
                border: `1px solid ${GOLD}30`,
              }}
            >
              <Crown className="w-3 h-3" />
              All 6 agents unlocked — Signature member
            </div>
          )}
        </div>

        {/* Agent grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              isUnlocked={isUnlocked(agent)}
            />
          ))}
        </div>

        {/* Bottom upgrade CTA — free only */}
        {!isPaid && (
          <div className="mt-14 text-center">
            <p
              className="text-2xl sm:text-3xl font-light text-white mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Ready to work with your full team?
            </p>
            <p className="text-white/35 text-sm mb-7 max-w-md mx-auto leading-relaxed">
              Signature unlocks all 6 agents, the full learning curriculum, and
              the complete AI toolkit.
            </p>
            <Link href="/upgrade">
              <Button
                className={`${GOLD_BTN} px-10 py-3`}
                style={GOLD_STYLE}
              >
                Explore Signature — from $29/month
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
