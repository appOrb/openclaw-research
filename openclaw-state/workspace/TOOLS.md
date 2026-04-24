# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## AI Waiter Project Specifics

### GitHub Organization
- **Org URL:** https://github.com/appOrb
- **Primary Repo:** ai_waiter.frontend
- **Target Branch:** main dev

### Model Usage Strategy

**Claude Sonnet 4.5** (Primary):
- Research & documentation
- Complex feature implementation
- Architecture design
- Code reviews

**Claude Haiku** (Efficiency):
- Simple repetitive tasks
- Quick updates
- Code formatting

**GPT-4.5 XHigh** (Quality Assurance):
- Troubleshooting
- Issue identification
- Testing
- Performance analysis

### Development Tools

**Testing:**
- Playwright MCP for E2E tests
- Jest/Vitest for unit tests
- React Testing Library for component tests

**Git Workflow:**
- Feature branches → PR to main dev
- Always notify @reevelobo after PR creation

### Key Principles

1. **Test-Driven Development** - Always write tests first
2. **Quality Over Speed** - No shortcuts
3. **Proactive Monitoring** - Find issues before users do
4. **Request Approval** - Never implement without approval
5. **Document Everything** - RCA, test results, decisions

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.
