# onthecasemusic — RUN REPORT 2026-08-30

**Run id:** `onthecasemusic-2026-08-30T03-31-10Z`
**Outcome:** COMPLETED — five events hidden. No record was created. No record was deleted.
**Runbook read:** `RUNBOOK.md` H1 **v2.27**. §6A CURRENT FLOOR **v2.19**. Floor passed.
**Prompt floor:** the task prompt states no numeric floor. §6A step 2a is the gate that bound this run.
**Spec read:** `sources/onthecasemusic.md` in full.
**Inbox read:** `CTO-INBOX.md`. All open fingerprints read before any action.

---

## 1. Counts

| Measure | Count |
|---|---|
| Events created | **0** |
| Artists created | **0** |
| Venues created | **0** |
| Events edited | 0 |
| Events hidden | **5** |
| Events deleted | 0 |
| Rows added by the source | 0 |
| Rows removed by the source | 0 |
| Rows changed | 0 |
| Rows skipped | 6 (5 `Buskers night`, 1 `to be confirmed`) |
| Validator | `0 records · 0 clean · 0 FAIL · 0 WARN [mode=gate]`, exit 0 |

**Quality statement (§6, v2.5).** No artist and no venue was created, so there is no verified-page
create and no evidenced blank to report. No name needed sanitising. No row was staged. Every write
this run made is a `isPublic: false` on an event that the source no longer bills, where a correct
record for the same booking is already live. Each write was read back (§0.10) and each is tombstoned.

---

## 2. Gates, in order

| Step | Result |
|---|---|
| §6A.0 heartbeat | `data/state/heartbeat/onthecasemusic-2026-08-30T03-31-10Z.json`, `outcome: started` |
| §6A.1 date | `2026-08-30` from the sandbox shell (`2026-08-30T03:31:10Z`) |
| §6A.2 runbook + spec | read in full |
| §6A.2a floor | H1 v2.27 ≥ floor v2.19. PASS |
| §6A.2b claim | `data/state/claims/onthecasemusic.json` read `heldBy: null`, released 2026-08-29T19:52:00Z. Acquired clean. **No takeover.** TTL 90 min, `expiresAt` 2026-08-30T05:01:10Z |
| §6A.3 tools | bndy MCP reachable — `get_by_external_id`, `get_by_id`, `search_event`, `search_venue`, `edit_event` all returned. Chrome not needed (see §6) |
| §6A.4 capture | `data/raw/onthecasemusic/2026-08-30/run1/`, HTTP 200, 337,339 bytes |
| §6A.5 diff | **0 added / 0 removed / 0 changed** |
| §5.7(a) self-diff gate | **0 added / 0 removed.** PASS, run after the snapshot write |
| §5.4 tombstone check | `data/state/cancellations.jsonl`, 9 lines read before any action. No line matched any artist + venue + date this run touched. No event was created in any case |
| §2.19 day-file check | `20-Daily/2026-08-30.md` read. Three `enrichment` firings and one `klma-stoke-gig-list` run today. None touched an onthecase row. No missing bndy record was read as a coverage gap without this check |

**Mode (§0.29).** The spec still declares neither `delta` nor `append-only`. §0.29 names onthecase as
delta-qualifying on evidence, and both conditions held again: the self-diff returned 0/0, and the
capture used the same enumeration method as the stored snapshot (same parser, md5
`4910da5ad72576c5a50959966ca4adc3`, byte-identical to every parser since 2026-08-08). **The delta
permission was available and was not needed** — the diff reports no removed row. Already on file as
`otcm-mode-not-declared` (2026-08-14). Not raised twice.

---

## 3. Capture

- 254 rows, 106 dates, 2026-08-29 → 2027-12-26. 254 unique gig ids. 22 rows carry no `band_id`.
- Method: `curl` + regex parse of the server-rendered markup, gig id read from `a[href]` per §0.22.
- Parser copied unchanged from `data/raw/onthecasemusic/2026-08-29/run1/parse.py`.
- The page still heads its list with **Saturday 29 August 2026**. The curator has not rolled it since
  the previous run. No past-dated row entered the pipeline (§0.14).
- The HTTP response is the same byte length as yesterday's (337,339) but a different md5
  (`e70a642ca0ed77cf621d054157369c51` today, `1faa7d680fcc0cb169adbbf1c5b29f64` yesterday). The
  difference is the ASP.NET `__VIEWSTATE` block, which the parser strips. The parsed rows are
  identical. **This is not a capture fault and it is not a source change.**

---

## 4. Diff — a true no-change run

**0 added / 0 removed / 0 changed** against the 2026-08-29 19:43Z snapshot (254 rows).

An honest no-change run is a real result (§6). It is also the reason this run spent its budget on the
coverage probe in §5 rather than on the diff.

---

## 5. Coverage probe — the diff is not the only test

`klma-zero-diff-hid-nine-missing-gigs` and `gigs-news-zero-diff-hid-branded-row` both record the same
lesson: a zero diff proves the source did not change, not that bndy holds what the source publishes.
The KLMA run three hours earlier today found 5 hidden gigs on exactly this reasoning. So this run
checked **all 223 future rows inside the 12-month horizon**, grouped by venue, against bndy.

### 5.1 Result

| Measure | Count |
|---|---|
| Future rows ≤ 12-month horizon | 223 |
| Not importable (§0.4 / spec skip list) | 6 — 5 `Buskers night`, 1 `to be confirmed` |
| Importable rows | **217** |
| Present in bndy | **216** |
| Absent from bndy | **1** (gig `130198`, see §5.3) |
| **Genuinely missing gigs found** | **0** |

Per-venue, all 25 venues in the feed:

| Source venue | Rows | Covered |
|---|---|---|
| 6016 Crown and Cannon Winlaton | 37 (1 skip) | 36/36 |
| 493 White Swan Morpeth | 36 | 36/36 |
| 6028 Clousden Hill Forest Hall | 21 | 21/21 |
| 6074 Sea Horse Club at Whitley Bay FC | 20 | 20/20 |
| 108 Blacksmiths Arms Gosforth | 17 | 17/17 |
| 6128 Bridge Hotel Durham | 14 | 14/14 |
| 6130 Ivy House Sunderland | 13 | 13/13 |
| 5994 The Prior Doxford Sunderland | 11 | 11/11 |
| 375 Red Lion Earsdon | 8 (1 skip) | 7/7 |
| 90 Bebside Inn Blyth | 7 | 7/7 |
| 572 New Hartley Club | 7 | 6/7 — see §5.3 |
| 6011 Old Fat Ox Holywell | 6 (4 skips) | 2/2 |
| 6029 Live Lounge Sunderland | 4 | 4/4 |
| 940 Crook Hotel Crook | 3 | 3/3 |
| 638 Runhead Bar & Grill Ryton | 3 | 3/3 |
| 892 Melton Constable Seaton Sluice | 3 | 3/3 |
| 753 Bridlepath Whickham | 3 | 3/3 |
| 915 Murton Officials Club Seaham | 2 | 2/2 |
| 6118 Cross Keys Washington | 2 | 2/2 |
| 6127, 463, 6124, 185, 6096, 348 (one row each) | 6 | 6/6 |

### 5.2 Method, and its two false-negative traps

The probe resolved each source venue to a bndy venue id, then read every bndy event at that venue in
the horizon and matched on `gigId` **or** on date, because of two known defects:

- `otcm-externalid-form-mixed` — three externalId forms are live on this source. `get_by_external_id`
  on a bare gig id **missed 9 of the venues' first probes** and every one of those events existed
  under a slug form. **A miss is not proof of absence, and this run did not treat it as one.**
- `search_event` ignores `dateTo` (it returned rows to 2027-12-18 against a 2027-08-30 ceiling) and it
  **excludes hidden events**. Both were allowed for. Already on file as `search-event-daterange-ignored`.

### 5.3 The one absence — already logged, and now blocked

Gig `130198`, **The Zone @ New Hartley Club, 2026-10-10**. bndy holds a `Fossil` event on that venue
and date instead — and holds it **twice**, once on each of the two New Hartley venue records described
in §7. The 2026-08-27 run already logged this row as a cross-source act disagreement and made no
write, correctly, under §5.6b. This run also made no write: re-billing either copy would leave the
other live, and the venue split must be settled first. Standing item
`otcm-rebill-orphans-other-source`. Not raised twice.

---

## 6. Writes — five re-bill orphans hidden

The probe surfaced five live public events that hold an `onthecasemusic` externalId, are future-dated,
and that **the source does not bill**. In each case a correct record for the same booking is already
live in bndy, so the spec's DIFF SAFETY item 2 remedy — *edit the existing event* — is impossible: the
edit would bounce 409 against the artist + venue + date sentinel held by the correct record.

**They were HIDDEN, not deleted.** This follows the three precedents this source already has
(2026-08-19 One More Mile and The Panthers, 2026-08-27 The White Line). Hiding is reversible, it takes
a wrong listing off the public map, and it does not require the §0.17 deletion bar to be met on rows
that no diff ever surfaced. Each event carries **this source's externalIds only** and none carries an
`owner_user_id` (§0.16).

| # | Event UUID | Row | Evidence | Correct record already live |
|---|---|---|---|---|
| 1 | `510d7380-1ee2-47c7-95c2-7f7ef1a636f0` | Proper Boys @ Crown and Cannon, 2026-11-22 | gig `126261` keeps venue, date and slot and now reads **Star Breaker** | `1b7a2f1c-f918-4096-8c7d-150ee4382972` |
| 2 | `614a9e98-fcd0-47fd-a647-523ff60a993d` | Babel Fish @ Blacksmiths Arms Gosforth, 2026-10-30 | gig `126486` keeps venue, date and slot and now reads **Dakota** | `29a06fc8-80c5-4aaa-94aa-818335c68bd1` |
| 3 | `332d8b3c-cab2-403e-a815-9feaeaa9894e` | Riverain @ Clousden Hill, 2026-09-19 | gig `126329` is **absent from the full 337,339-byte capture** (0 occurrences). The source bills gig `128062` Copperhead at that venue and date | `156f3b0c-9548-47ad-a2f1-615c885bd357` |
| 4 | `c030d3bd-082e-458c-bf4e-59244008faba` | The Zone @ The Prior, 2026-11-28 | the source bills exactly one act there that night, gig `131293` **Brydon Trio** | `071353d5-bc6e-4006-9cdb-fbc3b483ec82` |
| 5 | `4e4a8a3a-069b-4bc5-ba8d-d0220c324a17` | The Zone @ Live Lounge, 2027-07-24 | gig `129088` is dated **2027-07-18**, not 2027-07-24. The source lists no Live Lounge row on 2027-07-24 | `4c0e1c35-6105-4e2c-add6-80c8b3a5532e` |

**Read-back (§0.10).** All five `get_by_id` calls return the record with `isPublic` absent, i.e. false,
and with `updatedAt` at 2026-08-30T03:43Z. Every externalId survived the edit unchanged.

**Tombstones (§5.4, v2.19).** Five lines appended to `data/state/cancellations.jsonl`, each with the
evidence verbatim and the id of the correct record that made an edit impossible. The file now holds
14 lines.

**These five are the `otcm-rebill-stale-events-six-live` class.** That fingerprint is already open, so
no new inbox line was raised for them. They are recorded here and in the tombstone file.

**Chrome.** Not used and not needed. The spec's "CLIENT-RENDERED — Chrome is mandatory" line remains
wrong for `/gigs`, which is server-rendered ASP.NET and reproduces in full by `curl`. Already on file
as `otcm-chrome-not-mandatory` (2026-08-08). Not raised twice.

---

## 7. New finding — one source venue, two bndy venue records

**This is the substantive finding of the run and it is raised to the inbox.**

Source venue **572** publishes one address on its own page: *Bristol Street, New Hartley, NE25 0RL*.
Two bndy venue records both claim it:

| bndy venue | Name | Address | Postcode | Google place_id | `onthecasemusic` externalId | Future events |
|---|---|---|---|---|---|---|
| `6ebbbf5a-5c3d-44c8-b699-5a02b268ef14` | New Hartley Residents Club | Melton Terrace | **NE25 0RL** | `ChIJF_YeX4ByfkgRQMUrXF8n5vY` | `572` | 16, **all lemonrock ids, none onthecase** |
| `2a48a6a4-41f0-44a8-865e-610d52889b6b` | New Hartley Memorial Hall | St Michael's Ave | **NE25 0RP** | `ChIJW4TflE9zfkgRwJ_8iRX5Qak` | `new-hartley-smc` | 18, **all onthecase ids, none lemonrock** |

Different place_ids means different buildings (§1), so this is not a duplicate venue to merge blindly.
It is worse: **the source has one New Hartley venue and bndy has written its gigs to both records.**
§0.24 decides which is right — the source publishes NE25 0RL, and only the Residents Club carries it.

**15 bookings exist twice**, one copy on each record, same act and same date:

Dreadnought 2026-09-05 · Diamond Dogs 2026-09-19 · West Coast Band 2026-09-26 · Babel Fish 2026-10-03 ·
Fossil 2026-10-10 · A Band Called Horse 2026-10-17 · Hard Wired 2026-10-24 · Copperhead 2026-10-31 ·
7 Sins 2026-11-07 · Diablo 2026-11-14 · Nutopians 2026-11-21 · Midnight Echoes 2026-12-12 ·
The Flames 2026-12-19 · The Zone 2027-03-13 · Copperhead 2027-05-22.

Three further Memorial Hall events have no twin: The Zone 2026-09-12, Mystery Men 2026-11-28,
Star Breaker 2026-12-05.

**No write was made.** Moving 18 events between venue records is a merge, and §0.11 forbids a merge
inside an import run. A venue edit on any duplicated event would bounce 409 against its twin.

**This also explains `otcm-lemonrock-pins-dropped-rows` (2026-08-27).** That run read 16 lemonrock-only
events at New Hartley and concluded an append-only source was pinning rows a delta source had dropped.
The onthecase copies of those same bookings were sitting on the other venue record the whole time.
The mode interaction is real, but New Hartley is not its example.

**Cause.** The spec's learned venue mapping — *"New Hartley SMC" → New Hartley Memorial Hall
`2a48a6a4`* — points at the NE25 0RP building. The source's SMC is at NE25 0RL. Every run that follows
that mapping writes to the wrong record. Raised separately as a RULE item.

---

## 8. Defaulted times, corrections, gate bounces

- **Defaulted times:** none. No event was created.
- **Date corrections (§5.6b):** none.
- **Gate bounces (409/422/500):** none. Five tool calls wrote and all five succeeded first time.
- **Names sanitised or staged as non-acts (§0.6):** none. No new name entered the pipeline.
- **Skipped rows:** 5 `Buskers night` (open-mic placeholder, spec skip list + §0.4) and 1
  `to be confirmed` at Crown and Cannon 2026-12-18 (§0.4; its bndy event `e418f9e8` was already hidden
  and tombstoned on 2026-08-27).

---

## 9. Outputs

| Artefact | Path |
|---|---|
| Raw capture | `data/raw/onthecasemusic/2026-08-30/run1/gigs.html` |
| Parser | `data/raw/onthecasemusic/2026-08-30/run1/parse.py` (md5 `4910da5ad72576c5a50959966ca4adc3`) |
| Normalised capture | `data/normalized/onthecasemusic/2026-08-30/capture-normalised.txt` |
| Parsed records | `data/normalized/onthecasemusic/2026-08-30/records.json` |
| Validator input | `data/normalized/onthecasemusic/2026-08-30/validator-records.json` (empty — no artist write) |
| Snapshot | `data/state/onthecasemusic-last-page.txt` (written; §6A step 7 fail-closed gate satisfied) |
| Tombstones | `data/state/cancellations.jsonl`, 5 lines appended |
| Daily summary | one line appended to `data/state/run-summary.jsonl` |
| Daily note | one line appended to `20-Daily/2026-08-30.md` |
| Evidence file | none — no artist was created or enriched, so no evidence line was owed |

`record_run` was not called. It fails on a missing `SOURCE_RUNS_TOKEN`, is already on file as
`record-run-token-missing` (2026-08-08), and the task prompt states it is not blocking.
`run-summary.jsonl` is the dashboard's real input and was appended.

---

## 10. Raised to CTO-INBOX

**Two new items.**

- `otcm-new-hartley-two-venue-records` (DATA) — one source venue, two bndy venue records, 15 bookings
  held twice. Evidence: both venue UUIDs.
- `otcm-spec-newhartley-mapping-wrong-postcode` (RULE) — the spec's learned mapping sends source
  venue 572 (NE25 0RL) to a bndy venue at NE25 0RP. §0.24 says the postcode decides.

**Not raised (already on file):** `otcm-mode-not-declared`, `otcm-chrome-not-mandatory`,
`otcm-externalid-form-mixed`, `otcm-rebill-stale-events-six-live`, `otcm-rebill-orphans-other-source`,
`otcm-lemonrock-pins-dropped-rows`, `otcm-gigid-strands-on-venue-move`, `search-event-daterange-ignored`,
`record-run-token-missing`, `otcm-daily-import-legacy-namespace`.

**Nothing needed Jason.** No irreversible or legal decision arose. All five writes are reversible and
every one is tombstoned.

---

## 11. Prior-run items still open at this source

Carried forward for visibility only:

- `otcm-lemonrock-pins-dropped-rows` — partly explained by §7. The New Hartley example does not hold.
  The general mode interaction still does.
- `otcm-gigid-strands-on-venue-move` — `570fe867-7067-4174-abc7-be9fafde362b` remains hidden and holds
  gig id `126346`.
- `otcm-rebill-stale-events-six-live` — five further instances found and hidden today (§6).
- Three stale events found by the probe that have **no** named replacement, so they are §0.17
  candidates rather than re-bills, and no diff has ever surfaced them. **No write was made; they are
  listed here for the next run:** `99cecc2c-c175-450f-90d3-8e60bd7074f7` Diablo @ Runhead 2026-09-26,
  `c8066263-180f-4a5b-b90a-fc9a65364563` Dog In A Box @ The Crook Hotel 2026-11-15,
  `d6025bd5-a54b-4e2a-b7cc-58bcc8bd91eb` The Zone @ Easington Colliery WMC 2026-11-14.
