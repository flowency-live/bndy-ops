# spider — RUN REPORT 2026-09-02

**Run id:** `spider-2026-09-02T01-05-07Z`
**Runbook read:** v2.27. **Floor asserted:** §6A CURRENT FLOOR v2.19. **PASS.** The prompt states no number.
**Outcome:** COMPLETED.
**Records written to bndy and read back: 23** — 12 events, 7 artists, 1 venue created, 3 venue enrichment edits.
**Validator: 7 records · 5 clean · 0 FAIL · 2 WARN.** (First pass was 3 FAIL. See §6.)

## 1. Gates

| Step | Result |
|---|---|
| §6A.0 heartbeat | `data\state\heartbeat\spider-2026-09-02T01-05-07Z.json`, written first. |
| §6A.1 date | Shell up. `2026-09-02`, UTC 01:05Z. |
| §6A.2 runbook + spec | Both read in full. CTO-INBOX spider fingerprints read. No daily note for 2026-09-02 existed at start. |
| §6A.2a floor | v2.27 ≥ v2.19. PASS. |
| §6A.2b claim | Claim was released (`heldBy: null`, lastRun 2026-09-01T20-00-25Z). Acquired. TTL 60 min. Previous heartbeat reads `completed`. No takeover. |
| §6A.3 tools | bndy MCP reachable. Chrome connected, Facebook session live (page search and act pages both read). Shell up, validator ran. |
| §6A.5 snapshot | Not applicable. Discovery source, no upstream feed. |
| §5.4 tombstones | `data\state\cancellations.jsonl` read in full (17 lines). No line matches any artist+venue+date written this run. |
| §0.29 mode | The spec declares no mode. Behaved append-only. Fingerprint `spider-mode-not-declared` already in the inbox. Not re-raised. |

## 2. Seeds and district

The cursor named three priorities. All three were worked, in order.

1. **The Salty Dog, Northwich `d6f6778c-29f8-46dc-9a77-65eecee5705c` (CW9).** The two multi-act Fatsoma bills the previous run skipped on time. Both re-read live on 2026-09-02 before writing. Capture: `data/raw/spider/2026-09-02/captures.json`.
2. **See Tickets surface** `seetickets.com/promoter/the-salty-dog/27372`: reads "Sorry, there are currently no shows available." Empty. Fatsoma is the venue's only live ticket surface.
3. **Foremans Bar, Nottingham `61b0ccbb-5ef2-4f6d-9508-fc087b189986` (NG1).** Own listing read for the first time.
4. **CW2 remainder:** Woodside `Wxg5EPYmElP5RHKMI9yO` and The Raven Inn `ILter889MV8bJCrPKpVh`.

Plus two artist hops from records created this run (Reason To Leave, Falling Frank) and two rule-4 website hops in CW9 (The Slow & Easy, The Leigh Arms).

## 3. Records created — all read back (§0.10)

### Artists created (7) — evidence written BEFORE each write: `data\state\enrichment-evidence-2026-09-02-spider.jsonl`

| id | name | page status | location | notes |
|---|---|---|---|---|
| `e797eea4-6683-4132-85a3-360772970509` | Reason To Leave | **VERIFIED, visited** `facebook.com/ReasonToLeavePunk` (1.4K, "Lives in Liverpool, From Merseyside") | Liverpool | Punk, originals, avatar, Instagram. Bio CLEARED under the validator gate — see §6. |
| `b93d90cc-3a7a-456b-9cde-b830ceb3369f` | Bonny Lad | **VERIFIED, visited** `facebook.com/bonnyladpunkrock` | Northern England (regional) | Bio verbatim. Page states no town; "Northern England" is the act's own words. Members of The Human Project, Bear Trade, Tripdash. |
| `7a54c697-7796-4c75-8c2d-e77b9f931349` | Guineapigs | **VERIFIED, visited** `facebook.com/guineapigstheband` | Worcestershire (regional) | Billed "Guinea Pigs". Own page name is one word — §0.20. nameVariant "Guinea Pigs". Location: `create_artist` rejected "Midlands" (LOCATION_UNRESOLVABLE). Worcester Music Festival band profile states "From: All across the Worcestershire area". |
| `9fcfe0b6-964d-47a5-9d9a-e1f74335a040` | The Hunx | **VERIFIED, visited** `facebook.com/thehunx` ("Melodic Skatepunk from Liverpool") | Liverpool | Billed "The Hunc" on the Fatsoma card; the ticket line on the same page reads "Hunx". Google `"the hunc" band` returned only The Hunch (folk, wrong act). `hunx punk band uk` returned the page first. nameVariants "The Hunc", "Hunx". |
| `0e6b19a9-ea75-49ff-9a80-380465d38f87` | Razortooth | **VERIFIED, visited** `facebook.com/razortoothpunk` | Glasgow | Punk Oi! trio. Bio verbatim (WARN whitespace only). |
| `d57949c2-18dc-4b0c-83a9-081e1067e180` | Falling Frank | **VERIFIED, visited** `facebook.com/FallingFrank` | Manchester | Instagram post names the very Salty Dog gig. Bio verbatim. |
| `9ab08c1c-7486-4985-8422-f885876039d0` | Static Kill | **VERIFIED, visited** `facebook.com/statickilluk` | UK wide (regional) | Page states no location. Foremans books national punk acts, so §0.7 national-act exception applies. Rebellion Festival 2020/2024 corroborates UK. |

### Artists reused (3)

- **Vomit `e65cd828-10f6-41d9-8a79-2b007fed45ab`** — 100% match, Staffordshire. Adjacent to Northwich (§1A.2.3).
- **Rocket 69 `6115a92d-f945-4ba5-b11b-62677b4a64d2`** — 100% match. Record says "Newcastle" and carries a `klma-stoke-gig-list` id, so it is Newcastle-under-Lyme. Adjacent.
- **Steve Ignorant's Slice Of Life `4c02476c-c7e1-4a56-8abe-074745d23618`** — 100% match, UK wide.

### Events (12)

| id | title | date | source |
|---|---|---|---|
| `143bc670-62b4-4585-8030-9ace1acd4e8a` | Reason To Leave @ The Salty Dog | 2026-09-04 | Fatsoma ga11oy98, £6 |
| `64132ab3-5c1c-4715-8892-812f767c842d` | Bonny Lad @ The Salty Dog | 2026-09-04 | same |
| `64f59074-c36e-445a-8ead-bcccc50afeb6` | Guineapigs @ The Salty Dog | 2026-09-04 | same |
| `4fd933cf-4553-42d2-9511-fdb033870003` | The Hunx @ The Salty Dog | 2026-09-04 | same |
| `922be3ea-b58e-4305-812a-1c90b037a1ab` | Vomit @ The Salty Dog | 2026-09-11 | Fatsoma 942zeug0, £9, 16+ |
| `e2efd244-d44c-43a5-bb2c-b5d4d7412dd0` | Razortooth @ The Salty Dog | 2026-09-11 | same |
| `a19ff27c-1aa8-40a7-804f-45cd7ee33850` | Rocket 69 @ The Salty Dog | 2026-09-11 | same |
| `d40f80e7-bc53-412c-99f5-1627eb138f9d` | Falling Frank @ The Salty Dog | 2026-09-19 | support to The Panel; act's Instagram |
| `5f4ae046-c778-4f50-9cc9-d3e80b921984` | Falling Frank @ The Blossoms | 2026-10-03 | act's own Fatsoma rf8r73ym, £5, 18+ |
| `5af86cf9-29de-4133-a253-08ec405b5a95` | Steve Ignorant's Slice Of Life @ Foremans Bar | 2026-12-06 | foremansbar.co.uk, doors 16:00, SOLD OUT |
| `c796774e-e523-4d0c-b5e3-844fcb06b336` | Static Kill @ Foremans Bar | 2026-12-06 | same |
| `d5f4d0f4-1517-489f-83b3-de26e565fec7` | Reason To Leave @ Peggy McCools | 2026-09-12 | act's Bandsintown diary, 19:00 |

Times: every Fatsoma row publishes an event window, not a stage time. `startTime` is the window start, `endTime` the window end, and `ticketInformation` states "stage time not published" (§0.28). Foremans publishes "Doors 4pm" — used as startTime with "Doors 16:00" in ticketInformation (§0.28 rule 2). No time defaulted.

externalIds: `{source:"spider", id:"venue-<venueId>-<date>-<artist-slug>"}` on venue-hop rows; `artist-<artistId>-<date>` on artist-hop rows. 0 events bounced 409.

### Venues

- **CREATED: Peggy McCools `748edc3f-a52a-490e-9489-a7cd4c7be4d7`** — Unit B, The Stables, Erwood St, Warrington WA2 7NW. Place ID `ChIJq2CCQJQHe0gRrmSUMfr3NAc`. Admission: grassroots music venue in a converted stables, craft bar, CAMRA-listed, live music. Reached from Reason To Leave's own diary. `search_venue` and `list_venues(city:Warrington)` (8 rows) both missed. Website, FB (verified: 2.6K, WA2 7NW), phone, ticket surface written. ⚠ The `instagramUrl` edit reported success but `socialMediaUrls` holds only Facebook on read-back — known `bv2a-venue-edit-instagramurl-param-silent-noop`.
- **EDITED: The Salty Dog** — website, facebookUrl `facebook.com/1794740184110123`, instagram, postcode CW9 5BZ, standardTicketed + Fatsoma URL. All four links taken from the venue's own site.
- **EDITED: Foremans Bar** — website, FB `ForemansBar`, instagram, postcode NG1 4AA, standardTicketed + shop URL.

## 4. Rows found and NOT written

| Row | Why |
|---|---|
| Reason To Leave, "Fastpunkers", Liverpool, 2026-11-13 | Diary names no venue. §0.23: no venue, no event. |
| Reason To Leave bill-mates at Peggy McCools 2026-09-12: Tape It Shut, Minimal Faff | Time budget. Carried in cursor. |
| Peggy McCools Fatsoma: Head Dent // Fordton Leisure // Clancy (18 Sep), Dirty Laces // John Denton (9 Oct), Slowhandclap // Cob (10 Oct); Skiddle: Fältsånger (16 Oct) | Time budget. 8 acts, all need §2A. Carried in cursor, highest priority next run. |
| Foremans Bar: Resistance 77, 2027-01-10 | Google snippet of an FB post. The FB feed is unreadable from an MCP tab (2,174 chars). No capturable evidence. Lead only. |
| Woodside: "Golden Oldies with Ryan" 30 Sep, "…with Dusty Springfield" 28 Oct | §0.5: no real act name stated. |
| The Raven Inn: Safehouse "Sun 11 Jan", Cover Story "Sun 4 Jan" | Both are January **2026** (event page reads "Sunday 4 January 2026"). Past. |
| Salty Dog: The Briefs (US), Antagonizers ATL | Standing DECISION `non-uk-touring-acts-at-uk-grassroots-venues`. Not re-raised. |

Venues examined and not created: none rejected. Peggy McCools admitted.

## 5. Deletions

**None.** Append-only behaviour (no §0.29 mode declared).

## 6. Validator

First pass: **3 FAIL**. (a) `Hardcore` genre on Reason To Leave and Bonny Lad — `create_artist`'s schema offers it, the canonical list does not. Both edited to `Punk` only. Fingerprint `genre-enum-missing-hardcore-mapping` already in the inbox. (b) Reason To Leave bio was quoted verbatim from the act's own Bandcamp page (the Facebook page carries no bio text, only a linktree). The validator requires the evidence `capturedFrom` to equal the stored facebookUrl, so a Bandcamp-sourced bio cannot pass. **Bio cleared to empty** under §6A step 8 "fix or revert". The verbatim text stays in the evidence file for a supervised session. Raised to the inbox. Second pass: **0 FAIL, 2 WARN** (Razortooth BIO_WHITESPACE; Reason To Leave empty bio with a verified page).

## 7. The metric

**Discovery saturation: 1 new venue / 11 hops = 9.1 per 100 hops.** Per district: WA2 100 (1/1, first touch), CW9 0 (0/4), NG1 0 (0/1), CW2 0 (0/2), SK2 0 (0/1). The CW9 hops produced 14 records with no new venue — rule-4 fill, which the metric cannot see (`saturation-blind-to-rule4-fill`). The artist axis found the venue; the venue axis in CW2 and CW9 websites found nothing.

## 8. Quality measure (§6)

| Class | Count |
|---|---|
| Artists created with a verified page (visited) | 7 |
| Artists created with an evidenced blank | 0 |
| Artists reused | 3 |
| Names corrected to the act's own page (§0.20) | 2 (Guinea Pigs → Guineapigs; The Hunc → The Hunx) |
| Rows skipped, with a stated reason | 7 classes (§4) |
| Gate bounces | 1 — `create_artist` LOCATION_UNRESOLVABLE on "Midlands"; resolved with the act's own festival profile |
| Validator FAIL fixed before shipping | 3 |
| Deletions | 0 |
| Partial captures | 0 |

## 9. Files written

heartbeat (started→completed) · claims/spider.json (acquire→release) · data/raw/spider/2026-09-02/captures.json · enrichment-evidence-2026-09-02-spider.jsonl (14 lines) · data/normalized/spider/2026-09-02/records.json · spider-seen.json · spider-coverage.json · spider-state.json · run-summary.jsonl (append) · 20-Daily/2026-09-02.md (create) · CTO-INBOX.md (append, 1 item) · this report
