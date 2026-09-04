# Bv2a Enrichment — RUN REPORT — 2026-08-18, firing 19 (19:19Z)

## Step 0 — Circuit breaker

Read the last 3 run reports (RUN-REPORT-18, 17, 16, all 2026-08-18, found by mtime — this
firing's own hour-check confirmed 18/17/16 are genuinely the three most recent). Each
recorded 0 outstanding FAIL from the validator on its final run, and all three wrote a
report. 0 of 3 recorded a FAIL, none failed to write a report. **Breaker NOT TRIPPED.**
Proceeded to Step 1.

## Step 1 — Concurrency

Claim file: `data\state\claims\bv2a-enrichment.json` (the runbook-correct path per §6A
step 2b — the task prompt's `data\state\claims\enrichment.json` has never existed,
standing fingerprint `bv2a-claim-path-stale-in-prompt`, re-verified this firing). Read
before the runbook: `heldBy:null`, released by firing 18 at 18:31:58Z — **acquired** at
19:19:14Z as `bv2a-enrichment-2026-08-18T19-19-14Z`, TTL 3h (expires 22:19:14Z).
Heartbeat `data\state\heartbeat\bv2a-enrichment-2026-08-18T19-19-14Z.json` written first,
outcome `started`. `data\state\enrichment.lock` not present; not honoured, not recreated
(retired mechanism per §6A step 2b).

## Step 2 — Runbook read

`RUNBOOK.md` read in full this firing: H1 = **v2.27** (2026-08-08), CURRENT FLOOR (§6A) =
**v2.19** — pass. Read §2A.1 items 3b (both Facebook search and Google mandatory before
any artist blank) and 8 (bio is quoted, never written) in full, §2A.2 mechanics, §3 venue
protocol, §6A run contract, §6F/§6G concurrency, §0.6 (name-correction authority — confirms
§0.6 covers ARTIST names and was extended in v2.26 to venue names for a *renamed trading
name keeping the same place_id*, but nowhere grants an unattended run authority to rename a
venue record whose bndy name simply mismatches the entity found; consistent with the
standing `bv2a-firing09-name-mismatches` / `bv2a-firing12-name-mismatches` treatment, no
unattended renames performed this firing either). `ENRICHMENT-TASK-v3.md` §0.0 and §FP read
in full: §FP.2 confirms venues need only `website`/`facebookUrl`, no bio, no Chrome. Read
`CTO-INBOX.md` tail (last ~150 lines, effectively the whole 2026-08-18 section): confirmed
standing, still-live fingerprints — `bv2a-claim-path-stale-in-prompt`,
`validator-venue-schema-mismatch`, `validator-venue-evidence-loader-artistid-only`,
`bv2a-edit-venue-facebookurl-param-does-not-exist`,
`bv2a-firing14-enrich-venue-batch-array-not-found`, `bv2a-firing20-garbled-venue-name-
united-match`, the lemonrock/arenatorquay §0.19 ignore-list founding entry (RUNBOOK §0.19)
— all still current, none superseded. Used `socialMediaUrls` (never the non-existent
`facebookUrl` param) on every `edit_venue` call and confirmed `updatedFields` on every
response — no silent no-op writes. Did not attempt the `enrich_venue` batch-array path
(known broken per firing 14) — went straight to `WebSearch` per venue under §FP.2.

**Chrome check.** `list_connected_browsers` returned `[]`; `tabs_context_mcp` returned
"not connected" on retry. Unreachable for a **22nd consecutive firing**, spanning firing 22
(2026-08-17 22:17Z) through this firing (2026-08-18 19:19Z), over 21 hours. Per the hard-
stop table: venues proceed under §FP.2 (no Chrome needed); artist priorities 1, 4 and 5 are
hard-stopped. The 6 priority-1 candidates first stranded at firing 14 (Camems, Whiskey
Rebel, Guns for Girls, One Dimensional Creatures, Uncle Dad & The Day Drinkers, Devoted)
remain stranded, carrying over a further firing.

## Step 3 — Work

Priority order per the task: (1) artists created <24h missing socials — **blocked, Chrome
down**; (2) venues created <24h missing socials — **0 found**
(`list_venues(createdSince=2026-08-17T19:19Z, missingSocials=true)` returned empty); (3)
backlog venues missing socials, oldest `createdAt` first — **worked, 28 records**; (4)
backlog artists — **blocked, Chrome down**; (5) artists missing genres with a facebookUrl —
**blocked, Chrome down**.

**Selection method.** Paged `list_venues(missingSocials:true)` across the 308-record
backlog (offsets 0, 40, 80 — 120 of 308 retrieved this firing, the same "not exhaustive"
caveat as prior firings: the remainder was not pulled), cross-checked each candidate
against today's evidence file (455 unique ids already worked today across firings 00–18,
loaded from `data\state\enrichment-evidence-2026-08-18-enrichment.jsonl`) to exclude
records already touched, and excluded standing CTO-INBOX non-venue/data-quality/ignore-list
flags. Sorted the remaining candidates client-side by `createdAt` ascending (the tool does
not sort) and worked the oldest 28, stopping there — well inside the 40-minute budget, so
the batch closed on reaching a clean stopping point in the pool pulled rather than on time
or the nominal 30-cap.

**Excluded, not re-searched (standing flags, re-confirmed this firing):**

| Venue | id | Reason (fingerprint) |
|---|---|---|
| United match) | `9be0502f-2a7f-42ac-8751-b51852b2320a` | garbled/truncated capture, not a real venue name — `bv2a-firing20-garbled-venue-name-united-match` |
| Arena Torquay | `c97a9fd2-f5c9-4699-a1ed-ef55f8a3b2b5` | §0.19 ignore-list founding entry (lemonrock/arenatorquay, 1,500-capacity room outside bndy's grassroots remit) — not fetched, not enriched, per rule |

Evidence file: `data\state\enrichment-evidence-2026-08-18-enrichment.jsonl` already existed
from earlier firings today — appended, not overwritten (561 lines by end of firing, up
from 533). All 28 evidence lines written before their corresponding `edit_venue` call.

### Records enriched WITH a verified page (26)

| Venue | id | Fields written | Evidence |
|---|---|---|---|
| Country Ways | `725c8edd-e55a-4f7f-9d4a-e979b484dd39` | facebookUrl | facebook.com/cw.northdevon/ |
| The Haworth | `c3b9d004-58c3-4162-8e99-c9ec6498b5b8` | facebookUrl | facebook.com/TheHaworth/ |
| Desborough Conservative Club | `ac8f5362-6c32-46ca-b34f-0fefdc14146e` | website + facebookUrl | facebook.com/desboroughcons/ |
| The Fox Inn | `c7e5e1e9-f80f-4f25-8dd7-dc3bb7823aec` | website + facebookUrl | facebook.com/TheFoxAtCarlton/ |
| Home Farm Holiday Centre | `04c1570b-0efd-4ece-a6e2-9329caf295b0` | website + facebookUrl | facebook.com/p/Home-Farm-Holiday-Centre-100063634779003/ |
| The Prince Blucher, Twickenham | `b4240e0a-bb25-4668-83bd-62bf2cd04a9f` | website + facebookUrl | facebook.com/PrinceBlucher/ |
| Carrington House Hotel | `ba854ba5-a1ec-4a83-9c61-e446f56c54ee` | facebookUrl | facebook.com/carringtonhousehotel/ |
| The North Star | `281b2f5e-260c-4f92-a7a8-019bee160a81` | website + facebookUrl | facebook.com/thenorthstarealing/ |
| Crawley Green Sports & Social Club | `2a9133e4-528a-40d2-a773-029e36ffdd85` | facebookUrl | facebook.com/LutonCGSSC/ |
| The Black Bull | `9f727dc7-3fb6-4adf-824b-ed59d8fdbacb` | website + facebookUrl | facebook.com/p/The-Black-Bull-Kidlington-100054359419403/ |
| PIG n FALCON | `17591a57-996c-4ee1-a274-3fc23bf3b791` | website + facebookUrl | facebook.com/piginstneots/ |
| Five Miles From Anywhere No Hurry Inn | `3190fa99-104e-4392-a5b7-f322b5aff846` | website + facebookUrl | facebook.com/profile.php?id=238574079495505 |
| The Carew Arms | `dbcafbde-b693-4db9-b2b5-bde22850cdc6` | website + facebookUrl | facebook.com/thecarewarmscrowcombe/ |
| The River Mill Pub and Restaurant | `0b3279c4-f870-4e51-a262-d445ae5db1af` | website + facebookUrl | facebook.com/therivermillpub/ |
| Blackwell's Chipperfield Ltd | `36f872b7-766c-4875-b78d-a1284e8a2ef4` | website + facebookUrl | facebook.com/blackwellschipperfield/ |
| The Kings Head | `09cd8e6d-4bf1-41d5-b522-2b1aebb17bcc` | website + facebookUrl | facebook.com/kingshead.poole/ |
| The Crown | `4023cff0-eba4-4b1a-b0c1-117b2e673e6e` | facebookUrl | facebook.com/p/The-crown-pub-100061079814952/ |
| RAOB Ye Olde Roundham Club | `86e82157-502f-4897-9199-27aa48801ae2` | facebookUrl | facebook.com/yeolderoundhamclub/ |
| The Oxenham Arms Restaurant | `dffe5124-e23a-40b4-9000-0422c9b3e501` | website + facebookUrl | facebook.com/TheOxenhamArms/ |
| The Water Rats | `f438cbb6-44a8-4d4b-a1c0-3fc5a8b1471b` | website + facebookUrl | facebook.com/TheWaterRatsVenue/ |
| Royal Oak Inn | `39774e89-9117-445a-ad63-c1f61e866b52` | facebookUrl | facebook.com/p/Royal-Oak-Leigh-Sinton-61554332621219/ |
| The Dolphin | `4bf2e97c-7d0c-454a-9997-a7143e4442c3` | facebookUrl | facebook.com/thedolphinnewportpagnell/ |
| Pollyfield Community Centre | `dfdb97c5-08d9-4cc3-aed4-52cd67b9d22b` | website + facebookUrl | facebook.com/PollyfieldCentre/ |
| The Broadway Club | `d1464c87-050a-4765-8d2d-61ba813cc611` | website + facebookUrl | facebook.com/thebroadwayclub/ |
| Osinsky's | `ada29b34-2ad1-4542-968e-4242564c9625` | website + facebookUrl | facebook.com/Osinskys/ |
| The Hen & Chickens | `303b4390-88d7-4abc-b62b-7c6ca4bc804b` | facebookUrl | facebook.com/244047932379512/ |

All 26 confirmed via `updatedFields` on the `edit_venue` response (no silent no-ops).
Every candidate's town/address was checked against the search result before writing —
none required a two-candidate judgement call this firing.

### Records recorded as an EVIDENCED BLANK (2)

Google-only per §FP.2 (venues need no Chrome; the §2A.1 item 3b "both surfaces" rule is
written for artist Facebook identification, not venues). One to two Google variants tried
per venue before recording the FB field blank; both had a confident website instead.

| Venue | id | Variants tried | Reason |
|---|---|---|---|
| The Prince of Wales | `5e94ddd3-e0d7-452c-ba2b-c82523b6a9b1` | `"The Prince of Wales" Farnborough Rectory Road facebook`; `site:facebook.com "Prince of Wales" Farnborough Hampshire pub` | Pub confirmed real (Good Beer Guide regular, address exact match) and confirmed to HAVE a Facebook presence via event-page mentions, but no confident canonical page URL surfaced across two variants — only `/events/` links, which are not the page itself. Website (theprinceinfarnborough.co.uk) attached instead. |
| The Mudeford Club | `87b87d03-d8ed-4124-bab7-836ce8bd30a7` | `"The Mudeford Club" Christchurch Stanpit facebook`; `site:facebook.com "The Mudeford Club"` | Working Men's Club confirmed real and address-matched, third-party sources say it has "a Facebook presence", but no confident canonical page URL surfaced — only an unrelated third-party story post. Website (themudeford.club) attached instead. |

### Records SKIPPED, and why (2)

| Venue | id | Reason (fingerprint) |
|---|---|---|
| United match) | `9be0502f-2a7f-42ac-8751-b51852b2320a` | standing garbled-name flag, re-confirmed not re-searched — `bv2a-firing20-garbled-venue-name-united-match` |
| Arena Torquay | `c97a9fd2-f5c9-4699-a1ed-ef55f8a3b2b5` | §0.19 ignore-list founding entry — the 1,500-capacity room that motivated the ignore-list rule itself; not fetched, not enriched, per RUNBOOK §0.19 |

## Names corrected under §0.6

None. §0.6 (extended v2.26 to venue trading-name changes with an unchanged `place_id`)
did not apply to any record found this firing — no venue's own page carried a different
trading name from the bndy record. No unattended venue rename authority exists beyond that
specific trading-name-change case, consistent with the standing `bv2a-firing09-name-
mismatches` / `bv2a-firing12-name-mismatches` treatment.

## Validator summary line (verbatim)

```
28 records · 2 clean · 0 FAIL · 52 WARN   [mode=gate]
```

All 52 WARN are `STUB_NO_BIO`/`STUB_NO_IMAGE` on the 26 facebookUrl-bearing records —
expected, non-blocking noise per standing fingerprint `validator-venue-schema-mismatch`:
venues carry no bio/image requirement under §FP.2. No FAIL outstanding, no correction
cycle needed.

Records file: `data\normalized\enrichment\records-2026-08-18-firing19.json`. Evidence
file (this firing's own, source-scoped): `data\state\enrichment-evidence-2026-08-18-
enrichment.jsonl`, appended to (never rewritten), 561 lines by end of firing. Per the
standing `validator-venue-evidence-loader-artistid-only` fingerprint, an aliased copy
(`venueId`→`artistId`) was built at `data\state\tmp\evidence_aliased_firing19.jsonl` for
the validator to consume — the source-scoped file itself is untouched.

## Step 5 — Ledger, summary, dashboards

- `data\state\enrichment-ledger.jsonl`: appended 28 `enrich` lines (26 verified, 2 blank)
  + 1 `snapshot` line.
- Snapshot: `artistsTotal:2231, artistsMissingSocials:867, artistsMissingGenres:614,
  venuesTotal:3004, venuesMissingSocials:280` (280 = 308 − 28 worked this firing — exact
  1:1 match, confirming both website-only writes also cleared the missingSocials filter;
  artist figures static, confirming the Chrome outage's continued effect).
- `data\state\run-summary.jsonl`: appended one line, `outcome:"completed"`,
  `recordsEnriched:28`, `skipped:2`, note exactly 90 characters (checked with `wc -c`
  before writing, learning from firing 18's own over-length note defect).
- Both dashboards regenerated: `data\normalized\enrichment\DASHBOARD.html` (2072
  enrichment records, 69 snapshots) and `data\normalized\DASHBOARD.html`.
- `20-Daily\2026-08-18.md`: one line appended linking this report.

## CTO-INBOX

Appended: twenty-second-consecutive-firing Chrome outage entry.

## Budget used, and whether the circuit breaker fired

Claim acquired 19:19:14Z, work (runbook read + backlog sort + search + writes +
validation + reporting) completed by ~19:52Z — **~33 minutes**, inside the 40-minute task
budget and well inside the 3-hour claim TTL. Circuit breaker did not fire (0 FAIL on this
and the prior 3 reports).

## Outcome

**Ran OK.** enrichment — 26 venues verified, 2 venues evidenced blank with a website
attached instead (28 worked), 2 skipped on standing non-venue/ignore-list flags, 0
artists (Chrome unreachable, 22nd consecutive firing). Validator 0 FAIL.
