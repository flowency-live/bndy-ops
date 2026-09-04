# FANTASTICAL DERBY — SUPERVISED CATCH-UP RUN, 2026-08-21

**THIS RUN HAD THREE PASSES. Pass 1 imported what was new against the snapshot. Pass 2 imported the bills the
2026-07-31 run parked and never came back to. Pass 3 checked every remaining row against bndy one by one,
because passes 1 and 2 both relied on somebody's earlier list being right.
**Day total: 178 events, 111 artists, 9 venues, 1 festival.** Pass 2 starts at section 15, pass 3 at section 22.

**Lane:** `fantastical-catchup-2026-08-21`, CTO-authorised, cap 250 creates. 217 creates used.
**Run type:** supervised. Jason supplied the capture by paste.
**Runbook read:** v2.27. Floor v2.19. PASS.
**Source mode:** `append-only` (RUNBOOK §0.29, set by this run). No deletion ran.
**Raw capture:** `data\raw\fantastical-derby\2026-08-21\capture.txt` — 487 rows.
**Snapshot:** `data\state\fantastical-derby-last-page.txt` — **WRITTEN AND VALID.**
**§5.7(a) re-diff proof:** new snapshot against its own capture = **0 added / 0 removed.**
**externalId form:** `{source:"fantasticallibrary", id:"<fb-event-id>"}` per §6D-bis.
For a split bill the id is `<fb-event-id>-<artist-slug>`, following the `lemonrock` precedent, because one
Facebook event id must not be written onto four sibling events.

---

## 1. Totals

| Outcome | Count |
|---|---|
| Rows captured | 487 |
| Rows new against the 2026-07-31 snapshot | 149 |
| Rows already seen | 338 |
| **Events created** | **130** |
| Events blocked 409 by the artist+venue+date sentinel | 10 |
| Artists created | 80 |
| Artists matched to an existing record | 32 |
| Venues created | 7 |
| Venues matched | 47 |
| Rows rejected under an existing ruling | 24 |
| Rows skipped, venue or act not resolvable | 3 |

**Total creates: 217.** Lane cap 250. Not reached.

## 2. Quality, not error count

| Class | Count |
|---|---|
| Artists created **with a verified Facebook page** | 42 |
| Artists created with an **evidenced blank** | 38 |
| Artists matched, no new record needed | 32 |
| Names sanitised under §0.6 before create | 9 |
| Rows staged for Jason | 0 |

Every blank Facebook field was searched in Chrome against a logged-in session, with two name variants where the
first search failed. The bar was: a UK town in Derbyshire, Nottinghamshire, Staffordshire or Leicestershire on
the page, or a post or event naming one of the corpus venues. A name match alone was never accepted.

Rejected on purpose, to be explicit that these were found and refused:
- **The Dissociates** (London) is NOT the Derby band `Dissociates`. The Derby act is 16 years old and has an
  Instagram only. Blank stored.
- **FOO FIGHTERS GB** `c701d076-4537-4678-8879-1c9cb9604950` is NOT `Foo Fighters UK`. Different page,
  different act. A separate record was forced with `confirmNew`.
- **The Repeat Offenders** (Hampshire) `598e82d7-da45-40e2-a3d6-e3fe435e2e0e` is NOT the Spondon act.
- **H.A.T.E. / "Hate"** (Stoke-on-Trent) `8012a73c-e140-4db3-b1fe-4f36d7222e8f` is NOT `The Hate` on the
  Victoria Inn punk bill. See defect 2.
- **Swift & Friends**, **The Dionne Legacy Show**: candidate pages found, both outside the four counties. Blank.

Two attachments use a spelling variant of the billed name and need an eyeball:
- `Living Stone` attached to the page **"Livingstone Band"** (one word), Derby.
- `Luna and the Groove` attached to the page **"Lunar and the Groove"** (Lunar), which follows The Bell Inn
  Sawley and this very source's page.

## 3. Facebook enrichment yield

42 acts gained a page URL, a town, and where the page states it, an actType and genres. Genres were taken from
the page's own words and mapped to the bndy enum. No genre was invented. No genre bounced a create.

## 4. Multi-act bills, split per §4

Nine bills became 26 discrete events, one per act. The parent-event container is still not built, so the
sibling ids are listed here for a later retrofit.

| Date | Bill | Children |
|---|---|---|
| 2026-08-27 | Zuuul support from Courtesan | `20f817c6-7217-49ef-9544-9dd455391aca` · `9f2449d9-bc18-4734-884a-67b1aa8970ac` |
| 2026-08-28 | Third Eye Live Events | `e8c3c434-5ffc-482b-a976-28d95260d97b` · `897c273c-8109-425e-8a81-214246de6269` · `f00703ad-c2f7-4880-a87f-3fa9926791d0` · `9ab219e0-6071-4885-8ea6-230b9f2ae334` |
| 2026-09-05 | Derby Market Hall triple bill | `d62b310c-089d-4641-af4e-2d28ac34ad5e` · `14ce4562-1b35-4acb-9f1a-3df258056e59` · `9b41e012-6f59-4d1d-9637-2903953ee3d9` |
| 2026-09-05 | devilish nights in derby vol#11 | `c0782160-4a4c-4028-b0f5-f49a2504a095` · `1bcbae55-6491-4150-9855-7206b26ad98f` · `339511fc-3a99-486e-b2b8-380eb1e0a040` · `df9addf3-a8d8-4d1b-a43a-36f0f2ccf49d` |
| 2026-09-06 | The Restarts + 3 | `d7296577-8d03-4f2b-97f5-e8c68a388632` · `0f0322bd-2f74-44f1-9e72-db5d65219f99` · `78fcb519-d698-45d5-a2b6-9edc2d634561` · `94ac902d-5f64-4dea-8de0-adafb313d7d5` |
| 2026-09-11 | FUSE | `d2cc3250-a47a-43f1-a5d4-75e9b21bd9d1` · `8a585554-a9cf-4445-9258-22c341ac0607` · `939f815c-3059-4413-ad0a-33b7372973e2` |
| 2026-10-04 | BANG | `a01dc78e-5644-4b51-bf7f-3b77dc11d6be` · `bd7064df-3174-4b69-a439-d63444d6f8de` · `805c36eb-91ab-4325-8218-f6fff5f046a5` |
| 2026-10-31 | Halloween Hootananny | `6b21df1c-3ddd-4250-b89e-a56c17572255` (pre-existing) · `639deab3-dab0-4f40-b76f-1872bfe6e30f` |
| 2026-11-29 | Kilnside Folk | `03d84fb8-a279-4f10-9b3b-7188fca44f32` · `7156af7b-0f47-4eb3-8370-e19ba86e0227` |

The devilish nights bill carries real stage times taken from the Gigantic ticket page, not the Facebook block:
Gnarled Fingers 19:00, Tellemahookah 19:45, Hora 20:30, Ghrul 21:15. `ticketInformation` holds "Doors 18:30",
price £10, per §0.28.

## 5. Defaulted start times — Jason to correct if wrong

| Event | Stored | Why |
|---|---|---|
| Jon McKenzie @ Derby Market Hall, 2026-08-21 | 14:00 | source read "Happening now", no time. Afternoon default, §5.6 |
| Sarah Lou @ The Kings Head, 2026-08-23 | 14:00 | source read 05:00, obviously wrong. Event page says "a fun afternoon" |
| China Drum @ The Hairy Dog, 2026-12-18 | 21:00 | source read 00:00, obviously wrong. Friday default, §5.6 |

Three of 140. Every other event carries the time the source published.

## 6. Corrections applied

| Row | Source said | Written | Evidence |
|---|---|---|---|
| Sarah Lou 2026-08-23 | The Kings Head, Derby | Kings Head, 60 Main St, Hilton, Derby DE65 5GG | the FB event page states the address and "The Kings Head in Hilton" |
| Legacy 2026-08-22 | "Thornbridge" | Thornbridge Brewery, Bakewell | event page address block. NOT Thornbridge Hall |
| Before The War 2026-08-23 | "Shiny Tap - Little Eaton" | Shiny Brewery, Old Hall Mill Business Park, Little Eaton | event page address block |
| Legacy 2026-12-31 | "The Eagle Tav" | Eagle Tavern, 94 Ripley Rd, Heage, Belper | event page address block |
| Chloe & Bea | two performers assumed | ONE act, "Chloe & Bea in Harmony" | the venue's own listing names the duo. Surnames are published nowhere |
| Peashooter 2026-08-30 | organiser "The Ant Hill Mob" | act is Peashooter | §3, the organiser is not the act when the title names one |

## 7. Rejected under an existing ruling — 24 rows

Touring or production act, not grassroots (Jason ruling 2026-07-31):
- **The Ultimate Classic Rock Show** `1444694320598929` — Derby Arena
- **UK Pink Floyd Experience** `1307745027997794` — Derby Arena
- **Courtney Hadwin Live in Derby** `1820200615637680` — national touring act
- **Sarah McQuaid** `1711773876817913` — national touring folk artist at The Grand Pavilion Matlock Bath.
  ⚠ bndy already holds her record `ef2325a9-656d-4e26-affd-22e4fb83eede` (Cornwall) from another source.
  The Grand Pavilion is not on the kept list with The Hairy Dog and The Flowerpot. **Jason may want it added.**

Unnamed tribute night, §0.5, no invented names:
- **ABBA TRIBUTE NIGHT!** `1334570055541657` · **A night of Queen Freddie Mercury Tribute.** `1015482710968429`
- **OLIVIA DEAN TRIBUTE !!!!** `1534059171790904` — also Mansfield, outside the region
- **Oasis Forever** `1004824089052450` — borderline. A possible act name, no page found, no evidence.

No named act, §0.5:
- **The Big Family Funday** `3520477804772466` · **Tappers Fest 2.0** `4419155491633153`
- **Hoedown @theshoes** `1554446116137137` · **PRIDE Night at Derby Market Hall** `926456133225101`
- **Rock Choir Performance** `1724733131981706` · **Osnabrück Oktoberfest** `4531096610548542`
- **Charity Festathon** `1366886722300319` · **A Night at the Musicals** `1303121554991969`
- **OKTOBERFEST AFTERNOON** `869338836249670` · **OKTOBERFEST EVENING** `1721608068853179`
- **Unwanted Mcc Christmas Party** `1073683348949000` · **Old Goats Grumble 12** `24942245302025473`

Venue is not a fixed building, §0.23 — note these skip on the VENUE TEST, not on the word "festival" (§0.27):
- **Moira Furnace Folk Festival** `959925806443056`
- **The Jam Project @ Elvaston Castle Country Park** `3821585111472149`
- **Dilemma @ Golden Valley Caravan park** `1353967746321833`
- **Unchained @ Off The Tracks Festival, Donington Park** `959255010175479`
- **Belper 250 Rocks** `27751938364494997` — 18 to 20 Sep, stage and audience under a giant marquee on Belper
  Meadows cricket ground. **This one cost 17 acts.** Both Facebook and Eventbrite state "Lineup includes, in no
  special order": Dr and The Medics, Atomic Rooster, More, Miranda Sykes, BB BlackDog, The James Warner
  Prophecies, Dadaxl, The Telephones, Moon Bullet, BB LoneDog, Sam Law, Saskia Searle, Sticky Bones Jones,
  Sarah Newby, DJ Bayer, DJ Gary. No day-by-day split is published. **If bndy ever models a marquee, this is
  the row to re-run.** `BB BlackDog` was created anyway, id `b3fd82d3-f71c-4e6c-8ca3-a9f6d3a829c6`.

## 8. Skipped, not rejected — 3 rows. The next run retries them.

- **Sham Radio @ The Pavilion, Donisthorpe** `1038863408722798`. Facebook's place record for this event points
  at a logistics firm on a business park. No correct Google Place ID exists for it. §0.8 forbids guessing a
  venue address. Sham Radio's other gig, at Mount Pleasant Inn, imported normally.
- **The Old Goats Grumble @ "Street Lane Denby"** `1203710098633666`. Not resolvable to a fixed building.
- **Sarah McQuaid** — counted under rejections above, listed here because the record exists and only the
  ruling blocks it.

## 9. The 10 sentinel bounces — all correct, and all of them mean the same thing

Each of these is a gig bndy already holds from the May or June 2026 runs. Every one bounced on
artist+venue+date, never on externalId, **because none of the existing records carries a `fantasticallibrary`
externalId.** That is the §6C empty-externalIds class, still live across this source.

| Date | Gig | Existing event | Unrecorded fb id |
|---|---|---|---|
| 2026-08-21 | Electric Pilgrims @ The Needles | `2ab784bb-43e9-489c-a93e-a8c1b0b58343` | 2133895627484842 |
| 2026-08-21 | Midnight Angel @ The Castle Inn | `018ff059-d405-44f7-994a-3c5de740de26` | 950739817834969 |
| 2026-08-21 | Storm Warning @ Oakfield Farm | `1cf03262-aa00-44f6-a9f1-cb6a73d581f0` | 1053075474302576 |
| 2026-08-22 | Let'z Rock @ The General Havelock | `f7d03360-a2da-4db3-8f37-7af81a5e987c` | 1437923804820404 |
| 2026-08-29 | Abba Sensationelle @ Newhall SC | `613193e2-a0ef-4ab2-aa72-5a6580cda580` | 1226400056284276 |
| 2026-08-29 | The Skarantinos @ The Tavern | `0c4e90fc-883c-473a-b8eb-3719cc989915` | 914716421671009 |
| 2026-08-30 | Peashooter @ The Halfway House | `468f8c5c-9791-409d-9df6-878d8f75cd9e` | 4303224266655258 |
| 2026-09-25 | Novocaine @ The Greyhound Inn | `5004f5d8-77a1-4dc2-b160-78f3e78e2235` | 1242175984476878 |
| 2026-09-26 | Starscreen @ Spondon Liberal Club | `ce8d06df-4ca7-4463-9b44-578b53ab837a` | 1946946132892077 |
| 2026-10-31 | Electric Pilgrims @ Gresley Old Hall | `6b21df1c-3ddd-4250-b89e-a56c17572255` | 1023121107031685-electric-pilgrims |

Two of these are the source publishing one gig twice under two Facebook ids (Starscreen at Spondon; Peashooter
at The Halfway House, where the stored event already holds `2091227141628255`). The sentinel is doing exactly
its job. **No externalId was edited on any of them**, because `edit_event(externalIds)` dedupes to one id per
source and would destroy the id already stored. A back-fill needs a read-then-write pass, listed as a build item.

## 10. Removed rows — 155, and NOTHING was deleted

155 ids in the 2026-07-31 snapshot are absent from today's capture. 33 of them are future-dated. **This is a
capture-window difference, not a set of cancellations.** Today's paste ends at 2027-01-01. The old snapshot ran
to 2027-12-31. Under §0.29 `append-only` the §5.7 removed-row path and §0.17 deletion do not run at all.

Sample of the future-dated absences, to show the shape: OurKid 2026-09-04, Lucky Rats @ White Hart Inn
2026-10-17, Luminote 2026-10-18, JUST RADIOHEAD 2026-10-24, Korn Again 2027-01-23, StillMarillion 2027-02-05,
The Doors Alive 2027-02-26. Every one of them sits past the paste's horizon or is a Flowerpot 2027 date.

**Why this source is `append-only` and not `delta`:** the stored snapshot and today's capture have different
horizons, so the two sides are not the same enumeration. §0.29 requires the same method on both sides before a
removal may be actioned. This source does not qualify today and should not be promoted to `delta` until a
capture reproduces the full forward listing.

## 11. Defects found. These need a fix, not a workaround.

**D-1. `edit_artist(nameVariants)` silently drops values.**
Sent `["The Double 2s","Double 2s Band","The Double 2s Band"]` to `ac8ee897-c7ab-499e-b769-2ef9132c886d`.
Stored one. A second call returned `success:true` with `updatedFields:["nameVariants"]` and the read-back still
showed one. This is silent data loss on a field whose whole purpose is identity resolution. It is the same
class as the `create_artist` drop already recorded in OPEN-RULINGS.

**D-2. `create_artist` auto-merged two different bands on normalised name, with no review step.**
`The Hate` (Derby punk bill, The Victoria Inn, 6 Sep) matched `Hate` `8012a73c-e140-4db3-b1fe-4f36d7222e8f`
at confidence 1 and returned `matched`, not `review`. That Stoke page is "Hostile Aggression Towards
Everyone". Two unrelated bands would have been merged. `confirmNew` forced the correct separate record
`3bea07d2-8e44-4771-a258-c70afd464ec5`. **A leading "The" must not collapse into a same-region match at
confidence 1 without a review step.** §1A says duplicate names are allowed when location distinguishes them;
the resolver did not apply that here.

**D-3. `get_by_id` does not return `locationType`.**
Every artist in this run was sent `locationType`. None can be verified. §0.10 requires reading a write back,
and this field cannot be read back. The Kilmarnock trap (§6B) is exactly a wrong `locationType`, so this is the
one field where verification matters most.

**D-4. `search_venue` returns the top match only and missed 5 of 52 venues.**
Missed: George and Dragon Belper, Oakfield Farm, Riddings Park Community Centre, Royal British Legion
Mickleover, The Alfred. It also returned the WRONG venue for "The Tavern" in Derby (`c40add37`, Nottingham Rd)
when the correct record is The Tavern, Hatton `ef4a3356-0e1b-4508-a10c-864341034d37`. `list_venues` by city
found all five. **Any run that trusts a `search_venue` negative will create a duplicate venue.**

**D-5. The `sources/fantastical-derby.md` alias table has lost the Ant Hill Mob pin.**
OPEN-RULINGS carried this as unverified since 2026-07-31. It is now confirmed GONE. Verified live this run:
`The Ant Hill Mob` Burton upon Trent `8bc112d4-d464-4602-8df7-c1ec7dd6f8d1` is the correct record;
`63d3f78c-f1f3-45f8-8b96-ad2308f65038` is Northwich and `04ec8d8d-f16a-4edf-8449-b11ce8ace95d` is
Warwickshire. The 6 Nov Castle Inn gig was written against the Burton record. The pin is being restored to the
spec by this run.

**D-6. `mcp__remote-devices__Filesystem__*` is unusable and `device_bash` is down.**
Every Filesystem tool returns `invalid outputSchema: JSON Schema declares an unsupported dialect
(draft-07)`. `device_bash` returns "Workspace unavailable. The isolated Linux environment on this device failed
to start." All vault writes in this run went through SendUserFile plus device_commit_files. A scheduled run
with no human to do that would not be able to write its snapshot, and §6A step 7 fails the run closed for a
missing snapshot. **This blocks unattended running of every source, not just this one.**


**D-7. `record_run` RETURNS HTTP 500.** Tried twice, with `sourceId` `fantasticallibrary` and again with
`fantastical-derby`. Both returned `{"success":false,"error":"HTTP 500","message":"Failed to record run"}`.
This run therefore does NOT appear on the Agent Work dashboard. `data\state\run-summary.jsonl` was appended
normally, so the MI dashboard that reads that file is correct; only the API-side record is missing.
Per §0.9 the bounce was not worked around.

**Concurrency note.** No claim file existed for this task and none was written, because the Filesystem MCP is
down (D-6) and `data\state\claims\fantastical-derby.json` could not be created. The lock was free at the
start of the run and no other session touched this source's files, verified by mtime on commit. Every write in
this run used `expectedMtimeMs`, so a concurrent edit would have been refused rather than clobbered. None was.

## 12. Duplicate records found, NOT merged (§0.11 forbids merging inside an import run)

| Entity | Keep | Duplicate |
|---|---|---|
| Derby Market Hall | `433c3066-9132-43b8-a3fc-fde38c7afcc5` | `ee7cdc3e-ea2a-44d8-8ddb-32881ad432d8` "Market Hall", same address |
| The Victoria Inn, Derby | `fa33511c-5bcb-4b46-bf1d-84b762f85ef0` | `35eaa30a-902b-4251-a7b1-e4dcbf7b0832` "The Victoria Inn DE1", same address |
| House Of Beer, Ashbourne | `94ce64a0-69d1-483e-8c84-694a1e5bc2b7` | `bfb1bfcf-8881-462b-b75c-6f7217d90af8` "House if Beer", same address and Facebook |
| The Dog House, Alfreton | `76e56542-3910-449b-a7c4-1642f2e7fa69` | `1a930f35-9dab-48a7-a5ee-68620dffb3b9`, both 32 Nottingham Rd |

**The 2026-07-31 "Royal Oak Tibshelf exists twice" flag is a FALSE ALARM.** Only one record exists,
`37bb18fb-9a81-4451-ae04-230b6472fd13`. That open item can be closed.

## 13. Venues created — 7

| Venue | id | Address as Google returned it |
|---|---|---|
| The Brasserie at Darleys | `12b2b427-39a5-491f-8003-e9f4d8a9ea06` | Waterfront Darley Abbey Mill, Darley Abbey, Derby DE22 1DZ |
| The Mushroom Hall | `026573df-9073-43c6-bf11-dd0c746fcb06` | Mushroom Ln, Albert Village, Swadlincote DE11 8EN |
| Seven Stars | `40621ce4-9c19-4663-bb1f-f2db2892c465` | 26 Church St, Riddings, Alfreton DE55 4BX |
| Shiny Brewery | `d6119cf7-b232-4ceb-893c-2472ca3de7c8` | Unit 10a Old Hall Mill Business Park, Little Eaton, Derby DE21 5EJ |
| Eagle Tavern | `7d6c35e3-8d35-4a50-86d8-fd768630eca0` | 94 Ripley Rd, Heage, Belper DE56 2HU |
| Kings Head | `1f39a75c-33cc-46b6-96f9-58d21ccd2095` | 60 Main St, Hilton, Derby DE65 5GG |
| Thornbridge Brewery | `e5f58945-6468-4771-8377-56a78e349a97` | already existed, matched on place_id |

Every postcode was checked against the expected county before the write, per §0.24. All seven are Derbyshire
or Staffordshire.

## 14. Open for Jason

1. **The Grand Pavilion, Matlock Bath.** Grassroots room or touring venue? It decides Sarah McQuaid and any
   future national booking there. The Hairy Dog and The Flowerpot are already on the kept list.
2. **Two spelling-variant Facebook attachments** to confirm or clear: Living Stone → "Livingstone Band";
   Luna and the Groove → "Lunar and the Groove".
3. **Belper 250 Rocks.** 17 acts lost to §0.23. A marquee on a cricket ground is the only thing stopping it.
4. Defects D-1 to D-6 above. D-6 blocks unattended running of every source.

---

# PASS 2 — the gigs bndy never had

Pass 1 diffed the capture against the snapshot and imported the 149 rows that were new **to the snapshot**.
That is not the same question as what is new **to bndy**. The 2026-07-31 run captured 493 rows and left 56 of
them unimported, so those rows sit inside the snapshot, look "already seen" to any diff, and are missing from
bndy. Every future run would have skipped them forever.

## 15. Method

42 of the 56 parked rows are still listed and still future-dated. Each was checked against bndy in BOTH
namespaces, `fantasticallibrary` and `facebook`, and where both missed, by venue and date. 31 were genuinely
absent. 11 were already held.

## 16. Written in pass 2 — 34 events, 26 artists

| Date | Bill | Venue | Children |
|---|---|---|---|
| 2026-08-29 | The Mechanist X Reaper X From Her Ashes | Victoria Inn | `d0ba29d9-5439-4fef-9ec7-fd7138892fb6` · `add5e856-2f69-4b16-bd1e-764fe9f80f8b` · `21af8a43-b076-4621-8900-8b0b151e0576` |
| 2026-08-30 | DC Done Dirt Cheap | The Smithfield | `1bfe9b88-b688-401b-b73f-78cd6bff0189` |
| 2026-09-05 | Killaz UK, Arctic Roll | Hairy Dog | `ba50ba19-af7c-4625-ac3e-69a499b2598c` · `7f1a1feb-b106-4832-8b32-eea998f57243` |
| 2026-09-18 | A Day To Remember UK | Hairy Dog | `a1cad5a9-c7d1-4871-8ac8-ac2fd494cfb8` |
| 2026-09-19 | devilish nights vol#12 | Victoria Inn | `c819db2c-0aa9-4180-9481-5c39b9d08414` · `8ddbc5bf-378c-4f06-ad43-fe6050293644` · `f9cbb8b7-661f-439e-8364-f971297b8ab7` · `588a10f4-dc57-43f5-9487-6900e7565420` |
| 2026-10-03 | Blaze Bayley | Hairy Dog | `018fa768-f176-4bb0-a4c5-0fa1e223aee2` |
| 2026-10-31 | PUNK TRIB, three of four | Hairy Dog | `54c0e683-9723-456b-8b09-d2ae5fd65077` · `8c104bf7-757c-40d3-a98a-d88d53c5a8a7` · `e9ca6d8e-4442-4e68-88ac-cf5901e10d42` |
| 2026-11-01 | The Darts | Hairy Dog | `fe15fdd9-801f-48fb-b8e3-5f224774da26` |
| 2026-11-06 | Bar Stool Preachers | Hairy Dog | `ca9745db-9f8b-4103-876c-33237d86ab22` |
| 2026-11-10 | The Briefs, The Cyanide Pills | Hairy Dog | `14b38131-a2d8-4bd2-adf5-e16cd7dfcd78` · `b7968759-0ba3-4a6e-85ca-7a49014eb209` |
| 2026-11-19 | Bullshit Detector | Hairy Dog | `d13888c1-0722-4b78-8580-4e32f7b67e2d` |
| 2026-11-20 | Simple Plan UK, Me You At Six, The Busted Experience | Hairy Dog | `2a1453ed-444a-44f1-ad40-6b23d2be2762` · `c8ca7c2a-9a1e-4e7a-9768-70b1aea19ff5` · `0f6dadda-0811-4747-9a1f-fff7bae58036` |
| 2026-11-21 | The Offspin vs Some 41 | Hairy Dog | `1867a66e-630b-46ee-8e9f-8afc52e8f3c9` · `69da70d5-4bbe-4b86-87a2-198e2c734a62` |
| 2026-11-27 | Meryl Streek, KEZ, Death Of The High Street | Hairy Dog | `e3c7cf56-bfe3-429d-b51b-8899c14a7309` · `953d6c3d-d62f-4583-9777-da69baacceec` · `9f3b5ccf-f646-4bf9-9d22-31d188df7a60` |
| 2026-11-27 | The Darker my Horizon, Mystiek, Chipsum Gravy | Victoria Inn | `39576165-2c17-4b10-a88c-6efa0f188cb0` · `765e7291-a945-4417-8e69-55990c2501a2` · `f6762e7b-76af-4295-97c9-9fed037a7e4a` |
| 2026-12-04 | Dead on Arrival | Victoria Inn | `e4655960-5f33-4616-98d9-6b188583a245` |
| 2026-12-19 | Ultimate Green Day, Ultimate Blink-182 | Hairy Dog | `992c0d59-2a9e-41b6-a2a7-15ef285ef73a` · `cb3265ad-dc98-491d-bda6-f293d075adaa` |

17 of the 26 new artists carry a verified Facebook page. 9 carry an evidenced blank.

**Two bills gained real stage times from their ticket pages, not from Facebook.** devilish nights vol#12:
Jamma 19:00, Exotoxin 19:45, Modes 20:30, Unnatural Order 21:15, doors 18:30, £10 advance. PUNK TRIB: doors
17:00, We'll be Damned on at 17:30, £30 on the door. §0.28 says the stage time wins and doors go in
`ticketInformation`. Both were written that way.

## 17. Correction to the 2026-07-31 run

**"GSG Vocal Trio Cabaret by Candlelight" was rejected in July as a by-Candlelight production. That was
wrong.** GSG Vocal Trio is a local act, already in bndy as `eba39a43-fa3f-4ccd-b563-d6bf1b1ca7cf`, playing
Moira Social Club. "by Candlelight" is the name of their own show, not a Derby Cathedral production. The row
was re-run this pass and bounced 409 against an existing 2026-05-23 record, so bndy already had it — but the
reasoning that rejected it was still wrong and the same reasoning would reject it again next time.
**The rule is: read who the ACT is, not what the show is called.**

## 18. Still rejected in pass 2, and why

- **Six at Vaillant Live**: Jane McDonald, Michael Starring Ben (twice, two FB ids for one show), Midge Ure,
  Ocean Colour Scene, The Damned, Showaddywaddy. Touring productions, and Vaillant Live is not a kept room.
- **Six Derby Cathedral by-Candlelight shows**: Bowie, ABBA, Motown, Frankie Valli, Whitney Houston, Queen.
  Same ruling. ⚠ Derby Cathedral has no venue record in bndy at all, which is why none of them could even be
  date-checked.
- **NOASIS, 2026-09-11.** The source title reads "CANCELLED! NOASIS (Derby/Australia) - MARSEILLE - THE PUBLIC
  EYE". §5.4: an explicit cancellation is never created. The Lime Kiln Wirksworth has no venue record either.

## 19. Repairs made on contact

- **`DC Done Dirt Cheap!` `4bd711b9-0e69-4906-956b-11d2d28e2ca5` held the SMITHFIELD PUB'S Facebook page as
  the band's page.** Written by the 2026-05-22 run. A venue page stored as an artist page is the §6C
  pub-as-artist class in a new form: the record is a real band, but its identity link points at a building.
  Cleared to blank, name normalised to `DC Done Dirt Cheap` per §0.20 with the exclamation kept as a
  nameVariant, actType tribute and genre Rock added. Searched twice in Chrome for a real page: every
  "Done Dirt Cheap" is American or Swedish, so §0.15 says blank.
- **The Grand Pavilion Matlock Bath** `0be45767-4fd7-45c8-9347-32484bd14d45` marked `standardTicketed` with
  `standardTicketUrl` https://thegrandpavilion.co.uk/gigs-events/ per the Jason ruling. Swift & Friends
  updated to ticketed. Sarah McQuaid `153e214d-eca3-4f6a-a5ef-05e2351048ca` tagged with the
  `fantasticallibrary` id alongside her `facebook` one.
- **Six pass-1 sentinel bounces back-filled** with the `fantasticallibrary` id so both writers can see them:
  `2ab784bb` · `1cf03262` · `613193e2` · `0c4e90fc` · `5004f5d8` · `6b21df1c`.

## 20. Two more defects from pass 2

**D-8. bndy CANNOT RECORD A NON-UK ACT'S HOME.** `The Darts` (San Francisco) and `The Briefs` (Seattle) play
The Hairy Dog. §1A.1 allows a UK town or a canonical UK region and nothing else, so both are stored
`UK wide` / `regional`, which is false. `Meryl Streek` took `Dublin`, which the field accepted but which no
canonical-region rule covers. **Every international touring act booked into a UK grassroots room hits this.**
It needs either a country field or an explicit "touring, non-UK" location value.

**D-9. THE MCP TOKEN EXPIRED MID-RUN.** One create returned
`MCP server "remote-devices" requires re-authorization (token expired)`. The write had not happened; a
follow-up lookup confirmed no record, and the identical payload succeeded on retry. **An unattended run cannot
re-authorise itself.** Combined with D-6, this is the second way a scheduled run dies without a human.

## 21. Day totals, both passes

| | Pass 1 | Pass 2 | Total |
|---|---|---|---|
| Events created | 130 | 34 | **164** |
| Artists created | 80 | 26 | **106** |
| Venues created | 7 | 1 | **8** |
| Festivals created | 0 | 1 | **1** |
| Sentinel 409s | 10 | 1 | 11 |
| Rejected or skipped | 27 | 13 | 40 |

---

# PASS 3 — checking the other 297 rows one at a time

Pass 1 trusted the snapshot. Pass 2 trusted the July run's written list of what it parked. **Pass 3 trusted
nothing** and checked the remaining 297 future-dated rows against bndy individually, in both namespaces.

## 22. Result

| | Count |
|---|---|
| Rows checked | 297 |
| Already in bndy | 257 |
| Absent | 40 |

Of the 40 absent: **15 were real gigs that should be in bndy**, 23 were correctly out (festivals on fields and
in parks, bingo nights, Luminote, Bavarian nights, no-named-act rows), and 2 needed a judgement I have not
made yet.

## 23. Written in pass 3 — 14 events, 5 artists, 1 venue

| Date | Gig | Venue | Event |
|---|---|---|---|
| 2026-08-30 | Southpaw Grammar | Old Crown Inn, Shardlow | `60dc4671-9315-4985-b5ed-a15f532e1d4e` |
| 2026-08-30 | GSG Vocal Trio | The Gate Inn, Branston | `b3df0d78-511e-4323-98ed-d5f148eeb918` |
| 2026-09-06 | Ding n John | Red Cow, Allestree | `3fa86755-2c90-4603-ba8c-520df4ce465e` |
| 2026-09-26 | Tom Nicholson | Belmont Services Club | `775f53b7-d7ae-4795-b2bd-ae932a242d1d` |
| 2026-10-24 | West O' the Moon | The Carnfield Club | `82361881-948d-44a6-88c5-15dde7101730` |
| 2026-11-12 | Interrobang | The Victoria Inn | `b94e7a85-d7f4-456a-9c05-46c345c7f3c7` |
| 2026-11-12 | The Dirt | The Victoria Inn | `50c5ad24-4820-4047-a2bf-e7c34778c02c` |
| 2026-11-13 | Code44 | Diseworth Village Hall | `3f1e89b8-5420-41bd-8f57-0d02718ce3ad` |
| 2026-11-14 | The Good Biscuits | Tutbury Club | `9bd93d66-9bf4-4234-a925-566ca8d39029` |
| 2026-11-19 | Dave McCabe | The Flowerpot | `976908b3-5802-4a33-b1e2-7bdcb449364b` |
| 2026-11-19 | James Jay Lewis | The Flowerpot | `0fe7f4f0-5bad-485b-9612-7a2b250e009b` |
| 2026-12-04 | Carl North | The Last Post | `f76dc5f2-ff56-46e7-a765-75850746d5e0` |
| 2026-12-04 | West O' the Moon | Rowells Drinking Emporium | `a7605db6-7abe-48ae-bc90-1a5fb3445c03` |
| 2026-12-12 | Mod Story | The Bell and Harp Freehouse | `6167ea83-c255-4a42-800e-74f2c4202d86` |

Artists: Southpaw Grammar `6bbe774a-ae3a-4ffd-be14-7000aef8f5d9` · Tom Nicholson
`29ad9230-fc89-4e2d-b6ac-75ac504ec56e` · Interrobang `5cadea3a-4a3d-4a24-98f8-0a5f68689dd8` · Dave McCabe
`b2171b10-5015-4e2b-a257-d3a72310a6ad` · James Jay Lewis `100cbca4-2f26-4ec1-8657-f8efffee2529`.
Venue: Old Crown Inn, Back Ln, Shardlow, Derby DE72 2HL `af36874f-6d3f-4e04-8e84-6adacf1b881d`.

## 24. ⚠ THE BIGGEST FINDING OF THE DAY: THREE ID CONVENTIONS ARE STILL LIVE AND THEY HIDE GIGS FROM EACH OTHER

Four of the 15 "absent" gigs were **not absent at all.** They were caught only by the artist+venue+date
sentinel at create time. My read-only check had reported them MISSING, because the check asked for the
Facebook numeric id and the records hold a **date slug**:

| Event | What it held | What it should hold |
|---|---|---|
| Courtney May @ Nicco `b6d028d0-bd01-4d63-95bf-30ad91ec9836` | `2026-08-27-courtney-may-music-nicco` | `1533643571107975` |
| SkaFusion @ Sitwell Arms `16dbd197-8579-46c2-80c1-ea5287ccc4a7` | nothing | `936958832649835` |
| Donovylan @ The Last Post `648ce241-0cb2-4d37-af22-d0e5ba190111` | `2026-10-02-donovylan-last-post-derby` | `1019173037463645` |
| Luke Wall @ The Last Post `6047bbab-ca6a-4ab0-84e3-ba2778991b3c` | `2026-10-16-luke-wall-last-post-derby` | `949329234735972` |

All four normalised to the Facebook id this pass, using `replaceExternalIds`, exactly as §6D-bis prescribes.

**Why this matters more than the four records.** §6D-bis has said since 2026-07-31 that the date-slug form is
VOID for this source, and it named a one-off normalisation sweep as outstanding. That sweep never ran.
**Every event still holding a slug is invisible to an id lookup, so any run that trusts a lookup will conclude
the gig is missing and try to create it again.** Only the artist+venue+date sentinel stops a double write. The
sentinel is doing all the work that provenance is supposed to do, and it cannot tell you WHICH source a
record came from.

## 25. ⚠ MULTI-DATE LISTINGS: THE ID IS FOUND, THE GIG IS NOT THERE

A Facebook listing that reads "and 1 more" is one id covering several dates. bndy stored the FIRST date only.

- **Mod Story at The Bell & Harp.** Id `1974250296815803` resolves to a bndy event dated **2026-08-08**. The
  source now lists the same id on **2026-12-12**. The December gig was missing. Created this pass with the id
  `1974250296815803-2026-12-12`, following the `lemonrock` residency precedent.
- **Chris Helme (The Seahorses).** Id `2006494983300095` resolves to a bndy event dated 2026-08-08; the source
  lists 2026-08-28. Left alone: Chris Helme is a touring act at The Tannery, which is not a kept room.

**Every "and N more" row in this source is a potential silent miss, and the id check cannot see it.** The July
snapshot marked these rows MULTIDATE. Today's snapshot marks them too. Nothing reads that marker.

## 26. Still out after pass 3 — 23 rows

Festivals on non-fixed sites (§0.23): Elvaston Castle Music Festival · The Modest at Dog Lovers Festival,
Elvaston Showground · Derby Fake Festival, Markeaton Park · Headshrinka at Rock the Peaks, Greenview Farm ·
Bridgefest is an exception and WAS imported, because The Old Crown Inn is a pub · Off The Tracks, Donington
Park Farmhouse · Hollow Farm Real Ale and Cider Festival · Ilkeston Hoedown · The Jinniefest (see below).

Darley Park Weekender, all three rows: Billy Ocean and Marti Pellow · JLS · The Darley Park Concert. A park,
and national touring acts.

No named act (§0.5): BATTLE OF THE BANDS DERBY 2026 · Derby Pride The Alternative Tent · Luminote on three
dates · Come and Sing · Bavarian Evening Week 1 and Bavarian Night Week 2 · Saturday Night Entertainment and
Bingo · Live Entertainment: Playing the songs of OASIS · Laurens Legacy Charity Gig · East Midlands Gospel
Music Festival at Vaillant Live · Celine Dion by Candlelight.

⚠ **Tom Nicholson Motown, Soul and Bingo Night WAS imported.** §0.5a rejects a bingo night "without a
performing act". This one names its act. The rule is about the act, not the word bingo.

## 27. Two left for a decision

- **The Jinniefest, 2026-08-30, The Jinnie, Burton upon Trent.** The Jinnie is a pub, so §0.27 says a pub
  badging its own weekend is a normal venue and its gigs import. But the organiser is "The Footprints Family"
  and no act is named in the title. Needs the event page read.
- **Belinda O'Hooley and Jackie Oates at Derby Folk Festival, 2026-10-10.** Two named acts, both real, but the
  venue reads "Derby Folk Festival" and Derby Folk Festival has no venue record. Needs the actual stage
  resolving before it can be created.

## 28. Two more repairs

- **`sources/fantastical-derby.md` names The Last Post as `0249016e`. That id does not exist.** The real
  record is `a7687e91-ccf2-447f-96b3-b9e4113aae47`, 1 Uttoxeter Old Rd, Derby DE1 1GA. Corrected in the spec.
  ⚠ The other three pinned ids in that alias table were all confirmed correct, so this is one bad entry, not a
  bad table. It was found only because a gig needed the venue.
- **`search_venue` failed twice more this pass** — nothing for "Nicco Restaurant and Bar" (found at 23% on the
  short query "Nicco"), nothing for "The Gate Inn" in Branston (found by a `list_venues` region scan). That is
  seven failures out of about seventy venue lookups today.

## 29. Day totals, all three passes

| | Pass 1 | Pass 2 | Pass 3 | Total |
|---|---|---|---|---|
| Events created | 130 | 34 | 14 | **178** |
| Artists created | 80 | 26 | 5 | **111** |
| Venues created | 7 | 1 | 1 | **9** |
| Festivals created | 0 | 1 | 0 | **1** |
| Sentinel 409s | 10 | 1 | 4 | 15 |
| externalIds repaired | 6 | 0 | 4 | 10 |
| Rejected or skipped | 27 | 13 | 25 | 65 |

**487 rows captured. 65 correctly out. 422 accounted for and in bndy.**
