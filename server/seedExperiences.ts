import { db } from "./db";
import { transformationalExperiences } from "../shared/schema";
import { sql } from "drizzle-orm";

const EXPERIENCES: typeof transformationalExperiences.$inferInsert[] = [
  // ===== WEB3 SPACE (6 experiences) =====
  {
    id: "web3-1-foundations",
    spaceId: "web3",
    title: "Web3 Foundations",
    slug: "web3-foundations",
    description: "Demystify Web3 basics - understand blockchain, decentralization, and why it matters for your business. No tech degree required.",
    learningObjectives: [
      "Understand what Web3 actually means in plain English",
      "Explain blockchain to clients and colleagues confidently",
      "Identify real-world Web3 opportunities for your business",
    ],
    tier: "free", // FREE - Lead magnet
    estimatedMinutes: 25,
    sortOrder: 1,
    content: {
      sections: [
        {
          id: "intro",
          title: "Welcome to Web3",
          type: "text" as const,
          content: "Let's cut through the jargon and understand what Web3 really means for you as a woman building in tech.",
        },
        {
          id: "what-is-web3",
          title: "What is Web3?",
          type: "interactive" as const,
          content: "Web3 is the internet where you own your data, your content, and your digital assets. Think of it as the difference between renting vs. owning.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "web3-2-wallets",
    spaceId: "web3",
    title: "Digital Wallets Decoded",
    slug: "digital-wallets-decoded",
    description: "Set up and secure your first crypto wallet. Understand private keys, seed phrases, and how to stay safe in Web3.",
    learningObjectives: [
      "Create your first secure crypto wallet",
      "Understand private keys and seed phrases",
      "Implement security best practices",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 30,
    sortOrder: 2,
    content: {
      sections: [
        {
          id: "wallet-basics",
          title: "What is a Digital Wallet?",
          type: "text",
          content: "Your gateway to Web3 - learn how wallets work and why they're essential.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "web3-3-smart-contracts",
    spaceId: "web3",
    title: "Smart Contracts 101",
    slug: "smart-contracts-101",
    description: "Understand how smart contracts work and how they're revolutionizing business agreements, payments, and automation.",
    learningObjectives: [
      "Explain smart contracts in simple terms",
      "Identify use cases for your industry",
      "Understand the benefits and limitations",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 35,
    sortOrder: 3,
    content: {
      sections: [
        {
          id: "contracts-intro",
          title: "What are Smart Contracts?",
          type: "text",
          content: "Self-executing agreements that live on the blockchain - no middlemen needed.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "web3-4-defi",
    spaceId: "web3",
    title: "DeFi Demystified",
    slug: "defi-demystified",
    description: "Navigate decentralized finance - understand lending, staking, and liquidity pools without the overwhelm.",
    learningObjectives: [
      "Understand DeFi fundamentals",
      "Evaluate DeFi opportunities and risks",
      "Start with safe, beginner-friendly platforms",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 40,
    sortOrder: 4,
    content: {
      sections: [
        {
          id: "defi-basics",
          title: "What is DeFi?",
          type: "text",
          content: "Banking without banks - learn how decentralized finance is changing money.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "web3-5-daos",
    spaceId: "web3",
    title: "DAOs & Community",
    slug: "daos-community",
    description: "Join or create decentralized autonomous organizations. Build communities that run themselves.",
    learningObjectives: [
      "Understand how DAOs work",
      "Join your first DAO community",
      "Explore DAO governance and voting",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 30,
    sortOrder: 5,
    content: {
      sections: [
        {
          id: "dao-intro",
          title: "What are DAOs?",
          type: "text",
          content: "Organizations run by code and community, not CEOs.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "web3-6-build",
    spaceId: "web3",
    title: "Build Your Web3 Project",
    slug: "build-web3-project",
    description: "Launch your first Web3 initiative - whether it's a community, product, or service. Get hands-on and ship it.",
    learningObjectives: [
      "Plan your Web3 project roadmap",
      "Choose the right tools and platforms",
      "Launch and iterate with confidence",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 50,
    sortOrder: 6,
    content: {
      sections: [
        {
          id: "project-planning",
          title: "Planning Your Project",
          type: "hands_on_lab",
          content: "Time to build something real. We'll guide you step-by-step.",
        },
      ],
    },
    personalizationEnabled: true,
  },

  // ===== AI SPACE (6 experiences) =====
  {
    id: "ai-1-foundations",
    spaceId: "ai",
    title: "AI Essentials",
    slug: "ai-essentials",
    description: "Understand AI, machine learning, and how to use these tools to multiply your productivity and creativity.",
    learningObjectives: [
      "Explain AI and machine learning clearly",
      "Identify AI tools for your workflow",
      "Start using AI ethically and effectively",
    ],
    tier: "free", // FREE - Lead magnet
    estimatedMinutes: 20,
    sortOrder: 1,
    content: {
      sections: [
        {
          id: "ai-intro",
          title: "AI Demystified",
          type: "text",
          content: "AI isn't magic - it's a powerful tool you can master.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "ai-2-chatgpt",
    spaceId: "ai",
    title: "Master ChatGPT & Custom GPTs",
    slug: "master-chatgpt",
    description: "Go beyond basic prompts. Create custom GPTs, build AI assistants, and automate your workflow.",
    learningObjectives: [
      "Write advanced prompts that get results",
      "Build your first custom GPT",
      "Automate repetitive tasks with AI",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 35,
    sortOrder: 2,
    content: {
      sections: [
        {
          id: "prompting",
          title: "Prompt Engineering Mastery",
          type: "interactive",
          content: "The art and science of talking to AI.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "ai-3-content",
    spaceId: "ai",
    title: "AI-Powered Content Creation",
    slug: "ai-content-creation",
    description: "Create blog posts, social media, newsletters, and more - faster and better than ever with AI as your co-pilot.",
    learningObjectives: [
      "Generate high-quality content with AI",
      "Maintain your unique voice and style",
      "Build a content system that scales",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 30,
    sortOrder: 3,
    content: {
      sections: [
        {
          id: "content-intro",
          title: "AI as Your Content Partner",
          type: "text",
          content: "Create more, stress less - AI handles the heavy lifting.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "ai-4-automation",
    spaceId: "ai",
    title: "AI Automation & Workflows",
    slug: "ai-automation",
    description: "Connect AI tools to automate your business processes. From email to social media to client onboarding.",
    learningObjectives: [
      "Map your automation opportunities",
      "Connect AI tools with no-code platforms",
      "Build workflows that run on autopilot",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 40,
    sortOrder: 4,
    content: {
      sections: [
        {
          id: "automation-intro",
          title: "Automation Foundations",
          type: "text",
          content: "Work smarter, not harder - let AI handle the busywork.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "ai-5-image-gen",
    spaceId: "ai",
    title: "AI Image & Video Generation",
    slug: "ai-image-video",
    description: "Create stunning visuals with Midjourney, DALL-E, and AI video tools. Design like a pro, no design skills required.",
    learningObjectives: [
      "Generate professional images with AI",
      "Create video content faster",
      "Build a visual content library",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 35,
    sortOrder: 5,
    content: {
      sections: [
        {
          id: "image-gen",
          title: "AI Visual Creation",
          type: "interactive",
          content: "Turn your ideas into stunning visuals instantly.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "ai-6-product",
    spaceId: "ai",
    title: "Build Your AI-Powered Product",
    slug: "build-ai-product",
    description: "Launch an AI tool, service, or product. From idea to MVP - ship something people will pay for.",
    learningObjectives: [
      "Validate your AI product idea",
      "Build an MVP with no-code tools",
      "Launch and get your first customers",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 60,
    sortOrder: 6,
    content: {
      sections: [
        {
          id: "product-planning",
          title: "AI Product Strategy",
          type: "hands_on_lab",
          content: "Time to build and ship your AI product.",
        },
      ],
    },
    personalizationEnabled: true,
  },

  // ===== METAVERSE SPACE (6 experiences) =====
  {
    id: "metaverse-1-intro",
    spaceId: "metaverse",
    title: "Metaverse Basics",
    slug: "metaverse-basics",
    description: "Navigate virtual worlds, understand spatial computing, and see where digital experiences are heading.",
    learningObjectives: [
      "Understand what the metaverse actually is",
      "Explore major metaverse platforms",
      "Identify opportunities in virtual spaces",
    ],
    tier: "free", // FREE - Lead magnet
    estimatedMinutes: 25,
    sortOrder: 1,
    content: {
      sections: [
        {
          id: "metaverse-intro",
          title: "Welcome to the Metaverse",
          type: "text",
          content: "Virtual worlds where real business happens.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "metaverse-2-platforms",
    spaceId: "metaverse",
    title: "Platform Deep Dive",
    slug: "platform-deep-dive",
    description: "Explore Decentraland, The Sandbox, Spatial, and more. Find the right virtual home for your brand.",
    learningObjectives: [
      "Compare major metaverse platforms",
      "Create your first avatar and presence",
      "Navigate virtual spaces confidently",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 35,
    sortOrder: 2,
    content: {
      sections: [
        {
          id: "platforms",
          title: "Metaverse Platforms",
          type: "interactive",
          content: "Find your virtual home base.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "metaverse-3-events",
    spaceId: "metaverse",
    title: "Virtual Events & Experiences",
    slug: "virtual-events",
    description: "Host conferences, workshops, and networking events in virtual spaces. Reach a global audience.",
    learningObjectives: [
      "Plan and host virtual events",
      "Engage attendees in 3D spaces",
      "Monetize virtual experiences",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 30,
    sortOrder: 3,
    content: {
      sections: [
        {
          id: "events",
          title: "Hosting Virtual Events",
          type: "text",
          content: "Bring people together in immersive spaces.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "metaverse-4-land",
    spaceId: "metaverse",
    title: "Virtual Real Estate",
    slug: "virtual-real-estate",
    description: "Understand virtual land, digital property, and how to buy, sell, or lease metaverse real estate.",
    learningObjectives: [
      "Evaluate virtual land opportunities",
      "Understand digital property rights",
      "Explore metaverse real estate platforms",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 35,
    sortOrder: 4,
    content: {
      sections: [
        {
          id: "land-intro",
          title: "Virtual Land Explained",
          type: "text",
          content: "Digital property is real business.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "metaverse-5-commerce",
    spaceId: "metaverse",
    title: "Metaverse Commerce",
    slug: "metaverse-commerce",
    description: "Sell products and services in virtual worlds. From digital goods to virtual storefronts.",
    learningObjectives: [
      "Set up a virtual storefront",
      "Sell digital and physical goods",
      "Accept crypto payments seamlessly",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 40,
    sortOrder: 5,
    content: {
      sections: [
        {
          id: "commerce",
          title: "Virtual Commerce Basics",
          type: "interactive",
          content: "Build your business in virtual worlds.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "metaverse-6-brand",
    spaceId: "metaverse",
    title: "Build Your Metaverse Presence",
    slug: "metaverse-presence",
    description: "Establish your brand in the metaverse. Create immersive experiences that people remember.",
    learningObjectives: [
      "Design your metaverse brand strategy",
      "Create immersive experiences",
      "Build community in virtual spaces",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 45,
    sortOrder: 6,
    content: {
      sections: [
        {
          id: "brand-strategy",
          title: "Metaverse Branding",
          type: "hands_on_lab",
          content: "Establish your presence in virtual worlds.",
        },
      ],
    },
    personalizationEnabled: true,
  },

  // ===== CRYPTO SPACE (6 experiences) =====
  {
    id: "crypto-1-basics",
    spaceId: "crypto",
    title: "Crypto Foundations",
    slug: "crypto-foundations",
    description: "Understand cryptocurrency beyond the hype. Learn how Bitcoin, Ethereum, and digital money actually work.",
    learningObjectives: [
      "Explain cryptocurrency clearly",
      "Understand blockchain and mining",
      "Navigate the crypto landscape safely",
    ],
    tier: "free", // FREE - Lead magnet
    estimatedMinutes: 25,
    sortOrder: 1,
    content: {
      sections: [
        {
          id: "crypto-intro",
          title: "Crypto 101",
          type: "text",
          content: "Digital money explained without the jargon.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "crypto-2-investing",
    spaceId: "crypto",
    title: "Smart Crypto Investing",
    slug: "crypto-investing",
    description: "Start investing in crypto safely. Understand risk management, portfolio strategy, and how to avoid common mistakes.",
    learningObjectives: [
      "Build a balanced crypto portfolio",
      "Understand market cycles and trends",
      "Implement risk management strategies",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 40,
    sortOrder: 2,
    content: {
      sections: [
        {
          id: "investing",
          title: "Crypto Investment Strategy",
          type: "interactive",
          content: "Invest smart, not scared.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "crypto-3-trading",
    spaceId: "crypto",
    title: "Crypto Trading Basics",
    slug: "crypto-trading",
    description: "Learn trading fundamentals, technical analysis, and how to use exchanges like a pro.",
    learningObjectives: [
      "Read crypto charts and indicators",
      "Execute trades on major exchanges",
      "Understand trading strategies and timing",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 45,
    sortOrder: 3,
    content: {
      sections: [
        {
          id: "trading",
          title: "Trading Fundamentals",
          type: "text",
          content: "Trade with confidence and strategy.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "crypto-4-security",
    spaceId: "crypto",
    title: "Crypto Security & Safety",
    slug: "crypto-security",
    description: "Protect your assets. Master wallet security, avoid scams, and implement best practices.",
    learningObjectives: [
      "Secure your crypto holdings",
      "Identify and avoid common scams",
      "Implement multi-layer security",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 30,
    sortOrder: 4,
    content: {
      sections: [
        {
          id: "security",
          title: "Crypto Security Essentials",
          type: "text",
          content: "Keep your crypto safe and sound.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "crypto-5-taxes",
    spaceId: "crypto",
    title: "Crypto Taxes & Compliance",
    slug: "crypto-taxes",
    description: "Navigate crypto taxes and regulations. Stay compliant while maximizing your gains.",
    learningObjectives: [
      "Understand crypto tax obligations",
      "Track transactions for tax reporting",
      "Work with crypto-savvy accountants",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 35,
    sortOrder: 5,
    content: {
      sections: [
        {
          id: "taxes",
          title: "Crypto Tax Basics",
          type: "text",
          content: "Stay compliant and keep more of your gains.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "crypto-6-business",
    spaceId: "crypto",
    title: "Accept Crypto in Your Business",
    slug: "accept-crypto",
    description: "Start accepting cryptocurrency payments. Integrate crypto into your business model.",
    learningObjectives: [
      "Set up crypto payment processing",
      "Manage crypto business accounting",
      "Market your crypto-friendly business",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 40,
    sortOrder: 6,
    content: {
      sections: [
        {
          id: "business",
          title: "Crypto for Business",
          type: "hands_on_lab",
          content: "Accept crypto payments in your business.",
        },
      ],
    },
    personalizationEnabled: true,
  },

  // ===== NFTs SPACE (6 experiences) =====
  {
    id: "nfts-1-basics",
    spaceId: "nfts",
    title: "NFT Essentials",
    slug: "nft-essentials",
    description: "Understand NFTs beyond the hype. Learn about digital ownership, utility, and real-world applications.",
    learningObjectives: [
      "Explain NFTs in simple terms",
      "Understand use cases beyond art",
      "Navigate NFT marketplaces confidently",
    ],
    tier: "free", // FREE - Lead magnet
    estimatedMinutes: 25,
    sortOrder: 1,
    content: {
      sections: [
        {
          id: "nft-intro",
          title: "What Are NFTs?",
          type: "text",
          content: "Digital ownership explained simply.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "nfts-2-collecting",
    spaceId: "nfts",
    title: "NFT Collecting & Investing",
    slug: "nft-collecting",
    description: "Start your NFT collection strategically. Learn how to evaluate projects, spot quality, and build value.",
    learningObjectives: [
      "Evaluate NFT projects and communities",
      "Buy your first NFT safely",
      "Build a strategic NFT portfolio",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 35,
    sortOrder: 2,
    content: {
      sections: [
        {
          id: "collecting",
          title: "Strategic NFT Collecting",
          type: "interactive",
          content: "Collect with purpose and strategy.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "nfts-3-creating",
    spaceId: "nfts",
    title: "Create & Mint Your NFTs",
    slug: "create-mint-nfts",
    description: "Turn your art, photos, or content into NFTs. Launch your first collection on OpenSea or Rarible.",
    learningObjectives: [
      "Create NFT-ready digital assets",
      "Mint your first NFT collection",
      "Set up royalties and smart contracts",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 40,
    sortOrder: 3,
    content: {
      sections: [
        {
          id: "creating",
          title: "Creating Your NFTs",
          type: "hands_on_lab",
          content: "Bring your creative work into Web3.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "nfts-4-marketing",
    spaceId: "nfts",
    title: "NFT Marketing & Community",
    slug: "nft-marketing",
    description: "Build hype and community around your NFT project. From Discord to Twitter to launch success.",
    learningObjectives: [
      "Build an engaged NFT community",
      "Market your NFT project effectively",
      "Plan successful NFT launches",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 35,
    sortOrder: 4,
    content: {
      sections: [
        {
          id: "marketing",
          title: "NFT Marketing Strategy",
          type: "text",
          content: "Build community and drive sales.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "nfts-5-utility",
    spaceId: "nfts",
    title: "Utility NFTs & Memberships",
    slug: "utility-nfts",
    description: "Create NFTs that unlock access, benefits, or experiences. Build membership and loyalty programs.",
    learningObjectives: [
      "Design utility-based NFT projects",
      "Create token-gated experiences",
      "Build NFT membership programs",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 40,
    sortOrder: 5,
    content: {
      sections: [
        {
          id: "utility",
          title: "Utility NFTs Explained",
          type: "interactive",
          content: "NFTs that do more than look pretty.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "nfts-6-launch",
    spaceId: "nfts",
    title: "Launch Your NFT Project",
    slug: "launch-nft-project",
    description: "Take your NFT project from concept to successful launch. Plan, build, and sell your collection.",
    learningObjectives: [
      "Plan your complete NFT launch",
      "Build community pre-launch",
      "Execute a successful mint and beyond",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 50,
    sortOrder: 6,
    content: {
      sections: [
        {
          id: "launch",
          title: "NFT Project Launch",
          type: "hands_on_lab",
          content: "Launch your NFT project successfully.",
        },
      ],
    },
    personalizationEnabled: true,
  },

  // ===== AI-POWERED BRANDING SPACE (6 experiences) =====
  {
    id: "branding-1-strategy",
    spaceId: "branding",
    title: "AI Branding Fundamentals",
    slug: "ai-branding-fundamentals",
    description: "Build a powerful brand with AI tools. From positioning to messaging to visual identity.",
    learningObjectives: [
      "Define your brand strategy with AI",
      "Create compelling brand messaging",
      "Position yourself in the market",
    ],
    tier: "free", // FREE - Lead magnet
    estimatedMinutes: 25,
    sortOrder: 1,
    content: {
      sections: [
        {
          id: "branding-intro",
          title: "Brand Strategy with AI",
          type: "text",
          content: "Build a brand that stands out with AI power.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "branding-2-content",
    spaceId: "branding",
    title: "AI Content Strategy",
    slug: "ai-content-strategy",
    description: "Create a content system that builds your brand on autopilot. Blog, social, email, and more.",
    learningObjectives: [
      "Build your AI content engine",
      "Create content pillars and calendars",
      "Maintain consistency across platforms",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 35,
    sortOrder: 2,
    content: {
      sections: [
        {
          id: "content-strategy",
          title: "Content System Building",
          type: "interactive",
          content: "Create content that builds your brand.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "branding-3-social",
    spaceId: "branding",
    title: "AI-Powered Social Media",
    slug: "ai-social-media",
    description: "Grow your audience with AI. Create engaging content, optimize posting, and build community.",
    learningObjectives: [
      "Generate social content with AI",
      "Optimize posting times and frequency",
      "Grow your following strategically",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 30,
    sortOrder: 3,
    content: {
      sections: [
        {
          id: "social-media",
          title: "Social Media with AI",
          type: "text",
          content: "Grow your social presence efficiently.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "branding-4-thought-leadership",
    spaceId: "branding",
    title: "AI Thought Leadership",
    slug: "ai-thought-leadership",
    description: "Position yourself as an authority. Use AI to research, write, and publish thought leadership content.",
    learningObjectives: [
      "Develop your unique point of view",
      "Create high-quality thought leadership",
      "Build authority in your niche",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 40,
    sortOrder: 4,
    content: {
      sections: [
        {
          id: "thought-leadership",
          title: "Becoming a Thought Leader",
          type: "text",
          content: "Build authority with AI-assisted content.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "branding-5-community",
    spaceId: "branding",
    title: "AI Community Building",
    slug: "ai-community-building",
    description: "Build and nurture an engaged community. Use AI to manage conversations, create experiences, and grow together.",
    learningObjectives: [
      "Design your community strategy",
      "Use AI to engage and moderate",
      "Create community-driven growth",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 35,
    sortOrder: 5,
    content: {
      sections: [
        {
          id: "community",
          title: "Community Building Basics",
          type: "interactive",
          content: "Build community with AI tools.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "branding-6-launch",
    spaceId: "branding",
    title: "Launch Your Brand with AI",
    slug: "launch-brand-ai",
    description: "Take your brand from concept to market. Build your complete brand ecosystem with AI assistance.",
    learningObjectives: [
      "Create your complete brand identity",
      "Build your online presence",
      "Launch and grow your brand",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 50,
    sortOrder: 6,
    content: {
      sections: [
        {
          id: "brand-launch",
          title: "Brand Launch Strategy",
          type: "hands_on_lab",
          content: "Launch your brand into the world.",
        },
      ],
    },
    personalizationEnabled: true,
  },
];

export async function seedExperiences() {
  try {
    console.log("Seeding transformational experiences...");
    
    for (const experience of EXPERIENCES) {
      await db
        .insert(transformationalExperiences)
        .values(experience)
        .onConflictDoUpdate({
          target: transformationalExperiences.id,
          set: {
            title: experience.title,
            description: experience.description,
            learningObjectives: experience.learningObjectives,
            tier: experience.tier,
            estimatedMinutes: experience.estimatedMinutes,
            sortOrder: experience.sortOrder,
            content: experience.content,
            personalizationEnabled: experience.personalizationEnabled,
            updatedAt: sql`now()`,
          },
        });
      
      console.log(`✓ Seeded experience: ${experience.title} (${experience.tier})`);
    }
    
    console.log(`✓ All ${EXPERIENCES.length} transformational experiences seeded successfully!`);
    console.log(`  - ${EXPERIENCES.filter(e => e.tier === 'free').length} FREE lead magnets`);
    console.log(`  - ${EXPERIENCES.filter(e => e.tier === 'pro').length} PRO experiences`);
  } catch (error) {
    console.error("Error seeding experiences:", error);
    throw error;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedExperiences()
    .then(() => {
      console.log("Seed completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seed failed:", error);
      process.exit(1);
    });
}
