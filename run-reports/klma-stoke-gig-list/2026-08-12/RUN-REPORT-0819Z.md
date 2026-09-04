# KLMA Stoke gig list — run report

**Run id:** `klma-stoke-gig-list-2026-08-12T08-19-07Z`
**Fired:** 2026-08-12T08:19:07Z · **Finished:** 2026-08-12T08:32Z
**Outcome:** completed
**Runbook read:** `RUNBOOK.md` H1 **v2.27**. §6A CURRENT FLOOR is **v2.19**. v2.27 ≥ v2.19, so the run proceeded.
**Prompt floor:** the task prompt states no numeric floor. It defers to §6A, which is what §6A step 2a requires. No drift to report on this source's prompt.
**Spec read:** `sources/klma-stoke-gig-list.md`, in full, including §VA and §VA.9.
**Inbox read:** `CTO-INBOX.md`, all 60 open lines. Fingerprints checked before any append.

⚠ **This is the SECOND firing of this task today.** The first ran 00:11:33Z → 00:52Z and its report is
`RUN-REPORT.md` in this same folder. This report is written to a sibling filename so that report
survives. See item 9.

---

## 1. Headline

| | |
|---|---|
| Events created | **0** |
| Artists created | **0** |
| Venues created | **0** |
| Events edited (written and read back) | **4** |
| Deletions | **0** |
| Rows skipped / parked | **0** |
| Validator | **0 FAIL** |

**Section 1 (KLMA sheet): 0 added / 0 removed against the 00:15Z snapshot. 404 of 404 row hashes identical.**
**Section 2 (Sugarmill): 0 added / 0 removed against the 00:30Z snapshot. 25 of 25 dated rows identical.**

The curator has not touched the sheet in the eight hours since the first run captured it. That is an
honest no-change run on section 1, and it is a real result, not a failure.

**What this run did find:** the Sugarmill venue page now labels three of its gigs with a booking
state — two `SOLD OUT`, one `RESCHEDULED` — and none of the three was in bndy. Four existing events
were corrected. That is the whole of this run's write activity.

---

## 2. Step-by-step against §6A

| Step | Action | Result |
|---|---|---|
| 0 | Heartbeat written first | `data/state/heartbeat/klma-stoke-gig-list-2026-08-12T08-19-07Z.json`, `outcome: started` |
| 1 | Today's date | 2026-08-12 (shell `date`) |
| 2 | Runbook then spec read in full | v2.27 / spec current |
| 2a | Floor assert from the runbook, not the prompt | v2.27 ≥ v2.19 PASS |
| 2b | Claim check on `data/state/claims/klma-stoke-gig-list.json` | `heldBy: null`, released 00:52Z by the earlier run → **acquired**, TTL 2h, `expiresAt` 10:22Z. No takeover. No dead holder. `enrichment.lock` not present and not recreated. |
| 3 | Tools verified | bndy MCP reachable (`get_by_external_id` returned a live record). Chrome connected, tab group present. |
| 4 | Capture | Section 1 via Chrome on the gviz `out:html` endpoint. Section 2 via `fetch()` + `DOMParser` in `javascript_tool`. |
| 5 | Two-sided diff | 0/0 on both sections. Snapshot present, so no first-run carve-out needed. |
| 6 | Pipeline | No added rows to pipeline. Four corrections written instead. |
| 7 | Snapshot + report | Both written. See items 5 and 9. |
| 7b | `run-summary.jsonl` appended | one line, counts of records actually written |
| 8 | Validator | ran, `0 records · 0 clean · 0 FAIL · 0 WARN [mode=gate]`, exit 0 |
| 8 | Daily note | `20-Daily/2026-08-12.md` appended |
| 9 | Inbox | 2 new items appended, both with fresh fingerprints |

---

## 3. Section 1 — the KLMA sheet

**Surface.** Chrome on
`https://docs.google.com/spreadsheets/d/1atEqyN.../gviz/tq?tqx=out:html&gid=831966245`.
`web_fetch` was not used on this endpoint. The spec records that it serves an eight-week-stale
cache with a 13-column layout, and Chrome is the only trusted surface.

**Column alignment verified before parsing anything.** The trailing header row is DOM row 399 of 404.
Its cells read:

```
[2] Artist  [3] Venue & Location  [5] Cost/Ticket  [6] Genre  [7] Link to Event
```

14 columns. This is the post-2026-08-06 layout in the spec's field-mapping table. **No off-by-one.**
The §VA.5(b) genre-bleed check therefore has nothing to report this run.

**Diff.** 404 rows captured. 404 rows in the snapshot. Every row hash matched.

- **0 added.** Nothing to pipeline.
- **0 removed.** Nothing to consider for §0.17, and nothing was deleted.
- No past-dated drop-off either, which is itself expected: the sheet has not been re-exported since
  00:15Z and no date has rolled over between the two captures.

**§5.7(a) normalisation.** Both sides were normalised identically before comparison, by the eight
rules now written into the snapshot's own header. Whitespace collapsed, cells trimmed, a trailing
comma / full stop / slash stripped, a trailing country suffix lower-cased, entities decoded once.
Facebook tracking parameters were **not** stripped in the snapshot — that cleaning happens only at
`eventUrl` write time, and stripping it in the snapshot would manufacture phantom added/removed pairs.

**§5.7(a) self-diff gate.** The snapshot as written was re-diffed against the capture it came from:
**0 added / 0 removed / 404 of 404 hashes identical. PASS.** Reported here as the rule requires.
No deletion was proposed in the first place, so the gate had nothing to hold back.

**§0.29 mode.** The spec still declares neither `delta` nor `append-only`. The run treated the source
as **append-only** and actioned no removal. There were no removals to action, so the choice cost
nothing this run. Already raised as `klma-no-delta-mode-declared`; **not re-raised** (inbox rule 5).

---

## 4. Section 2 — The Sugarmill (sole-source feed, §VA.9)

**Capture obeyed §0.22.** `fetch()` + `DOMParser` inside `javascript_tool`, same-origin, reading
`a[href]` directly. `get_page_text` is forbidden here and was not used: the per-gig slug and the
Gigantic ticket link both live in anchors and a text scrape discards them.

**Shape, and it is unchanged.** 40 `div.row2` elements → **30 distinct gigs** after deduplicating by
slug. 25 carry a dated title heading. 5 carry no title heading — the same five as the 00:30Z capture.

**Diff: 0 added / 0 removed.** All 25 dated rows are byte-identical to the snapshot. All five undated
slugs are the same five, and all five were already resolved and dispositioned by the 00:11Z run
(three imported, two rejected as 23:00 club nights). Nothing was re-litigated.

### 4.1 What is new — three booking-state markers

Three headings now end in a status marker. **None of the three was in the 00:30Z snapshot**, so they
are either new in the last eight hours or were stripped by that run without being recorded. This run
cannot tell which, and does not need to: the marker is a fact a punter needs and bndy did not hold it.

| Slug | Heading, verbatim | Read as |
|---|---|---|
| `declan-mckenna-monday-24th-august-2026` | `DECLAN MCKENNA + SAINT CLAIR – **SOLD OUT!**` | sold out |
| `arkayla-saturday-19th-september-2026` | `ARKAYLA – – SOLD OUT!` | sold out |
| `the-year-grunge-broke-saturday-6th-december-2025` | `THE YEAR GRUNGE BROKE – **RESCHEDULED**` | rescheduled |

**A booking state is never part of an act name (§0.6).** All three act names are unchanged, and no
artist record was touched. The marker was stripped from the row before the section-2 diff, which is
why the diff is honestly 0/0 rather than 3 removed / 3 added. That stripping rule is now written into
the snapshot header as section-2 rule 6, per §5.7(a)'s instruction to record the normalisation applied.

### 4.2 The four writes

Each was read back with `get_by_id` after the write (§0.10). `externalIds` intact on all four.

| # | Event | Full id | Field written | Value |
|---|---|---|---|---|
| 1 | Declan McKenna @ The Sugarmill, 2026-08-24 | `1c3a7d9e-a7ca-410e-9839-fa6e6f4d5dc5` | `ticketInformation` + `ticketUrl` | `Sold out.` · `https://www.gigantic.com/declan-mckenna-tickets/stoke-on-trent-the-sugarmill/2026-08-24-19-00` |
| 2 | Saint Clair @ The Sugarmill, 2026-08-24 | `7aa42481-efa4-48c7-959e-365873f3c859` | `ticketInformation` | `Supporting Declan McKenna. Sold out.` |
| 3 | Arkayla @ The Sugarmill, 2026-09-19 | `95d6226b-bed5-4fa4-8efd-dec63d6b10c9` | `ticketInformation` + `ticketUrl` | `Sold out.` · `https://www.gigantic.com/arkayla-tickets/stoke-on-trent-the-sugarmill/2026-09-19-19-30` |
| 4 | The Year Grunge Broke @ The Sugarmill, 2026-09-04 | `0f6328f1-8afa-429d-bf3f-07399d4987b3` | `ticketInformation` | `Rescheduled by the venue to this date.` |

**Saint Clair is the same gig as Declan McKenna** — a §4 split of one bill into two discrete events.
A sell-out applies to the bill, so it applies to both children. Its existing
`Supporting Declan McKenna.` text was preserved and extended, not replaced.

**Both stored ticket URLs pass the §VA.9 test** — the Gigantic path contains
`stoke-on-trent-the-sugarmill`. Event 1 had no `ticketUrl` at all before this run; the spec's known
fault 2 (Declan McKenna carrying no ticket link) was cleared at source and is now cleared in bndy.

**§0.12 respected.** `ticketInformation` is a public field. All four values are punter-facing facts.
No provenance, no QA commentary, no run id.

### 4.3 Why event 4 got no ticket URL

`THE YEAR GRUNGE BROKE` publishes a Gigantic link whose path is
`.../stoke-on-trent-the-sugarmill/2025-12-06-19-00-35550`. The path is a Sugarmill one, so it passes
the §VA.9 venue test — **and it is still not stored.** The date inside it is 2025-12-06, the
superseded date the spec already flags as fault 3, and the venue has now labelled the row
**RESCHEDULED**, which is independent corroboration that the old link is stale. Blank beats wrong.
bndy holds the title date 2026-09-04, which is a Friday and matches the listing. That is unchanged.

### 4.4 Known source faults, rechecked

1. **Still present.** `CHERRY KISS: WHAT'S YOUR TYPE?` (2026-08-22) links to
   `nottingham-1-the-island-quarter` — a different venue. Not stored, not imported; the row is a
   23:00 club night and is rejected on that ground anyway. It remains the only row of 30 whose
   ticket path is not a Sugarmill one.
2. **Cleared, and now written.** `DECLAN MCKENNA` has a Sugarmill Gigantic link. See 4.2.
3. **Still present, now corroborated.** `THE YEAR GRUNGE BROKE`. See 4.3.
4. **Still present.** Five `div.row2` rows carry no title heading. Unchanged set, already resolved.

---

## 5. §VA — venue-authoritative checks

§VA.7 requires a per-venue statement. **Section 1 had zero added rows, so there was no billing to
spell-check and no name to correct.** The venues were still probed, because §VA.6 step 2 asks for it
and because an unchecked venue reported as checked is the failure §VA exists to prevent.

| Venue | Surface | Result |
|---|---|---|
| **Cosey Club** `LHrDNnXeCU1eirDOxUKc` | `thecosey.co.uk/shows` | **Reachable.** Wix. First render only; the "Load More" tail was not expanded, because with zero added sheet rows there was nothing to merge it against. |
| **Eleven** `8Pky4flebxSt2s36ub3o` | `elevenmusicvenue.co.uk/gigs` | **Reachable, fetches complete.** Standing conditions still published verbatim: *"Doors open 7.00 - 11.30pm unless otherwise stated"*. Dates render `D.M.YY` (`14.8.26 Ultimate Coldplay £15.00 adv`). |
| **The Rigger** `YOMsEVdj9Y7OMMy88HFV` | `theriggervenue.co.uk/upcoming-event-guide` | **Reachable.** Listing runs from `Open Mic Night Wed 02 Sept`. No prices, as the spec records. |
| **Artisan Tap** `CoS3G3Jr9djE4WSWQqkz` | `artisantap.com/shows` | ⚠ **STILL NO SURFACE.** The page renders 312 characters of chrome — address, newsletter signup — and **zero gig rows**, in a live Chrome tab, not a fetch. This is the fourth consecutive confirmation. **Not reported as checked.** |
| **The Sugarmill** `333e73ff-bdc5-48b7-9821-ce20412e3fee` | `thesugarmill.co.uk/gig-guide/` | **Checked in full.** Sole source, section 4 above. |

- **Names corrected this run:** none. There were no rows to correct.
- **Contradictions flagged this run:** none new. The `Guitar Heads` / `Motorheadache` contradiction of
  2026-08-01 at Eleven was not re-examined, because Eleven is a `specialist_venue` and holds no bndy
  events for a contradiction to affect.
- **Gigs a venue published that KLMA lacks:** not harvested. §VA frames the four sheet venues as
  *correctors* of KLMA billing, not as feeds — only the Sugarmill is sole-source. Harvesting the
  other four would be a scope expansion beyond the diff, on a source that already runs out of budget
  before it runs out of rows. Not done, and named here so the decision is visible rather than silent.

---

## 6. Ordering rule (spec, CTO ruling 2026-08-08)

The gigs-per-artist descending ordering rule did not bind this run: **zero added rows.** For the
record, `john-sewell-not-reached` is still open in the inbox from 2026-08-08 and was **not** cleared
by this run, because John Sewell Music's rows are not *added* rows — they are unchanged rows the
snapshot already records as seen, so the diff cannot surface them. That is the exact failure mode the
inbox item `insangel-snapshot-hides-backlog` describes on another source. Not re-raised here; the
existing item covers it.

---

## 7. Quality report (§6 v2.5 — quality, not error count)

| Class | Count | Detail |
|---|---|---|
| Records created with a verified page | 0 | no artist was created |
| Records created with an evidenced blank | 0 | no artist was created |
| Records staged | 0 | §0A abolished staging; nothing needed it |
| Names sanitised under §0.6 | 3 | three booking-state markers stripped from Sugarmill headings; no act name changed |
| Names staged as non-acts | 0 | |
| Existing records enriched | 4 | four events, listed at 4.2, each read back |
| Defaulted times | 0 | every row carried a published time |
| Corrections applied | 3 | the three status markers |
| Gate bounces (409 / 422) | 0 | no create was attempted |

**This run created nothing, and that is the correct outcome, not a shortfall.** The source published
nothing new. §0A rule 3 is the test: a run should write what the evidence supports. The evidence
supported four corrections and no creates.

---

## 8. Validator (§6A step 8)

```
0 records · 0 clean · 0 FAIL · 0 WARN   [mode=gate]
```

Exit code 0.

⚠ **Stated plainly so the number is not read as more than it is: the record set was empty.** No
artist record was written this run, so the validator had nothing to check. `0 FAIL` here means "no
artist writes to validate", not "four good artist writes". The four event edits are outside the
validator's scope — it checks artist bios, enums, URL form and evidence, and holds no event rules.

**No new line was appended to `data/state/enrichment-evidence-2026-08-12-klma-stoke-gig-list.jsonl`.**
That file's schema is artist-keyed (`artistId`, `capturedFrom`, `capturedText`), and this run enriched
no artist. The evidence for the four event edits is the verbatim heading text recorded at 4.1 and in
the snapshot header, captured before the write.

---

## 9. Files written

| File | Note |
|---|---|
| `data/state/heartbeat/klma-stoke-gig-list-2026-08-12T08-19-07Z.json` | first action, rewritten last |
| `data/state/claims/klma-stoke-gig-list.json` | acquired 08:22Z, released last action |
| `data/state/klma-stoke-gig-list-last-page.txt` | new snapshot, both sections, 56209 bytes |
| `data/normalized/klma-stoke-gig-list/2026-08-12/RUN-REPORT-0819Z.md` | this file |
| `data/state/run-summary.jsonl` | one appended line |
| `20-Daily/2026-08-12.md` | one appended line |
| `CTO-INBOX.md` | two appended lines |

⚠ **The report filename is deliberately NOT `RUN-REPORT.md`.** §6A step 7 fixes the path at
`data/normalized/<slug>/<date>/RUN-REPORT.md` — one file per date. This task fired twice today, so
obeying that literally would have destroyed the 00:11Z run's 37 KB report, which is the only record of
23 events and 16 artists. A sibling filename is the least destructive reading of the rule. **The rule
itself is not changed by this run** (a run never edits a rule); it is raised in the inbox as
`run-report-path-collides-on-second-firing`.

**Snapshot gate (§6A step 7, fail-closed).** This run wrote to bndy, so it could not finish without
writing its snapshot. The snapshot was written and then re-verified against the capture at 0/0.

---

## 10. Raised to `CTO-INBOX.md`

| Fingerprint | Kind | Why |
|---|---|---|
| `sugarmill-status-marker-not-parsed` | RULE | §VA.9's section-2 normalisation has no rule for a trailing `SOLD OUT` / `RESCHEDULED` marker. Three rows carry one. Without a rule each is a phantom removed row plus a phantom added row, and §0.17 acts on removed rows. The stripping rule is in the snapshot header now; it belongs in the spec, and a run never edits a rule. |
| `run-report-path-collides-on-second-firing` | RULE | §6A step 7 fixes one report path per date. A second firing overwrites the first run's report. This run avoided it by hand; the next one may not. |

Fingerprints checked against every open line before appending. Nothing already present was re-raised —
in particular `klma-no-delta-mode-declared`, `prompt-runbook-floor-drift`, `record-run-token-missing`,
`john-sewell-not-reached`, `from-the-jam-vanished-still-live` and `princess-royal-dresden-duplicate`
are all open and all still true, and none is repeated here.

## 11. Not done, and why

- **`record_run` was not called.** It fails on a missing `SOURCE_RUNS_TOKEN`. Known, open as
  `record-run-token-missing`, explicitly non-blocking. `run-summary.jsonl` is the dashboard's input
  and was appended normally.
- **No scheduled task was created, modified or re-enabled** (§0.1).
- **Nothing was deleted.** No file, no record. §0.29 mode undeclared, and there were no removed rows.
