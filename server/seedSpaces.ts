import { db } from "./db";
import { spaces } from "../shared/schema";
import { sql } from "drizzle-orm";

const METAHERS_SPACES = [
  {
    id: "web3",
    name: "Web3",
    slug: "web3",
    description: "Master decentralized technologies and understand the future of the internet. Build your Web3 fluency from fundamentals to real-world applications.",
    icon: "Globe",
    color: "hyper-violet",
    sortOrder: 1,
  },
  {
    id: "crypto",
    name: "NFT/Blockchain/Crypto",
    slug: "crypto",
    description: "Navigate the world of digital assets with confidence. From NFTs to blockchain basics to cryptocurrency trading—understand it all and leverage it for your future.",
    icon: "Coins",
    color: "magenta-quartz",
    sortOrder: 2,
  },
  {
    id: "ai",
    name: "AI",
    slug: "ai",
    description: "Transform how you work with AI tools. From custom GPTs to AI-powered content creation, become fluent in the language of artificial intelligence.",
    icon: "Sparkles",
    color: "cyber-fuchsia",
    sortOrder: 3,
  },
  {
    id: "metaverse",
    name: "Metaverse",
    slug: "metaverse",
    description: "Navigate virtual worlds with confidence. Discover opportunities in immersive digital spaces and build your presence in the metaverse.",
    icon: "Boxes",
    color: "aurora-teal",
    sortOrder: 4,
  },
  {
    id: "branding",
    name: "Branding",
    slug: "branding",
    description: "Build your personal brand and become a thought leader. Master LinkedIn, content systems, and authority positioning while keeping your job.",
    icon: "✨",
    color: "#E91E63",
    sortOrder: 5,
    isActive: true,
  },
  {
    id: "moms",
    name: "Moms",
    slug: "moms",
    description: "A dedicated space for mothers navigating tech careers and entrepreneurship. Balance, growth, and community for moms building in AI and Web3.",
    icon: "Heart",
    color: "hyper-violet",
    sortOrder: 6,
  },
  {
    id: "app-atelier",
    name: "App Atelier",
    slug: "app-atelier",
    description: "Build apps with AI assistance. Turn your ideas into reality with AI-powered development tools and no-code solutions.",
    icon: "Code",
    color: "aurora-teal",
    sortOrder: 7,
  },
  {
    id: "founders-club",
    name: "Founder's Club",
    slug: "founders-club",
    description: "12-week business accelerator: Launch your startup from idea to $10K MRR. Build revenue systems, operations, and marketing with AI + no-code tools.",
    icon: "👑",
    color: "#FFD700",
    sortOrder: 8,
    isActive: true,
  },
  {
    id: "digital-sales",
    name: "Digital Boutique",
    slug: "digital-boutique",
    description: "Launch your online store and start selling in 3 days. Master Shopify, Instagram Shopping, TikTok Shop, and automated marketing. Learn by DOING—not watching—in hands-on workshops where you build your e-commerce business in real-time.",
    icon: "ShoppingBag",
    color: "liquid-gold",
    sortOrder: 9,
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
            description: space.description,
            icon: space.icon,
            color: space.color,
            sortOrder: space.sortOrder,
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