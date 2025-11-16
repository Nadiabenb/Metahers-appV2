
# MetaHers Database Backup & Recovery Guide

## Overview

MetaHers uses Neon PostgreSQL with automatic backups and manual backup capabilities for data protection.

## Automatic Backups (Neon)

### Verify Automatic Backups

1. Log into [Neon Console](https://console.neon.tech)
2. Select your MetaHers project
3. Navigate to **Settings** → **Backups**
4. Verify:
   - ✅ Automatic backups are **enabled**
   - ✅ Retention period is **30 days** minimum
   - ✅ Point-in-time recovery (PITR) is active

### Backup Retention

- **Default retention**: 30 days
- **Recommended**: 30-90 days for production
- Backups are stored in Neon's infrastructure
- No action required - fully automatic

### Manual Neon Backup

To manually trigger a backup in Neon dashboard:

1. Go to Neon Console → Your Project
2. Click **Backups** in left sidebar
3. Click **Create Backup**
4. Add description (e.g., "Pre-migration backup")
5. Backup completes in 1-5 minutes

## Manual SQL Backups

### Creating a Backup

Run the backup script:

```bash
npm run backup:db
```

This creates a compressed SQL dump:
- Location: `backups/metahers-backup-{timestamp}.sql.gz`
- Includes: All tables, schemas, and data
- Size: ~5-50 MB (compressed)

### Restoring from Manual Backup

```bash
npm run restore:db backups/metahers-backup-2025-01-15T10-30-00-000Z.sql.gz
```

⚠️ **WARNING**: This will overwrite your current database!

The script will:
1. Verify backup file exists and is valid
2. Request explicit confirmation (type "RESTORE")
3. Drop existing tables
4. Restore from backup
5. Log all operations

## Recovery Procedures

### 1. Point-in-Time Recovery (Neon PITR)

**Use case**: Recover from accidental deletion, corruption within last 30 days

**Steps**:
1. Log into Neon Console
2. Navigate to **Backups** → **Point-in-time Recovery**
3. Select timestamp to restore to
4. Click **Restore**
5. Neon creates a new branch with restored data
6. Update `DATABASE_URL` to point to restored branch

**Recovery Time**: 5-15 minutes

### 2. Restore from Neon Automatic Backup

**Use case**: Recover to a specific automatic backup point

**Steps**:
1. Neon Console → **Backups**
2. Find backup in list
3. Click **Restore** next to backup
4. Creates new database branch
5. Update `DATABASE_URL` if needed

**Recovery Time**: 5-10 minutes

### 3. Restore from Manual SQL Backup

**Use case**: Recover from local backup file

**Steps**:
```bash
# List available backups
ls -lh backups/

# Restore specific backup
npm run restore:db backups/metahers-backup-2025-01-15T10-30-00-000Z.sql.gz
```

**Recovery Time**: 2-10 minutes (depending on database size)

## Backup Best Practices

### Regular Backups

- ✅ Automatic Neon backups (daily)
- ✅ Manual backups before major changes:
  - Database schema migrations
  - Bulk data imports
  - Major version upgrades
  - Production deployments

### Testing Restores

Test restore procedures quarterly:
```bash
# 1. Create test backup
npm run backup:db

# 2. Restore to test database
# (Use separate DATABASE_URL for testing)
```

### Backup Storage

- **Do NOT commit** backups to Git (in .gitignore)
- Store critical backups in:
  - Secure cloud storage (Google Drive, Dropbox)
  - External drive
  - Team shared location

## Emergency Contacts

**Database Issues**:
- Primary: Database Admin (add contact)
- Neon Support: support@neon.tech
- Documentation: https://neon.tech/docs/manage/backups

**Critical Data Loss**:
1. Stop all write operations immediately
2. Contact database admin
3. Check Neon Console for recent backups
4. Do NOT attempt restore without consultation

## Backup Checklist

Before Major Changes:
- [ ] Create manual backup: `npm run backup:db`
- [ ] Verify backup file created in `backups/`
- [ ] Test backup (optional): Verify .sql.gz file is valid
- [ ] Document what changed in backup filename

After Restore:
- [ ] Verify application connects successfully
- [ ] Check critical data is present
- [ ] Test key user workflows
- [ ] Monitor error logs for 24 hours

## Monitoring

Check backup health:
- Neon Console → Backups (weekly)
- Verify `backups/` directory has recent files
- Test restore procedure (quarterly)

## Backup File Information

### File Naming
```
metahers-backup-{ISO-8601-timestamp}.sql.gz
Example: metahers-backup-2025-01-15T10-30-00-000Z.sql.gz
```

### Contents
- Full database schema (DDL)
- All table data (DML)
- Indexes and constraints
- Sequences and defaults

### Compression
- Format: gzip (.gz)
- Typical compression: 80-90%
- Decompresses automatically during restore
