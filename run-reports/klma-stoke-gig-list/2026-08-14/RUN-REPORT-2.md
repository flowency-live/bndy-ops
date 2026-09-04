# KLMA Stoke gig list — run report 2026-08-14 (second firing)

- **Run id**: `klma-stoke-gig-list-2026-08-14T03-08-10Z`
- **Fired**: 2026-08-14T03:08:10Z (local date 2026-08-14, BST)
- **Outcome**: completed — **no-change run**
- **Runbook read**: `RUNBOOK.md` H1 **v2.27**. §6A CURRENT FLOOR **v2.19**. Assertion **PASS**.
  The task prompt names no numeric floor, so §6A step 2a is the only gate that ran.
  The stale `>= v2.4` prompt floor is already in CTO-INBOX as `prompt-runbook-floor-drift`.
- **Spec read**: `sources/klma-stoke-gig-list.md` in full, including §VA and §VA.9.
- **Claim**: `data/state/claims/klma-stoke-gig-list.json` read as released
  (`heldBy: null`, `lastRun` `klma-stoke-gig-list-2026-08-13T23-50-55Z`). Acquired at
  2026-08-14T03:08:10Z, TTL 2 hours. **No takeover.** No `enrichment.lock` was found.
- **Heartbeat**: `data/state/heartbeat/klma-stoke-gig-list-2026-08-14T03-08-10Z.json`.
- **Report path**: `RUN-REPORT-2.md`. A run completed on this date 2 hours 40 minutes earlier and
  owns `RUN-REPORT.md`. This is the open inbox item `run-report-path-collides-on-second-firing`
  (2026-08-12). It is not raised again.
- **Validator**: `0 records · 0 clean · 0 FAIL · 0 WARN   [mode=gate]` — exit 0.

---

## 1. Headline counts

Counts are of records **written to bndy and read back** (§0.10). They are not rows considered.

| | this run |
|---|---|
| Events created | **0** |
| Artists created | **0** |
| Venues created | **0** |
| Existing records enriched | **0** |
| Records created with a verified page | 0 |
| Records created with an evidenced blank | 0 |
| Rows staged | 0 |
| Names sanitised or skipped as non-acts (§0.6) | 0 |
| Rows deferred on budget | 0 |
| Deletions | 0 |

**Nothing was written to bndy, because the source published nothing new.** Cap used: 0 of 50.
The run did not hit a cap and did not run out of time.

Per §2.18 this is the correct result for a diff source. A throughput target does not apply here,
and manufacturing activity on a quiet day is the failure this source is explicitly protected from.

## 2. Capture

| section | surface | rows |
|---|---|---|
| 1 — KLMA sheet | Chrome on `gviz/tq?tqx=out:html` | 416 |
| 2 — The Sugarmill | Chrome DOM read of `thesugarmill.co.uk/gig-guide/` | 31 distinct (26 dated, 5 undated) |

Raw captures:

- `data/raw/klma-stoke-gig-list/2026-08-14/sheet-gviz-0308Z.txt` (46,977 bytes)
- `data/raw/klma-stoke-gig-list/2026-08-14/sugarmill-gig-guide-0308Z.txt` (2,648 bytes)

Both files are byte-for-byte the same size as the 00:58Z and 01:11Z captures written by the first
firing. That is an independent corroboration of the 0/0 diff below.

**Column layout re-verified against the trailing header row (DOM row 417 of 417):**
`Artist | Venue & Location | Cost/Ticket | Genre | Link to Event`, 14 columns, max cell count 14.
This matches the post-2026-08-06 mapping at indices `[2] [3] [5] [6] [7]`. **No off-by-one.**
No Artisan Tap genre bleed was present in the capture.

`web_fetch` was **not** used on the gviz endpoint. Chrome is the only trusted surface for this
source (spec, "Source & fetch"): `web_fetch` there serves an eight-week-stale 13-column cache.

⚠ **`javascript_tool` guards (§6B), both known and both handled.** Output truncates near 1.2 KB and
any returned string containing `=` is blocked. This run avoided both by computing the diff **inside
the page** and returning only counts and indices, rather than paging 416 rows out through the pipe.
Neither guard is a source fault and neither is raised.

## 3. Diff

Both sides were normalised with the rules written in the snapshot file's own header, then compared
by per-row FNV-1a hash **and** by a whole-body FNV-1a digest.

### Section 1 — KLMA sheet: 0 added / 0 removed / 416 of 416 unchanged

| check | capture | stored snapshot | verdict |
|---|---|---|---|
| row count | 416 | 416 | equal |
| distinct row hashes | 416 | 416 | equal |
| whole-body length | 46,876 chars | 46,876 chars | equal |
| whole-body FNV-1a digest | `2cd80052` | `2cd80052` | **equal** |

### Section 2 — The Sugarmill: 0 added / 0 removed / 26 of 26 dated rows unchanged

| check | capture | stored snapshot | verdict |
|---|---|---|---|
| `div.row2` elements | 41 | — | deduped to 31 distinct by slug, per header rule 1 |
| dated rows | 26 | 26 | equal |
| whole-body length | 2,621 chars | 2,621 chars | equal |
| whole-body FNV-1a digest | `bce7fb1e` | `bce7fb1e` | **equal** |

The 5 undated slugs are the same 5 as on 2026-08-12 and 2026-08-14 (first firing):
`bootleg-blondie`, `fleetwood-shack`, `scene-emo-metalcore-dubstep-brutal-clubnight`,
`the-bon-jovi-experience`, `vampire-ball-2026`. They were resolved on 2026-08-12 — 3 imported,
2 rejected as 23:00 club nights (§VA.9 classification table). Nothing to redo.

### ⚠ A parse fault in THIS run, caught by the gate before it could act

The first section-2 diff reported **3 added and 3 removed**, at the same three indices:

```
2026-08-22 CHERRY KISS: WHAT'S YOUR TYPE?
2026-11-14 NME'D: A TRIBUTE TO 00'S NME CLASSICS
2027-01-22 ISN'T IT ALANIS
```

**The source had not changed. This run's normalisation had.** Snapshot header rule 5 folds curly
quotes to straight; this run applied it to the row text but not to the act name taken from the
title heading, so three apostrophes stayed curly and three rows failed to match themselves.

Re-applying rule 5 to the heading returned **0 added / 0 removed**. Had this been a `delta` source
it would have proposed three future-dated deletions on a formatting difference — precisely the
§5.7(a) failure class, and the same class as the open inbox item `whitespace-diff-drift`.

**Two things follow, and both are done:**

1. The snapshot header now states that rule 5 applies to the act name derived from the heading, not
   only to the row text. The next run reproduces the normalisation exactly.
2. No inbox item is raised. §5.7(a) already rules this, `whitespace-diff-drift` already records the
   class, and CTO-INBOX rule 4 says an item an existing rule answers is work, not an item.

### §5.7(a) self-diff gate

```
section 1: 0 added / 0 removed / 416 of 416 row hashes identical.  PASS.
section 2: 0 added / 0 removed /  26 of 26 dated rows identical.   PASS.
```

The stored snapshot reproduced today's capture exactly on both sections, which is the stronger form
of the gate. No deletion was proposed and none was possible.

## 4. §0.29 mode

The spec declares **no** mode. The run treated the source as **`append-only`**, matching the first
firing and the 2026-08-12 run. §5.7 removed-row handling and §0.17 deletion did not run.

The missing declaration is already in CTO-INBOX as `klma-no-delta-mode-declared` (2026-08-12).
**It is not raised again.**

## 5. Tombstone and cancellation checks

- `data/state/cancellations.jsonl` — read. Nothing was created this run, so no artist + venue +
  date lookup was needed and no `TOMBSTONED-` disposal arose.
- `data/state/cancellations.jsonl` — **not appended.** No deletion and no cancellation occurred.
- Today's other run reports were read before any conclusion was drawn from an absent record
  (§5.4 v2.19). No absent record was interpreted this run.

## 6. §VA venue-authoritative checks

⚠ **NO VENUE PAGE WAS FETCHED THIS RUN, AND NONE IS REPORTED AS CHECKED.**

§VA.6 places the venue checks **after** the capture and **before** the per-gig pipeline. The diff
produced zero added rows, so there was no name to merge, no billing to spell-check and no
contradiction to resolve. Fetching five venue pages to correct nothing spends the budget and
changes no record.

| venue | status this run |
|---|---|
| Cosey Club | not checked — no added rows |
| Eleven | not checked — no added rows |
| The Rigger | not checked — no added rows |
| Artisan Tap | not checked — no added rows (and still has no proven surface) |
| The Sugarmill | **captured** — it is a sole-source feed, so it is captured every run regardless. 0 added / 0 removed. |

Names corrected: none. Contradictions flagged: none. Gigs the venue published that KLMA lacked:
none assessed. This is a deliberate scope statement, not a silent omission.

## 7. Enrichment

No artist was created and no artist was enriched, so no `§2A` search ran and no evidence line was
written. `data/state/enrichment-evidence-2026-08-14-klma-stoke-gig-list.jsonl` is owned by the
first firing and **was not touched**.

⚠ Note for the next run: `facebook-page-search-not-found` was raised by the first firing today —
`facebook.com/search/pages/?q=` returned "Not Found" for its whole run, so §2A.1 item 3b surface (a)
was down. This run had no enrichment to do and therefore did not re-test it. The item stands open.

## 8. Ordering rule

The §"order the added rows by gigs-per-artist" ruling was read and did not bind: there were zero
added rows to order. The `john-sewell-not-reached` backlog was cleared by the first firing today
(11 events, 1 artist, 4 venues) and no further backlog is open on this source.

## 9. Gate bounces

None. Zero write calls were made, so there was no 409, no 422 and no 400.

## 10. `record_run`

Not called. It fails on a missing `SOURCE_RUNS_TOKEN` on every scheduled run and is already in
CTO-INBOX as `record-run-token-missing`. `data/state/run-summary.jsonl` is the dashboard's input
and was appended normally.

## 11. Files written

| file | what changed |
|---|---|
| `data/state/heartbeat/klma-stoke-gig-list-2026-08-14T03-08-10Z.json` | written at start, rewritten at end |
| `data/state/claims/klma-stoke-gig-list.json` | acquired, then released with `heldBy: null` |
| `data/raw/klma-stoke-gig-list/2026-08-14/sheet-gviz-0308Z.txt` | new capture |
| `data/raw/klma-stoke-gig-list/2026-08-14/sugarmill-gig-guide-0308Z.txt` | new capture |
| `data/state/klma-stoke-gig-list-last-page.txt` | **header refreshed only — both section bodies verified byte-identical and left unchanged** |
| `data/state/run-summary.jsonl` | one appended line |
| `20-Daily/2026-08-14.md` | one appended line |
| `data/normalized/klma-stoke-gig-list/2026-08-14/RUN-REPORT-2.md` | this file |

**Nothing was written to bndy.** The §6A step 7 fail-closed snapshot gate is satisfied: the snapshot
was written, and it was written after the capture it describes.

## 12. Items raised to CTO-INBOX

**None.** Everything this run met is already an open item or is already answered by a rule:

| what the run met | why it is not raised |
|---|---|
| Spec declares no §0.29 mode | open: `klma-no-delta-mode-declared` |
| Second firing collides on the report path | open: `run-report-path-collides-on-second-firing` |
| `record_run` has no token | open: `record-run-token-missing` |
| Prompt floor is stale at v2.4 | open: `prompt-runbook-floor-drift` |
| Facebook page search is down | open: `facebook-page-search-not-found` |
| Curly-quote normalisation faked 3 removals | this run's own parse fault, fixed in the snapshot header; class already open as `whitespace-diff-drift` and ruled by §5.7(a) |
