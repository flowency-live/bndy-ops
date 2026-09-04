# ScenicEye import — 2026-06-05 (scheduled run)

**Source:** https://scenicmind.co.uk/sceniceye · **Week on page:** Thu 4 – Sun 7 Jun 2026
**Fetch:** Chrome MCP (JS-rendered; web_fetch stale by design) · **Today:** Fri 5 Jun 2026

## Outcome — 14 new public events created

The page had **not** rolled to a new week (curator updates Thursdays, last rolled 4 Jun), but Neil had **added many acts** to the Notion list since the 2026-06-03 paste / 2026-06-04 scheduled run. Those additions are the 14 genuinely-new events imported here. All created with `isPublic:true` and composite `sceniceye:` externalIds; round-trip verified on a sample.

| Day | New events |
|---|---|
| Fri 5 Jun | Helen Spooner @ Stansted Park Garden Centre (14:30); Harrison Rhys @ The Exchange (20:00); Misdirected @ The Heroes (20:30); Zed Men @ The Crown Inn Emsworth (20:30); Chloe Anne @ The Lifeboat Inn (21:00); Stockman @ The Lord Raglan (21:00) |
| Sat 6 Jun | Emily Martine @ West Town Inn (16:00); Will Tierney @ The Huts Emsworth (19:00); Midnight Soul Train @ The Heroes (20:30); Hot Fuzz @ The Cricketers (20:30); Presence @ The Westleigh (21:00) |
| Sun 7 Jun | Leanne Weston @ The Fox & Hounds (15:00); Just Sam @ The Heroes (16:30); Dicey Riley @ The Stags Head (17:00) |

## Row accounting (29 rows on page)

- **14 created** (above)
- **12 already in bndy** → skipped via `get_by_external_id` (imported by the 2026-06-03 paste + back-filled 2026-06-04): Tasmin Escott, Pheonix Park (Fri); Nexus, Fantastic Planet, Baxtrax, Flynns Arcade, China Lake, Scarlett Ghosts (Sat); Jess Johnson, Mikey May, Pfizer Chiefs, Ricky James (Sun)
- **2 past-dated** (Thu 4 Jun) → skipped: Mark Harris (already imported 2026-06-04), Pheonix Park
- **1 parked** → DJ Dash @ The Centurion (Fri, DJ-only `non_artist_event`)

## Artists

- **2 already known** (state): Harrison Rhys, Will Tierney
- **3 existing linked** (search_artist): Helen Spooner (100%, Hampshire), Zed Men (bndy name lacks "The"; normalised-equal + Hampshire + FB TheZedMen), **Presence (100% but generic name — see review flag)**
- **9 created** (Hampshire / `regional`, FB avatar auto-fetched):
  - High-confidence FB + genres + actType=covers: Misdirected, Chloe Anne, Midnight Soul Train, Hot Fuzz, Just Sam, **Dicey Riley (corrected to a duo — father-son Tony & Nicholas Day)**
  - No/low FB (basic create, flagged): **Stockman** (no FB; type guessed band), **Emily Martine** (FB candidate unverified for the Hayling act), **Leanne Weston** (no FB)

## Venues

No new venues. The Huts Emsworth (existing, 100%) linked with a sceniceye externalId; The Westleigh + The Fox & Hounds already carried sceniceye externalIds; all others existing.

## Review flags (in `data/review-queue/sceniceye/2026-06-05-review-flags.json` — never written to bndy)

1. **Presence** — auto-linked to existing generic-named bndy artist with empty location; verify it's the same act, unlink if wrong.
2. **Emily Martine / Stockman / Leanne Weston** — FB enrichment incomplete; held for review.
3. **Michelle Lewis & Cadency @ 282 Lovedean Lane (6 Jun, `744f8429`)** — imported from the 2026-06-03 paste but **no longer on the page**. Per the spec cancellation policy this is a cancellation candidate; **not auto-cancelled** (edit_event exposes no `cancelled` field). Jason to decide.

## Method notes

- External-id format confirmed working post-backfill: `sceniceye:<YYYYMMDD>|<venue-slug>|<HH:MM>|<artist-slug>` — known events resolved, new ones not-found, so dedup was clean via `get_by_external_id` (no content-search fallback needed this week).
- Smoke-test-then-fan-out: created Helen Spooner first, verified round-trip (externalIds persisted, isPublic:true), then created the other 13.
- Start-time only captured (end times on page ignored, per spec).
