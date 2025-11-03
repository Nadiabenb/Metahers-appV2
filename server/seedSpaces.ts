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
    id: "ai",
    name: "AI",
    slug: "ai",
    description: "Transform how you work with AI tools. From custom GPTs to AI-powered content creation, become fluent in the language of artificial intelligence.",
    icon: "Sparkles",
    color: "magenta-quartz",
    sortOrder: 2,
  },
  {
    id: "metaverse",
    name: "Metaverse",
    slug: "metaverse",
    description: "Navigate virtual worlds with confidence. Discover opportunities in immersive digital spaces and build your presence in the metaverse.",
    icon: "Boxes",
    color: "cyber-fuchsia",
    sortOrder: 3,
  },
  {
    id: "crypto",
    name: "Crypto",
    slug: "crypto",
    description: "Understand cryptocurrency beyond the hype. Learn how to navigate digital assets safely and leverage crypto for your business and personal growth.",
    icon: "Coins",
    color: "aurora-teal",
    sortOrder: 4,
  },
  {
    id: "nfts",
    name: "NFTs",
    slug: "nfts",
    description: "Create, buy, sell, and leverage NFTs. Understand digital ownership and how to build value in the NFT economy.",
    icon: "Image",
    color: "liquid-gold",
    sortOrder: 5,
  },
  {
    id: "branding",
    name: "AI-Powered Branding",
    slug: "branding",
    description: "Build your brand with AI-powered tools. Master content creation, community building, and personal branding for the digital age.",
    icon: "Megaphone",
    color: "hyper-violet",
    sortOrder: 6,
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

if (import.meta.url === `file://${process.argv[1]}`) {
  seedSpaces()
    .then(() => {
      console.log("Seed completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seed failed:", error);
      process.exit(1);
    });
}
