# gigs-news — scheduled run 2026-09-02

- **Run id**: `gigs-news-2026-09-02T04-06-56Z`
- **Runbook read**: `RUNBOOK.md` H1 **v2.27**, in full. Floor in §6A is **v2.19**. Assertion PASSES.
- **Prompt floor**: the task prompt states no number. §6A step 2a is the gate.
- **Spec read**: `sources/gigs-news-uk.md`, in full.
- **Inbox read**: `CTO-INBOX.md`. Every fingerprint in the file was listed before any item was considered.
- **Claim**: `data/state/claims/gigs-news.json`. `heldBy` was null, released by `gigs-news-2026-09-01T19-38-28Z`. Acquired 04:07:30Z, TTL 90 minutes. **No takeover.**
- **Heartbeat**: `data/state/heartbeat/gigs-news-2026-09-02T04-06-56Z.json`. Written first, rewritten last.
- **Outcome**: **COMPLETED — an honest no-change run.** The curator has not rolled either page since 2026-09-01. Both captures are byte-identical to yesterday's. Nothing was added at source, so nothing was written to bndy.
- **Gap since the last run**: 8 hours 28 minutes.

## 1. Counts

| Measure | Count |
|---|---|
| Events created | 0 |
| Events edited | 0 |
| Events hidden or deleted | 0 |
| Artists created | 0 |
| Artists enriched | 0 |
| Venues created | 0 |
| Records created with a verified page | 0 |
| Records created with an evidenced blank | 0 |
| Records staged | 0 |
| Names sanitised under §0.6 | 0 |
| Gate bounces (409/422) | 0 |
| Creates against the 50 cap | 0 of 50 |
| Validator | 0 records · 0 clean · 0 FAIL · 0 WARN, exit 0 |

**Quality statement (§6).** This run created nothing, so it created no stub. A no-change run is a real result and is reported as one (§6A step 7b). The correct measure here is not throughput: it is that the source was proven unchanged by a reproducible method, and that the previous run's writes were re-verified live.

## 2. Capture

Both pages were fetched with container `curl` and parsed with BeautifulSoup + lxml, reading `a[href]` on every row per §0.22. That route is evidenced in the inbox as `gigs-news-curl-reproduces-week-view` (2026-08-18) and is the route the last three runs used.

| URL | Method | Result |
|---|---|---|
| `https://www.gigs-news.uk/` | container curl, BeautifulSoup + lxml, leaf block nodes, `a[href]` | HTTP 200, 114,384 bytes |
| `https://www.gigs-news.uk/branded.htm` | same | HTTP 200, 264,098 bytes |

**The curator has NOT rolled either page.** Both md5 values are unchanged against 2026-09-01.

| file | md5 (2026-09-02) | md5 (2026-09-01) |
|---|---|---|
| `week-view-raw.html` | `71fd000454e5d0701b176e32844e5267` | `71fd000454e5d0701b176e32844e5267` |
| `branded-raw.html` | `dd2042b795135279b6300b08a4ebdd07` | `dd2042b795135279b6300b08a4ebdd07` |

Raw capture: `data/raw/gigs-news-uk/2026-09-02/week-view-raw.html`, `branded-raw.html`. Parser: `parse.py` in the same directory, copied unchanged from 2026-09-01 so the normalisation is reproducible.

The header still reads `What's on This Week 2 - 6 September`. Today is **Wednesday 2026-09-02**, established with `date +%Y-%m-%d` (§6A step 1). The `Wednesday 2nd September` block is today, not the past. All five day blocks are still importable under the +14-day week-view horizon.

`javascript_tool` was not used, so its three §6B output guards did not arise. Claude in Chrome was not needed: no artist was created, so no §2A enrichment was due.

## 3. Horizon and the branded.htm forward list

The forward list is the lowercase header `gigs 2026` plus the **20 dated rows** that follow it contiguously. The list ends at the first row that does not contain a month name and ` - ` — today that row is set-list prose, `the Acoustic Lounge Poynton`.

This is the looser end-of-list rule the 2026-09-01 run wrote into the snapshot header, and it is the rule this run used. All three safeguards held: ordinal position, lowercase `gigs 2026` against capitalised `Gigs <year>`, and the day-name-against-date cross-check.

All 20 rows run 5 September to 31 December, inside the 12-month horizon, and all 20 were confirmed in bndy by the 2026-09-01 run with a `gigs-news` externalId in the §6D slug form. The list is unchanged, so section 2 needed no create.

## 4. Diff (§5.7)

**Mode: the spec declares neither `delta` nor `append-only`.** Already open as `gigs-news-mode-undeclared` (2026-08-12), not raised again. The question is moot this run: nothing was removed on either side.

- **Section 1 (week view)**: 98 lines against 98. **0 added, 0 removed.**
- **Section 2 (branded forward list)**: 21 lines against 21. **0 added, 0 removed.**
- **§5.7(a) self-diff gate**: the regenerated body re-diffed against the stored snapshot returns **0 added / 0 removed**, 119 lines against 119, ordered identical. **PASS.** Artefact: `data/raw/gigs-news-uk/2026-09-02/selfdiff-snapshot.txt`.

Normalisation applied to both sides, identically, per §5.7(a): whitespace runs collapsed to one space; every line trimmed; trailing comma, full stop or slash stripped; HTML entities decoded once; `<br>` converted to a line break before text extraction; empty lines removed. The rules are written into the snapshot header for the next run.

**No §0.17 decision arose.** No future-dated row disappeared from either section, so no deletion and no tombstone was due.

## 5. Read-back of the previous run's writes (§0.10)

The source gave this run no new work, so the budget was spent proving the last run's writes are live rather than trusting its report.

| Record | Read method | Result |
|---|---|---|
| `8f686331-3c07-4b1d-bfdc-5e970c2338f6` — Tony Auton Band Jam @ The Coach and Horses, 2026-09-03 | `get_by_external_id(gigs-news, 2026-09-03-tony-auton-coach-horses-oldham)` | Found. `isPublic: true`, 20:00, artist `rT16iLy3u64bhZadG7SR`, venue `1efc325d-207c-4883-a18d-ff38a928df84`. The externalId resolves, which proves both storage and lookup. |
| `c853a31b-1785-4313-b3eb-7b64f7fd1feb` — Sod's Law @ Cheshire Cheese, 2026-09-05 | `get_by_external_id(gigs-news, 2026-09-05-sods-law-cheshire-cheese-newton)` | Found. **Both** ids survive on the record: `gigs-news-daily-import:2026-09-05_sods-law_cheshire-cheese-newton` and `gigs-news:2026-09-05-sods-law-cheshire-cheese-newton`. This confirms the §6B dedupe behaviour — one id per source, ids from different sources coexist. |
| `d8546c64-bdd4-4cfd-9cce-e34a9be24fe0` — branded (Reserved) @ Cheshire Cheese, 2026-09-20 | `get_by_id` | Found. `isPublic` is absent from the returned record, which is the hidden state. The explicit cancellation from 2026-09-01 holds. `updatedAt` 2026-09-01T19:47:59Z. |

`branded.htm` still publishes the 2026-09-20 Cheshire Cheese row without the cancellation marker, exactly as the last run predicted. The tombstone in `data/state/cancellations.jsonl` is what stops a future run re-offering it. Nothing re-created it today.

## 6. Pipeline

No row changed, so no row was re-pipelined. The 22 importable acts, the 45 filter rejects and the three skips recorded in `data/normalized/gigs-news-uk/2026-09-01/RUN-REPORT.md` §6 stand unchanged and are not restated here.

Three rows remain unresolved, all of them already carried in `CTO-INBOX.md`. None is new and none was retried, because the evidence that blocked each one has not changed since yesterday morning:

| Source row | Why still open | Fingerprint |
|---|---|---|
| `9th Sept Off the Record - Stockport Rock & Roll Society` | The source publishes a Facebook group URL and no address. §0.8 forbids a venue without a Google Place ID and forbids guessing a town to get one. | `gigs-news-rock-n-roll-society-no-address` |
| `Reserved - Queens Hotel Macclesfield` | The same publisher states Friday 4 September in the week view and Saturday 5 September on his own band page. A run does not resolve a date conflict where the publisher contradicts himself. | `gigs-news-queens-hotel-4th-vs-5th-sept` |
| `SunFest from 2pm - Rising Sun Hazel Grove` | A festival badge at a fixed pub, but the page names no act. §0.27 imports the discrete gig only when an artist resolves. | none — reject filter, not an escalation |

## 7. Items raised to CTO-INBOX.md

**None.** Nothing occurred today that an existing fingerprint does not already cover, and §6A's inbox rules forbid appending a duplicate or an empty item.

**Items deliberately NOT raised, because a fingerprint already exists:** `gigs-news-mode-undeclared`, `gigs-news-daily-import-second-namespace`, `gigs-news-rock-n-roll-society-no-address`, `gigs-news-queens-hotel-4th-vs-5th-sept`, `record-run-token-missing`.

**A note on the source, deliberately not raised as an item.** The curator rolls this page roughly weekly. Two runs fired inside 9 hours and the second found nothing, which is the schedule's design, not a fault. The md5 check is the cheap way to prove it and it should stay the first thing this task does.

## 8. Caps and budget

- 50-create cap: **0 creates used.**
- Import horizon: week view held to today plus 14 days; the branded.htm forward list taken to the 12-month horizon.
- Claim TTL 90 minutes from 04:07:30Z. The run finished well inside it.

## 9. `record_run`

Not called. `record_run` fails on a missing `SOURCE_RUNS_TOKEN` on every scheduled run. Already open as `record-run-token-missing`. `data/state/run-summary.jsonl` is the dashboard's real input and this run appended to it.

## 10. Artefacts written

| Path | What |
|---|---|
| `data/state/heartbeat/gigs-news-2026-09-02T04-06-56Z.json` | Written first at 04:06:56Z, rewritten `completed` last. |
| `data/state/claims/gigs-news.json` | Acquired 04:07:30Z, released `heldBy: null` last. |
| `data/raw/gigs-news-uk/2026-09-02/week-view-raw.html` | Raw capture, 114,384 bytes. |
| `data/raw/gigs-news-uk/2026-09-02/branded-raw.html` | Raw capture, 264,098 bytes. |
| `data/raw/gigs-news-uk/2026-09-02/parse.py` | The parser, unchanged from 2026-09-01. |
| `data/raw/gigs-news-uk/2026-09-02/sec1.txt`, `sec2.txt` | The two normalised snapshot sections. |
| `data/raw/gigs-news-uk/2026-09-02/selfdiff-snapshot.txt` | §5.7(a) gate result, 0/0, plus the source-diff result. |
| `data/state/gigs-news-uk-last-page.txt` | Snapshot rewritten. Body unchanged at 119 lines; the header records today's capture and its md5 match. |
| `data/state/enrichment-evidence-2026-09-02-gigs-news-uk.jsonl` | Empty. No artist was created and no bio was written, so there is nothing to evidence. |
| `data/normalized/gigs-news-uk/2026-09-02/validator-records.json` | Empty record set fed to the validator. |
| `20-Daily/2026-09-02.md` | One line linking this report. |
| `CTO-INBOX.md` | Not written. Nothing new to raise. |
