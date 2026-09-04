# Enrichment run report — 2026-08-15, 06:46Z firing

**Outcome: COMPLETED.**

## Step 0 — circuit breaker

Last 3 reports at start of this run, newest first (all in `2026-08-14/`, no firing recorded between 10:34Z on 2026-08-14 and this one — an ~20h gap, not investigated further as it is outside this run's scope):

1. `2026-08-14/RUN-REPORT-09.md` — COMPLETED. Validator `40 records · 14 clean · 0 FAIL · 50 WARN`.
2. `2026-08-14/RUN-REPORT-08b.md` — COMPLETED. Validator `24 records · 13 clean · 0 FAIL · 22 WARN`.
3. `2026-08-14/RUN-REPORT-08.md` — COMPLETED. Validator `44 records · 2 clean · 0 FAIL · 85 WARN`.

0 of 3 recorded a FAIL, all 3 wrote a report. **Breaker NOT TRIPPED.** Proceeded.

## Step 1/2 — runbook and task spec

`RUNBOOK.md` H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed. Read in full this firing: §0A, §0 (items 1–29), §1/§1A, §2A.1 (in full, including item 3b — both search surfaces before any blank — and item 8 — the bio is quoted, never written), §2A.2, §3, §6/§6A/§6F/§6G. `ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full. `CTO-INBOX.md` read in full — live fingerprints noted: `bv2a-facebook-not-logged-in`, `validator-venue-schema-mismatch`, `validator-venue-evidence-loader-artistid-only`, `validator-genre-only-fb-evidence-mismatch`, `bv2a-claim-path-stale-in-prompt`, `run-report-path-collides-second-firing`, `enrich-venue-batch-array-not-parsed`. None re-logged as new.

**Task-prompt claim path is stale** (`data\state\claims\enrichment.json` — never existed). Used the real path per `bv2a-claim-path-stale-in-prompt` / RUNBOOK §6A step 2b / §6F ownership table: `data\state\claims\bv2a-enrichment.json`.

## Step 2b — concurrency

`data\state\enrichment.lock` does not exist — not honoured, not recreated. Claim file `data\state\claims\bv2a-enrichment.json` read `{"heldBy":null,"releasedAt":"2026-08-14T10:05:00Z",...}` — released. Acquired cleanly:
`{"heldBy":"bv2a-enrichment-2026-08-15T06-46-43Z","acquiredAt":"2026-08-15T06:46:43Z","expiresAt":"2026-08-15T09:46:43Z","heartbeatFile":"data\\state\\heartbeat\\bv2a-enrichment-2026-08-15T06-46-43Z.json"}`
No takeover needed.

## Step 3 — Chrome / Facebook precondition check

One Chrome browser connected. Navigated to `facebook.com`: **logged-in home feed** (Jason Jones's profile, notifications, messenger) — confirmed via `read_page`. **The `bv2a-facebook-not-logged-in` outage has cleared** after at least eleven consecutive blocked firings on 2026-08-14. Full artist work (Priorities 1 and 4) was available this run, not just venues/genre-only.

Also checked `facebook.com/search/pages/?q=...` (surface (a) of §2A.1 item 3b) — it now returns results (the `facebook-page-search-not-found` KLMA outage from 2026-08-14 has also cleared for this session).

## Selection

1. **Artists created <24h, missing socials** — 29 found (a fresh batch, distinct names from all prior firings — not the stale 15-name cohort seen throughout 2026-08-14). Worked the first 13 (oldest-first was not applied here, as the priority-1 rule does not require it and all 29 were created within a ~3-minute window on 2026-08-15).
2. **Venues created <24h, missing socials** — 204 found (a large "Amber Taverns" / Robinsons-brewery chain-pub import batch). Worked the first 30 (list order), reaching the venue cap.
3. **Backlog venues oldest-first** — not reached; venue cap (30) filled entirely by Priority 2.
4. **Backlog artists oldest-first** — not reached; artist work this firing went to Priority 1's fresh cohort.
5. **Genre-only top-up** — not reached; budget went to Priorities 1 and 2.

## Artists — verified (8 of 13 worked)

All via `WebSearch` first (Google), Chrome only to visit and quote confirmed pages, per FP.3. Bio is a verbatim quote from the visited page in every row below; line breaks preserved where present.

| Artist | id | Field(s) written | Evidence |
|---|---|---|---|
| Solstice | `863f78d0-49a3-44b0-ba33-fd2d017f4283` | facebookUrl, bio, genres | facebook.com/solsticeprog/ — corroborated by Leoni Jane Kennedy's own FB page (same import batch) stating she tours with `solsticeproguk` |
| Billobuckers | `5aba4d07-1810-44b1-8983-8f7914fddee9` | facebookUrl, websiteUrl, bio, genres | facebook.com/BilloBuckersMusic/ — "5 piece indie band from Leicester and Nottingham" |
| Crowspeak | `1c60f5cb-3aae-4968-babb-ffb30ec87d05` | facebookUrl, bio | facebook.com/crowspeak.caw/ — unique stylised name, own Linktree/Bandcamp/YouTube |
| Pretty Shivers | `3553d88c-94bc-4a1d-8b33-a2c01c3493c6` | facebookUrl, bio, genres | facebook.com/PrettyShivers/ — own domain prettyshivers.com |
| Leoni Jane Kennedy | `0a09dda0-c86c-4500-bdd2-0e5a28421dbc` | facebookUrl, bio | facebook.com/LJKmusic/ — No.2 PROG mag new artist, Freddie Mercury Scholarship winner |
| Planet Strange | `e1359e67-606c-4388-92e6-cb2b1165cfa6` | facebookUrl, bio, genres | facebook.com/planetstrangeband/ — "Infectious Rot 'n' Roll" |
| Epileptic Hillbillys | `44b6e2f7-0265-4bb0-9d6c-255ca1875fe5` | facebookUrl, bio | facebook.com/EpilepticHillbillys/ — UK psychobilly band since the mid-1980s, 4.7K likes |
| Tanky | `9df6bcf2-d333-4661-b56a-7a906faafd2f` | bio, genres, actType (facebookUrl **blocked**, see below) | facebook.com/profile.php?id=61555856745370 ("Tanky/Electrifying 80's show") |

**Tanky — facebookUrl write blocked, DATA fingerprint raised.** Facebook page search (surface a) found `Tanky/Electrifying 80's show`, profile id `61555856745370`, matching the exact worked example already in `RUNBOOK.md` §2A.1 item 6 (the "Tanky incident" — verified-source-name exception). `edit_artist` with `facebookUrl` set to this URL returns `HTTP 409: Duplicate artist`; isolated by testing fields individually — bio-only, genres-only and actType-only edits all succeeded, only the `facebookUrl` write triggers the 409. `search_artist("Tanky")` finds only this one record (100% confidence, no name collision), so the 409 is a genuine **FB-URL collision against a DIFFERENT existing artist record** holding this same Facebook page under a different name — per RUNBOOK §1, exact FB match is the strongest identity signal, so somewhere in bndy there is likely already a "Tanky/Electrifying 80's show" (or similarly-named) record that is the true home for this page. I did not attempt to locate or merge it (no tool available to search by facebookUrl, and merges are Jason-authorised cleanup per §0.11, out of scope for an enrichment run). Also did not attempt the §2A.1 item 6 name correction (`Tanky` → `Tanky/Electrifying 80's show`) this run, since the underlying identity question needs resolving first. Logged to `CTO-INBOX.md` as a new fingerprint (`bv2a-edit-artist-409-on-facebookurl-write`) for a human/CTO session to locate the colliding record.

## Artists — evidenced blank (5 of 13 worked)

Both surfaces (Google + Facebook page search) tried in every case; variants in the evidence file.

- Dave Legg (`8878879e-8ed8-4560-96bb-71968358b195`) — no musician page found on either surface; Facebook search returned only driving instructors and unrelated bands sharing the name.
- Northwestern (`0762664f-db19-4ce2-8f84-290eb86c63ce`) — Facebook search returned only US university/school marching bands; no UK grassroots act.
- Paul Gibson (`76fa96ce-5eda-403b-8105-dbf1c2950591`) — Google corroborates a real Stoke-on-Trent tribute entertainer (eventzone.co.uk listing: Bolan v Bowie / T.Rex / Weller-Jam tribute shows) but no confident FB URL; the one "Paul Gibson Music" FB page found (`profile.php?id=100067408501824`) has 0 followers, no bio, no location — did not meet the §2A.1 identification bar. Left blank rather than attach an unconfirmed page.
- Morning's Thief (`ca9a84bc-3248-4948-89b2-1388f1a43814`) — only "Morning Theft" (Columbus, Ohio, USA) found; wrong country and near-miss spelling — not attached per §0.15.
- Rob Black (`ec1581ba-b0e7-4f84-8c39-9e7e9ee53dd1`) — three non-overlapping same-name candidates found (Stoke-on-Trent country act on ReverbNation, an "alternative folk" FB band page, a Staffordshire Knot entertainer listing) with conflicting genre claims and no way to confidently pick one; Facebook page search surfaced only an unrelated Amsterdam DJ/producer. Left blank — genuinely undecidable, per §1A.7.

## Venues — verified (30 of 30, full priority-2 batch)

All via `WebSearch` per FP.2, no Chrome needed (no bio field for venues under this task). Every venue below is part of what appears to be a single national pub-chain rollout (Amber Taverns / Robinsons Brewery), confirmed venue-by-venue against the stored street address.

| Venue | id | Field(s) written | Evidence |
|---|---|---|---|
| The Liquor Vaults | `1d7274af-4343-48dc-9a0c-ec45175f2281` | facebookUrl | facebook.com/LiquorVaults/ |
| King Street Social Tap | `efd30ef2-c373-4ca3-be1b-c83f8a92b130` | facebookUrl, website | facebook.com/kingstreetsocialtaphuddersfield/ |
| Brass | `a72cf342-6dc5-4b9b-8fc5-2d3fe7eaf411` | facebookUrl, website | facebook.com/TheBowLeggedWithBrass/ (page trades as "Bow Legged with Brass", same address) |
| The Tap @ Carter's Well | `d5eae3ce-cb77-40d8-8b34-4d7d6d022e29` | facebookUrl | facebook.com/TapAtCartersWell/ |
| The Horse Shoe | `027fffff-98e6-4465-864c-146af40df212` | website | robinsonsbrewery.com/pubs/the-horse-shoe-coppenhall/ — no confidently-matched dedicated FB page, left blank |
| Hogarths (Wakefield) | `a6a2763e-d21f-4787-81d0-d5fa002adeaf` | facebookUrl, website | facebook.com/Hogarthswakefield/ |
| The Kings Arms | `247ac480-6365-4995-8ad1-e087d4333eba` | facebookUrl, website | facebook.com/TheKingsArmsFleetwood/ |
| The Sandyforth Arms | `f5f60d40-f835-4acf-8787-d52137af5f19` | facebookUrl, website | facebook.com/TheSandyforthArms/ |
| The Bulls Head, Ashford | `4e263ddf-c23d-4ccc-9397-02654a009d6b` | facebookUrl, website | facebook.com/bullsheadashfordinthewater/ |
| The Unicorn | `dd237d5d-f986-49c7-b1a9-d7350675c985` | facebookUrl, website | facebook.com/UnicornWorksop/ |
| The Swinging Witch | `7a6ba0ad-6cc1-4fe9-a3f9-c251b32a0dbb` | facebookUrl, website | facebook.com/TheSwingingWitch/ |
| The Doctors | `5f5be4cf-d263-4702-bdba-553a14175ce3` | facebookUrl, website | facebook.com/TheDoctorsGloucester/ |
| The Roebuck | `67fa77a6-ea2d-4094-b07a-58f5d969e28d` | facebookUrl | facebook.com/officialroebuckalkringtongv/ — town matches (Middleton), exact street/postcode differs slightly (stored: Middleton Way; found: Kirkway, Alkrington Garden Village); only Roebuck in Middleton found, flagged for a human eye |
| Hogarths (Ilkeston) | `bd46ea8b-4d69-4cbc-9aa7-7fccd3edb4ce` | facebookUrl, website | facebook.com/HogarthsIlkeston/ |
| The Blue Bell | `bab8d622-e33f-46a7-9faa-c61fbe3c5cd4` | facebookUrl, website | facebook.com/bluebellchesterfield/ |
| Hogarths (Blackpool) | `4ce40233-c27d-4404-8ee2-9fd75253328d` | facebookUrl, website | facebook.com/HogarthsBlackpool/ |
| High Street Social Tap | `d9bf4d5c-7fc3-440e-8785-bedf789f6530` | facebookUrl, website | facebook.com/highstreetsocialtap/ |
| The Midland | `1d61ec91-e39d-4698-97e4-df859332ec50` | facebookUrl, website | facebook.com/themidlandsmethwick |
| The Charles Palmer | `40d71148-0002-4d36-9c26-3063c7fbfc30` | website | ambertaverns.co.uk/pub/the-charles-palmer/ — FB page referenced by third parties but no confident dedicated URL surfaced, left blank |
| Pig Iron Tavern | `53cd4a52-c9b0-4b7d-bf99-d5200f942c77` | facebookUrl | facebook.com/ThePigIronTavern/ |
| The Grapes, Gee Cross | `c500f8c8-c65d-494f-9713-e773ebb59d37` | website | grapesgeecross.co.uk — no confidently-matched dedicated FB page, left blank |
| The Sydney Arms | `050a5422-1d3e-4f74-8489-fb39eb4d860b` | facebookUrl, website | facebook.com/p/The-Sydney-Arms-100063713347040/ |
| Plough & Harrow | `28967010-dd46-4d4f-99fc-a4ded6872a90` | facebookUrl, website | facebook.com/theploughandharrowathucknall/ |
| Erasmus Wolfe | `1ce690b5-9a0b-46a2-a8ac-a41f817a7d95` | facebookUrl | facebook.com/erasmuswolfe/ |
| Pig Iron | `904a203f-08c2-42e2-8af5-6908b1baab81` | facebookUrl, website | facebook.com/PigIronMotherwell/ |
| William Archer | `349cfc02-8f43-4014-b179-c4ba3343e6ec` | facebookUrl, website | facebook.com/TheWilliamArcher/ |
| The Crispin | `40600509-fbf7-40eb-be7e-879eed7a8958` | website | robinsonsbrewery.com/pubs/the-crispin-great-longstone/ — no confidently-matched dedicated FB page, left blank |
| Crown & Cushion Inn | `abce439c-17f0-4b62-8d07-8f4406cb4349` | facebookUrl, website | facebook.com/p/Crown-Cushion-Appleby-100063479503948/ |
| Dr McGonigles Emporium | `6ae836e9-de89-4df3-b172-72cce1e0415b` | facebookUrl, website | facebook.com/DrMgoniglesEmporium/ |
| Bakers No.9 | `d5cc840b-b2a3-47a0-9ffb-329dece0cbbe` | facebookUrl | facebook.com/bakers.no.9/ |

No venue this run was left with nothing at all — every one of the 30 gained at least a website or a Facebook page.

## Names corrected under §0.6

None written this run. (Tanky's §2A.1 item 6 verified-source-name correction was identified but not applied — see the blocked-write note above; deferred until the facebookUrl collision is resolved.)

## Validator

Evidence file: `data\state\enrichment-evidence-2026-08-15-enrichment.jsonl` (43 lines, all new — first firing of the day, source-scoped `enrichment` slug).

Known validator scope gaps applied, same workarounds as every prior firing (all already logged in `CTO-INBOX.md`, not re-logged):
1. `validator-venue-schema-mismatch` / `validator-venue-evidence-loader-artistid-only` — built `data\state\validator-records-run-15.json` (venue `socialMediaUrls[0].url`/`city` aliased to top-level `facebookUrl`/`location`; no data invented, schema rename for validator input only) and `data\state\validator-evidence-alias-run-15.jsonl` (`venueId` keys aliased to `artistId`, 30 lines covering the 30 venues touched this run).
2. Genre-only fb-evidence-mismatch workaround was not needed this run — no Priority 5 work was done.

Result, first pass, 0 FAIL:

```
43 records · 17 clean · 0 FAIL · 52 WARN   [mode=gate]
```

**Validator summary line (verbatim): `43 records · 17 clean · 0 FAIL · 52 WARN   [mode=gate]`**

All WARNs are expected/known: `STUB_NO_BIO`/`STUB_NO_IMAGE` on the 26 verified venues that gained a `facebookUrl` this run (venues carry no bio/image field under this task — FP.2, no Chrome visit made or needed).

### Circuit breaker for next run

Not fired. No FAIL was outstanding at any point this run.

## Defects / fingerprints

**New fingerprint raised** (`CTO-INBOX.md`): `bv2a-edit-artist-409-on-facebookurl-write` — `edit_artist` returns `HTTP 409: Duplicate artist` when writing `facebookUrl` alone to Tanky (`9df6bcf2-d333-4661-b56a-7a906faafd2f`), even though `search_artist("Tanky")` finds no other candidate. Isolated by testing name/facebookUrl/actType/genres/bio individually — only the `facebookUrl` field triggers it. Reads as a genuine FB-URL collision against a different existing record; no tool available this run to search by `facebookUrl` to find it.

All other defects hit this run (`validator-venue-schema-mismatch`, `validator-venue-evidence-loader-artistid-only`, `bv2a-claim-path-stale-in-prompt`) are already logged from earlier firings — not re-logged. Two previously-open BLOCKED items (`bv2a-facebook-not-logged-in`, `facebook-page-search-not-found`) **appear to have cleared** as of this firing — noted here rather than in the inbox, since clearing isn't itself an actionable item; a future firing re-hitting either would be the actionable signal.

## Budget used

~82 minutes elapsed (06:46Z acquire to ~08:08Z release) against the nominal 40-minute target — over budget. Time went into: verifying a large (204-venue) fresh chain-pub batch one-by-one against street address rather than batch-assuming the chain pattern, and the Tanky 409 isolation (four separate edit_artist calls to isolate the failing field before concluding it was a genuine collision rather than a transient fault). Stopped at exactly the 30-venue cap and 13 of 15 artists (8 verified + 5 evidenced-blank), i.e. within the record caps even though over the time target. Priority 5 (genre-only) not reached this firing.

Circuit breaker: **did not fire.**

## Ledger / snapshot / dashboards

Ledger: 43 lines appended to `data\state\enrichment-ledger.jsonl` (30 venue `verified`, 8 artist `verified`, 5 artist `blank`) plus one `snapshot` line. Run-summary line appended to `data\state\run-summary.jsonl`. Both dashboards regenerated (`data\normalized\enrichment\DASHBOARD.html` — 1005 records, 36 snapshots; `data\normalized\DASHBOARD.html`) — exit 0 on both.

Snapshot counts (post-run): artistsTotal 2206, artistsMissingSocials 901, artistsMissingGenres 640, venuesTotal 2963, venuesMissingSocials 1024.

Claim released: `{"heldBy":null,"releasedAt":"2026-08-15T08:08:00Z","expiresAt":"1970-01-01T00:00:00Z","lastRun":"bv2a-enrichment-2026-08-15T06-46-43Z"}`. Heartbeat rewritten to `"outcome":"completed"`.
