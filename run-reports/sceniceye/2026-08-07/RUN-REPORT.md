# sceniceye — SCHEDULED RUN REPORT — 2026-08-07

**OUTCOME: COMPLETED. NO-CHANGE RUN — ZERO WRITES TO bndy.**
Not a held run, not a stale week, not an error. The source page is current and was captured
cleanly; it simply has not changed since yesterday's edition, and all 14 of its importable rows
were verified **already present and correct in bndy**.

| | |
|---|---|
| Fired | 2026-08-07T04:36:16Z (05:36 BST), Friday |
| Runbook | `RUNBOOK.md` **v2.11** — asserted ≥ v2.4 floor required by the task prompt. PASS |
| Source spec | `sources\sceniceye.md` — read in full |
| Standing rulings | `OPEN-RULINGS.md` — read; no-stubs ruling and quality-reporting ruling applied |
| Heartbeat | `data\state\heartbeat\sceniceye-2026-08-07T04-36-16Z.json` (written first action, §6A step 0) |
| Lock | `data\state\sceniceye.lock` — acquired (file absent = acquire, §6G); released on completion |
| Raw capture | `data\raw\sceniceye\2026-08-07\capture.txt` |
| New snapshot | `data\state\sceniceye-last-page.txt` — **written** |
| Creates used | **0 of 50** |

---

## 1. STALE-WEEK CHECK (mandatory, run before pipelining) — **PASS**

Today is **Friday 7 August 2026**. The current Thu–Sun edition is **Thu 6 – Sun 9 Aug**.

Banner reads **"6 August – 12 August 2026"** and the DOM carries **7 day tables, Thu 6 Aug through
Wed 12 Aug 2026**. The guide **is** rolled to the current edition. **Not a stale week** — the
2026-06-03 / 06-07 / 06-09 / 06-11 "page not rolled" class did not fire.

Hydration confirmed genuine, not the Super.so stale-SSR cache: the rendered dates are the current
week, not the month-old content view-source serves for this site.

⚠ `document.hidden === true` (MCP automation tabs always are — §6B). **Not a blocker here**: §6B's
scope correction limits that failure to *infinite-scroll / lazy-loaded* lists. This page is a set of
7 fully-rendered Notion tables; all 7 were present with their full row counts (2/7/12/8/1/1/1), and
the row totals reconcile exactly with yesterday's capture. No paginated feed was involved.

## 2. CAPTURE

Chrome MCP `javascript_tool`, DOM walk over `h2` day-headings + the following `table.notion-table`.
**`get_page_text` was NOT used for extraction (§0.22).**

- **32 table rows** = **29 real gig rows** + 3 `No gigs listed` placeholders (Mon 10, Tue 11, Wed 12).
- Transferred out of the tab in 5 slices to stay under the `javascript_tool` response ceiling
  (~1,000 chars) documented in the klma and insangel OPEN-RULINGS items. No content filter fired
  (this source's rows carry no URLs or query strings).

## 3. TWO-SIDED SNAPSHOT DIFF (§5.7) — **0 added / 0 removed**

Prior snapshot: `data\state\sceniceye-last-page.txt`, fetched 2026-08-06, same 6–12 Aug edition,
29 gig rows.

| | |
|---|---|
| Added future-dated rows | **0** |
| Removed future-dated rows (cancellation candidates) | **0** |
| Rows unchanged | **29 / 29** |

**No §0.17 deletion was considered and none was performed.** No row vanished; nothing was hidden,
deleted or cancelled.

### 3a. ⚠ Format drift — caught and normalised, NOT a change (§5.7a)

The raw DOM today appends **`, England`** to **every** venue cell. Yesterday's snapshot has it on
**none**. Taken literally this reads as *29 removed + 29 added* — a whole-page churn that would have
produced 29 false cancellation candidates.

It is a rendering artifact, not a curator edit. Both sides were normalised (country suffix stripped)
before diffing, which gives the true **0/0**.

This is the same failure class as the onthecase trailing-slash incident of 2026-08-06 (a phone-less
venue rendering `North Road / Durham City /`, making every row at that venue differ by two
characters). **Fix applied so it cannot recur silently:** the new snapshot carries an explicit
7-point `NORMALISATION RULES` header stating how the file is regenerated from the DOM, so the next
run can reproduce it byte-for-byte rather than inferring the format. See §7.

Two smaller artifacts, also normalised:
- `Freddy Saxo`'s venue gained a `, Stansted` component (`Stansted Park Garden Centre, Stansted,
  Stansted Park, Rowlands Castle, PO9 6DX`). Same venue — already resolved to
  `3218ee02-6145-4aac-9be8-c113acfefdb1` — same act, same 14:30. Today's literal text is kept in the
  snapshot; **not** a new gig.
- `Forever Queen - 🎫 Ticket` renders with the emoji today, stripped in yesterday's snapshot. Emoji
  stripping is now rule 4 of the snapshot header. The marker rides on the event as `ticketed:true`,
  never in a name field (§0.6).

## 4. ROW DISPOSITION — 29 rows

| Disposition | Rows |
|---|---|
| Already in bndy, verified this run — no action needed | **14** |
| Skipped — festival (Jason ruling 2026-07-31) | 13 |
| Skipped — past-dated (§0.14) | 2 |
| **Total** | **29** |

### 4a. Skipped — festivals, 13 rows

Per the task prompt (*"Festivals are skipped for this source — Jason ruling 2026-07-31"*).

- **Staunton Festival — 8 rows** (Hybrid Kid · Shotgun Smile · OB3 · Vestas, Sat; Pfizer Chiefs ·
  Patch Collins · Mother Shipton · Davey Jones Locker, Sun). Two independent grounds, as yesterday:
  the festival ruling, **and §0.23** — "Staunton Country Park, Petersfield Road, Havant, PO9" is a
  country park with a partial postcode; no correct Google Place ID can exist, so the venue must not
  be created. Davey Jones Locker's venue cell is literally *"Venue missing from calendar"* and would
  be parked `tbc_venue` regardless.
- **"Music Festival" at The Centurion — 5 rows** (MD Duo, Fri; Dirty Blonde · Astromoda ·
  Mark Harris · Skadacious, Sat).

⚠ The Centurion rows remain the open edge case: named acts, real clock times, at an **ordinary pub
already in bndy** (`2f01ebc9-abce-4ff6-8b39-0bde440d45ff`). **Already raised by the 2026-08-06 run
and still awaiting Jason** — deliberately **not re-appended** to `OPEN-RULINGS.md`, because a queue
that asks the same question twice is a bug (§1A.5). Cost of the skip, unchanged: ~5 gigs per
festival weekend at this venue.

### 4b. Skipped — past-dated (§0.14), 2 rows

Both Thursday 6 August rows; the date has passed.
- `George Michael - Tribute | Number 73 Bar & Kitchen | 19:30` — also a **§0.5 non-name** (the real
  tribute act is never stated). Would have been **STAGED, never created**, had it been future-dated.
  Already logged to `OPEN-RULINGS.md` on 2026-08-06; not re-raised.
- `West Brook | The Crown Inn, Emsworth | 20:30`

### 4c. Names sanitised / held as non-acts (§0.6) — 14 billing tails identified

No artist was created this run, so nothing could be contaminated — but the identification was still
performed on every row, and is recorded so no future run mistakes a tail for identity:

`- Staunton Festival` ×8 · `- Music Festival` ×5 · `- 🎫 Ticket` ×1 are **event billing, not act
names**. `George Michael - Tribute` is not an act name at all (§0.5).

**Zero artist records in bndy from this source carry a billing tail, a festival name, a venue name
or a ticket marker.**

## 5. VERIFICATION AGAINST bndy — 14/14 PRESENT (this is the substance of the run)

The diff alone would justify "0 adds, nothing to do". That is **not sufficient evidence** that the
week is actually in bndy: the daily diff only ever sees rows *added since the last snapshot*, so a
row that failed to import once becomes invisible to every later run (the klma coverage-gap finding,
2026-08-06 — 27 sheet rows vs 15 bndy events at one venue). And on 2026-08-07 the gigs-news run
found a predecessor's report claiming 10 staged artists when 6 had in fact been created.

**So every importable row was checked against the live database rather than against yesterday's
report.** All 14 found, all `isPublic: true`, all carrying the correct §6D `sceniceye` slug.

### Friday 7 August 2026 — 6/6 (these gigs are TONIGHT)
| Event | id | Time | externalId verified |
|---|---|---|---|
| Freddie Saxo @ Stansted Park Garden Centre | `3a807ddc-85cc-4781-b5f2-e2421bb3dcbd` | 14:30 | `2026-08-07-freddie-saxo-stansted-park-garden-centre` |
| Matt O'Neil @ The Crown Inn Emsworth | `dab98c2c-5f59-4d9e-bc33-faefe705627d` | 20:30 | `2026-08-07-matt-oneil-the-crown-inn-emsworth` |
| Cheesy Moments @ The Heroes, Waterlooville | `67cd68aa-7e47-47c0-9f01-d69fc3ce24d8` | 20:30 | `2026-08-07-cheesy-moments-the-heroes-waterlooville` |
| TJ Quinn @ The Lord Raglan | `e5ca59b3-a946-4659-90d4-c2e0e1151295` | 20:30 | `2026-08-07-tj-quinn-the-lord-raglan` |
| The Beatniks @ Emsworth Sports & Social Club | `3a270ca8-6007-45df-9583-d7fced679b3d` | 20:30 | `2026-08-07-the-beatniks-emsworth-sports-social-club` |
| Chloe Anne @ The Lifeboat Inn | `bab38c46-1dc8-4628-bddd-e02bd510a08e` | 21:00 | `2026-08-07-chloe-anne-the-lifeboat-inn` |

### Saturday 8 August 2026 — 4/4
| Event | id | Time | externalId verified |
|---|---|---|---|
| Sophie Jenkinson @ The Stags Head | `22358a37-887f-4c41-bf91-055166612b62` | 20:00 | `2026-08-08-sophie-jenkinson-the-stags-head` |
| The Restless @ The Old House at Home, Havant | `28c849c5-9edf-4904-9a51-283d8457bb56` | 21:00 | `2026-08-08-the-restless-the-old-house-at-home-havant` |
| Mama Belle @ The Heroes, Waterlooville | `a46d58d8-3fe0-447f-886f-2e537124fe4d` | 21:00 | `2026-08-08-mama-belle-the-heroes-waterlooville` |
| Forever Queen @ Cowplain Social Club | `d62b8b2f-c43b-478e-8c59-086c035bebd2` | 19:00 | **dual provenance intact** — see below |

### Sunday 9 August 2026 — 4/4
| Event | id | Time | externalId verified |
|---|---|---|---|
| Baxtrax @ The Hampshire Rose | `01115881-a914-4818-a8ab-b33116d70ea8` | 14:00 | `2026-08-09-baxtrax-the-hampshire-rose` |
| T Junction @ The Golden Lion | `7de5eecb-bf10-4d2d-af8d-a09f718e7f07` | 15:00 | `2026-08-09-t-junction-the-golden-lion` |
| TJ Quinn @ The Crown Inn Emsworth | `953e2d68-2432-4430-98cb-42578d6238cf` | 15:00 | `2026-08-09-tj-quinn-the-crown-inn-emsworth` |
| Patch Collins @ The Heroes, Waterlooville | `acb62621-7a87-43d6-adb9-c17670f48acb` | 16:30 | `2026-08-09-patch-collins-the-heroes-waterlooville` |

**Forever Queen `d62b8b2f-c43b-478e-8c59-086c035bebd2` re-verified in detail** — the one record
yesterday *edited* rather than created, and therefore the one most worth re-reading (§0.10, and
§6B's warning that `edit_event(externalIds)` REPLACES). Read back today it correctly holds **both**
ids:
```
{ "source": "cowork-discovery", "id": "forever-queen-cowplain-2026-08-08" }
{ "source": "sceniceye",        "id": "2026-08-08-forever-queen-cowplain-social-club" }
```
`startTime 19:00` with *"Doors 19:00"* and the venue's own `eventUrl` — the venue's own page
outranking the source's 20:45 per §5.6b. **Nothing overwritten this run.** The doors-vs-stage-time
question is already open with Jason from 2026-08-06; not re-raised.

## 6. QUALITY BREAKDOWN (§6 / Jason's ruling 2026-08-01) — stated separately, as required

| Measure | Count |
|---|---|
| Artists created **WITH a verified Facebook page** | **0** |
| Artists created with an **EVIDENCED BLANK** | **0** |
| Artists **STAGED**, and why | **0** |
| Artists matched / reused | 0 |
| Venues created | 0 |
| Events created | 0 |
| Events edited / topped up | 0 |
| Gate bounces (409/422) | 0 |
| Names sanitised or held as non-acts (§0.6/§0.5) | 14 identified, 0 reached a name field |

**There were no creates, so there are no stubs and nothing was staged.** This is the honest shape of
a no-change run: the correct number of writes was zero, and the run's value is the verification in
§5, not a create count. Per the standing ruling, "0 creates, zero errors" would not on its own be an
acceptable report — hence §5.

**§2A enrichment:** not exercised — no artist was created or matched, so no identity check was owed.
No `facebookUrl`, `bio`, avatar, `actType` or `genres` was written to any record.

**§5.6 default start times:** not used. Every row carries an explicit time in this source, and no
event was written anyway.

## 7. VALIDATOR (§6A step 8)

**Not applicable — and deliberately not faked green.**

`scripts\enrichment_validate.py` validates *records a run wrote* against *evidence the run captured*.
This run wrote **zero records** and captured **zero bios**, so there is no record set to feed it and
no evidence file to feed it with. No `data\state\enrichment-evidence-2026-08-07-sceniceye.jsonl` was
created, because creating an empty one purely to produce an exit-0 line in this report would be
theatre — the validator exists precisely because an agent cannot be trusted to self-certify.

**There is no outstanding `FAIL`**, because there is nothing in this batch to fail. The
bio-verbatim, enum, URL-form and evidence-present rules had no surface to act on.

## 8. OPEN ITEMS

**One item appended to `OPEN-RULINGS.md`** (appended at end, not inserted — the file grew from
71,878 to 76,922 bytes since the last run wrote it, so other sessions are writing it; §6F permits
appending and forbids rewriting):

1. **Snapshot format reproducibility** — the `, England` drift documented in §3a, offered as a second
   confirming instance of the recommendation the onthecase run already made, plus the mitigation
   applied here (a normalisation-rules header inside the snapshot itself).

**Deliberately NOT re-raised** (all already open with Jason from 2026-08-06; re-asking is a bug per
§1A.5):
- The Centurion `- Music Festival` rows — does the festival skip cover one pub's own badged weekend?
- `George Michael - Tribute` — §0.5 unnamed tribute act.
- Forever Queen doors-time (19:00) vs stage-time (20:45).
- The 2026-06-05 run reporting a Chloe Anne create that was not in bndy.

## 9. RULES OBSERVED

- §0.1 no scheduled task created, modified or re-enabled.
- §0.10 every claim in §5 is a live `get_by_id` / `get_by_external_id` read-back, not a report copy.
- §0.11 nothing deleted or merged. §0.17 not triggered — zero vanished rows.
- §0.14 no past-dated gig imported.
- §0.22 collected by DOM walk; `get_page_text` not used for extraction.
- §0.23 Staunton Country Park not created (non-fixed building, partial postcode).
- §0.24 postcodes re-checked on the capture: PO7/PO8/PO9/PO10/PO11 throughout — all Portsmouth
  postal area, Hampshire. No out-of-county row.
- §6 cap 50: 0 used.
- §6A step 7 snapshot written. §6G lock acquired and released by content, never by deletion.
