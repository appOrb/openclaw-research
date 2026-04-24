# AI Waiter Development Workflow

## Repository Information

**Organization:** https://github.com/appOrb  
**Primary Repository:** ai_waiter.frontend (Next.js)  
**Target Branch:** main dev

## Development Workflow

### 0. Notion Task Status Updates

**ALWAYS update task status in Notion:**
- **Starting work:** Set Status to "In Progress"
- **Completing work:** Set Status to "Done"
- Use helper: `bash update_notion_status.sh <page_id> "In Progress"`

### 1. Issue Identification & Validation

**Regular Tasks:**
- Monitor application health
- Check existing GitHub issues
- Validate if reported issues still persist
- Create new issues for discovered problems
- Document Root Cause Analysis (RCA) for fixes

**Issue Creation Format:**
```markdown
## Issue Title
Brief description

## Current Behavior
What's happening now

## Expected Behavior
What should happen

## Steps to Reproduce
1. Step one
2. Step two

## Environment
- Browser/Platform
- Version
- Other relevant details
```

### 2. Feature Development Process

#### Phase 1: Planning & Approval
1. **Receive feature request** from @reevelobo
2. **Research & analyze** using Claude Sonnet 4.5:
   - Review documentation
   - Understand requirements
   - Identify dependencies
   - Design solution architecture
3. **Create development plan** with:
   - Technical approach
   - Test strategy
   - Implementation steps
   - Potential risks
4. **Request approval** from @reevelobo before proceeding

#### Phase 2: Test-Driven Development
1. **Write tests first:**
   - Unit tests for logic
   - Integration tests for API/components
   - E2E tests (Playwright) for user flows
2. **Implement features** to pass tests
3. **Refactor** while maintaining green tests

#### Phase 3: Testing & Validation
1. **Unit Tests:** All new code covered
2. **Integration Tests:** API and component interactions verified
3. **E2E Tests:** Full user workflows validated with Playwright MCP
4. **Build Validation:** Ensure clean build with no errors
5. **Manual Verification:** Test in local environment

#### Phase 4: Pull Request
1. **Create PR** to main dev branch
2. **PR Description Must Include:**
   - Feature/fix summary
   - Testing performed
   - Screenshots/recordings (if UI changes)
   - Related issue numbers
   - RCA (if fixing a bug)
3. **Notify @reevelobo on Discord immediately** after PR creation with:
   - PR link
   - Brief summary of changes
   - Key testing results

### 3. Model Selection Strategy

**Claude Sonnet 4.5** - Primary workhorse
- Research and documentation review
- Understanding complex requirements
- Solution architecture design
- Code implementation (complex features)
- Documentation writing

**Claude Haiku** - Quick tasks
- Simple repetitive tasks
- Code formatting
- Minor updates
- Quick checks

**GPT-4.5 XHigh** - Troubleshooting & Quality Assurance
- Identifying issues
- Debugging complex problems
- Test execution and analysis
- Performance optimization
- Security reviews

### 4. Quality Gates

**Before Creating PR:**
- ✅ All tests passing (unit, integration, E2E)
- ✅ Build successful with no errors
- ✅ Code reviewed for quality
- ✅ Documentation updated
- ✅ No console errors or warnings
- ✅ Performance validated
- ✅ Accessibility checked (if applicable)

### 5. Continuous Improvement

**Always Allowed:**
- Update this workflow document
- Improve testing strategies
- Optimize development processes
- Suggest architectural improvements

**Requires Approval:**
- Architectural changes
- New dependencies
- Design pattern changes
- Major refactoring
- Infrastructure changes

### 6. Communication Protocol

**Immediate Notification Required:**
- PR created
- Critical bugs discovered
- Blocking issues identified
- Security vulnerabilities found

**Request Approval For:**
- New features before implementation
- Design/architecture changes
- Optimization recommendations
- Third-party integrations

### 7. Issue Management

**Regular Checks:**
- Review open GitHub issues
- Validate issue status
- Update issue comments with progress
- Close resolved issues with summary

**Issue Resolution Format:**
```markdown
## Resolution Summary
Brief fix description

## Root Cause Analysis (RCA)
What caused the issue

## Fix Implemented
Technical details of the solution

## Testing Performed
- Unit tests: [results]
- Integration tests: [results]
- E2E tests: [results]

## Prevention
Steps to prevent recurrence
```

### 8. Application Monitoring

**Proactive Health Checks:**
- Frontend build status
- Runtime errors
- Performance issues
- Broken links or features
- Console warnings
- Accessibility issues
- Cross-browser compatibility

**Create Issues For:**
- Any discovered bugs
- Performance degradation
- UX problems
- Security concerns
- Code quality issues

---

## Current Focus

**Primary Repository:** ai_waiter.frontend (Next.js)

**Next Steps:**
1. Clone and review repository structure
2. Understand current application state
3. Review existing issues
4. Set up local development environment
5. Document current architecture
6. Begin systematic issue validation

---

_This workflow evolves. Updates are encouraged to improve quality and efficiency._
