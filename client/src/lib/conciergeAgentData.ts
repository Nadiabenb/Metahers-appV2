export type ConciergeAgentId = "aria" | "sage" | "nova" | "luna" | "bella" | "noor";

export type ConciergeAgentProfile = {
  id: ConciergeAgentId;
  name: string;
  role: string;
  tagline: string;
  description: string;
  accent: string;
  emoji: string;
};

export const CONCIERGE_AGENTS: ConciergeAgentProfile[] = [
  {
    id: "aria",
    name: "ARIA",
    role: "Concierge",
    tagline: "Your MetaHers command center.",
    description: "ARIA helps you get oriented quickly, routes you to the right specialist, and recommends your next best move.",
    accent: "#C9A96E",
    emoji: "✨",
  },
  {
    id: "sage",
    name: "Sage",
    role: "AI Strategy & Learning Guide",
    tagline: "Clarity before complexity.",
    description: "Breaks down AI strategy into practical steps you can execute this week.",
    accent: "#7BA6FF",
    emoji: "🔮",
  },
  {
    id: "nova",
    name: "Nova",
    role: "Build & Automation Specialist",
    tagline: "Systems that save your time.",
    description: "Designs no-code workflows, app plans, and automation stacks around your business goals.",
    accent: "#64C4C1",
    emoji: "⚡",
  },
  {
    id: "luna",
    name: "Luna",
    role: "Marketing Maestro",
    tagline: "Campaigns with conviction.",
    description: "Sharpens offers, messaging, and launch plans to help you convert with confidence.",
    accent: "#A68BD7",
    emoji: "🌙",
  },
  {
    id: "bella",
    name: "Bella",
    role: "Creative Director",
    tagline: "Aesthetic with intention.",
    description: "Helps you shape visual direction, brand style, and standout creative concepts.",
    accent: "#E4A394",
    emoji: "🎨",
  },
  {
    id: "noor",
    name: "Noor",
    role: "Creative Ghostwriter",
    tagline: "Your voice, elevated.",
    description: "Private-tier specialist for polished thought leadership, storytelling, and voice-matched writing.",
    accent: "#E8C4A0",
    emoji: "✍️",
  },
];

export function getConciergeAgent(agentId: ConciergeAgentId): ConciergeAgentProfile {
  return CONCIERGE_AGENTS.find((agent) => agent.id === agentId) || CONCIERGE_AGENTS[0];
}
