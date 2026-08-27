# Supplementary Data Quality Findings
**Date:** 2026-07-27
**Supplement to:** FINAL-AUDIT-REPORT-2026-07-27.md

---

## ADDITIONAL ISSUES FOUND

### Issue 1: Multi-Artist Lineups (15 found) ⚠️

**Problem:** Event lineups imported as single artist records instead of being split into individual artists.

**Severity:** HIGH - Makes individual artists unsearchable

**Examples:**
1. `A Thousand Cuts + Anti-Meta + Tba` ([a08a9bc0](https://gigmap.bndy.co.uk/artists/a08a9bc0-1397-46b4-a23a-1ec76a9bc322))
2. `Anti-Meta, Chin, Fractured Mind + Cure For The Enemy` ([732e0bd2](https://gigmap.bndy.co.uk/artists/732e0bd2-27ed-4f7b-b3bd-f3e4f752d8ca))
3. `Wolves in Alcatraz + Anti-Meta + Cure for the Enemy` ([6e329829](https://gigmap.bndy.co.uk/artists/6e329829-06b9-4df6-aba9-741e351485ac))
4. `Seamus Fogarty + Crowspeak + Morning's Thief` ([c8640d38](https://gigmap.bndy.co.uk/artists/c8640d38-3873-43e5-ac5c-577d3446a36c))

**All 15 instances:** See [`data-quality-issues-2026-07-27.json`](file:///C:/Users/jason/Documents/Claude/Projects/bndy/audit/data-quality-issues-2026-07-27.json)

**Impact:**
- Users can't search for "Anti-Meta" directly
- Individual artists don't get proper event counts
- SEO penalty (event not indexed under individual artist names)
- Historical data loss if lineup artist gets merged

**Root Cause:** Source scrapers extract full lineup text as artist name, no parsing logic.

**Prevention Strategy:** REJECT at API level with validation pattern (see [DATA-QUALITY-PREVENTION-STRATEGY.md](file:///C:/Users/jason/Documents/Claude/Projects/bndy/audit/DATA-QUALITY-PREVENTION-STRATEGY.md))

---

### Issue 2: "Cancelled" as Artist Names (4 found) 🚫

**Problem:** Event cancellations imported as new artists named "Cancelled".

**Severity:** HIGH - Zero intelligence, creates junk data

**All 4 instances:**
1. [47024cb9-c5fc-43fa-8677-2ba93f604516](https://gigmap.bndy.co.uk/artists/47024cb9-c5fc-43fa-8677-2ba93f604516)
2. [414befd4-ec69-46db-ab71-83269eaf8da5](https://gigmap.bndy.co.uk/artists/414befd4-ec69-46db-ab71-83269eaf8da5)
3. [4de44055-e4e1-4175-8571-beac5f8ecfb9](https://gigmap.bndy.co.uk/artists/4de44055-e4e1-4175-8571-beac5f8ecfb9)
4. [5efbbe8c-49e9-438d-a68b-2532a45dfb40](https://gigmap.bndy.co.uk/artists/5efbbe8c-49e9-438d-a68b-2532a45dfb40)

**Impact:**
- Junk artist records
- No way to track actual cancellations
- Cancelled events appear as active gigs
- False positive in "artists near you" results

**Root Cause:** Source scrapers don't detect cancellation signals, create artist for any text in artist field.

**Prevention Strategy:**
1. REJECT "Cancelled", "TBC", etc. at artist creation
2. Add `status` field to events (confirmed/cancelled/postponed/tbc)
3. Update scrapers to detect cancellation signals and set event status

---

### Issue 3: Unsearchable Names (2 found) 🔍

**Problem:** Unicode/special character artist names that users can't type in search.

**Severity:** MEDIUM - Creates duplicates and poor UX

**Examples:**
1. **BAD:** `ÜL†RᛟɣᛨɸLE†` ([87f59213](https://gigmap.bndy.co.uk/artists/87f59213-c6fc-42de-a720-657bf443c539))
   - **GOOD:** `Ultraviolet` ([30c4ade9](https://gigmap.bndy.co.uk/artists/30c4ade9-64f3-4ed2-a792-17cb157b4288))
   - **Action:** MERGE bad → good, add stylized name to `aliases`

2. **Borderline:** `F.A.B.` ([e02c3acc](https://gigmap.bndy.co.uk/artists/e02c3acc-8730-46db-bb5b-e31635e5b24a))
   - 50% non-ASCII (periods)
   - **Action:** Keep (searchable), but monitor

**Impact:**
- Users can't find the artist
- Duplicate records for same band
- Poor SEO (search engines can't index)
- Social media share links break

**Root Cause:** Source scrapers preserve exact styling from venue websites (often logo-ified band names).

**Prevention Strategy:**
1. REJECT names with >30% non-ASCII characters
2. Add `display_name` (stylized) and `name` (searchable) fields
3. Add `aliases` array for alternative spellings
4. Search on `name` + `aliases`, display `display_name`

**Alias System Design:**
```typescript
interface Artist {
  id: string;
  name: string;           // "Ultraviolet" (searchable)
  display_name?: string;  // "ÜL†RᛟɣᛨɸLE†" (optional stylization)
  aliases?: string[];     // ["UV", "Ultra Violet"]
  // ...
}
```

---

### Issue 4: Zero-Event Artists (28 found) 📊

**Problem:** Artists created but never had an event listed in bndy.

**Severity:** LOW - Database bloat, but only 1.4%

**Stats:**
- Count: 28 / 2,047 (1.4%)
- Source: 100% `mcp_ai_import`
- Created: All in July 2026

**Impact:**
- Database bloat
- False positives in artist search
- Confusion (why does this artist have 0 events?)

**Root Cause:** MCP creates artist record before event, event creation fails, artist orphaned.

**Prevention Strategy:**
1. Transaction-based creation (artist + event atomic)
2. Weekly cleanup job: Delete artists with 0 events >30 days old
3. **Immediate action:** DELETE all 28 zero-event artists

**Cleanup Script:** [`cleanup-lists-2026-07-27.json`](file:///C:/Users/jason/Documents/Claude/Projects/bndy/audit/cleanup-lists-2026-07-27.json)

---

## REMEDIATION SUMMARY

### Immediate Deletions (Safe, no data loss)

**28 Zero-Event Artists:**
```json
{
  "action": "DELETE",
  "table": "bndy-artists",
  "ids": [...28 IDs from cleanup-lists-2026-07-27.json],
  "reason": "Zero events, created in July 2026, all mcp_ai_import",
  "data_loss": "NONE - no events reference these artists"
}
```

**4 "Cancelled" Artists:**
```json
{
  "action": "DELETE (after event review)",
  "table": "bndy-artists",
  "ids": [
    "47024cb9-c5fc-43fa-8677-2ba93f604516",
    "414befd4-ec69-46db-ab71-83269eaf8da5",
    "4de44055-e4e1-4175-8571-beac5f8ecfb9",
    "5efbbe8c-49e9-438d-a68b-2532a45dfb40"
  ],
  "reason": "Cancelled event indicators, not real artists",
  "prerequisite": "Review events, mark as cancelled before deleting artist"
}
```

### Manual Review Required

**1 Unicode Merge:**
```json
{
  "action": "MERGE",
  "deleteId": "87f59213-c6fc-42de-a720-657bf443c539",
  "keepId": "30c4ade9-64f3-4ed2-a792-17cb157b4288",
  "deleteName": "ÜL†RᛟɣᛨɸLE†",
  "keepName": "Ultraviolet",
  "steps": [
    "1. UPDATE events SET artistId='30c4ade9' WHERE artistId='87f59213'",
    "2. UPDATE artists SET aliases=['ÜL†RᛟɣᛨɸLE†'] WHERE id='30c4ade9'",
    "3. DELETE FROM artists WHERE id='87f59213'"
  ]
}
```

**15 Multi-Artist Lineups:**
- **Action:** Parse each into individual artists, create proper records, update events
- **Time estimate:** 15-30 minutes each = 4-8 hours total
- **Priority:** MEDIUM (doesn't break anything, but poor UX)

---

## UPDATED REMEDIATION WORKLIST

### Phase 1: IMMEDIATE (Infrastructure + Validation)
1. Deploy `POST /api/artists/find-or-create` route
2. Backfill `naturalKey` on all 4,844 events
3. **NEW:** Add multi-artist lineup validation
4. **NEW:** Add "Cancelled" detection validation
5. **NEW:** Add unsearchable name validation

### Phase 2: AUTO-MERGE + CLEANUP
1. Merge 9 venue place_id duplicate clusters (~20 venues)
2. Delete 14 event natural_key duplicate clusters (~30 events)
3. **NEW:** DELETE 28 zero-event artists (automated, safe)
4. **NEW:** Review + DELETE 4 "Cancelled" artists (after marking events)
5. **NEW:** MERGE ÜL†RᛟɣᛨɸLE† → Ultraviolet (automated)

### Phase 3: STAGED (Manual Review)
1. Review 113 artist name+region clusters (~250 artists)
2. Review 155 near-miss clusters (~300 artists)
3. **NEW:** Parse 15 multi-artist lineups into individual artists (4-8 hours)

### Phase 4: BACKFILL + ALIAS SYSTEM
1. Infer location for 202 artists from venue geography
2. Clean up 185 orphaned events
3. Delete junk: 4 junk artists, 1 test event
4. **NEW:** Implement alias system (`display_name`, `aliases` fields)
5. **NEW:** Weekly cleanup job for zero-event artists

---

## PREVENTION EFFECTIVENESS

| Issue | Current Count | Prevention Method | Expected Reduction |
|-------|---------------|-------------------|-------------------|
| Multi-artist lineups | 15 | API validation + REJECT | 100% |
| "Cancelled" artists | 4 | API validation + event status | 100% |
| Unsearchable names | 2 | API validation + alias system | 95% |
| Zero-event artists | 28 | Transaction + weekly cleanup | 90% |

---

## DESIGN DECISION REQUIRED

### Multi-Artist Lineup Handling

**QUESTION:** How should we handle multi-artist lineups?

**Option A: REJECT and require manual split** ⭐ RECOMMENDED
```typescript
// At API level
if (isMultiArtistLineup(artistName)) {
  throw new Error('multi_artist_lineup_detected: Please split into individual artists');
}
```
- ✅ Simple, clear
- ✅ Forces correct data entry
- ❌ More work for importers

**Option B: Auto-parse into collaboratingArtistIds**
```typescript
// At API level
if (isMultiArtistLineup(artistName)) {
  const artists = parseLineup(artistName); // ["A", "B", "C"]
  const artistIds = await Promise.all(artists.map(findOrCreateArtist));
  event.artistId = artistIds[0];
  event.collaboratingArtistIds = artistIds.slice(1);
}
```
- ✅ Fully automated
- ❌ Risk of parsing errors (e.g., "Rock Doctors + 2 more" → who are the "2 more"?)
- ❌ Complex logic

**Option C: Create lineup as entity + link individual artists**
```typescript
// Create "lineup" artist with flag
const lineup = await createArtist({
  name: "A + B + C",
  is_lineup: true,
  member_artist_ids: [idA, idB, idC],
});
```
- ✅ Preserves lineup as discoverable entity
- ✅ Individual artists also get credit
- ❌ Complex schema changes
- ❌ What if lineup is one-time vs recurring?

**RECOMMENDATION:** Start with **Option A** (REJECT), collect real-world examples, evaluate auto-parse in 3 months.

### Alias System Design

**QUESTION:** Should we implement the alias system?

**YES - Recommended approach:**
```typescript
interface Artist {
  name: string;           // Searchable canonical name (required)
  display_name?: string;  // Stylized display name (optional)
  aliases?: string[];     // Alternative names (optional)
}
```

**Benefits:**
- Handles edge cases (ÜL†RᛟɣᛨɸLE† → Ultraviolet)
- Supports name changes (band rebrands)
- Supports typo tolerance ("Pheonix" → "Phoenix")
- SEO boost (indexed under all variations)

**Implementation:**
1. Add fields to schema (Phase 4)
2. Backfill known cases (1 unicode, ~30 typo duplicates)
3. Update search to query `name` + `aliases`
4. Display `display_name` ?? `name` in UI

---

## FILES GENERATED

All files in [`C:\Users\jason\Documents\Claude\Projects\bndy\audit\`](file:///C:/Users/jason/Documents/Claude/Projects/bndy/audit/):

**New Reports:**
- [`data-quality-issues-2026-07-27.json`](file:///C:/Users/jason/Documents/Claude/Projects/bndy/audit/data-quality-issues-2026-07-27.json) - All 4 issue types with URLs
- [`cleanup-lists-2026-07-27.json`](file:///C:/Users/jason/Documents/Claude/Projects/bndy/audit/cleanup-lists-2026-07-27.json) - IDs to delete/merge
- [`DATA-QUALITY-PREVENTION-STRATEGY.md`](file:///C:/Users/jason/Documents/Claude/Projects/bndy/audit/DATA-QUALITY-PREVENTION-STRATEGY.md) - Full prevention design

**Scripts:**
- [`data-quality-audit.ts`](file:///C:/Users/jason/Documents/Claude/Projects/bndy/audit/data-quality-audit.ts) - Detection script (reusable)

---

## NEXT STEPS

1. ✅ Review supplementary findings
2. ❓ **DECISION:** Approve multi-artist lineup handling (Option A/B/C)
3. ❓ **DECISION:** Approve alias system implementation
4. ✅ Implement Phase 1 validations
5. ✅ Delete 28 zero-event artists (safe, automated)
6. ✅ Review + handle 4 "Cancelled" artists
7. ✅ Merge ÜL†RᛟɣᛨɸLE† → Ultraviolet
8. ⏸️ Manual parsing of 15 multi-artist lineups (Phase 3)

---

**Generated by:** Claude Sonnet 4.5 (VSCode Agent)
**Date:** 2026-07-27
**Status:** COMPLETE - Awaiting design decisions
