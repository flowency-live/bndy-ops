# ScenicEye run report — 2026-08-28

- **Run id:** `sceniceye-2026-08-28T04-36-00Z`
- **Outcome:** completed. Stale source week, second consecutive run. No writes to bndy.
- **Runbook read:** `RUNBOOK.md` H1 **v2.27**. Floor in §6A is **v2.19**. The task prompt states no number. Pass.
- **Spec read:** `sources/sceniceye.md`, in full.
- **CTO-INBOX read:** fingerprints checked before this report was written.
- **Source mode (§0.29):** the spec declares no mode. The run used **append-only**. It deleted nothing.
  The defect is on file as `sceniceye-mode-not-declared` (2026-08-12). It is not raised again.

## 1. Gates

| Step | Result |
|---|---|
| §6A.0 heartbeat | Written: `data/state/heartbeat/sceniceye-2026-08-28T04-36-00Z.json` |
| §6A.1 date | 2026-08-28 (Friday), shell clock, 04:36:00Z |
| §6A.2a floor | v2.27 >= v2.19. Pass |
| §6A.2b claim | `data/state/claims/sceniceye.json` held `heldBy: null`, released by `sceniceye-2026-08-27T12-39-59Z`. Acquired. No takeover. TTL 90 minutes, `expiresAt` 06:06:00Z |
| §6A.3 tools | Chrome connected (1 browser, `7ad060c3-b3e0-41c9-9dd4-a8097db94bfa`). bndy MCP reachable — `search_venue("The Heroes","Waterlooville")` returned `eb51991a-b082-433c-90e4-123340283271` |
| §5.4 tombstones | `data/state/cancellations.jsonl` not consulted for a write, because no event was created |
| §6A.8 validator | Not run. No record was written, so the validator has no input. No evidence file was written |

## 2. Capture

- Surface: Chrome, `https://scenicmind.co.uk/sceniceye`.
- Method: DOM walk of `h2` day headings plus the following `table.notion-table`, per §0.22. `get_page_text` was not used.
- Hydration: read at 6 s, re-read at 18 s. The content was stable across both reads.
- Result: **7 day tables, 28 gig rows plus 1 empty-day row**.
- Raw capture: `data/raw/sceniceye/2026-08-28/capture.txt`.
- `javascript_tool` guards: output was returned in four pages. No guard was hit.

## 3. Stale-week check — THIS IS THE RESULT OF THE RUN

- Banner week: **20 August - 26 August 2026**.
- Day headings: Thursday 20 August to Wednesday 26 August 2026.
- Today: **28 August 2026**.
- **Every one of the 28 gig rows is past-dated. Importable rows: 0.**

The curator rolls the page on a Thursday. The 2026-08-27 run fired at 12:39Z on Thursday and found the
page still on the 20-26 August week. This run fired at 04:36Z on Friday 28 August and the page is
unchanged. **The curator has missed a roll**: the week of 27 August - 2 September is not published, so
the page is now two days past its own stated week end.

§0.14 forbids a past-dated import and the spec's stale-week trap says to import nothing and stop
cleanly. This is a **clean stop, not a failure** (§6C `page-not-rolled`). §6C already rules this class,
so it is not raised to `CTO-INBOX.md`. The cost, if the roll does not arrive, is the coming
Thursday-to-Sunday of Hampshire rows.

## 4. Diff (§5.7, §5.7a)

Both sides were normalised identically before comparison: whitespace collapsed, NBSP and en/em dash
normalised, curly quotes straightened, emoji stripped from the act cell, a trailing `, England` stripped
from the venue cell, a trailing comma, full stop or slash stripped, empty days collapsed to one line,
DOM order preserved.

| Comparison | Added | Removed |
|---|---|---|
| Capture vs stored snapshot (2026-08-27) | **0** | **0** |
| **§5.7a gate:** new snapshot vs the capture it was written from | **0** | **0** |

Row order is identical on both comparisons. The page has not changed since 2026-08-21.
No removed row exists, so §0.17 had nothing to action. The append-only default made this moot regardless.

## 5. Quality measures (§6)

| Measure | Count |
|---|---|
| Events created | 0 |
| Artists created with a verified page | 0 |
| Artists created with an evidenced blank | 0 |
| Venues created | 0 |
| Records enriched | 0 |
| Rows skipped as past-dated | 29 |
| Names sanitised or skipped as non-acts | 0 |
| Gate bounces (409/422) | 0 |
| Defaulted start times | 0 |
| Date corrections applied | 0 |

No row reached the venue, artist or event protocol, because the date filter rejected all of them first.

## 6. Rows the next run will meet (for information only)

The Saturday 22 August table holds eight `Farmstock Festival` rows whose venue cell reads
`Farmstock Festival`. That is a non-place under §0.23, so those rows are not importable even when dated
forward. The parent row gives an address, `214 Catherington Lane, Catherington, Waterlooville PO8 0TA`,
but the site is a farm field, not a fixed building. The rows are past-dated now and the point is moot.
This repeats the 2026-08-27 note so a future run does not rediscover it.

## 7. Snapshot

Written to `data/state/sceniceye-last-page.txt`. The body is byte-identical to the capture.
The header records the fetch, the run id and the 0/0 self-diff. The normalisation rules are unchanged
and are carried in the file header.

## 8. CTO-INBOX

Nothing was appended. A stale week is a clean stop under §6C, and the one defect this run met
(`sceniceye-mode-not-declared`) is already on file.

## 9. Notes

- `record_run` was not called. `SOURCE_RUNS_TOKEN` is missing and the defect is already on file as
  `record-run-token-missing`. `data/state/run-summary.jsonl` received its line.
- The Chrome tab was closed at the end of the run.
