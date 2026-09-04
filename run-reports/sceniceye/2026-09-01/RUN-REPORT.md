# ScenicEye — RUN REPORT 2026-09-01

**Run id:** `sceniceye-2026-09-01T19-40-24Z`
**Outcome:** COMPLETED. Zero importable rows. Zero bndy writes.
**Today:** 2026-09-01 (Tuesday)
**Source:** https://scenicmind.co.uk/sceniceye
**Mode (RUNBOOK §0.29):** the spec declares none. The run treats this source as **append-only**.
No removal was actioned. Already on file as `sceniceye-mode-not-declared` (CTO-INBOX 2026-08-12),
so it is not raised again.

---

## 1. Gates

| Gate | Result |
|---|---|
| §6A step 0 heartbeat | Written first. `data\state\heartbeat\sceniceye-2026-09-01T19-40-24Z.json` |
| §6A step 1 date | `2026-09-01` from the container shell |
| §6A step 2 runbook read in full | Yes. `RUNBOOK.md` H1 = **v2.27** |
| §6A step 2a floor | CURRENT FLOOR = **v2.19**. Read v2.27. **PASS.** The task prompt names no number, so there is no prompt-side figure to report against it |
| §6A step 2 spec read in full | Yes. `sources\sceniceye.md`, 353 lines |
| CTO-INBOX fingerprints read | Yes. 16 existing `sceniceye` lines |
| §6A step 2b claim | `data\state\claims\sceniceye.json` read `heldBy: null`. Acquired. TTL 90 min, `expiresAt` 2026-09-01T21:10:24Z. No takeover |
| §6A step 3 tools | bndy MCP reachable (`search_venue` returned The Crown Inn Emsworth `557be6b0-33f9-4945-8adb-fe1cd7dff78b`). **Chrome reachable — one connected browser, `7ad060c3-b3e0-41c9-9dd4-a8097db94bfa`** |

**Chrome is back.** This is the first Chrome capture of this source since 2026-08-28. The runs of
2026-08-29 and 2026-08-30 both stopped or degraded on an unreachable Chrome
(`sceniceye-chrome-unreachable-blocks-artists`, `sceniceye-inapp-browser-denied-domain`).

## 2. Capture

- Surface: `mcp__claude-in-chrome__navigate` + `get_page_text`, tab 1176562253.
- Raw: `data\raw\sceniceye\2026-09-01\capture.txt`
- Page banner week: **27 August – 2 September 2026**
- Day tables present: Thu 27 Aug, Fri 28 Aug, Sat 29 Aug, Sun 30 Aug, Mon 31 Aug, Tue 1 Sep, Wed 2 Sep.
- Rows normalised: **34** (32 gig rows + 2 "No gigs listed" day rows).

## 3. Stale-week check (spec, mandatory every run)

**NOT a stale week.** The banner week 27 Aug – 2 Sep **contains today**, 1 September. The page is
the current week. It has simply not rolled since the 2026-08-30 run, which is expected: the curator
rolls on a Thursday, and the next roll is due 2026-09-03.

This is different from the §6C `page-not-rolled` failure class, where the page shows a **past**
week. Here the week is current and its remaining two days are published as empty.

## 4. Two-sided diff (§5.7)

Diffed today's normalised capture against `data\state\sceniceye-last-page.txt` (written
2026-08-30 from a `web_fetch` capture).

| | count |
|---|---|
| Snapshot rows | 34 |
| Capture rows | 34 |
| **Added** | **0** |
| **Removed** | **0** |

Order-sensitive `diff` is also empty — the two files are row-identical, not merely set-equal.

**A cross-surface result worth recording.** The 2026-08-30 snapshot header warned that *"a later run
that captures via Chrome must expect wording-level drift against this file"*, because that snapshot
was built from `web_fetch` markdown tables and this one from a Chrome DOM text walk. **There was no
drift at all: 34 rows, 0 added, 0 removed, same order.** Once normalisation rules 1–11 are applied
the two surfaces are interchangeable for this source. That is direct evidence for the open decision
`sceniceye-third-surface-needs-ruling` (CTO-INBOX 2026-08-19), and it corroborates
`sceniceye-curl-reproduces-live-week` (2026-08-18) and `sceniceye-webfetch-reproduces-live-week`
(2026-08-30). It is recorded here rather than appended to the inbox, because the decision it bears
on is already open and CTO-INBOX rule 5 forbids raising it twice.

### §5.7(a) normalisation gate

Normalisation is mechanised in `scripts\sceniceye_normalise.py`, which now implements **both**
capture surfaces and emits the same canonical rows from either. Rules 1–10 are carried forward from
the 2026-08-30 snapshot; **rule 11 is added this run** and describes the Chrome flat-cell form.

Re-diff of the newly written snapshot against the capture it was written from:
**0 added / 0 removed. GATE PASSED.**

No deletion was proposed in any case — this source is append-only.

## 5. Row disposition

| Day | Rows | Disposition |
|---|---|---|
| Thursday 27 August 2026 | 3 | **Past-dated — skipped (§0.14)** |
| Friday 28 August 2026 | 9 | **Past-dated — skipped (§0.14)** |
| Saturday 29 August 2026 | 11 | **Past-dated — skipped (§0.14)** |
| Sunday 30 August 2026 | 8 | **Past-dated — skipped (§0.14)** |
| Monday 31 August 2026 | 1 | **Past-dated — skipped (§0.14)** |
| Tuesday 1 September 2026 | 0 | Curator published "No gigs listed" |
| Wednesday 2 September 2026 | 0 | Curator published "No gigs listed" |
| **Importable (date ≥ today)** | **0** | — |

Horizon for this source is today → +14 days. Every published row falls **before** today, so the
horizon filter never had a row to consider.

**No row was skipped for any judgment reason.** Nothing was parked, nothing was ambiguous, no name
needed sanitising, no festival test was reached, no venue test was reached. The single reason for a
zero-row run is the calendar.

## 6. Writes to bndy

**None.** No venue, artist or event was created, edited or deleted.

- Creates: 0 of the 50 cap.
- Records created with a verified page: 0.
- Records created with an evidenced blank: 0.
- Records skipped: 0 (no importable row reached the pipeline).
- Names sanitised or refused as non-acts under §0.6: 0.
- 409 / 422 / gate bounces: none — no write was attempted.
- Cancellation tombstones (§5.4): `data\state\cancellations.jsonl` was not consulted, because no
  event create was attempted.

## 7. Validator (§6A step 8)

```
0 records · 0 clean · 0 FAIL · 0 WARN   [mode=gate]
```

Exit code 0. Run against `data\normalized\sceniceye\2026-09-01\validator-records.json` (empty) and
this run's own evidence file `data\state\enrichment-evidence-2026-09-01-sceniceye.jsonl` (empty).
The file is per-run and per-slug per §6A step 8, so it collides with nothing.

## 8. Carried-over loss, for the record — not a new item

The 2026-08-30 run held **five importable rows** because Chrome was unreachable and §2A.5 forbids
creating an artist stub. Those rows were Sunday 30 August rows. They are now past-dated and cannot
be imported by any later run. The cost is already recorded under
`sceniceye-chrome-unreachable-blocks-artists` (CTO-INBOX 2026-08-30). No new inbox line is raised,
because that would restate an open item.

The relevant fact for the next run is that Chrome worked today, so the same outage should not repeat
on 2026-09-03 when the page rolls.

## 9. Open items raised this run

**None.** Everything this run met is answered by an existing rule or an existing open inbox item:

| Observation | Why it is not raised |
|---|---|
| Spec declares no §0.29 mode | `sceniceye-mode-not-declared`, on file 2026-08-12 |
| Chrome outage cost 30 Aug rows | `sceniceye-chrome-unreachable-blocks-artists`, on file 2026-08-30 |
| Chrome and web_fetch agree exactly | Bears on the open decision `sceniceye-third-surface-needs-ruling`; recorded in §4 above |
| `record_run` has no `SOURCE_RUNS_TOKEN` | `record-run-token-missing`, on file 2026-08-08. Not blocking. `record_run` was not called |
| Page not rolled | Expected curator behaviour. Not a defect |

## 10. Outputs written

| File | Purpose |
|---|---|
| `data\state\heartbeat\sceniceye-2026-09-01T19-40-24Z.json` | §6A step 0, rewritten `completed` at the end |
| `data\raw\sceniceye\2026-09-01\capture.txt` | §6A step 4 capture |
| `data\state\sceniceye-last-page.txt` | §6A step 7 snapshot, Chrome surface, rules 1–11 |
| `data\normalized\sceniceye\2026-09-01\RUN-REPORT.md` | this file |
| `data\normalized\sceniceye\2026-09-01\validator-records.json` | validator input, empty |
| `data\state\enrichment-evidence-2026-09-01-sceniceye.jsonl` | per-run evidence file, empty |
| `data\state\run-summary.jsonl` | §6A step 7b, one appended line, all zeros |
| `scripts\sceniceye_normalise.py` | normalisation made mechanical for both surfaces |
| `20-Daily\2026-09-01.md` | §6A step 8 link |
| `data\state\claims\sceniceye.json` | released, `heldBy: null` |
