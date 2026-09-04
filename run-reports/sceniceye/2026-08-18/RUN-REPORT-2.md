# ScenicEye run report — 2026-08-18 (second firing)

**Outcome: STOPPED at §6A step 3. Chrome is not connected. No bndy writes. No snapshot write.**

| field | value |
|---|---|
| Task | `sceniceye` |
| Run id | `sceniceye-2026-08-18T21-31-59Z` |
| Fired | 2026-08-18T21:31:59Z |
| Today | 2026-08-18 (Tuesday) |
| Runbook read | `RUNBOOK.md` H1 **v2.27**, in full |
| Floor asserted | §6A **CURRENT FLOOR v2.19**. 2.27 >= 2.19. PASS |
| Prompt floor | The prompt names no number. §6A step 2a is the gate. No drift to report |
| Spec read | `sources/sceniceye.md`, in full |
| §0.29 mode | **Not declared in the spec.** Defaulted to `append-only`. Open since 2026-08-12 as `sceniceye-mode-not-declared`. Not re-raised |
| Claim | `data/state/claims/sceniceye.json`. Was `heldBy: null` (released 04:52Z). Acquired. No takeover |
| Heartbeat | `data/state/heartbeat/sceniceye-2026-08-18T21-31-59Z.json` |
| Report path | `RUN-REPORT-2.md`, not `RUN-REPORT.md`. The 04:36Z firing owns that name. Known collision: `run-report-path-collides-on-second-firing` |

## 1. What stopped the run

`list_connected_browsers` returned `[]`. `mcp__claude-in-chrome__tabs_context_mcp` returned
"Claude in Chrome is not connected". Two attempts. This is not a login fault. The extension
itself is unreachable.

`sources/sceniceye.md` states: *"CHROME IS MANDATORY ... If Chrome is not connected: STOP and
report the blocker. Do NOT fall back to web fetch, and do not touch bndy."* §6A step 3 states
the same rule for every source: *"Never substitute a plain web fetch for a Chrome-rendered
source."*

The run made **no sanctioned capture**, **no bndy write** and **no snapshot write**.

This is the same outage every other task reports. It has now run for over 24 hours: enrichment
firings 22 through 24, spider, klma, gigs-news, onthecase, insangel, and the 04:36Z sceniceye
firing. This run is the next in that sequence, not a new fault.

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
| Rows skipped | 19, all past-dated (§4) |

## 3. Diagnostic probe — NOT A CAPTURE

The run made one read-only HTTP probe to measure the cost of the outage. It imported nothing
from it and it wrote no snapshot from it.

- File: `data/raw/sceniceye/2026-08-18/DIAGNOSTIC-ssr-probe-2131Z.html`
- HTTP 200, 605,439 bytes.

The page state is identical to the 04:36Z probe 17 hours earlier: banner week
`13 August - 19 August 2026`, all seven day tables, same 19 gig rows.

## 4. What a Chrome capture would have imported THIS FIRING: nothing

| day | gig rows | disposition |
|---|---|---|
| Thursday 13 August 2026 | 2 | past-dated (§0.14) |
| Friday 14 August 2026 | 6 | past-dated |
| Saturday 15 August 2026 | 8 | past-dated |
| Sunday 16 August 2026 | 3 | past-dated |
| Monday 17 August 2026 | 0 | `No gigs listed` |
| **Tuesday 18 August 2026** | **0** | **`No gigs listed`. Today** |
| **Wednesday 19 August 2026** | **0** | **`No gigs listed`. Tomorrow** |

**19 gig rows, all past-dated. 0 current or future gig rows.** The curator publishes the three
current and future days as the one-cell empty-day table described in snapshot normalisation
rule 7.

**Stale-week check (mandatory every run):** the page is NOT stale. Its banner week
`13 August - 19 August 2026` contains today. The curator rolls on a Thursday, so the next
edition (20-26 August) is due 2026-08-20. This is a genuine quiet mid-week, not a
page-not-rolled event (§6C `page-not-rolled`).

Even with Chrome up, the correct result of this firing is **0 created, 19 past-skip**.

## 5. What the outage HAS cost this source — correcting the 04:36Z report

The 04:36Z report states *"the Chrome outage cost this run zero events. It did not cost a single
importable row."* That is true of that firing. **It understates the cumulative cost, and this
report corrects it.**

The last Chrome capture was `sceniceye-2026-08-15T06-37-40Z`. At that moment the page still
carried the week 6-12 August. It carried 13-19 August by 2026-08-18T04:36Z. The curator
therefore rolled the page at some point between those two timestamps, and Chrome was down for
all of it.

**Up to 11 gig rows were future-dated when the page rolled and were never captured:**

| day | rows now unimportable |
|---|---|
| Saturday 15 August 2026 | 8 (Will Tierney, The Repeat Offenders, The Ship Annual Raft Race - Featuring Superhero's, The Punk Pirates, Jenny June, Tasmin Escott, Higher Ground, Somethin Like This) |
| Sunday 16 August 2026 | 3 (Michelle Lewis, Matt O'Neil, Pfizer Chiefs) |

The exact roll time cannot be established from the evidence held, so the true figure is between
0 and 11. It is stated as an upper bound, not a measurement. Raised as a DATA item.

These rows are now past-dated and §0.14 forbids importing them. They are not recoverable by a
later run. They remain valid discovery leads for the spider under §5.5.

## 6. Snapshot

**Not written, deliberately.** Two reasons, either one sufficient:

1. §6A step 7's fail-closed gate binds a run that **wrote** to bndy. This run wrote nothing.
2. The stored snapshot's header fixes its enumeration method as a **Chrome DOM walk of the `h2`
   day headings plus the following `table.notion-table`** (rule 1, §0.22). A curl-derived
   capture is a different enumeration method. §0.29 names exactly this mismatch as what
   disqualifies a source from `delta`.

Stored snapshot unchanged: `data/state/sceniceye-last-page.txt`, written 2026-08-15, week
6-12 August 2026. It is now two weeks behind the page.

**The next Chrome-capable run must expect a large added set** — the 13-19 August week in full,
or the 20-26 August week if it fires after Thursday. Every row of the 13-19 week is past-dated,
so the expected write count from it is zero. No removal may be actioned: the source is
`append-only` by default (§0.29) and §5.7 removed-row handling does not run.

## 7. Two-sided diff

Not run. No sanctioned capture to diff. Self-diff gate not applicable.

## 8. Validator

Not run. §6A step 8 feeds the validator the records the run wrote. This run wrote none, so there
is no input and no evidence file. No `FAIL` outstanding.

`data/state/enrichment-evidence-2026-08-18-sceniceye.jsonl` was not created. Correct: the file is
written **before** a bndy write, and there was no bndy write.

## 9. Items logged to CTO-INBOX.md

One. Its fingerprint was absent from the inbox before this run.

| fingerprint | kind | why |
|---|---|---|
| `sceniceye-outage-cost-11-rows-15-16-aug` | DATA | The cumulative cost of the outage to this source, which no open item states |

**Checked and deliberately NOT re-raised** (inbox rule 4 and rule 5 — an item already open is
work, not an item):

- `sceniceye-chrome-unreachable-blocks-capture` (this morning, this source, same outage)
- `sceniceye-curl-reproduces-live-week` (this morning, RULE, still true and still not acted on)
- `sceniceye-mode-not-declared` (2026-08-12, still undeclared)
- `run-report-path-collides-on-second-firing` (2026-08-12, worked around by the `-2` suffix)
- `record-run-token-missing` (2026-08-08)
- `sceniceye-daily-note-line-absent` (sweep, today). **Acted on rather than re-raised**: this
  firing appended its own line to `20-Daily/2026-08-18.md` and verified it on read-back

## 10. Open items for Jason

None from this run. Nothing irreversible and nothing legal arose.

One standing observation, already carried by open items and not re-raised: the Chrome outage has
now blocked every artist-creating and Chrome-capturing task for over a full day, across roughly
25 firings. No automatic retry has resolved it. A human check of the extension install and login
state is the only remaining route.

## 11. Housekeeping

- `record_run` not attempted. It fails on a missing `SOURCE_RUNS_TOKEN`, already logged as
  `record-run-token-missing`. Not blocking.
- `data/state/run-summary.jsonl` appended, outcome `stopped`, all counts zero.
- `20-Daily/2026-08-18.md` appended with a link to this report, and the append verified.
- Claim released to `heldBy: null`. Heartbeat rewritten to `stopped`, reason
  `6A.3 chrome-unreachable`.
