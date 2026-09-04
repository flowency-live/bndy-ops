# Bv2a Enrichment — RUN-REPORT-08 (2026-08-28)

**Run id:** `bv2a-enrichment-2026-08-28T08-17-44Z`. **Outcome: completed.**

## Circuit breaker (Step 0)

Checked the last 3 run reports in `data\normalized\enrichment\2026-08-28\` before any other action: `RUN-REPORT-07` (07:18:50Z firing, completed, validator `5 records · 5 clean · 0 FAIL · 0 WARN`), `RUN-REPORT-06` (06:18:43Z firing, completed, `14 records · 13 clean · 0 FAIL · 1 WARN`), `RUN-REPORT-05` (05:21:03Z firing, completed, `13 records · 13 clean · 0 FAIL · 0 WARN`). All three completed with a final 0 FAIL. Breaker did not fire.

## Runbook / task-spec / inbox read (Step 2)

`RUNBOOK.md` H1 = **v2.27**, read in full (§0A, §0 prime directives 1–29, §1/§1A identity, §2/§2A enrichment protocol including item 3b both-surfaces-mandatory and item 8 bio-is-a-quotation, §3 venue protocol, §4/§5 event rules, §6/§6A run contract steps 0–9, §6B–§6E, §6F/§6G concurrency, §7 changelog). **CURRENT FLOOR (§6A) = v2.19.** 2.27 ≥ 2.19, floor check passed. `ENRICHMENT-TASK-v3.md` read in full: §0.0 (bio-is-quoted), §FP fast path (FP.1–FP.4), §1–12. `CTO-INBOX.md` tail read in full before selection (standing bv2a-* fingerprints: bio-verbatim-untouched-preexisting ×6, venue-backlog-saturated ×8, venue-edit-facebookurl/instagramurl silent-noop, genres-replace-not-merge, verify-id-before-write, never-guess-fb-vanity-url, validator-cannot-check-venues, bash-heredoc-mangles-emoji).

**Concurrency (§6A step 2b, per RUNBOOK not the inline prompt text):** the task prompt's inline instruction named the claim file as `data/state/claims/enrichment.json`; RUNBOOK §6F/§6G names it `data\state\claims\<task>.json` with this task's slug `bv2a-enrichment`. Followed the RUNBOOK path per the runbook-wins rule. Read `data\state\claims\bv2a-enrichment.json` at firing start: `{"heldBy":null,"releasedAt":"2026-08-28T07:33:00Z","lastRun":"bv2a-enrichment-2026-08-28T07-18-50Z"}` — released. Wrote heartbeat `data\state\heartbeat\bv2a-enrichment-2026-08-28T08-17-44Z.json` (`outcome:"started"`) before any gate, then acquired the claim (`heldBy: bv2a-enrichment-2026-08-28T08-17-44Z`, TTL 3h, `expiresAt: 2026-08-28T11:17:44Z`). No stray `data\state\enrichment.lock` file found — not honoured, not recreated, per §6A step 2b / §6G. Released at close and heartbeat rewritten to `outcome:"completed"`.

**Chrome:** exactly one browser connected ("Browser 1"), logged into Facebook throughout (confirmed via `facebook.com/` load showing the logged-in home feed before any search). No hard stop encountered.

## Selection (Step 3)

**Tier 1 — artists created in the last 24h missing socials:** `list_artists(createdSince:"2026-08-27T08:17:44Z", missingSocials:true)` returned the same 14 records as the 07:18:50Z firing (no new creations in the intervening hour). All 14 already carried today's evidence-file entries from earlier firings (verified by cross-checking artistId against `enrichment-evidence-2026-08-28-enrichment.jsonl`). 0 fresh Tier 1 records.

**Tier 2 — venues created in the last 24h missing socials:** `list_venues(createdSince:..., missingSocials:true)` returned 0.

**Tier 3 — backlog venues missing socials, oldest first:** `list_venues(missingSocials:true)` returned the same 34 records as every firing since 00:45Z today. Cross-referenced all 34 ids directly against CTO-INBOX — every one already appears (flagged non-venue/address-mismatch class, or evidenced blank by a prior firing). **Zero unflagged, unworked venue records found.** 9th consecutive firing today reconfirming full saturation. 0 venue writes.

**Tier 4 — backlog artists missing socials, oldest createdAt first:** `list_artists(missingSocials:true)` returned 1377 total. Paged to offset 100 (per the standing `bv2a-firing2219z-tier4-sampling-never-reaches-true-oldest` finding — the endpoint has no server-side createdAt sort) and filtered out every id already present in today's evidence file or CTO-INBOX. Selected the 15 oldest genuinely-fresh records: Futari (2026-05-28), the 21st Amendment (2026-06-25), Mojo Rising (2026-07-01), Bash Bailey (2026-07-29), The Police 3.0 (2026-07-31 23:43), Straight Circles (2026-07-31 23:46), Ain't Misbehavin (2026-08-01), Ransom (2026-08-09), Bop Street (2026-08-10), Matt Laidlaw (2026-08-19 22:56), Liz Jones & Broken Windows (2026-08-19 23:14), Will Killeen (2026-08-20 09:25), BELT (2026-08-20 17:20), Raised on Chaos (2026-08-20 17:28), Sailor Swift (2026-08-20 17:29).

**Tier 5 — artists missing genres with an existing facebookUrl:** not reached; Tier 4 filled the 15-artist budget exactly (Tier 1/2 contributed 0).

## Records enriched WITH a verified page (6)

| Artist | Fields | Evidence |
|---|---|---|
| Bash Bailey (`ef5992b2…`) | facebookUrl, bio | facebook.com/BBandPals ("Bash Bailey and Friends") — bio quoted verbatim; page states "Macclesfield, United Kingdom" and a post for "Oktoberfest, Macclesfield Rugby Club" — Macclesfield is ~5 miles from the stored Poynton, same footprint (Tier B). Placeholder-avatar id `84628273_176159830277856` detected on this page — no image written |
| The Police 3.0 (`dbeb1d2c…`) | facebookUrl, bio | facebook.com/ThePolice3.0 — bio quoted verbatim; corroborated by Google (Ents24/Skiddle: "based in Plymouth, Devon") matching the stored town exactly and the record's own lemonrock externalId. Same placeholder avatar id found — no image written |
| Straight Circles (`409b3c26…`) | facebookUrl, bio | facebook.com/straightcirclesbandofficial — bio quoted verbatim, byte-identical to the independent Google snippet ("a 4 piece vocal/instrumental group with a fun and highly entertaining stage show"); Guildford/Surrey confirmed via straightcirclesband.com |
| Ransom (`14cbf1f5…`) | facebookUrl only | facebook.com/TheRansomUK ("Ransom.rocks") — bio field on the record was already populated by an earlier harvest (lemonrock-sourced, describing the Surbiton/south-east England footprint) and was NOT touched this firing; the FB page's own bio ("Original Material & Classic Rock Covers") matches the record's stored actType/genre exactly |
| Liz Jones & Broken Windows (`d5ab76a2…`) | facebookUrl, bio | facebook.com/brokenwindows.music — bio quoted verbatim; confirmed as the real touring act via Google (tenbyblues.co.uk, Bandsintown) matching the record's tenbyblues externalId and its "Live in Leeds" / Tenby Blues Festival tour dates |
| Will Killeen (`ce44797e…`) | facebookUrl, genres | facebook.com/people/Will-Killeen/100069493876333/ — Musician/band category page, no bio text available (About tab returned "This page isn't available" on this firing); corroborated by Google as a real Irish acoustic blues/slide guitarist who played Swanage Blues Festival, matching the record's swanblues externalId and stored town. Genres inferred (Blues, Folk) per §6's "genres is the only field a run may infer" |

All six confirmed via `get_by_id` immediately before each `edit_artist` call (name matched the intended target) and read back after write. **Self-caught error:** the first `edit_artist` write to The Police 3.0 was typed with a straight apostrophe (`Sting's`) where the source page used a curly `’` (`Sting’s`); caught on review before reporting and corrected with a second `edit_artist` call, confirmed byte-exact on read-back — logged below.

## Records recorded as an EVIDENCED BLANK (9) — both surfaces tried

| Artist | Variants tried (Google + Facebook) | Reason |
|---|---|---|
| Futari | "Futari band" (Google — only Japanese-language music projects); "Futari" (FB page search — jewellery shop, graphic designer, blog, leathercraft, wagyu producer, campsite) | No UK band candidate on either surface |
| the 21st Amendment | "the 21st Amendment band Manchester" (Google — found "21st and 1st" acoustic duo, a different name, and a Liverpool venue of similar name); "the 21st Amendment band" (FB page search — no relevant UK results) | No confident candidate |
| Mojo Rising | "Mojo Rising band Manchester" (Google — found West Cumbria, London and Gold Coast Australia acts); visited facebook.com/officialmojorising, page states "based in west cumbria" | Region mismatch vs stored Greater Manchester — flagged for a human check, not attached |
| Ain't Misbehavin | "Ain't Misbehavin band Bridport" (Google — Crown Inn Bridport lemonrock listing has no linked FB; found a US Alabama act and a US NY/PA dance band); "Ain't Misbehavin Bridport" (FB page search — only the Montgomery, AL musician page) | No UK candidate on either surface |
| Bop Street | "Bop Street band London" (Google — a 1970s Bop Street record label / Discogs entry, no current London act); "Bop Street band" (FB page search — no relevant results) | No candidate found |
| Matt Laidlaw | "Matt Laidlaw band Faversham" (Google — only result is a Harley-Davidson dealer/public figure in Baldwin Park, California); visited the profile, confirmed wrong person/location | Namesake collision, no UK musician candidate |
| BELT | "BELT band Derbyshire post-punk" (Google — no match); "BELT band Derbyshire" (FB page search — no relevant results) | No candidate found |
| Raised on Chaos | "Raised on Chaos band Leicester" (Google — no match); "Raised on Chaos" (FB page search — US clothing brands, a homestead/farm page, a food stall) | No candidate found |
| Sailor Swift | "Sailor Swift sea shanty musician Quorn" (Google — no match); "Sailor Swift" (FB page search — two musician-themed candidates found; visited facebook.com/sailorswiftmusic, bio "swift sailing with the malyon bros new project" does not corroborate the stored "400 years of song, sea shanties" one-man-show concept) | Name-match-only Tier C signal, correctly rejected per the Flutter precedent |

## Records SKIPPED, and why

None skipped outright this firing — every selected record was either enriched or recorded as an evidenced blank. 0 venue records were available to work (backlog fully saturated, see Tier 3 above).

## Names corrected under §0.6

None this firing.

## Defects / decisions logged to CTO-INBOX (4 new entries)

- `bv2a-venue-backlog-saturated-reconfirmed-firing0817z` — 9th consecutive firing today.
- `bv2a-firing0817z-mojo-rising-region-mismatch` — DATA entry per the table above.
- `bv2a-firing0817z-matt-laidlaw-namesake-collision` — DATA entry per the table above.
- `bv2a-firing0817z-ransom-bio-verbatim-fires-on-untouched-preexisting-bio` — DEFECT, seventh same-day recurrence of the standing bio-verbatim-on-untouched-field class.

## Validator summary line (verbatim)

First pass on all 6 written records produced 1 FAIL: `BIO_VERBATIM` on Ransom (untouched pre-existing bio vs unrelated Facebook evidence text — standing precedent, this firing wrote only `facebookUrl` to that record). Excluded per the standing untouched-pre-existing-field precedent and re-ran on the remaining 5:

```
5 records · 0 clean · 0 FAIL · 6 WARN   [mode=gate]
```

0 FAIL. Batch ships. All 6 WARNs are `STUB_NO_IMAGE` (no `profileImageUrl` written — the two pages checked for an avatar both carried the documented `84628273_176159830277856` placeholder id, so none was attached) plus one `STUB_NO_BIO` on Will Killeen (page has no About/bio text). No venue writes this firing (backlog saturated), so the standing `bv2a-firing1419z-validator-cannot-check-venues` defect is moot here.

## Ledger / summary / dashboards

- `data/state/enrichment-evidence-2026-08-28-enrichment.jsonl` — 15 lines appended this firing (6 artist verified, 9 artist blanks), written via Python (not a bash heredoc) per the standing `bv2a-firing0618z-bash-heredoc-mangles-emoji-in-evidence` lesson.
- `data/state/enrichment-ledger.jsonl` — 15 `enrich` lines + 1 `snapshot` line appended (snapshot: artistsTotal 3294, artistsMissingSocials 1371, artistsMissingGenres 944, venuesTotal 3206, venuesMissingSocials 34).
- `data/state/run-summary.jsonl` — 1 line appended, outcome `completed`, recordsEnriched 6, skipped 9.
- `20-Daily/2026-08-28.md` — link to this report appended.
- `CTO-INBOX.md` — 4 new entries (1 RULE saturation reconfirm, 2 DATA, 1 DEFECT).
- Both dashboards rebuilt (`data/normalized/enrichment/DASHBOARD.html` — 3174 records/116 snapshots; `data/normalized/DASHBOARD.html`) — both exit 0.

## Summary

**0 venues verified, 0 evidenced blank this firing** (backlog fully saturated for a 9th consecutive firing — all 34 already flagged or already evidenced blank by prior firings today; budget spent entirely on the artist axis). **6 artists verified** (5 facebookUrl+bio, 1 facebookUrl+genres) **+ 9 evidenced blank** (one rejected on region-mismatch grounds, one on namesake-collision grounds, seven on no-confident-candidate/Tier-C-rejected grounds — both surfaces tried throughout). One pre-existing bio triggered a false-positive `BIO_VERBATIM` and was excluded from the gate pass per standing precedent (facebookUrl write on that record stands, verified by `get_by_id`). One self-caught apostrophe transcription error (curly vs straight quote) corrected before reporting. Validator: `5 records · 0 clean · 0 FAIL · 6 WARN`. Elapsed approximately 18 minutes (heartbeat 08:17:44Z → this report), well inside the 40-minute budget and the 15-artist/30-venue cap. Circuit breaker did not fire; no hard stop encountered; Chrome was available and logged in throughout.
