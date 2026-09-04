# spider — RUN REPORT 2026-09-01 (second firing)

**Run id:** `spider-2026-09-01T20-00-25Z`
**Runbook read:** v2.27. **Floor asserted:** §6A CURRENT FLOOR v2.19. **PASS.** The prompt states no number.
**Outcome:** COMPLETED.
**Records written to bndy and read back: 12** — 7 events, 3 artists, 0 venues, 2 enrichment edits.
**Validator: 3 records · 3 clean · 0 FAIL · 0 WARN.**
**Path note:** this file is `RUN-REPORT-2.md` because the 23:27Z (2026-08-31 UTC) firing already owns `RUN-REPORT.md`. Known issue `run-report-path-collides-on-second-firing`; not re-raised.

## 1. Gates

| Step | Result |
|---|---|
| §6A.0 heartbeat | `data\state\heartbeat\spider-2026-09-01T20-00-25Z.json`, written first. |
| §6A.1 date | Shell up. `2026-09-01`, UTC 20:00:25Z. |
| §6A.2 runbook + spec | Both read in full. CTO-INBOX fingerprints and today's daily note read (both firings of other tasks noted). |
| §6A.2a floor | v2.27 ≥ v2.19. PASS. |
| §6A.2b claim | Claim was released (`heldBy: null`). Acquired. TTL 60 min per spec. Released at run end. |
| §6A.3 tools | bndy MCP reachable. Chrome connected, Facebook session live. Shell UP — validator runnable, artist creates permitted (unlike the first firing). |
| §6A.5 snapshot | Not applicable — discovery source, no upstream feed. |
| §5.4 tombstones | `data\state\cancellations.jsonl` read in full (17 lines). No line matches any artist+venue+date written this run. |
| §6A.8 validator | RUN. Summary line above. Records: the 3 created artists. The 2 website-only edits sit on 2 of those same records. |

## 2. Seed and district

Cursor said START AT CW9: **The Salty Dog, Northwich `d6f6778c-29f8-46dc-9a77-65eecee5705c`** — created bare by the previous firing from a Headsticks hop, its own listing never read. Rule-4 seed. This run worked that ONE seed deep rather than many seeds thin, per the cursor's website-over-Facebook lesson.

**Surface.** The venue's own site `salty-dog.co.uk/the-salty-dog` declares two ticket surfaces: `fatsoma.com/p/the-salty-dog` and `seetickets.com/promoter/the-salty-dog/27372`. Fatsoma read in full — 12 cards, all "The Salty Dog, Northwich" (the group's Crewe Dog / Delamere St Dog pubs share the site but no cards). Capture: `data/raw/spider/2026-09-01/salty-dog-fatsoma-run2.json`. See Tickets NOT read (time) — carried in the cursor.

## 3. Records created — all read back (§0.10)

### Events (7) — all ticketed, all with ticketUrl and price; startTime is the published event start, endTime the published end; every ticketInformation states "stage time not published" per §0.28

| id | title | date | price |
|---|---|---|---|
| `e99f798a-d033-4a15-bd32-0bc6ec62ca53` | Death or Glory - A Tribute to The Clash @ The Salty Dog | 2026-09-05 | £11 |
| `a66b3dac-1ce3-4765-a26c-fea93912a7d0` | The Panel @ The Salty Dog | 2026-09-19 | £6 |
| `c9576f44-22a9-42cb-8aba-4fa0832697fe` | TV Smith and The Bored Teenagers @ The Salty Dog | 2026-09-25 | £16.50 |
| `27080c18-dbd7-40c4-bee1-92f0895953c6` | Iggy Popz @ The Salty Dog | 2026-10-03 | £7 |
| `1d627b1a-f9f9-4238-a8b7-cfa74429b68f` | Warped - Pop Punk Tribute @ The Salty Dog | 2026-10-24 | £6 |
| `74018f68-04a0-49ac-bfdb-07a00a3099a4` | The Briefs (US) // Cyanide Pills @ The Salty Dog | 2026-11-06 | £19.25 |
| `509e7103-9d5d-4cb5-8ed5-3057d8731dc6` | Canadians In Space @ The Salty Dog | 2026-11-13 | £6 |

externalIds: `{source:"spider", id:"venue-d6f6778c-…-<gig date>"}` (+ `-cyanide-pills` suffix on the shared-bill row). 0 events bounced 409.

### Artists reused (3) — no fields edited

- **TV Smith `129b06cf-8868-4cab-8680-11073faad203`** — 100% name match, created today by KLMA. Billing "TV Smith and The Bored Teenagers" kept in the event title per §1A.5.
- **Death or Glory `c821b27e-2952-4e94-b12d-241cf0f662a4`** — 100% match; record's own bio states "Manchester-based tribute to The Clash", identical to the billing. Same act, adjacent footprint (§1A.2.3). Suggested top-up for a supervised session: `actType: ["tribute"]` is empty on this record.
- **The Cyanide Pills `4854e813-e5ea-41c4-aae7-8eb81da5dd85`** — §1A.2 Step 0 exact facebook-key match: Google confirms the Leeds punk band's page is `facebook.com/cyanidepillsuk`, exactly what the record stores. Note: the act's own page name is "Cyanide Pills" (no "The") — rename candidate for a supervised session, not done unattended.
- **Warped `c71bd983-3dad-4771-a8a1-766e6091661c`** ("Warped - Warped Tour Tribute Band", Manchester) — `create_artist("Warped")` returned `review` with this sole name-containment candidate. §1A.7: same name, same canonical region (footprint Stockport + Northwich + Manchester) → SAME act, resolved to the existing id, nothing created. My Google/FB searches had missed its page because it is a numeric `profile.php?id(eq)61578290955340` page.

### Artists created (3) — evidence file written BEFORE each write: `data\state\enrichment-evidence-2026-09-01-spider.jsonl`

| id | name | page status | location | fields |
|---|---|---|---|---|
| `346c00f5-febc-44c5-a6f3-dea83ed97eb2` | The Panel | **EVIDENCED BLANK** — variants on both surfaces in evidence file; direct `facebook.com/thepanelband` is dead; act's live surface is Instagram `@thepanelband` (attached), tagged by The Ferret, Preston | North West (footprint Preston + Northwich) | genres Indie, New Wave (inferred from The Ferret's billing copy) |
| `f4938750-c665-4490-81e7-52cedfa49f2b` | Iggy Popz | **VERIFIED PAGE, visited** — `facebook.com/iggypopzband`, page states The Crib, Blackpool FY4 | Blackpool | tribute, Punk, bio quoted verbatim, avatar graph URL, website iggypopz.com |
| `5daf94d2-e33d-4348-9e8b-b017cf284828` | Canadians In Space | **VERIFIED PAGE, visited** — `facebook.com/canadiansinspaceband`, page posts about this very Salty Dog gig | Barnsley | originals, Pop ("Soap Pop"), bio quoted verbatim, avatar graph URL, website canadiansinspace.com |

### Enrichment edits (2)

`websiteUrl` on Iggy Popz and Canadians In Space (create_artist lacks the field). Both read back.

## 4. Rows found and NOT fully written

| Row | Date | Why |
|---|---|---|
| Bonny Lad, Reason To Leave, Guinea Pigs, The Hunc (4-act bill, £6) | 2026-09-04 | SKIPPED on time budget — 4 enriched artist creates. **Inside 3 days. Next run works this first.** |
| Vomit, Razortooth, Rocket 69 (3-act bill, £9) | 2026-09-11 | SKIPPED on time budget — 3 enriched artist creates. Inside 10 days. |
| "The Manchester Chronicles" book signing and Q&A with Clint Boon | 2026-09-17 | REJECTED — not a music performance (§ admission test). |
| Max Mutant DJ Set | 2026-09-18 | REJECTED — DJ set (§6 accept/reject filter). |
| The Briefs (US) — headliner of the 2026-11-06 row | 2026-11-06 | US touring act. Event exists via Cyanide Pills; headliner not created. See CTO-INBOX DECISION. |
| Antagonizers ATL | 2026-11-10 | US (Atlanta) touring act, no UK location possible. Same DECISION. |
| Falling Frank — "special guests" on The Panel row, per saltydogpub Instagram | 2026-09-19 | Not billed on Fatsoma; found late; not resolved. Carried in cursor. |

Venues examined and not created: none — single-venue surface, venue already held.

## 5. Deletions

**None.** No §0.29 mode declared in the spec (raised 2026-08-31 as `spider-mode-not-declared`); behaved append-only. No row vanished — no snapshot exists for this surface.

## 6. The metric

**Discovery saturation: 0 new venues / 1 hop (0.0 per 100 hops in CW9)** — but the hop wrote 12 records into a venue bndy held bare. This is the rule-4 fill the 2026-08-28 `saturation-blind-to-rule4-fill` note describes: the metric cannot see the run's actual yield. 3 artists found per hop is the honest signal.

## 7. Quality measure (§6)

| Class | Count |
|---|---|
| Artists created with a verified page (visited, not snippeted) | 2 |
| Artists created with an evidenced blank (variants recorded, both surfaces) | 1 |
| Artists reused instead of created | 4 |
| Rows skipped, with a stated reason | 7 (§4) |
| Names sanitised / refused as non-acts | 2 (book signing, DJ set) |
| Gate bounces | 1 — `create_artist("Warped")` review verdict, resolved to existing id per §1A.7 (a success, not an error) |
| Deletions | 0 |
| Partial captures | 0 (Fatsoma read in full; See Tickets surface not attempted, named in cursor) |

## 8. Files written

heartbeat (started→completed) · claims/spider.json (acquire→release) · data/raw/spider/2026-09-01/salty-dog-fatsoma-run2.json · enrichment-evidence-2026-09-01-spider.jsonl (5 lines) · build_validator_input_spider_run2009.py.records.json · spider-seen.json · spider-coverage.json · spider-state.json · run-summary.jsonl (append) · 20-Daily/2026-09-01.md (append) · CTO-INBOX.md (append, 1 item) · this report
