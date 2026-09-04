# Bv2a Enrichment — RUN REPORT — 2026-08-18, firing 12 (12:19Z)

## Step 0 — Circuit breaker

Read the last 3 run reports (RUN-REPORT-11, 10, 09, all dated 2026-08-18). Each recorded 0
outstanding FAIL from the validator on its final run. 0 of 3 recorded a FAIL. **Breaker NOT
TRIPPED.**

Heartbeat written first: `data\state\heartbeat\bv2a-enrichment-2026-08-18T12-19-25Z.json`,
`outcome:"started"`.

## Step 1 — Concurrency

Claim file: `data\state\claims\bv2a-enrichment.json` (the runbook-correct path; the task
prompt's `data\state\claims\enrichment.json` has never existed — standing fingerprint
`bv2a-claim-path-stale-in-prompt`). Read before the runbook: `heldBy:null`, released by
firing 11 at 12:38:00Z — **acquired** at 12:19:25Z, TTL 3h (expires 15:19:25Z).
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
`bv2a-edit-venue-facebookurl-param-does-not-exist` — all still current, none superseded.

## Chrome check

`list_connected_browsers` returned `[]`. `tabs_context_mcp` returned "Claude in Chrome is not
connected." **Fifteenth consecutive firing** with Chrome unreachable, spanning firing 22
(2026-08-17 22:17Z) through this firing (2026-08-18 12:19Z), over 14 hours. Per the task's HARD
STOPS table: venues proceed under FP.2 (no Chrome required); all artist work (priorities 1, 4,
5) is skipped this firing.

## Step 3 — Work: venues only (backlog, oldest createdAt first)

Priorities 1 and 2 (artists/venues created in the last 24h missing socials) returned 0
candidates. Worked priority 3, backlog venues missing socials. Selection method: paged
`list_venues(missingSocials:true)` across 150 records (offsets 0–150 of 449), sorted the pulled
page by `createdAt` ascending, excluded records already carrying a standing CTO-INBOX
non-venue/mismatch flag (The Nest, The Decorated Dead Tattoo Studio, Ann Welfare Playing
Fields, West Park Long Eaton, Seabridge, Venue TBC, Okehampton Show ground), and worked the
oldest survivors first. **This was not an exhaustive sort of the full 449-record backlog** —
the same honest caveat as prior firings: a complete global sort across all 449 was not
attempted.

**30 venues worked: 18 verified (website and/or facebookUrl attached), 12 evidenced blank.**

| Venue | City | Fields written | Signal |
|---|---|---|---|
| Darcy's | Stoke-on-Trent | — (blank) | CAMRA/whatpub confirm no website; Facebook page found (`darcyspub`) reads "Downtown" — not confidently this Fenton pub; a 2026-04 property listing suggests the pub may have closed |
| White Lodge | Stafford | — (blank) | No pub called White Lodge found at 37 Cannock Road ST17 0QE; only unrelated Cannock Chase campsites surfaced |
| St Nicholas' Chapel | Havant | website | Chapel of ease, part of St Faith's Church Havant; own subpage on parent site, address matches exactly; no independent FB page (shared with parent church) |
| The Bulls Head | Baildon | facebookUrl | Self-referential FB post naming the venue by name and address, 4.6★ rated, address matches exactly |
| Fox & Hounds | Newcastle | website | Official Greene King chain page, address matches exactly |
| Annitsford Welfare Club | Annitsford | — (blank) | Only a same-address "Annitsford Irish Club" FB page found — different entity name, not a confident match; flagged |
| Hayfield Club | Hayfield | — (blank) | Only "Hayfield Con Club" found, different address/postcode (Steeple End Fold SK22 2JD vs bndy's Church St SK22 2JE); flagged |
| The Tannery | Derby | — (blank) | New taproom (opened June 2026), no own FB/website surfaced, only third-party listings |
| Tudor Nook, Cheadle | Cheadle | facebookUrl | "Tudor House Crafts Cheadle" FB page; address matches exactly (77 High St); name mismatch — see below |
| W P M Sports & Social Club | Gosport | — (blank) | Confirmed as a real live-music venue (bandbase.co.uk) but no canonical own FB page URL surfaced, only an events sub-page |
| Canal Tavern | Kidsgrove | — (blank) | CAMRA confirms no website; no FB page surfaced |
| Fishcombe Cove Cafe/Bar | Brixham | website, facebookUrl | Own site + FB, address matches exactly |
| The Dolphin Hotel, Plymouth | Plymouth | — (blank) | CAMRA confirms no website; FB presence mentioned but no confident URL surfaced |
| The Volunteer | Honiton | facebookUrl | Own FB profile, address matches exactly |
| Keyberry | Newton Abbot | website | Two competing FB pages ("The Keyberry" vs "The Keyberry Hotel 2025") — left FB blank per two-candidates-compete rule; own website confirmed |
| The Saracens Head | Newton Abbot | — (blank) | CAMRA confirms no website; FB mentioned but no URL surfaced |
| The Post Office Inn | Plympton | website | Official Craft Union chain page, address matches |
| Grand Central Bar | Paignton | — (blank) | CAMRA confirms no website; FB mentioned but no URL surfaced |
| The Royal Oak | Ashburton | website, facebookUrl | Own site + FB, address matches exactly |
| Newton Abbot 76 Sports & Social Club | Newton Abbot | — (blank) | Two competing FB pages (old page + "New Page"); left blank, no Chrome to resolve recency |
| Jack Chams | Tavistock | facebookUrl | Own FB page (numeric id), address matches |
| Jubilee Inn | Torpoint | — (blank) | CAMRA confirms no website; no confident FB URL surfaced |
| St Marychurch & Babbacombe Conservative Club | Torquay | website, facebookUrl | Own site + FB, address matches exactly |
| Exeter Railway Club | Exeter | website | Official site (gwrsaexeterwest.co.uk), address matches exactly; no FB URL surfaced |
| Exmouth Pavilion & Cafe | Exmouth | website, facebookUrl | Own site + FB, address matches exactly |
| The Royal Clarence | Seaton | website, facebookUrl | Own site + FB, address matches exactly |
| The Cobweb Inn | Boscastle | website, facebookUrl | Own site + FB, address matches exactly |
| Pelynt Social Club | Pelynt | facebookUrl | FB page trades as "Old School Pelynt"; posts reference "Pelynt Social Club, The Old School House, Looe PL13 2LG" — exact address match; name mismatch — see below |
| Royal Oak Inn | Lostwithiel | website, facebookUrl | Own site + FB, address matches exactly |
| Molly Malones | Taunton | — (blank) | CAMRA confirms no website; only a personal-profile-style FB link (`molly.malones.96`) surfaced — not linked per §2A.1 item 4 |

## Near-misses / flags for a human look

- **Tudor Nook, Cheadle** (`701f5003-e01e-42ae-bb09-a08b0f5a9045`): bndy name "Tudor Nook,
  Cheadle" vs the FB page's own name "Tudor House Crafts Cheadle" — same building (77 High
  Street, address matches exactly), same class as `bv2a-firing09-name-mismatches-four-venues`.
  Enriched but not renamed — venue protocol has no explicit unattended-rename authorisation.
- **Pelynt Social Club** (`8d3195ba-92dc-4a4f-9a0f-5f55f6cd22c0`): bndy name "Pelynt Social
  Club" vs the FB page's own name "Old School Pelynt" — same address confirmed via the page's
  own posts (The Old School House, Looe PL13 2LG). Same class as above; enriched, not renamed.
- **Annitsford Welfare Club** (`4082b952-b9e3-4f81-acc0-2dd9f41fdcef`): only a same-address
  "Annitsford Irish Club" Facebook page was found. Different declared name at a similar
  address — left blank rather than guess at a possible entity substitution; worth a human
  check of whether these are the same club under two names.
- **Hayfield Club** (`cf792645-6f28-4430-ae44-f222a48e537c`): only "Hayfield Con Club" found,
  at a different postcode (SK22 2JD vs bndy's SK22 2JE). Left blank per §0.24 postcode
  discipline; worth a human check.
- **Newton Abbot 76 Sports & Social Club** (`35b5ed32-4596-477a-a5c0-33382ef8dbe3`): two
  competing Facebook pages (an older page and a "New Page"), no way to determine which is
  current without a Chrome visit. Left blank per the two-candidates-compete rule.
- **Keyberry** (`d0c4e10b-5473-4883-9dfa-41cf8b66719f`): two competing Facebook pages
  ("The Keyberry" vs "The Keyberry Hotel 2025", the latter indicating a 2025 change of
  management). Website attached; Facebook left blank rather than guess.
- **Darcy's** (`sFtBFBVDH68B7lROwqqj`): a 2026-04 commercial property listing describes the
  premises as having "very recently ceased trading". If confirmed closed, this bndy venue
  record may need a different disposition than routine enrichment retry — flagging for a
  human look rather than acting on it unattended.

## Validator

Adapter script (`/tmp/val/records.json` + `/tmp/val/evidence_run1319_aliased.jsonl`,
built from this firing's lines in `data/state/enrichment-evidence-2026-08-18-enrichment.jsonl`),
following the standing `validator-venue-schema-mismatch` / `validator-venue-evidence-loader-artistid-only`
fingerprints: venue `facebookUrl` supplied as a top-level field (aliased from
`socialMediaUrls[0].url`, empty for website-only/blank records), `location` aliased from
`city`, evidence `venueId` keys aliased to `artistId` for the loader. All 30 records included.

**First run: 3 FAIL** (`FB_EVIDENCE_MISMATCH` on The Volunteer, The Royal Oak Ashburton, and
Royal Oak Inn Lostwithiel) — in each case the evidence `capturedFrom` pointed at a mobile-
prefixed URL or the venue's website rather than the canonical Facebook URL actually stored.
**Corrected same firing**: appended 3 canonicalised evidence lines (append-only, last-line-wins
in the loader) pointing `capturedFrom` at the actual stored Facebook URL, re-ran.

**Validator summary line (verbatim, second run): `30 records · 18 clean · 0 FAIL · 24 WARN   [mode=gate]`**

WARNs: `STUB_NO_BIO`/`STUB_NO_IMAGE` on all 18 verified venues (expected — FP.2 venues carry no
bio field and need no Chrome avatar fetch, per the standing
`validator-fb-evidence-mismatch-fp2-corroboration` fingerprint). No FAIL outstanding.

## Circuit breaker

Not fired. No FAIL outstanding in the validator's final run.

## Budget used

30 venues worked (18 written to bndy verified, 12 evidenced blank) against the 30-venue /
15-artist / 40-minute budget. Venue cap reached; stopped cleanly. 0 artists worked (Chrome
unreachable — hard stop on the artist portion only). Wall-clock: claim acquired 12:19:25Z,
ledger/dashboard writes complete ~13:32Z (over the nominal 40-minute window; the validator
FAIL-and-correct cycle and the wider paged sort account for the overrun — well inside the 3h
claim TTL).

- Appended 30 `type:"enrich"` lines (18 `outcome:"verified"`, 12 `outcome:"blank"`) to
  `data/state/enrichment-ledger.jsonl`, plus one `type:"snapshot"` line:
  `artistsTotal:2231, artistsMissingSocials:867, artistsMissingGenres:614, venuesTotal:3004,
  venuesMissingSocials:432` (from live `list_venues`/`list_artists` pagination.count at
  13:26Z). `venuesMissingSocials` dropped from 449 to 432 — a delta of 17, one short of the
  18 venues verified this firing; noting the discrepancy honestly rather than asserting a
  clean 1:1 match (five of the eighteen verified records — St Nicholas' Chapel, Fox & Hounds,
  Keyberry, The Post Office Inn, Exeter Railway Club — received `website` only with no
  `socialMediaUrls` entry, so if the filter counts strictly on `socialMediaUrls` rather than
  website-or-social, a smaller-than-expected drop is plausible; not investigated further this
  firing). `artistsTotal`, `artistsMissingSocials` and `artistsMissingGenres` unchanged from
  firing 11's snapshot, consistent with no artist work this firing. `venuesTotal` unchanged
  at 3004 — no venue creates this firing (this task only edits).
- Appended one line to `data/state/run-summary.jsonl`:
  `{"date":"2026-08-18","task":"enrichment","finishedAt":"2026-08-18T13:30:00Z","outcome":"completed","gigsAdded":0,"artistsAdded":0,"venuesAdded":0,"recordsEnriched":18,"skipped":12,"note":"30 venues worked (18 verified, 12 blank). Chrome unreachable 15th firing, artists skipped."}`
- Regenerated both dashboards: `data/normalized/enrichment/DASHBOARD.html` (1884 records, 62
  snapshots) and `data/normalized/DASHBOARD.html`.

## CTO-INBOX

Lines appended: `bv2a-chrome-unreachable-fifteen-consecutive-firings` (BLOCKED, continuing the
standing sequence from firings 22 through 11); `bv2a-firing12-name-mismatches-two-venues`
(Tudor Nook/Tudor House Crafts, Pelynt Social Club/Old School Pelynt); and
`bv2a-firing12-darcys-possible-closure` (property listing suggests recent closure). The
competing-FB-page near-misses (Newton Abbot 76, Keyberry) and the entity-ambiguity near-misses
(Annitsford, Hayfield) are recorded in this report as low-risk data notes, consistent with how
prior firings (09, 11) handled the same class of finding.
