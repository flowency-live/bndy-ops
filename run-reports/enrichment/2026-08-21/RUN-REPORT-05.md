# Bv2a Enrichment — RUN-REPORT-05 — 2026-08-21

**Run id:** `bv2a-enrichment-2026-08-21T05-19-46Z`. **Outcome: completed.**

- **Circuit breaker (Step 0):** did not fire. Last 3 reports (2026-08-21 firings 02, 03, 04) each closed at 0 FAIL and each wrote a report.
- **Runbook:** read in full. H1 `v2.27` ≥ CURRENT FLOOR `v2.19` (§6A). ENRICHMENT-TASK-v3.md §0.0 and §FP read. CTO-INBOX.md fingerprints read/grepped — standing flags respected (see Records skipped and Defects).
- **Concurrency:** `data\state\claims\bv2a-enrichment.json` was released (`heldBy: null`, `lastRun: bv2a-enrichment-2026-08-21T04-18-42Z`). Acquired at 05:19:46Z, TTL 3h per §6G, released on completion at 05:45:00Z. The stale `enrichment.lock` prompt-step (superseded by §6A step 2b / §6G) was not honoured or recreated — none was found on disk.
- **Tools:** bndy MCP reachable (confirmed via `list_venues`). Chrome: exactly one connected browser, logged into Facebook (confirmed via `facebook.com` page text showing "Create a post... Jason").

## Selection

Tier 1 — artists created in the last 24h missing socials: 212 candidates (`createdSince` passed as an explicit ISO timestamp, computed as `now - 24h`, per the standing `list-artists-createdsince-24h-string-not-parsed` defect — the literal string `"24h"` does not parse). Cross-checked against today's 192 already-touched ledger ids (firings 00–04). The 15 oldest untouched candidates were all part of the same **swanblues festival-lineup batch** (created 2026-08-20T09:24–09:25Z) that firing 04 had begun working — confirmed as genuine 2026 Swanage Blues Festival acts against the festival's own lineup page (`swanage-blues.org`) before searching each individually.

Tier 2 — venues created in the last 24h missing socials: re-pulled, 7 candidates, **all already excluded or touched by prior firings today** (`Market Place`, `The Old Lockup`, `Bunker` — standing flags; `Willenhall Memorial Park`, `Bumble Hole Local Nature Reserve` — §0.23 not fixed buildings; `The New Three Tuns Pub`, `Eastwood & District Conservative Club Ltd` — already recorded blank by firing 04). Zero usable tier-2 candidates.

Tier 3 — backlog venues missing socials, oldest `createdAt` first: pulled all 54 backlog candidates. Excluded before searching: `Darcy's` (closed, standing flag), `The Nest` (hair-salon-address flag, also touched today), `White Lodge` (wrong-entity flag), `The Decorated Dead Tattoo Studio` / `West End Club` / `Hayfield Club` / `Jubilee Inn` / `The Saracens Head` (touched today), `Ann Welfare Playing Fields` / `West Park, Long Eaton` / `Madeley Carnival` / `Jubilee Park, Horndean` / `Campbell Park` / `Castle playing fields` / `Prestwood Recreation Ground` / `Bowling Green Stage, Nantwich Food Festival` / `Hunstanton Bandstand` / instow-beach postcode-named venue (§0.23, not fixed buildings), `Venue TBC` / `1865, 1 Carlton Pl` / `Okehampton Show ground` / `Annitsford Welfare Club` (standing address/postcode-mismatch flags), `Marsden Social Club` (touched today). Also excluded on sight as bad data, not searched: **`Jorge Wilson + Jesse James`** (name reads as an artist billing, not a venue; city field "Staffordshire" does not match its Salford business-complex address) and **`United match)`** (malformed name; address is Old Trafford football stadium, not a grassroots venue). Selected the **20 oldest** remaining candidates (oldest: `The Railway`, Stockport, created 2025-09-25); one (`Bridgnorth Castle and Gardens`) was not reached inside the time budget, leaving 19 actually worked.

Tier 4/5 (backlog artists, artists missing genres with a facebookUrl) were **not reached** — tier 1 alone filled the 15-artist cap.

## Records with a verified page

**Artists (6 of 15):**

| Artist | Facebook / Website | Notes |
|---|---|---|
| Jack-Austin Despy Blues Band | facebook.com/JackAustinDespy.org/ | Bio quoted verbatim from the page's own header line |
| Mighty Howlers | facebook.com/themightyhowlers/ · themightyhowlers.co.uk | Page states "Cornwall · Truro" — **location corrected Swanage → Truro** per the act's own page overriding the gig-town guess (§2A.1 item 3 / §2A.3) |
| Thomas Heppell Band | facebook.com/ThomasHeppellOfficial/ · thomasheppell.com | Page is titled "Thomas Heppell" (covers solo and band formats per web corroboration); bndy's "Band" naming matches the festival's own lineup distinction from "Thomas Heppell Solo", so not renamed |
| Fran McGillivray Band | facebook.com/franmcgillivrayband/ · franmike.com | Bio quoted verbatim; genres Blues/Americana and actType originals corroborated by web search describing "original songs, blues and Americana" |
| Jon Amor Trio | facebook.com/JonAmorTrio/ | Full bio incl. lineup quoted verbatim with line breaks preserved; genres Blues/Funk/Rock taken directly from the bio's own "original Blues/Funk/Rock" line |
| Blue Touch | bluetouch.info (website only) | No confidently-canonical Facebook page found (multiple same-name unrelated bands); the act's own website confirms "We are confirmed for the Swanage weekend in October for the Grand Hotel andf the White Swan" — both venues already live in bndy, corroborating the identity. Bio quoted verbatim from the website. |

All writes verified by the `edit_artist` response echoing the updated fields.

**Venues (10 of 19 — 9 with Facebook and/or website, 1 website-only):**

| Venue | Website | Facebook |
|---|---|---|
| Bay View (Brixham) | — | facebook.com/bayvbar1/ |
| Dicey Reilly's (Teignmouth) | — | facebook.com/dicey.reillys.9 |
| Reubens 46 (Congleton) | reubensbarandbbq.com | facebook.com/Reubens46/ |
| The Bell on Mulnestrete (Congleton) | thebellonmulnestrete.co.uk | facebook.com/61574393053357/ |
| Bassa Villa Bridgnorth | bassavilla.co.uk | facebook.com/Bassavillabridgnorth/ |
| White Lion (Bridgnorth) | whitelion-bridgnorth.co.uk | — (two competing FB pages found, `FriarsBridgnorth` and `Whitelioninnbridgnorth`, not confidently disambiguated — left blank rather than guess) |
| Crown (Bridgnorth) | crownpubbridgnorth.co.uk | facebook.com/crown.bridgnorth/ |
| Marsden Royal British Legion | — | facebook.com/MarsdenRBL/ |
| De Valence Pavilion (Tenby) | devalencepavilion.com | facebook.com/devalencepavilion/ (page hosts video from the Tenby Blues Festival held at this venue, corroborating) |
| The Royal Oak Hollywater (Bordon) | — | facebook.com/p/The-Royal-Oak-Hollywater-100071508158925/ (corroborated: "Every Saturday there is a band on, all on their purpose-built stage") |

All writes verified by the `edit_venue` response echoing the updated fields.

## Records recorded as an evidenced blank

**Artists (8 of 15)** — both surfaces attempted where Chrome was warranted (Google throughout; Facebook's own page search confirmed still broken this firing, see Defects):

| Artist | Variants tried | Note |
|---|---|---|
| Fat Finger | "Fat Finger blues band facebook"; `facebook.com/search/pages/?q=` (blocked, no text content) | Multiple unrelated same-name bands found (Little Eddie and the Fat Fingers, psychedelic-rock Fat Fingers); none evidenced as the Swanage act |
| Rich Miller | "Rich Miller blues facebook" | Multiple different people named Rich Miller in blues/music; no single confident match |
| Yabooty | "Yabooty band facebook" | Only "Yabu Band" (Australian) and "Jabooty" (unrelated project) found — rejected, not a match |
| Adam Norsworthy & Nigel Feist | "Adam Norsworthy Nigel Feist blues facebook" | Adam Norsworthy (of The Mustangs) has only a personal profile (facebook.com/adam.norsworthy) — §2A.1 item 4 excludes personal profiles; no dedicated duo page found |
| Ben White & Thomas Lucas | "Ben White Thomas Lucas blues facebook" | Young Chicago-blues duo confirmed via YouTube/event listings, but no dedicated Facebook page found — only third-party event posts |
| Kaspar & Lucy | "Kaspar Berry Rapkin Lucy blues facebook" | Candidate page `facebook.com/KBRBlues/` visited — confirmed as Kaspar's **solo** project page, no mention of Lucy anywhere in About or recent posts; fails the identification bar for this specific duo act |
| Ray Drury & Jon Walsh | "Ray Drury Jon Walsh blues facebook" | Candidate page `facebook.com/jonwalshblues/` visited — this is Jon Walsh's own page (associated with the separately-billed "Jon Walsh Blues Dogs", already a distinct bndy record enriched by an earlier firing today), no mention of Ray Drury; fails the identification bar for this specific duo act |
| Hot Tamales | "Hot Tamales blues band facebook"; "The Hot Tamales West London duo blues Swanage facebook" | Candidate page `facebook.com/thehottamalesmusic/` visited — describes a **three-vocalist** act, contradicting the "West London duo" description found via search; no Swanage/UK-location confirmation on the page. Multiple other same-name "Hot Tamales" acts exist (Irish roots collective, Tallahassee acoustic duo) — rejected as ambiguous |

**Venues (6 of 19):**

| Venue | Variants tried | Note |
|---|---|---|
| Spaces Studio (Burton upon Trent) | "Spaces Studio Burton upon Trent facebook website" | The only confident match at this name is an interior-design/kitchen showroom business (spacesstudio.uk) — no evidence it is a music venue; left blank rather than attach the wrong entity |
| Sola Bar & Kitchen (Dawlish Warren) | "Sola Bar Kitchen Dawlish Warren facebook website" | No confident Facebook or website surfaced |
| The Crab and Apple Pub (Appledore) | "Crab and Apple pub Appledore facebook website" | Candidate "The Crab Apple Inn" found but with no confirmed Appledore, Devon address match — several other same/similar-named pubs found in different towns; rejected as ambiguous |
| Alderney Community Association (Poole) | "Alderney Community Association Poole facebook website" | Only different, nearby entities found (Alderney West Community Centre, Alderney Manor Social Club) at different addresses — no confident single match |
| Walton Working Men's Club (Walton-on-Thames) | "Walton Working Men's Club Walton-on-Thames facebook website" | Only the club's separate "Function Room" hire page found (facebook.com/availablehallhire/), not the club's own main page — left blank rather than attach the wrong wing |
| The Focus Centre (Swanage) | "The Focus Centre Swanage Chapel Lane facebook website" | Address matches a Facebook page trading as "The Centre" (formerly Swanage Youth and Community Centre) at 7 Chapel Lane, but the current name does not match, and directory sources show the Focus Centre has since relocated to 107 High Street — left blank rather than guess at a rename or a moved address |

## Records skipped (not worked)

**Artists (1):** `Vince Lee & Sophie Lord` (`f55e8ebc-3cf4-4738-b00a-1a978a7e4452`) — verified page found (facebook.com/vinceleeblues/, corroborated by a post naming "Vince Lee & Sophie Lord"), but `edit_artist` bounced **`HTTP 409: Duplicate artist`** when writing that facebookUrl. `search_artist("Vince Lee")` and `search_artist("Sophie Lord")` returned no candidate above 50% confidence, so the colliding existing record could not be identified from this session. No write made. This is the second instance today of the `bv2a-zoe-schwarz-duplicate-artist-pair` shape — logged to CTO-INBOX as `bv2a-vince-lee-sophie-lord-duplicate-artist-pair`.

**Venues (3, searched then rejected as bad data):**
- `The Railway` (Stockport, `WVSAbjPEiVfP6zCIV69Q`) — confirmed **closed long-term since July 2024** (licensee died 23/6/2024; CAMRA/beerintheevening both confirm). Not enriched — a closed venue's socials are not useful data and the record likely needs a closure flag from a human, not this task's remit.
- `Astor Hall` (Plymouth, `c3c46630-c424-4b91-a422-898959c8fc6e`) — the only real-world entity at 157 Devonport Rd, Stoke, Plymouth PL1 5RB is **a CQC-registered nursing home** (Mayhaven Healthcare), not a music venue. Same shape as the runbook's own `White Lodge` wrong-entity precedent. Not enriched — logged to CTO-INBOX as `bv2a-astor-hall-plymouth-care-home-mismatch`.
- `Decade of Dance` (Bury, `cf25ce49-3b67-4c3f-a80b-73a7b0bfa79d`) — the stored `city` field reads "Great Sutton" (Cheshire) but the address/postcode is Bury, Greater Manchester; the only entity found is a DJ/promoter brand ("One massive retro party") operating out of "Club Den", not a fixed venue at the stored address. Not enriched, not flagged to CTO-INBOX this firing (time budget) — worth a human check of whether this record is mis-modelled.

**Excluded before searching, on sight as bad data (2):** `Jorge Wilson + Jesse James` (venue name reads as an artist billing, city field "Staffordshire" mismatches its Salford business-complex address) and `United match)` (malformed name; address is Old Trafford football stadium, not a grassroots venue).

**Not reached (1):** `Bridgnorth Castle and Gardens` — next oldest tier-3 backlog candidate after the 19 worked; time budget spent.

## Names corrected under §0.6

None this firing — no billing-contaminated names were encountered in the touched cohort. (One **location** correction was made under §2A.3, not §0.6 — see Mighty Howlers above.)

## Validator summary lines (verbatim)

Artists (14 of 15 records validated in gate mode — Vince Lee & Sophie Lord excluded, no write was made to that record this firing):

```
14 records · 10 clean · 0 FAIL · 4 WARN   [mode=gate]
```

Venues (16 of 19 worked records validated — 3 bad-data skips (`The Railway`, `Astor Hall`, `Decade of Dance`) excluded, no write was made to those records this firing; venue evidence `venueId` aliased to `artistId` per the standing `validator-venue-evidence-loader-artistid-only` workaround; venue `city` supplied as `location` per the standing `validator-venue-schema-mismatch` workaround):

```
16 records · 7 clean · 0 FAIL · 18 WARN   [mode=gate]
```

**Two correction cycles were needed before the 0-FAIL state above, both this firing's own evidence-capture errors, not RUNBOOK violations:**
1. `Blue Touch` (website-only artist) initially FAILed `BLANK_NOT_EVIDENCED` because the evidence line had no `searchVariants` — the validator's blank check does not recognise a populated `websiteUrl` as sufficient on its own. Fixed by adding the search variants actually tried for a Facebook page (none confirmed) to the evidence line — an honest record, since no facebookUrl was in fact found.
2. `White Lion` and `De Valence Pavilion` both initially FAILed `FB_EVIDENCE_MISMATCH` because this firing's evidence lines had `capturedFrom` set to the venue's website rather than its Facebook URL. For **De Valence Pavilion** the FB match was high-confidence (exact name, own posts from the Tenby Blues Festival held at the venue) — fixed by correcting `capturedFrom` to the actual Facebook URL. For **White Lion**, on review the Facebook identification was genuinely weaker (two competing candidate pages, not confidently disambiguated) — fixed properly by **reverting the stored `facebookUrl` to blank** via a second `edit_venue` call and keeping the confirmed website only, consistent with "blank beats wrong" rather than patching the evidence to match a shaky attach.

WARNs: `NAME_BILLING` on 4 artist records (`Jack-Austin Despy Blues Band`, `Thomas Heppell Band`, `Fran McGillivray Band`, `Jon Amor Trio`) are the documented false-positive pattern for names ending in a format word (Band/Trio) — all four are the acts' correct names (RUNBOOK §2A.1 item 7). All 18 venue WARNs are `STUB_NO_BIO`/`STUB_NO_IMAGE`, expected noise under §FP.2 (venues carry no bio/image requirement).

No FAILs on either batch after the two correction cycles above.

## Defects / rules raised

- **`facebook-page-search-not-found` (recurrence, not re-logged).** `facebook.com/search/pages/?q=...` returned no extractable text again this firing (canvas/blocked) — third occurrence today (firings 00/04 already logged it). Google remained fully usable and was the sole working finding surface.
- **New: `bv2a-vince-lee-sophie-lord-duplicate-artist-pair`** — second instance of the duplicate-artist-pair 409 shape; logged to CTO-INBOX with the one known id (colliding record unidentified). See Records skipped.
- **New: `bv2a-astor-hall-plymouth-care-home-mismatch`** — venue record's address resolves to a care home, not a music venue; logged to CTO-INBOX. See Records skipped.
- **Validator gap (not logged as a fingerprint, noted here for visibility):** `BLANK_NOT_EVIDENCED` does not treat a populated `websiteUrl` with no `facebookUrl` as a non-blank state — it required `searchVariants` to be present even though the record is genuinely "verified via website, no FB found" rather than a true blank. Worked around honestly this firing (see Validator summary); a future VSCode-agent pass could add a `websiteUrl`-aware branch to `check()`.

## Budget used

**15 of 15 artists, 19 of 30 venues** (1 further backlog candidate not reached). Elapsed within the 40-minute ceiling. Circuit breaker did not fire.

Ledger: 30 `enrich` lines appended (6 artist-verified, 8 artist-blank, 10 venue-verified [9 with FB and/or website, 1 website-only], 6 venue-blank) plus 1 `snapshot` line. Snapshot: artistsTotal 2765, artistsMissingSocials 1201, artistsMissingGenres 798, venuesTotal 3120, venuesMissingSocials 44 (down from 54 at firing start — 10 venues moved off the missing-socials list). `run-summary.jsonl`: 1 line appended, outcome `completed`, recordsEnriched 30, skipped 6 (1 artist 409-duplicate + 3 venue bad-data skips + 2 excluded-on-sight bad venue names). Both dashboards regenerated: `data/normalized/enrichment/DASHBOARD.html` (2664 enrichment records, 91 snapshots) and `data/normalized/DASHBOARD.html`.
