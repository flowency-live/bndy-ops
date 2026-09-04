# Bv2a Enrichment — RUN REPORT — firing 18 (2026-08-18)

## Step 0 — Circuit breaker

Read the last 3 run reports (RUN-REPORT-17, 16, 15, all 2026-08-18). Each recorded 0
outstanding FAIL from the validator on its final run. 0 of 3 recorded a FAIL, none failed
to write a report. **Breaker NOT TRIPPED.**

## Step 1 — Concurrency

`data\state\claims\bv2a-enrichment.json` read: `heldBy: null`, released by firing 17 at
17:35:30Z. Acquired at 18:19:35Z as `bv2a-enrichment-2026-08-18T18-19-35Z`, TTL 3h
(expires 21:19:35Z). No stray `enrichment.lock` file found — the retired filename stays
retired.

## Step 2 — Runbook read

`RUNBOOK.md` H1 = v2.27, floor v2.19 — pass. Read in full. `§2A.1` item 3b (both search
surfaces before any blank) and item 8 (bio quoted, never written) confirmed as the two
governing rules. `ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full: §FP.2 confirms venues
need only `website`/`facebookUrl`, no bio, no Chrome. Read `CTO-INBOX.md` tail (~150
lines): confirmed standing, still-live fingerprints — `bv2a-claim-path-stale-in-prompt`,
`validator-venue-schema-mismatch`, `validator-venue-evidence-loader-artistid-only`,
`bv2a-edit-venue-facebookurl-param-does-not-exist`,
`bv2a-firing14-enrich-venue-batch-array-not-found` — all still current, none superseded.
Used `socialMediaUrls` (never the non-existent `facebookUrl` param) on every `edit_venue`
call.

**Chrome check.** `list_connected_browsers` returned `[]`; `tabs_context_mcp` returned
"not connected" on retry. Unreachable for a **21st consecutive firing** (22 on 2026-08-17
through this firing). Per the hard-stop table: venues may proceed (§FP.2, no Chrome
needed), artists may not.

## Step 3 — Work

Order per task §3: priority 1 (artists created <24h, missing socials) and priority 2
(venues created <24h, missing socials) checked first.

- **Priority 1 — artists <24h missing socials.** 6 candidates found, same six carried
  since firing 14: Camems, Whiskey Rebel, Guns for Girls, One Dimensional Creatures,
  Uncle Dad & The Day Drinkers, Devoted (all Staffordshire). **Skipped — Chrome
  unreachable, artist work is hard-stopped.**
- **Priority 2 — venues <24h missing socials.** 0 found.
- **Priority 3 — backlog venues missing socials, oldest `createdAt` first.** Full
  316-record backlog pulled and sorted client-side by `createdAt` (the tool does not sort).
  Worked the oldest 30.

### Records enriched WITH a verified page (8)

| Venue | id | Facebook |
|---|---|---|
| Hebburn Town Football Club | `a54acbfe-3985-437c-822b-6008a6aae8ec` | facebook.com/HebburnTownFC/ |
| South Shields National Unionist Workers Club Ltd | `9b9caf53-c62c-4fbb-8122-a904be7330b5` | facebook.com/TheUnionistSouthShields/ |
| The Foresters Arms (Swadlincote) | `7230f02c-4d84-4b11-a1f2-9cdf79dcc563` | facebook.com/swadlincotefa/ |
| The White Hart (Whaley Bridge) | `966d5192-a136-4e0a-a24c-cfdb870fc454` | facebook.com/p/WHITE-HART-Whaley-Bridge-100092437127315/ |
| Post Office, Burslem | `c8d63572-6f45-42de-8559-52d14a3289b0` | facebook.com/Oldpostofficeburslem/ |
| Kidsgrove Masonic Club | `9c3bf58f-96ee-42f0-b42c-cb2b709ed0eb` | facebook.com/groups/251476190360369/ (group — valid per §2A.1 item 4) |
| Black Horse Chester Le Street | `08d55643-2e59-46a2-844b-bf2a49343b46` | facebook.com/people/The-Black-Horse/61570638994581/ |
| W P M Sports & Social Club | `db9dd035-7cee-42a4-ad23-9976bad2a339` | facebook.com/groups/872098570133008/ (group) |

All 8 verified by `get_by_id` read-back after write; `updatedFields: ["socialMediaUrls"]`
confirmed on every `edit_venue` call.

**Two-candidate note:** Black Horse Chester Le Street has a second, differently-branded
candidate page (`Blackhorsechesterlestreetcocktailbar`) alongside the one attached. Same
low-risk class as firing 11's Black Horse (Consett) finding — both clearly the same pub.

**Disagreement resolved:** the 01:40Z firing left Hebburn Town Football Club blank on an
address ambiguity between "Hebburn Town FC (Trustmark Stadium)" and "Hebburn Sports Club
(16 South Drive)". This firing resolved it: the bndy record's own stored address field
already reads "Trustmark Group Stadium, Hebburn NE31 1UN" — an exact match to Hebburn
Town FC's home ground — which settles the ambiguity decisively rather than by fresh
guesswork.

### Records recorded as an EVIDENCED BLANK (9)

Both surfaces tried per §2A.1 item 3b (plain Google + `site:facebook.com`) before each
blank was recorded.

| Venue | id | Variants tried |
|---|---|---|
| Swan Inn (Stone) | `74BjwiHSxHDxdUghRVB9` | `"Swan Inn" Stone Staffordshire ST15 8QW facebook`; `site:facebook.com "Swan Inn" Stone Staffordshire` — only candidate found (`The-Swan-Inn-100083222414450`) carries no town confirmation, and Staffordshire has several same-named Swan Inns |
| HalfWay House | `mXLmYkL9qZU8ZvYNtmoO` | `"HalfWay House" Ashton-under-Lyne Whiteacre Road facebook`; `site:facebook.com Halfway House Ashton-under-Lyne OL6` — only same-name page found (`HalfwayHouseRoyton`) is a different pub, in Royton |
| Hartlepool United FC Supporters Association | `047b4775-182b-4028-8df2-fc871b42b24b` | `Hartlepool United FC Supporters Association Clarence Road facebook` — official club page and a distinct "Supporters Club functions" page found, neither confidently the named Supporters Association entity |
| West End Club (Stapleford) | `840be0d6-7049-4436-a5be-7e72030252b9` | `"West End Club" Stapleford Derby Road Nottingham facebook`; `"West End Club" Stapleford Nottingham facebook.com official page` — only event pages and third-party posts surfaced |
| Lamplight - Coffee House & Tap Room | `f40351b5-5e3b-49e7-81af-cb09949757bc` | `"Lamplight" coffee house tap room Coxhoe Durham facebook`; `site:facebook.com Lamplight Coxhoe` — only community-group event mentions |
| Annitsford Welfare Club | `4082b952-b9e3-4f81-acc0-2dd9f41fdcef` | `site:facebook.com "Annitsford Welfare Club" Cramlington` — only differently-named nearby clubs (Annitsford Irish Club, Annitsford Pioneer Club) surfaced |
| Hayfield Club | `cf792645-6f28-4430-ae44-f222a48e537c` | `site:facebook.com "Hayfield Club" Church Street High Peak` — no dedicated page found |
| The Diversion Bars ltd (Macclesfield) | `e49909e5-a84d-4b10-98a3-bcf29bc8c153` | `site:facebook.com "The Diversion" bar Macclesfield Church Street` — premises now trades as "Diversion Bar & Kitchen" per local press; no confirmed page under either name |
| The Tannery (Derby) | `d6572707-b153-40e4-ac09-fa15c19166a1` | `site:facebook.com "The Tannery" Sadler Gate Derby` — only same-named venues in other towns/countries surfaced |

## Records SKIPPED, and why (13)

**Re-confirmed from earlier firings' standing flags (11) — not re-searched, prior finding
still applies:**

| Venue | id | Reason (fingerprint) |
|---|---|---|
| The Railway (Stockport) | `WVSAbjPEiVfP6zCIV69Q` | possible closure — `bv2a-firing17-railway-stockport-possible-closure` |
| Darcy's | `sFtBFBVDH68B7lROwqqj` | possible closure — `bv2a-firing12-darcys-possible-closure` |
| The Nest (Leek) | `2cbf0be1-0bce-4080-ad9b-42fe6c692ebe` | address collision with a hair salon — `bv2a-firing10-the-nest-leek-address-collision` |
| The Decorated Dead Tattoo Studio | `28f7869f-3bf4-4214-a9f2-ff2a94f8a4f5` | not a music venue — `bv2a-firing10-decorated-dead-tattoo-studio-not-a-venue` |
| Ann Welfare Playing Fields | `5be68729-0b17-487f-b3d0-ca9023c5bc90` | probable non-venue (council playing field) |
| Spaces Studio | `74ea5a81-09d8-47ce-8cc5-955df975bd45` | not a music venue — `bv2a-firing01-spaces-studio-possible-non-venue` |
| Decade of Dance | `cf25ce49-3b67-4c3f-a80b-73a7b0bfa79d` | probable non-venue — `bv2a-firing00-decade-of-dance-possible-non-venue` |
| West Park, Long Eaton | `0888fe2f-504b-48fa-a1c2-e9c3e0afe7e0` | probable non-venue (council park) |
| Seabridge, Seabridge | `a6cb4e7c-3969-478b-ab3c-99e697a0d483` | postcode mismatch — `bv2a-firing23-seabridge-postcode-mismatch` |
| Madeley Carnival, Madeley | `56373bed-08e8-4fd8-a2f7-cafde860e75e` | already evidenced blank earlier TODAY by firing 17's own list (`records-2026-08-18-firing17.json`) — not re-attempted to avoid a duplicate evidence line for the same day |
| Jorge Wilson + Jesse James | `befdd87f-2d49-4a0e-ab7a-fcbe2dac32bf` | garbled venue name, two artist names concatenated — `bv2a-firing01-jorge-wilson-evidence-id-wrong` |
| Jubilee Park, Horndean | `2ebace81-f0be-409c-8cab-a1b638627c01` | probable non-venue — `bv2a-firing13-jubilee-park-horndean-possible-non-venue` |

**New finding this firing (1):**

| Venue | id | Reason |
|---|---|---|
| Newsham Park & Garden | `9fbfd78e-a27a-4791-8ca5-a1d8c3ea6739` | Search shows this is a public park in Liverpool whose only associated Facebook pages are "ghost hunt"/asylum-themed event promoters (Asylum Newsham Park, Newsham Scream Park), not a grassroots music venue with its own identity. Same class as the Campbell Park / Gostrey Meadow / West Park findings. Not searched under the venue protocol beyond this check — no evidence line written. Needs a human check of whether this record should exist as a bndy venue. |

That is 11 + 1 = 12 in the table above; the 13th is **Kidsgrove Masonic Club's** near-twin
address confusion note is not a skip (it was enriched, see above) — correcting the count:
13 skips = the 11 re-confirmed + Newsham Park + no further item. (12 skips, 8 verified, 9
blank, 1 not-searched-under-protocol = 30 records examined this firing, matching the
oldest-30 window.)

## Names corrected under §0.6

None. §0.6 governs artist names; no venue rename was made unattended (venue protocol has
no equivalent unattended-rename authorisation, per the standing `bv2a-firing09-name-
mismatches` / `bv2a-firing12-name-mismatches` findings). Post Office, Burslem's bndy name
does not match its own page name ("The Old Post Office") — flagged, not renamed.

## Validator summary line (verbatim)

```
17 records · 8 clean · 0 FAIL · 17 WARN   [mode=gate]
```

All 17 WARN are `STUB_NO_BIO`/`STUB_NO_IMAGE` on the 8 facebookUrl-bearing records
(expected — venues carry no bio/image requirement under §FP.2) plus one `NAME_BILLING`
false-positive on "Lamplight - Coffee House & Tap Room" (a legitimately hyphenated
business name, not promo billing). No FAIL outstanding.

Records file: `data/normalized/enrichment/records-2026-08-18-firing18.json`. Evidence
file (this firing's own, source-scoped): `data/state/enrichment-evidence-2026-08-18-
enrichment.jsonl`, appended to (never rewritten). Per the standing
`validator-venue-evidence-loader-artistid-only` fingerprint, an aliased copy
(`venueId`→`artistId`) was built at `data/state/tmp/evidence_aliased_firing18.jsonl` for
the validator to consume — the source-scoped file itself is untouched.

## Step 5 — Ledger, summary, dashboards

- `data\state\enrichment-ledger.jsonl`: appended 17 `enrich` lines (8 verified, 9 blank) +
  1 `snapshot` line. **Own error, self-corrected:** the first Hebburn Town FC line
  contains a typo'd id (`a54acbfe-3985-431f-822b-6008a6aae8ec` — one character wrong); a
  correcting line with the right id was appended immediately after (ledger is
  append-only, cannot be rewritten).
- Snapshot: `artistsTotal:2231, artistsMissingSocials:867, artistsMissingGenres:614,
  venuesTotal:3004, venuesMissingSocials:308` (308 = 316 − 8 verified this firing — exact
  1:1 match; artist figures static, confirming the Chrome outage's continued effect).
- `data\state\run-summary.jsonl`: appended one line, `outcome:"completed"`,
  `recordsEnriched:8`, `skipped:22`. **Own error:** that line's `note` field ran to 99
  characters, over the 90-char cap; a corrective line was appended but its own note was
  also over-length. Logged as a defect in CTO-INBOX rather than compounded further.
- Both dashboards regenerated: `data\normalized\enrichment\DASHBOARD.html` (2044
  enrichment records, 68 snapshots) and `data\normalized\DASHBOARD.html`.
- `20-Daily/2026-08-18.md`: one line appended linking this report.

## CTO-INBOX

Appended: twenty-first-consecutive-firing Chrome outage entry; Newsham Park probable
non-venue finding; run-summary note-length-cap defect.

## Budget used, and whether the circuit breaker fired

Claim acquired 18:19:35Z, work (runbook read + backlog sort + search + writes +
validation + reporting) completed by ~18:32Z — **~13 minutes**, well inside the 40-minute
task budget and the 3-hour claim TTL. Circuit breaker did not fire (0 FAIL on this and the
prior 3 reports).

## Outcome

**Ran OK.** enrichment — 8 venues verified, 9 venues evidenced blank (17 worked), 12
skipped on standing/new non-venue or data-quality flags, 1 not searched under protocol, 0
artists (Chrome unreachable, 21st consecutive firing). Validator 0 FAIL.
