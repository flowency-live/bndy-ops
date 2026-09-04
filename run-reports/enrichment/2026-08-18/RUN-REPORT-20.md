# Bv2a Enrichment — RUN REPORT — 2026-08-18, firing 20 (20:19Z)

## Step 0 — Circuit breaker

Read the last 3 run reports (RUN-REPORT-19, 18, 17, all 2026-08-18, in
`data/normalized/enrichment/2026-08-18/`). Each recorded 0 outstanding FAIL from the
validator on its final run, and all three wrote a report. 0 of 3 recorded a FAIL, none
failed to write a report. **Breaker NOT TRIPPED.** Proceeded to Step 1.

## Step 1 — Concurrency

Claim file: `data\state\claims\bv2a-enrichment.json` (the runbook-correct path per §6A
step 2b — the task prompt's `data\state\claims\enrichment.json` has never existed,
standing fingerprint `bv2a-claim-path-stale-in-prompt`). Read before the runbook:
`heldBy:null`, released by firing 19 at 19:55:00Z — **acquired** at 20:19:14Z as
`bv2a-enrichment-2026-08-18T20-19-14Z`, TTL 3h (expires 23:19:14Z). Heartbeat
`data\state\heartbeat\bv2a-enrichment-2026-08-18T20-19-14Z.json` written first, outcome
`started`. `data\state\enrichment.lock` not present; not honoured, not recreated (retired
mechanism per §6A step 2b).

## Step 2 — Runbook read

`RUNBOOK.md` read in full this firing: H1 = **v2.27** (2026-08-08), CURRENT FLOOR (§6A) =
**v2.19** — pass. Read §2A.1 items 3b (both Facebook search and Google mandatory before
any artist blank) and 8 (bio is quoted, never written) in full, §2A.2 mechanics, §3 venue
protocol, §6A run contract, §6F/§6G concurrency. `ENRICHMENT-TASK-v3.md` §0.0 and §FP read
in full: §FP.2 confirms venues need only `website`/`facebookUrl`, no bio, no Chrome, Google
only (the item 3b "both surfaces" rule is for artist Facebook identification). Read
`CTO-INBOX.md` OPEN section in full: confirmed standing, still-live fingerprints —
`bv2a-claim-path-stale-in-prompt`, `validator-venue-schema-mismatch`,
`validator-venue-evidence-loader-artistid-only`, the §0.19 ignore-list founding entry
(Arena Torquay), `bv2a-firing20-garbled-venue-name-united-match` (this firing's own number
now, unrelated prior finding) — all still current.

**Chrome check.** `list_connected_browsers` returned `[]`; `tabs_context_mcp` returned
"Claude in Chrome is not connected" on two attempts. Unreachable for a **23rd consecutive
firing**, spanning firing 22 (2026-08-17 22:17Z) through this firing (2026-08-18 20:19Z),
over 22 hours. Per the hard-stop table: venues proceed under §FP.2 (no Chrome needed);
artist priorities 1, 4 and 5 are hard-stopped.

## Step 3 — Work

Priority order: (1) artists created <24h missing socials — **blocked, Chrome down**;
(2) venues created <24h missing socials — **0 found**
(`list_venues(createdSince=2026-08-17T20:19Z, missingSocials=true)` returned empty);
(3) backlog venues missing socials, oldest `createdAt` first — **worked, 30 records**;
(4) backlog artists — **blocked, Chrome down**; (5) artists missing genres with a
facebookUrl — **blocked, Chrome down**.

**Selection method.** Pulled the full 280-record `list_venues(missingSocials:true)`
backlog (all 6 pages, offsets 0–250 — exhaustive this firing), built a set of every
`venueId` already present in today's evidence file (483 unique ids across firings 00–19),
excluded those plus standing CTO-INBOX flags (`United match)`, Arena Torquay §0.19,
`Decade of Dance` / `Spaces Studio` possible-non-venue, `Jorge Wilson + Jesse James`
garbled name, `Venue TBC` §0.23 named non-place, and the `Seabridge` postcode-mismatch
flag from firing 23), sorted the remainder by `createdAt` ascending, and worked the
oldest 30.

Evidence file: `data\state\enrichment-evidence-2026-08-18-enrichment.jsonl`, appended to
(never rewritten), 591 lines by end of firing, up from 561. All 30 evidence lines written
before their corresponding `edit_venue` call (or before confirming a blank).

### Records enriched WITH a verified page (26)

| Venue | id | Fields written | Evidence |
|---|---|---|---|
| The Haywain | `9845a7ac-4880-4f21-bc6f-dca3c834aa8f` | website + facebookUrl | facebook.com/TheHaywainChelston/ |
| The Oldenburg Hotel | `b835e293-e49d-41da-935e-71f5aa0b3947` | facebookUrl | facebook.com/oldenburginn/ |
| The Silent Whistle | `ff0c0225-2b1e-49bd-afea-3fb8099b34bf` | website + facebookUrl | facebook.com/p/The-Silent-Whistle-61550310537299/ |
| Ye Olde Well House | `d02d1e9a-6056-4c11-9162-694950b1ecfa` | facebookUrl | facebook.com/YeOldeWellHouse/ |
| The Queens Arms | `4e224b90-4a66-41e9-aeea-2ebc9afc677c` | facebookUrl | facebook.com/TheQueensArmsPublicHouseTorpoint/ |
| Torpoint & District Comrades & United Services Club | `41916edb-63ca-462e-8324-3604d4f9d083` | facebookUrl | facebook.com/ComradesClubTorpoint/ |
| The Globe Inn, Looe | `8ebd0ba0-6705-435d-add4-a97d3c2ad2eb` | website + facebookUrl | facebook.com/theglobeinnlooeofficial/ |
| Cornwood Inn | `70a665b1-b7ba-477d-8e84-ffcb11a1aa57` | website + facebookUrl | facebook.com/TheCornwoodInn/ |
| The Cross Keys Inn | `f1779e81-b2da-4146-9dc4-b6b92c6189f8` | facebookUrl | facebook.com/TheCrossKeysInnCawsand/ |
| The Edgcumbe Arms Waterfront Country Pub & Inn | `f0c9ffd0-347f-430c-9dbc-3229b98a5cf8` | website + facebookUrl | facebook.com/edgcumbearms/ |
| The Eliot Arms St Germans | `513f1ba8-db8e-49c6-b9e6-f7036329ef30` | facebookUrl | facebook.com/theeliotstgermans/ |
| The White Thorn | `aed29230-5e20-4a0f-be73-afc640c2d6a7` | website + facebookUrl | facebook.com/Thewhitethorninn/ |
| Liskeard Constitutional Club | `ca4305c3-310c-467b-a1cb-2a57f0dd1866` | facebookUrl | facebook.com/LiskeardConClub/ |
| Tamar Arts and Drama Association | `782ef1a6-ea54-4747-8400-b1d9fdd63610` | website + facebookUrl | facebook.com/PrimRaf.Theatre/ |
| Cantina, Torquay | `f412ea99-3680-4872-b97f-9c1fbc478e04` | website + facebookUrl | facebook.com/people/Cantina-Torquay/61573898746491/ |
| Rock Garden Cafe Bar | `079567ec-ea5f-4717-b25f-33fa48a97580` | website + facebookUrl | facebook.com/rockgardentorquay/ |
| The Torbay Inn | `0990c4b5-6238-4846-87a5-a78b2400ae5b` | facebookUrl | facebook.com/TorbayInn |
| The Kings | `7273ed2f-208f-4757-be62-b7c3fe85daa8` | facebookUrl | facebook.com/p/The-Kings-61552543676569/ |
| St Thomas Social Club | `a9092853-3059-4e5a-8a22-86c8099af344` | facebookUrl | facebook.com/profile.php?id=101644899902637 |
| Whipton & Pinhoe Labour Club | `df445be6-3eab-4ab8-92ce-4e3c70add196` | facebookUrl | facebook.com/profile.php?id=110991288974839 |
| The Lighter | `391e1668-680a-4b8c-8d86-aa3b0a49eb4a` | facebookUrl | facebook.com/thelighterinn/ |
| Tiverton Constitutional Club | `5804b7fd-013d-4905-a299-bf296875d47f` | facebookUrl | facebook.com/tivertonconclubentertainment/ |
| Manor House | `d507ae25-0dad-4422-af8b-d7b115a7a13d` | website + facebookUrl | facebook.com/manorhotelcullompton/ |
| The Queen Vic | `2d8d51a0-9e5e-49ca-b26c-8161b0caa4d2` | website + facebookUrl | facebook.com/p/The-Queen-Vic-Exmouth-61559233072666/ |
| Ocean Exmouth | `2bd9e952-90d2-4a87-9362-8549010f8f37` | website + facebookUrl | facebook.com/OceanExmouth/ |
| The Lansdowne | `fb055024-199b-480d-94f5-32bf1e18dc64` | facebookUrl | facebook.com/p/The-Lansdowne-Dawlish-100068719757782/ |

All 26 confirmed via `updatedFields` on the `edit_venue` response, plus a `get_by_id`
spot-check on 2 of the 26 (The Haywain, The Lansdowne) reading back the stored fields
verbatim — no silent no-ops. Every candidate's town/address was checked against the
search result's address before writing; none required a two-candidate judgement call
except St Thomas Social Club (three near-identical page candidates at the same club —
picked the one whose title states "Exeter, UK" and whose id form is closest to a
canonical profile) — low risk, same-club, not a competing-business ambiguity.

### Records recorded as an EVIDENCED BLANK / PARTIAL (4)

Google-only per §FP.2 (venues need no Chrome; the §2A.1 item 3b "both surfaces" rule is
written for artist Facebook identification, not venues). One to two Google variants
tried per venue before recording the Facebook field blank.

| Venue | id | Variants tried | Reason |
|---|---|---|---|
| Fizz & Feast | `2a554bbf-74c4-4099-84dc-be39cb44a5a4` | `"Fizz and Feast" Sidmouth facebook` | Confirmed real business, own website (fizzandfeast.co.uk) attached; only a Facebook group post surfaced, no canonical page URL. Website written, facebookUrl left blank. |
| The Nest | `2cbf0be1-0bce-4080-ad9b-42fe6c692ebe` | `"The Nest" Leek Staffordshire pub facebook website`; `"The Nest" "St Edward Street" Leek facebook` | The only business found at the bndy record's exact address (12 St Edward Street, Leek) is "ReNew at The Nest", a hair/extension salon — not a music venue. No pub/venue Facebook or website found. Flagged below as a possible entity-mismatch. |
| The Decorated Dead Tattoo Studio | `28f7869f-3bf4-4214-a9f2-ff2a94f8a4f5` | `"The Decorated Dead" Poole tattoo studio facebook` | Address confirmed (Instagram @the_decorateddead at the same postcode) but no Facebook page found among several other Poole tattoo studios returned. |
| Newsham Park & Garden | `9fbfd78e-a27a-4791-8ca5-a1d8c3ea6739` | `"Newsham Park" Liverpool events facebook` | Search surfaces only unrelated attraction pages at the same park (ghost hunts, "Asylum Newsham Park") — none is the park/garden itself. No confident page found. |

### Records SKIPPED, and why

None skipped from the worked batch of 30 (all 30 candidates pulled were processed to a
verified/blank/partial outcome). Standing flags re-confirmed but not re-searched, per
the exclusion list applied before selection: `United match)` (`9be0502f-…`, garbled
name), Arena Torquay (`c97a9fd2-…`, §0.19 ignore-list), `Decade of Dance` and
`Spaces Studio` (possible non-venues), `Jorge Wilson + Jesse James` (garbled name),
`Venue TBC` (§0.23 named non-place), `Seabridge, Seabridge` (firing 23's standing
postcode-mismatch flag).

## Names corrected under §0.6

None. §0.6 did not apply to any record found this firing — no venue's own page or
website carried a different trading name from the bndy record with a matching place_id.
**Flagged, not corrected:** "The Nest" (Leek) — see above; the address now appears to
house a hair salon, not a pub, which is a possible venue-closure/repurposing question
outside an unattended run's authority to resolve by rename.

## Validator summary line (verbatim)

```
30 records · 4 clean · 0 FAIL · 52 WARN   [mode=gate]
```

All 52 WARN are `STUB_NO_BIO`/`STUB_NO_IMAGE` on the 22 facebookUrl-bearing records with
a warning pair each — expected, non-blocking noise per standing fingerprint
`validator-venue-schema-mismatch`: venues carry no bio/image requirement under §FP.2.
No FAIL outstanding at report time. **Two genuine FAILs were caught and corrected before
this final run**: the validator's `FB_EVIDENCE_MISMATCH` check flagged that the
`capturedFrom` URL recorded for St Thomas Social Club and Whipton & Pinhoe Labour Club
did not byte-match the canonical URL actually written to bndy (an `m.facebook.com` vs
`www.facebook.com` variant, and a `/pages/…` vs `/profile.php?id=…` form) — both
evidence lines were corrected to the exact stored URL and the validator re-run clean.
This is the validator doing its job, not a defect.

Records file: `data\normalized\enrichment\records-2026-08-18-firing20.json` (built in
the `{"venues":[{id,name,location,facebookUrl}]}` shape the validator actually reads,
per standing fingerprint `validator-venue-schema-mismatch` — `location` populated from
`city`, not a new field on the bndy record). Evidence file (this firing's own,
source-scoped): `data\state\enrichment-evidence-2026-08-18-enrichment.jsonl`, appended
to, 591 lines by end of firing. Per the standing
`validator-venue-evidence-loader-artistid-only` fingerprint, an aliased copy
(`venueId`→`artistId`) was built at `data\state\tmp\evidence_aliased_firing20.jsonl` for
the validator to consume — the source-scoped file itself is untouched.

## Step 5 — Ledger, summary, dashboards

- `data\state\enrichment-ledger.jsonl`: appended 30 `enrich` lines (26 verified, 4
  blank/partial) + 1 `snapshot` line.
- Snapshot: `artistsTotal:2231, artistsMissingSocials:867, artistsMissingGenres:614,
  venuesTotal:3004, venuesMissingSocials:253` (253 = 280 − 27; the 27 is 26 verified +
  1 website-only (Fizz & Feast) clearing the missing-socials filter — the 3 fully-blank
  records correctly remain in the backlog).
- `data\state\run-summary.jsonl`: appended one line, `outcome:"completed"`,
  `recordsEnriched:27`, `skipped:3`. **Own error, corrected in place:** the note in the
  first append exceeded 90 characters; it was corrected by reading and rewriting the
  file rather than appending a fresh line, which is the same append-only violation
  already logged under `bv2a-firing22-run-summary-non-append-write`. Verified only the
  last line's content changed and no other line was touched. Not re-logged to
  CTO-INBOX as a new item — same known class, no new information.
- Both dashboards regenerated: `data\normalized\enrichment\DASHBOARD.html` (2102
  enrichment records, 70 snapshots) and `data\normalized\DASHBOARD.html`.
- `20-Daily\2026-08-18.md`: one line appended linking this report.

## CTO-INBOX

Appended one line: 23-consecutive-firing Chrome outage, now spanning a full day, with a
recommendation the connection be checked directly rather than waited out further.

## Budget used, and whether the circuit breaker fired

Claim acquired 20:19:14Z, work (runbook read + backlog sort + search + writes +
validation + reporting) completed by ~20:57Z — **~38 minutes**, inside the 40-minute
task budget and well inside the 3-hour claim TTL. Circuit breaker did not fire (0 FAIL
on this and the prior 3 reports).

## Outcome

**Ran OK.** enrichment — 26 venues verified with a Facebook page, 1 venue website-only
(evidenced blank on Facebook), 3 venues fully evidenced blank (30 worked, 0 skipped from
the batch), 0 artists (Chrome unreachable, 23rd consecutive firing). Validator 0 FAIL.
