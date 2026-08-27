# bndy Festivals — Feature Spec

**Status:** Draft v1 · 2026-07-02 · Author: Claude (CTO agent) w/ Jason
**Decisions confirmed:** Festival entity + child events · special marker + badged children · branded `/festivals/[slug]` page · agent/MCP import path first

---

## 1. Problem

bndy models gigs as single events at a venue. The discovery pipeline is now surfacing festivals that don't fit. Four real archetypes from `discovery-review.jsonl`:

| Archetype | Example | Shape |
|---|---|---|
| **A. Single-venue multi-act bill** | Chadkirk Unplugged (3 acts, one evening); BachFest 2026 (5 acts, 15:00–23:00) | One venue, one day, one ticket, ordered lineup |
| **B. Venue-branded fest-as-series** | Swan & Chequers Jazz Fest (28–31 Aug, one act per night) | One venue, multi-day, each act is a normal gig that belongs to a named festival |
| **C. Site festival, stages** | Alsager Music Festival (25+ acts, 4 stages, Milton Park, 11:00–21:00 + Sunday pub takeover) | Non-standing venue, stages, set times, headliners, spillover events at other venues |
| **D. Multi-venue town festival** | Crewe Rocks (14 acts, 3 venues, 2 days, daytime free / evening ticketed) | Multiple venues, multi-day, mixed pricing |

One model must cover all four, plus: optional headliner/support/general tiers, ticket links (whole-fest and per-day), free vs ticketed, unknown/partial lineups (Sandbach Rock & Pop has a ticket URL and nothing else), and acts that aren't real artist records ("90s Band Set", "Spice Girls tribute").

## 2. Design principle

**A Festival is a first-class parent entity. It never appears as an event itself — it groups ordinary child Events.** Child events stay fully functional gigs (map markers, artist links, venue diaries, dedup, trust precedence) so nothing downstream changes for them. The festival adds identity, branding, date range, lineup metadata, and a public page.

This aligns with ADR-022: the Festival record is another projection-friendly entity; when the knowledge graph lands, festival membership becomes edges (`event —partOf→ festival`, `artist —performsAt→ festival`).

## 3. Data model

### 3.1 Festival (new entity)

```ts
interface Festival {
  id: string;                 // uuid
  slug: string;               // unique, url-safe: "alsager-music-festival-2026"
  name: string;               // "Alsager Music Festival 2026"
  description?: string;
  startDate: string;          // YYYY-MM-DD
  endDate: string;            // YYYY-MM-DD (== startDate for one-dayers)
  // Location
  primaryVenueId?: string;    // main site (Milton Park, Sandbach Cricket Club)
  venueIds: string[];         // all participating venues (derived from children + explicit)
  location?: { lat: number; lng: number }; // centre point for the festival page map
  // Structure
  stages?: { id: string; name: string; venueId?: string }[]; // "Main Stage", "Acoustic Tent"; venueId set for multi-venue fests
  // Lineup metadata (see 3.3 — supplements, never replaces, child events)
  lineup?: LineupSlot[];
  // Commercial
  ticketed?: boolean;
  price?: string;             // "FREE", "from £15 (early bird £7)", "daytime free / evening £8-10"
  ticketUrl?: string;
  lineupUrl?: string;         // organiser's own lineup page
  websiteUrl?: string;
  socialMediaUrls?: { platform: string; url: string }[];
  // Branding (festival page theming — see 5.4)
  heroImageUrl?: string;
  posterImageUrl?: string;
  theme?: { primaryColor: string; secondaryColor: string;
            backgroundColor: string; foregroundColor: string };
  // Plumbing (same conventions as Event)
  isPublic: boolean;
  source: EventSource;        // 'bndy.live' | 'user' | 'bndy.core'
  externalIds?: { source: string; id: string }[];
  createdAt: string; updatedAt: string;
}
```

### 3.2 Event extensions (child linkage)

```ts
interface Event {
  // ...existing fields unchanged, plus:
  festivalId?: string;
  festivalName?: string;      // denormalised for card badges without a join
  stageId?: string;           // references Festival.stages
  billing?: 'headline' | 'special_guest' | 'support' | 'general' | 'opener';
  billingOrder?: number;      // sort within a day/stage; lower = higher on the bill
}
```

Notes:
- `create_event` already accepts `artistIds[]` and already makes artist optional (`venueId + date + startTime` are the only required fields) — both are prerequisites we get for free.
- The John Angus Band pattern ("special guest Ben Reel") is **not** a festival: it's a single event with `artistIds: [john, ben]` and billing on the event title. Festivals require 3+ acts or an organiser-named festival brand. Rule of thumb for agents: *if it has a name that isn't just "Artist @ Venue", and a bill, it's a festival.*

### 3.3 LineupSlot — the escape hatch for messy reality

Child events need real venue records and benefit from real artist records. Discovery often has neither yet (unresolved tributes, "90s Band Set", DJs, lineup-TBA). `Festival.lineup[]` holds the bill as *claims* until they harden into events/artists:

```ts
interface LineupSlot {
  displayName: string;        // as billed: "Spice Girls tribute"
  artistId?: string;          // set once resolved/enriched
  day?: string;               // YYYY-MM-DD
  stageId?: string;
  startTime?: string; endTime?: string;
  billing?: Event['billing'];
  billingOrder?: number;
  eventId?: string;           // set once a child event exists for this slot
}
```

Lifecycle: slot created from crawl → artist resolved (standard enrichment rules apply) → child event created → `eventId` set. The festival page renders slots directly, so an unresolved lineup still displays correctly on day one. This is capture-before-prune applied to lineups.

### 3.4 How each archetype maps

- **A (BachFest):** Festival + 1 child event per act where set times are known, else one multi-artist child event for the day + lineup slots for unresolved names.
- **B (Swan & Chequers Jazz Fest):** Festival wrapping the 4 nightly events (the Big Band 31 Aug event already exists — just gets `festivalId` stamped). Zero display change on the map beyond the badge.
- **C (Alsager):** Festival with `stages[]`, primaryVenue = Milton Park (create as venue with place_id), per-act child events where times known. Sunday pub takeover = ordinary child events at each pub venue, `stageId` unset — the festival page groups them under their day automatically.
- **D (Crewe Rocks):** Festival with `venueIds` = 3 venues, per-venue child events, per-day pricing captured in `price` string + per-event `ticketed`.

### 3.5 DynamoDB

Following existing single-table conventions in serverless-api:

- Festival item: `PK=FESTIVAL#<id>`, `SK=META`
- Slug lookup: GSI `slug → festivalId` (festival pages resolve by slug)
- Children: add `festivalId` attribute to event items + GSI `byFestival (festivalId, date)` → fetch a festival's events in one query
- Upcoming festivals list: GSI on `entityType=FESTIVAL, endDate ≥ today`

Graph note (ADR-022): Dynamo remains the prunable projection. Festival membership must survive event pruning — when child events age out, the festival item + lineup slots retain the historical bill.

## 4. API & MCP changes (Phase 1 — build first)

### serverless-api
- `POST/PATCH /festivals` (write API, same auth as events)
- `GET /api/festivals/public?startDate&endDate` → upcoming festivals (for map/list)
- `GET /api/festivals/slug/{slug}` → festival + resolved lineup + child events (single call for the festival page)
- `GET /api/events/public` response: add `festivalId`, `festivalName`, `billing` — and return `artistIds[]` (it currently returns singular `artistId`; frontstage already normalises both)

### bndy-events MCP (agent path)
- `create_festival` / `edit_festival` — mirror Festival fields; slug auto-generated from name+year, collision-checked
- `search_festival(name, town?)` — dedup guard before create (same discipline as artists)
- `create_event` / `edit_event` — add `festivalId`, `stageId`, `billing`, `billingOrder`
- `add_lineup_slot` / `resolve_lineup_slot(slotIndex, artistId?, eventId?)` — incremental lineup hardening across runs

**Agent workflow rules** (added to source-runner instructions):
1. `search_festival` before create; same-name+same-town+overlapping-dates = same festival, reuse.
2. All existing artist rules apply per slot: attempt enrichment before create, actType follow-up, short-name dedup, same-region dup = reuse, no review notes in bndy fields.
3. Child events: `isPublic: true` always; stamp `externalIds` with source refs.
4. A festival with zero resolvable detail (Sandbach Rock & Pop today) may exist as `isPublic: false` festival + lineup TBA until a crawl fills it in.

## 5. Frontstage display

### 5.1 Map markers
New `"festival"` marker variant in `markerElements.ts`: same neon-glass system, **green** ring/bloom (`--lv-green #0a9e54` — matches backstage's 🎪 festival green, and green is currently unused on the map so festivals read instantly). Behaviour:

- Marker appears at each participating venue **on days within the festival range** that have child events there; label = festival name, sub-label = "N acts today".
- Child events at a festival venue collapse into the festival marker for that day (extends the existing location-grouping: group key becomes `festivalId ?? locationKey`).
- Tonight sonar ping unchanged — a festival happening tonight pings green.
- Tap → festival mini-overlay (name, today's bill at that venue, "Full lineup →" link to the festival page).

### 5.2 List view
Child events render as normal cards/rows with a compact green **`🎪 Part of {festivalName}`** badge linking to `/festivals/[slug]`. Additionally, a **festival banner card** renders once per day-group when a festival is active that day: full-width, poster thumbnail, name, venue/town, act count, price — above the individual gig cards. Multi-act day events keep the existing "Artist1 + N more" formatting.

### 5.3 EventInfoOverlay
When `festivalId` present: show festival name as the kicker/eyebrow, that day's ordered bill (billing tiers rendered as HEADLINE / SUPPORT chips, `billingOrder` sort), and the festival ticket CTA if the event has none of its own.

### 5.4 `/festivals/[slug]` — the branded page
Follows the venue-profile SSR pattern (`/venues/[venueId]`), one fetch via `GET /api/festivals/slug/{slug}`:

1. **Hero** — `heroImageUrl` (fallback: poster, then default bndy hero), festival name, dates, town, FREE/price pill, ticket CTA. Share buttons (the URL is the point — organisers will promote it).
2. **Theming** — reuse the existing `applyTheme()` CSS-variable pattern from `TenantContext`, scoped to the page: `Festival.theme` recolours primary/secondary/background/foreground. No theme set → default bndy neon. This makes per-festival branding ~free and safe (no arbitrary CSS).
3. **Day tabs** — one tab per date in range (single-dayers get no tabs). Within a day, group by stage (if `stages[]`) else by venue (multi-venue) else flat list.
4. **Lineup** — merged view of child events + unresolved lineup slots. Headliners rendered large (avatar, name, set time), support/general in descending emphasis. Resolved acts link to `/artists/[id]`; unresolved render as plain text (no dead links).
5. **Venue block** — single venue: venue card + directions. Multi-venue: small map with a green marker per venue.
6. **SEO/OG** — `generateMetadata` with poster as OG image; slug URLs are shareable and crawlable, which also feeds bndy's own discovery loop.

Discovery of pages in v1: badges, overlay links, and festival banner cards. A `/festivals` index page is v1.5.

## 6. Backstage (Phase 2 — organiser wizard)

Backstage already has `type: 'festival'` (🎪, green), `endDate`, and multi-artist scaffolding (`collaboratingArtistIds`, lead/support badges in calendar views). Phase 2 wizard, reusing PublicGigWizard steps:

1. **Festival basics** — name, dates, description, poster/hero upload, theme colours (colour pickers seeded from poster palette).
2. **Where** — primary venue or multi-venue picker; optional stages.
3. **Lineup builder** — per day/stage: search-or-invite artists, drag to order, tier chips (Headline/Support/General). Unmatched names become lineup slots.
4. **Tickets** — free/ticketed, price text, URLs (fest-level + per-day override).
5. **Review & publish** — creates Festival + child events with `source: 'user'` owner trust (owner > reviewed > source-runner > automated), stamping over any pre-existing discovered festival via `externalIds`/`search_festival` match rather than duplicating.

Frontstage `/new` community flow: unchanged in v1; add a "this is part of a festival" typeahead later.

## 7. Edge cases & rules

- **Unknown lineup** (Sandbach Rock & Pop): festival can exist with just name/venue/ticketUrl, `isPublic: false` until dated; page renders "Lineup TBA".
- **Unknown times, known date** (Wendy Kirkland): child event with `startTime` placeholder is not allowed (required field) — keep as lineup slot until time confirmed. Matches existing "re-check nearer the date" practice.
- **Tribute/set-name acts**: never create artist records for "90s Band Set" / "Ariana Grande tribute" — lineup slots only, resolve to real tribute-act artists if identifiable (act-qualifier rules, ADR-023: qualifier ≠ new artist).
- **Overlapping festivals at one venue**: group key `festivalId` keeps markers separate.
- **Festival spanning a week of unrelated bookings** (archetype B): only stamped events belong; the venue's other gigs that week are untouched.
- **Dedup**: same festival from two sources → `search_festival` + `externalIds` merge, exactly like venue/artist discipline.
- **Deletion/pruning**: festival page must not 404 after child events prune — page renders from festival + lineup history (per §3.5 graph note).

## 8. Phasing

| Phase | Scope | Unblocks |
|---|---|---|
| **1a** | Dynamo items + write API + MCP tools (`create_festival`, event linkage fields, lineup slots) | Importing Alsager (11 Jul), BachFest (18 Jul), Crewe Rocks (29–30 Aug) — data captured even before UI ships |
| **1b** | `/api/festivals/*` public reads; `events/public` returns `artistIds[]`+festival fields | Frontstage work |
| **2** | Frontstage: `/festivals/[slug]` page, list badges + banner card, overlay lineup | Public value; shareable URLs to promote |
| **3** | Map: festival marker variant + festivalId grouping | Full map experience |
| **4** | Backstage organiser wizard | Owner-trust festivals; organiser self-serve |

Sequencing rationale: 1a is small and time-critical (Alsager is 9 days out — capture now, display catches up). The page (2) lands before the map (3) because a URL is immediately useful and the marker work touches the freshly-redesigned marker system.

## 9. Open questions

1. Does the festival page live on live.bndy.co.uk (`/festivals/[slug]`) only, or do we eventually want vanity subdomains (alsager.bndy.co.uk) via the tenant machinery? (v1: path only.)
2. Per-day ticket URLs (Crewe Rocks daytime-free/evening-paid) — string `price` on festival + per-event `ticketUrl` is proposed as sufficient for v1. Confirm.
3. Should festival banner cards respect the user's radius filter by festival centre or by nearest participating venue? (Proposed: nearest venue.)
4. Poster upload for festivals — reuse `upload_event_poster` or new `upload_festival_asset` (hero + poster + theme extraction)?
