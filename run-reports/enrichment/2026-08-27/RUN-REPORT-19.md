# Bv2a Enrichment — RUN-REPORT-19 — 2026-08-27

**Run id:** `bv2a-enrichment-2026-08-27T19-19-03Z`. **Outcome: completed.**

## Circuit breaker (Step 0)

Checked the last 3 run reports by mtime before any other action: RUN-REPORT-18 (18:18:06Z firing, completed, validator "13 records · 10 clean · 0 FAIL · 3 WARN" after excluding 2 pre-existing-bio false positives), RUN-REPORT-17 (17:17:56Z firing, completed, 0 FAIL), RUN-REPORT-16 (16:19:58Z firing, completed, 0 FAIL). All three completed with 0 FAIL. Breaker did not fire.

## Runbook / task spec read

`RUNBOOK.md` H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed. Read in full: §0A, §0 prime directives 1–29, §1/§1A identity + same-name protocol, §2/§2A enrichment protocol (2A.1 items 1–8 including 3b both-surfaces-mandatory and item 8 bio-is-a-quotation, 2A.2 mechanics), §3 venue protocol, §4 multi-artist model, §5 event protocol, §6 run discipline, §6A run contract (steps 0–9), §6B platform facts, §6C failure classes, §6D/6D-bis event identity, §6E horizons, §6F concurrency ownership lanes, §6G concurrency lock protocol/TTL table (`bv2a-enrichment` = 3h)/dead-holder takeover, §7 changelog. `ENRICHMENT-TASK-v3.md` read in full: §0.0, §FP fast path, §1–§11a. `CTO-INBOX.md` read (recent pages, back through 2026-08-19) for standing `bv2a`/`DEFECT`/`DATA`/`RULE` entries; cross-checked against RUN-REPORT-18's own summary of the same for anything logged between 18:18Z and this firing's start — nothing new.

**Standing defects/precedents applied, not re-discovered:**
- `bv2a-venue-edit-facebookurl-param-silent-noop` — not applicable this firing (no venue writes).
- `bv2a-firing1319z-verify-id-before-live-write` — applied: both writes' target id/name confirmed via `get_by_id` read-back immediately after writing.
- `bv2a-firing1319z-never-guess-fb-vanity-url` / `bv2a-firing1717z-guessed-fb-vanity-url-recurrence` — applied: both facebookUrls written were copied from a search result or a DOM-read href, never inferred from a name. One candidate (Static flight → facebook.com/staticflight) was visited and correctly rejected on sight as a different entity (an entertainment management firm, not the band) rather than attached on name match alone.
- `bv2a-firing1419z-bio-verbatim-fires-on-untouched-preexisting-bio` — **hit once this firing** (IRIS) — carried a pre-existing bio from an earlier process that this firing never touched; excluded from the gate pass with the standing rationale (see Validator section).
- `bv2a-venue-backlog-saturated` (multiple prior firings) — reconfirmed: all 47 backlog venue candidates already flagged non-venue/address-mismatch or touched by an earlier firing today. Zero fresh.

## Concurrency

`data\state\claims\bv2a-enrichment.json` at read time (19:19:03Z) held `{"heldBy":null,"releasedAt":"2026-08-27T18:53:00Z", ...}` — released, matching RUN-REPORT-18's close. Wrote heartbeat `data\state\heartbeat\bv2a-enrichment-2026-08-27T19-19-03Z.json` (`outcome:"started"`) before any gate, then acquired the claim: `heldBy: bv2a-enrichment-2026-08-27T19-19-03Z`, TTL 3h, `expiresAt: 2026-08-27T22:19:03Z`. No `data\state\enrichment.lock` file found (confirmed retired per §6A step 2b — not honoured, not recreated). Claim released and heartbeat set to `completed` at close.

## Tools

bndy MCP reachable (confirmed via `list_artists`). Chrome: exactly one connected browser (`Browser 1`, deviceId `7ad060c3-b3e0-41c9-9dd4-a8097db94bfa`), selected by device, confirmed logged into Facebook via a live render of `facebook.com/` showing the account's own feed ("What's on your mind, The Torrists?") before any bio quote was taken.

## Selection

**Tier 1 — artists created in the last 24h missing socials:** `list_artists(createdSince:"2026-08-26T19:19:03Z", missingSocials:true)` returned the same 11 candidates as firings 16/17/18. All 11 already carried an evidence line from earlier today (confirmed by grep of today's evidence file). Not re-searched. None counted toward this firing's worked total.

**Tier 2 — venues created in the last 24h missing socials:** `list_venues(createdSince:"2026-08-26T19:19:03Z", missingSocials:true)` returned **0 candidates**.

**Tier 3 — backlog venues missing socials, oldest `createdAt` first:** `list_venues(missingSocials:true, limit:100)` returned **47** candidates (unchanged from firing 18's close). Cross-checked every one against today's evidence file (venueId-keyed): **all 47 already carry at least one evidence line from an earlier firing today.** Zero fresh candidates — full backlog saturation, reconfirmed at 47/47. 0 venue writes this firing, not a stopping decision.

**Tier 4 — backlog artists missing socials, oldest `createdAt` first:** `list_artists(missingSocials:true)` (1422-strong at query time; pulled two pages of 50, offset 0 and 50, sorted locally by `createdAt`). Checked all 100 sampled against today's evidence file: the great majority already carried a line from earlier firings today (this is firing 19 of the day); **15 genuinely fresh candidates** identified, `createdAt` 2026-07-31T20:33Z through 2026-08-21T17:10Z: Daisy Mae, Static flight, IRIS, Blue Moon Band, Terry Nutskin, Thombres, Zak James, Molly Duffy, Danielle Lincoln, Kangaru, Michael Vickers and The Bad Thing, Claire Zamore, Indie Division, Paul Andrew, The Bottles. **Worked all 15 — 2 verified, 13 evidenced blank.** Meets the 15-artist budget cap exactly.

**Tier 5 (artists missing genres with a facebookUrl):** not reached — the 15-artist cap was met by Tier 4.

## Records with a verified page

| Artist | Facebook | Note |
|---|---|---|
| Daisy Mae (Plymouth) | facebook.com/people/Daisy-Mae-Music/100092600427741/ | Tier B: sole candidate, name-exact, Musician category, page-stated "Plymouth, United Kingdom" matches the stored location exactly, own site daisymaemusic.com also confirmed and written. No classic About/Bio field text was present on this profile-style page (only a pinned status line, "Sunshine EP - Out Now! 🌞") — left bio empty rather than quote a post caption as if it were the act's bio statement; flagged `STUB_NO_BIO`/`STUB_NO_IMAGE` in the validator (benign, blank-beats-wrong). |
| Michael Vickers and The Bad Thing (Leicester / East Midlands) | facebook.com/MVandTheBadThing/ | Tier A: identity confirmed independently of the name match — the page's linked Linktree resolves to the same Spotify artist (`open.spotify.com/artist/4GcYF9fXSZQzFzcjZ9KI5y`) already stored on this bndy record from an earlier enrichment pass. Bio quoted verbatim: *"We are Michael Vickers & The Bad Thing!"* (the review-link and Linktree lines that followed it on the page were part of the same Bio field but omitted from the stored value at the first sentence/line boundary, per §0.0 permitted transformation 1). Avatar auto-populated by the write path to the canonical `graph.facebook.com/MVandTheBadThing/picture?type=large` form. |

Both writes verified by `get_by_id` read-back immediately after writing, before counting as verified.

## Records recorded as an evidenced blank

**Artists (13 of 15 worked)** — both surfaces (Google + Facebook page search) tried for every record before recording blank, per §2A.1 item 3b:

| Artist | Note |
|---|---|
| Static flight (Bridport) | Google surfaced `facebook.com/staticflight` as a plausible hit plus a YouTube video of the band playing the Crown Inn, Bridport. Visited the FB page directly: it is "Static Flight Music Group", an *Entertainment Industry Management and Development Firm* — a different entity, not the band. Rejected on sight. FB page search returned no better candidate. |
| IRIS (Wirksworth) | Google surfaced only unrelated same-name acts (Nottingham function band, Melbourne indie band, others), none mentioning Wirksworth. FB page search for "IRIS Wirksworth" returned zero results. |
| Blue Moon Band (North East UK) | Google and FB page search both returned several same-name acts (Slovak, Greek, Vietnamese-American, German, Italian, Wiltshire/Trowbridge) — none NE UK. |
| Terry Nutskin (Hampshire UK) | Google surfaced `facebook.com/terry.nutskin`; visited directly — the profile belongs to "Alex Nutskin", London, an unrelated person, not a band page and not the right region. |
| Thombres (Greater Manchester UK) | Google surfaced only "Thomb" (different name). FB page search for "Thombres" returned zero results. |
| Zak James (Greater Manchester UK) | Google found `facebook.com/zakjamesacoustic` (vocalist/guitarist/tribute artist for weddings) — no location stated on the page, no lineup/footprint signal, name alone is Tier C. Not attached. |
| Molly Duffy (Greater Manchester UK) | Google and FB page search returned only unrelated personal profiles and a name-mismatched "Molly Andrew Music" (Manchester singer-songwriter, different surname). No confident match. |
| Danielle Lincoln (North East England) | Google and FB page search returned no musician/band page under this name. |
| Kangaru (UK wide) | Google and FB page search returned only unrelated entities (a Kenyan church page, a Sri Lankan cab company, a Chicago rock band called "Kangaroo"). |
| Claire Zamore (Swadlincote) | Google and FB page search returned no matching name; closest FB result was an unrelated international artist named "Claire" (30K followers). |
| Indie Division (Castle Donington) | Google found nothing. FB page search found "The Indie Division", a UK-wide touring Britpop/indie tribute act (2K followers) — no location evidence ties it to Castle Donington specifically; Tier C insufficient, not attached. |
| Paul Andrew (Derby) | Google found `facebook.com/paulandrewmusic`; visited — 50 followers, no location stated, extremely common name. Tier C insufficient, not attached. |
| The Bottles (Derby) | Google found only a Kent-based act. FB page search returned two other "The Bottles Band" pages (one Spanish-language, one a 1-follower stub) — neither evidences Derby. |

## Names corrected under §0.6 / Locations corrected / Genre corrections

None this firing.

## Validator summary line (verbatim)

One scope exclusion applied before the gate run, consistent with the standing `bv2a-firing1419z-bio-verbatim-fires-on-untouched-preexisting-bio` defect:

1. **IRIS** — pre-existing bio (from an earlier process) untouched this firing; this firing's evidence line sourced the facebookUrl search (found nothing), not the bio.

First pass, all 15 artist records:
```
15 records · 12 clean · 1 FAIL · 3 WARN   [mode=gate]
```
The one FAIL was `BIO_SOURCE` on IRIS — confirmed via the record's own edit history that this firing wrote nothing to it. Excluded with this rationale and re-ran:

```
14 records · 12 clean · 0 FAIL · 3 WARN   [mode=gate]
```

0 FAIL. Batch ships. All 3 WARNs are benign and expected: `STUB_NO_BIO` + `STUB_NO_IMAGE` on Daisy Mae (the page had no classic About/Bio field text, only a pinned post caption — correctly left blank rather than misattributed as the bio, per §0.0); `NAME_BILLING` on Blue Moon Band (the validator's generic "format tail" pattern flagging the trailing word "Band" — the record's stored name predates this firing and was not touched).

## Defects / rules raised this firing

- No new defect classes found. `bv2a-firing1419z-bio-verbatim-fires-on-untouched-preexisting-bio` was hit a further time (sixth same-day instance) and handled the same way as its originating firing — not re-logged to `CTO-INBOX.md` as it is already a well-established standing defect with an open remediation ask (a records-written-fields concept in the validator).
- Venue backlog saturation reconfirmed (47/47, unchanged from firing 18) — not logged as new, same standing `bv2a-venue-backlog-saturated` finding.
- No guessed-vanity-URL incidents this firing — every facebookUrl written was copied from a search result or a visited page, never inferred from a name; one plausible-looking candidate (Static flight) was correctly rejected after visiting because it turned out to be a different type of entity entirely.

## Ledger / snapshot / run-summary / dashboards

- `data/state/enrichment-ledger.jsonl`: 15 `enrich` lines (2 artist-verified, 13 artist-blank) + 1 `snapshot` line appended. Snapshot: artistsTotal 3273, artistsMissingSocials 1420, artistsMissingGenres 948, venuesTotal 3205, venuesMissingSocials 47.
- `data/state/run-summary.jsonl`: 1 line appended, outcome `completed`, recordsEnriched 2 (verified count), skipped 13 (evidenced-blank count) — Tier 1's 11 already-evidenced artists and Tier 3's 47 already-flagged/touched venues are not counted in either field, consistent with this file's established convention.
- Both dashboards regenerated: `data/normalized/enrichment/DASHBOARD.html` (2941 records, 103 snapshots) and `data/normalized/DASHBOARD.html`.

## Evidence file

`data/state/enrichment-evidence-2026-08-27-enrichment.jsonl` — this firing's 15 entries appended before every write/search-conclusion (lines 202–216 of the shared per-date file, which already held 201 lines from seven earlier firings today).

## Budget used

**0 venues worked (Tier 2: 0 candidates; Tier 3: 47/47 already flagged/touched, zero fresh) of 30 cap.** **2 verified + 13 blank = 15/15 artists worked**, cap met exactly. Elapsed approximately 16 minutes of the 40-minute ceiling (heartbeat 19:19:03Z → claim release 19:35:00Z). Circuit breaker did not fire.

## Claim / heartbeat

Claim released (`heldBy: null`, `lastRun: bv2a-enrichment-2026-08-27T19-19-03Z`). Heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-27T19-19-03Z.json` updated to `completed`.
