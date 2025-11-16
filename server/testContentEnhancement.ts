/**
 * Test Content Enhancement with TOON Optimization
 * 
 * Usage:
 *   tsx server/testContentEnhancement.ts web3-foundations enhance
 *   tsx server/testContentEnhancement.ts web3-foundations regenerate
 */

async function testEnhancement() {
  const experienceSlug = process.argv[2] || 'web3-foundations';
  const mode = process.argv[3] === 'regenerate' ? 'full' : 'enhance';

  console.log(`\n🧪 Testing Content Enhancement`);
  console.log(`   Experience: ${experienceSlug}`);
  console.log(`   Mode: ${mode === 'full' ? 'Full Regeneration' : 'Enhancement'}\n`);

  try {
    const response = await fetch('http://localhost:5000/api/admin/test-content-enhancement', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        experienceSlug,
        mode
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }

    const result = await response.json();

    console.log(`✅ Enhancement Complete!`);
    console.log(`\n📊 Results:`);
    console.log(`   Experience: ${result.experience.title}`);
    console.log(`   Tier: ${result.experience.tier}`);
    console.log(`   Original sections: ${result.originalSectionCount}`);
    console.log(`   Enhanced sections: ${result.enhancedSectionCount}`);

    console.log(`\n💰 Cost Estimate (All 65 Experiences):`);
    console.log(`   Without TOON: ${result.costEstimate.withoutTOON}`);
    console.log(`   With TOON: ${result.costEstimate.withTOON}`);
    console.log(`   Savings: ${result.costEstimate.savings} (${result.costEstimate.savingsPercent}%)`);

    console.log(`\n📚 Enhanced Sections Preview:`);
    result.enhancedSections.forEach((section: any, index: number) => {
      console.log(`\n   ${index + 1}. ${section.title}`);
      console.log(`      Type: ${section.type}`);
      console.log(`      Content: ${section.content.substring(0, 150)}...`);
      if (section.quickWinChallenge) {
        console.log(`      ⚡ Quick Win: ${section.quickWinChallenge.substring(0, 80)}...`);
      }
      if (section.monetizationInsight) {
        console.log(`      💰 Monetization: ${section.monetizationInsight.substring(0, 80)}...`);
      }
    });

    console.log(`\n✨ Full response saved for review\n`);

  } catch (error) {
    console.error(`\n❌ Test failed:`, error);
    process.exit(1);
  }
}

testEnhancement();
