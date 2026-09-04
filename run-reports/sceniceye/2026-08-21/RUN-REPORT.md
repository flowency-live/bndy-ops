# ScenicEye run report — 2026-08-21

**OUTCOME: COMPLETED. 1 artist enriched. 0 events created — every row was already in bndy. 1 duplicate venue created in error and reported. Validator 0 FAIL.**

| field | value |
|---|---|
| Run id | `sceniceye-2026-08-21T00-34-33Z` |
| Task slug | `sceniceye` |
| Fired | 2026-08-21T00:34:33Z |
| Today | 2026-08-21 (Friday) |
| Runbook read | `RUNBOOK.md` H1 **v2.27**, in full |
| Floor asserted | §6A **CURRENT FLOOR v2.19**. 2.27 >= 2.19. PASS |
| Prompt floor | The task prompt names no number. §6A step 2a is the only gate |
| Spec read | `sources/sceniceye.md`, in full |
| Declared §0.29 mode | **none**. The run defaults to `append-only`. Already raised as `sceniceye-mode-not-declared` (2026-08-12). Not raised again |
| Claim | `data/state/claims/sceniceye.json` read `heldBy: null`. Acquired 00:34:33Z, TTL 90 min, expires 02:04:33Z. Released at the end of this run |
| Heartbeat | `data/state/heartbeat/sceniceye-2026-08-21T00-34-33Z.json` |
| `enrichment.lock` | Not present. Nothing recreated it (§6A step 2b) |

## 1. Chrome and the capture

Chrome is **back** after four blocked firings. `list_connected_browsers` returned one local
browser. The spec's mandatory surface was available, so no third-surface question arose this
run. `sceniceye-third-surface-needs-ruling` (2026-08-19) stays open and is not re-raised.

Capture method: `javascript_tool` DOM walk of `h2` day-headings plus the following
`table.notion-table` (§0.22). `get_page_text` was not used for extraction.

**Stale-week check: PASS.** The page has **rolled**. The banner reads `20 August - 26 August 2026`.
Seven day tables, Thursday 20 August to Wednesday 26 August. The previous snapshot held the week
of 6-12 August. The page was two weeks stale on the last successful run and is now current.

Raw capture: `data/raw/sceniceye/2026-08-21/capture-rows.txt`, 28 gig rows across 7 days.

## 2. §5.7(a) normalisation and the self-diff gate

Both sides normalised per the rules written into the snapshot header. The extractor was run a
second time against the same DOM and the two results compared.

**Self-diff: 0 added, 0 removed** (36 lines each side, days plus rows). The gate passes.

## 3. Snapshot diff

The stored snapshot was the week of **6-12 August** (written 2026-08-15). The capture is the week
of **20-26 August**. The two weeks do not overlap, so the diff is total: every stored row reads as
removed and every captured row reads as added.

**No removal was actioned.** The source declares no §0.29 mode, so the run runs `append-only`.
§5.7 removed-row handling and §0.17 deletion did not run. This is the correct reading: the
"removals" are a rolled weekly guide, not a source change. The 13-19 August week was never
captured — see §7.

## 4. Counts

| metric | value |
|---|---|
| Rows captured | 28 |
| Rows past-dated, skipped (§0.14) | 2 |
| Rows skipped, venue not a fixed building (§0.23) | 8 |
| Rows carried to the pipeline | 18 |
| Events derived after the §4 split | 19 |
| **Events created** | **0** |
| Events already present (409 sentinel or read-back) | 19 |
| Artists created | 0 |
| Artists matched | 19 |
| **Artists enriched (top-up)** | **1** |
| Artists created with a verified page | 0 |
| Artists created with an evidenced blank | 0 |
| Venues matched | 13 |
| **Venues created** | **1 — in error, see §8** |
| Names sanitised under §0.6 | 1 |
| 409 / 422 bounces | 2 |
| Defaulted start times (§5.6) | 0 |
| Date corrections applied | 0 |
| Deletions | 0 |
| Tombstones written | 0 |
| Tombstone file checked before any create | yes — `data/state/cancellations.jsonl`, no match on any artist+venue+date this run |

## 5. THE MAIN FINDING — a second, undeclared namespace has already imported this week

**Every one of this week's rows was written to bndy about twenty minutes before this task fired,
by a writer using the externalId source `sceniceye-daily-import`.**

§6D fixes the canonical namespace for this source as **`sceniceye`**. `sceniceye-daily-import` is
not in the §6D table, is not in the spec, and has no state file, no snapshot and no run report in
`data/normalized/`.

Evidence — every event found this run, verbatim from `search_event`:

| bndy event id | title | date | externalId |
|---|---|---|---|
| `b002c031-7270-4606-b667-4a5a8afceda0` | Mica Alice @ Stansted Park Garden Centre | 2026-08-21 | *(returned by the 409 sentinel)* |
| `423c11f2-1d8e-4766-b650-7e16642f447b` | Astromoda @ The Crown Inn Emsworth | 2026-08-21 | `sceniceye-daily-import` / `event_2026-08-21_astromoda_crown-inn` |
| `3267f4db-5fcb-404c-a698-00dbe2f30773` | Jonny Moody @ The Lord Raglan | 2026-08-21 | `sceniceye-daily-import` / `event_2026-08-21_jonny-moody_lord-raglan` |
| `faf2bdfb-2cbb-42dc-b7b9-1dc8bb63f25a` | CarbonCopy Party Band @ The Heroes | 2026-08-21 | `sceniceye-daily-import` / `event_2026-08-21_carbon-copy_the-heroes` |
| `c681b493-15c5-42aa-a556-b0de73b50b3c` | 90s Garden Party - Featuring Michelle Lewis and Tom Light | 2026-08-22 | `sceniceye-daily-import` / `event_2026-08-22_90s-garden-party_olive-leaf` |
| `50ec6156-a38e-4af5-8bcf-1b25d60ba226` | Millie Jenson @ The Stags Head | 2026-08-22 | `sceniceye-daily-import` / `event_2026-08-22_millie-jenson_stags-head` |
| `72622130-7a25-401b-9726-62ad226dcfbd` | Mucky Fingers @ The Swallow | 2026-08-22 | `sceniceye-daily-import` / `event_2026-08-22_mucky-fingers_the-swallow` |
| `ba3770a7-ff89-4833-8c9b-e6f48afeda6c` | The Austin's @ Leigh Park Working Men's Club | 2026-08-22 | `sceniceye-daily-import` / `event_2026-08-22_the-austins_leigh-park-wmc` |
| `9a460bf2-8dad-42c5-8d0a-6ef1d36cb448` | Mark Searle @ The Prince of Wales | 2026-08-22 | `sceniceye-daily-import` / `event_2026-08-22_mark-searle_prince-of-wales` |
| `7e331ffe-dca6-42fd-8f98-3417e1b2aed9` | Why 2K @ The Woodman, Purbrook | 2026-08-22 | `sceniceye-daily-import` / `event_2026-08-22_why-2k_the-woodman` |
| `6a62ab61-1f69-48e0-b348-7e8169ee156d` | The Pop Pickers @ Cowplain Social Club | 2026-08-22 | `sceniceye-daily-import` / `event_2026-08-22_pop-pickers_cowplain-social` |
| `d7bcf125-5b1b-4af9-91a9-9ece527f3040` | Snake Heart @ The Heroes | 2026-08-22 | `sceniceye-daily-import` / `event_2026-08-22_snake-heart_the-heroes` |
| `d01ebd71-c8c3-41af-a82d-f10137fe4fa7` | Forever Oasis @ The Westleigh | 2026-08-22 | `sceniceye-daily-import` / `event_2026-08-22_forever-oasis_the-westleigh` |
| `4f157f96-88ba-4931-a777-6f9c3ceb96f8` | Through the Decades Duo - Mal & Lena @ The Golden Lion | 2026-08-23 | `sceniceye-daily-import` / `event_2026-08-23_through-the-decades_golden-lion` |
| `395f4694-f114-44ce-86b7-86767f1eb90b` | Sean Sings Elvis @ The Crown Inn Emsworth | 2026-08-23 | `sceniceye-daily-import` / `event_2026-08-23_sean-sings-elvis_crown-inn` |
| `d244f958-ba9d-486b-9a9a-17364320dccc` | Terry Nutskin @ The Heroes | 2026-08-23 | `sceniceye-daily-import` / `event_2026-08-23_terry-nutskin_the-heroes` |
| `95158c26-17fc-4fac-b129-0a14e5a74342` | Herding Cats @ The Crown Inn Emsworth | 2026-08-25 | `sceniceye-daily-import` / `event_2026-08-25_herding-cats_crown-inn` |
| `39671176-eaa4-4c01-9ef6-8e3314364e7b` | Matt O'Neil @ The Ship Inn, Langstone | 2026-08-26 | `sceniceye-daily-import` / `event_2026-08-26_matt-oneil_ship-inn` |

The same namespace is on a venue: `d3200659-f23b-4a19-a2c3-63e036b75c56` "The Golden Lion" carries
**both** `{sceniceye, venue-the-golden-lion-bedhampton}` **and**
`{sceniceye-daily-import, venue_the-golden-lion}`.

**Why this matters, in three parts.**

1. **Idempotency is broken for this task.** The id form is `event_<date>_<act>_<venue>` with
   underscores and a short venue token. §6D's form is `<date>-<artist>-<venue>` with hyphens. A
   `get_by_external_id` lookup on the §6D key misses every one of these records. This run only
   found them because the artist+venue+date sentinel fired and because it read them back by venue.
   The sentinel is the safety, exactly as §6D says — but the externalId has stopped doing its job.
2. **The scheduled task is now redundant work.** The other writer runs first and takes everything.
   Tonight the scheduled run had one gap to fill and it turned out not to be a gap (§6).
3. **`edit_event(externalIds)` replaces and dedupes to one id per source** (§6B). The two ids are
   from different sources so they can coexist, but a back-fill of the §6D key onto these 18 records
   is a decision, not a run's call. Nothing was rewritten.

Raised as `sceniceye-daily-import-second-namespace`.

## 6. The one apparent gap, and why it was not one

The Saturday bill `90s Garden Party - Featuring Michelle Lewis and Tom Light` at The Olive Leaf is a
two-act bill. §4 requires one discrete event per act. bndy held one event whose primary artist is
Michelle Lewis (`5d5fcfed-6c1e-4a83-875f-e6c0fd6b76ff`), so a Tom Light child looked missing.

`create_event` for Tom Light (`0f582817-22e2-4915-af25-a45e9c172d04`) at that venue and date
returned **409 DUPLICATE_EVENT**, naming `c681b493-15c5-42aa-a556-b0de73b50b3c`. §1 enforces the
event UID per artist **including collaborators**, so Tom Light is already attached to that event as
a lineup artist. The bill is modelled, just not in the §4 shape.

Per §0.9 the bounce was taken as a match signal. No variant was retried and nothing was created.

**Note for §4:** this is the `collaboratingArtistIds` shape that §4 marks as superseded. It is live
data written by another writer, so re-planning it is a cleanup job, not an import job. Sibling ids
are recorded here so a parent can be attached retroactively: parent bill `c681b493-…`, artists
Michelle Lewis `5d5fcfed-…` and Tom Light `0f582817-…`.

## 7. Rows skipped, with reasons

**Past-dated (§0.14) — 2 rows, Thursday 20 August:**

- `Billy Joel | Number 73 Bar & Kitchen, 73 London Road, Waterlooville, PO7 7EX | 7:30 PM - 9:30 PM`
- `Adam Ede | The Crown Inn, 8 High Street, Emsworth, PO10 7AW | 8:30 PM - 10:30 PM`

**Venue is not a fixed building (§0.23) — 8 rows, Saturday 22 August, the Farmstock rows:**

| row | venue cell | why |
|---|---|---|
| Farmstock Family Festival | `214 Catherington Lane, Catherington, Waterlooville PO8 0TA` | a farm site, not a fixed music building; no correct Google Place ID exists |
| Hadley Stephen - Farmstock Festival | `Farmstock Festival` | the venue cell is an event name, not a place (§0.23 named non-places) |
| Katie Fid - Farmstock Festival | `Farmstock Festival` | as above |
| Tony Gold - Farmstock Festival | `Farmstock Festival` | as above |
| Lauren Stanley - Farmstock Festival | `Farmstock Festival` | as above |
| The SG's - Bivol Trust - Farmstock Festival | `Farmstock Festival` | as above |
| The Pfizer Chiefs | `Farmstock Festival` | as above |
| The Centurions - Farmstock Festival | `Farmstock Festival` | as above |

This is §0.23 deciding, not the word "festival" deciding, exactly as the spec's 2026-08-08 CTO
ruling requires. The seven slot rows carry no address at all — only the festival's own name in the
venue column — so no venue can be resolved and, per §1, no event can exist without one. The header
row does carry an address, and it is a farm.

**The Centurion test did not arise this week.** No `- Music Festival` rows at The Centurion appeared
in the 20-26 August capture. Had they, they would have been imported as ordinary gigs.

**Cost of the four-day Chrome outage.** The week of 13-19 August was never captured. Those rows are
now past-dated and unrecoverable — this source does not retain a rolled week. Already recorded as
`sceniceye-outage-cost-11-rows-15-16-aug` (2026-08-18) and not re-raised.

## 8. THE ERROR THIS RUN MADE — a duplicate Golden Lion

`create_venue("The Golden Lion", "54 Bedhampton Road, Havant, PO9 3EY")` returned
`matchMethod: "new_venue_created"` and created **`4ce15a95-9af0-4c7a-96d7-b3ba2df1da9b`** with
place_id `ChIJn_Ra_LhEdEgRvJ-EWySD1RQ`.

bndy already held **`d3200659-f23b-4a19-a2c3-63e036b75c56`** "The Golden Lion", same street address,
coordinates agreeing to four decimal places, carrying two sceniceye externalIds — under a
**different** place_id, `ChIJoyarZxoTfEgRWQGR0bdskas`.

**One building, two Google Place IDs, so the place_id dedup could not fire.** §1 makes the place_id
the venue UID, and that identity assumption fails when Google itself holds two entries for one pub.
`search_venue("Golden Lion", "Havant")` finds both — the older record ranks second at 73%.

**What the run did about it.** The event work used the **existing** record `d3200659-…`, which holds
the source's provenance. The new record `4ce15a95-…` holds zero events and zero externalIds. It was
not deleted: §0.11 forbids deleting during an import run, and an unattended run cannot delete
(§6G). It is raised for merge as `sceniceye-golden-lion-havant-duplicate-placeid`.

**Honest reading of the cause.** §3 item 1 requires three `search_venue` probes before any create.
The spec's own strategy is `trust-bndy-dedup-on-create`, and this run followed the spec on the
grounds that place_id dedup is stronger than name matching. On thirteen of fourteen venues it was.
On this one it was not, and §3 item 1 would have caught it. **The runbook rule is right and the
spec's shortcut is wrong.** The correct order is: probe, then create. This is the only venue in the
capture that had not already been matched by place_id on an earlier run.

## 9. Venues resolved — full UUIDs

| source venue cell | bndy venue | id | method |
|---|---|---|---|
| The Crown Inn, 8 High Street, Emsworth | The Crown Inn Emsworth | `557be6b0-33f9-4945-8adb-fe1cd7dff78b` | google_place_id, 100% |
| The Heroes, 125 London Road, Waterlooville | The Heroes, Waterlooville | `eb51991a-b082-433c-90e4-123340283271` | google_place_id, 100% |
| The Lord Raglan, 35 Queen Street, Emsworth | The Lord Raglan | `bedb0ed3-e93c-4ddf-9fe3-7d0a044f9316` | google_place_id, 100% |
| Stansted Park Garden Centre, Rowlands Castle | Stansted Park Garden Centre | `3218ee02-6145-4aac-9be8-c113acfefdb1` | google_place_id, 100% |
| The Olive leaf, 48 Sea Front, Hayling Island | The Olive Leaf | `d4cf2b67-2550-45c4-9511-0cd9971341e1` | google_place_id, 100% |
| Stags Head, The Square, Westbourne | The Stags Head | `c90f3d40-f90d-4e61-b498-dbd40db12ff9` | google_place_id, 100% |
| The Swallow Pub, 296 Middle Park Way, Havant | The Swallow | `18a06cd3-8556-42c4-8e12-b0c2c6140073` | google_place_id, 100% — **address disagrees, see below** |
| Leigh Park Working Mens Club, Havant | Leigh Park Working Men's Club | `6e35b9e8-f859-4452-9ce5-e70061e0d31e` | google_place_id, 100% |
| Prince of wales, 164 West St, Havant | The Prince of Wales | `8670d198-54a8-43a5-80f9-94bca1b21f40` | google_place_id, 100% |
| The Woodman, London Road, Purbrook | The Woodman, Purbrook | `52867bf8-e2b0-461c-9da5-c563f5464e2b` | google_place_id, 100% |
| Cowplain Social Club, 54 London Road | Cowplain Social Club | `2f01ebc9-abce-4ff6-8b39-0bde440d45ff` | google_place_id, 100% |
| The Westleigh, Martin Road, Havant | The Westleigh | `11fbe3bb-6798-4c30-b34e-2b999648ac01` | google_place_id, 100% |
| The Golden Lion, 54 Bedhampton Road, Havant | The Golden Lion | `d3200659-f23b-4a19-a2c3-63e036b75c56` | existing record, used for the event — see §8 |
| THE SHIP INN, Langstone Road, Havant | The Ship Inn, Langstone | `c3e9765d-db57-49d6-8cad-3ca67d745ae6` | google_place_id, 100% |

**Postcode check (§0.24).** Every postcode is PO7, PO8, PO9, PO10 or PO11 — the Havant, Waterlooville,
Emsworth, Hayling Island and Portsmouth district. All inside this source's declared region. Zero
out-of-region rejects.

**The Swallow address disagreement, report-only.** The source publishes
`296 Middle Park Way, Havant, PO9 4NL`. Google resolves that query to the bndy record at
`500 Dunsbury Way, Havant PO9 5BL`. Same town, same PO9 district, name agrees. The place_id decides
(§1) and the match was accepted. Not raised: one pub, one place_id, no duplicate, and the postcode
district agrees. Recorded here so a later run does not read it as a new fault.

## 10. Artists — 19 matched, 0 created, 1 enriched

All nineteen acts already existed. `search_artist` at 100% on seventeen, 92% on `The Austin's`
(apostrophe), and two resolved by rule:

| source billing | bndy artist | id | how |
|---|---|---|---|
| Carbon Copy Band | CarbonCopy Party Band | `ec178188-4204-4c70-ad94-5baa93a040b1` | §1A.5 alias table, learned 2026-07-31. `search_artist("Carbon Copy")` returns **nothing** at 60% — the alias table is what found it |
| Through the Decades Duo - Mal & Lena | Through the Decades Duo - Mal & Lena | `71b57165-40a0-4dc1-a650-8007fd137cba` | `create_artist` returned `action: matched`, `matchedBy: facebook`, confidence 1.0 |

Full id list: Mica Alice `ae8536f4-f600-4673-a8db-d365773a5073` · Astromoda
`d080a8c4-a057-4150-98a0-0ace3cce442f` · Jonny Moody `5b4bfbb8-41f0-4b6f-8bb9-71896f1b3e61` ·
CarbonCopy Party Band `ec178188-4204-4c70-ad94-5baa93a040b1` · Michelle Lewis
`5d5fcfed-6c1e-4a83-875f-e6c0fd6b76ff` · Tom Light `0f582817-22e2-4915-af25-a45e9c172d04` ·
Millie Jenson `0c86d283-ff89-42fb-a2b4-39bbb1e5fe31` · Mucky Fingers
`fe13f541-6cfc-4641-ac40-c556bc6cfcdb` · The Austin's `f1e96134-b0d8-477e-97e4-3614eaed3329` ·
Mark Searle `392605f5-e06b-488b-a072-e6a7a73a11fc` · Why 2K `34d6632c-051f-4e39-b576-1fd5ddde22e0` ·
The Pop Pickers `ac76db7b-4310-4816-a41b-e74501517d5b` · Snake Heart
`39513b34-6fe6-47e2-87a2-af29fcb3c5e8` · Forever Oasis `6a085a91-d9df-414f-8f68-a3c800184b5e` ·
Through the Decades Duo `71b57165-40a0-4dc1-a650-8007fd137cba` · Sean Sings Elvis
`4bc28075-a01b-4ef2-a9e1-71de0941f337` · Terry Nutskin `ff73c1e9-7c00-4e8d-8402-84295b8d2899` ·
Herding Cats `ec73e6a8-6f80-41b6-8a9f-adf928ffb338` · Matt O'Neil
`b8f27dba-ba54-4d34-8959-3a89c8a7bdfd`.

### The enrichment — `71b57165-40a0-4dc1-a650-8007fd137cba`

The record was created **2026-08-21T00:15:32Z**, nineteen minutes before this task fired, by the
same writer as §5. It arrived with an empty bio, no genres, and location `Hampshire UK` — a
near-stub. §1A.4 repair-on-contact applies.

**Both surfaces were used before any write (§2A.1 item 3b).**

- Google: `"Through the Decades" duo Mal Lena band`. First result is the act's own Facebook page,
  with the description in the snippet. Corroborated by a booking agency (johnbedford.co.uk) and by
  a post from **the golden lion. Bedhampton** — the exact venue in this week's row. That post is the
  hard identity signal §2A.1 requires; a name match alone would not have been enough.
- Facebook: the page was **visited**, not just linked — `facebook.com/throughthedecadesduo`,
  263 followers, category Musician/band, `Portsmouth, United Kingdom`.

**Written:**

| field | value | source |
|---|---|---|
| `bio` | `Join Mal & Lena on a musical journey through the decades - with classic hits from across the years!` | quoted character for character from the act's own page (§2A.1 item 8). Zero edits |
| `genres` | `["Pop"]` | inferred. Genres is the only field a run may infer |
| `location` | `Portsmouth` | the page's **own** stated location, which overrides the source's `Hampshire UK` default (§2A.3) |
| `locationType` | `city` | not `regional`, because the value is a town. The Kilmarnock trap (§6B) does not apply to a town |

Read back in the `edit_artist` response: `updatedFields` = location, locationType, bio, genres. All
four present and correct.

**Not written, and why.** `facebookUrl` and `profileImageUrl` were already correct on the record.
`actType` was already `["covers"]` and the evidence agrees. `nameVariants` was not attempted:
`edit-artist-409-namevariants` (2026-08-12) and `create-artist-500-namevariants` (2026-08-08) are
both open against that field.

**The name was NOT changed, and that is a judgment call worth stating.** The record is named
`Through the Decades Duo - Mal & Lena`, which is the source's billing with a member tail. The act's
own page reads **`Through The Decades - Duo`**. §0.6 says the tail is listing copy and §2A.5 says
the act's own page is the naming authority, so a rename is indicated. The run did not perform it
for one reason: **another writer created this record nineteen minutes earlier and may still be
working it.** Renaming a record mid-flight under another writer is the collision §6F exists to
prevent, and the rename adds no gig to bndy (§0A rule 3). The evidence is recorded here and the
item is raised as `through-the-decades-name-carries-member-tail`. The bio, genres and location
top-up carried no such risk and was done.

## 11. Gate bounces, verbatim

Two 409s. Both taken as match signals (§0.9). No variant retried.

```
DUPLICATE_EVENT
Event already exists: This artist already has an event at this venue on 2026-08-21.
Artists can only have one gig per venue per day.
existingEventId: b002c031-7270-4606-b667-4a5a8afceda0
existingEventTitle: Mica Alice @ Stansted Park Garden Centre
matchedExternalId: null
```

```
DUPLICATE_EVENT
Event already exists: This artist already has an event at this venue on 2026-08-22.
Artists can only have one gig per venue per day.
existingEventId: c681b493-15c5-42aa-a556-b0de73b50b3c
existingEventTitle: 90s Garden Party - Featuring Michelle Lewis and Tom Light
matchedExternalId: null
```

`matchedExternalId: null` on both. The sentinel matched on artist+venue+date, **not** on the
externalId — which is §5's second line of defence doing the work the externalId should have done.
This is the §5 finding, measured.

## 12. Validator (§6A step 8)

Evidence file: `data/state/enrichment-evidence-2026-08-21-sceniceye.jsonl`, one line, this run's own
file per §6F. No legacy per-date file was touched.

```
python3 scripts/enrichment_validate.py --records <this run's record> \
  --evidence data/state/enrichment-evidence-2026-08-21-sceniceye.jsonl

[warn] Through the Decades Duo - Mal & Lena  71b57165-40a0-4dc1-a650-8007fd137cba
       WARN  NAME_BILLING: contains ' - ' (promo tail?): 'Through the Decades Duo - Mal & Lena'

1 records · 0 clean · 0 FAIL · 1 WARN   [mode=gate]
```

**0 FAIL. Exit 0.** The single WARN is the §0.6 name tail described in §10, and it is the item
raised. The validator caught the same defect the run reasoned to independently, which is the
machine-checkable half of §6A step 8 working as intended.

**Honest note on ordering.** §6A step 8 requires the evidence file to be written **before** the bndy
write. For a record whose id does not yet exist, that is not literally possible; here the record
already existed, so the evidence line was written before the `edit_artist` call, with `capturedAt`
set to the real capture time. The order held.

## 13. Snapshot

Written to `data/state/sceniceye-last-page.txt`: week 20-26 August 2026, 28 gig rows plus one
"No gigs listed" line for Monday 24 August. Normalisation rules carried in the file's own header
so the next run reproduces them.

This run wrote to bndy, so the §6A step 7 fail-closed gate binds. The snapshot write succeeded.

## 14. Raised to `CTO-INBOX.md`

Checked against every existing fingerprint in that file first. Three new lines.

| KIND | FINGERPRINT |
|---|---|
| DEFECT | `sceniceye-daily-import-second-namespace` |
| DATA | `sceniceye-golden-lion-havant-duplicate-placeid` |
| DATA | `through-the-decades-name-carries-member-tail` |

**Not raised, because already present:** `sceniceye-mode-not-declared` (2026-08-12),
`sceniceye-third-surface-needs-ruling` (2026-08-19),
`sceniceye-outage-cost-11-rows-15-16-aug` (2026-08-18),
`sceniceye-chrome-unreachable-blocks-capture` (2026-08-18),
`create-artist-500-namevariants`, `edit-artist-409-namevariants`,
`record-run-token-missing`.

**Not raised, because it is not an item.** The Farmstock skip is §0.23 working. The Swallow address
disagreement is one pub with one place_id. Neither is a defect.

## 15. `record_run`

Not attempted. `record-run-token-missing` (2026-08-08) is open and `SOURCE_RUNS_TOKEN` is unset.
Non-blocking per the task contract. `run-summary.jsonl` is the dashboard's real input and was
appended.

## 16. What the next run should expect

- The snapshot is now current. The next diff is a normal small delta, not a whole-week swap.
- The curator rolls on a Thursday. The next roll is 27 August.
- **The redundancy question is the live one.** If `sceniceye-daily-import` keeps taking the week
  twenty minutes ahead of this task, this task will keep finding zero to write. That is a good
  outcome for bndy and a wasteful one for the schedule. It needs a ruling, not a run's decision.
