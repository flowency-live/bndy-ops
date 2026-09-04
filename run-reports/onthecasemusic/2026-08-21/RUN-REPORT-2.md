# onthecasemusic — RUN REPORT 2026-08-21 (second firing)

Run id: `onthecasemusic-2026-08-21T03-31-04Z`
Heartbeat: `data\state\heartbeat\onthecasemusic-2026-08-21T03-31-04Z.json`
Outcome: **completed**

This is the SECOND firing of this task today. The first firing (`onthecasemusic-2026-08-21T00-42-30Z`)
wrote `RUN-REPORT.md` in this directory. §6A step 7 fixes one report path per date, so this run wrote
a suffixed file rather than overwrite the first. That collision is already on file as
`run-report-path-collides-on-second-firing`. It is not raised again.

## 1. Gates

| Gate | Result |
|---|---|
| §6A step 0 heartbeat | Written before any gate. Rewritten `completed` at the end. |
| §6A step 1 date | `2026-08-21` from the sandbox shell. |
| §6A step 2 runbook | `RUNBOOK.md` H1 reads **v2.27**. Read in full. |
| §6A step 2a floor | CURRENT FLOOR **v2.19**. Runbook **v2.27**. **PASS.** The task prompt states no number of its own, so there is no drift to report. |
| §6A step 2b claim | `data\state\claims\onthecasemusic.json` read `heldBy: null`, released by the 00:42Z run. Acquired at 03:31:04Z, TTL 90 min (§6G, this task), `expiresAt` 05:01:04Z, `heartbeatFile` named. **No takeover.** |
| §6A step 3 tools | bndy MCP reachable and exercised (reads and two verified writes). Chrome was not needed: no artist was created this run. |
| Spec | `sources\onthecasemusic.md` read in full. |
| CTO-INBOX | Read in full. One new fingerprint appended. |

## 2. Capture

Curl plus the regex parser, the method fixed on 2026-08-08 and unchanged since.

- URL `https://onthecasemusic.co.uk/gigs`, HTTP 200, **381,100 bytes**.
- Parser `data/raw/onthecasemusic/2026-08-21/run2/parse.py`, md5 `4910da5ad72576c5a50959966ca4adc3` — byte-identical to every parser since 2026-08-08.
- **293 rows, 113 dates, 2026-08-20 → 2027-12-26.** 293 unique gig ids. 30 rows carry no band id.
- Gig ids read from `a[href]` (§0.22). No synthetic id was written.

⚠ The byte count is identical to the 00:42Z capture. The source did not publish anything in the
three hours between the two firings.

## 3. Diff (§5.7, §5.7(a))

Both sides normalised identically before comparison. The five rules are written into the snapshot header.

**Against the 2026-08-21 00:43Z snapshot: 0 added / 0 removed / 0 changed.**

**SELF-DIFF GATE: the new snapshot re-diffed against the capture it was written from returns
0 added / 0 removed / 0 changed.** The gate passes.

No row was removed, so no deletion decision arose and §0.29 mode did not become load-bearing.

**This is a genuine no-change run.** Nothing was pipelined at step 6.

## 4. Coverage probe — what the run did instead

A zero diff is not proof that bndy holds the source's gigs. The klma run of 2026-08-19 found nine
gigs absent from bndy behind a 0 added / 0 removed diff (`klma-zero-diff-hid-nine-missing-gigs`).
§0A says the measure of a run is records in bndy. So the budget went on a coverage probe.

**Method.** Nine venues, every source row between 2026-08-21 and 2026-09-06, checked with
`search_event(venueId, dateFrom)` and matched by act plus date. Venues were resolved by
`get_by_external_id(venue, onthecasemusic, <slug>)` first, and by `search_venue` where that missed.

| Venue | bndy id | Source rows in window | Present in bndy |
|---|---|---|---|
| Billy Bootleggers | `60be0eaa-935c-438d-bcbf-2e7518bbab9c` | 2 | 2 |
| Ivy House | `705142b8-bdc6-41ae-b022-5b0fa3b5e7b7` | 3 | 3 |
| Bridge Hotel Durham | `22f62ed9-a489-4d80-8cd3-9f3aa1677f24` | 3 | 3 |
| Crown and Cannon | `ed1384a2-4c95-4072-8b22-1f9b25da0e0a` | 8 | 8 |
| The Peacock | `a180d98b-3e97-461c-8e7b-04301eee110a` | 2 | 2 |
| The Frog and Ferret | `ed952b1e-e294-4894-a1b7-b5f1c19c60ca` | 2 | 2 |
| The Black Bull | `8c01731e-9a75-47d5-958a-fc06161cd8f6` | 1 | 1 |
| The Red Lion | `7dd36d63-114c-4a5a-8e27-69f8d2c97244` | 5 | 5 |
| The White Swan | `b9877a84-f92d-4894-9fd6-130e89f54f47` | 4 | 4 |

**30 of 30 source rows are in bndy. Zero coverage gaps found.** The probe did find two events with
no `onthecasemusic` provenance. Both were back-filled — see §5.

Two further venues were resolved but not swept, and are recorded so the next run does not re-derive them:

- `old-fox-felling-gateshead` does **not** answer to that slug. The venue is **The Old Fox**, `5229697a-4b35-41eb-8120-f1cd6a32bf5f`, carrying `onthecasemusic:manual-the-old-fox-felling`. `search_venue("Old Fox","Gateshead")` returned it at **64% low_confidence**. §3's rule held: the low-confidence hit was opened, not dismissed.
- `crook-hotel-crook` does **not** answer to that slug either. The venue is **The Crook Hotel**, `de040d70-21f8-4d99-8c73-9037029960f0`, carrying **`onthecasemusic:940`** — the source's numeric VENUE id, a fourth externalId form on this source. `search_venue` returned it at 73% medium_confidence. Same class as `otcm-externalid-form-mixed`, which covers events; this is the venue counterpart. Not raised separately.

## 5. Writes made

Two events, both provenance back-fills. No create. No delete. No hide.

| Event | What was wrong | Written | Read back |
|---|---|---|---|
| `1ceadd1e-f519-4d14-add3-cf3bcf496e80` — Klassix @ The Peacock, 2026-08-28, 21:00 | Held only `lemonrock:969257-2026-08-28`. The source lists this gig as **131372**, so the row is ours too and `get_by_external_id(onthecasemusic, …)` missed it. | `[{lemonrock, 969257-2026-08-28}, {onthecasemusic, 2026-08-28-klassix-the-peacock}]` | ✅ both ids present, `updatedAt` 2026-08-21T03:34:53Z |
| `f09ad304-151d-4715-8141-d0b84a9846b2` — The Zone @ The Red Lion, 2027-12-04, 20:00 | Held only `onthecase-daily-import:2027-12-04_the-zone_red-lion-earsdon-whitley-bay`, a namespace that is not in §6D. The source lists this gig as **131313**. | `[{onthecase-daily-import, 2027-12-04_…}, {onthecasemusic, 2027-12-04-the-zone-the-red-lion}]` | ✅ both ids present, `updatedAt` 2026-08-21T03:35:42Z |

**Method note (§6B).** `edit_event(externalIds)` REPLACES the array. Both calls did `get_by_id` first
and wrote the complete intended array in one call, keeping the other source's id. Ids from different
sources on one event are legitimate and both survived.

**Why the second record was back-filled although 2027-12-04 is beyond the 12-month horizon.** The
horizon governs what a run may IMPORT. This record already existed. Adding this source's id is not an
import; it stops a later run treating the row as new when it comes inside horizon.

## 6. The `onthecase-daily-import` namespace — measured, then raised

`onthecase-daily-import` appears on live venue and event records for this source. It is **not** in
the §6D slug table. Measured this run:

- **Venues:** Billy Bootleggers, Bridge Hotel Durham, The Blacksmiths Arms, The White Swan, Bebside Inn, The Old Fox and The Crook Hotel all carry one, alongside the registered `onthecasemusic` id.
- **Events:** at Bridge Hotel Durham six events carry both namespaces; at The Red Lion two do.
- **At least one event carries ONLY the unregistered namespace** — `f09ad304`, before this run's write.

**It is not a live second writer.** `f09ad304` reads `createdAt 2026-07-01T03:06:04Z`,
`updatedAt 2026-07-03T10:45:37Z`. This is a **legacy** namespace from early July, not the live
parallel writer that `sceniceye-daily-import-second-namespace` reports. The two findings are the
same shape and a different fact, so this one is raised on its own fingerprint.

**Why it matters:** a record holding only the unregistered id is invisible to
`get_by_external_id(event, onthecasemusic, …)`, which is what an idempotent import relies on.

## 7. Quality measures (§6)

| Measure | Count |
|---|---|
| Artists created with a verified page | 0 |
| Artists created with an evidenced blank | 0 |
| Artists skipped / carried | 0 |
| Names sanitised or skipped as non-acts | 0. `Buskers night` and `Cancelled` rows stay on the standing skip list; none appeared as an added row. |
| Venues created | 0 |
| Events created | 0 |
| Events edited | 2 (provenance only) |
| 409 / 422 bounces | 0 |
| Times defaulted | 0 |
| Coverage gaps found | 0 of 30 rows checked |

**No enrichment was performed, so no enrichment evidence line was written.** §6A step 8's evidence
file is for records a run enriches. Two externalId back-fills touch no public field and quote no page.

## 8. Tombstone check (§5.4)

`data\state\cancellations.jsonl` was read. No event was created this run, so the check was not
load-bearing. No line was appended.

## 9. Validator (§6A step 8)

```
python3 scripts/enrichment_validate.py \
  --records data/normalized/onthecasemusic/2026-08-21/records-run2.json \
  --evidence data/state/enrichment-evidence-2026-08-21-onthecasemusic.jsonl
0 records · 0 clean · 0 FAIL · 0 WARN   [mode=gate]     EXIT=0
```

**0 FAIL.** The record set is empty because the run created and enriched nothing. Stated plainly
rather than presented as a clean batch: an empty validator run proves the gate ran, not that work
was validated.

## 10. CTO-INBOX

One item appended. The fingerprint was searched first and does not exist.

- `otcm-daily-import-legacy-namespace` (DEFECT) — see §6.

**Not raised (already on file):** `otcm-mode-not-declared`, `otcm-chrome-not-mandatory`,
`otcm-externalid-form-mixed`, `otcm-rebill-stale-events-six-live`, `otcm-rebill-orphans-other-source`,
`otcm-duplicate-artist-riff-raff-billing-name`, `otcm-unclaimed-writer-wrote-this-source-rows`,
`otcm-gigid-strands-on-venue-move`, `peacock-newcastle-wrong-geocode`,
`skipped-row-swallowed-by-snapshot`, `otcm-daily-note-append-not-made`,
`run-report-path-collides-on-second-firing`, `record-run-token-missing`,
`search-event-daterange-ignored`, `create-event-writes-endtime-midnight`.

⚠ Two of those were **re-confirmed by measurement this run** and are worth the note:
`search-event-daterange-ignored` — `search_event(venueId, dateFrom:2026-08-21, dateTo:2026-08-29)`
returned events out to 2026-12-04, so the run filtered client-side.
`create-event-writes-endtime-midnight` — every event read this run holds `endTime 00:00`.

## 11. State written

| File | Written |
|---|---|
| `data\state\onthecasemusic-last-page.txt` | 458 lines: 52 header + 406 rows. Rows byte-identical to the 00:43Z copy. Header carries the normalisation rules, the 0/0 self-diff and the coverage probe result. |
| `data\state\run-summary.jsonl` | 1 line appended |
| `data\state\cancellations.jsonl` | read, not written |
| `data\state\claims\onthecasemusic.json` | released, `heldBy: null` |
| `data\state\heartbeat\onthecasemusic-2026-08-21T03-31-04Z.json` | rewritten `completed` |
| `20-Daily\2026-08-21.md` | 1 line appended |
| `CTO-INBOX.md` | 1 line appended |
| `data\raw\onthecasemusic\2026-08-21\run2\` | `gigs.html`, `parse.py`, `capture-normalised.txt`, `records.json` |

`record_run` was not attempted. `record-run-token-missing` records the missing `SOURCE_RUNS_TOKEN`
and it is not blocking.
