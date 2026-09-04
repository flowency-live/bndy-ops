# Bv2a Enrichment — RUN-REPORT-05 — 2026-08-28

**Run id:** `bv2a-enrichment-2026-08-28T05-21-03Z`. **Outcome: completed.**

## Circuit breaker (Step 0)

Checked the last 3 run reports in `data\normalized\enrichment\2026-08-28\` before any other action: `RUN-REPORT-04` (04:18:54Z firing, completed, validator `14 records · 12 clean · 0 FAIL · 2 WARN`), `RUN-REPORT-03` (03:19:12Z firing, completed, `13 records · 11 clean · 0 FAIL · 2 WARN`), `RUN-REPORT-02` (02:19:05Z firing, completed, `5 records · 3 clean · 0 FAIL · 2 WARN`). All three completed with a final 0 FAIL. Breaker did not fire.

## Runbook / task spec read

`RUNBOOK.md` H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed (2.27 ≥ 2.19). Read: §0 prime directives 1–29 in full, §1 identity, §6C changelog tail (v2.0–v2.3), §7 changelog through v2.27. `ENRICHMENT-TASK-v3.md` §0.0 (bio-is-quoted) and §FP fast path (FP.1–FP.4) were already summarized by the orchestrating context and re-applied throughout. `CTO-INBOX.md` tail read in full before selection (standing bv2a-* fingerprints, venue not-a-venue/wrong-entity/ambiguous-address pattern, duplicate-artist pairs, the silent-noop and genres-replace defects).

## Concurrency

`data\state\claims\bv2a-enrichment.json` read at firing start held `{"heldBy":null,"releasedAt":"2026-08-28T04:29:40Z","lastRun":"bv2a-enrichment-2026-08-28T04-18-54Z"}` — released. Wrote heartbeat `data\state\heartbeat\bv2a-enrichment-2026-08-28T05-21-03Z.json` (`outcome:"started"`) before any gate, then acquired the claim (`heldBy: bv2a-enrichment-2026-08-28T05-21-03Z`, TTL 3h, `expiresAt: 2026-08-28T08:21:03Z`). No `data\state\enrichment.lock` file present — not honoured, not recreated, per §6A step 2b.

Chrome: exactly one connected browser (`list_connected_browsers` → 1), logged into Facebook (confirmed via a live navigation to facebook.com showing the logged-in feed, account "The Torrists"). Both venue and artist work proceeded — no hard stop.

## Standing precedents applied

- `bv2a-firing1319z-verify-id-before-live-write` — `get_by_id` immediately before all 4 live `edit_artist` calls; all 4 names confirmed correct before writing.
- `bv2a-firing1319z-never-guess-fb-vanity-url` — every URL written was read from a page actually visited (Chrome `javascript_tool` on `document.body.innerText`, matching the standing `fb-page-text-needs-javascript-tool` finding — `get_page_text` was not used on Facebook pages).
- `bv2a-firing2119z-edit-artist-genres-param-replaces-not-merges` — checked existing `genres` via `get_by_id` before every write; only one write touched genres (Slady, existing `["Rock"]` already matched the inferred tribute genre, so no merge conflict existed).
- `bv2a-firing1419z-bio-verbatim-fires-on-untouched-preexisting-bio` (5th same-day recurrence) — Arkham and The Zimmermen each carry a pre-existing bio this firing did not touch (both received only a blank-search evidence line against `facebookUrl`); the validator's first pass FAILed both on `BIO_VERBATIM` comparing that untouched bio against the unrelated blank-search text. Excluded both from the gate pass with this rationale; 0 FAIL on the remaining 13.
- `bv2a-venue-backlog-saturated` (reconfirmed for a 6th consecutive firing today) — 32 of 34 backlog venues cross-referenced directly against CTO-INBOX fingerprints (park/nature-reserve class, business-mismatch class, ambiguous-address class, non-venue class) and skipped without re-searching. Only 2 unflagged records remained; both worked (see below).
- Tier 1 (12 artists created in the last 24h missing socials): all 12 already carried 1–2 evidence-file entries from the 03:19Z/04:18Z firings within the preceding ~90 minutes (confirmed by grepping today's evidence file before selection). Not re-searched this firing — identical search variants would repeat the same failed search within the hour.
- `list-artists-createdsince-24h-string-not-parsed` — `createdSince` passed as a computed ISO timestamp (`2026-08-27T05:21:03Z`), not the literal string.
- `bv2a-venue-edit-facebookurl-param-silent-noop` / `-instagramurl-` — not triggered this firing (no venue writes occurred; both venue candidates were left blank).

## Selection and work, by tier

**Tier 1 — artists created in last 24h missing socials:** `list_artists(createdSince:"2026-08-27T05:21:03Z", missingSocials:true)` returned 12, all already evidenced blank by the 03:19Z/04:18Z firings this morning. Not re-searched (see precedents above).

**Tier 2 — venues created in last 24h missing socials:** `list_venues(createdSince:"2026-08-27T05:21:03Z", missingSocials:true)` returned 0. Nothing to work.

**Tier 3 — backlog venues missing socials:** `list_venues(missingSocials:true)` returned 34. All 34 reviewed against the CTO-INBOX fingerprint list. 32 were already flagged (park/showground/nature-reserve/carnival-adjacent class: Willenhall Memorial Park, Ann Welfare Playing Fields, Bumble Hole Local Nature Reserve, Campbell Park, West Park Long Eaton, Bowling Green Stage Nantwich, Prestwood Recreation Ground, Castle playing fields Thrapston, Hunstanton Bandstand, Bridgnorth Castle and Gardens; business-mismatch class: White Lodge, Astor Hall, Spaces Studio, Decade of Dance, The Nest; ambiguous-address class: Tresaith, Market Place Burton, Taylors Bar, Royal British Legion Beeston, Hayfield Club, 1865 Carlton Place, Okehampton Show ground, Sola Bar & Kitchen; non-venue/placeholder class: Venue TBC, United match), Jorge Wilson + Jesse James, EX39 4JN Instow Beach, Middle of the Road Cafe; plus Annitsford Welfare Club, Jubilee Park Horndean, The Railway Stockport, Darcy's, The Tannery — wait, see below). **2 genuinely new, unflagged records found: The Tannery (Derby) and Madeley Carnival, Madeley — both worked, both evidenced blank** (see below). Backlog saturated for a 6th consecutive firing; 0 verified this firing.

**Tier 4 — backlog artists missing socials, oldest available first:** `list_artists(missingSocials:true)` returned 1392 total. Given the standing `bv2a-firing2319z-tier4-sampling-never-reaches-true-oldest` defect (the endpoint is not createdAt-sorted), pulled a page at offset 150 (25 records, createdAt spanning 2025-03 to 2026-08) and selected the 15 oldest-by-createdAt candidates not already carrying a today's evidence-file entry, excluding two known-flagged duplicate/collision records seen on the same page (Soulplay — already evidenced blank today per the standing bio-verbatim-false-positive defect; Zoe Schwarz & Rob Koral — standing 409-collision duplicate-pair). Worked, oldest-created first: Devil Hound Blues (2026-05-01), Strikes Twice (2026-08-04), The Prediction (2026-06-10), Juno and Faith (2026-06-26), Herding Cats (2026-06-26), Nikki and the Switchblades (2026-07-31), Strum & Drummer (2026-07-31), The Revision Party (2026-07-31), Slady (2026-08-09), The Zimmermen (2026-08-09), Northwestern (2026-08-15), Arkham (2026-08-19), Steve Turner (2026-08-19), Waterfront (2026-08-20), Atlantean (2026-08-20).

**4 verified, 11 evidenced blank.** Artists worked this firing: **15 of 15 cap.** Venues worked this firing: **2 of 30 cap** (0 verified, 2 evidenced blank; backlog saturated, budget was not the limiting factor).

Tier 5 (missingGenres) not reached — the 15-artist cap was filled by Tier 4.

### Verified — artists (4)

| Artist | Fields written | Signal |
|---|---|---|
| Nikki and the Switchblades (`7840d85e…`) | `facebookUrl`, `bio` | Tier A — own FB page `facebook.com/NikkiandtheSwitchblades/` (1.4K followers, Band), corroborated by the record's existing lemonrock externalId `nikkiandtheswitchblades`. Bio quoted verbatim, cut at the sentence boundary before the booking-phone-number CTA sentence (§0.0 permits cutting at a sentence boundary). |
| Strum & Drummer (`b3b91781…`) | `facebookUrl`, `bio`, `websiteUrl` | Tier A — own FB page `facebook.com/StrumAndDrummerUK/` (127 followers), own bio states "Based in Devon" matching the stored Exmouth, Devon location exactly. Own website `strumanddrummer.com` linked from the FB page's Links section. Bio quoted verbatim in full. |
| The Revision Party (`64513832…`) | `facebookUrl`, `bio` | Tier A — own FB page `facebook.com/TheRevisionPartyband/` (346 followers), corroborated by the record's existing lemonrock externalId `revisionparty` ("The Revision Party, Exmouth, Devon"). Bio quoted verbatim, cut before the self-promotional "See details of upcoming gigs on www.lemonrock.com" sentence. |
| Slady (`1f6b623b…`) | `facebookUrl`, `bio`, `genres`, `actType` | Tier A — own FB page `facebook.com/SLADYtribute/` (21K followers, 100% recommend/36 reviews), an unambiguous single-candidate name match ("the world's ONLY all-female tribute band to... Slade"). `genres:["Rock"]` unchanged (already stored) and `actType:["tribute"]` added per RUNBOOK §0.18's tribute-act mapping (tributed act Slade → Rock, already correct). Location (Essex) left unchanged — the page lists UK tour-city check-ins (Wales, Manchester, Edinburgh, etc.), not a stated home base, so neither confirms nor contradicts Essex. |

### Evidenced blank — artists (11)

Both surfaces (Google + Facebook where relevant) tried for every one; variants recorded in the evidence file:

- **Devil Hound Blues**, **Strikes Twice**, **The Prediction**, **Juno and Faith**, **Northwestern**, **Arkham**, **Waterfront** — no UK-consistent candidate page found; near-name matches were either unrelated acts or too ambiguous (Waterfront: four different candidate pages, none confirming Willenhall).
- **Herding Cats** (Hampshire) — the only "Herding Cats" pages found are US acts (Seattle classic rock cover band, 3.2K followers; Fairport, NY). Rejected as non-UK per RUNBOOK §0.15/§2A.1.1. Left blank.
- **Atlantean** (Nottingham, Metal) — the only close-name match, Atlantean Kodex, is a German epic metal band (Trummer/Kreuzer, founded 2005). Not UK, not Nottingham. Left blank.
- **Steve Turner** (Derby, folk) — a genuine touring folk musician was found (steve-turner.co.uk, Jacey Bedford Agency, Living Tradition praise quotes) but the site states no location and the one candidate Facebook page (`facebook.com/Steve-Turner-994439720579696/`) returned "This content isn't available" on visit. Common name; Derby link unconfirmed. Left blank.
- **The Zimmermen** (Watford, Herts) — TWO live candidate Facebook pages found (`facebook.com/thezimmermen`, 748 followers; `facebook.com/Zimmermenmusic/`, 630 followers). lemonrock (`lemonrock.com/zimmermen`, "Based in Watford, Herts") does not disambiguate which is canonical, and neither page's own bio text matches the record's pre-existing lemonrock-sourced bio verbatim. Same class as the standing two-candidate-deadlock precedent (Royal Oak Hollywater). Not attached; flagged in CTO-INBOX. The record's pre-existing bio/genres were NOT touched this firing.

### Evidenced blank — venues (2)

- **The Tannery**, 34 Sadler Gate, Derby DE1 3NR — confirmed real venue (a taproom opened June 2026, operated by Ashover Brew Co, per derby.gov.uk council-grant coverage and independent local press). `enrich_venue` (Google Places) geocoded the record but returned no website. Only social presence found is the parent brewery's own page (`facebook.com/AshoverBrewery/`, Clay Cross) — not confirmed as this specific taproom's own page. Not attached (Tier B parent-brand page judged not confident enough for a venue-specific record). Flagged in CTO-INBOX.
- **Madeley Carnival, Madeley**, New Rd, Madeley, Crewe CW3 9DN — no dedicated Facebook page found; only unrelated Madeley community pages (school, hair shop, parish council, a CW3 community group). Classified as the same not-a-venue class as Bowling Green Stage Nantwich Food Festival (an annual carnival/event, not a fixed building with its own identity). Not enriched. Flagged in CTO-INBOX.

## Validator summary line (verbatim)

Ran against the 15 artist records this firing wrote to or evidenced with a live capture, then re-ran excluding Arkham and The Zimmermen per the standing untouched-pre-existing-bio precedent (first pass produced `2 FAIL` — `BIO_VERBATIM` on both, comparing each record's pre-existing bio against this firing's unrelated blank-search evidence text, neither of which this firing touched):

```
13 records · 13 clean · 0 FAIL · 0 WARN   [mode=gate]
```

(A first pass on the 13 gate-eligible records without `profileImageUrl` populated in the records JSON produced 4 spurious `STUB_NO_IMAGE` WARNs — a records-file construction artifact, not a real gap; the 4 verified writes' own `edit_artist` responses confirmed `profileImageUrl` was in fact populated via the Facebook graph picture URL on all 4. Corrected and re-ran clean.)

The two venue writes (both blank, no bndy field written) are excluded from the validator gate pass per the standing `bv2a-firing1419z-validator-cannot-check-venues` defect — moot here since neither venue received a write.

0 FAIL. Batch ships.

## Defects and open items (logged to CTO-INBOX)

- `bv2a-firing0521z-tannery-derby-parent-brand-page-only` — real venue, only a parent-brand FB page found, not venue-specific. Needs a human check / ruling.
- `bv2a-firing0521z-madeley-carnival-not-a-venue` — new instance of the standing park/event-ground not-a-venue class.
- `bv2a-firing0521z-zimmermen-two-candidate-pages` — new instance of the standing two-candidate-deadlock class (same shape as Royal Oak Hollywater).
- `bv2a-venue-backlog-saturated` reconfirmed for a 6th consecutive firing today.

## Ledger / summary / dashboards

- `data/state/enrichment-evidence-2026-08-28-enrichment.jsonl` — 17 lines appended this firing (4 artist verified, 11 artist blanks, 2 venue blanks).
- `data/state/enrichment-ledger.jsonl` — 17 `enrich` lines + 1 `snapshot` line appended (snapshot: artistsTotal 3290, artistsMissingSocials 1388, artistsMissingGenres 945, venuesTotal 3206, venuesMissingSocials 34).
- `data/state/run-summary.jsonl` — 1 line appended, outcome `completed`, recordsEnriched 4, skipped 13.
- `20-Daily/2026-08-28.md` — link to this report appended.
- `CTO-INBOX.md` — 3 new DATA entries (Tannery, Madeley Carnival, Zimmermen two-candidate).
- Both dashboards rebuilt (`data/normalized/enrichment/DASHBOARD.html` — 3129 records/113 snapshots; `data/normalized/DASHBOARD.html`) — both exit 0.

## Summary

**0 venues verified + 2 evidenced blank** (backlog otherwise saturated for a 6th consecutive firing — 32 of 34 already flagged from prior firings, cross-referenced by fingerprint rather than re-searched). **4 artists verified (3 facebookUrl+bio, 1 facebookUrl+bio+genre/actType top-up) + 11 evidenced blank** (one rejected as non-UK, one left on a common-name/dead-page uncertainty, one left on a two-candidate-page deadlock, both surfaces tried throughout). Validator: `13 records · 13 clean · 0 FAIL · 0 WARN` (two untouched-pre-existing-bio records excluded from the gate pass per standing precedent). Elapsed approximately 14 minutes (heartbeat 05:21:03Z → this report). Circuit breaker did not fire; no hard stop encountered; Chrome was available and logged in throughout.
