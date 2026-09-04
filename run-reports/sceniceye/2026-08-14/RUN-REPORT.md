# ScenicEye — RUN REPORT 2026-08-14

**Outcome: COMPLETED. No import. Stale source week.**
Run id: `sceniceye-2026-08-14T04-35-54Z` · Fired 2026-08-14T04:35:54Z · Today 2026-08-14 (Thursday)

## 1. Gates

| Gate | Result |
|---|---|
| §6A step 0 heartbeat | Written: `data\state\heartbeat\sceniceye-2026-08-14T04-35-54Z.json` |
| §6A step 1 date | `2026-08-14` from the shell |
| §6A step 2 runbook read | `RUNBOOK.md` H1 **v2.27**, read in full |
| §6A step 2a floor | Runbook §6A CURRENT FLOOR **v2.19**. Read v2.27. **PASS.** Task prompt states no number; §6A step 2a is the gate |
| §6A step 2b claim | `data\state\claims\sceniceye.json` read `heldBy: null` (released 2026-08-14T00:06:00Z by `sceniceye-2026-08-13T23-50-56Z`). Acquired. TTL 90 min, `expiresAt` 2026-08-14T06:05:54Z. No takeover |
| §6A step 2 spec read | `sources\sceniceye.md`, read in full |
| CTO-INBOX read | Read in full. Fingerprints checked before this report was written |
| §6A step 3 tools | Chrome connected, one tab. bndy MCP tools not called — no writes were required |

## 2. Ordering note

This run read `RUNBOOK.md` before it wrote the step 0 heartbeat. The heartbeat was written
immediately after the runbook read and before any gate decision, capture or write. No gate
decision was taken before the heartbeat existed. The correct order is heartbeat first.

## 3. Source mode (§0.29)

`sources\sceniceye.md` declares **neither `delta` nor `append-only`**. The run defaulted to
**append-only**: no removed-row action, no §0.17 deletion. The finding is already in
`CTO-INBOX.md` under fingerprint `sceniceye-mode-not-declared` (2026-08-12), so it is not
raised again. The default cost nothing this run, because the diff shows zero removals.

## 4. Capture

- URL `https://scenicmind.co.uk/sceniceye`, Chrome, DOM walk of `h2` day-headings plus the
  following `table.notion-table` (§0.22). `get_page_text` was not used for extraction.
- 6-second hydration wait before the walk. Banner and day headings agree.
- `document.hidden` read `true`, `window.innerHeight` 889. §6B binds this to lazy-loaded
  feeds only. This source is a static Notion table set with no infinite scroll, and the walk
  returned 7 of 7 day tables and 34 of 34 rows, so the capture is complete.
- Raw capture: `data\raw\sceniceye\2026-08-14\capture-body.txt`.

**Captured: 7 day tables, 34 rows — 31 gig rows plus 3 "No gigs listed" days.**

## 5. STALE-WEEK CHECK — FIRED

| Field | Value |
|---|---|
| Banner week | `6 August - 12 August 2026` |
| Day tables | Thu 6 Aug → Wed 12 Aug |
| Today | 2026-08-14 (Thursday) |
| Newest listed date | 2026-08-12 |
| Verdict | **Every one of the 34 rows is past-dated. Page NOT rolled.** |

Per the spec's stale-week trap and §0.14: **import nothing, report "stale source week", stop
cleanly.** This is a clean stop, not a failure (§6C `page-not-rolled`).

The curator rolls the page on Thursdays. Today is Thursday and the run fired at 04:35Z, so it
almost certainly fired before this week's update. This matches the 2026-06-11 pattern exactly.
The next firing should catch the week of 13–19 August.

## 6. Two-sided diff (§5.7)

| Comparison | Added | Removed |
|---|---|---|
| Capture vs stored snapshot (`sceniceye-2026-08-13T23-50-56Z`) | 0 | 0 |
| **§5.7(a) gate — new snapshot re-diffed against the capture it was written from** | **0** | **0** |

The only textual difference against the previous snapshot was one stray leading blank line in
the old body. Zero gig rows moved in either direction. The page content is byte-identical to
last night's capture, which is consistent with a page that has not rolled.

Normalisation applied, both sides identically, per the snapshot header rules 1–8: NBSP to
space; en/em dash to hyphen; curly quotes to straight; trailing `, England` stripped from the
venue cell; trailing comma/full stop/slash stripped; emoji stripped from the act cell with the
word tail kept; whitespace runs collapsed; DOM order preserved, not sorted; an empty day
collapsed to the rule-7 single-line form.

**§5.7(a) passes at 0/0.** No deletion was proposed in any case, because the source mode
defaults to append-only and the diff is empty.

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

No row reached the §0 filters, the venue protocol, the artist protocol or the event protocol,
because all 34 failed the date test first. Nothing was staged. Nothing is uncertain.

`data\state\cancellations.jsonl` was not consulted, because no event create was attempted.

## 8. Rows carried forward, for the next run that sees a live week

These rows are recorded so the next run does not rediscover them. **They are not open items.**

- **Staunton Country Park** (`Petersfield Road, Havant, PO9`) — 10 rows. Skipped by the spec's
  own ruling and independently by §0.23: a country park is not a fixed building, and the
  address carries only the partial postcode `PO9`. It stays skipped.
- **`Venue missing from calendar`** — 1 row (Davey Jones Locker). A named non-place under
  §0.23. Skip the row, create nothing.
- **The Centurion `- Music Festival` rows** (`2f01ebc9-…`, Crookhorn Lane, Portsmouth) — 5
  rows. These are **importable ordinary gigs** per the spec's 2026-08-08 CTO ruling and §0.27.
  A fixed pub with a bndy record and a Place ID. Import them when the week is live.
- **`Forever Queen - Ticket`** — the `Ticket` tail is a marker, not a name. Artist is
  `Forever Queen`; set `ticketed: true` on the event.
- **`George Michael - Tribute`** — §0.5 and §0.20. No real act name is published, so the row is
  skipped, never invented.

## 9. Validator (§6A step 8)

```
0 records · 0 clean · 0 FAIL · 0 WARN   [mode=gate]
```

Exit 0. Zero records were written, so the record set is empty by construction.
Evidence file `data\state\enrichment-evidence-2026-08-14-sceniceye.jsonl` exists and is empty
for the same reason.

## 10. Snapshot (§6A step 7, fail-closed gate)

Written: `data\state\sceniceye-last-page.txt`, 70 lines, header dated 2026-08-14, normalisation
rules 1–8 carried forward unchanged. The run made no bndy write, and it wrote its snapshot
regardless. Recording an unrolled page as seen is safe here: the body is unchanged, so
tomorrow's diff is unaffected.

## 11. Open items

**None.** Nothing was appended to `CTO-INBOX.md`. The only candidate finding, the missing
§0.29 mode declaration, is already open there under `sceniceye-mode-not-declared`.

## 12. Claim and heartbeat

Claim released as the last action: `heldBy: null`. Heartbeat rewritten to
`"outcome":"completed"`.
