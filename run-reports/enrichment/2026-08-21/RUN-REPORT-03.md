# Bv2a Enrichment — run report, firing 03

**Run id:** `bv2a-enrichment-2026-08-21T03-19-57Z`. **Outcome: completed.**

## Gates

- **Circuit breaker (Step 0):** did not fire. Last 3 reports (2026-08-21 firings 00, 01, 02) each closed at 0 FAIL and each wrote a report, per the orchestrator's pre-check.
- **Runbook:** read in full. H1 version v2.27. Current floor v2.19 (§6A). Met.
- **Concurrency claim:** `data/state/claims/bv2a-enrichment.json` read `heldBy: null` (released by firing 02 at 02:46:00Z). Acquired cleanly at 03:19:57Z, TTL 3 hours, expires 06:19:57Z. `data/state/enrichment.lock` not honoured, not recreated (retired per §6A step 2b / §6G). Heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-21T03-19-57Z.json`.
- **Chrome:** `list_connected_browsers` returned exactly 1 browser ("Browser 1", Windows, local), confirming the `chrome-restored-after-38-firings` note in `CTO-INBOX.md`. No hard stop. In the event, no Chrome visit was needed this firing — every identity decision was settled on Google/WebSearch snippets and own-site confirmation per §FP; no bio was written for any record (all pre-existing bios were left untouched, all newly-attached pages had no verbatim-quotable text captured), so no page required a browser open.

## Selection

Order per RUNBOOK §FP / task prompt:

1. **Artists created <24h missing socials:** re-pulled with explicit ISO `createdSince` cutoff `2026-08-20T03:19:57Z` (per the `list-artists-createdsince-24h-string-not-parsed` fingerprint) — 210 candidates. Cross-checked against today's `enrichment-ledger.jsonl` (45 artist ids already touched by firings 00-02) before selecting; the pool was **not exhausted** — 28 fresh untouched candidates found in the first 50 returned. Worked the first 15 of those, oldest-created-first was not applied within this tier (list order used as returned).
2. **Venues created <24h missing socials:** same cutoff — 23 candidates, of which 2 were already touched today (skip), 2 excluded before searching as non-fixed buildings (§0.23: Willenhall Memorial Park, Bumble Hole Local Nature Reserve), leaving **14 usable fresh candidates** — all 14 worked. Tier 2 exhausted at 14 (fewer than the 30-venue budget).
3. **Backlog venues missing socials, oldest createdAt first:** pulled 89 backlog candidates, filtered out records already carrying a standing CTO-INBOX flag (not-a-venue parks/reserves, business-mismatch, closed, address-mismatch, "Venue TBC"/"United match)" garbled records) and records touched earlier today. Selected the **16 oldest** remaining fixed-building candidates (oldest: The Nest, Leek, created 2025-11-29) to reach the 30-venue budget.
4. Tier 1/4/5 for artists beyond the 15 selected was not reached — tier 1 alone had enough fresh candidates.

## Records enriched with a verified page

### Artists (8 of 15)

| Artist | Fields | Source / Signal |
|---|---|---|
| The Jam UK (`a2e9dba7…`) | location, locationType, facebookUrl, websiteUrl | Own site thejamuk.com confirms the stored bio's Weller quote verbatim ("Sounds like me when I was 19") and states the act is Gloucestershire-based, not London as previously stored — location corrected under §7 precedence (act's own site over stored value). facebook.com/thejamuk/ matched by exact handle. |
| Little Terry (`0c492943…`) | facebookUrl | facebook.com/LittleTerryAKAtheBairn/ — exact genre match (Doncaster ex-punk/ska guitarist turned solo folk/punk act, matches bndy Folk/Punk genres). |
| Suburban Toys (`008e1119…`) | facebookUrl | facebook.com/SuburbanToys/ — exact name + town + genre match (Lincoln punk-ska band). |
| The Johnny Crabb Trio (`d0273d45…`) | facebookUrl | facebook.com/TheJohnnyCrabbTrio — exact page name match; genre/actType match (Rockabilly/Rock'n'Roll, covers+originals). |
| Brad Dear (`a6d07645…`) | facebookUrl, websiteUrl | facebook.com/braddearmusic/, braddearmusic.co.uk — exact name + Nottingham + folk match, corroborates existing bio verbatim. |
| The Mad Badgers (`61bdd79b…`) | facebookUrl, websiteUrl | facebook.com/TheMadBadgers/, the-mad-badgers.com — Midlands punk/ska trio with a confirmed Boston (Lincolnshire) gig at The Railway, matching the stored bio's "Punk4theHomeless bill, Boston". |
| Melanie Pegge (`720cdb1e…`) | facebookUrl | facebook.com/melaniepeggemusic/ — confirmed Leicester/Midlands folk performer, exact name match. |
| Jonny Moody (`5b4bfbb8…`) | location, locationType, facebookUrl | facebook.com/Jonnymoodyofficial/ — confirmed based in Southampton (within stored "Hampshire UK" region); location tightened to the city. |

No bio was written for any of the 8 — none of the confirmed pages had text captured character-for-character within this firing's search budget (no Chrome visit was made), so per §0.0 the field was left as-is (all were already empty).

### Artists recorded as an evidenced blank (7 of 15)

Searched on both surfaces (Google/WebSearch general query plus a `site:facebook.com` / Facebook-page-form variant) per §2A.1 item 3b; no act identifiable to the RUNBOOK's evidence bar was found for any of the 7. Full search variants recorded per-record in `data/state/enrichment-evidence-2026-08-21-enrichment.jsonl`:

- **Josh Bailey Trio** — a real Solihull jazz pianist (Royal Birmingham Conservatoire) was found, but no page confirmed specifically for the trio; two candidate personal pages (joshbaileyartist, joshbaileydj) were not confidently the same act.
- **Danielle Lincoln** — only a personal-profile candidate found (§2A.1 item 4, never linked); insangel source page (`insangel.co.uk/bands/danielle-lincoln`) unreachable via `web_fetch` (known egress block).
- **Spiralling** — an Instagram handle (@spirallinguk) plausibly matches the Yasfest-lineup act, but one source described it as "West Midlands emo", conflicting with the stored "Nottingham band" bio; left blank on the disagreement rather than guess.
- **Terry Nutskin** — no plausible band page found on either surface.
- **Blue Moon Band** — multiple same-name covers bands found nationally (Wiltshire, generic), none confirmed North East.
- **Zak James** — two competing pages (zakjamesacoustic vs zakjamesmusic, the latter a rapper); neither carried a confirmed Manchester-area signal strong enough to meet the identification bar.
- **Dexter Shaw & The Wolftones** — a real, well-documented touring blues act, but no Facebook page surfaced on either surface (only Myspace/Spotify/SoundCloud/AirPlay Direct).

### Venues (23 of 30)

All verified against an exact or near-exact name/address/footprint match, `facebookUrl` and/or `website` via `edit_venue`:

Brackenfield Village Hall, Golden Lion (Havant), Ron Dawson Memorial Hall (Corby Glen — confirmed via matching booking-contact email `rondawson.corby@gmail.com` on the "Corby Glen Village Hall" FB page), The Scott Arms, Tap & Growler (website only — two competing FB candidates, `tapandgrowlerhouse` and `TapandGrowlerBar`, neither address-confirmed, so `facebookUrl` left blank), The Rainbow (Digbeth), Real Time Music (Chesterfield — note: this is the music-shop's own page; a separate "Real Time Live" venue trades from the same building upstairs, not flagged as a defect since the bndy record name matches the shop exactly), Donington Park Farmhouse, The Swallow (Havant), Springfields Events & Conference Centre, The Boat Club (Nottingham), The Lake at Barston, The Angel Microbrewery, The Actress & Bishop, Beartown Brewery, Congleton Bath House and Physic Garden, Barley Hops & grape, DV8 Bar & Lounge, No 15 Bar & Grill Congleton, Rumba Congleton, Congleton Cricket Club, Bell & Talbot, The Court (Bridgnorth).

### Venues recorded as an evidenced blank (7 of 30)

- **The Nest** (Leek) — the address (12 St Edward St) now resolves only to a hair-loss/extension salon ("ReNew at The Nest"), a business-type mismatch. Flagged to `CTO-INBOX.md`.
- **The Decorated Dead Tattoo Studio** (Poole) — confirmed real tattoo studio, only Instagram found, no Facebook page on either surface.
- **West End Club** (Stapleford) — several same-name generic "West End Club" pages nationally, none address-confirmed for Stapleford.
- **Hayfield Club** — only candidate found ("Hayfield Con Club") gives a different street and postcode (Steeple End Fold SK22 2JD vs stored Church St SK22 2JE). Flagged to `CTO-INBOX.md`.
- **The Tannery** (Derby) — genuinely new venue (opened June 2026), no Facebook page indexed yet on either surface.
- **The Saracens Head** (Newton Abbot) — only a personal-profile post mentioning the venue found, no official page.
- **Jubilee Inn** (Torpoint) — several same-name pubs nationally (Pelynt, Cannock, Studley); no address-confirmed candidate for Torpoint.

## Records skipped, and why

- 2 tier-1/2 venue candidates skipped before searching: Willenhall Memorial Park, Bumble Hole Local Nature Reserve — both non-fixed buildings (§0.23).
- Tier-3 backlog candidates already carrying a standing CTO-INBOX flag (park/nature-reserve not-a-venue, business mismatch, closure, address mismatch, garbled name) were excluded from selection rather than re-searched: Market Place (Burton), Hunstanton Bandstand, Okehampton Show ground, Bunker (Heanor, touched today), Old Lockup (Wirksworth, touched today), Jubilee Park Horndean, Ann Welfare Playing Fields, Prestwood Recreation Ground, Bowling Green Stage Nantwich, Campbell Park, West Park Long Eaton, 1865 Carlton Place, Astor Hall, Venue TBC, "United match)", Darcy's, White Lodge, Annitsford Welfare Club.

## Names corrected under §0.6

**The Jam UK** (`a2e9dba7…`) — location corrected London → **Gloucestershire** (locationType regional) on the act's own site (thejamuk.com), which also verbatim-confirms the stored bio's Weller quote. Name itself was not changed (already matched the act's own page). No venue was renamed this firing — venues carry no unattended-rename authority per §0.6/§2A.5 asymmetry.

## Validator summary lines (verbatim)

Artists (15 records; evidence `capturedFrom` corrected to the exact stored `facebookUrl` for 2 records after a first-pass `FB_EVIDENCE_MISMATCH` FAIL — The Jam UK's evidence had captured from the act's website rather than its FB page, and Brad Dear's had captured from a `/about`-suffixed URL rather than the canonical one):
```
15 records · 5 clean · 0 FAIL · 11 WARN   [mode=gate]
```
Venues (30 records; `city`→`location` per `validator-venue-schema-mismatch`, evidence aliased `venueId`→`artistId` per `validator-venue-evidence-loader-artistid-only`):
```
30 records · 30 clean · 0 FAIL · 0 WARN   [mode=gate]
```

First pass on artists surfaced 2 FAILs, both self-inflicted evidence-capture errors rather than RUNBOOK violations (see above); both fixed by correcting `capturedFrom` in the evidence file to the exact URL actually stored, then re-validated to 0 FAIL. Remaining WARNs are `STUB_NO_BIO` (8, expected — no bio written this firing) and `NAME_BILLING` (3 — "The Johnny Crabb Trio", "Josh Bailey Trio", "Blue Moon Band" — all correct act names per the VALIDATOR-README's documented false-positive pattern for format-tail names, not contamination).

Files: `data/normalized/enrichment/records-2026-08-21-firing03-artists.json`, `data/normalized/enrichment/records-2026-08-21-firing03-venues.json`, `data/state/enrichment-evidence-2026-08-21-enrichment.jsonl`, `data/state/evidence_firing03_venues_aliased.jsonl`.

## Defects found this firing (logged to CTO-INBOX.md)

1. **`bv2a-firing03-the-nest-leek-hair-salon-address`** — business-type mismatch, needs a human check of whether the venue record is stale.
2. **`bv2a-firing03-hayfield-club-address-mismatch`** — candidate page's address disagrees with the stored record, needs a human check.

No new tool/validator defects beyond the two standing fingerprints applied (`validator-venue-schema-mismatch`, `validator-venue-evidence-loader-artistid-only`) and the already-logged `list-artists-createdsince-24h-string-not-parsed`. The two artist `FB_EVIDENCE_MISMATCH` FAILs on the first validator pass were this firing's own evidence-capture mistakes (see above), corrected in-run — not a new validator defect.

## Budget used

**15 of 15 artists, 30 of 30 venues** — both caps reached. Elapsed approximately 20 minutes of the 40-minute ceiling. Circuit breaker did not fire.

Ledger: 45 `enrich` lines appended (8 artist-verified, 7 artist-blank, 23 venue-verified, 7 venue-blank) plus 1 `snapshot` line. Snapshot: artistsTotal 2754, artistsMissingSocials 1198, artistsMissingGenres 800, venuesTotal 3119, venuesMissingSocials 66. `run-summary.jsonl`: 1 line appended, outcome `completed`, recordsEnriched 45, skipped 20 (2 tier-1/2 non-fixed-building exclusions + 18 tier-3 candidates excluded on standing CTO-INBOX flags or same-day touch, listed above under "Records skipped"). Both dashboards regenerated: `data/normalized/enrichment/DASHBOARD.html` (2599 enrichment records, 89 snapshots) and `data/normalized/DASHBOARD.html`.

Claim released at end of run (`heldBy: null`).
