import { neon } from '@neondatabase/serverless';
import * as bcrypt from 'bcrypt';
import { EXPERIENCES } from '../server/seedExperiences';
import { MOMS_EXPERIENCES } from '../server/seedMomsExperiences';

// This script populates the production database with spaces, experiences, and test users
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
    sort_order: 6,
    is_active: true
  },
  {
    id: 'moms',
    name: 'Moms',
    slug: 'moms',
    description: 'A dedicated space for mothers navigating tech careers and entrepreneurship. Balance, growth, and community for moms building in AI and Web3.',
    icon: 'Heart',
    color: 'hyper-violet',
    sort_order: 7,
    is_active: true
  },
  {
    id: 'app-atelier',
    name: 'App Atelier',
    slug: 'app-atelier',
    description: 'Build apps without code. Master no-code tools and ship your first product in weeks, not months.',
    icon: 'Hammer',
    color: 'cyber-fuchsia',
    sort_order: 8,
    is_active: true
  },
  {
    id: 'founders-club',
    name: "Founder's Club",
    slug: 'founders-club',
    description: 'Launch and scale your business. From idea validation to first revenue—build a profitable company.',
    icon: 'Rocket',
    color: 'liquid-gold',
    sort_order: 9,
    is_active: true
  },
  {
    id: 'digital-sales',
    name: 'Digital Sales Accelerator',
    slug: 'digital-sales',
    description: 'Launch your online sales in 3 days. Shopify, Instagram Shopping, TikTok Shop, and more—all live workshops.',
    icon: 'ShoppingCart',
    color: 'magenta-quartz',
    sort_order: 10,
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
    // Create 20 test users
    console.log('\nCreating test users...');
    const testUsers = [];
    for (let i = 1; i <= 20; i++) {
      const email = `testuser${i}@metahers.ai`;
      const password = 'TestPassword123!';
      const passwordHash = await bcrypt.hash(password, 12);
      
      testUsers.push({
        email,
        passwordHash,
        firstName: `Test`,
        lastName: `User${i}`,
      });
    }

    for (const user of testUsers) {
      await sql`
        INSERT INTO users (email, password_hash, first_name, last_name, subscription_tier, is_pro, onboarding_completed)
        VALUES (${user.email}, ${user.passwordHash}, ${user.firstName}, ${user.lastName}, 'free', false, false)
        ON CONFLICT (email) DO NOTHING
      `;
      console.log(`✓ Created test user: ${user.email} (password: TestPassword123!)`);
    }

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

    // Insert experiences from the full seed data
    console.log('\nInserting transformational experiences...');
    const allExperiences = [...EXPERIENCES, ...MOMS_EXPERIENCES];
    for (const exp of allExperiences) {
      await sql`
        INSERT INTO transformational_experiences (
          id, space_id, title, slug, description, learning_objectives, 
          tier, estimated_minutes, sort_order, content, personalization_enabled, is_active
        )
        VALUES (
          ${exp.id}, ${exp.spaceId}, ${exp.title}, ${exp.slug}, ${exp.description}, 
          ${JSON.stringify(exp.learningObjectives)}, ${exp.tier}, ${exp.estimatedMinutes}, 
          ${exp.sortOrder}, ${JSON.stringify(exp.content)}, ${exp.personalizationEnabled}, true
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
    console.log(`   - ${allExperiences.length} transformational experiences`);
    console.log(`   - ${allExperiences.filter(e => e.tier === 'free').length} FREE experiences`);
    console.log(`   - ${allExperiences.filter(e => e.tier === 'pro').length} PRO experiences`);
    console.log('\nYour production app should now work correctly!');

  } catch (error) {
    console.error('❌ ERROR populating database:', error);
    process.exit(1);
  }
}

populateProductionDB();