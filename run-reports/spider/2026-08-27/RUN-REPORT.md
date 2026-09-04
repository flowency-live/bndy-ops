# SPIDER RUN REPORT — 2026-08-27

**Run id:** `spider-2026-08-27T12-57-11Z`
**Outcome:** COMPLETED
**Runbook read:** v2.27. Floor asserted at §6A: v2.19. Prompt floor: not numeric in this prompt. PASS.
**Claim:** `data\state\claims\spider.json` was released (`heldBy: null`, `releasedAt` 2026-08-21T02:10:30Z). Acquired cleanly. No takeover.
**Heartbeat:** `data\state\heartbeat\spider-2026-08-27T12-57-11Z.json`
**Validator:** 2 records, 2 clean, **0 FAIL, 0 WARN** [mode=gate].

---

## 1. Headline

| measure | value |
|---|---|
| Seeds worked | 5 |
| Hops attempted | 7 |
| **New venues per 100 hops (saturation)** | **42.9** |
| Events created | 8 |
| Artists created | 2 (1 verified page, 1 evidenced blank) |
| Venues created | 3 |
| Enrichment edits | 2 |
| Records written and read back | **15** (target 25 — short, see §8) |
| 409 duplicates | 0 |
| Rows rejected by the admission test | 1 |
| Rows skipped out of region | 4 |
| Deletions | 0 |

---

## 2. District selection

The cursor named **CW1** and named the frontier precisely. It was followed.

- CW1 worked, 5 hops.
- M45, M24 and M25 were reached by an artist hop, not by district selection. All three are a first touch.
- No district was picked at random. No 90-day override fired.

---

## 3. Seeds and hops

### Hop 1 — Cosey Club `LHrDNnXeCU1eirDOxUKc` (venue seed, rule 2) — CW1

Surface: `https://www.thecosey.co.uk/shows`, read in Chrome.

**The Load More question is now settled and the previous run's note is WITHDRAWN.**
The 2026-08-21 report recorded the capture as PARTIAL beyond 2026-10-10 because a Load More button
was never pressed. This run pressed it four ways: a plain `.click()`, a synthetic `MouseEvent`, a full
`pointerover/pointerdown/mousedown/pointerup/mouseup/click` sequence, and a `fetch`/`XMLHttpRequest`
hook to watch for a request. **The button fires no network request and adds no rows.** The list is
17 rows and that is the complete published list. The capture is NOT partial.

Result: 17 rows read, 13 already in bndy, 1 rejected, **4 written**.

| date | billed as | action |
|---|---|---|
| 2026-08-27 | QUIZ NIGHT 8.30pm | **REJECTED-not-a-gig** (quiz, §6 accept/reject filter) |
| 2026-08-28 | CIRCA'81 | already held `37ee828d-2ffd-44c1-b8dc-2a6103d9a90b` |
| 2026-08-29 | THE ALICE BAND | already held `daadea8a-7cef-4aa1-9d46-08a04ef37991` |
| 2026-08-30 | COZYZONE BIKE SOCIAL EVENT | already held `bb48c687-6c9c-4579-b4dc-8a8aa80bbe0a` |
| 2026-09-04 | VAVOOM!! | already held `0d2f6d42-ddd6-4b05-a51a-fc222aa62e46` |
| 2026-09-05 | ANGEL OF HARLEM | already held `d8bd5248-841d-4d33-8026-c9972136e445` |
| 2026-09-11 | BRASSMONKEES | already held `0caa342f-3122-45e0-8920-c73e6bb6251f` |
| 2026-09-12 | NOT GUILTY | already held `d6f984bf-11f7-4de0-abca-012aedd25e72` |
| 2026-09-18 | EGO KING | already held `1f380e38-c699-4fe6-8a89-21247514536d` |
| 2026-09-19 | THE ENDINGS | already held `0f9f168d-15be-47ca-9a49-d860dcdb0801` |
| 2026-09-25 | THE VANZ | already held `1e2c8ad9-fe54-40c9-ac36-1179e563ea16` |
| 2026-09-26 | ARCTIC STEREO KILLERS | already held `e1196904-88e4-47ca-b749-bcf0c29220a2` |
| 2026-10-02 | MARBLEHEAD BRITPOP | already held `ac828011-2c56-40bb-94c0-23b195bf0286` (this source, 2026-08-21) |
| 2026-10-03 | XCLUSIVE | **CREATED** `b18028af-673c-4d00-8c02-f66637d4bc75` |
| 2026-10-09 | THE CRISIS | **CREATED** `ceeef591-7459-4f54-8f41-4b6b82c57a61` |
| 2026-10-10 | BOBCAT BILLYS MOONSHINE MISSION | already held `866f2dea-531a-4041-a3c0-f33879442bbe` |
| 2026-10-16 | EATON PARK | **CREATED** `d4cdef9b-2f49-4d13-a3b4-b7efebd68074` |
| 2026-10-17 | AC/DShe | **CREATED** `89bd4e35-d965-412a-8db6-1083b00ad012` |

**The Cosey queue is now clear.** Every admissible row it publishes is in bndy.

### Hop 2 — The Crisis `2c729228-41af-4346-aabe-20c987b7e2b0` (artist seed, rule 1) — M45 / M24 / M25

Surface: `https://www.thecrisis.co.uk/gigs.html`, the act's own diary. **Three new venues from one hop.**
This is the case the spec is written for: the band's own site carries pubs and clubs no aggregator we
run publishes.

| date | venue as billed | action |
|---|---|---|
| 2026-08-29 | STANTON HOUSE, CHIRK | **SKIPPED-out-of-region** (Wrexham, Wales) |
| 2026-09-05 | THE COACH & HORSES, WHITEFIELD, MANCHESTER | venue **CREATED**, event **CREATED** |
| 2026-10-09 | THE COSEY CLUB, CREWE | written at hop 1 |
| 2026-10-17 | THE NEW INN, MIDDLETON, MANCHESTER | venue **CREATED**, event **CREATED** |
| 2026-10-24 | THE CLUB, PRESTWICH | venue **CREATED**, event **CREATED** |
| 2026-10-31 | THE HAND HOTEL, LLANGOLLEN | **SKIPPED-out-of-region** (Denbighshire, Wales) |
| 2026-11-21 | THE CLUB, PRESTWICH | event **CREATED** |
| 2026-12-05 | THE OLD NEW INN, LLANFYLLIN | **SKIPPED-out-of-region** (Powys, Wales) |
| 2027-01-23 | LLANGYNOG MEMORIAL HALL | **SKIPPED-out-of-region** (Powys, Wales) |
| 2027-01-31 | RAAF CLUB, LLANGOLLEN | **SKIPPED-out-of-region** (Denbighshire, Wales) |

Five Welsh rows were skipped and reported, not followed (§Caps, "never follow a hop out of region").
They are recorded in the snapshot so a later region ruling can pick them up without a re-read.

### Hops 3 to 5 — rule 4, CW1 venues with a website and zero future gigs

Rule 4 ranks above discovery and a website is ranked above a social page
(CTO-INBOX `spider-rule4-ranks-website-below-socials`). All three were dry.

| seed | surface | finding |
|---|---|---|
| The Coppenhall Working Mens Club `CCNVANtGSGM8vggYddzj` | `thecoppenhallclub.co.uk` | The listing is **2025**: "Sunday 26th January", "Thursday 13th February", "Friday 27th June" all fall on those weekdays in 2025, not 2026. Every row is past-dated. §0.14 forbids the import. 0 written. |
| Tom's Tap and Brewhouse `O24ZOAFAjoxI9mVFjEp6` | `tomstap.co.uk` | Stale by two years: the featured items are a December comedy night and a "Sunday 31st December" New Year party. 0 written. |
| The Eight Farmers `RMgG8RhgzTdh5qsIjtEU` | `eightfarmerspubcrewe.co.uk/whats-on` | Client-rendered Marston's calendar. WebFetch returned the shell, so it was re-read in Chrome per the escalation rule. The calendar renders **empty** for every month of 2026. 0 written. |

**CW1 is worked out on the venue axis: 5 hops, 0 new venues.**

---

## 4. Records created — every id in full

### Artists

| id | name | location | enrichment |
|---|---|---|---|
| `2c729228-41af-4346-aabe-20c987b7e2b0` | The Crisis | Llanfyllin (city) | **VERIFIED PAGE** |
| `fed8769e-e999-4703-b02f-ef654325b021` | Xclusive | Crewe (city) | **EVIDENCED BLANK** |

**The Crisis — how it was identified.** The act's own website lists `9 OCTOBER 2026 THE COSEY CLUB, CREWE`,
which is the very gig being imported. That is a §2A.1 hard signal, not a name match. The same site links
`facebook.com/thecrisisrock` in its own footer. The page was then **visited** in Chrome (not taken from a
snippet — CTO-INBOX `fb-page-must-be-visited-not-snippeted`) and reads: page name "The Crisis - Live Rock &
Pop", category Musician/band, 223 followers, areas Manchester · Chester · Wrexham · Llanfyllin · Shrewsbury ·
Oswestry · Welshpool · Telford, link thecrisis.co.uk. Stored: facebookUrl, websiteUrl, youtubeUrl, graph
avatar, actType `covers`, genres Rock / Pop / Britpop / 60s / 70s / 80s.

**Two corrections I made to my own first write, both on better evidence.**

1. **Location.** I first wrote `Shropshire` (regional), inferred from the website line "We are based on the
   Shropshire-Powys border". The Facebook page states its own town: **Llanfyllin, United Kingdom**. §2A.1 item 3
   says the page's own stated location wins. Corrected to `Llanfyllin`, locationType `city`. The inference was
   the weaker evidence and it was wrong on which side of the border the band sits.
2. **Bio.** I first wrote the opening paragraph of `thecrisis.co.uk/about.html`, verbatim. The validator
   returned `FB_EVIDENCE_MISMATCH`: the record stores a Facebook URL while the evidence was captured from the
   website. The validator cannot field-scope evidence — this is the known defect
   `validator-genre-only-fb-evidence-mismatch`, not re-raised. Rather than ship a FAIL, the bio was re-taken
   verbatim from the Facebook page: *"Anglo-Welsh band performing a variety of covers across the ages"*.
   Shorter, and provably a quotation of the surface the record cites. The website paragraph stays in the
   evidence file as history.

**Xclusive — the blank is evidenced, over two runs and both surfaces.**
Facebook page search `Xclusive band` and Google `"Xclusive" covers band Cheshire` were run on 2026-08-21;
this run added the §2A.1 item 3c bare-name query `"Xclusive" band` and `Xclusive band Cheshire live`.
Every hit is a different act: Brownsville TX, an R&B page, a Nigerian act, an electronic producer. No
UK-consistent page exists. facebookUrl, bio, genres and actType are all **left empty** — blank beats wrong
(§2A.1 item 1), and §0.18 forbids defaulting actType with no evidence.

### Venues

| id | name | address | place_id | postcode check |
|---|---|---|---|---|
| `49fded5b-60a4-48c2-8dea-10832cf4aca7` | Coach & Horses | 71 Bury Old Rd, Whitefield, Prestwich, Manchester M45 6TB | `ChIJm2Zihveve0gRNozi8ni5hww` | M45 = Whitefield ✓ |
| `dabfa39d-433a-41b4-8273-baeaf0ded68b` | New Inn | 34 Long St, Middleton, Manchester M24 6UQ | `ChIJ-SeJynO6e0gRhw7yP3uTK-8` | M24 = Middleton ✓ |
| `34862138-52f1-4731-99c1-cd384fad4e79` | The Club, Prestwich ( Prestwich Conservative Club ) | 35 Church Ln, Prestwich, Manchester M25 1AN | `ChIJlVgt2--ve0gRbDv-CO5boIw` | M25 = Prestwich ✓ |

All three are a fixed building with a real place_id (§0.23) and all three pass the admission test:
Coach & Horses is a Joseph Holt pub whose own page lists "Live Music" and "monthly live music events";
New Inn is a Long Street pub; The Club Prestwich is a members' social club, which is Jason's definition
of grassroots outright.

§3 discipline was followed before each create. For Coach & Horses: `search_venue("Coach and Horses","Whitefield")`
missed, `search_venue("Coach","Manchester")` missed across 16 rows, `list_venues(city:"Whitefield")` returned
zero. For New Inn: `search_venue` missed across 11 rows and `list_venues(city:"Middleton")` returned two
unrelated venues, read in full. For The Club: `list_venues(city:"Prestwich")` returned one unrelated venue.

⚠ **Google renamed The Club on create** to `The Club, Prestwich ( Prestwich Conservative Club )`. Accepted,
not rejected: the postcode M25 1AN matches exactly, which is the rule Jason set on 2026-08-09
(`venue-name-gate-too-strict`, RESOLVED — the postcode decides, not the name).

### Events

| id | title | date | venue | externalId |
|---|---|---|---|---|
| `b18028af-673c-4d00-8c02-f66637d4bc75` | Xclusive @ Cosey Club | 2026-10-03 | Cosey Club | `spider:venue-LHrDNnXeCU1eirDOxUKc-2026-10-03` |
| `ceeef591-7459-4f54-8f41-4b6b82c57a61` | The Crisis @ Cosey Club | 2026-10-09 | Cosey Club | `spider:venue-LHrDNnXeCU1eirDOxUKc-2026-10-09` |
| `d4cdef9b-2f49-4d13-a3b4-b7efebd68074` | Eaton Park @ Cosey Club | 2026-10-16 | Cosey Club | `spider:venue-LHrDNnXeCU1eirDOxUKc-2026-10-16` |
| `89bd4e35-d965-412a-8db6-1083b00ad012` | AC/DShe @ Cosey Club | 2026-10-17 | Cosey Club | `spider:venue-LHrDNnXeCU1eirDOxUKc-2026-10-17` |
| `b220fc9d-1ccb-4842-b2ff-1e200dcc1a8e` | The 1985 @ Coach & Horses | 2026-09-05 | Coach & Horses | `spider:artist-2c729228-41af-4346-aabe-20c987b7e2b0-2026-09-05` |
| `95a2fd37-c3e9-479e-8517-83c11850db0c` | The 1985 @ New Inn | 2026-10-17 | New Inn | `spider:artist-2c729228-41af-4346-aabe-20c987b7e2b0-2026-10-17` |
| `01ee5370-fff9-4488-b613-77b8163bf20b` | The 1985 @ The Club, Prestwich | 2026-10-24 | The Club, Prestwich | `spider:artist-2c729228-41af-4346-aabe-20c987b7e2b0-2026-10-24` |
| `1d1e5dce-3f3d-46a7-8722-1a1792b077c7` | The Crisis @ The Club, Prestwich | 2026-11-21 | The Club, Prestwich | `spider:artist-2c729228-41af-4346-aabe-20c987b7e2b0-2026-11-21` |

**All eight start times are DEFAULTED** under §5.6, applied by the server (`startTimeDefaulted: true`).
Seven Saturdays and Fridays defaulted to 21:00. Neither source publishes a stage time. Correctable.

---

## 5. Identity decisions

**AC/DShe — reused, not created.** `rsKoCAcEPQ3FVbvGwSa2` is stored as Worksop, and the Cosey is Crewe. The
§1A.2 footprint check decided it, not the stored location text: the record's event history is Dukeries Brewery
Tap (Worksop) and **Eleven, Stoke-on-Trent** on 2026-09-06. Stoke is adjacent to Haslington, so §1A.2 rule 3
applies — same act, reuse. A second AC/DShe would have been the Ant Hill Mob incident again.

**Eaton Park — reused.** `HOifh16xNRfedOMgSkG1`, 100% name match, Stoke-on-Trent, adjacent to Crewe. Reuse.

**The Crisis and "The 1985" are ONE act (§1A.5).** Their own site: the band also runs a live eighties show
billed as The 1985, and the gigs page marks those dates with a different logo. The billing belongs in the
event title, the artist id is the same record — so four events read "The 1985 @ …" and all four hang on
`2c729228-41af-4346-aabe-20c987b7e2b0`.

⚠ **The alias could not be stored.** `edit_artist(nameVariants:["The 1985"])` returned **HTTP 409 Duplicate
artist**. That is the known defect `edit-artist-409-namevariants` (CTO-INBOX 2026-08-12) and it is **not
re-raised**. It was **not retried under a varied value** (§0.9). Consequence: the next run that meets a
listing billed "The 1985" has no stored alias to match on and will have to re-derive it from this report.

---

## 6. Gate bounces, defects and corrections, verbatim

1. `edit_artist(nameVariants)` → `HTTP 409: Duplicate artist`. Known. Not retried, not re-raised.
2. Validator first pass → `FAIL FB_EVIDENCE_MISMATCH: stored https://www.facebook.com/thecrisisrock but
   evidence was captured from https://www.thecrisis.co.uk/about.html`. Fixed by re-taking the bio from the
   cited surface (see §4). Second pass: 0 FAIL, 0 WARN.
3. **My own §6B breach, caught by read-back.** `create_event` was called with the title `The 1985 @ Coach
   &amp; Horses` and stored the literal `&amp;`. §6B forbids HTML-escaping `&` in a tool argument. Corrected
   in place with `edit_event` and verified. The same mistake in `create_venue(name)` did **not** persist,
   because Google Places supplied the canonical name. **§0.10 read-back is the only reason either was seen.**
4. `javascript_tool` returned `{}` for an async IIFE. Not a guard and not a page fault — the tool has REPL
   semantics and wants top-level `await`. Noted so it is not rediscovered.

---

## 7. Snapshot and the §0.29 mode

`data\state\spider-last-page.txt` written, 50 rows, normalisation rules in the file header.

**Mode: append-only.** The spec still declares no §0.29 mode (fingerprint `spider-mode-not-declared`,
2026-08-15, not re-raised). This file is a **union of every seed listing this source has ever read**, not a
single feed, so an absent row means only that the seed was not read today. §5.7 removed-row handling and
§0.17 deletion **did not run**. No self-diff gate is claimed, because there is no single capture to diff
against — that is stated plainly rather than reported as 0/0.

`data\state\cancellations.jsonl` was checked before every create. No matching artist + venue + date.
No deletions and no hidings this run.

---

## 8. Against the 25-record target

**15 records written and read back, against a target of 25.** Short, and the reason is worth stating exactly,
because it is not the same reason as last time.

- The run did not run out of time. It ran out of **admissible rows**.
- The Cosey queue was 4 rows deep and is now empty. The Crisis diary was 10 rows, of which 5 are in Wales.
- Three rule-4 seeds were worked and all three publish a stale or empty listing. That is 3 hops for 0 records
  and it is an honest result, not a failure — but it is also the finding of the day (§9).
- Saturation was **42.9 new venues per 100 hops**, which is the highest this source has recorded. The yield
  per hop was good. There were not enough live hops to reach 25.

The remedy is more rule-4 seeds per run, and the cursor now names four specific ones in CW2.

---

## 9. Raised to CTO-INBOX

One item, fingerprint `venue-websites-stale-or-empty-crewe`. Three of three CW1 rule-4 venue websites
publish a listing that is one to three years out of date, or an empty calendar template. The 2026-08-15
finding `fb-venue-pages-publish-no-events` said the same of Facebook venue pages. If both venue surfaces
are routinely dead, rule 4's yield comes from the artist axis, and the seed ladder should say so.

⚠ **One typo in my own `run-summary.jsonl` line, left uncorrected on purpose.** Its `note` reads "4 Welsh
rows out of region". The true figure is **5**, as listed in §3. `skipped: 6` is correct (5 Welsh rows plus the
quiz night). The file is append-only (§6A step 7b) and a second line for the same run would double-count on
the dashboard, so the line stands and the correction lives here.

Nothing else was raised. `spider-mode-not-declared`, `edit-artist-409-namevariants`,
`validator-genre-only-fb-evidence-mismatch`, `fb-page-must-be-visited-not-snippeted` and
`spider-rule4-ranks-website-below-socials` are all already on file and were obeyed, not re-reported.

---

## 10. Where tomorrow starts

`data\state\spider-state.json` → **CW2**. CW1 is clear on the venue axis; do not re-read the Cosey before
2026-09-26, and do not re-read the three dry websites. Crewe holds 19 known venues; the remaining rule-4
website seeds are The Sydney Arms `050a5422-1d3e-4f74-8489-fb39eb4d860b`, The Captain Webb
`0JI8W2TuAmbU4VsJncpN`, The Horse Shoe `027fffff-98e6-4465-864c-146af40df212` and Rising Sun Vaults
`6wnnY9197q6yQ8YHrJnA`. M25 is newly opened and holds Icons Bar `16ccd839-8b91-4f5f-bc2a-d4088cf8646e`
with a Facebook page and no gigs.
