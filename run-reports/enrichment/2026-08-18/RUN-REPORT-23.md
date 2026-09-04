# Bv2a Enrichment — RUN REPORT — firing 23, 2026-08-18 23:19Z

## Step 0 — Circuit breaker
Read the last 3 run reports (RUN-REPORT-22, 21, 20, all in `data/normalized/enrichment/2026-08-18/`).
Re-verified by mtime-sorting the folder myself (no newer report existed). Each of the
three recorded 0 outstanding FAIL from the validator on its final run, and all three
wrote a report. 0 of 3 recorded a FAIL, none failed to write a report. **Breaker NOT
TRIPPED.** Proceeded.

## Step 1 — Concurrency
No `.lock` file honoured or created. Claim path confirmed as
`data/state/claims/bv2a-enrichment.json` per the standing fingerprint
`bv2a-claim-path-stale-in-prompt` — the prompt's nominal `enrichment.json` path has
never existed. Found `heldBy:null`, `lastRun: bv2a-enrichment-2026-08-18T22-17-15Z`
(released 22:39:00Z by firing 22). Heartbeat written first:
`data/state/heartbeat/bv2a-enrichment-2026-08-18T23-19-51Z.json`. Claim acquired:
`heldBy: bv2a-enrichment-2026-08-18T23-19-51Z`, `expiresAt: 2026-08-19T02:19:51Z`
(3h TTL). Retired `data/state/enrichment.lock` mechanism not present, not recreated.

## Step 2 — Reads
RUNBOOK.md read in full: H1 **v2.27**, current floor **v2.19** — pass. Read §6A (run
contract, concurrency, floor), §6F/§6G (concurrency mechanics), §2A.1/§2A.2
(enrichment protocol, incl. item 3b both-surfaces-before-blank), §3 (venue protocol),
§0.6 (name correction — no corrections needed this firing, no promo-billing names
encountered). `ENRICHMENT-TASK-v3.md` read: §0.0 (bio is quoted, never written — no
bios written this firing, venues carry none under §FP.2) and §FP (§FP.2 venue fast
path, §FP.3 artist fast path — not reached, Chrome down). `CTO-INBOX.md` OPEN section
and last ~40 entries read for standing fingerprints and exclusions (not-a-venue finds,
postcode mismatches, garbled names, already-attempted-today records).

## Step 3 — Chrome check
`list_connected_browsers` returned `[]`. Chrome unreachable for a **TWENTY-SIXTH**
consecutive firing (22 on 08-17 22:17Z through this firing, 25+ hours). Per the
runbook's hard-stop table, artist priorities 1, 4 and 5 (all require Chrome for
identity confirmation or bio quoting) are HARD-STOPPED. Venue work proceeded under
§FP.2, which needs no Chrome.

## Work order followed
Priority 2 (venues created last 24h, missing socials): **0 candidates**
(`createdSince` 2026-08-17T23:19:51Z, `missingSocials:true` → 0 results).
Priority 3 (backlog venues missing socials, oldest `createdAt` first): worked from a
214-venue backlog, oldest first, excluding standing CTO-INBOX flags (not-a-venue,
address mismatches, garbled names) and non-UK festival-tour venues (deprioritised,
not reached).

## Records enriched WITH a verified page (18)
| Venue | facebookUrl | website | Evidence |
|---|---|---|---|
| The Dolphin Hotel, Plymouth | facebook.com/thedolphinpubbarbican | — | exact address match, 14 The Barbican |
| Crab & Winkle, Peterborough | facebook.com/pages/The-Crab-Winkle/495438213811784 | greeneking.co.uk/pubs/cambridgeshire/crab-and-winkle | exact address match via findglocal, 3 Loxley PE4 5BW |
| The Green Man, Herongate | facebook.com/people/The-Green-Man-Herongate/61582118639860 | — | name+town match |
| Haven Littlesea Holiday Park | facebook.com/424101650980815 | haven.com/parks/dorset/littlesea | official brand page, address match |
| Oddfellows Arms, Hemel Hempstead | facebook.com/oddfellows.arms.9 | — | exact address (Apsley HP3 9SP), active music-venue page |
| The Star, Guildford | facebook.com/starguildford | starinnguildford.co.uk | exact address, 2 Quarry St |
| Highfield Social Club, Bicester | facebook.com/Highfieldsocialclub | — | matches planning record, George St OX26 2EE |
| The Prince Of Wales, Stoke sub Hamdon | facebook.com/theprinceofwaleshamhill | — | exact "Ham Hill" match |
| Royal Torbay Yacht Club | facebook.com/royaltorbay | rtyc.org/contactus | exact address, 12 Beacon Terrace |
| Seawick Holiday Village | facebook.com/118646814940446 | — | address match, St Osyth CO16 8SG |
| The Springhouse Sports Club & Function Suites | facebook.com/thespringhouse | — | matches Springhouse Rd Corringham/Stanford-le-Hope |
| Carters Rest, Wroughton | facebook.com/61564019623949 | — | exact address, 57 High St SN4 9JU |
| Dolphin Eye, High Wycombe | facebook.com/thedolphineye | — | name+town (Totteridge) match |
| The Old Inn, Widecombe | facebook.com/theoldinnhw | — | exact postcode TQ13 7TA |
| Vault 17, Chesham | facebook.com/p/Vault-17-Chesham-61561322856202 | vault17.co.uk | exact address, 17 High St |
| The Frog & Ferret, Spennymoor | facebook.com/FrogandFerret | thefrogandferretspennymoor.co.uk | exact address, 4 Coulson St |
| The Chapel Park, Newcastle upon Tyne | facebook.com/p/The-Chapel-Park-100072119405304 | — | name+town, live-entertainment pub |
| The Alexandra, Edgeley/Stockport | facebook.com/p/Alexandra-Pub-100040793114946 | robinsonsbrewery.com/pubs/the-alexandra-edgeley | exact address, 195 Northgate Rd |

Two of these (Dolphin Hotel Plymouth, Crab & Winkle) were recorded as **evidenced
blanks by firing 22** roughly an hour earlier; a `site:facebook.com` / numeric-id
search variant this firing surfaced a confidently address-matched page that firing
22's variants missed. Both logged as blank-then-verified disagreements in
`CTO-INBOX.md`, same class as the standing Darley Park / Swadlincote pattern.

## Records recorded as an EVIDENCED BLANK (8), variants tried per §FP.2
- **West End Club**, Stapleford — `"West End Club" Stapleford Nottingham facebook`,
  `West End Club Stapleford facebook.com page`, `"321449411237168" West End Club
  Stapleford`. No page confidently confirmed to this town.
- **Annitsford Welfare Club** — `"Annitsford Welfare Club" facebook`. Only Annitsford
  Irish Club (different address, 1 Barras Ave vs 33 Barras Ave) surfaced.
- **Hayfield Club**, Church St — `"Hayfield Club" Church Street Hayfield facebook`.
  Only Hayfield Con Club (name mismatch) surfaced.
- **The Tannery**, Sadler Gate, Derby — `"The Tannery" Sadler Gate Derby facebook`,
  `...Ashover Brew Co Derby facebook.com`, `Ashover Brew Co Tannery taproom Derby
  website`. New taproom (opened June 2026) has no own FB/site found — only the parent
  brewery's site.
- **The Saracens Head**, Newton Abbot — `"The Saracens Head" Newton Abbot
  site:facebook.com`. Only a personal-profile karaoke post found, no confirmed own
  page.
- **Jubilee Inn**, Torpoint — `"Jubilee Inn" Torpoint Fore Street site:facebook.com`.
  No page surfaced.
- **Walton Hersham & Oatlands Conservative Club** — `"Walton Hersham" Oatlands
  Conservative Club Manor Road site:facebook.com`. No page surfaced (consistent with
  an earlier firing's finding of an Instagram-only presence).
- **The Turks Head**, Reading (now trading as "The Turks") — `"The Turks Head" London
  Road Reading site:facebook.com`, `"160379291357743" Turks Head Reading`, `"The
  Turks" Reading pub London Road site:facebook.com`. Only an event page and a group
  post found, no confirmed own business page.

## Own-firing near-miss, self-corrected
**Newton Abbot 76 Sports & Social Club** was initially attached to a "New Page"
Facebook candidate on succession-naming reasoning alone. On writing the evidence
file, discovered firing 22 (29 minutes earlier, same evidence file) had already found
a THIRD competing candidate page and correctly left the record blank pending a Chrome
visit that neither firing had. Reverted the write (`socialMediaUrls` cleared back to
`[]`) and left it blank, consistent with firing 22's finding. Logged in
`CTO-INBOX.md` as `bv2a-firing23-name-succession-not-sufficient-evidence`.

## Records SKIPPED, and why
- **Astor Hall**, 157 Devonport Rd, Stoke, Plymouth — resolves to a nursing home
  (astorhall.co.uk) at that exact address, not a music venue. Not enriched. New
  CTO-INBOX finding (`bv2a-firing23-astor-hall-wrong-entity`).
- All artist priorities (1, 4, 5) — Chrome unreachable, hard-stopped per the runbook's
  own table. Artist backlog (871 missing socials, 615 missing genres) static this
  firing.
- Non-UK festival-tour venues (Lille, Paris, Stockholm x2, Athens, Thessaloniki,
  Gothenburg, Copenhagen, Dublin, Skien, Hamburg — batch externalId prefix
  `6022ef13-...`), council parks/playing fields, and other standing not-a-venue /
  postcode-mismatch / garbled-name records already flagged in `CTO-INBOX.md` were
  excluded from the candidate pool per precedent and not re-attempted.

## Names corrected under §0.6
None. No promo-billing or lineup-contaminated names encountered this firing (venue
protocol only, no artist creates or edits).

## Validator summary line (verbatim)
```
27 records · 9 clean · 0 FAIL · 36 WARN   [mode=gate]
```
All 36 WARNs are `STUB_NO_BIO` / `STUB_NO_IMAGE` on the 18 verified records — expected
noise per the standing fingerprint `validator-venue-schema-mismatch`: venues carry no
bio/image requirement under §FP.2. No FAIL outstanding. Records/evidence adapted for
the validator via `data/state/build_validator_input_firing23.py`, per the standing
`validator-venue-schema-mismatch` (writes the `{"venues":[{id,name,location,
facebookUrl}]}` shape the validator actually reads) and `validator-venue-evidence-
loader-artistid-only` (aliases each evidence line's `venueId` to `artistId` for the
loader) fingerprints.

## Budget used
18 venues verified + 8 evidenced blank + 1 skipped (not-a-venue) + 1 self-corrected
= 28 venue records worked, under the 30-venue cap. 0 artists (Chrome hard-stop).
Elapsed roughly 20 minutes of the 40-minute budget, well within it. Circuit breaker
did not fire (0 FAIL on this firing's final validator run, all three prior reports
clean).

## Ledger / snapshot / dashboards
Appended 27 `enrich` lines + 1 `snapshot` line to `data/state/enrichment-ledger.jsonl`
(now 2297 total lines). Snapshot: artistsTotal 2243, artistsMissingSocials 871,
artistsMissingGenres 615, venuesTotal 3005, venuesMissingSocials 196 (down from 214).
Appended 1 line to `data/state/run-summary.jsonl`. Regenerated
`data/normalized/enrichment/DASHBOARD.html` (2188 enrichment records, 73 snapshots)
and `data/normalized/DASHBOARD.html`.

## CTO-INBOX additions this firing
- `bv2a-chrome-unreachable-26-firings-one-day` (BLOCKED)
- `bv2a-firing23-astor-hall-wrong-entity` (DATA)
- `bv2a-firing23-dolphin-hotel-plymouth-blank-then-verified-disagreement` (DATA)
- `bv2a-firing23-crab-winkle-blank-then-verified-disagreement` (DATA)
- `bv2a-firing23-name-succession-not-sufficient-evidence` (RULE)

## Note on evidence-file timestamps
The sandbox clock was queried intermittently rather than before every write; a
handful of `capturedAt` values in `data/state/enrichment-evidence-2026-08-18-
enrichment.jsonl` for this firing read as `2026-08-19T00:0x:00Z` when the real
wall-clock (confirmed at the end of the firing) never left `2026-08-18T23:xxZ`. Write
ORDER is correct (each evidence line preceded its corresponding bndy write) and no
record's identity or content is affected — only a few minute-level clock labels are
approximate. Flagging for transparency rather than as a defect requiring a fix.
