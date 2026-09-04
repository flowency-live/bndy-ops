# onthecasemusic — RUN REPORT 2026-08-14 (second firing)

**Outcome: COMPLETED. NO CHANGE.** The feed did not move. Nothing was written to bndy. Snapshot written. Validator 0 FAIL.

| field | value |
|---|---|
| runId | `onthecasemusic-2026-08-14T03-30-36Z` |
| fired (UTC) | 2026-08-14T03:30:36Z |
| local date (§6A step 1) | 2026-08-14 (`date +%Y-%m-%d`) |
| runbook read | `RUNBOOK.md` H1 **v2.27**, in full |
| floor asserted (§6A step 2a) | **v2.19**. 2.27 ≥ 2.19, so the run proceeded. |
| floor named in the task prompt | **none**. The prompt states no version and defers to §6A. No drift to report. |
| spec read | `sources/onthecasemusic.md`, in full |
| CTO-INBOX read | yes. Fingerprints checked before any append. |
| heartbeat | `data/state/heartbeat/onthecasemusic-2026-08-14T03-30-36Z.json` |
| claim | `data/state/claims/onthecasemusic.json`. Acquired from a released record (`heldBy: null`, released 2026-08-14T00:12:11Z). **No takeover.** TTL 90 minutes, `expiresAt` 2026-08-14T05:00:36Z. |
| report path | `RUN-REPORT-2.md`. `RUN-REPORT.md` holds the first firing of the same date. The §6A step 7 path is per date, so a second firing would overwrite it. Already in CTO-INBOX as `run-report-path-collides-on-second-firing`. Not raised twice. |

---

## 1. Counts

| | n |
|---|---|
| Events created | **0** |
| Events edited | 0 |
| Events deleted | 0 |
| Artists created | **0** |
| Artists topped up | 0 |
| Venues created | **0** |
| Rows skipped | 0 |
| Gate bounces (409/422/500) | 0 |
| Creates against the 50 cap | 0 of 50 |

**This is an honest no-change run, not a failed one.** The first firing of 2026-08-14 completed at 00:12Z and imported all 23 added rows. This firing captured the same feed 3.5 hours later and found it identical. There was no work to do. §6 quality reporting therefore has no records to report: 0 created with a verified page, 0 created with an evidenced blank, 0 staged, 0 names sanitised.

## 2. Tools (§6A step 3)

- bndy MCP reachable. Verified with a live read: `get_by_external_id(event, onthecasemusic, 126595)` returned `d7346c29-6efb-40fb-a3e9-d2714a56e736`, title `Babel Fish @ Clousden Hill`, `isPublic: true`, externalId intact. This confirms the first firing's re-bill edit is still correct in bndy.
- Chrome was not needed. No artist was created, so no §2A enrichment arose.
- `record_run` not called. It fails on a missing `SOURCE_RUNS_TOKEN`. Already in CTO-INBOX as `record-run-token-missing`. Not blocking. `run-summary.jsonl` is the dashboard input and was appended.

## 3. Capture (§6A step 4)

- URL `https://onthecasemusic.co.uk/gigs`, fetched with `curl` in the sandbox. 383,343 bytes — the same byte count as the 00:56Z capture.
- Parser `data/raw/onthecasemusic/2026-08-14/run2/parse.py`, md5 `4910da5ad72576c5a50959966ca4adc3`. Byte-identical to the 2026-08-08, 2026-08-12 and first-firing parsers. Gig ids read from `a[href]` per §0.22. No `get_page_text`. No synthetic ids.
- **294 rows over 114 dates, 2026-08-13 → 2027-12-26.** 294 unique gig ids. 29 rows carry no `band_id` (the `noimage` placeholder).
- Raw and normalised capture: `data/raw/onthecasemusic/2026-08-14/run2/{gigs.html,capture-normalised.txt,records.json}`. The first firing's files were not overwritten.

## 4. Diff (§6A step 5, §5.7)

Diffed on `(date, gig_id)` first, then on the row text, per the spec's DIFF AND CAPTURE SAFETY item 2.

| | n |
|---|---|
| Snapshot rows (first firing, 2026-08-14T00:12Z) | 294 |
| Capture rows (2026-08-14T03:31Z) | 294 |
| **Added** | **0** |
| **Removed** | **0** |
| **Changed** | **0** |
| gig ids that moved date | 0 |

**§5.7(a) SELF-DIFF GATE: the new snapshot re-diffed against the capture it was written from at 0 added / 0 removed / 0 changed.** The gate passes, so deletion was permitted. The run deleted nothing, because the diff reported no removed rows.

The five normalisation rules in the snapshot header were applied to both sides before comparing. They are unchanged from the first firing.

### §0.29 mode

The spec declares **no mode**. §0.29 names onthecase as qualifying for `delta` on evidence, and this run produced the 0/0 self-diff that §0.29 requires. The question did not become load-bearing: **zero removed rows, so no deletion decision arose.** Already in CTO-INBOX as `otcm-mode-not-declared` (2026-08-14). Not raised twice.

## 5. Pipeline (§6A step 6)

No added, removed or changed row. No row entered the pipeline. No venue, artist or event was resolved, created, edited or deleted.

- §5.4 tombstone check: not reached. `data/state/cancellations.jsonl` is checked before an event create, and there was no create.
- Defaulted times: none.
- Corrections applied: none.
- Staged or parked rows: none.
- Gate bounces: none.

## 6. Snapshot (§6A step 7)

Written to `data/state/onthecasemusic-last-page.txt`. 294 data rows, identical to the rows the first firing wrote. The header is updated to record this firing, its 0/0/0 diff and its 0/0/0 self-diff. The data rows are byte-identical, so the file is safe to rewrite and the next run's diff is unaffected.

The snapshot is this source's own file (§6F ownership). No other file was touched.

## 7. Validator (§6A step 8)

```
0 records · 0 clean · 0 FAIL · 0 WARN   [mode=gate]
```

Exit code 0. The run wrote no records, so the record set fed to the validator is empty and the evidence file `data/state/enrichment-evidence-2026-08-14-onthecasemusic.jsonl` was not appended to. That file holds the first firing's evidence and is left untouched.

## 8. CTO-INBOX

**Nothing appended.** Every observation this run could have raised is already on file with a fingerprint:

| observation | existing fingerprint |
|---|---|
| The spec declares no §0.29 mode | `otcm-mode-not-declared` |
| The spec says Chrome is mandatory for `/gigs`; curl reproduces the feed | `otcm-chrome-not-mandatory` |
| Three externalId forms are live on this source | `otcm-externalid-form-mixed` |
| A second firing on one date collides on the report path | `run-report-path-collides-on-second-firing` |
| `record_run` fails on a missing token | `record-run-token-missing` |

## 9. Open items

None. Nothing was blocked and nothing needs Jason.
