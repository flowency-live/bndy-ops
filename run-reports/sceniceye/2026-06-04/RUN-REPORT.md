# ScenicEye import — 2026-06-04 (scheduled run)

**Source:** https://scenicmind.co.uk/sceniceye · **Week on page:** Thu 4 – Sun 7 Jun 2026
**Fetch:** Chrome MCP (JS-rendered; web_fetch stale by design)

## Outcome
- **1 new event created** → Mark Harris @ Number 73 Bar & Kitchen, Thu 4 Jun 19:30 (`isPublic:true`)
  - event `d115ec6e-48aa-4569-b3cf-dfe2b62c73a5`
  - new venue `Number 73 Bar and Kitchen` `520e7bcd-…` (Google Places matched)
  - artist Mark Harris already existed (`d77f66b2-…`, Hampshire, FB present) → no create/enrich
- **13 rows skipped as duplicates** (Fri 5 – Sun 7 Jun) — already imported by the 2026-06-03 manual-paste run.
- **0 parking-lot rows** this week (no DJ-only / quiz / TBC).
- **0 new artists** — all 14 acts already in bndy.

## Why dedup was non-trivial
The 13 paste events had **empty `externalIds`**, so my reconstructed-key `get_by_external_id` lookups returned not-found. To avoid creating 13 duplicates I deduped by **content** (artistId + date + startTime) via `search_event`. Every Fri–Sun row matched an existing event exactly.

## Idempotency restored
Back-filled composite `sceniceye:` externalIds onto all 13 existing events (additive merge — Fantastic Planet kept its earlier `poster-import-2026-05-03` id). Verified round-trip on a sample. Next weekly run will dedup cheaply via `get_by_external_id`.

## Notes / data quirks
- Source spellings: "Pheonix Park" → bndy "Phoenix Park" (83%); "Pfizer Chiefs" → "The Pfizer Chiefs" (76%) — both confirmed same act via the existing dated event.
- Fantastic Planet existing event startTime is 20:00 vs source 20:30 — pre-existing minor discrepancy, left as-is (same event, not a dup).
- "Michelle Lewis & Cadency" co-bill exists keyed to Michelle Lewis as the single artistId; Cadency not linked as second artist (carried over from yesterday's paste). Left as-is.
