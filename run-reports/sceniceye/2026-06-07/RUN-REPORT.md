# ScenicEye import — 2026-06-07 (scheduled run)

**Source:** https://scenicmind.co.uk/sceniceye · **Week header on page:** 4 June – 10 June 2026
**Fetch:** Chrome MCP (JS-rendered; web_fetch stale by design) · **Today:** Sun 7 Jun 2026

## Outcome — 0 new events (nothing to import)

The page has **not rolled** to the next week. The yellow banner range now reads "4 June – 10 June 2026" (changed from the effective "Thu 4 – Sun 7" window yesterday), but the curator has **not added any Mon 8 / Tue 9 / Wed 10 June day-tables** — the only day-tables present are still Thu 4 → Sun 7 Jun, identical to the 2026-06-06 snapshot.

Today is Sunday 7 Jun, so only the 9 Sunday rows are current. **All 9 are already in bndy** (imported across the 2026-06-04 backfill, 2026-06-05 and 2026-06-06 runs). Everything Thu 4 / Fri 5 / Sat 6 is past-dated. Net result: no import, mirroring the 2026-06-03 scheduled run.

## Row accounting (34 rows on page)

- **0 created**
- **9 already in bndy** (Sunday 7 Jun) → dedup-skipped. Spot-verified live via `get_by_external_id` (4 of 9, one per id-format era — all found, `isPublic:true`); remaining 5 confirmed in state.events:
  - Jess Johnson, Leanne Weston, Mikey May, Pfizer Chiefs, Adam Ede, Keith Simon, Ricky James, Just Sam, Dicey Riley
- **25 past-dated** → skipped:
  - Thu 4 (2): Mark Harris, Pheonix Park
  - Fri 5 (9): DJ Dash, Helen Spooner, Pheonix Park, Tasmin Escott, Harrison Rhys, Misdirected, The Zed Men, Chloe Anne, Stockman
  - Sat 6 (14): Emily Martine, Will Tierney, Josh Tremain, Creative Covers, Midnight Soul Train, Hot Fuzz, Nexus, Fantastic Planet, Baxtrax, Flynns Arcade, Presence, China Lake, Scarlett Ghosts, Keith Hayman
- **0 parked**, **0 new artists**, **0 new venues**

## Notes

- **DJ Dash @ The Centurion** (Fri 5 Jun) is a DJ-only `non_artist_event` but past-dated, so skipped as past rather than parked.
- **Cancellation candidate** Michelle Lewis & Cadency @ 282 Lovedean Lane (6 Jun, `744f8429`) — flagged 2026-06-05/06 as off-page; now past-dated, so **moot**. No action.
- Outstanding 2026-06-06 review-queue items (Josh Tremain, Keith Hayman — no confident social) are unchanged; their events are now past. No new review items today.
- Recommendation for next run: the curator updates the page Thursdays. The next genuinely-new content (week of ~11 June onward) should appear after Thu 11 Jun. Today's run had nothing actionable.

## Method

- Single Chrome-MCP render of the live page; full day-table text extracted and diffed against the 2026-06-06 snapshot and the 9 Sunday entries in `state/sceniceye.json`.
- External-id format unchanged: `sceniceye` source + id `<YYYYMMDD>|<venue-slug>|<HH:MM>|<artist-slug>`.
- No writes to bndy this run (read-only dedup checks only).
