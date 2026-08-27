# BNDY Data Cleanup Progress
**Last Updated:** 2026-07-28 (multi-artist lineup cleanup complete)
**Status:** Phase 2 - Backfill Operations Next

---

## Summary

**Phase 1: Gate Infrastructure** ✅ COMPLETE
- Uniqueness gates deployed (GATE_MODE=log)
- Find-or-create route operational
- Sentinels being written to bndy-unique-keys

**Phase 2: Data Cleanup** 🔄 IN PROGRESS
- ✅ Deleted 28 zero-event artists
- ✅ Merged ÜL†RᛟɣᛨɸLE† → Ultraviolet (5 events)
- ✅ Deleted 381 solo artists + 936 events (kept Danny Brab & Rachel Shenton)
- ✅ Merged 9 venue place_id duplicates (9 venues deleted)
- ✅ Merged 14 event natural_key duplicates (12 events deleted)
- ✅ Deleted 16 multi-artist lineup artists + 16 events

**Phase 3: Validation Gates** ✅ COMPLETE
- ✅ Multi-artist lineup detection deployed
- ✅ Cancelled artist detection deployed
- ✅ Unsearchable name validation deployed

---

## Detailed Progress

### Phase 1: Gate Infrastructure (COMPLETE)

**Deployed:** 2026-07-27 18:35 GMT
**Commits:**
- `230097c` - Gate infrastructure + runtime bump to nodejs24.x
- `2184af5` - Gate implementation (transactWrite, sentinels)
- `c87e158` - MCP server (remove community fallback)

**Verification:**
- ✅ Route exists: `POST /api/artists/find-or-create`
- ✅ Table created: `bndy-unique-keys` (ACTIVE, PAY_PER_REQUEST)
- ✅ Sentinel test: `artist#gatetestband2o26o727#staffs`
- ✅ Find-or-create correctly matches duplicates (Emily Martine test)

**Database State:**
- Artists table: 2,047 → 1,622 (425 deleted)
- Events table: 4,844 → 3,880 (964 deleted)
- Venues table: 1,467 → 1,458 (9 deleted)
- Unique-keys table: 1 sentinel (test)

---

### Phase 2: Data Cleanup (IN PROGRESS)

#### Completed ✅

**1. Zero-Event Artists (28 deleted)**
- Script: `cleanup-scripts/01-delete-zero-event-artists.js`
- Executed: 2026-07-27
- Result: 28/28 deleted, 0 errors
- Impact: Removed junk artist records with no events

**2. Unicode Artist Merge (1 merged)**
- Script: `cleanup-scripts/02-merge-unicode-artist.js`
- Executed: 2026-07-27
- Action: ÜL†RᛟɣᛨɸLE† → Ultraviolet
- Result: 5 events migrated, alias added, bad record deleted

**3. Solo Artists Cleanup (381 deleted)**
- Script: `cleanup-scripts/03-delete-solo-artists.js`
- Executed: 2026-07-27
- Result: 381 artists deleted, 936 events deleted
- Kept: Danny Brab, Rachel Shenton
- Rationale: Focus on bands/groups, reduce backfill processing

**4. Venue Place ID Duplicates (9 merged)**
- Script: `cleanup-scripts/04-auto-merge-venues.js`
- Executed: 2026-07-28
- Result: 9 venue clusters merged, 9 duplicate venues deleted, 0 events migrated
- Strategy: Kept validated/enriched records with external_ids
- Examples: Newcastle-under-Lyme Markets, Stone Cricket Club, The Jug

**5. Event Natural Key Duplicates (14 merged)**
- Script: `cleanup-scripts/05-auto-merge-events.js`
- Executed: 2026-07-28
- Result: 14 event clusters merged, 12 events deleted (1 failed - both already deleted, 1 already deleted)
- Strategy: Kept events with external_ids, community_wizard source, or older creation date
- Examples: Off The Rails @ Nags Head, Stone Cold Sober...Ish @ Swan Inn, Circa 81 @ The Bush At Brown Edge

**6. Multi-Artist Lineup Cleanup (16 deleted)**
- Script: `cleanup-scripts/delete-multi-artist-lineups.js`
- Executed: 2026-07-28
- Result: 16 lineup artists deleted, 16 events deleted (all succeeded)
- Strategy: Delete entirely - gates now prevent creation
- Examples: "Die Ego, Vulgaris, and Bound By Burdens", "Bushtonbury Day 2", "Meat Loaf Vs Elton John"
- Rationale: Validation gates prevent future occurrences, data not worth preserving complexity

#### Remaining (Manual Review Required)

**Artist Duplicates:**
- 113 name+region clusters (~250 artists) - requires manual review
- 155 near-miss clusters (~300 artists) - requires manual review

**Other:**
- 202 artists missing location - backfill from venues
- 185 orphaned events - review + delete
- 3,880 events need naturalKey attribute

---

### Phase 3: Validation Gates (COMPLETE)

**Deployed:** 2026-07-27 20:55 GMT
**Commit:** `aca31f5`

**Validation Module:** `artists-lambda/lib/data-quality.js`

**Gates Deployed:**

1. **Multi-Artist Lineup Detection** ✅
   - Pattern: `+`, `and`, `,`, `vs`, `featuring`, `support from`, etc.
   - Test: "Rock Doctors + 2 more" → 400 REJECTED
   - Error: `multi_artist_lineup_detected`

2. **Cancelled Artist Detection** ✅
   - Pattern: `cancelled`, `canceled`, `tbc`, `tba`
   - Test: "Cancelled" → 400 REJECTED
   - Error: `cancelled_event_detected`

3. **Unsearchable Name Validation** ✅
   - Rule: >30% non-ASCII characters or all symbols
   - Test: "ÜL†RᛟɣᛨɸLE†" → 400 REJECTED
   - Error: `unsearchable_name`

**Impact:**
- Prevents 15 multi-artist lineups per audit findings
- Prevents 4 cancelled artists per audit findings
- Prevents 2 unsearchable names per audit findings
- All 3 validation gates tested and working in production

---

## Current Database State

**Artists:** 1,622 (was 2,047)
- Deleted: 28 zero-event + 1 unicode + 381 solo + 16 lineups = 426 total
- Remaining: Bands, groups, Danny Brab, Rachel Shenton

**Events:** 3,880 (was 4,844)
- Deleted: 936 solo artist events + 12 natural_key duplicates + 16 lineup events = 964 total
- Remaining: Band/group events, deduplicated

**Venues:** 1,458 (was 1,467)
- Deleted: 9 place_id duplicates
- Remaining: Deduplicated venues

**Unique Keys:** 1 (test sentinel)

**Known Duplicates Still Present:**
- Emily Martine: 2 artists
- The Shadders: 2 artists
- Peludo Beach / Puludo: 2 artists

---

## Next Steps

### Immediate (This Week)

**1. Backfill Event Natural Keys**
- Add `naturalKey` attribute to all 3,880 events
- Required for future event deduplication and gate enforcement
- Script: Create `06-backfill-event-natural-keys.js`
- Status: Ready to create

**2. Artist Location Backfill**
- Infer location for 202 artists from their venue history
- Improves gate resolvability (identity keys need region)
- Script: Create `07-backfill-artist-locations.js`
- Status: Ready to create

### Phase 4: Sentinel Backfill (1 Week)

**1. Create Backfill Script**
- Generate sentinels for all existing artists, venues, events
- Run in batches (100 at a time)
- Monitor for collision warnings

**2. Collision Analysis**
- Review any WOULD_BOUNCE entries from backfill
- Identify remaining duplicates
- Merge before enforcement

**3. Enable Enforcement Mode**
- Set `GATE_MODE=enforce` in template.yaml
- Redeploy
- Monitor for gate bounces (expected telemetry)

### Phase 5: Manual Duplicate Review (2 Weeks)

**1. Artist Name+Region Clusters (113 clusters)**
- Review each cluster manually
- Merge obvious duplicates
- Mark ambiguous cases for user decision

**2. Artist Near-Miss Clusters (155 clusters)**
- Review typos, variations
- Merge where appropriate
- Use alias system for variants

### Phase 6: Re-Enable Imports (After All Cleanup)

**1. EventBridge Rules**
- Re-enable one at a time
- Monitor for duplicates (should be 0)
- Monitor for validation rejections

**2. Lambda Concurrency**
- Restore concurrency limits
- Monitor performance

**3. Ongoing Monitoring**
- WOULD_BOUNCE logs (telemetry)
- Validation rejection counts
- Sentinel growth rate
- Data quality metrics

---

## Scripts Created

All scripts in: `C:\Users\jason\Documents\Claude\Projects\bndy\audit\cleanup-scripts\`

| Script | Status | Action | Result |
|--------|--------|--------|--------|
| `01-delete-zero-event-artists.js` | ✅ EXECUTED | Delete 28 zero-event artists | 28 deleted, 0 errors |
| `02-merge-unicode-artist.js` | ✅ EXECUTED | Merge ÜL†RᛟɣᛨɸLE† → Ultraviolet | 5 events migrated |
| `03-delete-solo-artists.js` | ✅ EXECUTED | Delete 381 solo artists | 936 events deleted |
| `04-auto-merge-venues.js` | ✅ EXECUTED | Merge 9 venue place_id duplicates | 9 venues deleted, 0 events migrated |
| `05-auto-merge-events.js` | ✅ EXECUTED | Merge 14 event natural_key duplicates | 12 events deleted, 1 failed, 1 already deleted |
| `delete-multi-artist-lineups.js` | ✅ EXECUTED | Delete 16 multi-artist lineup artists | 16 artists + 16 events deleted |
| `06-backfill-event-natural-keys.js` | 📝 TODO | Add naturalKey to 3,880 events | Required for dedup |
| `07-backfill-artist-locations.js` | 📝 TODO | Infer location for 202 artists | From venue history |
| `08-backfill-sentinels.js` | 📝 TODO | Backfill sentinels for all records | Phase 4 |

---

## Rollback Plan

If issues arise with any cleanup:

**1. Zero-Event Artists:** Cannot rollback (no data loss)

**2. Unicode Merge:**
- Could recreate bad artist, but events already migrated
- Keep as-is, alias system handles it

**3. Solo Artists:**
- Cannot rollback (936 events deleted)
- Keep Danny Brab & Rachel Shenton as examples
- Future solo artists will be added via new system

**4. Validation Gates:**
- Soft disable: Remove validation calls from handler
- Full rollback: `git revert aca31f5` and redeploy

**5. Uniqueness Gates:**
- Soft rollback: Set `GATE_MODE=off` and redeploy
- Full rollback: `git revert 230097c 2184af5` and redeploy
- Table: `bndy-unique-keys` is harmless if orphaned (Retain policy)

---

## Testing & Verification

**Gate Tests:**
```bash
# Multi-artist lineup
curl -X POST https://qry0k6pmd0.execute-api.eu-west-2.amazonaws.com/api/artists/find-or-create \
  -H "Content-Type: application/json" \
  -d '{"name":"Rock Doctors + 2 more","location":"Manchester","canCreate":true}'
# Expected: 400 with multi_artist_lineup_detected

# Cancelled artist
curl -X POST https://qry0k6pmd0.execute-api.eu-west-2.amazonaws.com/api/artists/find-or-create \
  -H "Content-Type: application/json" \
  -d '{"name":"Cancelled","location":"Manchester","canCreate":true}'
# Expected: 400 with cancelled_event_detected

# Unsearchable name
curl -X POST https://qry0k6pmd0.execute-api.eu-west-2.amazonaws.com/api/artists/find-or-create \
  -H "Content-Type: application/json" \
  -d '{"name":"ÜL†RᛟɣᛨɸLE†","location":"Manchester","canCreate":true}'
# Expected: 400 with unsearchable_name
```

**Duplicate Detection:**
```bash
# Emily Martine (known duplicate)
curl -X POST https://qry0k6pmd0.execute-api.eu-west-2.amazonaws.com/api/artists/find-or-create \
  -H "Content-Type: application/json" \
  -d '{"name":"Emily Martine","location":"Hampshire","canCreate":false}'
# Expected: action="review" with 2 candidates
```

---

## Files & Documentation

**Audit Reports:**
- `audit/FINAL-AUDIT-REPORT-2026-07-27.md` - Main audit findings
- `audit/SUPPLEMENTARY-DATA-QUALITY-FINDINGS.md` - Additional issues
- `audit/DATA-QUALITY-PREVENTION-STRATEGY.md` - Prevention design
- `audit/CROSSOVER-ANALYSIS.md` - Task overlap analysis
- `audit/cleanup-lists-2026-07-27.json` - IDs to delete/merge
- `audit/data-quality-issues-2026-07-27.json` - All 4 issue types

**Backups:**
- `audit/backups-2026-07-27/artists-backup.json` (2,047 records)
- `audit/backups-2026-07-27/venues-backup.json` (1,467 records)
- `audit/backups-2026-07-27/events-backup.json` (4,844 records)

**Progress Tracking:**
- `audit/CLEANUP-PROGRESS.md` (this file)

---

**Generated by:** Claude Sonnet 4.5
**Session:** 2026-07-27
**Next Review:** After auto-merge scripts complete
