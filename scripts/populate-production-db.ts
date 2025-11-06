import { neon } from '@neondatabase/serverless';

// This script populates the production database with spaces and experiences
// Run this ONCE after deploying to production to fix empty database

const spaces = [
  {
    id: 'web3',
    name: 'Web3',
    slug: 'web3',
    description: 'Master decentralized technologies and understand the future of the internet. Build your Web3 fluency from fundamentals to real-world applications.',
    icon: 'Globe',
    color: 'hyper-violet',
    sort_order: 1,
    is_active: true
  },
  {
    id: 'crypto',
    name: 'NFT/Blockchain/Crypto',
    slug: 'crypto',
    description: 'Navigate the world of digital assets with confidence. From NFTs to blockchain basics to cryptocurrency trading—understand it all and leverage it for your future.',
    icon: 'Coins',
    color: 'magenta-quartz',
    sort_order: 2,
    is_active: true
  },
  {
    id: 'ai',
    name: 'AI',
    slug: 'ai',
    description: 'Transform how you work with AI tools. From custom GPTs to AI-powered content creation, become fluent in the language of artificial intelligence.',
    icon: 'Sparkles',
    color: 'cyber-fuchsia',
    sort_order: 3,
    is_active: true
  },
  {
    id: 'metaverse',
    name: 'Metaverse',
    slug: 'metaverse',
    description: 'Navigate virtual worlds with confidence. Discover opportunities in immersive digital spaces and build your presence in the metaverse.',
    icon: 'Boxes',
    color: 'aurora-teal',
    sort_order: 4,
    is_active: true
  },
  {
    id: 'nfts',
    name: 'NFTs',
    slug: 'nfts',
    description: 'Create, buy, sell, and leverage NFTs. Understand digital ownership and how to build value in the NFT economy.',
    icon: 'Image',
    color: 'liquid-gold',
    sort_order: 5,
    is_active: true
  },
  {
    id: 'branding',
    name: 'Branding',
    slug: 'branding',
    description: 'Build your personal and professional brand with AI-powered tools. Master content creation, community building, and thought leadership for the digital age.',
    icon: 'Megaphone',
    color: 'liquid-gold',
    sort_order: 5,
    is_active: true
  },
  {
    id: 'moms',
    name: 'Moms',
    slug: 'moms',
    description: 'A dedicated space for mothers navigating tech careers and entrepreneurship. Balance, growth, and community for moms building in AI and Web3.',
    icon: 'Heart',
    color: 'hyper-violet',
    sort_order: 6,
    is_active: true
  }
];

const experiences = [
  // AI Space Experiences
  {
    id: 'ai-1-foundations',
    space_id: 'ai',
    title: 'AI Essentials',
    slug: 'ai-essentials',
    description: 'Understand AI, machine learning, and how to use these tools to multiply your productivity and creativity.',
    learning_objectives: ['Explain AI and machine learning clearly', 'Identify AI tools for your workflow', 'Start using AI ethically and effectively'],
    tier: 'free',
    estimated_minutes: 20,
    sort_order: 1,
    content: { sections: [{ id: 'ai-intro', type: 'text', title: 'AI Demystified', content: 'AI isn\'t magic - it\'s a powerful tool you can master.' }] },
    personalization_enabled: true,
    is_active: true
  },
  {
    id: 'ai-2-chatgpt',
    space_id: 'ai',
    title: 'Master ChatGPT & Custom GPTs',
    slug: 'master-chatgpt',
    description: 'Go beyond basic prompts. Create custom GPTs, build AI assistants, and automate your workflow.',
    learning_objectives: ['Write advanced prompts that get results', 'Build your first custom GPT', 'Automate repetitive tasks with AI'],
    tier: 'pro',
    estimated_minutes: 35,
    sort_order: 2,
    content: { sections: [{ id: 'prompting', type: 'interactive', title: 'Prompt Engineering Mastery', content: 'The art and science of talking to AI.' }] },
    personalization_enabled: true,
    is_active: true
  },
  {
    id: 'ai-3-content',
    space_id: 'ai',
    title: 'AI-Powered Content Creation',
    slug: 'ai-content-creation',
    description: 'Create blog posts, social media, newsletters, and more - faster and better than ever with AI as your co-pilot.',
    learning_objectives: ['Generate high-quality content with AI', 'Maintain your unique voice and style', 'Build a content system that scales'],
    tier: 'pro',
    estimated_minutes: 30,
    sort_order: 3,
    content: { sections: [{ id: 'content-intro', type: 'text', title: 'AI as Your Content Partner', content: 'Create more, stress less - AI handles the heavy lifting.' }] },
    personalization_enabled: true,
    is_active: true
  },
  {
    id: 'ai-4-automation',
    space_id: 'ai',
    title: 'AI Automation & Workflows',
    slug: 'ai-automation',
    description: 'Connect AI tools to automate your business processes. From email to social media to client onboarding.',
    learning_objectives: ['Map your automation opportunities', 'Connect AI tools with no-code platforms', 'Build workflows that run on autopilot'],
    tier: 'pro',
    estimated_minutes: 40,
    sort_order: 4,
    content: { sections: [{ id: 'automation-intro', type: 'text', title: 'Automation Foundations', content: 'Work smarter, not harder - let AI handle the busywork.' }] },
    personalization_enabled: true,
    is_active: true
  },
  {
    id: 'ai-5-image-gen',
    space_id: 'ai',
    title: 'AI Image & Video Generation',
    slug: 'ai-image-video',
    description: 'Create stunning visuals with Midjourney, DALL-E, and AI video tools. Design like a pro, no design skills required.',
    learning_objectives: ['Generate professional images with AI', 'Create video content faster', 'Build a visual content library'],
    tier: 'pro',
    estimated_minutes: 35,
    sort_order: 5,
    content: { sections: [{ id: 'image-gen', type: 'interactive', title: 'AI Visual Creation', content: 'Turn your ideas into stunning visuals instantly.' }] },
    personalization_enabled: true,
    is_active: true
  },
  {
    id: 'ai-6-product',
    space_id: 'ai',
    title: 'Build Your AI-Powered Product',
    slug: 'build-ai-product',
    description: 'Launch an AI tool, service, or product. From idea to MVP - ship something people will pay for.',
    learning_objectives: ['Validate your AI product idea', 'Build an MVP with no-code tools', 'Launch and get your first customers'],
    tier: 'pro',
    estimated_minutes: 60,
    sort_order: 6,
    content: { sections: [{ id: 'product-planning', type: 'hands_on_lab', title: 'AI Product Strategy', content: 'Time to build and ship your AI product.' }] },
    personalization_enabled: true,
    is_active: true
  },
  // Branding Space Experiences
  {
    id: 'branding-1-strategy',
    space_id: 'branding',
    title: 'AI Branding Fundamentals',
    slug: 'ai-branding-fundamentals',
    description: 'Build a powerful brand with AI tools. From positioning to messaging to visual identity.',
    learning_objectives: ['Define your brand strategy with AI', 'Create compelling brand messaging', 'Position yourself in the market'],
    tier: 'free',
    estimated_minutes: 25,
    sort_order: 1,
    content: { sections: [{ id: 'branding-intro', type: 'text', title: 'Brand Strategy with AI', content: 'Build a brand that stands out with AI power.' }] },
    personalization_enabled: true,
    is_active: true
  },
  {
    id: 'branding-2-content',
    space_id: 'branding',
    title: 'AI Content Strategy',
    slug: 'ai-content-strategy',
    description: 'Create a content system that builds your brand on autopilot. Blog, social, email, and more.',
    learning_objectives: ['Build your AI content engine', 'Create content pillars and calendars', 'Maintain consistency across platforms'],
    tier: 'pro',
    estimated_minutes: 35,
    sort_order: 2,
    content: { sections: [{ id: 'content-strategy', type: 'interactive', title: 'Content System Building', content: 'Create content that builds your brand.' }] },
    personalization_enabled: true,
    is_active: true
  },
  {
    id: 'branding-3-social',
    space_id: 'branding',
    title: 'AI-Powered Social Media',
    slug: 'ai-social-media',
    description: 'Grow your audience with AI. Create engaging content, optimize posting, and build community.',
    learning_objectives: ['Generate social content with AI', 'Optimize posting times and frequency', 'Grow your following strategically'],
    tier: 'pro',
    estimated_minutes: 30,
    sort_order: 3,
    content: { sections: [{ id: 'social-media', type: 'text', title: 'Social Media with AI', content: 'Grow your social presence efficiently.' }] },
    personalization_enabled: true,
    is_active: true
  },
  {
    id: 'branding-4-thought-leadership',
    space_id: 'branding',
    title: 'AI Thought Leadership',
    slug: 'ai-thought-leadership',
    description: 'Position yourself as an authority. Use AI to research, write, and publish thought leadership content.',
    learning_objectives: ['Develop your unique point of view', 'Create high-quality thought leadership', 'Build authority in your niche'],
    tier: 'pro',
    estimated_minutes: 40,
    sort_order: 4,
    content: { sections: [{ id: 'thought-leadership', type: 'text', title: 'Becoming a Thought Leader', content: 'Build authority with AI-assisted content.' }] },
    personalization_enabled: true,
    is_active: true
  }
];

async function populateProductionDB() {
  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    console.error('ERROR: DATABASE_URL not found. Make sure environment variables are set.');
    process.exit(1);
  }

  console.log('Connecting to database...');
  const sql = neon(dbUrl);

  try {
    // Insert spaces
    console.log('Inserting spaces...');
    for (const space of spaces) {
      await sql`
        INSERT INTO spaces (id, name, slug, description, icon, color, sort_order, is_active)
        VALUES (${space.id}, ${space.name}, ${space.slug}, ${space.description}, ${space.icon}, ${space.color}, ${space.sort_order}, ${space.is_active})
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          slug = EXCLUDED.slug,
          description = EXCLUDED.description,
          icon = EXCLUDED.icon,
          color = EXCLUDED.color,
          sort_order = EXCLUDED.sort_order,
          is_active = EXCLUDED.is_active,
          updated_at = NOW()
      `;
      console.log(`✓ Inserted space: ${space.name}`);
    }

    // Insert experiences
    console.log('\nInserting transformational experiences...');
    for (const exp of experiences) {
      await sql`
        INSERT INTO transformational_experiences (
          id, space_id, title, slug, description, learning_objectives, 
          tier, estimated_minutes, sort_order, content, personalization_enabled, is_active
        )
        VALUES (
          ${exp.id}, ${exp.space_id}, ${exp.title}, ${exp.slug}, ${exp.description}, 
          ${JSON.stringify(exp.learning_objectives)}, ${exp.tier}, ${exp.estimated_minutes}, 
          ${exp.sort_order}, ${JSON.stringify(exp.content)}, ${exp.personalization_enabled}, ${exp.is_active}
        )
        ON CONFLICT (id) DO UPDATE SET
          space_id = EXCLUDED.space_id,
          title = EXCLUDED.title,
          slug = EXCLUDED.slug,
          description = EXCLUDED.description,
          learning_objectives = EXCLUDED.learning_objectives,
          tier = EXCLUDED.tier,
          estimated_minutes = EXCLUDED.estimated_minutes,
          sort_order = EXCLUDED.sort_order,
          content = EXCLUDED.content,
          personalization_enabled = EXCLUDED.personalization_enabled,
          is_active = EXCLUDED.is_active,
          updated_at = NOW()
      `;
      console.log(`✓ Inserted experience: ${exp.title}`);
    }

    console.log('\n✅ SUCCESS! Production database populated with:');
    console.log(`   - ${spaces.length} spaces`);
    console.log(`   - ${experiences.length} transformational experiences`);
    console.log('\nYour production app should now work correctly!');
    
  } catch (error) {
    console.error('❌ ERROR populating database:', error);
    process.exit(1);
  }
}

populateProductionDB();
