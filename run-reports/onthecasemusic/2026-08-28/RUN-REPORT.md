# onthecasemusic — RUN REPORT 2026-08-28

**Run id:** `onthecasemusic-2026-08-28T03-30-41Z`
**Outcome:** COMPLETED — no-change run. Nothing was written to bndy.
**Runbook read:** `RUNBOOK.md` H1 **v2.27**. §6A CURRENT FLOOR **v2.19**. Floor passed.
**Prompt floor:** the task prompt states no numeric floor. §6A step 2a is the gate that bound this run.
**Spec read:** `sources/onthecasemusic.md` in full.
**Inbox read:** `CTO-INBOX.md` in full. 16 open `otcm` fingerprints noted before any action.

---

## 1. Counts

| Measure | Count |
|---|---|
| Events created | **0** |
| Artists created | **0** |
| Venues created | **0** |
| Events edited | 0 |
| Events deleted | 0 |
| Rows added by the source | 0 |
| Rows removed by the source | 0 |
| Rows changed | 0 |
| Rows skipped | 0 |
| Validator | `0 records · 0 clean · 0 FAIL · 0 WARN [mode=gate]`, exit 0 |

**Quality statement (§6, v2.5).** No record was created, so there is no verified-page create and no
evidenced blank to report. No name needed sanitising. No row was staged. This is an honest
no-change run, not a suppressed one: the capture is byte-identical to the stored snapshot.

---

## 2. Gates, in order

| Step | Result |
|---|---|
| §6A.0 heartbeat | `data/state/heartbeat/onthecasemusic-2026-08-28T03-30-41Z.json`, `outcome: started` |
| §6A.1 date | `2026-08-28` from the sandbox shell (`2026-08-28T03:30:41Z`) |
| §6A.2 runbook + spec | read in full |
| §6A.2a floor | H1 v2.27 ≥ floor v2.19. PASS |
| §6A.2b claim | `data/state/claims/onthecasemusic.json` read `heldBy: null`, released 2026-08-27T12:56Z. Acquired clean. No takeover |
| §6A.3 tools | bndy MCP reachable — `get_by_external_id` returned a clean negative, `get_by_id` returned event `ac4570ba-8df2-449b-8840-86426eafe83e`. Chrome not needed (see §5) |
| §6A.4 capture | `data/raw/onthecasemusic/2026-08-28/run1/`, HTTP 200, 349,633 bytes |
| §6A.5 diff | **0 added / 0 removed / 0 changed** |
| §5.7(a) self-diff gate | **0 added / 0 removed.** PASS, before and after the snapshot write |
| §5.4 tombstone check | `data/state/cancellations.jsonl`, 9 lines read. No create was attempted, so no row was tested against it |
| §2.19 day-file check | `20-Daily/2026-08-28.md` read. enrichment (×3), spider and klma ran today. None touched an onthecase row |

**Mode (§0.29).** The spec still declares neither `delta` nor `append-only`. §0.29 names onthecase as
delta-qualifying on evidence, and both conditions held again this run: the self-diff returned 0/0 and
the capture used the same enumeration method as the stored snapshot (same parser, md5
`4910da5ad72576c5a50959966ca4adc3`, byte-identical to every parser since 2026-08-08). No row was
removed, so the delta permission was never exercised. Already on file as `otcm-mode-not-declared`
(2026-08-14). Not raised twice.

---

## 3. Capture

- 265 rows, 108 dates, 2026-08-27 → 2027-12-26.
- Method: `curl` + regex parse of the server-rendered markup, gig id read from `a[href]` per §0.22.
- Parser copied unchanged from `data/raw/onthecasemusic/2026-08-27/run1/parse.py`, md5 `4910da5ad72576c5a50959966ca4adc3`.
- 265 unique gig ids. 24 rows carry no `band_id` (the `noimage` placeholder). None needed resolving,
  because no row was new.
- The page still heads its list with **Thursday 27 August 2026**, one day past. The site does not
  roll the list at midnight. The single row on that date is gig `131412` "Buskers night", which the
  spec skip list drops in any case. No past-dated row entered the pipeline (§0.14).

---

## 4. Diff

**0 added / 0 removed / 0 changed.** The normalised capture is byte-identical to the rows held in
`data/state/onthecasemusic-last-page.txt`, written by the 2026-08-27 12:45Z run — 15 hours earlier.
The source page has not changed. Byte size is identical too (349,633 bytes both days).

Per §6C this is the **page-not-rolled** class of result, and per §6 it is reported as a real result,
not as an error. §2.18 explicitly keeps the "an honest no-change run is a good run" principle for
diff-based sources.

No row was added, so no artist, venue or event was resolved. No row was removed, so §0.17 and §5.7
removed-row handling did not run. No row changed, so no `edit_event` was needed.

---

## 5. Chrome

Not used and not needed. The spec's "CLIENT-RENDERED — Chrome is mandatory" line remains wrong for
`/gigs`, which is server-rendered ASP.NET and reproduces in full by `curl`. Already on file as
`otcm-chrome-not-mandatory` (2026-08-08). Not raised twice.

---

## 6. Corrections and observations

- Event `ac4570ba-8df2-449b-8840-86426eafe83e` carries externalId
  `{source: onthecasemusic, id: otc-2026-08-28-alex-fawcett-band-old-fox}` — an `otc-` prefixed form,
  not the §6D `<YYYY-MM-DD>-<artist>-<venue>` form. This is the standing
  `otcm-externalid-form-mixed` finding (2026-08-14). Not raised twice, and nothing was rewritten:
  §6B's `edit_event(externalIds)` replace-and-dedupe behaviour means a second form cannot coexist.
- The previous snapshot header carried an unrendered `SELF-DIFF GATE (RUNBOOK 5.7(a)): {GATE}`
  placeholder. This run's header states the real result. No inbox item raised — the gate result was
  recorded correctly in the 2026-08-27 run report, so the placeholder cost nothing.

---

## 7. Outputs

| Artefact | Path |
|---|---|
| Raw capture | `data/raw/onthecasemusic/2026-08-28/run1/gigs.html` |
| Parser | `data/raw/onthecasemusic/2026-08-28/run1/parse.py` |
| Normalised capture | `data/normalized/onthecasemusic/2026-08-28/capture-normalised.txt` |
| Parsed records | `data/normalized/onthecasemusic/2026-08-28/records.json` |
| Validator input | `data/normalized/onthecasemusic/2026-08-28/validator-records.json` (empty — no writes) |
| Snapshot | `data/state/onthecasemusic-last-page.txt` (written, §6A step 7 fail-closed gate satisfied) |
| Daily summary | one line appended to `data/state/run-summary.jsonl` |
| Daily note | one line appended to `20-Daily/2026-08-28.md` |
| Evidence file | none — no artist was created or enriched, so no evidence line was owed |

## 8. CTO-INBOX

Nothing appended. Every observation above already has an open fingerprint in `CTO-INBOX.md`
(`otcm-mode-not-declared`, `otcm-chrome-not-mandatory`, `otcm-externalid-form-mixed`), and rule 4 of
that file forbids raising an item an existing rule or entry already answers.
