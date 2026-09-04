# ONTHECASEMUSIC — RUN REPORT 2026-08-12

**Run id:** `onthecasemusic-2026-08-12T00-24-41Z`
**Outcome:** COMPLETED
**Runbook read:** `RUNBOOK.md` **v2.27**. Current floor **v2.19**. The run is above floor.
**Prompt floor:** the task prompt states no number. It defers to §6A. No drift to report.
**Mode (§0.29):** `delta`. The spec declares no mode at its top. RUNBOOK §0.29 names onthecase as a delta source by evidence. Both delta conditions hold — see §3.
**Heartbeat:** `data\state\heartbeat\onthecasemusic-2026-08-12T00-24-41Z.json`
**Claim:** `data\state\claims\onthecasemusic.json` was released by `onthecasemusic-2026-08-08T09-34-12Z`. This run acquired it. No takeover.

---

## 1. COUNTS

| Measure | Count |
|---|---|
| Events created | **13** |
| Events edited | **2** |
| Artists created | **1** |
| Venues created | **2** |
| Events deleted | **0** |
| Rows skipped | **1** (beyond horizon) |
| 409 / duplicate bounces | **1** |
| 422 bounces | **0** |
| Creates against the 50 cap | 16 of 50 |

### Quality, stated separately (§6, v2.5)

| Class | Count | Detail |
|---|---|---|
| Artists created with a **verified page** | **1** | Audios — `facebook.com/Audiosacoustic`, bio quoted, avatar attached |
| Artists created with an **evidenced blank** | 0 | — |
| Artists **skipped or parked** | 0 | — |
| Names **sanitised** under §0.6 | 0 | No billing contamination in this diff |
| Rows rejected as **non-acts** | 0 | — |

**This run created no stub.** The one new artist carries a page, a verbatim bio, an avatar, a location, genres and an actType.

---

## 2. CAPTURE

- Source: `https://onthecasemusic.co.uk/gigs`
- Tool: `curl` in the sandbox, then a regex parse of the server-rendered ASP.NET markup.
- Gig ids read from `a[href]` per §0.22. No synthetic id was written.
- Raw capture: `data\raw\onthecasemusic\2026-08-12\gigs.html` (357,524 bytes)
- Parser: `data\raw\onthecasemusic\2026-08-12\parse.py` (byte-identical to the 2026-08-08 parser)
- Result: **271 rows, 112 dates, 2026-08-13 → 2027-12-26**, 271 unique gig ids, 28 rows with no band id.

Chrome was reachable and was used for Facebook enrichment only. The spec line "CLIENT-RENDERED — Chrome is mandatory" is again not borne out for `/gigs`. That item is already in `CTO-INBOX.md` as `otcm-chrome-not-mandatory`. It is not raised twice.

---

## 3. DIFF (§5.7)

Snapshot: `data\state\onthecasemusic-last-page.txt`, written 2026-08-08, 271 rows, same capture method as today.

**Result: 14 added · 14 removed · 1 changed.**

This is a normal week. It is not the hundreds-of-rows pattern that the spec's §1 capture-safety rule holds a run on.

### §5.7(a) normalisation gate

Both sides were normalised identically before comparison: whitespace runs collapsed, curly apostrophes straightened, HTML entities decoded once, empty `/`-separated address segments dropped.

**Self-diff of the new snapshot against the capture it was written from: 0 added / 0 removed / 0 changed.** The gate passes. Deletion was permitted. The run deleted nothing — see §5.

### Delta-mode conditions (§0.29)

- (a) The 0/0 self-diff passes. ✅
- (b) The stored snapshot and today's capture use the **same enumeration method** — curl plus the same parser. ✅

---

## 4. ADDED ROWS — what was written

Import horizon is 12 months (§5.5 and §6E), so the cut-off is **2027-08-12**.

| # | Date | Gig id | Artist | Venue | Time | Price | bndy event id |
|---|---|---|---|---|---|---|---|
| 1 | 2026-08-14 | 131423 | GodZZ of Wor | The Ox & Plough Washington | 21:00 | FREE | `d3a4ca33-8e08-4ac3-9072-2b4b53f07062` |
| 2 | 2026-08-14 | 131425 | Whole Hog | The Moorcock | 21:00 | FREE | `ac9a3e4d-e066-458e-ad8c-80fb3c87c033` |
| 3 | 2026-08-14 | 131426 | Tubesnake | Live Lounge | 20:45 | FREE | `ec7f07d1-4be2-46c1-955f-2169483d1666` (409 — see §6) |
| 4 | 2026-08-14 | 131432 | Elenbak | The Frog & Ferret | 21:00 | FREE | `db36a9d2-949e-41fa-af07-4a834afed52b` |
| 5 | 2026-08-14 | 131434 | The Flames | Ivy House | 20:00 | FREE | `d54b1312-1fa7-43a7-b5d7-d65f5ef88cb1` |
| 6 | 2026-08-15 | 131424 | GodZZ of Wor | Sand Dancer | 20:00 | FREE | `f05fba35-b29d-49f8-a42e-971c3cde34e6` |
| 7 | 2026-08-15 | 131427 | The Stones Story | Cullercoats Crescent Club | 21:00 | FREE | `c88bbcce-5db0-4589-9504-a962bf551aed` |
| 8 | 2026-08-15 | 131433 | Whole Hog | The Frog & Ferret | 21:00 | FREE | `ea2aef4b-6d95-4b91-bc6a-d731bcffdc36` |
| 9 | 2026-08-29 | 131428 | Hard Wired | The Crook Hotel | 21:00 | FREE | `070a6f33-1382-40db-8c6b-05322209fa2c` |
| 10 | 2026-09-05 | 131430 | Koolrock Uk | The Crook Hotel | 21:00 | FREE | `c617077a-acd6-43e9-8f10-ed7610dcaaf2` |
| 11 | 2026-09-06 | 131431 | Lock N Load | The Crook Hotel | 16:30 | FREE | `05101002-ff5c-44c1-9ac2-b80973a4e34f` |
| 12 | 2026-11-07 | 131429 | Hybrids | The Crook Hotel | 21:00 | FREE | `025bf2bb-11ce-4f59-86c0-b2b3701dba80` |
| 13 | 2026-12-27 | 131422 | The Zone | Seahorse Sports Bar | 16:00 | £4.00 | `a9d7113c-7e33-4722-8895-8223ae86660e` |
| 14 | 2027-12-26 | 129119 | The Zone | Seahorse Sports Bar | 16:00 | £4.00 | **SKIPPED — beyond horizon.** It is also the moved row of §5. |

**Every time above is published by the source. No time was defaulted.** §5.6 was not used in this run.

Row 13 carries a price, so `ticketed: true` and `price: "£4.00"` per the spec. All other rows are FREE and carry `ticketed: false`.

Every event carries `isPublic: true` and one externalId `{source:"onthecasemusic", id:"<YYYY-MM-DD>-<artist-slug>-<venue-slug>"}` derived from the **bndy** record names, per §6D and the snapshot header.

### Changed row (1)

| Date | Gig id | Old | New | Action |
|---|---|---|---|---|
| 2026-08-21 | 131373 | Steel Blue at The Peacock Newcastle | Audios at The Peacock Newcastle | **Created** `a362af18-6968-4902-a96e-e24d045052f3` |

The source re-billed one live gig id, which is the known behaviour in `sources\onthecasemusic.md` §2. The spec says to EDIT the existing event. **There was no onthecase event to edit.** The only bndy event at that venue on that date is `ae6d16f2-b483-4ceb-a6ec-515d0b578c53` "Steel Blue @ The Peacock", and it carries a **lemonrock** externalId only. §0.17 forbids a run from actioning a record that another source owns. So the run created the Audios event and left the Steel Blue event untouched. The conflict is raised in `CTO-INBOX.md`.

---

## 5. REMOVED ROWS (14) — nothing was deleted

**12 rows are past-dated** (2026-08-08 and 2026-08-09). A row that leaves the listing because its date passed is not a cancellation (§5.7). No action.

**2 rows are future-dated:**

| Date | Gig id | Row | Finding | Action |
|---|---|---|---|---|
| 2026-09-19 | 131399 | The Zone at Old Fat Ox Holywell | The gig id is absent from the whole capture. The bndy event is `5f41d2ed-acf7-480b-a596-f8bac633dbff`. It carries **two** externalIds: `onthecasemusic:2026-09-19-the-zone-old-fat-ox-holywell` **and** `lemonrock:970345-2026-09-19`. | **NOT DELETED.** §0.17(a) permits a delete only when the externalIds are from THIS source alone. Lemonrock still holds an id. Logged, not actioned. |
| 2027-02-07 | 129119 | The Zone at Sea Horse Club at Whitley Bay FC | The gig id is **still in the capture**, moved to 2027-12-26. Same venue, same artist, same 16:00, same £4.00. This is one booking re-dated, not a drop. | **EDITED**, not deleted. See below. |

### Correction applied

Event `862f3dcb-7d40-4935-b885-5e9a1824e28d` "The Zone @ Seahorse Sports Bar":

- date **2027-02-07 → 2027-12-26**
- externalId `onthecasemusic:the-zone-2027-02-07-seahorse` → `onthecasemusic:2027-12-26-the-zone-seahorse-sports-bar`

The old id used a legacy derivation and carried the old date, so a later run could not have matched it. The new id is the §6D form. The record held no other source's id, so the replace was safe under §6B.

**Note for Jason:** the corrected date is beyond the 12-month import horizon. The run did not import a beyond-horizon row. It corrected a record that was already in bndy and was showing the public map a date the source no longer publishes.

### Cancellation tombstones (§5.4)

`data\state\cancellations.jsonl` was read before the first create. It holds one real entry, PULS at Arden Arms on 2026-08-08. **No row in this run matches an artist + venue + date in that file.** Nothing was tombstone-blocked.

---

## 6. GATE BOUNCES — verbatim

One bounce. It is a correct match signal and was obeyed (§0.9).

```
{
  "success": false,
  "error": "DUPLICATE_EVENT",
  "message": "Event already exists: This artist already has an event at this venue on 2026-08-14. Artists can only have one gig per venue per day.",
  "existingEventId": "ec7f07d1-4be2-46c1-955f-2169483d1666",
  "existingEventTitle": "Tubesnake @ Live Lounge, Sunderland",
  "matchedExternalId": null,
  "action": "Use edit_event to update the existing event, or use search_event to find it.",
  "hint": "Duplicates are blocked by: (1) externalId match, (2) same artist+venue+date."
}
```

**Action taken (§5.3):** the existing event was read, then enriched. The onthecase externalId `2026-08-14-tubesnake-live-lounge` was added beside the existing `poster-import-2026-05-03` id. Both ids read back correctly.

The existing event holds `startTime 20:45`; the source publishes 21:00. The existing time came from the venue's own poster, which outranks an aggregator (§VA precedence and §0.28). The time was left as it was.

One further bounce class, resolved without a retry on a varied name:

```
create_artist "Audios" → action: "review"
candidates: Audio Jacks (Morpeth, 60%), AudioShift (Plymouth, 60%)
```

Both candidates have a **different name**, so this is a shared-token fuzzy match and not a collision (§1A.7). Resolved with `confirmNew: true`. The name was not altered to dodge the gate.

---

## 7. VENUES

### Reused (8)

| Source venue | bndy venue | bndy id |
|---|---|---|
| Ox & Plough Washington | The Ox & Plough Washington | `fe7e00a3-34c7-47a3-84d6-f9dd5d5c6e0c` |
| Moorcock Peterlee | The Moorcock | `2622af20-eb18-44bf-a458-3face46306f6` |
| Live Lounge Sunderland | Live Lounge | `e368931e-fbd0-4033-ae7c-0be68e01ad0c` |
| Sand Dancer South Shields | Sand Dancer | `d0084948-7f1e-4457-adbc-dc208ede1633` |
| Cullercoats Crescent Club | Cullercoats Crescent Club | `e9da36df-ac1a-42bc-bb5f-d1309e0e48e1` |
| Crook Hotel Crook | The Crook Hotel | `de040d70-21f8-4d99-8c73-9037029960f0` (spec learned mapping) |
| Sea Horse Club at Whitley Bay FC | Seahorse Sports Bar | `a5f246ed-33d4-465f-8a7b-6f482493f500` (spec learned mapping) |
| The Peacock Newcastle | The Peacock, Kenton | `a180d98b-3e97-461c-8e7b-04301eee110a` |

### Created (2)

| Name | Address | Place id | bndy id |
|---|---|---|---|
| The Frog & Ferret | Coulson St, Spennymoor **DL16 7RS** | `ChIJ0aM1sbqGfkgRXZBlc9K5U7I` | `ed952b1e-e294-4894-a1b7-b5f1c19c60ca` |
| Ivy House | Worcester Terrace, Sunderland **SR2 7AW** | `ChIJHQU5ToRmfkgRxtDmCPa_Ll8` | `705142b8-bdc6-41ae-b022-5b0fa3b5e7b7` |

**§3 three-probe discipline was completed before each create.** For the Frog & Ferret: `search_venue("Frog and Ferret","Spennymoor")` → none; `search_venue("Frog","Spennymoor")` → none over 3 rows; `list_venues(city:"Spennymoor")` → 2 rows, neither one. For Ivy House: `search_venue("Ivy House","Sunderland")` → none; `search_venue("Ivy","Sunderland")` → none over 8 rows; `list_venues(city:"Sunderland")` → 17 rows, none of them.

**§0.24 postcode check.** DL16 is Spennymoor, County Durham. SR2 is Sunderland. Both agree with the source's stated town. Neither is an out-of-region reject.

Google returned "The Frog & Ferret" for a request of "Frog and Ferret". The postcode decides, not the name (Jason ruling 2026-08-09). The match is accepted.

### Venue naming note

`create_venue` returns a blank `postcode` field on both new records while the postcode is present inside `address`. That is already in `CTO-INBOX.md` as `venue-postcode-field-blank` → BLD-66. It is not raised twice.

---

## 8. ARTISTS

### Reused (11)

`GodZZ of Wor a51444bb-bd21-4ba0-b5e0-154c2bc64b95` · `Whole Hog 78747658-eb47-4283-b9d3-b9c18b98ffef` · `Tubesnake f8aa9069-a885-4934-b2bf-b35728444422` · `Elenbak 284fbc41-6377-45a9-bdf5-f47dd864b53d` · `The Flames b840d474-c280-4cc7-9c3a-a5c57f32d6c7` · `The Stones Story 0e0a6bcd-1e2e-4856-9593-8379d9ad0b54` · `Hard Wired 64c6117f-3dd7-49e7-b2ad-7f61f1c64dde` · `Koolrock Uk d109775d-016c-44e7-9442-6cbb818347a7` · `Lock N Load dd7ae7f3-c8ec-4b1c-a088-cd3e29751a74` · `Hybrids 1c2bff07-453a-45c0-ba73-0e133b9f92ae` · `The Zone 2b832e36-e476-4e53-b80f-8f69a4b8ff1a`

### Created (1) — with a verified page

**Audios** — `caccd0d2-7cea-4f5b-9fe0-8f16d4a9c933`

| Field | Value | Where it came from |
|---|---|---|
| name | Audios | Source billing and the page's own name agree |
| artistType | duo | The page states "Acoustic Duo" |
| location / locationType | North East / **regional** | The page states "based in the northeast of England". No town is stated on either surface. §6B Kilmarnock pairing applied. |
| facebookUrl | `https://www.facebook.com/Audiosacoustic` | Found and opened |
| profileImageUrl | `https://graph.facebook.com/Audiosacoustic/picture?type=large` | Handle form, §2A.2. No `scontent` URL. |
| bio | "Audios Acoustic Duo are an international acoustic act based in the northeast of England. Available for events functions partys weddings pubs and clubs" | **Quoted character for character** from the page intro, including the page's own spelling "partys" |
| genres | Pop, Indie, Dance | The source's own band page publishes "Pop / Indie / Dance" |
| actType | covers | The source's band page publishes "Performing 80's, 90's Pop, Indie and Dance classics" |
| acoustic | true | A FLAG, never a genre (§0.18) |
| externalIds | `onthecasemusic:27750` | The source band id |

**Search variants tried, both surfaces (§2A.1 item 3b, item 3c):**

1. Google, bare name plus one qualifier: `audios band newcastle` → nothing usable.
2. Google: `"Audios" band facebook` → `facebook.com/Audiosacoustic` returned among the exact-name matches, with "northeast of England" in the snippet.
3. The page was then **opened in Chrome and read**, per §2A.3. Category reads "Musician". The intro was taken from the live DOM, not from the snippet.

**Identification bar (§2A.1):** the page states the north-east of England, which agrees with the gig footprint (The Peacock, Kenton, Newcastle). That is a hard signal, not a name match alone. The page is live.

**Why this artist needed creating at all:** `data\state\onthecasemusic.json` maps source band 27750 to `6d734bba-362e-403f-87b6-171834a85fec`, created 2026-04-28. That id returns **HTTP 404 Artist not found**. The record has been removed from bndy since April. The April state file is stale on this row. `search_artist("Audios")` returned nothing above 70%, and nothing named Audios at 25%.

**Evidence file:** `data\state\enrichment-evidence-2026-08-12-onthecasemusic.jsonl`, written before the bndy write, one record.

---

## 9. VALIDATOR (§6A step 8)

```
[ ok ] Audios  caccd0d2-7cea-4f5b-9fe0-8f16d4a9c933

1 records · 1 clean · 0 FAIL · 0 WARN   [mode=gate]
```

Exit code **0**. Records file: `data\normalized\onthecasemusic\2026-08-12\records.json`. Evidence file as named in §8.

---

## 10. SKIPPED AND PARKED

| Row | Reason |
|---|---|
| 2027-12-26 gig 129119, The Zone at Sea Horse Club | Beyond the 12-month horizon. It stays in the snapshot and enters through a later diff. It is the same booking as the 2027-02-07 row that was corrected in §5. |

Nothing was staged for a human. Nothing was parked as undecidable.

---

## 11. STATE WRITTEN

| File | Result |
|---|---|
| `data\state\onthecasemusic-last-page.txt` | **Written.** 271 rows, 112 dates, 2026-08-13 → 2027-12-26. Normalisation rules and the 0/0 gate result are in the file's own header. |
| `data\state\enrichment-evidence-2026-08-12-onthecasemusic.jsonl` | Written, 1 record |
| `data\state\run-summary.jsonl` | Appended |
| `data\state\heartbeat\onthecasemusic-2026-08-12T00-24-41Z.json` | Written at start, rewritten at end |
| `data\state\claims\onthecasemusic.json` | Acquired, then released |
| `data\state\cancellations.jsonl` | Read. **Not written** — the run made no deletion and no cancellation. |
| `20-Daily\2026-08-12.md` | Appended |
| `CTO-INBOX.md` | 2 items appended |

`record_run` was not called. It fails on a missing `SOURCE_RUNS_TOKEN`. That is already in `CTO-INBOX.md` as `record-run-token-missing` and is not blocking.

---

## 12. RAISED TO CTO-INBOX

| FINGERPRINT | KIND | Why |
|---|---|---|
| `otcm-rebill-orphans-other-source` | DATA | Gig 131373 was re-billed from Steel Blue to Audios. The Steel Blue event `ae6d16f2-…` is lemonrock's and is probably now stale. A run may not action another source's record. |
| `peacock-newcastle-wrong-geocode` | DATA | Venue `e345cdd5-…` "The Peacock Newcastle" sits at 55 Pilgrim St NE1 6BJ and carries an `onthecase-daily-import` id. The source's Peacock is Arlington Ave, Kenton NE3 4TS. One of the two is a wrong geocode. |

Not raised, because an existing fingerprint already covers it: `otcm-chrome-not-mandatory`, `venue-postcode-field-blank`, `record-run-token-missing`, `create-artist-500-namevariants`.

Not raised, because the runbook already answers it: the spec declares no §0.29 mode at its top, but §0.29 itself names onthecase as a delta source on evidence, and both of its conditions were re-proved today. There is no decision here for Jason.

---
---

# ONTHECASEMUSIC — RUN REPORT 2026-08-12, SECOND FIRING

**This section is a second run of the same task on the same date. It does not replace the report above. Two runs fired today, at 00:24Z and at 08:24Z.**

- **Run id:** `onthecasemusic-2026-08-12T08-24-26Z`
- **Outcome:** COMPLETED — no change at source, zero writes to bndy.
- **Runbook read:** `RUNBOOK.md` **v2.27**, read in full. Current floor **v2.19** (§6A). The run is above floor.
- **Prompt floor:** the task prompt states no number. It defers to §6A. No drift to report.
- **Mode (§0.29):** `delta`. The spec declares no mode at its top. §0.29 names onthecase as a delta source by evidence, and both conditions were re-proved today — see §14.
- **Heartbeat:** `data\state\heartbeat\onthecasemusic-2026-08-12T08-24-26Z.json`
- **Claim:** `data\state\claims\onthecasemusic.json` read `heldBy: null`, released by run `onthecasemusic-2026-08-12T00-24-41Z` at 00:49:00Z. Acquired at 08:24:31Z, TTL 90 minutes (§6G). **No takeover.**

---

## 13. COUNTS — SECOND FIRING

| Measure | Count |
|---|---|
| Events created | **0** |
| Events edited | **0** |
| Artists created | **0** |
| Venues created | **0** |
| Events deleted | **0** |
| Rows skipped | **0** |
| 409 / 422 bounces | **0** |
| Creates against the 50 cap | 0 of 50 |

### Quality, stated separately (§6, v2.5)

| Class | Count |
|---|---|
| Artists created with a **verified page** | 0 |
| Artists created with an **evidenced blank** | 0 |
| Artists **skipped or parked** | 0 |
| Names **sanitised** under §0.6 | 0 |
| Rows rejected as **non-acts** | 0 |

**No record was written, so no record could be a stub.** This is a no-change run, not a quiet one — the source published nothing new between 00:24Z and 08:24Z.

---

## 14. CAPTURE AND DIFF — SECOND FIRING

- Source: `https://onthecasemusic.co.uk/gigs`
- Tool: `curl` in the sandbox, then the same regex parse of the server-rendered ASP.NET markup. The parser is a byte copy of the 00:24Z run's `parse.py`, which is itself a byte copy of the 2026-08-08 parser.
- Gig ids read from `a[href]` per §0.22. No synthetic id was written.
- Raw capture: `data\raw\onthecasemusic\2026-08-12\run-0824Z\gigs.html` (357,524 bytes — the same byte count as the 00:24Z capture)
- Result: **271 rows, 112 dates, 2026-08-13 → 2027-12-26**, 271 unique gig ids, 28 rows with no band id. Identical to the 00:24Z capture on every count.

**Diff against `data\state\onthecasemusic-last-page.txt`: 0 added · 0 removed · 0 changed.**

The diff key is `(date, gigId)` first and the row text second, per `sources\onthecasemusic.md` §2. No gig id was re-billed, re-timed or dropped in the eight hours between the two firings.

### §5.7(a) normalisation gate

Both sides were normalised identically before comparison: whitespace runs collapsed to one space, curly apostrophes straightened, HTML entities decoded once, and empty `/`-separated address segments dropped.

**Self-diff of the snapshot against the capture it was written from: 0 added / 0 removed / 0 changed.** The gate passes, so deletion was permitted. **There was nothing to delete.**

### Delta-mode conditions (§0.29)

- (a) The 0/0 self-diff passes. ✅
- (b) The stored snapshot and today's capture use the **same enumeration method** — curl plus the same parser. ✅

### Capture-safety rule (`sources\onthecasemusic.md` §1)

The spec holds a run when a diff runs to hundreds of rows, because that pattern means the capture format changed. A 0/0 diff is the opposite reading: the capture reproduces the snapshot exactly. No hold.

---

## 15. TOMBSTONE CHECK (§5.4, v2.19)

`data\state\cancellations.jsonl` was read before any create was considered. It holds 2 lines. No create was attempted, so no artist+venue+date could match one. No row was reported `TOMBSTONED`.

---

## 16. SNAPSHOT

`data\state\onthecasemusic-last-page.txt` was refreshed. **The 271 gig rows are byte-identical to the file the 00:24Z run wrote** — the source did not change, so the data did not change. Two header lines were updated to stamp this firing and to record that the self-diff gate was re-proved. The file was re-diffed against today's capture after the write, at 0 added / 0 removed / 0 changed.

The §6A step 7 fail-closed gate does not bite: this run wrote nothing to bndy. The snapshot was refreshed anyway, so tomorrow's diff runs against a file whose provenance names the last run that proved it.

---

## 17. VALIDATOR (§6A step 8)

```
0 records · 0 clean · 0 FAIL · 0 WARN   [mode=gate]
```

Exit code 0. The run wrote no artist, so the record set and the evidence file are both empty. `data\state\enrichment-evidence-2026-08-12-onthecasemusic.jsonl` was **not** written to by this run — the 00:24Z run owns today's file and this run had no evidence to add (§6F ownership).

---

## 18. STAGED, PARKED AND BLOCKED

Nothing. No row was ambiguous, because no row was new.

## 19. RAISED TO CTO-INBOX — SECOND FIRING

**Nothing raised.** Every fingerprint this run would have raised is already open from the 00:24Z run or earlier: `otcm-chrome-not-mandatory`, `otcm-rebill-orphans-other-source`, `peacock-newcastle-wrong-geocode`, `record-run-token-missing`, `create-artist-500-namevariants`. §5 of the inbox rules forbids raising an item twice.

Not raised, because the runbook already answers it: the spec declares no §0.29 mode at its top, but §0.29 itself names onthecase as a delta source on evidence, and both of its conditions were re-proved today. There is no decision here for Jason.

## 20. NOTES

- `record_run` was not called. It fails on a missing `SOURCE_RUNS_TOKEN`, which is already open as `record-run-token-missing` and is not blocking. `run-summary.jsonl` carries the real dashboard line.
- The one row the 00:24Z run skipped — gig `129119`, The Zone at Seahorse Sports Bar, 2027-12-26 — is still beyond the 12-month horizon (§5.5, cut-off 2027-08-12). It stays in the snapshot and enters via a later diff. It is not a backlog.
