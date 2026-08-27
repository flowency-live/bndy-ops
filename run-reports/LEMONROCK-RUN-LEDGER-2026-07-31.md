# LEMONROCK TORBAY BASELINE — RUN LEDGER 2026-07-31

**Lane:** `lemonrock-baseline` (runbook v1.11 §6) · **Region:** Torbay core · **Source id:** `lemonrock`
**Mode:** Jason gave blanket go/no-go for the whole run (supersedes per-batch sign-off for this run only).

## ROLLBACK HANDLE
Every record created carries `externalIds: [{source: "lemonrock", id: ...}]`.
To undo the entire run: **delete all artists, venues and events whose externalIds contain `source = "lemonrock"`.**
Delete **events first, then artists, then venues** — deleting artists first orphans their events (So-Oasis incident, 2026-07-29).

- Venue externalId = Lemonrock venue slug
- Artist externalId = Lemonrock band slug, or `act-<slug>` where the act has no Lemonrock page
- Event externalId = `<lemonrockGigId>-<YYYY-MM-DD>`

## WHAT IS LIVE IN BNDY RIGHT NOW
| | Created | Notes |
|---|---|---|
| Venues | **34** | every one matched to a Google Place ID at 100% confidence |
| Artists | **13** | the 13 highest-volume Torbay acts |
| Events | **38** | all `isPublic: true` — confirmed map-visible by the API |

Events span **31 Jul → 15 Aug 2026**. Coverage is deliberately depth-first: the busiest venues and the acts that play them, nearest dates first, so the map reads as dense and current rather than thin and scattered.

**Where it stopped:** 141 of the 179 events available *for these 13 artists* are still to create, resuming at **2026-08-15**. Beyond that there are ~100 more accepted acts and ~80 more venues in the Torbay corridor. The stop was a working-context limit in this session, not an error — everything needed to resume is in `lemonrock-torbay-ids.json`.

## SOURCE FACTS (Torbay, measured)
- 129 venues in the Torbay corridor; 115 with future gigs
- 654 future gigs, 31 Jul → 31 Oct 2026 (the gig feed's fixed ~3-month horizon)
- 172 distinct acts; 141 needed for the venues taken; 129 accepted after the reject filter

## DEFECTS FOUND AND FIXED DURING THE RUN
1. **Repeating gigs share ONE Lemonrock gig id.** Abbey Lawn returned gigId `932920` for all 13 Simon Gee Sundays. The build spec's `source_event_id = gig id` would have collapsed 13 events into 1. **Event externalId is now `<gigId>-<date>`.**
2. **HTML-escaped ampersand stored literally.** "Guy &amp;amp; The Upbeats" was created and corrected via `edit_artist` to "Guy & The Upbeats" (id `9dc5ce6a`). No other artist was affected — venues were unaffected because Google Places returns the canonical name.
3. **Numeric venue index is `_start=9`, not `_start=123`** (collector bug, already in the plan doc).

## REJECTED BY THE §6 FILTER (Lemonrock's own genre field — no name-guessing)
| Act | Gigs | Reason |
|---|---|---|
| Target Audience Promotions | 46 | DJ / promoter, not an act |
| Karaoke & Disco | 13 | Karaoke |
| Quiz Night | 13 | Non-music |
| Vinyl Avengers | 7 | DJ |
| Metal Monday | 5 | DJ |
| Open Mic Night | 5 | Open mic |
| Rad Entertainment DJ | 2 | DJ |
| Ibiza House & Trance Classics (After Dark) | 1 | Dance / DJ |
| Red Entertainment | 1 | Karaoke |
| Djr | 1 | DJ |
| *(2 more)* | | |
**Total rejected: 12 acts / 96 gigs.**

## OPEN ITEMS FOR REVIEW
- **All artists created carry `facebookUrl` blank and are `fb-pending`.** Runbook §2A.5(b) requires a source-supplied FB page to be VISITED before attaching; there was no time to visit them in this run, so nothing was attached. Blank beats wrong — the Lemonrock-supplied links (~18% of acts) remain in the source for the nightly enrichment task to verify and attach.
- **`actType` not set on any artist.** `create_artist` has no actType field; it needs an `edit_artist` follow-up pass. Lemonrock's `Originals/Covers` field supplies the answer for ~90% of acts — a cheap follow-up job.
- **`DT's`, Torquay** — supplied "73 Belgrave Road", Google returned "73 South St" on the same postcode TQ2 5AA. Postcode agrees so it was accepted; worth an eyeball.
- **`The Albert Inn`** → Google "The Albert Inn Bridgetown Brewery"; **`Arena`** → matched an existing bndy venue "Arena Torquay" by place_id. Both correct, both logged per §3.3.
- **26 of 141 acts have no Lemonrock band page** — they carry no declared genre/format/location, so location fell back to the gig town per §0.7.
- Every artist and event is flagged `needsReview: true` and `aiCreated: true` by the backend, as designed.

## VENUE ID MAP
See `lemonrock-torbay-ids.json` (committed alongside this file).
