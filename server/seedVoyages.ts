import { db } from "./db";
import { voyages } from "@shared/schema";

const METAHERS_VOYAGES = [
  // AI MASTERY VOYAGES (4)
  {
    title: "AI Mastery: From Curious to Confident",
    slug: "ai-mastery-curious-to-confident",
    category: "AI" as const,
    venueType: "Duffy_Boat" as const,
    description: "Set sail on Balboa Bay aboard our signature pink Duffy boat as we demystify artificial intelligence together. Learn how to use ChatGPT, Claude, and other AI tools to 10x your productivity. By sunset, you'll have created your first AI workflows and feel like an AI native. Perfect for beginners who want to understand what's possible.",
    shortDescription: "Master AI fundamentals on a luxury pink Duffy boat cruise around Balboa Bay.",
    date: new Date("2025-01-18T14:00:00"),
    time: "2:00 PM",
    duration: "3 hours",
    price: 49700, // $497
    maxCapacity: 6,
    currentBookings: 3,
    location: "Balboa Island Ferry Terminal, Balboa",
    latitude: "33.6075",
    longitude: "-117.8989",
    learningObjectives: [
      "Understand how AI actually works (no tech background needed)",
      "Master ChatGPT and Claude for everyday tasks",
      "Create your first AI-powered workflows",
      "Learn prompt engineering secrets",
      "Build a personal AI toolkit"
    ],
    included: [
      "Champagne toast at sunset",
      "Gourmet cheese and charcuterie board",
      "Digital workbook and AI prompt library",
      "Private Duffy boat experience",
      "Post-voyage AI resource guide",
      "MetaHers community access"
    ],
    heroImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
    status: "upcoming" as const,
    sequenceNumber: 1,
    hostName: "Melissa",
    hostBio: "AI educator and founder of MetaHers, helping women embrace technology with confidence.",
  },
  {
    title: "AI for Content Creation: Write, Design, Automate",
    slug: "ai-content-creation",
    category: "AI" as const,
    venueType: "Brunch" as const,
    description: "Transform your content game with AI. Learn to write blog posts, social captions, and emails in minutes. Create stunning visuals with Midjourney and DALL-E. Set up automations that work while you sleep. Leave with a month's worth of content ready to publish.",
    shortDescription: "Create stunning content with AI over a luxurious brunch experience.",
    date: new Date("2025-02-08T10:00:00"),
    time: "10:00 AM",
    duration: "3 hours",
    price: 49700,
    maxCapacity: 6,
    currentBookings: 5,
    location: "Balboa Bay Resort Dining, Balboa",
    latitude: "33.6050",
    longitude: "-117.9000",
    learningObjectives: [
      "Write week's worth of content in 30 minutes",
      "Create professional visuals with AI image generators",
      "Set up content repurposing automations",
      "Build your personal brand voice with AI",
      "Master social media scheduling with AI"
    ],
    included: [
      "Full gourmet brunch",
      "Bottomless mimosas",
      "AI content template pack",
      "Canva Pro tips and tricks",
      "1-month content calendar template",
      "Recording of session"
    ],
    heroImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
    status: "upcoming" as const,
    sequenceNumber: 2,
    hostName: "Melissa",
    hostBio: "Content strategist and AI enthusiast helping women build magnetic personal brands.",
  },
  {
    title: "AI Business Accelerator: Scale Your Business",
    slug: "ai-business-accelerator",
    category: "AI" as const,
    venueType: "Picnic" as const,
    description: "Take your business to the next level with AI. Learn to automate customer service, streamline operations, and make data-driven decisions. This sunset beach picnic combines strategic business planning with hands-on AI implementation.",
    shortDescription: "Scale your business with AI during a luxury sunset beach picnic.",
    date: new Date("2025-02-22T16:00:00"),
    time: "4:00 PM",
    duration: "3 hours",
    price: 59700, // $597
    maxCapacity: 6,
    currentBookings: 2,
    location: "Crystal Cove State Beach",
    latitude: "33.5717",
    longitude: "-117.8407",
    learningObjectives: [
      "Automate customer support with AI chatbots",
      "Use AI for market research and competitive analysis",
      "Create AI-powered email sequences",
      "Implement AI tools for project management",
      "Build an AI operations playbook for your business"
    ],
    included: [
      "Gourmet picnic basket",
      "Premium wine selection",
      "Beach blankets and pillows",
      "Sunset photography session",
      "AI business toolkit",
      "30-day implementation guide"
    ],
    heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    status: "upcoming" as const,
    sequenceNumber: 3,
    hostName: "Melissa",
    hostBio: "Business strategist helping women entrepreneurs leverage AI for growth.",
  },
  {
    title: "AI Advanced: Build Custom GPTs & Agents",
    slug: "ai-advanced-custom-gpts",
    category: "AI" as const,
    venueType: "Duffy_Boat" as const,
    description: "Ready for the next level? Join us aboard our luxurious pink Duffy boat for an advanced voyage into custom GPTs, AI agents, and autonomous workflows. For women who've mastered the basics and want to become AI power users. Create tools your team will use daily.",
    shortDescription: "Build custom AI tools on an exclusive pink Duffy boat experience in Balboa.",
    date: new Date("2025-03-15T14:00:00"),
    time: "2:00 PM",
    duration: "4 hours",
    price: 79700, // $797
    maxCapacity: 6,
    currentBookings: 1,
    location: "Balboa Island Ferry Terminal, Balboa",
    latitude: "33.6075",
    longitude: "-117.8989",
    learningObjectives: [
      "Build custom GPTs for your business",
      "Create AI agents that work autonomously",
      "Connect AI tools with Zapier and Make",
      "Implement RAG (Retrieval Augmented Generation)",
      "Deploy AI solutions for your team"
    ],
    included: [
      "Champagne and appetizers",
      "Extended 4-hour cruise",
      "Advanced AI workbook",
      "Custom GPT templates",
      "1:1 follow-up call with Melissa",
      "Exclusive alumni community access"
    ],
    heroImage: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=800",
    status: "upcoming" as const,
    sequenceNumber: 4,
    hostName: "Melissa",
    hostBio: "AI builder and educator, passionate about democratizing advanced AI tools.",
  },

  // CRYPTO VOYAGES (3)
  {
    title: "Crypto 101: Your First Wallet & Bitcoin",
    slug: "crypto-101-first-wallet",
    category: "Crypto" as const,
    venueType: "Brunch" as const,
    description: "Demystify cryptocurrency in a safe, judgment-free space. By the end of brunch, you'll have your own crypto wallet, understand blockchain basics, and make your first (small) investment. No prior experience needed—just curiosity.",
    shortDescription: "Learn crypto fundamentals over a luxurious oceanview brunch.",
    date: new Date("2025-01-25T10:30:00"),
    time: "10:30 AM",
    duration: "3 hours",
    price: 49700,
    maxCapacity: 6,
    currentBookings: 4,
    location: "Balboa Bay Restaurant, Balboa",
    latitude: "33.6050",
    longitude: "-117.9000",
    learningObjectives: [
      "Understand blockchain and why it matters",
      "Set up your first secure crypto wallet",
      "Learn about Bitcoin, Ethereum, and major coins",
      "Make your first cryptocurrency purchase safely",
      "Identify and avoid common crypto scams"
    ],
    included: [
      "Full gourmet brunch",
      "Coffee and tea service",
      "$25 in Bitcoin to start your portfolio",
      "Hardware wallet setup guide",
      "Crypto glossary and cheat sheet",
      "Private Discord community access"
    ],
    heroImage: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800",
    status: "upcoming" as const,
    sequenceNumber: 5,
    hostName: "Melissa",
    hostBio: "Crypto educator on a mission to help women take control of their financial futures.",
  },
  {
    title: "DeFi Decoded: Passive Income with Crypto",
    slug: "defi-decoded-passive-income",
    category: "Crypto" as const,
    venueType: "Duffy_Boat" as const,
    description: "Go beyond holding crypto—learn to make it work for you aboard our signature pink Duffy boat. Explore DeFi protocols, staking, and yield farming while cruising Balboa Bay. Understand the risks and rewards, and set up your first passive income streams.",
    shortDescription: "Unlock DeFi on our iconic pink Duffy boat in Balboa.",
    date: new Date("2025-02-15T14:00:00"),
    time: "2:00 PM",
    duration: "3 hours",
    price: 59700,
    maxCapacity: 6,
    currentBookings: 2,
    location: "Balboa Island Ferry Terminal, Balboa",
    latitude: "33.6075",
    longitude: "-117.8989",
    learningObjectives: [
      "Understand DeFi and how it differs from traditional finance",
      "Learn staking and yield farming fundamentals",
      "Set up your first DeFi position",
      "Evaluate protocol risks and security",
      "Build a balanced DeFi portfolio strategy"
    ],
    included: [
      "Sunset champagne service",
      "Artisan cheese platter",
      "DeFi strategy workbook",
      "Protocol comparison guide",
      "Risk assessment checklist",
      "Follow-up Q&A call"
    ],
    heroImage: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800",
    status: "upcoming" as const,
    sequenceNumber: 6,
    hostName: "Melissa",
    hostBio: "DeFi strategist helping women navigate the world of decentralized finance.",
  },
  {
    title: "Crypto Tax & Security Masterclass",
    slug: "crypto-tax-security",
    category: "Crypto" as const,
    venueType: "Picnic" as const,
    description: "The unsexy but essential crypto knowledge. Learn to track your transactions, report taxes correctly, and secure your assets like a pro. This sunset picnic session could save you thousands in taxes and protect your wealth.",
    shortDescription: "Master crypto taxes and security during a gourmet beach picnic.",
    date: new Date("2025-03-08T16:00:00"),
    time: "4:00 PM",
    duration: "3 hours",
    price: 49700,
    maxCapacity: 6,
    currentBookings: 0,
    location: "Corona del Mar State Beach",
    latitude: "33.5936",
    longitude: "-117.8767",
    learningObjectives: [
      "Understand crypto tax obligations",
      "Set up proper transaction tracking",
      "Maximize tax-advantaged strategies",
      "Implement hardware wallet security",
      "Create a crypto estate plan"
    ],
    included: [
      "Gourmet picnic spread",
      "Premium wine and sparkling water",
      "Tax planning worksheet",
      "Security checklist",
      "CPA resource guide",
      "Beach sunset meditation"
    ],
    heroImage: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800",
    status: "upcoming" as const,
    sequenceNumber: 7,
    hostName: "Melissa",
    hostBio: "Helping women protect and grow their crypto wealth with smart planning.",
  },

  // WEB3 VOYAGES (2)
  {
    title: "Web3 Foundations: NFTs, DAOs & The Future Internet",
    slug: "web3-foundations",
    category: "Web3" as const,
    venueType: "Brunch" as const,
    description: "Step into the future of the internet. Understand NFTs beyond the hype, explore how DAOs are revolutionizing collaboration, and discover Web3 opportunities for creators and entrepreneurs. See the big picture of where technology is heading.",
    shortDescription: "Explore the future of Web3 over an inspiring brunch experience.",
    date: new Date("2025-02-01T10:00:00"),
    time: "10:00 AM",
    duration: "3 hours",
    price: 49700,
    maxCapacity: 6,
    currentBookings: 3,
    location: "Balboa Bay Resort Dining, Balboa",
    latitude: "33.6050",
    longitude: "-117.9000",
    learningObjectives: [
      "Understand Web3 and why it's transformative",
      "Navigate NFT marketplaces confidently",
      "Learn how DAOs work and why they matter",
      "Identify Web3 opportunities in your industry",
      "Create your first NFT"
    ],
    included: [
      "Farm-to-table brunch",
      "Craft coffee and tea",
      "NFT creation tutorial",
      "Web3 opportunity map",
      "Curated reading list",
      "Community membership"
    ],
    heroImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800",
    status: "upcoming" as const,
    sequenceNumber: 8,
    hostName: "Melissa",
    hostBio: "Web3 advocate helping women stake their claim in the decentralized future.",
  },
  {
    title: "Build in Web3: Create & Launch Your Project",
    slug: "build-in-web3",
    category: "Web3" as const,
    venueType: "Duffy_Boat" as const,
    description: "From idea to launch. Aboard our pink Duffy boat, this hands-on voyage helps you conceptualize and start building your Web3 project—whether it's an NFT collection, community, or decentralized app. Leave with a clear roadmap and the skills to execute.",
    shortDescription: "Launch your Web3 project on our pink Duffy boat in Balboa.",
    date: new Date("2025-03-01T14:00:00"),
    time: "2:00 PM",
    duration: "4 hours",
    price: 69700, // $697
    maxCapacity: 6,
    currentBookings: 1,
    location: "Balboa Island Ferry Terminal, Balboa",
    latitude: "33.6075",
    longitude: "-117.8989",
    learningObjectives: [
      "Conceptualize your Web3 project idea",
      "Choose the right blockchain and tools",
      "Create a project roadmap",
      "Build your community strategy",
      "Plan your launch sequence"
    ],
    included: [
      "Extended 4-hour cruise",
      "Champagne and gourmet bites",
      "Project planning templates",
      "Smart contract basics guide",
      "Launch checklist",
      "Mentor matching opportunity"
    ],
    heroImage: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800",
    status: "upcoming" as const,
    sequenceNumber: 9,
    hostName: "Melissa",
    hostBio: "Web3 builder and mentor, passionate about women-led innovation.",
  },

  // AI BRANDING VOYAGES (3)
  {
    title: "AI Personal Branding: Define Your Digital Presence",
    slug: "ai-personal-branding-define",
    category: "AI_Branding" as const,
    venueType: "Picnic" as const,
    description: "Your brand is your story—let AI help you tell it. Discover your unique positioning, craft your brand voice, and create a content strategy that attracts your dream clients. This sunset picnic is where clarity meets creativity.",
    shortDescription: "Craft your personal brand identity during a magical beach picnic.",
    date: new Date("2025-01-11T16:00:00"),
    time: "4:00 PM",
    duration: "3 hours",
    price: 49700,
    maxCapacity: 6,
    currentBookings: 6,
    location: "Little Corona Beach",
    latitude: "33.5850",
    longitude: "-117.8678",
    learningObjectives: [
      "Discover your unique brand positioning",
      "Craft your signature brand voice with AI",
      "Create a magnetic bio and elevator pitch",
      "Develop your content pillars",
      "Build a 90-day content strategy"
    ],
    included: [
      "Luxury picnic setup",
      "Wine and charcuterie",
      "Brand strategy workbook",
      "AI prompt pack for branding",
      "Professional headshot tips",
      "Brand asset checklist"
    ],
    heroImage: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
    status: "full" as const,
    sequenceNumber: 10,
    hostName: "Melissa",
    hostBio: "Brand strategist blending AI with authentic personal storytelling.",
  },
  {
    title: "AI Visual Branding: Design Like a Pro",
    slug: "ai-visual-branding-design",
    category: "AI_Branding" as const,
    venueType: "Brunch" as const,
    description: "Create stunning visual content without hiring a designer. Master AI image generators, Canva, and video tools to build a cohesive visual brand. Walk away with templates, assets, and the skills to maintain brand consistency.",
    shortDescription: "Master AI design tools over a creative brunch session.",
    date: new Date("2025-02-28T10:00:00"),
    time: "10:00 AM",
    duration: "3 hours",
    price: 49700,
    maxCapacity: 6,
    currentBookings: 2,
    location: "Balboa Bay Resort Cafe, Balboa",
    latitude: "33.6050",
    longitude: "-117.9000",
    learningObjectives: [
      "Create AI-generated brand imagery",
      "Design social media templates",
      "Build a cohesive color and font system",
      "Create video content with AI tools",
      "Set up a brand asset library"
    ],
    included: [
      "Healthy gourmet brunch",
      "Fresh juices and coffee",
      "Canva Pro tips guide",
      "AI image prompt library",
      "Template pack (20+ designs)",
      "Brand style guide template"
    ],
    heroImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
    status: "upcoming" as const,
    sequenceNumber: 11,
    hostName: "Melissa",
    hostBio: "Visual strategist helping women create scroll-stopping brand content.",
  },
  {
    title: "AI Authority Building: Become a Thought Leader",
    slug: "ai-authority-building",
    category: "AI_Branding" as const,
    venueType: "Duffy_Boat" as const,
    description: "Position yourself as the go-to expert in your niche. Aboard our signature pink Duffy boat, learn to use AI for thought leadership content, speaking topics, and media opportunities. This voyage is for ambitious women ready to amplify their influence.",
    shortDescription: "Build your authority on our iconic pink Duffy boat in Balboa.",
    date: new Date("2025-03-22T15:00:00"),
    time: "3:00 PM",
    duration: "3 hours",
    price: 59700,
    maxCapacity: 6,
    currentBookings: 0,
    location: "Balboa Island Ferry Terminal, Balboa",
    latitude: "33.6075",
    longitude: "-117.8989",
    learningObjectives: [
      "Define your thought leadership platform",
      "Create a signature framework or methodology",
      "Develop speaking topics and pitches",
      "Build a media kit with AI",
      "Plan your authority content calendar"
    ],
    included: [
      "Sunset champagne cruise",
      "Artisan appetizers",
      "Thought leadership playbook",
      "Media kit templates",
      "Speaking topic generator prompts",
      "PR opportunity guide"
    ],
    heroImage: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800",
    status: "upcoming" as const,
    sequenceNumber: 12,
    hostName: "Melissa",
    hostBio: "Helping ambitious women claim their space as industry thought leaders.",
  },
];

export async function seedVoyages() {
  console.log("🚢 Seeding MetaHers Voyages...");
  
  try {
    // Check if voyages already exist
    const existing = await db.select().from(voyages).limit(1);
    if (existing.length > 0) {
      console.log("Voyages already seeded. Skipping...");
      return;
    }
    
    // Insert all voyages
    for (const voyage of METAHERS_VOYAGES) {
      await db.insert(voyages).values(voyage);
      console.log(`✅ Seeded: ${voyage.title}`);
    }
    
    console.log(`\n🎉 Successfully seeded ${METAHERS_VOYAGES.length} voyages!`);
  } catch (error) {
    console.error("Error seeding voyages:", error);
    throw error;
  }
}

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule || process.argv[1]?.includes('seedVoyages')) {
  seedVoyages()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
