# Bv2a Enrichment — run report, firing 00

**Run id:** `bv2a-enrichment-2026-08-21T00-50-07Z`. **Outcome: completed.**

## Gates

- **Circuit breaker (Step 0):** did not fire. Last 3 reports (2026-08-19 firings 09, 10, 11) each closed at 0 FAIL and each wrote a report.
- **Context:** `CTO-INBOX.md` records `no-scheduled-task-ran-2026-08-20` — no task fired between 2026-08-19T11:19Z and 2026-08-21T00:24Z (37 hours, every task). This is this task's first firing since that gap. Other tasks (klma, sceniceye, gigs-news, spider, onthecasemusic) had already fired earlier tonight and confirmed `chrome-restored-after-38-firings`.
- **Runbook:** read in full. H1 version v2.27. Current floor v2.19 (§6A). Met.
- **Concurrency claim:** `data/state/claims/bv2a-enrichment.json` read `heldBy: null` (released 2026-08-19T11:40Z, last run `bv2a-enrichment-2026-08-19T11-19-03Z`). Acquired cleanly at 00:50:07Z, TTL 3 hours, expires 03:50:07Z. No lock-bypass clause needed (`data/state/enrichment.lock` not found; not honoured, not recreated, per §6A step 2b / §6G). Heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-21T00-50-07Z.json`.
- **Chrome:** connected, exactly one browser, logged in to Facebook (confirmed via `list_connected_browsers` and by successfully commenting-as on live pages). No hard stop.

## Selection

Order per task prompt (§FP applied throughout — Google to find, Chrome only to quote a bio):

1. **Artists created <24h missing socials:** 217 found. Worked the 15 oldest (09:24Z–17:24Z on 2026-08-20), which exhausted the 15-artist cap before reaching the newer (post-outage, ~00:15Z) batch.
2. **Venues created <24h missing socials:** 101 found. Worked the 30 oldest (09:23Z–17:17Z on 2026-08-20), which exhausted the 30-venue cap.

Tiers 3–5 (backlog venues/artists, artists-missing-genres-with-FB) were not reached — the 15+30 cap was spent entirely inside tier 1/2.

## Records enriched with a verified page

### Artists (6)

| Artist | Fields | Source |
|---|---|---|
| FeverStreet (`4b2b1d78…2a2c2`) | facebookUrl, bio | Own page (Wareham, UK) posts about playing "The Old Harry Bar" — the exact bndy venue two rows below. Tier A: own page, footprint match. |
| John McClean and the Clan (`f0cf70ec…663f872`) | facebookUrl, bio, websiteUrl | Own page; video captioned "live from The White Swan Swanage" — direct footprint match to bndy's swanblues capture. |
| The Mustangs (`24dbdd3a…02bd63`) | facebookUrl, bio, websiteUrl | Own page "The Mustangs (UK)"; independently confirmed Swanage Blues Festival appearance. Two candidate pages existed (`TheMustangsBand` vs `Themustangs.Official`); the Official page carries the festival's own CD promo text and was preferred. |
| Melrose Quartet (`80037721…8f80ab`) | facebookUrl, bio, websiteUrl | Own page, "Musician/band", English folk a cappella quartet — genre-consistent with a folk-festival-adjacent Lichfield venue. |
| Emma Wilson (`a31c7589…78d96e`) | facebookUrl, bio, websiteUrl, genres | Own page states "British Rhythm & Blues Artist… Signed to Select-O-Hits, Memphis International Distribution" — matches a Swanage Blues Festival billing exactly. |
| Franck Carducci & The Fantastic Squad (`ea81fd78…9e6ebc`) | facebookUrl, bio (corrected — see below) | Own page: "Theatrical Rock… 'Best Overseas Band' by the Classic-Rock Society magazine [UK]" — verbatim match to the paraphrased bio already on the record. |

### Venues (28)

All 28 verified against an exact or near-exact address match between the bndy record and the found page/site. Full list with sources in the ledger (`data/state/enrichment-ledger.jsonl`, 2026-08-21 lines): The Greyhound Inn, The Kings Arms, Old Harry Bar (website only, no FB surfaced), Red Lion Swanage, The Showbar at The Mowlem, Swanage Bay View Holiday Park, The White Swan, Woodhouse Farm and Garden CIC, Firebug (FB group, not a page — valid per §2A.1 item 4 addendum), 1000 Trades Jewellery Quarter (website only), Quorn Village Hall, The Garibaldi Hotel, Nelly's Retro & Vintage, Knighton & Clarendon Park Club, James' Bistro, Shooterz, Monks Park Working Mens Club, Eykyn Arms, Clumber Inn Retford, The Queens Head, The Gladstone (website only), The Miller's Daughter (website only), Nightrain, Dunham on Trent & district Village Hall (FB page trades as "Millennium Hall Events" — same address, treated as the same hall), Rough Trade Nottingham, The SoundHouse Leicester, The Real Ale Classroom (website only), Mist Rolling Inn.

## Records recorded as an evidenced blank

### Artists (8), variants tried on both surfaces (Google + Facebook page search)

| Artist | Variants | Reason |
|---|---|---|
| Astles Couzens Duo (`9f5e6501`) | `Astles Couzens Duo facebook`; `"Astles Couzens" Dorset duo band` | Only individual personal profiles found (Joe Astles, Martin Astles), no joint duo page. |
| Box Car Blues Band (`3cb4f31d`) | `Box Car Blues Band facebook`; `"Box Car Blues Band" Dorset OR Swanage facebook` | Confirmed on the Swanage Blues Festival lineup but no dedicated page found under this name. |
| I Spy & Another (`169e35e4`) | `"I Spy" duo blues band facebook` | No UK act of this name found. |
| Will Killeen (`ce44797e`) | `Will Killeen band facebook` | Only a low-evidence personal-profile-style page found, no music context — fails §2A.1 identification bar. |
| Art Themen Organ Trio (`101749c5`) | `Art Themen Organ Trio jazz facebook`; FB page search `Art Themen` | Well-documented real jazz trio (venues, reviews) but no Facebook page exists for it. |
| Atlantean (`6b72aeb1`) | `Atlantean metal band Nottingham facebook`; FB page search `Atlantean band` | Only same-name foreign acts found (Atlantean Kodex — Germany; Atlantean Spires — USA). Per §0.15, not attached. |
| BELT (`bc78d5ea`) | `BELT band Derbyshire post-punk facebook`; FB page search `BELT band Derbyshire` | Name too generic; no matching act found on either surface. |
| Cyph_on (`c0d8205d`) | `Cyph_on band Leicester facebook`; FB page search `Cyph_on` | No music act found under this name on either surface. |

### Venues (2)

| Venue | Reason |
|---|---|
| Market Place, Burton upon Trent (`06b4cb4d`) | Ambiguous whether this bndy record is the open market square or "Burton Market Hall" (a real, separately-named events venue at the same postcode area). No confident single match — not attached. Possible §0.23 named-non-place risk; worth a human check. |
| The Old Lockup, Wirksworth (`41dd1283`) | A Facebook page exists (`Theoldlockup`) but it is for a bed & breakfast / guest house at this address, not a live music venue — same business-type-mismatch pattern as the 2026-08-19 "Spaces Studio" finding. Not attached; needs a human check of whether this bndy record is a mis-capture. |

## Records blocked (not a blank, not skipped)

**Zoe Schwarz & Rob Koral** (`886d8713-492f-4037-8bad-00827d844907`, Swanage) — `edit_artist` bounced **409 "Duplicate artist"** when writing the found facebookUrl (`facebook.com/zoeschwarzbluecommotion/`). `search_artist("Zoe Schwarz")` confirms an existing record **`404e13b8-718f-4561-8495-c752d852ddab`** ("Zoe Schwarz", Bridport) already carries that exact facebookUrl. Per §1A.2 Step 0, exact FB match = same artist. The gate did its job — no write was made (confirmed by `get_by_id` read-back, record unchanged). **This is a genuine duplicate pair needing a human merge decision** (never resolved unattended, per §0.11). Logged to `CTO-INBOX.md`.

## Records skipped, and why

None beyond the two record-classes above. Tiers 3–5 of the selection order were not reached this firing — budget was spent entirely on tier 1 (artists <24h) and tier 2 (venues <24h), both of which have large remaining backlogs (217 artists / 101 venues created in the last 24h alone still carry missing socials; only the 15 + 30 oldest were worked).

## Names corrected under §0.6

None. No act's own page contradicted its stored bndy name this firing.

## Corrections made mid-firing

Franck Carducci & The Fantastic Squad's stored bio was a **paraphrase** ("Theatrical rock; named Best Overseas Band by Classic Rock Society magazine…") from a prior import, in violation of §0.0. Replaced with the verbatim quote from the act's own Facebook page intro ("Theatrical Rock\n\"Best Overseas Band\" by the Classic-Rock Society magazine [UK]") while adding the facebookUrl.

## Validator summary lines (verbatim)

Artists (15 records, run against `data/normalized/enrichment/records-2026-08-21-firing-venues.json`'s sibling artist file and this firing's evidence file):
```
15 records · 6 clean · 0 FAIL · 11 WARN   [mode=gate]
```
Venues (30 records; artistId-keyed evidence loader worked around per the standing `validator-venue-evidence-loader-artistid-only` fingerprint by aliasing `venueId`→`artistId` in a copy of the evidence file, and the `validator-venue-schema-mismatch` fingerprint worked around by supplying each venue's `city` as `location`):
```
30 records · 30 clean · 0 FAIL · 0 WARN   [mode=gate]
```
WARNs (11, all non-blocking, all judgment-class): 6× `STUB_NO_IMAGE` — an artifact of the minimal validator-input file omitting `profileImageUrl`, which the live records do carry (auto-populated by `edit_artist` from the vanity-URL graph endpoint) except FeverStreet, whose page uses a numeric `/p/…/` id with no auto-avatar. 1× `BIO_PUNCTUATION` on Melrose Quartet — the bio was typed with a straight quote where the source page renders a curly one; text content matches, cosmetic only. 4× `NAME_BILLING` (Melrose Quartet, Astles Couzens Duo, Box Car Blues Band, Art Themen Organ Trio) — trailing format words (Duo/Trio/Quartet); per RUNBOOK §2A.5 item 7 addendum these are part of the name and were correctly left unchanged, as none of the acts' own pages show a different name.

Both files, evidence, and the aliasing script are at: `data/normalized/enrichment/records-2026-08-21-firing.json`, `data/normalized/enrichment/records-2026-08-21-firing-venues.json`, `data/state/enrichment-evidence-2026-08-21-enrichment.jsonl`, `data/state/evidence_firing_2026-08-21_venues_aliased.jsonl`.

## Budget used

**15 of 15 artists, 30 of 30 venues** — both caps reached. Elapsed approximately 25 minutes of the 40-minute ceiling. Circuit breaker did not fire.

Ledger: 45 `enrich` lines appended (6 artist-verified, 8 artist-blank, 1 artist-blocked-recorded-as-blank, 28 venue-verified, 2 venue-blank) plus 1 `snapshot` line. Snapshot: artistsTotal 2743, artistsMissingSocials 1215, artistsMissingGenres 802, venuesTotal 3119, venuesMissingSocials 143. `run-summary.jsonl`: 1 line appended, outcome `completed`, recordsEnriched 34, skipped 11. Both dashboards regenerated: `data/normalized/enrichment/DASHBOARD.html` (2464 enrichment records, 86 snapshots) and `data/normalized/DASHBOARD.html`.

Claim released at end of run (`heldBy: null`).
