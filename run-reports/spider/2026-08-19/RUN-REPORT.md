# SPIDER RUN REPORT — 2026-08-19

**Run id:** `spider-2026-08-19T01-05-16Z`
**Runbook read:** v2.27 in full. §6A step 2a floor check: CURRENT FLOOR is v2.19. 2.27 >= 2.19. PASS. The task prompt states no numeric floor, so there is no drift to report.
**Source spec read:** `sources\spider.md` in full.
**Claim:** `data\state\claims\spider.json` read as released (`heldBy: null`, `lastRun` `spider-2026-08-18T01-05-06Z`). Acquired 01:05:16Z, TTL 60 minutes, `expiresAt` 02:05:16Z. **No takeover.**
**Heartbeat:** `data\state\heartbeat\spider-2026-08-19T01-05-16Z.json`.
**Outcome:** PARTIAL. 7 records written and read back. Chrome was unreachable for the whole run.

---

## 1. Headline

| measure | value |
|---|---|
| Records written and read back (§0.10) | **7** |
| Target (§Caps) | 25 |
| Events created | 1 |
| Venues created | 1 |
| Artists created | **0** — blocked, see section 2 |
| Enrichment edits | 5 |
| Hops attempted | 15 |
| New venues found per 100 hops | **6.7** |
| Admissible gigs SKIPPED for want of a new artist | **13** |
| 409s | 0 |
| Deletions | 0 |
| Tombstone checks (§5.4) | 2 — no match |
| Validator | 5 FAIL, all against fields this run did not write. See section 9. |

**The run missed its target. The cause is a tool outage, not saturation.** 13 admissible future gigs were found, read and verified, and none could be written, because every one of them needs an artist record that bndy does not hold and §2A.1 item 5 forbids a bare create while Chrome is down.

## 2. BLOCKER — Claude in Chrome was unreachable

`list_connected_browsers` returned `[]`. `tabs_context_mcp` returned "not connected".

This is the **28th consecutive firing** across five tasks, spanning 2026-08-17 22:17Z to now. The enrichment task has logged it 27 times. `spider-chrome-unreachable-blocks-new-artists` is already open in `CTO-INBOX.md` from the 2026-08-18 spider run and **is not re-raised** (inbox rule 5).

**Two consequences, and the second is the expensive one.**

1. **No new artist could be created.** RUNBOOK §2A.1 item 5 is explicit and has no exception: if Chrome is unavailable mid-run, a new-artist row is not created bare. Under §0A rule 1(b) those rows are SKIPPED and named here, not staged.
2. **A Facebook-only seed has no readable surface.** Three of six ST6 venue seeds carry a Facebook page and no website.

The run worked only the surfaces that need no Chrome: venue websites and artist websites, read with `web_fetch`.

## 3. Seeds picked, and why

The cursor (`spider-state.json`) named **ST6** as `nextDistrict` and listed six ST6 venues holding a real website. Seed rule 4 outranks rules 1 to 3, so all six were worked first. The run then fell back to seed rule 1/3 — artists carrying their own website, which is plain HTML and needs no Chrome — plus one named carry-over lead from the 2026-08-18 report.

### Rule 4 — venues we already hold (6 hops)

| # | seed | surface | result |
|---|---|---|---|
| 1 | Talisman `6fecd113-6071-46c4-90f8-4bbd3dcedb85` | `talismantunstall.co.uk` | **PARTIAL** — `/` and `/whats-on` both return an empty body to `web_fetch`. Client-rendered. |
| 2 | Chell Social Club `8e1c012b-0f0a-49ca-8e82-80b12fe78c0f` | `chellsocialclub.com/artists` | **READ OK — 6 future gigs found.** Section 5. Venue enriched. |
| 3 | The Top Pub - Brown Edge `20eced38-130a-4378-9e45-c8218a3216e7` | `thetoppub.co.uk/drink-and-whats-on` | **READ OK — 5 future gigs found.** Section 6. |
| 4 | The Old Post Office `ocqMyrVLWZkxk5zEjJ2w` | `website` field holds a Facebook URL | **SKIPPED** — Facebook only, no Chrome. |
| 5 | Grumpy's-GB Motorcycles `HDfCfgFwyafaVHhzYA5z` | `grumpys.uk/gigs-events` | **READ OK — the whole diary is 2025.** Section 7. |
| 6 | Kings Head `bY73hTwRGQTg73wLqHOm` | `website` field holds `facebook.com/scrimmies` | **SKIPPED** — Facebook only, no Chrome. |

### Rule 1/3 — artists we already hold, with their own website (9 hops)

Drawn from `list_artists(region:"Stoke-on-Trent")`, 163 records, first 80 read.

| # | seed | surface | result |
|---|---|---|---|
| 7 | Antarctic Monkeys `47bfee8d-22f2-48dd-a7e8-119ccb6a69e4` | `antarcticmonkeys.com/gigs` | **READ OK — 1 admitted, WRITTEN.** Carry-over lead from 2026-08-18. Section 4. |
| 8 | Bravado `e63f18aa-67ca-4f39-9ab9-3dcb2d17ebfd` | `planetbravado.com` | READ OK — 6 dates, 1 in region and **already held**. Section 8. |
| 9 | Native Way `e5ikgvWu8HHNApkQiPoy` | `nativewayofficial.com` | READ OK — a function-band site. **No diary exists.** |
| 10 | Danny Brab `FIT600aoQ5lpNSejGctN` | `dannybrab.com/gigs.html` | **PARTIAL** — the page's whole content under "Upcoming Gigs" is one JPEG, `flyer.jpg`. No dates in text. Artist enriched. |
| 11 | Sam Hackney `d9dd3a04-74bb-4482-b842-297b597d7aa6` | `samhackneymusic.co.uk` | **READ OK — 2 future gigs found**, both venues unresolvable. Section 6. Artist enriched. |
| 12 | Hi On Maiden `181b0e5a-00b4-4fd8-a599-625bb437e7b7` | `hionmaiden.com/hi-on-maiden-tour-dates/` | **PARTIAL** — the dates page returns an empty body; the home page's date strip is stale to 2024. |
| 13 | Nickelback UK `ea21f6f2-0cdd-4a39-8d95-ee4347d1e1bb` | `nickelbackuktribute.co.uk` | **PARTIAL** — the "UPCOMING SHOWS" block is images only. Artist enriched. |
| 14 | The Kilns `76b890e7-7df1-42ec-aec1-c823fc109749` | `thekilns.co.uk` | **PARTIAL** — empty body to `web_fetch`. Client-rendered. |
| 15 | KMK-KAISER MONKEY KILLERS `4d412eba-c547-4cd9-a98b-4e47c13ca54b` | `thekmk.com` | **PARTIAL** — empty body to `web_fetch`. Client-rendered. |

⚠ **6 of 15 hops failed on the capture, not on the ground.** Five sites are client-rendered and one publishes its diary as an image. Reading those zeroes as saturation would be the mistake §6 warns against.

## 4. WRITTEN — Antarctic Monkeys at Thornbridge Brewery

This is the carry-over the 2026-08-18 report named as "probably admissible, ran out of clock". It is now written.

**Admission test.** Thornbridge Brewery is an independent brewery taproom at a fixed building, inside the coast-to-coast strip. §0.23 passes: it has a correct Google Place ID. Decision 03 applies — it sells tickets and is therefore marked `standardTicketed`, not ignore-listed.

**Venue resolution, §3 in full.** `search_venue("Thornbridge Brewery","Bakewell")` → *no venues found*. §3.1 requires three probes before any create, and all three were run: the distinctive-word probe `search_venue("Thornbridge","Bakewell")` → no venues found; `list_venues(city:"Bakewell")` → 3 records read by hand (Bakewell Town Hall, The Bulls Head Monyash, The Manners), none of them this venue. Only then was the venue created.

**Postcode check, §0.24.** Confirmed **DE45 1GS**, Riverside Brewery, Buxton Rd, Bakewell, Derbyshire. DE45 is Bakewell. The geocode the backend returned, `53.2195408, -1.6849569`, is character-for-character the coordinate pair in the act's own Google Maps link on the source page.

| id | what | verified |
|---|---|---|
| `e5f58945-6468-4771-8377-56a78e349a97` | **Venue created** — Thornbridge Brewery, Bakewell DE45 1GS, place_id `ChIJLaHT_oYoekgRJJWes0GVvUw` | `get_by_id` OK |
| `e5f58945-6468-4771-8377-56a78e349a97` | **Venue edited** — `postcode` DE45 1GS, `website` thornbridgebrewery.co.uk, `standardTicketed` true | `get_by_id` OK |
| `4f407dc6-5ecf-4905-9217-c360c94b9a3e` | **Event created** — Antarctic Monkeys @ Thornbridge Brewery, 2026-09-25 | `get_by_id` OK |

- artistId `47bfee8d-22f2-48dd-a7e8-119ccb6a69e4` (existing, matched — no create)
- externalId `{source:"spider", id:"artist-47bfee8d-22f2-48dd-a7e8-119ccb6a69e4-2026-09-25"}` (§Provenance form)
- `isPublic: true`, `ticketed: true`, ticketUrl from the act's own page
- ⚠ **DEFAULTED TIME.** The source publishes no stage time. The server applied §5.6 (Friday → 21:00) and returned `startTimeDefaulted: true`. Correctable.
- **Tombstone check (§5.4):** `cancellations.jsonl` holds 2 real records (PULS @ Arden Arms 2026-08-08 deleted; Tubesnake @ New Hartley 2026-08-22 hidden). No match on artist + venue + date. The create was allowed.

**Rejections from the same capture**, recorded so the admission test can be overruled. `REJECTED-non-fixed-venue` (§0.23): Fake Festival Derby 2026-08-22, Fake Festival Leicester 2026-08-29, Keel Square Sunderland 2026-08-31, Big Fake Festival Walesby 2026-09-04, Meadow Fest Oxford 2027-05-28, Bromsgrove Tribute Festival 2027-05-29, Fake Festival TBC 2027-05-29. `REJECTED-not-grassroots`: the O2 Academy dates, The Buttermarket Shrewsbury, The Waterfront Norwich, The Foundry Sheffield, The Welly Hull, O2 City Hall Newcastle, The Picturedrome Holmfirth. `REJECTED-out-of-region`: Quarters Brighton, Casino Rooms Rochester, Old Fire Station Carlisle ×2, The Apex Bury St Edmunds, The Drill Lincoln, KuBar Stockton, The Nest Nottingham, The Brook Southampton, Queens Market Rhyl, Electric Daisy Derby. `REJECTED-horizon` (§5.5): The Old Woollen, Farsley, 2027-10-16. **Already held:** Eleven, Stoke-on-Trent, 2026-11-06, event `51c15be2-16a4-4084-a43a-5ae64767ac00`. Not touched.

## 5. Chell Social Club — a venue we hold, never read, publishing six future gigs

This is exactly the hole seed rule 4 was added to close, and it is the clearest evidence of the outage's cost.

`chellsocialclub.com/artists` publishes a dated act list. The club's own schedule page states its stage times plainly: **"Artist - 1st Half: 20:15pm - 21:00pm ... Artist - 2nd Half: 22:30pm - 23:15pm"**. Under §0.28 rule 1 that is a published stage time and would have been used, not a defaulted one.

**Date derivation, and why it is safe.** The GoDaddy grid emits a responsive triple of headings per card, and the extraction interleaves them. The **first heading of each card group** is the card's own date. Two independent checks confirm it: the five September acts map one-to-one onto five distinct ascending September dates; and **every weekday label on the page matches 2026** — 15, 22 and 29 August are Saturdays, 4 September is a Friday, and 5, 12, 19 and 26 September are Saturdays.

| date | act | bndy has the artist? | action |
|---|---|---|---|
| 2026-08-15 | Neil James | — | past-dated, §0.14, dropped |
| 2026-08-22 | Darren Michaels | **NO** (`search_artist` top hit "James Michael" 67%, "Darren Morgan" 60% — neither is this act) | **SKIPPED — no artist, Chrome down** |
| 2026-08-29 | Twilight | **NO** | **SKIPPED — no artist, Chrome down** |
| 2026-09-04 | Charlotte | **NO** | **SKIPPED — no artist, Chrome down** |
| 2026-09-05 | Beverley Jordan | **NO** | **SKIPPED — no artist, Chrome down** |
| 2026-09-12 | Alistair Lee | **NO** | **SKIPPED — no artist, Chrome down** |
| 2026-09-19 | Scott Anson | **NO** | **SKIPPED — no artist, Chrome down** |
| 2026-09-26 | After The Storm | **NO** | **SKIPPED — no artist, Chrome down** |

Seven future gigs at one ST6 club, every one of them admissible, every one of them unwritable. They are not lost. The next run with a working Chrome writes all seven.

**Written from this hop:**

| id | what | verified |
|---|---|---|
| `8e1c012b-0f0a-49ca-8e82-80b12fe78c0f` | **Venue edited** — `phone` 01782 834002, `socialMediaUrls` facebook.com/chellsocialclub | `get_by_id` OK |

Evidence: the club's OWN website carries the heading **"LINK TO OUR FACEBOOK PAGE"** above that URL. Own-domain link, same name, same club. Recorded in `data\state\enrichment-evidence-2026-08-19-spider.jsonl` before the write.

## 6. Two more venues publishing forward, and why nothing shipped

### The Top Pub - Brown Edge `20eced38-130a-4378-9e45-c8218a3216e7` — 5 future gigs, 0 writable

`thetoppub.co.uk/drink-and-whats-on` (page modified 2026-07-27) lists a forward diary. **All nine weekday labels on it match 2026 exactly**, so the year is not in doubt. The pub's live-music page states its live music nights run at **8pm**.

| date | act | in bndy? | action |
|---|---|---|---|
| 2026-07-31 | Bryan Hills | — | past-dated, dropped |
| 2026-08-14 | The Little Orcs | — | past-dated, dropped |
| 2026-08-22 | Charity Afternoon Tea in Aid of Breast Cancer | — | `REJECTED-not-a-gig` — no named act |
| 2026-08-28 | Sammi Jane | **NO** | **SKIPPED — no artist, Chrome down** |
| 2026-09-25 | Phil Boyd | **NO** | **SKIPPED — no artist, Chrome down** |
| 2026-10-30 | Before The Bitter End | **NO** | **SKIPPED — no artist, Chrome down** |
| 2026-11-27 | The Amazeballs DD King | **NO** | **SKIPPED — no artist, Chrome down.** ⚠ Also a §0.6 billing question: this reads as two acts or an act plus a strapline. Resolve on the act's own page before any create. |
| 2026-12-18 | Penkhul Village Brass featuring Quiz Master Carl | **NO** | **SKIPPED — no artist, Chrome down.** ⚠ §4 split: the act is the brass band, spelt "Penkhul" here and "Penkhull" as a place. "Quiz Master Carl" is a quiz host, not an act (§6 reject filter). |
| 2026-12-31 | New Year Eve Party with Hannah Bee | **NO** | **SKIPPED — no artist, Chrome down.** The act is Hannah Bee; the party title is event text. |
| Monday evenings | Quiz Night | — | `REJECTED-not-music` — quiz, and undated (§0.14) |

### Sam Hackney `d9dd3a04-74bb-4482-b842-297b597d7aa6` — 2 future gigs, 0 writable

`samhackneymusic.co.uk` publishes a diary. Weekday check: every listed date is a Sunday in 2026, and the site's own copyright reads 2026.

| date | venue | action |
|---|---|---|
| 2026-08-02 / 08-09 / 08-16 | The Crown NuL · Trentham Gardens Summer Fair · Private wedding, Keele | past-dated; the last two would also be `REJECTED-non-fixed-venue` and `REJECTED-private-function` under §0.23 |
| **2026-08-23** | **Golden Hill Club, Tunstall** | **SKIPPED — venue unresolvable.** Not in bndy (`search_venue` twice, `list_venues(city:"Tunstall")` read by hand — 1 record, The Wheatsheaf). Two web searches returned two different addresses for a "Goldenhill Working Mens Club" — Kidsgrove Road ST6 5SH and 131 Mobberley Rd ST6 5SS — and one source states it is permanently closed and demolished. §0.8 forbids guessing a venue's address to obtain a place_id. Not created. |
| **2026-09-06** | **The Bull's Head, Stone** | **SKIPPED — venue unresolvable.** Not in bndy (`search_venue`, then `list_venues(city:"Stone")` read by hand — 11 records, no Bull's Head). Two web searches found Bull's Heads in Burslem ST6 3AJ, Alton and Shenstone, **none in Stone**. Resolving a Stone gig to a Burslem pub would be exactly the §3.4 same-name error. Not created. |

**Written from this hop:** artist `d9dd3a04-74bb-4482-b842-297b597d7aa6` `instagramUrl` = `https://www.instagram.com/s.hackney_`, taken from the act's own site. ⚠ **`facebookUrl` deliberately LEFT BLANK.** The only Facebook link on that site is `facebook.com/sam.hackney.5817` — a personal profile in firstname.lastname form, which §2A.1 item 4 forbids attaching as the act page. Blank beats wrong.

## 7. Grumpy's — the diary is a year out of date, and it is provable

`grumpys.uk/gigs-events` renders a full year of Saturday gigs under the heading "Live Music" with **no year printed anywhere**. It is **2025**, not 2026, and the weekday alignment settles it beyond argument:

- The page reads "February - Sat 1st". 1 February **2025** is a Saturday. 1 February 2026 is a Sunday.
- Its February Saturdays are 1, 8, 22 (plus a typo'd "Sat 31st", a date February does not have). February 2025's Saturdays are 1, 8, 15, 22.
- "Friday 9th" May, "Sunday 20th" April, "Sun 3rd" August, "Fri-12th" December and "Weds 31st NYE" all match 2025 and none match 2026.
- The site's own navigation still reads "Where You Can See Us in **2025**".

**Nothing was imported.** §0.14 forbids a past-dated gig. Same class as the Boughey Arms finding of 2026-08-18. Named acts on that stale list are recorded as a discovery lead only (§5.5, use the past, do not import it): Shef Leppard, Mother Thunder, Fraxure, Kid Klumsy, The Original Wanted, King Rock, Adam Bomb, James Oliver Band, Chasing Twisters, Yeti Valhala, Dr. Savage, The Brad Henshaw Band, Motorwrecked, The Desperados, Leaf Band, Wolves In Alcatraz, Dogflesh, SHIO, The Parlour Creepers, Blackhills, Death Warmed Up, Grace Band, The Revenants, Red By Night, Rise Up, Speed Stroke, Skint Lilly, Sons Of The Blue, The TV Pins, The Lads From Mac, CM Wolf, Karma Cartel, Eddie & the Flipsiders, The Loving Cup, Bras & Roses, Slackrr, Mutton Dressed As Glamb.

⚠ **DATA finding, raised to CTO-INBOX.** The bndy record gives Grumpy's postcode as **ST6 4NW**. The venue's own website gives **ST6 4LU**, twice, on two pages. §0.24 says the postcode decides, so a disagreement between the record and the venue's own site needs a human. Not corrected by this run.

## 8. Bravado — 6 dates, 1 in region, and bndy already had it

`planetbravado.com` publishes its diary in the page body. **2026-09-11, Eleven, 21a Newfield Industrial Estate, Sandyford, Stoke on Trent ST6 5PD** — in region, address matches bndy's Eleven record `8Pky4flebxSt2s36ub3o` exactly.

`search_event(artistId, dateFrom 2026-08-19, dateTo 2027-08-19)` returned the gig already held: event **`03213130-71ae-4ffc-be83-250bbf24d613`**, "Bravado (Rush tribute) @ Eleven", externalId `{source:"cowork-discovery", id:"eleven-bravado-20260911"}`. `get_by_id` shows it already carries `ticketed`, a ticket URL and a price. **Nothing was written and nothing needed to be.** This is the correct outcome, not a null one.

Rejected from the same capture: Chelmsford Social Club 2026-10-09 (`REJECTED-out-of-region`); Legends Of Rock Great Yarmouth, The Booking Hall Dover, Swale Assembly, Tropic At Ruislip (all `REJECTED-out-of-region`); Gloucester Guildhall 2027-09-25 (`REJECTED-out-of-region` and `REJECTED-horizon`).

## 9. Validator (§6A step 8)

Run against the 3 artist records this run edited, with this run's own evidence file:

```
python3 scripts/enrichment_validate.py \
  --records data/state/spider-validator-records-2026-08-19.json \
  --evidence data/state/enrichment-evidence-2026-08-19-spider.jsonl

3 records · 0 clean · 5 FAIL · 1 WARN   [mode=gate]
BATCH DOES NOT SHIP. Revert or re-capture every FAIL before reporting.
```

The five FAILs, verbatim, and what each one is actually about:

| record | FAIL | field this run wrote? |
|---|---|---|
| Danny Brab | `FB_EVIDENCE_MISMATCH: stored facebook.com/profile.php?id=61551738096172 but evidence was captured from dannybrab.com/` | **No.** Pre-existing, untouched. |
| Nickelback UK | `BIO_VERBATIM: bio is NOT a substring of the captured page text` | **No.** Pre-existing bio, untouched. |
| Nickelback UK | `FB_EVIDENCE_MISMATCH: stored facebook.com/NickelbackUK but evidence was captured from nickelbackuktribute.co.uk/` | **No.** Pre-existing, untouched. |
| Sam Hackney | `BIO_VERBATIM: bio is NOT a substring of the captured page text` | **No.** Pre-existing bio, untouched. |
| Sam Hackney | `BLANK_NOT_EVIDENCED: no facebookUrl and no searchVariants recorded` | **No.** Pre-existing blank, untouched. |

**Every FAIL is against a field this run did not write.** This run wrote exactly one field per record — `instagramUrl` — and the validator cannot scope evidence to a field. That is `validator-genre-only-fb-evidence-mismatch`, already open in `CTO-INBOX.md` from 2026-08-14, described there in the same terms. It is **not re-raised** (inbox rule 5).

**Nothing was reverted, and that is a deliberate call.** The three Instagram URLs are correct, each taken from the act's own website, each already stored on the bndy record as `websiteUrl`. Reverting correct public data to satisfy a check that is firing on other fields would make bndy worse.

**On `BLANK_NOT_EVIDENCED` specifically:** it would clear if this run recorded search variants for Sam Hackney's Facebook. **It did not, and must not.** No Facebook search was possible — Chrome is down and §2A.1 item 3b surface (a) has been reported down since 2026-08-14. Writing variants that were never tried would be a false evidence record, which is the one thing this file exists to prevent.

`--mode audit` returns the same picture (4 FAIL, 1 WARN, exit 1). Records file preserved at `data\state\spider-validator-records-2026-08-19.json` so this is checkable.

## 10. Quality measures (§6)

- Records created **with a verified page**: **0** — no artist was created.
- Records created with an **evidenced blank**: **0** — no artist was created.
- **No stub was created.** Under a 28-firing Chrome outage that is the one thing this run had to get right, and it did.
- Enrichment writes, all with evidence captured **before** the write, all read back with `get_by_id`: 3 artist Instagram URLs and 2 venue top-ups. Every one came from a surface the record itself already pointed at — the act's or venue's own website.
- Records **skipped**: **13 admissible future gigs**, every one named in sections 5 and 6 with its date, act and reason. 11 for want of an artist record, 2 for want of a resolvable venue.
- Names **sanitised or flagged as non-acts** under §0.6: 3 — "The Amazeballs DD King" (billing unresolved), "Penkhul Village Brass featuring Quiz Master Carl" (§4 split, quiz host is not an act), "New Year Eve Party with Hannah Bee" (party title is event text, the act is Hannah Bee). None were written.
- Venues `REJECTED`: 25 rows across sections 4 and 8, each with its reason class.

## 11. Saturation, per district

| district | hops this run | new venues | saturation this run |
|---|---|---|---|
| ST6 | 6 | 0 | 0.0 |
| DE45 | 1 | 1 | 100.0 |
| ST15 | 1 | 0 | 0.0 — venue unresolvable, not absent |
| n/a — artist seeds spanning districts | 7 | 0 | 0.0 |
| **run total** | **15** | **1** | **6.7 per 100 hops** |

⚠ **ST6's zero is not saturation.** Six seeds produced two live forward gig lists and seven skipped gigs. The district is yielding; the writes are blocked upstream. Two of its six seeds are Facebook-only and cannot be read at all until Chrome returns.

## 12. Cursor

`nextDistrict` set to **ST6**, deliberately unchanged. ST6 has 13 known future gigs waiting behind the Chrome outage — 7 at Chell Social Club, 5 at The Top Pub — and one run with a working Chrome clears them. Moving the cursor now would strand them.

## 13. §0.29 mode

`sources\spider.md` declares no mode. The run treated the source as **append-only**, which is also what it is by construction: the spider has no upstream feed and therefore no snapshot, so §5.7 removed-row handling and §0.17 deletion cannot apply to it. No deletion was made or considered. Already raised as `spider-mode-not-declared` on 2026-08-15. **Not re-raised.**

## 14. Snapshot (§6A step 7)

The spider has no snapshot file and cannot have one — it reads bndy and follows what bndy knows, so there is no source page to diff. The fail-closed snapshot gate does not apply. State is carried instead in `spider-seen.json`, `spider-coverage.json` and `spider-state.json`, all three written this run.

## 15. Raised to CTO-INBOX

- `grumpys-postcode-disagrees-with-own-site` (DATA) — new.
- `spider-act-website-publishes-diary-as-image` (RULE) — new. Two of nine artist seeds publish their gig diary only as a JPEG or as images, so no text capture can reach it.

**Checked against existing fingerprints first and NOT re-raised:** `spider-chrome-unreachable-blocks-new-artists`, `spider-mode-not-declared`, `spider-rule4-ranks-website-below-socials`, `validator-genre-only-fb-evidence-mismatch`, `facebook-page-search-not-found`, and the whole `bv2a-chrome-unreachable-*` series.
