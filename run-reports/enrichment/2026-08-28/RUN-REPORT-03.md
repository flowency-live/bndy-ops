# Bv2a Enrichment — RUN-REPORT-03 — 2026-08-28

**Run id:** `bv2a-enrichment-2026-08-28T03-19-12Z`. **Outcome: completed.**

## Circuit breaker (Step 0)

Checked the last 3 run reports by mtime before any other action: `RUN-REPORT-02` (2026-08-28, 02:19:05Z firing, completed, validator `5 records · 3 clean · 0 FAIL · 2 WARN`), `RUN-REPORT-01` (01:17:31Z firing, completed, `5 records · 4 clean · 0 FAIL · 2 WARN`), `RUN-REPORT-00` (00:19:03Z firing, completed, `7 records · 6 clean · 0 FAIL · 1 WARN`). All three completed with a final 0 FAIL. Breaker did not fire.

## Runbook / task spec read

`RUNBOOK.md` H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed. Read in full: §0A, §0 prime directives 1–29, §1/§1A identity + same-name protocol, §2/§2A enrichment protocol (2A.1 items 1–8 including 3b both-surfaces-mandatory, 3c two-word-query rule, item 8 bio-is-a-quotation), §3 venue protocol, §4, §5, §6 run discipline, §6A run contract (steps 0–9), §6B platform facts, §6C failure classes, §6D/6D-bis, §6E, §6F, §6G concurrency lock protocol/TTL table/dead-holder takeover, §7 change control (full changelog v1.0–v2.27). `ENRICHMENT-TASK-v3.md` read in full: §0.0, §FP fast path, §1–§12. `CTO-INBOX.md` read in full (lines 1–478, the standing precedent set through today's earlier firings).

## Concurrency

`data\state\claims\bv2a-enrichment.json` read at firing start held `{"heldBy":null,"releasedAt":"2026-08-28T02:56:30Z","lastRun":"bv2a-enrichment-2026-08-28T02-19-05Z"}` — released. Wrote heartbeat `data\state\heartbeat\bv2a-enrichment-2026-08-28T03-19-12Z.json` (`outcome:"started"`) before any gate, then acquired the claim (`heldBy: bv2a-enrichment-2026-08-28T03-19-12Z`, TTL 3h, `expiresAt: 2026-08-28T06:19:12Z`). No `data\state\enrichment.lock` file present — not honoured, not recreated, per §6A step 2b.

Chrome: exactly one connected browser, logged into Facebook (confirmed via a live navigation to facebook.com before any work began). Both venues and artists were in scope this firing.

## Standing precedents applied

- `bv2a-venue-edit-facebookurl-param-silent-noop` / `-instagramurl-` — the one venue write this firing used `socialMediaUrls`, not the top-level `facebookUrl` parameter.
- `bv2a-firing1319z-verify-id-before-live-write` — `get_by_id` immediately before every `edit_artist`/`edit_venue` call, confirming the target name before writing.
- `bv2a-firing1319z-never-guess-fb-vanity-url` — every URL written was read from a page actually visited this firing; no vanity URL was inferred from a name.
- `bv2a-firing2119z-edit-artist-genres-param-replaces-not-merges` — checked each target's stored `genres` via `get_by_id` before writing; all four had empty `genres` arrays, so no merge was needed, but the check was made in every case.
- `bv2a-firing1419z-validator-cannot-check-venues` — the one venue write excluded from the validator gate pass.
- `bv2a-firing1419z-bio-verbatim-fires-on-untouched-preexisting-bio` (and its 1717z/2319z recurrences) — Crowspeak and One Step Behind both already carried a pre-existing bio that this firing did not touch (only `genres` was written). Both were **excluded from the validator gate pass** with this rationale, consistent with the standing precedent, rather than risk (or engineer around) a false-positive `BIO_VERBATIM` FAIL on a field this firing never wrote.
- `bv2a-venue-backlog-saturated` (reconfirmed for a 4th consecutive firing today) — cross-referenced all 36 `missingSocials` venues individually against CTO-INBOX standing flags before selecting candidates, rather than re-searching known-bad records.

## Selection and work, by tier

**Tier 1 — artists created in the last 24h missing socials:** `list_artists(createdSince:"2026-08-27T03:19:12Z", missingSocials:true)` returned 11. All 11 worked. **0 verified, 11 evidenced blank** — see below.

**Tier 2 — venues created in the last 24h missing socials:** `list_venues(createdSince:"2026-08-27T03:19:12Z", missingSocials:true)` returned 0. Nothing to work.

**Tier 3 — backlog venues missing socials, oldest first:** `list_venues(missingSocials:true)` returned 36. Cross-referenced all 36 individually against standing CTO-INBOX flags read this firing: **31 already accounted for** (flagged not-a-venue / business-mismatch / address-mismatch / closed / ambiguous-duplicate classes). **5 unflagged candidates found and worked: 1 verified, 4 evidenced blank.** Backlog otherwise saturated, confirming the standing finding for a 4th consecutive firing today.

**Tier 5 — artists missing genres that already hold a facebookUrl:** `list_artists(missingGenres:true)` returned 950 (paged the first 50). Selected records with a pre-existing `facebookUrl`/website already attached, so no identity decision was needed — only the genre (and, where directly evidenced, `location`/`actType`) top-up. **4 worked, 4 verified.**

Artists worked this firing: **15 of 15 cap.** Venues worked this firing: **5 of 30 cap** (backlog saturated at that point; budget was not the limiting factor).

### Verified — artists (4)

| Artist | Fields written | Signal |
|---|---|---|
| Crowspeak (`1c60f5cb…`) | `genres: ["Folk"]` | Tier A — act's own website (crowspeakmusic.com, linked from its FB page): *"Dark Haunting Folk Music… Dark folk for your weary soul"* |
| One Step Behind (`4f46f4ea…`) | `genres: ["Ska"]` | Genre inferred per §2A.2 from the record's own pre-existing bio + `actType:["tribute"]` (*"The UK's favourite Madness tribute band!!"*) — Madness is a Ska-genre act. No Chrome visit made for this record this firing. |
| Soul Ranger (`be87645e…`) | `genres: ["Country","Soul"]`, `location: "Leicester"`, `locationType: "city"` | Tier A — act's own FB page: *"Authentic Country duo… blending the raw honesty of country with the deep, emotive grooves of soul"*, and *"Lives in Leicester… From Coalville, Leicester"* — corrected from the stored fallback `Nottingham` per §7 (page-stated location beats a gig-town/stored guess). |
| The Desperate Cowboys (`6212cbb4…`) | `actType: ["originals","covers"]` (merged with existing `["covers"]`) | Tier A — act's own FB page: *"dedicated to recording fun songs, mostly originals but with a few classic covers"*. No genre evidence on the page — left unfilled. |

### Verified — venues (1)

| Venue | Fields written | Signal |
|---|---|---|
| Eastwood & District Conservative Club Ltd (`fcbdabb0…`) | `socialMediaUrls: [facebook]` | Tier A — exact address match: bndy holds "9 Church St, Eastwood, Nottingham NG16 3BP"; the FB page (`profile.php?id=100063578378597`) states "9 Church Street, Eastwood, Notts NG16 3BP, Nottingham" verbatim. |

### Evidenced blank — artists (11)

All 11 are records created in the last 24h with generic single/short-token stage names (`Collette`, `Manic`, `Tee`, `Jung`, `Xclusive`, `Plastic Soul`, `Agents of Chaos`, `Lee Wainwright`, `Joe McShane`, `the Reform`, `Over the Moon`) and a gig-town-fallback location (mostly `Greater Manchester UK`). Both surfaces (Google + Facebook page search) were tried for every one per §2A.1 item 3b; variants are recorded in the evidence file. None cleared the identification bar:

- **Over the Moon** — the one plausible-looking candidate (`overthemoonduo`) states *"From Manila, Philippines"* — hard-rejected as non-UK per §2A.1.1.
- **Collette** — the best-matching candidate ("80's pop princess Collette") carries no UK/Manchester evidence and reads as an Australian 80s pop persona — Tier C name-match only, rejected.
- **Jung** — candidate `WEAREJUNG` (2.1K followers) carries no bio and no location, tagline only — Tier C, rejected.
- **the Reform** — Google surfaced a strong-looking UK candidate (`TheReformLive`, described as a Pop/Rock/Indie covers band with a UK mobile number) but the page itself returned "This content isn't available" on visit and could not be verified or quoted live.
- **Agents of Chaos** — the Seattle-band candidate confirmed non-UK; a second 264-follower UK-sounding candidate ("Sparky, Rob, Lee, Mike, Matt… rock covers, blues, punk and 80's cheese") was seen in a Facebook search results listing but its page URL could not be extracted from the search DOM this firing (the FB search-results DOM does not expose ordinary `<a href>` links) — genuinely undecided, not rejected on evidence. Worth a re-run with a direct Chrome click-through rather than a DOM scrape.
- The remaining six (Lee Wainwright, Xclusive, Joe McShane, Manic, Plastic Soul, Tee) had no candidate that was both UK-consistent and evidenced at Tier A/B. Full variant lists are in the evidence file.

### Evidenced blank — venues (4)

- **Royal British Legion, Beeston** (`a874e3fb…`) — Google gave an exact address match (Haig House, 16 Hall Croft, Beeston NG9 1EL) but all three candidate Facebook URLs returned "This content isn't available" on visit. Flagged in CTO-INBOX for a human to find the page's current live URL.
- **Tresaith** (`987d093c…`) — the record's name is the village name, not a specific business; the stored address (61 Heol Y Graig) could not be matched to any of the candidate businesses found (Ship Inn, Skippers, camping site). Flagged as a possible mis-capture.
- **Taylors Bar, Barry** (`9375f56b…`) — both same-named Facebook candidates found are personal profiles in Eugene, Oregon (US) and Drumsna (Ireland); neither is Barry, Wales. Flagged.
- **The Tannery, Derby** (`d6572707…`) — a real, newly opened (June 2026) taproom with local press coverage but no dedicated Facebook page or website surfaced this firing.

## Validator summary line (verbatim)

Ran against the 13 artist records this firing actually wrote to or evidenced with a live capture (excluding the one venue write per the standing venue-shape defect, and excluding Crowspeak/One Step Behind per the standing untouched-pre-existing-bio false-positive):

```
13 records · 11 clean · 0 FAIL · 2 WARN   [mode=gate]
```

Both WARNs are `STUB_NO_BIO` (Soul Ranger, The Desperate Cowboys — a verified page is attached but the record's `bio` field is still empty; neither act's own page carried usable bio text at a glance this firing, and no bio was written for either, so the field stays honestly empty rather than composed).

0 FAIL. Batch ships.

## Defects and open items

- New this firing: the Facebook page-search results page does not expose ordinary `<a href>` DOM elements for its result cards the way an individual page or a "Search this Page" view does — a JS scrape of `document.querySelectorAll('a[href]')` on `/search/pages/?q=...` returns mostly notification/nav-bar links, not the search results themselves, unless the result text happens to be present in an anchor's innerText (worked for `Eastwood Conservative Club`, failed for the `Agents of Chaos` 264-follower candidate). Logged in CTO-INBOX; worth a Chrome-click-through fallback in a future firing rather than a DOM scrape when this happens again.
- `bv2a-venue-backlog-saturated` reconfirmed for a 4th consecutive firing: 31 of 36 missing-socials venues are already flagged or resolved; only 5 fresh candidates existed and all 5 were worked.

## Ledger / summary / dashboards

- `data/state/enrichment-evidence-2026-08-28-enrichment.jsonl` — 20 lines appended this firing (11 artist blanks, 2 artist genre-evidence lines, 2 artist source-page-evidence lines, 4 venue blanks, 1 venue verified).
- `data/state/enrichment-ledger.jsonl` — 20 `enrich` lines + 1 `snapshot` line appended.
- `data/state/run-summary.jsonl` — 1 line appended, outcome `completed`, recordsEnriched 5, skipped 15.
- `20-Daily/2026-08-28.md` — link to this report appended.
- `CTO-INBOX.md` — 3 new DATA entries (Royal British Legion Beeston, Tresaith, Taylors Bar).
- Both dashboards rebuilt (`data/normalized/enrichment/DASHBOARD.html`, `data/normalized/DASHBOARD.html`) — exit 0.

## Summary

**1 venue verified + 4 evidenced blank** (backlog saturated after cross-referencing 36 candidates against standing flags — only 5 were fresh). **4 artists verified (genre/location/actType top-ups, all from source pages already on record) + 11 evidenced blank** (a batch of generic-name new artists, half rejected on non-UK or no-evidence grounds, both search surfaces tried throughout). Validator: 0 FAIL on the 13 gate-eligible artist records. Elapsed approximately 19 minutes (heartbeat 03:19:12Z → this report). Circuit breaker did not fire; no hard stop encountered.
