# GIG SPIDER NIGHTLY — TASK DEFINITION v1.0 DRAFT (2026-07-29, Jason rulings baked in)

**SUBORDINATE TO `MASTER-IMPORT-RUNBOOK.md` (v1.9+).** Source id: `gig-spider`. Scheduling Jason-only; **first run SUPERVISED before any schedule** (qualification doctrine — this is new logic).

**OUTPUT CONTRACT:** Every run MUST also comply with `RUN-CONTRACT.md` v2.0+ and emit a valid append-only record under `run-ledger/`, including enrichment and canonical read-back evidence.

## Mission (Jason, 2026-07-29)
Nightly organic growth: for existing artists, find gigs bndy doesn't have (their FB page/events + proven sources) and add them — including new venues those gigs reveal. For each venue (existing + newly found), find other acts gigging there and add them with their events. Recurse. **The spider MAY create artists, venues and events unattended — that is what the gates are for** — subject to the evidence bar and caps below.

## Corridor (Jason ruling)
**Southport & Liverpool (west) across to Hull & Skegness (east), and all cities between** — the trans-Pennine belt: Liverpool/Merseyside, Wigan, Manchester/Stockport, Bolton/Bury/Rochdale, Huddersfield, Leeds/Bradford, Wakefield, Sheffield, Doncaster, York, Hull, Lincolnshire coast to Skegness. Existing patches (Stoke, NE, Hampshire, Derbyshire) remain in scope for DENSIFYING known records; NEW-entity discovery prioritises the corridor.

## Per-night procedure
1. Pick the work batch: artists/venues least-recently spidered (track `lastSpidered` in the run ledger file, NOT in bndy — §0.12), corridor-weighted.
2. ARTIST pass: open the artist's FB page (Chrome) → events tab/pinned gig lists → for each future gig ≤12 months: resolve venue (§3; create with place_id if new), create event (§5, artist's own page = authoritative for time/price). Artist-page gig lists (posters, pinned posts) count — e.g. Ska Council's 6-gig post.
3. VENUE pass: venue FB page/events + proven listings → each future gig: resolve act per §1A/§2A (enrich-inline, tightened §2A.3: FB search in Chrome + page visit; act's own page name wins) → create artist if evidence met, else STAGE the row (blank stubs are §2A.5-legal ONLY when an identification attempt failed; an unattended spider prefers staging over stub-creation for brand-new acts with zero corroboration).
4. New entities found this night join the ledger for future passes (recursion happens across nights, not within one).
5. Evidence bar for unattended creates: artist = own FB page confirming the gig OR two independent proven sources; venue = Google place_id (§0.8). No bar met → staged row in run report.
6. **FB event detail pages are the identification instrument (Jason, 2026-07-29)**: "Meet your hosts" lists TYPED pages — the Musician/band host is the act (definitive + FB URL for enrichment), the venue-typed host is the venue's FB. Open the event page whenever a gig is found via FB; harvest both links every time.

## Caps & discipline
Max 50 creates/night (§6 — Jason raises per-run only). Run report + ledger update every night. Every §0 rule applies; cancellations per §0.17 v1.9 only when the artist's own page says cancelled.

## Build notes (before first supervised run)
- Ledger file: Projects/bndy/spider-ledger.json (entity id → lastSpidered, source of discovery).
- Seed queue: corridor venues/artists from gigs-news (Stockport ring), fantasticallibrary (Derbyshire), plus map clusters.
- OPEN: Jason to confirm whether staged-vs-create for zero-corroboration acts matches his intent ("create everything" vs junk risk from venue-page misreads).
