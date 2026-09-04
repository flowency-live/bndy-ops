# spider — RUN REPORT 2026-09-03

**Run id:** `spider-2026-09-03T01-04-59Z`
**Runbook read:** v2.27. **Floor asserted:** §6A CURRENT FLOOR v2.19. **PASS.** The prompt states no number.
**Outcome:** COMPLETED.
**Records written to bndy and read back: 23** — 11 events, 11 artists, 1 artist enrichment edit (Fordton Leisure bio, emoji forced a post-create edit).
**Validator: 11 records · 7 clean · 0 FAIL · 4 WARN** (STUB_NO_BIO on four verified pages that carry no bio text — see §3).

## 1. Gates

| Step | Result |
|---|---|
| §6A.0 heartbeat | `data\state\heartbeat\spider-2026-09-03T01-04-59Z.json`, written first. |
| §6A.1 date | Shell up. `2026-09-03`, 01:04Z. |
| §6A.2 runbook + spec | Both read in full. CTO-INBOX spider fingerprints read. No daily note for 2026-09-03 existed at start. |
| §6A.2a floor | v2.27 ≥ v2.19. PASS. |
| §6A.2b claim | Released (`heldBy: null`, lastRun spider-2026-09-02T01-05-07Z). Acquired 01:05:10Z, TTL 60 min. Previous heartbeat reads `completed`. No takeover. |
| §6A.3 tools | bndy MCP reachable. Chrome connected, Facebook session live (act pages read with bio and location). Google reachable. Shell up, validator ran. |
| §6A.5 snapshot | Not applicable. Discovery source. |
| §5.4 tombstones | `data\state\cancellations.jsonl` grepped for Peggy McCools: 0 lines. No match on any artist+venue+date written. |
| §0.29 mode | Spec declares no mode. Behaved append-only. Fingerprint `spider-mode-not-declared` already in the inbox. |

## 2. Seeds and district

Cursor priority (1): **Peggy McCools, Warrington `748edc3f-a52a-490e-9489-a7cd4c7be4d7` (WA2)**, rule-4 venue seed created 2026-09-02, own listing never read. Fatsoma page re-read live: **4 bills** (a fourth, Seas of Mirth // Pray for Mojo // Bossmags on 2026-10-17, appeared since yesterday's capture). Plus the Skiddle row (Fältsånger 2026-10-16) and the Bandsintown bill-mates for 2026-09-12 from yesterday's capture. Capture: `data/raw/spider/2026-09-03/captures.json`.

Cursor priority (3), one hop: **Castle Sports & Social Club, Northwich (CW9)** `castlesportsandsocialclub.com/events` — the events page is EMPTY (opening times only). 0 gigs.

Cursor priority (2) Foremans Bar / Resistance 77: not reached on budget.

## 3. Records created — all read back (§0.10)

### Artists created (11) — evidence written BEFORE each write: `data\state\enrichment-evidence-2026-09-03-spider.jsonl`

| id | name | page status | location (source) | notes |
|---|---|---|---|---|
| `432432da-94eb-482f-917a-55327a654ad6` | Head Dent | **VERIFIED, visited** `facebook.com/abandcalledheaddent` (370) | Staffordshire, regional (own page) | Bio verbatim. Punk, originals. |
| `26364963-a5d8-4f18-a475-a0b8a8c4e46f` | Fordton Leisure | **VERIFIED, visited** `facebook.com/61560237753297` (86) | Warrington (Warrington Worldwide 2026-04-14; Working Noise; page states none) | Bio verbatim via `edit_artist` — create rejects emoji (`create-artist-500-emoji`). |
| `a5310521-b4a6-4e6e-aae0-3ee6d37e9cbd` | Clancy | **EVIDENCED BLANK on Facebook.** Instagram `clancyband_` (381) attached | Warrington (own Instagram: "Alt rock Warrington UK") | The only FB candidate (`people/Clancy/61592053551810`) has 2 followers, no bio, no location — fails §2A.1. Variants: `"clancy" band warrington`, `clancy band warrington facebook`. |
| `a6d58f67-1bc1-48be-b644-a58d997dcd0d` | Dirty Laces | **VERIFIED, visited** `facebook.com/DirtyLacesBand` (3.2K) | Manchester (own Instagram header) | Page carries no bio text → empty (WARN). `review` on Dirty DC/Deeds/Money/Riffs — different names, `confirmNew` per §1A.7. |
| `b99ff08b-66c7-43d6-a4e2-357d6eb42e7f` | John Denton | **VERIFIED, visited** `facebook.com/JohnDentonMusic10` (181) | Manchester (own page) | Bio left EMPTY by choice: the page text states a child's age. Louder Than War review 2026-06-28. `review` on Josh Wheaton Band/John Doe Trio — `confirmNew`. |
| `7157c0cf-772a-4365-809a-4e685ca68cea` | SlowHandClap | **VERIFIED, visited** `facebook.com/slowhandclap` (983) | Manchester (own Bandcamp) | No bio on page → empty (WARN). Name per own page casing. |
| `34f632ff-56d7-4e1c-ae0b-7b57bfdc6387` | Seas of Mirth | **VERIFIED, visited** `facebook.com/seasofmirth` (4.6K) | Nottingham (own Instagram header) | Bio verbatim (a PROG quote, which is the page's own bio text). Own site seasofmirth.com. |
| `3ac2287e-7ce7-4dc1-8922-6b33c76731af` | Bossmags | **VERIFIED, visited** `facebook.com/61585275076270` (213) — the page states its previous page was hacked | North West UK, regional (own YouTube channel: "based mostly in NW") | Bio EMPTY: page text is a hack notice. Name per own Bandcamp/Instagram "BOSSMAGS"; FB name "B O S S M a G S" stored as variant. |
| `7880b438-bc82-4d99-91dd-52c5be2f63de` | Tape It Shut | **VERIFIED, visited** `facebook.com/TapeItShut` (1.1K) | Reading (own Instagram) | Bio verbatim. Touring act at an in-region venue; `allowDistantVenue`. |
| `bd30e2c4-983f-4c3d-a8cb-361faf191980` | Minimal Faff | **VERIFIED, visited** `facebook.com/people/Minimal-Faff/61586857817546` (274) | Manchester (own page) | Bio verbatim. Punk, Ska. trio. |
| `19d4985d-7e25-404f-a125-cd594d77c017` | Fältsånger | **VERIFIED, visited** `facebook.com/faltsanger` (320) | Warrington (own site fieldsongs.co.uk) | Bio verbatim. duo. |

### Artists reused (1)

- **Pray For Mojo `39dea3a6-b749-44c8-a711-aa99168b9ccc`** — 100% match, Warrington. Same town.

### Events (11) — all at Peggy McCools `748edc3f-a52a-490e-9489-a7cd4c7be4d7`

| id | title | date | start | source |
|---|---|---|---|---|
| `e0afe65f-7446-4a2c-8e4d-63450328f14c` | Tape It Shut @ Peggy McCools | 2026-09-12 | 19:00 | Bandsintown 108850827 (Greebos) |
| `044e2771-6439-4b42-8bc7-d813352857bd` | Minimal Faff @ Peggy McCools | 2026-09-12 | 19:00 | same |
| `2655f487-3f91-4e84-a1a7-321969122f2a` | Clancy @ Peggy McCools | 2026-09-18 | 20:00 stage | Fatsoma 7cg7g6u8, £7 |
| `13f98c2f-8c25-4d7d-bb9a-d97d3b18f651` | Fordton Leisure @ Peggy McCools | 2026-09-18 | 21:00 stage | same |
| `9a0753d9-0b47-4828-ac42-ca69032e9c64` | Head Dent @ Peggy McCools | 2026-09-18 | 22:00 stage | same |
| `cfed2601-6135-41b3-b78f-3279e8dbd436` | Dirty Laces @ Peggy McCools | 2026-10-09 | 19:00 window | Fatsoma xu5yljyz, £6 |
| `37a9221b-a079-4845-b2b6-401be6d8a9b5` | John Denton @ Peggy McCools | 2026-10-09 | 19:00 window | same |
| `55bb81af-4b9d-4b94-976f-6dace9578251` | SlowHandClap @ Peggy McCools | 2026-10-10 | 20:30 stage | Fatsoma bepoyqqp, £7 |
| `f28ebf1d-d5c5-4887-bb37-f83f0c3ca401` | Fältsånger @ Peggy McCools | 2026-10-16 | 19:30 | Skiddle 42665597 |
| `aae72220-0170-4211-aeca-c8d676f227fc` | Seas of Mirth @ Peggy McCools | 2026-10-17 | 20:00 stage | Fatsoma vf2d8zbd, £7-£9, 18+ |
| `0c8d53e2-4dd9-40f3-a6af-cefbc55b0c27` | Pray For Mojo @ Peggy McCools | 2026-10-17 | 20:00 stage | same |
| `2e1e6e58-7822-4b50-88d5-ce05b09486fd` | Bossmags @ Peggy McCools | 2026-10-17 | 20:00 stage | same |

Times (§0.28): the 18 Sep bill publishes per-act stage times — used. 10 Oct publishes "Start 8.30 pm" — used, doors in `ticketInformation`. 17 Oct publishes "Music from 8pm" — used. 9 Oct publishes only a 19:00-00:00 window — window start used, `ticketInformation` states "stage time not published". 12 Sep: Bandsintown 7:00 PM. No time defaulted.

externalIds: `{source:"spider", id:"venue-<venueId>-<date>-<artist-slug>"}`. 0 events bounced 409. 0 tombstone hits.

## 4. Rows found and NOT written

| Row | Why |
|---|---|
| **Cob**, 2026-10-10 (support to SlowHandClap) | Unresolvable. Google `"cob" band warrington`, `"cob" band manchester peggy` return only the 1970s folk act C.O.B. (Clive's Original Band) and unrelated pages. No page, no location. §0.7: no resolvable location, no create. Skipped; the next run retries. |
| Castle Sports & Social Club events page | Empty. 0 rows. |

Venues examined and not created: none. No new venue this run.

## 5. Deletions

**None.** Append-only behaviour (no §0.29 mode declared).

## 6. Validator

`11 records · 7 clean · 0 FAIL · 4 WARN [mode=gate]`. The four WARNs are STUB_NO_BIO on Dirty Laces, John Denton, SlowHandClap and Bossmags. Dirty Laces and SlowHandClap pages carry no bio text. Bossmags' page text is a hack notice. John Denton's bio was left empty by choice (a child's stated age). All four are recorded in the evidence file.

## 7. The metric

**Discovery saturation: 0 new venues / 2 hops = 0 per 100 hops.** Per district: WA2 0 (0/1, but 22 records of rule-4 fill — `saturation-blind-to-rule4-fill`), CW9 0 (0/1). Peggy McCools is a new venue found yesterday on the artist axis; its own surface yielded 11 gigs and 11 acts in one hop. That is the rule-4 pattern the spec predicts.

## 8. Quality measure (§6)

| Class | Count |
|---|---|
| Artists created with a verified page (visited) | 10 |
| Artists created with an evidenced blank (Facebook) | 1 (Clancy — Instagram attached) |
| Artists reused | 1 |
| Bios quoted verbatim | 6 |
| Bios empty with a verified page | 4 |
| Names taken from the act's own page rather than the billing | 4 (Head Dent casing, SlowHandClap casing, Bossmags spelling, Fältsånger diacritics) |
| `review` verdicts resolved with `confirmNew` under §1A.7 | 2 |
| Rows skipped, with a stated reason | 1 (Cob) |
| Gate bounces | 0 |
| Validator FAIL | 0 |
| Deletions | 0 |
| Partial captures | 0 |

## 9. Files written

heartbeat (started→completed) · claims/spider.json (acquire→release) · data/raw/spider/2026-09-03/captures.json · enrichment-evidence-2026-09-03-spider.jsonl (11 lines) · data/normalized/spider/2026-09-03/records.json · spider-seen.json · spider-coverage.json · spider-state.json · run-summary.jsonl (append) · 20-Daily/2026-09-03.md (create) · this report. CTO-INBOX.md: nothing appended — no new item.
