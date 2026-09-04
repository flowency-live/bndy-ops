# Bv2a Enrichment — RUN REPORT — 2026-08-18, firing 21 (21:18Z)

## Step 0 — Circuit breaker

Read the last 3 run reports (RUN-REPORT-20, 19, 18, all 2026-08-18, found by mtime).
Each recorded 0 outstanding FAIL from the validator on its final run, and all three
wrote a report. 0 of 3 recorded a FAIL, none failed to write a report. **Breaker NOT
TRIPPED.** Proceeded to Step 1.

## Step 1 — Concurrency

Claim file: `data\state\claims\bv2a-enrichment.json` (the runbook-correct path per §6A
step 2b — the task prompt's `data\state\claims\enrichment.json` has never existed,
standing fingerprint `bv2a-claim-path-stale-in-prompt`). Read before the runbook:
`heldBy:null`, released by firing 20 at 20:58:00Z — **acquired** at 21:18:08Z as
`bv2a-enrichment-2026-08-18T21-18-08Z`, TTL 3h (expires 2026-08-19T00:18:08Z).
Heartbeat `data\state\heartbeat\bv2a-enrichment-2026-08-18T21-18-08Z.json` written
first, outcome `started`. `data\state\enrichment.lock` not present; not honoured, not
recreated (retired mechanism per §6A step 2b).

## Step 2 — Runbook read

`RUNBOOK.md` read in full this firing: H1 = **v2.27** (2026-08-08), CURRENT FLOOR
(§6A) = **v2.19** — pass. Read §2A.1 items 3b (both Facebook search and Google
mandatory before any artist blank) and 8 (bio quoted, never written), §2A.2 mechanics,
§3 venue protocol, §6A run contract, §6F/§6G concurrency in full.
`ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full: §FP.2 confirms venues need only
`website`/`facebookUrl`, no bio, no Chrome, Google only. Read `CTO-INBOX.md` OPEN
section in full (through firing 20's entries): confirmed standing, still-live
fingerprints — `bv2a-claim-path-stale-in-prompt`, `validator-venue-schema-mismatch`,
`validator-venue-evidence-loader-artistid-only`, `bv2a-edit-venue-facebookurl-param-
does-not-exist` (used `socialMediaUrls` throughout, never the non-existent
`facebookUrl` param), `bv2a-firing14-enrich-venue-batch-array-not-found` (did not
attempt the batch path), and the full set of standing non-venue / garbled-name /
postcode-mismatch / possible-closure flags accumulated by firings 00–20 — all applied
as exclusions below.

**Chrome check.** `list_connected_browsers` returned `[]`; `tabs_context_mcp` returned
"Claude in Chrome is not connected" on two attempts. Unreachable for a **24th
consecutive firing**, spanning firing 22 (2026-08-17 22:17Z) through this firing
(2026-08-18 21:18Z), over 23 hours. Per the hard-stop table: venues proceed under
§FP.2 (no Chrome needed); artist priorities 1, 4 and 5 are hard-stopped.

## Step 3 — Work

Priority order: (1) artists created <24h missing socials — **blocked, Chrome down**;
(2) venues created <24h missing socials — **0 found**
(`list_venues(createdSince=2026-08-17T21:18Z, missingSocials=true)` returned empty);
(3) backlog venues missing socials, oldest `createdAt` first — **worked, 30 records**;
(4) backlog artists — **blocked, Chrome down**; (5) artists missing genres with a
facebookUrl — **blocked, Chrome down**.

**Selection method.** Pulled the full 253-record `list_venues(missingSocials:true)`
backlog (all 6 pages, offsets 0–250 — exhaustive this firing). Loaded today's evidence
file (`data\state\enrichment-evidence-2026-08-18-enrichment.jsonl`, 591 lines from
firings 00–20) and excluded every `venueId` already present in it (48 of the 253
backlog records had already been attempted today). Further excluded 6 records on
standing CTO-INBOX flags not yet cleared from the backlog (garbled names, §0.19
ignore-list, not-a-venue findings, postcode mismatch, ambiguous name, entity-mismatch
needing a human decision). Sorted the remaining 199 candidates by `createdAt` ascending
and worked the oldest 30.

Evidence file: `data\state\enrichment-evidence-2026-08-18-enrichment.jsonl`, appended
to (never rewritten), 620 lines by end of firing, up from 591. All 29 evidence lines
(one per attempted record; the 30th record was skipped before any search, see below)
written before their corresponding `edit_venue` call or before confirming a blank.

### Records enriched WITH a verified page (25) plus 1 website-only (26 total)

| Venue | id | Fields written | Evidence |
|---|---|---|---|
| Camborne Conservative Club | `289586f6-f0dc-4d1c-88bb-b0131ab5c744` | facebookUrl | facebook.com/p/Camborne-Conservative-Club-100057347032576/ |
| The Garland Ox Inn | `52556fcd-71d4-4870-a86e-0e417409dd02` | facebookUrl | facebook.com/garland.ox/ |
| Padstow Social Club | `3971315a-91cb-40dc-8833-b78344c0df32` | facebookUrl | facebook.com/PadstowSocialClub/ |
| The Preston Gate Inn | `394731c4-5b3b-4908-bbd3-3c5a9d6edfd6` | website + facebookUrl | facebook.com/PrestonGateInn/ |
| Bullers Arms | `c9b866e1-b626-4fe5-90aa-2e9ee999878f` | facebookUrl | facebook.com/bullersarmsbude/ |
| Cavalier Inn | `5ea14287-b480-4926-815e-27b804ffa230` | website + facebookUrl | facebook.com/cavalierinntorrington/ |
| The Champ | `2f3f3d15-a43c-4098-acf2-6a0abc982b05` | facebookUrl | facebook.com/p/The-Champ-at-Appledore-100063575111014/ |
| Ebberley Arms | `d32aaffe-8088-4793-bc59-ce666ed21cb7` | facebookUrl | facebook.com/EbberleyArmsBarnstaple/ |
| The Quarrymans Rest | `3e6ac543-e1d4-465e-8358-84f7090dd382` | facebookUrl | facebook.com/Quarrymensrestbampton/ |
| Woolsach Social Club | `982ecbee-6cc0-4535-87b4-412e211f2af7` | facebookUrl | facebook.com/Woolsachsocialclub/ (confirmed by exact lemonrock externalId match already on record) |
| The Ale House | `062e28d5-a29b-4b24-b662-072594c505ab` | facebookUrl | facebook.com/alehousetaunton/ |
| Archangel | `d07137ca-304d-417b-9ad8-598fa366b6d2` | facebookUrl | facebook.com/archangelfrome/ |
| The Banckers Draught | `ff323bb9-1a17-458a-9b46-8dfd1a6a0993` | website + facebookUrl | facebook.com/bancksdraught/ |
| The Bell Inn | `f05a8d65-7315-461f-9b5d-c0608a3b4d7a` | facebookUrl | facebook.com/thebellinn/ |
| Cafe Bar 21 | `71bfa014-ad82-4927-b2a2-4a503ccdf72f` | facebookUrl | facebook.com/CafeBar21Minehead/ |
| The Chapel Tap | `0251a6ce-8a91-49b5-aec8-34b1f74e90ae` | facebookUrl | facebook.com/p/The-Chapel-Tap-61581729328878/ |
| Bournemouth East Social Club | `8dbbd059-bd6a-4453-be88-c5065abc7db8` | facebookUrl | facebook.com/p/Bournemouth-East-Social-Club-61553924632381/ |
| The Globe | `65ec6426-e50c-42b2-9c56-74a2ddf9a48e` | website + facebookUrl | facebook.com/globeinnsomerton/ |
| The Gloucester | `6a0dafe5-b63f-4ae8-a5be-68ca5d3d463f` | facebookUrl | facebook.com/thegloucesterweymouthbay/ |
| Harvester Neptune Bournemouth | `7ea1607c-0c20-4685-ac15-a34ca45b3ffe` | facebookUrl | facebook.com/HarvesterNeptune/ |
| Marine Theatre | `7fefc982-e96f-4c1e-9874-7bb9d23d091f` | website + facebookUrl | facebook.com/marinetheatrelymeregis/ |
| Mardons Community Club | `847f6789-c190-4671-aabe-f5fa81fb07d5` | facebookUrl | facebook.com/MardonsClub/ |
| The McMillan Theatre | `f8cc3c8b-e6b6-4d54-8b5c-c4918b88681f` | website + facebookUrl | facebook.com/mcmillantheatre/ |
| The Millhouse Gallery Cafe | `4a75cb43-dd15-4c8c-8443-8ebb7f7f16ae` | website + facebookUrl | facebook.com/millhousenews/ |
| Parkstone Trades & Labour Club | `7b2fa2d0-e784-4df6-954c-ebce979e0f6f` | website + facebookUrl | facebook.com/p/Parkstone-Trades-Labour-Club-PTLC-100062874776148/ |
| Rolle Quay Inn | `012c17e5-7173-46dd-b0eb-978b6f94bb14` | website only | therollequayinnbarnstaple.co.uk (two competing FB pages, 287 and 1,128 likes, neither confirmed current — FB left blank rather than guess) |

All 26 confirmed via `updatedFields` on the `edit_venue` response — no silent no-ops.
Two spot-checks (Camborne Conservative Club, Marine Theatre) via `get_by_id` read back
the stored fields verbatim. Every candidate's town/postcode was checked against the
search result's address before writing.

**Flagged, not corrected:** The Chapel Tap's own Facebook page states its postcode as
TA1 1HX; the bndy record reads TA1 3PG for the identical street address (4 Fore
Street, Taunton). Street name/number match exactly and no second "Chapel Tap" exists
in Taunton, so the FB page was attached — but the postcode discrepancy is worth a
human check (§0.24 caution, low risk given exact street-address match).

### Records recorded as an EVIDENCED BLANK (3)

Google-only per §FP.2 (venues need no Chrome; the §2A.1 item 3b "both surfaces" rule
is written for artist Facebook identification, not venues). Two Google variants tried
per venue before recording the Facebook field blank.

| Venue | id | Variants tried | Reason |
|---|---|---|---|
| Sola Bar & Kitchen | `851da56d-6a4e-4bd9-9795-d58be394f597` | `"Sola Bar" Dawlish Warren facebook`; `Sola Bar Kitchen Warren Bridge Inn Dawlish Warren` | Conflicting evidence: a currently-active "Warren Bridge Inn" (opened March 2024, own site/FB) at the same Warren Road EX7 0PQ address, but a separate Facebook group post calls it "Sola, formerly Warren Bridge Inn" — suggesting a further rename to the bndy record's own name (Sola). No single confident page for the Sola-named business could be settled from the search results — left blank rather than attach the Warren Bridge Inn page under an uncertain identity match. Flagged to CTO-INBOX. |
| The Crab and Apple Pub | `228da383-b111-4e80-9c1a-14ff4bafd619` | `"Crab and Apple" Appledore facebook`; `site:facebook.com "Crab and Apple" Appledore` | No Facebook page found across two variants; only unrelated "Crab Apple"-named pages and the separate Appledore Social Club surfaced. |
| Alderney Community Association | `479b4860-26fb-4df6-8e36-f4a4d9181dee` | `"Alderney Community Association" Poole facebook`; `"287 Herbert Avenue" Poole facebook community association` | Address confirmed (287 Herbert Avenue, Poole BH12 4HT) but no dedicated page for this specific name found — only distinct, differently-named related pages (Alderney West Community Centre, Alderney Manor Social Club, Alderney Manor Community Association group), none confidently this record's own page. |

### Records SKIPPED, and why (1)

| Venue | id | Reason |
|---|---|---|
| EX39 4JN | `fbe6535e-ed60-48a6-ac3e-96b1de92f7b5` | The bndy record's own name is literally its postcode; its stored lemonrock externalId (`instowbeachinstow`) and a confirmatory search both identify this as Instow Beach itself — a beach, not a fixed building (§0.23). Not fetched further, not enriched. Flagged to CTO-INBOX for a human decision on whether this record should exist. |

## Names corrected under §0.6

None. §0.6 governs artist names (and, since v2.26, a venue's *trading-name change with
an unchanged place_id*). No venue this firing showed evidence of a trading-name change
— the Chapel Tap postcode variance above is an address discrepancy, not a name
mismatch, so it was not treated as a §0.6 case.

## Validator summary line (verbatim)

```
26 records · 1 clean · 0 FAIL · 50 WARN   [mode=gate]
```

All 50 WARN are `STUB_NO_BIO`/`STUB_NO_IMAGE` on the 25 facebookUrl-bearing records —
expected, non-blocking noise per standing fingerprint `validator-venue-schema-
mismatch`: venues carry no bio/image requirement under §FP.2. Rolle Quay Inn (website-
only, no facebookUrl) is the 1 clean record. No FAIL outstanding, no correction cycle
needed — validator passed clean on the first run.

Records file: `data\normalized\enrichment\records-2026-08-18-firing21.json` (built in
the `{"venues":[{id,name,location,facebookUrl}]}` shape the validator actually reads,
per standing fingerprint `validator-venue-schema-mismatch`). Evidence file (this
firing's own, source-scoped): `data\state\enrichment-evidence-2026-08-18-
enrichment.jsonl`, appended to (never rewritten), 620 lines by end of firing. Per the
standing `validator-venue-evidence-loader-artistid-only` fingerprint, an aliased copy
(`venueId`→`artistId`) was built at `data\state\tmp\evidence_aliased_firing21.jsonl`
for the validator to consume — the source-scoped file itself is untouched.

## Step 5 — Ledger, summary, dashboards

- `data\state\enrichment-ledger.jsonl`: appended 29 `enrich` lines (26 verified/
  website, 3 blank) + 1 `snapshot` line.
- Snapshot: `artistsTotal:2231, artistsMissingSocials:867, artistsMissingGenres:614,
  venuesTotal:3004, venuesMissingSocials:227` (227 = 253 − 26, an exact 1:1 match —
  every one of the 26 writes cleared the `missingSocials` filter; artist figures
  static, confirming the Chrome outage's continued effect).
- `data\state\run-summary.jsonl`: appended one line, `outcome:"completed"`,
  `recordsEnriched:26`, `skipped:4` (3 evidenced blanks + 1 not-a-venue skip), note 89
  characters (checked with `wc -c` before writing).
- Both dashboards regenerated: `data\normalized\enrichment\DASHBOARD.html` (2131
  enrichment records, 71 snapshots) and `data\normalized\DASHBOARD.html`.
- `20-Daily\2026-08-18.md`: one line appended linking this report.

## CTO-INBOX

Appended three lines: 24-consecutive-firing Chrome outage (now over 23 hours);
Instow Beach not-a-fixed-venue finding; Sola Bar & Kitchen / Warren Bridge Inn
conflicting-evidence finding.

## Budget used, and whether the circuit breaker fired

Claim acquired 21:18:08Z, work (runbook read + backlog sort + search + writes +
validation + reporting) completed by ~21:33Z — **~15 minutes**, well inside the
40-minute task budget and the 3-hour claim TTL. Circuit breaker did not fire (0 FAIL
on this and the prior 3 reports).

## Outcome

**Ran OK.** enrichment — 25 venues verified with a Facebook page, 1 venue website-only
(two-candidate Facebook ambiguity), 3 venues evidenced blank, 1 venue skipped as not a
fixed building (30 examined, 0 skipped from the worked batch beyond that one), 0
artists (Chrome unreachable, 24th consecutive firing). Validator 0 FAIL.
