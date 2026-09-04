# BV2A ENRICHMENT — RUN REPORT — 2026-08-19, firing 10

**Run id:** `bv2a-enrichment-2026-08-19T10-17-59Z` · **Outcome: completed.**

## Gates

- **Circuit breaker (Step 0):** did not fire. Last 3 reports before this run (07, 08, 09) each closed at 0 FAIL and each wrote a report.
- **Runbook read in full.** H1 `v2.27`. **CURRENT FLOOR** (§6A) `v2.19`. `v2.27 >= v2.19` — met.
- **Concurrency (§6A step 2b / §6G):** claim file `data/state/claims/bv2a-enrichment.json` was `heldBy: null` (released by the prior run at `2026-08-19T09:27:50Z`). Acquired cleanly at `2026-08-19T10:17:59Z`, TTL 3h, `expiresAt` `2026-08-19T13:17:59Z`. No takeover needed. `enrichment.lock` was not found and was not created (retired file, per §6A step 2b).
- **Chrome: unreachable — 37th consecutive firing.** `list_connected_browsers` returned `[]`. Per the task's hard-stop table: **artist enrichment (work-order items 1, 4, 5) fully blocked this firing.** Venue work (items 2, 3) needs no Chrome under §FP.2 and proceeded.

## Selection

Work-order item 1 (artists created <24h, missing socials) and item 2 (venues created <24h, missing socials): **0 candidates** — `list_venues(missingSocials, createdSince=24h)` returned empty. Fell through to item 3 (backlog venues, oldest `createdAt` first).

Of the 55 `missingSocials` venue candidates, pulled the full list and cross-referenced today's ledger before searching. Findings, consistent with the standing `bv2a-venue-backlog-saturated-no-cooldown-check` fingerprint:
- **14 are foreign** (France, Sweden, Greece, Germany, Ireland, Denmark, Norway, Finland) — correctly out of scope, not searched.
- **7 are known defects already logged to `CTO-INBOX.md`** — Astor Hall (care home, not a venue), 1865/Carlton Place (name/address mismatch), Venue TBC (placeholder name), "United match)" (garbled name, Old Trafford), King William Ⅳ Bristol (confirmed genuine mismatch), Decorated Dead Tattoo Studio (confirmed Instagram-only), EX39 4JN (postcode-as-name, previously flagged) — not re-searched or re-logged.
- **18 had never had an `enrich` ledger entry** — of these, once foreign and defective ones are excluded, only **Arena Torquay** was a clean, never-attempted UK candidate.
- The remaining ~30 had all been searched **1–4 times already today** by firings 05–09, mostly returning the same blank.

**Judgment call, following the practice firing 07 established (spot-check rather than blind full re-search):** worked Arena Torquay (fresh) plus the 7 oldest-`createdAt`, longest-since-last-attempt backlog candidates (yesterday's attempts or >4h stale), rather than re-running today's already-exhausted queries verbatim. This is not a rule change — it is the same standing gap the last three firings have all logged, applied consistently. Full candidate-by-candidate reasoning is below.

## Enriched WITH a verified page (2)

| Venue | Fields | Evidence | Signal |
|---|---|---|---|
| Arena Torquay (`c97a9fd2-f5c9-4699-a1ed-ef55f8a3b2b5`) | `website`, `facebookUrl` | [facebook.com/arenatorquay](https://www.facebook.com/arenatorquay/), [arenatorquay.com](https://www.arenatorquay.com/) | Tier A — exact address match (39-41 Torwood St, TQ1 1DZ) confirmed on both the FB page and the venue's own site; phone/email also match |
| The Diversion Bars ltd (`e49909e5-a84d-4b10-98a3-bcf29bc8c153`) | `facebookUrl` | [facebook.com/181100895271895](https://www.facebook.com/181100895271895/) | Tier B — exact address match (23B Church St, Macclesfield) confirmed via local press (Macclesfield Nub News); FB page trades as "Diversion Bar", bndy holds the Companies House name "The Diversion Bars ltd" — **not renamed this firing**, flagged below |

## Recorded as EVIDENCED BLANK (7)

| Venue | Variants tried (both surfaces where applicable) | Reason |
|---|---|---|
| Darcy's (`sFtBFBVDH68B7lROwqqj`) | `"Darcy's" Fenton Stoke-on-Trent Victoria Road pub facebook`; `"Darcys" OR "Darcy's" Fenton pub facebook.com` | Only Instagram (@darcys_fenton) found; no FB page, no website. Chrome unavailable so FB's own search could not be tried this firing. |
| Newsham Park & Garden (`9fbfd78e-a27a-4791-8ca5-a1d8c3ea6739`) | `"Newsham Park" Liverpool events music facebook page` | Public park; only unrelated co-located businesses found (Asylum Newsham Park, Newsham Scream Park), neither of which is this venue |
| West End Club (`840be0d6-7049-4436-a5be-7e72030252b9`) | `"West End Club" Stapleford Nottingham facebook`; `site:facebook.com "West End Club" Stapleford` | A numeric-id FB page exists (`321449411237168`) but no snippet confirms Stapleford/Nottingham against it, and the name collides with unrelated "West End Club" pages in Newfoundland and Queensland — Tier C name match only, not attached |
| The Tannery (`d6572707-b153-40e4-ac09-fa15c19166a1`) | `"The Tannery" Sadler Gate Derby music venue facebook`; `"The Tannery" Ashover Brew Co Derby facebook.com` | No FB page found; only council/press coverage of the taproom opening |
| Ann Welfare Playing Fields (`5be68729-0b17-487f-b3d0-ca9023c5bc90`) | `"Ann Welfare Playing Fields" OR "Annitsford Welfare" Cramlington facebook` | Sports ground / football clubhouse; no page of its own, only the tenant football club's page |
| Spaces Studio (`74ea5a81-09d8-47ce-8cc5-955df975bd45`) | `"Spaces Studio" Burton upon Trent Wharf Road facebook` | Only match is spacesstudio.uk, an interior/kitchen design showroom — business-type mismatch against a music venue record, not attached without stronger confirmation. **Worth a human look**: possible wrong-business match at this address. |
| Hayfield Club (`cf792645-6f28-4430-ae44-f222a48e537c`) | `"Hayfield Club" Church Street Hayfield High Peak facebook` | No FB page distinct from the co-located Hayfield Cricket Club / Sustainable Hayfield charity at the same postcode |

## Records SKIPPED, and why

**~30 remaining backlog venues** skipped — all had at least one `enrich`-ledger entry from earlier today (firings 05–09) with a blank outcome on materially the same query space, most searched 2–4 times already. Re-running identical Google queries hours apart on unchanging pages yields no new information and burns budget the standing `bv2a-venue-backlog-saturated-no-cooldown-check` finding already describes. **7 known-defect venues** (see Selection) skipped — not re-searched, not re-logged (already in `CTO-INBOX.md`). **14 foreign venues** correctly untouched (bndy is UK-only, §5.3).

**Artist backlog (871 missing socials, 615 missing genres) fully stalled — Chrome unreachable, 37th consecutive firing.**

## Names corrected under §0.6

None. **Flag, not corrected:** The Diversion Bars ltd trades as "Diversion Bar" / "Diversion Bar & Kitchen" per its own Facebook page and local press — bndy holds the Companies House legal name. Left as-is; a venue rename wasn't attempted from a Google snippet alone (§0.6 wants the act/venue's own page name, and I did not visit the FB page directly — no Chrome this firing).

## Validator summary line (verbatim)

```
2 records · 0 clean · 0 FAIL · 4 WARN   [mode=gate]
```

Both WARN pairs are `STUB_NO_BIO`/`STUB_NO_IMAGE` on the two verified venues — expected noise under §FP.2 (venues carry no bio/image requirement). No FAILs on the first pass. Records/evidence adapted via the standing pattern (fingerprints `validator-venue-schema-mismatch` / `validator-venue-evidence-loader-artistid-only`): `data/normalized/enrichment/records-2026-08-19-firing10.json` and `data/state/evidence_firing10_aliased.jsonl`, built by `data/state/build_validator_input_firing10.py`.

## Budget used

2 venues verified + 7 evidenced blank = 9 venue records worked, 0 artists (Chrome hard-stop). Elapsed ~25 minutes of the 40-minute ceiling. Well under the 30-venue/15-artist cap. **Circuit breaker did not fire.**

Ledger: 9 `enrich` lines appended (2 verified, 7 blank) + 1 `snapshot` line. Snapshot: artistsTotal 2243, artistsMissingSocials 871, artistsMissingGenres 615 (all unchanged — Chrome down, no artist work), venuesTotal 3005, venuesMissingSocials 53 (down from 55). `run-summary.jsonl`: 1 line appended, outcome `completed`, recordsEnriched 2, skipped 7. Regenerated both dashboards: `data/normalized/enrichment/DASHBOARD.html` (2411 enrichment records, 84 snapshots) and `data/normalized/DASHBOARD.html`.

## Near-misses / worth a human's 30 seconds

- **Spaces Studio, Burton upon Trent** (`74ea5a81-09d8-47ce-8cc5-955df975bd45`) — the only web presence found at/near this address is an interior design/kitchen showroom, not a music venue. Worth checking whether this bndy record is a mis-capture (wrong business at this unit) rather than a genuinely unenrichable venue.
- **West End Club, Stapleford** (`840be0d6-7049-4436-a5be-7e72030252b9`) — a plausible FB page exists (`facebook.com/321449411237168`) but could not be confirmed against Stapleford without a Chrome visit; worth a follow-up once Chrome is back.
- **The Diversion Bars ltd** (`e49909e5-a84d-4b10-98a3-bcf29bc8c153`) — trading name "Diversion Bar" differs from the stored legal name; a rename candidate once someone can confirm the FB page's own name field.
