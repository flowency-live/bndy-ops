# Bv2a Enrichment — RUN-REPORT-17 (2026-08-28)

**Run id:** `bv2a-enrichment-2026-08-28T17-18-49Z`. **Outcome: completed.**

## Circuit breaker (Step 0)

Read RUN-REPORT-16, -15, -14 directly from disk (newest first), not from any embedded summary claim.
- RUN-REPORT-16: outcome completed, first-pass validator `15 records · 11 clean · 0 FAIL · 5 WARN` — clean, no exclusions used.
- RUN-REPORT-15: circuit breaker tripped at its own Step 0, outcome Failed. No validator run (stopped before Step 3/4) — does not itself count as a recorded validator FAIL under the literal Step 0 wording ("2 or more recorded a validator FAIL, or ran and wrote no report" — it wrote a report).
- RUN-REPORT-14: outcome completed, first-pass validator `6 records · 2 clean · 0 FAIL · 4 WARN` — clean, no exclusions used.

0 of the last 3 reports recorded an actual validator FAIL. The literal Step 0 condition is not met — **the breaker did not trip.** RUN-REPORT-15's underlying finding (an undocumented "standing precedent" exclusion used by earlier same-day firings, e.g. RUN-REPORT-12/-13) remains an open, unresolved item for Jason/CTO per the DECISION entries already logged (`bv2a-circuit-breaker-tripped-firing1519z`, `bv2a-circuit-breaker-reassessed-firing1623z`) — not re-litigated again this firing since it falls outside the 3-report window and nothing new bears on it.

## Runbook / task-spec / inbox read (Step 2)

`RUNBOOK.md` read in full: H1 = **v2.27**. **CURRENT FLOOR (§6A) = v2.19.** 2.27 ≥ 2.19 — floor check passed. `ENRICHMENT-TASK-v3.md` read in full (§0.0, §FP, §5.4 do-not-attach list — none of this firing's 5 candidates appear on it). `CTO-INBOX.md` tail read before selection: standing fingerprints for the venue backlog confirmed live (park/nature-reserve, business-mismatch, ambiguous-address, non-venue/placeholder classes, plus Darcy's/Tannery/Madeley Carnival etc).

**Concurrency (§6A step 2b / §6F / §6G):** did NOT check for/create/delete any `.lock` file. Read `data/state/claims/bv2a-enrichment.json`: `heldBy: null`, released at 16:41:00Z by the prior run — available. Wrote heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-28T17-18-49Z.json` (`outcome:"started"`), then acquired the claim (`heldBy: bv2a-enrichment-2026-08-28T17-18-49Z`, TTL 3h per §6G, `expiresAt: 2026-08-28T20:18:49Z`). No stray `enrichment.lock` file found (other sources' own `.lock` files exist in `data/state/` — not this task's, not touched). Released at close; heartbeat rewritten to `outcome:"completed"`.

**Chrome:** exactly one browser connected (`list_connected_browsers`, deviceId `7ad060c3-…`, isLocal true). Selected and navigated to facebook.com — logged-in home feed shown (notification badge, feed content), not a login page. No hard stop encountered.

## Selection (Step 3)

**Tier 1 — artists created in last 24h, missing socials:** `list_artists(createdSince:"2026-08-27T17:18:49Z", missingSocials:true)` returned the identical 6 records worked repeatedly today (Collette, Ben Nilsson, Joe McShane, Virgin Mary's, Agents of Chaos, Dennie Mellor) — all already evidenced blank (or DECISION-flagged, Virgin Mary's) at firing1119z with both surfaces tried. Not re-worked this firing to avoid duplicating same-day effort with nothing new to find.

**Tier 2 — venues created in last 24h, missing socials:** 0 returned.

**Tier 3 — backlog venues missing socials:** `list_venues(missingSocials:true)` returned the identical 34 records reconfirmed by every firing since 00:45Z today. Full id-level cross-reference against CTO-INBOX confirmed every one of the 34 already carries a documented reason it cannot be enriched (non-fixed-place / council green space, wrong-business address match, personal-profile-only, non-UK-only candidate, closed venue, placeholder name, garbled capture, etc). **17th consecutive firing today reconfirming full saturation.** 0 venue writes.

**Tier 4 — backlog artists missing socials, oldest createdAt first:** `list_artists(missingSocials:true)` returned 1334 total at firing start. Today's prior firings had used offsets 0, 100, 150, 200, 250, 300, 600, 750 — sampled a fresh block at **offset 900** (50 records). Sorted ascending by createdAt and selected the 5 oldest candidates with an EMPTY pre-existing bio (continuing RUN-REPORT-16's discipline of avoiding the BIO_VERBATIM/evidence-keying defect class by construction): **Aron Fender** (`FImlSx37ojOP3BGTpmI1`, createdAt 2025-03-18 — the oldest record any firing has reached this month by a wide margin), **Rhythm House** (`be94106d…`, createdAt 2025-11-18), **Cat and Dog Duo** (`f99a419c…`, createdAt 2026-04-29), **THE FLANEURS** (`debcb34c…`, createdAt 2026-05-22), **Eleventh Hour** (`5945e5ef…`, createdAt 2026-06-05).

**Tier 5 — artists missing genres with an existing facebookUrl:** not reached; Tier 4 filled the batch.

## Records enriched WITH a verified page (0)

None this firing — the offset-900 block happened to contain five generic/collision-prone names, all of which failed the Sec 2A.1 identification bar or the UK-only rule on investigation. Blank beats wrong: no attachment was forced.

## Phase A source-side harvest (1 genres-only write)

| Artist | Fields | Evidence |
|---|---|---|
| Cat and Dog Duo (`f99a419c-7353-4fa0-b76e-942c6db23a69`) | genres | `onthecasemusic.co.uk/bands/31087/cat-and-dog-duo` declares genre "Pop / Alternative" — mapped cleanly to canonical `Pop`, `Alternative` (§0.18/§6). No bio block on the source page. Written per the structured-source exception (§2A.5(b)); no identity/bio field touched. |

## Records recorded as an EVIDENCED BLANK (5) — both surfaces tried

| Artist | Variants tried (Google + Facebook page search) | Reason |
|---|---|---|
| Aron Fender | `Aron Fender band facebook` (Google); `Aron Fender` (FB page search) | Google: no candidate, only unrelated Fender guitar pages and a different person "Aaron Fender". FB: one exact-name hit, "ARON Fender BAND", 13 followers, category Artist — About tab carries no bio/location/posts beyond the name itself. Name match alone is Tier C, never sufficient (§5.2). Not attached. |
| Rhythm House | `Rhythm House band facebook North West` (Google); `Rhythm House band` (FB page search) | Google: only a non-UK Vancouver WA music facility and a PR firm "Rhythm Media House". FB: no exact-name result at all — only unrelated same-genre bands ranked by follower count (Storm Kings, The Zimmermen, Better Luck Next Time, Double Cross, Charlinched, Flatworld, Monopole, Rhythm Revival). No candidate found on either surface. |
| Cat and Dog Duo | `Cat and Dog Duo band facebook` (Google); `Cat and Dog Duo` (FB page search); Phase A onthecasemusic detail page | Google: only unrelated same-word bands (Cat Man Dog, Catdog Rock Band, Unofficial Cats And Dogs). FB: one exact-name hit, category "Digital creator", 0 followers, no bio, no location — not a Musician/band page and no evidence it is even a music act. facebookUrl left blank; genres written from source instead (see above). |
| THE FLANEURS | `The Flaneurs band Derbyshire facebook` (Google); `Flaneurs` (FB page search) | Google and FB both surfaced the same page, `facebook.com/flaneurs.band/` — but its own About/Details state location **Sydney, NSW, Australia**. Per §2A.1.1 (UK-only), a non-UK act's page is never attached regardless of name match. A different band; name collision only. |
| Eleventh Hour | `Eleventh Hour band Ashton-under-Lyne facebook` (Google); implicit in the same result on FB page search | Google/FB found `facebook.com/theeleventhhourmusic/`, "World class backing band", 505 followers, Musician/band — but no location stated anywhere in About/Details, and its posts (a Gary Barlow/Robbie Williams tribute show, "Tribute Acts Management") read as a professional touring tribute/session outfit, not evidently the same grassroots gigs-news-uk act. Insufficient evidence under §2A.1; not attached. |

## Records SKIPPED, and why

None skipped outright among the 5 selected — every record was either enriched (genres) or recorded as an evidenced blank. Venues: all 34 backlog records reconfirmed against standing CTO-INBOX fingerprints; 0 venue writes, 17th consecutive saturation reconfirmation.

## Names corrected under §0.6 / §0.20

None.

## Defects / decisions logged to CTO-INBOX (4 new entries)

- `bv2a-venue-backlog-saturated-reconfirmed-firing1718z` — RULE.
- `bv2a-firing1718z-flaneurs-non-uk-name-collision` — DATA.
- `bv2a-firing1718z-eleventh-hour-professional-tribute-no-location` — DATA.
- `bv2a-firing1718z-cat-and-dog-duo-phase-a-genre-only` — DATA.

## Validator summary line (verbatim)

```
5 records · 4 clean · 0 FAIL · 1 WARN   [mode=gate]
```

1 WARN: `NAME_BILLING` "format tail on the name" on "Cat and Dog Duo" — the trailing "Duo" is part of the act's own name per the standing ruling (RUNBOOK §2A.1 item 7, "a trailing Duo/Trio/Acoustic/Solo is part of the name, do not strip it"); reviewed and judged a non-defect, not renamed.

## Ledger / summary / dashboards

- `data/state/enrichment-evidence-2026-08-28-enrichment.jsonl` — 5 lines appended this firing (via a run-id-qualified `/tmp/bv2a_1718_*` script per the standing `/tmp` collision defect from firing1623z, avoided this time).
- `data/state/enrichment-ledger.jsonl` — 5 `enrich` lines (1 verified/genres-only, 4 blank, all artist) + 1 `snapshot` line appended (artistsTotal 3294, artistsMissingSocials 1334 — unchanged, correctly reflecting 0 facebookUrl writes — artistsMissingGenres 938, down from 939, confirming the 1 genre write — venuesTotal 3206, venuesMissingSocials 34 — unchanged, confirming 0 venue writes).
- `data/state/run-summary.jsonl` — 1 line appended, outcome `completed`, recordsEnriched 1, skipped 4.
- `CTO-INBOX.md` — 4 new entries (1 RULE, 3 DATA).
- Both dashboards rebuilt (`data/normalized/enrichment/DASHBOARD.html` — 3286 records, 124 snapshots; `data/normalized/DASHBOARD.html`).

## Budget and circuit breaker

**Budget used:** 0 venues + 5 artists, well within the 40-minute ceiling and the 30/15 cap. **Circuit breaker: did not fire** (0 of the last 3 reports carried a recorded validator FAIL — see Step 0 above). Chrome was available and logged in throughout, no disconnects. No hard stop encountered.

## Summary

**0 venues verified, 0 evidenced-blank-newly among the 34 backlog venues** (17th consecutive firing reconfirming saturation, full id-level cross-reference against CTO-INBOX fingerprints). **1 artist enriched** (Cat and Dog Duo, genres only, from the onthecasemusic Phase A source harvest — no Facebook match met the identification bar) **+ 4 evidenced blank**: Aron Fender and Rhythm House (no candidate on either surface), THE FLANEURS (non-UK name-collision, Sydney NSW), Eleventh Hour (professional touring tribute act, no location signal tying it to the stored grassroots act). Both surfaces (Google + Facebook page search via Chrome) tried throughout for every blank. No names corrected. Selection reached a new oldest-touched record this month (Aron Fender, created 2025-03-18) via a fresh offset-900 Tier 4 sample. Validator: `5 records · 4 clean · 0 FAIL · 1 WARN` — 0 FAIL, zero exclusions needed. Circuit breaker did not fire; RUN-REPORT-15's open ruling request (undocumented BIO_VERBATIM exclusion precedent used by RUN-REPORT-12/-13) remains outstanding for Jason/CTO and was not re-litigated this firing as it falls outside the 3-report window.
