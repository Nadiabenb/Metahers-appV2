import type { ConciergeAgentId, QuizResponseDB } from "@shared/schema";
import { isPrivateTier, type SubscriptionTier } from "@shared/pricing";

export const AGENT_IDS: ConciergeAgentId[] = ["aria", "sage", "nova", "luna", "bella", "noor"];

export const AGENT_DISPLAY_NAMES: Record<ConciergeAgentId, string> = {
  aria: "ARIA",
  sage: "Sage",
  nova: "Nova",
  luna: "Luna",
  bella: "Bella",
  noor: "Noor",
};

const GOAL_LABELS: Record<string, string> = {
  master_ai: "Master AI",
  learn_ai: "Learn AI",
  build_ai: "Build with AI",
  build_web3: "Build with AI",
  monetize_ai: "Monetize with AI",
  own_authority: "Own Your Authority",
  brand_ai: "Brand with AI",
  advance_career: "Advance Your Career",
};

const AGENT_PERSONAS: Record<ConciergeAgentId, string> = {
  aria: "You are ARIA, MetaHers concierge. Your role is triage, warm onboarding, and routing women to the right next action. Keep responses practical, concise, and confidence-building.",
  sage: "You are Sage, MetaHers AI Strategy and Learning Guide. Explain clearly, break complexity into steps, and prioritize strategic clarity.",
  nova: "You are Nova, MetaHers Build and Automation Specialist. Focus on implementation plans, no-code workflows, and operational systems that save time.",
  luna: "You are Luna, MetaHers Marketing Maestro. Deliver clear positioning, campaign ideas, and copy direction grounded in business outcomes.",
  bella: "You are Bella, MetaHers Digital Artist and Creative Director. Guide visual direction, brand expression, and content aesthetics with actionable outputs.",
  noor: "You are Noor, MetaHers Creative Ghostwriter. Write in the member's voice, shape story arcs, and produce polished thought leadership drafts.",
};

export type AgentQuizContext = {
  goal?: string;
  experienceLevel?: string;
  role?: string;
  timeAvailability?: string;
  painPoint?: string;
  learningStyle?: string;
};

export function toAgentQuizContext(quiz?: QuizResponseDB): AgentQuizContext {
  if (!quiz) {
    return {};
  }

  return {
    goal: formatQuizGoal(quiz.goal),
    experienceLevel: quiz.experienceLevel,
    role: quiz.role,
    timeAvailability: quiz.timeAvailability,
    painPoint: quiz.painPoint,
    learningStyle: quiz.learningStyle,
  };
}

export function formatQuizGoal(goal?: string | null): string | undefined {
  if (!goal) {
    return undefined;
  }

  return GOAL_LABELS[goal] ?? goal;
}

export function canAccessAgent(agentId: ConciergeAgentId, tier: string): boolean {
  if (agentId !== "noor") {
    return true;
  }

  return isPrivateTier(tier as SubscriptionTier);
}

export function getAnthropicAgentModel(): string {
  return process.env.CONCIERGE_ANTHROPIC_MODEL || process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022";
}

export function buildAgentSystemPrompt(params: {
  agentId: ConciergeAgentId;
  firstName?: string | null;
  quizContext?: AgentQuizContext;
}): string {
  const { agentId, firstName, quizContext } = params;
  const persona = AGENT_PERSONAS[agentId];

  const contextLines = [
    `Member name: ${firstName || "Member"}`,
    `Goal: ${quizContext?.goal || "Unknown"}`,
    `Experience level: ${quizContext?.experienceLevel || "Unknown"}`,
    `Role: ${quizContext?.role || "Unknown"}`,
    `Time availability: ${quizContext?.timeAvailability || "Unknown"}`,
    `Main pain point: ${quizContext?.painPoint || "Unknown"}`,
    `Learning style: ${quizContext?.learningStyle || "Unknown"}`,
  ];

  return [
    persona,
    "Brand voice: polished, warm, and direct. Prioritize clarity over hype.",
    "When giving advice, use short steps and practical examples.",
    "Never claim actions were taken outside this chat.",
    "Keep responses under 220 words unless the member asks for depth.",
    "Member context:",
    ...contextLines,
  ].join("\n");
}

export function buildGreetingUserPrompt(agentId: ConciergeAgentId): string {
  return `Start the conversation as ${AGENT_DISPLAY_NAMES[agentId]}. Give a concise greeting and one actionable next step.`;
}
