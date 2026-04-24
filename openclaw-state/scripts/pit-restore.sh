#!/bin/bash
# OpenClaw Point-in-Time Restore Script
# Restores workspace state from a specific backup tag

set -euo pipefail

# Configuration
BACKUP_REPO="appOrb/openclaw-research"
RESTORE_DIR="/tmp/openclaw-pit-restore-$(date +%Y%m%d-%H%M%S)"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

log_prompt() {
    echo -e "${BLUE}[PROMPT]${NC} $1"
}

# Show usage
usage() {
    cat << EOF
Usage: $0 [OPTIONS]

Point-in-Time Restore for OpenClaw workspace

OPTIONS:
    -t, --tag TAG           Backup tag to restore (required)
    -f, --full              Full restore (workspace + memory + projects + config)
    -w, --workspace         Restore workspace files only
    -m, --memory            Restore memory files only
    -p, --project NAME      Restore specific project only
    -c, --config            Restore configuration only
    --dry-run               Show what would be restored without making changes
    -h, --help              Show this help message

EXAMPLES:
    # Full restore
    $0 --tag pit-20260424-182500 --full

    # Restore memory only
    $0 --tag pit-20260424-182500 --memory

    # Restore specific project
    $0 --tag pit-20260424-182500 --project granite-speech-poc

    # Dry run
    $0 --tag pit-20260424-182500 --full --dry-run

EOF
    exit 1
}

# Parse arguments
BACKUP_TAG=""
RESTORE_TYPE=""
PROJECT_NAME=""
DRY_RUN=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -t|--tag)
            BACKUP_TAG="$2"
            shift 2
            ;;
        -f|--full)
            RESTORE_TYPE="full"
            shift
            ;;
        -w|--workspace)
            RESTORE_TYPE="workspace"
            shift
            ;;
        -m|--memory)
            RESTORE_TYPE="memory"
            shift
            ;;
        -p|--project)
            RESTORE_TYPE="project"
            PROJECT_NAME="$2"
            shift 2
            ;;
        -c|--config)
            RESTORE_TYPE="config"
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        -h|--help)
            usage
            ;;
        *)
            log_error "Unknown option: $1"
            usage
            ;;
    esac
done

# Validate inputs
if [ -z "$BACKUP_TAG" ]; then
    log_error "Backup tag is required"
    usage
fi

if [ -z "$RESTORE_TYPE" ]; then
    log_error "Restore type is required"
    usage
fi

# Clone backup repository
clone_backup() {
    log_info "Cloning backup repository..."
    git clone --branch backups "https://github.com/$BACKUP_REPO.git" "$RESTORE_DIR"
    cd "$RESTORE_DIR"
    
    # Checkout specific tag
    log_info "Checking out tag: $BACKUP_TAG"
    git checkout "tags/$BACKUP_TAG"
    
    # Show backup info
    if [ -f "BACKUP_INFO.md" ]; then
        log_info "Backup Information:"
        head -20 BACKUP_INFO.md
    fi
}

# Confirm restore
confirm_restore() {
    log_prompt "You are about to restore from backup tag: $BACKUP_TAG"
    log_prompt "Restore type: $RESTORE_TYPE"
    
    if [ "$DRY_RUN" = true ]; then
        log_warn "DRY RUN MODE - No changes will be made"
        return
    fi
    
    read -p "Are you sure you want to continue? (yes/no): " response
    if [ "$response" != "yes" ]; then
        log_warn "Restore cancelled"
        exit 0
    fi
}

# Backup current state before restore
backup_current() {
    if [ "$DRY_RUN" = true ]; then
        return
    fi
    
    log_info "Backing up current state before restore..."
    BACKUP_TIMESTAMP=$(date +%Y%m%d-%H%M%S)
    
    mkdir -p "/tmp/openclaw-pre-restore-$BACKUP_TIMESTAMP"
    
    if [ -d "/home/azureuser/.openclaw/workspace" ]; then
        cp -r "/home/azureuser/.openclaw/workspace" "/tmp/openclaw-pre-restore-$BACKUP_TIMESTAMP/"
    fi
    
    log_info "Current state backed up to: /tmp/openclaw-pre-restore-$BACKUP_TIMESTAMP"
}

# Restore workspace
restore_workspace() {
    log_info "Restoring workspace files..."
    
    if [ "$DRY_RUN" = true ]; then
        log_info "Would restore:"
        find workspace -type f 2>/dev/null || echo "No workspace files"
        return
    fi
    
    rsync -av workspace/ /home/azureuser/.openclaw/workspace/
    log_info "Workspace restored"
}

# Restore memory
restore_memory() {
    log_info "Restoring memory files..."
    
    if [ "$DRY_RUN" = true ]; then
        log_info "Would restore:"
        find memory -type f 2>/dev/null || echo "No memory files"
        return
    fi
    
    rsync -av memory/ /home/azureuser/.openclaw/workspace/memory/
    log_info "Memory restored"
}

# Restore projects
restore_projects() {
    log_info "Restoring projects..."
    
    if [ "$DRY_RUN" = true ]; then
        log_info "Would restore:"
        find projects -maxdepth 2 -type d 2>/dev/null || echo "No projects"
        return
    fi
    
    rsync -av projects/ /home/azureuser/projects/
    log_info "Projects restored"
}

# Restore specific project
restore_project() {
    log_info "Restoring project: $PROJECT_NAME"
    
    if [ ! -d "projects/$PROJECT_NAME" ]; then
        log_error "Project not found in backup: $PROJECT_NAME"
        exit 1
    fi
    
    if [ "$DRY_RUN" = true ]; then
        log_info "Would restore:"
        find "projects/$PROJECT_NAME" -type f 2>/dev/null
        return
    fi
    
    rsync -av "projects/$PROJECT_NAME/" "/home/azureuser/projects/$PROJECT_NAME/"
    log_info "Project restored: $PROJECT_NAME"
}

# Restore config
restore_config() {
    log_info "Restoring configuration..."
    
    if [ "$DRY_RUN" = true ]; then
        log_info "Would restore:"
        find config -type f 2>/dev/null || echo "No config files"
        return
    fi
    
    rsync -av config/ /home/azureuser/.openclaw/
    log_info "Configuration restored"
}

# Cleanup
cleanup() {
    log_info "Cleaning up temporary files..."
    rm -rf "$RESTORE_DIR"
}

# Main execution
main() {
    log_info "Starting Point-in-Time restore..."
    log_info "Backup tag: $BACKUP_TAG"
    log_info "Restore type: $RESTORE_TYPE"
    
    clone_backup
    confirm_restore
    backup_current
    
    case "$RESTORE_TYPE" in
        full)
            restore_workspace
            restore_memory
            restore_projects
            restore_config
            ;;
        workspace)
            restore_workspace
            ;;
        memory)
            restore_memory
            ;;
        project)
            restore_project
            ;;
        config)
            restore_config
            ;;
        *)
            log_error "Invalid restore type: $RESTORE_TYPE"
            exit 1
            ;;
    esac
    
    cleanup
    
    log_info "Restore complete!"
    
    if [ "$DRY_RUN" = false ]; then
        log_info "Pre-restore backup saved to: /tmp/openclaw-pre-restore-*"
        log_warn "Please verify the restored state before continuing work"
    fi
}

# Error handling
trap 'log_error "Restore failed!"; cleanup; exit 1' ERR

# Run main
main
