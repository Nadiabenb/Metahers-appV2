import { db } from "./db";
import { transformationalExperiences } from "@shared/schema";
import * as fs from "fs";
import * as path from "path";
import { eq } from "drizzle-orm";

/**
 * CRITICAL DATA PROTECTION: Restore Script for Transformational Experiences
 * 
 * This script restores Harvard-style learning content from a backup file.
 * 
 * Usage: tsx server/restoreTransformationalContent.ts <backup-filename>
 * Example: tsx server/restoreTransformationalContent.ts transformational-experiences-2025-11-14T12-00-00-000Z.json
 */

async function restoreTransformationalContent() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error("❌ Error: No backup file specified");
    console.log("\nUsage: tsx server/restoreTransformationalContent.ts <backup-filename>");
    console.log("\nAvailable backups:");
    
    const backupsDir = path.join(process.cwd(), "backups");
    if (fs.existsSync(backupsDir)) {
      const files = fs.readdirSync(backupsDir)
        .filter(f => f.startsWith("transformational-experiences-"))
        .sort()
        .reverse();
      
      if (files.length > 0) {
        files.slice(0, 10).forEach((f, i) => {
          const stats = fs.statSync(path.join(backupsDir, f));
          console.log(`   ${i + 1}. ${f} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
        });
        if (files.length > 10) {
          console.log(`   ... and ${files.length - 10} more`);
        }
      } else {
        console.log("   No backups found");
      }
    } else {
      console.log("   No backups directory found");
    }
    process.exit(1);
  }

  const filename = args[0];
  const backupsDir = path.join(process.cwd(), "backups");
  const filepath = path.join(backupsDir, filename);

  if (!fs.existsSync(filepath)) {
    console.error(`❌ Error: Backup file not found: ${filename}`);
    process.exit(1);
  }

  try {
    console.log(`🔓 Restoring from backup: ${filename}\n`);
    
    // Read backup file
    const backupData = JSON.parse(fs.readFileSync(filepath, "utf-8"));
    
    if (!backupData.experiences || !Array.isArray(backupData.experiences)) {
      console.error("❌ Error: Invalid backup file format");
      process.exit(1);
    }

    console.log(`📊 Backup info:`);
    console.log(`   • Created: ${backupData.timestamp}`);
    console.log(`   • Total experiences: ${backupData.experienceCount}`);
    console.log(`   • Total sections: ${backupData.totalSections}`);
    console.log(`   • Average sections: ${backupData.avgSectionsPerExperience}`);

    console.log(`\n⚠️  WARNING: This will UPDATE all ${backupData.experienceCount} experiences in the database.`);
    console.log(`   • Content will be restored from backup`);
    console.log(`   • This operation cannot be undone`);
    
    // In a real scenario, you'd want a confirmation prompt here
    // For now, we'll proceed with the restore

    let updated = 0;
    let errors = 0;

    for (const experience of backupData.experiences) {
      try {
        await db
          .update(transformationalExperiences)
          .set({
            content: experience.content,
            title: experience.title,
            description: experience.description,
            learningObjectives: experience.learningObjectives,
            tier: experience.tier,
            estimatedMinutes: experience.estimatedMinutes,
            personalizationEnabled: experience.personalizationEnabled,
            updatedAt: new Date(),
          })
          .where(eq(transformationalExperiences.id, experience.id));
        
        updated++;
        process.stdout.write(`\r✅ Restored: ${updated}/${backupData.experienceCount}`);
      } catch (error) {
        errors++;
        console.error(`\n❌ Error restoring ${experience.title}:`, error);
      }
    }

    console.log(`\n\n✨ Restore complete!`);
    console.log(`   • Successfully restored: ${updated}`);
    console.log(`   • Errors: ${errors}`);
    console.log(`\n🎉 Your Harvard-style content is back!\n`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Restore failed:", error);
    process.exit(1);
  }
}

// Run restore
restoreTransformationalContent();
