
import { neon } from '@neondatabase/serverless';

async function checkDatabaseContent() {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error('ERROR: DATABASE_URL not found');
    process.exit(1);
  }

  const sql = neon(dbUrl);

  try {
    // Check spaces
    const spaces = await sql`SELECT id, name FROM spaces ORDER BY sort_order`;
    console.log('\n📍 SPACES IN DATABASE:');
    spaces.forEach((s: any) => console.log(`  - ${s.name} (${s.id})`));

    // Check experiences
    const experiences = await sql`SELECT id, title, tier FROM transformational_experiences ORDER BY space_id, sort_order`;
    console.log('\n📚 EXPERIENCES IN DATABASE:');
    console.log(`  Total: ${experiences.length}`);
    console.log(`  Free: ${experiences.filter((e: any) => e.tier === 'free').length}`);
    console.log(`  Pro: ${experiences.filter((e: any) => e.tier === 'pro').length}`);
    
    // Show first 10
    console.log('\n  First 10 experiences:');
    experiences.slice(0, 10).forEach((e: any) => 
      console.log(`    - ${e.title} (${e.tier})`)
    );

    console.log('\n✅ Database check complete');
  } catch (error) {
    console.error('❌ Error checking database:', error);
    process.exit(1);
  }
}

checkDatabaseContent();
