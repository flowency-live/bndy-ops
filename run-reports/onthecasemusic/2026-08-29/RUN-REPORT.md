# onthecasemusic — RUN REPORT 2026-08-29

**Run id:** `onthecasemusic-2026-08-29T19-43-14Z`
**Outcome:** COMPLETED — one event edited. No record was created.
**Runbook read:** `RUNBOOK.md` H1 **v2.27**. §6A CURRENT FLOOR **v2.19**. Floor passed.
**Prompt floor:** the task prompt states no numeric floor. §6A step 2a is the gate that bound this run.
**Spec read:** `sources/onthecasemusic.md` in full.
**Inbox read:** `CTO-INBOX.md`. Open `otcm` fingerprints noted before any action.

---

## 1. Counts

| Measure | Count |
|---|---|
| Events created | **0** |
| Artists created | **0** |
| Venues created | **0** |
| Events edited | **1** |
| Events deleted | 0 |
| Events hidden | 0 |
| Rows added by the source | 0 |
| Rows removed by the source | 11 (all past-dated) |
| Rows changed | 1 |
| Rows skipped | 0 |
| Validator | `0 records · 0 clean · 0 FAIL · 0 WARN [mode=gate]`, exit 0 |

**Quality statement (§6, v2.5).** No artist or venue was created, so there is no verified-page create
and no evidenced blank to report. No name needed sanitising. No row was staged. The single write is
a re-bill correction on an existing event, made against an existing artist record. The run reused
that artist; it did not create one.

---

## 2. Gates, in order

| Step | Result |
|---|---|
| §6A.0 heartbeat | `data/state/heartbeat/onthecasemusic-2026-08-29T19-43-14Z.json`, `outcome: started` |
| §6A.1 date | `2026-08-29` from the sandbox shell (`2026-08-29T19:43:14Z`) |
| §6A.2 runbook + spec | read in full |
| §6A.2a floor | H1 v2.27 ≥ floor v2.19. PASS |
| §6A.2b claim | `data/state/claims/onthecasemusic.json` read `heldBy: null`, released 2026-08-28T03:45:00Z. Acquired clean. No takeover. TTL 90 min, `expiresAt` 2026-08-29T21:13:14Z |
| §6A.3 tools | bndy MCP reachable — `get_by_external_id`, `search_artist`, `search_event`, `edit_event`, `get_by_id` all returned. Chrome not needed (see §5) |
| §6A.4 capture | `data/raw/onthecasemusic/2026-08-29/run1/`, HTTP 200, 337,339 bytes |
| §6A.5 diff | **0 added / 11 removed / 1 changed** |
| §5.7(a) self-diff gate | **0 added / 0 removed / 0 changed.** PASS, run after the snapshot write |
| §5.4 tombstone check | `data/state/cancellations.jsonl`, 9 lines read. No entry for Face Value Duo + Crown and Cannon + 2026-11-20. No create was attempted in any case |
| §2.19 day-file check | `20-Daily/2026-08-29.md` read. Only `sceniceye` has run today, and it FAILED at §6A step 3 with no writes. No run has touched an onthecase row today |

**Mode (§0.29).** The spec still declares neither `delta` nor `append-only`. §0.29 names onthecase as
delta-qualifying on evidence, and both conditions held again: the self-diff returned 0/0, and the
capture used the same enumeration method as the stored snapshot (same parser, md5
`4910da5ad72576c5a50959966ca4adc3`, byte-identical to every parser since 2026-08-08). The delta
permission was available but was **not exercised**, because no removed row was a live drop. Already
on file as `otcm-mode-not-declared` (2026-08-14). Not raised twice.

---

## 3. Capture

- 254 rows, 106 dates, 2026-08-29 → 2027-12-26.
- Method: `curl` + regex parse of the server-rendered markup, gig id read from `a[href]` per §0.22.
- Parser copied unchanged from `data/raw/onthecasemusic/2026-08-28/run1/parse.py`, md5
  `4910da5ad72576c5a50959966ca4adc3`.
- 254 unique gig ids. 22 rows carry no `band_id` (the `noimage` placeholder). None needed resolving,
  because no row was new.
- The page now heads its list with **Saturday 29 August 2026**, today. The 27 and 28 August blocks
  have rolled off. No past-dated row entered the pipeline (§0.14).
- Row count 254 against the spec's stated ~275 is a natural decline: the feed has lost its two
  oldest date blocks and gained nothing. It is **not** the §DIFF-SAFETY item 1 "huge diff" class —
  that gate fires on hundreds of added rows, and this run added none.

---

## 4. Diff

**0 added / 11 removed / 1 changed.**

### 4.1 Removed rows — all past-dated, no action (§5.7)

Every removed row sits on 27 or 28 August 2026, both now past. §5.7 states plainly: *"A row
disappearing because its date passed is NOT a cancellation."* §0.17 did not run. Nothing was deleted
and nothing was hidden. Listed verbatim for the record:

| gig id | source date | row |
|---|---|---|
| 131412 | 2026-08-27 | Buskers night at Old Fat Ox Holywell (skip-listed in any case) |
| 131397 | 2026-08-28 | Distant Suns at Old Fat Ox Holywell |
| 131482 | 2026-08-28 | Audios at Ivy House Sunderland |
| 131351 | 2026-08-28 | On the Rocks at Bridge Hotel Durham |
| 126875 | 2026-08-28 | Mike Gatto at Crown and Cannon Winlaton |
| 131372 | 2026-08-28 | Klassix at The Peacock Newcastle |
| 131485 | 2026-08-28 | Alex Fawcett Band at Old Fox Felling Gateshead |
| 131486 | 2026-08-28 | Fontains at Lochside |
| 131487 | 2026-08-28 | Whole Hog at Live Lounge Sunderland |
| 131488 | 2026-08-28 | The Stones Story at Ox & Plough Washington |
| 131489 | 2026-08-28 | Missing Cats at Blacksmiths Arms Gosforth |

### 4.2 Changed row — one re-bill, edited in place

```
OLD  126086 | Brit Pack at Crown and Cannon Winlaton | Front Street / Winlaton Gateshead | 9:00 PM / FREE
NEW  126086 | Face Value Duo at Crown and Cannon Winlaton | Front Street / Winlaton Gateshead | 9:00 PM / FREE
```

Same gig id, same venue, same date (2026-11-20), same 21:00 slot, different act. This is exactly the
class the spec's **DIFF SAFETY item 2** describes: *"the source changed who is playing ONE booking.
EDIT the existing event. Do not create a second one, and do not treat the old act as a
cancellation."* It is the second recorded instance on this source (the first was gig `126270`,
2026-08-07, which produced a sibling event before the rule was written).

**Resolution, in order:**

1. `get_by_external_id(event, onthecasemusic, "2026-11-20-brit-pack-crown-and-cannon-winlaton")` →
   **not found**. The §6D slug form is not what this record holds.
2. `get_by_external_id(event, onthecasemusic, "126086")` → **found**, event
   `94c0b2a7-b141-4dc8-94fc-0521b4ea8624`, "Brit Pack at Crown and Cannon Winlaton", 2026-11-20,
   21:00, artist `4c113f21-28f7-437e-8153-e1f64bd68b90`, venue
   `ed1384a2-4c95-4072-8b22-1f9b25da0e0a`. This is the standing `otcm-externalid-form-mixed` finding
   (2026-08-14) — the bare gig id is one of the three live forms. Not raised twice.
3. `search_artist("Face Value", minConfidence 25)` over 3,297 records → **Face Value Duo**,
   `f01a16e2-35af-402e-9f36-f48e48a597e6`, location Newcastle, avatar
   `graph.facebook.com/FaceValueNE/picture?type=large`, 71%. Same canonical region as the gig
   (North East), and the act is already the source's own billing string. **Reused. No create.**
   §2A.1's trailing-`Duo` rule applies: `Duo` is part of the name and was not stripped.
4. `search_event(artistId f01a16e2…, 2026-11-01 → 2026-12-01)` → no events. No sentinel collision.
5. `data/state/cancellations.jsonl` → no line for this artist + venue + date.
6. `edit_event(eventId 94c0b2a7…, artistId f01a16e2…, title "Face Value Duo at Crown and Cannon
   Winlaton")` → success, `updatedFields: [artist_id, title]`.
7. **Read back (§0.10)** `get_by_id(event, 94c0b2a7-b141-4dc8-94fc-0521b4ea8624)` → `artistId
   f01a16e2-35af-402e-9f36-f48e48a597e6`, `artistName "Face Value Duo"`, date 2026-11-20, startTime
   21:00, `isPublic true`, externalIds `[{onthecasemusic, 126086}]` intact, `updatedAt
   2026-08-29T19:44:40Z`. **Verified.**

**Full UUIDs (§6).**

| Role | UUID |
|---|---|
| Event edited | `94c0b2a7-b141-4dc8-94fc-0521b4ea8624` |
| Artist now billed (reused) | `f01a16e2-35af-402e-9f36-f48e48a597e6` (Face Value Duo) |
| Artist previously billed | `4c113f21-28f7-437e-8153-e1f64bd68b90` (Brit Pack) |
| Venue (unchanged) | `ed1384a2-4c95-4072-8b22-1f9b25da0e0a` (Crown and Cannon, Winlaton) |

No externalId was rewritten. No sibling event was created. Brit Pack was not treated as a
cancellation and no tombstone was written, because the booking still exists — only its act changed.

---

## 5. Chrome

Not used and not needed. The spec's "CLIENT-RENDERED — Chrome is mandatory" line remains wrong for
`/gigs`, which is server-rendered ASP.NET and reproduces in full by `curl`. Already on file as
`otcm-chrome-not-mandatory` (2026-08-08). Not raised twice.

---

## 6. Defaulted times, corrections, gate bounces

- **Defaulted times:** none. No event was created, and the edited event kept its published 21:00.
- **Date corrections (§5.6b):** none.
- **Gate bounces (409/422/500):** none. One tool call in the run wrote, and it succeeded first time.
- **Names sanitised or staged as non-acts (§0.6):** none. No new name entered the pipeline.

---

## 7. Outputs

| Artefact | Path |
|---|---|
| Raw capture | `data/raw/onthecasemusic/2026-08-29/run1/gigs.html` |
| Parser | `data/raw/onthecasemusic/2026-08-29/run1/parse.py` |
| Normalised capture | `data/normalized/onthecasemusic/2026-08-29/capture-normalised.txt` |
| Parsed records | `data/normalized/onthecasemusic/2026-08-29/records.json` |
| Validator input | `data/normalized/onthecasemusic/2026-08-29/validator-records.json` (empty — no artist write) |
| Snapshot | `data/state/onthecasemusic-last-page.txt` (written, §6A step 7 fail-closed gate satisfied) |
| Daily summary | one line appended to `data/state/run-summary.jsonl` |
| Daily note | one line appended to `20-Daily/2026-08-29.md` |
| Evidence file | none — no artist was created or enriched, so no evidence line was owed |

`record_run` was not called. It fails on a missing `SOURCE_RUNS_TOKEN` and is already on file as
`record-run-token-missing` (2026-08-08). `run-summary.jsonl` is the dashboard's real input and was
appended normally.

---

## 8. CTO-INBOX

Nothing appended. Every observation above already carries an open fingerprint in `CTO-INBOX.md` —
`otcm-mode-not-declared`, `otcm-chrome-not-mandatory`, `otcm-externalid-form-mixed`,
`record-run-token-missing` — and rule 4 of that file forbids raising an item an existing rule or
entry already answers. The re-bill itself is not an item: `sources/onthecasemusic.md` DIFF SAFETY
item 2 already rules it, and the rule worked.
