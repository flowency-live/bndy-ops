# ScenicEye import — 2026-06-06 (scheduled run)

**Source:** https://scenicmind.co.uk/sceniceye · **Week on page:** Thu 4 – Sun 7 Jun 2026 (not rolled)
**Fetch:** Chrome MCP (JS-rendered; web_fetch stale by design) · **Today:** Sat 6 Jun 2026

## Outcome — 5 new public events created

The page had **not** rolled to a new week (curator updates Thursdays; still the 4 Jun window). Since the 2026-06-05 run, the curator **added more acts** to the Sat 6 / Sun 7 tables. Those additions are the 5 genuinely-new events imported here. All created with `isPublic:true` and composite `sceniceye` externalIds; all 5 round-trip verified.

| Day | New events |
|---|---|
| Sat 6 Jun | Josh Tremain @ Kassia Drayton (19:30); Creative Covers @ The Royal British Legion Hayling Island (20:00); Keith Hayman @ Leigh Park Working Men's Club (20:30) |
| Sun 7 Jun | Adam Ede @ The Lifeboat Inn (15:00); Keith Simon @ Leigh Park Working Men's Club (15:00) |

## Row accounting (34 rows on page)

- **5 created** (above)
- **18 already in bndy** → skipped via `get_by_external_id` (from prior paste / 2026-06-04 backfill / 2026-06-05 run):
  - Sat 6 (11): Emily Martine, Will Tierney, Midnight Soul Train, Hot Fuzz, Nexus, Fantastic Planet, Baxtrax, Flynns Arcade, Presence, China Lake, Scarlett Ghosts
  - Sun 7 (7): Jess Johnson, Leanne Weston, Mikey May, Pfizer Chiefs, Ricky James, Just Sam, Dicey Riley
- **11 past-dated** (Thu 4 + Fri 5) → skipped: Mark Harris, Pheonix Park (Thu); DJ Dash, Helen Spooner, Pheonix Park, Tasmin Escott, Harrison Rhys, Misdirected, The Zed Men, Chloe Anne, Stockman (Fri)
- **0 parked**, **0 new venues**

## Artists

- **5 created** (Hampshire / `regional`, `actType: covers`):
  - **Keith Simon** — high-confidence FB: facebook.com/keithsimonmusic (dedicated "singer-performer" page); avatar set from FB; genres Pop/Soul.
  - **Adam Ede** — medium-high identity: singing guitarist (Worthing, West Sussex border), confirmed music handle instagram.com/adam_ede_music; no FB page found; genres Acoustic/Pop.
  - **Josh Tremain**, **Creative Covers**, **Keith Hayman** — no confident social match; created with default genres + `actType: covers` and **flagged for review** (see review-queue). Default genres are placeholders, not verified.

## Venues

No new venues. All 4 resolved to existing bndy records:
- Kassia Drayton (`8378dd0c`), Leigh Park Working Men's Club (`6e35b9e8`), The Lifeboat Inn (`096afdf6`) — from state.
- **The Royal British Legion Hayling Island** (`4153eabe`) — `search_venue` returned it at only 51% name score but the address (Legion Rd, Hayling Island), Google Place ID, and an **existing** `sceniceye` externalId make it a definite match → reused, not re-created.

## Cancellation review

- **Michelle Lewis & Cadency @ 282 Lovedean Lane (6 Jun, `744f8429`)** — imported from the 2026-06-03 paste; absent from the page since 2026-06-05 and **still absent today (the event date)**. Per spec cancellation policy this is a candidate, but the event is now same-day and `edit_event` exposes no `cancelled` field, so **not auto-cancelled / not deleted**. Jason to decide.

## Method notes

- External-id format: `sceniceye:<YYYYMMDD>|<venue-slug>|<HH:MM>|<artist-slug>` (id stored without the `sceniceye:` prefix; source is separate). Dedup clean — all 18 known rows resolved, all 5 new not-found.
- Smoke-test-then-fan-out: created Josh Tremain first, verified round-trip (externalIds persisted, isPublic:true), then created the other 4. Final verification round-tripped all 5.
- Artist `externalIds` confirmed persisting on create (the `edit_artist` response echo omits them but `get_by_id` / `get_by_external_id` confirm they are stored).
- Start-time only captured (end times on page ignored, per spec).
