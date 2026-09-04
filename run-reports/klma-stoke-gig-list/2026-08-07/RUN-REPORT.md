# RUN REPORT — `klma-stoke-gig-list` — 2026-08-07

**Outcome: COMPLETED — NO-CHANGE RUN. Zero writes to bndy.**

The source page is **byte-identical** to the snapshot left by the 2026-08-06 run.
Two-sided diff: **0 added / 0 removed / 394 unchanged**. There was therefore nothing
to pipeline, and nothing was created, edited, hidden or deleted.

| | |
|---|---|
| Run id | `klma-stoke-gig-list-20260807T030828Z` |
| Fired | 2026-08-07T03:08:28Z |
| Runbook | **v2.11** — asserted ≥ v2.4 (task floor) and ≥ v2.11 (runbook's own current floor). PASS |
| Source spec | `sources\klma-stoke-gig-list.md`, read in full (incl. §VA, §CT) |
| Standing rulings | `OPEN-RULINGS.md` read in full; the two STANDING RULINGS applied (no stubs; quality reporting) |
| Cap | 50 creates — **0 used** |

---

## §6 QUALITY REPORTING — the four counts stated separately

Per runbook §6 (v2.5) and the 2026-08-01 standing ruling, these are reported
separately and are **not** collapsed into an error count:

| Category | Count | Detail |
|---|---|---|
| Artists created **with a verified page** | **0** | no rows to create from |
| Artists created with an **evidenced blank** | **0** | no rows to create from |
| Artists **STAGED**, with reason | **0** | no rows to create from |
| Names **sanitised or staged as non-acts** (§0.6) | **0** | no rows to create from |
| Events created / edited / deleted | **0 / 0 / 0** | |
| Venues created | **0** | |
| Gate bounces (409/422) | **0** | |

**This is a zero-create run because the source did not change — not because
enrichment was skipped.** No artist record was created, so the no-stubs ruling was
never reached. Had a row been added, the §2A.1 two-surface pass (Facebook page
search *and* Google, per items 3/3b/3c) would have been mandatory before any create.

---

## §6A run contract — step by step

**0. Heartbeat** — written as the first action, before any gate:
`data\state\heartbeat\klma-stoke-gig-list-2026-08-07T03-08-28Z.json`
(`runbookVersion: "v2.11"`, `outcome: "started"`; rewritten to `completed` as the last action).

**1. Date established** — `2026-08-07` (shell `date`).

**2. Runbook + spec read in full.** H1 version **v2.11** ≥ the task's v2.4 floor → proceed.
`OPEN-RULINGS.md` read in full, including the 2026-08-07 additions.

**3. Tools verified.**
- bndy MCP: reachable — probed with `get_by_id(venue, LHrDNnXeCU1eirDOxUKc)`, returned Cosey Club correctly.
- Chrome: connected, tab group active.
- ⚠ `web_fetch` **deliberately not used** — the spec records (2026-08-06) that it serves an
  eight-week-stale copy of this sheet with no staleness signal. **Chrome is the only trusted
  surface for this source** and was the only one used.

**4. Capture** → `data\raw\klma-stoke-gig-list\2026-08-07\capture-gviz-out-html.txt`
- Surface: `gviz/tq?tqx=out:html&gid=831966245` rendered in Chrome.
- Extraction read the DOM table directly (§0.22 — `get_page_text` was **not** used for extraction).
- 396 table rows → 394 non-empty lines, 44,908 bytes.
- Completeness is self-evidencing: the **trailing header row is the last row of the sheet**, and it
  is present in the capture, so the capture reached the end of the data.

**⚠ COLUMN RE-ALIGNMENT CHECK — PASSED (the spec requires this every run).**
Trailing header row read verbatim:

```
idx2 Artist · idx3 Venue & Location · idx5 Cost/Ticket · idx6 Genre · idx7 Link to Event
```

All 396 rows are 14 columns wide. This matches the **current post-2026-08-06 layout**
documented in the spec (`Cost/Ticket` at index 5, Genre and Link shifted right by one).
No further shift has occurred since 2026-08-06. `idx1 Date` and `idx4 Time` render with
blank headers in the trailing row, as they did on 2026-08-06; both were confirmed against
data rows. **No re-alignment was needed and no parsing to a superseded layout occurred.**

**5. Two-sided diff** against `data\state\klma-stoke-gig-list-last-page.txt`.

Snapshot and capture are in the **same format** (§5.7a) — non-empty cells joined by a
single space, blank rows dropped — so the comparison is mechanical.

Method: an FNV-1a 32-bit hash per line on both sides. 394 lines each side,
**394 distinct hashes each side, zero collisions**, and the sequences are identical
**in order** (first differing index = none).

| | |
|---|---|
| Added future rows | **0** |
| Removed future rows (cancellation / §0.17 candidates) | **0** |
| Unchanged | **394** |
| Past rows dropped off the top | **0** |

md5 of capture and of the live snapshot are both `602c3f1353df7bb551a6c8cb08dc2d55`.

**6. Pipeline** — not entered. No added rows.

**7. Report + snapshot.**
- Report: this file.
- Snapshot: `data\state\klma-stoke-gig-list-last-page.txt` — **left in place, because the capture
  is byte-identical to it** (proven line-by-line above, and by md5). Rewriting the same bytes
  would achieve nothing. The fail-closed snapshot gate (§6A step 7) is satisfied on its own terms:
  it binds a run that **wrote to bndy**, and this run wrote nothing; the state file correctly
  represents the page as captured today.

**8. Validator** (§6A step 8, v2.7) — run, against this run's own source-scoped evidence file:

```
0 records · 0 clean · 0 FAIL · 0 WARN   [mode=gate]
exit 0
```

The evidence file `data\state\enrichment-evidence-2026-08-07-klma-stoke-gig-list.jsonl`
was created and is **intentionally empty** — this run performed no enrichment because it
created no records. It is source-scoped per §6A step 8 (v2.9) and owned solely by this run
(§6F), so it cannot collide with the concurrent `bv2a-enrichment` run's file.

**8b. Daily note** — line appended to `20-Daily/2026-08-07.md`.

**9. OPEN-RULINGS** — one item appended (below). No blocked decision was written into any bndy field (§0.12).

---

## §VA — venue-authoritative checks

**NOT RUN, and NOT reported as checked.**

§VA.6 places these checks *after* the sheet capture and *before* the per-gig pipeline —
they exist to settle the ACT NAME on rows about to be imported. **Zero rows were added,
so no name needed settling and no venue page was fetched.**

| Venue | Status this run |
|---|---|
| Cosey Club | **not checked — not required** (no added rows) |
| Eleven | **not checked — not required** (no added rows) |
| The Rigger | **not checked — not required** (no added rows) |
| Artisan Tap | **not checked — not required** (no added rows; still has no proven surface) |

§VA.7 is explicit that *"an unchecked venue reported as checked is the failure this section
exists to prevent"*. None of the four is claimed as checked. The Artisan Tap surface remains
**unresolved** and is unchanged by this run.

---

## Open items carried, not actioned

Both are pre-existing items already before Jason; neither is re-raised, and this run had
no mandate to act on either.

1. **Cosey Club coverage gap (raised 2026-08-06).** The sheet lists 27 future Cosey rows;
   bndy holds 15 events. **This run could not have closed that gap** — the daily diff only
   ever surfaces rows *added since the last snapshot*, so a row that failed to import once is
   invisible to every later run, permanently. Today's 0-added result is consistent with that:
   a no-change diff says nothing about whether the 394 standing rows are all present in bndy.
   The full 382-row reconciliation pass proposed on 2026-08-06 is still the only thing that
   would answer it, and it still needs authorising as its own pass.
2. **Event titles carrying promo copy at Cosey (raised 2026-08-06)** — repair-lane work,
   artist records themselves verified correct. Untouched.

---

## Appended to OPEN-RULINGS.md this run

- 2026-08-07 · tooling · `javascript_tool` output ceiling is ~1,000 characters **and both
  obvious workarounds are blocked by content filters** (raw text containing URL query strings →
  `[BLOCKED: Cookie/query string data]`; base64 → `[BLOCKED: Base64 encoded data]`). Full detail
  in the ruling. Worked around this run by transferring **per-line hashes** instead of content,
  which is sufficient for a diff and for proving a snapshot unchanged, but would **not** be
  sufficient to write a new snapshot on a run where the page had changed.

---

## Honest assessment

Nothing was found wrong and nothing was fixed, because the source did not move in the
~4.5 hours between the 2026-08-06 run's snapshot (23:33) and this run (03:08 UTC). That is
the expected shape for an overnight firing of a community-submitted Google Form.

**The one thing a reader should not conclude from this report is that the source's 394 rows
are all correctly represented in bndy.** This run verified that the *page* has not changed.
It did not, and structurally could not, verify that bndy matches the page — see open item 1.
