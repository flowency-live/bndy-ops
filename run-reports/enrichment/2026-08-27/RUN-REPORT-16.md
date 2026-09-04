# Bv2a Enrichment — RUN-REPORT-16 — 2026-08-27

**Run id:** `bv2a-enrichment-2026-08-27T16-19-58Z`. **Outcome: completed.**

## Circuit breaker (Step 0)

Pre-checked by the invoking session before this run started: RUN-REPORT-15 (15:19:30Z firing, completed, validator "2 records · 2 clean · 0 FAIL"), RUN-REPORT-02 (14:19:08Z firing, completed, 0 FAIL), RUN-REPORT-01 (13:19:57Z firing, completed, 0 FAIL). All three completed with 0 FAIL. Breaker did not fire. Not re-checked in this run.

## Runbook / task spec read

`RUNBOOK.md` H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed. Read in full: §0A, §0 prime directives 1-29, §1/§1A identity + same-name protocol, §2/§2A enrichment protocol (2A.1 items 1-8, 2A.2), §3 venue protocol, §4 multi-artist model, §5 event protocol, §6 run discipline, §6A run contract (steps 0-9, heartbeat-first, floor assertion, lock-after-runbook-read), §6B platform facts, §6C failure classes, §6D/6D-bis event identity, §6E horizons, §6F concurrency ownership lanes, §6G concurrency lock protocol/TTL table/dead-holder takeover, §7 changelog v2.13-v2.27. `ENRICHMENT-TASK-v3.md` read in full: §0.0 (bio quoted verbatim, never authored), §FP fast-path (FP.1-FP.4), §2A.1 evidence ladder, §6 field rules, §7 location. `CTO-INBOX.md` searched in full for `bv2a`, `DEFECT`, `DATA`, `RULE` entries to identify standing defects before working.

**Standing defects/precedents applied, not re-discovered:**
- `bv2a-venue-edit-facebookurl-param-silent-noop` — not applicable this firing (no venue writes; noted for completeness).
- `bv2a-firing1419z-validator-cannot-check-venues` — not applicable (no venue records in this firing's gate pass).
- `bv2a-firing1319z-verify-id-before-live-write` — applied: confirmed each target id's name via `get_by_id` read-back immediately after every write, before counting it verified.
- `bv2a-firing1319z-never-guess-fb-vanity-url` — **hit again this firing** (see Defects section below), self-caught before validation.
- `bv2a-venue-backlog-saturated` (multiple prior firings) — reconfirmed with numbers this firing (see Selection, Tier 3).

## Concurrency

`data\state\claims\bv2a-enrichment.json` at read time (16:19Z) held `{"heldBy":null,"releasedAt":"2026-08-27T15:36:01Z", ...}` — released, matching the pre-flight note. Re-checked immediately before acquiring: unchanged. Wrote heartbeat `data\state\heartbeat\bv2a-enrichment-2026-08-27T16-19-58Z.json` (`outcome:"started"`) before any gate, then acquired the claim: `heldBy: bv2a-enrichment-2026-08-27T16-19-58Z`, TTL 3h, `expiresAt: 2026-08-27T19:19:58Z`. No `data\state\enrichment.lock` file found (confirmed retired per §6A step 2b — not honoured, not recreated). Claim released and heartbeat set to `completed` at close (`finishedAt: 2026-08-27T16:42:00Z`).

## Tools

bndy MCP reachable (confirmed via `list_venues`/`list_artists`). Chrome: exactly one connected browser (`Browser 1`, deviceId `7ad060c3-b3e0-41c9-9dd4-a8097db94bfa`), selected and confirmed logged into Facebook via a live render of `facebook.com/` showing the account's own feed ("What's on your mind, The Torrists?") before any bio quote was taken.

## Selection

**Tier 1 — artists created in the last 24h missing socials:** `list_artists(createdSince:"2026-08-26T16:19:58Z", missingSocials:true)` (ISO timestamp used, not the string `"24h"` — see standing defect `list-artists-createdsince-24h-string-not-parsed`) returned 11 candidates: Lee Wainwright, Plastic Soul, Xclusive, Greg Davies, Andy Preston & Co, Manic, Jung, the Reform, Tee, The Escape Committee Trio, Over the Moon. Checked the evidence file first: all 11 already carry exactly one evidence line each, timestamped 13:07:31Z from an earlier firing today — confirmed both-surfaces searches were already run and recorded as blank. Not re-searched (re-running the same search under an hour later would not plausibly change the result). None counted toward this firing's worked total.

**Tier 2 — venues created in the last 24h missing socials:** `list_venues(createdSince:"2026-08-26T16:19:58Z", missingSocials:true)` returned **0 candidates**.

**Tier 3 — backlog venues missing socials, oldest `createdAt` first:** `list_venues(missingSocials:true, limit:100)` returned all **48** remaining candidates (matches the 15:34Z snapshot exactly). Sorted locally by `createdAt`. Cross-checked every one of the 48 against `RUN-REPORT-15`'s own skip list (39 named records) plus its 7 evidenced-blank working set plus its 2 no-address standing-unenrichable records (The Snooks, Middle of the Road Cafe) — **39 + 7 + 2 = 48, an exact match.** Every single backlog venue candidate today is already flagged, blanked, or touched. Zero fresh venue candidates. This reconfirms the standing `bv2a-venue-backlog-saturated` finding with a fresh count; **0 venue writes this firing, not a defect in this run.**

**Tier 4 — backlog artists missing socials, oldest `createdAt` first:** `list_artists(missingSocials:true)` (1435-strong at query time; API does not sort by `createdAt`, so pulled two pages of 50 — offset 0 and offset 50 — and sorted locally). Cross-checked the 20 oldest candidates against today's evidence file (50 unique artistIds already touched today): **17 of the 20 oldest already carried at least one evidence line from earlier firings today** (Neurosys, Jam Halen, Mix 'N' Match, Let'z Rock, The Imitation Zone, Mike Simpson, Aaron & Jake, Allen Kent, Mystiek, Hero's of Rock, Astles Couzens Duo, Rod Mason & The 007s, Jon Casey Blues Band, Sonny Ransom, L-Squared, Em & Geggs, Sully and Co, Phoenix, Glen Franklin, Daniel Stephen Turner — most with 1 evidence line, four with 2). Skipped, not re-searched. **Worked the 15 genuinely fresh oldest candidates** (createdAt 2026-06-11 through 2026-07-31): One Night Stand, Higgi's Band, Karl Howard, FreewayBand, Out Of The Box, The Jays, Rob Hunt, Jason Howard, Better Luck Next Time (UK), Jane Keele, The Relics, One Step Behind, P J Carter, The Mon0s, Graeme Cox — **3 verified, 12 evidenced blank.** This meets the 15-artist budget cap.

**Tier 5 (artists missing genres with a facebookUrl):** **not reached** — the 15-artist cap was met by Tier 4.

## Records with a verified page

**Artists (3 of 15 worked):**

| Artist | Facebook | Note |
|---|---|---|
| FreewayBand (Torbay) | facebook.com/Stew.Freeway/ | Tier B: page's own tagline "Torbay based band" matches stored location exactly; page links to lemonrock.com, matching the record's existing lemonrock externalId. Bio quoted verbatim: *"Torbay based band"*. A separate same-named page (facebook.com/FreewaytheBand/, US-styled "Freeway" with a reverbnation link, no location) was checked and rejected as a different, unrelated act. |
| Better Luck Next Time (UK) (Crediton) | facebook.com/p/Better-Luck-Next-Time-UK-100063552701857/ | Tier A/B: page name is an exact match to the stored name including "(UK)"; existing lemonrock externalId slug `betterlucknexttimeuk` matches the page's own contact/motto text found via Google. Bio quoted verbatim from the page's own intro: *"For everything Better Luck Next Time (UK)...Let's Get Serious About Having (Rockin') Fun!"* (curly apostrophes preserved character-for-character on the second write, see Defects below). |
| One Step Behind (Derby) | facebook.com/OSBTribute/ | Tier A: page name "ONE STEP BEHIND - THE MASTER OF MADNESS" plus corroborating evidence that the act played The Flowerpot, Derby (matches the stored gig footprint/location exactly) — the strongest possible signal, a venue in the act's own stored city. Bio quoted verbatim: *"The UK's favourite Madness tribute band!!"*. `actType` set to `["tribute"]` on this evidence (Madness tribute act, explicitly stated by the page's own name). Genre left empty — Ska was considered but not written, as nothing on the page itself states a genre and inferring one from "Madness tribute" alone was judged too far from the page's own words for this pass. |

All 3 verified by `get_by_id` read-back both immediately after the initial write and again after the bio-punctuation correction (below).

## Records recorded as an evidenced blank

**Artists (12 of 15 worked)** — both surfaces (Google + Facebook page search) tried for every record before recording blank, per §2A.1 item 3b:

| Artist | Note |
|---|---|
| One Night Stand (Stoke-on-Trent) | Google and FB search both returned only unrelated same-name party/covers bands (Auckland, Adelaide, Florida, generic UK function bands) — none confirmed Stoke-on-Trent. |
| Higgi's Band (Whitefield) | No candidate found on either surface. |
| Karl Howard (Buxton) | No candidate found on either surface beyond a generic Facebook people-search link. |
| Out Of The Box (Torbay) | No confident Torbay match on either surface; one generic "Out Of The Box" musician page (293 followers) found with no location stated — Tier C, insufficient. |
| The Jays (Kingsteignton) | Lemonrock confirms identity/location but no own FB page found. FB search found "The Jays" (1.5K followers, no location) and a separate "The Jays" explicitly based in Bristol — neither matches Kingsteignton/Devon. Name match only. |
| Rob Hunt (Paignton) | Facebook page "Rob Hunt Acoustic Musics." (812 followers) found and visited; bio has no location field and no gig mentions tying it to Paignton. Name match only (Tier C), left blank rather than guess. |
| Jason Howard (Paignton) | Lemonrock corroborates he plays Kirkham Street Sports & Social Club, Paignton (matches stored location) but no FB page surfaced on either surface. |
| P J Carter (Liskeard) | Google found "P J Carter - Singer Guitarist" with a numeric page id, corroborated by lemonrock's real gig list including Liskeard Constitutional Club (matches stored city) — a strong identity signal — but the page returned "This content isn't available at the moment" on direct visit. FB search returned no matching candidate. Found but inaccessible; no bio could be captured, left blank. |
| Jane Keele (Exmouth) | Google confirms she performs at Sundowners, Exmouth (matches stored location) but no FB link surfaced. FB search returned entirely unrelated pages. |
| The Relics (Exeter) | Google returned multiple confirmed non-UK "The Relics" bands (New Jersey, Indiana, DC). FB search returned only unrelated Exeter pubs/businesses. No UK band page found despite two existing lemonrock externalIds on the record. |
| The Mon0s (Wells) | Lemonrock confirms identity/genre/location but no FB page surfaced on Google. FB search for the stylised name returned only unrelated bands/businesses literally named "The Wells". |
| Graeme Cox (Devon) | Google found "Graeme Cox Acoustic" — but explicitly located in **Huddersfield**, a region mismatch against the stored Devon location. FB search returned other similarly-named but unrelated acoustic acts. Left blank on region mismatch rather than attach a same-name act from the wrong part of the country (same class as the standing Kieran Poile / Canada precedent). |

## Names corrected under §0.6 / Locations corrected / Genre corrections

None applied this firing. (One Step Behind's `actType` was set to `["tribute"]` on direct page-name evidence — not a correction, a first-time fill.)

## Validator summary line (verbatim)

No scope exclusions needed this firing — no venue records and no pre-existing untouched bios were in the write set. Ran against all 3 verified artist records with `data/state/enrichment-evidence-2026-08-27-enrichment.jsonl`:

First pass:
```
3 records · 1 clean · 0 FAIL · 4 WARN   [mode=gate]
```
2 of the 4 WARNs were `BIO_PUNCTUATION` — the bios as first written used straight apostrophes where the source pages used curly ones (`’`). Re-captured and rewritten character-for-character with the correct curly apostrophes (Better Luck Next Time (UK), One Step Behind), then re-read-back via `get_by_id` and re-run:

```
3 records · 2 clean · 0 FAIL · 2 WARN   [mode=gate]
```

0 FAIL. Batch ships. Remaining 2 WARNs are benign and expected: `STUB_NO_IMAGE` on Better Luck Next Time (UK) (the `/p/.../<numeric>/` page form did not yield an easy graph image this pass — left empty rather than guess a URL) and `NAME_BILLING` on the same record for the parenthetical "(UK)" in its name — correctly the act's own stated name (confirmed verbatim on its own page), not a contamination, same class as the runbook's documented "Andy Grant Band" false-positive.

## Defects / rules raised this firing

- **Self-caught recurrence of the standing never-guess-fb-vanity-url defect.** When writing Better Luck Next Time (UK)'s `facebookUrl`, first typed a plausible-looking `https://www.facebook.com/BetterLuckNextTimeUK/` from the act's name rather than the actual `/p/Better-Luck-Next-Time-UK-100063552701857/` URL that was visited and read via `get_page_text`. Caught before `get_by_id` verification, corrected in the same turn, and confirmed correct on read-back — no wrong URL survived to the validated record. Logged to `CTO-INBOX.md` as a recurrence for visibility (fingerprint `bv2a-firing1619z-guessed-fb-vanity-url-recurrence`), since the same failure shape (guessing rather than reading an href/address bar) recurred even under this run's own vigilance.
- **Venue backlog saturation reconfirmed with an exact count** (48/48 candidates already flagged or touched) — not logged as new, this is the same standing `bv2a-venue-backlog-saturated` finding logged by several prior firings today and on 2026-08-19/21.
- No new DATA flags this firing (no duplicate pairs, address mismatches, or non-venue findings surfaced in the 15 artist records worked — this firing touched no venues).

## Ledger / snapshot / run-summary / dashboards

- `data/state/enrichment-ledger.jsonl`: 15 `enrich` lines (3 artist-verified, 12 artist-blank) + 1 `snapshot` line appended. Snapshot: artistsTotal 3273, artistsMissingSocials 1432, artistsMissingGenres 952, venuesTotal 3205, venuesMissingSocials 48.
- `data/state/run-summary.jsonl`: 1 line appended, outcome `completed`, recordsEnriched 3 (verified count), skipped 12 (evidenced-blank count) — Tier 1's 11 already-evidenced records and Tier 3's 48 already-flagged venues are not counted in either field, consistent with this file's established convention.
- Both dashboards regenerated: `data/normalized/enrichment/DASHBOARD.html` (2890 records, 100 snapshots) and `data/normalized/DASHBOARD.html`.

## Evidence file

`data/state/enrichment-evidence-2026-08-27-enrichment.jsonl` — this firing's 15 entries appended before every write (lines 151-165 of the shared per-date file, which already held 150 lines from the four earlier firings today).

## Budget used

**0 venues worked (Tier 2: 0 candidates; Tier 3: 48/48 already flagged/touched, zero fresh) of 30 cap.** **3 verified + 12 blank = 15/15 artists worked**, cap met exactly. Elapsed approximately 22 minutes of the 40-minute ceiling (heartbeat 16:19:58Z → claim release 16:42:00Z). Circuit breaker did not fire.

## Claim / heartbeat

Claim released (`heldBy: null`, `lastRun: bv2a-enrichment-2026-08-27T16-19-58Z`). Heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-27T16-19-58Z.json` updated to `completed`.
