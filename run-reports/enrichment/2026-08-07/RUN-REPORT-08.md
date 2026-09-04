# ENRICHMENT RUN — 2026-08-07 08:17–08:37 UTC (unattended, Bv2a Enrichment)

**Outcome: COMPLETED.** 23 venues enriched with a verified Facebook page (17 also gained a website), 1 venue partial (website only, group-URL excluded from facebookUrl), 6 venues recorded as evidenced blanks. 7 artists enriched with a verified page + verbatim bio/fields, 8 artists recorded as evidenced blanks (one flagged as a personal-profile-only case, one as a Tier C near-miss). Validator: 0 FAIL, 8 WARN (all STUB_NO_IMAGE / one STUB_NO_BIO — expected, no avatar recipe run this pass). Ledger and dashboard updated. Lock released.

## Step 0 — circuit breaker (passed)

Read the last 3 run reports, newest first:
- `RUN-REPORT-07.md` — STOPPED at Step 1 lock check (literal <55min rule), no bndy writes, wrote a report.
- `RUN-REPORT-06.md` — COMPLETED. Validator final `43 records · 22 clean · 0 FAIL · 41 WARN`.
- `RUN-REPORT-05.md` — STOPPED at Step 1 lock check, no bndy writes, wrote a report.

Zero validator FAILs recorded at completion among the three; none "ran but wrote no report" (all three wrote reports, two of them deliberate, reasoned stops). Circuit breaker does not trip.

## Step 1 — concurrency lock

Read `data\state\enrichment.lock`: `{"heldBy":null,"releasedAt":"2026-08-07T06:36:26Z","expiresAt":"1970-01-01T00:00:00Z",...}`. File mtime 2026-08-07T06:36:30Z (07:36:30 local +01:00). Current time at read: 08:16:58Z. Age ≈ 100 minutes — **over the task prompt's literal 55-minute threshold**, so this run proceeds under the literal Step-1 wording alone. No need to invoke or adjudicate the RUNBOOK §6G content-based override that RUN-REPORT-05/06/07 debated today — this run's lock check didn't require it (both the literal mtime rule and §6G's `expiresAt`-in-the-past rule agree here). Acquired: `{"heldBy":"bv2a-enrichment-hourly-unattended-bv2a-20260807T081706Z","acquiredAt":"2026-08-07T08:17:06Z","expiresAt":"2026-08-07T11:17:06Z","lastRun":"bv2a-enrichment-hourly-unattended-bv2a-20260807T081706Z"}` — written in §6G's on-acquire content format regardless, since that format is a strict superset of what the literal rule needs and resolves the open tension for any run that reads this lock next.

## Step 2 — runbook / task spec / rulings read in full

`RUNBOOK.md` read in full: H1 = **v2.11**, matches CURRENT FLOOR v2.11 (§6A) — passes. Read §0 prime directives, §1/§1A identity + same-name protocol, §2/§2A enrichment protocol (item 8 bio-verbatim, item 3b/3c both-surfaces + two-word-query discipline), §3 venue protocol, §5.2 evidence ladder, §6/§6A run discipline, §6B platform facts, §6F concurrency, §6G lock protocol, full changelog. `ENRICHMENT-TASK-v3.md` read in full: §0.0 bio-quoted rule, §FP fast path (Google to find, Chrome only to quote). `OPEN-RULINGS.md` read start to finish (both pages) — do-not-attach list checked against all worked names, no hits; near-miss handling modelled on the Flutter/Kamaro/Mark-Davis-Group-style precedent (Tier C name+genre alone is never sufficient).

## Step 3 — selection

Budget: 30 venues + 15 artists or 40 minutes. **Actual worked: 30 venues (23 verified + 1 partial + 6 evidenced blank) + 15 artists (7 verified + 8 evidenced blank).** Wall clock: 08:17–08:37 UTC, ~20 minutes — under budget on time; at cap on both venue and artist counts.

1. **Artists created <24h missing socials:** 11 found (`createdSince` 2026-08-06T08:17Z). All 11 already carried a ledger entry from today's earlier runs (5 `no-page-found` at 06:22Z from run-06, 6 `blank` at 23:26Z from run before that) — **all skipped per 90-day cooldown**.
2. **Venues created <24h missing socials:** 0 found.
3. **Backlog venues missing socials, oldest `createdAt` first:** sampled `list_venues(missingSocials:true)` at offset 0 (limit 40, 773 total), sorted locally by `createdAt`. Skipped `Derby` (generic city-placeholder, already flagged in OPEN-RULINGS 2026-08-07) and three venues already in today's cooldown (`Tudor Nook, Cheadle`; `W P M Sports & Social Club`; `The Mermaid` — all worked by run-06 at 06:25–06:29Z). Worked the next 30 oldest.
4. **Backlog artists missing socials, oldest first:** sampled `list_artists(missingSocials:true)` at offset 0 (limit 40, 773 total), sorted locally by `createdAt`. 24 of the 40 oldest candidates were already in today's cooldown (worked by runs 01–06). Worked the 15 oldest genuinely fresh candidates.
5. **Artists missing genres with an existing facebookUrl:** not reached — budget spent on priorities 3–4.

## Venues — enriched WITH a verified page (23)

| Venue | id | facebookUrl | website | Signal |
|---|---|---|---|---|
| The Borough Arms, Crewe | `88193286-…d426d` | facebook.com/p/Borough-Arms-100067753736727/ | — | 33 Earle St address matches exactly |
| Bradley House Bar, Uttoxeter | `8b4339b0-…127ba` | facebook.com/p/Bradley-House-Bar-100064153959501/ | — | Bradley St address matches |
| Marchon Sports & Social Club, Whitehaven | `90d8ee54-…30dc` | facebook.com/218930458315837 | — | exact name match, Whitehaven confirmed |
| YES, Manchester | `de2e0e35-…c706` | facebook.com/yesmanchester/ | yes-manchester.com | 38 Charles St address matches exactly |
| The White Lion, Long Eaton | `a1d47626-…51da` | facebook.com/whitelionatsawley/ | — | 352 Tamworth Rd address matches exactly |
| Brunel View, Plymouth | `6e83f07b-…24833` | facebook.com/brunelviewbarandbistro/ | — | 7 Barne Rd, St Budeaux address matches exactly |
| N JOY BAR, Plymouth | `bb3d026a-…34c6c` | facebook.com/thewalruspub.plymouth/ | — | address matches; page's own post names "N JOY Bar Plymouth 113-115 Mayflower street" |
| Exe Sailing Club, Exmouth | `04414a9b-…3a482` | facebook.com/Exesailingclub/ | exe-sailing-club.org | Tornado, Shelly Rd address matches exactly |
| Teignmouth Social Club | `f32d58e5-…0dc80` | facebook.com/TSCteignmouthsocialclub/ | — | 1 Den Cres address matches exactly |
| The Ferry Boat Inn, Shaldon | `15984058-…9f600d5f2` | facebook.com/ferryboatshaldon/ | theferryboatinn.co.uk | The Strand address matches exactly |
| Hamiltons, Torquay | `78a037d1-…f9acd` | facebook.com/p/Hamiltons-Babbacombe-100063497891608/ | — | 63 Babbacombe Downs Rd address matches exactly |
| Plympton Conservative Club | `1d781fb6-…9bf050` | facebook.com/p/Plympton-Conservative-Club-100027872367020/ | plymptonconservativeclub.co.uk | 109 Ridgeway address matches exactly |
| The Two Bridges, Saltash | `bf3aba1b-…22453` | facebook.com/TheTwoBridgesInnSaltash/ | the2bridges.co.uk | 13 Albert Rd address matches exactly |
| Calstock Social Club | `de40a888-…6c7f742` | facebook.com/people/Calstock-Social-Club/100070578840611/ | — | exact name match, Calstock confirmed |
| The Devon Yeoman, Exeter | `440e7f4b-…845815` | facebook.com/p/The-Devon-Yeoman-100043347200239/ | — | 156 Beacon Ln address matches exactly |
| Heavitree Social Club LTD | `333d7a34-…e91fb` | facebook.com/heavitreesocialclub/ | — | 2 Wonford Hill address matches exactly |
| Eyre Court Hotel, Seaton | `2920b938-…dd8bb` | facebook.com/eyrecourthotel/ | eyrecourt.co.uk | 2 Queen St address matches exactly |
| The Galleon Inn, Fowey | `c82994d1-…9f9d1` | facebook.com/thegalleoninn/ | galleon-inn.co.uk | 12 Fore St address matches exactly |
| George Inn, Hatherleigh | `d80b2716-…af595` | facebook.com/p/The-George-Inn-Hatherleigh-100087768408896/ | georgeinnhatherleigh.uk | 5 Market St address matches exactly |
| The Kings Arms, Okehampton | `a7cb243e-…72dec` | facebook.com/thekingsarmsoke/ | kingsarmsokehampton.co.uk | 5 St James St address matches exactly |
| The London Inn, Braunton | `e0838352-…62bb1` | facebook.com/londoninnbraunton/ | londoninnbraunton.uk | 17 Caen St address matches exactly |
| Woolsery Community Hall | `19f5128c-…4299a` | facebook.com/p/Woolfardisworthy-Community-Sports-Hall-100064528846631/ | woolsery.net | charity name "Woolfardisworthy Sports and Community Hall" exact match |
| The Kings Arms Weymouth | `865d6528-…8ee1ef` | facebook.com/p/The-Kings-Arms-Weymouth-100070656663470/ | — | 15 Trinity Rd address matches exactly |

All read back with `get_by_id`. No Chrome used for venues (§FP.2 — no bio field, Google-only).

## Venues — partial write (1)

- **The New Inn, Sampford Courtenay** (`374e6736-…19d67`) — own website confirmed (newinnsampfordcourtenay.co.uk, address matches exactly); only a Facebook **group** found (`facebook.com/groups/thenewinnsampfordcourtenay/`), not an official page — excluded per the group-URL rule, facebookUrl left blank.

## Venues — evidenced blank, Google tried (6)

- **The Blacksmiths Arms, Gosforth** (`10432a06-…455146`) — address matches exactly (200 High St, Gosforth), no confident Facebook page surfaced despite extensive pub-directory coverage.
- **Annitsford Welfare Club** (`4082b952-…d2fabbd8bb`... `4082b952-b9e3-4f81-acc0-2dd9f41fdcef`) — no confident match; only "Annitsford Irish Club" (different venue) and generic community pages found.
- **New Hartley Memorial Hall** (`2a48a6a4-…865e-610d52889b6b`) — only a Residents-Association-run "Community Events" page found, not the hall's own page.
- **Canal Tavern, Kidsgrove** (`367490c2-…584dfe2`) — a same-name page exists for a different Canal Tavern (Thorne); no confident page for the Kidsgrove location.
- **The Beehive Inn, Yeovil** (`3450464e-…4d014c`) — no official page surfaced, only a 1950s-history Facebook group post and Instagram accounts.
- **Christchurch Conservative Club** (`aa8df727-…aa65f6`) — no venue-owned page surfaced, only third-party Facebook event pages tagging the club's address.

## Artists — enriched WITH a verified page (7)

| Artist | id | facebookUrl | Signal |
|---|---|---|---|
| Bones Park Rider, Worksop | `74179e89-…59368d` | facebook.com/bonesparkrider/ | Musician/band, 850 followers, independently corroborated (bandcamp/press) as Sheffield-based — adjacent to stored Worksop location (§1A.2 adjacency). No real bio text on page (only a genre tag) — bio left empty, `genres` inferred as Rock/Alternative from "Dark Alt Rock" tag, `actType` set to originals (own album release, evidence points away from covers per §0.18) |
| Dr Hackenbush | `bf154277-…3e21a` | facebook.com/hackenbushmusic/ | Musician/band, 418 followers, own-page bio quoted verbatim, explicitly states "a covers band" (actType confirmed), corroborated South Yorkshire/East Midlands base consistent with stored "Yorkshire" region |
| Wildtide, Torquay | `a7a9283b-…46e4a31be`... `a7a9283b-d470-46e4-ba7d-18614a846c60` | facebook.com/Wildtideband | Musician/band, 373 followers, own-page bio quoted verbatim, states "Devon based" — consistent with Torquay, matches existing genres/actType exactly |
| West End Jerseys, Hampshire UK | `9c141a60-…a6498` | facebook.com/westendjerseys/ | Musician/band, 1.9K followers, sole candidate, verbatim name match, bio quoted verbatim confirms tribute act to Frankie Valli/Four Seasons — matches existing actType tribute + genres Pop/60s exactly (Tier B: sole candidate + category + current activity + plausible followers) |
| I Love Amp, Plymouth | `15037362-…3205c2` | facebook.com/iloveampband | Musician/band, 2.4K followers, own-page bio quoted verbatim, states "from the South-West" — consistent with Plymouth; genres Rock/Pop/Dance inferred from bio |
| Hell's Jukebox (was "Hells Jukebox"), Paignton | `5ba38c90-…020e15` | facebook.com/hellsjukebox/ | Musician/band, 324 followers, own-page bio quoted verbatim; page's own name carries an apostrophe the stored record lacked — corrected under §0.20 (act's own page is naming authority), old form kept as `nameVariants`. Corroborated Torquay/Paignton area via a Manor Inn Torquay gig mention |
| Hatchet Jack, Barnstaple | `bd8fe7f2-…9f227b` | facebook.com/hatchetjack.co.uk/ | Band, 496 followers, own-page bio quoted verbatim, states "A local Devon Covers Band" — consistent with Barnstaple/North Devon |

No avatar recipe run this pass on any of the 7 (flagged `STUB_NO_IMAGE` by the validator — expected, harmless).

## Artists — evidenced blank / near-miss, both surfaces tried (8)

| Artist | id | Location on record | Why rejected |
|---|---|---|---|
| Lovin' It | `fdb07a79-…9ce0e49b65cc` | Staffordshire UK | Same-name trio found via an agency listing (Shout Entertainment) but no location confirmation and no facebook link surfaced |
| Into Pieces | `b120d178-…8b3-…4a08`... `b120d178-32b2-425e-b4d4-567ede2b4a08` | Hampshire | No confident match; only unrelated same-name acts (Swedish rock band, Winchester's Caretaker, Southampton's Coast) |
| **The Jays** | `90d0d2d3-…2b4a08`... `90d0d2d3-5df1-4a21-aaab-f12a1b81a6ef` | Kingsteignton | **Near-miss**: a Newton Abbot vocal/instrumental duo playing standards + original folk material found via Teignmouth Folk Festival lineup — adjacent town, matches actType covers+originals — but no facebookUrl could be confidently tied to it among several unrelated same-name acts (NE function band, Jamaican reggae band, gospel band). Flagged for a human glance |
| Rob Hunt | `c4f1f7bc-…c33ad37` | Paignton | No confident match; only unrelated same-name musicians (US jazz pianist, other Wikipedia Hunts) |
| Jason Howard | `4191b5d7-…ee6f3` | Paignton | No confident match; only unrelated same-name performers (Welsh baritone, Nashville session musician) |
| Christian Harling | `2389ca4a-…6ae07c` | Exeter | Act confirmed to exist (Soul/Motown singer, South West, matches stored genre/actType exactly) but only personal Facebook profiles found (`christian.harling`, `christian.harling.1`) — not attachable per §2A.1 item 4 personal-profile exclusion |
| Black Dog Rythmn & Blues | `0409aeea-…368c` | Bridport | No confident match; only unrelated same-name acts (Black Dog RVA, Black Dog Blues Band, Blackboard Blues Band) |
| **Mark Davis** | `730439cc-…60ddcdbaf30f` | Bridport | **Near-miss, not attached**: "Mark Davis Group" page found (facebook.com/markdavisrock/), 57 followers, bio just "Rock Music", no location stated — Tier C name+genre-only match per §5.2, not sufficient. Left blank |

## Names corrected under §0.6/§0.20

- **Hell's Jukebox** (`5ba38c90-…020e15`) — "Hells Jukebox" → "Hell's Jukebox", the act's own page name (apostrophe). Old form preserved as `nameVariants`.

## Validator

```
7 records · 0 clean · 0 FAIL · 8 WARN   [mode=gate]
```
Exit code 0. The 8 WARNs: 7× `STUB_NO_IMAGE` (no avatar recipe run this pass on any of the 7 verified artists — expected) + 1× `STUB_NO_BIO` on Bones Park Rider (page carries only a genre tag, no real bio prose to quote — correctly left empty per §0.0 rather than inventing one). 0 FAIL.

Note: `enrichment_validate.py` validates **artist** records only (bio-verbatim/location/facebookUrl checks) — it has no venue-specific ruleset, consistent with §FP.2 stating venues carry no bio field and no Chrome requirement. The 30 venue writes were verified by `get_by_id` read-back (§0.10) instead.

Evidence file: `data/state/enrichment-evidence-2026-08-07-bv2a-enrichment.jsonl` (this run appended 41 lines: 24 venue lines + 15 artist lines + 2 near-miss lines already counted within the 24/15, on top of the 140 already there from runs 01–07 today), written before each corresponding bndy write.

## Ledger and dashboard

45 ledger lines appended (23 venue-verified, 1 venue-staged/partial, 6 venue-blank, 7 artist-verified, 8 artist-blank) + 1 snapshot line. Snapshot: `artistsTotal 1917 · artistsMissingSocials 766 (down 7 from this run's artist verifies) · artistsMissingGenres 684 · venuesTotal 2107 · venuesMissingSocials 749 (down from 773 pre-run — 23 verified + 1 partial(website-only, filter unchanged for that one since it lacks facebookUrl) venues cleared/reduced the missing-socials filter)`. Dashboard regenerated: `data/normalized/enrichment/DASHBOARD.html` (350 records, 12 snapshots).

## Open items for Jason

1. **The Jays** (Kingsteignton) — a plausible Newton Abbot duo match exists (Teignmouth Folk Festival lineup, adjacent town, matching actType) but no facebookUrl could be confidently isolated. Worth a human 30-second Facebook check.
2. **Mark Davis** (Bridport) — "Mark Davis Group" page is a plausible but thin (57-follower, no-location) candidate. Left blank per Tier C exclusion; flagged in case a human recognises it.
3. **Christian Harling** (Exeter) — act confirmed real and matching, but only personal Facebook profiles found. Candidate profile urls noted in the evidence file for a human to judge, or wait for the upload-image path per §2A.4.
4. **Bones Park Rider** — attached on adjacency + independent corroboration (Sheffield ~20mi from stored Worksop) rather than a page-stated location, since the page itself carries no About/location field. Worth a human glance to confirm Worksop vs a Sheffield correction.
5. Six venues remain genuinely evidenced-blank this run (list above) — none had an obvious next step; re-eligible after the 90-day cooldown or on new gig contact.

## Budget used

~20 minutes wall-clock (08:17–08:37 UTC), well under the 40-minute target. Record count: 30 venues (at cap) + 15 artists (at cap). Circuit breaker did not fire. Lock acquired cleanly under the literal 55-minute rule (no override needed — lock was ~100 minutes old).

## Step 6 — lock release

Releasing per §6G content-based convention: overwriting `data\state\enrichment.lock` with `{"heldBy":null,"releasedAt":"<iso>","expiresAt":"1970-01-01T00:00:00Z","lastRun":"bv2a-enrichment-hourly-unattended-bv2a-20260807T081706Z"}`.
