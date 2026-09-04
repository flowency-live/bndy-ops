# ScenicEye run report — 2026-08-12

- **Run id:** `sceniceye-2026-08-12T00-18-42Z`
- **Outcome:** COMPLETED. No import. Zero writes to bndy.
- **Runbook read:** `RUNBOOK.md` H1 **v2.27**. Floor in §6A is **v2.19**. Assertion PASSES.
- **Prompt floor:** the task prompt names no version. §6A step 2a is the gate that binds.
- **Spec read:** `sources/sceniceye.md` in full.
- **CTO-INBOX read:** all 42 open fingerprints read before any item was raised.
- **Heartbeat:** `data/state/heartbeat/sceniceye-2026-08-12T00-18-42Z.json`.
- **Claim:** `data/state/claims/sceniceye.json` was `heldBy: null`. Acquired at 00:18:42Z, TTL 90 minutes. No takeover.

## 1. Counts

| Measure | Count |
|---|---|
| Events created | 0 |
| Artists created | 0 |
| Venues created | 0 |
| Records enriched | 0 |
| Records created with a verified page | 0 |
| Records created with an evidenced blank | 0 |
| Rows skipped as past-dated | 31 |
| Rows skipped as an empty-day marker | 3 |
| Names sanitised or skipped as non-acts | 0 |
| 409 / 422 bounces | 0 |
| Items raised to CTO-INBOX | 1 |

**Zero rows were importable.** No row was rejected on judgement. No row was staged.

## 2. Capture

- **Method:** Chrome DOM walk — `h2` day headings plus the following `table`, read with `javascript_tool` (§0.22). `get_page_text` was not used.
- **Chrome state:** `document.hidden` was `true`, `innerHeight` 855. This source is a static Notion table set, not a lazy-loaded feed, so the §6B lazy-load stop does not apply. The capture reproduced the stored snapshot row-for-row, which is the positive proof the render was complete.
- **`javascript_tool` output guards:** the ~1.4 KB truncation guard fired once. The capture was paged in four calls. No `=` guard, no base64 guard.
- **Raw capture:** `data/raw/sceniceye/2026-08-12/capture.txt`.
- **Banner week:** `6 August - 12 August 2026`.
- **Shape:** 7 day tables. Row counts 2 / 7 / 14 / 8 / 1 / 1 / 1. The three single rows are the curator's `No gigs listed` empty-day cells.

## 3. Stale-week check (mandatory, spec)

**The page is CURRENT, not stale.** The banner week `6 August - 12 August 2026` contains today, 2026-08-12.

The page has not rolled since the 2026-08-08 run because the curator rolls on a Thursday and today is a Wednesday. The next roll is due 2026-08-13.

**Every gig row in the window is past-dated:**

| Day | Rows | State |
|---|---|---|
| Thursday 6 August | 2 | past |
| Friday 7 August | 7 | past |
| Saturday 8 August | 14 | past |
| Sunday 9 August | 8 | past |
| Monday 10 August | 0 | `No gigs listed` |
| Tuesday 11 August | 0 | `No gigs listed` |
| Wednesday 12 August | 0 | `No gigs listed` |

Today and the two days before it carry no gigs. There is therefore **no current or future row in the horizon** (`today` → `+14 days`). §0.14 forbids importing a past-dated gig, so the correct result is zero writes.

This is a clean end-of-week null, not the §6C `page-not-rolled` failure class and not an error.

## 4. Two-sided diff (§5.7)

Diffed against `data/state/sceniceye-last-page.txt` (written 2026-08-08).

- **Old rows:** 38. **New rows:** 38.
- **Added: 0. Removed: 0.**

**§5.7(a) normalisation, applied identically to both sides**, per the rule block carried in the snapshot header:

1. NBSP to ordinary space; en/em dash to hyphen; curly quotes to straight.
2. Trailing `, England` stripped from the venue cell. It was present on every row of today's render.
3. Trailing comma, full stop or slash stripped from a cell.
4. Emoji stripped from the act cell; the word tail is kept.
5. Runs of whitespace collapsed to one space; every cell and row trimmed.
6. DOM order preserved. Rows are not sorted.
7. An empty day collapses to one line, `<Day D Month YYYY> - No gigs listed`.

**§5.7(a) gate — the new snapshot was re-diffed against the capture it was written from. Result: 0 added, 0 removed.** The normalisation is reproducible.

**No deletion was considered and none was made.** Two independent reasons: nothing was removed at source, and this source's mode is treated as `append-only` (see §7).

## 5. Rows not imported, itemised

All 31 gig rows below are past-dated. None was rejected on any other ground.

**Thursday 6 August (2):** George Michael - Tribute @ Number 73 Bar & Kitchen · West Brook @ The Crown Inn.

**Friday 7 August (7):** Freddy Saxo @ Stansted Park Garden Centre · MD Duo @ The Centurion · Matt O'Neil @ The Crown Inn · Cheesy Moments @ The Heroes · TJ Quinn @ The Lord Raglan · The Beatniks @ Emsworth Sports & Social Club · Chloe Anne @ The Lifeboat Inn.

**Saturday 8 August (14):** Hybrid Kid · The Monkey Butlers · Shotgun Smile · OB3 · Vestas · Tagalu Cat, all at Staunton Country Park · Dirty Blonde · Astromoda · Mark Harris · Skadacious, all at The Centurion · Sophie Jenkinson @ Stags Head · Forever Queen @ Cowplain Social Club · The Restless @ The Old House At Home · Mama Belle @ The Heroes.

**Sunday 9 August (8):** Pfizer Chiefs · Patch Collins · Mother Shipton · Davey Jones Locker, all Staunton Festival rows · Baxtrax @ Hampshire Rose · T Junction @ The Golden Lion · TJ Quinn @ The Crown Inn · Patch Collins @ The Heroes.

**Empty-day markers (3):** Monday 10, Tuesday 11 and Wednesday 12 August. These are one-cell tables reading `No gigs listed`. They are collapsed per snapshot rule 7 and are not gig rows.

**Standing rulings that would have applied to a future-dated copy of this week, recorded so the next run does not re-derive them:**

- The Centurion `- Music Festival` rows are **ordinary gigs and would be imported**. The venue is a fixed building already in bndy. The spec's 2026-08-08 CTO ruling governs, and the word "Festival" in the billing is not the test.
- The Staunton Country Park `- Staunton Festival` rows would be **skipped**. Staunton Country Park is a park, so no correct Google Place ID exists (§0.23). The address carries only the partial postcode `PO9`.
- `Davey Jones Locker - Staunton Festival | Venue missing from calendar` would be skipped twice over — a named non-place venue cell (§0.23) and a park.

## 6. Verification and tools (§6A step 3)

- **bndy MCP reachable.** `get_by_external_id(event, sceniceye, 2026-08-09-t-junction-the-golden-lion)` returned event `7de5eecb-bf10-4d2d-af8d-a09f718e7f07`, `isPublic: true`, correct externalId. Provenance from the 2026-08-08 run is intact.
- **Chrome connected**, source rendered.
- **Observation, not a defect:** `search_venue("The Centurion", "Portsmouth")` returned `found: false` with `searchedCount: 1`. The venue exists in bndy (spec records `2f01ebc9-…`). §3's three-probe rule already answers this and no venue create was attempted, so no inbox item is raised. It is the sixth recorded instance of a `search_venue` false negative.
- **`record_run` was not called.** It fails on a missing `SOURCE_RUNS_TOKEN`. Fingerprint `record-run-token-missing` is already open in CTO-INBOX and is not raised again.

## 7. Source mode (§0.29)

**`sources/sceniceye.md` declares no `delta` or `append-only` mode.** §0.29 became binding at runbook v2.27 on 2026-08-08 and requires the mode at the top of the spec. A run may not edit a spec (§6F), so this run **defaulted to `append-only`** — the safe reading, since §0.29 says a source earns `delta` by evidence and never by assumption.

The choice cost nothing today: the diff was 0 added and 0 removed, so no removed-row handling could have run either way.

Raised to CTO-INBOX as `sceniceye-mode-not-declared`.

## 8. Validator (§6A step 8)

```
0 records · 0 clean · 0 FAIL · 0 WARN   [mode=gate]
```

Exit code 0. Zero records were written, so the record set fed to the validator was empty. Evidence file for this run: `data/state/enrichment-evidence-2026-08-12-sceniceye.jsonl`, created and empty — no artist was created or enriched, so there was nothing to capture.

## 9. Artefacts written

| Artefact | Path |
|---|---|
| Heartbeat | `data/state/heartbeat/sceniceye-2026-08-12T00-18-42Z.json` |
| Claim | `data/state/claims/sceniceye.json` |
| Raw capture | `data/raw/sceniceye/2026-08-12/capture.txt` |
| Snapshot | `data/state/sceniceye-last-page.txt` |
| Evidence (empty) | `data/state/enrichment-evidence-2026-08-12-sceniceye.jsonl` |
| Run summary line | `data/state/run-summary.jsonl` |
| Daily note line | `20-Daily/2026-08-12.md` |
| This report | `data/normalized/sceniceye/2026-08-12/RUN-REPORT.md` |

A scratch file `data/state/sceniceye-last-page.NEW.txt` was created during snapshot generation. An unattended run cannot delete a file (§6G), so its content is overwritten with a `RETIRED` notice. It is not a snapshot and must never be read.

## 10. Open items

One item raised. No decision waits on Jason for this run to complete.

---

# ScenicEye run report — 2026-08-12, SECOND FIRING

**This section is a second run of the same task on the same date. It does not replace the report above. Two runs fired today, at 00:18Z and at 08:19Z.**

- **Run id:** `sceniceye-2026-08-12T08-19-07Z`
- **Outcome:** COMPLETED. No import. Zero writes to bndy.
- **Runbook read:** `RUNBOOK.md` H1 **v2.27**. Floor in §6A is **v2.19**. Assertion PASSES.
- **Prompt floor:** the task prompt names no version. §6A step 2a is the gate that binds.
- **Spec read:** `sources/sceniceye.md` in full.
- **CTO-INBOX read:** all open fingerprints read before any item was considered.
- **Heartbeat:** `data/state/heartbeat/sceniceye-2026-08-12T08-19-07Z.json`.
- **Claim:** `data/state/claims/sceniceye.json` read `heldBy: null`, released by run `sceniceye-2026-08-12T00-18-42Z` at 00:36:00Z. Acquired at 08:19:07Z, TTL 90 minutes. **No takeover.**

## 11. Counts

| Measure | Count |
|---|---|
| Events created | 0 |
| Artists created | 0 |
| Venues created | 0 |
| Records enriched | 0 |
| Records created with a verified page | 0 |
| Records created with an evidenced blank | 0 |
| Rows skipped as past-dated | 31 |
| Rows skipped as an empty-day marker | 3 |
| Names sanitised or skipped as non-acts | 0 |
| 409 / 422 bounces | 0 |
| Items raised to CTO-INBOX | 0 |

**Zero rows were importable.** No row was rejected on judgement. No row was skipped for any reason other than its date.

## 12. Capture

- **Method:** Chrome DOM walk — `h2` day headings plus the following `table.notion-table`, read with `javascript_tool` (§0.22). `get_page_text` was not used for extraction.
- **Chrome state:** `document.visibilityState` `hidden`, `innerHeight` 728. This source is a static Notion table set, not a lazy-loaded feed, so the §6B lazy-load stop does not apply. Hydration was allowed 9 seconds before the first read. The capture reproduced the stored snapshot row-for-row, which is the positive proof the render was complete.
- **`javascript_tool` output guards:** the ~1.4 KB truncation guard fired twice. The capture was paged in four calls. The `=` guard was pre-empted by transforming `=` to `(eq)` on every return. No base64 guard.
- **Raw capture:** `data/raw/sceniceye/2026-08-12/capture-0819Z.txt`.
- **Banner week:** `6 August – 12 August 2026`, unchanged from the 00:18Z run.
- **Shape:** 7 day tables, 41 rows including 7 header rows. Gig rows 2 / 7 / 14 / 8. The three remaining tables are the curator's `No gigs listed` empty-day cells.

## 13. Stale-week check (mandatory, spec)

**The banner week contains today, and every gig row in it is past-dated.**

The curator rolls the page on a Thursday. Today is Wednesday 2026-08-12. The page has not rolled since Thursday 2026-08-06, so the newest gig row is Sunday 9 August. The next roll is due 2026-08-13.

| Day | Gig rows | State |
|---|---|---|
| Thursday 6 August | 2 | past |
| Friday 7 August | 7 | past |
| Saturday 8 August | 14 | past |
| Sunday 9 August | 8 | past |
| Monday 10 August | 0 | `No gigs listed` |
| Tuesday 11 August | 0 | `No gigs listed` |
| Wednesday 12 August | 0 | `No gigs listed` |

There is **no current or future row inside the horizon** (`today` → `+14 days`). §0.14 forbids importing a past-dated gig, so zero writes is the correct result.

This is an end-of-week null. It is reported as a stale source week per §6C, not as an error.

## 14. Two-sided diff (§5.7)

Diffed against `data/state/sceniceye-last-page.txt`, written by the 00:18Z run.

- **Added: 0. Removed: 0.** The capture is byte-identical to the stored snapshot body.
- Verified mechanically with `diff` over the two normalised bodies. Output empty, exit 0.

**§5.7(a) normalisation, applied identically to both sides**, reproducing the rule block carried in the snapshot header:

1. NBSP to ordinary space; en/em dash to hyphen; curly quotes to straight.
2. Trailing `, England` stripped from the venue cell. It was present on every row of today's render.
3. Trailing comma, full stop or slash stripped from a cell.
4. Emoji stripped from the act cell; the word tail is kept.
5. Runs of whitespace collapsed to one space; every cell and row trimmed.
6. DOM order preserved. Rows are not sorted.
7. An empty day collapses to one line, `<Day D Month YYYY> - No gigs listed`.

**§5.7(a) gate — the new snapshot re-diffed against the capture it was written from returns 0 added, 0 removed.** The normalisation is reproducible.

**No deletion was considered and none was made.** Nothing was removed at source, and this source is treated as `append-only` (§16).

## 15. Rows not imported

The 31 gig rows are the same 31 rows itemised in §5 above. Every one is past-dated. Nothing else changed at source between 00:18Z and 08:19Z.

The three standing rulings recorded in §5 still apply and were not re-derived: The Centurion `- Music Festival` rows are ordinary gigs, the Staunton Country Park rows are skipped under §0.23, and `Venue missing from calendar` is a named non-place.

## 16. Source mode (§0.29)

`sources/sceniceye.md` still declares no `delta` or `append-only` mode. This run defaulted to `append-only`, the same reading as the 00:18Z run.

**No inbox item was raised.** Fingerprint `sceniceye-mode-not-declared` is already open in `CTO-INBOX.md`, dated 2026-08-12. Raising it twice is forbidden by that file's rule 5.

The choice cost nothing: the diff was 0 added and 0 removed, so no removed-row handling could have run either way.

## 17. Validator (§6A step 8)

```
0 records · 0 clean · 0 FAIL · 0 WARN   [mode=gate]
```

Exit code 0. Zero records were written, so the record set fed to the validator was empty. Evidence file for this run: `data/state/enrichment-evidence-2026-08-12-sceniceye.jsonl`, present and empty — no artist was created or enriched, so there was nothing to capture.

## 18. Artefacts written

| Artefact | Path |
|---|---|
| Heartbeat | `data/state/heartbeat/sceniceye-2026-08-12T08-19-07Z.json` |
| Claim | `data/state/claims/sceniceye.json` |
| Raw capture | `data/raw/sceniceye/2026-08-12/capture-0819Z.txt` |
| Snapshot | `data/state/sceniceye-last-page.txt` |
| Run summary line | `data/state/run-summary.jsonl` |
| Daily note line | `20-Daily/2026-08-12.md` |
| This report | `data/normalized/sceniceye/2026-08-12/RUN-REPORT.md` |

The snapshot was rewritten. Its body is unchanged; only the `Fetched` header line records the second capture. A rewrite is safe here because the capture and the stored body are identical, so tomorrow's diff is unaffected either way.

`record_run` was not called. It fails on a missing `SOURCE_RUNS_TOKEN`. Fingerprint `record-run-token-missing` is already open and is not raised again.

## 19. Open items

None. Nothing new was found, and every observation this run made is already answered by an open fingerprint or by a rule.
