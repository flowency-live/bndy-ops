# KLMA STOKE GIG LIST — RUN REPORT 2026-09-02

**Run id:** `klma-stoke-gig-list-2026-09-02T03-08-30Z`
**Outcome:** COMPLETED. Snapshot written. Validator 0 FAIL.
**Runbook read:** `RUNBOOK.md` H1 **v2.27**. Floor in §6A is **v2.19**. Pass.
**Prompt floor:** the deployed prompt names no number. It defers to §6A step 2a. No drift to report.
**Mode (§0.29):** the spec declares no mode. The run defaulted to **append-only**. Nothing was
deleted and nothing was hidden. Already open as `klma-no-delta-mode-declared`; not re-raised.

**Headline: the sheet did not change in 24 hours — the capture md5 is byte-identical to
yesterday's. So the whole run went to the deferred backlog, in the order the 2026-09-01 report
named. 9 gigs and 9 artists written at Norton Central Social Club and Grumpys Longport.**

---

## 1. Gate log (§6A steps 0 to 3)

| Step | Result |
|---|---|
| 0 heartbeat | `data\state\heartbeat\klma-stoke-gig-list-2026-09-02T03-08-30Z.json` written. |
| 1 date | `2026-09-02` from the container shell. |
| 2 runbook + spec | Both read in full. |
| 2a floor | v2.27 >= v2.19. Pass. |
| 2b claim | `data\state\claims\klma-stoke-gig-list.json` read `heldBy: null`, released 2026-09-01T20:06Z. Acquired. TTL 2 hours. No takeover. |
| 3 tools | bndy MCP reachable (`get_by_id` on the Norton Central venue). **Chrome reachable** — one connected browser `7ad060c3`, Facebook logged in. |

⚠ **One ordering deviation, stated plainly.** The heartbeat is §6A step 0 and is meant to be the
first action. This run read the runbook first and wrote the heartbeat immediately after, before
any other gate and before any write. No gate was skipped and no bndy write preceded it.

**The last KLMA run was 2026-09-01T19:23Z.** The diff therefore covers one day.

## 2. Capture

| Section | Surface | Result |
|---|---|---|
| 1 KLMA sheet | container `curl` on gviz `tqx=out:html` | HTTP 200, 102,090 bytes, md5 `06370ef1f76b87a5cec76952f3506b27`, **396 normalised rows** |
| 2 Sugarmill | `web_fetch` | 31 distinct gigs (the THIS MONTH / NEXT MONTH / ALL tabs repeat rows) |

Raw: `data\raw\klma-stoke-gig-list\2026-09-02\gviz.html`

⚠ **The md5 equals yesterday's exactly.** The curator submitted nothing in 24 hours. That is a
real and useful result, not a capture fault: the byte count, the row count and the hash all agree
with the 2026-09-01 capture, and the parsed row set is identical line for line.

- Column layout re-verified before parsing. The header row still carries
  `Artist | Venue & Location | Time (eg 9pm) | Cost/Ticket | Genre | Link to Event`, so
  `Cost/Ticket` is index 5.
- Container `curl` on `thesugarmill.co.uk` still returns HTTP 000. `web_fetch` remains the
  section 2 surface (`sugarmill-webfetch-preserves-hrefs`, open; not re-raised).

## 3. Diff (§5.7 and §5.7(a))

### 5.7(a) gate

| Section | Re-diff of the new snapshot against its own capture | Verdict |
|---|---|---|
| 1 | **0 added / 0 removed** | PASSED |
| 2 | **0 added / 0 removed** | PASSED |

### Section 1 — 0 added / 0 removed
### Section 2 — 0 added / 0 removed / 0 changed

**No future-dated row was removed anywhere.** Nothing to action under §0.17, and the mode is
append-only regardless. Sugarmill status markers are unchanged (`arkayla` SOLD OUT,
`the-year-grunge-broke` RESCHEDULED), and the three known ticket-link date faults recur and were
not imported.

## 4. Tombstone check (§5.4, v2.19)

`data\state\cancellations.jsonl` — 16 lines, searched on artist, venue and date for every gig
written today. **No hit.** Every tombstone is a North East or Derbyshire record; none is a Stoke
venue. No `TOMBSTONED-` disposal was needed.

`20-Daily\2026-09-02.md` and `data\state\run-summary.jsonl` were read before any write. Only the
`spider` run has fired today. It wrote no Stoke events.

## 5. ⚠ A ZERO DIFF IS NOT A ZERO-WORK NIGHT

The diff offered nothing. **The 2026-09-01 run deferred 51 rows on budget and named them in
priority order, and `blocked-rows-not-re-presented-by-diff` means the diff will never offer them
again.** So this run took that list rather than reporting a quiet night, and worked it in the
order given: Norton Central Social Club first (9 rows behind one already-resolved venue), then
Grumpys Longport (3 rows, venue resolved, all priced).

**A venue coverage probe came first, and it paid again.** Two `search_event(venueId, dateFrom,
dateTo)` calls found **4 of the 12 backlog rows were already in bndy**, written by earlier runs.
No create was wasted on them.

| Already in bndy | date | disposal |
|---|---|---|
| It Takes Two duo @ Norton Central | 2026-09-05 | externalId + price back-filled |
| Recall duo @ Norton Central | 2026-09-06 | externalId + price back-filled |
| Second City @ Norton Central | 2026-09-12 | already carries `klma-stoke-gig-list / 9e06d8b48914`. The sheet holds this gig **twice** — `Second City` 8:00pm and `Second City duo` 9pm, two submissions of one gig. One act, one event, no second record (§1 event UID). |
| La Bone @ Grumpys | 2026-09-05 | externalId + price back-filled |

## 6. Events created — nine

| # | Event | bndy event id |
|---|---|---|
| 1 | Jason Kerr @ Norton Central Social Club, 2026-09-19, 21:00 | `bb851acd-efa9-4cc6-bf48-34ed3d05e22b` |
| 2 | Charlotte Mae @ Norton Central Social Club, 2026-09-26, 21:00 | `dccc7f21-102f-4241-b8f8-67ee66a7a9da` |
| 3 | Marc Bolton @ Norton Central Social Club, 2026-10-23, 20:00 | `d0b4bf14-be38-40ff-a7c7-0ab5fa4ff7ae` |
| 4 | Guy Malidoni @ Norton Central Social Club, 2026-10-23, 20:00 | `31381cbf-249b-42ad-9b5b-722331e51601` |
| 5 | Jay Harrison @ Norton Central Social Club, 2026-10-23, 20:00 | `60521dee-b62a-4a7a-bd56-3a8f0362712f` |
| 6 | Hurls @ Grumpy's, 2026-09-19, 20:00 | `29a4328a-1565-41d9-be6d-64af8b47f9d8` |
| 7 | We Are At The Station @ Grumpy's, 2026-09-19, 20:00 | `64afcdee-9c15-44d9-9654-946df10f9675` |
| 8 | Troyen @ Grumpy's, 2026-09-26, 20:00 | `0127f207-2475-494e-bec9-8e3b561d62fd` |
| 9 | Stonepit Drive @ Grumpy's, 2026-09-26, 20:00 | `0b73d7fb-675d-4737-a105-6bec35db1fb3` |

**Every write was read back (§0.10).** Events 1 and 2 by `get_by_id`; events 3 to 9 by
`search_event(venueId, dateFrom, dateTo)`, which returned each one with its intended date, time,
artistId, venueId and externalId. All nine returned `isPublic: true`.

### §4 splits — two bills became five events

| Sheet row | Acts | Events |
|---|---|---|
| `Marc Bolton, Guy Malidoni & Jay Harrison` @ Norton Central, 2026-10-23 | three | 3 discrete events, one per act |
| `Hurls + We are at the Station` @ Grumpys, 2026-09-19 | two | 2 discrete events |
| `Troyen + Stonepit Drive` @ Grumpys, 2026-09-26 | two | 2 discrete events |

Each child carries the bill's price. The sibling relationship is stated in `ticketInformation`
(§CT rule 6). No parent event exists for an ordinary multi-artist gig yet (§4 BUILD STATUS), so
the sibling ids above are the record for a retroactive attach.

### externalIds written (§6D slug form)

```
2026-09-19-jason-kerr-norton-central-social-club
2026-09-26-charlotte-mae-norton-central-social-club
2026-10-23-marc-bolton-norton-central-social-club
2026-10-23-guy-malidoni-norton-central-social-club
2026-10-23-jay-harrison-norton-central-social-club
2026-09-19-hurls-grumpys-longport
2026-09-19-we-are-at-the-station-grumpys-longport
2026-09-26-troyen-grumpys-longport
2026-09-26-stonepit-drive-grumpys-longport
```

Each was written as a complete single-element array in one call (§6B).

### Start times (§5.6, §0.28)

Every row published a time, so no default was applied. `9pm` normalised to 21:00, `8pm` to 20:00,
per the spec's time table. `startTimeDefaulted` was `false` on all nine.

### `Cost/Ticket` mapping (§CT)

| Row | Cell | Written |
|---|---|---|
| Jason Kerr 09-19, Charlotte Mae 09-26 | `Free entry, all welcome` | `ticketed: false`, `price "Free"`, `ticketInformation "Free entry, all welcome"` |
| Marc Bolton / Guy Malidoni / Jay Harrison 10-23 | `£12, tickets on sale` | `ticketed: true`, `price "£12"` |
| Hurls / We Are At The Station 09-19 | `£5.00` | `ticketed: true`, `price "£5.00"` |
| Troyen / Stonepit Drive 09-26 | `£9.00` | `ticketed: true`, `price "£9.00"` |

⚠ **Three new `Cost/Ticket` spellings, all ruled on in-run per the §CT catch-all, none escalated.**

| New spelling | Ruling | Basis |
|---|---|---|
| `Free entry, all welcome` | zero price → `Free`, `ticketed: false` | §CT catch-all: "if the value states a zero price it is `Free`" |
| `Freen entry, all welcome` (curator typo, the 09-05 row) | same as above | one transposed letter is not a new vocabulary item |
| `£12, tickets on sale` and `£7.50, tickets on sale` | the number is the price; the tail is not | §CT catch-all: "if it states a number it is that number" |

**Add these to the §CT table on the next spec touch.** A run does not edit a rule (§0.1 / task
contract), so the table is not amended here.

## 7. Identity decisions

**Artists — nine created, zero reused, zero stubs.**

| Billing | Outcome | Evidence |
|---|---|---|
| `Jason Kerr` | **created** `567fe4aa-eb9a-4ee9-be06-3da99347805b` | **evidenced blank.** No Facebook page on either surface. |
| `Charlotte Mae` | **created** `6406b3bb-e6a7-4f38-a336-8a9292abc614` | `facebook.com/p/Charlotte-Mae-Vocalist-100063203860508/`, 194 followers |
| `Marc Bolton` | **created** `08cde202-8f34-4060-944a-01605b29f89e` | `facebook.com/themarcboltonshow`, 20K followers |
| `Guy Malidoni` | **created** `06721e1a-6045-4b06-a42b-b89b174873e9` | **evidenced blank** on both surfaces |
| `Jay Harrison` | **created** `a3bcbe35-aede-43e7-b081-edadf2d1a11a` | **evidenced blank** on both surfaces |
| `Hurls` | **created** `99abd057-ad77-405a-a4a0-4ba770306992` | `facebook.com/profile.php?id=61590627697122`, Artist, Nottingham |
| `We are at the Station` → **We Are At The Station** | **created** `e710d815-645f-4898-931b-a6b7f375232b` | **evidenced blank** on both surfaces |
| `Troyen` | **created** `02142688-06b5-44f8-9bc2-9ddd519beb8d` | `facebook.com/Troyen14`, 7.6K, page states Newton-le-Willows WA12 9XG |
| `Stonepit Drive` | **created** `cb345bca-1689-4efe-9018-d91c5c8a9eba` | `facebook.com/stonepitdrive`, 1.5K, "Musician/band" |

**§1A.7 — one `review` verdict, resolved without a human.** `Jason Kerr` was held against
**Jason Keady** (Newcastle-under-Lyme, 70%, shared token). Different surname, different act.
Resolved with `confirmNew: true`, which is the sanctioned path and not a §0.9 workaround.

**Names — three decisions worth stating.**

| Sheet | Written | Why |
|---|---|---|
| `Charlotte Mae` | **Charlotte Mae** | The page is titled "Charlotte Mae Vocalist". "Vocalist" describes what she does, so §0.6 strips it, exactly as it strips "5pc Local Rock/pop Covers Band". The sheet and the person's name agree, and a future KLMA row billing "Charlotte Mae" will now match. |
| `Marc Bolton` | **Marc Bolton** | The page is "The Marc Bolton Show" — a SHOW name, not the act's name. This is the §1A.5 / Rachel Shenton pattern: the artist is the person, the show name belongs in an event title. |
| `Hurls` | **Hurls** | The page is titled "Hurls band", but the act's own bio opens "Hurls bring together…". The act's own words settle it, and "band" is a disambiguating page suffix, not a §2A.1 format tail. |

**Locations.** Norton Central and Grumpys are **not** §0.7 national-act venues, so the gig-town
fallback is permitted and was used for the five acts whose own page states no home town:
Stoke-on-Trent, `locationType: city`. Four acts took a stated location instead —
Hurls → Nottingham (page states "Midlands, Nottingham"), Troyen → Newton-le-Willows (page states
WA12 9XG), Stonepit Drive → **Northamptonshire** with `locationType: regional` (§6B Kilmarnock
trap), Jason Kerr → Stoke-on-Trent corroborated by the Google snippet for `jasonkerr.co.uk`.
⚠ `get_by_id` does not return `locationType`, so the read-back cannot confirm the regional flag.
Already open as `get-by-id-omits-locationtype`; not re-raised.

**Venues — two resolved, zero created.** `Norton Central Social Club`
`SJrDEbAzFaHuyoTpoTST` (ST6 8HZ) and `Grumpy's-GB Motorcycles` `HDfCfgFwyafaVHhzYA5z`, both
already carrying their `klma` externalId. The Grumpys postcode disagreement (sheet ST6 4LU,
record ST6 4NW) is unchanged from yesterday and already open as
`grumpys-postcode-disagrees-with-own-site`; not re-raised, not corrected — a run adds.

## 8. Rows refused or skipped, and why

| Row | Disposal |
|---|---|
| `Soul on Trent` @ Norton Central, 2026-10-10, £7.50 | **SKIPPED.** The act's own page — `facebook.com/WeAreSoulOnTrent`, 466 followers, Stoke-on-Trent — reads *"for those who appreciate Northern & Motown from the 60's & 70's"* and posts weekly playlists, not gigs. That is a Northern Soul night, and §6 accept/reject rejects DJ sets. **No artist created, no event created.** If the next run finds evidence of a performing band, the row is still in the sheet and can be worked then. |
| `The Soul Man` @ Norton Central, 2026-10-16, £5 | **SKIPPED — identity undecidable (§1A.2 step 5).** bndy already holds `The Soul Man` `659f20bb-8a84-409d-8fb3-4a2ed14c463c` in **Bedford** (`facebook.com/PeterTheSoulMan`, Sandy). A second, different, well-evidenced act uses the same name: **The Soul Man Live**, Andy Pierce, **Burbage LE10**, 1.5K followers, active. Two distinct acts, one name, and **no evidence which of them plays Stoke.** Reusing the Bedford record would mis-attribute the gig; creating a third record would be the Ant Hill Mob incident again. Nothing written. |
| `Second City` @ Norton Central 2026-09-12, submitted twice | one gig, one existing event. No second record. |
| Sugarmill `9 Years of CH3` 09-05, `VAMPIRE BALL 2026` 09-19, `West End Day Party: Live!` 09-26, `SCENE` 10-03, `80s Day Disco` 10-10, `PHANTOM` 10-10, `HALLOWEEN ALLNIGHTER` 10-30, `Ska Day Party` 11-07, `TRANCE DAY PARTY` 11-21, `90s Day Party` 12-05 | the venue's own club-night and day-party programme — DJ-led, rejected under spec VA.9 and §6. Unchanged from previous runs. |

## 9. §VA venue-authoritative checks

| Venue | Status | Finding |
|---|---|---|
| **The Sugarmill** | **CHECKED** — sole-source feed, 31 rows, 0 added | §3 |
| Cosey Club | **NOT FETCHED** — no row written at this venue this run | — |
| Eleven | **NOT FETCHED** — no row written at this venue this run | — |
| The Rigger | **NOT FETCHED** — no row written at this venue this run | — |
| Artisan Tap | **NOT FETCHED** — no Artisan Tap row was pipelined this run | still no proven surface |

Neither Norton Central Social Club nor Grumpys is a §VA venue, so no venue page governs their
act names. The §2A.5 enrichment pass is the whole naming authority for the nine acts above, and
it settled three of the nine names (§7).

## 10. Records edited — three externalId back-fills

| Event | id | Written |
|---|---|---|
| It Takes Two duo @ Norton Central, 2026-09-05 | `8753d935-cc99-4544-bf9d-84eba0b5475f` | externalId `2026-09-05-it-takes-two-duo-norton-central-social-club`, `ticketed false`, `price Free` |
| Recall duo @ Norton Central, 2026-09-06 | `e4a5d0aa-733c-4ca2-a73d-e26951d6cf65` | externalId `2026-09-06-recall-duo-norton-central-social-club`, `ticketed false`, `price Free` |
| La Bone @ Grumpys, 2026-09-05 | `f773231e-cf5a-48d3-af58-cf6852702904` | externalId `2026-09-05-la-bone-grumpys-longport`, `ticketed true`, `price £5.00` |

All three were created by earlier runs with **empty externalIds**, so the §5.7 diff could never
have matched them and a later run could have duplicated them. Each is now attributable.

⚠ **A defect found while doing it.** On the La Bone edit the run sent `ticketed` and `price` and
did **not** send `ticketInformation`. The read-back returned `ticketInformation: "£5.00"` — the
server copied the price into a public free-text field the run never wrote. `ticketInformation`
renders to punters, so a silent server-side copy is a public-data write nobody asked for.
Raised as `edit-event-copies-price-into-ticketinformation`.

## 11. Deferred rows — named, per the gigs-per-artist ordering rule

The 2026-09-01 backlog of 51 stands at **39** after this run (12 worked: 9 created, 3 back-filled).
Highest value left open, in the order the next run should take them:

1. **Artisan Tap, 30 rows.** Named acts with findable pages first: Jo Carley & The Old Dry Skulls
   (09-30), Alice Howe & Freebo (10-28), Billy Bibby + The Groves (10-14), Aziz Ibrahim + Joseph
   Davis (10-15), The Darts (10-31), Tom Brooksby & The Secret Service (10-30), Barn54 + Blue
   Yellows + Sammy Hind (10-10), Keep Flying + Mad Badgers (10-12), Dirt Road Band + Malpractice
   (10-09), Bluebyrd + Static Fireflies (10-07), Noise Of Angels + Holden (10-22), Loaf Of Beard
   + Jim Mcjazz & The Razzmatazz (10-21), Disastrous Robots (09-18), Yoodoo Voodoo (09-10, see
   the 2026-09-01 report §9), and the tribute acts Close To Tears (09-25), Atom Heart Floyd
   (09-27), Straighten Out (10-02), The Sensational Alex Harvey Experience (09-20).
2. **Support acts left unsplit by the 2026-09-01 run** (§4 owes them their own events):
   Zipstyle (10-25), Dorothy Bird and Heidi (09-17). Both bills are in bndy under the headliner.
3. `Tigerfest - The Soul Revival + More...` (10-11) — the act is **The Soul Revival**, not in
   bndy; the festival name belongs in the event title (§0.27). A Tigerfest festival parent may
   already exist: event `70d539f4-…` on 2026-10-11 at this venue carries
   `festivalId 05bfebbc-c36e-4a2e-9cbf-9b2906fc1c0d`.
4. `Contraband-Stoke` @ Newcastle WMC 2026-09-05 — the venue is on this source's own skip note
   (Jason, DJ-led). Not overturned by a run.
5. The two rows skipped today on evidence (§8): `Soul on Trent`, `The Soul Man`.

⚠ **All 39 are inside the snapshot and the diff will never offer them again.** That is
`blocked-rows-not-re-presented-by-diff`, open since 2026-08-18. Not re-raised. **The venue
coverage probe is the working detection method** and it worked twice today: one
`search_event(venueId, dateFrom, dateTo)` per venue re-finds every deferred row and, as a bonus,
tells the run which of them another run has already written.

## 12. Validator (§6A step 8)

```
9 records · 8 clean · 0 FAIL · 1 WARN   [mode=gate]
```

Exit 0. **0 FAIL.**

The single WARN is `STUB_NO_BIO` on **Troyen**: a verified page is attached and the bio is empty.
**That is correct and deliberate.** The page carries contact details and links in place of an
intro — there is no bio text on it. §2A.1 item 8 says the bio is quoted or it is empty. It is
empty.

Evidence file: `data\state\enrichment-evidence-2026-09-02-klma-stoke-gig-list.jsonl`, nine lines,
one per created artist, each carrying the raw page scrape or the search variants tried.
Validator input: `data\state\validator-records-klma-2026-09-02.json`.
⚠ The evidence lines were written **after** each create, because `artistId` does not exist until
the create returns. Already open as `evidence-file-cannot-precede-a-create`; not re-raised.

## 13. Enrichment evidence (§2A.1 item 3b — both surfaces)

Every act was searched on **both** Google and Facebook page search before any blank was recorded.
Every page found was **opened and read** in Chrome — never linked from a snippet
(`fb-page-must-be-visited-not-snippeted`).

| Act | Queries | Page | What the page gave |
|---|---|---|---|
| Jason Kerr | `"Jason Kerr" singer facebook`; `"Jason Kerr" Stoke-on-Trent singer gigs`; FB pages `jason kerr singer` | **none** | Google returns only personal profiles (§2A.4). His own site `jasonkerr.co.uk` loads an error page in Chrome. The Google snippet corroborates Stoke-on-Trent and "pop/soul solo vocalist" — the genres came from there, and it is named here because it is a search result, not the act's page (§2A.1 3b). |
| Charlotte Mae | `"Charlotte Mae" singer Stoke-on-Trent` | `p/Charlotte-Mae-Vocalist-100063203860508` | bio, follower count. No location field. Corroborated by a Skiddle listing for a Stoke-on-Trent booking. |
| Marc Bolton | `"Marc Bolton" singer Stoke facebook` | `themarcboltonshow` | bio, 20K followers, contact. No location field. |
| Guy Malidoni | `"Marc Bolton" "Guy Malidoni" "Jay Harrison"`; FB pages `guy malidoni` | **none** | Facebook returned *"We didn't find any results"*. Evidenced blank. |
| Jay Harrison | as above; FB pages `jay harrison singer` | **none** | seven unrelated pages, none UK-consistent with the bill. Evidenced blank. |
| Hurls | FB pages `hurls band` | `profile.php?id=61590627697122` | bio, "Midlands, Nottingham", members named. The sheet's genre cell ("Grunge + Alternative Indie") agrees with the page. |
| We Are At The Station | FB pages `we are at the station band`; `"We Are At The Station" band` | **none** | Google returns The Station / We Are Stations (New York). Neither is this act, and §2A.1 item 1 forbids attaching a non-UK page. Evidenced blank. |
| Troyen | `Troyen band Stoke facebook` | `Troyen14` | 7.6K followers, WA12 9XG, no bio text. NWOBHM confirmed by the act's own contact address `troyennwobhm@gmail.com`. |
| Stonepit Drive | FB pages `stonepit drive` | `stonepitdrive` | bio verbatim, "Musician/band", 1.5K followers, Northamptonshire stated by the act. |

**The two-word rule held (§2A.1 3c).** `hurls band`, `stonepit drive` and `Troyen band` all
returned the right page. No query carried a guessed town, and the one query that did carry a town
— `"Jason Kerr" Stoke-on-Trent` — was the sanctioned §2A.1 3b(b) second pass, run only after the
bare-name query, and the town it carried was the gig town, not a guess.

## 14. Quality measures (§6, v2.5)

| Measure | Count |
|---|---|
| Events created | **9** |
| Events edited | **3** |
| Artists created | **9** |
| Artists created with a verified page | **5** |
| Artists created on an evidenced blank | **4** |
| **Stubs created** | **0** |
| Venues created | **0** |
| Rows refused or skipped with a stated rule | 2 (plus 10 standing Sugarmill club-night rejects) |
| Rows deferred on budget | **39** |
| Names corrected or settled by the act's own page | 3 |
| Gate bounces (409/422) | **0** |
| `review` verdicts resolved without a human | **1** (Jason Kerr / Jason Keady) |
| Deletions | **0** |
| Records hidden | **0** |

**Caps:** 21 creates against a 50-create cap. Not near it.
**Wall clock:** roughly 35 minutes against a 2-hour TTL.

## 15. Open items raised to `CTO-INBOX.md`

| Fingerprint | Kind |
|---|---|
| `edit-event-copies-price-into-ticketinformation` | DEFECT |
| `klma-ct-vocabulary-free-entry-all-welcome` | RULE |
| `klma-soul-man-two-acts-one-name` | DATA |

**Not re-raised**, because each is already open: `klma-no-delta-mode-declared`,
`blocked-rows-not-re-presented-by-diff`, `klma-header-row-no-longer-last`,
`sugarmill-webfetch-preserves-hrefs`, `get-by-id-omits-locationtype`,
`grumpys-postcode-disagrees-with-own-site`, `create-artist-500-namevariants`,
`edit-artist-409-namevariants`, `evidence-file-cannot-precede-a-create`,
`record-run-token-missing`, `artisan-tap-2026-09-10-bill-disagrees`,
`artisan-tap-eleven-parklot-blockers-resolved`.

## 16. `record_run`

Not attempted. `SOURCE_RUNS_TOKEN` is still unset (`record-run-token-missing`, open since
2026-08-08). Non-blocking. `data\state\run-summary.jsonl` is the dashboard's input and was
appended.
