import { db } from "./db";
import { transformationalExperiences } from "@shared/schema";
import * as fs from "fs";
import * as path from "path";

/**
 * CRITICAL DATA PROTECTION: Backup Script for Transformational Experiences
 * 
 * This script backs up all Harvard-style learning content to prevent data loss.
 * The content in transformationalExperiences is the CORE VALUE of MetaHers Mind Spa
 * and should NEVER be deleted without explicit user approval.
 * 
 * Run this manually: tsx server/backupTransformationalContent.ts
 * Or schedule it to run daily
 */

async function backupTransformationalContent() {
  try {
    console.log("🔒 Starting backup of transformational experiences content...\n");

    // Fetch all experiences from database
    const experiences = await db.select().from(transformationalExperiences);

    if (!experiences || experiences.length === 0) {
      console.error("❌ WARNING: No experiences found in database!");
      process.exit(1);
    }

    // Create backups directory if it doesn't exist
    const backupsDir = path.join(process.cwd(), "backups");
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
      console.log(`✅ Created backups directory: ${backupsDir}`);
    }

    // Create timestamped backup file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `transformational-experiences-${timestamp}.json`;
    const filepath = path.join(backupsDir, filename);

    // Add metadata to backup
    const backup = {
      timestamp: new Date().toISOString(),
      experienceCount: experiences.length,
      totalSections: experiences.reduce((sum, exp) => {
        return sum + ((exp.content?.sections || []).length);
      }, 0),
      avgSectionsPerExperience: (experiences.reduce((sum, exp) => {
        return sum + ((exp.content?.sections || []).length);
      }, 0) / experiences.length).toFixed(2),
      experiences: experiences,
    };

    // Write backup to file
    fs.writeFileSync(filepath, JSON.stringify(backup, null, 2), "utf-8");

    console.log(`✅ Backup saved: ${filename}`);
    console.log(`   • Total experiences: ${backup.experienceCount}`);
    console.log(`   • Total sections: ${backup.totalSections}`);
    console.log(`   • Average sections: ${backup.avgSectionsPerExperience}`);
    console.log(`   • File size: ${(fs.statSync(filepath).size / 1024 / 1024).toFixed(2)} MB`);

    // Clean up old backups (keep last 30 days)
    const files = fs.readdirSync(backupsDir)
      .filter(f => f.startsWith("transformational-experiences-"))
      .map(f => ({
        name: f,
        path: path.join(backupsDir, f),
        time: fs.statSync(path.join(backupsDir, f)).mtime.getTime()
      }))
      .sort((a, b) => b.time - a.time);

    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const filesToDelete = files.filter(f => f.time < thirtyDaysAgo);

    if (filesToDelete.length > 0) {
      console.log(`\n🧹 Cleaning up ${filesToDelete.length} old backups...`);
      filesToDelete.forEach(f => {
        fs.unlinkSync(f.path);
        console.log(`   • Deleted: ${f.name}`);
      });
    }

    console.log(`\n📊 Backup history: ${files.length} backups total (${files.length - filesToDelete.length} kept, ${filesToDelete.length} deleted)`);
    console.log("\n✨ Backup complete! Your content is safe.\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Backup failed:", error);
    process.exit(1);
  }
}

// Run backup
backupTransformationalContent();
