# VSCODE AGENT TASK — `createdAt` is written under one name and queried under another

**Raised:** 2026-08-01 by the CTO session · **Owner:** Jason
**Repos:** `bndy-serverless-api` — `artists-lambda`, `venues-lambda`
**Priority: this is the top blocker for scheduling the enrichment task.** No time-boxed job can select its own work until it lands.

---

## 0. The one-line version

**Nothing is lost.** `created_at` is being written correctly on every record. It is simply **queried under `createdAt` and, on artists, read back under `createdAt` too**. One name mismatch, two symptoms. The backfill is a rename, not a reconstruction.

---

## 1. What was actually measured (live, 2026-08-01)

| Call | Result |
|---|---|
| `list_artists(createdSince:"2020-01-01")` | **4 artists.** All `source: "agentic_ingest"`, all created 2025-10-19 |
| `list_venues(createdSince:"2020-01-01")` | **4 venues.** All `createdSource: null`, `updatedAt: null`, all created 2025-10-19 |
| `get_by_id(artist, <any MCP-created artist>)` | `createdAt: null` |
| `get_by_id(venue, "44577217-deab-4abd-be47-785e1cae6855")` — Carnglaze Caverns, created today | **`createdAt: "2026-08-01T15:50:42.076Z"`** — populated and correct |
| `get_by_id(event, "8087b154-5a8d-433a-a366-7052396ee3c5")` — created today | **`createdAt: "2026-08-01T16:02:28.304Z"`** — populated and correct |

## 2. The contradiction that pins the cause

Carnglaze Caverns has `createdAt: "2026-08-01T15:50:42.076Z"` when fetched by id.
`2026-08-01` is later than `2020-01-01`.
**It does not appear in `list_venues(createdSince:"2020-01-01")`.**

A filter cannot miss a record whose value plainly satisfies it — **unless the filter and the response are reading different attributes.** They are.

The only records the filter can see are the four-of-each from the **2025-10-19 legacy `agentic_ingest` load**, which wrote the attribute the filter queries. Everything written by the MCP path since then writes the other one.

Matching that to the code (`artists-lambda/handler.js` writes `created_at` at create, then reads `createdAt` at lines 536, 585, 663-664, 3464, 3471, 3523; correct camelCase reference implementations exist at 738-739 and in `venues-routes.js:325-326`):

| | write | response read | `createdSince` filter | symptom |
|---|---|---|---|---|
| **artists** (MCP) | `created_at` | `createdAt` ❌ | `createdAt` ❌ | **null in responses AND invisible to the filter** |
| **venues** (MCP) | `created_at` | `created_at` ✅ | `createdAt` ❌ | correct in responses, **invisible to the filter** |
| **events** (MCP) | consistent ✅ | ✅ | not yet tested — **test it** | none observed |
| legacy 2025-10-19 load | `createdAt` | ✅ | ✅ | none — these are the only 4+4 the filter returns |

⚠ **This corrects an earlier diagnosis of mine.** I previously reported this as "artists-only, events and venues are fine". Venues write and read fine but are **equally invisible to `createdSince`**. Any backfill or sweep that trusted `list_venues(createdSince:)` has been silently operating on 4 records out of 1,957.

---

## 3. What to build

### 3a. Pick ONE name and use it everywhere
`createdAt` (camelCase), matching `updatedAt`, the events lambda and the legacy data. **Do not** standardise on `created_at` — that would orphan the only records the filter currently finds.

### 3b. Artists lambda
- **Write `createdAt` at create.** Set it once, on create only.
- **Never write it on update.** `edit_artist` must not touch it — including the additive-merge paths.
- Read `createdAt` at all six sites listed above. Lines 738-739 already do it correctly; make the rest match.

### 3c. Venues lambda
- Same: write and read `createdAt`.
- ⚠ `venues-routes.js:325-326` currently reads `created_at` and is the reason venue responses look healthy. Change it **together with** the write, or venue responses go null the way artists already have.

### 3d. The `createdSince` filter itself
Confirm on **all three** entity types that the filter queries the same attribute the writer writes. Events were not tested — test them. A DynamoDB scan filter comparing ISO-8601 strings is fine; just make sure both sides are the same attribute and both are ISO-8601 strings, not one string and one epoch number.

### 3e. Backfill — a rename, not a reconstruction
For every record where `createdAt` is absent and `created_at` is present: **copy `created_at` → `createdAt`, leave `created_at` in place.** Venues prove the source data is intact and correctly stamped.

For any record where **both** are absent:
- set `createdAt` from `updatedAt`, and
- set a `createdAtInferred: true` flag so no later job treats it as fact.

⚠ **Do not infer from `updatedAt` without the flag.** A bulk write on **2026-08-01 at 14:44** reset `updatedAt` on **149 artists** in a single minute, across 50 unrelated locations and every source namespace. For those records `updatedAt` is the migration timestamp, not a creation date, and an unflagged inference would bake that lie in permanently.

### 3f. While you are here
Two defects in the same family — a caller cannot tell a bad request from a working one:

- **`search_venue` crashes instead of validating.** Called without the required `city`, it returns `Cannot read properties of undefined (reading 'toLowerCase')`. It should return **400** naming the missing field.
- **`list_venues` and `list_artists` silently ignore unknown filter parameters.** `list_venues(location:"Stoke-on-Trent")` returned **all 1,957 venues** with the message *"Found 1957 venues matching filters"*. The parameter is `region`; `location` was dropped without a word. This is the same failure mode as the `nameVariants` defect — the caller believes a filter applied when it did not — and is already covered by `VSCODE-AGENT-NAMEVARIANTS-ALIASES.md` §3. **Reject unknown parameters with a 400 naming them.**

---

## 4. Acceptance — run exactly these

1. `create_artist(...)` → `get_by_id(artist, <new id>)` returns a populated ISO-8601 `createdAt`.
2. `edit_artist(<that id>, bio:"x")` → `createdAt` is **unchanged**; `updatedAt` moves.
3. `list_artists(createdSince:"<today>")` returns that artist. **Today it returns 0 rows for the entire table** — that is the regression test.
4. `list_venues(createdSince:"2020-01-01")` returns **more than 4** venues. Specifically it must include **Carnglaze Caverns `44577217-deab-4abd-be47-785e1cae6855`**, which has a valid `createdAt` today and is still missing from that result.
5. `list_events(createdSince:...)` — or the equivalent — behaves the same.
6. After backfill: no artist or venue has a null `createdAt`; every inferred value carries `createdAtInferred: true`.
7. `search_venue(name:"X")` with no `city` returns **400**, not a TypeError.
8. `list_venues(location:"Stoke-on-Trent")` returns **400** naming the unknown parameter, not 1,957 rows.

## 5. Why this is the top blocker

The enrichment task has to be able to ask *"which records were created since my last run?"*. It cannot. `createdSince` returns 0 for artists table-wide and 4 for venues, so the scheduled enrichment agent has **no way to select its own work**. Today's supervised batch had to fall back on "artists carrying a `lemonrock` externalId", which happens to work only because that namespace is two days old. That substitute does not generalise to any other source, and it stops working for Lemonrock itself the moment the namespace is more than a run old.

## 6. Traps

- Read every write back with `get_by_id`. `search_artist` and `search_event` both have documented false-negative modes.
- Don't touch owner-managed records (§0.16).
- The backfill is additive — do not delete `created_at`. If anything still reads it, dropping it turns this into an outage.
