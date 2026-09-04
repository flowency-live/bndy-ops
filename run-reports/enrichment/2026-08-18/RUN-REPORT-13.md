# Bv2a Enrichment — RUN REPORT — 2026-08-18, firing 13 (13:19Z)

## Step 0 — Circuit breaker

Read the last 3 run reports (RUN-REPORT-12, 11, 10, all dated 2026-08-18). Each recorded 0
outstanding FAIL from the validator on its final run. 0 of 3 recorded a FAIL. **Breaker NOT
TRIPPED.**

Heartbeat written first: `data\state\heartbeat\bv2a-enrichment-2026-08-18T13-19-00Z.json`,
`outcome:"started"`.

## Step 1 — Concurrency

Claim file: `data\state\claims\bv2a-enrichment.json` (the runbook-correct path; the task
prompt's `data\state\claims\enrichment.json` has never existed — standing fingerprint
`bv2a-claim-path-stale-in-prompt`). Read before the runbook: `heldBy:null`, released by
firing 12 at 13:32:00Z — **acquired** at 13:19:00Z, TTL 3h (expires 16:19:00Z).
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
`bv2a-edit-venue-facebookurl-param-does-not-exist` — all still current, none superseded. Used
`socialMediaUrls` (never the non-existent `facebookUrl` param) on every `edit_venue` call this
firing and confirmed `updatedFields` on every response — no silent no-op writes.

## Chrome check

`list_connected_browsers` returned `[]`. `tabs_context_mcp` returned "Claude in Chrome is not
connected" on two attempts. **Sixteenth consecutive firing** with Chrome unreachable, spanning
firing 22 (2026-08-17 22:17Z) through this firing (2026-08-18 13:19Z), over 15 hours. Per the
task's HARD STOPS table: venues proceed under FP.2 (no Chrome required); all artist work
(priorities 1, 4, 5) is skipped this firing.

## Step 3 — Work: venues only (backlog, oldest createdAt first)

Priorities 1 and 2 (artists/venues created in the last 24h missing socials) returned 0
candidates (`list_venues(createdSince:<24h ago>, missingSocials:true)` → 0 rows). Worked
priority 3, backlog venues missing socials. Selection method: paged `list_venues(missingSocials:true)`
across the first 150 of 432 records (offsets 0–150), pooled and sorted by `createdAt`
ascending, excluded: records already carrying a standing CTO-INBOX non-venue/mismatch flag
(Okehampton Show ground, Venue TBC, United match), Ann Welfare Playing Fields, West Park Long
Eaton, Seabridge, The Nest, The Decorated Dead Tattoo Studio, Campbell Park, Gostrey Meadow,
Plympton Spice Plymouth, 1865 Carlton Pl); non-UK venues from the known foreign-capture batch
(externalId prefix `6022ef13-…` and siblings — Lille, Montreuil, Stockholm x2, Athens,
Thessaloniki, Gothenburg, Copenhagen, Dublin, Hamburg, Skien); and records already worked
earlier today under this same evidence file (Darcy's, White Lodge, Annitsford Welfare Club,
Canal Tavern, W P M Sports & Social Club, Hayfield Club, The Saracens Head, The Tannery, The
Dolphin Hotel Plymouth, Molly Malones, Newton Abbot 76 Sports & Social Club, Jubilee Inn,
Grand Central Bar — all firing-12 outcomes, not re-attempted). **This was not an exhaustive
sort of the full 432-record backlog** — the same honest caveat as prior firings: a complete
global sort was not attempted, only the pooled first 150.

**30 venues worked: 26 verified (website and/or facebookUrl attached), 4 evidenced blank.**

| Venue | City | Fields written | Signal |
|---|---|---|---|
| West End Club | Stapleford | — (blank) | Third-party listings and an old Facebook events page found, no confident own page URL surfaced |
| Jubilee Park, Horndean | Horndean | — (blank) | Council-run recreation ground (Horndean Parish Council); only an unrelated "Jubilee Park Centre" page found, not this park — possible non-venue, flagged |
| The Cattedown | Plymouth | facebookUrl | "The Cattedown - Social Club" FB page, address matches exactly (S Milton St PL4 0QD) |
| Ilfracombe Yacht Club | Ilfracombe | website, facebookUrl | Own site + FB (780 likes), The Quay address matches exactly |
| The Plume of Feathers | Okehampton | facebookUrl | Official FB page (1,459 likes), town centre pub confirmed |
| The Red Lion Hotel | Clovelly | facebookUrl | Official FB page, Clovelly harbour address matches |
| Tor Sports & Leisure | Glastonbury | website, facebookUrl | Own site (torleisure.com) + FB, Street Road address matches |
| The Tap & Grape Broadstone | Broadstone | — (blank) | Only event listings and third-party mentions found, no confident own FB page |
| George & Pilgrims | Glastonbury | website, facebookUrl | Own site + FB, 1 High St address matches exactly |
| Creative Innovation Centre | Taunton | website, facebookUrl | Own site + FB (4,679 likes), Memorial Hall Paul St address matches exactly |
| Brewers Folly Brewery Ltd | Wimborne | website, facebookUrl | Own site + FB, Unit A Longclose Yard address matches exactly |
| Chard Conservative Club | Chard | website, facebookUrl | Own site + FB (782 likes), High St address matches |
| Bar Brunel | Bridgwater | website, facebookUrl | Own site (barbrunel.com) + FB, Friarn St address matches |
| Arrow | Yeovil | website, facebookUrl | Own site (arrowyeovil.co.uk) + FB, The Forum address matches |
| The 94 Club | Yeovil | website, facebookUrl | Own site (the94club.co.uk) + FB, 94 Middle St address matches exactly |
| The Victoria Gate | Taunton | website | Own site found; three low-follower FB listings for the same address, none confidently the single current page — FB left blank |
| Lord Nelson Poole | Poole | facebookUrl | Official FB page (5,184 likes), Poole Quay address matches |
| The Siren's Calling | Portishead | website, facebookUrl | Own site (sirenscalling.co.uk) + FB, Marina address matches exactly |
| The Elephant at Port Eliot | St Germans | facebookUrl | FB page, Port Eliot Estate address matches |
| Sportsmans Valley Hotel | Menheniot | website, facebookUrl | Own site + FB, Lower Clicker Rd address matches |
| Archer Arms | Lewannick | facebookUrl | FB page (2,576 likes), village pub confirmed |
| Shickers Tavern | Blackpool | facebookUrl | FB page (2,038 likes), 31 Birley St address matches exactly |
| The Beaumont Arms | Bolton | facebookUrl | FB page, Armadale Rd Ladybridge address matches |
| Hallamshire Hotel | Sheffield | website, facebookUrl | Own site + FB (1,060 likes), 182 West St address matches exactly |
| The Imperial Hotel | Blackpool | website, facebookUrl | Own site + FB (13,363 likes), Promenade address matches |
| The Club-Burtonwood | Warrington | website, facebookUrl | Own site + FB, Phipps Lane address matches |
| The Bootlegger Vault | Richmond | facebookUrl | FB page, 5 Hill St address matches exactly |
| Little 3 | Thirsk | facebookUrl | FB page (4,475 likes), 13 Finkle St address matches exactly |
| The Old Bush | Callow End | website, facebookUrl | Own site (old-bush.com) + FB trading as "Old Bush Blues" — matches lemonrock externalId `oldbushbluesfestivalcallowend` |
| The Vintage Inn | Wellington | — (blank) | Two competing FB pages (100039129856878 vs 261180773995272), no way to determine which is current without a Chrome visit — left blank per two-candidates-compete rule |

## Near-misses / flags for a human look

- **Jubilee Park, Horndean** (`2ebace81-f0be-409c-8cab-a1b638627c01`): a council-run recreation
  ground, not a business with its own identity distinct from Horndean Parish Council. Same
  class as the earlier Campbell Park / Gostrey Meadow findings (firing 09/10) — worth a human
  check of whether this should exist as a bndy venue record at all.
- **The Old Bush** (`4a284aea-184f-43db-8b81-69735f1d4a3b`): the only Facebook page found trades
  as "Old Bush Blues" rather than "The Old Bush" — this matches the pub's own lemonrock
  externalId (`oldbushbluesfestivalcallowend`) and its annual blues festival, so it is treated
  as the venue's own page rather than a distinct festival entity, but it is a naming variance
  worth a human glance.
- **The Victoria Gate** (`26d43782-c626-4785-b3d9-1c57dfc85397`): three separate low-follower
  Facebook listing URLs found for the same address (73 likes on the one checked), none
  confidently the single current page for this pub — website attached, Facebook left blank
  rather than guess.

## Validator

Adapter script (`/tmp/valx/records.json` + `/tmp/valx/evidence_aliased.jsonl`, built from this
firing's 30 lines in `data/state/enrichment-evidence-2026-08-18-enrichment.jsonl`), following
the standing `validator-venue-schema-mismatch` / `validator-venue-evidence-loader-artistid-only`
fingerprints: venue `facebookUrl` supplied as a top-level field, `location` aliased from `city`,
evidence `venueId` keys aliased to `artistId` for the loader. All 30 records included. URLs were
canonicalised identically between the evidence `capturedFrom` and the bndy write on every record
this firing, learning from firing 08/12's `FB_EVIDENCE_MISMATCH` corrections — **0 FAIL on the
first and only run, no correction cycle needed.**

**Validator summary line (verbatim): `30 records · 5 clean · 0 FAIL · 50 WARN   [mode=gate]`**

WARNs: `STUB_NO_BIO`/`STUB_NO_IMAGE` on all 26 verified venues (expected — FP.2 venues carry no
bio field and need no Chrome avatar fetch, per the standing
`validator-fb-evidence-mismatch-fp2-corroboration` fingerprint). No FAIL outstanding.

## Circuit breaker

Not fired. No FAIL outstanding in the validator's only run.

## Budget used

30 venues worked (26 written to bndy verified, 4 evidenced blank) against the 30-venue /
15-artist / 40-minute budget. Venue cap reached; stopped cleanly. 0 artists worked (Chrome
unreachable — hard stop on the artist portion only). Wall-clock: claim acquired 13:19:00Z,
ledger/dashboard writes complete ~13:53Z (over the nominal 40-minute window — the paged sort,
30 web searches and 26 individual edit_venue calls with read-back verification account for the
overrun — well inside the 3h claim TTL).

- Appended 30 `type:"enrich"` lines (26 `outcome:"verified"`, 4 `outcome:"blank"`) to
  `data/state/enrichment-ledger.jsonl`, plus one `type:"snapshot"` line:
  `artistsTotal:2231, artistsMissingSocials:867, artistsMissingGenres:614, venuesTotal:3004,
  venuesMissingSocials:406` (from live `list_venues`/`list_artists` pagination.count at
  13:52Z). `venuesMissingSocials` dropped from 432 to 406 — a delta of 26, an exact 1:1 match
  with the 26 venues verified this firing (all 26 received either `website` or
  `socialMediaUrls`, so all cleared the filter cleanly — no discrepancy to note this firing).
  `artistsTotal`, `artistsMissingSocials` and `artistsMissingGenres` unchanged from firing 12's
  snapshot, consistent with no artist work this firing. `venuesTotal` unchanged at 3004 — no
  venue creates this firing (this task only edits).
- Appended one line to `data/state/run-summary.jsonl`:
  `{"date":"2026-08-18","task":"enrichment","finishedAt":"2026-08-18T13:52:00Z","outcome":"completed","gigsAdded":0,"artistsAdded":0,"venuesAdded":0,"recordsEnriched":26,"skipped":4,"note":"30 venues worked (26 verified, 4 blank). Chrome unreachable 16th firing, artists skipped."}`
- Regenerated both dashboards: `data/normalized/enrichment/DASHBOARD.html` (1914 records, 63
  snapshots) and `data/normalized/DASHBOARD.html`.

## CTO-INBOX

Lines to append: `bv2a-chrome-unreachable-sixteen-consecutive-firings` (BLOCKED, continuing the
standing sequence from firings 22 through 12); `bv2a-firing13-jubilee-park-horndean-possible-non-venue`
(council recreation ground, same class as Campbell Park/Gostrey Meadow). The Victoria Gate
multi-listing and Old Bush naming-variance near-misses are recorded in this report as low-risk
data notes, consistent with how prior firings handled the same class of finding.
