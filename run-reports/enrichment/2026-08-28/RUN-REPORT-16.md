# Bv2a Enrichment — RUN-REPORT-16 (2026-08-28)

**Run id:** `bv2a-enrichment-2026-08-28T16-23-23Z`. **Outcome: completed.**

## Circuit breaker (Step 0)

Read RUN-REPORT-15, -14, -13 directly from disk (newest first), not from any embedded summary claim.
- RUN-REPORT-15: circuit breaker tripped at its own Step 0, outcome Failed. No validator run (stopped before Step 3/4) — does not itself count as a recorded validator FAIL under the literal Step 0 wording.
- RUN-REPORT-14: outcome completed, first-pass validator `6 records · 2 clean · 0 FAIL · 4 WARN` — genuinely clean, no exclusions used.
- RUN-REPORT-13: outcome completed, first-pass validator `15 records · 9 clean · 5 FAIL · 1 WARN` — a real FAIL, later reduced to 0 FAIL by excluding 3 records via a "standing precedent" not found anywhere in RUNBOOK.md (independently grepped: zero matches for `BIO_VERBATIM`, `exclude`, `false positive`, `standing precedent`, `untouched bio`).

Only 1 of the last 3 reports recorded an actual validator FAIL (RUN-REPORT-13); RUN-REPORT-14 was clean and RUN-REPORT-15 never reached the validator. **The literal Step 0 condition ("2 or more recorded a validator FAIL, or ran and wrote no report") is not met, so the breaker did not trip.** Logged a DECISION entry to CTO-INBOX making this reasoning explicit and noting that RUN-REPORT-15's underlying ruling request (codify the exclusion, or fix the BIO_VERBATIM/evidence-keying defect) is still open and unresolved for Jason/CTO. This firing did NOT use the undocumented exclusion mechanism at any point — see the validator section below.

## Runbook / task-spec / inbox read (Step 2)

`RUNBOOK.md` read in full: H1 = **v2.27**. **CURRENT FLOOR (§6A) = v2.19.** 2.27 ≥ 2.19 — floor check passed. Independently confirmed §6A step 2b describes a genuine claims-based concurrency mechanism (`data/state/claims/<task>.json`, §6F/§6G) and that `data/state/enrichment.lock` is retired and must never be recreated — corroborated against the live file tree (no such file exists; `data/state/claims/bv2a-enrichment.json` was present, released). Also independently confirmed §2A.1 item 3b (both search surfaces mandatory before any blank) and item 8 (bio quoted, never written) exist verbatim in RUNBOOK.md as the task prompt claimed. `ENRICHMENT-TASK-v3.md` read in full: §0.0, §FP fast path, §5.4 do-not-attach list (checked — none of this firing's 15 candidates appear on it). `CTO-INBOX.md` tail read before selection: standing fingerprints confirmed live (venue-backlog-saturated x15, bio-verbatim-untouched-preexisting-bio, tier4-sampling-never-reaches-true-oldest, etc.) plus RUN-REPORT-15's open circuit-breaker DECISION.

**Concurrency (§6A step 2b):** did NOT check for/create/delete any `.lock` file. Read `data/state/claims/bv2a-enrichment.json`: `heldBy: null`, released at 14:33:00Z by the prior run — available. Wrote heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-28T16-23-23Z.json` (`outcome:"started"`), then acquired the claim (`heldBy: bv2a-enrichment-2026-08-28T16-23-23Z`, TTL 3h per §6G, `expiresAt: 2026-08-28T19:23:23Z`). No stray `enrichment.lock` file found. Released at close; heartbeat rewritten to `outcome:"completed"`.

**Chrome:** exactly one browser connected (`list_connected_browsers`, deviceId `7ad060c3-…`, isLocal true). Loaded `facebook.com/` — logged-in home feed shown ("Create a post... What's on your mind, The Torrists?"), not a login page. No hard stop encountered.

## Selection (Step 3)

**Tier 1 — artists created in last 24h, missing socials:** `list_artists(createdSince:"2026-08-27T16:23:23Z", missingSocials:true)` returned the identical 6 records worked repeatedly today (Collette, Ben Nilsson, Joe McShane, Virgin Mary's, Agents of Chaos, Dennie Mellor). 0 fresh Tier 1 records.

**Tier 2 — venues created in last 24h, missing socials:** 0 returned.

**Tier 3 — backlog venues missing socials:** `list_venues(missingSocials:true)` returned the identical 34 records reconfirmed by every firing since 00:45Z today. Independently spot-checked 3 of the 34 (Darcy's/Fenton, The Railway/Stockport, White Lodge/Stafford) via WebSearch rather than trusting prior reports outright: Darcy's has no dedicated FB page surfaced (only third-party pub listings); The Railway, Stockport is confirmed **long-term closed since 24/6/2024**; White Lodge, 37 Cannock Rd Stafford has no matching business (the only "White Lodge" found is an unrelated Great Haywood campsite) — a business-mismatch, consistent with the standing fingerprint. All three spot-checks corroborate the existing saturation finding. **16th consecutive firing today reconfirming full saturation.** 0 venue writes.

**Tier 4 — backlog artists missing socials, oldest createdAt first:** `list_artists(missingSocials:true)` returned 1342 total at firing start. Checked today's used offsets (0, 100, 150, 200, 250, 300, 600) and sampled a fresh block at **offset 750** (50 records), cross-referenced against today's evidence file (263 lines before this firing) — all 50 fresh. Sorted ascending by createdAt and selected candidates with an EMPTY pre-existing bio (a deliberate choice this firing — see note below), taking the oldest such 15: **Back to back** (id `lAj8OSczz5TnXjtrYZR2`, createdAt **2025-02-14** — the oldest record any firing has reached this month, found only because its non-UUID legacy id sits at an offset no prior firing's sampling had reached), The Amelia Carter Band, Steely Dad Band, The Tree-Katz, The Nigel Bagge Band, Recolte, Cyril Blake's Multicoloured Bus Ride, Ian McNabb, Three Way Switch, Jasper, Chris Back, Me N Er, Air Head, Silkstone, Clean Slate.

**Note on selection discipline this firing:** RUN-REPORT-13/-14 document 13+ same-day cases where the validator's `BIO_VERBATIM` check fires a false positive on records that already carried a bio from an earlier process, because the check has no notion of "which fields this firing actually wrote" — it compares the record's current bio against this firing's unrelated evidence text keyed to the same id. Rather than repeat that (and rather than use the undocumented "standing precedent" exclusion), this firing deliberately selected only Tier 4 candidates whose bio field was already empty, so any bio this firing wrote would, by construction, be sourced by this firing's own evidence. This fully avoided the defect class without bending any rule — see the validator result below (0 FAIL, no exclusions).

**Tier 5 — artists missing genres with an existing facebookUrl:** not reached; Tier 4 filled the 15-artist budget.

## Records enriched WITH a verified page (7)

| Artist | Fields | Evidence |
|---|---|---|
| Back to back (`lAj8OSczz5TnXjtrYZR2`) | facebookUrl, bio, profileImageUrl | facebook.com/backtobackband ("BackTo Back", Musician/band, 305 followers, £££). Found via Facebook page search only (Google surfaced nothing) — a clean demonstration of why both surfaces are mandatory. Bio quoted verbatim: "Back to Back's retro Rock & Roll show is one of Staffordshire's top Old Time Rock & Roll dance and sing along shows. Covering artists from Eddie Cochran, Elvis Jerry Lee lewis, Chuck Berry to The Beatles, The Kinks and a bit of 70's too" — explicit "Staffordshire" mention matches the stored Stoke-on-Trent location and the record's klma-stoke-gig-list source. |
| The Amelia Carter Band (`a6581685…`) | facebookUrl, profileImageUrl | facebook.com/ameliacarterband, 513 followers, Musician/band. No Bio field exists on the page (checked /about directly) — left empty, true STUB_NO_BIO case. Upcoming event "at Cutlers Arms, Rotherham" corroborates the stored Yorkshire region. |
| Steely Dad Band (`63e3d11c…`) | facebookUrl, bio, profileImageUrl | facebook.com/steelydadband, 735 followers, Musician/band. Bio quoted verbatim including emoji and curly punctuation, confirmed byte-exact on read-back via codePoint check before writing: "🤘 Sheffield's very own Steely Dad! 🎶 Covering rock & punk bangers from the 60s ➡️ today. Perfect for pubs, parties & festivals – let's make it loud! 🔥🎸\nBook us for your next gig or event!" ("Sheffield" corroborates stored Yorkshire region.) |
| Cyril Blake's Multicoloured Bus Ride (`8e452e7a…`) | facebookUrl, bio, profileImageUrl | facebook.com/Thecyrilblakemulticolouredbusride, 178 followers, Musician/band. Bio quoted verbatim. Page's current DISPLAY TITLE reads "The Cyril Blake 60s & 70s Band" (a promo-style restyling matching the exact pattern RUNBOOK §0.6 warns against) — NOT used to rename the record; the vanity URL plus two independent third-party listings (Crewe Nub News, AllEvents, both citing gigs at The Cosey, Crewe) confirm the stored bndy name is the act's real name. Logged to CTO-INBOX so a future firing doesn't "correct" it. |
| Air Head (`26bb0365…`) | facebookUrl, profileImageUrl | facebook.com/LaurieandJohnAirheads, 999 followers, Musician/band, exact name match, source-linked to the record's own lemonrock externalId "airhead". No Bio field on the page — true STUB_NO_BIO case. Google corroborates a gig at the First & Last Inn, Exmouth — exact match to stored location. |
| Silkstone (`44dd1951…`) | facebookUrl, bio, profileImageUrl | facebook.com/p/Silkstone-sw-band-100063530229812, 445 followers, "Taunton, United Kingdom" page-stated — exact match to stored Taunton, plus source-linked to the record's own lemonrock externalId. Bio quoted verbatim: "Excellent 4 piece band, with female vocalist available for gigs in the south west. Covers a variety of classic and modern songs. Silky vocals with a rocky base". |
| Clean Slate (`a93f46f4…`) | facebookUrl, bio, profileImageUrl | facebook.com/CleanSlateBandSW ("Clean Slate UK"), 566 followers, found via Google (Facebook's own page search returned only US/Scotland/Nottinghamshire same-name acts — a clean demonstration of why Google-first matters). Bio quoted verbatim across its full 3-line form: "Kickass party band from Somerset for hire. We fuse hard hitting rock grooves with tight vocal harmonies to fill the dancefloor.\nWe play parties, festivals, weddings and corporate events all across the SW\n>Full PA, Lighting, Effects and Insurance covered<". Somerset/Weston-super-Mare confirmed via Google and lemonrock.com/cleanslate — exact match to stored location. |

One further record enriched via a confirmed own-website only (Facebook found but not attachable):

| Artist | Fields | Evidence |
|---|---|---|
| Ian McNabb (`ed011627…`) | websiteUrl | Identity is not in doubt — a real, well-known touring musician (ex-Icicle Works), and Google independently corroborates a gig at "the Flowerpot, Derby", matching the stored Derby location. His Facebook (facebook.com/ian.mcnabb.52/) was visited and confirmed to be a PERSONAL PROFILE shape (Friends tab, "Personal details: Lives in Liverpool", gender field, birthday) — not attachable per §2A.1 item 4. His own domain ianmcnabb.com was visited and attached as websiteUrl; its content is an album-promo teaser with no standalone "about the artist" bio block to quote, so bio was left empty per §0.0 (no third option). |

All 8 confirmed via `get_by_id` immediately before each `edit_artist` call and read back after write, byte-exact — including Steely Dad Band's emoji/curly-apostrophe/en-dash bio (verified via `codePointAt()` on the live DOM before writing, per the standing curly-apostrophe lesson) and Clean Slate's 3-line bio with its preserved line breaks.

## Records recorded as an EVIDENCED BLANK (6) — both surfaces tried

| Artist | Variants tried (Google + Facebook page search) | Reason |
|---|---|---|
| The Tree-Katz | `"The Tree-Katz" band Staffordshire facebook` (Google); `The Tree-Katz` (FB page search) | No exact-name UK candidate on either surface — only unrelated Katz-named pages (Weymouth, Poland, Manchester, Jacksonville FL) and a Walsall pub. |
| Recolte | `Recolte band Staffordshire facebook` (Google); `Recolte band` (FB page search) | No UK candidate found — only Staffordshire function-band directories (Google) and "La Recolte" (Cajun music, non-UK) plus an unrelated Quebec cafe (FB). |
| Three Way Switch | `"Three Way Switch" band Plymouth facebook` (Google); `Three Way Switch band` (FB page search) | No exact-name match on either surface — closest was "The Three Way" (different name, no Plymouth link shown) and various unrelated worldwide "Three ___" bands. |
| Jasper | `Jasper band Paignton covers facebook` (Google); `Jasper band Paignton`, `Jasper band Devon` (FB page search) | No confident match. A "Jasper Devon" FB result tagged Musician/band had zero followers, no description and did not load — insufficient evidence to meet the identification bar. |
| Me N Er | `"Me N Er" duo Exmouth facebook` (Google); `Me N Er duo` (FB page search) | No candidate found on either surface — only unrelated "Duo Er"/"Duo N" profiles and Exmouth community groups. |
| Chris Back | `"Chris Back" musician Ashburton Devon facebook` (Google); `Chris Back music` (FB page search) | No candidate under this surname on either surface — closest was "Chris Buck Music" (different surname). |

One further record found a genuine page but was NOT attached, due to an unresolved region mismatch:

| Artist | Evidence | Reason not attached |
|---|---|---|
| The Nigel Bagge Band | facebook.com/THENIGELBAGGEBAND (522 likes), own site nigelbagge.co.uk — a real, well-documented UK blues musician (ex-Nicky Moore's Blues Corporation, session work with Peter Green/Chris Farlowe) | Identity is not in doubt, but every corroborating gig (Blues Bar Tring, Tring Park Cricket Club, Tropic at Ruislip) places the act in Hertfordshire, not the stored Hampshire. Blank beats wrong — not attached; logged to CTO-INBOX for a human check of the stored region. |

## Records SKIPPED, and why

None skipped outright among the 15 selected — every record was either enriched or recorded as an evidenced blank/DATA-flagged. Venues: all 34 backlog records reconfirmed against standing fingerprints, with 3 independently spot-checked live rather than only trusting prior reports (see Tier 3 above).

## Names corrected under §0.6 / §0.20

None. (Confirmed — did NOT rename — Cyril Blake's Multicoloured Bus Ride despite its Facebook page's current display title reading differently; see CTO-INBOX entry.)

## Defects / decisions logged to CTO-INBOX (4 new entries)

- `bv2a-tmp-scratch-collision-firing1623z` — RULE. `/tmp` is a shared, non-isolated scratch space across firings; a stale script from an earlier firing (owned by a different uid) was silently re-executed when this firing's own write to the same generic filename failed with "Permission denied". Recovered; caused only harmless duplicate evidence lines (verified). Recommend run-id-qualified `/tmp` filenames going forward.
- `bv2a-circuit-breaker-reassessed-firing1623z` — DECISION. Documents why Step 0 did not mechanically trip this firing, and that RUN-REPORT-15's ruling request is still open.
- `bv2a-firing1623z-nigel-bagge-region-mismatch` — DATA.
- `bv2a-firing1623z-cyril-blake-name-corroborated` — DATA.

## Validator summary line (verbatim)

```
15 records · 11 clean · 0 FAIL · 5 WARN   [mode=gate]
```

0 FAIL on the first and only pass — **no exclusions used**. The 5 WARNs: `STUB_NO_BIO` on The Amelia Carter Band and Air Head (both confirmed true no-bio-exists cases by visiting /about directly); `NAME_BILLING` "format tail on the name" on The Amelia Carter Band, Steely Dad Band and The Nigel Bagge Band — all three are the act's own genuine billed name (matching their own Facebook page names exactly), not a promo/venue tail; reviewed and judged non-defects, consistent with RUNBOOK's "Duo/Trio/Band tail is part of the name" ruling.

## Ledger / summary / dashboards

- `data/state/enrichment-evidence-2026-08-28-enrichment.jsonl` — 15 lines appended this firing (via a run-id-qualified Python script after the `/tmp` collision above was caught and corrected; verified tail content matched before trusting it).
- `data/state/enrichment-ledger.jsonl` — 15 `enrich` lines (8 verified, 7 blank, all artist) + 1 `snapshot` line appended (artistsTotal 3294, artistsMissingSocials 1334 — down from 1342, confirming the 8 writes — artistsMissingGenres 939, venuesTotal 3206, venuesMissingSocials 34 — unchanged, confirming 0 venue writes).
- `data/state/run-summary.jsonl` — 1 line appended, outcome `completed`, recordsEnriched 8, skipped 7.
- `CTO-INBOX.md` — 4 new entries (1 RULE, 1 DECISION, 2 DATA).
- Both dashboards rebuilt (`data/normalized/enrichment/DASHBOARD.html` — 3281 records, 123 snapshots; `data/normalized/DASHBOARD.html`).

## Budget and circuit breaker

**Budget used:** 0 venues + 15 artists (exactly at the artist cap), well within the 40-minute ceiling. **Circuit breaker: did not fire** (see Step 0 reasoning above — reassessed independently rather than trusted from a prior report's summary line). Chrome was available and logged in throughout, no disconnects. No hard stop encountered.

## Summary

**0 venues verified, 0 evidenced-blank-newly among the 34 backlog venues** (16th consecutive firing reconfirming saturation; 3 independently spot-checked live this firing, corroborating the standing finding rather than only citing it). **8 artists enriched** — 6 with a directly attached, verified Facebook page (Back to back, The Amelia Carter Band, Steely Dad Band, Cyril Blake's Multicoloured Bus Ride, Air Head, Silkstone) plus 1 more with Facebook and bio (Clean Slate) and 1 via a confirmed own-website only where the only Facebook presence was a personal profile (Ian McNabb) — **+ 6 evidenced blank** (no candidate on either surface) **+ 1 found-but-not-attached on an unresolved region mismatch** (The Nigel Bagge Band). Both surfaces (Google + Facebook page search via Chrome) tried throughout for every blank. No names corrected — one near-miss (Cyril Blake's Multicoloured Bus Ride) explicitly NOT renamed despite its page's misleading current display title, and logged so it isn't "corrected" by a future firing. Validator: `15 records · 11 clean · 0 FAIL · 5 WARN` — 0 FAIL, zero exclusions needed, achieved by deliberately selecting only pre-empty-bio candidates this firing to sidestep the known BIO_VERBATIM/evidence-keying defect class rather than invent or repeat an undocumented workaround. A real infrastructure defect (shared `/tmp` scratch space causing a stale script replay) was hit, caught, and corrected mid-firing before any wrong data reached bndy or the evidence file; logged to CTO-INBOX. Selection reached a new oldest-touched record (Back to back, created 2025-02-14) via a fresh offset-750 Tier 4 sample. Circuit breaker did not fire; RUN-REPORT-15's open ruling request remains outstanding for Jason/CTO.
