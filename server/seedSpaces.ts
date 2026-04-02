import { db } from "./db";
import { spaces } from "../shared/schema";
import { sql } from "drizzle-orm";

const METAHERS_SPACES = [
  {
    id: "learn-ai",
    name: "Learn AI",
    slug: "learn-ai",
    description: "Master AI tools, prompt engineering, and AI fundamentals. No technical background required.",
    icon: "Sparkles",
    color: "#C9A96E",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "build-ai",
    name: "Build with AI",
    slug: "build-ai",
    description: "Create content, websites, apps, and automated systems using AI tools.",
    icon: "Code",
    color: "#8B2252",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "monetize-ai",
    name: "Monetize with AI",
    slug: "monetize-ai",
    description: "Turn AI skills into offers, revenue streams, and business growth.",
    icon: "TrendingUp",
    color: "#1D9E75",
    sortOrder: 3,
    isActive: true,
  },
  {
    id: "brand-ai",
    name: "Brand with AI",
    slug: "brand-ai",
    description: "Build a personal brand, content strategy, and audience using AI.",
    icon: "Megaphone",
    color: "#378ADD",
    sortOrder: 4,
    isActive: true,
  },
  {
    id: "web3",
    name: "Web3 and Crypto",
    slug: "web3",
    description: "Understand blockchain, crypto, NFTs, DeFi, and the decentralized web.",
    icon: "Globe",
    color: "#BA7517",
    sortOrder: 5,
    isActive: true,
  },
];

export async function seedSpaces() {
  try {
    console.log("Seeding MetaHers World spaces...");

    for (const space of METAHERS_SPACES) {
      await db
        .insert(spaces)
        .values(space)
        .onConflictDoUpdate({
          target: spaces.id,
          set: {
            name: space.name,
            slug: space.slug,
            description: space.description,
            icon: space.icon,
            color: space.color,
            sortOrder: space.sortOrder,
            isActive: space.isActive ?? true,
            updatedAt: sql`now()`,
          },
        });

      console.log(`✓ Seeded space: ${space.name}`);
    }

    console.log("✓ All MetaHers World spaces seeded successfully!");
  } catch (error) {
    console.error("Error seeding spaces:", error);
    throw error;
  }
}

// Note: Removed auto-execution block to prevent deployment issues
// To manually seed: npx tsx server/seedSpaces.ts
// The seed will run automatically during first-time database initialization via registerRoutes
