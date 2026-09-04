# onthecasemusic — RUN REPORT 2026-08-18 (second firing, 21:31Z)

**Outcome: COMPLETED.** 0 events created, 1 event edited, 0 artists, 0 venues. 1 row carried over. Snapshot written. Validator 0 FAIL.

| field | value |
|---|---|
| runId | `onthecasemusic-2026-08-18T21-31-54Z` |
| fired (UTC) | 2026-08-18T21:31:54Z |
| local date (§6A step 1) | 2026-08-18 (`date +%Y-%m-%d`) |
| runbook read | `RUNBOOK.md` H1 **v2.27**, in full |
| floor asserted (§6A step 2a) | **v2.19**. 2.27 ≥ 2.19, so the run proceeded. |
| floor named in the task prompt | **none**. The prompt states no version and defers to §6A. No drift to report. |
| spec read | `sources/onthecasemusic.md`, in full |
| CTO-INBOX read | yes. Fingerprints checked before any append. |
| heartbeat | `data/state/heartbeat/onthecasemusic-2026-08-18T21-31-54Z.json` |
| claim (§6A step 2b, §6G) | `data/state/claims/onthecasemusic.json` was `heldBy: null` (released 03:43Z). Acquired. TTL 90 minutes. No takeover. |
| caps | 50 creates. Used 0. |
| report path | **`RUN-REPORT-2.md`.** This is the second firing today. `RUN-REPORT.md` holds the 03:31Z run and was not overwritten. Already on file as `run-report-path-collides-on-second-firing`. |

## 1. Counts

| measure | count |
|---|---|
| events created | 0 |
| events edited | 1 |
| venues created | 0 |
| artists created | 0 |
| artists enriched | 0 |
| events deleted | 0 |
| events hidden | 0 |
| rows carried over, not written | 1 (§5) |
| gate bounces (409/422/500) | 0 |

## 2. Capture (§6A step 4)

`curl` of `https://onthecasemusic.co.uk/gigs`, HTTP 200, 374,909 bytes.
Parsed by `data/raw/onthecasemusic/2026-08-18-pm/parse.py`, md5 `4910da5ad72576c5a50959966ca4adc3` —
byte-identical to the parser used on 2026-08-08, 2026-08-12, 2026-08-14, 2026-08-15 and at 03:31Z today.

```
rows 287   dates 113   2026-08-20 -> 2027-12-26
gigIds unique 287
no bandId 29
```

Raw artefacts: `data/raw/onthecasemusic/2026-08-18-pm/{gigs.html,parse.py,capture-normalised.txt,records.json,diff.json,snapshot-header.txt,snapshot-new.txt}`.

**Chrome was not used for the capture.** The spec says `/gigs` is client-rendered and Chrome is
mandatory. That is not borne out: a server-rendered `curl` reproduced the whole feed. Already on file
as `otcm-chrome-not-mandatory`. The spec was NOT edited by this run.

## 3. Mode (§0.29)

The spec declares no mode. §0.29 names onthecase as qualifying for `delta` on evidence, and this run
reproduced the 0/0 self-diff. **The question did not become load-bearing: the single vanished row was
past-dated, so no deletion decision arose.** Already on file as `otcm-mode-not-declared`. Not raised twice.

## 4. Diff (§6A step 5, §5.7)

Diffed on `(date, gigId)` first, then on the row text, per the spec's DIFF SAFETY item 2.
Both sides normalised identically per §5.7(a); the rules are written into the snapshot header.

| result | count |
|---|---|
| added | **0** |
| removed | **1** |
| changed | **1** |

### 4.1 The removed row — past-dated, no action

```
131465 | Monday 17 August 2026 | Buskers night at Red Lion Earsdon Whitley Bay | 8:00 PM / FREE
```

Its date passed. §5.7 states plainly that a row disappearing because its date passed is NOT a
cancellation. It is also a `Buskers night` placeholder, which §0.4 and the spec's skip list bar from
creation, so no bndy event ever existed for it. **No deletion, no tombstone, no inbox item.**

### 4.2 The changed row — a date move on one booking, EDITED not duplicated

```
126222  OLD  Friday 18 September 2026  | Perfect Storm at Crown and Cannon Winlaton | 9:00 PM / FREE
126222  NEW  Saturday 26 September 2026 | Perfect Storm at Crown and Cannon Winlaton | 9:00 PM / FREE
```

Same gig id, same act, same venue, same time, moved date. §0.17: *"Time/detail changes on a source =
EDIT the existing event (found via externalId), never create a sibling."* The capture holds no other
Perfect Storm row and no new gig id on 18 September, so this is one booking that moved, not a second
booking.

**Tombstone check (§5.4, v2.19):** `data/state/cancellations.jsonl` read before the write. It holds
three lines (the file header, PULS/Arden Arms 2026-08-08, Tubesnake/New Hartley 2026-08-22). No match
on Perfect Storm + Crown and Cannon + either date. Nothing tombstoned.

**Sentinel check:** `search_event(artistId, 2026-08-18 → 2027-12-31)` returned exactly one event for
Perfect Storm — the record being edited. No event existed on the target date, so the edit could not
collide.

| field | value |
|---|---|
| event | `39ea6f5c-eaaa-404e-978d-19eba841fee3` |
| artist | Perfect Storm `8b725158-7b81-4a18-9751-380024e1e088` |
| venue | Crown and Cannon, Winlaton `ed1384a2-4c95-4072-8b22-1f9b25da0e0a` |
| externalId | `{source: onthecasemusic, id: 126222}` — unchanged, single form |
| change | `date` 2026-09-18 → **2026-09-26** |
| tool result | `updatedFields: ["date"]` |
| read back (§0.10) | `get_by_id` returns `date: 2026-09-26`, `updatedAt: 2026-08-18T21:33:22.144Z`. **Verified.** |

`startTime` 21:00 is unchanged and is the source's own published stage time (§0.28 case 1).

## 5. Carried over — Eli, gig 131476, still not in bndy

The 03:31Z run skipped this row and stated it for the next run to retry (§0A rule 1(b)). **This run is
that next run.** The row does not appear in the diff, because the 03:31Z snapshot already holds it — so
the retry was performed by reading the previous run report, not by the diff.

| field | value |
|---|---|
| row | `131476 | Eli at Crown and Cannon Winlaton | 2026-09-05 | 9:00 PM / FREE` |
| source band id | `1111` |
| bndy event | `get_by_external_id(event, onthecasemusic, 131476)` → **not found**. Confirmed this run. |
| blocker | new artist `Eli`; Chrome unreachable |

`list_connected_browsers` returned `[]` and `tabs_context_mcp` reported "not connected". This is the
same outage the enrichment task has now logged for 23 consecutive firings today, plus klma, gigs-news,
sceniceye and spider. **§2A.1 item 5 forbids creating an artist bare**, and §2A.5(b) never waives the
identity check on the name, so `Eli` — a two-letter name with a high collision risk — cannot be created
on the evidence available. Under §0A rule 1(b) the row is skipped again and stated here.

**Mitigation applied this run:** the carry-over is written into the snapshot file's own header, so the
next run sees it without needing to read this report. The general defect — a diff cannot re-offer a row
the snapshot already holds — is raised in §9.

**Not escalated.** This is a skip that retries, not a decision for Jason.

## 6. Rows requiring no action

No added rows, so no venue, artist or event pipeline ran (§6A step 6). The standing skips in the feed
(`Buskers night`, `Cancelled`, `to be confirmed`, `Undecided Acoustic Duo`) were unchanged and are not
re-litigated here.

## 7. Quality measures (§6, v2.5)

- Records created with a verified page: **0** (nothing created).
- Records created with an evidenced blank: **0**.
- Records skipped rather than created bare: **1** (Eli, Chrome unreachable, §5).
- Names sanitised or skipped as non-acts: **0 new** — the only non-act rows in the capture were already
  skipped by earlier runs and produced no diff.
- Defaulted start times: **0**. The one write used the source's published time.
- Corrections applied: **1** (§4.2, a source date move, evidenced by the source's own gig id).

## 8. Validator (§6A step 8)

```
python3 scripts/enrichment_validate.py \
  --records data/normalized/onthecasemusic/2026-08-18/records-2.json \
  --evidence data/state/enrichment-evidence-2026-08-18-onthecasemusic.jsonl --mode gate

0 records · 0 clean · 0 FAIL · 0 WARN   [mode=gate]
```

Exit code 0. **Validator 0 FAIL.** The run created and enriched no artists, so the record set is empty
and the evidence file has no lines. `records-2.json` in this directory is the empty validator input.

## 9. Snapshot (§6A step 7)

Written to `data/state/onthecasemusic-last-page.txt`. 287 rows, 113 dates, 2026-08-20 → 2027-12-26.
The header carries the normalisation rules, the capture method, the parser md5, the 0/0 gate result and
the Eli carry-over.

**Self-diff gate (§5.7(a)):** the new snapshot re-diffed against the capture it was written from
returns **0 added / 0 removed / 0 changed**. The gate passes.

**The fail-closed gate is satisfied: this run wrote to bndy and it wrote its snapshot.**

## 10. CTO-INBOX

**Two lines appended.**

| fingerprint | why it is new |
|---|---|
| `skipped-row-swallowed-by-snapshot` | §0A rule 1(b) states that a skipped row is retried by the next run and nothing is lost. For a diff-based source that is false: the snapshot records the row as seen, so no later diff re-offers it. `insangel-snapshot-hides-backlog` is the same defect on one source and framed as a time-budget problem; this line names the rule itself. |
| `otcm-daily-note-append-not-made` | §6A step 8 requires a daily-note line. `20-Daily/2026-08-18.md` held no onthecase line before this run appended one, and the 03:31Z report does not claim one either — so the step was skipped silently, with nothing claiming it and nothing checking it. The sweep's `sceniceye-daily-note-line-absent` covers a line that was CLAIMED and absent; this is the other half of the same gap. |

Nothing else appended. Every other observation is already on file:

| observation | existing fingerprint |
|---|---|
| Chrome unreachable, blocking new-artist creates | `bv2a-chrome-unreachable-23-firings-one-day`, `klma-chrome-unreachable-blocks-artists`, `gigs-news-chrome-unreachable-blocks-artists`, `spider-chrome-unreachable-blocks-new-artists` |
| The spec declares no §0.29 mode | `otcm-mode-not-declared` |
| The spec says Chrome is mandatory for `/gigs`; curl reproduces the feed | `otcm-chrome-not-mandatory` |
| A second firing collides on the report path | `run-report-path-collides-on-second-firing` |
| `record_run` fails on a missing token | `record-run-token-missing` |

## 11. Open items

**None.** No row was staged. No decision was blocked. Nothing was escalated. One row (Eli, gig 131476)
carries to the next run, which is the §0A rule 1(b) disposal and not an escalation.

`record_run` was not called. `SOURCE_RUNS_TOKEN` is absent and the task prompt states this is not
blocking. `data/state/run-summary.jsonl` is the dashboard input and was appended.
