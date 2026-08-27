# Scenic Eye import run — 2026-06-13 (03:10 BST)

**Source:** https://www.sceniceye.co.uk/ (content frame https://scenicmind.co.uk/sceniceye)
**Guide week:** 11–17 June 2026 · Region Havant · Waterlooville · Emsworth · Hayling Island

## Summary
- Live guide had advanced to the **11–17 June** week (previous snapshot was 4–10 June, all past → nothing imported then).
- Thu 11 & Fri 12 gigs are **past** (today is Sat 13) → skipped, per "no past-dated public events".
- Imported **14 events** (9 on Sat 13, 5 on Sun 14), all `isPublic: true`, free door entry.
- **13 new artists** created (all enriched before create: type, genres, actType). **1 reused** (Leanne Weston).
- **0 new venues** — all 3 "missing" venues deduped to existing records via Google Place ID.

## Events created (14)
**Sat 13 Jun:** Jamie Hiron @ Ember Woodpecker (20:00) · Elvis Presley Tribute @ Southbourne Club (20:00) · The Moonshine Rascals @ Hampshire Rose (20:00) · The Pocket Rockers @ Leigh Park WMC (20:30) · King Mojo @ Lily's Bar (20:30) · Dan Barrow @ Prince of Wales (20:30) · Backbeat Trio @ Cowplain Social Club (20:45) · The Rooster Crows @ Old House at Home (21:00) · The Jaspers @ The Heroes (21:00)

**Sun 14 Jun:** Brooke Star @ West Town Inn (14:30) · Bullet Train @ Golden Lion (15:00) · James Austin @ Crown Inn Emsworth (15:00) · Leanne Weston @ Fox & Hounds (15:00) · Steve Hampton @ The Heroes (16:30)

## Artist dedup notes
- **Lianne Weston** (guide spelling) = existing **Leanne Weston** (Hampshire, 92–100% match, same act from prior week). Reused id `72b5da35…`; added "Lianne Weston" as a name variant; set actType covers.
- All 13 others returned no real same-name/same-region match → created new (all auto-flagged `needsReview`).

## Venue resolution notes
- **The Woodpecker Pub** → Google Place ID matched existing **"Ember Woodpecker"** (179 London Rd, PO7 7RL) — same pub, rebranded name. Used.
- **Leigh Park Working Mens Club** → matched existing "Leigh Park Working Men's Club" (439 Dunsbury Way, PO9 5BD). Used. (= the "Leigh Park Workies" of earlier weeks.)
- **Fox & Hounds** (guide gave town only, no street) → resolved to **The Fox & Hounds, 160 Stakes Hill Rd, Waterlooville PO7 7BS**. Correct town; looks right but worth a glance.

## ⚠️ Manual-review flags (NOT written to any bndy field)
- **Elvis Presley Tribute** — generic billing; no performer named in the guide. Created under the literal billing name. Candidate (unverified): "Sean Sings Elvis" — facebook.com/Seansingselvis (Portsmouth Elvis tribute). Rename + confirm if correct.
- **Dan Barrow** — candidate FB facebook.com/danbarrowmusic found but location not confirmed Havant; **not attached** (avoid wrong public avatar). Verify before adding.
- **Steve Hampton** — likely stevehampton.co.uk (Portsmouth vocalist, ex-collaborator of The Vapors/Joe Jackson); multiple ambiguous FB profiles, none attached.
- **King Mojo**, **Bullet Train**, **James Austin**, **The Moonshine Rascals**, **Backbeat Trio** — no confident Hampshire FB page (only same-name acts from wrong region/country). Created without FB; genres left minimal where unknown (King Mojo genres empty).
- **FB attached (high confidence):** The Pocket Rockers (pocketrockingmusic), The Rooster Crows (theroostercrowsband), The Jaspers (the.jaspers.homepage).

## Snapshot
Overwrote `sceniceye-last-page.txt` with the 11–17 June guide (2492 bytes).
