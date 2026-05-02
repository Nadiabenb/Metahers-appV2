
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as readline from 'readline';
import { logger } from '../lib/logger';

const execAsync = promisify(exec);

/**
 * MetaHers Database Restore Script
 * 
 * Restores database from a compressed SQL backup
 * Usage: npm run restore:db backups/metahers-backup-{timestamp}.sql.gz
 */

async function askConfirmation(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toUpperCase() === 'RESTORE');
    });
  });
}

async function restoreDatabase() {
  const startTime = Date.now();
  
  console.log('\n⚠️  MetaHers Database Restore\n');
  console.log('=' .repeat(50));
  
  // Get backup file from command line arguments
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('❌ Error: No backup file specified\n');
    console.log('Usage: npm run restore:db <backup-file>\n');
    console.log('Available backups:');
    
    const backupsDir = path.join(process.cwd(), 'backups');
    try {
      const files = await fs.readdir(backupsDir);
      const backupFiles = files
        .filter(f => f.startsWith('metahers-backup-') && f.endsWith('.sql.gz'))
        .sort()
        .reverse();
      
      if (backupFiles.length > 0) {
        for (let i = 0; i < Math.min(10, backupFiles.length); i++) {
          const stats = await fs.stat(path.join(backupsDir, backupFiles[i]));
          const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
          const date = new Date(stats.mtime).toISOString();
          console.log(`   ${i + 1}. ${backupFiles[i]}`);
          console.log(`      Size: ${sizeInMB} MB | Created: ${date}`);
        }
        if (backupFiles.length > 10) {
          console.log(`   ... and ${backupFiles.length - 10} more\n`);
        }
      } else {
        console.log('   No backups found\n');
        console.log('💡 Create a backup first: npm run backup:db\n');
      }
    } catch {
      console.log('   No backups directory found\n');
    }
    
    process.exit(1);
  }

  const backupFile = args[0];
  const backupPath = path.isAbsolute(backupFile) 
    ? backupFile 
    : path.join(process.cwd(), backupFile);

  // Verify backup file exists
  try {
    await fs.access(backupPath);
  } catch {
    console.error(`❌ Error: Backup file not found: ${backupFile}\n`);
    process.exit(1);
  }

  // Get file info
  const stats = await fs.stat(backupPath);
  const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
  const fileDate = new Date(stats.mtime);

  console.log('\n📋 Restore Details:');
  console.log(`   • Backup file: ${path.basename(backupPath)}`);
  console.log(`   • Size: ${sizeInMB} MB`);
  console.log(`   • Created: ${fileDate.toISOString()}`);
  console.log(`   • Age: ${Math.floor((Date.now() - fileDate.getTime()) / (1000 * 60 * 60 * 24))} days old`);

  // Verify DATABASE_URL
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    logger.error('DATABASE_URL environment variable is not set');
    console.error('\n❌ Error: DATABASE_URL not found');
    console.error('   Make sure your database is provisioned in Replit\n');
    process.exit(1);
  }

  // Extract database info
  const url = new URL(databaseUrl);
  const database = url.pathname.slice(1);

  console.log(`\n🎯 Target Database: ${database}`);

  // Safety warning
  console.log('\n⚠️  WARNING: DESTRUCTIVE OPERATION ⚠️');
  console.log('=' .repeat(50));
  console.log('This will:');
  console.log('  1. DROP all existing tables in the database');
  console.log('  2. PERMANENTLY DELETE all current data');
  console.log('  3. Restore data from the backup file');
  console.log('\nThis operation CANNOT be undone!');
  console.log('=' .repeat(50));

  // Request confirmation
  console.log('\n🔐 Safety Check:');
  const confirmed = await askConfirmation(
    'Type "RESTORE" (all caps) to confirm and proceed: '
  );

  if (!confirmed) {
    console.log('\n❌ Restore cancelled. No changes were made.\n');
    logger.info('Database restore cancelled by user');
    process.exit(0);
  }

  console.log('\n✅ Confirmation received. Starting restore...\n');
  logger.warn({ 
    backupFile: path.basename(backupPath),
    database 
  }, 'Database restore initiated');

  try {
    // Extract connection details
    const host = url.hostname;
    const port = url.port || '5432';
    const username = url.username;
    const password = url.password;

    console.log('🔄 Step 1/3: Decompressing backup...');
    
    // Decompress the backup
    const decompressedPath = backupPath.replace('.gz', '');
    const gunzipCommand = `gunzip -c "${backupPath}" > "${decompressedPath}"`;
    
    await execAsync(gunzipCommand);
    
    console.log('✅ Decompression complete\n');

    console.log('🔄 Step 2/3: Restoring database...');
    console.log('   This may take 2-10 minutes depending on database size\n');

    // Restore using psql
    const psqlCommand = `PGPASSWORD="${password}" psql \
      -h ${host} \
      -p ${port} \
      -U ${username} \
      -d ${database} \
      -f "${decompressedPath}"`;

    logger.info({ filename: path.basename(backupPath) }, 'Starting database restore');

    const { stdout, stderr } = await execAsync(psqlCommand);

    if (stderr && !stderr.includes('NOTICE') && !stderr.includes('already exists')) {
      logger.warn({ stderr }, 'psql warnings during restore');
    }

    console.log('✅ Database restored\n');

    console.log('🔄 Step 3/3: Cleaning up...');
    
    // Remove decompressed file
    await fs.unlink(decompressedPath);
    
    console.log('✅ Cleanup complete\n');

    // Calculate duration
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log('=' .repeat(50));
    console.log('✨ Restore completed successfully!');
    console.log('=' .repeat(50));
    console.log(`\n📦 Restored from: ${path.basename(backupPath)}`);
    console.log(`⏱️  Duration: ${duration}s`);
    console.log(`🎯 Database: ${database}\n`);

    logger.info({
      backupFile: path.basename(backupPath),
      duration: parseFloat(duration),
      database
    }, 'Database restore completed');

    console.log('✅ Next steps:');
    console.log('   1. Restart your application');
    console.log('   2. Verify critical data is present');
    console.log('   3. Test key user workflows');
    console.log('   4. Monitor error logs for issues\n');

  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack }, 'Restore failed');
    
    console.error('\n❌ Restore failed!');
    console.error('=' .repeat(50));
    
    if (error.message.includes('psql') || error.message.includes('pg_')) {
      console.error('\n🔧 PostgreSQL Tools Required:');
      console.error('   Install psql (PostgreSQL client tools)');
      console.error('   This is typically available in Replit by default');
    } else if (error.message.includes('gunzip')) {
      console.error('\n🗜️  Decompression Error:');
      console.error('   Backup file may be corrupted');
      console.error('   Try creating a new backup');
    } else {
      console.error(`\n${error.message}`);
    }
    
    console.error('\n💬 For help, check docs/DATABASE_BACKUP.md');
    console.error('⚠️  Your database may be in an inconsistent state!');
    console.error('   Contact your database admin immediately.\n');
    
    process.exit(1);
  }
}

// Run restore
restoreDatabase();
