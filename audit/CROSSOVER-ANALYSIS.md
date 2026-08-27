# Crossover Analysis: Audit vs Review-Deploy Tasks
**Date:** 2026-07-27
**Comparing:** VSCODE-AGENT-DEEP-AUDIT-PROMPT.md (completed) vs VSCODE-AGENT-REVIEW-DEPLOY-PROMPT.md (pending)

---

## EXECUTIVE SUMMARY

**Verdict:** ✅ **NO CONFLICT - COMPLEMENTARY TASKS**

The review-deploy task implements the **infrastructure fixes** I recommended in my audit (Phase 1).
My audit work focused on **stopping imports**, **analyzing data**, and **identifying additional quality issues**.

**Recommended sequence:**
1. ✅ **DONE:** Audit work (imports stopped, data analyzed, issues identified)
2. ⏭️ **NEXT:** Review-deploy task (deploy uniqueness gates + find-or-create route)
3. 🔜 **AFTER:** Implement additional data quality validations (multi-artist, cancelled, unsearchable)

---

## DETAILED CROSSOVER MATRIX

| Component | Audit Work (Completed) | Review-Deploy Task (Pending) | Status |
|-----------|------------------------|------------------------------|--------|
| **Import shutdown** | ✅ Disabled 5 EventBridge rules, Lambda concurrency=0, CDK updated | 🔴 Out of scope (explicitly NOT re-enabling) | ✅ Complete |
| **`POST /api/artists/find-or-create`** | ✅ Identified as MISSING (root cause) | ✅ Deploys the route (uncommitted changes exist) | 🔄 Handoff |
| **Backend uniqueness gates** | ✅ Recommended as Phase 1 item 2 | ✅ Deploys gates (GATE_MODE=log) | 🔄 Handoff |
| **MCP fallback to `/community`** | ✅ Identified as root cause | ✅ Removes fallback in create-artist.ts | 🔄 Handoff |
| **Data backups** | ✅ Created (2,047 artists, 1,467 venues, 4,844 events) | 🔴 Out of scope | ✅ Complete |
| **Duplicate detection** | ✅ Analyzed (113 artist, 9 venue, 14 event clusters) | 🔴 Out of scope | ✅ Complete |
| **Multi-artist lineup validation** | ✅ Identified 15 instances, designed prevention | 🔴 NOT in review-deploy scope | ⚠️ Gap |
| **"Cancelled" artist validation** | ✅ Identified 4 instances, designed prevention | 🔴 NOT in review-deploy scope | ⚠️ Gap |
| **Unsearchable name validation** | ✅ Identified 2 instances, designed prevention | 🔴 NOT in review-deploy scope | ⚠️ Gap |
| **Zero-event cleanup** | ✅ Identified 28 instances, generated cleanup list | 🔴 NOT in review-deploy scope | ⚠️ Gap |
| **Orphan analysis** | ✅ Found 185 orphaned events (+88 since 07-09) | 🔴 Out of scope | ✅ Complete |
| **Provenance analysis** | ✅ Analyzed pollution by source and timeline | 🔴 Out of scope | ✅ Complete |
| **Gate-readiness metrics** | ✅ Calculated (202 artists missing location, etc.) | 🔴 Out of scope | ✅ Complete |

---

## WHAT THE REVIEW-DEPLOY TASK DOES

### Infrastructure Fixes (From Cowork Session)
The review-deploy task deploys **uncommitted changes** that implement:

1. **New route:** `POST /api/artists/find-or-create`
   - **Crossover:** This is the missing route I identified as root cause in my audit
   - **Status:** ✅ My audit diagnosed the problem, review-deploy deploys the fix

2. **Uniqueness gates:** `bndy-unique-keys` table + gated writes
   - **Mechanism:** `transactWrite` with `attribute_not_exists` on sentinel keys
   - **Mode:** `GATE_MODE=log` (logs `WOULD_BOUNCE`, still writes - non-breaking)
   - **Crossover:** This implements the backend gates I recommended in Phase 1
   - **Status:** ✅ My audit recommended the approach, review-deploy deploys the implementation

3. **MCP fallback removal:** `create-artist.ts` no longer falls back to `/community` on 404
   - **Crossover:** My audit identified this as the root cause of artist duplication
   - **Status:** ✅ My audit diagnosed, review-deploy deploys the fix

4. **Bulk import auth:** `requireAuth` added to `handleBulkImport`
   - **Crossover:** Not in my audit, but good security practice
   - **Status:** ✅ Bonus improvement

5. **Edit event fix:** `mcp.js` now maps `artist_id` → `artistId`
   - **Crossover:** Not in my audit (I didn't test MCP edit_event)
   - **Status:** ✅ Bonus fix

6. **Venue pagination:** `scanAll` in `venue-deduplication.js`
   - **Crossover:** My audit used pagination in backup scripts
   - **Status:** ✅ Good practice alignment

### What It Does NOT Do

The review-deploy task does **NOT** include the data quality validations I designed:

1. ❌ Multi-artist lineup detection (15 found in my audit)
2. ❌ "Cancelled" artist detection (4 found)
3. ❌ Unsearchable name validation (2 found)
4. ❌ Zero-event artist cleanup (28 found)
5. ❌ Any data cleanup/remediation

**Why?** The Cowork session focused on **uniqueness gates** (prevent duplicates going forward).
My supplementary audit focused on **data quality gates** (prevent junk/malformed data).

---

## WHAT MY AUDIT DID

### Part A: Import Shutdown ✅
- Disabled 5 EventBridge rules
- Set Lambda concurrency to 0
- Updated CDK code to prevent re-enabling
- Confirmed API drift (missing find-or-create route)

### Part B: Deep Data Analysis ✅
- Full paginated backups (2,047 artists, 1,467 venues, 4,844 events)
- Duplicate detection (113 artist, 9 venue, 14 event clusters)
- Orphan analysis (185 orphaned events, +88 since 07-09)
- Provenance analysis (82.7% of events from mcp_ai_import)
- Gate-readiness metrics

### Supplementary: Data Quality Issues ✅
- 15 multi-artist lineups (designed prevention strategy)
- 4 "Cancelled" artists (designed prevention strategy)
- 2 unsearchable names (designed alias system)
- 28 zero-event artists (generated cleanup list)

### Deliverables ✅
- FINAL-AUDIT-REPORT-2026-07-27.md (comprehensive summary)
- SUPPLEMENTARY-DATA-QUALITY-FINDINGS.md (additional issues)
- DATA-QUALITY-PREVENTION-STRATEGY.md (implementation plan)
- Backup files (artists, venues, events, memberships)
- Machine-readable reports (JSON)
- Cleanup lists (IDs to delete/merge)

---

## INTEGRATION STRATEGY

### Phase 1: Infrastructure (Review-Deploy Task) ⏭️ NEXT
**Timeline:** Today

1. Review uncommitted changes in both repos
2. Run tests (jest + vitest + sam validate)
3. Commit both repos
4. Deploy bndy-serverless-api with GATE_MODE=log
5. Rebuild/restart MCP server
6. Verify:
   - `POST /api/artists/find-or-create` route exists
   - Uniqueness gates log `WOULD_BOUNCE` events
   - Bulk import requires auth
   - MCP no longer falls back to `/community`

**Outcome:** Infrastructure fixes deployed, imports can be safely re-enabled (after data cleanup)

### Phase 2: Data Cleanup (Audit Remediation) 🔜 AFTER
**Timeline:** 1-2 weeks

From my audit's remediation worklist:

1. **Auto-merge safe duplicates:**
   - 9 venue place_id clusters (~20 venues)
   - 14 event natural_key clusters (~30 events)
   - 1 unicode merge (ÜL†RᛟɣᛨɸLE† → Ultraviolet)
   - DELETE 28 zero-event artists
   - DELETE 4 "Cancelled" artists

2. **Manual review:**
   - 113 artist name+region clusters (~250 artists)
   - 155 near-miss clusters (~300 artists)
   - 15 multi-artist lineups (parse into individual artists)

3. **Backfill:**
   - 202 artists missing location (infer from venues)
   - 185 orphaned events (review + delete)
   - All 4,844 events (add naturalKey attribute)

### Phase 3: Data Quality Validation (New Work) 🔜 AFTER
**Timeline:** 2-3 weeks

Implement the 4 validation gates I designed:

1. **Multi-artist lineup detection** → REJECT at API level
2. **"Cancelled" event detection** → REJECT + add event.status field
3. **Unsearchable name validation** → REJECT + suggest alias
4. **Zero-event prevention** → Weekly cleanup job

Plus alias system:
- Add `display_name` and `aliases` fields to artists
- Update search to include aliases
- Backfill known cases

### Phase 4: Re-enable Imports 🔜 FINAL
**Timeline:** After Phase 1-3 complete + verified

1. Set GATE_MODE=enforce in production
2. Backfill sentinels to bndy-unique-keys for existing records
3. Re-enable EventBridge rules (one at a time, monitored)
4. Restore Lambda concurrency
5. Monitor for:
   - New duplicates (should be 0)
   - New "Cancelled" artists (should be 0)
   - New multi-artist lineups (should be 0)
   - Gate bounces (expected, telemetry)

---

## GAPS IDENTIFIED

The review-deploy task does NOT address these issues from my audit:

### Gap 1: Data Quality Validations
**Issue:** Multi-artist lineups, "Cancelled" artists, unsearchable names still possible

**Solution:** Implement the 4 validation gates from [DATA-QUALITY-PREVENTION-STRATEGY.md](file:///C:/Users/jason/Documents/Claude/Projects/bndy/audit/DATA-QUALITY-PREVENTION-STRATEGY.md)

**Priority:** HIGH (prevents new junk data)

**Timeline:** Before re-enabling imports

### Gap 2: Zero-Event Cleanup
**Issue:** 28 artists with no events still in database

**Solution:** Run cleanup script from [cleanup-lists-2026-07-27.json](file:///C:/Users/jason/Documents/Claude/Projects/bndy/audit/cleanup-lists-2026-07-27.json)

**Priority:** LOW (only 1.4% of artists)

**Timeline:** Can wait until Phase 2

### Gap 3: Alias System
**Issue:** No way to handle stylized names like ÜL†RᛟɣᛨɸLE†

**Solution:** Add `display_name` and `aliases` fields to artist schema

**Priority:** MEDIUM (only 2 instances found)

**Timeline:** Phase 3

### Gap 4: Event Status Field
**Issue:** No way to mark events as cancelled/postponed

**Solution:** Add `status` enum to events table

**Priority:** MEDIUM (enables proper cancellation handling)

**Timeline:** Phase 3 (when implementing "Cancelled" validation)

---

## RECOMMENDATIONS

### For Review-Deploy Task (Immediate)

1. ✅ **Proceed as written** - The task scope is correct and doesn't conflict with audit work
2. ⚠️ **Add post-deploy check:** Verify no `UNIQUE-GATE UNAVAILABLE` errors (would indicate env misconfig)
3. ⚠️ **Monitor `WOULD_BOUNCE` logs:** These show what the gate WOULD have blocked (telemetry for Phase 2)
4. ⚠️ **Test find-or-create with known duplicates:** Use examples from my audit (Emily Martine, The Shadders, etc.)

### For Data Quality Validations (After Review-Deploy)

1. ✅ **Implement validation gates** from my DATA-QUALITY-PREVENTION-STRATEGY.md
2. ✅ **Add to same code locations** as uniqueness gates (artists/events/venues handlers)
3. ✅ **Use same pattern:** Reject at API level with clear error messages
4. ✅ **Deploy alongside GATE_MODE=enforce** (when switching from log mode)

### For Data Cleanup (After Validations)

1. ✅ **Run auto-merge scripts** for safe duplicates (9 venue, 14 event, 1 unicode)
2. ✅ **Delete junk data** (28 zero-event, 4 cancelled)
3. ✅ **Manual review** for ambiguous cases (113 artist name+region, 155 near-miss)
4. ✅ **Parse multi-artist lineups** (15 instances, 4-8 hours)

---

## FILES AFFECTED BY BOTH TASKS

### bndy-serverless-api

| File | Audit Work | Review-Deploy | Conflict? |
|------|-----------|---------------|-----------|
| template.yaml | ❌ Not touched | ✅ Modified (new route, table, env vars) | ✅ No conflict |
| artists-lambda/handler.js | ❌ Not touched | ✅ Modified (gated writes) | ✅ No conflict |
| events-lambda/* | ❌ Not touched | ✅ Modified (gated writes, tests) | ✅ No conflict |
| venues-lambda/* | ❌ Not touched | ✅ Modified (gated writes, pagination) | ✅ No conflict |
| shared/identity/* | ❌ Not touched | ✅ NEW (4 files) | ✅ No conflict |

### bndy-MCPServer

| File | Audit Work | Review-Deploy | Conflict? |
|------|-----------|---------------|-----------|
| src/tools/create-artist.ts | ❌ Not touched | ✅ Modified (remove fallback) | ✅ No conflict |
| src/tools/create-venue.ts | ❌ Not touched | ✅ Modified | ✅ No conflict |
| src/tools/create-event.ts | ❌ Not touched | ✅ Modified | ✅ No conflict |
| src/utils/http-client.ts | ❌ Not touched | ✅ Modified | ✅ No conflict |

### florence/bndy-signals

| File | Audit Work | Review-Deploy | Conflict? |
|------|-----------|---------------|-----------|
| infrastructure/cdk/lib/source-runner-stack.ts | ✅ Modified (all enabled=false) | 🔴 Out of scope | ✅ No conflict |

**Verdict:** ✅ **NO FILE CONFLICTS**

My audit only touched:
- CDK source-runner-stack.ts (disabled imports)
- Created new audit files in Documents/Claude/Projects/bndy/audit/

Review-deploy touches:
- Backend API code (bndy-serverless-api)
- MCP server code (bndy-MCPServer)

---

## FINAL VERDICT

### Crossover Summary

✅ **COMPLEMENTARY, NOT CONFLICTING**

The tasks work together:
1. **My audit** diagnosed the problems and stopped the bleeding
2. **Review-deploy** implements the infrastructure fixes
3. **Future work** (data quality validations + cleanup) completes the solution

### Execution Order

```
[DONE] Audit Work
  ├─ Import shutdown ✅
  ├─ Data analysis ✅
  └─ Issue identification ✅
       │
       ↓
[NEXT] Review-Deploy Task
  ├─ Deploy find-or-create route ⏭️
  ├─ Deploy uniqueness gates (log mode) ⏭️
  └─ Remove MCP fallback ⏭️
       │
       ↓
[AFTER] Data Quality Validations
  ├─ Multi-artist lineup detection 🔜
  ├─ "Cancelled" artist detection 🔜
  ├─ Unsearchable name validation 🔜
  └─ Zero-event cleanup job 🔜
       │
       ↓
[AFTER] Data Cleanup & Remediation
  ├─ Auto-merge safe duplicates 🔜
  ├─ Manual review ambiguous cases 🔜
  └─ Backfill missing data 🔜
       │
       ↓
[FINAL] Re-enable Imports
  ├─ Set GATE_MODE=enforce 🔜
  ├─ Backfill sentinels 🔜
  └─ Re-enable EventBridge rules 🔜
```

### No Action Required

✅ The audit work is **complete and compatible** with the review-deploy task.
✅ You can proceed with review-deploy **immediately** without conflicts.
✅ The data quality validations I designed are **additional improvements** to be added later.

---

**Generated by:** Claude Sonnet 4.5 (VSCode Agent)
**Date:** 2026-07-27
**Status:** COMPLETE
