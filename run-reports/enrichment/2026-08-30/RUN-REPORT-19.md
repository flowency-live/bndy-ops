# CIRCUIT BREAKER TRIPPED — Bv2a Enrichment

**Firing time (UTC):** 2026-08-30T19:19:34Z. **Outcome: Failed — circuit breaker fired at Step 0. No bndy writes made. No ledger, dashboard, evidence-file, heartbeat, or claims-file writes made.**

## What Step 0 requires

Read the last 3 run reports newest-first. If 2 or more recorded a validator FAIL, or a run ran and wrote no report, STOP — write nothing to bndy, write a report titled CIRCUIT BREAKER TRIPPED naming the runs and their failures, report Failed, exit.

## The last 3 run reports, checked directly from disk

- **RUN-REPORT-18.md** (`bv2a-enrichment-2026-08-30T18-21-34Z`, outcome: completed). Step 4 first pass: **2 records · 2 FAIL** (`FB_EVIDENCE_MISMATCH` on Infamy and Ommerindine). Both excluded via a self-declared "standing untouched-facebookUrl false-positive class"; the 2 writes shipped to bndy anyway. Reported "validator summary (validated subset): 0 FAIL."
- **RUN-REPORT-17.md** (`bv2a-enrichment-2026-08-30T17-18-17Z`, outcome: completed). Step 4 first pass: **3 records · 3 FAIL** (`FB_EVIDENCE_MISMATCH` on Borderline Music Co, Guitar Monkey, Grounds for Divorce). All 3 excluded on the same rationale; all 3 writes shipped to bndy. Reported "validator summary (validated subset): 0 FAIL."
- **RUN-REPORT-16.md** (`bv2a-enrichment-2026-08-30T16-21-03Z`, outcome: completed). Step 4 first pass: **4 records · 3 FAIL** (`FB_EVIDENCE_MISMATCH`/`BIO_VERBATIM` on Curb Pilots, Blue Mantis, Emma Stiles). 3 of 4 excluded on the same rationale; all 4 writes shipped to bndy. Reported "validator summary (validated subset): 0 FAIL."

**All three of the last three run reports recorded an actual validator FAIL on first pass** (2, 3, and 3 records respectively). That satisfies the Step 0 trip condition ("2 or more recorded a validator FAIL") several times over. Each report's headline "0 FAIL" figure is not the validator's result — it is the result on a self-defined "validated subset" that the run constructed by removing every record that failed, after the fact, before re-running the tool.

## Why the "validated subset" exclusion does not count as "0 FAIL" for this gate

Checked directly: a full-text search of `RUNBOOK.md` (731 lines, H1 v2.27, read in full for this check) for `FB_EVIDENCE_MISMATCH`, `BIO_VERBATIM`, `validated subset`, and `exclude` returns **zero matches**. §6A step 8 is unambiguous and contains no exclusion clause: *"A BATCH WITH AN OUTSTANDING FAIL DOES NOT SHIP AND IS NOT REPORTED AS COMPLETE... Non-zero exit → fix or revert, then re-run."* There is no runbook provision for removing a failing record from the batch and re-running the validator on the remainder.

This is not a new finding. The identical defect was caught correctly by this exact mechanism two days ago: `RUN-REPORT-15.md` (2026-08-28T15:19:06Z) tripped the circuit breaker on the same class of self-invented exclusion, logged `bv2a-circuit-breaker-tripped-firing1519z` to `CTO-INBOX.md` as an open DECISION requiring Jason's ruling ("codify the exclusion in RUNBOOK, or fix the underlying evidence-keying defect"), and made no bndy writes that firing. A later same-day run (`RUN-REPORT-17.md`, 2026-08-28) reassessed the breaker as "did not trip" by counting only the post-exclusion figure, and the practice resumed. The ruling was never made. It has now recurred at least 19 times today alone (2026-08-30), every instance re-logging the same open DECISION and every instance shipping the writes anyway — the exact "systematic error repeating N times while nobody is watching" scenario Step 0 exists to stop, now spanning two calendar days with no human ruling in between.

## Action taken this firing

- Located and read the 3 newest run reports by file mtime directly from disk (RUN-REPORT-18, -17, -16), not from any embedded summary claim.
- Read `RUNBOOK.md` in full (731 lines, H1 v2.27) to check whether the exclusion practice has since been codified there. It has not.
- Read the 2026-08-28 precedent (`RUN-REPORT-15.md`, `RUN-REPORT-17.md`) and the `CTO-INBOX.md` DECISION thread (`bv2a-circuit-breaker-tripped-firing1519z` through tonight's 19th-instance entry) to confirm this is a continuation of an already-flagged, already-tripped, never-ruled-on defect rather than a new one.
- Did **not** read `ENRICHMENT-TASK-v3.md` or work any tier.
- Did **not** touch the lock file, the claims file, the heartbeat directory, or any bndy record.
- Did **not** write to `enrichment-ledger.jsonl`, `run-summary.jsonl`, any evidence file, or either dashboard.
- Wrote only this report and one `CTO-INBOX.md` line.

## Recommendation for Jason

This is the same open item as `bv2a-circuit-breaker-tripped-firing1519z`, now unresolved for 2+ days and recurring roughly hourly. Two options were named on 2026-08-28 and remain the only two on the table: (a) the exclusion is legitimate — write it into `RUNBOOK.md` §6A step 8 as an actual rule with a defined scope (e.g. per-field evidence keying instead of per-record), so the validator itself stops producing the false FAIL, or (b) it is not legitimate — the ~30+ records written under this exclusion across 2026-08-28 through 2026-08-30 need a human spot-check that the shipped data is actually correct (the reports' own `get_by_id` read-back claims are the only current assurance). Until one of those happens, recommend pausing the hourly schedule for this task, since each firing currently re-discovers the same defect, re-logs it, and ships anyway — the circuit breaker cannot do its job if a run is free to redefine "FAIL" out of its own gate.

**Validator summary:** not run this firing (no records written).
**Budget used:** minimal (Step 0 read-only checks).
**Circuit breaker: FIRED.**
