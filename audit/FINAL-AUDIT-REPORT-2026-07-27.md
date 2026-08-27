# bndy Deep Data Audit - FINAL REPORT
**Date:** 2026-07-27
**Auditor:** Claude Sonnet 4.5 (VSCode Agent)
**Scope:** Complete READ-ONLY analysis of production DynamoDB tables
**Region:** eu-west-2

---

## EXECUTIVE SUMMARY

**ALL cloud-side imports have been STOPPED.** The database contains significant duplicate pollution across artists, venues, and events. Orphan count has nearly doubled since the 07-09 audit (97 → 185). Root cause confirmed: **missing `POST /api/artists/find-or-create` route** forces both MCP and signals to fall back to the no-dedup `POST /api/artists/community` endpoint.

### Critical Numbers (vs 07-09 baseline)
| Metric | 07-09 Baseline | 07-27 Current | Change |
|--------|----------------|---------------|--------|
| Total Artists | ~1,700 | 2,047 | +347 |
| Total Venues | ~1,400 | 1,467 | +67 |
| Total Events | ~4,500 | 4,844 | +344 |
| Orphaned Events | 97 | 185 | **+88 (+91%)** |
| Artists (empty/UK location) | 331 | 202 | -129 (improved) |

---

## PART A: IMPORT SHUTDOWN ✓ COMPLETE

### Actions Taken
1. **EventBridge Rules Disabled (5 total):**
   - `bndy-klma-schedule-prod` (was ENABLED)
   - `bndy-onthecase-schedule-prod` (was ENABLED)
   - `bndy-gigs-news-schedule-prod` (was ENABLED)
   - `bndy-sceniceye-schedule-prod` (was ENABLED)
   - `bndy-intelligence-pass-s3-trigger-prod` (was ENABLED, S3-triggered, NOT cron)

2. **Lambda Concurrency Set to 0 (belt-and-braces):**
   - All 5 runner functions throttled to prevent manual invocations

3. **CDK Code Updated & Committed:**
   - File: `C:\VSProjects\florence\bndy-signals\infrastructure\cdk\lib\source-runner-stack.ts`
   - All rules changed from `enabled: stage === 'prod'` to `enabled: false`
   - Commit: `fix: disable all source runner schedules to prevent duplicate imports` (b5167dd)
   - **Next `cdk deploy` will NOT re-enable them**

4. **API Gateway Drift Confirmed:**
   - **MISSING ROUTE:** `POST /api/artists/find-or-create`
   - **EXISTS:** `POST /api/venues/find-or-create`
   - **Root Cause:** MCP and signals fall back to `POST /api/artists/community` (no deduplication)

---

## PART B: DEEP DATA AUDIT

### B0. Backups ✓
All tables backed up with full pagination:
- `backup-artists-2026-07-27.json` (2,047 items)
- `backup-venues-2026-07-27.json` (1,467 items)
- `backup-events-2026-07-27.json` (4,844 items)
- `backup-memberships-2026-07-27.json` (19 items)

### B1. Duplicate Detection

#### Artists (113 name+region clusters, 155 near-miss clusters)
- **Name+region duplicates:** 113 clusters
  - Same normalized name + same region OR either UNKNOWN → duplicate
  - Example: `normalise("The Band") + "#STAFFS"` → multiple artists
- **Facebook duplicates:** 0 clusters (good!)
- **Near-miss duplicates (edit distance ≤2):** 155 clusters
  - Examples: Damiain/Damien, Pheonix/Phoenix, Star Breaker/Starbreaker

**Known Live Duplicates Check (2026-07-12 sceniceye incident):**
- ✓ Emily Martine: 2 artists found
- ✓ Peludo Beach / Puludo: 2 artists found
- ✓ The Shadders: 2 artists found
- ✓ Golden Lion (Havant): 2 venues found

All known duplicates correctly identified by matcher.

#### Venues (9 place_id clusters, 80 name clusters)
- **Place ID duplicates:** 9 clusters (hard duplicates - same google_place_id)
- **Name duplicates:** 80 clusters (same normalized name)
- **Coordinate duplicates:** 7 clusters (<100m proximity with name similarity)
- **Missing place ID:** 1 venue
- **Missing coordinates:** 0 venues (excellent!)

#### Events (14 natural_key clusters, 2 cascade clusters)
- **Natural key duplicates:** 14 clusters (same venue + artist + date)
- **Cascade duplicates:** 2 clusters (same gig on different venue records)
- **External ID duplicates:** 1 cluster (same {source, id} on multiple events)

### B2. Orphan Analysis

**Current State (2026-07-27):**
- Orphaned events: **185**
- Orphaned artist references: 1
- Orphaned venue references: 3

**Comparison with 07-09 Audit:**
- Previous orphan count: **97**
- New orphans created: **+88 events**
- **Orphan growth rate: +91% in 18 days**

**Interpretation:** Significant pollution from automated importers creating events that reference deleted or non-existent artist/venue records.

### B3. Junk Data

- **Junk artists:** 4 (tbc/Cancelled/Elvis-with-no-events)
- **Test events:** 1 (Integration Test Event, date 2099-12-31)
- **Zero-event artists created after 2026-07-09:** 38 (pure pollution)

### B4. Provenance & Pollution Timeline

#### Artists by Source (2,047 total)
| Source | Count |
|--------|-------|
| mcp_ai_import | 1,505 |
| frontstage | 530 |
| agentic_ingest | 5 |
| backstage | 6 |
| integration_api | 1 |

#### Events by Source (4,844 total)
| Source | Count | % |
|--------|-------|---|
| mcp_ai_import | 4,006 | 82.7% |
| klma-stoke-gig-list | 257 | 5.3% |
| unknown | 182 | 3.8% |
| sceniceye-daily-import | 127 | 2.6% |
| backstage_wizard | 105 | 2.2% |
| onthecase-daily-import | 84 | 1.7% |
| community_wizard | 57 | 1.2% |
| gigs-news-daily-import | 22 | 0.5% |
| community | 3 | <0.1% |
| integration_api | 1 | <0.1% |

**Key Finding:** 82.7% of events created by `mcp_ai_import` - this is the primary source of pollution due to missing find-or-create route.

#### Pollution Curve (Artist created_at by week)
Notable spikes:
- **2026-W18:** 331 artists (HUGE spike - likely sceniceye)
- **2026-W27:** 292 artists
- **2026-W21:** 251 artists
- **2026-W24:** 163 artists
- **2026-W20:** 168 artists
- **2026-W28:** 125 artists
- **2026-W30:** 128 artists

**Interpretation:** Consistent pollution throughout May-July 2026, with massive spike in Week 18 (late April/early May).

### B5. Gate-Readiness Metrics

#### Artist Location Backfill
- **Empty/UK-only location:** 202 artists (vs 331 on 07-09 - **improvement!**)
- **Inferable from venue geography:** 0 (venue `region` field not well-populated)
- **Action Required:** Need to backfill artist locations from venue geography

#### Venue Place ID Coverage
- **Missing place_id:** 1 venue (excellent coverage!)
- **Clean place IDs (appears once):** 1,448
- **Duplicate place IDs (appears >1):** 9 ← **These are hard duplicates**

#### Event Natural Key Backfill
- **Events with stored `naturalKey` attribute:** 0 / 4,844
- **Action Required:** Backfill all events with computed natural_key for future deduplication

#### Field Name Drift
**Venue:**
- `google_place_id`: 1,442 venues
- `googlePlaceId`: 28 venues
- **Action:** Normalize to `google_place_id` (snake_case)

**Artist Name Indexes:**
- `name_lower`: 2,047 / 2,047 (100% coverage ✓)
- `name_prefix`: 2,047 / 2,047 (100% coverage ✓)

---

## REMEDIATION WORKLIST (Prioritized)

### Phase 1: IMMEDIATE (Infrastructure Fixes)
1. **Deploy `POST /api/artists/find-or-create` route** to API Gateway
   - Use same deduplication logic as venues route
   - Use identity_key = `normalise(name) + '#' + region_bucket`
2. **Backfill `naturalKey` on all events**
   - Compute: `sha1(venueId + '|' + artistId + '|' + date)`
   - Write to event records for future gate enforcement

### Phase 2: CLEANUP (Auto-Merge)
**Safe auto-merge candidates (keeper = most events → oldest → best enriched):**

1. **Venue duplicates (9 place_id clusters)**
   - Same google_place_id = same physical venue
   - Merge all events to keeper, delete dupes
   - Blast radius: ~20 venues

2. **Artist duplicates - High Confidence (Facebook match)**
   - 0 clusters (none found - skip)

3. **Event duplicates - Natural Key (14 clusters)**
   - Same venue + artist + date = same gig
   - Delete duplicates, keep oldest
   - Blast radius: ~30 events

### Phase 3: STAGED (Manual Review)
**Ambiguous cases requiring human review:**

1. **Artist duplicates - Name+Region (113 clusters)**
   - Same name + same region OR UNKNOWN region
   - **Requires manual review** to distinguish:
     - Same artist (merge)
     - Different artists with same name in same area (keep both)
   - **Blast radius:** ~250 artists

2. **Artist duplicates - Near-Miss (155 clusters)**
   - Edit distance ≤2 (typos, spelling variations)
   - Examples: "Star Breaker" / "Starbreaker"
   - **Manual review required** - could be legitimate distinct artists
   - **Blast radius:** ~300 artists

3. **Event cascade duplicates (2 clusters)**
   - Same gig on different venue records
   - **Root cause:** Venue duplication
   - Fix after venue merge

### Phase 4: BACKFILL
1. **Artist location inference** (202 artists)
   - Join events → venues → city/region
   - Majority vote per artist
   - Update artist.location

2. **Orphan cleanup** (185 events)
   - Compare with 07-09 orphan list (97 events)
   - **88 NEW orphans** since 07-09
   - Investigate if artist/venue was deleted or never existed
   - Delete orphan events after review

3. **Junk cleanup**
   - 4 junk artists (tbc/Cancelled/Elvis-no-events)
   - 1 test event (2099-12-31)
   - 38 zero-event artists created since 07-09

---

## DELIVERABLES

### Machine-Readable Reports
1. `deep-audit-2026-07-27.json` - Full duplicate clusters with member IDs
2. `enhanced-analysis-2026-07-27.json` - Junk, provenance, gate-readiness

### Human-Readable Reports
1. `deep-audit-2026-07-27-summary.md` - Headline counts
2. `FINAL-AUDIT-REPORT-2026-07-27.md` - **This file**

### Backups
1. `backup-artists-2026-07-27.json` (2,047 items)
2. `backup-venues-2026-07-27.json` (1,467 items)
3. `backup-events-2026-07-27.json` (4,844 items)
4. `backup-memberships-2026-07-27.json` (19 items)

---

## VERIFICATION

### Known Live Duplicates (2026-07-12 Sceniceye Incident)
All 4 known duplicates correctly identified:
- ✓ Emily Martine: 2 artists
- ✓ Peludo Beach / Puludo: 2 artists
- ✓ The Shadders: 2 artists
- ✓ Golden Lion (Havant): 2 venues

**Matcher is working correctly.**

### Sanity Checks
- ✓ Full pagination used on all table scans (never trusted single-page scan)
- ✓ Identity keys computed exactly as specified in prompt
- ✓ Normalization includes leet-folding (3→e, 0→o, 1→i, 5→s)
- ✓ UNKNOWN regions never match each other (as specified)
- ✓ MCP events identified by `source:'mcp_ai_import'` (no ai_created flag)

### Items Not Verified
- N/A - All requested analyses completed

---

## ROOT CAUSE ANALYSIS

### Primary Cause: Missing API Route
**Finding:** `POST /api/artists/find-or-create` does NOT exist in deployed API Gateway.

**Evidence:**
```bash
aws apigatewayv2 get-routes --api-id qry0k6pmd0 --region eu-west-2
```
Returns:
- ✓ `POST /api/venues/find-or-create` EXISTS
- ✗ `POST /api/artists/find-or-create` MISSING

**Impact:**
- MCP and signals fall back to `POST /api/artists/community` (no deduplication)
- 82.7% of events (4,006) created by `mcp_ai_import`
- Artist duplicates grow uncontrolled
- Cascades into event duplicates (same gig, different artist records)

### Secondary Cause: No Backend Uniqueness Gates
**Finding:** No natural_key enforcement on events table.

**Evidence:**
- 0 / 4,844 events have stored `naturalKey` attribute
- No unique constraint on (venue + artist + date)

**Impact:**
- Same gig can be imported multiple times
- 14 natural_key duplicate clusters found

### Tertiary Cause: Venue Duplication
**Finding:** 9 place_id duplicate clusters.

**Evidence:**
- 9 groups where same google_place_id appears on multiple venue records
- Causes cascade event duplication (same gig on different venue records)

**Impact:**
- 2 cascade duplicate clusters
- Pollution multiplier: venue dupes → event dupes

---

## NEXT STEPS (Post-Audit)

1. **Review this report** with Jason
2. **Approve remediation plan** (Phases 1-4)
3. **Deploy find-or-create route** (Phase 1, item 1)
4. **Backfill natural keys** (Phase 1, item 2)
5. **Begin auto-merge** (Phase 2)
6. **Stage manual review** (Phase 3)
7. **Execute backfill** (Phase 4)
8. **Re-enable imports** (after gates are proven)

---

## AUDIT CONCLUSION

**Status:** ✓ COMPLETE
**Duration:** ~2 hours
**Data Quality:** POOR (extensive duplication, orphans growing)
**Immediate Risk:** MITIGATED (all imports stopped)
**Long-term Fix:** IDENTIFIED (missing API route + no backend gates)

**Recommendation:** Proceed with Phase 1 (infrastructure fixes) immediately. Do NOT re-enable imports until `POST /api/artists/find-or-create` is deployed and proven working.

---

**Generated by:** Claude Sonnet 4.5 (VSCode Agent)
**Script:** `deep-audit.ts` + `enhanced-analysis.ts`
**Region:** eu-west-2
**Date:** 2026-07-27
