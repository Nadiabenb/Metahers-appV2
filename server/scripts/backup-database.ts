
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import { logger } from '../lib/logger';

const execAsync = promisify(exec);

/**
 * MetaHers Database Backup Script
 * 
 * Creates a compressed SQL dump of the entire database
 * Usage: npm run backup:db
 */

async function backupDatabase() {
  const startTime = Date.now();
  
  console.log('\n🔒 MetaHers Database Backup\n');
  console.log('=' .repeat(50));
  
  // Verify DATABASE_URL
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    logger.error('DATABASE_URL environment variable is not set');
    console.error('❌ Error: DATABASE_URL not found');
    console.error('   Make sure your database is provisioned in Replit');
    process.exit(1);
  }

  // Create backups directory
  const backupsDir = path.join(process.cwd(), 'backups');
  try {
    await fs.mkdir(backupsDir, { recursive: true });
    logger.info('Backups directory ready', { path: backupsDir });
  } catch (error) {
    logger.error({ error }, 'Failed to create backups directory');
    console.error('❌ Error creating backups directory:', error);
    process.exit(1);
  }

  // Generate backup filename with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFilename = `metahers-backup-${timestamp}.sql`;
  const compressedFilename = `${backupFilename}.gz`;
  const backupPath = path.join(backupsDir, backupFilename);
  const compressedPath = path.join(backupsDir, compressedFilename);

  console.log('\n📋 Backup Details:');
  console.log(`   • Timestamp: ${new Date().toISOString()}`);
  console.log(`   • Output: ${compressedFilename}`);
  console.log(`   • Location: ${backupsDir}`);

  try {
    // Extract connection details from DATABASE_URL
    const url = new URL(databaseUrl);
    const host = url.hostname;
    const port = url.port || '5432';
    const database = url.pathname.slice(1);
    const username = url.username;
    const password = url.password;

    console.log('\n🔄 Starting backup...');
    console.log('   This may take 1-5 minutes depending on database size\n');

    // Use pg_dump to create backup
    const pgDumpCommand = `PGPASSWORD="${password}" pg_dump \
      -h ${host} \
      -p ${port} \
      -U ${username} \
      -d ${database} \
      --no-owner \
      --no-acl \
      --clean \
      --if-exists \
      -f "${backupPath}"`;

    logger.info('Starting pg_dump', { filename: backupFilename });
    
    const { stdout, stderr } = await execAsync(pgDumpCommand);
    
    if (stderr && !stderr.includes('NOTICE')) {
      logger.warn('pg_dump warnings', { stderr });
    }

    // Verify backup file was created
    const stats = await fs.stat(backupPath);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    console.log('✅ SQL dump created');
    console.log(`   • Size: ${sizeInMB} MB (uncompressed)`);

    // Compress the backup
    console.log('\n🗜️  Compressing backup...');
    
    const gzipCommand = `gzip "${backupPath}"`;
    await execAsync(gzipCommand);
    
    logger.info('Backup compressed', { filename: compressedFilename });

    // Verify compressed file
    const compressedStats = await fs.stat(compressedPath);
    const compressedSizeInMB = (compressedStats.size / (1024 * 1024)).toFixed(2);
    const compressionRatio = ((1 - compressedStats.size / stats.size) * 100).toFixed(1);

    console.log('✅ Compression complete');
    console.log(`   • Compressed size: ${compressedSizeInMB} MB`);
    console.log(`   • Compression ratio: ${compressionRatio}%`);

    // Calculate duration
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log('\n' + '=' .repeat(50));
    console.log('✨ Backup completed successfully!');
    console.log('=' .repeat(50));
    console.log(`\n📦 Backup file: ${compressedFilename}`);
    console.log(`📁 Location: ${backupsDir}`);
    console.log(`⏱️  Duration: ${duration}s`);
    console.log(`💾 Size: ${compressedSizeInMB} MB\n`);

    logger.info('Database backup completed', {
      filename: compressedFilename,
      size: compressedStats.size,
      duration: parseFloat(duration),
      compressionRatio: parseFloat(compressionRatio)
    });

    console.log('💡 To restore this backup:');
    console.log(`   npm run restore:db backups/${compressedFilename}\n`);

  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack }, 'Backup failed');
    
    console.error('\n❌ Backup failed!');
    console.error('=' .repeat(50));
    
    if (error.message.includes('pg_dump')) {
      console.error('\n🔧 PostgreSQL Tools Required:');
      console.error('   Install pg_dump (PostgreSQL client tools)');
      console.error('   This is typically available in Replit by default');
    } else if (error.message.includes('ENOENT')) {
      console.error('\n📁 File System Error:');
      console.error('   Check write permissions for backups directory');
    } else {
      console.error(`\n${error.message}`);
    }
    
    console.error('\n💬 For help, check docs/DATABASE_BACKUP.md\n');
    
    // Cleanup partial files
    try {
      await fs.unlink(backupPath).catch(() => {});
      await fs.unlink(compressedPath).catch(() => {});
    } catch {}
    
    process.exit(1);
  }
}

// Run backup
backupDatabase();
