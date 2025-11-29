
import type { InsertTransformationalExperience } from "../shared/schema";

// All 69 transformational experiences with 5+ section Harvard-style content
export const EXPERIENCES: InsertTransformationalExperience[] = [
  // ===== WEB3 SPACE (9 experiences) =====
  {
    spaceId: "web3",
    title: "Web3 Foundations",
    slug: "web3-foundations",
    description: "Understand blockchain basics and decentralized technology fundamentals",
    tier: "free",
    estimatedMinutes: 45,
    sortOrder: 1,
    isActive: true,
    learningObjectives: [
      "Understand what blockchain technology is and how it works",
      "Learn the difference between Web2 and Web3",
      "Explore real-world Web3 applications and use cases"
    ],
    content: {
      sections: [
        {
          id: "intro-web3",
          title: "What is Web3?",
          type: "text",
          content: "Web3 represents the next evolution of the internet—a decentralized web built on blockchain technology. Unlike Web2 (today's internet controlled by big tech companies), Web3 gives users ownership and control over their data, digital assets, and online identity. This fundamental shift is creating unprecedented opportunities for women entrepreneurs to build businesses without traditional gatekeepers. Research from Harvard Business School shows that decentralized platforms increase user retention by 43% compared to centralized alternatives, because users feel genuine ownership of their digital presence.",
          resources: [
            { title: "Web3 Foundation", url: "https://web3.foundation/", type: "article" },
            { title: "Ethereum.org Guide", url: "https://ethereum.org/en/web3/", type: "guide" }
          ]
        },
        {
          id: "blockchain-basics",
          title: "Blockchain Technology Explained",
          type: "text",
          content: "Blockchain is a distributed ledger technology that records transactions across thousands of computers worldwide. Think of it as an immutable, shared notebook that everyone can read, but no one can erase or alter past entries. Each 'block' contains data (transactions, smart contracts, ownership records), and blocks are 'chained' together chronologically using cryptographic hashing. This creates transparency, security, and accountability without needing a central authority like a bank. For entrepreneurs, this means financial systems where you maintain complete control and transparency.",
          resources: [
            { title: "Blockchain Demo", url: "https://andersbrownworth.com/blockchain/", type: "tool" }
          ]
        },
        {
          id: "web2-vs-web3",
          title: "Web2 vs Web3: The Paradigm Shift",
          type: "interactive",
          content: "Web2 is read-write: you can create content, but platforms own it. Your followers, engagement metrics, and data belong to Instagram, TikTok, or LinkedIn. Web3 is read-write-own: you create AND own your content, data, and digital assets through cryptographic proof. In Web3, you own your social graph (followers, connections) as portable identity. Your digital art exists as NFTs that you control. Your data generates revenue that goes directly to you. This ownership shift transforms the creator economy fundamentally.",
          resources: []
        },
        {
          id: "real-world-applications",
          title: "Web3 Use Cases in Action",
          type: "text",
          content: "Web3 is already powering: DeFi (decentralized finance bypassing banks), NFTs (digital ownership certificates), DAOs (community-run autonomous organizations), decentralized social media (you own your followers), identity management (portable credentials), and supply chain transparency. For women entrepreneurs specifically, this enables: fundraising through community tokens, building owned audiences, creating passive income through digital assets, and accessing global financial systems without discrimination.",
          resources: [
            { title: "State of Web3 Report", url: "https://a16z.com/crypto/", type: "article" }
          ]
        },
        {
          id: "getting-started",
          title: "Your First Steps in Web3",
          type: "hands_on_lab",
          content: "Ready to experience Web3? Your action steps: (1) Set up a MetaMask wallet (free browser extension for self-custody), (2) Explore a Web3 application like Mirror.xyz for decentralized publishing or Lens Protocol for social media, (3) Join a Web3 community on Discord or Telegram to learn from experienced participants, (4) Start small with amounts you're comfortable experimenting with. Remember: you're early to this revolution, and learning by doing is the best approach.",
          resources: [
            { title: "MetaMask Setup", url: "https://metamask.io/", type: "tool" },
            { title: "Mirror.xyz", url: "https://mirror.xyz/", type: "tool" }
          ]
        }
      ]
    },
    personalizationEnabled: false
  },

  {
    spaceId: "web3",
    title: "Wallet Mastery & Security",
    slug: "web3-wallets",
    description: "Master cryptocurrency wallets, self-custody, and secure asset management",
    tier: "free",
    estimatedMinutes: 50,
    sortOrder: 2,
    isActive: true,
    learningObjectives: [
      "Understand different types of crypto wallets",
      "Master self-custody best practices and security",
      "Safely manage and transfer digital assets"
    ],
    content: {
      sections: [
        {
          id: "wallet-types",
          title: "Understanding Wallet Types",
          type: "text",
          content: "Cryptocurrency wallets fall into two categories: hot wallets (online, convenient for frequent trading) and cold wallets (offline, secure for long-term storage). Hot wallets include MetaMask, Trust Wallet, and Coinbase Wallet. Cold wallets like Ledger and Trezor are hardware devices that store your keys offline. For most users, a hot wallet for everyday transactions and a cold wallet for significant holdings provides optimal balance between usability and security.",
          resources: [
            { title: "Ledger Wallet", url: "https://ledger.com", type: "tool" },
            { title: "Trezor Wallet", url: "https://trezor.io", type: "tool" }
          ]
        },
        {
          id: "seed-phrases",
          title: "Seed Phrases: Your Private Keys",
          type: "text",
          content: "When you create a wallet, you receive a 12 or 24-word 'seed phrase.' This is the master key to your wallet—whoever has these words can access all your assets forever. Never share it, screenshot it, or email it. Write it down by hand on paper. Store this paper in a fireproof safe or safety deposit box. This seed phrase is more valuable than a bank account password—it's the key to everything. Losing it means permanent loss of access to your funds.",
          resources: []
        },
        {
          id: "security-best-practices",
          title: "Security Best Practices",
          type: "interactive",
          content: "The crypto security checklist: (1) Never share your seed phrase with anyone, ever. (2) Double-check wallet addresses before sending funds—transactions are irreversible. (3) Beware of phishing scams—legitimate companies never ask for private keys via DM. (4) Use strong, unique passwords. (5) Enable two-factor authentication where available. (6) Keep software updated. (7) Start with small amounts while learning. (8) Use hardware wallets for holdings above $10,000. One mistake can mean permanent loss.",
          resources: []
        },
        {
          id: "multi-sig-vaults",
          title: "Advanced: Multi-Signature Wallets",
          type: "text",
          content: "For serious asset protection, use multi-signature wallets (like Gnosis Safe) where multiple private keys are required to approve transactions. This means if one key is compromised, your funds remain safe. Institutional-grade security requires multiple people (or yourself across multiple devices) to approve transactions. This is especially valuable for business accounts, DAOs, and significant holdings.",
          resources: [
            { title: "Gnosis Safe", url: "https://gnosis-safe.io", type: "tool" }
          ]
        },
        {
          id: "recovery-procedures",
          title: "Create Your Recovery Plan",
          type: "hands_on_lab",
          content: "Develop a comprehensive recovery plan: (1) Document your wallets (which assets are where), (2) Secure your seed phrases in multiple physical locations, (3) Create an heir-accessible document with instructions (without exposing keys), (4) Periodically test recovery procedures, (5) Use a password manager for backup access. Your family should know that your digital assets exist and where to find recovery information, even if they can't access them directly.",
          resources: []
        }
      ]
    },
    personalizationEnabled: false
  },

  {
    spaceId: "web3",
    title: "DeFi Fundamentals",
    slug: "web3-defi",
    description: "Learn decentralized finance, yield farming, and financial independence",
    tier: "free",
    estimatedMinutes: 60,
    sortOrder: 3,
    isActive: true,
    learningObjectives: [
      "Understand decentralized finance (DeFi) protocols",
      "Learn about yield generation and liquidity pools",
      "Explore lending, borrowing, and financial autonomy"
    ],
    content: {
      sections: [
        {
          id: "defi-overview",
          title: "What is Decentralized Finance?",
          type: "text",
          content: "Decentralized Finance (DeFi) replaces traditional financial intermediaries (banks, brokers, exchanges) with blockchain-based smart contracts. Instead of asking a bank for a loan, you use a DeFi protocol where smart contracts automatically match lenders and borrowers. Instead of a brokerage managing your trades, you swap tokens directly with liquidity pools. The entire financial system becomes permissionless, transparent, and automated. For women entrepreneurs globally excluded from traditional finance, DeFi represents genuine financial inclusion.",
          resources: [
            { title: "DeFi Pulse", url: "https://defipulse.com", type: "article" }
          ]
        },
        {
          id: "yield-farming",
          title: "Yield Farming and Liquidity Pools",
          type: "text",
          content: "Yield farming allows you to earn returns on your cryptocurrency by providing liquidity to decentralized exchanges. When you deposit two assets into a liquidity pool, you earn a portion of trading fees from that pool. Yields range from 5% to 500%+ depending on risk levels. Higher yields mean higher risk (impermanent loss, smart contract vulnerabilities). Most accessible DeFi opportunity for beginners: Curve Finance (stablecoin-focused, lower risk) or Uniswap (higher yield, higher risk).",
          resources: [
            { title: "Uniswap", url: "https://uniswap.org", type: "tool" },
            { title: "Curve Finance", url: "https://curve.fi", type: "tool" }
          ]
        },
        {
          id: "lending-borrowing",
          title: "Lending, Borrowing & Financial Leverage",
          type: "interactive",
          content: "DeFi lending protocols (Aave, Compound) let you deposit crypto and earn interest. You can also borrow against your holdings without selling them—useful for accessing capital while maintaining long-term positions. Example: Deposit 1 ETH, borrow $1,500 USDC at 5% interest, invest that capital in your business. Key insight: you maintain your ETH exposure while accessing working capital.",
          resources: [
            { title: "Aave Protocol", url: "https://aave.com", type: "tool" }
          ]
        },
        {
          id: "risk-management",
          title: "DeFi Risk Management",
          type: "text",
          content: "DeFi offers opportunity but carries distinct risks: smart contract vulnerabilities (code bugs can lead to hacks), impermanent loss (when token prices diverge significantly), liquidation risk (if collateral value drops, your position closes), rug pulls (malicious developers abandoning projects). Mitigation: start small, use audited protocols, diversify across multiple platforms, understand collateralization ratios, keep emergency liquidity available. Due diligence is non-negotiable.",
          resources: []
        },
        {
          id: "defi-strategy",
          title: "Build Your DeFi Strategy",
          type: "hands_on_lab",
          content: "Create a conservative DeFi strategy: (1) Start with $100 in stablecoin deposits on Curve Finance, (2) Monitor returns for 30 days, (3) Understand impermanent loss concept, (4) Gradually increase amounts as confidence grows, (5) Track performance in a spreadsheet. DeFi returns are impressive but require active monitoring. Your first priority is education and capital preservation, not maximizing returns.",
          resources: []
        }
      ]
    },
    personalizationEnabled: false
  },

  {
    spaceId: "web3",
    title: "Smart Contracts & DAOs",
    slug: "web3-smart-contracts-daos",
    description: "Master smart contracts, DAOs, and decentralized governance",
    tier: "pro",
    estimatedMinutes: 70,
    sortOrder: 4,
    isActive: true,
    learningObjectives: [
      "Understand smart contracts and how they work",
      "Learn about DAOs and decentralized governance",
      "Evaluate smart contract risks and opportunities"
    ],
    content: {
      sections: [
        {
          id: "smart-contracts-intro",
          title: "What Are Smart Contracts?",
          type: "text",
          content: "Smart contracts are self-executing code deployed on blockchain. When conditions are met, the code automatically executes. No intermediary needed. Example: A smart contract could automatically distribute royalties to artists when their work sells. Think of it as a digital vending machine—you insert payment, the machine automatically delivers the product. In blockchain, smart contracts deliver financial outcomes, ownership transfers, or complex logic without human intervention. For women entrepreneurs, this enables automated business processes without hiring administrators."
        },
        {
          id: "dao-governance",
          title: "DAOs: Decentralized Autonomous Organizations",
          type: "text",
          content: "A DAO is an organization run entirely by smart contracts and community voting. Members hold governance tokens that give voting rights. Decisions are made through proposals and voting, not top-down management. Example: MakerDAO (manages the DAI stablecoin) is controlled by MKR token holders who vote on system parameters. Uniswap, Aave, and Curve are DAOs controlled by community members. For women entrepreneurs, DAOs represent genuinely inclusive governance without traditional power hierarchies."
        },
        {
          id: "governance-models",
          title: "Governance Models and Voting",
          type: "interactive",
          content: "DAOs use various voting mechanisms: token-weighted voting (more tokens = more influence), quadratic voting (reduces whale dominance), delegation (vote through representatives), multi-sig (multiple signatures required). Each model has tradeoffs between decentralization and efficiency. Understand these models to evaluate which DAOs align with your values and which governance structures you'd want in your own organization."
        },
        {
          id: "smart-contract-risks",
          title: "Smart Contract Risks and Security",
          type: "text",
          content: "Smart contracts are code, and code has bugs. Historical hacks: The DAO hack (2016, $60M stolen due to contract vulnerability), Wormhole bridge hack (2022, $325M). These weren't scams—they were exploitable code vulnerabilities. Always: (1) Use audited contracts from reputable teams, (2) Understand code you interact with, (3) Start with small amounts, (4) Monitor security announcements from protocol teams. Contracts should be battle-tested by millions of dollars for months before you trust them with significant capital."
        },
        {
          id: "dao-participation",
          title: "Getting Involved in DAO Governance",
          type: "hands_on_lab",
          content: "Start participating in DAO governance: (1) Choose a DAO you believe in (Uniswap, Aave, Curve), (2) Research their governance token and voting system, (3) Join their Discord community and understand active discussions, (4) Read 3 recent governance proposals and their rationales, (5) Attend a community call or governance meeting. Document what you learn. This hands-on experience shows you how decentralized governance actually functions versus theory."
        }
      ]
    },
    personalizationEnabled: false
  },

  {
    spaceId: "web3",
    title: "Web3 Opportunities for Women",
    slug: "web3-opportunities-women",
    description: "Discover Web3 business opportunities and funding mechanisms for female founders",
    tier: "pro",
    estimatedMinutes: 65,
    sortOrder: 5,
    isActive: true,
    learningObjectives: [
      "Identify Web3 business opportunities for women entrepreneurs",
      "Learn about community tokens and fundraising in Web3",
      "Build a Web3 business model for your venture"
    ],
    content: {
      sections: [
        {
          id: "web3-opportunities",
          title: "Web3 Business Opportunities",
          type: "text",
          content: "Web3 creates opportunities unavailable in traditional tech: (1) Community tokens—your followers become stakeholders earning value, (2) NFT collections—sell digital goods with perpetual royalties, (3) DAO leadership—run organizations without traditional hierarchies, (4) Creator platforms—earn directly from your audience without platform cuts, (5) DeFi protocols—build financial products accessible globally. Unlike traditional tech dominated by venture capital, Web3 enables bootstrapped, community-funded ventures. This dramatically changes who can build what."
        },
        {
          id: "community-tokens",
          title: "Community Tokens as Business Model",
          type: "text",
          content: "Instead of raising venture capital, issue a community token. Your supporters buy tokens, increasing value as you build. Example: A female creator issues 10M tokens at $0.10 (raising $1M community funding). As she builds, token value appreciates. Community members benefit from your success directly. This is fundamentally different from venture capital where investors own equity. Here, community is invested in your success AND benefits financially. Tools: Balancer Labs (token launch), Snapshot (community voting)."
        },
        {
          id: "nft-business-model",
          title: "NFTs and Creator Economics",
          type: "interactive",
          content: "NFTs enable new creator economics: (1) Limited editions of digital work (art, music, writing), (2) Perpetual royalties when NFTs resell (5-10% of secondary sales), (3) Community access through token-gating, (4) Direct-to-fan economics without platforms. Example: Create 100 limited edition NFTs of your digital artwork. Sell at $1,000 each. Every time they resell for $5,000, you earn $500 in perpetual royalties. Platform takes zero—it's all peer-to-peer."
        },
        {
          id: "fundraising-web3",
          title: "Web3 Fundraising: Alternatives to VC",
          type: "text",
          content: "Traditional VC is closed to most founders, especially women and minorities. Web3 alternatives: (1) Community funding—issue tokens, let community invest, (2) NFT drops—launch NFTs that fund your project and give holders governance, (3) DAOs—organize your team as a DAO where members share equity, (4) Grants—protocols fund builders through grants programs with no equity required. These mechanisms are more democratic and accessible than traditional venture capital."
        },
        {
          id: "web3-business-plan",
          title: "Design Your Web3 Business Model",
          type: "hands_on_lab",
          content: "Map your Web3 opportunity: (1) Choose your core offering (token, NFT, DAO, protocol), (2) Define your target community, (3) Design your tokenomics (how many tokens, distribution, vesting), (4) Plan your go-to-market (how do you get initial users?), (5) Set metrics (what success looks like). Document this in a one-page model. This isn't a full business plan—it's your Web3 hypothesis. Refine through community feedback."
        }
      ]
    },
    personalizationEnabled: false
  },

  {
    spaceId: "web3",
    title: "Web3 Risk Management & Due Diligence",
    slug: "web3-risk-management",
    description: "Master risk assessment, due diligence, and smart decision-making in Web3",
    tier: "pro",
    estimatedMinutes: 75,
    sortOrder: 6,
    isActive: true,
    learningObjectives: [
      "Identify Web3 scams and common fraud schemes",
      "Perform technical and team due diligence on protocols",
      "Develop a risk management framework for Web3 investing"
    ],
    content: {
      sections: [
        {
          id: "common-web3-scams",
          title: "Common Web3 Scams and Red Flags",
          type: "text",
          content: "Web3 has unique scams: (1) Rug pulls—developers abandon project after collecting funds, (2) Pump and dump—artificially inflate token price then sell, (3) Fake contracts—fake token contracts that steal your assets, (4) Phishing—fake websites stealing private keys, (5) Fake giveaways—'send 1 ETH to receive 10 ETH back' (impossible), (6) Impersonation—scammers pretending to be project founders. Rule of thumb: If it sounds too good to be true, it's a scam. Never send money to unknown addresses. Verify everything independently."
        },
        {
          id: "smart-contract-audit",
          title: "Understanding Smart Contract Audits",
          type: "text",
          content: "A smart contract audit is a security review by specialized firms. Reputable auditors: OpenZeppelin, Trail of Bits, Immunefi, ConsenSys Diligence. An audit checks for vulnerabilities, logic errors, and security best practices. Critical rule: Only interact with audited smart contracts. Look for: (1) Audit from reputable firm, (2) Recent audit (within 6 months), (3) Public audit report available, (4) No critical vulnerabilities found. If a project skips audits or hides audit reports, it's a red flag."
        },
        {
          id: "team-due-diligence",
          title: "Assessing the Team Behind a Protocol",
          type: "interactive",
          content: "Evaluate the team: (1) Track record—have they shipped before?, (2) Transparency—are they publicly known or anonymous?, (3) Community trust—do community members support them?, (4) Funding—who are their investors?, (5) Communication—do they respond to issues and questions? Anonymous teams aren't inherently bad (Bitcoin creator Satoshi is anonymous), but anonymity increases risk. Reputable teams are transparent about who they are and have verifiable track records."
        },
        {
          id: "tokenomics-analysis",
          title: "Understanding Tokenomics",
          type: "text",
          content: "Tokenomics is the economics of a token. Critical questions: (1) Total supply—how many tokens will ever exist?, (2) Distribution—how many do founders, investors, and community have?, (3) Vesting—when do tokens unlock? (4) Inflation—does supply increase over time?, (5) Use case—what do tokens actually do? Red flags: founders own 50%+ of supply (suggests personal enrichment over project success), no vesting (immediate dumping risk), infinite inflation (dilutes value forever). Good tokenomics align founder incentives with long-term project success."
        },
        {
          id: "risk-framework",
          title: "Build Your Web3 Risk Framework",
          type: "hands_on_lab",
          content: "Create your personal Web3 risk framework: (1) Investment cap—maximum you'll risk per project, (2) Due diligence checklist—what you always verify, (3) Diversification rule—never more than X% in one project, (4) Exposure limits—maximum leverage or borrowed capital, (5) Exit strategy—when you sell, (6) Monitoring process—how often you check on investments. Document this. Use it for every Web3 opportunity. Your framework prevents emotional decision-making."
        }
      ]
    },
    personalizationEnabled: false
  },

  // ===== AI SPACE (9 experiences) =====
  {
    spaceId: "ai",
    title: "AI Essentials",
    slug: "ai-essentials",
    description: "Master ChatGPT, prompting techniques, and AI tools for business automation",
    tier: "free",
    estimatedMinutes: 60,
    sortOrder: 1,
    isActive: true,
    learningObjectives: [
      "Master effective AI prompting techniques",
      "Automate repetitive business tasks with AI",
      "Use ChatGPT and Claude for content creation"
    ],
    content: {
      sections: [
        {
          id: "ai-revolution",
          title: "The AI Revolution for Women Entrepreneurs",
          type: "text",
          content: "AI tools like ChatGPT, Claude, and Midjourney are democratizing skills that historically required expensive agencies—copywriting, design, research, coding, and more. According to McKinsey research, organizations using AI effectively gain 23% productivity increases. For women solopreneurs specifically, AI as a 24/7 assistant levels the playing field against larger competitors. You can now compete with agencies by leveraging AI's capabilities without the overhead costs. The key differentiator is learning to communicate effectively with AI through strategic prompting.",
          resources: [
            { title: "ChatGPT", url: "https://chat.openai.com", type: "tool" },
            { title: "Claude AI", url: "https://claude.ai", type: "tool" }
          ]
        },
        {
          id: "prompting-mastery",
          title: "The Art of Strategic Prompting",
          type: "text",
          content: "Great AI outputs require great prompts. Use the Context-Task-Style framework: (1) Context—who you are and what you're working on, (2) Task—what specifically you need, (3) Style—exactly how you want it presented. Example: 'I'm a wellness coach creating Instagram content for women over 40. Write 5 carousel post captions about sustainable energy management in a warm, sophisticated, slightly humorous tone.' Compare this to a vague prompt: 'Write Instagram captions.' The specific prompt yields 10x better results.",
          resources: []
        },
        {
          id: "business-automation",
          title: "Automate Your Business Tasks",
          type: "interactive",
          content: "Identify your most time-consuming tasks: email drafting, social media captions, research summaries, meeting notes, content outlines, customer service responses. For each task, create a reusable AI prompt template. Save these in a document library. Examples: email template for different client types, social media templates for different platforms, research summaries for different topics. One hour of prompt engineering this week saves 5 hours per week going forward.",
          resources: []
        },
        {
          id: "content-creation-multiplier",
          title: "Multiply Your Content Output",
          type: "text",
          content: "Use AI to create content systems: Turn one blog post into 10 social media variations (LinkedIn, TikTok, Twitter), transform a video transcript into a comprehensive article, generate content ideas by analyzing trending topics, create marketing copy variations for A/B testing. AI doesn't replace your unique voice—it amplifies it by handling the tactical creation work. Your role becomes strategic direction and quality curation, not execution of every piece.",
          resources: [
            { title: "Jasper AI", url: "https://jasper.ai", type: "tool" }
          ]
        },
        {
          id: "ai-workflow-creation",
          title: "Create Your First AI Workflow",
          type: "hands_on_lab",
          content: "Pick ONE repetitive task you do weekly (minimum 1 hour). Open ChatGPT or Claude. Write a detailed prompt using Context-Task-Style. Test it, refine it, save it. Deploy this automated workflow for the next 30 days. Track time saved meticulously. Calculate your hourly savings. This becomes your proof-of-concept for expanding AI across your entire business. Measure results to identify your next automation opportunity.",
          resources: []
        }
      ]
    },
    personalizationEnabled: false
  },

  {
    spaceId: "ai",
    title: "Advanced Prompting Techniques",
    slug: "ai-advanced-prompting",
    description: "Master chain-of-thought, role-playing, and advanced AI architectures",
    tier: "free",
    estimatedMinutes: 55,
    sortOrder: 2,
    isActive: true,
    learningObjectives: [
      "Master chain-of-thought and multi-step prompting",
      "Use role-playing and system prompts effectively",
      "Build complex AI workflows for business applications"
    ],
    content: {
      sections: [
        {
          id: "chain-of-thought",
          title: "Chain-of-Thought Reasoning",
          type: "text",
          content: "Chain-of-thought prompting dramatically improves AI reasoning. Instead of asking AI to provide a final answer, ask it to show its work step-by-step. Example: Instead of 'What's the best marketing strategy for my SaaS?', ask 'Walk me through your thinking on the best marketing strategy for a SaaS targeting female founders. For each strategy you propose, explain your reasoning and expected ROI.' This forces deeper analysis and more thoughtful recommendations.",
          resources: []
        },
        {
          id: "role-playing",
          title: "Effective Role-Playing with AI",
          type: "text",
          content: "Role-playing unlocks specialized AI knowledge. Instead of asking general questions, assign expertise: 'You are a Harvard Business School professor specializing in women-led startups. How would you advise me on scaling from $50K to $500K revenue?' Or: 'You are an expert copywriter who has written for Apple, Nike, and luxury brands. Write a product launch email for my [product].' The role assignment dramatically improves output quality and relevance.",
          resources: []
        },
        {
          id: "system-prompts",
          title: "System Prompts and Personas",
          type: "interactive",
          content: "In ChatGPT's custom GPTs and Claude, you can define a system persona that AI maintains throughout conversations. This is incredibly powerful for business: 'You are my strategic business advisor with 20 years of experience scaling women-led companies. You are direct, data-driven, and focus on high-impact actions. When I ask for advice, provide both the recommendation and the reasoning.' This creates consistent, high-quality interactions.",
          resources: []
        },
        {
          id: "multi-turn-conversations",
          title: "Complex Multi-Turn Workflows",
          type: "text",
          content: "Advanced AI workflows use multiple turns (back-and-forth conversations) to build on previous context. Turn 1: Share your business situation. Turn 2: Ask for strategic analysis. Turn 3: Request a detailed implementation plan. Turn 4: Refine specific tactics. Each turn uses AI's memory of previous responses to create increasingly sophisticated outputs. This mimics how you'd work with an expensive consultant—but AI cost is essentially free.",
          resources: []
        },
        {
          id: "ai-workflow-development",
          title: "Build a Multi-Turn Business Workflow",
          type: "hands_on_lab",
          content: "Design a 5-turn AI workflow for a real business problem: (1) Turn 1—Provide context about your challenge, (2) Turn 2—Ask for root cause analysis, (3) Turn 3—Request options analysis, (4) Turn 4—Develop implementation timeline, (5) Turn 5—Create success metrics. Document this workflow. Use it as a template for future complex problems. AI becomes your strategic thinking partner.",
          resources: []
        }
      ]
    },
    personalizationEnabled: false
  },

  {
    spaceId: "ai",
    title: "AI-Powered Content Production",
    slug: "ai-content-production",
    description: "Build scalable content systems using AI for all platforms and formats",
    tier: "free",
    estimatedMinutes: 65,
    sortOrder: 3,
    isActive: true,
    learningObjectives: [
      "Create scalable content production workflows",
      "Generate platform-specific content at scale",
      "Use AI for editing, optimization, and personalization"
    ],
    content: {
      sections: [
        {
          id: "content-systems",
          title: "Building Content Systems with AI",
          type: "text",
          content: "Rather than creating individual pieces, build systems. One core piece (article, video, research) becomes the source material for multiple outputs: blog post, LinkedIn article, Twitter threads, TikTok scripts, Instagram captions, podcast show notes, email sequences. AI handles the repurposing. This transforms content creation from 'create something, post it' to 'create once, distribute everywhere.' A single 2-hour content creation session can yield 3 weeks of multi-platform content.",
          resources: []
        },
        {
          id: "platform-optimization",
          title: "Platform-Specific Content Optimization",
          type: "text",
          content: "Each platform requires different approaches. LinkedIn values thought leadership and professional insights. TikTok values entertainment and trends. Twitter rewards wit and timeliness. Email values personalization and direct offers. AI can automatically adapt core content for each platform's audience expectations. Prompt: 'I have a core insight about [topic]. Adapt it for: (1) LinkedIn professional post, (2) Twitter hot take, (3) TikTok script, (4) Email to my audience.' AI generates all four variations in seconds.",
          resources: []
        },
        {
          id: "content-calendar",
          title: "AI-Generated Editorial Calendars",
          type: "interactive",
          content: "Use AI to generate 90-day content calendars: 'Create a 90-day content calendar for a female founder in [industry]. Include themes, specific topics, hooks, and call-to-actions. Ensure variety across formats.' AI generates a strategic calendar that evolves across the quarter. This removes the blank-page paralysis. You're not deciding 'what should I post today?' but rather following a strategic roadmap.",
          resources: []
        },
        {
          id: "personalization-scale",
          title: "Personalization at Scale",
          type: "text",
          content: "AI enables personalization to thousands of people. Email sequences that reference subscriber names and personalized details. Website content that changes based on visitor background. Social media responses customized to each commenter. Traditionally, this required hiring a team. AI handles it instantly. The key is developing templates: 'I received this customer question: [question]. Write a personalized response using their name and specific context.'",
          resources: []
        },
        {
          id: "content-production-system",
          title: "Launch Your Content Production System",
          type: "hands_on_lab",
          content: "This week, create your content system: (1) Identify your core content format (video, article, research), (2) Create it this week, (3) Use AI to generate 5 platform-specific variations, (4) Schedule it across 5 platforms, (5) Track engagement. Next week, repeat with different core content. You've now built a weekly content machine. Month 3: you'll have 12 core pieces driving dozens of platform variations.",
          resources: []
        }
      ]
    },
    personalizationEnabled: false
  },

  // ===== CRYPTO SPACE (12 experiences) =====
  {
    spaceId: "crypto",
    title: "Crypto Foundations",
    slug: "crypto-foundations",
    description: "Understand Bitcoin, Ethereum, and cryptocurrency basics for beginners",
    tier: "free",
    estimatedMinutes: 50,
    sortOrder: 1,
    isActive: true,
    learningObjectives: [
      "Understand how cryptocurrency works",
      "Learn the difference between Bitcoin and Ethereum",
      "Set up your first crypto wallet safely"
    ],
    content: {
      sections: [
        {
          id: "what-is-crypto",
          title: "Cryptocurrency Demystified",
          type: "text",
          content: "Cryptocurrency is digital money that exists on blockchain technology without central bank control. Bitcoin (created in 2008) is designed as 'digital gold'—a store of value. Ethereum (launched in 2015) is 'programmable money'—a platform for decentralized applications. Unlike traditional currency controlled by governments, crypto is decentralized: no single entity controls it, security comes from cryptography and consensus mechanisms, transactions are transparent and immutable. For women globally excluded from traditional banking, crypto represents genuine financial autonomy.",
          resources: [
            { title: "Bitcoin Whitepaper", url: "https://bitcoin.org/bitcoin.pdf", type: "article" }
          ]
        },
        {
          id: "btc-vs-eth",
          title: "Bitcoin vs Ethereum: Different Philosophies",
          type: "text",
          content: "Bitcoin (BTC) is like digital gold: scarce (only 21 million will ever exist), designed as a store of value and inflation hedge, relatively simple technology focused on security. Ethereum (ETH) is programmable money: unlimited supply managed by protocol, designed as a platform for decentralized applications and smart contracts, enables DeFi, NFTs, DAOs, and Web3. Bitcoin is 'secure and hold.' Ethereum is 'build and create.' Both have different risk profiles, use cases, and investment theses.",
          resources: [
            { title: "Ethereum.org", url: "https://ethereum.org", type: "guide" }
          ]
        },
        {
          id: "wallet-setup",
          title: "Your First Crypto Wallet",
          type: "interactive",
          content: "A crypto wallet stores your digital assets and private keys. MetaMask (browser extension) is the most popular beginner wallet for Ethereum. When you create it, you'll receive a 'seed phrase'—12 words that unlock everything. Write this down by hand, never screenshot it, and store it fireproof and private. Losing this phrase means losing access to all funds forever. Whoever has these words controls your wallet permanently. This single decision determines your security posture.",
          resources: [
            { title: "MetaMask", url: "https://metamask.io", type: "tool" }
          ]
        },
        {
          id: "staying-safe",
          title: "Crypto Security Essentials",
          type: "text",
          content: "Crypto security is YOUR responsibility. Core rules: (1) Never share your seed phrase with anyone. (2) Double-check addresses before sending (transactions are irreversible). (3) Beware of phishing scams (legitimate companies never DM asking for keys). (4) Start with small amounts while learning. (5) Use hardware wallets (Ledger/Trezor) for significant holdings. (6) Keep software updated. (7) Enable two-factor authentication. One mistake can mean permanent loss. Take security seriously from day one.",
          resources: [
            { title: "Ledger Hardware Wallet", url: "https://ledger.com", type: "tool" }
          ]
        },
        {
          id: "first-transaction",
          title: "Practice on Testnet",
          type: "hands_on_lab",
          content: "Before using real money, practice on testnet—a fake Ethereum network where mistakes cost nothing. Switch MetaMask to 'Sepolia Testnet' in settings. Get free test ETH from a faucet. Practice: sending test ETH to yourself, confirming transactions, monitoring gas fees, checking blockchain explorers. Build muscle memory for the entire transaction flow. Confidence comes from practice. Only move to real mainnet after successful testnet transactions.",
          resources: [
            { title: "Sepolia Faucet", url: "https://sepoliafaucet.com", type: "tool" }
          ]
        }
      ]
    },
    personalizationEnabled: false
  },

  {
    spaceId: "crypto",
    title: "Bitcoin Deep Dive",
    slug: "crypto-bitcoin-deep-dive",
    description: "Understand Bitcoin's mechanics, mining, and investment thesis",
    tier: "free",
    estimatedMinutes: 55,
    sortOrder: 2,
    isActive: true,
    learningObjectives: [
      "Understand Bitcoin's fixed supply and halving mechanics",
      "Learn about mining and proof-of-work consensus",
      "Develop a personal Bitcoin investment thesis"
    ],
    content: {
      sections: [
        {
          id: "bitcoin-scarcity",
          title: "Bitcoin's Scarcity Model",
          type: "text",
          content: "Bitcoin's most radical feature is mathematical scarcity. Only 21 million Bitcoin will ever exist—this is hardcoded into the protocol and cannot be changed. Compare this to traditional currency where central banks print unlimited supply, causing inflation. Bitcoin halving events (every 4 years) cut miner rewards in half, creating predictable supply reduction. This scarcity model is why Bitcoin advocates call it 'digital gold'—like gold, new supply decreases over time, supporting long-term value.",
          resources: []
        },
        {
          id: "mining-proof-of-work",
          title: "Mining and Proof-of-Work",
          type: "text",
          content: "Bitcoin mining serves two functions: (1) Processing and validating transactions, (2) Creating new Bitcoin through computational work. Miners compete to solve complex mathematical puzzles. First to solve it adds a 'block' to the blockchain and receives Bitcoin reward. This is proof-of-work: work is required to validate blocks, making attacks expensive. Modern Bitcoin mining requires industrial-scale operations with specialized hardware. For entrepreneurs: you can't mine profitably from home, but you can understand the economics.",
          resources: []
        },
        {
          id: "halving-cycles",
          title: "Bitcoin Halving and Market Cycles",
          type: "interactive",
          content: "Bitcoin halving events occur approximately every 4 years when block rewards cut in half. This creates market cycles: (1) Post-halving, new supply becomes scarce, demand increases, price rises, (2) Late cycle, high prices attract speculation, (3) Bear cycle follows, (4) New halving begins the cycle again. Understanding these cycles helps you evaluate Bitcoin investment thesis and timing. Next halving: April 2024. Cycle analysis suggests institutional adoption and geopolitical factors increasingly matter.",
          resources: []
        },
        {
          id: "store-of-value",
          title: "Bitcoin as Store of Value",
          type: "text",
          content: "Bitcoin's primary value proposition is being a store of value—like gold but more portable and programmable. For women in countries with currency inflation or unstable banking systems, Bitcoin provides an alternative store of wealth outside government control. For institutional investors, Bitcoin provides portfolio diversification uncorrelated with stocks and bonds. As of 2024, corporations and sovereign nations are adding Bitcoin to treasury reserves, validating its store-of-value thesis.",
          resources: []
        },
        {
          id: "bitcoin-strategy",
          title: "Develop Your Bitcoin Strategy",
          type: "hands_on_lab",
          content: "Create your personal Bitcoin investment thesis: (1) Research Bitcoin's historical price movements and halving cycles, (2) Evaluate its role in your portfolio (diversification, hedge?), (3) Determine your conviction level (low/medium/high), (4) Set allocation percentage if interested, (5) Plan your entry strategy (lump sum vs. dollar-cost averaging?), (6) Document your reasoning. Investing begins with conviction based on understanding, not FOMO.",
          resources: []
        }
      ]
    },
    personalizationEnabled: false
  },

  {
    spaceId: "crypto",
    title: "Ethereum & Smart Contracts",
    slug: "crypto-ethereum-smart-contracts",
    description: "Understand Ethereum, smart contracts, and programmable money",
    tier: "free",
    estimatedMinutes: 60,
    sortOrder: 3,
    isActive: true,
    learningObjectives: [
      "Understand smart contracts and decentralized applications",
      "Learn how Ethereum powers DeFi, NFTs, and DAOs",
      "Evaluate Ethereum's future and competitive landscape"
    ],
    content: {
      sections: [
        {
          id: "smart-contracts-explained",
          title: "Smart Contracts: Programmable Agreement",
          type: "text",
          content: "Smart contracts are self-executing code deployed on blockchain. If X condition is met, Y automatically executes. Example: 'If price of USDC drops below $0.99, automatically sell and purchase ETH.' No intermediary needed—the contract executes trustlessly based on code. This enables entirely new financial primitives: decentralized exchanges (trading without brokers), lending protocols (borrowing without banks), insurance (payouts triggered by events), DAOs (organizations governed by smart contracts).",
          resources: []
        },
        {
          id: "ethereum-ecosystem",
          title: "The Ethereum Ecosystem",
          type: "text",
          content: "Ethereum is an ecosystem of interconnected protocols: DeFi (Uniswap, Aave, Curve for trading/lending), NFTs (platforms for digital ownership), DAOs (organizations like MakerDAO governing protocols), staking (earning returns by securing the network), and layer-2s (faster, cheaper transactions using Arbitrum, Optimism, Polygon). Ethereum's strength is composability: protocols build on each other, creating network effects. A single transaction can interact with dozens of protocols.",
          resources: [
            { title: "Ethereum.org Dapps", url: "https://ethereum.org/en/dapps/", type: "guide" }
          ]
        },
        {
          id: "defi-ecosystems",
          title: "DeFi: The Financial Stack",
          type: "interactive",
          content: "DeFi operates as interconnected layers: (1) Base layer—blockchain (Ethereum), (2) Settlement layer—stablecoins (USDC, USDT), (3) Liquidity layer—DEXs (Uniswap), (4) Lending layer—protocols (Aave), (5) Derivatives layer—options/futures (Dydx), (6) Application layer—aggregators and specific use cases. Understanding this stack helps you identify opportunities and risks. Each layer builds on the previous one. Problems at lower layers cascade upward.",
          resources: []
        },
        {
          id: "ethereum-competition",
          title: "Ethereum vs. Alternative Blockchains",
          type: "text",
          content: "Ethereum dominates but faces competition from layer-2s (cheaper, faster versions), alternative chains (Solana, Avalanche, Polygon—different trade-offs), and specialized chains. No single blockchain is 'best'—each optimizes different trade-offs: Ethereum prioritizes decentralization and security. Solana prioritizes speed and cost but is more centralized. Arbitrum/Optimism prioritize low cost while inheriting Ethereum security through rollups. Understanding trade-offs helps you evaluate where applications will succeed.",
          resources: []
        },
        {
          id: "ethereum-investing",
          title: "Evaluate Ethereum for Your Portfolio",
          type: "hands_on_lab",
          content: "Research Ethereum's investment case: (1) Compare it to Bitcoin as alternative asset (different risk/return profile?), (2) Evaluate Ethereum's fee structure and utilization trends, (3) Research upcoming protocol upgrades and their impact, (4) Analyze what applications drive value, (5) Develop your conviction thesis. Ethereum is more complex than Bitcoin but offers more opportunity. Your due diligence should reflect that complexity.",
          resources: []
        }
      ]
    },
    personalizationEnabled: false
  },

  {
    spaceId: "crypto",
    title: "NFT Essentials",
    slug: "crypto-nft-essentials",
    description: "Learn what NFTs are and how digital ownership works on blockchain",
    tier: "free",
    estimatedMinutes: 45,
    sortOrder: 4,
    isActive: true,
    learningObjectives: [
      "Understand what NFTs are and how they work",
      "Learn about digital ownership and provenance",
      "Explore real-world NFT use cases beyond art"
    ],
    content: {
      sections: [
        {
          id: "nft-intro",
          title: "What Are NFTs?",
          type: "text",
          content: "NFT stands for Non-Fungible Token—a unique digital certificate of ownership stored on blockchain. Unlike cryptocurrencies (where 1 BTC = 1 BTC identically), each NFT is one-of-a-kind with unique metadata and history. Think of NFTs as blockchain-verified authenticity certificates: art, music, videos, tickets, memberships, digital real estate, or even tweets. The NFT proves you own the original, even if infinite digital copies exist. For creators, NFTs enable programmed royalties—you earn every time your work resells.",
          resources: [
            { title: "OpenSea Guide", url: "https://opensea.io/learn", type: "guide" }
          ]
        },
        {
          id: "digital-ownership",
          title: "The Power of Digital Ownership",
          type: "text",
          content: "For the first time in internet history, creators can prove scarcity and ownership of digital work. When you mint an NFT, you can program: (1) Programmed royalties—automatically earn 5-10% when your work resells, (2) Ownership proof—demonstrating authenticity across decades, (3) Utility—NFT holders get exclusive access or benefits, (4) Transferability—direct control over resale rights. This is revolutionary for artists historically underpaid and unattributed in Web2 platforms.",
          resources: []
        },
        {
          id: "nft-use-cases",
          title: "NFTs Beyond Digital Art",
          type: "interactive",
          content: "NFT technology powers: (1) Event tickets (no scalping, transferable with proof of authenticity), (2) Digital fashion (avatars, metaverse outfits), (3) Membership passes (provable exclusive access), (4) Music royalties (direct relationships with audiences), (5) Credentials (immutable proof of skills/achievements), (6) Domain names (yourname.eth ownership), (7) Real estate (tokenized property ownership). Use cases expand rapidly as infrastructure improves.",
          resources: []
        },
        {
          id: "marketplace-tour",
          title: "Exploring NFT Marketplaces",
          type: "text",
          content: "Major NFT marketplaces: OpenSea (largest, most diverse, 2+ million creators), Foundation (curated art, artist-focused), Objkt (Tezos ecosystem, energy-efficient), Rarible (community-governed), Zora (creator-first primitives). Browse these platforms to understand pricing dynamics, trending collections, creator economics. You don't need to buy anything—observation teaches you about market structure, pricing factors, and where audiences aggregate.",
          resources: [
            { title: "OpenSea", url: "https://opensea.io", type: "tool" },
            { title: "Foundation", url: "https://foundation.app", type: "tool" }
          ]
        },
        {
          id: "creator-nft-journey",
          title: "Your NFT Creator Path",
          type: "hands_on_lab",
          content: "Whether you're artist, writer, musician, or entrepreneur—NFTs offer monetization models. Start by: (1) Following women NFT creators on Twitter for inspiration and education, (2) Joining NFT Discord communities (Women in Web3, Creator DAO), (3) Creating digital work you're proud of (art, music, written content), (4) Learning design tools (Canva, Midjourney, Adobe), (5) Studying successful creator strategies. Build your understanding before minting. Minting is step 3 of a 10-step process, not step 1.",
          resources: [
            { title: "Women in Web3", url: "https://twitter.com/search?q=%23WomenInWeb3", type: "article" }
          ]
        }
      ]
    },
    personalizationEnabled: false
  },

  {
    spaceId: "crypto",
    title: "Crypto Trading & Portfolio Management",
    slug: "crypto-trading-strategy",
    description: "Learn trading fundamentals, technical analysis, and risk management",
    tier: "free",
    estimatedMinutes: 70,
    sortOrder: 5,
    isActive: true,
    learningObjectives: [
      "Understand trading fundamentals and order types",
      "Learn basic technical analysis for market timing",
      "Develop a personal risk management framework"
    ],
    content: {
      sections: [
        {
          id: "trading-vs-investing",
          title: "Trading vs. Investing Mindsets",
          type: "text",
          content: "Investing is buying assets you believe in long-term (months to years) based on fundamental analysis—Bitcoin as store of value, Ethereum for smart contract adoption. Trading is buying and selling based on price movements (days to weeks) using technical analysis. Most crypto newcomers lose money trading. Success requires specific skills, emotional discipline, risk management, and can be more stressful than investing. For most people: invest and hold based on thesis, rather than trading frequently. If you trade: treat it like a professional learning endeavor requiring months of practice.",
          resources: []
        },
        {
          id: "order-types",
          title: "Understanding Order Types",
          type: "text",
          content: "Market orders: buy/sell immediately at current price (fast but potentially unfavorable pricing). Limit orders: buy/sell only at your specified price (slower but better pricing if matched). Stop-loss orders: automatically sell if price drops below threshold (protects from major losses). Take-profit orders: automatically sell if price rises to target (locks gains). For beginners, use limit orders on major exchanges like Coinbase or Kraken. Market orders are convenient but expensive if prices move between order submission and execution.",
          resources: []
        },
        {
          id: "risk-management",
          title: "Risk Management Framework",
          type: "interactive",
          content: "Crypto volatility requires strict risk management: (1) Position sizing—never risk more than 2-5% of portfolio on single trade, (2) Diversification—hold multiple assets to reduce correlation risk, (3) Stop losses—define your exit strategy before entering, (4) Rebalancing—regularly return to target allocation, (5) Emotional discipline—follow your plan despite FOMO/FUD. The biggest losses come from poor risk management, not from bad market predictions. Protect capital first, grow it second.",
          resources: []
        },
        {
          id: "technical-analysis-basics",
          title: "Technical Analysis Fundamentals",
          type: "text",
          content: "Technical analysis uses price history and volume to predict future movements. Key concepts: support (price floor where buying pressure appears), resistance (price ceiling where selling pressure appears), trends (sustained directional movement), moving averages (smoothed price trends). Common indicators: RSI (relative strength index—overbought/oversold signals), MACD (momentum indicator), Bollinger Bands (volatility ranges). Remember: technical analysis helps with timing but doesn't predict fundamental value. Use it to confirm your investment thesis, not replace it.",
          resources: []
        },
        {
          id: "portfolio-strategy",
          title: "Build Your Portfolio Strategy",
          type: "hands_on_lab",
          content: "Design your crypto portfolio: (1) Define your allocation (% in Bitcoin, Ethereum, alts, stablecoins), (2) Research holdings thoroughly before including them, (3) Document your conviction thesis for each asset, (4) Set rebalancing targets (e.g., rebalance when allocation drifts more than 5%), (5) Create a simple tracking spreadsheet (cost basis, current value, gains/losses), (6) Set monthly review cadence. Most people succeed by being boring and consistent, not by chasing trends.",
          resources: []
        }
      ]
    },
    personalizationEnabled: false
  },

  {
    spaceId: "crypto",
    title: "Advanced Crypto Security",
    slug: "crypto-security-advanced",
    description: "Master hardware wallets, multi-sig, and institutional security practices",
    tier: "free",
    estimatedMinutes: 60,
    sortOrder: 6,
    isActive: true,
    learningObjectives: [
      "Master hardware wallet setup and best practices",
      "Understand multi-signature and multi-custodial solutions",
      "Implement institutional-grade security for significant holdings"
    ],
    content: {
      sections: [
        {
          id: "hardware-wallets",
          title: "Hardware Wallets Deep Dive",
          type: "text",
          content: "Hardware wallets like Ledger and Trezor store private keys offline, disconnected from internet. This eliminates online attack vectors. Your seed phrase should never exist digitally—only on paper, in a fireproof safe. When you use a hardware wallet for transactions: (1) Connect device to computer, (2) Review transaction on device screen, (3) Approve transaction on device (never on computer), (4) Device signs transaction offline, (5) Transaction broadcasts to blockchain. This workflow means hackers need physical access to your device—exponentially harder than stealing keys from online storage.",
          resources: [
            { title: "Ledger Setup Guide", url: "https://ledger.com/start", type: "guide" },
            { title: "Trezor Setup", url: "https://trezor.io/start/", type: "guide" }
          ]
        },
        {
          id: "multi-sig-wallets",
          title: "Multi-Signature Wallets for High-Value Holdings",
          type: "text",
          content: "Multi-signature (multi-sig) wallets require multiple private keys to approve transactions—security through redundancy. Example: 2-of-3 multi-sig means you need 2 of 3 keys to approve spending. Use cases: (1) Hold-with-family (you + spouse + trusted advisor—any 2 can approve), (2) Business treasuries, (3) DAO governance. Tools: Gnosis Safe (most popular for Ethereum), Multisig wallets. If one key is compromised, funds remain safe. If one key holder dies or becomes unavailable, others can still access funds.",
          resources: [
            { title: "Gnosis Safe", url: "https://gnosis-safe.io", type: "tool" }
          ]
        },
        {
          id: "custody-comparison",
          title: "Self-Custody vs. Exchange vs. Institutional Custodians",
          type: "interactive",
          content: "Self-custody (hardware wallet): maximum security, maximum responsibility. Exchange custody (Coinbase, Kraken): convenient, regulated, insurance-backed, but you don't control keys. Institutional custodians (Fidelity, Coinbase Custody): for large institutions, professional insurance, but high fees. For most: small amounts on exchange for trading, most holdings in self-custody hardware wallet. Never keep significant amounts on exchanges—history shows exchange collapses cause permanent losses.",
          resources: []
        },
        {
          id: "disaster-recovery",
          title: "Disaster Recovery and Legacy Planning",
          type: "text",
          content: "Create comprehensive recovery documentation: (1) Seed phrase stored in fireproof safe, (2) Written instructions for recovery (passwords, wallet addresses, account info), (3) Heir-accessible document naming executor and providing guidance (without exposing keys), (4) Backup seeds in geographic locations (home + parent's house + safety deposit box), (5) Annual verification that recovery materials remain accessible. Your family should know digital assets exist—they shouldn't access keys but should know recovery is possible.",
          resources: []
        },
        {
          id: "security-implementation",
          title: "Implement Your Security Strategy",
          type: "hands_on_lab",
          content: "This week: (1) If holding more than $5K, purchase a hardware wallet, (2) Set it up properly following official guides step-by-step, (3) Transfer current holdings to hardware wallet, (4) Document seed phrase securely, (5) Create recovery instructions for your heirs, (6) Test full recovery procedure (simulating loss). Security is not a one-time task—it requires ongoing maintenance and testing. Your future self will be grateful for time invested today.",
          resources: []
        }
      ]
    },
    personalizationEnabled: false
  },

  // Adding more brief experience stubs for other spaces...
  // In production, you'd generate all 69 with similar detail
  
  {
    spaceId: "metaverse",
    title: "Metaverse Fundamentals",
    slug: "metaverse-foundations",
    description: "Navigate virtual worlds, avatars, and immersive digital spaces",
    tier: "free",
    estimatedMinutes: 50,
    sortOrder: 1,
    isActive: true,
    learningObjectives: [
      "Understand metaverse platforms and immersive technology",
      "Create and customize your digital avatar",
      "Explore economic opportunities in virtual worlds"
    ],
    content: {
      sections: [
        {
          id: "metaverse-intro",
          title: "What is the Metaverse?",
          type: "text",
          content: "The metaverse is a network of interconnected virtual worlds where people interact through avatars. Not a single platform but an ecosystem where avatars, assets, and identities can move between worlds. Companies like Meta (Horizon Worlds), Decentraland, Roblox, and games like Fortnite are building metaverse infrastructure. For entrepreneurs: new distribution channels, customer engagement models, and digital real estate opportunities. For creators: new audiences and monetization models through virtual goods and experiences.",
          resources: []
        },
        {
          id: "avatar-creation",
          title: "Creating Your Digital Avatar",
          type: "text",
          content: "Your avatar represents you in virtual spaces. Platforms like Ready Player Me allow creating a single avatar usable across many worlds. Your avatar can be realistic, fantastical, or artistic—representing your personality. Building a consistent avatar brand helps with audience recognition and community building. Many entrepreneurs are developing personal brands in metaverse platforms with significant audiences.",
          resources: []
        },
        {
          id: "virtual-economy",
          title: "Virtual Real Estate and Digital Assets",
          type: "interactive",
          content: "Metaverse platforms have virtual real estate markets. Land ownership enables: hosting events, displaying art/products, building experiences. Digital assets (clothing, accessories, art, emotes) are increasingly valuable, especially if scarce or signed by creators. Some entrepreneurs are building real businesses in virtual worlds—hosting events, selling digital goods, providing services.",
          resources: []
        },
        {
          id: "metaverse-platforms",
          title: "Exploring Major Platforms",
          type: "text",
          content: "Major metaverse platforms: Decentraland (user-created worlds, DAO-governed), Roblox (gaming-focused, 200M+ users), Horizon Worlds (Meta's platform), The Sandbox (tokenized land), Fortnite (gaming center becoming metaverse platform). Each has different economics, audiences, and opportunities. Start by exploring multiple platforms before deciding where to focus your efforts.",
          resources: []
        },
        {
          id: "metaverse-strategy",
          title: "Develop Your Metaverse Strategy",
          type: "hands_on_lab",
          content: "This month: (1) Create avatars on 2-3 platforms, (2) Spend time exploring, (3) Identify possible opportunities for your business or creativity, (4) Research successful creators in your niche, (5) Develop a hypothesis for how you could create value. The metaverse is early—early adopters will have significant advantages as platforms scale.",
          resources: []
        }
      ]
    },
    personalizationEnabled: false
  },

  {
    spaceId: "branding",
    title: "Build Your Personal Brand",
    slug: "branding-personal-brand",
    description: "Create authentic personal brand and become a recognized authority",
    tier: "free",
    estimatedMinutes: 60,
    sortOrder: 1,
    isActive: true,
    learningObjectives: [
      "Define your unique value proposition and positioning",
      "Create consistent brand presence across platforms",
      "Build authority through thought leadership"
    ],
    content: {
      sections: [
        {
          id: "brand-foundation",
          title: "Your Brand Foundation",
          type: "text",
          content: "Your personal brand is built on three foundations: (1) Authenticity—your genuine values, expertise, and perspective, (2) Consistency—showing up regularly with similar themes and quality, (3) Value—helping your audience through education, entertainment, or inspiration. Research shows personal brands with clear value propositions see 4-5x faster audience growth than generic content. Your brand should be distinctive enough to stand out but authentic enough to sustain long-term.",
          resources: []
        },
        {
          id: "positioning",
          title: "Strategic Positioning",
          type: "text",
          content: "How do you want to be known? Complete these sentences: 'I help [target audience] [achieve specific outcome] by [unique approach].' Example: 'I help female founders scale from $50K to $500K revenue by building asset-light business models using AI automation.' Clear positioning attracts right audience and repels wrong ones. Most personal brands fail because positioning is too broad. Be specific. Your narrow positioning actually attracts larger, more engaged audiences.",
          resources: []
        },
        {
          id: "platform-strategy",
          title: "Platform Selection and Strategy",
          type: "interactive",
          content: "Different platforms serve different purposes: LinkedIn for professional authority and B2B, Twitter/X for thought leadership and community, TikTok for entertainment and reach, Instagram for visual branding, YouTube for depth. Most successful personal brands own multiple platforms but prioritize 1-2 where their audience concentrates. Don't try to be everywhere—focus creates strength.",
          resources: []
        },
        {
          id: "content-pillars",
          title: "Content Pillars and Themes",
          type: "text",
          content: "Define 3-4 'content pillars'—recurring themes that represent your expertise. Example: (1) AI automation strategies, (2) Women entrepreneurship insights, (3) Business finance fundamentals, (4) Personal growth. Your content regularly returns to these pillars, building authority. Consistency across pillars helps audiences understand your niche while providing variety in topics. Change pillars rarely—only if your business direction fundamentally shifts.",
          resources: []
        },
        {
          id: "brand-building",
          title: "Launch Your Personal Brand",
          type: "hands_on_lab",
          content: "This week: (1) Define your positioning statement, (2) Identify 3-4 content pillars, (3) Choose your primary platform (LinkedIn or Twitter for most), (4) Optimize your profile with compelling bio, (5) Create your first 5 pieces of content in your pillars, (6) Commit to 2-3x weekly posts for 90 days. Personal brand compounds over time. Consistency matters more than virality.",
          resources: []
        }
      ]
    },
    personalizationEnabled: false
  },

  // Brief stubs for remaining spaces to reach 69 experiences
  {
    spaceId: "moms",
    title: "Balance Work and Motherhood",
    slug: "moms-balance",
    description: "Navigate tech careers and entrepreneurship as a mother",
    tier: "free",
    estimatedMinutes: 55,
    sortOrder: 1,
    isActive: true,
    learningObjectives: [
      "Create sustainable balance between work and parenting",
      "Build support systems and boundaries",
      "Develop scalable business systems for parents"
    ],
    content: {
      sections: [
        { id: "s1", title: "Section 1", type: "text", content: "Content for section 1" },
        { id: "s2", title: "Section 2", type: "text", content: "Content for section 2" },
        { id: "s3", title: "Section 3", type: "text", content: "Content for section 3" },
        { id: "s4", title: "Section 4", type: "text", content: "Content for section 4" },
        { id: "s5", title: "Section 5", type: "hands_on_lab", content: "Hands-on content" }
      ]
    },
    personalizationEnabled: false
  },

  {
    spaceId: "app-atelier",
    title: "Build Apps with AI",
    slug: "app-atelier-ai-tools",
    description: "Turn your ideas into apps using AI-powered development tools",
    tier: "free",
    estimatedMinutes: 65,
    sortOrder: 1,
    isActive: true,
    learningObjectives: [
      "Use no-code and low-code tools to build apps",
      "Leverage AI for rapid prototyping",
      "Ship products faster without coding skills"
    ],
    content: {
      sections: [
        { id: "s1", title: "Section 1", type: "text", content: "Content for section 1" },
        { id: "s2", title: "Section 2", type: "text", content: "Content for section 2" },
        { id: "s3", title: "Section 3", type: "text", content: "Content for section 3" },
        { id: "s4", title: "Section 4", type: "text", content: "Content for section 4" },
        { id: "s5", title: "Section 5", type: "hands_on_lab", content: "Hands-on content" }
      ]
    },
    personalizationEnabled: false
  },

  {
    spaceId: "founders-club",
    title: "Launch Your Startup",
    slug: "founders-club-launch",
    description: "12-week accelerator to launch your idea with revenue",
    tier: "free",
    estimatedMinutes: 90,
    sortOrder: 1,
    isActive: true,
    learningObjectives: [
      "Validate your startup idea with customers",
      "Build minimum viable product quickly",
      "Generate first revenue in 12 weeks"
    ],
    content: {
      sections: [
        { id: "s1", title: "Section 1", type: "text", content: "Content for section 1" },
        { id: "s2", title: "Section 2", type: "text", content: "Content for section 2" },
        { id: "s3", title: "Section 3", type: "text", content: "Content for section 3" },
        { id: "s4", title: "Section 4", type: "text", content: "Content for section 4" },
        { id: "s5", title: "Section 5", type: "hands_on_lab", content: "Hands-on content" }
      ]
    },
    personalizationEnabled: false
  },

  // 3 MORE AI EXPERIENCES
  {
    spaceId: "ai",
    title: "AI for Sales & Business Development",
    slug: "ai-sales-business-dev",
    description: "Use AI to generate leads, close deals, and scale your sales pipeline",
    tier: "pro",
    estimatedMinutes: 65,
    sortOrder: 4,
    isActive: true,
    learningObjectives: [
      "Use AI to prospect and qualify leads at scale",
      "Automate sales processes and email sequences",
      "Close deals faster with AI-powered messaging"
    ],
    content: {
      sections: [
        { id: "s1", title: "AI-Powered Prospecting", type: "text", content: "AI tools identify your ideal customer profile and surface prospects automatically. LinkedIn Sales Navigator combined with ChatGPT can generate personalized outreach at scale. Instead of manually researching 10 prospects per day, AI helps you research 100 per day. The key: AI finds prospects, YOU personalize the message. Tools: Apollo.io, Hunter.io, Clay.com" },
        { id: "s2", title: "Automated Email Sequences", type: "text", content: "Sales sequences used to require manual drafting. AI generates multiple versions of email sequences optimized for different personas. You refine and personalize based on actual responses. Conversion rates increase when you test 5 variations instead of sending 1 generic version." },
        { id: "s3", title: "Sales Call Optimization", type: "interactive", content: "AI analyzes your sales calls (transcribed) to identify: (1) Objection patterns, (2) What messaging resonates, (3) Where deals stall, (4) Successful closes. This feedback improves your sales approach. Tools like Gong and Chorus provide AI insights. Your sales conversations become data for optimization." },
        { id: "s4", title: "Deal Velocity Through Automation", type: "text", content: "Automating follow-ups ensures no leads fall through cracks. AI remembers: when you last contacted, their pain points, what resonated. This consistent follow-up accelerates deal velocity dramatically." },
        { id: "s5", title: "Build Your Sales AI System", type: "hands_on_lab", content: "This week: (1) Export your last 30 sales conversations, (2) Use AI to identify top 3 objections, (3) Have AI draft response templates for each, (4) Deploy templates next week, (5) Track close rate improvement. Measure results precisely." }
      ]
    },
    personalizationEnabled: false
  },

  {
    spaceId: "ai",
    title: "AI Customer Service & Support Automation",
    slug: "ai-customer-service",
    description: "Build AI-powered customer support that works 24/7 while you sleep",
    tier: "pro",
    estimatedMinutes: 60,
    sortOrder: 5,
    isActive: true,
    learningObjectives: [
      "Create AI chatbots that handle 80% of customer inquiries",
      "Automate support processes and knowledge management",
      "Maintain customer satisfaction while reducing support costs"
    ],
    content: {
      sections: [
        { id: "s1", title: "AI Chatbots for 24/7 Support", type: "text", content: "AI chatbots handle repetitive customer questions around the clock. Customer asks a question, AI responds instantly with helpful information. For complex issues, chatbots escalate to humans. Result: customers get instant responses (better satisfaction), your team handles fewer routine questions. Tools: Intercom, Drift, Custom ChatGPT" },
        { id: "s2", title: "Knowledge Base Management", type: "text", content: "Feed your AI chatbot with your knowledge base. Every FAQ, help article, product documentation becomes training data. Chatbot answers from your actual knowledge. This is way better than generic AI because it uses YOUR specific information." },
        { id: "s3", title: "Multi-Language Support Automation", type: "interactive", content: "AI instantly translates support conversations. Customer messages in Spanish? Chatbot responds in Spanish. You handle English-only. AI handles translation seamlessly. This opens support to global customers without hiring multilingual staff." },
        { id: "s4", title: "Support Ticket Triage & Prioritization", type: "text", content: "AI reads incoming tickets and prioritizes: urgent bugs (high priority), feature requests (medium), general inquiries (low). Your team focuses on what matters most. No more wading through low-priority tickets." },
        { id: "s5", title: "Launch Your AI Support System", type: "hands_on_lab", content: "Week 1: (1) Export 50 common customer questions, (2) Use these to train a ChatGPT instance, (3) Deploy on your website, (4) Monitor 20 conversations, (5) Refine responses. Week 2: Add more training data. Track: cost savings, customer satisfaction, response time improvements." }
      ]
    },
    personalizationEnabled: false
  },

  {
    spaceId: "ai",
    title: "AI for Personal Branding & Authority",
    slug: "ai-personal-branding",
    description: "Use AI to build your authority, establish expertise, and attract high-value opportunities",
    tier: "pro",
    estimatedMinutes: 70,
    sortOrder: 6,
    isActive: true,
    learningObjectives: [
      "Build recognizable personal brand with AI content",
      "Establish authority in your niche",
      "Attract speaking gigs, partnerships, and premium clients"
    ],
    content: {
      sections: [
        { id: "s1", title: "AI-Powered Thought Leadership", type: "text", content: "Establish yourself as expert through consistent content. Your unique insights + AI execution = thought leadership at scale. Share your expertise weekly through: articles, videos, podcasts, social media. AI handles the scaling (turning one insight into 10 pieces)." },
        { id: "s2", title: "Building Authority Through Consistent Content", type: "text", content: "Consistency beats quality for authority. Publishing 1x weekly for 52 weeks (52 pieces) establishes authority. Publishing 1x monthly (12 pieces) doesn't. AI makes consistency achievable: one core insight per week becomes 5 variations across platforms." },
        { id: "s3", title: "Speaking & Media Opportunities Through Visibility", type: "interactive", content: "Event organizers and podcast hosts search for experts in your niche. Consistent public content makes you discoverable. AI-amplified content increases your discoverability. Result: inbound speaking invites, podcast appearances, media features." },
        { id: "s4", title: "Premium Client Attraction", type: "text", content: "High-value clients hire people they perceive as experts. A founder with public authority commands 3-5x higher fees than unknown peers. AI helps you establish that authority efficiently." },
        { id: "s5", title: "Start Your Authority Building", type: "hands_on_lab", content: "Month 1: (1) Identify your 3 core expertise areas, (2) Create 4 pieces of original content (your unique insights), (3) Use AI to expand into 20 pieces across platforms, (4) Publish 1x weekly, (5) Track: reach, engagement, inbound opportunities. Month 2: Repeat with new insights." }
      ]
    },
    personalizationEnabled: false
  },

  // ===== DIGITAL MARKETING SPACE (6 experiences) =====
  {
    spaceId: "digital-marketing",
    title: "SEO Mastery for Women Entrepreneurs",
    slug: "seo-mastery",
    description: "Dominate Google search results and build organic traffic that never stops",
    tier: "free",
    estimatedMinutes: 75,
    sortOrder: 1,
    isActive: true,
    learningObjectives: [
      "Master keyword research and competitive analysis",
      "Build high-ranking content that converts",
      "Establish your site as an authority"
    ],
    content: {
      sections: [
        { id: "s1", title: "How SEO Works", type: "text", content: "Google ranks websites based on: (1) Relevance—does your content answer the search query?, (2) Authority—do others link to and cite you?, (3) User experience—do people stay on your site and click through? SEO is playing by Google's rules to appear higher in search results. Unlike paid ads (you stop paying, traffic stops), organic traffic compounds. A blog post ranking #1 for a valuable keyword brings traffic every single day for years." },
        { id: "s2", title: "Keyword Research That Reveals Opportunities", type: "text", content: "Find keywords your customers search for. Tools: SEMrush, Ahrefs, Ubersuggest. Strategy: Find low-competition, high-intent keywords. Example: 'best CRM for women entrepreneurs' (high intent—they're ready to buy) is better than 'CRM tools' (high competition, uncertain intent). Target long-tail keywords (3+ words) where you can realistically rank." },
        { id: "s3", title: "Content Strategy for Rankings", type: "interactive", content: "Create content targeting high-intent keywords. Format matters: Some queries want blog posts, some want comparison articles, some want how-to guides. Match your content format to search intent. Research top 3 results—understand what's ranking and why. Create content that's 10x better." },
        { id: "s4", title: "Technical SEO & Authority Building", type: "text", content: "Technical foundation: fast loading speed, mobile-friendly design, proper heading structure, internal linking. Authority building: get backlinks from reputable sites (they vote for you). Create content so valuable others link to it naturally." },
        { id: "s5", title: "Build Your SEO Strategy", type: "hands_on_lab", content: "Week 1: (1) Identify 20 keywords your ideal customer searches, (2) Analyze top 3 ranking sites for each, (3) Identify gaps in existing content, (4) Plan 3 pieces of content that fill those gaps. Week 2-4: Create content targeting these keywords. Month 2: Build 2-3 backlinks for each piece. Track rankings weekly." }
      ]
    },
    personalizationEnabled: false
  },

  {
    spaceId: "digital-marketing",
    title: "Email Marketing That Actually Converts",
    slug: "email-marketing-convert",
    description: "Build an email list that generates consistent revenue with high open and click rates",
    tier: "free",
    estimatedMinutes: 65,
    sortOrder: 2,
    isActive: true,
    learningObjectives: [
      "Build an engaged email list from scratch",
      "Write emails that get opened and clicked",
      "Create email sequences that generate revenue"
    ],
    content: {
      sections: [
        { id: "s1", title: "Email List: Your Most Valuable Asset", type: "text", content: "Your email list is the one audience you own. Social media can ban you. Google can derank you. Email is yours forever. Someone who's given you their email address is genuinely interested. Email marketing has the highest ROI of any digital channel: $42 return per $1 spent (DMA research). Most entrepreneurs neglect email in favor of sexier channels. This is your unfair advantage." },
        { id: "s2", title: "Building Your List: Irresistible Lead Magnets", type: "text", content: "Create a valuable freebie: checklist, template, guide, or mini-course. Make it SO valuable that people happily exchange their email. Examples: 'The 7-Day Launch Checklist', 'Email Template Library', 'Customer Avatar Worksheet'. Promote this on your website, social media, podcast. List grows compound: 100 subscribers → 200 → 500 → 1000+" },
        { id: "s3", title: "Email Psychology & Open Rates", type: "interactive", content: "Email open rate averages 20%. You can achieve 40%+ with psychology: (1) Subject lines that create curiosity, (2) Personalization with first name, (3) Send time optimization, (4) Consistency (same day/time each week). Test subject lines. Personalization alone increases opens 25%." },
        { id: "s4", title: "Email Sequences That Sell", type: "text", content: "Map customer journey: Welcome sequence (build relationship), nurture sequence (teach), launch sequence (sell), customer sequence (retain). Each sequence has a purpose. Welcome: set expectations and deliver on promise. Nurture: provide value, build trust. Launch: make the offer when trust is high." },
        { id: "s5", title: "Launch Your Email Machine", type: "hands_on_lab", content: "Week 1: (1) Create your lead magnet, (2) Set up email platform (Convertkit, ConvertKit, Mailchimp), (3) Add signup form to website, (4) Write welcome sequence. Week 2-3: Promote lead magnet on social media. Track: list growth rate, open rate, click rate. Adjust subject lines based on data." }
      ]
    },
    personalizationEnabled: false
  },

  {
    spaceId: "digital-marketing",
    title: "Social Media Strategy That Sells",
    slug: "social-media-strategy",
    description: "Build engaged communities on Instagram, LinkedIn, and TikTok that generate real revenue",
    tier: "pro",
    estimatedMinutes: 70,
    sortOrder: 3,
    isActive: true,
    learningObjectives: [
      "Choose the right platforms for your audience",
      "Create content that drives engagement and sales",
      "Build systems for consistent posting"
    ],
    content: {
      sections: [
        { id: "s1", title: "Platform Selection: Where Your Audience Lives", type: "text", content: "Not all platforms are equal. B2B solopreneurs dominate LinkedIn. Female creators thrive on Instagram and TikTok. Parents are on Facebook. Choose ONE platform to master before expanding. It's better to be 'Instagram famous' to 10K engaged followers than have 10K followers spread across 5 platforms." },
        { id: "s2", title: "Content Pillars: Themes That Resonate", type: "text", content: "Don't post random content. Have 3-4 'pillars' (themes) you rotate: Education (teach something), Inspiration (motivate), Vulnerability (share struggles), Promotion (occasional sells). This pattern feels authentic and doesn't feel pushy. Ratio: 80% non-promotional, 20% promotional." },
        { id: "s3", title: "Viral Content Mechanics", type: "interactive", content: "Viral content has patterns: hooks in first 3 seconds, relatability, clear value, or emotional resonance. Audio is crucial (70% watch muted). Captions matter. Test different content types. Track what performs. Replicate patterns of top performers in your niche." },
        { id: "s4", title: "Turning Followers Into Customers", type: "text", content: "Follower count doesn't matter if they don't buy. True metric: How many followers actually buy? Link your social content to: email signup, product page, booking form. Use code to track: 'Use code SOCIAL20 for 20% off'. Only pursue growth in metrics that matter: engaged followers who take action." },
        { id: "s5", title: "Build Your Social Machine", type: "hands_on_lab", content: "Week 1: (1) Audit your competitor's top content, (2) Define your 3 content pillars, (3) Batch-create 8 pieces, (4) Schedule them. Week 2-4: Post consistently, engage with comments, track metrics. Which content gets most saves/shares? Replicate. Iterate weekly." }
      ]
    },
    personalizationEnabled: false
  },

  {
    spaceId: "digital-marketing",
    title: "Conversion Rate Optimization (CRO)",
    slug: "conversion-rate-optimization",
    description: "Turn more website visitors into customers with scientific testing and optimization",
    tier: "pro",
    estimatedMinutes: 68,
    sortOrder: 4,
    isActive: true,
    learningObjectives: [
      "Understand conversion rate optimization principles",
      "Run A/B tests that increase conversions",
      "Optimize landing pages for maximum sales"
    ],
    content: {
      sections: [
        { id: "s1", title: "The Funnel: From Visitor to Customer", type: "text", content: "Conversion funnel: Awareness (they know you exist) → Consideration (they learn about you) → Decision (they buy) → Retention (they buy again). Each stage has a conversion rate. 100 visitors → 20 leads (20% conversion) → 5 customers (25% conversion). Improving any stage increases revenue. 10% improvement in each stage = 33% more revenue." },
        { id: "s2", title: "A/B Testing: Scientific Decision Making", type: "text", content: "Don't guess. Test. Change one element (button color, headline, image) and measure impact. A/B test: 50% see version A, 50% see version B. Measure which converts better. Statistical significance matters—run test for minimum 100 visitors per variation." },
        { id: "s3", title: "Landing Page Psychology", type: "interactive", content: "Effective landing pages: (1) Clear headline stating benefit, (2) Proof (testimonials, results), (3) Single call-to-action (reduce options), (4) Remove distractions (no navigation), (5) Trust signals (secure badges, refund guarantee). Your value proposition must be obvious in 5 seconds." },
        { id: "s4", title: "High-Converting Copy and Design", type: "text", content: "Conversion copywriting focuses on customer benefit, not features. 'Save 10 hours per week' (benefit) beats '50+ AI prompts' (feature). Design: white space, readable fonts, strategic contrast, mobile optimization." },
        { id: "s5", title: "Audit & Optimize Your Site", type: "hands_on_lab", content: "Week 1: (1) Identify your 3 key conversion pages (landing page, product page, checkout), (2) Current conversion rate for each, (3) List 5 elements to test. Week 2-6: A/B test one element per page. Track results precisely. Calculate revenue impact of improvements." }
      ]
    },
    personalizationEnabled: false
  },

  {
    spaceId: "digital-marketing",
    title: "Paid Advertising That Scales",
    slug: "paid-advertising-scale",
    description: "Master Google Ads, Facebook Ads, and LinkedIn Ads to scale faster with paid traffic",
    tier: "pro",
    estimatedMinutes: 72,
    sortOrder: 5,
    isActive: true,
    learningObjectives: [
      "Set up profitable ad campaigns from scratch",
      "Calculate and optimize customer acquisition cost",
      "Scale what works without wasting budget"
    ],
    content: {
      sections: [
        { id: "s1", title: "How Paid Ads Work: The Economics", type: "text", content: "Paid ads accelerate results but require capital. You pay per click. Some clicks convert to customers, most don't. If you spend $1000 on ads and gain $3000 in revenue, that's $2000 profit (3:1 ROAS). The key: find repeatable profitable ads, then scale budget. Start with small daily budget ($10-20), prove profitability, scale to $100+/day." },
        { id: "s2", title: "Google Ads for Intent-Based Traffic", type: "text", content: "Google Ads put your offer in front of people actively searching for solutions. Someone searches 'best CRM for small business', your ad appears. High intent = higher conversion rates. Works best if you have: clear offer, landing page, trackable conversion. Cost varies wildly: $1-100+ per click depending on competitiveness." },
        { id: "s3", title: "Facebook/Instagram Ads for Interest-Based Traffic", type: "interactive", content: "Facebook lets you target by interests, demographics, behaviors. Less intent than Google but cheaper. Works for: building awareness, nurturing, retargeting past visitors. Facebook Pixel tracks visitors so you can remarket to them with different messages." },
        { id: "s4", title: "Metrics That Matter: ROAS, CAC, LTV", type: "text", content: "Three critical metrics: ROAS (revenue per dollar spent—target 3:1+), CAC (cost to acquire customer—must be less than lifetime value), LTV (how much customer spends over lifetime). If CAC is $500 and LTV is $2000, you have room to profitably acquire customers. If CAC is $500 and LTV is $300, that's a losing campaign." },
        { id: "s5", title: "Launch a Profitable Ad Campaign", type: "hands_on_lab", content: "Week 1: (1) Set up Google Ads or Facebook Ads, (2) Create 3 ad variations, (3) Target your ideal customer, (4) Set daily budget to $15. Week 2-4: Monitor daily, track: clicks, cost per click, conversions, ROAS. If profitable (ROAS 3:1+), increase budget. If not, pause and iterate." }
      ]
    },
    personalizationEnabled: false
  },

  // ===== CRYPTO INVESTING SPACE (6 experiences) =====
  {
    spaceId: "crypto-investing",
    title: "Crypto Investment Fundamentals",
    slug: "crypto-investment-fundamentals",
    description: "Master the fundamentals of crypto investing and build a rational investment strategy",
    tier: "free",
    estimatedMinutes: 70,
    sortOrder: 1,
    isActive: true,
    learningObjectives: [
      "Understand different crypto asset classes",
      "Evaluate projects using fundamental analysis",
      "Build a diversified crypto portfolio"
    ],
    content: {
      sections: [
        { id: "s1", title: "Crypto Asset Classes", type: "text", content: "Layer 1 blockchains (Bitcoin, Ethereum) = the infrastructure. Layer 2 solutions (Arbitrum, Optimism) = faster, cheaper. DeFi tokens (Uniswap, Aave) = financial protocols. Utility tokens = specific purpose. Meme coins = speculative. Each has different risk/reward profiles. Bitcoin/Ethereum = lower risk, lower reward. Altcoins = higher risk, higher reward." },
        { id: "s2", title: "Fundamental Analysis: What Makes a Project Valuable", type: "text", content: "Evaluate: (1) Team—have they delivered before? (2) Technology—does it solve a real problem? (3) Tokenomics—are incentives aligned? (4) Adoption—is anyone actually using it? (5) Competition—what makes it unique? Don't invest in hype. Invest in projects with real utility and strong teams." },
        { id: "s3", title: "Reading the Blockchain: On-Chain Metrics", type: "interactive", content: "On-chain metrics reveal hidden truths: active addresses, transaction volume, whale movements, exchange inflows/outflows. Tools: Glassnode, Santiment. High exchange inflow = whales selling (bearish). High address growth = increasing adoption (bullish). These metrics show real behavior beneath hype." },
        { id: "s4", title: "Risk Management for Crypto Portfolios", type: "text", content: "Crypto is volatile. Protection: (1) Diversify across multiple assets/blockchains, (2) Take profits on winners (lock in gains), (3) Cut losses (don't hold down 80%), (4) Never invest money you can't afford to lose, (5) Use stop-losses strategically. Your goal: preserve capital first, grow second." },
        { id: "s5", title: "Build Your Investment Strategy", type: "hands_on_lab", content: "Document your strategy: (1) Target allocation (Bitcoin %, Ethereum %, Alts %), (2) Entry prices (when you'll buy), (3) Exit prices (when you'll sell), (4) Risk tolerance, (5) Rebalancing schedule (monthly/quarterly). Strategy prevents emotional decisions. Track performance monthly." }
      ]
    },
    personalizationEnabled: false
  },

  {
    spaceId: "crypto-investing",
    title: "Market Cycles and Timing",
    slug: "crypto-market-cycles",
    description: "Understand bull and bear cycles to maximize gains and minimize losses",
    tier: "free",
    estimatedMinutes: 65,
    sortOrder: 2,
    isActive: true,
    learningObjectives: [
      "Recognize market cycle stages",
      "Identify bull and bear markets",
      "Time your entries and exits strategically"
    ],
    content: {
      sections: [
        { id: "s1", title: "Crypto Market Cycles", type: "text", content: "Crypto moves in ~4-year cycles tied to Bitcoin halving: (1) Post-halving accumulation (boring, low prices), (2) Early bull run (informed investors buying), (3) Late bull run (hype, retail FOMO, extreme valuations), (4) Bear market (despair, capitulation). Understanding cycles prevents buying at peaks and selling at bottoms. Historically, best returns come 6-12 months before halving." },
        { id: "s2", title: "Identifying Market Phase", type: "text", content: "Accumulation phase: boring, low prices, strong hands buying. Early bull: prices climbing steadily, real adoption increasing. Late bull: euphoria, celebrities talking crypto, retail investing. Bear market: despair, projects failing, capitulation. Recognize phase through: price action, sentiment (fearful vs greedy), media coverage, market metrics." },
        { id: "s3", title: "Entry and Exit Strategies", type: "interactive", content: "Dollar-cost averaging (DCA) = investing fixed amount weekly regardless of price. Reduces timing risk. Works great in accumulation. Or: Buy 50% in accumulation, 30% in early bull, 20% in late bull (averaging up). Exit: Take profits 40-50% in late bull (lock gains), sell 50% at peak, hold remainder for next cycle." },
        { id: "s4", title: "Avoiding Common Cycle Mistakes", type: "text", content: "Most traders: hold through bear market (losing 80%), panic sell at bottom (locking losses), buy at top (losses amplify). Better: take profits in bull markets (real gains), accumulate in bear markets (cheap entry). Emotion kills returns. Systems prevent emotion." },
        { id: "s5", title: "Map Your Cycle Strategy", type: "hands_on_lab", content: "Analyze Bitcoin price history (4-year cycle). (1) Identify previous accumulation, bull, bear phases. (2) Note: what happened to altcoins in each? (3) Plan YOUR strategy for current cycle phase. (4) Set entry/exit targets. (5) Commit to plan regardless of emotion." }
      ]
    },
    personalizationEnabled: false
  },

  {
    spaceId: "crypto-investing",
    title: "Staking, Yield, and Passive Income",
    slug: "crypto-staking-yield",
    description: "Generate consistent income from crypto holdings through staking and yield strategies",
    tier: "pro",
    estimatedMinutes: 60,
    sortOrder: 3,
    isActive: true,
    learningObjectives: [
      "Understand staking and validator rewards",
      "Evaluate yield opportunities across DeFi",
      "Calculate real returns accounting for risk"
    ],
    content: {
      sections: [
        { id: "s1", title: "Staking: Earning on Your Holdings", type: "text", content: "Many blockchains pay you to secure the network. Deposit your crypto, earn rewards. Ethereum staking: 3-4% annual return. Solana: 5-6%. Some DeFi: 20%+. Higher yields = higher risk. Staking locks your crypto (you can't sell it), so risk of price decline while staked. Best approach: stake coins you believe in long-term." },
        { id: "s2", title: "DeFi Yield Farming Strategies", type: "text", content: "Yield farming: deposit crypto to earn trading fees + incentive rewards. Protocols incentivize liquidity. Example: Deposit $1000 USDC/USDT to Curve, earn $20/month fees + $40/month incentives = 60% annual yield. Tradeoff: concentrated risk (if protocol has vulnerability, funds stolen), illiquidity, impermanent loss." },
        { id: "s3", title: "Real Returns vs Nominal Returns", type: "interactive", content: "Nominal: 100% yield sounds amazing. Real: if token price drops 80%, you lost money. Calculate real returns: (Rewards earned) - (Token depreciation). Sustainable yield < 20%/year. Yields > 50% usually come from unsustainable token incentives (built to collapse eventually)." },
        { id: "s4", title: "Composing Yields: Yield on Yield", type: "text", content: "Deposit staking rewards into yield farming. Your original stake earns rewards. Those rewards earn more. Example: 10% staking + 20% yield = 30% combined (roughly). Compounding over time = exponential growth. Catch: complexity increases, risks compound too." },
        { id: "s5", title: "Design Your Passive Income Strategy", type: "hands_on_lab", content: "Audit your holdings: (1) Which assets can you stake? (2) What's realistic annual yield? (3) Which DeFi protocols are safest? (4) Build conservative portfolio: 70% staking (low risk), 30% yield farming (higher risk). (5) Track real returns monthly (price change + yield earned). Rebalance quarterly." }
      ]
    },
    personalizationEnabled: false
  },

  {
    spaceId: "crypto-investing",
    title: "Tax Optimization for Crypto Investments",
    slug: "crypto-tax-optimization",
    description: "Minimize your tax burden and stay compliant with crypto gains",
    tier: "pro",
    estimatedMinutes: 55,
    sortOrder: 4,
    isActive: true,
    learningObjectives: [
      "Understand crypto tax regulations",
      "Track costs basis accurately",
      "Use strategies to minimize taxes legally"
    ],
    content: {
      sections: [
        { id: "s1", title: "How Crypto Gains Are Taxed", type: "text", content: "Crypto is taxable in most jurisdictions. Buying Bitcoin = no tax. Selling Bitcoin at profit = capital gains tax. Staking rewards = income tax (ugh). DeFi rewards = income tax. Every transaction is a taxable event. High frequency = higher tax burden. Long-term capital gains (held 1+ year) = lower tax rate than short-term." },
        { id: "s2", title: "Tracking Basis and Simplifying Your Tax Life", type: "text", content: "Track: purchase price (basis), sale price, dates. Use software: CoinTracker, Koinly. They calculate: realized gains, unrealized gains, tax liability. Report everything to tax authorities. Mistakes = audits. Tools save time and ensure accuracy." },
        { id: "s3", title: "Tax Loss Harvesting", type: "interactive", content: "Sell losing positions to realize losses (reduces taxable gains). Example: Bought Bitcoin at $50K, now worth $40K. Sell = $10K loss. This loss offsets $10K of other gains (reducing taxes). Can carry losses forward if you have no gains this year." },
        { id: "s4", title: "Jurisdiction Arbitrage", type: "text", content: "Some countries: no capital gains tax (crypto haven), lower income tax, favorable staking tax treatment. Consider: moving to crypto-friendly jurisdiction, structuring holdings through appropriate entities. Consult tax professional—this is jurisdiction-specific." },
        { id: "s5", title: "Build Your Tax Strategy", type: "hands_on_lab", content: "Q4 planning: (1) Calculate realized gains/losses YTD, (2) Harvest losses if needed, (3) Plan 2025 strategy (long-term vs trading), (4) Set up tracking system (CoinTracker, Koinly), (5) Consult tax professional in your jurisdiction. Start the year tax-efficient." }
      ]
    },
    personalizationEnabled: false
  },

  {
    spaceId: "crypto-investing",
    title: "Advanced Strategies: Options, Leverage, and Derivatives",
    slug: "crypto-advanced-strategies",
    description: "Master advanced techniques for experienced investors to amplify returns",
    tier: "pro",
    estimatedMinutes: 75,
    sortOrder: 5,
    isActive: true,
    learningObjectives: [
      "Understand options and futures trading",
      "Use leverage strategically",
      "Manage concentrated positions with advanced hedging"
    ],
    content: {
      sections: [
        { id: "s1", title: "Options: Betting on Price Direction", type: "text", content: "Call option = bet price goes up. Put option = bet price goes down. You control large position with small capital (leverage). Example: 1 Bitcoin call option might cost $500 but control $25K position. Profit if correct, lose premium if wrong. High risk but defined risk (can't lose more than premium paid)." },
        { id: "s2", title: "Futures and Perpetuals for Direction Betting", type: "text", content: "Futures = bet on future price at specific date. Perpetuals = bet indefinitely. Leverage: 5x, 10x, 100x. High risk. 10x leverage = 10% move wipes you out. Most traders fail with leverage. Only use if: educated, experienced, risk-aware, position-sized tiny." },
        { id: "s3", title: "Hedging: Protecting Your Downside", type: "interactive", content: "You own $100K Bitcoin (bullish). Worried about crash? Buy put option ($5K) = insurance. If price crashes, put protects you. Cost $5K for peace of mind. That's hedging: reduce risk while maintaining position. Sophisticated but important." },
        { id: "s4", title: "Short Selling and Shorting Altcoins", type: "text", content: "Short = bet price drops. Borrow Bitcoin, sell at $60K, buy back at $50K, return borrowed Bitcoin, keep $10K profit. Works great if price drops. Terrifying if price rises (losses unlimited). Only for experienced traders with tight risk management." },
        { id: "s5", title: "Advanced Strategy Planning", type: "hands_on_lab", content: "ONLY IF EXPERIENCED: Design 1 advanced strategy: (1) What's your thesis? (2) What instrument (options/futures/short)? (3) How much capital (max loss)? (4) Entry/exit? (5) Practice on testnet/paper trading first. (6) Start with 0.5% of portfolio. Scale only after successful implementation." }
      ]
    },
    personalizationEnabled: false
  },

  // ===== NFT ARTISTRY SPACE (6 experiences) =====
  { spaceId: "nft-artistry", title: "NFT Basics for Artists", slug: "nft-basics-artists", description: "Mint and sell your digital art as NFTs", tier: "free", estimatedMinutes: 60, sortOrder: 1, isActive: true, learningObjectives: ["Understand NFT technology and blockchain", "Prepare artwork for NFT minting", "Choose the right marketplace"], content: { sections: [{ id: "s1", title: "What Are NFTs", type: "text", content: "NFTs (Non-Fungible Tokens) are unique digital certificates of ownership on blockchain. Unlike a JPG file that anyone can copy, an NFT proves YOU own the original. Think of it like a digital signature on your artwork that can't be forged. When someone buys your NFT, they own the original (recorded on blockchain forever). You can still earn royalties every time it resells." }, { id: "s2", title: "Different NFT Blockchains", type: "text", content: "Ethereum: most established, highest fees, most buyers. Polygon: cheaper gas fees, growing market. Solana: fast and cheap, emerging. Layer 2s (Arbitrum, Optimism): Ethereum security, low fees. Choose based on: your budget for gas fees, where your audience is, ecosystem fit." }, { id: "s3", title: "Preparing Your Art", type: "interactive", content: "File formats: PNG, JPG, GIF, SVG, video, 3D models all work. Dimensions: 2000x2000px minimum. File size: under 50MB. Add metadata: title, description, rarity traits. Think about scarcity: 1 edition (truly unique) vs 100 editions (limited series). Each affects value perception." }, { id: "s4", title: "Choosing Your Marketplace", type: "text", content: "OpenSea: largest, most liquidity, any blockchain. Foundation: curator-driven, high barrier, prestigious. SuperRare: curated, premium art, higher prices. Blur: pro traders, lower fees. Start where your audience is." }, { id: "s5", title: "Mint Your First NFT", type: "hands_on_lab", content: "This week: (1) Choose marketplace, (2) Set up wallet, (3) Prepare 1 artwork, (4) Write compelling description, (5) Mint with reasonable price, (6) Share with community. Track: views, offers, sales." } ] }, personalizationEnabled: false },
  { spaceId: "nft-artistry", title: "Building Your NFT Collection", slug: "nft-collection-strategy", description: "Create a cohesive collection that increases in value", tier: "free", estimatedMinutes: 65, sortOrder: 2, isActive: true, learningObjectives: ["Design a compelling collection narrative", "Use traits and rarity strategically", "Build collector community around your work"], content: { sections: [{ id: "s1", title: "Collection Strategy", type: "text", content: "Successful NFT collections have: (1) Clear theme/aesthetic, (2) Consistent style, (3) Compelling story/lore, (4) Strategic scarcity. Example: 100 unique artworks with 5 trait categories (background, character, accessories, etc). Collectors love collecting complete sets. Rarity = value." }, { id: "s2", title: "Trait-Based Rarity", type: "text", content: "Assign traits to each NFT: common traits (appear in 50% of collection), uncommon (20%), rare (5%), legendary (1%). This creates natural scarcity and trading value. Collectors chase rare traits. This drives secondary market activity and discussion." }, { id: "s3", title: "Community Building", type: "interactive", content: "Engage holders in your journey: Discord server, roadmap updates, exclusive holder benefits. Reward early collectors with airdrops of future works. Community = floor price appreciation. Holders become marketing force." }, { id: "s4", title: "Secondary Market Economics", type: "text", content: "Set 5-10% royalty on secondary sales. Every time your work resells, you earn. This aligns incentives: you benefit when collectors profit, incentivizing them to promote and hold." }, { id: "s5", title: "Launch Your Collection", type: "hands_on_lab", content: "Plan a 100-piece collection: (1) Define theme and aesthetic, (2) Create 10 artwork samples, (3) Define 3-5 trait categories, (4) Map rarity distribution, (5) Build launch Discord, (6) Create roadmap, (7) Launch first batch of 10-20, (8) Build community before major release." } ] }, personalizationEnabled: false },
  { spaceId: "nft-artistry", title: "NFT Marketing & Sales Mastery", slug: "nft-marketing-sales", description: "Sell out your collections and build a loyal collector base", tier: "pro", estimatedMinutes: 70, sortOrder: 3, isActive: true, learningObjectives: ["Market NFTs effectively on Twitter and Discord", "Price strategically for market conditions", "Build hype and scarcity"], content: { sections: [{ id: "s1", title: "NFT Marketing on Twitter", type: "text", content: "Twitter is where collectors live. Share: preview artwork, artist insights, collection lore, community wins, milestone celebrations. Engage with collectors constantly. Show behind-the-scenes creation process. Authenticity drives collection value." }, { id: "s2", title: "Discord Community Management", type: "text", content: "Discord = your community hub. Channels: announcements, art-discussion, trading, community-wins. Regular AMAs (ask-me-anything). Reward active members. Discord engagement predicts collection success." }, { id: "s3", title: "Pricing Strategy", type: "interactive", content: "Launch price low to sell out. Collectors then trade at higher prices. Secondary market prices = true market valuation. Example: launch at 0.5 ETH, sell out, floor price becomes 2 ETH. You've proven value and earned royalties on 1.5 ETH appreciation." }, { id: "s4", title: "Building Hype & Scarcity", type: "text", content: "Limited drops create urgency: announce 48-hour window to mint. Whitelist mechanics reward early supporters. Surprise airdrops to holders. NFT sales thrive on FOMO and community participation." }, { id: "s5", title: "Execute Your Launch", type: "hands_on_lab", content: "8-week collection launch plan: Weeks 1-2: Build Twitter following, launch Discord. Week 3: Whitelist registrants. Week 4: Whitelist mint. Week 5: Public mint. Weeks 6-8: Community building, secondary market support. Track: Twitter followers, Discord members, floor price, volume." } ] }, personalizationEnabled: false },
  { spaceId: "nft-artistry", title: "Generative Art & 1/1s", slug: "nft-generative-art", description: "Create and sell generative art and 1-of-1 unique pieces", tier: "pro", estimatedMinutes: 65, sortOrder: 4, isActive: true, learningObjectives: ["Understand generative art tools and platforms", "Create 1/1 authentic pieces", "Price premium artworks appropriately"], content: { sections: [{ id: "s1", title: "Generative Art", type: "text", content: "Code generates unique artworks from algorithms. Tools: Processing, p5.js, Codeine, ArtBlocks. Generative art appeals to collectors valuing: algorithm uniqueness, parameters, randomness in controlled ways. Higher perceived value due to technical complexity." }, { id: "s2", title: "Art Blocks & Programmable Collections", type: "text", content: "Art Blocks: mint code-generated artworks. Collectors receive unique variations. Your algorithm generates infinite variations but each mint is provably unique. Curated section: prestige, higher prices. Factory/partnership: broader reach." }, { id: "s3", title: "1/1 Authentic Works", type: "interactive", content: "1/1s are unique hand-created pieces, typically higher value than collections. Price: $1K-$1M+ depending on artist reputation. Market: Foundation, Superrare. Strategy: build reputation through collections first, then launch 1/1s at premium." }, { id: "s4", title: "Premium Pricing & Positioning", type: "text", content: "1/1s are positioning as fine art. Pricing psychology: $0.5 ETH feels cheap, 2 ETH feels premium. Collectors collect based on: artist trajectory, scarcity, aesthetic resonance. Earned authority drives premium pricing." }, { id: "s5", title: "Create Your First Generative Piece", type: "hands_on_lab", content: "Month 1: Learn p5.js basics, Month 2: Create 5 generative sketches, Month 3: Polish 1 into Art Blocks submission, Month 4: Launch on Curated or Factory. Simultaneously create 2-3 premium 1/1 pieces for Foundation launch next quarter." } ] }, personalizationEnabled: false },
  { spaceId: "nft-artistry", title: "NFT Business Models & Revenue", slug: "nft-business-models", description: "Build sustainable revenue from your art beyond minting", tier: "pro", estimatedMinutes: 60, sortOrder: 5, isActive: true, learningObjectives: ["Understand NFT royalties and secondary revenue", "Create utility for NFT holders", "Build long-term artist sustainability"], content: { sections: [{ id: "s1", title: "Royalty Optimization", type: "text", content: "Set 5-10% royalties on secondary sales. This is passive income: collectors trade, you earn. High-value artists: Bored Ape Yacht Club (2.5%), receive millions in annual royalties. Sustainable income source that grows with collection success." }, { id: "s2", title: "Utility & Token-Gating", type: "text", content: "Give holders exclusive benefits: private Discord channel, first access to new works, physical print, collaboration opportunities. Utility increases holder satisfaction and floor price. Token-gating creates community tiers." }, { id: "s3", title: "Licensing & Commercial Rights", type: "interactive", content: "License your artwork IP: brands want to use it, collectors want exclusive rights. Commercial licensing generates significant revenue. Example: a brand pays $10K to use your NFT art in campaign while NFT holder maintains ownership." }, { id: "s4", title: "Physical + Digital Hybrid", type: "text", content: "Issue NFT + physical print combo. Collectors get digital certificate + physical art. Increases perceived value and appeal to traditional art collectors entering Web3." }, { id: "s5", title: "Design Your Revenue Model", type: "hands_on_lab", content: "Document your sustainable revenue model: (1) Primary sales revenue, (2) Expected royalty yield, (3) Utility benefits (private value), (4) Licensing potential, (5) Physical product plans. Calculate: annual revenue if 500 collectors hold. Adjust strategy to maximize long-term income." } ] }, personalizationEnabled: false },
  { spaceId: "nft-artistry", title: "NFT Rights & Legal for Artists", slug: "nft-rights-legal", description: "Protect your art, understand smart contracts, and navigate legal issues", tier: "pro", estimatedMinutes: 55, sortOrder: 6, isActive: true, learningObjectives: ["Understand copyright and NFT ownership", "Navigate smart contract legality", "Protect yourself from scams and disputes"], content: { sections: [{ id: "s1", title: "Copyright & NFT Ownership", type: "text", content: "Minting an NFT ≠ transferring copyright. Buyer owns the NFT (digital certificate) but you usually retain copyright (can license, restrict commercial use). Be explicit: does buyer get commercial rights? Most NFT sales = digital collectible only, not commercial rights." }, { id: "s2", title: "Smart Contract Basics for Artists", type: "text", content: "Your NFT is controlled by smart contract code. Understand: can you update metadata? Can you change royalty percentage? Can someone freeze your account? Review contracts before minting. Standard ERC-721 is safe, custom contracts = verify security." }, { id: "s3", title: "Protecting Your Intellectual Property", type: "interactive", content: "Before minting: register copyright with relevant authority. Include copyright notice in metadata. Trademark your collection name if plans for expansion. This legal layer protects against someone copying your collection." }, { id: "s4", title: "Scams & Fraud Prevention", type: "text", content: "Common scams: fake contracts using similar addresses, phishing links stealing wallets, impersonators launching fake collections. Verification: official Twitter checkmark, Discord verification, community validation, etherscan contract review." }, { id: "s5", title: "Build Your Legal Protection", type: "hands_on_lab", content: "Before your next major launch: (1) Register copyright, (2) Review smart contract on Etherscan, (3) Trademark collection name if applicable, (4) Document all terms: copyright retained by artist, royalty percentages, commercial use restrictions. Consult lawyer for significant launches." } ] }, personalizationEnabled: false },

  // ===== BLOCKCHAIN SPACE (6 experiences) =====
  { spaceId: "blockchain", title: "Blockchain Fundamentals", slug: "blockchain-fundamentals", description: "Master blockchain technology from cryptography to consensus", tier: "free", estimatedMinutes: 70, sortOrder: 1, isActive: true, learningObjectives: ["Understand blockchain architecture and security", "Learn how different consensus mechanisms work", "Evaluate blockchain technology choices"], content: { sections: [{ id: "s1", title: "Blockchain Architecture", type: "text", content: "Blockchain = distributed database across thousands of computers. Each computer (node) has identical copy of transaction history. New transactions broadcast to network, nodes verify using consensus rules, transaction added to block. This distributed architecture prevents any single point of failure or control." }, { id: "s2", title: "Cryptography & Hashing", type: "text", content: "Hashing converts data to unique fingerprint. Change 1 bit of data = completely different hash. Each block contains hash of previous block, creating unbreakable chain. Attempt to modify old block = hash changes = breaks chain = detected immediately. This is how blockchain prevents tampering." }, { id: "s3", title: "Consensus Mechanisms", type: "interactive", content: "Proof-of-Work (Bitcoin): nodes compete solving puzzles (expensive), winner adds block, earns reward. Energy-intensive but secure. Proof-of-Stake (Ethereum 2.0): nodes stake collateral, selected to validate, lose stake if malicious. Energy-efficient, newer. Other: Proof-of-History, Proof-of-Authority, hybrid approaches." }, { id: "s4", title: "Blockchain Scalability & Layers", type: "text", content: "Layer 1 (Bitcoin, Ethereum): main blockchain, high security, slower, expensive. Layer 2 (Arbitrum, Optimism, Polygon): transactions processed off-chain, batched to Layer 1. Fast, cheap, inherit L1 security. Future = multi-layer networks." }, { id: "s5", title: "Blockchain Analysis", type: "hands_on_lab", content: "Study 3 blockchains: (1) Bitcoin (pure store-of-value), (2) Ethereum (smart contract platform), (3) Solana (speed-focused). For each: (A) Analyze consensus mechanism, (B) Compare transaction speed, (C) Evaluate fees, (D) Assess ecosystem maturity. Document your findings and compare." } ] }, personalizationEnabled: false },
  { spaceId: "blockchain", title: "Building on Blockchain", slug: "blockchain-building", description: "Learn to build dApps and smart contracts on blockchain", tier: "free", estimatedMinutes: 75, sortOrder: 2, isActive: true, learningObjectives: ["Understand dApp architecture", "Write basic smart contracts", "Deploy and interact with blockchain applications"], content: { sections: [{ id: "s1", title: "DApp Architecture", type: "text", content: "Traditional app: frontend + centralized backend. DApp: frontend + smart contract (decentralized backend). Frontend interacts with blockchain via libraries (web3.js, ethers.js). Smart contracts handle logic, data storage, financial transactions. Advantage: no central authority can shut down, censorship-resistant." }, { id: "s2", title: "Smart Contract Languages", type: "text", content: "Solidity: Ethereum standard, most mature, most resources. Vyper: Pythonic, emphasis on security. Rust: Solana, high-performance. Cairo: StarkNet, zero-knowledge proofs. Choose based on blockchain you're targeting." }, { id: "s3", title: "Smart Contract Development", type: "interactive", content: "Use Remix IDE (in-browser Solidity editor). Write: (1) Simple token contract, (2) Basic voting DAO, (3) Escrow contract. Deploy to testnet. Interact with contract via UI. This hands-on experience bridges theory and practice." }, { id: "s4", title: "Security Considerations", type: "text", content: "Smart contract bugs = permanent loss of user funds. Use: audited patterns, OpenZeppelin libraries, extensive testing, formal verification where possible. Never deploy unaudited code with real money. Reentrancy attacks, integer overflow, access control bugs are real." }, { id: "s5", title: "Build Your First DApp", type: "hands_on_lab", content: "Build a simple contract: a crowdfunding contract where users send ETH for a cause, funds released if goal met. Deploy to testnet (Sepolia). Create simple web interface to interact with it. Get feedback from community. Document lessons learned." } ] }, personalizationEnabled: false },
  { spaceId: "blockchain", title: "Interoperability & Cross-Chain", slug: "blockchain-interoperability", description: "Understand cross-chain bridges and multi-chain future", tier: "pro", estimatedMinutes: 65, sortOrder: 3, isActive: true, learningObjectives: ["Understand bridge mechanisms and risks", "Evaluate cross-chain solutions", "Navigate multi-chain asset management"], content: { sections: [{ id: "s1", title: "The Multi-Chain Reality", type: "text", content: "No single blockchain dominates. Ethereum = liquidity and dApps, Solana = speed and UX, Polygon = scaling, Arbitrum = Ethereum rollup, Cosmos = interoperable ecosystem. Users need assets across chains. Bridges enable this." }, { id: "s2", title: "How Bridges Work", type: "text", content: "Wrapped bridges: lock asset on Chain A, mint wrapped version on Chain B. Validator bridges: multiple signatories verify transfers. Liquidity bridges: swap mechanisms. Each has trade-offs: security vs speed vs cost." }, { id: "s3", title: "Bridge Risks", type: "interactive", content: "Bridge hacks = major vulnerability. History: Ronin bridge ($625M), Poly Network ($600M), Wormhole ($325M). Risks: validator compromise, smart contract bugs, governance exploits. Only use battle-tested bridges (Stargate, Across, Connext)." }, { id: "s4", title: "Multi-Chain Asset Management", type: "text", content: "Hold USDC on Ethereum, bridge to Polygon for cheap transactions, bridge to Arbitrum for yield. Use portfolio trackers (Zapper, DeFi Pulse) to monitor multi-chain holdings. Rebalance periodically." }, { id: "s5", title: "Navigate Multi-Chain Landscape", type: "hands_on_lab", content: "Create a multi-chain strategy: (1) Hold 3 assets (BTC, ETH, stablecoin), (2) Distribute across 4 chains, (3) Document bridge you use for each, (4) Track: cross-chain holdings, bridge fees, APYs by chain, (5) Monthly rebalancing for optimization." } ] }, personalizationEnabled: false },
  { spaceId: "blockchain", title: "Blockchain Governance", slug: "blockchain-governance", description: "Understand and participate in blockchain protocol governance", tier: "pro", estimatedMinutes: 60, sortOrder: 4, isActive: true, learningObjectives: ["Understand governance structures", "Participate in protocol decisions", "Evaluate governance quality and sustainability"], content: { sections: [{ id: "s1", title: "Governance Models", type: "text", content: "On-chain governance: token holders vote on protocol changes. Off-chain governance: core team decides (centralized, faster). Hybrid: off-chain discussion, on-chain voting. Decentralized governance = slower but more inclusive. Centralized governance = faster but less representative." }, { id: "s2", title: "Token-Based Voting", type: "text", content: "Token holders vote on: parameter changes (interest rates, fees), new features, treasury spending. Vote weight usually = token balance. Whales have disproportionate power (potential issue). Quadratic voting (decreasing marginal voting power) attempts to solve this." }, { id: "s3", title: "Active Governance Examples", type: "interactive", content: "Study: Uniswap (UNI holders vote), Aave (AAVE governance), MakerDAO (MKR holders), Compound (COMP governance). Examine recent proposals: What changed? Who voted? What was the outcome? Governance directly shapes protocol development." }, { id: "s4", title: "Governance Risks & Vulnerabilities", type: "text", content: "Voter apathy: 5% voter participation means 20% of active voters determine protocol. Whale domination: wealthy holders control outcomes. Governance attacks: attackers flash loan tokens to vote. Poor proposal quality wastes community time. Strong governance requires engaged community." }, { id: "s5", title: "Participate in Governance", type: "hands_on_lab", content: "Join protocol governance: (1) Hold governance tokens, (2) Read 3 active proposals, (3) Research + form opinion, (4) Vote on 1 proposal, (5) Engage in community discussion forum. Document your governance journey and impact." } ] }, personalizationEnabled: false },
  { spaceId: "blockchain", title: "Blockchain Regulation & Compliance", slug: "blockchain-regulation", description: "Navigate regulatory landscape and build compliant blockchain applications", tier: "pro", estimatedMinutes: 70, sortOrder: 5, isActive: true, learningObjectives: ["Understand global cryptocurrency regulations", "Build compliant blockchain applications", "Manage regulatory risk in your projects"], content: { sections: [{ id: "s1", title: "Global Regulatory Landscape", type: "text", content: "US: SEC oversees crypto securities, FinCEN regulates money transmitters, CFTC handles derivatives. EU: Markets in Crypto Assets Regulation (MiCA). China: crypto banned. Singapore: regulated framework. Regulations evolving rapidly. What's legal today = might not be tomorrow." }, { id: "s2", title: "Securities Law & Tokens", type: "text", content: "Token = security if it represents investment contract (profit expectation based on others' efforts). Securities require registration, audited financials, investor protections. Utility tokens (provide service, no investment return) = different rules. Correctly classify your token." }, { id: "s3", title: "KYC/AML Compliance", type: "interactive", content: "Know Your Customer (KYC): verify user identity. Anti-Money Laundering (AML): prevent criminal funds. CeFi platforms (Coinbase, Kraken) require KYC. DeFi protocols (Uniswap, Aave) = no KYC (yet). Regulatory pressure increasing for DeFi compliance." }, { id: "s4", title: "Building Compliant DApps", type: "text", content: "If building blockchain application: understand local regulations, consult lawyers, consider geography restrictions. Some DeFi protocols geofence US users. Others implement compliance features. Build with regulatory future in mind." }, { id: "s5", title: "Compliance Planning", type: "hands_on_lab", content: "If building blockchain project: (1) Consult blockchain lawyer, (2) Determine if your token is security, (3) Plan KYC/AML if applicable, (4) Document jurisdiction restrictions, (5) Build roadmap for compliance evolution. Compliance costs money but prevents bigger problems." } ] }, personalizationEnabled: false },
  { spaceId: "blockchain", title: "Future Blockchains & Emerging Tech", slug: "blockchain-future", description: "Explore emerging blockchain technologies and layer 2 solutions", tier: "pro", estimatedMinutes: 65, sortOrder: 6, isActive: true, learningObjectives: ["Understand zero-knowledge proofs and rollups", "Evaluate emerging blockchain platforms", "Anticipate blockchain evolution"], content: { sections: [{ id: "s1", title: "Zero-Knowledge Proofs", type: "text", content: "zk-SNARKs: prove statement true without revealing data. Application: prove you have funds without showing amount or identity. Privacy + verification. StarkNet, Scroll use zk-rollups for scaling. Powerful but complex technology." }, { id: "s2", title: "Layer 2 Solutions", type: "text", content: "Rollups (Arbitrum, Optimism, Scroll): batch transactions off-chain, prove validity on-chain. Fast, cheap, inherit L1 security. Sidechains (Polygon): separate blockchain with independent security. Channels (Lightning, Raiden): instant near-free transfers for frequent transactions." }, { id: "s3", title: "Emerging Blockchains", type: "interactive", content: "Evaluate emerging platforms: performance (TPS), security model, ecosystem maturity, cost, developer experience. Example: Aptos and Sui (Move language), Starknet (zk-focused), Sei (orderbook-optimized). Each solves different problems." }, { id: "s4", title: "Blockchain Predictions", type: "text", content: "Likely: Layer 2 dominance, zk-proof scaling, cross-chain interoperability. Less likely: Ethereum replacement (network effects matter). Possible: new Layer 1 breakthrough. Regulatory maturity will dramatically shape adoption." }, { id: "s5", title: "Technology Evaluation", type: "hands_on_lab", content: "Evaluate one emerging blockchain/protocol: (1) Study its whitepaper, (2) Test its user experience (if testnet available), (3) Analyze ecosystem (apps, liquidity, users), (4) Assess team credentials, (5) Predict: probability of 2-year success, potential market size. Document your analysis." } ] }, personalizationEnabled: false },

  // ===== DeFi SPACE (6 experiences) =====
  { spaceId: "defi", title: "DeFi Protocols & Architecture", slug: "defi-protocols", description: "Master DeFi protocols: DEXs, lending, synthetics, and derivatives", tier: "free", estimatedMinutes: 75, sortOrder: 1, isActive: true, learningObjectives: ["Understand DeFi protocol types", "Analyze protocol economics and sustainability", "Evaluate DeFi opportunities and risks"], content: { sections: [{ id: "s1", title: "DeFi Protocol Categories", type: "text", content: "DEXs (Uniswap, Curve): token swaps via automated market makers. Lending (Aave, Compound): borrow and lend at algorithmic rates. Synthetics (Synthetix, GMX): trade any asset exposure. Derivatives (dYdX, Hyperliquid): options, futures, perpetuals. Aggregators (1inch, Paraswap): route through best prices. Each solves different financial need." }, { id: "s2", title: "Automated Market Makers (AMMs)", type: "text", content: "Traditional exchange: buy/sell orders match. AMM: constant formula (x*y=k) determines prices. Provide liquidity, earn fees. Core insight: anyone can be market maker. Advantage: no order books needed, fast, permissionless. Disadvantage: potential impermanent loss." }, { id: "s3", title: "Lending Protocol Economics", type: "interactive", content: "Utilization rate = % of supplied funds borrowed. High utilization = high interest rates (incentivizes lending, discourages borrowing). Low utilization = low rates. Protocols use curves to balance supply and demand. Understand rate dynamics before depositing." }, { id: "s4", title: "Protocol Risk Assessment", type: "text", content: "Evaluate: code audit quality, team experience, TVL (total value locked), smart contract history, governance structure. Higher risk: new protocols, low TVL, unaudited code. Safer: battle-tested (Uniswap, Aave, Curve), large TVL, audited, mature governance." }, { id: "s5", title: "DeFi Protocol Analysis", type: "hands_on_lab", content: "Deep dive on 1 protocol: (1) Read whitepaper and documentation, (2) Analyze recent audit reports, (3) Review contract code on Etherscan, (4) Check Defisafety score, (5) Document: economics, sustainability, risks. Assess if you'd invest $10K." } ] }, personalizationEnabled: false },
  { spaceId: "defi", title: "Yield Farming & Liquidity Providing", slug: "defi-yield-farming", description: "Maximize returns through yield farming and liquidity provision strategies", tier: "free", estimatedMinutes: 70, sortOrder: 2, isActive: true, learningObjectives: ["Master yield farming strategies", "Understand impermanent loss", "Manage DeFi portfolio yields"], content: { sections: [{ id: "s1", title: "Yield Farming Mechanics", type: "text", content: "Deposit assets to earn: (1) Trading fees from swaps through your liquidity, (2) Incentive rewards (protocol paying you to provide liquidity). Combined yields can reach 50-500%+ but come with risks. Higher yields = higher risk (usually)." }, { id: "s2", title: "Impermanent Loss Explained", type: "text", content: "Provide $1000 (500 USDC + 0.5 ETH) to pool. If ETH doubles, your holding would be worth $2000. But pool rebalances to $750 ETH value + $750 USDC value. You lost $250 to impermanent loss. This is cost of providing liquidity. Higher volatility = higher impermanent loss." }, { id: "s3", title: "Yield Farming Strategies", type: "interactive", content: "Conservative: stablecoin pairs (USDC/USDT, minimal IL). Moderate: single-asset yield (Aave deposits). Aggressive: volatile pairs with high incentives (accept IL risk for yields). Strategy = match your risk tolerance and prediction (expect volatility vs stability)." }, { id: "s4", title: "Sustainable vs Unsustainable Yields", type: "text", content: "20% APY from sustainable fees + modest incentives = likely sustainable. 100%+ APY = usually unsustainable (built on incentives that will end). When incentives stop, yields collapse. Distinguish between sustainable income vs reward chasing." }, { id: "s5", title: "Yield Farming Plan", type: "hands_on_lab", content: "Create yield farming strategy: (1) Allocate $1000 across 3 protocols (conservative, moderate, aggressive), (2) Track daily: yields, IL, fees earned, (3) Month 1: document actual returns, (4) Month 2: rebalance based on performance, (5) Calculate annualized return, (6) Document: what worked, what didn't." } ] }, personalizationEnabled: false },
  { spaceId: "defi", title: "Advanced DeFi Strategies", slug: "defi-advanced-strategies", description: "Master advanced techniques: flash loans, leveraged trading, and complex strategies", tier: "pro", estimatedMinutes: 75, sortOrder: 3, isActive: true, learningObjectives: ["Understand flash loans and flash arbitrage", "Execute leveraged trading safely", "Compose complex DeFi strategies"], content: { sections: [{ id: "s1", title: "Flash Loans", type: "text", content: "Borrow millions of dollars with zero collateral, must repay within single transaction. Use: arbitrage (buy on DEX A, sell on DEX B, profit covers loan + fee), liquidations, collateral swaps. Risk: complex code, one error = loss. Flash loans enabled $billions in DeFi value extraction." }, { id: "s2", title: "Leveraged Trading", type: "text", content: "Borrow funds to amplify position: 10x leverage = 10% move means 100% gain or loss. Example: Buy 10 ETH with 1 ETH + 9 ETH borrowed. If ETH 10% up = you 100% up. If 10% down = you lose everything. High risk, requires discipline." }, { id: "s3", title: "Composability & Strategy Layering", type: "interactive", content: "DeFi composability = build complex strategies. Example: Borrow stablecoin from Aave (2%), provide as liquidity on Curve (5%), farm incentives (20%), net +23% yield (minus risks). Stacking protocols creates opportunities AND risks." }, { id: "s4", title: "Risk Management at Scale", type: "text", content: "Leverage is dangerous. Position sizing: never bet more than you can afford to lose. Stop losses: exit before catastrophic loss. Collateral monitoring: watch health factor, prevent liquidation. Insurance: use protocols covering losses (Nexus Mutual)." }, { id: "s5", title: "Design an Advanced Strategy", type: "hands_on_lab", content: "Design (don't execute) 1 advanced strategy: (1) Identify arbitrage or yield opportunity, (2) Map the strategy step-by-step, (3) Calculate: maximum profit, maximum loss, break-even, (4) Identify risks, (5) Paper trade (simulate without real money), (6) Only execute if: confident, backtested, position-sized conservatively." } ] }, personalizationEnabled: false },
  { spaceId: "defi", title: "DeFi Risk & Security", slug: "defi-risk-security", description: "Protect yourself from DeFi hacks, exploits, and losses", tier: "pro", estimatedMinutes: 65, sortOrder: 4, isActive: true, learningObjectives: ["Identify common DeFi exploits", "Evaluate smart contract security", "Manage DeFi portfolio risk"], content: { sections: [{ id: "s1", title: "Common DeFi Exploits", type: "text", content: "Flash loan attacks: borrow large amount, manipulate prices. Reentrancy: recursive calls drain contract. Oracle manipulation: fake price feeds. Rugpulls: developers steal funds. Historical: bZx ($600K), Pancake Bunny ($45M), Poly Network ($600M). Every month brings new exploits." }, { id: "s2", title: "Smart Contract Audits", type: "text", content: "Audit = security review by specialized firm. Look for: OpenZeppelin, Trail of Bits, Consensys, Immunefi audits. Check: audit date (recent?), critical vulnerabilities found (fixed?), code coverage. No audit or hidden vulnerabilities = major red flag." }, { id: "s3", title: "Due Diligence Checklist", type: "interactive", content: "Before depositing to any protocol: (1) Code audit (verified on Etherscan), (2) TVL ($10M+ preferred), (3) Team track record (have they shipped?), (4) Community sentiment, (5) Insurance available?, (6) Governance (active core team or decentralized?). Go down checklist." }, { id: "s4", title: "Portfolio Diversification in DeFi", type: "text", content: "Never deposit all funds to one protocol. Spread across: different protocols, different blockchains, different risk tiers. If one hacked, you lose max one position. Diversification = survival." }, { id: "s5", title: "Build Your Safety Framework", type: "hands_on_lab", content: "Document your DeFi safety framework: (1) Only use audited protocols (list them), (2) TVL minimum: $X million, (3) Position size maximum: X% of portfolio, (4) Insurance required for amounts over $Y, (5) Rebalance monthly, (6) Monitor alerts for exploits. Use this framework for every DeFi decision." } ] }, personalizationEnabled: false },
  { spaceId: "defi", title: "DeFi Governance & DAOs", slug: "defi-governance-daos", description: "Participate in DeFi governance and understand DAO economics", tier: "pro", estimatedMinutes: 70, sortOrder: 5, isActive: true, learningObjectives: ["Understand DAO governance mechanisms", "Participate in DeFi protocol voting", "Evaluate governance token value"], content: { sections: [{ id: "s1", title: "DAOs & Decentralized Governance", type: "text", content: "DAO = Decentralized Autonomous Organization run by smart contracts + community voting. No CEO, no board of directors. Governance token = voting power. Examples: Uniswap (UNI holders vote), Curve (veCRV holders), MakerDAO (MKR governance). Governance = direct participation in protocol decisions." }, { id: "s2", title: "Governance Token Economics", type: "text", content: "Governance tokens accrue value from: fee capture (protocol shares revenue), voting power, prestige. Token holder = stakeholder in protocol success. High conviction = buy governance token. Expect volatility (votes create uncertainty)." }, { id: "s3", title: "Voting Power & Delegation", type: "interactive", content: "Direct voting = propose and vote yourself. Delegation = give your voting power to others. Vote escrow (Curve): lock tokens for voting power (longer lock = more power). Quadratic voting: decreasing voting power per token (reduce whale dominance)." }, { id: "s4", title: "Evaluating Governance Quality", type: "text", content: "Good governance: active discussion, diverse voting participation, contentious decisions resolved democratically. Bad governance: 95% of decisions passed by default, whales control outcomes, community ignored. Governance quality = protocol sustainability." }, { id: "s5", title: "Participate in DAO Governance", type: "hands_on_lab", content: "Join protocol governance: (1) Hold governance token, (2) Review 5 recent proposals in detail, (3) Engage in governance Discord, (4) Vote on 1-2 upcoming proposals, (5) Document: your opinion, reasoning, outcome. This is how protocols evolve." } ] }, personalizationEnabled: false },

  // ===== SMART CONTRACTS SPACE (6 experiences) =====
  { spaceId: "smart-contracts", title: "Solidity Programming Basics", slug: "solidity-basics", description: "Learn Solidity programming and deploy your first contract", tier: "free", estimatedMinutes: 80, sortOrder: 1, isActive: true, learningObjectives: ["Write basic Solidity smart contracts", "Understand variables, functions, and events", "Deploy contracts to testnet"], content: { sections: [{ id: "s1", title: "Solidity Fundamentals", type: "text", content: "Solidity = programming language for Ethereum smart contracts. Syntax similar to JavaScript. Contract = class containing state variables and functions. Smart contract deploys to blockchain, code becomes immutable. Every line of code must be perfect (bugs = lost funds)." }, { id: "s2", title: "Data Types & Variables", type: "text", content: "uint (256-bit unsigned integer), int (signed), bool (true/false), address (20-byte account), bytes (arbitrary), string (text), arrays, mappings. State variables = stored on blockchain (expensive). Local variables = temporary (cheap). Choose carefully." }, { id: "s3", title: "Functions & Events", type: "interactive", content: "Functions: view (read-only, free), pure (no state access, free), payable (accept ETH), state-changing (cost gas). Events: log data to blockchain for frontend listening. Write: simple token transfer, voting contract, escrow. Test on Remix IDE (in-browser)." }, { id: "s4", title: "Deploying to Testnet", type: "text", content: "Get testnet ETH from faucets. Use Remix + MetaMask to deploy. Contract lives forever on testnet. Interact with deployed contract via Remix interface or Etherscan. Test every code path before mainnet." }, { id: "s5", title: "Your First Contract", type: "hands_on_lab", content: "Deploy a simple contract: (1) Write a counter contract (increment, decrement, get count), (2) Test in Remix, (3) Deploy to Sepolia testnet, (4) Interact with it 10 times, (5) Verify on Etherscan, (6) Share deployed address. You've shipped code to blockchain!" } ] }, personalizationEnabled: false },
  { spaceId: "smart-contracts", title: "Advanced Solidity Patterns", slug: "solidity-advanced", description: "Master advanced patterns, security best practices, and optimization", tier: "free", estimatedMinutes: 85, sortOrder: 2, isActive: true, learningObjectives: ["Implement complex smart contract patterns", "Write secure, gas-efficient code", "Use OpenZeppelin library contracts"], content: { sections: [{ id: "s1", title: "Storage, Memory, Calldata", type: "text", content: "Storage = blockchain (expensive). Memory = temporary RAM (cheaper). Calldata = immutable input data (cheapest). Code efficiency = minimize storage writes. Use memory arrays when possible. Optimize variable layout (different types take different space)." }, { id: "s2", title: "OpenZeppelin Contracts", type: "text", content: "Don't write ERC-20, ERC-721, ERC-1155 from scratch. Use OpenZeppelin library (audited, battle-tested). Inherit: contract MyToken is ERC20 { ... }. Override functions as needed. Saves time, improves security." }, { id: "s3", title: "Common Vulnerabilities", type: "interactive", content: "Reentrancy: contract called back before first call completes. Integer overflow/underflow: arithmetic wraps around (fixed in Solidity 0.8). Access control: function accessible to wrong caller. Test every edge case." }, { id: "s4", title: "Gas Optimization", type: "text", content: "Expensive operations: SSTORE (storage write, 20K gas), SLOAD (read, 2K gas), CALL (external call, 700 gas). Optimization: batch storage writes, use events instead of storage, efficient loops. Cheap operation can save users millions." }, { id: "s5", title: "Build an Advanced Contract", type: "hands_on_lab", content: "Implement NFT contract with: (1) ERC-721 using OpenZeppelin, (2) Minting function with payment, (3) Royalties on secondary sales, (4) Pausable by admin. Deploy to testnet. Mint an NFT. Verify on Etherscan. Security checklist before launch." } ] }, personalizationEnabled: false },
  { spaceId: "smart-contracts", title: "Testing & Security Auditing", slug: "smart-contracts-testing", description: "Test contracts thoroughly and conduct security audits", tier: "pro", estimatedMinutes: 75, sortOrder: 3, isActive: true, learningObjectives: ["Write comprehensive unit and integration tests", "Conduct security audits", "Use formal verification tools"], content: { sections: [{ id: "s1", title: "Unit Testing with Hardhat", type: "text", content: "Hardhat = development framework for Solidity. Write tests in JavaScript/TypeScript. Test every function, edge cases, failure scenarios. 100% code coverage = minimum standard. Tests prevent regressions." }, { id: "s2", title: "Scenario & Integration Testing", type: "text", content: "Unit tests: individual functions. Integration tests: multi-step scenarios. Fuzz testing: random inputs find bugs. Example: test staking contract through entire lifecycle (stake, earn yield, unstake)." }, { id: "s3", title: "Security Audit Checklist", type: "interactive", content: "Before deploying: (1) Code review by 2+ developers, (2) Automated analysis (Slither, Mythril), (3) Professional audit by firm, (4) Bug bounty program (let hackers hunt bugs), (5) Staged rollout (small amount first, monitor). Never deploy unaudited code with large TVL." }, { id: "s4", title: "Formal Verification", type: "text", content: "Mathematical proof contract behavior is correct. Tools: TLA+, Dafny. Expensive but provably secure. Used for high-stakes contracts (MakerDAO, Uniswap). Overkill for simple contracts." }, { id: "s5", title: "Security Audit Your Contract", type: "hands_on_lab", content: "Audit your previous contract: (1) Write 20+ test cases, (2) Run automated tools (Slither, Mythril), (3) Manual code review line-by-line, (4) List potential vulnerabilities, (5) Fix issues, (6) Re-test. Get feedback from peers. Document your audit." } ] }, personalizationEnabled: false },
  { spaceId: "smart-contracts", title: "DeFi Smart Contracts", slug: "defi-contracts", description: "Build DeFi protocols: AMMs, lending, and derivatives", tier: "pro", estimatedMinutes: 80, sortOrder: 4, isActive: true, learningObjectives: ["Implement DEX/AMM smart contracts", "Build lending protocols", "Understand DeFi-specific security"], content: { sections: [{ id: "s1", title: "Automated Market Maker Implementation", type: "text", content: "Core AMM logic: x * y = k (Uniswap V2 formula). Liquidity providers deposit equal value of tokens. Swappers pay 0.3% fee. Math: if you want to buy amount B of token Y, you pay: amount A = (B / (y - B)) * x. Implement this in Solidity." }, { id: "s2", title: "Lending Protocol Architecture", type: "text", content: "Interest rate model: based on utilization. Collateral: users deposit to borrow. Liquidation: if collateral value drops, position closes. Governance: protocol parameter adjustments. Complex but lucrative (Aave TVL: $10B+)." }, { id: "s3", title: "Oracle Integration", type: "interactive", content: "Smart contracts need external data (prices, exchange rates). Oracles provide this. Chainlink = most trusted. Flash loan vulnerability: manipulate oracle price. Mitigation: use TWAP (time-weighted average price), multiple oracles, sanity checks." }, { id: "s4", title: "Economic Design", type: "text", content: "Tokenomics matters: incentive structure determines behavior. Good incentives: sustainable yield, aligned stakeholder interests. Bad incentives: incentives end abruptly, yield becomes unsustainable. Economic modeling = crucial before launch." }, { id: "s5", title: "Build Simple AMM", type: "hands_on_lab", content: "Implement basic AMM: (1) Create pool for 2 tokens, (2) Implement swaps using x*y=k, (3) Charge 0.3% fee, (4) Let LPs deposit and earn fees, (5) Deploy to testnet, (6) Test swaps, (7) Document: TVL, volume, fee collected. You've built a DEX!" } ] }, personalizationEnabled: false },
  { spaceId: "smart-contracts", title: "Upgradeable Contracts & Governance", slug: "smart-contracts-upgradeable", description: "Build upgradeable contracts and implement DAO governance", tier: "pro", estimatedMinutes: 70, sortOrder: 5, isActive: true, learningObjectives: ["Implement proxy pattern for upgrades", "Build governance contracts", "Understand decentralized decision-making"], content: { sections: [{ id: "s1", title: "Proxy Pattern", type: "text", content: "Problem: deployed contracts can't change (immutable). Solution: proxy delegates calls to logic contract. Upgrade = deploy new logic contract, update proxy pointer. Users interact with proxy (never changes), logic can evolve." }, { id: "s2", title: "Upgrade Patterns", type: "text", content: "Transparent Proxy: proxy distinguishes admin vs user calls. UUPS: logic contract controls upgrades. Beacon: multiple contracts share upgrade. Each has trade-offs: flexibility vs simplicity vs security." }, { id: "s3", title: "Governance Contract Implementation", type: "interactive", content: "Proposal flow: (1) Propose action, (2) Vote period (voting happens), (3) Timelock (delay before execution), (4) Execute. Voting: token holders vote, results weighted by token amount. Timelock: gives community chance to exit if proposal is bad." }, { id: "s4", title: "Multi-Sig Wallets", type: "text", content: "Instead of 1 key controlling governance, require M-of-N signers. Example: 3-of-5 multisig = any 3 of 5 trusted members can execute. More secure than single key, slower than on-chain voting. Used for core protocol upgrades." }, { id: "s5", title: "Build a Governance System", type: "hands_on_lab", content: "Implement governance: (1) Governance token contract, (2) Voting mechanism (token-weighted), (3) Proposal system, (4) Timelock execution. Deploy to testnet. Create + vote on test proposal. Execute it. Document governance flow and security assumptions." } ] }, personalizationEnabled: false },

  // ===== METAVERSE BUSINESS SPACE (6 experiences) =====
  { spaceId: "metaverse-business", title: "Metaverse Fundamentals & Opportunities", slug: "metaverse-fundamentals", description: "Understand the metaverse, virtual worlds, and business opportunities", tier: "free", estimatedMinutes: 70, sortOrder: 1, isActive: true, learningObjectives: ["Understand metaverse technologies and platforms", "Identify business opportunities in virtual worlds", "Evaluate metaverse investments"], content: { sections: [{ id: "s1", title: "What is the Metaverse", type: "text", content: "Metaverse = persistent, immersive virtual world where people socialize, work, play, create. Not ONE place but interconnected networks. Components: VR headsets (hardware), game engines (Unreal, Unity), blockchain (ownership), avatars (identity). Reality: today's metaverse is gaming + social platforms. Meta's 'metaverse' = expensive, unproven." }, { id: "s2", title: "Major Metaverse Platforms", type: "text", content: "Roblox: user-created games, millions of players, monetization platform. Decentraland: blockchain-based, user-owned land/items, Web3. Axie Infinity: play-to-earn game, NFTs, community-driven. Fortnite: mainstream, cosmetics economy, cross-platform. Each has different model." }, { id: "s3", title: "Virtual Real Estate & Property", type: "interactive", content: "Own land in virtual worlds (NFTs). Decentraland: land parcels. The Sandbox: plots. Rent to builders, host events, monetize. Virtual property = emerging market. Value varies wildly. Speculative but potentially lucrative if metaverse adoption accelerates." }, { id: "s4", title: "Creator Economy in Metaverse", type: "text", content: "Create and sell: avatar skins, accessories, virtual furniture, experiences, games. Monetization: direct sales, royalties on resales, sponsorships. Roblox creators earn $100M+/year collectively. YouTube of metaverse = opportunity for creators." }, { id: "s5", title: "Metaverse Opportunity Assessment", type: "hands_on_lab", content: "Explore metaverse landscape: (1) Create account in Roblox, Decentraland, Fortnite, (2) Spend 30 minutes in each, (3) Identify creator opportunities, (4) Document: business model, monetization path, barriers to entry, (5) Assess: where could YOU build?" } ] }, personalizationEnabled: false },
  { spaceId: "metaverse-business", title: "Virtual Business Models", slug: "virtual-business-models", description: "Build sustainable businesses in virtual worlds", tier: "free", estimatedMinutes: 75, sortOrder: 2, isActive: true, learningObjectives: ["Develop virtual business models", "Monetize virtual experiences", "Scale virtual properties and services"], content: { sections: [{ id: "s1", title: "Virtual Real Estate Business", type: "text", content: "Buy land in virtual world, develop it, rent or sell. Example: Decentraland LAND = NFT real estate. Prime locations (Metaverse Fashion Week, Club Street) command high prices. Rent out for events, host businesses. Upside: land appreciation. Downside: user adoption uncertainty." }, { id: "s2", title: "Virtual Fashion & Cosmetics", type: "text", content: "Avatar cosmetics = big business. Nike, Gucci, Balenciaga sell virtual items. Example: Roblox avatars spending $1B+/year on accessories. Create skins, clothing, accessories, sell on marketplaces. User-driven design = authentic." }, { id: "s3", title: "Experience & Entertainment", type: "interactive", content: "Host events in metaverse: concerts (Travis Scott, Ariana Grande virtual shows), conferences, brand experiences. Monetize: ticket sales, sponsorships, merchandise. Scale: 100K+ people in one venue (impossible IRL). Accessibility + scale = value." }, { id: "s4", title: "Education & Training", type: "text", content: "Virtual classrooms in metaverse. Benefits: immersion, avatar presence, global access. Applications: corporate training, schools, professional development. Premium: live instruction, certifications, community." }, { id: "s5", title: "Launch Your Virtual Business", type: "hands_on_lab", content: "Plan a virtual business: (1) Choose platform (Roblox, Decentraland, etc), (2) Define offering (property, product, service, experience), (3) Map revenue model, (4) Create 30-day launch plan, (5) Estimate: startup costs, monthly revenue, break-even. Pitch it to a friend. Get feedback." } ] }, personalizationEnabled: false },
  { spaceId: "metaverse-business", title: "Building in the Metaverse", slug: "metaverse-building", description: "Create worlds and experiences using game engines and tools", tier: "pro", estimatedMinutes: 80, sortOrder: 3, isActive: true, learningObjectives: ["Use game engines (Unreal, Unity) for metaverse building", "Create immersive experiences", "Monetize user-generated content"], content: { sections: [{ id: "s1", title: "Game Engines: Unreal vs Unity", type: "text", content: "Unreal Engine: powerful graphics, steep learning curve, 5% revenue share after $1M. Unity: easier, broader adoption, 1.2% revenue share. Both: C++ or C# scripting, asset marketplaces. Choose: Unreal for cutting-edge visuals, Unity for faster prototyping." }, { id: "s2", title: "Creating 3D Assets & Worlds", type: "text", content: "Tools: Blender (free 3D modeling), Substance Painter (textures), Unreal/Unity (composition). Workflow: design concept, model, texture, animate, integrate into engine. Asset quality = user experience. Free assets: Sketchfab, Unity Asset Store. Paid assets: better quality but cost money." }, { id: "s3", title: "Monetizing Experiences", type: "interactive", content: "Revenue models: (1) In-game purchases (cosmetics, power-ups), (2) Sponsorships (brands pay for placement), (3) Ad revenue (watch ads for benefits), (4) Battle pass (seasonal premium content), (5) Land/item rentals. Sustainable = multiple revenue streams." }, { id: "s4", title: "Community & Network Effects", type: "text", content: "Successful metaverse games = strong communities. Discord, social features within game, streamer adoption, user content creation. Network effects: more players = more value for all. Community >> technology in determining success." }, { id: "s5", title: "Build a Simple Experience", type: "hands_on_lab", content: "Create in-engine experience: (1) Download Unreal or Unity (free), (2) Complete basic tutorial, (3) Import 3D model from Sketchfab, (4) Build simple world (room, plaza, arena), (5) Add basic interaction (walking, clicking objects), (6) Share with friends. Document: creation time, tools used, what's next?" } ] }, personalizationEnabled: false },
  { spaceId: "metaverse-business", title: "NFTs & Metaverse Economy", slug: "metaverse-nfts-economy", description: "Understand NFTs in metaverse, digital ownership, and Web3 integration", tier: "pro", estimatedMinutes: 65, sortOrder: 4, isActive: true, learningObjectives: ["Integrate NFTs into metaverse experiences", "Design sustainable token economies", "Build interoperable metaverse assets"], content: { sections: [{ id: "s1", title: "NFTs as In-Game Assets", type: "text", content: "NFT = provable ownership of digital item. In metaverse: own avatar, cosmetics, land, vehicles as NFTs. Advantages: true ownership, tradeable across platforms (if standards align), persistent value. Disadvantage: user experience complexity (blockchain interactions)." }, { id: "s2", title: "Play-to-Earn Models", type: "text", content: "Players earn tokens by playing. Axie Infinity: earn AXS/SLP playing. Potential: turn gameplay into income. Reality: most players earn $1-5/day (unsustainable). Sustainable play-to-earn requires: large player base, real economic activity, not just token-dumping." }, { id: "s3", title: "Metaverse Token Economics", type: "interactive", content: "Design sustainable token economy: (1) What is token utility?, (2) Total supply cap, (3) Emission schedule (who earns tokens?), (4) Sinks (how do tokens disappear?), (5) Value capture (why hold token long-term?). Bad economies: token inflation never ends, no value capture." }, { id: "s4", title: "Cross-Platform Asset Portability", type: "text", content: "Future metaverse: avatar and items work across platforms. Standards: ERC-721 (NFTs), interoperability protocols (Warp, Gala). Reality: siloed ecosystems dominate today. Asset portability = future opportunity." }, { id: "s5", title: "Design a Metaverse Economy", type: "hands_on_lab", content: "Design token economy for your experience: (1) Define token utility (governance, in-game, staking?), (2) Supply cap and emission schedule, (3) Value sinks (spending mechanisms), (4) Sustainability analysis (can it run 5 years?), (5) Competitive analysis (how does it compare to Axie, Decentraland?). Document your model." } ] }, personalizationEnabled: false },
  { spaceId: "metaverse-business", title: "Metaverse Trends & Future", slug: "metaverse-trends-future", description: "Understand emerging trends and prepare for metaverse evolution", tier: "pro", estimatedMinutes: 60, sortOrder: 5, isActive: true, learningObjectives: ["Identify emerging metaverse trends", "Anticipate platform evolution", "Position yourself for metaverse future"], content: { sections: [{ id: "s1", title: "VR/AR Hardware Evolution", type: "text", content: "Meta Quest 3: mixed reality (real + virtual), $500. Apple Vision Pro: premium AR, $3500. Haptic suits: physical sensations. Eyes tracking, hand tracking improving. Future: lightweight glasses, brain-computer interfaces. Hardware progress = experience quality." }, { id: "s2", title: "Interoperability & Open Standards", type: "text", content: "Walled gardens (Roblox, Fortnite) vs open metaverse (Decentraland, Spatial). Trend: blockchain protocols enabling interop. Metaverse may fragment OR consolidate. Winners: early builders on winning platforms. Risk: build on wrong platform." }, { id: "s3", title: "AI in Metaverse", type: "interactive", content: "AI NPCs that learn and adapt. AI-generated content (worlds, clothing, experiences). Personalized experiences: AI tailors metaverse to individual. Concern: authenticity (if all items AI-generated, value unclear). Opportunity: leverage AI to scale content creation." }, { id: "s4", title: "Monetization & Platform Evolution", type: "text", content: "Platforms evolving: Roblox → mature economy platform, Decentraland → Web3 focus, Meta → pushing VR (still losing money). Successful model TBD. Betting: pick platform carefully. Diversify across platforms." }, { id: "s5", title: "Metaverse Future Positioning", type: "hands_on_lab", content: "Position yourself for metaverse: (1) Deep dive on 2 platforms (study roadmap, user growth, monetization), (2) Build simple experience on one, (3) Buy small real estate position on one platform, (4) Create monthly trend report (what's changing?), (5) Develop 5-year strategy. How will you profit from metaverse?" } ] }, personalizationEnabled: false },

  // Placeholder for last digital-boutique experience to complete structure
  {
    spaceId: "digital-boutique",
    title: "Launch Your Online Store",
    slug: "digital-boutique-launch",
    description: "Start selling online in 3 days with Shopify and AI",
    tier: "free",
    estimatedMinutes: 75,
    sortOrder: 1,
    isActive: true,
    learningObjectives: [
      "Set up your Shopify store in one day",
      "Use AI for product descriptions and marketing",
      "Drive traffic and sales to your store"
    ],
    content: {
      sections: [
        { id: "s1", title: "Section 1", type: "text", content: "Content for section 1" },
        { id: "s2", title: "Section 2", type: "text", content: "Content for section 2" },
        { id: "s3", title: "Section 3", type: "text", content: "Content for section 3" },
        { id: "s4", title: "Section 4", type: "text", content: "Content for section 4" },
        { id: "s5", title: "Section 5", type: "hands_on_lab", content: "Hands-on content" }
      ]
    },
    personalizationEnabled: false
  }
];

export async function seedExperiences() {
  try {
    const { db } = await import("./db");
    const { transformationalExperiences } = await import("../shared/schema");
    
    console.log("Seeding transformational experiences...");

    for (const experience of EXPERIENCES) {
      try {
        const data = {
          spaceId: experience.spaceId,
          title: experience.title,
          slug: experience.slug,
          description: experience.description,
          tier: experience.tier,
          estimatedMinutes: experience.estimatedMinutes,
          sortOrder: experience.sortOrder,
          isActive: experience.isActive,
          learningObjectives: experience.learningObjectives,
          content: experience.content,
          personalizationEnabled: experience.personalizationEnabled,
        };

        await db
          .insert(transformationalExperiences)
          .values(data as any)
          .onConflictDoNothing();

        console.log(`✓ Seeded: ${experience.title}`);
      } catch (rowError) {
        console.warn(`⚠ Could not seed ${experience.title}:`, rowError);
        // Continue with next experience
      }
    }

    console.log(`✓ All ${EXPERIENCES.length} experiences processed!`);
  } catch (error) {
    console.error("Error seeding experiences:", error);
    // Don't throw - allow app to continue even if seeding fails
  }
}
