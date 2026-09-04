# CJAB 2026 push — RUN REPORT — 2026-08-19

**Status: COMPLETED WITH ONE BLOCKER.** All 80 events are live and public. The festival
parent record is NOT created: `POST /festivals` returns HTTP 401 Not authenticated,
three attempts. Everything else succeeded.

## Counts

| What | Count |
|---|---|
| Events created, public, price FREE | 76 |
| Events that already existed, cjab externalId merged on | 4 |
| Venues resolved to existing records | 12 |
| Venues created (Google Places verified, all matchConfidence 100) | 10 |
| Artists created | 53 |
| Artists resolved to existing records | 28 |
| nameVariants added post-create | 13 |
| Defaulted start times | 0 — every time came from the programme |

## The 4 pre-existing events (dedup gate fired correctly)

| Existing event | Source that got there first |
|---|---|
| `ac447924` Chloe Chadwick Band @ Town Hall | cowork-discovery |
| `410d58bc` Jane and the Hurricanes @ The Black Bear | cowork-discovery |
| `43a26b7a` Dawson Dean @ Higher Ground Cafe & Bar | klma |
| `7d270668` ÜL†RᛟɣᛨɸLE† @ The Beartown Tap | klma |

Each now carries the cjab externalId as well. Re-running this import is a no-op.

## Excluded by design

Drumroots Drumming Workshop (workshop, not an act) · Rumba Saturday 20:30 slot (act TBC
in programme) · Beartown Stompers umbrella march on Little Street (street event, no venue;
the Stompers artist record exists for future gigs).

## DEFECTS confirmed this run — for the CTO inbox

1. **`POST /festivals` HTTP 401 Not authenticated.** New since the redeploy. GET routes fine.
   Every other lambda accepts the same MCP caller. Festival record + lineup + festivalId
   attachment on all 80 events are BLOCKED on this. One `edit_event` pass finishes the job
   once fixed — all events carry `cjab` externalIds.
2. **`create_artist` 500 with `nameVariants` + `externalIds`** — the 2026-08-08 inbox defect
   REPRODUCED 3/3, zero failures after dropping nameVariants. Workaround used: create bare,
   `edit_artist` variants after.
3. **Identity resolver ignores location.** "Diablo Trio" (Congleton) auto-matched to Diablo
   (Gosforth) by normalised name, `action: matched`, no review offered. V5a says distinct.
   `confirmNew: true` on retry forced the correct create, but a naive import would have
   hung Congleton gigs on a Tyneside band.
4. `delete_artist` succeeded earlier today while REPORTING failure (ARTIST_NOT_FOUND).
   Logged this morning, still true.

## Loose ends

1. Chloe Chadwick / Dawson Dean / Jane / Ultraviolet pre-existing events: titles differ in
   style from the cjab batch ("(Congleton Jazz & Blues Festival)" suffix). Left as found.
2. Venue names came back from Google as canonical forms: "Barley Hops & grape",
   "DV8 Bar & Lounge", "No 15 Bar & Grill Congleton", "Rumba Congleton", "The Olde Kings
   Arms", "Congleton Rugby Union Football Club and Congleton Cycling Club". Rugby club
   name is a mouthful; rename if it renders badly.
3. 53 new artists are aiCreated + needsReview — they queue for the review flow as designed.
   Enrichment (FB-verified genres, bios) waits on Chrome coming back.
4. Congleton fallback location (§0.7) used on 24 artists with no evidenced base. Flagged
   in the capture JSON, correctable by enrichment.
