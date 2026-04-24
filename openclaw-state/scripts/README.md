# OpenClaw Backup & Restore Scripts

Automated point-in-time backup and restore scripts for OpenClaw workspace state.

## Scripts

### 1. `pit-backup.sh` - Create Point-in-Time Backup

Creates a timestamped backup of workspace state and pushes to GitHub.

**Usage:**
```bash
./pit-backup.sh
```

**What's Backed Up:**
- Workspace files (*.md, *.json, *.sh)
- Memory logs (daily logs + heartbeat state)
- Active projects (AI research, tech stack, POCs)
- Configuration (OpenClaw config, runner setup)

**Output:**
- Git tag: `pit-YYYYMMDD-HHMMSS`
- GitHub branch: `backups`
- Repository: `appOrb/openclaw-research`

**Environment Variables:**
- `KEEP_LOCAL=true` - Keep backup locally after push

---

### 2. `pit-restore.sh` - Restore from Backup

Restores workspace state from a specific backup tag.

**Usage:**
```bash
# Full restore
./pit-restore.sh --tag pit-20260424-182500 --full

# Workspace only
./pit-restore.sh --tag pit-20260424-182500 --workspace

# Memory only
./pit-restore.sh --tag pit-20260424-182500 --memory

# Specific project
./pit-restore.sh --tag pit-20260424-182500 --project granite-speech-poc

# Configuration only
./pit-restore.sh --tag pit-20260424-182500 --config

# Dry run (preview without changes)
./pit-restore.sh --tag pit-20260424-182500 --full --dry-run
```

**Options:**
- `-t, --tag TAG` - Backup tag to restore (required)
- `-f, --full` - Full restore (all components)
- `-w, --workspace` - Workspace files only
- `-m, --memory` - Memory logs only
- `-p, --project NAME` - Specific project only
- `-c, --config` - Configuration only
- `--dry-run` - Preview without making changes

**Safety Features:**
- Confirmation prompt before restore
- Pre-restore backup of current state
- Dry-run mode for testing

---

### 3. `daily-e2e-plan.sh` - Generate Daily E2E Report

Template generator for daily E2E implementation planning reports.

**Usage:**
```bash
./daily-e2e-plan.sh > daily-plan-$(date +%Y%m%d).md
```

---

## Automated Backups

### Setup Cron Job

Add to crontab for automated daily backups:

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM UTC
0 2 * * * /home/azureuser/.openclaw/workspace/scripts/pit-backup.sh >> /tmp/pit-backup.log 2>&1
```

### Setup GitHub Authentication

For automated backups, configure GitHub CLI:

```bash
# Login to GitHub
gh auth login

# Or use token
export GITHUB_TOKEN=your_token_here
```

---

## Backup Strategy

### Recommended Schedule

**Daily Backups:**
- **Time**: 2:00 AM UTC
- **Retention**: Keep last 30 days
- **Storage**: GitHub tags

**Weekly Backups:**
- **Time**: Sunday 2:00 AM UTC
- **Retention**: Keep last 3 months
- **Storage**: GitHub tags + releases

**Monthly Backups:**
- **Time**: 1st of month, 2:00 AM UTC
- **Retention**: Keep last 12 months
- **Storage**: GitHub releases

### Cleanup Strategy

```bash
# Delete backups older than 30 days
CUTOFF_DATE=$(date -d "30 days ago" +%Y%m%d)

git tag | grep "pit-" | while read tag; do
    TAG_DATE=$(echo $tag | cut -d'-' -f2)
    if [ "$TAG_DATE" -lt "$CUTOFF_DATE" ]; then
        git tag -d "$tag"
        git push origin ":refs/tags/$tag"
    fi
done
```

---

## Disaster Recovery

### Scenario 1: Complete Workspace Loss

```bash
# Clone backup repository
git clone https://github.com/appOrb/openclaw-research.git
cd openclaw-research

# Find latest backup
git tag | grep pit- | tail -1

# Restore everything
../pit-restore.sh --tag pit-20260424-182500 --full
```

### Scenario 2: Memory Corruption

```bash
# Restore only memory
./pit-restore.sh --tag pit-20260424-182500 --memory
```

### Scenario 3: Project Files Deleted

```bash
# Restore specific project
./pit-restore.sh --tag pit-20260424-182500 --project granite-speech-poc
```

### Scenario 4: Configuration Error

```bash
# Restore config
./pit-restore.sh --tag pit-20260424-182500 --config
```

---

## Testing

### Test Backup Process

```bash
# Run backup
./pit-backup.sh

# Verify tag was created
git tag | grep pit-$(date +%Y%m%d)

# Check GitHub
gh release list | head -5
```

### Test Restore Process

```bash
# Dry run restore
./pit-restore.sh --tag pit-20260424-182500 --full --dry-run

# Restore to temporary location
RESTORE_TO_TEMP=true ./pit-restore.sh --tag pit-20260424-182500 --workspace
```

---

## Monitoring

### Check Backup Status

```bash
# View recent backups
git tag | grep pit- | tail -10

# View backup details
git show pit-20260424-182500:BACKUP_INFO.md
```

### Check Backup Size

```bash
# Total backup size
du -sh ~/.openclaw/workspace/

# Individual components
du -sh ~/.openclaw/workspace/{memory,scripts}
du -sh ~/projects/appOrb/{ai_research,tech_stack_research}
```

---

## Troubleshooting

### Backup Fails to Push

**Check GitHub authentication:**
```bash
gh auth status
```

**Check repository access:**
```bash
gh repo view appOrb/openclaw-research
```

### Restore Fails

**Check tag exists:**
```bash
git ls-remote --tags origin | grep pit-20260424-182500
```

**Check permissions:**
```bash
ls -la /home/azureuser/.openclaw/workspace/
```

### Disk Space Issues

**Check available space:**
```bash
df -h /tmp
df -h /home/azureuser
```

**Cleanup temporary files:**
```bash
rm -rf /tmp/openclaw-pit-*
```

---

## Security

### What's Backed Up
✅ Workspace files (non-sensitive)  
✅ Memory logs (non-sensitive)  
✅ Project files (non-sensitive)  
✅ Configuration (non-sensitive)

### What's NOT Backed Up
❌ API keys / tokens  
❌ Private credentials  
❌ SSH keys  
❌ .env files with secrets  
❌ node_modules / build artifacts

### GitHub Repository
- **Visibility**: Public
- **Access**: Organization members
- **Contents**: Non-sensitive data only

---

## Integration with Database Backups

This workspace backup complements database backups:

### Combined Restore Process

```bash
# 1. Restore database (see PIT_BACKUP_GUIDE.md)
az postgres flexible-server restore \
  --resource-group ai-waiter-rg \
  --name ai-waiter-db-restored \
  --source-server ai-waiter-db \
  --restore-time "2026-04-24T18:00:00Z"

# 2. Restore workspace
./pit-restore.sh --tag pit-20260424-180000 --full

# 3. Verify both are in sync
```

---

## Future Enhancements

- [ ] Automated cleanup of old backups
- [ ] Incremental backups (only changed files)
- [ ] Encrypted backup support
- [ ] S3/Azure Blob storage option
- [ ] Backup verification/integrity checks
- [ ] Restore progress indicator
- [ ] Email notifications on backup/restore
- [ ] Backup compression

---

## Support

For issues:
1. Check script logs: `/tmp/pit-backup.log`
2. Check GitHub: https://github.com/appOrb/openclaw-research/issues
3. Contact: @openclaw-apporb on Discord

---

**Last Updated:** 2026-04-24  
**Version:** 1.0.0  
**Author:** OpenClaw AppOrb 🤖
