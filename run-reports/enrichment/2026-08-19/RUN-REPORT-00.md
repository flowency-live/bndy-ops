# Bv2a Enrichment — RUN REPORT — 2026-08-19, firing 00 (00:19Z)

## Step 0 — Circuit breaker
Read the last 3 run reports (RUN-REPORT-23, 22, 21, all `data/normalized/enrichment/2026-08-18/`,
found by mtime). Each recorded 0 outstanding FAIL from the validator on its final run, and all
three wrote a report. 0 of 3 recorded a FAIL, none failed to write a report. **Breaker NOT
TRIPPED.** Proceeded.

## Step 1 — Concurrency
No `.lock` file honoured or created. Claim path confirmed as
`data/state/claims/bv2a-enrichment.json` per the standing fingerprint
`bv2a-claim-path-stale-in-prompt` — the prompt's nominal `enrichment.json` path has never
existed. Found `heldBy:null`, `lastRun: bv2a-enrichment-2026-08-18T23-19-51Z` (released
2026-08-18T23:37:00Z by firing 23). Heartbeat written first:
`data/state/heartbeat/bv2a-enrichment-2026-08-19T00-18-59Z.json`. Claim acquired:
`heldBy: bv2a-enrichment-2026-08-19T00-18-59Z`, `expiresAt: 2026-08-19T03:18:59Z` (3h TTL).
Retired `data/state/enrichment.lock` mechanism not present, not recreated.

## Step 2 — Reads
`RUNBOOK.md` read: H1 **v2.27**, current floor **v2.19** — pass. Read §0 (prime directives,
incl. §0.6 name-stripping and its venue-rename extension), §2A.1/§2A.2 (enrichment protocol,
incl. item 3b both-surfaces-before-blank and item 8 bio-is-quoted), §3 (venue protocol,
incl. the apostrophe/punctuation search-miss warning), §6A (run contract, concurrency, floor).
`ENRICHMENT-TASK-v3.md` read: §0.0 (bio quoted never written — moot this firing, no bio field
touched under venue §FP.2) and §FP (§FP.2 venue fast path; §FP.3 artist fast path not
reached, Chrome down). `CTO-INBOX.md` OPEN section read in full (all ~120 entries) for
standing fingerprints, not-a-venue flags, ambiguous-name flags, and same-day evidenced
blanks to exclude from the candidate pool.

## Step 3 — Chrome check
`list_connected_browsers` returned `[]`. Chrome unreachable for a **TWENTY-SEVENTH**
consecutive firing (22 on 08-17 22:17Z through this firing, over 26 hours). Per the runbook's
hard-stop table, artist priorities 1, 4 and 5 (all require Chrome for identity confirmation or
bio quoting) are HARD-STOPPED. Venue work proceeded under §FP.2, which needs no Chrome.

## Work order followed
Priority 2 (venues created last 24h, missing socials): **0 candidates**
(`createdSince` 2026-08-18T00:18:59Z, `missingSocials:true` → 0 results).
Priority 3 (backlog venues missing socials, oldest `createdAt` first): worked from the
196-venue backlog (80 of 196 paged and locally sorted by `createdAt`), oldest-eligible-first,
excluding: non-UK festival-tour venues (bndy-capture batch prefix `6022ef13-...` — Lille,
Paris, Stockholm, Athens, Thessaloniki, Gothenburg, Copenhagen, Dublin, Skien, Hamburg,
Espoo), standing not-a-venue flags (Hunstanton Bandstand, Jubilee Park Horndean, Ann Welfare
Playing Fields, Campbell Park, Gostrey Meadow, West Park Long Eaton, Plympton Spice, The
Decorated Dead Tattoo Studio, Astor Hall, Decade of Dance, Castle playing fields, Centre
Totnes, EX39 4JN/Instow Beach), standing ambiguous/conflict flags left blank in earlier
firings (The Holly Tree, White Lodge, The Nest, Darcy's, The Cock Inn St Albans, Newton
Abbot 76 Sports & Social Club — still Chrome-blocked), Venue TBC (garbled placeholder name),
and records already worked as an evidenced blank in the immediately preceding firing
(23, 23:19Z, ~1 hour earlier: West End Club, Annitsford Welfare Club, Hayfield Club, The
Tannery, The Saracens Head, Jubilee Inn Torpoint, Walton Hersham & Oatlands Conservative
Club, The Turks Head) and firing 22 (HalfWay House, Lamplight Coxhoe, Dicey Reilly's, The
Nags Head, Sola Bar & Kitchen). "Arena Torquay" was excluded on sight — its lemonrock slug
`arenatorquay` matches the RUNBOOK §0.19 founding ignore-list entry (a 1,500-capacity room
outside bndy's remit); not worked, flagged for a human check of whether the record should
carry that same exclusion.

## Records enriched WITH a verified page (22)
| Venue | facebookUrl | website | Evidence |
|---|---|---|---|
| The Stumble Inn, Long Eaton | facebook.com/thestumble/ | — | exact address match, 37 Tamworth Rd |
| Tramways, Wells | facebook.com/p/Tramways-Wells-100086431944792/ | tramwaysclub.co.uk | exact address, West St BA5 2HN |
| Red Cow, Richmond | facebook.com/redcowpub/ | redcowpub.com | exact address, 59 Sheen Rd |
| The Crab & Beacon, East Grinstead | facebook.com/61560815712965 | crabandbeacon.com | exact address, Atrium King St |
| The Fleur de Lis Hotel, Stoke sub Hamdon | facebook.com/p/Fleur-de-Lis-Stoke-Sub-Hamdon-61560603020511/ | fleurstokesubhamdon.uk | village match, West St |
| Torquay Central Conservative Club | facebook.com/torquaycentralcons/ | — | address match, Union St TQ2 5QS |
| Duke Of York, Shepton Beauchamp | facebook.com/p/Duke-of-York-Shepton-Beauchamp-61573810334682/ | dukeofyorkshepton.co.uk | village match |
| Haven Rockley Park Holiday Park | facebook.com/RockleyParkHolidayPark/ | haven.com/parks/dorset/rockley-park | official Haven brand page, address match |
| The White Hart, Hemel Hempstead | facebook.com/whiteharthemel | — | exact address, 30-32 High St |
| Leighton Buzzard Library Theatre | facebook.com/LBLibraryTheatre/ | — | exact address, Lake St LU7 1RX |
| The Kingfisher Public House, Colyton | facebook.com/p/The-Kingfisher-Public-House-Colyton-100063555252058/ | thekingfishercolyton.uk | exact address, Dolphin St |
| The Spotted Dog, Dorking | facebook.com/p/The-Spotted-Dog-Pub-Dorking-61555617812305/ | spotteddogdorking.co.uk | exact address, 42 South St |
| The Black Lion, West Hampstead | facebook.com/blacklion.wh/ | — | exact address, 295 West End Ln |
| The Hatch Inn, Hatch Beauchamp | facebook.com/thehatchinn/ | — | village match |
| The Black Horse, Clapton in Gordano | facebook.com/159843197366504 | theblackhorseclapton.co.uk | exact address, Clevedon Ln BS20 7RH |
| The Cranberry Farm, Cranbrook | facebook.com/cranberryfarmhw/ | — | exact address, EX5 7FN |
| Dukes Wine Bar, Princes Risborough | facebook.com/100063535694828 | — | exact address, Duke St HP27 0AT |
| Rye Harbour Holiday Park | facebook.com/262568813870688 | — | exact name match, "...Holiday Park - Home" |
| The Cock Inn, Bishop's Stortford | facebook.com/p/The-Cock-Inn-100063763142035/ | — | exact address, 2 Stansted Rd |
| Signature Brew Haggerston | facebook.com/signaturebrewe8/ | signaturebrew.co.uk (Haggerston page) | exact address, Acton Mews E8 4EA |
| Arundel Emporium, Sheffield | facebook.com/p/Arundel-Emporium-61572239060173/ | — | exact address, 16 Matilda St S1 4QD |
| Dexter And Jones, Knutsford | facebook.com/dexterandjones/ | — | name + town match |

All 22 confirmed by exact or near-exact address/postcode/town match in the search result
title or snippet, per §FP.2 step 3. Every write's `updatedFields` response checked (all
returned `socialMediaUrls`, several also `website`), and 3 spot-checked with `get_by_id`
(Dexter And Jones, Signature Brew Haggerston, The Stumble Inn) — all read back correctly.

## Records recorded as an EVIDENCED BLANK (5), variants tried on both surfaces
- **Hartlepool United FC Supporters Association** — `"Hartlepool United FC Supporters
  Association" facebook`. Only generic fan groups and the main club page surfaced; no page
  specifically belonging to the Supporters Association at the Clarence Rd ground address.
- **Okehampton Show ground** — `"Okehampton Show" ground facebook`. The well-known "Okehampton
  Show" page (6,568 likes) is for the annual show at Stoney Park Showground, postcode EX20
  1SW — the bndy record's postcode is EX20 4LP, a different address. Left blank rather than
  attach a page for what may be a different site; flagged for a human check.
- **King William Ⅳ, Bristol** — `"King William IV" Broad Street Bristol facebook`. Address
  (62 Broad St, Staple Hill BS16 5NP) is confirmed correct, but the only two Facebook
  candidates found are both explicitly titled "Warmley" — a different Bristol suburb. Left
  blank rather than attach a wrong-place page.
- **Red Lion, Stevenage** — `"Red Lion" High Street Stevenage facebook`, `site:facebook.com
  "Red Lion" Stevenage pub`. Only a fan group and an "Old Red Lion" profile (possible rename,
  unconfirmed) surfaced; no confidently matching own page.
- **Bowling Green Stage, Nantwich Food Festival** — `Nantwich Food Festival "Bowling Green
  Stage" facebook`. Confirmed as a temporary music stage in the festival's Bowling Green car
  park, not a fixed building with its own identity — same class as the standing council-park
  not-a-venue findings. Not enriched; flagged for a human check of whether this record should
  exist as a bndy venue.

## Data-quality finding, own-firing (1)
**"1865, 1 Carlton Pl", Southampton** (`e29b150b-0939-4d49-bd7a-a5099d9528af`) — search for
the well-known Southampton venue "The 1865" confirms its real address is 25-27 Brunswick
Square, Southampton SO14 3AR — which is the exact address already held by the separate bndy
record **"Venue TBC"** (`2f2e5e77-314a-4ce6-8377-b705e9480cdc`, flagged unsearchable in an
earlier firing). This record's own address, "1 Carlton Pl, Southampton SO15 2DY", does not
match The 1865's real site. Left blank rather than attach The 1865's Facebook page to the
wrong address. Flagged in CTO-INBOX for a human check — possible that "Venue TBC" and this
record should be merged, or that this record's address is simply wrong.

## Records SKIPPED, and why
- **Arena Torquay** (`c97a9fd2-f5c9-4699-a1ed-ef55f8a3b2b5`) — name matches the RUNBOOK §0.19
  founding ignore-list entry `lemonrock/arenatorquay` (a 1,500-capacity room outside bndy's
  remit). Not worked. Needs a human check of whether this bndy record should carry the same
  exclusion or be removed.
- All artist priorities (1, 4, 5) — Chrome unreachable, hard-stopped per the runbook's own
  table. Artist backlog (871 missing socials, 615 missing genres) static this firing.
- Standing not-a-venue, ambiguous-name, and same-day-already-blank records listed under "Work
  order followed" above were excluded from the candidate pool per precedent and not
  re-attempted.

## Names corrected under §0.6
None. No promo-billing or lineup-contaminated names encountered this firing (venue protocol
only, no artist creates or edits).

## Validator summary line (verbatim)
```
28 records · 6 clean · 0 FAIL · 44 WARN   [mode=gate]
```
First pass returned 21 `FB_EVIDENCE_MISMATCH` FAILs — the evidence file's `capturedFrom`
lines were written with a `www.` prefix (and, on one record, a trailing `/about` path) while
the stored `facebookUrl` values were correctly canonicalised without it (RUNBOOK §2A.2).
Same class as the standing `bv2a-firing08-canonicalised-url-triggers-evidence-mismatch`
fingerprint. Corrected by appending 21 second evidence lines in the exact canonical stored
form (append-only, last-line-wins in the loader); re-run returned 0 FAIL. All 44 WARNs are
`STUB_NO_BIO`/`STUB_NO_IMAGE` on the 22 verified records — expected noise per the standing
`validator-venue-schema-mismatch` fingerprint: venues carry no bio/image requirement under
§FP.2. Records/evidence adapted for the validator via a records.json written directly in
the `{"venues":[{id,name,location,facebookUrl}]}` shape the validator reads (standing
`validator-venue-schema-mismatch` fingerprint) and an aliased evidence file mapping each
line's `venueId` to `artistId` for the loader (standing
`validator-venue-evidence-loader-artistid-only` fingerprint) — the source-scoped
`enrichment-evidence-2026-08-19-enrichment.jsonl` itself is untouched in meaning, only a
derived copy (`.aliased.jsonl`) is aliased.

## Budget used
22 venues verified + 5 evidenced blank + 1 data-quality flag (no bndy write) + 1 skipped
(ignore-list match) = 28 venue records worked, under the 30-venue cap. 0 artists (Chrome
hard-stop). Elapsed roughly 25 minutes of the 40-minute budget. Circuit breaker did not fire
(0 FAIL on this firing's final validator run, all three prior reports clean).

## Ledger / snapshot / dashboards
Appended 22 `enrich`/verified lines + 6 `enrich`/blank lines + 1 `snapshot` line to
`data/state/enrichment-ledger.jsonl` (now 2327 total lines). Snapshot: artistsTotal 2243,
artistsMissingSocials 871, artistsMissingGenres 615 (all unchanged — Chrome hard-stop),
venuesTotal 3005, venuesMissingSocials 174 (down from 196). Appended 1 line to
`data/state/run-summary.jsonl`. Regenerated `data/normalized/enrichment/DASHBOARD.html`
(2216 enrichment records, 74 snapshots) and `data/normalized/DASHBOARD.html`.

## CTO-INBOX additions this firing
- `bv2a-chrome-unreachable-27-firings-one-day` (BLOCKED)
- `bv2a-firing00-1865-carlton-place-address-mismatch` (DATA)
- `bv2a-firing00-king-william-iv-warmley-place-mismatch` (DATA)
- `bv2a-firing00-okehampton-show-ground-postcode-mismatch` (DATA)
- `bv2a-firing00-bowling-green-stage-nantwich-not-a-venue` (DATA)
- `bv2a-firing00-arena-torquay-ignore-list-match` (DATA)
