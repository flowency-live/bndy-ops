# onthecasemusic — RUN REPORT 2026-08-27

**Run id:** `onthecasemusic-2026-08-27T12-44-01Z`
**Outcome:** COMPLETED
**Runbook read:** `RUNBOOK.md` H1 **v2.27**. §6A CURRENT FLOOR **v2.19**. Floor passed.
**Prompt floor:** this task prompt states no numeric floor. §6A step 2a is the gate that bound this run.
**Spec read:** `sources/onthecasemusic.md` in full.
**Inbox read:** `CTO-INBOX.md` in full. 16 open `otcm` fingerprints noted before any write.

---

## 1. Counts

| Measure | Count |
|---|---|
| Events created | **1** |
| Artists created | 0 |
| Venues created | 0 |
| Events edited | 2 (1 start time, 1 hidden) |
| Events deleted | 2 |
| Rows already in bndy (409 sentinel) | 6 |
| Rows skipped | 0 |
| Validator | `0 records · 0 clean · 0 FAIL · 0 WARN [mode=gate]`, exit 0 |

**Quality statement (§6, v2.5).** No artist was created this run, so no record was created with a
verified page and no evidenced blank was recorded. All six acts in the added rows already existed in
bndy with a resolvable location. No name needed sanitising. No row was staged.

---

## 2. Gates, in order

| Step | Result |
|---|---|
| §6A.0 heartbeat | `data/state/heartbeat/onthecasemusic-2026-08-27T12-44-01Z.json`, `outcome: started` |
| §6A.1 date | `2026-08-27` from the sandbox shell |
| §6A.2 runbook + spec | read in full |
| §6A.2a floor | H1 v2.27 ≥ floor v2.19. PASS |
| §6A.2b claim | `data/state/claims/onthecasemusic.json` read `heldBy: null`, released 2026-08-21T03:41Z. Acquired clean. No takeover |
| §6A.3 tools | bndy MCP reachable. Chrome not needed — see §6 below |
| §6A.4 capture | `data/raw/onthecasemusic/2026-08-27/run1/`, HTTP 200, 349,633 bytes |
| §6A.5 diff | 7 added / 35 removed / 10 changed |
| §5.7(a) self-diff gate | **0 added / 0 removed / 0 changed.** PASS — deletions authorised |
| §5.4 tombstone check | `data/state/cancellations.jsonl`, 6 lines read. No hit on any row this run |
| §2.19 day-file check | `20-Daily/2026-08-27.md` read before any write. gigs-news, klma and sceniceye all ran today. None touched an onthecase row |

**Mode (§0.29).** The spec still declares neither `delta` nor `append-only`. §0.29 names onthecase as
delta-qualifying on evidence, and this run met both conditions: the self-diff returned 0/0, and the
capture used the same enumeration method as the stored snapshot (same parser, md5
`4910da5ad72576c5a50959966ca4adc3`, byte-identical to every parser since 2026-08-08). The run
therefore acted on removed rows. Already on file as `otcm-mode-not-declared`. Not raised twice.

---

## 3. Capture

- 265 rows, 108 dates, 2026-08-27 → 2027-12-26. Snapshot of 2026-08-21 held 293 rows.
- Method: `curl` + regex parse of the server-rendered markup, gig id read from `a[href]` per §0.22.
- Parser copied unchanged from `data/raw/onthecasemusic/2026-08-21/run2/parse.py`.
- 24 of 265 rows carry no `band_id` (the `noimage` placeholder). None of them was in the added set
  except gig 131489, resolved by name against an exact existing record.

---

## 4. Diff, and what was done with each part

### 4.1 Added — 7 rows

Six of the seven were **already in bndy**. Every `create_event` bounced `DUPLICATE_EVENT` on the
artist+venue+date sentinel. Per §0.9 a 409 is a match signal: the run read each existing record back
and made no second write.

| Gig | Row | Existing event | Action |
|---|---|---|---|
| 131485 | Alex Fawcett Band @ The Old Fox, 2026-08-28 21:00 | `ac4570ba-8df2-449b-8840-86426eafe83e` | 409. Already correct |
| 131486 | Fontains @ Lochside, 2026-08-28 21:00 | `1df8aa09-f7a2-456b-95d5-660a62b8ba0f` | 409. Already correct |
| 131487 | Whole Hog @ Live Lounge, 2026-08-28 21:00 | `1180ec2a-bcf0-4027-8d14-656abf88d25c` | 409. Already correct |
| 131488 | The Stones Story @ The Ox & Plough Washington, 2026-08-28 21:00 | `0704141e-aa26-495f-99e6-be5054295634` | 409. Already correct |
| 131489 | Missing Cats @ The Blacksmiths Arms, 2026-08-28 21:00 | `a7c536d7-2296-4b3e-bcb0-06dc79425ba7` | 409. Already correct |
| 131490 | The Stones Story @ Murton Club (Official), 2026-08-30 15:00, £2.00 | `b446d4c6-a06b-4b38-8218-0af33ea3815b` | 409. Already correct |
| 131484 | The Flames @ Ivy House, 2026-12-18 20:00, FREE | **`4443301f-3424-4fe4-9ec6-ea4f5333e853`** | **CREATED**, read back clean |

**Who wrote the six.** All six were created at **2026-08-27T11:56:46Z → 11:57:14Z**, about 47 minutes
before this task fired. They carry no claim and no heartbeat. Each already holds an `onthecasemusic`
externalId in an `otc-<date>-<artist>-<venue>` form — a form no §6D rule produces, and a fifth live
form on this source. Artist, venue, date, start time and price are all correct on all six, so nothing
was corrected and no second id was written (§6B: `edit_event(externalIds)` replaces and dedupes to one
id per source, so adding the §6D form would have destroyed the id that is there).

Both facts are already on file: `otcm-unclaimed-writer-wrote-this-source-rows` (2026-08-21) and
`otcm-externalid-form-mixed` (2026-08-14). Not raised twice. The one new detail — that the unclaimed
writer now writes an id where in August it wrote none — is recorded here rather than as a second line.

**Created record, in full.**
`4443301f-3424-4fe4-9ec6-ea4f5333e853` — The Flames @ Ivy House, 2026-12-18, 20:00 (source-published,
not defaulted), FREE, `ticketed: false`, `isPublic: true`,
externalId `{source: "onthecasemusic", id: "2026-12-18-the-flames-ivy-house"}`.
Artist `b840d474-c280-4cc7-9c3a-a5c57f32d6c7` (The Flames, North East, 100% name match, reused).
Venue `705142b8-bdc6-41ae-b022-5b0fa3b5e7b7` (Ivy House, Worcester Terrace, Sunderland SR2 7AW,
place_id `ChIJHQU5ToRmfkgRxtDmCPa_Ll8`, already carries `onthecasemusic:ivy-house-sunderland`).
Read back with `get_by_id`. Clean.

### 4.2 Removed — 35 rows

22 removals are rows whose date has passed. Not a cancellation (§5.7). No action.

**13 removals are future-dated.** They split cleanly in two.

**(a) 12 rows at New Hartley (source venue 572) — LOGGED, NOT DELETED.**

The source venue resolves to bndy venue `6ebbbf5a-5c3d-44c8-b699-5a02b268ef14`
"New Hartley Residents Club", place_id `ChIJF_YeX4ByfkgRQMUrXF8n5vY`, NE25 0RL.
`search_event` over that venue returned 16 future events. **Every one carries a `lemonrock`
externalId and not one carries an `onthecasemusic` externalId.** §0.17(a) requires the event's
externalIds to be from THIS source only before a deletion. They are not. Nothing was deleted.

| Gig | Row | bndy event still live |
|---|---|---|
| 130196 | Cancelled @ New Hartley, 2026-08-29 | none — `Cancelled` is a §0.4 placeholder, never an artist |
| 130189 | Dreadnought, 2026-09-05 | `26ac6f3a-5432-4552-8740-dc1feea85e3d` (lemonrock `964605-2026-09-05`) |
| 130187 | Diamond Dogs, 2026-09-19 | `45433158-c7db-4f88-bd9e-b40a1cf51fcc` (lemonrock `964607-2026-09-19`) |
| 130178 | Babel Fish, 2026-10-03 | `ffa3a8d3-295f-473a-9a53-9d6f8a32a61a` (lemonrock `964609-2026-10-03`) |
| 130197 | A Band Called Horse, 2026-10-17 | `3d478c12-4682-4d2d-9c62-366b11c2b048` (lemonrock `964698-2026-10-17`) |
| 130194 | Hard Wired, 2026-10-24 | `31d900fc-6755-4a26-99c9-3d0d77d20d29` (lemonrock `964662-2026-10-24`) |
| 131284 | Diablo, 2026-11-14 | `7e5b1c0c-2ea5-4f73-9623-8944349fb73f` (lemonrock `966448-2026-11-14`) |
| 131285 | Nutopians, 2026-11-21 | `3b98b725-0432-459d-9e8a-8ec6e160fcb5` (lemonrock `966449-2026-11-21`) |
| 130209 | Mystery Men, 2026-11-28 | not found in bndy |
| 130199 | Star Breaker, 2026-12-05 | not found in bndy |
| 130195 | Midnight Echoes, 2026-12-12 | `bcfc2356-7948-4eeb-a432-d149c9785644` (lemonrock `964699-2026-12-12`) |
| 131404 | see (b) below | — |

⚠ **This is a structural hole and it is raised to the inbox.** onthecase runs `delta`. lemonrock runs
`append-only` and by §0.29 never removes anything. A row that lemonrock and onthecase both published,
and that only onthecase then drops, can never be actioned by either task. 10 future-dated gigs are
sitting in that state today at one venue. New fingerprint `otcm-lemonrock-pins-dropped-rows`.

**(b) 2 rows were this source's alone — DELETED under §0.17.**

Both passed all three §0.17 conditions: single-source externalIds, no `owner_user_id`, and absence
confirmed against the **full 349,633-byte capture** (0 occurrences of the gig id), not against the diff.

| Event id | Row | Verification |
|---|---|---|
| `070a6f33-1382-40db-8c6b-05322209fa2c` | Hard Wired @ The Crook Hotel, 2026-08-29, gig 131428 | Deleted. `get_by_id` returns `found: false`. No replacement row at that venue on that date; the venue's next capture row is 2026-09-05 |
| `9a42dd77-d394-4960-b814-47019e342e1b` | The Flames @ Old Fat Ox, 2026-08-31, gig 131404 | Deleted. `get_by_id` returns `found: false`. lemonrock lists Face Value Duo at the same venue and date (`78d849f6-ee17-43c0-b304-2e6a488559d5`), so the booking exists and the act changed |

Both tombstoned in `data/state/cancellations.jsonl` per §5.4 (v2.19), with the evidence verbatim.

### 4.3 Changed — 10 rows

**Eight are one source-side venue rename.** Source venue 572 changed its trading name from
`New Hartley SMC` to `New Hartley Club` across every remaining row. **No bndy write was made.**
§0.6 (v2.26) makes the place_id the identity, and the bndy record is already named
"New Hartley Residents Club" at the same place_id and the same postcode (NE25 0RL, confirmed against
the source's own venue page). The bndy name is neither of the source's two names and does not need to
become one. No second venue was created. No rename, so no `nameVariant` was written.

**Row 131375 — start time corrected.** The Stones Story @ The Red Lion (Earsdon), 2026-08-29.
Source moved 8:00 PM → 8:30 PM. Event `17d3f0bf-afd1-4408-bd67-d1e878877c64` edited
`startTime 20:00 → 20:30`. Read back at 20:30. This is a stage time per §0.28; the source publishes no
doors time, so `ticketInformation` was left alone.

**Row 126185 — act withdrawn, no replacement named. Event HIDDEN.**
Gig 126185 keeps its venue, date and 21:00 slot at Crown and Cannon Winlaton and now reads
`to be confirmed`. §0.4 forbids a `to be confirmed` artist, so there is nothing to re-bill to.
Event `e418f9e8-4264-40f2-82a2-4077d7bb880f` (The White Line, 2026-12-18) set `isPublic: false`.
Read back: `isPublic` absent from the record, i.e. false. Not deleted — the booking still exists and
the source may name an act later. Tombstoned in `cancellations.jsonl` with `action: hidden`.
This follows the two hidden re-bills recorded on 2026-08-19.

**Row 130198 — cross-source act disagreement. NO WRITE.**
Gig 130198 at New Hartley, 2026-10-10, changed act `Fossil` → `The Zone`. The bndy event is
`ea228314-1c2c-4751-ae79-624c2d455d74` "Fossil @ New Hartley Residents Club" and it carries a
**lemonrock** externalId only. Two third-party listings disagree about who plays. §5.6b permits a run
to correct a booking only on the act's or venue's OWN page, and neither source is that. The run did
not rewrite another source's record and did not create a sibling event (§0.17 forbids the sibling).
Logged only. Same class as `otcm-rebill-orphans-other-source` (2026-08-12). Not raised twice.

---

## 5. Gate bounces, verbatim

Six `DUPLICATE_EVENT` bounces, all identical in form:

```
{"success": false, "error": "DUPLICATE_EVENT",
 "message": "Event already exists: This artist already has an event at this venue on <date>.
             Artists can only have one gig per venue per day.",
 "existingEventId": "<uuid>", "matchedExternalId": null,
 "hint": "Duplicates are blocked by: (1) externalId match, (2) same artist+venue+date."}
```

Note `matchedExternalId: null` on all six even though all six records **do** hold an
`onthecasemusic` externalId. The sentinel matched on artist+venue+date, not on provenance, because
the id form the existing records carry is not the form this run offered. That is
`otcm-externalid-form-mixed` doing visible work.

**One correction the run made to itself, stated per §6B.** The first attempt at gig 131488 passed
the title `The Stones Story @ The Ox &amp; Plough Washington`. §6B forbids HTML-escaping `&` in a tool
argument. The call bounced 409 before anything was stored, so no `&amp;` reached bndy. Nothing to
repair.

---

## 6. Search discipline and venue resolution

Seven venues resolved, none created. §3 (v2.16) three-probe rule applied wherever the first probe
missed. Two probes returned the correct record at a confidence that reads like noise:

| Source venue | Probe | Confidence | bndy venue |
|---|---|---|---|
| Ox & Plough Washington | `"Ox and Plough"` → **no venues found**; `"Plough", city "Washington"` → hit | **23% low_confidence** | `fe7e00a3-34c7-47a3-84d6-f9dd5d5c6e0c` The Ox & Plough Washington |
| Murton Officials Club Seaham | `"Murton", city "Seaham"` | **27% low_confidence** | `05272a47-5018-4769-8ec2-1b1aa2842423` Murton Club (Official) |
| Old Fox Felling | `"Old Fox", city "Gateshead"` | 64% low_confidence | `5229697a-4b35-41eb-8120-f1cd6a32bf5f` The Old Fox |
| Red Lion Earsdon | `"Red Lion", city "Whitley Bay"` | 67% low_confidence | `7dd36d63-114c-4a5a-8e27-69f8d2c97244` The Red Lion |
| Crook Hotel | `"Crook Hotel", city "Crook"` | 73% medium | `de040d70-21f8-4d99-8c73-9037029960f0` The Crook Hotel |
| Blacksmiths Arms Gosforth | `"Blacksmiths Arms", city "Gosforth"` | 80% medium | `10432a06-e158-448b-a441-582b74455146` The Blacksmiths Arms |
| Lochside · Live Lounge · Ivy House · Crown and Cannon | exact | 100% | `07023f91…` · `e368931e…` · `705142b8…` · `ed1384a2…` |

Every one of those low-confidence hits was opened and its address checked before use, per §3 v2.16.
Both 23% and 27% sit far below the 50% create-new threshold in the spec's match ladder — the ladder
would have said "create" and produced two duplicate venues. This is the fourth and fifth instance of
that trap on this source class. It is already on file as `search-venue-apostrophe`; the defeating
characters here are `&` and a bracketed suffix rather than an apostrophe, but it is one bug and is not
raised again.

Six artists resolved, none created. All six were exact or near-exact name matches already sitting in
the North East, reused per the spec's "a same/near name already in the North East is a prior run's
record — REUSE it" rule.

**Chrome.** The spec's line "CLIENT-RENDERED — Chrome is mandatory" remains unsupported for `/gigs`.
The curl capture produced all 265 rows and passed its own 0/0 self-diff. Already on file as
`otcm-chrome-not-mandatory`. The spec was **not** edited by this run.

⚠ **One new fact about Chrome, recorded here.** The venue **detail** page (`/venues/572/…`) IS
client-rendered: its HTML carries the address, the postcode and the map, but **zero** gig anchors. So
a venue page cannot corroborate a removal without Chrome. This run did not need it — §0.17(c) asks for
absence from the full capture, and the full capture is the `/gigs` page. Recorded so a later run does
not read an empty venue page as evidence.

---

## 7. Defaulted times

None. Every row this run touched published its own time.

---

## 8. Files written

| File | Note |
|---|---|
| `data/state/heartbeat/onthecasemusic-2026-08-27T12-44-01Z.json` | started → completed |
| `data/state/claims/onthecasemusic.json` | acquired 12:44:01Z, TTL 90 min per §6G, released at end |
| `data/raw/onthecasemusic/2026-08-27/run1/` | `gigs.html`, `parse.py`, `records.json`, `capture-normalised.txt`, `diff.json`, `snapshot-candidate.txt` |
| `data/state/onthecasemusic-last-page.txt` | **new snapshot, 265 rows.** Fail-closed gate §6A step 7 satisfied |
| `data/state/cancellations.jsonl` | 3 lines appended (2 deleted, 1 hidden) |
| `data/state/enrichment-evidence-2026-08-27-onthecasemusic.jsonl` | created, empty — no artist was created or enriched |
| `data/normalized/onthecasemusic/2026-08-27/` | this report, `records.json`, `capture-normalised.txt`, `validator-records.json` |
| `data/state/run-summary.jsonl` | one line appended |
| `20-Daily/2026-08-27.md` | one line appended |
| `CTO-INBOX.md` | 1 line appended |

`record_run` was not called. `SOURCE_RUNS_TOKEN` is unset — `record-run-token-missing`, already on
file, and the task prompt states it is not blocking. `run-summary.jsonl` is the dashboard's input and
it was appended.

---

## 9. Raised to CTO-INBOX

**One new item.**

- `otcm-lemonrock-pins-dropped-rows` (RULE) — an `append-only` source pins future rows that a `delta`
  source has dropped, so §0.17(a) can never fire on them. 10 live gigs at New Hartley today.

**Not raised (already on file):** `otcm-mode-not-declared`, `otcm-chrome-not-mandatory`,
`otcm-externalid-form-mixed`, `otcm-unclaimed-writer-wrote-this-source-rows`,
`otcm-rebill-orphans-other-source`, `otcm-rebill-stale-events-six-live`, `search-venue-apostrophe`,
`record-run-token-missing`, `skipped-row-swallowed-by-snapshot`,
`otcm-daily-note-append-not-made`, `otcm-daily-import-legacy-namespace`.

**Nothing needed Jason.** No irreversible or legal decision arose. Both deletions were mechanical
under §0.17 and both are reversible by the next capture that re-lists the row.

---

## 10. Prior-run items still open at this source

Carried forward, unchanged by this run, for visibility only:

- `otcm-rebill-stale-events-six-live` — of the six, four were still live and still absent from the
  capture on 2026-08-21. Not re-checked this run; the two dated before today have now passed.
- `otcm-gigid-strands-on-venue-move` — `570fe867-7067-4174-abc7-be9fafde362b` remains hidden and
  holds gig id 126346, while the live record `331e2766-f2f3-4139-98a8-11fbc9c76ea8` answers to the
  date-slug form. Unchanged.
- `otcm-daily-import-legacy-namespace` — `onthecase-daily-import` appears on four of the records this
  run read (`17d3f0bf…`, `50fdcae7…`, `f09ad304…`, and three venues). Still not in §6D.
