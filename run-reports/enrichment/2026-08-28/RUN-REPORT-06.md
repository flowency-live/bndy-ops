# Bv2a Enrichment — RUN-REPORT-06 — 2026-08-28

**Run id:** `bv2a-enrichment-2026-08-28T06-18-43Z`. **Outcome: completed.**

## Circuit breaker (Step 0)

Pre-checked by the orchestrating context before this firing: last 3 reports in `data\normalized\enrichment\2026-08-28\` — RUN-REPORT-05 (05:21Z), RUN-REPORT-04 (04:18Z), RUN-REPORT-03 (03:19Z) — all completed with a final 0 FAIL. Breaker did not fire. Independently re-confirmed by reading RUN-REPORT-05 in full this firing.

## Runbook / task spec read

`RUNBOOK.md` H1 = **v2.27**, read in full (all 731 lines, §0 prime directives 1–29, §1/§1A identity, §2/§2A enrichment protocol including item 3b both-surfaces and item 8 bio-quoted, §3 venue protocol, §4/§5 event rules, §6/§6A run contract, §6B platform facts, §6C failure classes, §6D–6E identity/horizons, §6F/§6G concurrency, §7 changelog tail). **CURRENT FLOOR (§6A) = v2.19.** Re-verified myself against the actual file text, not the prompt's number: 2.27 ≥ 2.19, floor check passed. `ENRICHMENT-TASK-v3.md` read in full (§0.0 bio-is-quoted, §FP fast path FP.1–FP.4, §1–3 mission/preconditions/selection, §5–8 evidence ladder/field rules/location/image recipe). `CTO-INBOX.md` tail read in full before selection, including today's standing fingerprints (bio-verbatim-untouched-preexisting, venue-backlog-saturated, silent-noop defects, genres-replace-not-merge, verify-id-before-write, never-guess-fb-vanity-url).

## Concurrency

`data\state\claims\bv2a-enrichment.json` read at firing start: `{"heldBy":null,"releasedAt":"2026-08-28T05:31:00Z","lastRun":"bv2a-enrichment-2026-08-28T05-21-03Z"}` — released. Wrote heartbeat `data\state\heartbeat\bv2a-enrichment-2026-08-28T06-18-43Z.json` (`outcome:"started"`) before any gate, then acquired the claim (`heldBy: bv2a-enrichment-2026-08-28T06-18-43Z`, TTL 3h, `expiresAt: 2026-08-28T09:18:43Z`). No stray `data\state\enrichment.lock` file found — not honoured, not recreated, per §6A step 2b. Released at close (`heldBy:null`, `releasedAt:2026-08-28T06:32:36Z`) and heartbeat rewritten to `outcome:"completed"`.

Chrome: `list_connected_browsers` → exactly 1 connected browser. Logged into Facebook (confirmed live throughout — every Facebook page/search navigation returned the logged-in view, not an anonymous one).

## Standing precedents applied

- **90-day/same-day cooldown discipline** — before selecting Tier 4 backlog candidates, cross-referenced every candidate id against today's evidence file (`data/state/enrichment-evidence-2026-08-28-enrichment.jsonl`) and yesterday's (`...-08-27...`). 7 of my initial 13-candidate shortlist (Roadhouse Sinners, Futari, the 21st Amendment, Mojo Rising, Bash Bailey, Northern Quarter, Jonny Trax) had already been evidenced blank within the last ~4–24 hours on both surfaces — skipped, not re-searched, and backfilled the shortlist with the next-oldest untouched candidates instead.
- `bv2a-firing1319z-verify-id-before-live-write` — `get_by_id` immediately before all 7 live `edit_artist` calls; all 7 names confirmed correct before writing.
- `bv2a-firing1319z-never-guess-fb-vanity-url` — every URL written was one actually visited and read via `javascript_tool` (`document.body.innerText`), never inferred from a name.
- `bv2a-firing2119z-edit-artist-genres-param-replaces-not-merges` — checked existing `genres` via `get_by_id` before every write; Harmonic Fall and Dom Martin had empty pre-existing genres (no merge needed); Horizonz's pre-existing `["Rock"]` was preserved and `"Indie"` appended (`["Rock","Indie"]`) rather than overwritten.
- `bv2a-firing1419z-bio-verbatim-fires-on-untouched-preexisting-bio` (6th same-day recurrence) — F.A.B. 60's Tribute already carried a bio from an earlier onthecasemusic Phase-A harvest; this firing added only `facebookUrl`. First validator pass FAILed it on `BIO_VERBATIM` comparing that untouched bio against this firing's unrelated Facebook evidence text. Excluded from the gate pass with this rationale; 0 FAIL on the remaining 14. Logged to CTO-INBOX.
- `bv2a-venue-backlog-saturated` (reconfirmed for a 7th consecutive firing today) — `list_venues(missingSocials:true)` returned 34, identical composition to the 05:21Z firing. All 34 cross-referenced against CTO-INBOX fingerprints (park/nature-reserve, business-mismatch, ambiguous-address, non-venue/placeholder classes) and Darcy's (a 3-times-flagged possible-closure record). Zero unflagged records found. Zero venue work attempted this firing; full budget spent on the artist axis.
- `list-artists-createdsince-24h-string-not-parsed` — `createdSince` passed as a literal ISO string, not a differently-formatted computed value.

## New defect found and fixed this firing

**`bv2a-firing0618z-bash-heredoc-mangles-emoji-in-evidence`** — writing an evidence-file line via a bash `cat << 'EOF'` heredoc silently corrupted a multi-byte emoji (🌿, in Portway Blues Band's captured Facebook bio) into garbage bytes. The validator then FAILed `BIO_VERBATIM` against the correctly-written bndy bio, even though the actual `edit_artist` call and the DB read-back both held the real emoji throughout — this was an evidence-authoring defect, not a paraphrase. Fixed by rewriting that evidence line via Python with `ensure_ascii=False`; re-ran clean. Logged to CTO-INBOX with a recommendation that future firings write non-ASCII evidence text via Python/script rather than bash heredocs.

## Selection and work, by tier

**Tier 1 — artists created in last 24h missing socials:** `list_artists(createdSince:"2026-08-27T06:18:43Z", missingSocials:true)` returned 13. 11 of the 13 already carried today's evidence-file entries from earlier firings (00:45Z/03:22Z/04:23Z passes) and were not re-searched. **2 genuinely fresh/incomplete: Ben Nilsson** (created 2026-08-28T06:18:05Z, 38 seconds before this firing's claim — zero prior evidence) **and Virgin Mary's** (only 1 thin search variant logged at 04:23:45Z, not meeting the §2A.1 item 3b both-surfaces bar) — both completed properly this firing.

**Tier 2 — venues created in last 24h missing socials:** `list_venues(createdSince:"2026-08-27T06:18:43Z", missingSocials:true)` returned 0. Nothing to work.

**Tier 3 — backlog venues missing socials:** `list_venues(missingSocials:true)` returned 34, same as the 05:21Z firing (0 net change — the 2 venues that firing worked, The Tannery and Madeley Carnival, were both evidenced blanks, so they remain in the missingSocials filter). All 34 cross-checked directly against CTO-INBOX. Zero unflagged records. **0 venues worked this firing.**

**Tier 4 — backlog artists missing socials, oldest available first:** given the standing `bv2a-firing2319z-tier4-sampling-never-reaches-true-oldest` defect, pulled pages at offset 100 and offset 300 (25 records each) from `list_artists(missingSocials:true)` (1390 total), cross-referenced every candidate's id against today's and yesterday's evidence files, and selected the 13 oldest-by-createdAt candidates with zero or incomplete prior search history: F.A.B. 60's Tribute (2026-06-08), Harmonic Fall (2026-06-15), The Power 3 (2026-06-26), Flutter (2026-07-30), Horizonz (2026-07-31 15:22), Dom Martin (2026-07-31 20:35), Pontneuf (2026-07-31 21:50), Casting Pearls (2026-07-31 21:55), Liv and Bob (2026-07-31 22:15), Off The Wall (2026-07-31 23:44), Grouvecat (2026-07-31 23:44), Laurie Ward (2026-07-31 23:45), Portway Blues Band (2026-08-01 00:49).

**7 verified, 8 evidenced blank.** Artists worked this firing: **15 of 15 cap.** Venues worked this firing: **0 of 30 cap** (backlog fully saturated; budget was not the limiting factor). Tier 5 (missingGenres) not reached.

### Verified — artists (7)

| Artist | Fields written | Signal |
|---|---|---|
| Harmonic Fall (`e83ad207…`) | `facebookUrl`, `bio`, `genres` | Tier A — own FB page `facebook.com/HarmonicFall/` (378 followers, Band), "Stoke-on-Trent, United Kingdom" in Details matches the stored Staffordshire UK location, recent posts tagged #staffordshire #stoke. Bio ("Country, rock, pop and everything in-between.\n\nAvailable as a duo, trio or band.") quoted verbatim with line break preserved; genres Country/Rock/Pop taken from that same page text. |
| Horizonz (`28f2f47a…`) | `facebookUrl`, `bio`, `genres`, `actType` | Tier A — own FB page `facebook.com/Horizonzband/` (2.6K followers, Musician/band), bio states "from Devon, UK" matching stored Exeter location. Bio quoted verbatim in full. `actType:["originals"]` set — page explicitly says "an original five-piece band", outranking the covers default per §0.18. Genres merged: pre-existing `["Rock"]` + `"Indie"` (page: "blending indie and rock") = `["Rock","Indie"]`, not overwritten. |
| Portway Blues Band (`d5a014e8…`) | `facebookUrl`, `bio` | Tier A — own FB page `facebook.com/PortwayBluesBand/` (124 followers, Musician/band), bio states "based near Glastonbury" matching stored location exactly. Bio quoted verbatim including hashtags and emoji. |
| Laurie Ward (`18fa1f3d…`) | `facebookUrl`, `bio` | Tier A — own FB page `facebook.com/lauriemusic/` (292 followers, Musician/band), bio names "Exmouth Acoustic Gallery" matching stored Exmouth location exactly. Bio quoted verbatim in full. |
| Off The Wall (`401fcdbf…`) | `facebookUrl`, `bio` | Tier A — own FB page `facebook.com/OffTheWallCornwall/` (597 followers, Musician/band); the page's own bio text links `www.lemonrock.com/offthewall`, directly matching the record's pre-existing lemonrock externalId (`offthewall`) — source-declared corroboration. Bio quoted verbatim (page-authored navigation text, not editorialised). |
| Dom Martin (`9c84b9ac…`) | `facebookUrl`, `bio`, `genres`, `location`, `locationType` | Tier B — sole candidate under a distinctive name, `facebook.com/MusicDomMartin/` (75K followers, Musician, 100% recommend/50 reviews), "Lives in Belfast" in Personal details. Independently confirmed via web search as a real, prominent UK (Northern Ireland) touring blues musician (European Blues Award 2019, UK Blues Award 2020/21/23/25, UK Blues Hall of Fame 2022). No direct post corroborating the stored Derby gig was found, so this is flagged in CTO-INBOX for a human check. Location corrected from the gig-town-donated "Derby" to the page-stated "Belfast" per §2A.3/§7 (page-stated location beats gig-town inference). `genres:["Blues"]` inferred from strong independent evidence. Bio quoted verbatim. |
| F.A.B. 60's Tribute (`5f195978…`) | `facebookUrl` only | Tier B — own FB page `facebook.com/FAB60s/` (768 followers, Musician/band, 60s tribute), page states "F.A.B band is in Lanchester, Durham, United Kingdom" matching the stored North East region, plus a recent post (499 Festival) confirming current activity. Pre-existing bio ("North East 1960s tribute act.", from an earlier onthecasemusic harvest) and pre-existing genres left untouched this firing — not part of this firing's evidence, excluded from the validator gate pass on that basis (see Defects). |

### Evidenced blank — artists (8)

Both surfaces (Google + Facebook page search) tried for every one unless noted; variants recorded in the evidence file:

- **Ben Nilsson** (Leek) — Google returns only an unrelated trance DJ/producer of the same name (Beatport/SoundCloud); Facebook page search on "Ben Nilsson Leek" and "Ben Nilsson music" returned no matching page. Left blank.
- **Virgin Mary's** (Staffordshire UK) — completing the prior firing's single-variant search. Google returns only The Virginmarys (Macclesfield rock duo, different spelling, Cheshire not Staffordshire); Facebook page search for "Virgin Mary's band" returned no matching UK act. Left blank.
- **The Power 3** (Staffordshire UK) — one close-name candidate found, `facebook.com/powerclassicrocklancashire/` (626 followers, "Rock blues, classic rock, funk rock"), but its own vanity URL and a corroborating BandMix listing place it in Leigh, Lancashire/Cheshire East — not Staffordshire, with no page-stated evidence placing it in Stoke. Region mismatch; not attached. Flagged in CTO-INBOX.
- **Flutter** (UK wide) — re-verification of the standing ENRICHMENT-TASK-v3.md §11a GAP 1 worked example (Jason ruling 2026-07-31: leave blank, do not extend the ladder). Google and two Facebook-search variants (Shoegaze, band Stoke) surfaced no matching UK act page. Consistent with the standing ruling.
- **Pontneuf** (Exmouth) — Google (both a plain and a site:facebook.com query) returns only the unrelated Exmouth Shanty Men. The record's lemonrock externalId (`exmouthshantypontneuf`) matches the RUNBOOK-documented "Exmouth Shanty - Pontneuf" contaminated-billing example, but no live page under either name was found. Left blank.
- **Casting Pearls** (Okehampton) — Google (plain and site:facebook.com) returns only lemonrock's own listing (confirming the band's real lineup/details) and an unrelated US band of the same former name; Facebook page search for "Casting Pearls Okehampton" (0 results) and "Casting Pearls band" (no UK match among returned pages) both miss. Left blank.
- **Liv and Bob** (Exmouth, Devon) — Google surfaces a press mention of "Just Liv 'n' Bob" / "Bob 'n' Liv", a jazz/blues duo (Bob King) playing the Bicton Inn, Exmouth, but no dedicated Facebook page URL was returned and the billing order doesn't confidently match. Left blank.
- **Grouvecat** (Taunton) — the only candidate, `facebook.com/grouvecat/`, resolves to a PERSONAL PROFILE ("Mark Buster Mcadam", category Digital creator, Friends tab present), not a delegate act page — its intro line confirms he performs as "Grouvecat" but per RUNBOOK §2A.1 item 4 a personal profile is never attached as the act page. Flagged for the upload-image path.

## Validator summary line (verbatim)

First pass on all 15 records produced 2 FAIL: `BIO_VERBATIM` on F.A.B. 60's Tribute (untouched pre-existing bio vs unrelated evidence — standing precedent) and on Portway Blues Band (the bash-heredoc emoji-mangling defect found and fixed this firing, see above). After excluding F.A.B. 60's Tribute per standing precedent and fixing the Portway evidence line:

```
14 records · 13 clean · 0 FAIL · 1 WARN   [mode=gate]
```

The 1 WARN is `NAME_BILLING` on Portway Blues Band ("format tail on the name") — reviewed and judged a false positive: "Blues Band" is genuinely part of the act's own name, confirmed by both their own Facebook page name and the lemonrock listing, not a stripped promo tail (same class as the standing "Ant Clowes Duo" precedent in RUNBOOK §2A.1 item 7).

0 FAIL. Batch ships.

The 0 venue writes this firing are excluded from the gate pass per the standing `bv2a-firing1419z-validator-cannot-check-venues` defect — moot here since no venue fields were written.

## Defects and open items (logged to CTO-INBOX)

- `bv2a-firing0618z-bash-heredoc-mangles-emoji-in-evidence` — new defect, found and fixed this firing.
- `bv2a-firing1419z-bio-verbatim-fires-on-untouched-preexisting-bio` — 6th same-day recurrence (F.A.B. 60's Tribute).
- `bv2a-firing0618z-dom-martin-derby-national-touring-act` — needs a human check that the touring act is genuinely the same as the stored Derby gig.
- `bv2a-firing0618z-grouvecat-personal-profile-only` — real human/act identified but not attachable per §2A.1 item 4.
- `bv2a-firing0618z-power3-region-mismatch` — needs a human check of the Lancashire vs Staffordshire discrepancy.
- `bv2a-venue-backlog-saturated-reconfirmed-firing0618z` — 7th consecutive firing today.

## Ledger / summary / dashboards

- `data/state/enrichment-evidence-2026-08-28-enrichment.jsonl` — 15 lines appended this firing (7 artist verified, 8 artist blanks), plus 1 line corrected in place (Portway Blues Band emoji fix).
- `data/state/enrichment-ledger.jsonl` — 15 `enrich` lines + 1 `snapshot` line appended (snapshot: artistsTotal 3294, artistsMissingSocials 1383, artistsMissingGenres 945, venuesTotal 3206, venuesMissingSocials 34).
- `data/state/run-summary.jsonl` — 1 line appended, outcome `completed`, recordsEnriched 7, skipped 8.
- `20-Daily/2026-08-28.md` — link to this report appended.
- `CTO-INBOX.md` — 6 new entries (1 DEFECT new, 1 RULE recurrence, 3 DATA, 1 RULE saturation reconfirm).
- Both dashboards rebuilt (`data/normalized/enrichment/DASHBOARD.html` — 3144 records/114 snapshots; `data/normalized/DASHBOARD.html`) — both exit 0.

## Summary

**0 venues verified, 0 evidenced blank this firing** (backlog fully saturated for a 7th consecutive firing — all 34 already flagged or already evidenced blank by prior firings today; budget spent entirely on the artist axis instead). **7 artists verified** (5 facebookUrl+bio, 1 facebookUrl+bio+genres, 1 facebookUrl+bio+genres+actType, 1 facebookUrl+bio+genres+location-correction) **+ 8 evidenced blank** (one rejected on region-mismatch grounds, one on personal-profile grounds, six on no-confident-candidate grounds, both surfaces tried throughout). One new evidence-authoring defect found and fixed live (bash heredoc emoji mangling). Validator: `14 records · 13 clean · 0 FAIL · 1 WARN` (one untouched-pre-existing-bio record excluded from the gate pass per standing precedent). Elapsed approximately 14 minutes (heartbeat 06:18:43Z → 06:32:36Z). Circuit breaker did not fire; no hard stop encountered; Chrome was available and logged in throughout.
