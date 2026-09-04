# ONTHECASE MUSIC — SCHEDULED IMPORT RUN, 2026-08-07

**OUTCOME: NO-CHANGE RUN. COMPLETED CLEANLY. ZERO WRITES TO bndy.**

| | |
|---|---|
| Task | `bv2a-otcm` (scheduled, unattended) |
| Run id | `onthecasemusic-20260807T033100Z` |
| Fired | 2026-08-07T03:31:00Z (04:31 BST) |
| Runbook | read IN FULL at **v2.11** — asserted against the task's **v2.4** floor, and against the runbook's own current floor of **v2.11**. **PASS.** |
| Source spec | `sources\onthecasemusic.md` read in full (§6D slug table → this file) |
| Rulings | `OPEN-RULINGS.md` read; STANDING RULINGS applied (no stubs; report quality not error count) |
| Capture surface | **Chrome** (`fetch` + `DOMParser`, reading `a[href]`) — §0.22 respected, `get_page_text` not used for collection |
| Diff | **0 added / 0 removed / 0 changed** |
| Creates used | **0 of 50** |
| Validator (§6A step 8) | Not applicable — 0 records written, so no evidence file and nothing to validate |

---

## 1. Headline counts

| Metric | Value |
|---|---|
| Source rows captured | **275** over **116** dates (2026-08-06 → 2027-12-18) |
| Snapshot rows (previous, 2026-08-06) | 275 |
| Rows ADDED | **0** |
| Rows REMOVED | **0** |
| Rows CHANGED (same `(date, gigid)`, text differs) | **0** |
| Gig ids whose date-set moved | **0** |
| Artists created **with a verified page** | **0** |
| Artists created **with an evidenced blank** | **0** |
| Artists **STAGED** | **0** |
| Names **sanitised or staged as non-acts** (§0.6) | **0** |
| Venues created / edited | 0 / 0 |
| Events created / edited / deleted | 0 / 0 / 0 |
| Gate bounces (409/422) | 0 |

**There was nothing to import.** Every one of the 275 rows in today's feed is already accounted for by
the snapshot written at the end of the 2026-08-06 run (which completed ~4.3 hours before this firing).
Zero creates here is the *correct* result, not a failed one — and per the 2026-08-01 standing ruling,
this report states the quality breakdown separately anyway, all three lines at zero, so that "0 creates"
cannot be mistaken for "0 creates with unexamined quality".

---

## 2. Capture — both surfaces agreed exactly

The spec makes Chrome mandatory for this source. §0.22 additionally forbids `get_page_text` for
collection, because the gig id lives in the `href` and text extraction discards it — and for this
source the gig id is load-bearing (§7 below). So the capture was a `fetch` + `DOMParser` pass in the
Chrome tab, reading `a[href]` directly.

`javascript_tool` truncates its return at roughly 1 KB, so a 33 KB capture cannot be read out of the
tab in one piece. The same technique used and verified by the 2026-08-06 run was repeated: the page was
**also** fetched in the sandbox and parsed with the **identical** algorithm, and the two results were
compared **before either was used**.

| | Chrome (`fetch`+`DOMParser`) | Sandbox (`curl`+`lxml`) |
|---|---|---|
| Rows | 275 | 275 |
| Date headers | 116 | 116 |
| Capture length | 33,108 | 33,108 |
| FNV-1a | 559231595 | 559231595 |
| DJB2 | 1709512387 | 1709512387 |

Identical on every measure. **The sandbox copy is therefore a faithful transport of the
Chrome-rendered capture, not a substitute for it — Chrome remained the capture surface, per the spec.**

⚠ `document.hidden` was `true` in the automation tab, as §6B says it always is. That is **not** a
capture risk here and the §6B lazy-load gate does not apply: this page is a single server-rendered
document fetched in one request, with no IntersectionObserver pagination. The two-surface agreement
above is independent proof the capture is complete rather than a truncated first render.

---

## 3. Diff — 0/0/0, verified mechanically

Diffed on **`(date, gigid)` first, then on the text**, per the spec's 2026-08-06 rule and the snapshot
header. Both sides normalised before comparison (whitespace runs collapsed; curly apostrophes → straight;
empty `/`-separated address segments dropped).

```
OLD rows 275   NEW rows 275
ADDED   (date,gigid) new to feed : 0
REMOVED (date,gigid) gone from feed : 0
CHANGED (same date+gigid, text differs) : 0
GIGIDs whose date-set changed : 0
GIGIDs entirely gone : 0     GIGIDs entirely new : 0
```

Stronger than the row-set comparison: the **data body of the stored snapshot is byte-identical to
today's capture**.

```
snapshot body md5 : 2ad2d37d71a07a1b38bf912fea395a59  (33,108 bytes)
capture  body md5 : 2ad2d37d71a07a1b38bf912fea395a59  (33,108 bytes)
IDENTICAL: True
```

The scheduled-task prompt's warning — *hundreds of added rows means a capture-format problem, HOLD* —
did not fire and had nothing to fire on. The format artifacts that produced the phantom
100-added/99-removed diff on 2026-08-06 (trailing `/` on phone-less venues, curly apostrophes, an
annotation row inside the data) are all fixed in the current snapshot and did not recur.

---

## 4. Snapshot — deliberately NOT rewritten

`data\state\onthecasemusic-last-page.txt` was left exactly as it stands.

- The §6A step 7 **fail-closed snapshot gate binds a run that WROTE to bndy**. This run wrote nothing.
- The stored snapshot's data body is **byte-identical** to today's capture (md5 above), so rewriting it
  would change nothing except the mtime, and mtime is not evidence of anything (§6G).
- Rewriting also risks losing the snapshot's hand-written header, which carries the ruling on why the
  gig id is the first field and the three normalisation rules the next run must reproduce.

This matches the disposal the `klma-stoke-gig-list` no-change run applied earlier today.

---

## 5. Artists — QUALITY BREAKDOWN (§6 / STANDING RULING 2026-08-01)

Stated separately as required, even though every line is zero.

- **5a. Created WITH a verified page — 0.** No act reached the create path.
- **5b. Created with an EVIDENCED BLANK — 0.** **No "no page found" is claimed for any act in this
  run.** No Facebook or Google search was performed, because no artist was created; nothing here should
  be read as evidence of absence for any act (§2A.1 item 3b).
- **5c. STAGED — 0.** No row was blocked, ambiguous, or held. Nothing is waiting.
- **5d. Names sanitised or staged as non-acts (§0.6) — 0.** No name was processed.

**Zero stubs were created, because zero artists were created.** The `NO STUBS` instruction in the task
prompt was not exercised — it did not need to be, and this run should not be counted as evidence that
the enrichment path works.

---

## 6. Rows in the feed correctly left alone

These are standing skips, unchanged from the last run and re-confirmed present in today's capture:

| Row | Disposal |
|---|---|
| `131409 Buskers night at Old Fat Ox Holywell`, Thu 06 Aug | Open-mic placeholder (§0.4 + spec skip list). Also now **past-dated** (§0.14). The site has not yet rolled 06 Aug off the feed; a row leaving because its date passed is **not** a cancellation (§5.7) and needs no action. |
| `to be confirmed` (2026-12-20, Crown and Cannon) | Placeholder, never an artist (§0.4) |
| `Undecided Acoustic Duo` | Spec skip, Jason ruling 2026-07-29 |

---

## 7. Verification — last night's writes checked against the live database

Read-only spot-check, done because a run report that does not match the database is the one artefact
this process trusts, and OPEN-RULINGS carries an open case (sceniceye / `Chloe Anne`) of a *reported*
create that does not exist.

Sampled the hardest of the 2026-08-06 creates — The Bandits, the one whose page Facebook search
**failed** to find and Google surfaced:

- **Artist `96c912d4-a355-4a6f-ab94-625b709bb1a8`** — present. `facebookUrl`
  `facebook.com/p/The-Bandits-100064729312427/`; avatar on a **stable `graph.facebook.com` URL**, not
  `scontent` (§0.13); bio the verbatim one-line quotation with `rock'n'roll` unaltered (§2A.1 item 8);
  location `Newcastle upon Tyne`; `externalIds [{onthecasemusic, 28931}]`. `actType` **empty**, correctly
  — §0.18 outranks the covers default.
- **Event `2b322526-e424-494f-9f65-99bf0f5a770f`** — present. `The Bandits @ The Tyne Bar`, 2026-08-08,
  `startTime 15:00` (the act's own "From 3pm", not a default), `isPublic: true`, externalId
  `{onthecasemusic, 2026-08-08-the-bandits-tyne-bar}` — the §6D slug form mandated for this source.

**Both match the 2026-08-06 report exactly.** No discrepancy between report and database for this source.

---

## 8. Concurrency (§6F) and locking (§6G)

- **Heartbeat** written as the **first action**, before any gate:
  `data\state\heartbeat\onthecasemusic-2026-08-07T03-31-00Z.json`, rewritten `completed` at the end.
- **Lock** `data\state\onthecasemusic.lock` — **no prior file, so acquired** per §6G's table. Released
  as the last action by writing `heldBy: null` into the content; never deleted, never keyed on mtime.
- **Files written by this run, all inside this source's ownership lane:**
  `data\raw\onthecasemusic\2026-08-07\*`, this report, the heartbeat and the lock.
- **Not touched:** `RUNBOOK.md`, `sources\onthecasemusic.md`, any other source's spec, snapshot or
  evidence file. A concurrent `bv2a-enrichment` run was live throughout this run (it holds
  `enrichment.lock` until 06:18Z and was writing `enrichment-ledger.jsonl` and its own evidence file
  during this window) — **its files were left alone**.
- `20-Daily\2026-08-07.md` **appended to**, not rewritten (§6F: appending is safe).

---

## 9. One discrepancy in the task prompt, non-blocking

The prompt states: *"Snapshot was rebuilt 2026-07-31 from the full 273-row feed."* That is one
generation out of date. The snapshot was rebuilt again on **2026-08-06** at **275 rows**, in the new
**gig-id-first** format, because the 2026-07-31 snapshot had been captured with `get_page_text` and was
not reproducible by a DOM capture. Diffing today's capture against the 2026-07-31 snapshot would have
produced the phantom ~100/99 diff again.

**No action needed and nothing was changed** — the run used the live snapshot file, which is correct and
current. Flagged only so the prompt can be refreshed if convenient; the prompt's *expectation* ("a small,
sane diff") held exactly.

---

## 10. Open items

**None from this run.** Nothing was blocked, so nothing was appended to `OPEN-RULINGS.md` — per that
file's own CTO note, an item an existing rule already answers is work, not a ruling, and spending the
reviewer's attention on a clean no-change run would be a cost with no return.

The onthecase items already open there are unchanged and were not re-litigated: the event-externalId
back-fill (three live conventions — a VSCode-agent job, not an import run's work) and the unreliable
`get_by_external_id` venue lookup.

---

## 11. ⚠ What this run does NOT show

The daily diff only ever surfaces rows that changed since the last snapshot. **A 0-added result says
nothing about whether all 275 standing rows are present in bndy.** This run did not audit coverage and
must not be cited as evidence of it. The last full reconciliation of this source was the 2026-04-29/30
import (285 events); everything since has been incremental. If coverage assurance is wanted, that is a
separate authorised pass, not a scheduled run's work.

---

## Artefacts

- `data\raw\onthecasemusic\2026-08-07\gigs-raw.html` (363,572 bytes, as served)
- `data\raw\onthecasemusic\2026-08-07\capture-normalised.txt` (33,108 bytes, 275 rows / 116 dates)
- `data\raw\onthecasemusic\2026-08-07\records.json` (275 records with gig / venue / band ids)
- `data\raw\onthecasemusic\2026-08-07\parse_otc.py` (the parser, so the capture is reproducible)
- `data\state\heartbeat\onthecasemusic-2026-08-07T03-31-00Z.json`
- `data\state\onthecasemusic-last-page.txt` — **unchanged**, verified byte-identical to today's capture
