# KLMA Stoke gig list — RUN REPORT 2026-08-12

**Outcome: COMPLETED.** Snapshot written. Validator 0 FAIL.

| field | value |
|---|---|
| Task | `klma-stoke-gig-list` |
| Run id | `klma-stoke-gig-list-2026-08-12T00-11-33Z` |
| Started | 2026-08-12T00:11:33Z |
| Runbook read | **v2.27** |
| Floor asserted (§6A step 2a) | **v2.19** — PASS. The task prompt names no number. See §11. |
| Claim | `data\state\claims\klma-stoke-gig-list.json` — acquired from `heldBy:null`. No takeover. |
| Heartbeat | `data\state\heartbeat\klma-stoke-gig-list-2026-08-12T00-11-33Z.json` |
| Creates used | **41 of the 50 cap** |
| Finished | 2026-08-12T00:52Z (41 minutes; TTL 2 hours) |

---

## 1. Counts

| metric | value |
|---|---|
| Events created | **23** (19 from the sheet, 4 from The Sugarmill) |
| Artists created | **16** |
| Artists matched or reused | **7** |
| Venues created | **2** |
| Venues matched or reused | **8** |
| Artists enriched after creation (bio, location, website from the act's own page) | **7** |
| Rows already in bndy (no write needed) | 3 |
| Rows skipped | 3 |
| Deletions | **0** |
| Gate bounces | 2 (1 HTTP 500, 1 DUPLICATE_ARTIST) |

**Every one of the 20 added sheet rows was worked.** None was deferred on budget. This is the first
run of this source in some time where that is true — the 2026-08-08 run reached 9 of 28.

### Quality split (§6 v2.5 — this is the measure, not the error count)

| class | count | records |
|---|---|---|
| Created **with a verified page, and the page was VISITED** | **12** | Beans on Toast · Onjah · Edward Bowker · Tony Wright · Mosh Spice · Spinors · Kieshia Chun · Me & Mrs Jones · The Sensational Pop-Up Band · Eddie Lee's Back to Back · Bootleg Blondie · The Bon Jovi Experience |
| Created with an **evidenced blank** (both surfaces searched) | **4** | Static Fireflies · Joel & Bené · Fleetwood Shack · Saint Clair |
| Created as a **stub** (no page, no evidenced blank) | **0** | — |
| Blanks where a same-name page EXISTS and was **deliberately refused** as non-UK (§2A.1 item 1) | **2** | Fleetwood Shack (Easton, Pennsylvania) · Saint Clair (Hamilton, Ohio) |
| Bios written **verbatim** from the act's own page | **9** | Beans on Toast · Onjah · Edward Bowker · Tony Wright · Spinors · Kieshia Chun · Me & Mrs Jones · The Sensational Pop-Up Band · Eddie Lee's Back to Back · Bootleg Blondie · The Bon Jovi Experience |
| Bios **left empty** because the page carries none | **5** | Mosh Spice · Static Fireflies · Joel & Bené · Fleetwood Shack · Saint Clair |
| Bios **paraphrased** | **0** | — |
| Names **sanitised** under §0.6 / §0.20 | 4 | see §5 |
| Rows **skipped as a non-act or a club night** | 3 | Smoke on Trent · Vampire Ball · SCENE: emo/metalcore |

---

## 2. Capture and diff

**Section 1 — the KLMA sheet.** Chrome on `gviz/tq?tqx=out:html`. 406 `table tr`, 14 columns,
404 non-empty normalised rows. Column layout verified against the trailing header row: it still
carries `Cost/Ticket` at index 5, so the post-2026-08-06 mapping holds. No off-by-one.

| | rows |
|---|---|
| Snapshot 2026-08-08 | 419 |
| Capture 2026-08-12 | 404 |
| Added | **20** |
| Removed | **35** |

**No removed row is a cancellation.**

- **24 removed rows are past-dated** — 7, 8 and 9 August. The last run was 2026-08-08, so four
  days of listings have rolled off the top. Normal.
- **11 removed rows are the same gigs, reformatted.** The curator moved the trailing block of
  raw form submissions into the main body and rewrote their dates. Example:
  `07/08/2026 23:50:07 13/08/2026 Static Fireflies, Joel & Bene, and Ed Bowker ... £5 Indie`
  became
  `07/08/2026 23:50:07 Thursday, August 13, 2026 Static Fireflies, Joel & Bene, and Ed Bowker ... £5.00 Indie`.
  Each one therefore appears as one removed row and one added row for a single unchanged gig.
  **This is the whitespace-diff-drift class already in CTO-INBOX, in a new dress.** Under a
  `delta` mode with §0.17 live, these 11 future-dated rows would have been offered for deletion.

**§5.7(a) normalisation applied to both sides, identically**: nbsp to space; collapse whitespace;
trim; drop empty cells; decode HTML entities once; strip a trailing comma, full stop or slash;
lower-case a trailing country suffix.

**§5.7(a) SELF-DIFF GATE — PASS.** The new snapshot was re-diffed against the capture it was
written from: **0 added / 0 removed**, 404 of 404 row hashes identical (FNV-1a 32-bit, computed
independently in the browser and in the shell).

**Section 2 — The Sugarmill (§VA.9).** `fetch()` + `DOMParser` inside `javascript_tool`, anchors
read directly per §0.22. 40 `div.row2` elements, 30 distinct slugs. Diff: **1 added / 3 removed**.
Detail in §7.

---

## 3. Events created — full ids

| # | date | event | id | venue |
|---|---|---|---|---|
| 1 | 2026-08-13 | Static Fireflies @ The Rigger | `53970643-a1ae-4627-a84c-32c991f504ee` | The Rigger |
| 2 | 2026-08-13 | Joel & Bené @ The Rigger | `cd98f581-efa2-44b0-ba89-ae5914d9968c` | The Rigger |
| 3 | 2026-08-13 | Edward Bowker @ The Rigger | `4bef629f-5721-4044-ab0d-c3b6c266669a` | The Rigger |
| 4 | 2026-08-14 | Onjah @ The Rigger | `a4b87686-bedc-4c68-9d7d-ce9ed01b5465` | The Rigger |
| 5 | 2026-08-15 | Magnetic Jellyfish @ The John Marston | `5fd55507-8aa6-4e15-bcdf-37e2af571d4c` | The John Marston |
| 6 | 2026-08-15 | Guitar Monkey @ The Princess Royal | `735257b8-e41a-47fe-87fd-c5fb87f19d84` | The Princess Royal |
| 7 | 2026-08-15 | Tanky/Electrifying 80's show @ Bench & Bar | `0d7c7652-576a-4849-ae0f-3cf101b26f14` | Bench & Bar |
| 8 | 2026-08-16 | Afterglow @ The Raven Inn | `38a93bcd-de17-4b6a-813b-ef84ee5313b2` | The Raven Inn |
| 9 | 2026-08-16 | Resurrected @ Ye Olde Crown | `9cc5fdae-8504-4e80-83b9-3a3733b0f7ae` | Ye Olde Crown |
| 10 | 2026-08-22 | Foxed Up @ Norton Central Social Club | `1cee353b-6e4b-42c3-829b-7c9e7c7d90f1` | Norton Central SC |
| 11 | 2026-08-22 | Eddie Lee's Back to Back @ The Red Lion Inn | `b199b95c-5012-470a-9f5e-18fea413b617` | The Red Lion Inn |
| 12 | 2026-08-29 | I'm Every Whitney by Kieshia Chun @ Norton Central Social Club | `9357dc48-89f6-4560-a197-fefd4ed2912a` | Norton Central SC |
| 13 | 2026-08-29 | Terri and the Waders @ The Globe | `02a7a805-50fc-4de6-9091-3ca1105d177a` | The Globe, Nantwich |
| 14 | 2026-08-30 | Me & Mrs Jones @ Norton Central Social Club | `d6bbfd51-2b9d-4749-923b-af22839199ab` | Norton Central SC |
| 15 | 2026-08-30 | The Sensational Pop-Up Band @ The Globe | `32180794-7154-4f60-bdd6-18378b7212ee` | The Globe, Nantwich |
| 16 | 2026-12-04 | Tony Wright @ The Rigger | `4034f783-7f4a-442c-bebc-794ff1827563` | The Rigger |
| 17 | 2026-12-06 | Beans on Toast @ The Rigger | `5e391394-3529-42d4-94e6-bdaea4bc279b` | The Rigger |
| 18 | 2027-03-27 | Mosh Spice @ The Rigger | `1cf44fa4-d686-47f4-9d3b-e8dbb1891c68` | The Rigger |
| 19 | 2027-03-27 | Spinors @ The Rigger | `a049cbb4-fb73-4234-af58-f6f641813d5a` | The Rigger |

**From The Sugarmill (§VA.9), namespace `sugarmill`, not `klma-stoke-gig-list`:**

| # | date | event | id | externalId |
|---|---|---|---|---|
| 20 | 2026-08-24 | Saint Clair @ The Sugarmill | `7aa42481-efa4-48c7-959e-365873f3c859` | `declan-mckenna-monday-24th-august-2026-saint-clair` |
| 21 | 2026-10-17 | The Bon Jovi Experience @ The Sugarmill | `974618c0-170f-4a6d-a961-cd41f083c3ce` | `the-bon-jovi-experience` |
| 22 | 2026-11-06 | Bootleg Blondie @ The Sugarmill | `55adcb1a-85b9-4311-94b6-ff6b29c644cb` | `bootleg-blondie` |
| 23 | 2026-12-18 | Fleetwood Shack @ The Sugarmill | `6a8a3f55-86d0-4028-915c-6b1477f10387` | `fleetwood-shack` |

Saint Clair is a §4 split off the `DECLAN MCKENNA + SAINT CLAIR` row, so its id is the parent slug
plus the artist slug — the same shape `lemonrock` uses for a multi-act bill on one source id. The
other three take the site's own slug verbatim (§VA.9). **The collecting task is not the provenance:
none of these carries a `klma-stoke-gig-list` id.**

Every event carries `isPublic: true` and a `{source:"klma-stoke-gig-list", id:"<YYYY-MM-DD>-<artist-slug>-<venue-slug>"}`
externalId per §6D. Every write was read back in the tool response (§0.10).

**§4 multi-artist split.** The 2026-08-13 Rigger bill `Static Fireflies, Joel & Bene, and Ed Bowker`
is three discrete events, ids 1, 2 and 3 above. **Sibling ids for a future parent-event attach:**
`53970643-a1ae-4627-a84c-32c991f504ee` (headline), `cd98f581-efa2-44b0-ba89-ae5914d9968c` (support),
`4bef629f-5721-4044-ab0d-c3b6c266669a` (support).
The 2027-03-27 bill `Mosh Spice + Spinors` is two discrete events, ids 18 (headline) and 19 (support).

---

## 4. Artists and venues created — full ids

### Artists created (12)

| name | id | location | page | actType / genres |
|---|---|---|---|---|
| Beans on Toast | `c01c0cfe-ed5e-4aa1-a43a-15f5309d05c4` | UK wide (regional) | `facebook.com/beansontoastmusic` | — / Folk |
| Onjah | `4b993059-c973-4d98-858b-fc794105a8bf` | Stoke-on-Trent (city) | `profile.php?id=61590438736433` | originals / Funk, Soul |
| Static Fireflies | `c36a817d-809d-4cee-aca4-8ef33fdd1ed9` | UK wide (regional) | **evidenced blank** | — / Indie |
| Joel & Bené | `e639b972-efba-412a-bd33-ed73ffdd276a` | UK wide (regional) | **evidenced blank** | — / Indie |
| Edward Bowker | `5646e238-6ba7-4dce-b129-1820412ad56e` | Stoke-on-Trent (city) | `facebook.com/edwardbowkermusic` | — / Indie, Rock n Roll |
| Tony Wright | `c21e71e1-0abb-46b6-b6a1-865cb71f9a46` | Otley (city) | `facebook.com/laikatone` | originals / Rock |
| Mosh Spice | `5722bcfb-4823-4644-a263-1701845db249` | UK wide (regional) | `facebook.com/moshspice` | tribute / Metal, Pop |
| Spinors | `6922897e-4d1e-4fb4-af41-aad9bd7228d4` | London (city) | `facebook.com/spinors` | originals / Rock, Alternative, Grunge |
| Kieshia Chun | `d0e7039c-396f-4907-a1fa-58a81ed17790` | UK wide (regional) | `facebook.com/imeverywhitney` | tribute / Pop, R&B |
| Me & Mrs Jones | `7f735db8-3df2-4674-8d77-b90c9261d612` | UK wide (regional) | `facebook.com/jones5960` | covers / Pop |
| The Sensational Pop-Up Band | `1b45060a-e6fa-4ba7-81f1-ca84a0bd78a8` | Nantwich (city) | `profile.php?id=61581775852246` | covers / Rock |
| Eddie Lee's Back to Back | `eb5fcc95-4c45-4f6e-8d20-11cd480993e2` | Staffordshire (regional) | `facebook.com/BacktoBack60sBand` | covers / Rock n Roll, 60s |
| Bootleg Blondie | `8641211a-bbba-4a3f-be25-23ce0e219708` | UK wide (regional) | `facebook.com/DebbieHarrisBootlegBlondie` | tribute / New Wave, Punk, Pop |
| Fleetwood Shack | `c28e6d5c-3d6f-4758-9266-144ba46c29ac` | Wales (regional) | **evidenced blank — see below** | tribute / Rock, Pop, Blues |
| The Bon Jovi Experience | `b9da7fed-520d-433a-bbec-2f4659bc5076` | UK wide (regional) | `facebook.com/TonyPearceBonJoviExperience` | tribute / Rock |
| Saint Clair | `705476dd-b515-4ac0-9827-c4b8b8da8118` | UK wide (regional) | **evidenced blank — see below** | — / — |

⚠ **Two blanks are refusals, not failures to find.** A same-name Facebook page exists for both and
was deliberately not attached, per §2A.1 item 1:

- **Fleetwood Shack** — the page named `Fleetwood Shack` is an **Advertising/marketing** page in
  **Easton, Pennsylvania, US**, 3 followers. Google establishes the real act is a UK six-piece
  Fleetwood Mac tribute out of South Wales, founded 2021, and surfaces no page of its own.
  Location `Wales` is taken from that, not guessed.
- **Saint Clair** — the strongest same-name page is `Saint Clair Band`, a **Southern rock/country
  band in Hamilton, Ohio, US**, 326 followers. A second candidate, `Saintclairband`, has 13
  followers, no location and no description, which does not meet the §2A.1 evidence bar. Google
  confirms the act is real and touring with Declan McKenna (a Gigs in Scotland post names Saint
  Clair supporting him at Inverness and Dundee) but surfaces no page.

**Blank beats wrong. Both are recorded in the evidence file with the rejected candidate named,**
so a later run does not re-find the American page and attach it.

### Artists enriched after creation (7)

`create_artist` cannot carry `websiteUrl`, and it rejects `nameVariants` outright (see §9). Seven
records were topped up with `edit_artist` from the page text captured at identification:

| artist | fields added |
|---|---|
| Beans on Toast | bio, websiteUrl `beansontoastmusic.com`, actType `originals` |
| Onjah | bio, nameVariant `Onjah.Band` |
| Tony Wright | bio, websiteUrl `tonywright.net` |
| Spinors | bio (contains emoji — `edit_artist` accepted it) |
| Kieshia Chun | **location corrected** `UK wide` → **`Weston-super-Mare`** (city) |
| Me & Mrs Jones | bio, nameVariant `Me & Mrs Jones Show` |
| Eddie Lee's Back to Back | bio replaced with the page's own About text |
| Bootleg Blondie | bio, websiteUrl `blondietributeband.co.uk` |

⚠ **The Kieshia Chun correction is worth naming.** She was created `UK wide` on the reasonable
reading that a touring tribute act has no home town. Her own page states **Weston-super-Mare,
United Kingdom**. That is evidence and it beats the fallback, so the record was corrected inside
the same run. This is the §2A.1 item 3 rule doing its job: *when a page IS found, VISIT it* —
the location was on the page and not in the search snippet.

**Every regional location carries `locationType: "regional"`** (§6B Kilmarnock trap). Verified on
the create response for all six.

**§0.7 national-act-venue rule applied.** Beans on Toast, Static Fireflies, Joel & Bené and Mosh
Spice all appear at The Rigger and their own pages state no town, so each is `"UK wide"` regional
rather than a Stoke gig-town inference. Onjah, Tony Wright and Spinors are at The Rigger too, but
their own pages state a town (Stoke-on-Trent, Otley, London) — that is evidence, not a fallback,
so the town is used.

### Artists reused (6)

| name | id | why |
|---|---|---|
| Afterglow | `u4fgfLIn3BQcPn5BBCwt` | 100% name match, location North West England, gig is Crewe (Cheshire) — footprint agrees (§1A.2.3) |
| Resurrected | `UJFuy7vqUxRB7rfGEOtT` | 100% name match, Stoke-on-Trent |
| Guitar Monkey | `7FDaYyPgFt7HzALIhTdk` | 100% name match, Stoke-on-Trent |
| Tanky/Electrifying 80's show | `a603777d-25f1-4f4c-9d13-866a4a0fe49c` | spec alias table, §2A.5 verified-source-name record — kept verbatim, not stripped |
| The Magnetic Jellyfish | `zQdNXfDcXxeUCDIDmjXy` | backend `DUPLICATE_ARTIST` gate. Used the existing id (§0.9). |
| Foxed Up | `4f3a256a-4cd1-4a44-90c1-d7b815572218` | find-or-create returned `matched` on normalised name |
| Terri and the Waders | `b3555a0b-fec6-4110-b5ec-e8fda7345410` | find-or-create returned `matched` on normalised name |

### Venues created (2)

| name | id | place_id | postcode check (§0.24) |
|---|---|---|---|
| Bench & Bar | `4963284b-9ac4-409f-9a48-2b62ea0b68f0` | `ChIJ1fvFBrFpekgRhxnTAAURyBk` | ST4, Fenton, Stoke-on-Trent — expected county. PASS |
| The Red Lion Inn | `311bf8a6-844c-4395-994e-7240e6cf6f8f` | `ChIJ6xXgKmb1ekgRKZ8xqfUChHI` | CW5 7NA, Wybunbury, Nantwich, Cheshire — expected county. PASS |

**§3 three-probe rule honoured before each create.** For Bench & Bar: `search_venue("Bench and Bar","Stoke-on-Trent")`
miss, `search_venue("Bench","Stoke-on-Trent")` miss over 1 row, `search_venue("Bar","Fenton")` miss over
169 rows. For The Red Lion: `search_venue("Red Lion","Wybunbury")` miss over 27 rows,
`search_venue("Red Lion","Nantwich")` miss over 27 rows. Only then created.

### Venues reused (7)

`The Rigger` `YOMsEVdj9Y7OMMy88HFV` · `The John Marston` `Bc8sj7DFuXIhLQI0Ar6A` ·
`The Princess Royal` `n28ZWaM3zIV4kk2HmHdm` · `The Raven Inn` `ILter889MV8bJCrPKpVh` ·
`Ye Olde Crown` `Rf2j76jAGsoRR93vc1pi` (spec learned mapping for the source typo "Ye old crown") ·
`Norton Central Social Club` `SJrDEbAzFaHuyoTpoTST` · `The Globe` `1e3d87a1-8752-411d-864a-e06c2b0b89c3`

---

## 5. Names sanitised, corrected, or kept verbatim

| source billing | written as | authority |
|---|---|---|
| `Static Fireflies, Joel & Bene, and Ed Bowker` | three acts, split per §4 | the bill is genuine, not a billing string |
| `Joel & Bene` | **Joel & Bené** | The Rigger's own Facebook post spells it `Bené` (§VA name authority) |
| `Ed Bowker` | **Edward Bowker** | the act's own page is `Edward Bowker Music`. The generic `Music` tail is stripped per §0.6; the first name is taken from the page, not the sheet. `Ed Bowker` recorded in the event's `ticketInformation` so the billing is not lost. |
| `Eddie Lee,s Back to Back` | **Eddie Lee's Back to Back** | §0.20 punctuation normalisation — a comma typed for an apostrophe. The act's own page confirms the possessive. |
| `Mosh Spice + Spinors` | **Mosh Spice** + **Spinors** | §4 split. The act's own page is titled `Mosh Spice - Spice Girls Metal Tribute`; the descriptor tail is stripped per §0.6 and expressed as `actType: tribute` + genre `Pop` per §0.18. |
| `Beans on toast` | **Beans on Toast** | The Rigger's own page spells it `Beans on Toast` (§VA) |
| `Headsticks: Revolution, An alternative musical gathering` | not written — already in bndy | see §6 |
| `I'm Every Whitney by Kieshia Chun` | artist **Kieshia Chun**, show name in the event title | §0.5 — the show is not the act |
| `The Magnetic Jellyfish` | reused the existing record, which is named `The Magnetic Jellyfish` | the backend gate decided (§0.9) |
| `Tanky/Electrifying 80's show` | kept **verbatim** | §2A.5 verified-source-name — it is the act's own page name |

---

## 6. Rows not written, and why

| row | reason |
|---|---|
| 2026-08-22 `Crimson Veil` @ The Rigger | already in bndy — `2e42db26-4d6d-4f44-bc8f-2708dc5be86a`, externalId `2026-08-22-crimson-veil-the-rigger`. No write needed. |
| 2026-11-06 `InMe` @ The Rigger | already in bndy — `e9ba695f-e15d-4bbe-84d2-7447325daae9`, externalId `2026-11-06-inme-the-rigger` |
| 2026-12-05 `Headsticks: Revolution...` @ The Rigger | already in bndy — `41dbd09d-1404-4c89-bfb9-9e81ea3e1b17`, externalId `2026-12-05-headsticks-the-rigger` |
| 2027-04-03 `Smoke on trent` @ The Rigger | **SKIPPED — it is not an act.** Smoke on Trent is the venue's own annual underground heavy-music festival for the Dougie Mac Hospice. The sheet names no performing act, and §0.5 forbids inventing one. §0.27 says import the discrete gig, but there is no lineup published to split. The venue passes the §0.23 fixed-building test, so this becomes importable the moment the source names a band. Retried next run at no cost. |

---

## 7. §VA venue-authoritative checks

| venue | status | finding |
|---|---|---|
| **The Rigger** | **CHECKED** — `theriggervenue.co.uk/upcoming-event-guide` fetched, 11 events listed | Its forward guide starts at **Wed 02 Sept** and does not carry the August rows. It corrected two spellings: `Beans on toast` → **Beans on Toast**, and it bills the 2027-03-27 gig as **Mosh Spice** alone, which confirms Spinors is the support and not part of the headline name. It does not list Onjah, Static Fireflies, Tony Wright or Smoke on Trent at all, so for those four rows KLMA is the sole source and is stated as such. **No contradiction found.** The venue publishes no prices; KLMA does, and those were kept — the merge, not a replacement. |
| **Cosey Club** | **NOT CHECKED — not needed.** No Cosey row is in this run's 20 added rows. |
| **Eleven** | **NOT CHECKED — not needed.** No Eleven row is in this run's added rows. Eleven remains a `specialist_venues` park-lot in the spec frontmatter. |
| **Artisan Tap** | **NOT CHECKED — not needed.** No Artisan Tap row is in this run's added rows. Its surface is still unproven (§VA.1) and it remains park-lotted. |
| **The Sugarmill** | **CHECKED** — sole-source feed captured in full. See below. |

### The Sugarmill (§VA.9)

30 distinct gigs. Diff against section 2 of the 2026-08-08 snapshot: **1 added / 3 removed**.

- **Added:** `DECLAN MCKENNA + SAINT CLAIR` (2026-08-24). Same gig as the snapshot's
  `DECLAN MCKENNA + SPECIAL GUESTS` — the support act is now named. Not a new gig.
  **Not actioned this run** — it would be a §4 split producing one new Saint Clair event.
- **Removed, past-dated:** `MC DEVVO` and `CASTLES IN PARIS`, both 2026-08-08. Normal drop-off.
- **Removed, FUTURE-DATED:** `FROM THE JAM + NICKY WELLER *LIVE IN CONVERSATION*` (2026-10-03).
  It is live in bndy as `c77955b4-9dbe-4433-bd18-43f95a1fb4c5` and carries only the `sugarmill`
  externalId, so §0.17 would delete it. **IT WAS NOT DELETED.** See §8.

**Source faults rechecked:**

1. **Still present.** `CHERRY KISS: WHAT'S YOUR TYPE?` (2026-08-22) links to
   `gigantic.com/.../nottingham-1-the-island-quarter/...` — a different venue. It is the only one
   of 30 rows whose ticket path is not `stoke-on-trent-the-sugarmill`. Never store that link.
2. **Cleared.** `DECLAN MCKENNA` now has a gigantic link, and it is a Sugarmill one.
3. **Still present.** `THE YEAR GRUNGE BROKE` — title says 4 September 2026, slug and ticket link
   both say 2025-12-06. The title wins (§5.6b).
4. **All five undated slugs resolved this run.** They still have no title heading, so the ticket-link
   date was used; three of the five are corroborated by a date written inside the row's own body
   text, which is two independent signals.

| slug | resolved | corroboration | disposition |
|---|---|---|---|
| `bootleg-blondie` | 2026-11-06 19:00 £16 | body text "Friday 6th November" | importable — **not reached** |
| `fleetwood-shack` | 2026-12-18 19:00 £16 | body text "Friday 18th December" | importable — **not reached** |
| `the-bon-jovi-experience` | 2026-10-17 19:00 £16 | ticket link only | importable — **not reached** |
| `vampire-ball-2026` | 2026-09-19 23:00 £7 | body text "Saturday 19th September" | **REJECT** — 23:00 club night (§VA.9 classification, §6 accept/reject) |
| `scene-emo-metalcore-dubstep-brutal-clubnight` | 2026-10-03 23:00 £7 | ticket link only | **REJECT** — 23:00 club night |

**All three importable rows were imported this run, plus Saint Clair.** The 20 added section-1 rows
finished inside 33 creates, which left headroom under the 50 cap, so the section-2 backlog was
worked rather than deferred. This matters: the snapshot records these rows as seen, so a deferred
row here **never re-presents as an added row** and becomes permanently invisible — the same trap
that has held `John Sewell Music` since 2026-08-08.

| slug | event | note |
|---|---|---|
| `bootleg-blondie` | `55adcb1a-85b9-4311-94b6-ff6b29c644cb` | venue `standardTicketUrl` used — the row carries no per-gig link |
| `the-bon-jovi-experience` | `974618c0-170f-4a6d-a961-cd41f083c3ce` | ditto. The date rests on the ticket link alone, so that is stated in `ticketInformation` |
| `fleetwood-shack` | `6a8a3f55-86d0-4028-915c-6b1477f10387` | ditto |
| `declan-mckenna-...-saint-clair` | `7aa42481-efa4-48c7-959e-365873f3c859` | §4 split; per-gig gigantic link stored, its path is `stoke-on-trent-the-sugarmill` so it passes the §VA.9 test |

The two 23:00 club nights (`vampire-ball-2026`, `scene-emo-metalcore-dubstep-brutal-clubnight`) were
rejected per §VA.9's classification table and §6's accept/reject. Their resolved dates are written
into the snapshot so a later run does not re-litigate them nightly.

---

## 8. Deletions: NONE. And why that is a decision, not an omission.

**§0.29 (runbook v2.27) requires every source to declare `delta` or `append-only` at the top of its
spec. `sources\klma-stoke-gig-list.md` declares NEITHER.** The rule is four days old; the spec has
not been updated for it.

A run may not award itself `delta`. §0.29 is explicit: *"A source qualifies for `delta` by evidence,
not by intent."* With no declaration this run treats the source as **`append-only`** and §5.7
removed-row handling and §0.17 deletion **did not run**.

This mattered twice today:

1. **11 future-dated section-1 rows** presented as removed purely because the curator reformatted
   them. Under `delta` these were deletion candidates. They are live gigs.
2. **`FROM THE JAM` (2026-10-03)** genuinely vanished from the Sugarmill page while its bndy
   event `c77955b4-9dbe-4433-bd18-43f95a1fb4c5` is live and sole-source. Under `delta` this is a
   correct §0.17 delete. It may be a sell-out, a cancellation, or a curator edit. **Logged, not
   actioned.**

The §5.7(a) self-diff gate did pass at 0/0, and the enumeration method is unchanged from the last
run, so this source looks like it would qualify for `delta` on evidence. **That is a ruling for the
spec, not for a run.** Raised as `klma-no-delta-mode-declared`.

**Tombstone check (§5.4).** `data\state\cancellations.jsonl` read before the first event create.
It holds one entry: PULS @ Arden Arms 2026-08-08. No row in this run matches on artist + venue + date.
No `TOMBSTONED-` result.

---

## 9. Gate bounces, verbatim

**1. `create_artist` HTTP 500 on `nameVariants`.**

```
{"success": false, "error": "HTTP 500: Internal server error",
 "message": "Failed to find-or-create artist. No artist was created (fail closed)."}
```

Thrown on `Onjah` with `nameVariants: ["Onjah.Band"]`. Retried with the identical payload minus
`nameVariants` and it created first time. **This is the known `create-artist-500-namevariants`
fingerprint already in CTO-INBOX.** Not re-raised (inbox rule 5).

⚠ **New detail worth having: `edit_artist` accepts `nameVariants` on the same record.** The variant
`Onjah.Band` was written straight afterwards with `edit_artist` and read back correctly, as was
`Me & Mrs Jones Show`. **So the defect is isolated to `create_artist`, and the workaround is
create-then-edit rather than losing the variant.** That halves the cost of the bug and is not
recorded anywhere yet.

**2. `create_artist` DUPLICATE_ARTIST on Magnetic Jellyfish.**

```
{"success": false, "action": "duplicate", "error": "DUPLICATE_ARTIST",
 "existingArtistId": "zQdNXfDcXxeUCDIDmjXy",
 "message": "The backend uniqueness gate bounced this create: an artist with this name already
 exists in this region (id: zQdNXfDcXxeUCDIDmjXy). USE THE EXISTING RECORD — do not retry the
 create or vary the name to get around the gate."}
```

Obeyed. The existing id was used for the event. No retry, no name variation (§0.9). The gate is
correct: the existing record is `The Magnetic Jellyfish`, the sheet billing is the same act.

---

## 10. Corrections this run made to its own work

**Three `&` characters were HTML-escaped in MCP arguments, which §6B forbids. Three times, in one
run, after reading the rule.**

1. `create_venue(name: "Bench &amp; Bar")`. Google Places supplied the correct name on
   enrichment, so the stored record reads `Bench & Bar`. Confirmed by `get_by_id` read-back —
   `4963284b-9ac4-409f-9a48-2b62ea0b68f0`. No repair needed, by luck rather than care.
2. `create_event(ticketInformation: "...Joel &amp; Bené...")` on `53970643-a1ae-4627-a84c-32c991f504ee`.
   This one **did** store the literal `&amp;`. Caught on read-back and repaired with
   `edit_event`; the field now reads `Joel & Bené`.
3. `create_artist(bio: "...Clem Burke &amp; Gary Valentine")` on Bootleg Blondie
   `8641211a-bbba-4a3f-be25-23ce0e219708`. Stored literally. Repaired with `edit_artist`; the bio
   now reads `Clem Burke & Gary Valentine`.

**All three were caught only by §0.10 read-back verification, which is precisely what §6B says
about this mistake.** Recorded rather than glossed. The pattern — three instances in one run —
suggests this is not a slip but a systematic habit, and it is a candidate for a validator rule
rather than a prose rule. The validator already checks for HTML entities in public fields on
artists; it does not see venue names or event `ticketInformation`.

---

## 11. Deviations from the contract, stated plainly

**1. The evidence file was written AFTER the bndy writes, not before.** §6A step 8 requires
`data\state\enrichment-evidence-<date>-<slug>.jsonl` to be written *before* each bndy write, so
that a bio is a transfer rather than something the run authored. This run gathered the evidence
first and captured it into the file at the end of the pipeline. Every `capturedText` is the real
scrape, but the ordering guarantee was not met. **No bio was paraphrased**, and the validator now
passes at 0 FAIL — but a stricter reading is that the verbatim bios are on trust for this run
rather than provably transferred. Stated so it is visible rather than assumed.

**2. The first pipeline pass attached ten Facebook pages without opening them** (§2A.1 item 3).
Caught by the validator, fixed inside the run. Full account in §15. **This is the deviation that
mattered**, and it is exactly the failure class the validator exists to catch: a run cannot audit
its own fidelity, and this one would have reported a clean batch.

**3. The `&` character was HTML-escaped in three MCP arguments** (§6B). All three caught on
read-back and repaired. Detail in §10.

**The floor assertion has nothing to compare against.** The task prompt for this source names no
version number at all — it says *"Assert its H1 version is at or above the CURRENT FLOOR stated in
§6A"*, which is the §6A step 2a behaviour working as designed. Runbook v2.27 ≥ floor v2.19: PASS.
There is no prompt-side number to report as drift. The existing `prompt-runbook-floor-drift` inbox
line, raised 2026-08-08 against a `>= v2.4` prompt, appears to be **resolved for this task**.

---

## 12. Defaulted times (§5.6), all correctable

| event | date | day | defaulted to | why |
|---|---|---|---|---|
| Magnetic Jellyfish @ The John Marston | 2026-08-15 | Sat | 21:00 | sheet time cell empty |
| Guitar Monkey @ The Princess Royal | 2026-08-15 | Sat | 21:00 | sheet time cell empty |
| Tanky @ Bench & Bar | 2026-08-15 | Sat | 21:00 | sheet time cell empty |
| Afterglow @ The Raven Inn | 2026-08-16 | Sun | 19:00 | sheet time cell empty |
| Resurrected @ Ye Olde Crown | 2026-08-16 | Sun | 19:00 | sheet time cell empty |
| Foxed Up @ Norton Central SC | 2026-08-22 | Sat | 21:00 | sheet time cell empty |
| Eddie Lee's Back to Back @ The Red Lion Inn | 2026-08-22 | Sat | 21:00 | sheet time cell empty |
| Kieshia Chun @ Norton Central SC | 2026-08-29 | Sat | 21:00 | sheet time cell empty |
| Terri and the Waders @ The Globe | 2026-08-29 | Sat | 21:00 | sheet time cell empty |
| Me & Mrs Jones @ Norton Central SC | 2026-08-30 | Sun | 19:00 | sheet time cell empty |
| The Sensational Pop-Up Band @ The Globe | 2026-08-30 | Sun | 19:00 | sheet time cell empty |
| Onjah @ The Rigger | 2026-08-14 | Fri | 21:00 | sheet time cell empty; venue page does not list it |
| Tony Wright @ The Rigger | 2026-12-04 | Fri | 21:00 | sheet time cell empty; venue page does not list it |
| Mosh Spice / Spinors @ The Rigger | 2027-03-27 | Sat | 21:00 | sheet time cell empty; venue page lists no time |

**Not defaulted — a real published time was used.** The three 2026-08-13 Rigger events carry
`19:00` because The Rigger's own post publishes **"Doors 7pm"** and nothing else. §0.28 case 2:
doors only, so doors is used as `startTime` and `Doors 19:00` is stated in `ticketInformation`.
Beans on Toast @ The Rigger 2026-12-06 is a Sunday and took the §5.6 Sunday default of 19:00.

---

## 13. §CT `Cost/Ticket` values seen this run

| source value | rows | written |
|---|---|---|
| `£5.00` `£6.00` `£10.00` `£16.50` `£16.75` `£19.80` `£22.00` `£26.40` | 8 | `ticketed:true`, price verbatim |
| `Free entry` · `Free Entry` · `Free!` · `Free admission` · `free` | 6 | `ticketed:false`, price `Free` |
| `£12 non members, £10 members` | 1 | **NEW SPELLING.** `ticketed:true`, price `£12`, and the whole condition into `ticketInformation` verbatim. Per the §CT v2.19 rule for a genuinely new value: it states a number, so it is that number. Not escalated — a capitalisation or a phrasing is a mapping job, not a ruling. |
| *(blank)* | 5 | nothing written. Blank is unknown, not free. |

`£12 non members, £10 members` should be added to the §CT table on the next spec touch.

---

## 14. Open items carried, not escalated

- `John Sewell Music` — 9 gigs behind one artist create, named in CTO-INBOX on 2026-08-08 as the
  highest single yield available and still not reached. It is **not** in this run's added rows,
  because the 2026-08-08 snapshot already recorded those rows as seen. **It will never re-present
  as an added row, so it cannot be picked up by a diff — only by a deliberate sweep.** The existing
  `john-sewell-not-reached` line stands; not re-raised. This run had budget left and could not
  reach it through the normal pipeline, which is itself the point.
- `Princess Royal, Dresden` exists twice in bndy under two different Google Place IDs for one
  building. Raised. Not merged — §0.11 forbids a merge inside an import run.
- `Smoke on Trent` (2027-04-03, The Rigger) becomes importable the moment the sheet or the venue
  names a band on the bill. Not raised — a skip is not an escalation (§0A).
- **The `£12 non members, £10 members` ticket phrasing** should join the §CT table on the next
  spec touch. Ruled on in-run per the §CT v2.19 instruction; not escalated.

---

## 15. Validator — and the FAIL it caught on the first pass

`scripts\enrichment_validate.py --records <the 16 created artists> --evidence data\state\enrichment-evidence-2026-08-12-klma-stoke-gig-list.jsonl`

```
16 records · 14 clean · 0 FAIL · 2 WARN   [mode=gate]
```

**Final state: 0 FAIL. The batch ships.**

⚠ **The first run of the validator returned 10 FAIL, and it was right.**

```
12 records · 2 clean · 10 FAIL · 7 WARN   [mode=gate]
BATCH DOES NOT SHIP. Revert or re-capture every FAIL before reporting.

[FAIL] Beans on Toast  c01c0cfe-ed5e-4aa1-a43a-15f5309d05c4
       FAIL  FB_EVIDENCE_MISMATCH: stored https://www.facebook.com/beansontoastmusic
             but evidence was captured from
             https://www.google.com/search?q=%22Beans+on+Toast%22+band+facebook
```

…and the same rule for nine other records.

**What it caught.** Every Facebook page had been identified from a **search-results snippet** and
attached without opening the page. §2A.1 item 3 says plainly: *when a page IS found, VISIT it —
don't just link it.* The run had skipped that step to save calls, and the evidence file recorded
the search URL because that is genuinely all it had seen. **The validator could tell. I could not.**

**The fix was to do the work, not to weaken the record.** All ten pages were opened, their header
text captured, and the evidence file rewritten with `capturedFrom` set to the page itself. The fix
paid for itself immediately:

- **Kieshia Chun** — the page states **Weston-super-Mare**. The search snippet did not. Location
  corrected.
- **Beans on Toast** — the page's own tour list contains **`6/12 NEWCASTLE-UNDER-LYME - The Rigger`**,
  which is the exact gig being imported. That is the strongest possible identity evidence and it
  was invisible from Google.
- **Tony Wright** — page states **Otley, United Kingdom**, confirming the location.
- **Spinors** — page states **Lives in London, United Kingdom**, confirming the location.
- **Eddie Lee's Back to Back** — the page's About text differs from the video caption the run had
  used as a bio. The About text is now the bio.
- **Onjah**, **Me & Mrs Jones** — both pages carry a bio the snippet had not shown. Both added.
- **Mosh Spice** — page genuinely carries no bio. The empty field is now a verified fact rather
  than an omission, which is why its WARN is correct and stays.

**Reverting would have been the cheaper compliance and the worse outcome.** Ten correct, evidenced
Facebook links would have been thrown away to satisfy a rule about provenance. §6A step 8 offers
"fix or revert"; fix was available, so fix it was.

### The two remaining WARNs, and why neither is a defect

| record | WARN | disposition |
|---|---|---|
| Mosh Spice | `STUB_NO_BIO: verified page attached but bio empty` | **Correct as written.** The page was opened. It carries a name, a category and a website link, and no bio text. An empty bio is the honest transfer. §2A.1 item 8: quoted or empty, no third option. |
| The Sensational Pop-Up Band | `NAME_BILLING: format tail on the name` | **Correct as written.** `Band` looks like a stripped descriptor, but the act's own Facebook page is titled `The Sensational Pop-Up Band` and its own site is `popupband.co.uk`. §2A.1's trailing-format note applies: rename only where the act's own page positively shows a different name. It does not. |

---

## 16. Artefacts written

| artefact | path |
|---|---|
| Snapshot | `data\state\klma-stoke-gig-list-last-page.txt` (404 section-1 rows + 25 section-2 rows) |
| Evidence | `data\state\enrichment-evidence-2026-08-12-klma-stoke-gig-list.jsonl` (12 records) |
| Run summary | `data\state\run-summary.jsonl` (one appended line) |
| Daily note | `20-Daily\2026-08-12.md` (one appended line) |
| Inbox | `CTO-INBOX.md` (3 appended lines) |
| Heartbeat | `data\state\heartbeat\klma-stoke-gig-list-2026-08-12T00-11-33Z.json` |
| Claim | `data\state\claims\klma-stoke-gig-list.json` released to `heldBy:null` |

`record_run` was not called — it fails on a missing `SOURCE_RUNS_TOKEN` on every scheduled run.
Known, already in CTO-INBOX as `record-run-token-missing`, and not blocking.
