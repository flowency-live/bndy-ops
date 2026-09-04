# Bv2a Enrichment — RUN REPORT — 2026-08-18, firing 15 (15:18Z)

## Step 0 — Circuit breaker

Read the last 3 run reports (RUN-REPORT-14, 13, 12, all dated 2026-08-18). Each recorded 0
outstanding FAIL from the validator on its final run. 0 of 3 recorded a FAIL. **Breaker NOT
TRIPPED.**

Heartbeat written first: `data\state\heartbeat\bv2a-enrichment-2026-08-18T15-18-08Z.json`,
`outcome:"started"`.

## Step 1 — Concurrency

Claim file: `data\state\claims\bv2a-enrichment.json` (the runbook-correct path; the task
prompt's `data\state\claims\enrichment.json` has never existed — standing fingerprint
`bv2a-claim-path-stale-in-prompt`). Read before the runbook: `heldBy:null`, released by
firing 14 at 14:55:00Z — **acquired** at 15:18:08Z, TTL 3h (expires 18:18:08Z).
`data\state\enrichment.lock` not present; not honoured, not recreated.

## Step 2 — Runbook read

RUNBOOK.md read in full this firing: H1 = **v2.27** (2026-08-08), CURRENT FLOOR (§6A) =
**v2.19** — check passed. Read §2A.1 items 3b (both Facebook search and Google mandatory
before any artist blank) and 8 (bio is quoted, never written) verbatim, §2A.2 mechanics, §3
venue protocol, §6A run contract, §6F/§6G concurrency in full. Read ENRICHMENT-TASK-v3.md
§0.0 and §FP in full: §FP.2 confirms venues need only `website`/`facebookUrl`, no bio, no
Chrome. Read CTO-INBOX.md tail in full: confirmed standing, still-live fingerprints —
`bv2a-claim-path-stale-in-prompt`, `validator-venue-schema-mismatch`,
`validator-venue-evidence-loader-artistid-only`, `validator-fb-evidence-mismatch-fp2-corroboration`,
`bv2a-edit-venue-facebookurl-param-does-not-exist`, `bv2a-firing14-enrich-venue-batch-array-not-found`
— all still current, none superseded. Used `socialMediaUrls` (never the non-existent
`facebookUrl` param) on every `edit_venue` call this firing and confirmed `updatedFields` on
every response — no silent no-op writes. Did not attempt the `enrich_venue` batch-array path
(known broken per firing 14) — went straight to `WebSearch` per venue under §FP.2.

## Chrome check

`list_connected_browsers` returned `[]`. **Eighteenth consecutive firing** with Chrome
unreachable, spanning firing 22 (2026-08-17 22:17Z) through this firing (2026-08-18 15:18Z),
over 17 hours. Per the task's HARD STOPS table: venues proceed under FP.2 (no Chrome
required); all artist work (priorities 1, 4, 5) is skipped this firing. The 6 priority-1
artist candidates identified in firing 14 (Camems, Whiskey Rebel, Guns for Girls, One
Dimensional Creatures, Uncle Dad & The Day Drinkers, Devoted) remain stranded and carry over
again.

## Step 3 — Work

**Priority 1** (artists created in the last 24h missing socials): skipped, Chrome
unreachable — hard-stopped this firing per the HARD STOPS table.

**Priority 2** (venues created in the last 24h missing socials): `list_venues(createdSince:
<24h ago>, missingSocials:true)` returned **0 candidates**.

**Priority 3** — backlog venues missing socials, oldest createdAt first. Selection method:
paged `list_venues(missingSocials:true)` across the first 80 of 378 records (offsets 0–80),
pooled and sorted by `createdAt` ascending, cross-checked against today's evidence file
(`enrichment-evidence-2026-08-18-enrichment.jsonl`, 386 unique ids worked before this firing)
to exclude records already worked today. Also excluded: records already carrying a standing
CTO-INBOX non-venue/mismatch flag (Okehampton Show ground, Venue TBC, United match, Ann
Welfare Playing Fields, West Park Long Eaton, Seabridge, The Nest, The Decorated Dead Tattoo
Studio, Campbell Park, Gostrey Meadow, Plympton Spice Plymouth, Jubilee Park Horndean, Darcy's
possible closure); non-UK venues from the known foreign-capture batch (externalId prefix
`6022ef13-…` and siblings — Lille, Paris/Montreuil, Stockholm x2, Athens, Thessaloniki,
Gothenburg, Copenhagen, Dublin, Hamburg). **This was not an exhaustive sort of the full
378-record backlog** — the same honest caveat as prior firings: a complete global sort was
not attempted, only the pooled first 80.

**30 venues worked: 26 verified (website and/or facebookUrl attached), 4 evidenced blank.**

| Venue | City | Fields written | Signal |
|---|---|---|---|
| King Edward VII | Halesowen | facebookUrl | FB page "King Edward VII \| Halesowen", 88 Stourbridge Rd address matches; next to Halesowen Town FC |
| The Rushden Town Band Club | Rushden | website, facebookUrl | FB (775 likes) + own site rushdentownband.com, Rushden Hall NN10 9NG matches |
| The White Lion | St Albans | website, facebookUrl | Own site whitelionstalbans.com + FB, 91 Sopwell Lane address matches exactly |
| Walkford | Christchurch | website, facebookUrl | FB (~3,000 likes) + Greene King chain page, 16 Walkford Road BH23 5QF matches |
| Prestwood Recreation Ground | Prestwood | — (blank) | Council-run rec ground (Great Missenden Parish Council); no dedicated own page — possible non-venue, flagged |
| The Cock Inn | St Albans | — (blank) | Only page found has 3 likes/6 check-ins — too weak a signal to confidently attach |
| The Bull Hotel | Olney | website, facebookUrl | Own site bullhotelolney.co.uk + FB (2,240 likes), 9 Market Pl address matches |
| Stevenage Club & Institute/ Old Town Social Club | Stevenage | website, facebookUrl | Own site (Wix) + FB, 31 High St address matches exactly |
| Swanage RBL | Swanage | website, facebookUrl | Own site therblswanage.co.uk + FB, 150 High St address matches exactly |
| The Dove | Newport Pagnell | website, facebookUrl | Own site dovenewportpagnell.co.uk + FB (1,783 likes), 6 Wordsworth Ave matches |
| The Crown & Treaty | Uxbridge | website, facebookUrl | Own site thecrownandtreaty.co.uk + FB, 90 Oxford Rd matches, historic Civil War pub |
| The Waie Inn | Zeal Monachorum | website, facebookUrl | Own site waieinn.co.uk + FB (7,582 likes) |
| Walton Hersham & Oatlands Conservative Club | Walton-on-Thames | — (blank) | Only Instagram found; the one FB result (Esher & Walton Conservatives) is an unrelated political party page |
| The Three Lions | Farncombe | website, facebookUrl | Own site threelionsfarncombe.co.uk + FB, 55 Meadrow address matches exactly |
| O'Neill's Woking | Woking | website | Chain "find us" page for this branch; no confident dedicated FB page surfaced across two searches — FB left blank |
| Shillington sports & social club | Shillington | facebookUrl | FB page, Playing Fields Greenfields Shillington matches |
| Lansdowne Inn Torquay | Torre | website | Craft Union chain own page; two competing FB pages found, neither confirmed current — two-candidates-compete, FB left blank |
| The Drapers Arms | Stevenage | website, facebookUrl | Own site thedrapersarms.pub + FB, 76 High St address matches |
| Kings Arms Otterton | Otterton | website, facebookUrl | Own site kingsarmsotterton.co.uk + FB (1,894 likes), Fore St address matches |
| Apple Tree | Woodmancote | website, facebookUrl | Greene King chain page + FB, Woodmancote GL52 9QG matches |
| The Two Mile Oak Inn | Newton Abbot | website, facebookUrl | Own site twomileoakinn.co.uk + FB (2,496 likes) |
| Tom tiddlers tavern | Stevenage | facebookUrl | FB page (949 likes), 1 Filey Cl SG1 2JW matches; CAMRA confirms no website exists |
| The Smugglers Inn | Seaton (Torpoint) | website | Own site smugglersinn.co.uk; two competing FB pages found — two-candidates-compete, FB left blank |
| Pathfinder Social Club | Pathfinder Village | website | Own site pathfindersocialclub.co.uk; three competing FB pages found (Village Hall & Social Club, general village page, residents association) — FB left blank |
| Merstham Village Club | Merstham | website, facebookUrl | Own site (WordPress) + FB, Station Rd N address matches |
| Hunstanton Bandstand | Hunstanton | — (blank) | Council-run bandstand (Borough Council of King's Lynn & West Norfolk); no dedicated own page — possible non-venue, flagged |
| Mendip Activity Centre | Sandford | website | Own site mendip.co.uk confirmed; no confident dedicated FB page surfaced — FB left blank |
| The Barton Inn | Barton St David | website, facebookUrl | Own site bartoninn.co.uk + FB, Main Street address matches |
| The Cross Keys Inn | Lydford-on-Fosse | website, facebookUrl | Own site crosskeysinn.info + FB, East Lydford TA11 7HA matches |
| The Hop Inn | Bournemouth | website, facebookUrl | Own site thehopinn.co.uk + FB, 6 West Cliff Rd address matches exactly |

## Near-misses / flags for a human look

- **Prestwood Recreation Ground** (`ab47bbde-f330-4e1e-b8ea-0d4e6d0ea6e9`) and **Hunstanton
  Bandstand** (`59a6224b-b454-45e2-b0af-04006a92c0e7`): both council-run public open spaces
  with no dedicated business-style social presence of their own — same class as the earlier
  Campbell Park / Gostrey Meadow / West Park Long Eaton / Ann Welfare Playing Fields findings.
  Not enriched. Needs a human check of whether these should exist as bndy venue records.
- **The Cock Inn, St Albans** (`b1e3ae19-2a84-406a-8813-e4a767eb308e`): the only Facebook page
  found for this real, listed pub (48 St Peter's Street) has just 3 likes and 6 check-ins —
  suspiciously weak for an active city-centre pub, and not confidently its own current page.
  Left blank rather than attach a low-signal page.
- **The Smugglers Inn, Seaton** (`7b6241fd-19da-415b-9a76-0e16db646ca8`) and **Pathfinder
  Social Club** (`7fa7d557-6ff3-4a2a-be2c-382c719c9140`): both have a confident own website but
  multiple competing Facebook pages/groups with no single one clearly current — website
  attached, Facebook left blank rather than guess.

## Validator

Adapter files (`data/normalized/enrichment/records-2026-08-18-firing1526.json`,
`data/state/tmp/evidence_aliased_1526.jsonl`), following the standing
`validator-venue-schema-mismatch` / `validator-venue-evidence-loader-artistid-only`
fingerprints: venue `facebookUrl` supplied as a top-level field, `location` aliased from
`city`, evidence `venueId` keys aliased to `artistId` for the loader — one evidence line
selected per record (the Facebook-page line where a facebookUrl was stored, else the
website/blank line, so the FB-URL evidence match is checked against the correct capture). All
30 records included.

**Validator summary line (verbatim, first and only run): `30 records · 9 clean · 0 FAIL · 42
WARN   [mode=gate]`**

WARNs: `STUB_NO_BIO`/`STUB_NO_IMAGE` on all 21 verified-with-FB venues (expected — FP.2
venues carry no bio field and need no Chrome avatar fetch, per the standing
`validator-fb-evidence-mismatch-fp2-corroboration` fingerprint). No FAIL outstanding.

## Circuit breaker

Not fired. No FAIL outstanding in the validator's only run.

## Budget used

30 venues worked (26 written to bndy verified, 4 evidenced blank) against the 30-venue /
15-artist / 40-minute budget. Venue cap reached; stopped cleanly. 0 artists worked (Chrome
unreachable — hard stop on the artist portion only; 6 candidates from firing 14 remain
stranded and carry over again). Wall-clock: claim acquired 15:18:08Z, ledger/dashboard writes
complete ~15:30Z — well inside the 3h claim TTL.

- Appended 30 `type:"enrich"` lines (26 `outcome:"verified"`, 4 `outcome:"blank"`) to
  `data/state/enrichment-ledger.jsonl`, plus one `type:"snapshot"` line:
  `artistsTotal:2231, artistsMissingSocials:867, artistsMissingGenres:614, venuesTotal:3004,
  venuesMissingSocials:352` (from live `list_venues`/`list_artists` pagination.count at
  15:29Z). `venuesMissingSocials` dropped from 378 to 352 — a delta of 26, an exact 1:1 match
  with the 26 venues verified this firing. `artistsTotal`, `artistsMissingSocials` and
  `artistsMissingGenres` unchanged from firing 14's snapshot, consistent with no artist work
  this firing. `venuesTotal` unchanged at 3004 — no venue creates this firing (this task only
  edits).
- Appended one line to `data/state/run-summary.jsonl`:
  `{"date":"2026-08-18","task":"enrichment","finishedAt":"2026-08-18T15:30:00Z","outcome":"completed","gigsAdded":0,"artistsAdded":0,"venuesAdded":0,"recordsEnriched":26,"skipped":4,"note":"30 venues worked (26 verified, 4 blank). Chrome unreachable 18th firing, artists skipped."}`
- Regenerated both dashboards: `data/normalized/enrichment/DASHBOARD.html` (1974 records, 65
  snapshots) and `data/normalized/DASHBOARD.html`.

## CTO-INBOX

Lines to append: `bv2a-chrome-unreachable-eighteen-consecutive-firings` (BLOCKED, continuing
the standing sequence from firings 22 through 14, now over 17 hours, 6 stranded priority-1
artist candidates carrying over a second firing). Prestwood Recreation Ground / Hunstanton
Bandstand possible-non-venue findings, The Cock Inn weak-signal-page finding, and the
Smugglers Inn / Pathfinder Social Club two-candidates-compete findings are recorded in this
report as low-risk data notes, consistent with how prior firings handled the same class of
finding.
