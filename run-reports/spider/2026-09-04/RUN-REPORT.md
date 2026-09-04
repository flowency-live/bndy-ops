# spider — RUN REPORT 2026-09-04

**Run id:** `spider-2026-09-04T01-05-12Z`
**Runbook read:** v2.27. **Floor asserted:** §6A CURRENT FLOOR v2.19. **PASS.** The prompt states no number.
**Outcome:** COMPLETED (Partial). Chrome was unreachable for the whole run.
**Records written to bndy and read back: 3** — 2 events, 1 venue enrichment edit. 0 artists, 0 venues created.
**Validator:** `0 records · 0 clean · 0 FAIL · 0 WARN [mode=gate]`. No artist record was written, so the validator had no input.

## 1. Gates

| Step | Result |
|---|---|
| §6A.0 heartbeat | `data\state\heartbeat\spider-2026-09-04T01-05-12Z.json`, written first. |
| §6A.1 date | Shell up. `2026-09-04`, 01:05Z. |
| §6A.2 runbook + spec | Both read in full. CTO-INBOX spider fingerprints read. No daily note for 2026-09-04 existed at start. |
| §6A.2a floor | v2.27 ≥ v2.19. PASS. |
| §6A.2b claim | Released (`heldBy: null`, lastRun spider-2026-09-03T01-04-59Z). Acquired 01:05:30Z, TTL 60 min. Previous heartbeat reads `completed`. No takeover. |
| §6A.3 tools | bndy MCP reachable. Shell up. **Chrome: `list_connected_browsers` returned `[]`; `tabs_context_mcp` reports the extension is not connected.** The built-in browser pane opened but every navigation (facebook.com, foremansbar.co.uk) was denied; unattended, nobody can approve a site. `web_fetch` and `WebSearch` were the only surfaces. |
| §6A.5 snapshot | Not applicable. Discovery source. |
| §5.4 tombstones | `data\state\cancellations.jsonl` grepped for burtonwood, morrissey, electromantics: 0 lines. |
| §0.29 mode | Spec declares no mode. Behaved append-only. Fingerprint `spider-mode-not-declared` already in the inbox. |

## 2. What Chrome-down means for this run

RUNBOOK §2A.1 item 5 forbids a bare artist create, and item 7 says that when the run cannot perform the identity check the artist is not created. **So this run could write only events whose artist bndy already holds.** Fingerprint `spider-chrome-unreachable-blocks-new-artists` is already in the inbox; it is not re-raised.

## 3. Seeds and district

Cursor priorities read from `spider-state.json`:

1. **Foremans Bar NG1 / Resistance 77 2027-01-10.** Own site `resistance77.com/gigs` reached by `web_fetch`. It lists Vault 27 Barnsley 2026-09-26 and Holy Diver Stockport 2026-11-26; the Foremans date is not on it yet. Resistance 77 is not in bndy (`search_artist` top hit Resistance Is Punk 61%, a different act). **Create blocked: Chrome.** Lead kept in the cursor.
2. **Cob.** Not retried; needs SlowHandClap's own posts, a Facebook surface.
3. **CW9 Facebook-only seeds.** Not attempted; Facebook unreachable.
4. **WA1/WA4 Warrington rule-4 venues with a website.** Worked. `list_venues(city: Warrington)` returned 9 venues; 3 carry a website. Plus St Helens, Widnes, Runcorn: 3 more with a website.

Hops (7 venue, 4 artist):

| Seed | District | Surface | Rows | Result |
|---|---|---|---|---|
| The Club-Burtonwood `65ebc781-8ce5-446b-bc48-12e42baf2e15` | WA5 | burtonwoodclub.co.uk/whatson | 9 future | **2 events written**, 1 already held, 6 blocked (artist unknown, Chrome) |
| The Saracens Head `b59facf2-5a30-4469-8b2f-dabf23211757` | WA4 | saracensheadpub.co.uk | 0 | Saturday "Live Band" with no act named. RUNBOOK 0.5. |
| Bridges `d3ab11ba-9bc7-4749-98bc-b1c65f6caae6` | WA1 | ambertaverns.co.uk | not fetched | Amber Taverns chain page. No listing surface. |
| Ring O' Bells Farnworth `f4c47c1a-3b1d-403c-9d4a-8cb6e4364689` | WA8 | ringobellsfarnworth.co.uk | 0 | "Live music every Friday & Saturday". No act, no date. |
| Blackbrook Rugby Club `1f2acac5-2df5-415d-bfea-0ca9ffe37db4` | WA11 | blackbrookrugby.co.uk | 0 | Empty response to web_fetch. |
| Foremans Bar `61b0ccbb-5ef2-4f6d-9508-fc087b189986` | NG1 | foremansbar.co.uk | 2 | Unchanged since 2026-09-02. Both held. |
| Fältsånger `19d4985d-7e25-404f-a125-cd594d77c017` | — | fieldsongs.co.uk | 1 | Peggy McCools 2026-10-16, already held `f28ebf1d`. |
| Simple Plan UK `daf5f02c-bd1b-429d-bab5-cb94b9b7c661` | — | simpleplanuk.co.uk | 0 | Site has no gig list. |
| Steve O'Donoghue `78af7190-dd71-4cc1-8382-02942e989a4c` | — | steveodonoghue.com | 0 | Empty response. |
| Darren Poyzer `6186885d-59b9-47ef-bbeb-65cc01e86625` | — | poyzer.com diary | 0 | Diary dated 2024. Stale. |

## 4. Records written — all read back (§0.10)

### Events (2) — at The Club-Burtonwood `65ebc781-8ce5-446b-bc48-12e42baf2e15`, WA5 4HQ

| id | title | date | start | price | source |
|---|---|---|---|---|---|
| `1029da91-908c-40aa-b4d4-01199cb0890a` | Viva Morrissey @ The Club-Burtonwood | 2026-09-11 | 19:30 | £12 | venue site, doors 7:30pm |
| `cfeed187-7b15-4813-8214-52f0efeb93dc` | Electromantics @ The Club-Burtonwood | 2026-12-26 | 19:30 | £12 | venue site, doors 7:30pm |

Artists reused: Viva Morrissey `16e0cb13-6dc4-4d39-a5a4-50a2a1e7890a` (100%, Manchester); Electromantics `881914c9-8071-489a-be43-164c41d43c8d` (100%, North West UK). Both within region and within 40 miles.

Times (§0.28 case 2): the site publishes doors only. `startTime` 19:30, `Doors 19:30` in `ticketInformation`. No time defaulted. ticketUrl `wegottickets.com/theclubburtonwood`. externalIds `{source:"spider", id:"venue-<venueId>-<date>-<artist-slug>"}`. 0 events bounced 409. 0 tombstone hits.

### Venue enrichment edit (1)

The Club-Burtonwood `65ebc781-8ce5-446b-bc48-12e42baf2e15`: `standardTicketed: true`, `standardTicketUrl`, `phone 01925 227488`, `instagramUrl instagram.com/theclubburtonwood`. **Read-back:** standardTicketed, standardTicketUrl and phone confirmed. **instagramUrl is NOT in `socialMediaUrls` on read-back** although `edit_venue` listed it in `updatedFields`. Raised in CTO-INBOX as `edit-venue-instagramurl-not-read-back`.

## 5. Rows found and NOT written

| Row | Why |
|---|---|
| Charelle Jaiden (Whitney tribute) 2026-09-04 | Artist not in bndy. Create blocked: Chrome. |
| Fleetwood Nick'd 2026-10-09 | Same. |
| Lareena Mitchell (Adele tribute) 2026-10-23 | Same. |
| Stevie G (Motown & Soul Night) 2026-11-13 | bndy holds a Stevie G in Torquay. Different region, so not the same act (§1A.1). A Warrington-area Stevie G needs a create. Blocked: Chrome. |
| Not Guns N' Roses 2026-11-21 | Artist not in bndy. Create blocked: Chrome. |
| Tommy Holland & The Rising Sun Band 2026-11-27 | Same. |
| Take Off That 2026-11-14 | Already held `092bb29a-ff2c-4bad-91db-93428f414cc2`. |
| Resistance 77 — Vault 27 Barnsley 2026-09-26; Holy Diver Stockport 2026-11-26; Foremans NG1 2027-01-10 | Artist not in bndy. Create blocked: Chrome. Own site verified: `resistance77.com`, Facebook `facebook.com/resistance77uk`. |

Venues examined and not created: none. No new venue this run.

## 6. Deletions

**None.** Append-only behaviour.

## 7. The metric

**Discovery saturation: 0 new venues / 11 hops = 0 per 100 hops.** Per district: WA5 0 (0/1, 2 records of rule-4 fill), WA4 0, WA8 0, WA11 0, NG1 0. Every hop was a venue bndy already held or an artist it already held. **The Warrington/St Helens/Widnes/Runcorn rule-4 website queue is now READ.** Remaining venues there are Facebook-only.

## 8. Quality measure (§6)

| Class | Count |
|---|---|
| Artists created with a verified page | 0 |
| Artists created with an evidenced blank | 0 |
| Artists reused | 2 |
| Events created | 2 |
| Enrichment edits | 1 |
| Rows blocked on Chrome, with the artist named | 9 (6 Burtonwood, 3 Resistance 77) |
| Gate bounces | 0 |
| Validator FAIL | 0 |
| Deletions | 0 |
| Partial captures | 0 |

## 9. Files written

heartbeat (started→completed) · claims/spider.json (acquire→release) · data/raw/spider/2026-09-04/captures.json · enrichment-evidence-2026-09-04-spider.jsonl (empty, no artist writes) · data/normalized/spider/2026-09-04/records.json (empty) · spider-seen.json · spider-coverage.json · spider-state.json · run-summary.jsonl (append) · 20-Daily/2026-09-04.md (create) · CTO-INBOX.md (2 lines appended) · this report.
