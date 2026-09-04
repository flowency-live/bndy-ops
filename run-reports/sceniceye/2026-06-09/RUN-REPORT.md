# ScenicEye import — 2026-06-09 (scheduled run)

**Source:** https://scenicmind.co.uk/sceniceye · **Week header on page:** 4 June – 10 June 2026
**Fetch:** Chrome MCP (JS-rendered; web_fetch stale by design) · **Today:** Tue 9 Jun 2026

## Outcome — 0 new events (nothing to import)

The page has **not rolled**. The yellow banner still reads "4 June – 10 June 2026" and the only day-tables present are **Thu 4 → Sun 7 Jun** — the identical 34-row set seen on 2026-06-06 and 2026-06-07. The curator still has **not added** Mon 8 / Tue 9 / Wed 10 June tables, and there is no next-week (11–17 Jun) content.

Today is **Tuesday 9 Jun**, so the newest table on the page (Sun 7 Jun) is now itself past-dated. **Every one of the 34 rows is past** — there are no current or future rows at all. All were already imported across the 2026-06-04 backfill, 2026-06-05 and 2026-06-06 runs. Net result: no import, an even cleaner null run than 2026-06-03 / 2026-06-07 (those still had a current day).

## Row accounting (34 rows on page)

- **0 created**
- **0 current/future rows** (nothing dated >= 2026-06-09 on the page)
- **34 past-dated** → skipped:
  - Thu 4 (2): Mark Harris, Pheonix Park
  - Fri 5 (9): DJ Dash, Helen Spooner, Pheonix Park, Tasmin Escott, Harrison Rhys, Misdirected, The Zed Men, Chloe Anne, Stockman
  - Sat 6 (14): Emily Martine, Will Tierney, Josh Tremain, Creative Covers, Midnight Soul Train, Hot Fuzz, Nexus, Fantastic Planet, Baxtrax, Flynns Arcade, Presence, China Lake, Scarlett Ghosts, Keith Hayman
  - Sun 7 (9): Jess Johnson, Leanne Weston, Mikey May, Pfizer Chiefs, Adam Ede, Keith Simon, Ricky James, Just Sam, Dicey Riley
- **0 parked**, **0 new artists**, **0 new venues**

## Notes

- No bndy writes were made this run (no current/future rows to dedup or create).
- **DJ Dash @ The Centurion** (Fri 5 Jun) remains a DJ-only `non_artist_event`, but past-dated so skipped as past, not parked.
- Gap: no 2026-06-08 scheduled run was recorded (state `last_run` was 2026-06-07). It would have made no difference — on 8 Jun only the Sun 7 rows would have been past, all already in bndy.
- Outstanding review-queue items from prior runs (Josh Tremain, Keith Hayman, Stockman, Leanne Weston — no/low confident social) are unchanged and now past-dated. No new review items today.
- **Recommendation:** the curator rolls the page on Thursdays. Genuinely-new content (week of ~11 Jun) should appear after **Thu 11 Jun**. The 2026-06-09 and 2026-06-10 scheduled runs are likely to be null too unless he edits the current page early.

## Method

Chrome MCP `navigate` to https://scenicmind.co.uk/sceniceye → 5s hydrate wait → JS extraction of the 4 day-tables (Act/Venue/Time). `www.sceniceye.co.uk` alias rendered a blank body; the canonical `scenicmind.co.uk/sceniceye` hydrated correctly. All 34 rows parsed, every date < today → no import path entered. Snapshot + this report written to data/normalized/sceniceye/2026-06-09/.
