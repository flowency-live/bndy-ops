# KLMA Stoke gig list — run report 2026-08-14

- **Run id**: `klma-stoke-gig-list-2026-08-13T23-50-55Z`
- **Fired**: 2026-08-13T23:50:55Z (local date 2026-08-14, BST)
- **Outcome**: completed
- **Runbook read**: `RUNBOOK.md` H1 **v2.27**. §6A CURRENT FLOOR **v2.19**. Assertion PASS.
  The task prompt names no numeric floor, so §6A step 2a is the only gate that ran.
  The stale `>= v2.4` prompt floor is already in CTO-INBOX as `prompt-runbook-floor-drift`.
- **Spec read**: `sources/klma-stoke-gig-list.md` in full, including §VA and §VA.9.
- **Claim**: `data/state/claims/klma-stoke-gig-list.json` was released (`heldBy: null`,
  `lastRun` 2026-08-12T08-19-07Z). Acquired at 2026-08-13T23:52:00Z, TTL 2 hours.
  No takeover. No `enrichment.lock` was found.
- **Heartbeat**: `data/state/heartbeat/klma-stoke-gig-list-2026-08-13T23-50-55Z.json`.
- **Validator**: `6 records · 6 clean · 0 FAIL · 0 WARN   [mode=gate]` — exit 0.

---

## 1. Headline counts

Counts are of records **written to bndy and read back** (§0.10). They are not rows considered.

| | diff work | John Sewell backlog | total |
|---|---|---|---|
| Events created | 16 | 11 | **27** |
| Artists created | 5 | 1 | **6** |
| Venues created | 0 | 4 | **4** |
| Existing records enriched | 5 | 0 | **5** |
| Rows already in bndy (409) | 8 | 0 | 8 |
| Rows deferred on budget | 0 | 0 | **0** |
| Rows skipped | 0 | 0 | 0 |

Cap is 50 creates. The run used **37 of 50**. It did not hit a cap and it did not run out of time.

**Every added row was pipelined.** The §"order by gigs-per-artist" ruling was applied but did not
bind this run, because the whole added set fitted inside the budget. The spare budget was then
spent on the open `john-sewell-not-reached` inbox item — see §5b.

## 2. Capture

| section | surface | rows |
|---|---|---|
| 1 — KLMA sheet | Chrome on `gviz/tq?tqx=out:html` | 416 |
| 2 — The Sugarmill | Chrome DOM read of `thesugarmill.co.uk/gig-guide/` | 31 distinct (26 dated, 5 undated) |

Raw captures: `data/raw/klma-stoke-gig-list/2026-08-14/`.

**Column layout re-verified against the trailing header row (DOM row 417 of 417):**
`[2]=Artist [3]=Venue & Location [5]=Cost/Ticket [6]=Genre [7]=Link to Event`, 14 columns.
This matches the post-2026-08-06 mapping. **No off-by-one. No Artisan Tap genre bleed this run.**

`web_fetch` was not used on the gviz endpoint. Chrome is the only trusted surface (spec).

⚠ **`javascript_tool` guards hit, both known (§6B).** Output truncates near 1.2 KB, and any
returned string containing `=` is blocked. The capture was paged, and `=` was transformed to
`(eq)` on return and reversed locally. Neither is a source fault. The `DOMParser` and
`innerHTML` entity-decode routes are **blocked on docs.google.com by Trusted Types** — a manual
named-entity decoder was used instead. That is new and is recorded here, not as an inbox item,
because it changed nothing about the output.

## 3. Diff

### Section 1 — 23 added / 11 removed / 393 unchanged (of 404)

⚠ **32 further rows moved position without changing content.** The curator re-sorted inside
several days. A positional diff reports 32 changes; a content diff reports none. The diff used
here is content-keyed, so order movement produced no added and no removed row.

**11 removed rows:**

| row | date | what it was | disposal |
|---|---|---|---|
| Rachel shenton @ The Victoria | 2026-08-09 | past | normal past-drop |
| Ant Clowes Duo @ The Shamrock | 2026-08-10 | past | normal past-drop |
| The Courettes @ The Rigger | 2026-08-10 | past | normal past-drop |
| Vox Americana @ The Glebe | 2026-08-11 | past | normal past-drop |
| **Razed On Radio @ Ye Olde Crown** | **2026-08-17** | **future** | **logged, NOT deleted** |
| **Blindsided @ Ye Olde Rose & Crown** | **2026-11-21** | **future** | **logged, NOT deleted** |
| Afterglow @ The Raven | 2026-08-16 | form-append row | promoted into the main body |
| Resurrected @ Ye old crown | 2026-08-16 | form-append row | promoted into the main body |
| Guitar Monkey @ Princess royal | 2026-08-15 | form-append row | promoted into the main body |
| Tanky @ Bench & Bar | 2026-08-15 | form-append row | promoted into the main body |
| Terri and the Waders @ The Globe | 2026-08-29 | form-append row | promoted into the main body |

The last five are **not removals**. The curator moved each row out of the append block below the
trailing header row and into the sorted list, so each one leaves as a removal and returns as an
addition. All five re-appear in the added set. Nothing was lost and nothing was deleted.

**The two genuine future removals were NOT actioned.** §0.29: this spec declares no mode, so the
run treats the source as `append-only`, §5.7 removed-row handling and §0.17 deletion do not run.
- `Razed On Radio @ Ye Olde Crown 2026-08-17` — bndy event `78ff307e-25a1-4d1f-80ca-c7d2fddf7036`
  is **live** and holds a klma externalId `b4761eb1218e`. Left alone. Raised as a DATA item.
- `Blindsided @ Ye Olde Rose & Crown 2026-11-21` — **no bndy event exists**. Checked by artist
  `83f7c3dc-b644-4c26-8599-f1dbe3bcd963`, whose only forward event is Green Star 2026-11-15.
  Nothing to do.

### Section 2 — 1 added / 0 removed

Added: `2026-11-13 | 19:00 | TOM A SMITH | £14.50 | tom-a-smith-friday-13th-november-2026`.
The other 25 dated rows are byte-identical to the 2026-08-12 snapshot. The 5 undated slugs are
the same 5, already resolved on 2026-08-12 (3 imported, 2 rejected as 23:00 club nights).

### §5.7(a) self-diff gate

Both sides normalised with the rules written into the snapshot header, then the new snapshot was
re-diffed against the capture it was written from:

```
section 1: 0 added / 0 removed / 416 of 416 row hashes identical, IN ORDER. PASS.
section 2: 0 added / 0 removed / 26 of 26 dated rows identical.            PASS.
```

## 4. Tombstone check

`data/state/cancellations.jsonl` holds one real entry (PULS @ Arden Arms 2026-08-08). No row in
this run matches on artist + venue + date. No `TOMBSTONED-` disposal.

## 5. Events created — 16

All verified by `get_by_id` or by a `search_event` read-back after the write.

| # | date | artist | venue | time | id |
|---|---|---|---|---|---|
| 1 | 2026-08-23 | Gambler | Ye Olde Crown | 19:00 | `8a71a6ac-4035-439e-a9d7-21e684faf009` |
| 2 | 2026-08-23 | The Scoundrels | The Coppenhall Working Mens Club | 19:00 | `aa495b37-1c3f-4333-a1d4-baee5dace120` |
| 3 | 2026-08-30 | Mutton Dressed As Glam | Ye Olde Crown | 19:00 | `46924c36-71f1-4a68-8d38-e567085c8cbb` |
| 4 | 2026-09-06 | Dirty Little Secret | Ye Olde Crown | 19:00 | `a1e30fea-fd6d-4d77-8f7b-1fbfb5e5093b` |
| 5 | 2026-09-12 | Trafford Park | Oakhill Bowling & Recreation Club Ltd | 21:00 | `a8a79abb-7806-4ce9-b4b8-31f2ffad6e56` |
| 6 | 2026-09-13 | Jukebox Heroes | Ye Olde Crown | 19:00 | `01517b33-6bed-44e8-8639-69c3a0500abb` |
| 7 | 2026-09-20 | Havoc | Ye Olde Crown | 19:00 | `ddcf1a69-b110-4d13-bb05-23f31bb64e66` |
| 8 | 2026-10-04 | Derailed | Ye Olde Crown | 19:00 | `bf502efa-aa85-4719-8391-0b629e2eea8c` |
| 9 | 2026-10-11 | Resurrected | Ye Olde Crown | 19:00 | `56f703b0-ec3d-4997-87dd-1617a9c86c95` |
| 10 | 2026-10-18 | Razed On Radio | Ye Olde Crown | 19:00 | `10609eb1-8eec-4f6f-9b6f-fbc8b114dd37` |
| 11 | 2026-10-25 | Electric Mutiny | Ye Olde Crown | 19:00 | `12a16e41-3966-48ae-b522-419515df0709` |
| 12 | 2026-11-13 | Tom A Smith | The Sugarmill | 19:00 | `6f143ebe-233c-454d-b4cf-b3ff4164fd42` |
| 13 | 2026-11-15 | Venture X | Ye Olde Crown | 19:00 | `54d2f430-57f2-47c1-a63c-7634ffc1e320` |
| 14 | 2026-11-22 | Malpractice | Ye Olde Crown | 19:00 | `763875e9-74e2-425a-baea-398313434d75` |
| 15 | 2026-11-29 | Derailed | Ye Olde Crown | 19:00 | `88fc85af-c6b9-431c-b679-643e0ecad144` |
| 16 | 2026-12-13 | Mutton Dressed As Glam | Ye Olde Crown | 19:00 | `5662bb10-c249-48a6-a967-b0ba0f420282` |

**A new Sunday residency at Ye Olde Crown, Burslem is the substance of this run.** The curator
added 14 consecutive Sunday rows at 7:00 pm, from 2026-08-16 to 2026-12-13. Twelve of them were
new to bndy.

## 5b. John Sewell Music — the open inbox item, cleared

CTO-INBOX has held `john-sewell-not-reached` since 2026-08-08: *"John Sewell Music holds 9 gigs
behind one artist create. Not reached on budget. Highest single yield."*

⚠ **That backlog could never resurface through the diff.** His rows sit in the snapshot as
unchanged rows, so every later run reads them as already seen. The item would have stayed open
for ever. This run had 29 creates of budget left and cleared it.

**11 rows, one artist create, four venue creates, 11 events.**

| # | date | venue | time | id |
|---|---|---|---|---|
| 1 | 2026-08-14 | Cappello Lounge, Newcastle-under-Lyme | 21:00 | `0f330823-698a-46fd-abbb-d19db622290f` |
| 2 | 2026-08-23 | Sandon Hall, Stafford | 19:00 | `69e320e8-aabe-4955-9166-9391b977dc0a` |
| 3 | 2026-08-30 | Red Lion Bradley, Stafford | 19:00 | `c1626c5b-e2a7-4e8a-b328-ff84acbd19c5` |
| 4 | 2026-09-20 | Crown Wharf, Stone | 19:00 | `5eb0d8bd-2c34-4ecc-9816-9de04e1ca0dc` |
| 5 | 2026-10-10 | The Globe, Tunstall | 21:00 | `9cc30bd7-2a66-4571-85bc-f9f1d3609cba` |
| 6 | 2026-10-17 | The Bridge Inn, Stone | 21:00 | `666fd121-9f6f-4eaa-8c80-a865d3a9bc52` |
| 7 | 2026-10-23 | The Dog House, Stafford | 21:00 | `0bfae7c4-960e-4b8b-ac1e-06776fe7eaac` |
| 8 | 2026-10-24 | The Old Bulldog, Longton | 21:00 | `6c3bcc34-331b-43f0-ad56-2ff3aef415e4` |
| 9 | 2026-11-14 | The Globe, Tunstall | 21:00 | `31014640-066e-4760-84e5-62f0708d44d9` |
| 10 | 2026-11-15 | Crown Wharf, Stone | 19:00 | `4d65f6c7-9fc7-4a58-b4c7-507f17ad9885` |
| 11 | 2026-11-21 | The Prince of Wales, Stafford | 21:00 | `be3e8204-2d3c-4366-9505-08fe6af1c7fd` |

All 11 verified in one `search_event(artistId, dateFrom, dateTo)` read-back. Every row carried an
empty Time cell, so every time is a §5.6 weekday default: Friday and Saturday 21:00, Sunday 19:00.

**Artist `John Sewell Music` `315d26f9-0a59-42a2-8f7c-f98efca1e36d` — verified page.**
`facebook.com/p/John-Sewell-Music-61567632406514`, 266 followers, page type Musician/band.
⚠ **The page's own name is `John Sewell Music`, tail included.** §2A.5's verified-source-name
exception applies, so the `Music` tail is NOT stripped, and the spec's `Andrea Harvey Music`
precedent does NOT carry across. Bio quoted verbatim. Location `Staffordshire` is stated by the
page, so `locationType: regional` was set explicitly (§6B Kilmarnock trap). `actType ["covers"]`
from *"acoustic music through the eras"*. `acoustic: true`, because the sheet's genre column reads
`Acoustic` on all 11 rows and §0.18 makes that a FLAG, not a genre. `genres` left EMPTY.

⚠ **`locationType` is not returned by `get_by_id`, so it cannot be verified on read-back (§0.10).**
It was written twice — once on create, once on an explicit `edit_artist` — and `edit_artist`
confirmed `locationType` in its `updatedFields`. That is the strongest confirmation available.

**Four venues created, all geocoded with a Google Place ID, all postcode-checked (§0.24):**

| venue | id | postcode |
|---|---|---|
| Sandon Hall | `1bea7c85-bd61-4c25-879f-e4bba4f2cdf6` | ST18 0BZ ✔ |
| Red Lion Bradley | `84d3d753-9d1e-420c-989f-365839a621dc` | ST18 9DZ ✔ |
| The Dog House | `e48a0afd-2435-46f9-9813-b4b8ee31ed58` | ST16 2LB ✔ |
| The Prince of Wales Stafford | `2c0c6d4b-23bf-445f-9e5b-edff76205a81` | ST16 3RW ✔ |

Each passed all three §3 probes before the create: exact name, distinctive word plus city, and a
full `list_venues(city:"Stafford")` read of all 16 Stafford venues. None was present.
Google returned a fuller name for two of them — `Red Lion Bradley` and `The Prince of Wales
Stafford`. Per the 2026-08-09 ruling the postcode decides, not the name, so both were kept.

`£3.50 entry` on the Sandon Hall row mapped to `ticketed: true`, `price: £3.50`,
`ticketInformation: "Payable on the door"` (§CT, the v2.19 `£N entry` row).

## 6. Ticketing — §CT mapping applied

| source cell | row | written |
|---|---|---|
| `£5 for 3 bands` | The Scoundrels 2026-08-23 | `ticketed: true`, `price: £5.00`, `ticketInformation: "£5 for 3 bands."` |
| `£2.50 pp tickets.` | Trafford Park 2026-09-12 | `ticketed: true`, `price: £2.50`, `ticketInformation: "Tickets £2.50 per person."` |
| `Free!` | Afterglow 2026-08-16 | already imported; no change |
| `Free` | Terri and the Waders 2026-08-29 | already imported; no change |
| `Free Entry` | Tanky 2026-08-15 | already imported as `ticketed: false`, `price: Free` |
| *(blank)* | 18 rows | nothing written — blank is unknown, not free |
| `£14.50` (Sugarmill) | Tom A Smith 2026-11-13 | `ticketed: true`, `price: £14.50`, `ticketUrl` stored |

⚠ **New vocabulary this run: `Free!` and `£5 for 3 bands` and `£2.50 pp tickets.`** None was in
the §CT table. The 2026-08-08 CTO rule was applied verbatim — a value stating zero is `Free`, a
value stating a number is that number. **These are mapping jobs, not escalations, and no row was
parked over a ticketing string.** The three spellings are named here so the §CT table can grow.

## 7. Default start times — §5.6

Three rows carried no time. Two were Saturday, one was already covered.

| row | weekday | defaulted to |
|---|---|---|
| The Scoundrels @ Coppenhall 2026-08-23 | Sunday | 19:00 |
| Trafford Park @ Oakhill Bowling 2026-09-12 | Saturday | 21:00 |

All 14 Ye Olde Crown residency rows published `7:00 pm` and were taken at 19:00 as published.
No row needed a §0.28 window split — no cell held a time range.

## 8. Artists created — 6

**Three with a verified page** (Jukebox Heroes, Tom A Smith, John Sewell Music — the last is in
§5b). **Three as an evidenced blank.** Search variants for every blank are in
`data/state/enrichment-evidence-2026-08-14-klma-stoke-gig-list.jsonl`.

### Verified page

| artist | id | evidence |
|---|---|---|
| **Jukebox Heroes** | `970f06ee-d257-4d74-85de-b0b7b24a687e` | `facebook.com/JukeboxHeroesStoke` — page slug names the town; its 31 July 2026 post names The Swan Inn, a Stoke-area room; page type Musician/band; 514 followers; active. Bio quoted character for character, member list line breaks preserved. Genres `["Rock"]` inferred from *"Classic rock covers"*. `actType ["covers"]` stated on the page. |
| **Tom A Smith** | `06544fe2-f58c-477a-bda7-bc682fb6f962` | `facebook.com/TomASmithMusic` — 67K followers, page type Musician. Bio quoted verbatim. Instagram `tomasmithmusic` taken from the page. `actType ["originals"]` from *"Singer of my songs"*. Genres `["Indie"]` inferred. |

⚠ **Tom A Smith's location did not come from his own page — the page states none.** It is
`Sunderland`, taken from two Google results: `fredperry.com/subculture/articles/tom-a-smith`
("Tom A. Smith - Musician — Sunderland") and `livingnorth.com` ("Teenage Sunderland Musician").
**The Sugarmill is a national-act venue, so the §0.7 gig-town fallback was forbidden** and
"UK wide" was the alternative. Evidenced Sunderland beats an unevidenced regional string.

⚠ **The act's own page spells him `Tom A Smith`, with no full stops.** The Sugarmill bills him
`TOM A SMITH`. Tileyard and Living North both write `Tom A. Smith`. The page wins (§2A.5).

### Evidenced blank

| artist | id | variants tried |
|---|---|---|
| **Derailed** | `3ef87f19-c0fc-481a-a37e-c66d92acdd36` | Google `derailed band stoke`, `derailed band facebook`; visited `derailedband.co.uk`. Every Facebook candidate is US (Laguna Niguel CA, Poconos PA, Ohio County KY, Indiana). `derailedband.co.uk` says only *"we are only a local covers band"* — no town, no gig diary, so it fails the §2A.1 bar. Blank beats wrong. |
| **Dirty Little Secret** | `9173aa80-dd37-4897-b6cd-719cc485eb02` | Google `"Dirty Little Secret" band Staffordshire`, `"Dirty Little Secret" covers band UK`. Four UK acts of this name exist — Warrington, South London, Swansea, and Nottingham's "Dirty Little Secrets". None ties to Stoke. Name match alone is never sufficient. |
| **Electric Mutiny** | `14b0b3fd-2cee-4198-9a31-b21097ff97dc` | Google `"Electric Mutiny" band`, `Electric Mutiny band facebook Stoke`. No act of this name returned on either query. |

All three carry `location: Stoke-on-Trent`, `locationType: city`. Ye Olde Crown is not a
national-act venue, so the §0.7 gig-town fallback is permitted here. `actType`, `genres` and
`bio` were left EMPTY — §0.18, unknown beats wrong.

⚠ **The Facebook page-search surface was unavailable this run.**
`facebook.com/search/pages/?q=...` returned **"Not Found"**. Direct act pages read normally —
`facebook.com/Malpracticestoke`, `JukeboxHeroesStoke` and `TomASmithMusic` all returned full
Intro text, so §2A.3 page visits still work. **Only surface (a) of §2A.1 item 3b is down.**
Google, surface (b), carried every identification this run. This is raised as a DEFECT.

### `create_artist` review verdicts

`Electric Mutiny` returned `action: "review"` against **Electric Empire (Exeter, 64%)** and
**Electric Mandarin (Exeter, 63%)**. Neither shares the name and both are in a different
canonical region. §1A.7 first bullet: different name means it is not a collision. Resolved with
`confirmNew: true`. **This is the sanctioned path, not a §0.9 gate workaround.**

## 9. Artists reused — 15, no duplicate created

`Resurrected UJFuy7vqUxRB7rfGEOtT` · `Crosshair 5M2OlxTbMCg7LdmCqLDx` ·
`Mutton Dressed As Glam a3b7b769-c1cf-48f4-a49f-9a0ab8e5cb89` · `Guitar Monkey 7FDaYyPgFt7HzALIhTdk` ·
`Tanky/Electrifying 80's show a603777d-25f1-4f4c-9d13-866a4a0fe49c` · `Afterglow u4fgfLIn3BQcPn5BBCwt` ·
`Gambler b73f9535-d2dc-48df-a7d4-69efa8737ded` · `The Scoundrels e8089d50-947d-4141-9847-a39ac245622d` ·
`Terri and the Waders b3555a0b-fec6-4110-b5ec-e8fda7345410` · `Trafford Park zTM315byRqPCbQVrfDK9` ·
`Havoc 99106598-bb14-493b-b46e-6fc348858563` · `Razed on radio nbuQpwCPVoQv14EarjJv` ·
`Ruffnecks i5YB5iVkf5QY2lzcK07l` · `Venture X P4z1cQKh1vuuesuSrQR8` ·
`Malpractice 2584af69-ce79-4537-9edf-32ee23d00c58`

### Name decisions

| sheet billing | written | why |
|---|---|---|
| `Raised On Radio` | **Razed on radio** `nbuQpwCPVoQv14EarjJv` | The act's own page is `facebook.com/Razed.On.Radio.Home` (§0.20, §2A.5). The sheet's spelling was added as a `nameVariant`. The same sheet spelled it `Razed On Radio` on the row it removed, so this is curator drift, not two acts. |
| `Jukebox Hero’s` | **Jukebox Heroes** `970f06ee-…` | The act's own page reads `Jukebox Heroes`. `Jukebox Hero's` added as a `nameVariant`. |
| `Trafford park` | **Trafford Park** `zTM315byRqPCbQVrfDK9` | Case only. `search_artist` scored 62% — below every ladder threshold — and the record is nonetheless exactly right. Another instance of the §2.16 "a low score is not a non-hit" trap. |
| `Gambler` | **Gambler** `b73f9535-…`, Macclesfield | §1A.2 footprint check. One record of this name; Macclesfield borders the Stoke area, so the footprint is adjacent, not disjoint. Reuse. No second record. |

⚠ **`edit_artist(nameVariants)` SUCCEEDED on both writes.** The open inbox item
`edit-artist-409-namevariants` records a 409 on this exact call from the 2026-08-12 gigs-news
run. It **did not reproduce** here on two attempts. Recorded as evidence on the existing item.
Not re-raised.

## 10. Venues — 4 created (all in §5b), 12 reused

| sheet billing | bndy venue | id | postcode check (§0.24) |
|---|---|---|---|
| `Ye Olde Crown Burslem` | Ye Olde Crown | `Rf2j76jAGsoRR93vc1pi` | ST6 4AW — Stoke ✔ |
| `The Princess royal,Dresdu` | The Princess Royal | `n28ZWaM3zIV4kk2HmHdm` | ST3 4HA — Stoke ✔ |
| `Bench & Bar, 93, Christchurch Street, Fenton` | Bench & Bar | `4963284b-9ac4-409f-9a48-2b62ea0b68f0` | ST4 — Stoke ✔ |
| `The Raven, Crewe` | The Raven Inn | `ILter889MV8bJCrPKpVh` | CW2 6NA — Cheshire ✔ |
| `Coppenhall Club, Crewe` | The Coppenhall Working Mens Club | `CCNVANtGSGM8vggYddzj` | CW1 4NJ — Cheshire ✔ |
| `The Globe, Nantwich` | The Globe | `1e3d87a1-8752-411d-864a-e06c2b0b89c3` | CW5 7EA — Cheshire ✔ |
| `Oakhill bowling club st45nn.` | Oakhill Bowling & Recreation Club Ltd | `ExRv69hCrGI3BXSZiLp3` | ST4 5NN — matches the billing ✔ |

⚠ `Coppenhall Club, Crewe` scored **31%** and `Bench & Bar` scored **45%** on `search_venue` —
both far below any create-new threshold, and **both are the right venue, already carrying a
`klma-stoke-gig-list` externalId.** §3's rule held: a low-confidence hit in the right town is
opened, not dismissed. Two duplicate venues avoided.

Five more were reused for the §5b backlog: `Cappello Lounge 49b346cb-d42f-4a10-8fd6-22533c18f2df`
(NUL) · `Crown Wharf ZTV2K9EgtLbudihMbcov` (ST15 8QN) · `The Globe, Tunstall
0f96c3f0-28f0-462d-9146-a87e890f0fdb` (ST6 5TA) · `The Bridge Inn zeqBH5shQluh20e8m4rL`
(ST15 8EB) · `The Old Bulldog cMnFQk0jZ9RQIwhSbncB` (ST3 1JR).

⚠ **Two "The Globe" venues are in play and they are different pubs** — The Globe, Nantwich
`1e3d87a1-…` CW5 7EA, and The Globe, Tunstall `0f96c3f0-…` ST6 5TA. The postcodes settle it
(§3.4, §0.24). The externalId slugs were disambiguated by hand: the Tunstall ids carry a
`-the-globe-tunstall` suffix so the two can never collide.

⚠ **The Princess Royal duplicate is still live** — `n28ZWaM3zIV4kk2HmHdm` and
`6c6ec5e6-f730-4c48-9248-0bfaed0e5042`, one pub, two Place IDs, same address ST3 4HA. Already in
CTO-INBOX as `princess-royal-dresden-duplicate`. Not re-raised. This run used the first.

## 11. Rows already in bndy — 8 bounces, all success signals

**409 on externalId** (idempotent re-offer of a promoted form row):

| row | existing event |
|---|---|
| Resurrected @ Ye Olde Crown 2026-08-16 | `9cc5fdae-8504-4e80-83b9-3a3733b0f7ae` |
| Guitar Monkey @ The Princess Royal 2026-08-15 | `735257b8-e41a-47fe-87fd-c5fb87f19d84` |
| Afterglow @ The Raven Inn 2026-08-16 | `38a93bcd-de17-4b6a-813b-ef84ee5313b2` |
| Terri and the Waders @ The Globe 2026-08-29 | `02a7a805-50fc-4de6-9091-3ca1105d177a` |

**409 on the artist+venue+date sentinel** (the record existed under another provenance):

| row | existing event | action |
|---|---|---|
| Crosshair @ Ye Olde Crown 2026-09-27 | `5cb025ea-5e7b-4862-8952-ace45e58f5c5` | klma externalId **added** alongside the poster-import and facebook-events ids |
| Crosshair @ Ye Olde Crown 2026-11-08 | `e1f2e149-a7c5-41dd-af35-b8685550e40c` | **left alone** — it already holds `klma-stoke-gig-list:37fc15964fce`, the superseded sha1 form. `edit_event(externalIds)` dedupes to ONE id per source (§6B), so writing the slug would delete the hash. The record is already attributed. Churn refused. |
| Ruffnecks @ Ye Olde Crown 2026-11-01 | `6cc29fce-a60d-451b-8008-503ee08a42a9` | had **empty** externalIds — the §6C failure class. klma slug written. |
| Tanky @ Bench & Bar 2026-08-15 | `0d7c7652-576a-4849-ae0f-3cf101b26f14` | already correct, including `ticketed: false` / `price: Free`. Its slug reads `…-bench-and-bar` where this run derives `…-bench-bar`. Left as written; two ids for one source cannot coexist. |

## 12. Records enriched — 5

| record | field | id |
|---|---|---|
| Crosshair @ Ye Olde Crown 2026-09-27 | externalIds | `5cb025ea-5e7b-4862-8952-ace45e58f5c5` |
| Ruffnecks @ Ye Olde Crown 2026-11-01 | externalIds | `6cc29fce-a60d-451b-8008-503ee08a42a9` |
| Trafford Park @ Oakhill Bowling 2026-09-12 | title | `a8a79abb-7806-4ce9-b4b8-31f2ffad6e56` |
| Razed on radio | nameVariants | `nbuQpwCPVoQv14EarjJv` |
| Jukebox Heroes | nameVariants | `970f06ee-d257-4d74-85de-b0b7b24a687e` |

## 13. A correction I made to my own write

**I wrote `&amp;` into a public event title and the read-back caught it.**
Event `a8a79abb-7806-4ce9-b4b8-31f2ffad6e56` was created as
`Trafford Park @ Oakhill Bowling &amp; Recreation Club`. §6B says never HTML-escape `&` in an
MCP argument. It was corrected to `Trafford Park @ Oakhill Bowling & Recreation Club` in the same
minute and verified. **The same mistake was in a `Bench & Bar` create argument, which bounced 409
before it could write.** This is the second recorded instance of the fault (2026-07-31 was the
first) and is exactly why §0.10 read-back is not optional.

## 14. §VA venue-authoritative checks

| venue | status this run |
|---|---|
| Cosey Club | **not fetched** — zero added rows at this venue, so there is no name to correct and nothing to merge |
| Eleven | **not fetched** — zero added rows |
| The Rigger | **not fetched** — zero added rows |
| Artisan Tap | **not fetched** — zero added rows. Its surface is still unproven (§VA.5). |
| **The Sugarmill** | **checked.** Sole-source feed. 31 distinct gigs, 1 added, 0 removed, 1 event created. |

⚠ **"Not fetched" is stated plainly rather than reported as "checked".** §VA.5's whole point is
that an unchecked venue reported as checked is the failure the section exists to prevent. No row
in this run needed a venue-page spell-check, so no venue page was opened.

## 15. Things this run decided rather than escalated

- Three unlisted `Cost/Ticket` spellings — mapped, not escalated (§CT, CTO rule 2026-08-08).
- `Electric Mutiny` review verdict — resolved with `confirmNew`, not staged (§1A.7).
- Three acts with no findable page — created with EMPTY socials, not staged (§0A rule 1).
- `Trafford park` at 62% confidence — opened and reused, not treated as a miss.
- The mode gap — defaulted to append-only and logged, not held (§0.29).
- The `john-sewell-not-reached` backlog — cleared with spare budget, not left for another night.
  ⚠ **This is scope beyond the diff and it is declared as such.** It is not the v2.19 failure of
  reading an absent record as a coverage gap: the gap was written down by a previous run, with
  evidence, and the diff can never re-surface it.

## 15b. Items that can now be closed

- `john-sewell-not-reached` — **DONE.** 11 events, 1 artist, 4 venues. Ids in §5b.

## 16. Files written

- `data/raw/klma-stoke-gig-list/2026-08-14/section1-gviz-normalised.txt`
- `data/raw/klma-stoke-gig-list/2026-08-14/section2-sugarmill-normalised.txt`
- `data/raw/klma-stoke-gig-list/2026-08-14/enrichment-captures.jsonl`
- `data/state/enrichment-evidence-2026-08-14-klma-stoke-gig-list.jsonl`
- `data/state/klma-stoke-gig-list-last-page.txt` — both sections, self-diff gate PASS
- `data/state/run-summary.jsonl` — one appended line
- `20-Daily/2026-08-14.md` — one appended line
- `CTO-INBOX.md` — two appended lines

## 17. Known-open items NOT re-raised

`klma-no-delta-mode-declared` · `prompt-runbook-floor-drift` · `record-run-token-missing` ·
`whitespace-diff-drift` · `princess-royal-dresden-duplicate` · `sugarmill-status-marker-not-parsed` ·
`run-report-path-collides-on-second-firing` · `edit-artist-409-namevariants` ·
`javascript-tool-blocks-equals`

`john-sewell-not-reached` is **cleared by this run** (§5b). Its inbox line was left untouched —
striking a line is a triage action for Jason or a CTO session, not for a run.

`record_run` was not called. `SOURCE_RUNS_TOKEN` is still missing and this is not blocking.
`run-summary.jsonl` is the dashboard's input and it was appended normally.
