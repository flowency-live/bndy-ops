# Bv2a Enrichment — RUN REPORT — 2026-08-18, firing 14 (14:19Z)

## Step 0 — Circuit breaker

Read the last 3 run reports (RUN-REPORT-13, 12, 11, all dated 2026-08-18). Each recorded 0
outstanding FAIL from the validator on its final run. 0 of 3 recorded a FAIL. **Breaker NOT
TRIPPED.**

Heartbeat written first: `data\state\heartbeat\bv2a-enrichment-2026-08-18T14-19-28Z.json`,
`outcome:"started"`.

## Step 1 — Concurrency

Claim file: `data\state\claims\bv2a-enrichment.json` (the runbook-correct path; the task
prompt's `data\state\claims\enrichment.json` has never existed — standing fingerprint
`bv2a-claim-path-stale-in-prompt`). Read before the runbook: `heldBy:null`, released by
firing 13 at 13:55:00Z — **acquired** at 14:19:28Z, TTL 3h (expires 17:19:28Z).
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

`list_connected_browsers` returned `[]`. Per the task's HARD STOPS table: venues proceed
under FP.2 (no Chrome required); all artist work (priorities 1, 4, 5) is skipped this firing.
**Seventeenth consecutive firing** with Chrome unreachable, spanning firing 22 (2026-08-17
22:17Z) through this firing (2026-08-18 14:19Z), over 16 hours.

## Step 3 — Work

**Priority 1** (artists created in the last 24h missing socials): `list_artists(createdSince:
<24h ago>, missingSocials:true)` returned **6 candidates** (Camems, Whiskey Rebel, Guns for
Girls, One Dimensional Creatures, Uncle Dad & The Day Drinkers, Devoted — all Staffordshire
originals/covers bands created 2026-08-18 04:13–04:15Z). **Skipped**, Chrome unreachable —
artist work is hard-stopped this firing; these carry over to the next firing with Chrome.

**Priority 2** (venues created in the last 24h missing socials): 0 candidates.

**Priority 3** — backlog venues missing socials, oldest createdAt first. Selection method:
paged `list_venues(missingSocials:true)` across the first 100 of 406 records (offsets
0–100), pooled and sorted by `createdAt` ascending, excluded: records already carrying a
standing CTO-INBOX non-venue/mismatch flag (Okehampton Show ground, Venue TBC, United
match), Ann Welfare Playing Fields, West Park Long Eaton, Seabridge, The Nest, The Decorated
Dead Tattoo Studio, Campbell Park, Gostrey Meadow, Plympton Spice Plymouth, Jubilee Park
Horndean); non-UK venues from the known foreign-capture batch (externalId prefix
`6022ef13-…` and siblings — Lille, Montreuil, Stockholm, Athens, Thessaloniki, Gothenburg,
Hamburg, Copenhagen, Dublin); and 356 records already worked earlier today across firings
1–13 under this same evidence file (not re-attempted — includes Darcy's, W P M Sports &
Social Club, White Lodge, Annitsford Welfare Club, Canal Tavern, Hayfield Club, The Saracens
Head, The Dolphin Hotel Plymouth, Molly Malones, Newton Abbot 76 Sports & Social Club,
Jubilee Inn, Grand Central Bar, West End Club, The Tap & Grape Broadstone, The Vintage Inn,
and others). **This was not an exhaustive sort of the full 406-record backlog** — the same
honest caveat as prior firings: a complete global sort was not attempted, only the pooled
first 100.

`enrich_venue` batch geocode was attempted first per §FP.2 step 0 but the tool's batch array
input returned `VENUE_NOT_FOUND` (does not accept a JSON array of ids through this
interface) — worked around by going straight to `WebSearch` per venue, per FP.2 steps 1–4.

**30 venues worked: 28 verified (website and/or facebookUrl attached), 2 evidenced blank.**

| Venue | City | Fields written | Signal |
|---|---|---|---|
| Revo Kitchen | Weston-super-Mare | website, facebookUrl | Own site (revokitchen.co.uk) + FB (6,769 likes), Marine Parade seafront address matches |
| The Court House Inn | Thrapston | website | Own site confirmed; Facebook mentioned by multiple directories but no single confident page URL surfaced across two searches — FB left blank |
| KC Active | King's Cliffe | website, facebookUrl | Own site (kcactive.co.uk) + FB (1,186 likes), Kingsmead Station Road address matches exactly |
| The Fish | Northampton | website | Own site confirmed; two competing old-style `/pages/` Facebook URLs found, neither confidently current — two-candidates-compete, FB left blank |
| Cattows Farm | Heather | website, facebookUrl | Own site (cattowsfarm.co.uk) + FB, distinct from the CattowsFarmWeddings sub-page, address matches |
| Lakefest | Eastnor | website, facebookUrl | Official festival site (lakefest.co.uk) + FB (lakefestuk), Eastnor Deer Park address matches |
| Embassy Tavern | Paignton | facebookUrl | FB page (915 likes), 3 Colin Road address matches exactly |
| The Dartmouth Inn | Totnes | website, facebookUrl | Own site (dartmouthinntotnes.co.uk) + FB — retired page Dartmouthinn25 explicitly points to this successor page, live-successor check per §2A.1.2 |
| Oxfam Music & Audio | Ealing | website | Own site confirmed; only Instagram presence found, no Facebook page surfaced — FB left blank |
| West Ewell Social Club | West Ewell | website, facebookUrl | Own site + FB (1,149 likes), 183 Chessington Road address matches |
| The Boulevard Club | Peterborough | website, facebookUrl | Own site (peterboroughboulevardclub.co.uk) + FB (1,825 likes) with a live post naming the exact gig address |
| Little Green Dragon | Winchmore Hill | website, facebookUrl | Own site (littlegreendragonenfield.com) + FB, 928 Green Lanes address matches; distinct from the unrelated "Save The Green Dragon" heritage page for the old 1720 pub site |
| The Lord Nelson | Kingskerswell | facebookUrl | FB page (537 likes, recent story post), Fore Street address matches; vanity URL resolves to the same page, a separate older page not used |
| Lark Hill Retirement Village | Clifton | facebookUrl | FB page (749 likes), ExtraCare-run village, New Rise address matches |
| The Saddlers Arms | Send Marsh | facebookUrl | FB page, Send Marsh Road address matches, live music confirmed |
| The Alfred Arms | Borehamwood | website, facebookUrl | Own site (thealfredarms.co.uk) + FB (1,110 likes), Shenley Road address matches |
| Greystones | Sawtry | website, facebookUrl | Own site (thegreystonessawtry.co.uk) + FB (2,590 likes), The Green address matches |
| Mr Bumble | Camberley | facebookUrl | FB page, 19 London Road Blackwater address matches, live music Saturdays confirmed |
| Haven Littlesea Holiday Park | Weymouth | — (blank) | Only recruitment/owners-only/sub-brand Facebook pages found, no distinct official park page |
| Boom Boom Club for Prom | Sutton | website, facebookUrl | Own site (boomboomclubsutton.com) + official Facebook GROUP (no page found) — group URL retained per §2A.1.4 group-URL-valid ruling |
| The Black Horse Eastcote | Eastcote | website, facebookUrl | Own site (theblackhorseeastcote.com) + FB (1,651 likes), High Road address matches |
| The Half Moon | Rayleigh | website, facebookUrl | Own site (thehalfmoonrayleigh.co.uk) + FB matching the same domain vanity handle; a separate profile.php page not used |
| Carters Rest | Wroughton | — (blank) | Three competing Facebook pages found (243/189/380 likes), none independently confirmed as current — two-candidates-compete, left blank |
| Billericay Constitutional Club | Billericay | facebookUrl | FB page (1,474 likes), 1A High Street address matches |
| Dorset County Show | Dorchester | website, facebookUrl | Own site (dorsetcountyshow.co.uk) + FB (23,088 likes), Dorchester Agricultural Society, DT2 7SD address matches |
| New Bradwell Sports Association | Bradville | website, facebookUrl | Own site + FB (659 likes), Bradwell Road address matches |
| Stokeley Farm Shop | Kingsbridge | website, facebookUrl | Own site (stokeleyfarmshop.co.uk) + FB (~2.7k followers), Stokenham address matches |
| The Blue Lagoon | Bristol | website, facebookUrl | Own site (thebluelagoonbristol.co.uk) + FB (5,146 likes), Gloucester Road Bishopston address matches, live music confirmed |
| Talaton Parish Hall | Talaton | website, facebookUrl | Own site (talatonparishhall.org.uk) + FB (145 likes), "shows and gigs" confirmed |
| Players | Paignton | facebookUrl | FB page (Player's Coffee & Cocktail Bar), 55 Torbay Road address matches exactly |

## Near-misses / flags for a human look

- **Boom Boom Club for Prom** (`27cb1544-2c81-4c53-9f68-d323941757fb`): the bndy `name` field
  carries a "for Prom" suffix that reads like a leftover from a specific prom-night listing
  rather than the venue's permanent name (the venue's own site and Facebook group both call
  it simply "Boom Boom Club"). Enriched (website + FB group attached) but NOT renamed this
  firing — venue protocol has no explicit unattended-rename authorisation, same class as
  `bv2a-firing09-name-mismatches-four-venues` and `bv2a-firing12-name-mismatches-two-venues`.
- **Dorset County Show** (`3219f70f-750a-4d8d-9acf-7f177ef5113e`) and **Lark Hill Retirement
  Village** (`03dace6a-aa6a-438f-80cb-c7b7f649072e`): both enriched normally (strong,
  confident FB/website matches), but both are edge cases for "is this a gig venue" — an
  annual agricultural show ground and a private retirement complex respectively, distinct in
  kind from the council-run recreation grounds flagged in prior firings (Campbell Park,
  Gostrey Meadow, Jubilee Park Horndean). Not flagged as possible-non-venue since both are
  real, self-operating entities with their own strong social presence — noted here only for
  visibility.
- **Haven Littlesea Holiday Park**: a large Haven-brand holiday park with only fragmented
  sub-pages (recruitment, owners-only, third-party caravan sales) found on Facebook, no
  single official public page — left blank rather than attach a wrong sub-page.

## Validator

Adapter script (`data/state/build_validator_input_run1419.py`, records at
`data/normalized/enrichment/records-2026-08-18-firing1419.json`, evidence aliased to
`data/state/evidence_run1419_aliased.jsonl`), following the standing
`validator-venue-schema-mismatch` / `validator-venue-evidence-loader-artistid-only`
fingerprints: venue `facebookUrl` supplied as a top-level field, `location` aliased from
`city`, evidence `venueId` keys aliased to `artistId` for the loader. All 30 records
included.

**First run: 1 FAIL** — `FB_EVIDENCE_MISMATCH` on Boom Boom Club for Prom: the evidence
line's `capturedFrom` had been recorded as the venue's own website (where the group URL was
corroborated) rather than the Facebook group URL itself. Corrected the evidence line's
`capturedFrom`/`capturedText` to point at the actual stored group URL — a genuine evidence-
recording error on this firing's part, not a validator or rule defect — and re-ran.

**Validator summary line (verbatim, second and final run): `30 records · 5 clean · 0 FAIL ·
50 WARN   [mode=gate]`**

WARNs: `STUB_NO_BIO`/`STUB_NO_IMAGE` on all 25 verified-with-FB venues (expected — FP.2
venues carry no bio field and need no Chrome avatar fetch, per the standing
`validator-fb-evidence-mismatch-fp2-corroboration` fingerprint). No FAIL outstanding on the
shipped batch.

## Circuit breaker

Not fired. No FAIL outstanding in the validator's final run.

## Budget used

30 venues worked (28 written to bndy verified, 2 evidenced blank) against the 30-venue /
15-artist / 40-minute budget. Venue cap reached; stopped cleanly. 0 artists worked (Chrome
unreachable — hard stop on the artist portion only; 6 candidates identified in priority 1
carry over). Wall-clock: claim acquired 14:19:28Z, ledger/dashboard writes complete
~14:53Z — the paged sort, 30 web searches, 28 individual `edit_venue` calls with 3 spot-check
read-backs, and one validator correction cycle account for the span (well inside the 3h
claim TTL).

- Appended 30 `type:"enrich"` lines (28 `outcome:"verified"`, 2 `outcome:"blank"`) to
  `data/state/enrichment-ledger.jsonl`, plus one `type:"snapshot"` line:
  `artistsTotal:2231, artistsMissingSocials:867, artistsMissingGenres:614, venuesTotal:3004,
  venuesMissingSocials:378` (from live `list_venues`/`list_artists` pagination.count at
  14:50Z). `venuesMissingSocials` dropped from 406 to 378 — a delta of 28, an exact 1:1 match
  with the 28 venues verified this firing. `artistsTotal`, `artistsMissingSocials` and
  `artistsMissingGenres` unchanged from firing 13's snapshot, consistent with no artist work
  this firing. `venuesTotal` unchanged at 3004 — no venue creates this firing (this task only
  edits).
- Appended one line to `data/state/run-summary.jsonl`:
  `{"date":"2026-08-18","task":"enrichment","finishedAt":"2026-08-18T14:53:00Z","outcome":"completed","gigsAdded":0,"artistsAdded":0,"venuesAdded":0,"recordsEnriched":28,"skipped":2,"note":"30 venues worked (28 verified, 2 blank). Chrome unreachable 17th firing, artists skipped."}`
- Regenerated both dashboards: `data/normalized/enrichment/DASHBOARD.html` (1944 records, 64
  snapshots) and `data/normalized/DASHBOARD.html`.

## CTO-INBOX

Lines to append: `bv2a-chrome-unreachable-seventeen-consecutive-firings` (BLOCKED,
continuing the standing sequence from firings 22 through 13, now including 6 stranded
priority-1 artist candidates from this firing); `bv2a-firing14-enrich-venue-batch-array-not-found`
(DEFECT, `enrich_venue` batch array input returns `VENUE_NOT_FOUND` rather than processing
each id — worked around via WebSearch, not blocking). Boom Boom Club naming, Dorset County
Show / Lark Hill venue-type edge cases, and Haven Littlesea are recorded in this report as
low-risk data notes, consistent with how prior firings handled the same class of finding.
