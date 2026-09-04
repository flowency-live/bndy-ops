# ENRICHMENT RUN — 2026-08-07 ~10:17–10:35 UTC (unattended, Bv2a Enrichment)

**Outcome: COMPLETED.** 26 venues enriched with a verified Facebook page (20 also gained a website), 2 venues recorded as evidenced blanks. 4 artists enriched with a verified page + verbatim bio/fields where a bio existed, 11 artists recorded as evidenced blanks (one flagged as a genuine self-caught write error, corrected in-run; one near-miss flagged for a human glance). Validator: 0 FAIL, 5 WARN (all STUB_NO_IMAGE / one STUB_NO_BIO — expected, no avatar recipe run this pass). Ledger and dashboard updated. Lock released.

## Step 0 — circuit breaker (passed)

Read the last 3 run reports, newest first:
- `RUN-REPORT-09.md` — STOPPED at Step 1 lock check (literal <55min rule), no bndy writes, wrote a report.
- `RUN-REPORT-08.md` — COMPLETED. Validator final `7 records · 0 clean · 0 FAIL · 8 WARN`.
- `RUN-REPORT-07.md` — STOPPED at Step 1 lock check, no bndy writes, wrote a report.

Zero validator FAILs recorded at completion among the three; none "ran but wrote no report" (all three wrote reports, two of them deliberate reasoned stops). Circuit breaker does not trip.

## Step 1 — concurrency lock

Per RUNBOOK §6G (which overrides this task prompt's literal Step-1 wording): read `data\state\enrichment.lock` — `{"heldBy":null,"releasedAt":"2026-08-07T08:39:15Z","expiresAt":"1970-01-01T00:00:00Z",...}`. `expiresAt` is in the past → **acquire**, no override debate needed (the lock's own `expiresAt` field settles it under §6G regardless of mtime, and this run's lock was independently ~98 minutes old by mtime too — both readings agree). Acquired: `{"heldBy":"bv2a-enrichment-hourly-unattended-bv2a-20260807T101709Z","acquiredAt":"2026-08-07T10:17:09Z","expiresAt":"2026-08-07T13:17:09Z",...}`.

**Note for Jason:** this run also caught up on the §6A step 0 heartbeat requirement, which earlier runs today were writing but which this run's own Step 0/1 ordering doesn't explicitly call out — heartbeat was written as `bv2a-enrichment-hourly-unattended-2026-08-07T10-17-48Z.json` shortly after Step 1 rather than as the literal first action. Logging so the ordering gap is visible; no functional harm this run (nothing was written to bndy before the heartbeat landed).

## Step 2 — runbook / task spec / rulings read in full

`RUNBOOK.md` read in full: H1 = **v2.12**, matches/exceeds CURRENT FLOOR v2.11 (§6A) — passes. Read §0 prime directives, §1/§1A identity + same-name protocol, §2/§2A enrichment protocol (item 8 bio-verbatim, item 3b/3c both-surfaces + two-word-query discipline), §3 venue protocol, §5.2 evidence ladder, §6/§6A run discipline, §6B platform facts, §6F concurrency, §6G lock protocol (see Step 1). `ENRICHMENT-TASK-v3.md` read in full: §0.0 bio-quoted rule, §FP fast path (Google to find, Chrome only to quote; venues need no Chrome at all). `OPEN-RULINGS.md` read start to finish (both pages) — do-not-attach list checked against all worked names, no hits; near-miss handling modelled on the Flutter/Kamaro/Mark-Davis-style precedent (Tier C name+genre alone is never sufficient); the Railway-Arches/Signature-Brew rename precedent directly informed the Parc Trenance decision below.

## Step 3 — selection

Budget: 30 venues + 15 artists or 40 minutes.

1. **Artists created <24h missing socials:** 13 found. 11 of 13 already carried a same-day ledger entry from earlier runs (01–09) and were skipped per 90-day cooldown. Worked the 2 genuinely fresh: **NME'd**, **Skids** (both from today's Sugarmill/klma harvest, already carrying structured genres/actType, missing only facebookUrl).
2. **Venues created <24h missing socials:** 0 found.
3. **Backlog venues missing socials, oldest `createdAt` first:** sampled `list_venues(missingSocials:true)` at offset 0 (limit 40, 749 total), sorted locally by `createdAt`. Skipped `Derby` and `Chapel St, Belper` (generic city/street placeholders — same class as the already-flagged `Derby`/`Ripley`/`Cannock` OPEN-RULINGS item, no real business to search for) and every venue already in today's cooldown (`Annitsford Welfare Club`, `Tudor Nook Cheadle`, `New Hartley Memorial Hall`, `Canal Tavern`, `W P M Sports & Social Club`, `The Mermaid`, `The Beehive Inn`, `Christchurch Conservative Club`, `The Blacksmiths Arms Gosforth` — all worked by runs 06–08 today). Worked the next 28 oldest genuinely-fresh candidates.
4. **Backlog artists missing socials, oldest first:** sampled `list_artists(missingSocials:true)` at offset 0 (limit 40, 768 total), sorted locally by `createdAt`. 8 of the oldest candidates were already in today's cooldown (worked by runs 01–08). Worked the 13 oldest genuinely fresh candidates.
5. **Artists missing genres with an existing facebookUrl:** not reached — budget spent on priorities 1, 3 and 4.

## Venues — enriched WITH a verified page (26)

| Venue | id | facebookUrl | website | Signal |
|---|---|---|---|---|
| Ultra Warehouse, Derby | `504e9dc9-…3aeccab` | facebook.com/61589573856445/ | ultrawarehouse.net | 9 Downing Rd address matches exactly |
| The Royal British Legion, Stratford | `c5345529-…8e2cd38` | facebook.com/RBLStratfordUponAvon/ | — | CV37 6DT postcode matches exactly |
| Chew's Yard, Preston | `aeca101f-…9c8dc4` (trunc.) | facebook.com/chewsyard/ | chewsyard.info | Market Street West, Preston address matches |
| Town Hall, Congleton | `a6852a52-…950b8` | facebook.com/CongletonTownHall/ | — | 7 High St address matches; alt candidate facebook.com/CTHEvents/ noted, not used |
| East Harlsey Village Hall | `af2e9440-…6e79c` | facebook.com/p/East-Harlsey-Village-Hall-100082989545079/ | eastharlsey.com | Northallerton address matches |
| The Plough Inn, Bignall End | `39d65c32-…41ba11d4` | facebook.com/theploughinn2022/ | theploughbignallend.co.uk | 2 Ravens Lane matches; most-recently-active of two candidate pages |
| The Dolphin - Sports Bar, Littlehampton | `c0ec4130-…2eba5127` | facebook.com/thedolphinsportsbar | dolphinsportsbar.co.uk | 34 High St address matches |
| The Old Bell Hotel, Derby | `484c31bb-…077ba13d` (trunc.) | facebook.com/bellhotelderby/ | bellhotelderby.co.uk | 51 Sadler Gate matches exactly |
| Green Taverners, Plymouth | `81d4b537-…17712106` (trunc.) | facebook.com/greentaverners/ | greentaverners.co.uk | Home Park PL2 3DQ matches exactly |
| One Six One, Exeter | `a1d17e4e-…1388e70` | facebook.com/p/Monkey-Suit-One-Six-One-61585724356434/ | — | page name matches bndy's own lemonrock externalId exactly |
| Paignton Constitutional Club | `d046e337-…6c54e5e6` (trunc.) | facebook.com/PaigntonConClub/ | paigntonconclub.com | 34 Palace Ave matches; own site confirms "formerly Conservative Club" rebrand |
| The Pilot, Exmouth | `b8d1c1cd-…60472fc` | facebook.com/ThePilotExmouth/ | — | 5 Chapel Hill matches exactly |
| First and Last Inn, Exmouth | `762b5c52-…303f3ca1` (trunc.) | facebook.com/FnLExmouth/ | — | 10 Church St matches exactly |
| Manor Pavilion Theatre, Sidmouth | `e253a9c3-…5614010d3` (trunc.) | facebook.com/ManorPavilion/ | manorpavilion.com | Manor Rd EX10 8RP matches exactly |
| The Bridge On Wool, Wadebridge | `fd341b91-…34fb9b2f3` (trunc.) | facebook.com/p/The-Bridge-On-Wool-100057551595923/ | — | The Platt address matches |
| Burrell Theatre, Truro | `72bf74df-…3a500d89ae` (trunc.) | facebook.com/burrelltheatre/ | burrelltheatre.com | Trennick Ln address matches |
| Joiners Arms, Bideford | `2c4f769d-…7e543fd5` | facebook.com/p/Joiners-Arms-100088954044959/ | — | 6 Market Pl matches exactly |
| Fondo Lounge, Street | `a50d2c83-…8b41ba11d4` (trunc.) | facebook.com/fondolounge/ | thelounges.co.uk/fondo/ | 107 High St matches exactly |
| Royal Portland Arms, Portland | `c11ae8c2-…871bcd` | facebook.com/portlandrpa/ | — | 40 Fortuneswell matches exactly |
| The Royal Oak, Weymouth | `9c254809-…8a7b3c2` | facebook.com/TheRoyalOakWeymouth/ | — | 52-54 Dorchester Rd matches |
| Bridgwater Cricket Club | `58646c5f-…c74437c2208b` (trunc.) | facebook.com/BridgwaterCC/ | — | The Parks, Bridgwater matches |
| The Three Compasses, Charminster | `746aa759-…f31ae92c` | facebook.com/thethreecompassescharminster/ | thethreecompassescharminster.co.uk | 9 The Sq matches exactly |
| Shepherd's Rest, Taunton | `64e2b6ff-…f16fc52c4a` (trunc.) | facebook.com/thesheps1/ | theshepherdsresttaunton.co.uk | 64 Galmington Rd matches exactly |
| Stonemasons, Ilminster | `9d5ad716-…552d9f44` | facebook.com/TheStonemasonsIlminster/ | stonemasonspub.co.uk | Harts Cl matches exactly |
| The Victoria Hotel, Burnham-on-Sea | `0b248533-…021ec1095d` (trunc.) | facebook.com/TheNewVic2017/ | — | 25 Victoria St matches exactly |
| The New Inn, Park Bottom | `642191bb-…3e8031b4877d` (trunc.) | facebook.com/p/The-New-Inn-Park-Bottom-100057561874821/ | newinnparkbottom.co.uk | Redruth TR15 matches exactly |

All read back with `get_by_id`. No Chrome used for venues (§FP.2 — no bio field, Google-only).

## Venues — evidenced blank, Google tried (2)

- **Parc Trenance, Padstow** (`8bea377f-…7d1660472fc`... `8bea377f-d158-4771-96db-b7aa95a6d365`) — the address is now occupied by a differently-named business trading as "The Venue St Merryn" (bar/restaurant at St Merryn Holiday Village). Same rename-ambiguity class as the already-logged Railway Arches / Signature Brew precedent in OPEN-RULINGS — left blank rather than attach a differently-named business's socials to the old record.
- **Downderry and Seaton Village Hall** (`9c7845c1-…8fdda75c`) — only a private Facebook GROUP found (a CIO, charity 1210090), no official business Page. Groups excluded per the same reasoning as artist enrichment (no graph picture endpoint, membership-gated).

## Artists — enriched WITH a verified page (4)

| Artist | id | facebookUrl | Signal |
|---|---|---|---|
| Skids, Dunfermline | `c3c82387-…6467c621f4` | facebook.com/theskidsofficial/ | Official page, 24K followers, exact name match, post references Richard Jobson (the real Skids' own frontman) and their book; band formed Dunfermline 1977. No formal About-bio paragraph found (just a page tagline) — bio correctly left empty per §0.0 rather than quote a bare category label (STUB_NO_BIO, expected) |
| Orion Stars | `c58dc521-…284b1aaefb` (trunc.) | facebook.com/p/Orion-Stars-100090152703331/ | Musician/band, 1.1K followers, own-page bio quoted verbatim, sole plausible candidate + current activity + plausible followers (Tier B). Page states "Sheffield / Chesterfield" — corrected location from the stored "Worksop" fallback per §7 (page-stated location beats gig-town inference); Sheffield/Chesterfield is regionally adjacent to Worksop. actType set to originals (page states "Originals... band" explicitly) |
| Ire-Ish | `4f03049f-…f2499c906a4b` (trunc.) | facebook.com/ireishbrum/ | Musician/band, 1.8K followers, own-page bio quoted verbatim ("Five sort of Irish lads from Brum..."), sole UK candidate, genre match (Irish folk), corroborated as a national-touring 5-piece by an independent listing. Page states Birmingham — corrected location from the stored "Derby" fallback per §7; both towns are on this touring act's normal circuit and no other same-name act exists to conflict |
| The Black Jeans (was "The Black Jeans Party Rock Band") | `4d58c97c-…1bdd709fa402` (trunc.) | facebook.com/theblackjeans/ | Band page, 412 followers, own-page bio quoted verbatim ("Birmingham Rock Covers Band"). Name corrected under §0.6/§0.20 — the source's "Party Rock Band" billing tail is not the act's own name; old form kept as `nameVariants`. Page/own-site (theblackjeans.co.uk) state Birmingham/Sutton Coldfield — corrected location from the stored regional "Staffordshire UK" fallback per §7 (Sutton Coldfield sits on the Staffordshire border) |

## ⚠ Self-caught write error, corrected in-run

While writing Orion Stars' enrichment I called `edit_artist` with the **wrong artist id** — Orion Stars' Facebook/bio/genre/location data was written onto the **LoveFools** record (`93871229-…0cdfa04c39cf`) instead, because I misread which of the two adjacent ids in my own working notes belonged to which artist. The read-back (§0.10) caught it immediately: the response's `"name"` field showed `"LoveFools"` where `"Orion Stars"` was expected. **Corrected in the same turn, before any further writes:** LoveFools was reverted to its original blank state (facebookUrl, bio, genres, actType, location all restored — confirmed by a follow-up `get_by_id`), and Orion Stars' data was then written to the correct id (`c58dc521-…`), also confirmed by `get_by_id`. The evidence file had the same id-swap and was corrected to match. **One residual gap:** LoveFools' `locationType` was briefly set to `regional` by the mistaken write; the revert call could not explicitly clear it back to its original `null` because the tool's `locationType` enum only accepts `city`/`regional` (no unset option), and `get_by_id` does not return `locationType` at all (a known, already-logged tooling gap) so it can't even be read back to confirm. Flagging for a human/tooling fix rather than guessing further. No bndy field was left showing wrong public data — LoveFools' visible fields (name, bio, facebookUrl, genres) are all correctly back to blank.

## Artists — evidenced blank, both surfaces tried (11)

| Artist | id | Location on record | Why rejected |
|---|---|---|---|
| NME'd | `5aa94a4c-…713160` | UK wide | No confident match on Google or Facebook page search; only an unrelated disbanded US trio "NME" surfaced |
| Shot Sundays | `3b89e461-…2847a117` | Yorkshire | No confident match on either surface |
| Sully and Co | `76cf390e-…88352938f` (trunc.) | Yorkshire | Only non-UK (Mount Pleasant, SC) match found — rejected per §2A.1.1 |
| The House Katz | `16ed5a04-…4215c2` | Derbyshire, UK | No confident match on either surface |
| Mix 'N' Match | `167d9aa4-…1e1a2e` (trunc.) | Derbyshire, UK | No confident match on either surface (only unrelated Philippines/US/Netherlands acts) |
| Beyond Tonight | `d77eaad6-…6a1f0a23` (trunc.) | Worksop | No confident match on either surface |
| **LoveFools** | `93871229-…0cdfa04c39cf` | Worksop | Only non-UK (German — "Vorweihnachtskonzert im Badhaus", press outlet plus.pnp.de) match found — rejected per §2A.1.1. See self-caught-error note above |
| Sound Generator | `0c02e42c-…0658f` | Staffordshire UK | No confident match on either surface |
| **One Night Stand** | `d48795c5-…d1fd4585` (trunc.) | Stoke-on-Trent | **Near-miss**: a UK-flagged 202-follower "Rock/Punk/New Wave covers band" page surfaced but states no location, among several unrelated same-name acts worldwide (Buffalo NY, Adelaide, a US gospel act, plus a separate "The One Night Stand" function band with no location either). Tier C name+genre only — not attached. Flagged for a human glance |
| Jon Casey Blues Band | `318a5946-…f2499c906a4b` (trunc.) | North West UK | The real band's own archived listing explicitly states "Facebook: none"; page search confirms no page exists |
| Hero's of Rock | `d6d159d9-…0a1da4154ee2` (trunc.) | Hampshire UK | No confident match on either surface |

## Names corrected under §0.6/§0.20

- **The Black Jeans** (`4d58c97c-…1bdd709fa402`) — "The Black Jeans Party Rock Band" → "The Black Jeans", the act's own page name. Old form preserved as `nameVariants`.

## Validator

```
4 records · 0 clean · 0 FAIL · 5 WARN   [mode=gate]
```
Exit code 0. The 5 WARNs: 4× `STUB_NO_IMAGE` (no avatar recipe run this pass on any of the 4 verified artists — expected) + 1× `STUB_NO_BIO` on Skids (page carries only a tagline/category label, no real bio prose to quote — correctly left empty per §0.0). 0 FAIL.

Note: `enrichment_validate.py` validates **artist** records only (bio-verbatim/location/facebookUrl checks) — it has no venue-specific ruleset, consistent with §FP.2 stating venues carry no bio field and no Chrome requirement. The 26 venue writes were verified by `get_by_id` read-back (§0.10) instead.

Evidence file: `data/state/enrichment-evidence-2026-08-07-bv2a-enrichment.jsonl` (this run appended 43 lines: 28 venue lines + 15 artist lines, on top of the 181 already there from runs 01–09 today), written before each corresponding bndy write. The Orion Stars/LoveFools id-swap noted above was corrected in the evidence file to match the corrected bndy state.

## Ledger and dashboard

43 ledger lines appended (26 venue-verified, 2 venue-blank, 4 artist-verified, 11 artist-blank) + 1 snapshot line. Snapshot: `artistsTotal 1939 · artistsMissingSocials 763 (down from 766 at run-08's snapshot) · artistsMissingGenres 682 · venuesTotal 2107 · venuesMissingSocials 723 (down from 749 at run-08's snapshot)`. Dashboard regenerated: `data/normalized/enrichment/DASHBOARD.html` (393 records, 13 snapshots).

## Open items for Jason

1. **LoveFools `locationType` residual** (see self-caught-error note) — briefly set to `regional` by a corrected mistaken write, cannot be confirmed cleared because `get_by_id` doesn't return `locationType` and the edit tool has no "unset" option. Low-stakes (an unused/empty-value field), but flagging rather than guessing.
2. **One Night Stand** — a UK-flagged, no-location 202-follower covers-band page is a plausible but unconfirmable candidate among several unrelated same-name acts worldwide. Worth a human 30-second Facebook check.
3. Two venues remain genuinely evidenced-blank this run (Parc Trenance rename ambiguity; Downderry and Seaton Village Hall group-only) — none had an obvious next step.
4. Confirming the process point from my own error above: two adjacent artist ids in a working list were easy to transpose by hand. Worth considering whether future runs should copy id+name pairs verbatim into each tool call rather than tracking them in a mental/scratch list — this run's read-back caught it immediately, but a slower run or a skipped read-back would not have.

## Budget used

~30–35 minutes across the batches (exact wall-clock uncertain — sandbox clock showed non-monotonic readings during this run, e.g. reporting an earlier time after later work; timestamps in this report and the evidence/ledger files should be read as approximate). Record count: 28 venues (2 under the 30 cap) + 15 artists (at cap). Circuit breaker did not fire. Lock acquired cleanly under §6G (lock content unambiguously released).

## Step 6 — lock release

Releasing per §6G content-based convention: overwriting `data\state\enrichment.lock` with `{"heldBy":null,"releasedAt":"<iso>","expiresAt":"1970-01-01T00:00:00Z","lastRun":"bv2a-enrichment-hourly-unattended-bv2a-20260807T101709Z"}`.

---

## ADDENDUM — live follow-up with Jason, same session, ~11:15–11:41 UTC

Jason reviewed this report's 11 evidenced blanks directly (interactive, not unattended) and gave corrections/instructions. Handled as follows, same evidence-file and validator discipline as the main run:

**4 pages Jason found that this run's own search missed — attached:**

| Artist | facebookUrl | What changed |
|---|---|---|
| NME'd | facebook.com/NMEDUK | bio quoted verbatim (matches stored genres/actType exactly) |
| Beyond Tonight | facebook.com/beyondtonightband | bio quoted verbatim; location corrected Worksop → Sheffield (page's own "Lives in Sheffield"); genres Punk/Pop |
| LoveFools | facebook.com/profile.php?id=61578958160463 | a **different, UK** profile to the German page rejected earlier this run — bio quoted verbatim; genres Alternative/Grunge/Britpop; actType covers |
| Sound Generator | facebook.com/SoundgenaratorLiveBandOfficial | own page spells the name "Soundgenarator" — corrected under §0.20, old form kept as `nameVariants`; bio quoted verbatim; location corrected Staffordshire UK → Buxton (page's own "is in Buxton") |

**1 self-caught bio-fidelity slip, corrected before shipping:** all four bios above (plus Jon Casey Blues Band's, below) were initially retyped with straight apostrophes/quotes where the source pages used curly ones (NME’D / 00’s / didn’t / ’Riot at the Wall). The validator's `BIO_PUNCTUATION` warning caught this — re-captured the exact characters from the original page text and re-wrote all five bios to match byte-for-byte. This is precisely the class of error §0.0 exists to prevent; flagging it rather than letting the warning pass silently.

**1 record, richer profile but still no working socials — Jon Casey Blues Band:** Jason asked for more digging. Found the band's own listing on bandfinder.uk (Liverpool/Merseyside, genre Blues/Rock, a proper bio, a discography — Apple Music, CD Baby album "Riot at the Wall", SoundCloud) and a linked Facebook URL (facebook.com/JonCaseyBlues) — **visited, and the page is gone** ("This content isn't available... it's been deleted"). Their own website (joncaseyblues.com) is also dead. A further Facebook page search for "Jon Casey Blues Band Liverpool" found no live alternative. BandfinderUK's own past-gigs list tops out at 2019 with no future dates — consistent with a genuinely inactive act. Enriched location (Liverpool), genres (Blues, Rock), actType (originals + covers) and bio (BandfinderUK's own listing copy, used per the Charlie precedent since no live socials exist to quote instead) — facebookUrl correctly left blank, page confirmed dead rather than merely unsearched.

**5 records Jason asked to delete — NOT deleted, kept per his own follow-up decision:** before acting, this run checked each for attached events (§0.11 destructive-action caution / the Undercover precedent) and found all five carry real, non-empty gig history:

| Artist | Event found |
|---|---|
| Shot Sundays | Halfway House, Morley — 2026-05-17 |
| The House Katz | 4 Moor St, Derby — 2026-06-07 |
| Mix 'N' Match | The Greyhound Inn, Swadlincote — 2026-03-21 **and** 2026-07-18 |
| One Night Stand | The Black Cock, Stoke-on-Trent — 2026-06-13 |
| Hero's of Rock | The Heroes, Waterlooville — 2026-06-20 |

Flagged this back to Jason before deleting anything; he chose to keep all five records (and their event history) rather than delete. No records were deleted this run.

**Validator, re-run against the 5 newly-touched records:** first pass caught the bio-punctuation slips above plus one genuine `BIO_VERBATIM` FAIL on LoveFools (an emoji transcription error in the evidence file itself, not in the bndy write — corrected and re-verified). Final pass:

```
5 records · 0 clean · 0 FAIL · 5 WARN   [mode=gate]
```
All 5 WARN are expected (4× `STUB_NO_IMAGE`, no avatar recipe run; 1× `NAME_BILLING` on "Jon Casey Blues Band" — the band's own established name, not a source billing artefact, no action needed).

**Ledger:** 10 more lines appended (5 verified/partial enrichments + 5 kept-not-deleted). Dashboard regenerated: 403 records, 13 snapshots.

---

## ADDENDUM 2 — NME'd gig import, same session, ~11:15–11:41 UTC

Jason asked whether the 6 other NME'd gigs listed on thegigcartel.com (https://www.thegigcartel.com/Artists-profiles/NMED.htm) had been imported as events, and on confirming they hadn't, authorized importing all 6 ("Yes, import all 6"). This is out of scope for the enrichment protocol proper (§2A) and was run under RUNBOOK §3 venue-creation / §5 event-creation protocol instead, with Jason live and reviewing.

**Venues — 3 newly created (Google Place ID required, searched-before-create per §3):**

| Venue | id | Address |
|---|---|---|
| The Live Rooms | `83bbe913-c22b-4871-99c1-ae65730f7287` | 1 Station Rd, Chester CH1 3DR |
| Docks Academy | `2a6edd4a-279a-4e6a-8ca6-61dda38970fe` | First Floor, The Church, King Edward St, Grimsby DN31 3JD |
| O2 Academy Leicester | `0bbc5e9c-484d-4981-8c94-373c8bf20f78` | 12 University Rd, Leicester LE1 7RH |

**Venues — 2 existing, matched via search (one low-confidence label overridden on exact name/address/place_id match, per the known unreliability of `search_venue` confidence scores logged in OPEN-RULINGS):**

| Venue | id |
|---|---|
| The Georgian Theatre - Stockton-on-Tees | `b6ae5ae0-82be-4f7d-80b5-7ab404e1b66c` |
| Birdwell Venue | `6e50ac6a-f4ce-4497-a2b5-49b51c6fa72e` |

**Mid-task correction from Jason:** while the venue search/create work was in progress, he flagged that these venues "may be new to bndy and will need marking as ticketed venues." All 5 venues above (3 new + 2 existing) were set `standardTicketed: true`, consistent with Decision 03 (2026-07-31) that grassroots ticketed venues are imported and marked, not ignore-listed.

**Events — 5 created, 1 existing topped up (all read back via `get_by_id` per §0.10):**

| Event | id | Venue | Ticket source |
|---|---|---|---|
| NME'd @ The Georgian Theatre - Stockton-on-Tees | `c51b3d72-46b2-44e6-9119-c5e7ed6352d0` | Georgian Theatre | thegigcartel/seetickets #3610419 |
| NME'd @ Birdwell Venue | `eee1be5b-56f7-434a-abb9-59f9c8be6fc5` | Birdwell Venue | thegigcartel/seetickets #3606177 |
| NME'd @ The Live Rooms | `8df630dd-5128-4e44-a247-37b9d13c5e21` | The Live Rooms | thegigcartel/seetickets #3606168 |
| NME'd @ Docks Academy | `e0819ca4-2db1-4bdf-97a8-8b6ac040c02d` | Docks Academy | thegigcartel/seetickets #3606186 |
| NME'd @ O2 Academy Leicester | `9a7e9fce-c921-4940-bf8f-9315bb8fff4a` | O2 Academy Leicester | thegigcartel/seetickets #3606190 |
| NME'd @ The Sugarmill *(existing — topped up, not duplicated)* | `2db1c53e-f2bc-4367-a561-53e0110ab79d` | The Sugarmill | thegigcartel externalId added alongside the pre-existing sugarmill externalId — `edit_event(externalIds)` dedup-by-source confirmed working correctly, both sources coexist |

All 5 new events defaulted to 21:00 start time per §5.6 (no explicit time stated on the source pages) — flagging as defaulted per §5.6's own reporting requirement. All 6 events carry `ticketed: true` and the seetickets `ticketUrl` extracted via DOM href scraping (`javascript_tool`, per §0.22 — `get_page_text` strips anchor hrefs).

**Tooling issue found and fixed:** appending these 11 ledger lines (first `"entity":"event"` lines the dashboard script had ever seen) crashed `scripts/build_enrichment_dashboard.py` with `KeyError: 'event'` — its per-day throughput tally used a fixed `{"artist":0,"venue":0}` dict rather than an open-ended counter. Fixed with a minimal, backward-compatible change (nested `defaultdict(int)` instead of the fixed-key dict); artist/venue chart output is unchanged, and other entity types (like `event`) no longer crash the build. Ledger confirmed intact before the fix (`wc -l` showed all 11 new lines present). Dashboard regenerated cleanly after the fix: **406 records, 13 snapshots**.

**Ledger:** 11 more lines appended (3 venue-created, 2 venue-enriched/ticketed, 5 event-created, 1 event-enriched/provenance-topped-up).

## Open items for Jason (addendum 2)

5. `build_enrichment_dashboard.py` previously only handled `entity: "artist"|"venue"` in its throughput tally — now handles any entity type without crashing, but the throughput *chart* still only plots artist/venue counts, so today's 6 event writes won't show on that chart (they are in the raw ledger and the records table). Worth a follow-up if event throughput should be visualised too.
