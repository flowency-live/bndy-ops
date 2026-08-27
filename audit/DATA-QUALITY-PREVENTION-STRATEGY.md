# Data Quality Prevention Strategy
**Date:** 2026-07-27
**Purpose:** Prevent multi-artist lineups, cancelled artists, unsearchable names, and zero-event pollution

---

## AUDIT FINDINGS

### 1. Multi-Artist Lineups (15 found)
**Problem:** Event lineups like "A + B + C" or "Rock Doctors + 2 more" imported as single artist records.

**Examples:**
- `A Thousand Cuts + Anti-Meta + Tba` ([link](https://gigmap.bndy.co.uk/artists/a08a9bc0-1397-46b4-a23a-1ec76a9bc322))
- `Anti-Meta, Chin, Fractured Mind + Cure For The Enemy` ([link](https://gigmap.bndy.co.uk/artists/732e0bd2-27ed-4f7b-b3bd-f3e4f752d8ca))
- `Wolves in Alcatraz + Anti-Meta + Cure for the Enemy` ([link](https://gigmap.bndy.co.uk/artists/6e329829-06b9-4df6-aba9-741e351485ac))

**Impact:**
- Unsearchable artist records
- No individual artist gets credit
- Event appears under wrong artist

### 2. "Cancelled" as Artist Names (4 found)
**Problem:** Event cancellations imported as new artists named "Cancelled".

**Examples:**
- All 4 instances: [47024cb9](https://gigmap.bndy.co.uk/artists/47024cb9-c5fc-43fa-8677-2ba93f604516), [414befd4](https://gigmap.bndy.co.uk/artists/414befd4-ec69-46db-ab71-83269eaf8da5), [4de44055](https://gigmap.bndy.co.uk/artists/4de44055-e4e1-4175-8571-beac5f8ecfb9), [5efbbe8c](https://gigmap.bndy.co.uk/artists/5efbbe8c-49e9-438d-a68b-2532a45dfb40)

**Impact:**
- False artist records
- Cancelled events appear as active
- No way to track cancellations properly

### 3. Unsearchable Names (2 found)
**Problem:** Unicode/special character artist names that users can't type.

**Examples:**
- **BAD:** `ÜL†RᛟɣᛨɸLE†` ([87f59213](https://gigmap.bndy.co.uk/artists/87f59213-c6fc-42de-a720-657bf443c539))
- **GOOD:** `Ultraviolet` ([30c4ade9](https://gigmap.bndy.co.uk/artists/30c4ade9-64f3-4ed2-a792-17cb157b4288))

**Impact:**
- Users can't search for the artist
- Duplicate records for same band (stylized vs normal)
- SEO nightmare

### 4. Zero-Event Artists (28 found)
**Problem:** Artists created but never had an event listed.

**Stats:**
- Count: 28 / 2,047 (1.4%)
- All from `mcp_ai_import`
- All created in July 2026

**Impact:**
- Database bloat
- False positives in artist searches
- Pollution from failed imports

---

## PREVENTION STRATEGIES

### Strategy 1: Multi-Artist Lineup Parser

**Location:** Backend validation in `POST /api/artists/find-or-create` and `POST /api/artists/community`

**Detection Patterns:**
```typescript
const MULTI_ARTIST_PATTERNS = [
  /\+\s*\d+\s*more/i,           // "+ 2 more", "+ 1 more"
  /\+.*\+/,                      // Multiple + signs
  /\sand\s.*\sand\s/i,           // "A and B and C"
  /,.*,/,                        // Multiple commas
  /\bvs?\b/i,                    // "vs", "v"
  /\bw\/\b/i,                    // "w/"
  /\bfeaturing\b/i,              // "featuring"
  /\bft\.?\b/i,                  // "ft", "ft."
  /\bsupporting\b/i,             // "supporting"
  /\bsupport\s+from\b/i,         // "support from"
  /\bwith\s+special\s+guests?\b/i, // "with special guest(s)"
];

function isMultiArtistLineup(name: string): boolean {
  return MULTI_ARTIST_PATTERNS.some(pattern => pattern.test(name));
}
```

**Action:**
1. **REJECT at API level** with error message:
   ```json
   {
     "error": "multi_artist_lineup_detected",
     "message": "Artist name appears to be a multi-artist lineup. Please split into individual artists.",
     "detected_name": "A + B + C",
     "suggestion": "Create separate artist records for each act."
   }
   ```

2. **Alternative:** Auto-parse and create `collaboratingArtistIds`
   - Split on `+`, `,`, `and`, `vs`, etc.
   - Trim each name
   - Find-or-create each artist individually
   - Add to event as collaborating artists
   - **Risk:** Parsing errors, false positives
   - **Recommendation:** Start with REJECT, add auto-parse in Phase 2

**Implementation:**
- Add validation to `api/artists/community/route.ts`
- Add validation to `api/artists/find-or-create/route.ts` (when deployed)
- Add to MCP validation layer
- Add to all source runners (sceniceye, klma, etc.)

---

### Strategy 2: Cancelled Event Detection

**Location:** Backend validation + event status field

**Detection Pattern:**
```typescript
const CANCELLED_PATTERNS = [
  /^cancelled$/i,
  /^canceled$/i,  // US spelling
  /^tbc$/i,
  /^to be confirmed$/i,
  /^t\.b\.c\.?$/i,
];

function isCancelledIndicator(name: string): boolean {
  return CANCELLED_PATTERNS.some(pattern => pattern.test(name.trim()));
}
```

**Action:**
1. **REJECT at artist creation** with error:
   ```json
   {
     "error": "cancelled_event_detected",
     "message": "Artist name 'Cancelled' indicates an event cancellation, not a new artist.",
     "suggestion": "Mark the event as cancelled using the event status field instead."
   }
   ```

2. **Add event status field** (if doesn't exist):
   ```typescript
   enum EventStatus {
     CONFIRMED = 'confirmed',
     CANCELLED = 'cancelled',
     POSTPONED = 'postponed',
     TBC = 'tbc',
   }
   ```

3. **Update importers** to detect "Cancelled" and set event status instead of creating artist

**Implementation:**
- Add `status` field to events table (default: `confirmed`)
- Add validation to artist creation endpoints
- Update all source runners to detect cancellations
- Update frontstage UI to show event status badges

---

### Strategy 3: Searchable Name Enforcement

**Location:** Backend validation with alias support

**Detection Pattern:**
```typescript
function validateArtistName(name: string): {
  valid: boolean;
  reason?: string;
  suggestion?: string;
} {
  // Check for excessive non-ASCII characters
  const asciiChars = name.replace(/[^a-zA-Z0-9\s\-'&]/g, '').length;
  const totalChars = name.length;
  const nonAsciiRatio = (totalChars - asciiChars) / totalChars;

  if (nonAsciiRatio > 0.3) { // >30% non-ASCII
    return {
      valid: false,
      reason: 'Name contains too many special characters (>30%)',
      suggestion: 'Use a searchable alias instead',
    };
  }

  // Check for all-symbol names
  if (/^[^a-zA-Z0-9]+$/.test(name)) {
    return {
      valid: false,
      reason: 'Name contains no alphanumeric characters',
      suggestion: 'Provide a searchable name',
    };
  }

  return { valid: true };
}
```

**Action:**
1. **REJECT unsearchable names** with error:
   ```json
   {
     "error": "unsearchable_name",
     "message": "Artist name 'ÜL†RᛟɣᛨɸLE†' contains too many special characters",
     "suggestion": "Use 'Ultraviolet' as the primary name, or add an alias"
   }
   ```

2. **Add alias support** to artist schema:
   ```typescript
   interface Artist {
     id: string;
     name: string;           // Primary searchable name
     display_name?: string;  // Optional stylized display name
     aliases?: string[];     // Alternative names
     // ...
   }
   ```

3. **Alias merge strategy:**
   - **Case: ÜL†RᛟɣᛨɸLE† → Ultraviolet**
     - Merge artist `87f59213` into `30c4ade9`
     - Add `ÜL†RᛟɣᛨɸLE†` to `aliases` array on kept record
     - Update all events to reference kept record
     - Delete bad record

4. **Search strategy:**
   - Search on `name` (primary)
   - Search on `aliases` (if present)
   - Display `display_name` if present, else `name`

**Implementation:**
- Add `display_name` and `aliases` fields to artists table
- Add validation to artist creation endpoints
- Update search to include aliases
- Create merge script for known bad cases
- Update frontstage UI to show display_name

---

### Strategy 4: Zero-Event Artist Cleanup

**Location:** Automated cleanup job + creation gate

**Prevention:**
1. **Add validation to artist creation:**
   - Require at least one event when creating artist via API
   - Exception: Manual creation via frontstage (admin only)
   - Exception: Verified imports (e.g., Spotify sync)

2. **Automated cleanup job:**
   ```typescript
   // Run weekly
   async function cleanupZeroEventArtists() {
     const cutoffDate = new Date();
     cutoffDate.setDate(cutoffDate.getDate() - 30); // 30 days old

     const zeroEventArtists = await db.artists
       .where('created_at', '<', cutoffDate)
       .whereNotIn('id', (qb) =>
         qb.select('artistId').from('events')
       )
       .andWhere('source', '=', 'mcp_ai_import'); // Only auto-imports

     // Delete artists with no events after 30 days
     await db.artists.delete().whereIn('id', zeroEventArtists.map(a => a.id));

     return { deleted: zeroEventArtists.length };
   }
   ```

3. **Immediate cleanup:**
   - Delete all 28 zero-event artists found in audit
   - They're all from July 2026 MCP imports
   - No events → no data loss

**Implementation:**
- Create Lambda/cron job for weekly cleanup
- Add validation to prevent zero-event artist creation
- Run one-time cleanup for current 28 artists
- Log deletions for audit trail

---

## IMPLEMENTATION PLAN

### Phase 1: IMMEDIATE (Validation Gates)
**Timeline:** 1-2 days

1. ✅ Add multi-artist lineup detection to artist creation endpoints
2. ✅ Add cancelled event detection to artist creation endpoints
3. ✅ Add unsearchable name validation to artist creation endpoints
4. ✅ Deploy validation to `POST /api/artists/community`
5. ✅ Deploy validation to `POST /api/artists/find-or-create` (when route exists)

**Deliverable:** All 4 validations active in production

### Phase 2: CLEANUP (Fix Existing Issues)
**Timeline:** 1 week

1. ✅ Delete 28 zero-event artists (automated)
2. ✅ Merge ÜL†RᛟɣᛨɸLE† → Ultraviolet (manual)
3. ✅ Delete 4 "Cancelled" artists (automated, after events reviewed)
4. ⚠️ 15 multi-artist lineups → **Manual review required**
   - Parse each lineup into individual artists
   - Create proper artist records
   - Update events with `collaboratingArtistIds`
   - Delete lineup artist record

**Deliverable:** Clean artist database

### Phase 3: ALIAS SYSTEM (Long-term Solution)
**Timeline:** 2-3 weeks

1. ✅ Add `display_name` and `aliases` fields to artists table
2. ✅ Update artist search to include aliases
3. ✅ Update frontstage UI to show display_name
4. ✅ Add alias management UI (admin only)
5. ✅ Backfill known aliases

**Deliverable:** Alias support for edge cases

### Phase 4: AUTO-CLEANUP (Automation)
**Timeline:** 1 week

1. ✅ Create weekly cleanup Lambda
2. ✅ Delete zero-event artists >30 days old
3. ✅ Alert on new "Cancelled" artists
4. ✅ Alert on new multi-artist lineups
5. ✅ Dashboard for data quality metrics

**Deliverable:** Automated cleanup and monitoring

---

## VALIDATION RULES SUMMARY

| Rule | Pattern | Action | Error Code |
|------|---------|--------|------------|
| Multi-artist lineup | `+`, `,`, `and`, `vs`, `featuring`, etc. | REJECT | `multi_artist_lineup_detected` |
| Cancelled event | `cancelled`, `tbc`, etc. | REJECT | `cancelled_event_detected` |
| Unsearchable name | >30% non-ASCII or all symbols | REJECT | `unsearchable_name` |
| Zero events | Artist created without event | PREVENT | `artist_requires_event` |

---

## TESTING STRATEGY

### Unit Tests
```typescript
describe('Artist validation', () => {
  it('rejects multi-artist lineups', () => {
    expect(isMultiArtistLineup('A + B + C')).toBe(true);
    expect(isMultiArtistLineup('Rock Doctors + 2 more')).toBe(true);
    expect(isMultiArtistLineup('The Beatles')).toBe(false);
  });

  it('rejects cancelled indicators', () => {
    expect(isCancelledIndicator('Cancelled')).toBe(true);
    expect(isCancelledIndicator('TBC')).toBe(true);
    expect(isCancelledIndicator('The Cancelled Show')).toBe(false);
  });

  it('rejects unsearchable names', () => {
    const result = validateArtistName('ÜL†RᛟɣᛨɸLE†');
    expect(result.valid).toBe(false);
    expect(result.reason).toContain('special characters');
  });
});
```

### Integration Tests
1. ✅ POST /api/artists with multi-artist lineup → 400 error
2. ✅ POST /api/artists with "Cancelled" → 400 error
3. ✅ POST /api/artists with unsearchable name → 400 error
4. ✅ POST /api/events without artist → 400 error

### Manual QA
1. ✅ Verify known bad cases are blocked
2. ✅ Verify legitimate edge cases still work (e.g., "Guns N' Roses" with apostrophe)
3. ✅ Verify alias system works end-to-end
4. ✅ Verify cleanup job doesn't delete legitimate artists

---

## MONITORING & ALERTS

### Metrics to Track
1. **Rejection rate by validation rule**
   - Multi-artist lineups blocked per week
   - Cancelled events blocked per week
   - Unsearchable names blocked per week

2. **Zero-event artist count**
   - Current count
   - Trend over time
   - Auto-cleanup stats

3. **Data quality score**
   - % artists with events
   - % artists with searchable names
   - % events with valid artists

### Alerts
1. **Spike in rejections** → Importer broken
2. **Zero-event artists growing** → Validation not working
3. **New "Cancelled" artists** → Event status not being set

---

## IMMEDIATE CLEANUP SCRIPT

Delete all zero-event artists and bad records:

```bash
# From audit cleanup lists
DELETE_ARTIST_IDS=(
  # 28 zero-event artists from cleanup-lists-2026-07-27.json
  # + 4 "Cancelled" artists
  # + 1 unsearchable (ÜL†RᛟɣᛨɸLE†) - merge first
)

# WARNING: Run this AFTER merging ÜL†RᛟɣᛨɸLE† → Ultraviolet
```

Script location: [`cleanup-lists-2026-07-27.json`](file:///C:/Users/jason/Documents/Claude/Projects/bndy/audit/cleanup-lists-2026-07-27.json)

---

## DECISION NEEDED: Multi-Artist Lineup Handling

**Option A: REJECT and require manual split** (RECOMMENDED)
- ✅ Simple, clear error message
- ✅ Forces correct data entry
- ❌ More work for importers

**Option B: Auto-parse into collaboratingArtistIds**
- ✅ Fully automated
- ❌ Risk of parsing errors
- ❌ Complex logic

**Option C: Create lineup artist + link individual artists via aliases**
- ✅ Preserves lineup as entity
- ✅ Individual artists also get credit
- ❌ Complex schema changes

**RECOMMENDATION:** Start with Option A (REJECT), evaluate auto-parse in Phase 3 after collecting real-world examples.

---

## NEXT STEPS

1. ✅ Review this strategy document
2. ✅ Approve validation rules and error messages
3. ✅ Decide on multi-artist lineup handling (Option A/B/C)
4. ✅ Implement Phase 1 validations
5. ✅ Test with known bad cases
6. ✅ Deploy to production
7. ✅ Run immediate cleanup (28 zero-event + 4 cancelled + 1 merge)
8. ✅ Monitor rejection metrics

---

**Generated by:** Claude Sonnet 4.5 (VSCode Agent)
**Date:** 2026-07-27
**Status:** DRAFT - Awaiting approval
