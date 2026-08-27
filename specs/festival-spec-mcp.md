# bndy Festivals — MCP & Write-API Build Spec (Phase 1a)

**Status:** Implementation In Progress · 2026-07-03 · Companion to `festival-spec.md` §4
**Repos touched:** bndy-serverless-api (Dynamo + endpoints), bndy-events MCP server. No frontstage/backstage work in this phase.

---

## Implementation Status (Fellicia · 2026-07-03)

### ✅ COMPLETED

| Item | Description | Location |
|------|-------------|----------|
| **Item 95** | events/public festival fields already pass through via spread operator | `events-lambda/handlers/public.js` (verified, test added) |
| **Item 93** | festivals-lambda CRUD handlers | `bndy-serverless-api/festivals-lambda/` (25 tests) |
| **Item 93** | template.yaml routes | `POST/PATCH/GET /festivals`, `/api/festivals/public`, `/api/festivals/slug/{slug}` |
| **Item 94a** | 5 new MCP tools | `bndy-MCPServer/src/tools/create-festival.ts`, `edit-festival.ts`, `search-festival.ts`, `add-lineup-slot.ts`, `resolve-lineup-slot.ts` |
| **Item 94b** | Tool registration | `bndy-MCPServer/src/index.ts` (schemas + switch cases) |
| **Item 94c** | create_event extended | Added: `festivalId`, `stageId`, `billing`, `billingOrder` |
| **Item 94c** | edit_event extended | Added: `festivalId`, `festivalName`, `stageId`, `billing`, `billingOrder` |
| **Item 94c** | get_by_external_id extended | Added: `festival` to entityType enum |
| **Item 94c** | search_event extended | Added: `festivalId` filter for child events |

### ✅ DEPLOYED (2026-07-03)

| Item | Status | Notes |
|------|--------|-------|
| **festivals-lambda** | DEPLOYED | SAM deploy to bndy-serverless-api stack |
| **bySlug GSI** | ACTIVE | Created via AWS CLI |
| **byFestival GSI** | ACTIVE | Created via AWS CLI |
| **Integration tested** | PASS | POST/GET/PATCH /festivals, /api/festivals/public, /api/festivals/slug/{slug} |

### ⏳ REMAINING

| Item | Description | Action Required |
|------|-------------|-----------------|
| **upload_event_poster** | Accept festivalId + kind param | Low priority (§2.9) |
| **MCP commit push** | Push feature branch to origin | After CTO review |

### 🔄 BRANCHES

Both repos have `feature/festivals-phase-1a` branch. Merge blocked on write-gate P0 closure.

### 📋 GSI CREATION COMMANDS (run before deployment)

```bash
# bySlug GSI - for /festivals/slug/{slug} and collision check
aws dynamodb update-table \
  --table-name bndy-events \
  --attribute-definitions AttributeName=slug,AttributeType=S \
  --global-secondary-index-updates \
    "[{\"Create\":{\"IndexName\":\"bySlug\",\"KeySchema\":[{\"AttributeName\":\"slug\",\"KeyType\":\"HASH\"}],\"Projection\":{\"ProjectionType\":\"ALL\"},\"ProvisionedThroughput\":{\"ReadCapacityUnits\":5,\"WriteCapacityUnits\":5}}}]"

# byFestival GSI - for fetching child events
aws dynamodb update-table \
  --table-name bndy-events \
  --attribute-definitions AttributeName=festivalId,AttributeType=S AttributeName=date,AttributeType=S \
  --global-secondary-index-updates \
    "[{\"Create\":{\"IndexName\":\"byFestival\",\"KeySchema\":[{\"AttributeName\":\"festivalId\",\"KeyType\":\"HASH\"},{\"AttributeName\":\"date\",\"KeyType\":\"RANGE\"}],\"Projection\":{\"ProjectionType\":\"ALL\"},\"ProvisionedThroughput\":{\"ReadCapacityUnits\":5,\"WriteCapacityUnits\":5}}}]"
```

Note: Wait for each GSI to become ACTIVE before creating the next (~5 min per GSI).

---

Baseline audit (current MCP): `create_event`/`edit_event` already take `artistIds[]`, `externalIds[]`, `ticketUrl/ticketed/price`, and artist is optional. `get_by_external_id` supports `venue|artist|event`. `upload_event_poster` exists. **Nothing festival-shaped exists anywhere** — everything below is new or an extension.

---

## 1. Backend first: Dynamo + write API

MCP tools are thin wrappers; the real work is server-side.

### 1.1 New item type: Festival

`PK=FESTIVAL#<uuid>`, `SK=META`, `entityType=festival`. Attributes = the Festival interface from festival-spec.md §3.1 (slug, name, description, startDate, endDate, primaryVenueId, venueIds[], location, stages[], lineup[], ticketed, price, ticketUrl, lineupUrl, websiteUrl, socialMediaUrls[], heroImageUrl, posterImageUrl, theme, isPublic, source, externalIds[], createdAt, updatedAt).

Lineup slots are stored **inline on the festival item** (array attribute), not as separate items. Rationale: slots are claims, not entities; a 30-slot lineup is ~6KB, far under the 400KB item cap; single-read festival page. Revisit only if a festival exceeds ~200 slots.

### 1.2 Index changes

| Index | Keys | Serves |
|---|---|---|
| `bySlug` (GSI, new) | `slug` → festival item | `/festivals/slug/{slug}`, slug-collision check on create |
| `byFestival` (GSI, new) | `festivalId`, sort `date` | fetch a festival's child events in one query |
| `byExternalId` (existing) | extend to festival items | idempotent re-imports |
| upcoming festivals (existing entityType/date GSI pattern) | `entityType=festival`, `endDate` | `/api/festivals/public` |

Event items gain optional attributes: `festivalId`, `festivalName`, `stageId`, `billing`, `billingOrder`. No key changes; `byFestival` GSI projects them.

### 1.3 Endpoints (write API, same auth as events)

- `POST /festivals` — create; server generates uuid + slug (`kebab(name)`, append `-2`, `-3`… on collision), validates `startDate ≤ endDate`, validates `primaryVenueId`/`venueIds` exist, validates lineup slot `day` within date range.
- `PATCH /festivals/{id}` — partial update; `externalIds` additive-merge (same semantics as edit_event); lineup ops (see 2.5) also route here.
- `GET /festivals?name=&town=&dateFrom=&dateTo=` — search for dedup.
- `GET /api/festivals/public?startDate&endDate` — public list (id, slug, name, dates, town, venueIds, posterImageUrl, price, actCount).
- `GET /api/festivals/slug/{slug}` — festival + child events (via byFestival) + lineup, one response; powers the future page but also lets agents verify state.
- **Fix while in here:** `GET /api/events/public` returns `artistIds[]` (currently singular `artistId`) + `festivalId`, `festivalName`, `billing`. Frontstage already normalises both shapes, so this is non-breaking.

Cascade rule: deleting/hiding a festival does NOT touch child events; it clears nothing. Deleting an event referenced by a lineup slot's `eventId` → slot reverts to unresolved (background integrity check or on-read repair, simplest: on-read).

## 2. MCP tools (bndy-events)

### 2.1 `create_festival` (new)

```jsonc
{
  "name": { "type": "string" },                      // REQUIRED
  "startDate": { "type": "string" },                 // REQUIRED YYYY-MM-DD
  "endDate": { "type": "string" },                   // defaults to startDate
  "description": { "type": "string" },
  "primaryVenueId": { "type": "string" },            // from search_venue/create_venue
  "venueIds": { "type": "array", "items": "string" },
  "stages": { "type": "array", "items": { "name": "string", "venueId?": "string" } },
                                                     // server assigns stage ids
  "lineup": { "type": "array", "items": LineupSlot },// see 2.4
  "ticketed": { "type": "boolean" },
  "price": { "type": "string" },
  "ticketUrl": { "type": "string" },
  "lineupUrl": { "type": "string" },
  "websiteUrl": { "type": "string" },
  "posterImageUrl": { "type": "string" },
  "heroImageUrl": { "type": "string" },
  "theme": { "primaryColor": "...", "secondaryColor": "...",
             "backgroundColor": "...", "foregroundColor": "..." },
  "isPublic": { "type": "boolean" },                 // default false — same trap as
                                                     // create_event: agents MUST pass true
  "externalIds": [ { "source": "...", "id": "..." } ]
}
```
Returns `{ festivalId, slug }`. Tool description must say: *"Search first with search_festival. A festival groups child events — it is not an event and never appears on the gig map itself."*

### 2.2 `edit_festival` (new)

`festivalId` required + any 2.1 field. `externalIds` additive-merge with `replaceExternalIds` flag (mirror edit_event). Slug is immutable via this tool (server-only regeneration; public URLs must not silently break).

### 2.3 `search_festival` (new)

```jsonc
{ "name": "string", "town": "string?", "dateFrom": "?", "dateTo": "?" }
```
Returns **all** matches with id, slug, name, dates, town, venue names, act count — not top-match-only (learned the hard way with search_venue hiding dup venues). Dedup rule for agents baked into the description: *same/near name + same town + overlapping dates = same festival; reuse it.*

### 2.4 `add_lineup_slot` (new)

```jsonc
{
  "festivalId": "string",                            // REQUIRED
  "slots": [ {                                       // batch — always import a bill in ONE call
    "displayName": "string",                         // REQUIRED, as billed
    "artistId": "string?",                           // if already resolved
    "day": "YYYY-MM-DD?",
    "stageId": "string?",
    "startTime": "HH:MM?", "endTime": "HH:MM?",
    "billing": "headline|special_guest|support|general|opener?",
    "billingOrder": "number?"
  } ]
}
```
Returns slot ids. Server dedups within festival on `(displayName lowercased, day, stageId)` — re-running an import doesn't double the bill.

### 2.5 `resolve_lineup_slot` (new)

```jsonc
{ "festivalId": "string", "slotId": "string",
  "artistId": "string?", "eventId": "string?", "remove": "boolean?" }
```
Incremental hardening across daily runs: crawl finds set times → create child event → resolve slot with both ids. `remove` for acts that drop off the bill.

### 2.6 `create_event` / `edit_event` (extend)

Add optional: `festivalId`, `stageId`, `billing`, `billingOrder`. Server validates festivalId exists, date within festival range (warn, don't reject — pub-takeover Sundays can trail the range; if outside, auto-extend range only on explicit edit_festival), stamps denormalised `festivalName`.

### 2.7 `get_by_external_id` (extend)

`entityType` enum gains `"festival"`.

### 2.8 `get_by_id` / `search_event` (extend)

`search_event` gains optional `festivalId` filter. `get_by_id` returns festival fields on events, and accepts festival ids (returns festival + lineup + child event count).

### 2.9 `upload_event_poster` → reuse for festivals

Accept `festivalId` as alternative to `eventId` (S3 prefix `festivals/<id>/`), plus optional `kind: "poster"|"hero"`. Avoids a new tool; answers open question #4 from the main spec.

### 2.10 `bulk_import` — explicitly OUT of scope

Festival bills need judgment (tribute-name slots, tier assignment, dedup against prior runs). Keep festivals on the granular tools; revisit after two or three manual festival imports have settled the patterns.

## 3. Validation & guardrails (server-side)

- `startDate ≤ endDate`; both valid dates; reject range > 31 days (typo guard — "week-long series" is the realistic max).
- Slug: lowercase kebab, collision-suffixed, immutable post-create.
- `billing` enum enforced; `billingOrder` int ≥ 0.
- Lineup slot `artistId`/`eventId` must exist when supplied.
- Festival with `isPublic: true` requires: name, dates, ≥1 of (primaryVenueId | venueIds non-empty). Lineup may be empty (renders "Lineup TBA").
- No review/QA text in any public field (bio-rule equivalent): `description` is public copy.

## 4. Agent workflow (added to source-runner/CTO instructions)

1. `get_by_external_id(festival, source, id)` → else `search_festival(name, town)` → only then `create_festival`.
2. Venues first (geocode → place_id → search/create), artists per standard rules (attempt enrichment before create, actType follow-up, short-name core search, same-region-same-name = reuse).
3. Import the full bill as lineup slots in one `add_lineup_slot` call, `displayName` exactly as billed. Never create artists for set-names ("90s Band Set", "Ariana Grande tribute") — resolve to real acts or leave unresolved.
4. Child events: only when date+startTime confirmed; always `isPublic: true`; stamp `externalIds`; link via `festivalId` + resolve the slot.
5. Festivals may go `isPublic: true` with partial lineups; events may not exist without times.

## 5. Acceptance tests (worked against real targets)

| Case | Asserts |
|---|---|
| **Alsager (2026-07-11)** | create Milton Park venue; festival w/ 4 stages; 24 slots in one call; ≥5 slots resolved to enriched artists + child events; Sunday pub-takeover events at other venues linked w/o stageId; `/api/festivals/slug/alsager-music-festival-2026` returns everything in one call |
| **BachFest (2026-07-18)** | tribute slots stay unresolved w/o artist records; one multi-artist child event 15:00 |
| **Swan & Chequers Jazz Fest** | existing Big Band 31 Aug event gets `festivalId` stamped via edit_event; venue diary unchanged |
| **Crewe Rocks (29–30 Aug)** | 3 venues incl. one new (Borough Arms); per-venue child events; mixed `price` string |
| **Idempotency** | re-running any import creates zero new records (external-id + slot dedup) |
| **Regression** | events/public still serves old clients; `artistId` consumers unaffected by `artistIds[]` addition |

## 6. Sizing

| Work | Est. |
|---|---|
| Dynamo item + 2 GSIs + festival CRUD endpoints | 1–1.5 days |
| events/public `artistIds[]` + festival fields | 0.5 day |
| 5 new MCP tools + 4 extensions | 1 day |
| Agent instruction updates + Alsager live import (the real test) | 0.5 day |

**~3–3.5 agent-days.** Alsager is 9 days out; comfortable if started this week. Suggest logging as build items in new-world-backlog (Vincent/Valerie split: backend vs MCP).
