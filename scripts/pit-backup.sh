#!/bin/bash
# OpenClaw Point-in-Time Backup Script
# Backs up workspace state, memory, and configuration to GitHub

set -euo pipefail

# Configuration
BACKUP_REPO="appOrb/openclaw-research"
BACKUP_BRANCH="backups"
WORKSPACE_DIR="/home/azureuser/.openclaw/workspace"
PROJECTS_DIR="/home/azureuser/projects"
BACKUP_DIR="/tmp/openclaw-pit-backup-$(date +%Y%m%d-%H%M%S)"
TIMESTAMP=$(date -u +"%Y-%m-%d %H:%M:%S UTC")
BACKUP_TAG="pit-$(date +%Y%m%d-%H%M%S)"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create backup directory structure
create_backup_structure() {
    log_info "Creating backup directory structure..."
    mkdir -p "$BACKUP_DIR"/{workspace,memory,projects,config}
}

# Backup workspace files
backup_workspace() {
    log_info "Backing up workspace files..."
    
    # Core workspace files
    cp -r "$WORKSPACE_DIR"/*.md "$BACKUP_DIR/workspace/" 2>/dev/null || true
    cp -r "$WORKSPACE_DIR"/*.json "$BACKUP_DIR/workspace/" 2>/dev/null || true
    cp -r "$WORKSPACE_DIR"/*.sh "$BACKUP_DIR/workspace/" 2>/dev/null || true
    
    # Scripts folder
    if [ -d "$WORKSPACE_DIR/scripts" ]; then
        cp -r "$WORKSPACE_DIR/scripts" "$BACKUP_DIR/workspace/"
    fi
}

# Backup memory files
backup_memory() {
    log_info "Backing up memory files..."
    
    if [ -d "$WORKSPACE_DIR/memory" ]; then
        cp -r "$WORKSPACE_DIR/memory" "$BACKUP_DIR/"
    else
        log_warn "Memory directory not found"
    fi
}

# Backup active projects
backup_projects() {
    log_info "Backing up active projects..."
    
    # appOrb projects
    if [ -d "$PROJECTS_DIR/appOrb" ]; then
        rsync -av \
            --exclude 'node_modules' \
            --exclude '.next' \
            --exclude 'dist' \
            --exclude 'build' \
            --exclude '.git' \
            --exclude 'test-results' \
            "$PROJECTS_DIR/appOrb/ai_research" \
            "$BACKUP_DIR/projects/" 2>/dev/null || true
            
        rsync -av \
            --exclude 'node_modules' \
            --exclude '.next' \
            --exclude '.git' \
            "$PROJECTS_DIR/appOrb/tech_stack_research" \
            "$BACKUP_DIR/projects/" 2>/dev/null || true
    fi
    
    # Granite Speech POC
    if [ -d "$PROJECTS_DIR/granite-speech-poc" ]; then
        rsync -av \
            --exclude 'node_modules' \
            --exclude '.next' \
            --exclude '.git' \
            --exclude 'test-results' \
            "$PROJECTS_DIR/granite-speech-poc" \
            "$BACKUP_DIR/projects/"
    fi
}

# Backup OpenClaw configuration
backup_config() {
    log_info "Backing up OpenClaw configuration..."
    
    # OpenClaw config
    if [ -d "/home/azureuser/.openclaw" ]; then
        cp "/home/azureuser/.openclaw/config.json" "$BACKUP_DIR/config/" 2>/dev/null || true
    fi
    
    # GitHub runner config (if exists)
    if [ -d "/home/azureuser/actions-runner" ]; then
        cp "/home/azureuser/actions-runner/runner-control.sh" "$BACKUP_DIR/config/" 2>/dev/null || true
        cp "/home/azureuser/actions-runner/RUNNER_SETUP.md" "$BACKUP_DIR/config/" 2>/dev/null || true
    fi
    
    # Documentation projects
    if [ -d "/home/azureuser/docling_production" ]; then
        cp -r "/home/azureuser/docling_production" "$BACKUP_DIR/projects/"
    fi
    
    if [ -d "/home/azureuser/ibm_granite_research" ]; then
        cp -r "/home/azureuser/ibm_granite_research" "$BACKUP_DIR/projects/"
    fi
}

# Create backup metadata
create_metadata() {
    log_info "Creating backup metadata..."
    
    cat > "$BACKUP_DIR/BACKUP_INFO.md" << EOF
# Point-in-Time Backup

**Backup Time:** $TIMESTAMP
**Backup Tag:** $BACKUP_TAG
**Hostname:** $(hostname)
**User:** $(whoami)

## System Info
- **OS:** $(uname -s)
- **Kernel:** $(uname -r)
- **Node Version:** $(node --version 2>/dev/null || echo "Not installed")
- **NPM Version:** $(npm --version 2>/dev/null || echo "Not installed")

## Backup Contents

### Workspace Files
\`\`\`
$(ls -lh $BACKUP_DIR/workspace/ 2>/dev/null || echo "No workspace files")
\`\`\`

### Memory Files
\`\`\`
$(ls -lh $BACKUP_DIR/memory/ 2>/dev/null || echo "No memory files")
\`\`\`

### Projects
\`\`\`
$(find $BACKUP_DIR/projects/ -maxdepth 2 -type d 2>/dev/null || echo "No projects")
\`\`\`

### Configuration
\`\`\`
$(ls -lh $BACKUP_DIR/config/ 2>/dev/null || echo "No config files")
\`\`\`

## Backup Size
\`\`\`
$(du -sh $BACKUP_DIR)
\`\`\`

## Restore Instructions

### Full Restore
\`\`\`bash
# Clone backup repository
git clone https://github.com/$BACKUP_REPO.git
cd openclaw-research
git checkout tags/$BACKUP_TAG

# Restore workspace
rsync -av workspace/ /home/azureuser/.openclaw/workspace/
rsync -av memory/ /home/azureuser/.openclaw/workspace/memory/

# Restore projects
rsync -av projects/ /home/azureuser/projects/

# Restore config
rsync -av config/ /home/azureuser/.openclaw/
\`\`\`

### Selective Restore
\`\`\`bash
# Restore only memory
git checkout tags/$BACKUP_TAG memory/

# Restore specific project
git checkout tags/$BACKUP_TAG projects/granite-speech-poc/
\`\`\`

## Database Point-in-Time Restore

### PostgreSQL PITR
\`\`\`bash
# Using Azure CLI
az postgres flexible-server restore \\
  --resource-group ai-waiter-rg \\
  --name ai-waiter-db-restored \\
  --source-server ai-waiter-db \\
  --restore-time "$TIMESTAMP"
\`\`\`

### Using Terraform
\`\`\`hcl
resource "azurerm_postgresql_flexible_server" "restored" {
  name                = "ai-waiter-db-restored"
  point_in_time_restore_time_in_utc = "$TIMESTAMP"
  source_server_id    = azurerm_postgresql_flexible_server.postgres.id
  # ... other config
}
\`\`\`
EOF
}

# Push to GitHub
push_to_github() {
    log_info "Pushing backup to GitHub..."
    
    cd "$BACKUP_DIR"
    
    # Initialize git if needed
    if [ ! -d ".git" ]; then
        git init
        git remote add origin "https://github.com/$BACKUP_REPO.git"
    fi
    
    # Create backup branch if it doesn't exist
    git fetch origin "$BACKUP_BRANCH" 2>/dev/null || git checkout -b "$BACKUP_BRANCH"
    
    # Add all files
    git add -A
    
    # Commit with timestamp
    git commit -m "Point-in-Time Backup: $TIMESTAMP

Backup Tag: $BACKUP_TAG
Hostname: $(hostname)
User: $(whoami)

Contents:
- Workspace files
- Memory logs
- Active projects
- Configuration

Size: $(du -sh . | cut -f1)"
    
    # Tag the commit
    git tag -a "$BACKUP_TAG" -m "PIT Backup: $TIMESTAMP"
    
    # Push
    git push origin "$BACKUP_BRANCH"
    git push origin "$BACKUP_TAG"
    
    log_info "Backup pushed successfully!"
    log_info "Backup tag: $BACKUP_TAG"
    log_info "View at: https://github.com/$BACKUP_REPO/tree/$BACKUP_TAG"
}

# Cleanup
cleanup() {
    log_info "Cleaning up temporary files..."
    rm -rf "$BACKUP_DIR"
}

# Main execution
main() {
    log_info "Starting Point-in-Time backup..."
    log_info "Timestamp: $TIMESTAMP"
    log_info "Backup tag: $BACKUP_TAG"
    
    create_backup_structure
    backup_workspace
    backup_memory
    backup_projects
    backup_config
    create_metadata
    push_to_github
    
    log_info "Backup complete!"
    log_info "Restore command: git checkout tags/$BACKUP_TAG"
}

# Error handling
trap 'log_error "Backup failed!"; cleanup; exit 1' ERR

# Run main
main

# Optional: Keep backup locally for quick restore
if [ "${KEEP_LOCAL:-false}" = "true" ]; then
    log_info "Keeping local backup at: $BACKUP_DIR"
else
    cleanup
fi
