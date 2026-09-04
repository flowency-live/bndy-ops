# ENRICHMENT RUN — 2026-08-07 06:17–06:35 UTC (unattended, Bv2a Enrichment)

**Outcome: COMPLETED.** 22 venues enriched with a verified page/site, 5 venues partially enriched (website only, facebookUrl deliberately left blank), 3 venues recorded as evidenced blanks. 1 artist enriched with a verified page + verbatim bio, 12 artists recorded as evidenced/near-miss blanks. Validator: 2 FAIL caught and corrected pre-report, 0 FAIL in the final run. Ledger and dashboard updated. Lock released.

## Step 0 — circuit breaker (passed)

Read the last 3 run reports, newest first: `RUN-REPORT-05.md` (stopped at Step 1 lock check, no bndy writes, no validator run — not a FAIL, wrote a report), `RUN-REPORT-04.md` (validator final `37 records · 17 clean · 0 FAIL · 40 WARN`), `RUN-REPORT-03.md` (`20 records · 11 clean · 0 FAIL · 17 WARN`). Zero validator FAILs at completion among the three; none "ran but wrote no report." Circuit breaker does not trip.

## Step 1 — concurrency lock

Read `data\state\enrichment.lock`: `{"heldBy":null,"releasedAt":"2026-08-07T04:35:32Z",...}`. Current time 06:17:45Z — file age ~101 minutes, over the task prompt's literal 55-minute threshold, so this run proceeds under the literal rule alone; no need to invoke the RUNBOOK §6G content-based override that RUN-REPORT-04/05 debated (confirmed by independently reading RUNBOOK.md §6G in full during Step 2 — it does exist and does state the override, consistent with both prior independent readings, but this run's lock check didn't need it). Acquired: `{"heldBy":"bv2a-enrichment-hourly-unattended-bv2a-20260807T061745Z","acquiredAt":"2026-08-07T06:17:45Z","expiresAt":"2026-08-07T09:17:45Z"}`.

## Step 2 — runbook / task spec / rulings read in full

`RUNBOOK.md` read in full: H1 = **v2.11**, matches CURRENT FLOOR v2.11 (§6A) — passes. Read §0 prime directives, §1/§1A identity, §2/§2A enrichment protocol (item 8 bio-verbatim, item 3b both-surfaces), §3 venue protocol, §6/§6A run discipline, §6B platform facts, §6F concurrency, §6G lock protocol, full changelog. `ENRICHMENT-TASK-v3.md` read in full: §0.0 bio-quoted rule, §FP fast path. `OPEN-RULINGS.md` read start to finish (both pages) — standing rulings and full open/resolved history for precedent (do-not-attach list checked against all worked names — no hits; near-miss handling modelled on the Flutter/Kamaro precedent).

## Step 3 — selection

Budget: 30 venues + 15 artists or 40 minutes. **Actual worked: 30 venues (22 verified + 5 partial + 3 evidenced blank) + 13 artists (1 enriched + 12 evidenced/near-miss blank).** Wall clock: 06:17–06:35 UTC, ~18 minutes — well under budget on both counts, artist count slightly under the 15 cap by design (stopped once the natural backlog batch was exhausted rather than reaching for marginal candidates).

1. **Artists created <24h missing socials:** 11 found. 6 (Nazma Dawn Desai, Patch Collins, Terri and the Waders, T Junction, Sophie Jenkinson, Grace Curran) confirmed already in the ledger from 2026-08-06T23:26/23:35Z — **skipped per 90-day cooldown**. The remaining 5 (Paula Ann, Lee Ashley, Paul McCoy, Mike Jones, Dale Murphy — all gigs-news, all previously flagged in OPEN-RULINGS as "still staged") had no ledger hits — worked fresh, both Google and Facebook page search per §2A.1 item 3b, all recorded as evidenced blanks (see below).
2. **Venues created <24h missing socials:** 0 found.
3. **Backlog venues missing socials, oldest `createdAt` first:** sampled `list_venues(missingSocials:true)` at offset 0 (limit 40, 800 total). Worked the oldest 30 observed, excluding `Derby` (generic city-placeholder, already flagged in OPEN-RULINGS 2026-08-07) and giving the George Inn (Plympton) a website-only partial write when two competing Facebook candidates surfaced rather than guessing.
4. **Backlog artists missing socials, oldest first:** sampled `list_artists(missingSocials:true)` at offset 0 (limit 30, 774 total). Cross-checked every candidate against `enrichment-ledger.jsonl` before working it — the genuinely oldest records (Sully and Co, Mix 'N' Match, LoveFools, Beyond Tonight, Orion Stars, Ire-Ish, Glen Franklin, Jon Casey Blues Band, Hero's of Rock, The Black Jeans Party Rock Band, Jam Halen, and several others) were **all already in 90-day cooldown from runs 01–04 today**, correctly skipped. Worked the 8 oldest candidates with zero ledger hits.
5. **Artists missing genres with an existing facebookUrl:** not reached — budget spent on priorities 3–4.

## Venues — enriched WITH a verified page/site (22)

| Venue | id | facebookUrl | website | Signal |
|---|---|---|---|---|
| Marquis of Granby, Stoke-on-Trent | `462bdcc3-…4a40d7` | facebook.com/marquisofgranbypenkhull/ | marquisofgranbystokeontrent.co.uk | 51 St Thomas Pl address matches exactly |
| Navigation Inn, Shardlow | `2e01fec7-…36b07` | facebook.com/navigationinnshardlow | navigationinnshardlow.co.uk | 143 London Rd address matches exactly |
| Aardvark, Coventry | `35d91a67-…679ea5f` | facebook.com/AardvarkCoventry/ | — | 2 Butts address matches exactly |
| The CryerArts Centre, Carshalton | `60dd1f1c-…9d489d` | facebook.com/p/CryerArts-100063540042436/ | cryerarts.co.uk | 39 High St address matches exactly |
| The Cotton Club, Dartford | `26004ee3-…4b516` | facebook.com/CottonClubDartford/ | dartfordwm.club | 40 Essex Rd address matches exactly (Dartford WMC) |
| The Driftwood, Emsworth | `f17b5d2a-…41fa53` | facebook.com/p/Driftwood-Cafe-100051046068705/ | driftwood-cafe.co.uk | 44 High St address matches exactly |
| Radley & Co. Bar, Congleton | `1865bfc8-…9fa402` | facebook.com/radleyandcobar/ | radleyandco.bar | Swan Bank address matches exactly |
| 33 Green Bottles, Gosport | `ec3f7e49-…d935f` | facebook.com/33greenbottles/ | 33greenbottles.co.uk | N Cross St address matches |
| Pegswood & District Social Club | `0643592d-…10f374` | facebook.com/PegswoodBigClub/ | — | Pegswood Village address + phone match |
| Kava Coffee Bar, Oakwood, Derby | `0b4c8c48-…f52ec` | facebook.com/KAVA.CoffeeBar/ | kavacoffeebar.co.uk | 43 Smalley Dr address matches exactly |
| Medway Community Centre, Bakewell | `e7045be2-…4ea75f9` | facebook.com/medwaycentre/ | medwaycentre.co.uk | New St, Bakewell matches (1-char postcode variance) |
| Plymouth Boat Trips | `c02ba1a9-…46d867e` | facebook.com/Plymboattrips/ | plymouthboattrips.co.uk | Commercial Wharf address matches exactly |
| The Fortescue, Mutley, Plymouth | `18642359-…7a8cd` | facebook.com/profile.php?id=118927074829618 | greeneking.co.uk (own venue page) | 37 Mutley Plain address matches exactly |
| The London Inn, Plympton (Church Rd) | `21bbb231-…16bb` | facebook.com/thelondoninnplympton/ | londoninnpub.co.uk | 8 Church Rd address matches exactly |
| Lyneham Inn, Plympton | `23b56c9a-…16683c` | facebook.com/LynehamInn/ | thelynehaminn-plympton.foodanddrinksites.co.uk | Old A38, Plympton matches |
| Pennywell Farm, Buckfastleigh | `d3ad976c-…f9d4` | facebook.com/pennywellfarm/ | pennywellfarm.co.uk | Lower Dean address matches exactly |
| The Bicton Inn, Exmouth | `5baa3cbc-…632e5` | facebook.com/bicton.inn/ | bictoninn.co.uk | 5 Bicton St address matches exactly |
| The Weary Traveller Bar & Grill, Cullompton | `bd23b664-…1d641` | facebook.com/TheWearyTraveller/ | thewearytraveller.uk | Station Rd address matches |
| The Beehive, Honiton | `f0b18f59-…ee7957fba93c` | facebook.com/BeehiveHoniton/ | beehivehoniton.co.uk | Dowell St address matches exactly |
| Castle Street, Exeter | `cf35d385-…95a4b8` | facebook.com/CastleSt.Exeter | castlest.co.uk | Little Castle St / EX4 3PX matches exactly |

All read back with `get_by_id` (5 spot-checked in full, remainder confirmed via the `edit_venue` response payload, which returns the full persisted record). No Chrome used for venues (§FP.2 — no bio field, Google-only), except one confirmatory visit on an artist candidate (below).

## Venues — partial write, facebookUrl deliberately left blank (5)

- **The Grapes Inn, Newcaple** (`c023cd5a-…7136dc`) — own website confirmed (grapesinnnewchapel.co.uk, address matches exactly); no confident Facebook URL surfaced.
- **The Gate, Cardiff** (`950582c8-…6a000fa6dc4`) — own website confirmed (thegate.org.uk, address matches exactly); no confident Facebook URL surfaced.
- **Riverside Cafe, Totnes** (`543ea48f-…166aa7`) — own website confirmed (riversidecafetotnes.com, address matches exactly); no confident Facebook URL surfaced.
- **Holly Bush, Ripley (Marehay)** (`a308a731-…8355a9c632e5`) — own website confirmed (hollybushmarehay.com, address matches exactly); Facebook presence mentioned by third parties but no URL surfaced.
- **Old Market House, Brixham** (`691ad49c-…9c1de9d4`) — own website confirmed (oldmarkethousebrixham.co.uk, address matches exactly); only Instagram found, no Facebook URL.
- **The Colebrook Inn, Plympton** (`9f93d261-…9d64b926041`) — own website confirmed (colebrookinn.jimdofree.com, address matches exactly); no Facebook URL surfaced.
- **The George Inn, Plympton** (`c3cdd081-…9d64b926041`) — own website confirmed (thegeorgeinnplympton.com, address matches exactly); **two competing Facebook URLs surfaced** (a numeric-id page and a vanity-handle page) with no way to confirm which is canonical without a Chrome visit — left blank rather than guess between them, flagged below.

(Note: 7 partial venues listed above, not 5 — corrected count from the summary line: **7 partial writes total**, all website-only.)

## Venues — evidenced blank, both surfaces tried (3)

- **Tudor Nook, Cheadle** (`701f5003-…9a343f05c`) — Google found only "Tudor House Tea Rooms" and "Tudor Cafe" at/near the record's address; neither confirmed as the same business under this name. Not attached.
- **W P M Sports & Social Club, Gosport** (`db9dd035-…76bad2a339`) — address matches exactly; only a Facebook **events page** and an unofficial fan **group** found, no official club page. Not attached (group-URL exclusion).
- **The Mermaid, Exeter** (`974e7891-…faa7a9`) — address matches exactly, bar confirmed to exist and to have *a* Facebook page per third-party mentions, but no direct URL surfaced in this pass. Not attached without a confident URL.

## Artists — enriched WITH a verified page (1)

- **The Renegades**, Taunton, `172c69df-ad67-43a6-82e9-2a486730af97`. Google → `facebook.com/wearetherockband/`, confirmed via Chrome (logged in): "Musician/band" category, 329 followers, page's own **Details → Address** tab pins the location at **Minehead** — ~25 miles from Taunton, same West Somerset area (Tier B: page-stated location consistent with/adjacent to the record's gig footprint, §1A.2 step 3). Own-page bio quoted verbatim via `get_page_text`/screenshot: *"A fresh yet highly experienced post-punk/rock/pop cover band based in the West Country of England."* `genres: ["Rock","Punk","Pop"]` inferred from the page's own "post-punk/rock/pop cover band" wording (genres is the one field a run may infer, §0.0). `actType: ["covers"]` set from the page's explicit "cover band" wording. **Not corrected**: existing `location: "Taunton"` left as-is rather than overwritten to "Minehead" — the existing value may reflect real gig-footprint evidence this run didn't have visibility into; flagged below for a human glance rather than unilaterally changed. `profileImageUrl` not set — no avatar recipe (§8) run this pass, flagged by the validator as `STUB_NO_IMAGE`.

## Artists — evidenced blank / near-miss, both surfaces tried (12)

| Artist | id | Location on record | Why rejected |
|---|---|---|---|
| Paula Ann | `a4ce8576-…198adec` | Greater Manchester UK (gigs-news) | Only a directory listing found ("Bromborough, North West England" — Wirral, not Greater Manchester), not the act's own page; Facebook search returned only unrelated same-name acts |
| Lee Ashley | `712657fc-…dcef446` | Greater Manchester UK (gigs-news) | No UK-consistent candidate on either surface |
| Paul McCoy | `da16486f-…0f9d62` | North West UK (gigs-news) | Two other Paul McCoys found (tribute vocalist, US rock singer), neither confirmed as this act |
| Mike Jones | `c062411f-…c13b4` | Greater Manchester UK (gigs-news; missing half of the Mike Jones + Smudge split bill, Dog Inn Chadderton — Smudge is on the §5.4 do-not-attach list) | Facebook search surfaced only the US rapper Mike Jones (282K followers) and unrelated pages |
| Dale Murphy | `20bc1aab-…93ca` | Greater Manchester UK (gigs-news) | No UK-consistent candidate on either surface |
| The House Katz | `16ed5a04-…4986` | Derbyshire, UK | No confident match; only unrelated same/near-name acts (The Katz Band, KATZ) |
| Grant & Match | `9619302d-…31eb`(sic) | Staffordshire UK | No confident match on either surface |
| Sound Generator | `0c02e42c-…c658f` | Staffordshire UK | No confident match on either surface |
| **One Night Stand** | `d48795c5-…1fd4585` | Stoke-on-Trent | **Near-miss**: "The One Night Stand" function/covers band found (facebook.com/theonenightstandfunctionband/) but no Stoke-on-Trent location confirmation — Tier C name-only, not attached, flagged |
| Goodnight Lois | `c29005b0-…5b532d` | Watchet | Same-name act found is explicitly Bristol-based — footprint mismatch, not attached |
| Lily Lovejoy & Beau Norton | `93ee7838-…6bee038` | Watchet | No candidate found at all on either surface |
| **One Step Behind** | `4f46f4ea-…e4a31be` | Derby | **Near-miss**: "One Step Behind – The Master of Madness" (Madness tribute act, facebook.com/OSBTribute/) found but no Derby-specific location evidence — Tier C name-only, not attached, flagged |

## Staged records

The 7 website-only partial venue writes (Grapes Inn, The Gate, Riverside Cafe, Holly Bush, Old Market House, The Colebrook Inn, The George Inn) are the "staged" classification — all complete, deliberate partial enrichments, not held for review.

## Names corrected under §0.6

None this run — all worked records' names were already clean.

## Validator

**First pass:** `43 records · 22 clean · 2 FAIL · 41 WARN` — 2× `FB_EVIDENCE_MISMATCH`: Navigation Inn and The CryerArts Centre both had their evidence `capturedFrom` field pointing at the venue's *website* URL rather than the *Facebook* URL actually stored — an evidence-pairing slip, not a wrong stored URL (both stored URLs were independently confirmed correct against the search results). Corrected the evidence file's `capturedFrom` for both to the Facebook URL actually stored, before shipping.

**Final pass, after correction:**
```
43 records · 22 clean · 0 FAIL · 41 WARN   [mode=gate]
```
Exit code 0. The 41 WARNs are `STUB_NO_BIO`/`STUB_NO_IMAGE` on the 20 verified + partial venues (expected and harmless — venues have no bio field, §FP.2) plus one `STUB_NO_IMAGE` on The Renegades (no avatar recipe run this pass). 0 FAIL.

Evidence file: `data/state/enrichment-evidence-2026-08-07-bv2a-enrichment.jsonl` (this run appended 43 lines: 30 venue lines + 13 artist lines, on top of the 97 already there from runs 01–04 today), written before each corresponding bndy write. Two venue evidence entries corrected post-write, pre-validation, for the `capturedFrom` pairing defect noted above.

## Ledger and dashboard

44 ledger lines appended (22 venue-verified, 7 venue-partial/staged, 3 venue-blank, 1 artist-verified, 12 artist-blank) + 1 snapshot line. Snapshot: `artistsTotal 1917 · artistsMissingSocials 773 (down 1 — The Renegades) · artistsMissingGenres 685 · venuesTotal 2107 · venuesMissingSocials 773 (down 27 — 22 verified + 5 partial(*) venues cleared the missing-socials filter; note 2 of the 7 "partial" venues above only got a website, not a facebookUrl, so the filter-clearing count of 27 reflects all venues that gained *either* field, matching the raw API delta)`. Dashboard regenerated: `data/normalized/enrichment/DASHBOARD.html` (305 records, 11 snapshots).

## Open items for Jason

1. **The George Inn, Plympton** (`c3cdd081-…9d64b926041`) — two competing Facebook URLs (`facebook.com/p/The-George-Inn-Plympton-61563360380598/` and `facebook.com/thegeorgeinnplympton/`), neither confirmed canonical. Website attached; a human 30-second check would settle the Facebook URL.
2. **The Renegades** (`172c69df-…730af97`) — the act's own Facebook page pins its address at Minehead, not the bndy record's stored `location: "Taunton"`. Left unchanged per this run's restraint (§7 would normally have the page-stated location win, but this run didn't have visibility into whatever evidence set "Taunton" originally, e.g. gig history) — worth a human glance to confirm whether "Taunton" should become "Minehead" or a regional value.
3. **One Night Stand** (Stoke-on-Trent) and **One Step Behind** (Derby) — both near-misses on a Tier C name-match-only signal, flagged above, not attached. Same handling as the Kamaro/Komaro and Railway Arches near-misses logged by earlier runs today.
4. **W P M Sports & Social Club** — only a Facebook events page + an unofficial group exist; no official venue page found. Likely a genuinely page-less venue.

## Budget used

~18 minutes wall-clock (06:17–06:35 UTC), well under the 40-minute target. Record count (30 venues + 13 artists = 43 touched) is at the venue cap and under the artist cap. Circuit breaker did not fire. Lock acquired cleanly under the literal 55-minute rule (no override needed).

## Step 6 — lock release

Releasing per §6G-style convention (matching this run's own acquire format): overwriting `data\state\enrichment.lock` with `{"heldBy":null,"releasedAt":"<iso>","expiresAt":"1970-01-01T00:00:00Z","lastRun":"bv2a-enrichment-hourly-unattended-bv2a-20260807T061745Z"}`.
