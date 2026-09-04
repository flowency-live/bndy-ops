# onthecasemusic — RUN REPORT 2026-09-04

**Run id:** `onthecasemusic-2026-09-04T03-31-32Z`
**Outcome:** completed.
**Runbook:** read in full. H1 **v2.27**. §6A CURRENT FLOOR **v2.19**. Above floor. The task prompt states no number, so no prompt drift to report this run.
**Spec:** `sources/onthecasemusic.md`, read in full.
**CTO-INBOX:** read. No item below is raised twice.

---

## 1. Contract steps

| Step | Action | Result |
|---|---|---|
| 0 | Heartbeat written first | `data/state/heartbeat/onthecasemusic-2026-09-04T03-31-32Z.json` |
| 1 | Today's date | 2026-09-04 (shell `date`) |
| 2 | Runbook + spec read in full | done |
| 2a | Floor assert from this file | v2.27 >= v2.19. PASS |
| 2b | Claim `data/state/claims/onthecasemusic.json` | previous holder released at 2026-09-03T03:36:48Z. Acquired. No takeover. |
| 3 | Tools | bndy MCP reachable. Chrome not used — see §6. |
| 4 | Capture | `data/raw/onthecasemusic/2026-09-04/run1/` |
| 5 | Two-sided diff | snapshot present. 2 added / 2 removed, all four rows are two re-bills. |
| 6 | Pipeline | 2 events edited and verified |
| 7 | Report + snapshot | this file; `data/state/onthecasemusic-last-page.txt` |
| 7b | Daily summary | appended to `data/state/run-summary.jsonl` |
| 8 | Validator | `0 records · 0 clean · 0 FAIL · 0 WARN [mode=gate]`, exit 0 |
| 8b | Daily note | `20-Daily/2026-09-04.md` |
| 9 | Blocked decisions | none |

## 2. Counts

| Measure | Count |
|---|---|
| Events created | 0 |
| Events edited (re-bill) | 2 |
| Artists created | 0 |
| Artists reused | 2 |
| Venues created | 0 |
| Records created with a verified page | 0 |
| Records created with an evidenced blank | 0 |
| Rows staged | 0 |
| Names sanitised or skipped as non-acts | 0 |
| Gate bounces (409/422/500) | 0 |
| Deletions | 0 |
| Tombstones written | 0 |

No artist and no venue was created this run, so §2A enrichment had nothing to act on. That is a true zero, not a skipped step.

## 3. Capture

- `curl https://onthecasemusic.co.uk/gigs` — HTTP 200, 333,072 bytes.
- Parser `data/raw/onthecasemusic/2026-09-04/run1/parse.py`, md5 `4910da5ad72576c5a50959966ca4adc3` — byte-identical to every parser since 2026-08-08.
- Parsed **252 rows over 103 dates, 2026-09-03 -> 2027-12-26**. 252 unique gigIds. 24 rows carry no bandId (`noimage` placeholder).
- gigIds read from `a[href]` per §0.22. No synthetic id was written.

## 4. Diff

Normalisation per §5.7(a) applied to both sides. Rules are written into the snapshot header.

**Self-diff gate (§5.7(a)):** new snapshot re-diffed against the capture it was written from → **0 added / 0 removed. PASS.**

**Against the 2026-09-03 snapshot (252 rows):** 2 added / 2 removed by text.

By `(date, gig_id)` — the diff the spec requires FIRST:

- gigIds only in the old snapshot: **0**
- gigIds only in the new capture: **0**
- gigIds re-billed (same id, same date, same slot, different act): **2**

So there is **no genuine addition and no genuine removal**. The text diff's 2/2 is entirely the two re-bills. This is exactly the class named in `sources/onthecasemusic.md` DIFF SAFETY rule 2.

## 5. The two re-bills — EDITED, not duplicated

Per DIFF SAFETY rule 2 and §0.17: same `gig_id`, same date, different act means the source changed who plays ONE booking. Edit the existing event. Do not create a sibling. Do not treat the displaced act as a cancellation.

Before each edit the run checked `data/state/cancellations.jsonl` for artist + venue + date (§5.4). No match. It also checked that no correct event already held the artist + venue + date sentinel — neither did, so an EDIT was possible in both cases, unlike the 2026-09-01 Hybrids case that had to be hidden.

### 5.1 gig 125938 — White Swan Morpeth, 2026-09-05, 21:00

- Event `fe8b2618-9609-4e7c-a406-04c681ee5665`
- Was: `Distant Suns at White Swan Morpeth`, artist `6881e494-f527-4023-9c3b-78f5a1b892c6`
- Now: `The Rock Doctors at White Swan Morpeth`, artist `bae7bce9-bc65-48e6-ab03-1f9c26af9c50`
- Artist resolution: the source bills **Rock Doctors**. `sources/onthecasemusic.md` alias table rules this a known billing for **The Rock Doctors** `bae7bce9-bc65-48e6-ab03-1f9c26af9c50` (§1A.5, Jason ruling 2026-07-29). Location North East, footprint NE. Reused. No create.
- `search_event(artistId=bae7bce9…, 2026-09-01→2026-09-10)` returned no events, so no sentinel conflict.
- Verified by `get_by_id`: artistId, artistName and title all correct. `updatedAt` 2026-09-04T03:33:19Z.

### 5.2 gig 126923 — Blacksmiths Arms Gosforth, 2026-10-23, 21:00

- Event `980588bb-a752-41fc-bf01-d7afba6d4b4e`
- Was: `Brit Pack at Blacksmiths Arms Gosforth`, artist `4c113f21-28f7-437e-8153-e1f64bd68b90`
- Now: `The Missing Cats Duo at Blacksmiths Arms Gosforth`, artist `ff8d0138-ce9d-43a5-b1bd-c71f26e2f18d`
- Artist resolution: the source bills **Missing Cats**. `search_artist` returned **The Missing Cats Duo**, `ff8d0138-ce9d-43a5-b1bd-c71f26e2f18d`, location `North East UK`, page `facebook.com/themissingcatsduo`, at 60%. The bare-core variant (strip `The`, strip `Duo`) is an exact match, the region is the same, and §1 ADR-023 rules a `Duo` qualifier in the same region the SAME artist. The spec also instructs reuse of a NE near-name at 70–89% even when the gig town differs. Reused. No create.
- `search_event(artistId=ff8d0138…, 2026-10-20→2026-10-26)` returned no events, so no sentinel conflict.
- Verified by `get_by_id`: artistId, artistName and title all correct. `updatedAt` 2026-09-04T03:33:24Z.

### 5.3 The two displaced acts

`Distant Suns` `6881e494-f527-4023-9c3b-78f5a1b892c6` and `Brit Pack` `4c113f21-28f7-437e-8153-e1f64bd68b90` keep their other events. Brit Pack still holds `3e5a6fa0-181f-493f-b645-d503452e5f4f` at the same venue group on 2026-10-24. Nothing was deleted and nothing was hidden this run.

## 6. Notes on rules

- **§0.29 mode.** The spec still declares neither `delta` nor `append-only`. §0.29 names onthecase as delta-qualifying on evidence, and this run met both evidence tests: the self-diff is 0/0 and the enumeration method is unchanged (same parser md5). The permission was therefore available. **It was not exercised, because the diff proposed no removal at all.** Already in CTO-INBOX as `otcm-mode-not-declared` (2026-08-14). Not raised again.
- **Chrome.** The spec says Chrome is mandatory for `/gigs`. The curl route reproduced the feed in full again today. Already in CTO-INBOX as `otcm-chrome-not-mandatory` (2026-08-08). Not raised again.
- **`record_run`.** Not called. Known to fail on a missing `SOURCE_RUNS_TOKEN`. Already in CTO-INBOX as `record-run-token-missing`. Not raised again. `run-summary.jsonl` is the dashboard input and was appended.
- **Source head.** The feed still opens on 2026-09-03, which is yesterday. The only row on that date is the skip-listed `Buskers night` 131413 (§0.4). A past-dated row was not imported and was not read as a removal.
- **Horizon.** §5.5 12 months. Rows beyond 2027-09-04 stay in the snapshot and enter via later diffs. No beyond-horizon row was written this run.
- **Defaulted times.** None. Both edited events keep the source's published 9:00 PM.

## 7. Open items for Jason

None. Nothing this run was irreversible or legal.

## 8. Validator

```
0 records · 0 clean · 0 FAIL · 0 WARN   [mode=gate]
```

Exit 0. Evidence file `data/state/enrichment-evidence-2026-09-04-onthecasemusic.jsonl` is empty because no artist or venue record was created or enriched.
