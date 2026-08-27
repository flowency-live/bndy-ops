# ONTHECASE FULL SUPERVISED RUN — 2026-07-29 (uncapped, Jason-authorised)

Runbook v1.9 discipline; source onthecasemusic.co.uk/gigs read via Chrome. Feed publishes ~17 months ahead: 269 rows total → 238 processable within the 12-month horizon (4 "to be confirmed" dropped per §0.4; 27 rows beyond Jul 2027 left for future diffs). Pre-flight matched the entire feed against full artist (1,251) and venue (1,465) tables before any write.

## Totals
- **Artists**: 86 of 109 matched existing NE records · **16 created** (7 enriched with FB/website at create per §2A.5: Anna Reay ece2a565, Rayven Skye b1c8f061, Mad Manners 8c4c7181, Mike Gatto 9074fa0a, Charlotte Forman ba1a508a, Scratch 62b68437, Urban Starz 82cb24d4; 9 created blank-with-flag after failed FB attempts: Assassin d2fc2a0a, Beer Monkeys 17eaa55f, Charlie fc46fa85, Dean Palmer c7108e39, Heather Cotton ee73f9e5, Jonny Trax d3d665d5, Kelly Rox eee701dd, Lynch Mob caec2eb0, Miranda Newton 6da70709) · 1 resolver review staged (below).
- **Venues**: 28 of 31 matched existing (incl. place_id catches under variant names: Murton Club (Official), Fat Ox Hotel, The Bridle Path, Easington Colliery Club & Institute, Clennell Hall Country House) · **3 created**: Seven Stars Ponteland 2ac411a0, Sun Inn Morpeth d8914b53, The Turbinia 8d652f5f. Zero venue twins.
- **Events**: all **235 queue rows verified in bndy** — created by the worker sweep with `onthecasemusic` externalIds, or bounced against pre-existing events (natural-key match from earlier imports). Final verification sweep: 0 created / 235 duplicate / 0 errors. Every event carries an explicit source time — zero defaulted times this source.

## Fixes & rulings executed (Jason live)
- **New Hartley venue twin deleted**: "New Hartley SMC New Hartley" (69c05b07, zero events) removed; keeper = New Hartley Memorial Hall 2a48a6a4.
- **Cancellation executed (§5.7/§0.17 v1.9)**: 1977 @ New Hartley Memorial Hall 2026-08-01 (ca8853e7) — row removed from source → event deleted on Jason's confirm.
- **Changed row (§0.17 edit)**: Hybrids 2026-08-01 moved Clousden Hill → The Red Lion Earsdon, 20:00 (event 9e97f365).
- **Riff Raff resolved by footprint (§1A.2)**: the "Oldham" record b88a13b3 is a NW touring band with an established NE footprint (Crook Hotel, Lindisfarne Wallsend/Zombie Fest, Crown and Cannon 13 Sep 18:00 — the sheet's exact row, already in bndy). Same band; no NE twin created.
- **Billing aliases (Jason ruling, Danny Brab pattern)**: "Russ Tippins Electric Band" → Russ Tippins d00d1abd · "Dogs In A Box Duo" → Dog In A Box e9e0b454 · "Rock & Roll Preachers"/"Rock n Roll Preachers" → Rock and Roll Preachers 1382449f · "Mad Manners - One Man Madness Show" → Mad Manners (billing in event titles only).

## STAGED (awaiting Jason)
1. **Rock Doctors @ Ox & Plough Washington 2026-07-31 21:00** — existing record says "North West UK", zero events; FB search found only AU/US/East-Anglia same-name acts. Unproven either way → not created, not matched.
2. **Undecided Acoustic Duo @ Sun Inn Morpeth 2026-07-31 21:00** — resolver review with only 60% fuzzy candidates (Undercover variants — none plausible). Needs "genuinely new" confirm.

## Incident note
The event-firing worker launched at ~16:5x ran to completion even though its permission prompt appeared rejected during Jason's app restart — discovered when re-fired rows bounced on their own externalIds. No damage (gates made the replay idempotent; final sweep proved 100% coverage), but logged as a product quirk: a rejected-looking background task may still have run.

## Follow-ups
- 16 new artists in review queue (aiCreated/needsReview). actType left empty pending evidence (§0.18).
- 9 blank-FB artists flagged for future enrichment on contact.
- Snapshot rewritten in capture format (pipe rows, full feed incl. beyond-horizon) → onthecase-last-page.txt.
- OnTheCase qualified for scheduling once the two staged rows are ruled; Jason to create the schedule (one source/day).
