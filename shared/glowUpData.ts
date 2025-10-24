export type GlowUpLesson = {
  day: number;
  title: string;
  lesson: string;
  gptPromptTemplate: string;
  shareCaption: string;
};

export const glowUpLessons: GlowUpLesson[] = [
  {
    day: 1,
    title: "Your Brand Starts With You",
    lesson: "Your brand is not just a logo or a color palette—it's the essence of who you are and what you stand for. Authentic branding begins with self-awareness: understanding your values, your unique experiences, and the transformation you offer. When you build from this foundation, your message resonates deeply because it's genuine. Today, we're uncovering your origin story—the 'why' behind your work. This narrative becomes the heartbeat of everything you create, making your brand memorable and magnetic. Remember, people don't just buy what you do; they buy why you do it. Your story is your superpower.",
    gptPromptTemplate: "My name is {name}, and I'm building a {brandType} brand in the {niche} space. Write my founder story in 3 compelling paragraphs that explain: (1) what led me to start this journey, (2) the transformation I want to create for others, and (3) why this work matters to me personally. Make it authentic, inspiring, and relatable.",
    shareCaption: "Day 1 of my AI Glow-Up ✨ Today I'm digging into my founder story—the real reason I built this brand and what it means to me. Here's the truth about why I started... 💫 #AIGlowUp #FounderStory #BrandBuilding"
  },
  {
    day: 2,
    title: "Find Your Niche",
    lesson: "A niche is not about limiting yourself—it's about amplifying your impact. When you try to speak to everyone, you end up reaching no one. Your niche is the intersection of who you serve, what problem you solve, and how you uniquely deliver results. It's about getting specific: not just 'helping women,' but 'helping women entrepreneurs build profitable personal brands using AI tools.' Clarity creates magnetism. Today, you'll define exactly who you help, what pain points they experience, and the specific outcome you deliver. This precision makes your marketing effortless because you know exactly who you're talking to and what they need.",
    gptPromptTemplate: "I'm {name}, working in {niche} on {platform}. Help me refine my niche by answering these questions: (1) Who is my ideal client? (Be specific—demographics, psychographics, current situation), (2) What are their top 3 pain points or frustrations?, (3) What specific, measurable result do I help them achieve?, (4) What makes my approach different from others in this space? Give me a clear, one-sentence niche statement at the end.",
    shareCaption: "Day 2: I finally claimed my niche 💫 I help {who} achieve {result} through {method}. Getting this specific felt scary, but now my message is crystal clear. Who else is niching down? #AIGlowUp #NicheDown #Clarity"
  },
  {
    day: 3,
    title: "Craft Your Voice",
    lesson: "Your brand voice is how you show up across every touchpoint—from captions to emails to sales pages. It's the personality behind your words. Consistency in voice builds trust and recognition; your audience should recognize your content even without seeing your name. Are you bold and direct? Warm and nurturing? Luxurious and aspirational? Today, you'll experiment with different voice styles and select the one that feels most authentic to you and resonates with your ideal audience. Think of your voice as your brand's fingerprint—unique, recognizable, and unmistakably you. This consistency turns casual followers into devoted fans.",
    gptPromptTemplate: "I'm {name}, a {brandType} brand targeting people in {niche}. Generate 3 different brand voice styles for me: (1) Bold & Confident, (2) Warm & Nurturing, (3) Luxurious & Aspirational. For each style, write a sample Instagram caption about starting a new week. Then help me choose which voice style best aligns with my personality and audience.",
    shareCaption: "Day 3: I'm defining my brand voice today 🎤 Because consistency isn't boring—it's how you become unforgettable. Which voice style speaks to you: bold, warm, or luxe? #AIGlowUp #BrandVoice #ContentStrategy"
  },
  {
    day: 4,
    title: "Visual Identity",
    lesson: "Visual identity is more than aesthetics—it's strategic communication. Your colors, fonts, imagery style, and design elements should instantly convey the feeling you want your brand to evoke. Think about luxury brands: their visual consistency is impeccable. Today, you'll define your visual brand elements based on the emotions you want to create. Cool tones evoke calm and trust; warm tones create energy and excitement. Minimalist designs suggest sophistication; bold patterns convey creativity. Your visual identity should align with your brand voice and speak directly to your ideal client's aspirations. When visuals and message align, you create an immersive brand experience.",
    gptPromptTemplate: "Based on my brand ({brandType} in {niche} with a {goal} goal), recommend a visual identity that will resonate with my audience. Include: (1) A color palette (5 colors with hex codes and their psychological meaning), (2) Font pairing suggestions (one for headings, one for body text), (3) Photography/imagery style (e.g., editorial, candid, minimalist), (4) Design aesthetic keywords (3-5 adjectives). Make recommendations that feel cohesive and strategic.",
    shareCaption: "Day 4 of the Glow-Up: Defining my visual identity 🎨 Colors, fonts, and vibes that actually match my brand message. Your eyes experience brands before your brain does—make it intentional. #AIGlowUp #VisualBranding #DesignStrategy"
  },
  {
    day: 5,
    title: "Platform Strategy",
    lesson: "Not all platforms are created equal, and you don't need to be everywhere. Each platform has its own culture, content style, and ideal user. Instagram favors high-quality visuals and reels; LinkedIn rewards thought leadership and professional insights; TikTok thrives on authenticity and trends; X (Twitter) values concise, timely commentary. Today, you'll develop a strategic approach for your primary platform: understanding what content performs, how often to post, and how to optimize for discoverability. Master one platform before spreading yourself thin. Depth beats breadth every time. Your goal is to become known as the go-to expert in your niche on your chosen platform.",
    gptPromptTemplate: "I'm focusing on building my {brandType} brand on {platform}. Create a platform-specific content strategy for me including: (1) What content formats work best on this platform right now, (2) Optimal posting frequency and best times, (3) How to optimize my profile/bio for discoverability, (4) 5 content ideas tailored specifically to this platform's algorithm and culture, (5) Engagement strategies to build community. Make it actionable and current.",
    shareCaption: "Day 5: Platform strategy unlocked 📲 Not about being everywhere—it's about dominating where it matters. I'm going all-in on {platform}. Where are you building? #AIGlowUp #SocialStrategy #PlatformMastery"
  },
  {
    day: 6,
    title: "Bio Glow-Up",
    lesson: "Your bio is premium real estate—it's often the first impression you make, and you have seconds to capture attention. A powerful bio communicates three things instantly: who you are, who you help, and what result you deliver. It should be specific, benefit-driven, and include a clear call-to-action. Avoid vague descriptors like 'helping women thrive'—instead, get concrete: 'Teaching women entrepreneurs to build 6-figure brands using AI.' Today, you'll craft multiple bio variations optimized for clarity, intrigue, and conversion. Your bio should make people think, 'This is exactly what I need.' Test different versions and see what resonates.",
    gptPromptTemplate: "I'm {name}, {brandType} brand in {niche}. Write 5 different bio variations for {platform} (each under 150 characters) that include: who I help, the result I deliver, and a unique angle. Make them benefit-driven, specific, and scroll-stopping. Include one CTA variation for each (e.g., 'DM me X' or 'Link below for Y'). Then rank them by potential impact.",
    shareCaption: "Day 6: Bio glow-up ✨ Your bio is a billboard, not a diary. Does yours make people stop, click, and convert? Mine does now. #AIGlowUp #BioOptimization #FirstImpressions"
  },
  {
    day: 7,
    title: "Storytelling",
    lesson: "Facts tell, but stories sell. Storytelling is the most powerful tool in your branding arsenal because humans are wired for narrative. We remember stories 22x more than facts alone. The best brand stories follow a simple arc: challenge, struggle, transformation, result. Your audience doesn't just want to know what you offer—they want to see themselves in your journey. Today, you'll craft signature stories you can use across your content: client transformation stories, your own before-and-after journey, and 'aha moment' stories. These narratives build emotional connection and demonstrate proof of concept. Master storytelling, and you'll never struggle with content again.",
    gptPromptTemplate: "Help me craft 3 signature stories for my {brandType} brand in {niche}: (1) My personal transformation story (what I overcame to get here), (2) An ideal client success story (use a realistic persona if I don't have one yet), (3) An 'aha moment' story (when I discovered my method/approach). Structure each with: Hook → Challenge → Action → Result → Lesson. Make them emotionally compelling and relatable.",
    shareCaption: "Day 7 of my AI Glow-Up: Storytelling 📖 People won't remember your credentials, but they'll remember how you made them feel. Here's a story that changed everything for me... #AIGlowUp #Storytelling #BrandNarrative"
  },
  {
    day: 8,
    title: "Offer Design",
    lesson: "Your offer is not just what you sell—it's the transformation you promise. A powerful offer is specific, desirable, and believable. It answers: What do they get? What result will they achieve? Why should they believe you can deliver? Today, you'll design an irresistible offer by identifying your audience's deepest desire, the obstacles preventing them from achieving it, and your unique mechanism for delivering results. The best offers feel like no-brainers: 'Of course I need this.' Whether you're selling a product, service, or experience, clarity and specificity make your offer magnetic. Vague offers repel; clear offers attract.",
    gptPromptTemplate: "I'm {name}, creating a {brandType} offer in {niche}. Help me design an irresistible signature offer by answering: (1) What is the ultimate result my ideal client wants? (2) What are the 3 biggest obstacles preventing them from achieving it?, (3) What is my unique method or framework for delivering this result?, (4) What would I name this offer to make it memorable and desirable?, (5) Write a one-paragraph offer description that makes it feel like a must-have.",
    shareCaption: "Day 8: Offer design 💎 Your offer is a promise. Is yours specific enough to be irresistible? I just clarified mine, and it feels like magic. #AIGlowUp #OfferCreation #ValueProposition"
  },
  {
    day: 9,
    title: "Content Pillars",
    lesson: "Content pillars are the 3-5 core themes you consistently talk about. They keep your content strategic, cohesive, and easy to create. Think of them as the foundation of your content house—everything you post should ladder up to one of these pillars. For example, a fitness coach might use: Nutrition, Workouts, Mindset, Recovery, Lifestyle. Content pillars prevent you from posting random, off-brand content and ensure every piece serves your larger brand message. Today, you'll define your signature content pillars based on your expertise, audience needs, and brand positioning. With clear pillars, you'll never run out of content ideas—you'll just rotate through your themes with fresh angles.",
    gptPromptTemplate: "Based on my {brandType} brand in {niche} serving people who want {goal}, create 3-5 content pillars for me. For each pillar: (1) Name the pillar, (2) Explain why it matters to my audience, (3) Provide 5 content ideas within that pillar, (4) Suggest the ideal content mix (what % of content should come from each pillar). Make them strategic, balanced, and aligned with my brand.",
    shareCaption: "Day 9: Content pillars unlocked 🏛️ I'm not posting randomly anymore—I have 3 core themes that make content creation effortless. Structure = freedom. #AIGlowUp #ContentPillars #StrategyWins"
  },
  {
    day: 10,
    title: "Social Engine",
    lesson: "Social media success isn't about luck—it's about engineering visibility. The 'social engine' is your systematic approach to growing reach, engagement, and authority. It includes: hooks that stop scrolls, CTAs that spark conversation, engagement strategies that build community, and collaboration tactics that expand your network. Today, you'll build your social engine blueprint: mastering the anatomy of high-performing posts, learning platform-specific best practices, and creating engagement loops. The algorithm rewards genuine interaction, so focus on creating content that sparks conversation, not just consumption. Your social engine should be repeatable, scalable, and aligned with your brand voice.",
    gptPromptTemplate: "Design a 'social engine' strategy for my {brandType} brand on {platform} in {niche}. Include: (1) 10 scroll-stopping hooks I can use for my niche, (2) 5 CTA templates that drive engagement (comments, saves, shares), (3) A daily engagement routine (who to engage with, how much time, what to say), (4) 3 collaboration ideas to expand reach, (5) A content framework for high-performing posts (structure + example). Make it actionable and platform-specific.",
    shareCaption: "Day 10: Social engine activated ⚡ Growth isn't random when you have a system. Here's my blueprint for visibility, engagement, and authority. Let's build. #AIGlowUp #SocialMediaStrategy #GrowthEngine"
  },
  {
    day: 11,
    title: "Build in Public",
    lesson: "Building in public means sharing your journey—the wins, the struggles, the lessons—in real-time. It's one of the most powerful brand-building strategies because it creates authenticity, accountability, and connection. People don't just want the highlight reel; they want to see the process. When you build in public, you invite your audience into your world, turning them from spectators into supporters. Today, you'll learn how to share your journey strategically: what to reveal, how much to share, and how to turn transparency into trust. Building in public isn't oversharing—it's purposeful vulnerability. It humanizes your brand and creates a loyal community that roots for your success.",
    gptPromptTemplate: "I'm {name} building a {brandType} brand in {niche}. Create a 'build in public' content plan for me including: (1) 10 'behind-the-scenes' post ideas that show my process without oversharing, (2) How to frame setbacks and challenges in a way that builds trust (with examples), (3) Milestones worth celebrating publicly (and how to share them), (4) A weekly 'building in public' post template I can use consistently, (5) Boundaries: what NOT to share. Make it authentic but strategic.",
    shareCaption: "Day 11: Building in public 🏗️ I'm done with the highlight reel. From now on, you're seeing the real journey—wins, pivots, lessons. Transparency builds trust. Who's with me? #AIGlowUp #BuildInPublic #Authenticity"
  },
  {
    day: 12,
    title: "Audience Nurture",
    lesson: "Building an audience is one thing; nurturing them is another. Your audience isn't a number—it's a community of real people with real needs. Nurturing means showing up consistently, adding value, responding to comments, celebrating wins, and creating spaces for connection. The brands that win are the ones that make people feel seen, heard, and valued. Today, you'll build an audience nurture strategy: how to engage authentically, create value beyond your offers, and turn followers into raving fans. This includes DM strategies, community-building tactics, and ways to make your audience feel like insiders. When you nurture well, selling becomes easy because trust is already built.",
    gptPromptTemplate: "Create an audience nurture strategy for my {brandType} brand in {niche} on {platform}. Include: (1) A weekly engagement plan (what to do daily to build relationships), (2) 5 value-first content ideas that require nothing in return, (3) How to respond to comments and DMs in a way that deepens connection (with templates), (4) Community-building ideas (challenges, Q&As, etc.), (5) How to identify and celebrate 'superfans' in my audience. Make it genuine and sustainable.",
    shareCaption: "Day 12: Nurturing my audience 💌 Numbers don't matter if there's no connection. I'm building a community, not just a following. How do you make your people feel seen? #AIGlowUp #CommunityFirst #AudienceNurture"
  },
  {
    day: 13,
    title: "Consistency Audit",
    lesson: "Consistency is the secret sauce of successful brands. It's not about perfection—it's about showing up reliably. Today, you'll audit your brand for consistency across all touchpoints: Is your message clear and cohesive? Do your visuals align? Is your voice recognizable? Are you posting regularly? Consistency builds trust, recognition, and authority. Inconsistent brands confuse their audience; consistent brands create confidence. This audit will reveal gaps and give you a clear action plan to tighten up your brand presence. You'll review your bio, content, visuals, engagement habits, and messaging to ensure everything works together to reinforce your brand identity. Consistency compounds.",
    gptPromptTemplate: "Conduct a brand consistency audit for my {brandType} brand in {niche} on {platform}. Evaluate: (1) Message consistency (Am I saying the same thing across content?), (2) Visual consistency (Do my posts have a cohesive look?), (3) Voice consistency (Do I sound like 'me' everywhere?), (4) Posting consistency (How often do I show up?), (5) Engagement consistency (Am I responsive and present?). For each area, give me a score (1-10) and 2 specific action steps to improve. Be honest and constructive.",
    shareCaption: "Day 13: Consistency audit ✅ I just reviewed my brand across every touchpoint. Here's what I'm tightening up to show up stronger and clearer. Consistency = trust. #AIGlowUp #BrandAudit #ConsistencyWins"
  },
  {
    day: 14,
    title: "Glow-Up Recap & Integration",
    lesson: "Congratulations—you've completed the 14-Day AI Glow-Up! Today is about integration: taking everything you've learned and creating a sustainable brand-building practice. You've defined your story, niche, voice, visuals, platform strategy, and more. Now it's time to synthesize all these elements into one cohesive brand identity. Today, you'll generate your complete Brand Summary Report: your brand voice, tone, color palette, bio, offer, content pillars, and strategic plan. This document becomes your brand bible—your north star for every decision moving forward. You'll also set your 30-day action plan to implement what you've learned. This isn't the end; it's the beginning of your empowered, intentional brand journey. You've glowed up. Now go build.",
    gptPromptTemplate: "I've completed the 14-Day AI Glow-Up for my {brandType} brand in {niche}. Generate my complete Brand Summary Report including: (1) Brand Mission Statement (one powerful sentence), (2) Brand Voice & Tone (description + example), (3) Visual Identity (color palette, font suggestions, aesthetic), (4) Signature Bio (optimized for {platform}), (5) Core Offer (what I sell and who it's for), (6) 3 Content Pillars (with brief descriptions), (7) 30-Day Action Plan (specific steps to implement my new brand). Make it comprehensive, actionable, and inspiring.",
    shareCaption: "Day 14: I just completed the AI Glow-Up 🎉✨ 14 days of intentional brand-building using AI. I have clarity, strategy, and a brand that finally feels like ME. Here's what I built... (swipe for my full brand summary) #AIGlowUp #BrandTransformation #GlowUpComplete"
  }
];
