
import { db } from "../db";
import { 
  transformationalExperiences,
  experienceSections,
  sectionResources,
  sectionCompletions
} from "../../shared/schema";
import { sql } from "drizzle-orm";

async function normalizeExperienceSections() {
  console.log("\n🔄 Starting database normalization: JSONB sections → Relational tables\n");

  try {
    // Step 1: Fetch all experiences with JSONB content
    console.log("📊 Step 1: Fetching all experiences...");
    const experiences = await db.select().from(transformationalExperiences);
    console.log(`   Found ${experiences.length} experiences to process\n`);

    let totalSectionsCreated = 0;
    let totalResourcesCreated = 0;
    let experiencesProcessed = 0;

    // Step 2: Process each experience
    for (const experience of experiences) {
      console.log(`\n📝 Processing: ${experience.title}`);
      
      const sections = (experience.content as any)?.sections || [];
      console.log(`   Sections found: ${sections.length}`);

      if (sections.length === 0) {
        console.log(`   ⚠️  Skipping - no sections found`);
        continue;
      }

      // Step 3: Insert sections into experience_sections table
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        
        try {
          // Prepare metadata (for quiz questions, video URLs, etc.)
          const metadata: any = {};
          if (section.quiz) metadata.quiz = section.quiz;
          if (section.videoUrl) metadata.videoUrl = section.videoUrl;
          if (section.interactiveElements) metadata.interactiveElements = section.interactiveElements;
          if (section.quickWinChallenge) metadata.quickWinChallenge = section.quickWinChallenge;
          if (section.monetizationInsight) metadata.monetizationInsight = section.monetizationInsight;
          if (section.reflectionPrompts) metadata.reflectionPrompts = section.reflectionPrompts;

          // Insert section
          const [insertedSection] = await db
            .insert(experienceSections)
            .values({
              experienceId: experience.id,
              type: section.type || 'text',
              title: section.title || `Section ${i + 1}`,
              content: section.content || '',
              metadata: Object.keys(metadata).length > 0 ? metadata : null,
              sortOrder: i + 1,
            })
            .returning();

          totalSectionsCreated++;

          // Step 4: Insert resources for this section
          if (section.resources && Array.isArray(section.resources)) {
            for (let j = 0; j < section.resources.length; j++) {
              const resource = section.resources[j];
              
              await db
                .insert(sectionResources)
                .values({
                  sectionId: insertedSection.id,
                  type: resource.type || 'link',
                  title: resource.title || `Resource ${j + 1}`,
                  url: resource.url || '',
                  metadata: null,
                  sortOrder: j + 1,
                });

              totalResourcesCreated++;
            }
          }

          console.log(`   ✅ Section ${i + 1}: "${section.title}" (${section.resources?.length || 0} resources)`);
        } catch (error) {
          console.error(`   ❌ Failed to insert section ${i + 1}:`, error);
        }
      }

      experiencesProcessed++;
    }

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("✨ MIGRATION COMPLETE");
    console.log("=".repeat(60));
    console.log(`Experiences processed: ${experiencesProcessed}/${experiences.length}`);
    console.log(`Sections created: ${totalSectionsCreated}`);
    console.log(`Resources created: ${totalResourcesCreated}`);
    console.log("=".repeat(60) + "\n");

    // Verification
    console.log("🔍 Verification:");
    const sectionCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(experienceSections);
    
    const resourceCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(sectionResources);

    console.log(`   Sections in DB: ${sectionCount[0].count}`);
    console.log(`   Resources in DB: ${resourceCount[0].count}\n`);

  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    throw error;
  }
}

// Run migration
normalizeExperienceSections()
  .then(() => {
    console.log("✅ Migration completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  });
