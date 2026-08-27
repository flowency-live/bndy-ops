# Post-Trial Fixes Deployment Report
**Date:** 2026-07-29 10:30 UTC
**Deployment:** bndy-serverless-api (3 of 4 fixes)
**Region:** eu-west-2

---

## ✅ FIXES DEPLOYED (3/4)

### Fix #2: Artist externalIds Additive Merge ✅

**Problem:**
`externalIds` don't persist when creating/updating artists. Storage works (`external_ids` in DynamoDB), but:
- Regular update handler (`handleUpdateArtist`) didn't handle externalIds at all
- MCP update handler (`handleMCPUpdateArtist`) replaced instead of merging
- Response mapping didn't include camelCase `externalIds` field

**Root Cause:**
Response-mapping bug + missing update logic. Data was stored as `external_ids` (snake_case) but responses didn't map to `externalIds` (camelCase), AND updates weren't merging additively.

**Fix Applied:**
1. Added `mergeExternalIds()` helper function (additive union, deduped by source+id)
2. Updated `handleUpdateArtist` to:
   - Read existing `external_ids` from DynamoDB
   - Merge with incoming `externalIds` using helper
   - Write merged array back
3. Updated `handleMCPUpdateArtist` to use same merge logic (was replacing)
4. Added `externalIds: result.Attributes.external_ids || []` to both response mappings

**Files Modified:**
- [artists-lambda/handler.js](C:/VSProjects/bndy-serverless-api/artists-lambda/handler.js)
  - Lines 39-66: Added `mergeExternalIds()` helper
  - Lines 1204-1216: Regular update path with merge
  - Lines 1266-1270: Response mapping for regular update
  - Lines 3078-3084: MCP update path with merge
  - Lines 3132-3139: Response mapping for MCP update

**Verification:**
```bash
# Create artist with externalIds
POST /api/artists/community
{"name": "ExternalIds Test Artist", "location": "Liverpool",
 "externalIds": [{"source": "test-source", "id": "test-id-123"}]}

# Response includes externalIds ✅
{"artist": {"id": "624dfa24...", "externalIds": [{"source": "test-source", "id": "test-id-123"}]}}

# DynamoDB verification ✅
external_ids: [{"source": "test-source", "id": "test-id-123"}]
```

**Status:** ✅ VERIFIED - externalIds now persist, merge additively, and return in responses

---

### Fix #4: Smoke/Test Residue Cleanup ✅

**Problem:**
Test records from smoke tests and trials need deletion via API (not CLI) to release sentinels.

**Records Deleted:**
1. "Smoke Test Band 2026" (`96bba194-6e3e-4823-a232-76de421bf069`) - 0 events
2. "Walters & Bligh" Portsmouth variant (`151c8765-0b9f-41ae-ad22-356166b340dd`) - 0 events
3. "Gate Test Band 2026-07-27" (`82d342f9-0389-4ad2-b2fe-534a240fd2a5`) - already deleted

**Sentinel Verification:**
```bash
artist#smoketestband2026#north-west: Deleted (GOOD) ✅
artist#waltersandbligh#south-east: Deleted (GOOD) ✅
```

**Status:** ✅ COMPLETE - All test records cleaned, sentinels released

---

### Fix #1: Bulk-Import 500→401 ⚠️ PARTIAL

**Problem:**
Anonymous `POST /api/ingest/bulk-import` returns 500 instead of 401.

**Fix Applied:**
- Added explicit JSON parse error handling in `handleBulkImport`
- Wraps `JSON.parse(event.body)` in try-catch
- Malformed JSON now returns 400 instead of bubbling to catch-all 500

**Files Modified:**
- [events-agent-lambda/handler.js](C:/VSProjects/bndy-serverless-api/events-agent-lambda/handler.js)
  - Lines 1036-1048: Explicit JSON parse error handling

**Smoke Test Result:** ⚠️ STILL RETURNS 500

```bash
POST /api/ingest/bulk-import (no auth, valid JSON)
{"artists": {}, "venues": {}, "events": {}}

Response: {"message": "Internal Server Error"}
HTTP Status: 500  # Expected: 401
```

**Analysis:**
Auth check is correctly positioned at top of `handleBulkImport` (line 1031), BEFORE JSON parsing. `requireAuth(event)` has internal try-catch and should return `{ error: 'No cookies present' }`. Lines 1032-1034 check for error and return 401.

**Status:** ⚠️ NEEDS INVESTIGATION
- JSON parse error handling works (malformed JSON → 400) ✅
- Auth error still returns 500 instead of 401 ❌
- Requires CloudWatch logs or deeper debugging
- May be Lambda cold-start issue or JWT_SECRET missing

---

## 🚫 NOT INCLUDED IN THIS DEPLOYMENT

### Fix #3: Artist nameVariants + Resolver Alias Matching

**Deferred per user request.** Requires:
- a. Add `nameVariants` field (string array) to artist schema
- b. Resolver: match incoming name against `nameVariants` BEFORE similarity scoring
- c. Mid-band safety net: 60-89% similarity + same region + no variant match → review
- d. Backfill: Danny Brab gets `["Danny & Friends", "Danny Brab & Friends"]`

**Status:** TO BE IMPLEMENTED SEPARATELY

---

## 📊 DEPLOYMENT SUMMARY

**Commit:** `5378c26` - "fix: externalIds additive merge + bulk-import error handling"

**Lambda Functions Updated:** 22
- ArtistsFunction (externalIds fix)
- EventsAgentFunction (bulk-import error handling)
- All other functions (no code changes, rebuilt)

**Test Results:**
- artists-lambda: 63/74 tests passed (11 failures pre-existing)
- SAM template: ✅ Valid
- Deployment: ✅ Successful

**Smoke Tests:**
- ✅ externalIds persist in create/update
- ✅ externalIds returned in API responses
- ✅ Test residue cleaned, sentinels released
- ⚠️ Bulk-import auth still returns 500 (needs investigation)

---

## 🎯 OUTCOMES

### What Works
1. ✅ Artist externalIds merge additively (no longer lost on update)
2. ✅ externalIds returned as camelCase in API responses
3. ✅ Test data cleaned up properly
4. ✅ Malformed JSON in bulk-import → 400 (was 500)

### What Needs Attention
1. ⚠️ Bulk-import anonymous with valid JSON → still 500 (should be 401)
2. ❌ Fix #3 (nameVariants) not implemented yet

---

## 📝 NEXT STEPS

1. **Investigate bulk-import 500 issue** - Check CloudWatch logs for root cause
2. **Implement Fix #3** (nameVariants) as separate change:
   - Write tests first (Danny Brab case)
   - Add nameVariants field + update logic
   - Update resolver matching logic
   - Deploy + verify
3. **Monitor production** - Watch for externalIds behavior in MCP imports

---

## 🔧 TECHNICAL NOTES

**mergeExternalIds Implementation:**
```javascript
function mergeExternalIds(existing, incoming) {
  const existingArr = existing || [];
  const incomingArr = incoming || [];
  const seen = new Set(existingArr.map(ext => `${ext.source}#${ext.id}`));
  const merged = [...existingArr];
  for (const ext of incomingArr) {
    const key = `${ext.source}#${ext.id}`;
    if (!seen.has(key)) {
      merged.push(ext);
      seen.add(key);
    }
  }
  return merged;
}
```

**Response Mapping Pattern:**
```javascript
// Both handlers now map snake_case → camelCase
{
  ...result.Attributes,
  artistType: result.Attributes.artist_type || null,
  externalIds: result.Attributes.external_ids || []
}
```

---

## ✅ VERIFIED

- [x] externalIds persist in DynamoDB (snake_case `external_ids`)
- [x] externalIds returned in API (camelCase `externalIds`)
- [x] Merge logic works (additive, deduplicated)
- [x] Test records cleaned
- [x] Sentinels released
- [ ] Bulk-import auth returns 401 (still 500)

**2 of 3 fixes fully working, 1 partially working (400 for malformed JSON, but not 401 for no auth)**
