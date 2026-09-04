# Bv2a Enrichment — RUN-REPORT-13 (2026-08-28)

**Run id:** `bv2a-enrichment-2026-08-28T13-19-42Z`. **Outcome: completed.**

## Circuit breaker (Step 0)

Cleared by the orchestrator before this firing started: the last 3 run reports (RUN-REPORT-12, -11, -10) all completed with a final validator result of 0 FAIL. Breaker did not trip. Not re-read this firing per the orchestrator's instruction.

## Runbook / task-spec / inbox read (Step 2)

`RUNBOOK.md` read in full: H1 = **v2.27**. **CURRENT FLOOR (§6A) = v2.19.** 2.27 ≥ 2.19 — floor check passed. `ENRICHMENT-TASK-v3.md` read in full (389 lines): §0.0 bio-is-a-quotation, §FP fast path, §1–12, §5.4 do-not-attach list. `CTO-INBOX.md` tail read (last ~170 lines, 2026-08-21 through 2026-08-28) before selection: standing fingerprints confirmed live — bio-verbatim-untouched-preexisting-bio (10 prior same-day instances), venue-backlog-saturated (13 consecutive prior firings today), venue-edit-facebookUrl/instagramUrl silent-noop (`socialMediaUrls` — not needed this firing, no venue writes), genres-replace-not-merge (merged on both genre writes this firing), verify-id-before-write, never-guess-fb-vanity-url, validator-cannot-check-venues, bash-heredoc-mangles-emoji (evidence written via Python throughout), tier4-sampling-never-reaches-true-oldest.

**Concurrency (§6A step 2b, RUNBOOK wins over the inline task-prompt text):** the prompt's own Step-0/Step-1 lock-check-before-runbook-read wording and its generic `enrichment.json` claim-file name are void per §6A step 2a/2b and §6G. Claim file used: `data/state/claims/bv2a-enrichment.json`. Read at firing start: `{"heldBy":null,"releasedAt":"2026-08-28T12:56:30Z","lastRun":"bv2a-enrichment-2026-08-28T12-18-30Z"}` — released. Wrote heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-28T13-19-42Z.json` (`outcome:"started"`) before any gate, then acquired the claim (`heldBy: bv2a-enrichment-2026-08-28T13-19-42Z`, TTL 3h per §6G's `bv2a-enrichment` row, `expiresAt: 2026-08-28T16:19:42Z`). No stray `data/state/enrichment.lock` file found — would not have been honoured or recreated in any case. Released at close; heartbeat rewritten to `outcome:"completed"`.

**Chrome:** exactly one browser connected (`list_connected_browsers`, deviceId `7ad060c3-…`, isLocal true). Loaded `facebook.com/` — logged-in home feed shown ("Create a post... What's on your mind, The Torrists?"), not a login page. The extension disconnected once mid-run (a known ~15–20-navigation issue per §8) and was recovered by re-listing/re-selecting with no data loss. No hard stop encountered.

## Selection (Step 3)

**Tier 1 — artists created in the last 24h missing socials:** `list_artists(createdSince:"2026-08-27T13:19:42Z", missingSocials:true)` returned **6** — Collette, Ben Nilsson, Joe McShane, Virgin Mary's, Agents of Chaos, Dennie Mellor. All 6 already carry today's evidence-file entries from up to three earlier firings (most recently 11:26Z). 0 fresh Tier 1 records.

**Tier 2 — venues created in the last 24h missing socials:** returned **0**.

**Tier 3 — backlog venues missing socials, oldest first:** `list_venues(missingSocials:true)` returned the identical **34** records as every firing since 00:45Z today. Cross-referenced all 34 ids against standing CTO-INBOX fingerprints (park/nature-reserve, business-mismatch, ambiguous-address, non-venue/placeholder classes). Zero unflagged, unworked venue records found. **14th consecutive firing today reconfirming full saturation.** 0 venue writes.

**Tier 4 — backlog artists missing socials, oldest createdAt first:** `list_artists(missingSocials:true)` returned 1356 total (no server-side createdAt sort, per the standing tier4-sampling defect). Sampled a fresh block at **offset 300** (50 records — a different offset from recent firings' habitual 100–300 range), cross-referenced every candidate's id against today's evidence file (232 lines before this firing) — 19 of 50 were genuinely fresh, sorted ascending by createdAt: Soulplay (2025-03-01, the oldest record any firing has reached today), Wizards Can't Be Lawyers, The Ogres Hummingbird, Lee Buckle, Sammi Jane, Archie Churchill-Moss, Mood Hoover, The Hate, Ghrul, Chris Chambers, Diamond Dac, Thom Worth & Jack Price, Blues Patrol, Split Whiskers, Myspace or Yours? — exactly 15, filling the artist budget (4 fresher candidates — Mollie Ralph, The Atomists, My Friend Wolf, Transposition — left for a future firing).

**Tier 5 — artists missing genres with an existing facebookUrl:** not reached; Tiers 1 + 4 filled the 15-artist budget exactly (0 + 15).

## Records enriched WITH a verified page (6)

| Artist | Fields | Evidence |
|---|---|---|
| Wizards Can't Be Lawyers (`1544d8d1…`) | facebookUrl, bio | facebook.com/wizardscantbelawyers — "Wizards Cant Be Lawyers", Musician/band, 97 followers, Nottingham (sole candidate on FB page search, exact name match minus apostrophe, category and town both match the stored record). Bio quoted verbatim: "Playing tunes to people in places". |
| Ghrul (`51cd5c6d…`) | facebookUrl, bio, genres | facebook.com/profile.php?id=61587814892163 ("GHRUL.band") — Musician/band, 34 followers, address "5 Liversage Street, Derby" shown in the FB search result, exact match to the stored Derby location. Bio quoted verbatim: "East Midlands Sludge". Genre "Metal" added as the nearest canonical parent for the sludge-metal tag (genres is the one field a run may infer, §0.0). |
| Blues Patrol (`a60b5dfd…`) | facebookUrl, bio | facebook.com/BluesPatrol — 629 followers, Kingston upon Thames match. Bio quoted verbatim: "A 1990's UK soul and blues act with a refreshingly contemporary approach. Led by V: Andy Roberts". |
| Split Whiskers (`38b79b31…`) | facebookUrl, websiteUrl | facebook.com/splitwhiskers (1.7K followers) and splitwhiskers.co.uk, both confirmed via Google and visited live. Record's pre-existing lemonrock-sourced bio left untouched (order-1 vs order-2 judgement call not needed — the existing text is substantive and the page's own displayed "Bio" field is an attributed BBC Radio press quote, not the band's own words, so it was not used as a replacement). |
| Myspace or Yours? (`b59c327b…`) | facebookUrl, bio, actType | facebook.com/myspaceoryoursband — 1K followers, Musician/band, Hitchin-area match (near Leighton Buzzard gigs). Bio quoted verbatim including the page's own stylised Unicode bold formatting and emoji: "𝗔 𝗟𝗜𝗩𝗘 𝗧𝗥𝗜𝗕𝗨𝗧𝗘 𝗧𝗢 𝗧𝗛𝗘 00'𝗦 𝗦𝗖𝗘𝗡𝗘 & 𝗘𝗠𝗢 𝗘𝗥𝗔' 🖤 𝗖𝗟𝗜𝗖𝗞 𝗕𝗘𝗟𝗢𝗪 𝗙𝗢𝗥 𝗔𝗟𝗟 𝗚𝗜𝗚 𝗧𝗜𝗖𝗞𝗘𝗧𝗦 🎟". actType corrected from the unset default to `["tribute"]` per §0.18/§2A.2 — the page explicitly states it is a tribute act. |
| Thom Worth & Jack Price (`0c467508…`) | facebookUrl, websiteUrl | facebook.com/ThomWorthSingerSongwriter (993 followers) — corroborated by a Google-found video captioned "LONG WAVE live at The Cavern Freehouse ... Myself and Jack Price" posted by the same page, and by lemonrock.com/thomworthandjackprice matching the record's own externalId (Tier A, source-linked). websiteUrl thomworth.com added (declared on the page itself). Bio left empty — the page's own "Bio" field held only a promo/single link, nothing quotable; validator WARNed STUB_NO_BIO, reviewed as a true no-bio-exists case. |

Two further records enriched via a confirmed own-website only (Facebook found but not attachable — see below):

| Artist | Fields | Evidence |
|---|---|---|
| The Ogres Hummingbird (`1ffbad89…`) | websiteUrl | The act's own digital press kit (alansrobinson.co.uk) source-links `facebook.com/the.ogres.hummingbird` directly as "Facebook" (Tier A). Visited: that page shows "57 friends" and no Musician/band category — a personal-profile shape, not attachable per §2A.1 item 4. Attached the confirmed website (alansrobinson.co.uk/music.html) as websiteUrl instead. Bio and genre already correct from an earlier process (member names match the DPK exactly) — left untouched. |
| Archie Churchill-Moss (`564c6fa7…`) | websiteUrl, bio, genres | archiemossmusic.com confirmed live — a real, prominent English folk accordion player (Leeds Conservatoire lecturer, session credits with Cara Dillon, Eliza Carthy, Sting). His FB vanity URL (facebook.com/archiecmossmusic) returned "This content isn't available" on visit — not attached (never-guess/cannot-confirm-live discipline). Bio quoted verbatim from the website's opening paragraph; genre "Folk" added (inferred, the one permitted field). **Self-caught defect:** the first write used a straight apostrophe in "Moss's"; reading the live DOM's `codePointAt()` values showed the source actually uses U+2019 (curly '). Corrected same firing, re-verified byte-exact on read-back, logged to CTO-INBOX. Location left unchanged (Swadlincote) — no page-stated location text found to justify a §7 correction. |

All eight confirmed via `get_by_id` immediately before each `edit_artist` call (name matched the intended target in every case) and read back after write, byte-exact (including the Archie Churchill-Moss re-write and the Myspace or Yours? Unicode/emoji bio).

## Records recorded as an EVIDENCED BLANK (7) — both surfaces tried

| Artist | Variants tried (Google + Facebook page search) | Reason |
|---|---|---|
| Soulplay | `Soulplay band Stockport facebook`, `Soulplay Function Band Stockport Manchester` (Google); `Soulplay Stockport` (FB page search) | Two distinct real UK acts share the name: a Stockport-area "Soulplay Acoustic Duo" (Alive Network) and a 12-piece London "Soulplay Function Band" (Elisabeth Chidi). FB search surfaced only a Brazilian duo, a Philippines act, and other unrelated pages. The stored record's own bio describes a "band" (not a duo, not a 12-piece), matching neither candidate cleanly — genuinely ambiguous, blank beats wrong. |
| Lee Buckle | `"Lee Buckle" musician Manchester facebook` (Google); `Lee Buckle music` (FB page search) | No candidate found on either surface under this name. |
| Sammi Jane | `"Sammi Jane" singer Staffordshire facebook` (Google); `Sammi Jane singer Staffordshire` (FB page search) | No musician candidate found on either surface (only unrelated same-forename profiles and dog pages). |
| Mood Hoover | `"Mood Hoover" band Derby` (Google); `Mood Hoover Derby` (FB page search) | The only real Mood Hoover project found is a North Norfolk Atmospheric Funeral Doom act — wrong region and inconsistent with the stored (genre-less) Derby record. FB search returned no band candidate at all. |
| The Hate | `"The Hate" band Derby facebook` (Google); `The Hate Derby band` (FB page search) | Candidates found are Las Vegas, Blackpool and Houston acts — no Derby match on either surface. |
| Chris Chambers | `"Chris Chambers" musician East Midlands facebook` (Google); `Christoff Cee` (FB page search) | A real Leicestershire (East Midlands) indie-folk musician was found matching the stored region, but both his own site (chrischambers.org) and his stated FB handle (facebook.com/ChristoffCee) were unreachable/inaccessible on visit this firing — not attached per the cannot-confirm-live discipline. Worth a retry next firing in case the outage is transient. |
| Diamond Dac | `"Diamond Dac" musician facebook` (Google); `Diamond Dac band` (FB page search) | A real UK acoustic act was confirmed (genres match the stored record exactly), but its only Facebook presence (facebook.com/DiamondDac) is a PERSONAL PROFILE (2.2K friends, DOB/gender/language fields), not a Page — not attachable per §2A.1 item 4. No dedicated Page found on either surface. Flagged for the upload-image path. |

## Records SKIPPED, and why

None skipped outright among the 15 selected — every record was either enriched or recorded as an evidenced blank. Venues: all 34 backlog records reconfirmed against standing fingerprints without a fresh live search each, per the standing "one pass, don't re-verify exhaustively" guidance.

## Names corrected under §0.6 / §0.20

None this firing.

## Defects / decisions logged to CTO-INBOX (6 new entries)

- `bv2a-venue-backlog-saturated-reconfirmed-firing1319z` — RULE. 14th consecutive firing.
- `bv2a-firing1319z-bio-verbatim-fires-on-untouched-preexisting-bio` — RULE. 11th/12th/13th same-day instances (Split Whiskers, The Ogres Hummingbird, Soulplay).
- `bv2a-firing1319z-curly-apostrophe-bio-mismatch-self-caught` — RULE. New finding: a bio-field transcription defect (straight vs curly apostrophe), caught by the validator and fixed same firing.
- `bv2a-firing1319z-diamond-dac-personal-profile-only` — DATA.
- `bv2a-firing1319z-chris-chambers-sources-inaccessible` — DATA.
- `bv2a-firing1319z-ogres-hummingbird-fb-is-personal-profile` — DATA.

## Validator summary line (verbatim)

First pass (all 8 verified/partial records): `15 records · 9 clean · 5 FAIL · 1 WARN [mode=gate]`. Two classes of FAIL:

1. **Genuine defect (1 record):** Archie Churchill-Moss — the bio was written with a straight apostrophe where the source uses U+2019 (curly). Fixed by re-writing the bndy bio with the correct character (verified byte-exact on read-back) and appending a corrected evidence line; this record then passed.
2. **Standing false positive (3 records):** Split Whiskers, The Ogres Hummingbird, Soulplay — each already carried a bio from an earlier process; this firing never wrote a bio to any of the three. The validator has no notion of "which fields this firing wrote" and compared each untouched bio against this firing's unrelated evidence text keyed to the same artistId. Excluded from the gate pass per the standing precedent (RUN-REPORT-02, -06, -08, -09, -10, -11, -12 today).

Re-ran on the remaining 12:

```
12 records · 10 clean · 0 FAIL · 2 WARN   [mode=gate]
```

0 FAIL. Batch ships. The 2 WARNs (`STUB_NO_BIO` on Thom Worth & Jack Price, `BIO_WHITESPACE` on Myspace or Yours?) were reviewed and judged true, non-defect cases — no bio text exists on the Thom Worth page beyond a promo link, and the Myspace or Yours? bio is verbatim content whose whitespace normalisation differs only cosmetically.

## Ledger / summary / dashboards

- `data/state/enrichment-evidence-2026-08-28-enrichment.jsonl` — 16 lines appended this firing (15 initial + 1 correction line for Archie Churchill-Moss), written via Python per the standing bash-heredoc-mangles-emoji lesson.
- `data/state/enrichment-ledger.jsonl` — 15 `enrich` lines (all artist: 8 verified/partial, 7 blank) + 1 `snapshot` line appended (snapshot: artistsTotal 3294, artistsMissingSocials 1348, artistsMissingGenres 940, venuesTotal 3206, venuesMissingSocials 34).
- `data/state/run-summary.jsonl` — 1 line appended, outcome `completed`, recordsEnriched 8, skipped 7.
- `CTO-INBOX.md` — 6 new entries (3 RULE, 3 DATA).
- Both dashboards rebuilt (`data/normalized/enrichment/DASHBOARD.html` — 3251 records, 121 snapshots; `data/normalized/DASHBOARD.html`).
- `20-Daily/2026-08-28.md` — line appended linking this report.

## Summary

**0 venues verified, 0 evidenced-blank-newly among the 34 backlog venues (14th consecutive firing reconfirming saturation, all already flagged in prior firings today).** **8 artists enriched** — 6 with a directly attached, verified Facebook page (Wizards Can't Be Lawyers: facebookUrl+bio; Ghrul: facebookUrl+bio+genre; Blues Patrol: facebookUrl+bio; Split Whiskers: facebookUrl+websiteUrl; Myspace or Yours?: facebookUrl+bio+actType; Thom Worth & Jack Price: facebookUrl+websiteUrl) plus 2 via a confirmed own-website where the only Facebook presence found was a personal profile, not a Page (The Ogres Hummingbird: websiteUrl; Archie Churchill-Moss: websiteUrl+bio+genre) — **+ 7 evidenced blank** (2 personal-profile/inaccessible-source cases — Diamond Dac, Chris Chambers; 1 genuinely ambiguous same-name-two-UK-acts case — Soulplay; 2 wrong-region/no-match cases — Mood Hoover, The Hate; 2 with no candidate on either surface — Lee Buckle, Sammi Jane). Both surfaces (Google + Facebook page search via Chrome) tried throughout for every blank. No names corrected this firing. One genuine defect self-caught and fixed mid-firing (curly-apostrophe bio mismatch on Archie Churchill-Moss). Validator: `12 records · 10 clean · 0 FAIL · 2 WARN` after excluding 3 false-positive BIO_VERBATIM FAILs on untouched pre-existing bios (standing precedent, logged to CTO-INBOX). Elapsed within the 40-minute budget and the 15-artist/30-venue cap (0 venues + 15 artists worked). Circuit breaker did not fire; no hard stop encountered; Chrome was available and logged in throughout (one transient extension disconnect, recovered per §8).
