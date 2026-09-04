# SPIDER RUN REPORT — 2026-08-18

**Run id:** `spider-2026-08-18T01-05-06Z`
**Runbook read:** v2.27. Floor asserted at §6A step 2a: CURRENT FLOOR v2.19. Prompt floor: none stated. PASS.
**Claim:** `data\state\claims\spider.json` was released (`heldBy: null`). Acquired at 01:05:06Z, TTL 60 minutes. No takeover.
**Outcome:** PARTIAL. 1 event created. Chrome was unreachable for the whole run.

---

## 1. Headline

| measure | value |
|---|---|
| Events created | 1 |
| Artists created | 0 |
| Venues created | 0 |
| Records written and read back (§0.10) | 1 |
| Target (§Caps) | 25 |
| Hops attempted | 7 |
| New venues found per 100 hops | 0.0 |
| 409s | 0 |
| Deletions | 0 |
| Tombstone checks | 1 (`cancellations.jsonl`, no match) |

**The run missed its target. The cause is a tool outage, not saturation.** See section 2.

## 2. BLOCKER — Claude in Chrome was unreachable

`tabs_context_mcp` returned "not connected" on two attempts. This is the fourth consecutive
firing across two tasks: enrichment firings at 2026-08-17 22:17Z, 2026-08-17 23:17Z and
2026-08-18 00:20Z, and now this spider run.

**Two consequences for this source, and they are severe.**

1. **No new artist could be created.** RUNBOOK §2A.1 item 5 is explicit: if Chrome is
   unavailable mid-run, a new-artist row is not created bare. Every gig this run found at a
   venue whose act bndy does not hold was therefore unwritable.
2. **Facebook is the only surface most seeds carry.** All 8 ST5 venues hold a Facebook URL
   and no website (section 4). Seed rule 4 could not run at all.

The run continued on the surfaces that need no Chrome: venue websites and artist websites,
read with `web_fetch`.

## 3. Seeds picked, and why

The cursor (`spider-state.json`) named **ST5** as `nextDistrict`, with Yates
`ad855fbb-f9e6-4ba6-8157-d912a59cb01e` and Cappello Lounge `49b346cb-d42f-4a10-8fd6-22533c18f2df`
named as unworked rule-4 seeds. **Both hold a Facebook page and no website.** With Chrome down
they were unreadable, so the run fell back to seed rule 1/3 — artists that carry their own
website — because an artist website is plain HTML and needs no Chrome.

Artist seeds were drawn from `list_artists(region: "Stoke-on-Trent")`: 163 records, of which
**32 carry a `websiteUrl`**.

| # | seed | type | rule | surface | result |
|---|---|---|---|---|---|
| 1 | Ball Green Working Mens Club `fRn4ZOmg3MGQsOk4b4Sv` | venue | 4 | `ballgreen.club` | read OK — no live music |
| 2 | The Furlong `d186e8da-662f-401f-9b0f-cbae9b63401c` | venue | 4 | `the-furlong.com` | read OK — no live music |
| 3 | Catchems Corner `75GKS94FpNZgPtMaahVW` | venue | 4 | `catchemscornermeir.co.uk/whats-on` | PARTIAL — month tabs render client-side |
| 4 | Boughey Arms `Zy1REmHjHDtnzThK0Mgs` | venue | 4 | `bougheyarms.com/event-list` | read OK — list is stale (section 5) |
| 5 | Rose & Crown `Xf3ZDp96kAQpxi8YFCCv` | venue | 4 | `roseandcrownstanley.com` | PARTIAL — site builder, empty to `web_fetch` |
| 6 | Stereotonics `9edc1e4a-513b-4357-9812-ef26ce471e0d` | artist | 1 | `stereotonics.co.uk/tour` | read OK — "No events at the moment" |
| 7 | Antarctic Monkeys `47bfee8d-22f2-48dd-a7e8-119ccb6a69e4` | artist | 1 | `antarcticmonkeys.com/gigs` | read OK — 33 dates, **1 admitted** |

Under The Influence `a643f428-9c09-4ab7-88a0-f616880a34c0` was opened and abandoned before it
counted as a hop — its stored website is a different band (section 6).

## 4. ST5 is unworkable without Chrome

`list_venues(city: "Newcastle-under-Lyme")` returns 8 venues. **All 8 hold a Facebook URL and
an empty `website` field:** Yates, Wolstanton Golf Club, The Thistleberry Hotel, Castle Mona,
Cappello Lounge, The Albert, Hogarths, Mitchell's.

This is direct evidence for the open item `spider-rule4-ranks-website-below-socials`
(CTO-INBOX 2026-08-15). In this district there is no website to prefer. Ranking will not fix
ST5; only a working Chrome, or a different capture route for a pub's Facebook page, will.
No new inbox item raised — the existing one covers it.

## 5. Boughey Arms — the venue site is a year out of date

`bougheyarms.com/event-list` renders 18 rows under the heading "Upcoming Events". Every row is
**2025-dated**, proved by weekday alignment: the page prints "Sat 08 Nov", "Sat 29 Nov",
"Fri 05 Dec" and "Sat 24 Jan". In 2026 those dates are Sunday, Sunday, Saturday and Sunday.
In 2025 they are Saturday, Saturday, Friday, and 24 Jan 2026 is a Saturday. The list runs from
08 Nov 2025 to 24 Jan 2026 and has not been touched since.

**Nothing was imported.** §0.14 forbids a past-dated gig. The named acts on that stale list —
Hairy Bartenders, Richie Stixx Music, Roxy, Definately Might Be, Tony Gold, Luking for Lucy,
Adam Finney, Darla Jade, Mel & Dan, Jason Keady — are recorded here only as a discovery lead
(§5.5: use the past, do not import it). The pub is a live grassroots room at ST7 8DH and is
worth a Facebook hop once Chrome returns.

## 6. DATA defect — a Stoke artist carries a Texas band's website

Artist **Under The Influence** `a643f428-9c09-4ab7-88a0-f616880a34c0`, location
"Stoke-on-Trent", carries `websiteUrl: http://www.undertheinfluenceband.com/`. That page is a
ReverbNation profile whose own metadata reads **"Rock | Seymour, TX"**. It is a United States
band. §0.15 and §2A.1 item 1 both forbid attaching a non-UK act's surface to a UK act.

Raised to CTO-INBOX as `under-the-influence-us-website`. **Not corrected by this run** — there
is no tool to null a field safely here without evidence of what the correct value is, and
§0A(a) says leave the uncertain field alone rather than guess.

## 7. Admission test — Antarctic Monkeys, 33 published dates

The act is a national touring tribute. §Caps forbids following a hop out of region, so most of
its diary is out of scope by design, not by fault.

**ADMITTED (1)**

| date | venue | reason |
|---|---|---|
| 2026-08-28 | The Station, Cannock WS11 4AS | small independent room, fixed building, in region, already in bndy |

**REJECTED — not a fixed building (§0.23)**

`REJECTED-non-fixed-venue`: Fake Festival Derby 2026-08-22 · Fake Festival Leicester 2026-08-29 ·
Keel Square Family Festival Sunderland 2026-08-31 · Big Fake Festival Walesby 2026-09-04 ·
Meadow Fest Oxford 2027-05-28 · Bromsgrove Tribute Festival 2027-05-29 · Fake Festival TBC 2027-05-29.

**REJECTED — large or arena-class ticketed room (§5A)**

`REJECTED-not-grassroots`: O2 Academy Leicester 2026-09-05 · The Buttermarket Shrewsbury 2026-09-11 ·
O2 Academy Oxford 2026-09-12 · The Waterfront Norwich 2026-09-18 · O2 Academy Bristol 2026-09-26 ·
O2 Academy Birmingham 2026-10-03 · The Foundry Sheffield 2026-10-09 · O2 Academy Islington 2026-11-14 ·
O2 Academy Liverpool 2026-11-28 · The Welly Hull 2026-12-04 · O2 Academy Glasgow 2027-01-08 ·
O2 City Hall Newcastle 2027-01-09 · O2 Academy Leeds 2027-01-30 · O2 Academy Bournemouth 2027-02-06 ·
The Picturedrome Holmfirth 2027-03-20.

**REJECTED — outside the coast-to-coast strip (§Caps)**

`REJECTED-out-of-region`: Quarters Brighton 2026-09-19 · Casino Rooms Rochester 2026-10-02 ·
Old Fire Station Carlisle 2026-10-23 and 2026-10-24 · The Apex Bury St Edmunds 2026-10-31 ·
The Drill Lincoln 2026-11-21 · KuBar Stockton-on-Tees 2026-12-05 · The Nest Nottingham 2026-12-11 ·
The Brook Southampton 2027-02-05 · The Queens Market Rhyl 2027-03-06 · Electric Daisy Derby 2027-03-28.

**REJECTED — beyond the 12-month horizon (§5.5)**

`REJECTED-horizon`: The Old Woollen, Farsley Leeds, 2027-10-16.

**ALREADY HELD**

Eleven, Stoke-on-Trent, 2026-11-06 — bndy event `51c15be2-16a4-4084-a43a-5ae64767ac00`,
externalId `cowork-discovery`. Not touched.

⚠ **Two admission calls are close to the line and are recorded so they can be overruled.**
Thornbridge Brewery, Bakewell 2026-09-25 is an independent brewery taproom inside the strip and
would probably admit; it was **not written**, because the run reached its time ceiling before
the venue could be resolved and verified. The Foundry Sheffield was rejected as a large ticketed
student union room; a reader who disagrees should say so and it imports next run.

## 8. Writes, verified

| id | what | verified |
|---|---|---|
| `f827cc36-e968-4f32-bd78-0057ee5cea6d` | Event — Antarctic Monkeys @ The Station, 2026-08-28, 21:00 | `get_by_id` OK |

- artistId `47bfee8d-22f2-48dd-a7e8-119ccb6a69e4` (existing, matched — no create, no enrichment)
- venueId `22044021-9985-4ab3-a1dd-7193a815f121` (existing, `search_venue` 100% high_confidence)
- externalId `{source: "spider", id: "artist-47bfee8d-22f2-48dd-a7e8-119ccb6a69e4-2026-08-28"}`
- `isPublic: true`, `ticketed: true`, ticket URL from the act's own page
- **DEFAULTED TIME.** The source publishes no stage time. The server applied §5.6 (Friday →
  21:00) and returned `startTimeDefaulted: true`. Correctable.

**Tombstone check (§5.4):** `data\state\cancellations.jsonl` holds 1 real record (PULS @ Arden
Arms 2026-08-08). No match on Antarctic Monkeys + The Station + 2026-08-28. The create was allowed.

## 9. Quality measures (§6)

- Records created **with a verified page**: 0 — no artist was created.
- Records created with an **evidenced blank**: 0 — no artist was created.
- Records **skipped**: every gig at a venue or act bndy does not hold. Cause: Chrome down,
  §2A.1 item 5. They are not lost; the next run retries them.
- Names **sanitised or skipped as non-acts** under §0.6: 0 acts resolved this run.

**No stub was created. That is the one thing this run got unambiguously right under the outage.**

## 10. Validator (§6A step 8)

`scripts\enrichment_validate.py` was **not run, and correctly so**. It validates artist and
venue enrichment against an evidence file. This run created **zero artists and zero venues** and
performed **zero enrichment edits**, so there is no record for it to read and no evidence file
was written. Running it against an empty set would produce a meaningless pass.

**Outstanding FAILs: none. Records in scope: none.**

## 11. Saturation, per district

| district | hops this run | venues found | saturation this run |
|---|---|---|---|
| ST5 | 0 | 0 | n/a — no readable surface |
| ST6 | 2 | 0 | 0.0 |
| ST7 | 1 | 0 | 0.0 |
| ST3 | 1 | 0 | 0.0 |
| ST9 | 1 | 0 | 0.0 |
| WS11 | 1 | 0 | 0.0 — 1 event at a venue already held |
| n/a (artist seeds) | 1 | 0 | 0.0 |

**Zero new venues from 7 hops. This is not saturation.** Three of the seven hops failed on the
capture, not on the ground: two client-rendered sites and one stale site. Reading a zero here as
"worked out" would be the mistake §6 warns against.

## 12. Cursor

`nextDistrict` set to **ST6**, with the note that ST5 stays blocked until Chrome returns.
ST6 (Burslem, Tunstall, Smallthorne) has never been spidered and holds several venues with a
real website: Talisman, Chell Social Club, The Top Pub, The Old Post Office, Grumpy's, Kings Head.

## 13. Raised to CTO-INBOX

- `spider-chrome-unreachable-blocks-new-artists` (BLOCKED)
- `under-the-influence-us-website` (DATA)

Checked against existing fingerprints first. `spider-mode-not-declared`,
`spider-rule4-ranks-website-below-socials` and `bv2a-chrome-unreachable-three-consecutive-firings`
are already open and were **not** re-raised.

## 14. §0.29 mode

`sources\spider.md` declares no mode. The run treated the source as **append-only**, which is
also what it is by construction: the spider has no upstream feed and therefore no snapshot, so
§5.7 removed-row handling cannot apply to it. No deletion was made or considered.
Already raised as `spider-mode-not-declared` on 2026-08-15. Not re-raised.
