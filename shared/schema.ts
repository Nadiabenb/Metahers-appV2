import { z } from "zod";

export const ritualSchema = z.object({
  slug: z.string(),
  title: z.string(),
  tier: z.enum(["free", "pro"]),
  duration_min: z.number(),
  summary: z.string(),
  steps: z.array(z.string()),
});

export type Ritual = z.infer<typeof ritualSchema>;

export const shopProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["bag", "bundle"]),
  price: z.number(),
  scents: z.array(z.string()).optional(),
  description: z.string(),
  image: z.string(),
});

export type ShopProduct = z.infer<typeof shopProductSchema>;

export const ritualProgressSchema = z.object({
  slug: z.string(),
  completedSteps: z.array(z.number()),
  lastUpdated: z.string(),
});

export type RitualProgress = z.infer<typeof ritualProgressSchema>;

export const journalEntrySchema = z.object({
  content: z.string(),
  lastSaved: z.string(),
  streak: z.number().default(0),
});

export type JournalEntry = z.infer<typeof journalEntrySchema>;

export const rituals: Ritual[] = [
  {
    slug: "ai-glow-up-facial",
    title: "AI Glow-Up Facial",
    tier: "free",
    duration_min: 60,
    summary: "Prompting, daily automations, 1 task off your plate.",
    steps: [
      "Cleanse intent",
      "Prompting 101",
      "Automate one task",
      "Reflect & journal",
      "Set weekly trigger"
    ]
  },
  {
    slug: "blockchain-detox-ritual",
    title: "Blockchain Detox Ritual",
    tier: "pro",
    duration_min: 60,
    summary: "Wallet setup, self-custody, safety.",
    steps: [
      "Visualize trust",
      "Create wallet",
      "Self-custody basics",
      "Testnet transfer",
      "Journal"
    ]
  },
  {
    slug: "crypto-confidence-bath",
    title: "Crypto Confidence Bath",
    tier: "pro",
    duration_min: 75,
    summary: "BTC/ETH/stablecoins in plain language.",
    steps: [
      "Tea ritual",
      "BTC & ETH basics",
      "Stablecoins",
      "Use cases",
      "Journal"
    ]
  },
  {
    slug: "nft-radiance-wrap",
    title: "NFT Radiance Wrap",
    tier: "pro",
    duration_min: 90,
    summary: "Design and mint a first NFT (testnet).",
    steps: [
      "Inspiration",
      "Prompt art",
      "Mint on testnet",
      "List draft",
      "Story share"
    ]
  },
  {
    slug: "metaverse-meditation",
    title: "Metaverse Meditation",
    tier: "pro",
    duration_min: 90,
    summary: "Avatar, space, brand presence.",
    steps: [
      "Visualize",
      "Avatar setup",
      "Space design",
      "Brand ritual",
      "Journal"
    ]
  }
];

export const shopProducts: ShopProduct[] = [
  {
    id: "sheikha-bag",
    name: "Sheikha Ritual Bag",
    type: "bag",
    price: 199,
    scents: ["Oud", "Musk", "Amber"],
    description: "6-piece set + QR → MetaMuse 001. Rare crown candle unlocks full AI Squad.",
    image: "sheikha"
  },
  {
    id: "serenity-bag",
    name: "Serenity Ritual Bag",
    type: "bag",
    price: 199,
    scents: ["Lavender", "Lime", "Lemon"],
    description: "6-piece set + QR → MetaMuse 001. Rare crown candle unlocks full AI Squad.",
    image: "serenity"
  },
  {
    id: "floral-bag",
    name: "Floral Ritual Bag",
    type: "bag",
    price: 199,
    scents: ["White Rose", "Red Rose", "Jasmine"],
    description: "6-piece set + QR → MetaMuse 001. Rare crown candle unlocks full AI Squad.",
    image: "floral"
  },
  {
    id: "trio-bundle",
    name: "Trio Bundle",
    type: "bundle",
    price: 499,
    scents: [],
    description: "All three Ritual Bags in one luxurious collection. Save $98.",
    image: "bundle"
  }
];
