# onthecasemusic — RUN REPORT 2026-08-18

**Outcome: COMPLETED.** 8 events created, 1 venue created, 3 events edited, 1 row skipped. Snapshot written. Validator 0 FAIL.

| field | value |
|---|---|
| runId | `onthecasemusic-2026-08-18T03-31-16Z` |
| fired (UTC) | 2026-08-18T03:31:16Z |
| local date (§6A step 1) | 2026-08-18 (`date +%Y-%m-%d`) |
| runbook read | `RUNBOOK.md` H1 **v2.27**, in full |
| floor asserted (§6A step 2a) | **v2.19**. 2.27 ≥ 2.19, so the run proceeded. |
| floor named in the task prompt | **none**. The prompt states no version and defers to §6A. No drift to report. |
| spec read | `sources/onthecasemusic.md`, in full |
| CTO-INBOX read | yes. Fingerprints checked before any append. |
| heartbeat | `data/state/heartbeat/onthecasemusic-2026-08-18T03-31-16Z.json` |
| claim (§6A step 2b, §6G) | `data/state/claims/onthecasemusic.json` was `heldBy: null`. Acquired. TTL 90 minutes. No takeover. |
| caps | 50 creates. Used 9. |

## 1. Counts

| measure | count |
|---|---|
| events created | 8 |
| events edited | 3 |
| venues created | 1 |
| artists created | 0 |
| artists enriched | 0 |
| events deleted | 0 |
| rows skipped | 6 (see §7) |
| gate bounces (409/422/500) | 0 |

## 2. Capture (§6A step 4)

`curl` of `https://onthecasemusic.co.uk/gigs`, HTTP 200, 377,179 bytes.
Parsed by `data/raw/onthecasemusic/2026-08-18/parse.py`, md5 `4910da5ad72576c5a50959966ca4adc3` —
byte-identical to the parser used on 2026-08-08, 2026-08-12, 2026-08-14 and 2026-08-15.

```
rows 288   dates 114   2026-08-17 -> 2027-12-26
gigIds unique 288
no bandId 30
```

Raw artefacts: `data/raw/onthecasemusic/2026-08-18/{gigs.html,parse.py,diff.py,capture-normalised.txt,records.json,snapshot-new.txt}`.

**Chrome was not used for the capture.** The spec says `/gigs` is client-rendered and Chrome is mandatory.
That is not borne out: a server-rendered `curl` reproduced the whole feed. Already on file as
`otcm-chrome-not-mandatory`. The spec was NOT edited by this run.

## 3. Mode (§0.29)

The spec declares no mode. §0.29 names onthecase as qualifying for `delta` on evidence, and this run
reproduced the 0/0 self-diff. **The question did not become load-bearing: every vanished row was
past-dated, and the one live gig id that moved is present elsewhere in the capture. No deletion
decision arose.** Already on file as `otcm-mode-not-declared`. Not raised twice.

## 4. Diff (§6A step 5, §5.7)

Diffed on `(date, gigId)` first, then on the row text, per the spec's DIFF SAFETY item 2.

| result | count |
|---|---|
| added | 14 |
| removed | 23 |
| changed | 3 |

Snapshot rows 297 → capture rows 288. This is ordinary movement across a three-day gap, not the
"hundreds of rows" capture-bug signature the spec's DIFF SAFETY item 1 warns about.

### §5.7(a) self-diff gate

The new snapshot re-diffed against the capture it was written from:

```
OLD rows 288 NEW rows 288
ADDED 0 REMOVED 0 CHANGED 0
```

**0 added / 0 removed. The gate passes.** Deletion was therefore permitted. Nothing was deleted.

Normalisation applied to both sides, and recorded in the snapshot header: HTML entity decode,
curly-to-straight quotes, tag strip and whitespace collapse, and removal of empty `/`-separated
address segments.

## 5. The removed rows — NO ACTION

23 rows removed. **22 of them are past-dated** — 9 on 2026-08-14, 11 on 2026-08-15, 2 on 2026-08-16.
Today is 2026-08-18. §5.7 states that a row that drops off because its date passed is not a
cancellation. No deletion, no tombstone, no inbox item for any of them.

The 23rd removal is `2026-09-05 | 126512 | Dakota at Runhead Bar & Grill Ryton`. The diff reports it
as `REMOVED-ID-ELSEWHERE`: **gig id 126512 is still in the capture, on 2026-09-12, billed to Brit
Pack.** It is a re-bill, not a drop, and is handled as an EDIT in §6.

## 6. The changed and re-billed rows — EDITED, never re-created

The source retained three live gig ids and changed what they say. This is the fault the gig id sits in
the snapshot to catch. §0.17: "time/detail changes on a source = EDIT the existing event (found via
externalId), never create a sibling." No sibling event was created in any of the three cases.

### 6.1 Gig 126512 — re-billed AND moved

| field | before | after |
|---|---|---|
| gig id | `126512` | `126512` (unchanged) |
| date | 2026-09-05 | **2026-09-12** |
| venue | Runhead Bar & Grill Ryton | unchanged |
| time | 8:00 PM | unchanged |
| act | Dakota | **Brit Pack** |

**Action: EDIT `fdc46148-6f35-4546-b4de-282ed8a7f421`** — `artistId`, `date`, `startTime`, `title`,
`externalIds`. Artist resolved by the source's own band id 8536 → **The Brit Pack**
`4c113f21-28f7-437e-8153-e1f64bd68b90`.

**Reasoning, stated because the spec's rule covers "same gig id, same date" and this row also moved
date.** The alternative reading is that Dakota's 09-05 booking was dropped and a separate Brit Pack
09-12 booking was added under a recycled id. The evidence is against it: every genuinely new row in
today's capture carries a `1314xx`–`1315xx` id, while `126512` is a spring-vintage id the source has
carried for months. A new booking gets a new id. The source edited booking 126512. Treating it as a
drop-plus-add would have orphaned the Dakota record and created a duplicate.

The externalId moved from `2026-09-05-dakota-runhead-bar-grill-ryton` to
`2026-09-12-the-brit-pack-runhead-bar-grill-ryton`, because the §6D form derives from date and act.
`replaceExternalIds: true`, so the source holds exactly one id (§6B — `edit_event` dedupes to one id
per source). Read back: `The Brit Pack @ The Runhead`, 2026-09-12, 20:00, one externalId,
`isPublic: true`, `updatedAt` 2026-08-18T03:38:01.363Z.

### 6.2 Gig 131323 — re-billed, same date

| field | before | after |
|---|---|---|
| gig id | `131323` | `131323` (unchanged) |
| date | 2026-08-30 | unchanged |
| venue | Bebside Inn Blyth | unchanged |
| act | The Panthers | **Rock n Roll Preachers** |

**Action: EDIT `9a0159ad-839c-4114-91c6-2777420bf311`** — `artistId`, `title`, `externalIds`.

"Rock n Roll Preachers" is a known billing alias in the spec's alias table → **Rock and Roll
Preachers** `1382449f-bb3c-443c-8458-0bc00531ad0c` (§1A.5: a known mapping is an automatic match, no
review, no create). Confirmed by `search_artist` at 100%, location North East.

⚠ **The event carried a second externalId from a different source** (`onthecase-daily-import`,
`2026-08-30_the-panthers_bebside-inn-blyth`). §6B: `edit_event(externalIds)` REPLACES the array, so
the complete intended array was written in ONE call, carrying both ids. The other source's provenance
survives. Read back: both ids present, `isPublic: true`.

The Panthers keep their separate 2026-08-29 event at the same venue (`c42dadca-…`), which the source
still lists. It was not touched.

### 6.3 Gig 130185 — explicit cancellation, HIDDEN not deleted

| field | before | after |
|---|---|---|
| gig id | `130185` | `130185` (unchanged) |
| date | 2026-08-22 | unchanged |
| venue | New Hartley SMC | unchanged |
| act | Tubesnake | **"Cancelled"** |

The row is still published and the act line now reads `Cancelled`. §5.4 row 1: this is an **explicit
cancellation, not a source drop**. Punters who already saw the gig need to learn it is off, so the
event is hidden, not deleted.

**Action: EDIT `ce2f77e3-eca6-4f53-9a4d-5d2f19eafe7b`** — `isPublic: false`, `ticketInformation:
"Cancelled."`. No "Cancelled" artist was created (§0.4). Read back: `isPublic` absent, so false.

⚠ **A correction I made mid-run, recorded here rather than left silent.** The first
`ticketInformation` write read *"Cancelled — the source listing for 2026-08-22 reads 'Cancelled'."*
That is import commentary in a public field and §0.12 forbids it. It was overwritten with the plain
`Cancelled.` in the same minute, before any read of the record by anything else. No other public field
carries commentary.

**Tombstone appended** to `data/state/cancellations.jsonl` (§5.4, v2.19), `action: "hidden"`, with the
source evidence. The file now holds 3 lines.

### 6.4 Gig 130196 — cancellation with no bndy record

`2026-08-29 | 130196 | New Hartley SMC` changed from `to be confirmed` to `Cancelled`. **No bndy event
exists** — `search_event` at that venue for 2026-08-18 → 2026-09-30 returns five events and none on
2026-08-29. Correct: "to be confirmed" is on the spec's skip list and was never imported. No action,
no tombstone.

## 7. Rows skipped (§0A rule 1 — a run decides, then says so in one line)

| gig id | date | row | reason |
|---|---|---|---|
| `131465` | 2026-08-17 | Buskers night at Red Lion Earsdon | Past-dated (§0.14) **and** a spec skip-list placeholder |
| `131466` | 2026-08-24 | Buskers night at Red Lion Earsdon | Spec skip list / §0.4 placeholder, not an act |
| `131467` | 2026-08-31 | Buskers night at Red Lion Earsdon | Spec skip list / §0.4 placeholder, not an act |
| `131470` | 2027-11-21 | Black Cadillac at Crown and Cannon | Beyond the 12-month horizon (§6E). Stays in the snapshot, enters via a later diff. |
| `130196` | 2026-08-29 | Cancelled at New Hartley SMC | Placeholder row, no bndy record (see §6.4) |
| **`131476`** | **2026-09-05** | **Eli at Crown and Cannon Winlaton** | **New artist. Chrome unreachable — see §8.** |

### The one skip that cost a gig: Eli

`Eli`, source band id `1111`, has no bndy record. `get_by_external_id(artist, onthecasemusic, 1111)`
returns not-found, and `search_artist("Eli", minConfidence 25)` returns three unrelated acts, top
match 30% (`The Relics`, Exeter). This is a genuine new artist.

**§2A.1 item 5 has no exception: no artist record is created as a name-only stub, and if Chrome is
unavailable the row is not created bare.** Chrome was unreachable this run (§8), so the §2A.1
identity check on the name could not be performed. Under §0A rule 1(b) the row is **skipped and stated
here**; the next run retries it. The venue (`Crown and Cannon` `ed1384a2-…`) already exists and the
gig is 18 days out, so nothing is lost by waiting.

## 8. Tooling (§6A step 3)

**bndy MCP: reachable.** All reads and all 12 writes succeeded. Zero 409, zero 422, zero 500.

⛔ **Claude in Chrome: NOT connected.** `tabs_context_mcp` returned "not connected" on two consecutive
attempts — the two-attempt limit in §6B, not a transient. This blocks new-artist creates only (§2A.1
item 5). Event creates against existing artists, the venue create and all three edits are unaffected
and went ahead.

This is the same outage the enrichment, spider and KLMA tasks have reported through the night. It is
already on file five times over, most recently as `bv2a-chrome-unreachable-five-consecutive-firings`
(2026-08-18) and `klma-chrome-unreachable-blocks-artists` (2026-08-18). **Not raised again** — §5 of
the inbox rules forbids a duplicate fingerprint. This run's contribution to the picture is one skipped
artist and one skipped gig, recorded in §7.

## 9. Events created (§6A step 6, §0.10 verified)

All eight read back with `get_by_id`. All: `isPublic: true`, `ticketed: false`, source price FREE,
title `«Artist» @ «Venue»`.

| event id | act | date | time | gig id | venue | externalId |
|---|---|---|---|---|---|---|
| `b0399e97-0d56-4aad-bf52-43cc24ccef63` | Stax Bros. | 2026-08-21 | 19:00 | 131472 | Billy Bootleggers | `2026-08-21-stax-bros-billy-bootleggers` |
| `552cf15e-ba9e-4df6-9f7e-be03e447dbc5` | Fizzyfish | 2026-08-22 | 21:00 | 131464 | Live Lounge | `2026-08-22-fizzyfish-live-lounge` |
| `a333720a-e491-4829-aab1-0f0f585f883d` | Reviver | 2026-08-22 | 20:00 | 131471 | The Black Bull | `2026-08-22-reviver-black-bull-blaydon` |
| `bb6c5f11-44b3-4fe8-afea-4375bee78531` | The Bandits | 2026-08-22 | 19:00 | 131473 | Billy Bootleggers | `2026-08-22-the-bandits-billy-bootleggers` |
| `b6e988ec-5706-4a19-a3a3-c9d68e36ed6f` | Rebel Radio | 2026-08-22 | 21:00 | 131474 | The Old Fox | `2026-08-22-rebel-radio-old-fox-felling` |
| `948283b0-1e91-437a-bc75-8b9277c769fb` | GodZZ of Wor | 2026-09-25 | 20:00 | 131463 | Ivy House | `2026-09-25-godzz-of-wor-ivy-house` |
| `ccb6cc91-51a8-4faa-8f2a-213a951acc47` | Black Cadillac | 2027-02-28 | 18:00 | 131468 | Crown and Cannon | `2027-02-28-black-cadillac-crown-and-cannon` |
| `761213f9-e355-4b53-9976-9dceefc8cdb4` | Black Cadillac | 2027-07-25 | 18:00 | 131469 | Crown and Cannon | `2027-07-25-black-cadillac-crown-and-cannon` |

**Times are source times, not defaults.** Every row published one (7:00 PM, 8:00 PM, 9:00 PM, 6:00 PM).
§0.28: `startTime` is stage time and the source published one, so it is used verbatim.
`startTimeDefaulted: false` on all eight. **No §5.6 default was applied this run.**

No row published a doors time, a price other than FREE, or a time window, so §0.28 items 2–4 and the
window rule did not engage.

## 10. Venue created (§3, §0.10 verified)

**`8c01731e-9a75-47d5-958a-fc06161cd8f6` — The Black Bull, Bridge St, Blaydon, Blaydon-on-Tyne NE21 4JJ.**
google_place_id `ChIJJQZncuZ3fkgRn-rhtVLHzls`. externalId `{onthecasemusic, black-bull-blaydon}`.

**§3.1's three fallback probes were run before the create**, per v2.16:

| probe | result |
|---|---|
| `get_by_external_id(venue, onthecasemusic, black-bull-blaydon)` | not found |
| `search_venue("Black Bull", "Blaydon")` | no venues found, 5 scanned |
| `search_venue("Black Bull", "Gateshead")` | no venues found, 5 scanned |
| `list_venues(city: "Blaydon")` | 0 rows |

Only then was it created. **§0.24 postcode check: NE21 is Blaydon, Tyne and Wear** — it agrees with
the expected North East county and with the source's address line "Bridge Street / Blaydon". The
Google result is a pub, not a same-named business elsewhere. Read back with `get_by_id`.

⚠ The record carries `postcode: ""` while the postcode sits inside `address`. That is the known
`venue-postcode-field-blank` defect (BLD-66), already on file. Not raised again.

## 11. Venues reused, not created

Five venues resolved to existing records. None was created twice.

| source row | bndy venue | how resolved |
|---|---|---|
| Billy Bootleggers, Byker Newcastle | `60be0eaa-935c-438d-bcbf-2e7518bbab9c` | `search_venue` 100%; holds externalId `billy-bootleggers-byker-newcastle` |
| Live Lounge Sunderland | `e368931e-fbd0-4033-ae7c-0be68e01ad0c` | externalId `live-lounge-sunderland` |
| Old Fox Felling Gateshead | `5229697a-4b35-41eb-8120-f1cd6a32bf5f` | see below |
| Crown and Cannon Winlaton | `ed1384a2-4c95-4072-8b22-1f9b25da0e0a` | externalId `crown-and-cannon-winlaton` |
| Ivy House Sunderland | `705142b8-bdc6-41ae-b022-5b0fa3b5e7b7` | externalId `ivy-house-sunderland` |
| Runhead Bar & Grill Ryton (edit) | `63da82cc-c512-4e8c-8fb2-f8180720b2ec` | `search_venue` 64% low_confidence, opened and confirmed |
| Bebside Inn Blyth (edit) | `b23c91b9-b467-4df3-b6e8-73b5621d8d8e` | `search_venue` 100% |
| New Hartley SMC (edit) | `2a48a6a4-41f0-44a8-865e-610d52889b6b` | spec learned mapping → New Hartley Memorial Hall |

⚠ **v2.16 fired twice today and both times a low-confidence hit was the record.** `The Old Fox`
returned at **64% `low_confidence`** and `The Runhead` at **64%** — both below the 50%-and-up
"create new" instinct the confidence number invites. Both were opened before any create decision, and
both matched the source address exactly (Carlisle St, Felling / Holburn La, Ryton) and already carried
an `onthecasemusic` externalId under a *different* slug than the source's current one
(`manual-the-old-fox-felling` vs `old-fox-felling-gateshead`;
`runhead-bar-grill-ryton` vs `runhead-bar-and-grill-ryton`). Creating on the miss would have produced
two duplicate venues. The externalId slugs were left as they are — a run does not rewrite another
run's provenance.

## 12. Identity work (§1A, §2)

**Zero artists created.** Eight of the nine acts already existed. Seven were resolved by the source's
own band id — the strongest mechanical key available for this source — and confirmed by the stored
`onthecasemusic` externalId, not by name matching.

| act | bndy id | source band id | how confirmed |
|---|---|---|---|
| Stax Bros. | `3435d908-634b-48d7-98b3-1e779f6e6542` | 467 | externalId matches |
| Fizzyfish | `92a9b771-cdea-4944-bccc-eecd7e401a66` | 7485 | externalId matches |
| Reviver | `bb436395-34cf-44a2-b84b-77d0c61d7268` | 1189 | externalId matches |
| Rebel Radio | `cdedd99b-befe-47f7-9ab9-a0db6ac7e349` | 28949 | externalId matches |
| GodZZ of Wor | `a51444bb-bd21-4ba0-b5e0-154c2bc64b95` | 26741 | externalId matches |
| Black Cadillac | `7d5c6017-94d2-420c-a312-b5e6d651b349` | 28916 | externalId matches |
| The Brit Pack | `4c113f21-28f7-437e-8153-e1f64bd68b90` | 8536 | externalId matches |
| The Bandits | `96c912d4-a355-4a6f-ab94-625b709bb1a8` | none published | §1A, see below |
| Rock and Roll Preachers | `1382449f-bb3c-443c-8458-0bc00531ad0c` | none published | spec alias table (§1A.5) |
| **Eli** | **none** | **1111** | **not created — §7** |

**The Bandits (gig 131473) — the one name-based resolution, so it is set out in full.** The source
published no band id for this row (30 of 288 rows carry none). `search_artist("The Bandits")` returned
**`96c912d4-a355-4a6f-ab94-625b709bb1a8` at 100%, location Newcastle upon Tyne**, next candidate 56%
and unrelated (`The Band Vehicle`, Manchester). The gig is at Billy Bootleggers, Byker, Newcastle.
§1A: same normalised name, same canonical region = SAME act, always. Reused. No §1A.2 footprint check
was needed because no create decision arose.

No name required sanitisation under §0.6. No row was a lineup (§0.3). Three rows were placeholders
(§0.4) and were skipped, not created: `Buskers night` ×3, plus `Cancelled` ×2 and
`to be confirmed` ×1 handled in §6.

**Quality statement (§6 report rule).**

- Records created with a verified page: **0** — no artist was created.
- Records created with an evidenced blank: **0** — no artist was created.
- Records skipped rather than created bare: **1** (Eli, Chrome unreachable, §7).
- Names sanitised or skipped as non-acts: **6 skips** — `Buskers night` ×3, `Cancelled` ×2,
  `to be confirmed` ×1. No name needed stripping.
- Existing artists topped up: **0.** Six of the eight reused artists hold an empty `bio` and
  `Rebel Radio` holds no genres. That is enrichment-queue work under §2A.2, it needs Chrome and a
  Facebook session, and Chrome was down (§8). **Nothing was written to a public field on trust.**

## 13. Tombstone check (§5.4, v2.19)

`data/state/cancellations.jsonl` was read and searched on artist + venue + date **before any create**.
Two lines were in the file (the header and PULS @ Arden Arms 2026-08-08). **No match** against any of
the nine rows this run considered. No `TOMBSTONED-` row.

One line was appended by this run, for the §6.3 cancellation.

## 14. Horizon (§6E)

12 months, to **2027-08-18**. Eight added rows fall inside it (2026-08-21 → 2027-07-25). One does not
(`131470`, 2027-11-21) and stays in the snapshot. The capture reaches 2027-12-26.

## 15. Validator (§6A step 8)

```
python3 scripts/enrichment_validate.py \
  --records data/normalized/onthecasemusic/2026-08-18/records.json \
  --evidence data/state/enrichment-evidence-2026-08-18-onthecasemusic.jsonl --mode gate

0 records · 0 clean · 0 FAIL · 0 WARN   [mode=gate]
```

Exit code 0. **Validator 0 FAIL.** The run created and enriched no artists, so the record set is empty
and the evidence file has no lines. `records.json` in this directory is the empty validator input.

## 16. Snapshot (§6A step 7)

Written to `data/state/onthecasemusic-last-page.txt`. 288 rows, 114 dates, 2026-08-17 → 2027-12-26.
The header carries the normalisation rules, the capture method, the parser md5 and the 0/0 gate result,
so the next run reproduces them exactly. **The fail-closed gate is satisfied: this run wrote to bndy
and it wrote its snapshot.**

## 17. CTO-INBOX

**Nothing appended.** Every observation this run could raise is already on file with a fingerprint:

| observation | existing fingerprint |
|---|---|
| Chrome unreachable, blocking new-artist creates | `bv2a-chrome-unreachable-five-consecutive-firings`, `klma-chrome-unreachable-blocks-artists`, `spider-chrome-unreachable-blocks-new-artists` |
| The spec declares no §0.29 mode | `otcm-mode-not-declared` |
| The spec says Chrome is mandatory for `/gigs`; curl reproduces the feed | `otcm-chrome-not-mandatory` |
| Mixed externalId forms are live on this source | `otcm-externalid-form-mixed` |
| A new venue's `postcode` field is blank while `address` holds it | `venue-postcode-field-blank` |
| `record_run` fails on a missing token | `record-run-token-missing` |

## 18. Open items

**None.** No row was staged. No decision was blocked. Nothing was escalated. One row (Eli, gig 131476)
is skipped for the next run to retry, which is the §0A rule 1(b) disposal and not an escalation.

`record_run` was not called. `SOURCE_RUNS_TOKEN` is absent and the task prompt states this is not
blocking. `data/state/run-summary.jsonl` is the dashboard input and was appended.
