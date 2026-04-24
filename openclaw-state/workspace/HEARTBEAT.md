# HEARTBEAT.md - Periodic Status Updates

## Daily Planning (Priority)

### 🌅 Morning Plan - 5:00 AM IST (11:30 PM UTC previous day)
**Frequency:** Every day  
**Channel:** Discord #general

**Tasks:**
1. Review previous day's work (check memory/YYYY-MM-DD.md)
2. Check system health (docker stats, service status)
3. Pull latest code changes (git pull)
4. Analyze test results
5. Post comprehensive E2E implementation plan:
   - Yesterday's achievements
   - Today's blockers
   - Today's priorities (3-5 tasks with estimates)
   - Phase progress percentages
   - Risks & questions
6. Update AI_WAITER_E2E_PLAN.md
7. Create daily task checklist

**Time Zone:** 
- 5:00 AM IST = 11:30 PM UTC (previous day)
- Example: April 23 plan posted April 22 at 11:30 PM UTC

---

## Tech Stack Research - 2:00 PM IST (8:30 AM UTC)
**Frequency:** Every day  
**Duration:** 1-2 hours  
**Focus:** Real-time voice AI tools & modern stacks

**Daily Research Topics:**
- Voice AI frameworks & libraries
- Real-time communication protocols
- LLM providers & performance
- Edge computing solutions
- Cost optimization strategies
- Emerging technologies

**Deliverables:**
- Daily findings in `/projects/appOrb/tech_stack_research/`
- Tool comparison matrices
- Stack recommendations with pros/cons
- Cost analysis

---

## Research Check-in - 9:00 PM IST (3:30 PM UTC)
**Frequency:** Every day  
**Channel:** Discord #general  
**Project:** 6-week AI application research

**Tasks:**
1. Summarize today's research (3-4 hours deep work)
2. Share key findings (top 3 insights)
3. Document new questions
4. Preview tomorrow's focus
5. Update /projects/appOrb/ai_research/research_log.md

---

## Periodic Health Checks

### Project Health Check (As Needed)
- Repository status
- Open issues review
- PR status
- Build/deployment status

### Track in memory/heartbeat-state.json
```json
{
  "lastStatusUpdate": null,
  "lastDailyPlan": null,
  "lastResearchCheckin": null,
  "currentTask": "Task description",
  "blockers": [],
  "completedToday": []
}
```
