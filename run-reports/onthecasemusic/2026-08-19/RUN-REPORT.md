# onthecasemusic — RUN REPORT 2026-08-19 (03:31Z)

**Outcome: COMPLETED.** 0 events created. 2 events hidden. 4 venues corrected. 1 row carried over. Snapshot written. Validator 0 FAIL.

| field | value |
|---|---|
| runId | `onthecasemusic-2026-08-19T03-31-36Z` |
| fired (UTC) | 2026-08-19T03:31:36Z |
| local date (§6A step 1) | 2026-08-19 (`date +%Y-%m-%d`) |
| runbook read | `RUNBOOK.md` H1 **v2.27**, in full |
| floor asserted (§6A step 2a) | **v2.19**. 2.27 ≥ 2.19, so the run proceeded. |
| floor named in the task prompt | **none**. The prompt states no version and defers to §6A. No drift to report. |
| spec read | `sources/onthecasemusic.md`, in full |
| CTO-INBOX read | yes. Fingerprints checked before any append. |
| heartbeat | `data/state/heartbeat/onthecasemusic-2026-08-19T03-31-36Z.json` |
| claim (§6A step 2b, §6G) | `data/state/claims/onthecasemusic.json` was `heldBy: null` (released 2026-08-18T21:38Z). Acquired. TTL 90 minutes. No takeover. |
| caps | 50 creates. Used 0. |
| report path | `RUN-REPORT.md`. First firing today. |

## 1. Counts

| measure | count |
|---|---|
| events created | 0 |
| events edited | 2 (both `isPublic: false`, §5) |
| events deleted | 0 |
| venues created | 0 |
| venues edited | 4 (externalId back-fill, §6) |
| artists created | 0 |
| artists enriched | 0 |
| rows carried over, not written | 1 (§4) |
| gate bounces (409/422/500) | 0 |

## 2. Capture (§6A step 4)

`curl` of `https://onthecasemusic.co.uk/gigs`, HTTP 200, 374,909 bytes.
Parsed by `data/raw/onthecasemusic/2026-08-19/parse.py`, md5 `4910da5ad72576c5a50959966ca4adc3` —
byte-identical to the parser used on 2026-08-08, 2026-08-12, 2026-08-14, 2026-08-15 and 2026-08-18.

```
rows 287   dates 113   2026-08-20 -> 2027-12-26
gigIds unique 287
no bandId 29
```

Raw artefacts: `data/raw/onthecasemusic/2026-08-19/{gigs.html,parse.py,capture-normalised.txt,records.json,diff.json,snapshot-header.txt,snapshot-new.txt}`.

**Chrome was not used for the capture.** The spec says `/gigs` is client-rendered and Chrome is mandatory. That is not borne out. Already on file as `otcm-chrome-not-mandatory`. The spec was NOT edited by this run.

## 3. Diff (§6A step 5, §5.7)

Diffed on `(date, gigId)` first, then on the row text, per the spec's DIFF SAFETY item 2. Both sides normalised identically per §5.7(a); the rules are written into the snapshot header.

| result | count |
|---|---|
| added | **0** |
| removed | **0** |
| changed | **0** |

The feed did not move in 24 hours. That is a real result and it is not an error.

**Mode (§0.29).** The spec declares no mode. §0.29 names onthecase as qualifying for `delta` on evidence, and today's evidence holds: the self-diff is 0/0 and the enumeration method is the same script that wrote the stored snapshot. The question became load-bearing this run — see §5. This run deleted nothing. Already on file as `otcm-mode-not-declared`; not raised twice.

## 4. A zero diff is not a coverage statement — so this run measured coverage

`klma-zero-diff-hid-nine-missing-gigs` (2026-08-19) records a source whose diff read 0/0 while nine published gigs were missing from bndy and no report ever named them. The same failure is possible here, and the two known otcm defects make it likely rather than theoretical:

- `otcm-externalid-form-mixed` — a `get_by_external_id` miss on the gig id is **not** proof of absence. Measured again this run: gig `131472` (Stax Bros. @ Billy Bootleggers, 2026-08-21) returns *not found* on the gig id and **is in bndy** as `b0399e97-0d56-4aad-bf52-43cc24ccef63` under the §6D date-slug form.
- `skipped-row-swallowed-by-snapshot` — a row skipped once is never re-offered by a diff.

**Method.** Every source row dated 2026-08-20 → 2026-10-18 was reconciled against bndy **by venue and date**, not by externalId: resolve each venue, then `search_event(venueId, dateFrom, dateTo)` and compare both directions. 24 venues, 120 source rows.

| measure | count |
|---|---|
| source rows in window | 120 |
| skipped by standing rule (`Buskers night` ×8, `Cancelled` ×2) | 10 |
| actionable source rows | **110** |
| present in bndy | **109** |
| **absent from bndy** | **1** — Eli, gig `131476` (§4.1) |

**Coverage is 109 of 110.** No hidden backlog. Five externalId forms are live on this source in that window alone (bare gig id; `YYYY-MM-DD-artist-venue`; `artist-YYYY-MM-DD-venueshort`; `m-artist-YYYY-MM-DD-venueid`; and the legacy `onthecase-daily-import` `YYYY-MM-DD_artist_venue`). All five resolve to real, correct events. The forms are a provenance and idempotency problem, already on file, not a data-loss problem.

### 4.1 The one missing row — Eli, carried over a third time

| field | value |
|---|---|
| row | `131476 | Eli at Crown and Cannon Winlaton | 2026-09-05 | 9:00 PM / FREE` |
| source band id | `1111` |
| bndy artist | `get_by_external_id(artist, onthecasemusic, 1111)` → **not found** |
| bndy event | absent from `search_event(Crown and Cannon, 2026-08-20 → 2026-10-18)`, which returned 19 events, none on 2026-09-05 |
| blocker | new artist `Eli`; Chrome unreachable |

`list_connected_browsers` returned `[]` and `tabs_context_mcp` reported "not connected". This is the same outage the enrichment task has logged for 30 consecutive firings, plus klma, gigs-news, sceniceye and spider. **§2A.1 item 5 forbids creating an artist bare and §2A.5(b) never waives the identity check on the name**, so `Eli` — a two-letter name with a high collision risk — cannot be created on the evidence available. Under §0A rule 1(b) the row is skipped again and stated here.

**Not escalated, and not raised again in the inbox.** The Chrome outage is already on file five times over. A sixth line adds nothing.

## 5. Six stale live events found by the coverage check — two hidden, four left

The coverage check runs in both directions. It found **six future-dated, public bndy events at this source's venues that the current capture does not contain at all.** Each was confirmed by `get_by_id`, not by the search result.

| event id | title | date | this source's id | action |
|---|---|---|---|---|
| `fa98019e-43c0-46a5-b8da-97ce33ca1001` | One More Mile at White Swan Morpeth | 2026-08-30 | `onthecasemusic:126887` | **hidden** |
| `c42dadca-b7ca-4907-84d0-7410abafbbcc` | The Panthers @ Bebside Inn | 2026-08-29 | `onthecase-daily-import:2026-08-29_the-panthers_bebside-inn-blyth` | **hidden** |
| `daa8884e-a92d-4050-97a6-64a4a02e904a` | The Zone @ Seahorse Sports Bar | 2026-08-23 | `onthecasemusic:the-zone-2026-08-23-seahorse` | left live |
| `4a9f1c3d-221a-4c3d-810a-1f4568fe89de` | The Zone @ New Hartley Memorial Hall | 2026-09-12 | `onthecasemusic:the-zone-2026-09-12-newhartley` | left live |
| `332d8b3c-cab2-403e-a815-9feaeaa9894e` | Riverain at Clousden Hill Forest Hall | 2026-09-19 | `onthecasemusic:126329` | left live |
| `99cecc2c-c175-450f-90d3-8e60bd7074f7` | Diablo at Runhead Bar & Grill Ryton | 2026-09-26 | `onthecasemusic:m-diablo-2026-09-26-638` | left live |

### 5.1 Why two were hidden and four were not

**The two hidden rows are re-bills, and the source names the replacement act.** That is a positive statement, not an absence:

- Gig `126887` is still live at source. It reads **`Scratch at White Swan Morpeth, 6:00 PM`**. The bndy record on that gig id still reads One More Mile, created 2026-04-30 and never edited. A correct **Scratch** event already exists as `5530b127-9783-447c-b177-3cb3bbf48752` under the slug form. So one booking carries two bndy records and one of them is wrong. `One More Mile` appears nowhere in the 287-row capture.
- Bebside Inn on 2026-08-29 carries exactly one act at source, gig `131368` **Beer Monkeys**, and that event exists as `a1d7dc53-9080-4ed2-b9c9-376d1e7ae98d`. `The Panthers` appear nowhere in the capture.

This is the failure the spec's DIFF SAFETY item 2 names: *same booking, new act, EDIT the existing event, never create a sibling.* An earlier run created the sibling. **An edit cannot repair it now** — writing the correct artist onto the stale record would collide with the correct record on the (venue, artist, date) sentinel. Only a removal closes it.

**This run hid them rather than deleting them.** §0.17 would delete: single-source, not owner-managed, absence confirmed against the full capture. But §0.29 requires a declared mode before a run may action a removed row, and this spec declares none. A delete is irreversible and §5.4 (v2.19) deleted the sentence that used to say otherwise. `isPublic: false` removes the wrong gig from the public map, is reversible by a later run, and blocks nothing: the sentinel it holds is (One More Mile, White Swan, 2026-08-30) and no correct record needs that triple. Both edits were verified with `get_by_id` (§0.10) and both are tombstoned in `data/state/cancellations.jsonl` (§5.4).

**The four left live are plain absences.** The source names no replacement act on those dates, so the only evidence is that the row is gone — which §5.7 treats as a source drop, and a source drop needs the mode this spec does not declare. Leaving a possibly-cancelled gig up is a smaller error than deleting a real one. They are named in the snapshot header so the next run does not rediscover them, and raised once in the inbox.

### 5.2 Excluded from the list, deliberately

- **The Zone @ Old Fat Ox, 2026-09-19** (`5f41d2ed-acf7-480b-a596-f8bac633dbff`) — absent from this capture but **lemonrock still publishes it** (`lemonrock:970345-2026-09-19`). §0.17(a) fails. No action, no inbox line.
- **Face Value Duo @ Old Fat Ox, 2026-08-31** — lemonrock-only provenance. Not this source's record.
- **Steel Blue @ The Peacock, 2026-08-21** (`ae6d16f2-…`) — already on file as `otcm-rebill-orphans-other-source`.
- **The Substitutes @ Live Lounge, 2026-08-23** (`40e3d36f-5485-4a65-bd28-6883a0a5ab98`) — `search_event` reported empty externalIds, and §6B records that as a known false-negative mode. Not treated as unattributed on that evidence alone.

## 6. Four venues corrected — this source could not resolve its own venues

Four venues carrying 17 of this window's rows held **no `onthecasemusic` externalId**, so `get_by_external_id(venue, onthecasemusic, <slug>)` missed on every one and a run was left with `search_venue` alone. §2.16 measured what that costs: correct venues returning 52–73% `low_confidence`, below the create-new threshold in every source spec's match ladder. Measured again this run: Bridge Hotel Durham 63%, Old Fox 64%, Runhead 64%, Red Lion Earsdon 67%, Red House Farm 52%, The Peacock 52%. **Every one of those is the right venue and the ladder would have said create.**

Each was read with `get_by_id` first, written with the complete intended array in one call (§6B), and read back by `get_by_external_id`:

| venue | id | added | other provenance preserved |
|---|---|---|---|
| Bridge Hotel Durham | `22f62ed9-a489-4d80-8cd3-9f3aa1677f24` | `onthecasemusic:bridge-hotel-durham` | `onthecase-daily-import`, `lemonrock` |
| Bebside Inn | `b23c91b9-b467-4df3-b6e8-73b5621d8d8e` | `onthecasemusic:bebside-inn-blyth` | `onthecase-daily-import`, `lemonrock` |
| The Three Tuns | `4a9489aa-d6b8-4277-b29d-bf6c43e1c46c` | `onthecasemusic:three-tuns-gateshead` | `poster-import-2026-05-03`, `onthecase-daily-import`, `lemonrock` |
| The Peacock (Kenton) | `a180d98b-3e97-461c-8e7b-04301eee110a` | `onthecasemusic:the-peacock-newcastle` | `lemonrock` |

All four read back with every prior id intact. **The Peacock case matters most:** two records answer to that name and `peacock-newcastle-wrong-geocode` records that the wrong one — `e345cdd5-425c-4fba-b920-ec1fa721ca3c`, 55 Pilgrim St NE1 6BJ — holds the legacy `onthecase-daily-import` id. The source's venue is Arlington Ave, Kenton NE3 4TS. This run put the canonical slug on the **correct** building, so a future run resolving by externalId lands on Kenton, not Pilgrim Street.

## 7. Rows requiring no action

No added rows, so no new venue, artist or event pipeline ran (§6A step 6). The standing skips in the feed (`Buskers night` ×8, `Cancelled` ×2, `to be confirmed`, `Undecided Acoustic Duo`) were unchanged and are not re-litigated here.

## 8. Quality measures (§6, v2.5)

- Records created with a verified page: **0** (nothing created).
- Records created with an evidenced blank: **0**.
- Records skipped rather than created bare: **1** (Eli, Chrome unreachable, §4.1).
- Names sanitised or skipped as non-acts: **0 new**.
- Defaulted start times: **0**. No event was written.
- Corrections applied: **6** — 2 wrong public gigs hidden, 4 venue provenance back-fills.
- Every write verified by read-back (§0.10): **6 of 6**.

## 9. Validator (§6A step 8)

```
python3 scripts/enrichment_validate.py \
  --records data/normalized/onthecasemusic/2026-08-19/records.json \
  --evidence data/state/enrichment-evidence-2026-08-19-onthecasemusic.jsonl --mode gate
```

Exit code 0. **Validator 0 FAIL.** The run created and enriched no artists, so the record set is empty and the evidence file has no lines. `records.json` in this directory is the empty validator input. The six writes this run made are event `isPublic` flags and venue `externalIds` — neither is in the validator's rule set, and neither carries a bio, a page or a genre.

## 10. Snapshot (§6A step 7)

Written to `data/state/onthecasemusic-last-page.txt`. 287 rows, 113 dates, 2026-08-20 → 2027-12-26. The header carries the normalisation rules, the capture method, the parser md5, the 0/0 gate result, the Eli carry-over **and the six stale events named in §5**, so the next run does not have to rediscover them from a diff that cannot see them.

**Self-diff gate (§5.7(a)):** the new snapshot re-diffed against the capture it was written from returns **0 added / 0 removed / 0 changed**. The gate passes.

**The fail-closed gate is satisfied: this run wrote to bndy and it wrote its snapshot.**

## 11. CTO-INBOX

**Two lines appended.**

| fingerprint | why it is new |
|---|---|
| `otcm-rebill-stale-events-six-live` | Six named future-dated events, all confirmed by `get_by_id`. `otcm-rebill-orphans-other-source` covers one lemonrock event orphaned by an otcm re-bill; `insangel-rebill-stale-events` is a different source. Neither names these six, and none of the six is reachable by any diff. |
| `otcm-duplicate-artist-riff-raff-billing-name` | Two artist records for one act, both holding a Crown and Cannon event on 2026-09-13, so the artist+venue+date sentinel cannot see the duplicate. Same class as `klma-duplicate-artist-nu-call-billing-name` and `duplicate-driscols-driscolls`, different records. |

Nothing else appended. Every other observation is already on file:

| observation | existing fingerprint |
|---|---|
| Chrome unreachable, blocking new-artist creates | `bv2a-chrome-unreachable-30-firings-one-day`, `klma-chrome-unreachable-blocks-artists`, `gigs-news-chrome-unreachable-blocks-artists`, `spider-chrome-unreachable-blocks-new-artists` |
| The spec declares no §0.29 mode | `otcm-mode-not-declared` |
| Multiple externalId forms live on this source | `otcm-externalid-form-mixed` |
| The spec says Chrome is mandatory for `/gigs`; curl reproduces the feed | `otcm-chrome-not-mandatory` |
| A correct venue returns a low-confidence `search_venue` score | `search-venue-apostrophe`, RUNBOOK §3 / v2.16 |
| A skipped row is never re-offered by the diff | `skipped-row-swallowed-by-snapshot` |
| A 0/0 diff can hide missing gigs | `klma-zero-diff-hid-nine-missing-gigs` |
| `record_run` fails on a missing token | `record-run-token-missing` |

### 11.1 The duplicate Riff Raff pair

| record | id | source |
|---|---|---|
| artist "Riff Raff" | `b88a13b3-800d-47f3-9989-5cff53d48eda` | the spec's own learned alias — *"cross-region touring band, footprint-proven; never create a NE twin"* |
| artist "Riff Raff - The Bon Scott Years" | `bbfa7f25-eeed-48fe-b012-c85c92b62764` | lemonrock, created 2026-08-07, `nameVariants: ["Riff Raff"]`, `needsReview: true` |
| event | `1b240331-b35a-4d97-968b-1c8129496a56` | Riff Raff at Crown and Cannon, 2026-09-13, `onthecasemusic:125883` |
| event | `f6c23570-3fa6-4b4b-bb9e-1f359a8783c2` | Riff Raff - The Bon Scott Years @ Crown and Cannon, 2026-09-13, `lemonrock:923371-2026-09-13` |

One gig, two public records. The second artist name is a billing string, which §0.6 forbids as a record name, and the record already carries `Riff Raff` as a `nameVariant` — so the two are the same act by the runbook's own test. **This run changed nothing.** §0.11 forbids a merge during an import run, the artist belongs to another source's lane (§6F), and the correct fix is a merge plus an event reassignment, which is a cleanup activity with its own protocol.

## 12. Open items

**None blocked.** No row was staged. Nothing was escalated to Jason. One row (Eli, gig `131476`) carries to the next run, which is the §0A rule 1(b) disposal, not an escalation.

`record_run` was not called. `SOURCE_RUNS_TOKEN` is absent and the task prompt states this is not blocking. `data/state/run-summary.jsonl` is the dashboard input and was appended.
