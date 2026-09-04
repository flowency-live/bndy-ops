# SPIDER RUN REPORT — 2026-08-21 (second firing)

**Run id:** `spider-2026-08-21T01-09-30Z`
**Outcome:** COMPLETED
**Runbook read:** v2.27. The floor in §6A is v2.19. The task prompt states no number of its own. PASS.
**Claim:** `data/state/claims/spider.json` read `heldBy: null`, released by `spider-2026-08-21T00-54-40Z`. Acquired clean. No takeover.
**Mode (§0.29):** the spec declares no mode. This run used **append-only**. It deleted nothing. The gap is already in CTO-INBOX as `spider-mode-not-declared` and is not raised again.
**Validator:** `6 records · 4 clean · 0 FAIL · 2 WARN`.
**Report path:** `RUN-REPORT-2.md`, not `RUN-REPORT.md`. The first firing owns that file. See the standing item `run-report-path-collides-on-second-firing`.

---

## 1. Headline

**14 records written and read back: 6 artists, 6 events, 2 event time corrections.** The target is 25.

This firing had a plain job on arrival. The 00:54Z run left six dated, admissible ST6 gigs unwritten because it ran out of time for the two-surface identity search. **Four of those six are now in bndy.** The other two are blocked on rulings, not on effort.

The run then cleared the ST6 rule-4 queue, tested four never-read ST5 seeds, and followed one artist hop into **CW1, a district no spider run has ever touched**. CW1 immediately returned four gigs bndy did not hold.

## 2. Seeds

| Seed | id | Rule | Surface | Result |
|---|---|---|---|---|
| The Old Post Office, Burslem | `ocqMyrVLWZkxk5zEjJ2w` | 2 | `facebook.com/Oldpostofficeburslem/events` | no Upcoming section, past only |
| Kings Head (Scrimmies), Smallthorne | `bY73hTwRGQTg73wLqHOm` | 4 | `facebook.com/scrimmies/events` | no Upcoming section, past only (2023) |
| Yates, Newcastle-under-Lyme | `ad855fbb-f9e6-4ba6-8157-d912a59cb01e` | 4 | `facebook.com/YatesNewcastleUnderLyme/events` | 1 upcoming, no named act |
| The Thistleberry Hotel | `28bf005f-4367-45b8-857d-197cafcdd4f5` | 4 | `facebook.com/ThistleberryST5/` | **dead page** |
| Cappello Lounge | `49b346cb-d42f-4a10-8fd6-22533c18f2df` | 4 | `facebook.com/CappelloLounge/events` | past only, third-party craft workshops |
| Hogarths | `992db288-e78e-4551-84fa-3a909f51a993` | 4 | `facebook.com/HogarthsNewcastleUnderLyme/events` | past only (2022-23) |
| Crosshair | `5M2OlxTbMCg7LdmCqLDx` | 1 | `facebook.com/crosshaircoverband/events` | 8 rows, all already in bndy |
| Circa 81 | `lZ9xMciTyr8Fkz2G0Ovj` | 1 | `profile.php?id=100077695054558&sk=events` | past only |
| Cosey Club, Haslington | `LHrDNnXeCU1eirDOxUKc` | 2 | `thecosey.co.uk/shows` | **4 gigs bndy did not hold** |

Nine hops. Districts ST6, ST5 and CW1.

## 3. The six gigs carried over from the first firing

| Row | Date | Venue | This firing |
|---|---|---|---|
| Scott Anson | 2026-09-19 | Chell Social Club | **WRITTEN** |
| After The Storm | 2026-09-26 | Chell Social Club | **WRITTEN** |
| Phil Boyd | 2026-09-25 | The Top Pub - Brown Edge | **WRITTEN** |
| Before The Bitter End | 2026-10-30 | The Top Pub - Brown Edge | **WRITTEN** |
| Charlotte | 2026-09-04 | Chell Social Club | **SKIPPED — see §7** |
| Hannah Bee | 2026-12-31 | The Top Pub - Brown Edge | still blocked, `hannah-bee-two-staffordshire-pages` |

## 4. Artists created

Six. **Two with a verified page, four as evidenced blanks.** No stub. Every one carries either a visited page or both search surfaces recorded in `data/state/enrichment-evidence-2026-08-21-spider.jsonl`.

| Artist | id | Page | Evidence |
|---|---|---|---|
| Scott Anson | `4866833b-9380-4d6c-b954-3352cf3cacb2` | blank | FB page search `Scott Anson vocalist` returns no page of that name at all. Google `"Scott Anson" singer` and `"Scott Anson" vocalist facebook` return a Sheffield West End actor and an agency listing, `dukeries.com/male-vocalist-scott-anson.php`. `facebook.com/p/Scott-Anson-100042242845870` is a personal profile, which §2A.1 item 4 forbids. |
| After The Storm | `d4b9e189-bee9-4376-9ee6-54d8bd964dc0` | blank | FB page search `After The Storm duo` and Google twice. The one UK music page is `facebook.com/afterthestorm15`, *"Plymouth's premier cover band"* — a disjoint footprint, so it fails §2A.1. |
| Phil Boyd | `0e8a717e-b400-4e85-ba37-6a8d2ade4867` | blank | FB page search `Phil Boyd music` returns no page. Google returns personal profiles only, plus a US indie-folk Phil Boyd on Apple Music and a different Phill Boyd on gigheaven. |
| Before The Bitter End | `46d4d7c3-1e6e-40f3-941d-e97eb71ed913` | blank | FB page search and Google twice. No page carries this name. The near hits are Bitter End (US hardcore), The Bitter End (a New York venue) and BEFORE THE END (a French metal band). |
| Bobcat Billy's Moonshine Mission | `bcac40bb-efde-4044-a92b-7c4ef4f121ec` | `facebook.com/BobcatBillysMoonshineMission` | **Page VISITED.** Exact name, *"First Class Rockabilly Rock n Roll band... 5 of the finest musicians in the North West"*, Details state **Chester, United Kingdom**. Google corroborates independently: `crewe.nub.news` lists this very gig at The Cosey. |
| Marblehead | `fc51845f-2c21-43ef-8fbc-a6eed35c647e` | `facebook.com/marbleheadjohnsonbritpop` | **Page VISITED.** Own intro reads *"Marblehead - The Original Britpop Experience / The UK's Original Britpop Tribute - Est 2010"*. Google corroborates with `marbleheadjohnson.co.uk` and UK agency listings. |

**Names.** The Cosey bills `MARBLEHEAD BRITPOP`. The act's own page intro reads `Marblehead`, so §0.6 makes `Britpop` a descriptor and the record is **Marblehead**. `Bobcat Billy's` keeps its apostrophe: it is a possessive in the act's own page name, not promo punctuation, so §0.20 does not strip it.

**Bios are EMPTY on both verified records, deliberately.** Both Facebook pages return CSS-scrambled text (`fb-post-text-css-scrambled`). §2A.1 item 8 permits a quotation or nothing. The validator WARNs `STUB_NO_BIO` twice; that is the correct outcome.

**actType left EMPTY on Before The Bitter End.** Nothing in the evidence says covers or originals, and the name reads like an originals band. §0.18 outranks the §2A.2 default: unknown beats a guess.

⚠ **`artistType` is a REQUIRED field and it forced one inference.** Chell's own listing supplies the format for its acts (`MALE SINGER`, `VOCAL DUO`). The Top Pub supplies none, so `Before The Bitter End` was written `band` on the plural-sounding name alone. §2A.1 item 8 says artistType is copied from evidence or left empty — the schema does not allow empty. Flagged, not hidden.

## 5. Events created

Six. All read back.

| Event | id | Date | Time | externalId |
|---|---|---|---|---|
| Scott Anson @ Chell Social Club | `831813ad-770a-431c-95a3-654b5dbf6e32` | 2026-09-19 | 20:15 | `spider` / `venue-8e1c012b-2026-09-19` |
| After The Storm @ Chell Social Club | `5e783ce8-e648-4fe8-89a8-8c87541457c0` | 2026-09-26 | 20:15 | `spider` / `venue-8e1c012b-2026-09-26` |
| Phil Boyd @ The Top Pub - Brown Edge | `95113a1a-9fe6-435f-a0bb-0e9f4b1b82f5` | 2026-09-25 | 20:00 | `spider` / `venue-20eced38-2026-09-25` |
| Before The Bitter End @ The Top Pub - Brown Edge | `77f47923-cddc-4838-8bfe-90df82ddbe41` | 2026-10-30 | 20:00 | `spider` / `venue-20eced38-2026-10-30` |
| Marblehead @ Cosey Club | `ac828011-2c56-40bb-94c0-23b195bf0286` | 2026-10-02 | 21:00 | `spider` / `venue-LHrDNnXeCU1eirDOxUKc-2026-10-02` |
| Bobcat Billy's Moonshine Mission @ Cosey Club | `866f2dea-531a-4041-a3c0-f33879442bbe` | 2026-10-10 | 21:00 | `spider` / `venue-LHrDNnXeCU1eirDOxUKc-2026-10-10` |

`data/state/cancellations.jsonl` was read before the first create. Six lines. No match on artist + venue + date.

**0 gate bounces. 0 409s. 0 422s.**

**Times (§0.28).** The two Chell rows take the venue's own published set times, `First half 20:15-21:00, second half 22:30-23:15`, with `endTime` **23:15** from the second set — better than the `00:00` the backend writes when no `endTime` is sent. The two Top Pub rows take 20:00, stated by `thetoppub.co.uk/live-music-at-the-top-pub`. The two Cosey rows take the §5.6 Fri/Sat default, stated in `ticketInformation` as a default; the Cosey listing page publishes no time, and 21:00 is what every other Cosey row in bndy already holds.

⚠ The backend wrote `endTime: "00:00"` on the four events that sent none. Standing, already logged as `create-event-writes-endtime-midnight`.

## 6. Events EDITED — the act's own page corrected the aggregator

Crosshair's own Facebook events page disagrees with the KLMA sheet on two start times. §2A.3 says a band page carries gig corrections and they are applied; §5.6b makes the act's own page the winner.

| Event | id | Was | Now | Evidence |
|---|---|---|---|---|
| Crosshair @ Swiftys 2026-09-19 | `fd303c4b-daef-44af-a43c-518b1c623410` | 21:00 | **20:00** | `facebook.com/crosshaircoverband/events` — *"Sat, 19 Sep at 20:00 · Crosshair Live @ Swiftys"* |
| Crosshair @ Swiftys 2026-11-14 | `ef5add18-046c-48d9-add7-97415fd6bb0b` | 21:00 | **20:00** | same page — *"Sat, 14 Nov at 20:00 · Crosshair Live @ Swiftys"* |

The other six Crosshair rows agree with bndy to the minute and were left alone.

## 7. Rows NOT written, and why

| Row | Date | Venue | Why not |
|---|---|---|---|
| Charlotte | 2026-09-04 | Chell Social Club | **SKIPPED (§0A rule 1b).** bndy already holds an artist named `Charlotte`, `1b13c7cd-da1a-4c2e-adae-a6a96acc9634`, location "Greater Manchester UK", with **zero events**. That is §1A.2 case 5 exactly: with no event history there is no footprint to compare, and Manchester to Stoke is a normal distance for a club vocalist. Both surfaces were searched and no page ties any `Charlotte` to Staffordshire, so enrichment cannot break the tie either. Raised as a DECISION. |
| Xclusive | 2026-10-03 | Cosey Club | Ran out of budget. **Both surfaces are already searched and the evidenced blank is on disk** — the next run writes it with no further searching. |
| The Crisis | 2026-10-09 | Cosey Club | Ran out of budget. No enrichment search yet; §2A.5 forbids the create until one is done. |
| Jazz N Blues Festival 2026 | 2026-08-29/30 | Yates, Newcastle-under-Lyme | **No named act.** §0.27 admits a festival at a fixed venue, and Yates is one — but the event UID is (venue, artist, date) and the listing bills no artist. §0.5 forbids inventing one. Its window, 29 Aug 10:00 to 30 Aug 21:00, is also a §0.28 window, not a set time. The organiser page `Newcastle Jazz & Blues` is a lead worth a hop when a lineup is published. |
| Hannah Bee | 2026-12-31 | The Top Pub | Standing, `hannah-bee-two-staffordshire-pages`. |
| The Amazeballs DD King | 2026-11-27 | The Top Pub | Standing, `amazeballs-dd-king-billing-unresolved`. |

## 8. Rejected rows (admission test)

| Row | Reason |
|---|---|
| QUIZ NIGHT 8.30pm, Cosey Club | `REJECTED-not-a-performance` |
| Paint & Sip / Slimy and Crafty / Halloween Family Fun, Cappello Lounge | `REJECTED-not-a-performance` and past-dated |
| Every Scrimmies, Hogarths, Old Post Office and Cappello row | `REJECTED-past-dated` (§0.14) |

No venue was rejected. All nine seeds are fixed buildings already holding a Google Place ID.

COZYZONE BIKE SOCIAL EVENT on 2026-08-30 was **not** rejected — bndy already holds it as a Cozyzone event, so it needed no decision from this run.

## 9. Partial captures, named (§Report)

1. **`facebook.com/crosshaircoverband/events` — 8 rows.** That is the known ~8-row MCP-tab stall (§6B). The list may run further than 2026-11-28. Reported as partial, never as the full diary.
2. **`thecosey.co.uk/shows` — first page only.** A `Load More` control was not pressed. Everything after 2026-10-10 is uncaptured.

## 10. Discovery saturation

**0 new venues per 100 hops. 9 hops: 6 in ST6/ST5, 1 CW1, 2 artist hops.**

- **ST6 — 12 cumulative hops, 0 venues, 10 artists. The rule-4 queue is now CLEAR.** Both remaining Facebook-only seeds were read and both publish no upcoming events. This district is worked out on the venue axis and yields acts only.
- **ST5 — four never-read seeds, zero gigs.** All eight ST5 venues are Facebook-only, and a Facebook venue page is demonstrably not a gig surface for these pubs: three carry past events only and one is dead.
- **CW1 — first touch ever, and it paid.** One venue, one website, four gigs bndy did not hold. This is the pattern the spec predicts and the reason the cursor now moves there.

⚠ **The finding worth carrying:** across six venue Facebook pages this run, **not one published a future event**. Across one venue *website*, four future gigs appeared that no aggregator had. `spider-rule4-ranks-website-below-socials` asked the spec to rank a website first. This run is the measurement behind that request.

## 11. State written

- `data/raw/spider/2026-08-21/thecosey-shows-run2.txt` and `crosshair-facebook-events-run2.txt` — this firing's captures.
- `data/state/spider-last-page.txt` — 41 rows, header now states plainly that this file is a UNION of seeds read and never a delete source.
- `data/state/spider-coverage.json` — ST6 and ST5 updated, **CW1 added**.
- `data/state/spider-seen.json` — nine seeds stamped `2026-08-21`.
- `data/state/spider-state.json` — cursor moves to **CW1**, naming both unwritten Cosey rows.
- `data/state/enrichment-evidence-2026-08-21-spider.jsonl` — 11 lines appended by this run.
- `data/state/build_validator_input_spider_run0109.py` — validator input, schema reshape only.
- `data/state/run-summary.jsonl` — one line appended.

## 12. Honest faults in this run

1. **The evidence file was again written by name first and keyed by `artistId` after the create.** Same structural gap as the first firing, already raised as `evidence-file-cannot-precede-a-create`. The searches themselves were all recorded before any write.
2. **The run overran its 60-minute TTL** by a few minutes, finishing the read-backs, the validator and this report rather than stopping with unverified records on disk. Two admissible Cosey rows were dropped rather than rushed.
3. **`locationType` still cannot be verified on read-back.** `get_by_id` does not return the field. `regional` was sent with `Staffordshire` and `UK wide` per the §6B Kilmarnock trap; the read-back cannot confirm it. Second consecutive firing to report this.
4. **The first firing's note claimed four Facebook searches were "already recorded" in the evidence file. They were not** — the file held twelve lines and none of them named Scott Anson, After The Storm, Phil Boyd or Before The Bitter End. This run re-ran both surfaces for all four rather than trusting the claim. A cursor note is not evidence; only the evidence file is.

## 13. Corrections made to the first firing's own work

**Two evidenced blanks were re-searched under §2A.1 item 3c and both stand.** The 00:54Z run recorded `Darren Michaels` and `Sammi Jane` blank on queries carrying an unverified location (`Stoke-on-Trent`, `Staffordshire`) and flagged the fault itself. Both were re-run on the bare name across both surfaces this firing. Neither has a findable page. The blanks are now evidenced properly, and the two new lines are in the evidence file keyed by `artistId`.

## 14. Against the 25-record target (§Caps)

**14 records written, against a target of 25.** Short, and the shortfall has two named causes, neither of them padding-worthy:

- **Six venue Facebook pages returned zero future gigs between them.** That is saturation, honestly measured, and it is the most useful thing this run learned.
- **The identity check is the binding cost, exactly as the first firing found.** Six new acts at two search surfaces each consumed most of the hour. Two more admissible gigs were left in the capture with nothing wrong with them, and one of those two needs no further searching at all.

The district was not rich in venues. It was rich in *one venue's website*, and that is where the next run should start.
