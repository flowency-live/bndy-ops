# SPIDER RUN REPORT — 2026-08-28

**Run id:** `spider-2026-08-28T01-04-35Z`
**Heartbeat:** `data\state\heartbeat\spider-2026-08-28T01-04-35Z.json`
**Runbook read:** v2.27. **Floor asserted:** §6A CURRENT FLOOR v2.19. **Prompt floor:** the prompt names no number; it defers to §6A. PASS.
**Claim:** `data\state\claims\spider.json` was `heldBy: null`, released 2026-08-27T13:50:00Z. Acquired clean. No takeover.
**Mode (§0.29):** the spec declares none. Defaulted to **append-only**. No deletion, no hide, no removed-row action. Fingerprint `spider-mode-not-declared` is already in CTO-INBOX, so no new line was raised.
**Districts worked:** CW1 (4 hops), CW2 (1 hop).
**Outcome:** completed.

---

## 1. Headline

**27 records written to bndy and read back. Target is 25 (§Caps, Jason 2026-08-08).**

| | count |
|---|---|
| events created | 18 |
| artists created | 8 |
| artists enriched (existing record) | 1 |
| venues created | 0 |
| deletions | 0 |
| 409 / 422 bounces | 0 |
| validator | 8 records, **0 FAIL, 0 WARN** |

**All 8 new artists were created with a VERIFIED page.** Zero stubs. Zero evidenced blanks. Zero staged rows.

## 2. The finding, stated plainly

**A venue Facebook page that links a ticketing site is worth more than its Events tab.**

The Arena Crewe `Ojeq5atXE2krvQIZVqqd` is a KLMA venue bndy has held since 2025-09-25. It held **zero future gigs**. Its Facebook Events tab shows nothing. Its `Links` row carries **skiddle.com**, and that Skiddle listing publishes **21 future rows**.

Six spider runs have now recorded "Facebook venue page publishes no upcoming events" (fingerprints `fb-venue-pages-publish-no-events`, `fb-venue-pages-no-upcoming-six-of-six`). Every one of those runs stopped at the Events tab. **The Links row was one line further down the same capture.** This run got 18 events from one hop by reading it.

Written into `spider-state.json` as a standing instruction.

## 3. Seeds picked and why

Seed rule 4 (venue we hold, has a website or socials, ZERO future gigs in bndy). The 2026-08-27 cursor named the CW2 queue and four remaining CW1 website seeds. Website ranked above social page, per CTO-INBOX `spider-rule4-ranks-website-below-socials`.

| seed | id | surface | result |
|---|---|---|---|
| The Sydney Arms | `050a5422-1d3e-4f74-8489-fb39eb4d860b` | website + FB | **DRY.** `/events/` is private hire only: weddings, birthdays, wakes, anniversaries, corporate, festive. FB page has **no Events tab** and its posts are CSS-scrambled (`fb-post-text-css-scrambled`). |
| The Captain Webb | `0JI8W2TuAmbU4VsJncpN` | website + FB | **DRY.** `captainwebbcrewe.co.uk` returns a browser error page. Website dead. |
| The Horse Shoe | `027fffff-98e6-4465-864c-146af40df212` | website | **DRY.** Robinsons pub page states "regular weekend entertainment" and publishes no listing. bndy holds no socials for it. |
| Rising Sun Vaults | `6wnnY9197q6yQ8YHrJnA` | website + FB | **DRY.** FB Events tab reads "No events to show". |
| **The Arena Crewe** | `Ojeq5atXE2krvQIZVqqd` | FB → **Skiddle** | **21 rows.** See §4. |

Four of five seeds dry is the honest picture of the Crewe venue-website axis. It matches the 2026-08-27 finding `venue-websites-stale-or-empty-crewe` exactly. **The CW1 rule-4 queue is now closed** and the four dry seeds are named in the cursor so no future run re-reads them before 2026-09-27.

## 4. Capture

`data\raw\spider\2026-08-28\arena-crewe-skiddle.txt`

Collected with Chrome `get_page_text` plus a direct `a[href]` read (§0.22). The `href` read is what produced the stable Skiddle numeric ids; a text scrape would have forced a synthetic externalId. `javascript_tool` output guard 1 (`=` blocked) fired on every href read and was worked around with the `(eq)` transform (§6B). Output guard 3 (~1.4 KB truncation) forced the row list to be paged in three calls.

**Not a partial capture.** 23 anchors returned, 23 accounted for: 21 Arena rows, 1 Swansea Arena row, 1 Crewe Alexandra row. Both out-of-scope rows are named in the capture file.

## 5. Events created — 18, all at `Ojeq5atXE2krvQIZVqqd`

| date | artist | event id | skiddle id |
|---|---|---|---|
| 2026-08-29 | PowerAge UK | `c1660284-3bae-4dd9-8ed7-c068558c90a2` | 42667026 |
| 2026-08-29 | Harry Holmes | `fc2a1d27-5b97-4b86-8d00-4f95ca3b5d1e` | 42667026 |
| 2026-08-30 | Tru80's | `94fa46f5-2f60-4dbb-8b6b-917c75e13be2` | 42666800 |
| 2026-09-05 | Son of Shinobi | `240328af-00ce-40c1-a217-88cf0d57767a` | 42428909 |
| 2026-09-05 | Mutha Humbucker | `ee1e0535-365f-4a64-9991-2cd6b0436bb4` | 42428909 |
| 2026-09-12 | Thunder Hammer | `f1340280-702c-4ac3-9b4d-d77795d298dc` | 42427138 |
| 2026-09-18 | Avian | `94786b11-10b1-4a25-928c-f9dd9b182dad` | 42650795 |
| 2026-09-18 | Scarlett Fever | `5b55b034-1430-41fa-abf8-42723694adf8` | 42650795 |
| 2026-09-18 | Son of Shinobi | `7f49d30f-7ba3-4811-bbbd-4f99ab653900` | 42650795 |
| 2026-10-02 | Voodoo Room | `666354af-ab3a-4c28-8826-656511f3a9b9` | 42410175 |
| 2026-10-03 | Enjoy The Silence UK | `2530db76-fcec-47c6-a239-55cc40748956` | 42328121 |
| 2026-10-23 | Fleetwood Shack | `7bebf37a-60e7-4010-807e-9e989ed21bff` | 42677632 |
| 2026-10-30 | Sucker Love | `1eed0b56-9f1a-47ff-9cdd-a18041c7a50c` | 42124641 |
| 2026-10-30 | KK Verkefni | `bf40bf39-3caf-412a-b36b-c151ea1ddb11` | 42124641 |
| 2026-11-06 | Kerrang'd | `6ec8984a-f458-4c40-9332-775d27a365ec` | 42353165 |
| 2026-11-14 | Electromantics | `1980374a-741f-41f7-a777-d93da0fea9c6` | 42637493 |
| 2026-12-05 | DURAN | `5cd04f6a-85b7-4676-983c-f65ddd305644` | 42128186 |
| 2026-12-31 | Dan Budd as Robbie Williams | `c3eac884-bb3b-43e8-8e9f-7b3c3a388059` | 42460488 |

Four multi-act bills were split into discrete per-artist events per §4: skiddle 42667026 (2 of 3 written), 42666800 (1 of 2), 42650795 (3 of 3), 42428909 (2 of 2), 42124641 (2 of 2). The sibling act names are recorded in each event's `ticketInformation` so a parent event can be attached retroactively when the container ships.

## 6. Artists created — 8, every one with a verified page

| artist | id | location | page | evidence for the page |
|---|---|---|---|---|
| Voodoo Room | `75549e2f-e429-47df-9fbe-5e9f256d19e9` | London (city) | `facebook.com/VoodooRoom` | Page states "From London, United Kingdom". Category Musician/band. Its own tagline "Purveyors of the finest in Hendrix, Clapton & Cream" matches the Skiddle billing word for word. 6.8K followers. |
| Kerrang'd | `45ff5e40-8b53-498c-ac4f-66c133c5f299` | UK wide (regional) | `facebook.com/kerrangd` | Exact name match. Category Musician/band. Bio names the Kerrang! tribute format the listing bills. 3.6K followers. |
| Son of Shinobi | `f7de2513-207e-4c75-89bc-7f0d0867c7c5` | Crewe (city) | `facebook.com/sonofshinobi` | Category Musician/band. Google corroborates "5-piece rock outfit from Crewe in Cheshire" (reverbnation, Crewe FB group). Gig is in Crewe. 3.6K followers. |
| Sucker Love | `66326135-b7b3-4fe1-8097-be951736b803` | UK wide (regional) | `facebook.com/ukplacebotribute` | Page name "Sucker Love - UK Placebo Tribute". Bio "The UK's only tribute to PLACEBO". A same-named Naples band exists and was **rejected under §0.15**. 690 followers. |
| DURAN | `cbc5faea-8ce7-4078-b4b0-41191bc68c45` | Birmingham (city) | `facebook.com/durantributeshow` | Page name "DURAN - UK Duran Duran Tribute Show", stated location Birmingham. 5.5K followers. |
| KK Verkefni | `7dddfc2d-e66e-4c1d-881c-4021cb51d451` | Wrexham (city) | `facebook.com/KKVerkefni` | Exact name match. Bio states WREXHAM outright. 478 followers. |
| Harry Holmes | `3e852899-bfa4-4d3c-bc92-b4477e45ba2a` | Stoke-on-Trent (city) | `facebook.com/harryholmesmusic` | Strongest evidence of the run: the page carries a **post about The Arena Crewe** naming Harry Holmes as support. Bio states Stoke-on-Trent. 1.3K followers. |
| Mutha Humbucker | `5ef26a1b-757e-4588-88c6-a54226511100` | Crewe (city) | `facebook.com/muthahumbucker` | Category Musician/band. Crewe Chronicle names them "one of Crewe's best-loved bands", four-piece rock covers. 1.5K followers. |

**Every bio is a character-for-character quotation** of the act's own page (§2A.1 item 8). Four contain emoji and were written with `create_artist` then `edit_artist`, per CTO-INBOX `create-artist-500-emoji`. That workaround held in all four cases.

⚠ **`muthahumbucker.com` was NOT stored.** The page links it, but the domain now redirects to a Dynadot "for sale" listing. A dead domain is not a website.

## 7. Existing artists reused — 7, no duplicate created

`Electromantics 881914c9` (100%) · `Thunder Hammer f858859b` (100%) · `Fleetwood Shack c28e6d5c` (100%) · `Enjoy The Silence UK 0b49bbc6` (85%) · `PowerAge UK 606097ac` (73%, case-only difference from the billing) · `Tru80's 878136dc` (71%, punctuation-only, North West footprint covers Crewe) · `Scarlett Fever 88b5ddff` (100%, Staffordshire, adjacent) · `Avian ed8461c8` (100%, Cheshire).

**`Dan Budd as Robbie Williams 717b6832-659a-4109-bc71-912466636015` — matched by FACEBOOK, not by name.** Skiddle bills "Dann Budd". A `create_artist` for "Dan Budd" carrying `facebookUrl: facebook.com/dbasrw` returned `action: matched, matchedBy: facebook, confidence 1` against an existing gigs-news record whose name is the full page name. **This is §1A.2 Step 0 working exactly as designed** — the FB key caught a record that neither spelling would have found. The record was topped up with `nameVariants: ["Dann Budd", "Dan Budd"]` so no future run asks again (§1A.5). That edit is the run's one enrichment record.

## 8. Rejected, skipped and unworked — named, never silently dropped

**REJECTED-dj-club-night**
- skiddle 42094061 `Trance Addicts 4`, 2026-10-31, 16:00-02:00. A trance club night. §6 accept/reject rejects DJ sets. Marked in the cursor so it is not re-offered.

**REJECTED-out-of-scope-venue**
- skiddle 42585530 `BINGO LINGO XL` — Swansea Arena, a different venue.
- skiddle 42585176 `Cheshire Guitar Show` — Crewe Alexandra, a trade show, not a gig.

**SKIPPED-no-named-act (§0.5 forbids inventing one)**
- skiddle 41978670 `Prodigy And Pendulum Tributes Live At The Arena`, 2026-10-17. Two tribute formats, no act named.
- skiddle 42669944 `U2 vs Simple minds with Achtung baby frontman`, 2026-10-24. Same shape.
- skiddle 42569015 `Crewe Rocks`, 29-30 Aug. Festival row with no lineup on the listing. The venue is a fixed building with a valid place_id, so §0.27 admits it — the block is the missing act, not the word "festival". The per-event page may carry the lineup; next run.
- skiddle 42123945 `Prog All-Dayer 2`, 2026-09-19. Same.

**SKIPPED-identity-unresolved**
- skiddle 42461138 `Flashback`, 2026-08-28, 20:00-02:00. The 6-hour window and the name both read as plausibly a club night rather than an act. Not established either way.
- skiddle 42630481 `Clubland Anthems - Rachel Shenton & Pitbull UK`, 2026-11-20. Two PA acts, neither researched.
- skiddle 42666800 `That 80s Show`, 2026-08-30. Google returns no UK act of that exact name. bndy's nearest is `That 80s Band` (Darlington, 69%) — a **different name in a different canonical region**, so not a collision under §1A.7, but not a match either. Left unwritten rather than guessed; Tru80's on the same bill IS written.
- skiddle 42573107 `Forever Tina - Tina Turner Tribute`, 2026-09-25. The only well-evidenced "Forever Tina" is Suzette Dorsey's show out of Voorhees, New Jersey. **§0.15 and §2A.1 item 1 forbid attaching a non-UK act's page**, and blank-plus-guessed-location is worse than nothing here. Retry with a different query.

**BLOCKED-same-name (raised to CTO-INBOX)**
- `Failed To Ignite` on skiddle 42667026, 2026-08-29. bndy holds `fb690543-646e-426d-bd2e-4c0bbb514b56`, and the page `facebook.com/failedtoigniteofficial` reads **"Newcastle Alternative/Emo est. 2022"** with no county. bndy's record says Newcastle upon Tyne. §6C names "Newcastle" as ambiguous: Newcastle-under-Lyme is 20 miles from Crewe, Newcastle upon Tyne is 170. Reusing the record would assert a fact I cannot evidence; creating a second would risk a duplicate. §1A.2 case 5 says neither. Skipped, one line raised.

## 9. Provenance — a deliberate deviation, stated

The spec fixes the event externalId as `{source:"spider", id:"<seed-type>-<seedId>-<YYYY-MM-DD>"}`. **That form produces ONE id for all 18 events from this hop.** It is not an idempotency key and a second run would not match on it.

Written instead: `{source:"spider", id:"venue-Ojeq5atXE2krvQIZVqqd-skiddle-<skiddleId>"}`, with an act-slug suffix where one Skiddle id carries several acts. This keeps the spec's `<seed-type>-<seedId>` prefix, so the hop is still recorded, and swaps the run date for the source's own stable numeric id — the same reasoning §6D-bis applies to Facebook event ids and §6D applies to lemonrock gig ids. The date suffix was mandatory there for exactly the mirror reason it fails here.

Raised as a RULE item.

## 10. Times

Every row was given `startTime` and `endTime` from the Skiddle window, with the uncertainty stated in `ticketInformation` per §0.28's window rule — for example `Skiddle lists 19:30-23:45; stage time not published.` No §5.6 default was used and no time was invented. Skiddle publishes an event window, not a stage time, and this run does not present the window as though it were the set.

The venue is ticketed through Skiddle. Every event carries `ticketed: true` and the per-event Skiddle URL. Per Decision 03 a grassroots room that sells tickets is imported and marked, never ignore-listed.

## 11. Admission test

The Arena Crewe, 39 High Street, Crewe CW2 7BL, describes itself as "A new venue in the centre of Crewe bringing you the best facilities for Pool, Darts and Live Music". A small independent town-centre room, already held by bndy from KLMA. **ADMIT.** No venue was created this run, so no §0.23 or §0.24 test was engaged.

## 12. Validator

```
8 records · 8 clean · 0 FAIL · 0 WARN   [mode=gate]
```

Records: `data\state\spider-validator-records-2026-08-28.json`
Evidence: `data\state\enrichment-evidence-2026-08-28-spider.jsonl` (8 lines, appended, never rewritten)

⚠ **Ordering caveat, already on file.** §6A step 8 requires the evidence line before the bndy write, and keys it on `artistId` — which a create-path run does not have until after the write. The lines were appended immediately after each create, carrying the true capture time. Fingerprint `evidence-file-cannot-precede-a-create` is already in CTO-INBOX; no new line raised.

## 13. Judgement calls, so they can be overturned

1. **`Kerrang'd` and `Sucker Love` given `location: "UK wide"`, `locationType: "regional"`.** Neither page states a town. Both state national scope in their own words. The §0.7 gig-town fallback would have asserted they are Crewe acts, which is a wrong fact rather than a missing one. Paired with `locationType: regional` per the §6B Kilmarnock rule.
2. **`Son of Shinobi` named from the page, not the billing.** Skiddle bills "Son Of Shinobi"; the page reads "Son of Shinobi". The act's page is the naming authority (§0.20). Billing kept as a `nameVariant`.
3. **`DURAN` and `Sucker Love` stripped of descriptor tails** ("- UK Duran Duran Tribute Show", "- UK Placebo Tribute") per §0.6, with the full page name kept as a `nameVariant`. `Dan Budd as Robbie Williams` was **not** stripped, because that is the existing record's name and §2A.5 item 6 protects it.
4. **`Mutha Humbucker` and `Son of Shinobi` located to Crewe from Google, not from their own pages.** Neither page states a town. Both are corroborated by the Crewe Chronicle and by the gig itself. Stated here because §2A.1 item 3b requires a location taken from a search result to name where it came from.
5. **`Thunder Hammer` reused at 100% despite a Stoke-on-Trent location** for a Crewe gig. Adjacent towns, one canonical region, §1A.2 case 3.

## 14. Snapshot

`data\state\spider-last-page.txt` — 21 rows appended under seed `Ojeq5atXE2krvQIZVqqd`, header updated. Format and normalisation unchanged from 2026-08-27.

The file is a **union of every seed listing this source has ever read**, not a single feed, so an absent row is evidence only that a seed was not read today. **No §5.7 removed-row handling ran and no §5.7(a) self-diff gate applies**, because append-only mode actions no removals (§0.29).

## 15. Coverage and cursor

`spider-coverage.json` — CW1 raised to 9 hops / 0 venues and **closed on the venue axis**. CW2 opened: 1 hop, 0 venues found, 8 artists found.

⚠ **CW2 reads `saturation: 0.0` after the highest-yield hop this source has made.** Saturation counts new *venues* per 100 hops. This hop found no new venue because the venue was already in bndy — it found 18 gigs the venue had never published anywhere bndy was looking. **The metric is measuring discovery and this run was doing baseline fill (seed rule 4), which the spec itself ranks higher.** A reader taking 0.0 as "CW2 is worked out" would be wrong. Raised as a RULE item.

`spider-state.json` — stays in CW2. The 8 unworked Arena rows are named individually, the four dry CW1 seeds are named so they are not re-read, and the Skiddle lesson is written in.

## 16. Caps

18 events + 8 artists = **26 creates against the 30 cap**. Stopped there with rows still on the table rather than pushing into the cap. Every remaining row is one of the ambiguous cases in §8, which are better served by a fresh run than by a rushed decision at the ceiling. 5 seeds against the 20-seed cap. Claim TTL 60 minutes, used roughly 20.
