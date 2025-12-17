import { db } from "./db";
import { voyages } from "@shared/schema";

const METAHERS_VOYAGES = [
  // Voyage 01 — The Vision Board Voyage
  {
    title: "The Vision Board Voyage",
    slug: "vision-board-voyage",
    category: "AI" as const,
    venueType: "Duffy_Boat" as const,
    description: "A luxury initiation into MetaHers. Women create a personalized, AI-generated digital vision board inside the MetaHers app. This voyage sets direction for lifestyle, business, and self-image while gently onboarding participants into AI without jargon or overwhelm.",
    shortDescription: "Create your AI-powered digital vision board on a luxury pink Duffy boat.",
    date: new Date("2025-01-20T15:00:00"),
    time: "3:00 PM",
    duration: "2.5 hours",
    price: 39700, // $397
    maxCapacity: 8,
    currentBookings: 2,
    location: "Duffy boat · Balboa Island / Newport Harbor",
    latitude: "33.6020",
    longitude: "-117.8950",
    learningObjectives: [
      "Generate stunning visuals with AI image tools",
      "Create a comprehensive digital vision board",
      "Master prompt engineering for visual clarity",
      "Align your brand with AI-generated aesthetics",
      "Build your personal creative AI toolkit"
    ],
    included: [
      "Soft drinks and gourmet snacks",
      "AI image generation credit pack",
      "Digital vision board template",
      "Private pink Duffy boat experience",
      "Vision board download and sharing guide",
      "Exclusive MetaHers community access"
    ],
    heroImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
    status: "upcoming" as const,
    sequenceNumber: 1,
    hostName: "Melissa",
    hostBio: "AI educator and founder of MetaHers, helping women embrace technology with confidence.",
  },

  // Voyage 02 — Web3 Without Fear
  {
    title: "Web3 Without Fear",
    slug: "web3-without-fear",
    category: "Web3" as const,
    venueType: "Brunch" as const,
    description: "A soft introduction to Web3, wallets, digital identity, and ownership—explained simply, visually, and practically for women with no tech background.",
    shortDescription: "Learn Web3 fundamentals in a judgment-free, accessible environment.",
    date: new Date("2025-01-25T10:30:00"),
    time: "10:30 AM",
    duration: "3 hours",
    price: 49700,
    maxCapacity: 10,
    currentBookings: 3,
    location: "Café / lounge setting",
    latitude: "33.6050",
    longitude: "-117.9000",
    learningObjectives: [
      "Understand digital ownership and wallets",
      "Learn about the new internet without jargon",
      "Set up your first digital identity",
      "Explore blockchain fundamentals practically",
      "Identify Web3 opportunities for your life"
    ],
    included: [
      "Full gourmet brunch",
      "Coffee and tea service",
      "Digital wallet setup guide",
      "Web3 glossary and cheat sheet",
      "Private Discord community access",
      "Follow-up Q&A session"
    ],
    heroImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800",
    status: "upcoming" as const,
    sequenceNumber: 2,
    hostName: "Melissa",
    hostBio: "Web3 advocate helping women navigate the decentralized future with clarity.",
  },

  // Voyage 03 — Crypto Confidence
  {
    title: "Crypto Confidence",
    slug: "crypto-confidence",
    category: "Crypto" as const,
    venueType: "Brunch" as const,
    description: "Crypto explained clearly: what it is, why it matters, and how women can approach it intelligently and safely without hype or pressure.",
    shortDescription: "Master crypto fundamentals over an educational brunch.",
    date: new Date("2025-02-01T10:00:00"),
    time: "10:00 AM",
    duration: "3 hours",
    price: 49700,
    maxCapacity: 10,
    currentBookings: 4,
    location: "Private space / café",
    latitude: "33.6050",
    longitude: "-117.9000",
    learningObjectives: [
      "Understand cryptocurrency without hype",
      "Learn why crypto matters for the future",
      "Approach crypto intelligently and safely",
      "Set up your first secure wallet",
      "Make informed investment decisions"
    ],
    included: [
      "Full gourmet brunch",
      "Coffee and tea service",
      "$25 in crypto to start your journey",
      "Security best practices guide",
      "Crypto glossary and resources",
      "Private community access"
    ],
    heroImage: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800",
    status: "upcoming" as const,
    sequenceNumber: 3,
    hostName: "Melissa",
    hostBio: "Crypto educator on a mission to demystify digital currency for women.",
  },

  // Voyage 04 — NFTs Beyond Art
  {
    title: "NFTs Beyond Art",
    slug: "nfts-beyond-art",
    category: "Web3" as const,
    venueType: "Picnic" as const,
    description: "NFTs demystified. Real use cases beyond art—membership, access, storytelling, and digital assets that support brands and communities.",
    shortDescription: "Discover practical NFT applications beyond digital art.",
    date: new Date("2025-02-08T16:00:00"),
    time: "4:00 PM",
    duration: "3 hours",
    price: 49700,
    maxCapacity: 10,
    currentBookings: 1,
    location: "Creative space",
    latitude: "33.5850",
    longitude: "-117.8678",
    learningObjectives: [
      "Understand NFT value and utility",
      "Explore membership and access use cases",
      "Learn NFT storytelling for brands",
      "Create your first NFT",
      "Build community with digital assets"
    ],
    included: [
      "Luxury picnic setup",
      "Wine and charcuterie",
      "NFT creation tutorial",
      "Use case exploration guide",
      "Community building framework",
      "Digital asset templates"
    ],
    heroImage: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800",
    status: "upcoming" as const,
    sequenceNumber: 4,
    hostName: "Melissa",
    hostBio: "NFT strategist showing women the real potential beyond digital art.",
  },

  // Voyage 05 — AI Agents for Life & Business
  {
    title: "AI Agents for Life & Business",
    slug: "ai-agents-life-business",
    category: "AI" as const,
    venueType: "Brunch" as const,
    description: "Women discover how AI agents can replace overwhelm—handling content, planning, ideas, and daily tasks as a digital assistant.",
    shortDescription: "Automate your life with AI agents over a transformative brunch.",
    date: new Date("2025-02-15T10:00:00"),
    time: "10:00 AM",
    duration: "3 hours",
    price: 49700,
    maxCapacity: 10,
    currentBookings: 2,
    location: "Lounge / co-working space",
    latitude: "33.6050",
    longitude: "-117.9000",
    learningObjectives: [
      "Understand AI agents and automation",
      "Replace overwhelm with digital support",
      "Handle content creation automatically",
      "Set up planning and scheduling agents",
      "Build your personal AI assistant team"
    ],
    included: [
      "Full gourmet brunch",
      "Fresh juices and coffee",
      "AI agent setup guide",
      "Automation templates and workflows",
      "Integration checklist",
      "Monthly automation updates"
    ],
    heroImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
    status: "upcoming" as const,
    sequenceNumber: 5,
    hostName: "Melissa",
    hostBio: "AI automation specialist helping women work smarter, not harder.",
  },

  // Voyage 06 — The Metaverse Experience
  {
    title: "The Metaverse Experience",
    slug: "metaverse-experience",
    category: "Web3" as const,
    venueType: "Duffy_Boat" as const,
    description: "An introduction to virtual worlds, spatial experiences, and how women can use immersive environments for community, creativity, and business.",
    shortDescription: "Explore virtual worlds and immersive experiences on our pink Duffy boat.",
    date: new Date("2025-02-22T14:00:00"),
    time: "2:00 PM",
    duration: "3 hours",
    price: 59700,
    maxCapacity: 8,
    currentBookings: 0,
    location: "Hybrid / virtual + physical",
    latitude: "33.6075",
    longitude: "-117.8989",
    learningObjectives: [
      "Understand virtual worlds and metaverses",
      "Explore spatial experiences and avatars",
      "Build community in immersive spaces",
      "Create and monetize virtual content",
      "Position your business in Web3 spaces"
    ],
    included: [
      "Sunset champagne cruise",
      "Artisan appetizers",
      "VR/metaverse experience introduction",
      "Avatar creation guidance",
      "Virtual business playbook",
      "Community connection resources"
    ],
    heroImage: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800",
    status: "upcoming" as const,
    sequenceNumber: 6,
    hostName: "Melissa",
    hostBio: "Metaverse pioneer helping women claim their space in virtual worlds.",
  },

  // Voyage 07 — Blockchain Made Simple
  {
    title: "Blockchain Made Simple",
    slug: "blockchain-made-simple",
    category: "Crypto" as const,
    venueType: "Picnic" as const,
    description: "Blockchain explained without jargon—what it actually does, why it exists, and how it quietly powers future systems women interact with.",
    shortDescription: "Understand blockchain technology over a serene beach picnic.",
    date: new Date("2025-03-01T16:00:00"),
    time: "4:00 PM",
    duration: "3 hours",
    price: 49700,
    maxCapacity: 10,
    currentBookings: 0,
    location: "Café / lounge",
    latitude: "33.5936",
    longitude: "-117.8767",
    learningObjectives: [
      "Understand blockchain fundamentals",
      "Learn what blockchain actually does",
      "Explore real-world blockchain applications",
      "Understand trust and transparency benefits",
      "See how blockchain powers your future"
    ],
    included: [
      "Gourmet picnic spread",
      "Premium wine and sparkling water",
      "Blockchain visual guide",
      "Technology comparison chart",
      "Future applications exploration",
      "Beach sunset meditation"
    ],
    heroImage: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800",
    status: "upcoming" as const,
    sequenceNumber: 7,
    hostName: "Melissa",
    hostBio: "Blockchain educator demystifying technology for everyday women.",
  },

  // Voyage 08 — AI-Powered Content Creation
  {
    title: "AI-Powered Content Creation",
    slug: "ai-content-creation",
    category: "AI" as const,
    venueType: "Brunch" as const,
    description: "Women learn how to create high-end content using AI—images, videos, captions—without showing their face if they don't want to.",
    shortDescription: "Create stunning content with AI over a luxurious brunch.",
    date: new Date("2025-03-08T10:00:00"),
    time: "10:00 AM",
    duration: "3 hours",
    price: 49700,
    maxCapacity: 10,
    currentBookings: 3,
    location: "Creative studio / café",
    latitude: "33.6050",
    longitude: "-117.9000",
    learningObjectives: [
      "Create high-end visuals with AI",
      "Generate professional videos without a face",
      "Write compelling AI-powered captions",
      "Build a month's worth of content",
      "Maintain authenticity with AI tools"
    ],
    included: [
      "Full gourmet brunch",
      "Bottomless mimosas",
      "AI content creation template pack",
      "Video generation guide",
      "Caption and copy frameworks",
      "Recording of session"
    ],
    heroImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
    status: "upcoming" as const,
    sequenceNumber: 8,
    hostName: "Melissa",
    hostBio: "Content creator helping women build visibility with AI authentically.",
  },

  // Voyage 09 — AI-Powered Personal Branding
  {
    title: "AI-Powered Personal Branding",
    slug: "ai-personal-branding",
    category: "AI" as const,
    venueType: "Picnic" as const,
    description: "Participants shape a magnetic personal brand using AI—clarifying voice, visuals, messaging, and online authority.",
    shortDescription: "Build your magnetic personal brand with AI guidance.",
    date: new Date("2025-03-15T16:00:00"),
    time: "4:00 PM",
    duration: "3 hours",
    price: 49700,
    maxCapacity: 10,
    currentBookings: 2,
    location: "Private session space",
    latitude: "33.5850",
    longitude: "-117.8678",
    learningObjectives: [
      "Clarify your unique positioning",
      "Craft your signature brand voice",
      "Create magnetic visual branding",
      "Develop consistent messaging",
      "Build online authority strategically"
    ],
    included: [
      "Luxury picnic setup",
      "Wine and charcuterie",
      "Brand strategy workbook",
      "AI prompt pack for branding",
      "Visual identity templates",
      "Brand asset checklist"
    ],
    heroImage: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
    status: "upcoming" as const,
    sequenceNumber: 9,
    hostName: "Melissa",
    hostBio: "Brand strategist blending AI with authentic personal storytelling.",
  },

  // Voyage 10 — Moms Using AI
  {
    title: "Moms Using AI",
    slug: "moms-using-ai",
    category: "AI" as const,
    venueType: "Brunch" as const,
    description: "How mothers can use AI to reclaim time, organize life, support kids, and build ideas—without becoming 'tech people.'",
    shortDescription: "Reclaim your time as a mom with practical AI tools.",
    date: new Date("2025-03-22T10:00:00"),
    time: "10:00 AM",
    duration: "3 hours",
    price: 49700,
    maxCapacity: 10,
    currentBookings: 1,
    location: "Café / family-friendly space",
    latitude: "33.6050",
    longitude: "-117.9000",
    learningObjectives: [
      "Use AI to reclaim time",
      "Organize family life with automation",
      "Support kids with AI tools",
      "Build business ideas without overwhelm",
      "Balance motherhood with ambition"
    ],
    included: [
      "Healthy gourmet brunch",
      "Fresh juices and coffee",
      "Mom + AI toolkit",
      "Family organization templates",
      "Kid-friendly AI apps guide",
      "Mom community access"
    ],
    heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    status: "upcoming" as const,
    sequenceNumber: 10,
    hostName: "Melissa",
    hostBio: "Mom and entrepreneur helping mothers leverage AI for time and sanity.",
  },

  // Voyage 11 — Bitcoin & the Bigger Picture
  {
    title: "Bitcoin & the Bigger Picture",
    slug: "bitcoin-bigger-picture",
    category: "Crypto" as const,
    venueType: "Picnic" as const,
    description: "Bitcoin explained calmly and clearly—why it exists, how it differs from crypto, and why it matters in the long run.",
    shortDescription: "Understand Bitcoin's role in your financial future.",
    date: new Date("2025-04-05T16:00:00"),
    time: "4:00 PM",
    duration: "3 hours",
    price: 49700,
    maxCapacity: 10,
    currentBookings: 0,
    location: "Private lounge",
    latitude: "33.5936",
    longitude: "-117.8767",
    learningObjectives: [
      "Understand Bitcoin's purpose and history",
      "Learn how Bitcoin differs from crypto",
      "Explore long-term value propositions",
      "Evaluate Bitcoin for your portfolio",
      "Plan sovereign financial independence"
    ],
    included: [
      "Gourmet picnic spread",
      "Premium wine and sparkling water",
      "Bitcoin history and evolution guide",
      "Comparison with altcoins chart",
      "Long-term investment strategy",
      "Financial independence workbook"
    ],
    heroImage: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800",
    status: "upcoming" as const,
    sequenceNumber: 11,
    hostName: "Melissa",
    hostBio: "Bitcoin advocate helping women understand true financial sovereignty.",
  },

  // Voyage 12 — The MetaHers Salon
  {
    title: "The MetaHers Salon",
    slug: "metahers-salon",
    category: "AI_Branding" as const,
    venueType: "Duffy_Boat" as const,
    description: "A refined networking voyage bringing together women from all previous voyages to connect, collaborate, and grow inside the MetaHers ecosystem.",
    shortDescription: "Connect with fellow MetaHers women in an elegant social experience.",
    date: new Date("2025-04-12T15:00:00"),
    time: "3:00 PM",
    duration: "4 hours",
    price: 79700,
    maxCapacity: 20,
    currentBookings: 5,
    location: "Elegant social venue",
    latitude: "33.6075",
    longitude: "-117.8989",
    learningObjectives: [
      "Build meaningful connections with MetaHers women",
      "Explore collaboration opportunities",
      "Share wins and learn from others",
      "Expand your network strategically",
      "Grow together in the MetaHers ecosystem"
    ],
    included: [
      "Champagne and appetizers",
      "Extended 4-hour experience",
      "Curated introductions",
      "Collaboration matchmaking",
      "Exclusive MetaHers network access",
      "Monthly salon invitations"
    ],
    heroImage: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800",
    status: "upcoming" as const,
    sequenceNumber: 12,
    hostName: "Melissa",
    hostBio: "Community builder connecting women through shared growth and vision.",
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
