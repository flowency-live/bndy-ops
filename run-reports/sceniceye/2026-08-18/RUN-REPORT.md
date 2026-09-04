# ScenicEye run report — 2026-08-18

**Outcome: STOPPED at §6A step 3. Chrome is not connected. No bndy writes. No snapshot write.**

| field | value |
|---|---|
| Task | `sceniceye` |
| Run id | `sceniceye-2026-08-18T04-36-43Z` |
| Fired | 2026-08-18T04:36:43Z |
| Today | 2026-08-18 (Tuesday) |
| Runbook read | `RUNBOOK.md` H1 **v2.27** |
| Floor asserted | §6A **CURRENT FLOOR v2.19**. 2.27 >= 2.19. PASS |
| Prompt floor | The prompt names no number. §6A step 2a is the gate. No drift to report |
| Spec read | `sources/sceniceye.md`, in full |
| §0.29 mode | **Not declared in the spec.** Defaulted to `append-only`. Already raised 2026-08-12 as `sceniceye-mode-not-declared`. Not re-raised |
| Claim | `data/state/claims/sceniceye.json`. Was `heldBy: null`. Acquired. No takeover |
| Heartbeat | `data/state/heartbeat/sceniceye-2026-08-18T04-36-43Z.json` |

## 1. What stopped the run

`mcp__claude-in-chrome__tabs_context_mcp` returned "Claude in Chrome is not connected" on two
attempts. `list_connected_browsers` returned `[]`. This is not a login fault. The extension
itself is unreachable.

`sources/sceniceye.md` states: *"CHROME IS MANDATORY ... If Chrome is not connected: STOP and
report the blocker. Do NOT fall back to web fetch, and do not touch bndy."* §6A step 3 states
the same rule for every source: *"Never substitute a plain web fetch for a Chrome-rendered
source."*

The run therefore made **no sanctioned capture**, **no bndy write** and **no snapshot write**.

This is the same outage the other tasks report tonight. Sequence across all tasks:
enrichment firings 22, 23, 00, 01, 02, 03, 04; spider 01:05Z; klma; gigs-news; onthecase.
This run is the next in that sequence, not a new fault.

## 2. Counts

| metric | count |
|---|---|
| Events created | 0 |
| Artists created | 0 |
| Venues created | 0 |
| Records enriched | 0 |
| Created with a verified page | 0 |
| Created with an evidenced blank | 0 |
| Names sanitised or skipped as non-acts | 0 |
| 409 / 422 bounces | 0 |
| Rows deleted | 0 |
| Rows skipped | see §4 |

## 3. Diagnostic probe — NOT A CAPTURE

To measure the cost of the outage, the run made one read-only HTTP probe of the source. It
imported nothing from it, and it did not write a snapshot from it.

- File: `data/raw/sceniceye/2026-08-18/DIAGNOSTIC-ssr-probe.html`
- HTTP 200, 604,852 bytes.

**Finding, and it contradicts the spec's stated reason for the Chrome mandate.** The spec's
`scrape_architecture` block says the Super.so SSR cache is *"STALE BY WEEKS"*, measured once on
2026-05-01. It is not stale today. The static HTML carries the **current** week banner
`13 August - 19 August 2026` and all seven day tables, Thursday 13 to Wednesday 19 August. A
weeks-stale cache cannot contain the current week.

This is the same class of finding two other runs raised tonight: `klma-curl-reproduces-gviz-live`
and `gigs-news-curl-reproduces-week-view`. Raised as a RULE item, not acted on. **A run does not
change a rule** (§0A.3, §7).

## 4. What a Chrome capture would have imported: nothing

The probe shows that the Chrome outage cost this run **zero events**. It did not cost a single
importable row.

| day | rows | disposition |
|---|---|---|
| Thursday 13 August 2026 | 2 | past-dated (§0.14) |
| Friday 14 August 2026 | 6 | past-dated |
| Saturday 15 August 2026 | 8 | past-dated |
| Sunday 16 August 2026 | 3 | past-dated |
| Monday 17 August 2026 | 0 | `No gigs listed` (past-dated anyway) |
| **Tuesday 18 August 2026** | **0** | **`No gigs listed`. Today** |
| **Wednesday 19 August 2026** | **0** | **`No gigs listed`. Tomorrow** |

**19 gig rows, all past-dated. 0 current or future gig rows.** The curator publishes the three
current/future days as the one-cell empty-day table described in snapshot normalisation rule 7.

**Stale-week check (mandatory every run):** the page is NOT stale. Its banner week
`13 August - 19 August 2026` contains today. The curator rolls on a Thursday, so the next
edition (20-26 August) is due 2026-08-20. This is a genuine quiet mid-week, not a
page-not-rolled event (§6C `page-not-rolled`).

Even with Chrome up, the correct result of this firing was **0 created, 0 skipped as non-acts,
19 past-skip**. Tomorrow's firing will see the same page. Thursday's will see the new week.

## 5. Snapshot

**Not written, deliberately.** Two reasons, either one sufficient:

1. §6A step 7's fail-closed gate binds a run that **wrote** to bndy. This run wrote nothing, so
   the gate does not fire and there is nothing to record.
2. The stored snapshot's own header fixes its enumeration method as a **Chrome DOM walk of the
   `h2` day headings plus the following `table.notion-table`** (rule 1, §0.22). A curl-derived
   capture is a different enumeration method. §0.29 names exactly this mismatch as what
   disqualifies a source from `delta` — lemonrock's venue-derived snapshot against an
   artist-derived capture proposed 798 false deletions. Writing a curl-derived snapshot over a
   DOM-derived one would seed that same fault here.

Stored snapshot is unchanged: `data/state/sceniceye-last-page.txt`, written 2026-08-15,
week 6-12 August 2026. It is now two weeks behind the page. **The next Chrome-capable run diffs
against a two-week-old snapshot and must expect a large added set** — the 13-19 August week in
full. Every row of it is past-dated by then, so the expected write count remains zero and no
removal may be actioned: the source is `append-only` by default (§0.29) and §5.7 removed-row
handling does not run.

## 6. Two-sided diff

Not run. No sanctioned capture to diff.

## 7. Validator

Not run. §6A step 8 feeds the validator the records the run wrote. This run wrote none, so there
is no input and no evidence file. No `FAIL` outstanding.

`data/state/enrichment-evidence-2026-08-18-sceniceye.jsonl` was not created. Correct: the file is
written **before** a bndy write, and there was no bndy write.

## 8. Items logged to CTO-INBOX.md

Two. Both fingerprints were absent from the inbox before this run.

| fingerprint | kind |
|---|---|
| `sceniceye-chrome-unreachable-blocks-capture` | BLOCKED |
| `sceniceye-curl-reproduces-live-week` | RULE |

**Checked and deliberately NOT re-raised:** `sceniceye-mode-not-declared` (2026-08-12) — the
§0.29 mode is still undeclared in the spec and the run still defaulted to `append-only`, but the
item is already open. Re-raising it is work, not an item (inbox rule 4).

## 9. Open items for Jason

None from this run. Nothing irreversible and nothing legal arose. The two inbox lines carry
everything.

## 10. Housekeeping

- `record_run` not attempted. It fails on a missing `SOURCE_RUNS_TOKEN` and is already logged as
  `record-run-token-missing`. Not blocking (§ task prompt).
- `data/state/run-summary.jsonl` appended, outcome `stopped`, all counts zero.
- `20-Daily/2026-08-18.md` appended with a link to this report.
- Claim released. Heartbeat rewritten to `stopped`, reason `6A.3 chrome-unreachable`.
