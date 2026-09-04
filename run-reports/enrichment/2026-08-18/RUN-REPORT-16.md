# Bv2a Enrichment — RUN REPORT — 2026-08-18, firing 16 (16:20Z)

## Step 0 — Circuit breaker

Orchestrator read RUN-REPORT-15, 14, 13. All three recorded 0 outstanding FAIL from the
validator on their final run. 0 of 3 recorded a FAIL, none failed to write a report.
**Breaker NOT TRIPPED.** Proceeded directly to Step 1.

Heartbeat written first: `data\state\heartbeat\bv2a-enrichment-2026-08-18T16-20-23Z.json`,
`outcome:"started"`.

## Step 1 — Concurrency

Claim file: `data\state\claims\bv2a-enrichment.json` (the runbook-correct path; the task
prompt's `data\state\claims\enrichment.json` has never existed — standing fingerprint
`bv2a-claim-path-stale-in-prompt`, re-verified this firing). Read before the runbook:
`heldBy:null`, released by firing 15 at 15:31:30Z — **acquired** at 16:20:23Z, TTL 3h
(expires 19:20:23Z). `data\state\enrichment.lock` not present; not honoured, not recreated.

## Step 2 — Runbook read

RUNBOOK.md read in full this firing: H1 = **v2.27** (2026-08-08), CURRENT FLOOR (§6A) =
**v2.19** — check passed, re-verified this firing (unchanged from firing 15). Read §2A.1
items 3b (both Facebook search and Google mandatory before any artist blank) and 8 (bio is
quoted, never written) verbatim, §2A.2 mechanics, §3 venue protocol, §6A run contract,
§6F/§6G concurrency in full. Read ENRICHMENT-TASK-v3.md §0.0 and §FP in full: §FP.2 confirms
venues need only `website`/`facebookUrl`, no bio, no Chrome. Read CTO-INBOX.md tail in full
(last ~150 lines): confirmed standing, still-live fingerprints — `bv2a-claim-path-stale-in-prompt`,
`validator-venue-schema-mismatch`, `validator-venue-evidence-loader-artistid-only`,
`validator-fb-evidence-mismatch-fp2-corroboration`, `bv2a-edit-venue-facebookurl-param-does-not-exist`,
`enrich-venue-batch-array-not-parsed` (firing 14 name) — all still current, none superseded.
Used `socialMediaUrls` (never the non-existent `facebookUrl` param) on every `edit_venue`
call this firing and confirmed `updatedFields` on every response — no silent no-op writes.
Did not attempt the `enrich_venue` batch-array path (known broken per firing 14) — went
straight to `WebSearch` per venue under §FP.2.

## Chrome check

`list_connected_browsers` returned `[]`. **Nineteenth consecutive firing** with Chrome
unreachable, spanning firing 22 (2026-08-17 22:17Z) through this firing (2026-08-18 16:20Z),
over 18 hours. Per the task's HARD STOPS table: venues proceed under FP.2 (no Chrome
needed); artist priorities 1, 4 and 5 are hard-stopped again this firing. Artist backlog
(867 missing socials, 614 missing genres) confirmed static from the snapshot below —
unmoved across all nineteen firings.

## Step 3 — Work

Priority order per the task: (1) artists created <24h missing socials — **blocked, Chrome
down**; (2) venues created <24h missing socials — **0 found** (`list_venues(createdSince=
2026-08-17T16:20Z, missingSocials=true)` returned empty); (3) backlog venues missing
socials, oldest `createdAt` first — **worked, 22 records**; (4) backlog artists — **blocked,
Chrome down**; (5) artists missing genres with a facebookUrl — **blocked, Chrome down**
(genre inference from a Facebook page needs the page visited; treated as artist work per
the pattern of all eighteen prior outage firings).

Evidence file: `data\state\enrichment-evidence-2026-08-18-enrichment.jsonl` already existed
from earlier firings today — appended, not overwritten. All evidence lines written before
their corresponding `edit_venue` call.

### Records enriched WITH a verified page (12)

| Venue | id | Fields written | Evidence |
|---|---|---|---|
| Swadlincote Town Hall | `93d170d9-...798b48` | facebookUrl | facebook.com/616098205471811 |
| The Cecil Arms (Saltash) | `d0e3eb28-...871aa` | facebookUrl | facebook.com/people/The-Cecil-Arms/61573683119436 |
| Canal Tavern (Kidsgrove) | `367490c2-...84dfe2` | facebookUrl | facebook.com/profile.php?id=111872215545142 |
| Torrington Town and Community Hall | `ab2faacd-...c25a3` | website + facebookUrl | facebook.com/gttownhall |
| The Strand Social (Barnstaple) | `25609ba0-...4f1a` | website + facebookUrl | facebook.com/TheStrandBarnstaple |
| Grand Central Bar (Paignton) | `4865ad9c-...77bfe` | website only | grandcentralbar.co.uk (facebookUrl left blank — 4 competing candidate FB pages, none confirmed current) |
| Portland Social Club | `ee639c91-...8887` | facebookUrl | facebook.com/people/Portland-Social-Club/100057648422936 |
| Somerton Recreation Ground Trust | `a5882934-...db3d9a9`* | facebookUrl | facebook.com/p/Somerton-Recreation-Ground-100064697379247 |
| The Vintage Inn (Wellington) | `858d004d-...94a7c1` | website + facebookUrl | facebook.com/p/The-Vintage-Inn-100039129856878 |
| Rose & Crown (Rushden) | `e0cd3bce-...c94586` | facebookUrl | facebook.com/people/The-Rose-And-Crown-Rushden/100064072837794 |
| Stanwix Park Holiday Centre (Silloth) | `8b551216-...db94` | facebookUrl | facebook.com/stanwixpark |
| Howden Shire Hall | `a4e8c4c4-...913ab` | website + facebookUrl | facebook.com/howdenshirehall.howden |

(*id truncated for table width — full ids in the ledger.)

All 12 read back via `get_by_id` and confirmed persisted before moving on.

**Disagreement note:** Swadlincote Town Hall was recorded as an evidenced blank by an
earlier firing today (01:35Z: `"Swadlincote Town Hall" Midland Rd facebook` — no result at
the time). This firing's Google search surfaced `facebook.com/616098205471811`, a
Community Center page created 2018, name and town matching exactly. Both evidence lines
are preserved (append-only); the loader's last-line-wins picked up this firing's verified
line, and the validator passed clean. Same class as the earlier Darley Park disagreement
(2026-08-15) — flagging, not silently preferring.

**Ownership note:** The Strand Social carries `ownerGroupId`/`ownerGroupName: "Amber
Taverns"` and `tenure: "owned"`, but `isClaimed: false` and no `owner_user_id` is present —
this is chain/group metadata, not an individually owner-claimed record under §0.16, so
enrichment proceeded normally.

### Records recorded as an EVIDENCED BLANK (10)

All searched via Google (`WebSearch`) per §FP.2 — no Chrome needed for venues, so the
§2A.1 item 3b "both surfaces" rule (written for artist Facebook identification) does not
bind here; one to two Google query variants were tried per venue before recording blank.

| Venue | id | Variants tried | Reason |
|---|---|---|---|
| Annitsford Welfare Club | `4082b952-...0bfd0d`* | "Annitsford Welfare Club" Cramlington facebook | No page under this exact name; Annitsford Irish Club / Pioneer Club are different clubs. Distinct from the already-flagged "Ann Welfare Playing Fields" (different id, different postcode). |
| Hayfield Club | `cf792645-...bcd66` | "Hayfield Club" Hayfield High Peak facebook | Only Conservative Club (different address), Angling Club, Football Club found — none named "Hayfield Club" at Church St. |
| The Tannery (Derby) | `d6572707-...66091` | "The Tannery" Sadler Gate Derby facebook; Ashover Brew Co Tannery Derby facebook.com/... | New taproom (opened June 2026) run by Ashover Brew Co; only the parent brewery's own FB page found, no venue-specific page. |
| W P M Sports & Social Club (Gosport) | `db9dd035-...bad2a339` | "WPM" OR "W P M Sports" Whites Place Gosport facebook; site:facebook.com WPM Sports Social Club Gosport | Only an events sub-page and two group pages found; no confirmed main page. |
| Newton Abbot 76 Sports & Social Club | `35b5ed32-...f8dbe3` | "Newton Abbot 76" sports social club facebook | Three competing candidate pages (old page, "New Page", third variant); none confirmed current. |
| Jubilee Inn (Torpoint) | `e7e0e7d5-...5a4d7` | "Jubilee Inn" Torpoint facebook | Only candidate found reads as a personal-profile-style handle (`jubilee.inn.79`) — rejected per §2A.1 item 4; a same-name "Jubilee Inn, Pelynt" page is a different pub. |
| The Dolphin Hotel (Plymouth) | `d6492207-...4901fb` | "Dolphin Hotel" Barbican Plymouth facebook; "Dolphin Hotel" Plymouth Barbican facebook.com/ | Multiple sources confirm the pub "has a Facebook page" but no URL surfaced across two query variants. |
| The Saracens Head (Newton Abbot) | `d2640e2e-...7dfe7` | "Saracens Head" Newton Abbot facebook; Saracens Head pub Fairfield Terrace Newton Abbot Devon facebook page | Only same-name page found is "Saracens Head, Newton Green", Sudbury, Suffolk — wrong location. |
| The Tap & Grape Broadstone | `c5a858f1-...596e2` | "Tap and Grape" Broadstone Poole facebook | Only event listings and directory pages found, no facebook.com page URL. |
| Molly Malones (Taunton) | `128e5f1a-...ea977` | "Molly Malones" Taunton Malt N Hops facebook; site:facebook.com "Molly Malones" Taunton | Only a personal-profile-style handle and a "Taunton Music Scene" group found — neither is the venue's own page. |

(*ids truncated for table width — full ids in the ledger and evidence file.)

### Records SKIPPED, and why

None this firing beyond the standard priority-1/4/5 artist hard-stop (Chrome down — see
above). No new non-venue / garbled-name / address-mismatch findings this firing; all
backlog venues pulled from the oldest end of the queue were genuine, searchable pubs/halls/
clubs.

### Names corrected under §0.6

None. No verified page this firing carried a different name from the bndy record (unlike
firings 09/12, which found four such mismatches).

### Validator summary line

```
22 records · 11 clean · 0 FAIL · 22 WARN   [mode=gate]
```

One correction cycle: Grand Central Bar initially FAILed `BLANK_NOT_EVIDENCED` because a
website was attached but no `searchVariants` were recorded for the (separately blank)
facebookUrl field. Corrected by appending a second evidence line recording the Facebook
search variant tried and why it was left blank (multiple competing pages). Re-run: 0 FAIL.

All 22 WARN are `STUB_NO_BIO` / `STUB_NO_IMAGE` on the 11 facebookUrl-bearing records —
expected, non-blocking noise per standing fingerprint `validator-venue-schema-mismatch`:
venues carry no bio/image requirement under §FP.2, the validator's WARN class does not
gate, and every prior venue-only firing since 2026-08-14 has carried the same WARN count.

### Budget used, and whether the circuit breaker fired

Claim acquired 16:20:23Z, work (search + writes + validation) completed by ~16:33Z — **13
minutes**, well inside the 40-minute task budget and the 3-hour claim TTL. Circuit breaker
did not fire (0 FAIL on this and the prior 3 reports).

## Step 5 — Ledger, summary, dashboards

- `data\state\enrichment-ledger.jsonl`: appended 22 `enrich` lines + 1 `snapshot` line.
- Snapshot: `artistsTotal:2231, artistsMissingSocials:867, artistsMissingGenres:614,
  venuesTotal:3004, venuesMissingSocials:340` (340 = 352 − 12 verified this firing; artist
  figures static, confirming the Chrome outage's continued effect).
- `data\state\run-summary.jsonl`: appended one line, `outcome:"completed"`,
  `recordsEnriched:22`, `skipped:0`.
- Both dashboards regenerated: `data\normalized\enrichment\DASHBOARD.html` (1996 enrichment
  records, 66 snapshots) and `data\normalized\DASHBOARD.html`.

## CTO-INBOX

Appended: nineteenth-consecutive-firing Chrome outage entry, and the Swadlincote
blank-then-verified disagreement. See `CTO-INBOX.md`, 2026-08-18 section.

## Outcome

**Ran OK.** enrichment — 12 venues verified, 10 venues evidenced blank (22 total), 0
artists (Chrome unreachable). Validator 0 FAIL.
