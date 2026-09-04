# SPIDER RUN REPORT — 2026-08-29

Run id: `spider-2026-08-29T19-51-22Z` · Runbook read: **v2.27** · Floor (§6A): **v2.19** → PASS (prompt floor line: "at or above the CURRENT FLOOR stated in §6A" — both numbers reported per §6A step 2a).
Claim: acquired 19:55Z (`heldBy: null` on read — clean release by `spider-2026-08-28T01-04-35Z`), TTL 60 min.
Mode: `spider` declares no §0.29 mode (already in CTO-INBOX as `spider-mode-not-declared`). This run is additive only. It deleted nothing and hid nothing.

## Surfaces

- **Chrome: NOT CONNECTED** (verified 19:56Z; matches every other run tonight). Facebook search and Facebook page visits were unavailable. Consequence: no artist create on Facebook-only evidence. Already fingerprinted (`spider-chrome-unreachable-blocks-new-artists`), not re-raised.
- `web_fetch` worked for skiddle.com, longearthmusic.com, livinginshadows.com, monkeytrial.bandcamp.com, comedyoferrors.bandcamp.com. comedyoferrors.org is JS-only and returned an empty body.
- Google (WebSearch) worked.

## Seeds and hops

Cursor (`spider-state.json`) said: STAY IN CW2, finish The Arena Crewe Skiddle backlog first. Obeyed.
1 seed worked, 1 hop: **The Arena Crewe** `Ojeq5atXE2krvQIZVqqd` (rule 4 continuation), surface = its Skiddle listing. Each open row's event page fetched directly by id (`skiddle.com/e/<id>`) — pages are server-rendered and carry full lineups; the venue LIST page is client-rendered and empty to fetch, so per-event fetch is the right route.

## Tombstone check

`data/state/cancellations.jsonl` read in full before any create. No line matches any artist+venue+date written this run.

## Records written (9 total — every one read back per §0.10)

Artists created (4):
- `16be087a-1da4-492c-b18b-c7d596d308a2` **Comedy of Errors** — band, Glasgow, originals, Rock. Website `comedyoferrors.org`. Bio EMPTY (no verbatim own-page text reachable; own site JS-only). FB blank — surface down.
- `ddbca814-6506-4a80-9518-971bd7839457` **Long Earth** — band, Glasgow, originals, Rock. Website `longearthmusic.com`, bio quoted verbatim from it. FB blank.
- `15d9b9ae-5334-4647-83bb-1ba9a284d69c` **MonkeyTrial** — duo, "UK wide" (regional; own page states "UK." only — §0.7 national-act rule, gig town not used). Own page name is one word; Skiddle billing "Monkey Trial" stored as nameVariant. Bio verbatim from own bandcamp. Electronic, originals.
- `2d3cfef2-4cf6-4f3b-9ac3-4c5bd9e71080` **Living In Shadows** — band, North East (regional; debut recorded Studio 51 Gateshead per their bandcamp, About page names no town). Bio verbatim from livinginshadows.com/about. Website + Instagram (both from the act's own site).

Events created (5), all The Arena Crewe `Ojeq5atXE2krvQIZVqqd`, all ticketed with Skiddle ticketUrl:
- `96587936-8afd-4b23-a448-937bd509f530` Rachel Shenton (EXISTING artist `vOcRqNQmZpVLd5T4X5o9`, Stoke-on-Trent — §1A.2 case 3, Stoke act gigging in Crewe, reuse) — 2026-11-20 20:00. Doors 19:30 in ticketInformation. externalId `venue-Ojeq5atXE2krvQIZVqqd-skiddle-42630481-rachel-shenton`.
- `cae4ffd5-95b9-4799-b493-334bc63f5fb5` Comedy of Errors — 2026-09-19 13:30.
- `91e8abdf-399c-40c6-8576-654a4cf0f1bb` Long Earth — 2026-09-19 13:30.
- `784ebc4c-544f-4a5a-87b1-44c0c7c39188` MonkeyTrial — 2026-09-19 13:30.
- `75ef6f30-0568-4493-aa94-6587d08ad133` Living In Shadows — 2026-09-19 13:30.
  Prog All-Dayer 2 (skiddle 42123945): §4 discrete event per act; festival name in each title per §0.27. Bill runs 13:00–23:00, performance starts 13:30; per-act set times NOT published — 13:30 used for all four and the window stated in ticketInformation (§0.28). externalIds `venue-Ojeq5atXE2krvQIZVqqd-skiddle-42123945-<artist-slug>`, matching the convention already live on this venue's spider events.

409s: 0. Deletions: 0. Venues created: 0 (no new venue encountered — saturation on the venue axis continues in CW2).

## Validator (§6A step 8)

`4 records · 4 clean · 0 FAIL · 0 WARN [mode=gate]` — after one self-caught FAIL:
- First pass: `FB_EVIDENCE_MISMATCH` on Living In Shadows — facebookUrl `facebook.com/LivingInShadows` was taken from the act's OWN website footer (not a search snippet), but the evidence capture is the website, not the FB page, and the validator (correctly, mechanically) requires the evidence to come from the stored page. **Reverted**: facebookUrl and derived avatar cleared, read back null/empty. The link is recorded here so an enrichment run with Chrome can attach it from the page itself in one visit.
Evidence file: `data/state/enrichment-evidence-2026-08-29-spider.jsonl` (4 lines, written before the creates; artistIds appended after create per the standing `evidence-file-cannot-precede-a-create` finding).

## Quality split (§6)

- Created with verified own-surface page: 4 of 4 artists (3 with verbatim bio; Comedy of Errors bio empty — evidenced, own site unreadable without JS).
- Evidenced blanks (facebookUrl): all 4 — Facebook surface down; variants tried are in the evidence file. These blanks are Chrome-outage blanks, NOT both-surface blanks — re-run under §2A.1 3b when Chrome returns.
- Skipped rows, one line each (§0A: skip and say so — next run retries):
  - skiddle **42666800** (Sun 2026-08-30, Tru80s + That 80s Show): **Tru80's half already in bndy** (`94fa46f5`, prior run). **That 80s Show** skipped — Google (2 variants tonight: `"That 80s Show" band`, `"That 80s Show" UK live band`) returns only US acts and different-named UK shows; FB surface down so §2A.1 3b cannot complete. Not creatable tonight.
  - skiddle **42630481** (Fri 2026-11-20): **Pitbull UK** skipped — page exists (`facebook.com/Pitbulltributeuk`, IG `pitbullworldwidetribute`, national touring tribute) but cannot be VISITED with Chrome down, and §2A.5 forbids a create without the page check; snippet-attachment is the exact failure `fb-page-must-be-visited-not-snippeted` names. High-confidence retry when Chrome returns.
  - skiddle **42669944** (Sat 2026-10-24, "U2 vs Simple minds"): **Achtung Baby** skipped — same-name U2 tributes exist in Australia and Italy; the UK FB candidate cannot be verified without Chrome (§0.15 blank-beats-wrong). **Simple Minds half** skipped permanently — the source names NO act, only "a stunning live tribute to Simple Minds" (§0.5: never invent a name).
  - skiddle **41978670** (2026-10-17, Prodigy And Pendulum Tributes): not fetched this run (time budget); cursor already records no act named — §0.5 unless the page names one. Retry.
  - skiddle **42573107** (2026-09-25, Forever Tina): unchanged — only a US act evidenced (§0.15). Retry with Chrome.
  - skiddle **42569015** (Crewe Rocks, TODAY 2026-08-29 — single-day event, not 29–30 as the cursor said): CLOSED. The Arena's three evening sets were already in bndy from skiddle 42667026 (Harry Holmes `fc2a1d27`, PowerAge UK `c1660284`; Failed To Ignite still blocked on the Newcastle ambiguity in CTO-INBOX). The Borough and Tom's Tap daytime lineups (11 acts, 12:00–17:00 sets) had already been played by capture time — past, not imported (§0.14). Lineup preserved here as discovery leads: Danny James, Ant Clowes Duo, Sheena Shine, Steve Robinson, Andy Mac, Baxter (The Borough); Violet Cry, Oli Ng, Minstrels Of Mischief, Something Followed Me Home, We Are Nomad (Tom's Tap).
  - skiddle **42461138** (Flashback, 2026-08-28): now past. CLOSED, nothing written.
- Partial captures: none — every fetched page rendered complete server-side.

## record_run

Attempted? NO — `record-run-token-missing` and `bv2a-firing0319z-record-run-http-500` are both standing CTO-INBOX defects; a third confirmation adds nothing and the call costs budget. Counts are in `run-summary.jsonl`.

## CTO-INBOX

0 new items. Everything hit tonight is either answered by a standing rule (§0.5, §0.15, §2A.5) or already fingerprinted (`spider-chrome-unreachable-blocks-new-artists`, `spider-mode-not-declared`, `fb-page-must-be-visited-not-snippeted`, `record-run-token-missing`).

## Metric

New venues per 100 hops: **0** this run (1 hop, 0 venues). CW2 venue-axis saturation stays 0.0 — but the district keeps yielding on the EVENT axis (23 events from one venue across two runs). Saturation understates rule-4 fill, as already logged (`saturation-blind-to-rule4-fill`).
