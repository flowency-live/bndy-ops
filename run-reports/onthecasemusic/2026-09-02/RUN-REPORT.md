# onthecasemusic — RUN REPORT 2026-09-02

**Run id:** `onthecasemusic-2026-09-02T03-30-50Z`
**Outcome:** COMPLETED. Snapshot written. Validator 0 FAIL.
**Runbook read:** `RUNBOOK.md` H1 **v2.27**. Current floor **v2.19** (§6A). Assertion PASSES.
**Prompt floor:** the task prompt names no numeric floor. §6A step 2a is the gate that binds.
**Spec read:** `sources/onthecasemusic.md`, in full.
**Inbox read:** `CTO-INBOX.md`. Fingerprints extracted before any item was considered.

---

## 1. Counts

| Measure | Count |
|---|---|
| Events created and read back | **0** |
| Events edited and read back | **1** |
| Events deleted and read back | **1** |
| Events hidden | 0 |
| Artists created with a verified page | 0 |
| Artists created with an evidenced blank | 0 |
| Artists reused | 1 |
| Venues created | 0 |
| Venues reused | 1 |
| Rows skipped, with reason | 0 |
| Names sanitised or staged as non-acts (§0.6) | 0 |
| Validator | 0 records · 0 FAIL · 0 WARN |

Every count is of a record written to bndy and read back with `get_by_id` (§0.10).
No count is of a row considered.

**This was a near-no-change run.** The source published no new future row. The whole
diff was one re-bill and one drop. That is an honest result, not a failure (§6).

---

## 2. Capture

- Method: `curl` in the sandbox, then a regex parse of the server-rendered ASP.NET markup.
  The gig id is read from `a[href]` (`/venues/<venueId>/<venueSlug>/<GIGID>`) per §0.22.
- Parser: `data/raw/onthecasemusic/2026-09-02/run1/parse.py`, md5 `4910da5ad72576c5a50959966ca4adc3`.
  Byte-identical to the parsers of 2026-08-08 through 2026-09-01, so §0.29's
  same-enumeration-method condition holds.
- Page: HTTP 200, 330,939 bytes.
- Result: **250 rows over 103 dates, 2026-09-03 → 2027-12-26.** 250 unique gig ids.
  22 rows carry no band thumbnail id.
- Chrome was not needed. The spec calls Chrome mandatory for `/gigs`; the standing inbox item
  `otcm-chrome-not-mandatory` (2026-08-08) records that curl reproduces the feed. Not raised twice.

---

## 3. Diff and the §5.7(a) gate

Normalisation applied to both sides before comparing, and written into the new snapshot's
own header so the next run reproduces it:

1. HTML entities decoded once (`&amp;` → `&`).
2. Curly quotes and apostrophes folded to straight.
3. All tags stripped, every run of whitespace collapsed to one space, every cell trimmed.
4. Address split on `/`, empty segments dropped, rejoined with ` / `.
5. Row form `<gigId> | <title> | <address> | <time / price>` under a `Weekday DD Month YYYY` header.

**SELF-DIFF GATE (§5.7(a)): 0 added / 0 removed. PASS.**
The new snapshot was re-read from disk and re-diffed against the capture it was written from.
250 snapshot rows, 250 capture rows, zero difference. Removal handling was therefore permitted.

**Diff against the 2026-09-01 19:47Z snapshot (251 rows): 1 added / 2 removed.**
Small and ordinary. The §DIFF-SAFETY-1 "hundreds of added rows is a capture bug" condition
did not fire.

### 3.1 The single addition is a re-bill, not a new gig

`126259`, Clousden Hill Forest Hall, 2026-11-14, 21:00. The gig id, venue, date and time are
unchanged. The act changed from **Proper Boys** to **The Zoinks**. The spec's DIFF SAFETY rule 2
calls this one booking and requires an EDIT, never a sibling.

- Existing event: `6cec8535-da59-47c8-93b9-a33ccbfba70b`, externalId `onthecasemusic:126259`.
- Incoming act resolved to the existing artist **The Zoinks** `f3e530bf-bb2a-41ab-9f60-1dc8a714483a`
  (Gateshead, North East, 100% match, `search_artist` scanned 3,649). Reused, not created.
- Sentinel pre-check: `search_event(artistId: f3e530bf…, 2026-11-01 → 2026-11-30)` returned none,
  and `search_event(venueId: a1d31424…)` on that date showed no competing Zoinks record. No 409 risk.
- Action: `edit_event(artistId, title)`. Read back: artistId `f3e530bf-bb2a-41ab-9f60-1dc8a714483a`,
  title "The Zoinks at Clousden Hill Forest Hall", externalId `onthecasemusic:126259` intact,
  `updatedAt` 2026-09-02T03:32:49Z.
- No new externalId was written. This source already carries three id conventions
  (`otcm-externalid-form-mixed`, 2026-08-14); a fourth would make it worse.

The dropped act **Proper Boys** `f04c8142-715f-4916-bd50-7b3250cdb8ea` is not a cancellation.
The source moved one booking to a different act. No tombstone for it.

### 3.2 Removed row — a genuine future-dated drop, DELETED under §0.17

`126323`, **Diablo at Clousden Hill Forest Hall, 2026-09-05, 21:00**.

- Absence confirmed against the FULL capture, not a diff artifact: `grep 126323` returns
  **0 occurrences** in the 330,939-byte page. The source now bills **no act at all** at Clousden
  Hill Forest Hall on 2026-09-05 — its next date at that venue is 2026-09-19. So this is not a
  re-bill under DIFF SAFETY rule 2.
- bndy event: `72c9e9cb-28a0-461a-afca-698c3bb6d856`, created 2026-04-30T07:30:04Z.
- §0.17(a) single-source: externalIds are `[{onthecasemusic, 126323}]` only. PASS.
- §0.17(b) not owner-managed: no `owner_user_id` on the record. PASS.
- §0.17(c) absence confirmed against the full capture, self-diff gate 0/0. PASS.
- §0.29 mode: the spec declares none; §0.29 names onthecase as delta-qualifying on evidence, and
  both conditions held (0/0 self-diff, same enumeration method — identical parser md5). Delta
  permission available and exercised once.
- Action: `delete_event`. Read back with `get_by_id`: **not found**. Deletion confirmed.
- Tombstone appended to `data/state/cancellations.jsonl` per §5.4.

### 3.3 No past-dated removals

Today is 2026-09-02. The feed head is 2026-09-03, unchanged from yesterday's snapshot. No row
left the feed because its date passed.

---

## 4. Tombstone check before writes (§5.4)

`data/state/cancellations.jsonl` was read. The only Clousden Hill entry is the 2026-08-30
Riverain 2026-09-19 hide, which does not collide with anything this run touched. No create was
blocked by a tombstone, because no create was attempted.

---

## 5. Enrichment

No artist was created and no artist was enriched, so §2A did no work this run. The evidence file
`data/state/enrichment-evidence-2026-09-02-onthecasemusic.jsonl` was created and is empty, which
is the correct record of a run that wrote no enrichment.

---

## 6. Validator (§6A step 8)

```
0 records · 0 clean · 0 FAIL · 0 WARN   [mode=gate]
exit=0
```

`scripts/enrichment_validate.py --records /tmp/otcm_records.json --evidence
data/state/enrichment-evidence-2026-09-02-onthecasemusic.jsonl`. Zero records because zero
artist writes. Exit 0.

---

## 7. Gate bounces, 409s and 422s

None. No create was attempted.

---

## 8. Concurrency (§6A step 2b, §6G)

`data/state/claims/onthecasemusic.json` read after the runbook, never before it. State was
`heldBy: null`, released by `onthecasemusic-2026-09-01T19-46-21Z`. Acquired normally. No takeover.

- Heartbeat: `data/state/heartbeat/onthecasemusic-2026-09-02T03-30-50Z.json`, named in the claim.
- TTL 90 minutes (§6G table). `expiresAt` 2026-09-02T05:00:50Z.
- Released as the last action with `heldBy: null`.

No `enrichment.lock` was found or created (§6A step 2b, v2.14).

---

## 9. Items raised to CTO-INBOX.md

**None.** Every finding this run is already answered by an existing rule or already carries a
fingerprint in the inbox (`otcm-mode-not-declared`, `otcm-chrome-not-mandatory`,
`otcm-externalid-form-mixed`). Inbox rule 4 and rule 5 both apply. Nothing was appended.

---

## 10. Open rulings

None. Nothing was blocked and nothing needed Jason.

---

## 11. Files written

| File | What |
|---|---|
| `data/raw/onthecasemusic/2026-09-02/run1/gigs.html` | raw page, 330,939 bytes |
| `data/raw/onthecasemusic/2026-09-02/run1/parse.py` | parser, md5 `4910da5ad72576c5a50959966ca4adc3` |
| `data/raw/onthecasemusic/2026-09-02/run1/capture-normalised.txt` | 250 normalised rows |
| `data/raw/onthecasemusic/2026-09-02/run1/records.json` | 250 structured records |
| `data/state/onthecasemusic-last-page.txt` | new snapshot, 250 rows |
| `data/state/cancellations.jsonl` | one tombstone appended |
| `data/state/enrichment-evidence-2026-09-02-onthecasemusic.jsonl` | empty, this run's own file |
| `data/state/run-summary.jsonl` | one line appended |
| `20-Daily/2026-09-02.md` | one line appended |
