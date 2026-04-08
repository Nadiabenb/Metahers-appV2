export type AgentId = 'bella' | 'luna' | 'nova' | 'sage' | 'noor' | 'vita';

export interface Agent {
  id: AgentId;
  name: string;
  role: string;
  tagline: string;
  description: string;
  specialties: string[];
  examplePrompts: string[];
  gptUrl: string;
  color: string;
  emoji: string;
}

export const AGENTS: Agent[] = [
  {
    id: 'bella',
    name: 'Bella',
    role: 'Digital Artist & Creative Director',
    tagline: 'Your visual identity, elevated.',
    description:
      'Bella specialises in visual content creation, brand aesthetics, and creative direction. She helps you generate stunning visuals, develop a cohesive brand identity, and bring your creative vision to life — no design degree required.',
    specialties: ['Brand visuals', 'Creative direction', 'Social media content', 'AI image prompts', 'Aesthetic development'],
    examplePrompts: [
      'Create a brand mood board concept for a luxury wellness business',
      'Write 5 AI image prompts for my Instagram that match a soft, feminine aesthetic',
      'Help me develop a consistent visual identity across all my platforms',
    ],
    gptUrl: 'https://chatgpt.com/g/g-ypZ0MvBi1-bella-the-digital-artist',
    color: '#E8A598',
    emoji: '🎨',
  },
  {
    id: 'luna',
    name: 'Luna',
    role: 'Marketing Maestro',
    tagline: 'Strategy that sells, content that connects.',
    description:
      'Luna is your AI marketing strategist. She builds campaigns, writes copy that converts, plans content calendars, and helps you show up consistently — without burning out. From launch strategy to daily content, Luna has it covered.',
    specialties: ['Marketing strategy', 'Copywriting', 'Content calendars', 'Launch campaigns', 'Email sequences'],
    examplePrompts: [
      'Build me a 30-day content calendar for my coaching business',
      'Write a launch email sequence for my new digital product',
      'Create a marketing strategy for my rebrand launch on Instagram',
    ],
    gptUrl: 'https://chatgpt.com/g/g-WCjRvFF2n-luna-the-marketing-maestro',
    color: '#9B8EC4',
    emoji: '🌙',
  },
  {
    id: 'nova',
    name: 'Nova',
    role: 'Build & Automation Specialist',
    tagline: 'Build without code. Automate without limits.',
    description:
      "Nova helps you build apps, workflows, and automations without writing a single line of code. She guides you through no-code tools, AI builders, and process automation so your business runs smarter — even when you're offline.",
    specialties: ['No-code app building', 'Workflow automation', 'AI tool implementation', 'Systems design', 'Tech stack advice'],
    examplePrompts: [
      'Help me build an automated client onboarding workflow',
      'What no-code tools should I use to build a membership site?',
      'Design an automation system for my content repurposing process',
    ],
    gptUrl: 'https://chatgpt.com/g/g-peVOtNOH6-nova',
    color: '#6EC4C4',
    emoji: '⚡',
  },
  {
    id: 'sage',
    name: 'Sage',
    role: 'AI Strategy & Learning Guide',
    tagline: 'Deep knowledge. Clear direction.',
    description:
      'Sage is your AI thought partner — brilliant, strategic, and endlessly patient. She breaks down complex AI concepts, helps you develop a personalised learning strategy, and guides research so you can make smarter decisions with confidence.',
    specialties: ['AI education', 'Research & analysis', 'Strategic thinking', 'Learning roadmaps', 'Industry insights'],
    examplePrompts: [
      'Explain how large language models work in plain language',
      'Create a personalised AI learning roadmap for someone at intermediate level',
      'Research the top AI trends affecting solopreneurs in 2025',
    ],
    gptUrl: 'https://chatgpt.com/g/g-KaY6Z6P0s-sage',
    color: '#C9A96E',
    emoji: '🔮',
  },
  {
    id: 'noor',
    name: 'Noor',
    role: 'Creative Ghostwriter',
    tagline: 'Your voice, amplified.',
    description:
      "Noor is your ghostwriting partner — witty, warm, and wonderfully creative. She writes in your voice, crafts stories that captivate, and turns your ideas into content that actually sounds like you. From thought leadership to playful social posts, Noor brings the words.",
    specialties: ['Ghostwriting', 'Thought leadership', 'Brand storytelling', 'Long-form content', 'Creative writing'],
    examplePrompts: [
      'Write a LinkedIn article in my voice about my journey as a solopreneur',
      'Ghost-write a newsletter edition about overcoming fear of visibility',
      "Create a brand origin story that's personal, powerful, and shareable",
    ],
    gptUrl: 'https://chatgpt.com/g/g-JPIZxk3mO-noor',
    color: '#E8C4A0',
    emoji: '✍️',
  },
  {
    id: 'vita',
    name: 'Vita',
    role: 'AI Wellness Coach',
    tagline: 'Thrive in your body, lead in your life.',
    description:
      'Vita is your personalised AI wellness coach — built specifically for ambitious women. She creates customised health and fitness guidance, helps you build sustainable routines, and supports the mind-body balance that fuels high performance.',
    specialties: ['Personalised fitness plans', 'Nutrition guidance', 'Wellness routines', 'Energy management', 'Habit building'],
    examplePrompts: [
      'Create a 4-week fitness plan I can do from home in 30 minutes a day',
      'Design a morning routine that boosts energy and mental clarity',
      'Help me build sustainable nutrition habits around a busy schedule',
    ],
    gptUrl: 'https://chatgpt.com/g/g-F6yjG08Jw-bella',
    color: '#A8C5A0',
    emoji: '🌿',
  },
];

// Quiz goal → free agent mapping
export const FREE_AGENT_BY_GOAL: Record<string, AgentId> = {
  learn_ai: 'sage',
  build_ai: 'nova',
  monetize_ai: 'bella',
  brand_ai: 'luna',
};

// Always Signature-only regardless of goal
export const SIGNATURE_ONLY_AGENTS: AgentId[] = ['noor', 'vita'];
