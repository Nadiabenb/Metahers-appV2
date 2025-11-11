import { db } from "./db";
import { transformationalExperiences } from "../shared/schema";
import { sql } from "drizzle-orm";

export const EXPERIENCES: typeof transformationalExperiences.$inferInsert[] = [
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
    spaceId: "crypto",
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
    spaceId: "crypto",
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
    spaceId: "crypto",
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
    spaceId: "crypto",
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
    spaceId: "crypto",
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
    spaceId: "crypto",
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

  // ===== APP ATELIER SPACE (6 experiences) =====
  {
    id: "app-atelier-1-foundations",
    spaceId: "app-atelier",
    title: "No-Code App Foundations",
    slug: "no-code-foundations",
    description: "Discover how to build professional apps without writing code. Understand the tools, platforms, and mindset shift needed to become a no-code creator.",
    learningObjectives: [
      "Understand the no-code movement and its potential",
      "Compare major no-code platforms (Bubble, Glide, Adalo)",
      "Identify which platform fits your app idea",
    ],
    tier: "free", // FREE - Lead magnet
    estimatedMinutes: 25,
    sortOrder: 1,
    content: {
      sections: [
        {
          id: "intro",
          title: "Welcome to No-Code",
          type: "text",
          content: "You don't need to be a programmer to build powerful applications. No-code tools democratize app development for everyone.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "app-atelier-2-mvp",
    spaceId: "app-atelier",
    title: "Design Your MVP",
    slug: "design-mvp",
    description: "Plan your Minimum Viable Product. Learn to identify core features, create user flows, and wireframe your first app.",
    learningObjectives: [
      "Define your MVP scope and features",
      "Create user flows and wireframes",
      "Validate your app idea with potential users",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 40,
    sortOrder: 2,
    content: {
      sections: [
        {
          id: "mvp-planning",
          title: "MVP Strategy",
          type: "interactive",
          content: "Start with the essentials. What's the ONE problem your app solves?",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "app-atelier-3-build",
    spaceId: "app-atelier",
    title: "Build Your First App",
    slug: "build-first-app",
    description: "Hands-on workshop: Build a functional app in 2 hours using Bubble or Glide. From blank canvas to working prototype.",
    learningObjectives: [
      "Set up your no-code development environment",
      "Build core features and user interface",
      "Deploy your first app to the web",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 120,
    sortOrder: 3,
    content: {
      sections: [
        {
          id: "building",
          title: "Build Workshop",
          type: "hands_on_lab",
          content: "Let's build together. You'll leave with a live, functional app.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "app-atelier-4-ai-integration",
    spaceId: "app-atelier",
    title: "AI-Powered Features",
    slug: "ai-powered-features",
    description: "Integrate AI capabilities into your app. Add chatbots, content generation, image creation, and smart recommendations.",
    learningObjectives: [
      "Connect OpenAI API to your no-code app",
      "Build AI-powered features and workflows",
      "Create personalized user experiences",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 50,
    sortOrder: 4,
    content: {
      sections: [
        {
          id: "ai-features",
          title: "AI Integration",
          type: "interactive",
          content: "Make your app intelligent with AI-powered features.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "app-atelier-5-monetization",
    spaceId: "app-atelier",
    title: "Monetize Your App",
    slug: "monetize-app",
    description: "Turn your app into a revenue stream. Implement subscriptions, one-time payments, and freemium models using Stripe.",
    learningObjectives: [
      "Set up Stripe payments in no-code apps",
      "Design pricing tiers and subscription models",
      "Create upgrade flows and paywalls",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 45,
    sortOrder: 5,
    content: {
      sections: [
        {
          id: "monetization",
          title: "Revenue Models",
          type: "text",
          content: "Your app can generate income. Let's set up payments.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "app-atelier-6-launch",
    spaceId: "app-atelier",
    title: "Launch & Scale Your App",
    slug: "launch-scale-app",
    description: "Go from prototype to production. Launch strategy, user acquisition, and scaling best practices for no-code apps.",
    learningObjectives: [
      "Prepare your app for public launch",
      "Set up analytics and user feedback loops",
      "Scale your app as users grow",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 60,
    sortOrder: 6,
    content: {
      sections: [
        {
          id: "launch",
          title: "Launch Strategy",
          type: "hands_on_lab",
          content: "Time to ship. Let's get your app in front of users.",
        },
      ],
    },
    personalizationEnabled: true,
  },

  // ===== FOUNDER'S CLUB SPACE (6 experiences) =====
  {
    id: "founders-club-1-ideation",
    spaceId: "founders-club",
    title: "Validate Your Business Idea",
    slug: "validate-business-idea",
    description: "Turn your idea into a viable business. Learn validation frameworks, customer research, and how to avoid building something nobody wants.",
    learningObjectives: [
      "Test your business idea with real customers",
      "Identify your ideal customer and their pain points",
      "Decide if your idea is worth pursuing",
    ],
    tier: "free", // FREE - Lead magnet
    estimatedMinutes: 30,
    sortOrder: 1,
    content: {
      sections: [
        {
          id: "validation",
          title: "Idea Validation",
          type: "text",
          content: "Before you build, validate. Learn how to test ideas fast and cheap.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "founders-club-2-business-model",
    spaceId: "founders-club",
    title: "Design Your Business Model",
    slug: "design-business-model",
    description: "Map out how you'll make money. From pricing strategy to revenue streams—build a sustainable business model.",
    learningObjectives: [
      "Create your business model canvas",
      "Define pricing and revenue streams",
      "Calculate unit economics and break-even",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 45,
    sortOrder: 2,
    content: {
      sections: [
        {
          id: "business-model",
          title: "Revenue Strategy",
          type: "interactive",
          content: "How will you make money? Let's figure it out.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "founders-club-3-mvp-build",
    spaceId: "founders-club",
    title: "Build Your MVP in 30 Days",
    slug: "build-mvp-30-days",
    description: "Ship fast, iterate faster. Build a working MVP in 30 days using no-code tools and lean methodology.",
    learningObjectives: [
      "Scope your MVP features ruthlessly",
      "Build with no-code/low-code tools",
      "Launch before you're ready (and why that's good)",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 90,
    sortOrder: 3,
    content: {
      sections: [
        {
          id: "mvp-build",
          title: "30-Day Build Sprint",
          type: "hands_on_lab",
          content: "You have 30 days. Let's build something real.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "founders-club-4-first-customers",
    spaceId: "founders-club",
    title: "Get Your First 10 Customers",
    slug: "first-10-customers",
    description: "Customer acquisition from zero. Learn scrappy, founder-led sales tactics that work before you have a marketing budget.",
    learningObjectives: [
      "Find your first customers without ads",
      "Perfect your pitch and close sales",
      "Build word-of-mouth and referrals",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 50,
    sortOrder: 4,
    content: {
      sections: [
        {
          id: "first-customers",
          title: "Customer Acquisition",
          type: "interactive",
          content: "Get scrappy. Let's find your first paying customers.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "founders-club-5-operations",
    spaceId: "founders-club",
    title: "Set Up Business Operations",
    slug: "business-operations",
    description: "Legal, finance, and systems. Set up your LLC, business bank account, accounting software, and essential tools.",
    learningObjectives: [
      "Choose the right business structure (LLC, C-Corp, etc.)",
      "Set up business banking and accounting",
      "Implement essential tools and workflows",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 60,
    sortOrder: 5,
    content: {
      sections: [
        {
          id: "operations",
          title: "Business Foundations",
          type: "text",
          content: "Set up your business infrastructure the right way.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "founders-club-6-scaling",
    spaceId: "founders-club",
    title: "Scale from $0 to $10K MRR",
    slug: "scale-to-10k-mrr",
    description: "Growth strategies that work. Marketing, sales systems, and scaling operations to hit your first $10K monthly recurring revenue.",
    learningObjectives: [
      "Build repeatable marketing and sales systems",
      "Hire your first team member or contractor",
      "Scale without burning out",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 75,
    sortOrder: 6,
    content: {
      sections: [
        {
          id: "scaling",
          title: "Growth Playbook",
          type: "hands_on_lab",
          content: "From traction to growth. Let's scale your business.",
        },
      ],
    },
    personalizationEnabled: true,
  },

  // ===== DIGITAL SALES ACCELERATOR (6 experiences) =====
  {
    id: "digital-sales-1-shopify",
    spaceId: "digital-sales",
    title: "Launch Your Shopify Store",
    slug: "launch-shopify-store",
    description: "Build and launch your Shopify store LIVE in 2 hours. Set up payments, add products, and start taking orders. By the end, your store is live and ready to sell.",
    learningObjectives: [
      "Create and configure your Shopify store",
      "Set up payment processing and shipping zones",
      "Add your first 5 products with optimized descriptions",
      "Launch your store and make it live",
    ],
    tier: "free", // FREE - Lead magnet
    estimatedMinutes: 120,
    sortOrder: 1,
    content: {
      sections: [
        {
          id: "shopify-setup",
          title: "Shopify Quick Wins Setup",
          type: "hands_on_lab",
          content: "Follow along step-by-step as we build your Shopify store together. You'll sign up, pick a theme, configure essentials, and add products in real-time.",
          resources: [
            { title: "Shopify Setup Checklist", url: "/resources/shopify-checklist.pdf", type: "pdf" },
            { title: "Product Description Templates", url: "/resources/product-templates.pdf", type: "pdf" },
          ],
        },
        {
          id: "store-polish",
          title: "Polish & Launch",
          type: "interactive",
          content: "Customize your homepage, set up navigation, and do a mobile preview check. Then we celebrate—your store is LIVE!",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "digital-sales-2-instagram",
    spaceId: "digital-sales",
    title: "Instagram Shopping Activation",
    slug: "instagram-shopping",
    description: "Turn Instagram into a sales channel. Set up Instagram Shopping, create shoppable posts, and start selling where your customers already are.",
    learningObjectives: [
      "Activate Instagram Shopping for your account",
      "Connect your Shopify catalog to Instagram",
      "Create 3 shoppable posts with product tags",
      "Use AI to generate captions and content ideas",
    ],
    tier: "free", // FREE - Lead magnet
    estimatedMinutes: 120,
    sortOrder: 2,
    content: {
      sections: [
        {
          id: "instagram-business",
          title: "Instagram Business Setup",
          type: "hands_on_lab",
          content: "Convert to a Business account, connect your Facebook Page, link your Shopify catalog, and submit for Instagram Shopping approval.",
        },
        {
          id: "shoppable-content",
          title: "Create Shoppable Posts",
          type: "interactive",
          content: "Use proven content formulas to create 3 posts, tag products, and publish them live. Plus learn AI prompts for writing captions in 30 seconds.",
          resources: [
            { title: "Caption Templates", url: "/resources/caption-templates.pdf", type: "pdf" },
            { title: "AI Prompt Library", url: "/resources/ai-prompts.pdf", type: "pdf" },
          ],
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "digital-sales-3-tiktok",
    spaceId: "digital-sales",
    title: "TikTok Shop & Content Creation",
    slug: "tiktok-shop-content",
    description: "Launch TikTok Shop and create content that sells. Film your first 3 TikToks together using viral formulas, go LIVE, and plan 30 days of content with AI.",
    learningObjectives: [
      "Set up TikTok Business and TikTok Shop",
      "Film and post 3 TikToks using proven selling formulas",
      "Complete your first TikTok Live selling session",
      "Generate 30 days of content ideas with AI in 5 minutes",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 120,
    sortOrder: 3,
    content: {
      sections: [
        {
          id: "tiktok-setup",
          title: "TikTok Business & Shop Launch",
          type: "hands_on_lab",
          content: "Create your TikTok Business account, apply for TikTok Shop, and connect your product catalog.",
        },
        {
          id: "viral-content",
          title: "Film Content That Sells",
          type: "hands_on_lab",
          content: "Learn 3 viral formulas (style/try-on, GRWM, behind-the-scenes), film your TikToks RIGHT NOW, edit them, and post them live during the workshop.",
          resources: [
            { title: "TikTok Viral Formulas", url: "/resources/tiktok-formulas.pdf", type: "pdf" },
            { title: "Trending Sounds List", url: "/resources/trending-sounds.pdf", type: "pdf" },
          ],
        },
        {
          id: "content-planning",
          title: "30-Day Content Plan with AI",
          type: "interactive",
          content: "Use AI to generate 30 days of content ideas in 5 minutes. Save your content calendar and never run out of ideas.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "digital-sales-4-email-ads",
    spaceId: "digital-sales",
    title: "Email Marketing & Paid Ads",
    slug: "email-marketing-paid-ads",
    description: "Activate email marketing automation and launch your first ad campaign. Set up welcome emails, abandoned cart recovery, and a $10/day Meta ad—all live during the workshop.",
    learningObjectives: [
      "Set up email marketing platform with 3 essential automations",
      "Create email templates and pop-ups for list building",
      "Launch your first Meta ad campaign with AI-written copy",
      "Use AI to create 20 product descriptions and 14 days of captions",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 120,
    sortOrder: 4,
    content: {
      sections: [
        {
          id: "email-setup",
          title: "Email Marketing Activation",
          type: "hands_on_lab",
          content: "Choose your platform (Klaviyo or Mailchimp), create templates, and build 3 automations: Welcome, Abandoned Cart, and Thank You emails.",
        },
        {
          id: "first-ad",
          title: "Launch Your First Ad",
          type: "hands_on_lab",
          content: "Set up Meta Business Manager, install Facebook Pixel, create ad copy with AI, select your audience, and launch a $10/day campaign live.",
          resources: [
            { title: "Email Marketing Templates", url: "/resources/email-templates.pdf", type: "pdf" },
            { title: "Ad Campaign Setup Guide", url: "/resources/ad-setup.pdf", type: "pdf" },
          ],
        },
        {
          id: "ai-automation",
          title: "AI Content Automation Power Hour",
          type: "interactive",
          content: "Use AI together to create 20 product descriptions (5 min), 14 days of captions (5 min), 5 email subject lines (2 min), and 10 ad variations (3 min).",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "digital-sales-5-operations",
    spaceId: "digital-sales",
    title: "Operations & Analytics",
    slug: "operations-analytics",
    description: "Build systems that scale. Set up inventory sync, order management, customer service automation, and analytics dashboards so you can handle 50+ orders per day smoothly.",
    learningObjectives: [
      "Sync inventory across all platforms automatically",
      "Set up order management and shipping workflows",
      "Build analytics dashboard to track key metrics",
      "Automate customer service with templates and FAQs",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 120,
    sortOrder: 5,
    content: {
      sections: [
        {
          id: "inventory-fulfillment",
          title: "Inventory & Fulfillment Systems",
          type: "hands_on_lab",
          content: "Set up inventory sync, order management workflow, packaging strategy, shipping optimization, and return processes.",
        },
        {
          id: "analytics-money",
          title: "Analytics & Money Tracking",
          type: "interactive",
          content: "Create your dashboard using our template. Connect all platforms to see revenue by channel, best-sellers, CAC, and profit margins in one place.",
          resources: [
            { title: "Analytics Dashboard Template", url: "/resources/dashboard-template.pdf", type: "pdf" },
            { title: "Key Metrics Guide", url: "/resources/key-metrics.pdf", type: "pdf" },
          ],
        },
        {
          id: "customer-service",
          title: "Customer Service Automation",
          type: "text",
          content: "Build FAQs, automated responses, DM templates, and review response systems. Handle difficult customers with confidence.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "digital-sales-6-growth",
    spaceId: "digital-sales",
    title: "Growth Systems & Scaling",
    slug: "growth-systems-scaling",
    description: "Scale what works. Review your results, optimize winning strategies, build customer loyalty programs, and create your 90-day growth roadmap.",
    learningObjectives: [
      "Analyze first week results and identify what's working",
      "Optimize ads and content that perform best",
      "Build loyalty programs and referral systems",
      "Create your personalized 90-day growth roadmap",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 120,
    sortOrder: 6,
    content: {
      sections: [
        {
          id: "scaling-what-works",
          title: "Scaling What Works",
          type: "interactive",
          content: "Review everyone's first week results together. Identify winning ads, viral content, and best-selling products. Make data-driven optimization decisions.",
        },
        {
          id: "community-loyalty",
          title: "Building Community & Loyalty",
          type: "hands_on_lab",
          content: "Create simple loyalty programs, user-generated content strategies, customer referral programs, VIP perks, and Instagram engagement tactics.",
          resources: [
            { title: "Loyalty Program Templates", url: "/resources/loyalty-templates.pdf", type: "pdf" },
            { title: "Referral Program Guide", url: "/resources/referral-guide.pdf", type: "pdf" },
          ],
        },
        {
          id: "long-term-plan",
          title: "Your 90-Day Roadmap",
          type: "interactive",
          content: "Build your personalized 90-day roadmap together. Plan when to hire help, seasonal strategies, work-life balance, and staying ahead of trends.",
        },
      ],
    },
    personalizationEnabled: true,
  },

  // ===== MOMS SPACE (6 experiences) =====
  {
    id: "moms-1-ai-foundations",
    spaceId: "moms",
    title: "AI for Busy Moms: Your Digital Life Assistant",
    slug: "ai-for-busy-moms",
    description: "Master AI tools that give you back 10+ hours every week. Learn practical AI shortcuts for meal planning, homework help, scheduling, and running your household like a CEO.",
    learningObjectives: [
      "Use ChatGPT for meal planning, grocery lists, and recipe modifications",
      "Automate scheduling with AI calendar assistants",
      "Get instant homework help and educational support for your kids",
      "Create AI systems for household management",
    ],
    tier: "free", // FREE - Lead magnet
    estimatedMinutes: 30,
    sortOrder: 1,
    content: {
      sections: [
        {
          id: "ai-intro-moms",
          title: "AI: Your New Best Friend",
          type: "text",
          content: "Discover how AI can be your 24/7 personal assistant, helping you manage family life, save time, and reduce mental load.",
        },
        {
          id: "practical-prompts",
          title: "Mom-Tested AI Prompts",
          type: "interactive",
          content: "Get our library of ready-to-use prompts for meal planning, kid activities, birthday party planning, school forms, and more.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "moms-2-time-automation",
    spaceId: "moms",
    title: "Time-Saving Automation",
    slug: "time-saving-automation",
    description: "Build your automated home office. Set up AI tools that handle repetitive tasks, manage your email, organize photos, and keep your digital life running smoothly.",
    learningObjectives: [
      "Automate email inbox management and responses",
      "Set up AI photo organization and family memory books",
      "Create automated shopping lists and reorder systems",
      "Build digital systems for household routines",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 45,
    sortOrder: 2,
    content: {
      sections: [
        {
          id: "automation-basics",
          title: "Automation for Non-Techies",
          type: "text",
          content: "Simple automation tools that work for busy moms. No coding required.",
        },
        {
          id: "email-sanity",
          title: "Email Inbox Zero",
          type: "hands_on_lab",
          content: "Set up AI email filters, auto-responses, and smart folders to tame your inbox in 15 minutes a day.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "moms-3-side-hustles",
    spaceId: "moms",
    title: "Mom-Friendly Side Hustles",
    slug: "mom-side-hustles",
    description: "Launch a flexible side hustle that fits your life. Explore AI-powered business ideas you can start during nap time, with minimal startup costs and maximum schedule flexibility.",
    learningObjectives: [
      "Identify profitable side hustles that fit mom life",
      "Use AI to create digital products in hours (not months)",
      "Set up simple sales systems that run on autopilot",
      "Balance business goals with family priorities",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 60,
    sortOrder: 3,
    content: {
      sections: [
        {
          id: "side-hustle-ideas",
          title: "20 Mom-Tested Business Ideas",
          type: "interactive",
          content: "From digital downloads to coaching, find the perfect side hustle for your skills, schedule, and goals.",
        },
        {
          id: "first-product",
          title: "Create Your First Product",
          type: "hands_on_lab",
          content: "Use AI to create your first digital product (template, guide, or course) in one focused session.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "moms-4-content-creation",
    spaceId: "moms",
    title: "AI Content for Mom Creators",
    slug: "ai-content-mom-creators",
    description: "Build your personal brand without the overwhelm. Use AI to create authentic content, grow your Instagram/TikTok, and connect with other moms—all while staying true to yourself.",
    learningObjectives: [
      "Create 30 days of social content in one afternoon with AI",
      "Find your authentic voice and niche as a mom creator",
      "Batch create content during kid-free hours",
      "Grow your following with AI-optimized captions and hashtags",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 50,
    sortOrder: 4,
    content: {
      sections: [
        {
          id: "content-strategy",
          title: "Your Mom Creator Strategy",
          type: "interactive",
          content: "Define your niche, message, and content pillars. Stand out without copying other creators.",
        },
        {
          id: "batch-content",
          title: "Batch Content Creation",
          type: "hands_on_lab",
          content: "Film and edit 2 weeks of content in 2 hours. Use AI for captions, hashtags, and scheduling.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "moms-5-kids-education",
    spaceId: "moms",
    title: "AI for Kids Education",
    slug: "ai-kids-education",
    description: "Support your child's learning with AI. Get homework help, create custom learning materials, make school projects easier, and give your kids an edge in their education.",
    learningObjectives: [
      "Use AI as a homework tutor (without doing the work for them)",
      "Create custom learning materials for your child's level",
      "Make school projects more creative with AI tools",
      "Teach your kids safe, responsible AI use",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 40,
    sortOrder: 5,
    content: {
      sections: [
        {
          id: "homework-helper",
          title: "AI Homework Assistant",
          type: "text",
          content: "Help your kids understand concepts without just giving answers. AI prompts for every grade level.",
        },
        {
          id: "learning-materials",
          title: "Custom Learning Materials",
          type: "hands_on_lab",
          content: "Create worksheets, flashcards, and study guides tailored to your child's needs and interests.",
        },
      ],
    },
    personalizationEnabled: true,
  },
  {
    id: "moms-6-community",
    spaceId: "moms",
    title: "Build Your Mom Tribe Online",
    slug: "build-mom-tribe",
    description: "Find and grow your support network. Use AI tools to build an engaged community of like-minded moms, whether it's a Facebook group, Discord server, or local meetup group.",
    learningObjectives: [
      "Start and grow an online community of supportive moms",
      "Use AI to moderate, engage, and create community content",
      "Plan virtual and in-person events that people actually show up to",
      "Monetize your community (if you want to)",
    ],
    tier: "pro", // PRO
    estimatedMinutes: 55,
    sortOrder: 6,
    content: {
      sections: [
        {
          id: "community-launch",
          title: "Launch Your Tribe",
          type: "interactive",
          content: "Choose your platform, set community guidelines, and invite your first members.",
        },
        {
          id: "engagement-strategy",
          title: "Keep Them Coming Back",
          type: "hands_on_lab",
          content: "Create content calendars, conversation starters, and events that build real connections.",
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
