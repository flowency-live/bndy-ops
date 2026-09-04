# insangel — RUN REPORT 2026-09-01

- **runId**: `insangel-2026-09-01T19-50-24Z`
- **outcome**: PARTIAL. The run reached the 50-create cap (RUNBOOK §6). 6 rows are unwritten.
- **runbook version read**: v2.27. **CURRENT FLOOR (§6A)**: v2.19. Above floor.
- **prompt floor**: the task prompt states no number. §6A step 2a is the gate.
- **claim**: `data\state\claims\insangel.json`. Previous state `heldBy: null`. Acquired clean. No takeover.
- **heartbeat**: `data\state\heartbeat\insangel-2026-09-01T19-50-24Z.json`
- **mode**: `append-only`. The spec declares no §0.29 mode, so no removal was actioned.

## 1. Headline

| measure | count |
|---|---|
| events created and read back | 41 |
| artists created and read back | 7 |
| venues created and read back | 2 |
| venues matched to an existing record | 19 |
| artists matched to an existing record | 20 |
| rows deferred at the cap | 6 |
| rows skipped, stated reason | 4 |
| 409 or 422 bounces | 0 |
| validator | 7 records, 7 clean, **0 FAIL, 0 WARN** |

**Creates this run: 50 of 50. The cap is reached.**

## 2. Capture

The source has had no capture surface since 2026-08-28. Today Chrome worked.

- `web_fetch` on `https://insangel.co.uk/venues` returned an empty body, as on every failed firing since 2026-08-18.
- Chrome (`list_connected_browsers` returned one browser) loaded the page normally.
- Collection used DOM `a[href]` reads inside `javascript_tool`, per §0.22. `get_page_text` was not used for extraction.
- Raw capture: `data\raw\insangel\2026-09-01\venues-body.txt`.

Raw page: 67 venue cards, 989 gig rows, 1000 artist-gig rows.
In scope after filters: 66 venues, 641 artist-gig pairs.
Out of scope: 38 rows dated before capture, 320 rows on the five declared placeholder band slugs, 1 duplicate pair collapsed.

`javascript_tool` output guards were hit as documented in §6B: the `=` guard blocked every raw return, and output truncates near 1000 characters. Both were handled by an `=` transform and by paging. Neither is a source fault.

## 3. Self-diff gate (§5.7a)

The snapshot body was hashed in the page and again on disk.

```
SHA-256 64e26ec138ba9c78e4fb59b612ee6ea26ba46f53024b8b6f290b6922180eaa5a
16686 bytes, both sides. 0 added / 0 removed. GATE PASSES.
```

## 4. Diff against the stored snapshot

Previous snapshot: `insangel-2026-08-28T05-02-32Z`, captured 2026-08-28T05:04:00Z.

- venues added: **2** — `the-fountain--middlesbrough`, `townfoot-cafe--rothbury`
- venues removed: **12** — `houghton-rugby-club--houghton-le-spring`, `red-cow-tavern--throckley`, `red-star-fc--seaham`, `south-beach--blyth`, `steels--sunderland`, `the-duke-of-york--firtree`, `the-fairfield--stockton`, `the-hairy-lemon--alnwick`, `the-pioneer--annitsford`, `the-portland--ashington`, `the-singing-chocker--castleford`, `the-teal-farm--washington`
- pairs added: **51**
- pairs removed: **107** — 67 have a date that has passed, 40 are future-dated.

**No removal was actioned.** The mode is `append-only`, so §5.7 removed-row handling and §0.17 deletion did not run. The 40 future-dated removals are listed in §9 for the record.

## 5. The year fix — the detail page prints the year, and it changed the answer

The listing page prints `Fri 4th Sep` with no year. The spec's rolling rule builds the date with the capture year and adds one year only when the result is more than 31 days before capture. **187 of today's 1000 rows print a weekday that contradicts the date that rule produces.**

The venue detail page `/venues/<slug>` prints the full date and the start time: `Saturday 3rd October 2026 | 20:30 - Justuzfor`. This run fetched the detail page for every venue it wrote to, and took the date and the time from there.

Two rows were **skipped** because the printed weekday and the detail page both put them beyond the 12-month horizon:

| row | listing derived | detail page states | action |
|---|---|---|---|
| Supercharged @ G W Horners, `Sat 27th Nov` | 2026-11-27 | **2027-11-27** | skipped, beyond horizon |
| Supercharged @ The High Crown, `Sat 25th Sep` | 2026-09-25 | **2027-09-25** | skipped, beyond horizon |

Under the listing rule alone both would have been written 12 months early. The detail page is the fix and it is now proven, not inferred. The existing inbox items `insangel-year-rule-underdates-13mo` and `insangel-weekday-proves-2027-year` cover the rule change; no new item is raised.

**Start times.** No row used a §5.6 default. Every one of the 41 events carries a stage time published on the venue detail page (§0.28). Times ranged 13:00 to 21:00.

## 6. Venues

**Created (2), both verified by `get_by_id`:**

| venue | id | address | place_id | postcode check (§0.24) |
|---|---|---|---|---|
| The Fountain | `338fff20-4840-4068-8890-80e7e913b150` | 13 High St, Middlesbrough TS7 9AE | `ChIJM8DEiDDsfkgRj7k7peiZeeI` | TS7 is Ormesby, Middlesbrough. Correct. |
| The Blue Bell Inn | `a418a870-4b03-472d-bff3-96ac7a54b37d` | Peareth Hall Rd, Washington NE37 1NP | `ChIJqQcz5cJ6fkgRasYH8PmMV9Q` | NE37 is Washington, Tyne and Wear. Correct. |

Both addresses came from the source's own venue detail page. Neither town was guessed.

**A `search_venue` miss again was not evidence of absence (§3, v2.16).** `get_by_external_id` returned nothing for `townfoot-cafe--rothbury`. `search_venue("Townfoot","Rothbury")` returned **Townfoot Café and Bar `cec5afc7-dbf2-46a9-9c74-5e8f6bb6b1c5` at 38% `low_confidence`** — and that record already carries the `insangel` externalId. The loose probe prevented a duplicate venue. This is the fourth recorded instance of the class.

**Matched (19):** GW Horners `35b992a2-2903-4172-be1b-11d8e9ca35ec` · The Jovial Monk `e5c621b9-a1c6-4683-ae7f-2d05dc255ce7` · Namaste Indian Restaurant & Kings Prosecco Lounge `e4c0d6a8-68e7-4c93-976a-2461d43b7e36` · Langley Park Hotel `6ec6ffdc-bf8d-45b3-ae08-36f60f4085dc` · Namaste Indian Restaurant and Club Prosecco Lounge `a1b40977-f627-4289-9ed7-7040397cf270` · Poetic License Bar `b6289d09-9684-4508-abd9-3d049f14bc05` · The Amble Inn `9adcf560-b0bd-4efa-b9b7-ede765c44946` · The Black Horse `04ae2f3e-382c-4cce-9275-0e32eba0314a` · The Denton `cdac6734-32df-4f95-b2d9-e262d4a9185a` · Endeavour `36c35f24-a878-4bbf-ae60-6ba1ec82dbec` · The High Crown `fb1faaca-ed16-4f3f-8d7e-a907417635dd` · Queens Head `6795a390-259a-46d0-aaf4-496d075d0b50` · The Rattler `0ae09950-ad0a-4854-9bc5-deaa6349c9a5` · Rosedene `05adcd18-a961-465d-a862-55bdd541ed83` · The Seaton Lane Inn Seaham `29feef76-622d-4385-9bf8-3ffb1322bee7` · Tan Hill Inn `8c4bceb1-f7b9-4be7-a2b2-44e750b0f82a` · Townfoot Café and Bar `cec5afc7-dbf2-46a9-9c74-5e8f6bb6b1c5` · Vesta Tilley's `4e392026-581b-4069-b323-aa2b8b52b837`

**Skipped venue:** `hornby-park--seaton-carew`. Its detail page publishes no address and no postcode. §0.8 forbids the guess. Two of its rows are unwritten: Dave Ridley 2026-12-09 14:30, Kaitlin Lee Robson 2026-12-19 20:30. Raised as `insangel-hornby-park-no-address`.

## 7. Artists — quality, not error count (§6)

**Created with a verified page (5 of 7):**

| artist | id | page | evidence that cleared the §2A.1 bar | location |
|---|---|---|---|---|
| Harry Beresford | `89bd50e6-4855-4796-b71b-3c09b9466446` | `facebook.com/harryberesfordmusic` | The page description matches the source billing almost word for word: covers and originals, over 10 years, Oasis / Gerry Cinnamon / Sam Fender. 1.8K followers. | North East England, regional |
| Gavin Ions | `011911cd-7e87-49f9-9cee-a388a0043e8d` | `facebook.com/gavinionsmusic` | The page states **Darlington, United Kingdom**, and names the acts he plays in. The source says the same in different words. | Darlington, city |
| Dave Ridley | `80ce3487-86d1-4a5d-be0c-fc3e9609c9b6` | `facebook.com/p/Dave-Ridley-Music-100064220525922` | Musician/band, repertoire text matches the source billing, contact address on a UK-only ISP domain. | North East England, regional |
| Ami Leigh | `dc8931c6-8ac8-4b53-abec-82bff7b540b7` | `facebook.com/amileighmusic` | 2.4K followers. Corroborated by NARC, a Newcastle music title, and by a booking profile naming Bishop Auckland, County Durham. | Bishop Auckland, city |
| Parrk | `ed9f23bf-593d-4b6b-81cd-2ddc144efbdf` | `facebook.com/parrkhere` | Page states Blyth and the same repertoire the source states. | Blyth, city |

**Created with an evidenced blank (2 of 7):**

| artist | id | variants tried, both surfaces |
|---|---|---|
| Justin | `ceb01f90-a54d-48f7-81b3-9cffb093d0cf` | Google `"Justin" solo acoustic musician insangel North East pubs human jukebox`. Facebook page search `Justin acoustic North East`. The act's name is one common first name. Nothing found. |
| Lee Brown | `a45b63bf-25a0-4aa6-ab37-e47b6d05afe7` | Google `"Lee Brown" Fuse band frontman North East solo facebook`. Facebook page search `Lee Brown music Sunderland`. The only same-name page is a hip hop artist and fails §2A.1. Blank beats wrong. |

**Bios.** Every bio is a character-for-character quotation of the act's own Facebook page. No bio was taken from the insangel band page, because `source-band-page-as-the-acts-own-page` is still an open DECISION. The two evidenced-blank records hold no bio.

**Genres.** Ami Leigh was first written `Indie, Pop` from a search snippet, then corrected to `Indie, Americana` after her own page was read: *"Ami Leigh's sound is Indie/Americana."* The page wins (§2A.1 3b: a search result finds, it does not author).

**Names.** No name needed §0.6 sanitising. The PARRK page styles the name in capitals; bndy holds `Parrk`. Case is not identity, so the record was not renamed.

**Matched artists (20), all by normalised name equality except two:**
toastbloke `b01b546a-7036-4bcc-a297-48a59c984d46` · Kaitlin Lee Robson `20e12f89-e16d-47bf-9037-35c8b981fa73` · Joe Devanny `9437042a-721c-41f8-92d7-d04a8493b65f` · Les Anderson `9c97472c-b32d-4723-b517-c66a73d6367a` · Small Wonder `0f40ca01-73a1-4eb0-b0cf-8acdc4de5df3` · Reviver `bb436395-34cf-44a2-b84b-77d0c61d7268` · Big Lamp `6013cf08-0d24-44c5-b28d-962f10b348c9` · The Tonic `361d13c3-fc6d-4bb0-ad07-1c7f605443b7` · Supercharged `d667b656-ff99-4ef5-9071-206d6aaaccdb` · Justuzfor `62d06f64-b67c-41c5-96a0-38414415c822` · Midnight Rose `31c2a760-0241-440e-86b4-ce46002f5de9` · Chester `9f774910-d458-4199-b1f3-a61e36207e80` · Matt Bryan `86ab8e5d-d6cc-4ad4-af81-77de2d0ca9f6` · Gary Gibson `d63a9194-fe74-4b65-a020-804356f3232c` · Fifty Cal `431fd713-83f3-4379-b277-cad31f4e718a` · Dani `7fb1b756-e1df-470b-a040-2ccc34ffff08` · Jagged Little Pill Live `3ae143c0-ee82-426b-8439-ade06ce473b4` · The Sensational David Bowie Tribute Band `1f01ef2e-a5d1-44f2-8064-97694b93a0a4`

**Two matched by footprint, not by name equality (§1A.2 rule 3):**

- Source bills `The Distant Suns`. bndy holds **Distant Suns** `6881e494-f527-4023-9c3b-78f5a1b892c6`, Morpeth, with its own Facebook page. The four gigs are at Chester-le-Street, Newcastle and Sunderland — inside the same canonical region. Reused. No second record.
- Source bills `The West Coast Band`. bndy holds **West Coast Band** `fd4071de-5487-40c8-9658-6924bcb9edf0`, North East. Same reasoning. Reused.

The source's spelling is recorded here so a later run can add it as a nameVariant. `nameVariants` was not written this run: `create-artist-500-namevariants` is an open DEFECT.

## 8. Events created (41), oldest first — all verified by `get_by_id`

| # | date | time | event | id | externalId |
|---|---|---|---|---|---|
| 1 | 2026-09-05 | 20:30 | Justin @ Langley Park Hotel | `65d0e48e-5764-4a4a-9cce-ca580aa99a78` | `1547cc3c866b` |
| 2 | 2026-09-05 | 20:00 | Matt Bryan @ The Fountain | `875ec11e-d0ee-4464-9b2d-c466dec2d97f` | `b7281329ce8e` |
| 3 | 2026-09-05 | 18:00 | Gary Gibson @ Townfoot Café and Bar | `65df6b26-31e3-4469-897c-00f5b3a5cb16` | `ee09e3b12d92` |
| 4 | 2026-09-06 | 17:00 | Harry Beresford @ Townfoot Café and Bar | `532fc086-1778-466e-b061-c73fb69009cc` | `709173e6d853` |
| 5 | 2026-09-11 | 20:00 | Dani @ The Amble Inn | `9f896603-af9a-4b01-a20e-887afdcd8c3e` | `395432c0b160` |
| 6 | 2026-09-12 | 13:00 | Justin @ The Jovial Monk | `905c65c3-d8e0-478e-aac4-69560ac05d79` | `ba53e6ec1072` |
| 7 | 2026-09-12 | 20:00 | Gavin Ions @ The Black Horse | `76803a21-87f4-4f8b-818c-49a01807be62` | `4635c7bdf228` |
| 8 | 2026-10-03 | 20:30 | Justuzfor @ The Blue Bell Inn | `1f6b24e2-9936-40eb-babc-961563e5206b` | `7439ea70ebaa` |
| 9 | 2026-10-09 | 20:00 | Justin @ The Rattler | `5254ce29-23e7-41a8-be51-7df1977a1b26` | `be08271a4a11` |
| 10 | 2026-10-25 | 19:00 | Dave Ridley @ The Denton | `2e25081b-d8b9-4a4e-a494-cdd687912849` | `0d2ea1821967` |
| 11 | 2026-10-31 | 20:30 | Midnight Rose @ The Blue Bell Inn | `d692dcc8-dc61-4f34-9b04-831458da609c` | `0046a0164520` |
| 12 | 2026-11-21 | 20:00 | Fifty Cal @ The Denton | `a6455ce5-36a9-4744-813b-efc5d0c6571b` | `3ee5bf8a4487` |
| 13 | 2026-12-06 | 15:30 | Kaitlin Lee Robson @ Queens Head | `66b90092-8839-416e-a7ea-1df148a9ecb8` | `c585b5063952` |
| 14 | 2026-12-13 | 19:00 | Chester @ Endeavour | `e5765224-f54c-4c20-b588-c9db13811149` | `f8bd34378fa6` |
| 15 | 2026-12-20 | 19:00 | Kaitlin Lee Robson @ Endeavour | `2f9ebf8d-c51a-4c2c-8650-eb9b058b5470` | `3e9adfc42c38` |
| 16 | 2026-12-23 | 19:00 | Dave Ridley @ Endeavour | `9ef5238c-3602-4eb3-ad27-7ebae0048957` | `1456daa0861a` |
| 17 | 2027-01-30 | 21:00 | Big Lamp @ GW Horners | `13a2014e-04c8-47bb-9d36-a3bd807f531d` | `463cd996efdd` |
| 18 | 2027-02-20 | 20:00 | Lee Brown @ Namaste Indian Restaurant and Club Prosecco Lounge | `8db10817-5fd0-4d11-873a-f3915297678e` | `0cf7a541fcc3` |
| 19 | 2027-02-26 | 19:30 | Les Anderson @ Poetic License Bar | `0908f0c4-0bd8-4ce1-9dc2-933a62eb2057` | `b683db56fc88` |
| 20 | 2027-02-27 | 20:00 | toastbloke @ Namaste Indian Restaurant & Kings Prosecco Lounge | `916aed8a-7fc0-47d6-9b15-c9061e996598` | `65f95f61e103` |
| 21 | 2027-03-05 | 20:30 | Les Anderson @ The Denton | `8e179a0c-4091-4321-8358-fa49bc8aa0d7` | `4f22b44ec8ec` |
| 22 | 2027-03-19 | 19:30 | Ami Leigh @ Poetic License Bar | `2fde5992-875b-4824-bae9-8f5107057a0a` | `170d2cfdbf66` |
| 23 | 2027-04-09 | 19:30 | Lee Brown @ Poetic License Bar | `6852a455-5ed6-427d-bbf9-0ac65bc95a63` | `f923e6a1d24c` |
| 24 | 2027-04-09 | 20:30 | Distant Suns @ Vesta Tilley's | `7a78088a-f87f-496c-940a-de46201b05f2` | `a6caeca85c19` |
| 25 | 2027-04-16 | 21:00 | Jagged Little Pill Live @ Tan Hill Inn | `ede100df-8421-44ab-9385-ae1f38646505` | `7a092ae5f8a4` |
| 26 | 2027-04-23 | 20:30 | Supercharged @ Vesta Tilley's | `8af04cf9-8ec8-49e9-bd7e-c1dfaa6ddf49` | `afe01e51cc3c` |
| 27 | 2027-04-24 | 21:00 | Small Wonder @ GW Horners | `8f1f5d29-6e0f-4793-9a08-07b3508de8c4` | `89cb55425f5e` |
| 28 | 2027-05-01 | 21:00 | Distant Suns @ GW Horners | `59bc7be7-399a-41fe-bd5d-bd2663c0c480` | `ebf0ae5d3e56` |
| 29 | 2027-05-01 | 20:00 | West Coast Band @ The Denton | `dbe3aae2-9f96-4b27-b1aa-8536c83a8725` | `62a4521ce6c0` |
| 30 | 2027-05-07 | 20:30 | West Coast Band @ Vesta Tilley's | `90c5e202-ee90-4cf8-aab2-6e991c6e378e` | `5d8c397ee491` |
| 31 | 2027-05-08 | 20:00 | Big Lamp @ The Denton | `e6010ee1-39db-4817-8726-052018d04d11` | `accad6d2e355` |
| 32 | 2027-05-14 | 20:30 | Small Wonder @ Vesta Tilley's | `d649745a-b111-42ee-8975-6831ef741804` | `27714cbedb72` |
| 33 | 2027-05-28 | 21:00 | The Sensational David Bowie Tribute Band @ Tan Hill Inn | `0b56462c-2056-4fe0-a8d8-f80fd51bf3f4` | `fe17cc937fb2` |
| 34 | 2027-05-29 | 21:00 | Parrk @ GW Horners | `e3ba25ad-15a8-42b5-8868-8998a75e5fd4` | `13b182dd78d2` |
| 35 | 2027-05-29 | 20:00 | Distant Suns @ The Denton | `6479c907-1863-44eb-9ad8-9eaf399bb448` | `5f7564613f2f` |
| 36 | 2027-05-29 | 19:00 | West Coast Band @ The High Crown | `b7898364-8316-43c1-a398-4e17df7eafef` | `63655da9fe6a` |
| 37 | 2027-06-04 | 20:30 | Parrk @ Vesta Tilley's | `58ee0015-fd3c-4121-b3db-3f80eabf04c6` | `eddd5047ab0a` |
| 38 | 2027-06-05 | 20:00 | Parrk @ The Denton | `301bc4df-8c93-49ca-ad60-80faf273a454` | `f82988d6a1ae` |
| 39 | 2027-06-25 | 20:00 | Joe Devanny @ Rosedene | `4824c6b4-6327-44e3-bf12-99486ca13b42` | `5140fef53517` |
| 40 | 2027-06-26 | 19:00 | Distant Suns @ The High Crown | `5bb673d5-4308-499b-9286-addfcc71ebb0` | `506e056df892` |
| 41 | 2027-07-02 | 20:30 | The Tonic @ Vesta Tilley's | `4df789a5-34cd-4ca9-9b61-fa2dedc593cf` | `7eb01abed4f5` |

Every event is `isPublic: true`. Every externalId is the §6D-exception sha1 form ruled final by D-05: `sha1("<venue_slug>|<date_iso>|<artist_slug>")[:12]`. All 41 read back with the id stored.

`&` was written raw in event 20's title and read back raw. The §6B HTML-escape defect did not recur.

The tombstone file `data\state\cancellations.jsonl` was read before the first create (§5.4 v2.19). 16 entries. Zero matched an artist plus venue plus date in this batch.

## 9. Not written, and why

**Deferred at the 50-create cap (6 rows).** The next run must write these. They are recorded in full so no re-derivation is needed.

| date | time | artist | venue | venueId | artistId | externalId |
|---|---|---|---|---|---|---|
| 2027-07-03 | 21:00 | The Tonic | GW Horners | `35b992a2-2903-4172-be1b-11d8e9ca35ec` | `361d13c3-fc6d-4bb0-ad07-1c7f605443b7` | `1da1cab92da2` |
| 2027-07-17 | 19:00 | Small Wonder | The High Crown | `fb1faaca-ed16-4f3f-8d7e-a907417635dd` | `0f40ca01-73a1-4eb0-b0cf-8acdc4de5df3` | `4de03d98936a` |
| 2027-07-30 | 20:00 | toastbloke | Rosedene | `05adcd18-a961-465d-a862-55bdd541ed83` | `b01b546a-7036-4bcc-a297-48a59c984d46` | `a1ac5773e02d` |
| 2027-07-30 | 20:00 | Kaitlin Lee Robson | The Seaton Lane Inn Seaham | `29feef76-622d-4385-9bf8-3ffb1322bee7` | `20e12f89-e16d-47bf-9037-35c8b981fa73` | `91b88e124e9c` |
| 2027-07-31 | 21:00 | Reviver | GW Horners | `35b992a2-2903-4172-be1b-11d8e9ca35ec` | `bb436395-34cf-44a2-b84b-77d0c61d7268` | `56191eaa8791` |
| 2027-07-31 | 19:00 | Parrk | The High Crown | `fb1faaca-ed16-4f3f-8d7e-a907417635dd` | `ed9f23bf-593d-4b6b-81cd-2ddc144efbdf` | `b97bca1341c5` |

⚠ **The snapshot now records these 6 rows as seen, so tomorrow's diff will not re-offer them.** That is the standing defect `insangel-snapshot-hides-backlog`, already in CTO-INBOX. This table is the workaround, not a fix.

**Skipped, stated reason (4 rows):**

| row | reason |
|---|---|
| Supercharged @ G W Horners, detail page states 2027-11-27 | beyond the 12-month horizon (§6E) |
| Supercharged @ The High Crown, detail page states 2027-09-25 | beyond the 12-month horizon (§6E) |
| Dave Ridley @ Hornby Park 2026-12-09 14:30 | the venue publishes no address; §0.8 forbids the guess |
| Kaitlin Lee Robson @ Hornby Park 2026-12-19 20:30 | the venue publishes no address; §0.8 forbids the guess |

**Future-dated rows that vanished from the source (40), logged only, mode is append-only:**

`langley-park-hotel|2026-09-05:ben-lackenby` · `mighty-oak-bar--ashington|2026-12-18:jonathan-honour` · `rappor-lounge--hartlepool|2026-09-26:jonathan-honour` · `steels--sunderland|2026-09-25:gps` · `the-amble-inn--amble|2026-09-11:danielle-lincoln` · `the-black-horse--consett|2026-09-12:backing-tracks-solo-tbc` · `the-blake-arms--seghill|2026-12-26:jonathan-honour` · `the-denton--newcastle|2026-10-25:lee-brown` · `the-denton--newcastle|2026-11-21:hardwired` · `the-denton--newcastle|2026-12-05:fifty-cal` · `the-denton--newcastle|2027-01-15:dave-ridley` · `the-guide-post--ryhope|2026-10-31:midnight-rose` · `the-hairy-lemon--alnwick` × 16 rows, 2026-09-05 to 2027-01-23 · `the-keelman--newburn|2026-09-12:gavin-ions` · `the-keelman--newburn|2026-09-19:dave-ridley` · `the-keelman--newburn|2026-09-26:matt-bryan` · `the-queens-head--stokesley|2026-12-06:jonathan-honour` · `the-singing-chocker--castleford|2026-10-31:hazjak` · `the-singing-chocker--castleford|2026-11-28:the-lost-boyz` · `the-singing-chocker--castleford|2026-12-26:lily-cooke` · `the-singing-chocker--castleford|2027-01-30:199x`

⚠ **Four of these are re-billings, not cancellations.** The same venue and date now carries a different act, and this run wrote the new one: Langley Park Hotel 2026-09-05 moved Ben Lackenby to Justin; The Denton 2026-10-25 moved Lee Brown to Dave Ridley; The Denton 2026-11-21 moved Hardwired to Fifty Cal; The Queens Head 2026-12-06 moved Jonathan Honour to Kaitlin Lee Robson. Append-only leaves the old event live, so both now show. This is the same class as `insangel-rebill-stale-events` and `insangel-jane-long-rattler-rebilled`; the four new ids are raised as `insangel-rebill-stale-events-2026-09-01`.

**The Hairy Lemon, Alnwick** dropped its whole forward listing — 16 future rows in one move. That reads like a venue that has stopped publishing rather than 16 separate cancellations. Logged, not actioned.

## 10. Validator (§6A step 8)

```
python3 scripts/enrichment_validate.py \
  --records data/raw/insangel/2026-09-01/validator-records.json \
  --evidence data/state/enrichment-evidence-2026-09-01-insangel.jsonl

7 records · 7 clean · 0 FAIL · 0 WARN   [mode=gate]
EXIT 0
```

**The first pass returned 3 FAIL and 5 WARN, and the validator was right.** `FB_EVIDENCE_MISMATCH` fired on Harry Beresford, Gavin Ions and Ami Leigh because the evidence recorded the Facebook *search results* page, not the act page that was stored. `STUB_NO_BIO` fired on five records with a verified page and an empty bio.

Both were fixed by doing the work, not by excluding the record: each act page was opened and read, `capturedFrom` and `capturedText` were re-recorded from the page itself, and each bio was written as a character-for-character quotation of that page. **No record was excluded from the gate.** Re-running returned 0 FAIL and 0 WARN.

That pass also produced two corrections that would otherwise have been missed: Gavin Ions' page states **Darlington**, so his location changed from a regional string to a city; and Ami Leigh's page states her sound is **Indie/Americana**, so `Pop` was replaced by `Americana`.

## 11. Files written

- `data\raw\insangel\2026-09-01\venues-body.txt` — the capture
- `data\raw\insangel\2026-09-01\worklist.json`, `validator-records.json` — working files
- `data\state\insangel-last-page.txt` — the new snapshot, with its normalisation rules in the header
- `data\state\enrichment-evidence-2026-09-01-insangel.jsonl` — 7 records
- `data\state\run-summary.jsonl` — one appended line
- `20-Daily\2026-09-01.md` — one appended line
- `CTO-INBOX.md` — 3 appended lines

`record_run` was not called. `SOURCE_RUNS_TOKEN` is still missing (`record-run-token-missing`, already in the inbox).

## 12. What the next run should do first

1. Write the 6 deferred rows in §9. They will not appear in the diff.
2. The detail page fetch is now proven as the year and time source. 21 detail pages cost about 6 fetches in Chrome and removed every year ambiguity. Consider making it the standard capture for this source.
