# ScenicEye — RUN REPORT 2026-08-15

**Outcome: COMPLETED. No import. Stale source week — second consecutive firing.**
Run id: `sceniceye-2026-08-15T06-37-40Z` · Fired 2026-08-15T06:37:40Z · Today 2026-08-15 (Saturday)

## 1. Gates

| Gate | Result |
|---|---|
| §6A step 0 heartbeat | Written: `data\state\heartbeat\sceniceye-2026-08-15T06-37-40Z.json` |
| §6A step 1 date | `2026-08-15` from the shell |
| §6A step 2 runbook read | `RUNBOOK.md` H1 **v2.27**, read in full |
| §6A step 2a floor | Runbook §6A CURRENT FLOOR **v2.19**. Read **v2.27**. **PASS.** The task prompt states no number; §6A step 2a is the gate |
| §6A step 2b claim | `data\state\claims\sceniceye.json` read `heldBy: null` (released 2026-08-14T04:52:30Z by `sceniceye-2026-08-14T04-35-54Z`). Acquired. TTL 90 min, `expiresAt` 2026-08-15T08:07:40Z. **No takeover** |
| §6A step 2b `enrichment.lock` | Not present. Two retired copies exist and were not honoured or touched |
| §6A step 2 spec read | `sources\sceniceye.md`, read in full |
| CTO-INBOX read | Read in full. Fingerprints checked before this report was written |
| §6A step 3 tools | Chrome connected, one tab in the MCP group. bndy MCP tools loaded and available; none were called, because no write was required |

## 2. Ordering note

This run read `RUNBOOK.md` before it wrote the step 0 heartbeat, because the floor in §6A
cannot be asserted before the file is read. The heartbeat was written immediately after the
read and before any gate decision, capture or write. The same note appears on the 2026-08-14
run. The correct order remains heartbeat first.

## 3. Source mode (§0.29)

`sources\sceniceye.md` declares **neither `delta` nor `append-only`**. The run defaulted to
**append-only**: no removed-row action and no §0.17 deletion. The finding is already in
`CTO-INBOX.md` under fingerprint `sceniceye-mode-not-declared` (2026-08-12). It is not raised
again. The default cost nothing this run, because the diff shows zero removals.

## 4. Capture

- URL `https://scenicmind.co.uk/sceniceye`, Chrome, DOM walk of `h1`/`h2`/`h3` day headings plus
  the following `table.notion-table` (§0.22). `get_page_text` was not used for extraction.
- 8-second hydration wait before the first walk, then a second read 10 seconds later. Both
  reads returned the same 7 day headings and the same banner. Hydration is stable.
- `document.visibilityState` read `hidden`, `window.innerHeight` 945. §6B binds the hidden-tab
  warning to lazy-loaded feeds. This source is a static Notion table set with no infinite
  scroll. The walk returned 7 of 7 day tables and 34 of 34 rows, so the capture is complete.
- `javascript_tool` output guard: every return was passed through `=` → `(eq)` per §6B. One
  return truncated at the Saturday table and was paged in two calls.
- Raw capture: `data\raw\sceniceye\2026-08-15\capture-body.txt`.

**Captured: 7 day tables, 34 rows — 31 gig rows plus 3 "No gigs listed" days.**

## 5. STALE-WEEK CHECK — FIRED

| Field | Value |
|---|---|
| Banner week | `6 August - 12 August 2026` |
| Day tables | Thu 6 Aug → Wed 12 Aug |
| Today | 2026-08-15 (Saturday) |
| Newest listed date | 2026-08-12 |
| Verdict | **All 34 rows are past-dated. Page NOT rolled.** |

Per the spec's stale-week trap and §0.14: **import nothing, report "stale source week", stop
cleanly.** This is a clean stop, not a failure (§6C `page-not-rolled`).

⚠ **This is different from the 2026-08-14 stop, and the difference is worth recording.** On
2026-08-14 the run fired at 04:35Z on a Thursday, before the curator's usual Thursday update,
so the unrolled page was expected. Today is **Saturday**. The curator's roll for the week of
13–19 August is now **two days overdue**, and the current weekend is unpublished. The page has
therefore been static for at least four consecutive firings (08-12, 08-13, 08-14, 08-15).

**No item is raised for this.** §6C already classes `page-not-rolled` as expected behaviour,
there is no defect and no decision, and two observed misses are not yet evidence the curator
has stopped. **A third consecutive missed roll should be raised**, because at that point the
source is dormant rather than late, and that is a fact Jason would want.

## 6. Two-sided diff (§5.7)

| Comparison | Added | Removed |
|---|---|---|
| Capture vs stored snapshot (`sceniceye-2026-08-14T04-35-54Z`) | 0 | 0 |
| **§5.7(a) gate — new snapshot re-diffed against the capture it was written from** | **0** | **0** |

The capture is byte-identical to the stored snapshot body across all 42 lines. Zero rows moved
in either direction, which is what an unrolled page must look like.

Normalisation applied to both sides identically, per the snapshot header rules 1–8: NBSP to
ordinary space; en/em dash to hyphen; curly quotes to straight; trailing `, England` stripped
from the venue cell; trailing comma, full stop or slash stripped; emoji stripped from the act
cell with the word tail kept; runs of whitespace collapsed; DOM order preserved, not sorted;
an empty day collapsed to the rule-7 single-line form.

**§5.7(a) passes at 0/0.** No deletion was proposed in any case: the source mode defaults to
append-only and the diff is empty.

## 7. Writes to bndy

**None.** Zero creates, zero edits, zero deletions.

| Class | Count |
|---|---|
| Events created | 0 |
| Artists created — verified page | 0 |
| Artists created — evidenced blank | 0 |
| Venues created | 0 |
| Records enriched | 0 |
| Rows skipped, past-dated | 34 |
| 409 / 422 bounces | 0 |
| Names sanitised or skipped as non-acts (§0.6) | 0 |
| Defaulted start times (§5.6) | 0 |
| Date corrections (§5.6b) | 0 |
| Deletions | 0 |

No row reached the §0 filters, the venue protocol, the artist protocol or the event protocol.
All 34 failed the date test first. Nothing was staged. Nothing is uncertain.

`data\state\cancellations.jsonl` was not consulted, because no event create was attempted.

## 8. Rows carried forward, for the next run that sees a live week

Recorded so the next run does not rediscover them. **They are not open items.** Unchanged from
the 2026-08-14 report, because the page is unchanged.

- **Staunton Country Park** (`Petersfield Road, Havant, PO9`) — 10 rows. Skipped by the spec's
  own ruling and independently by §0.23: a country park is not a fixed building, and the
  address carries only the partial postcode `PO9`. It stays skipped.
- **`Venue missing from calendar`** — 1 row (Davey Jones Locker). A named non-place under
  §0.23. Skip the row, create nothing.
- **The Centurion `- Music Festival` rows** (`2f01ebc9-…`, Crookhorn Lane, Portsmouth) — 5
  rows. These are **importable ordinary gigs** per the spec's 2026-08-08 CTO ruling and §0.27.
  A fixed pub with a bndy record and a Place ID. Import them when the week is live.
- **`Forever Queen - Ticket`** — the `Ticket` tail is a marker, not a name. The artist is
  `Forever Queen`; set `ticketed: true` on the event.
- **`George Michael - Tribute`** — §0.5 and §0.20. No real act name is published, so the row is
  skipped, never invented.

## 9. Validator (§6A step 8)

```
0 records · 0 clean · 0 FAIL · 0 WARN   [mode=gate]
```

Exit 0. Zero records were written, so the record set is empty by construction. The evidence
file `data\state\enrichment-evidence-2026-08-15-sceniceye.jsonl` is empty for the same reason.

## 10. Snapshot (§6A step 7, fail-closed gate)

Written: `data\state\sceniceye-last-page.txt`, 70 lines, header dated 2026-08-15, normalisation
rules 1–8 carried forward unchanged. The run made no bndy write and wrote its snapshot anyway.
Recording an unrolled page as seen is safe here: the body is unchanged, so the next run's diff
is unaffected.

## 11. `record_run`

Not called. `SOURCE_RUNS_TOKEN` is unset and the failure is already open in `CTO-INBOX.md`
under `record-run-token-missing`. `data\state\run-summary.jsonl` is the dashboard's input and
was appended normally.

## 12. Open items

**None.** Nothing was appended to `CTO-INBOX.md`. The only candidate finding — the missing
§0.29 mode declaration — is already open there under `sceniceye-mode-not-declared`.

## 13. Claim and heartbeat

Claim released as the last action: `heldBy: null`. Heartbeat rewritten to
`"outcome":"completed"`.
