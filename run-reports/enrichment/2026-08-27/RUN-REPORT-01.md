# Bv2a Enrichment — RUN-REPORT-01

Firing: `bv2a-enrichment-2026-08-27T13-19-57Z` (hourly, unattended). RUNBOOK v2.27.

## Circuit breaker (Step 0)

Checked the last 3 run reports before starting: RUN-REPORT-00 (this date, 12:58:18Z firing, COMPLETED, validator 0 FAIL), and the two prior dated firings in `2026-08-21/` (both STOPPED on a live concurrency lock, zero work, nothing to trip on). No outstanding FAIL at close of any recent run. Breaker did not fire.

## Budget used

**20 verified + 10 evidenced blank = 30/30 venues worked** (backlog, oldest `createdAt` first). **3 verified + 12 evidenced blank = 15/15 artists worked** (mixed: missing-socials backlog + missing-genres-with-facebookUrl tier). Both caps hit. Elapsed ~18 minutes of the 40-minute ceiling (heartbeat 13:19:57Z → last write ~13:37Z). Circuit breaker did not fire.

## Validator summary line (verbatim)

Ran against 35 of this firing's 45 records — all 15 artists plus the 20 venues that resolved to a verified Facebook page. The 10 evidenced-blank venues were excluded from this pass: `enrichment_validate.py`'s evidence loader (`load_evidence()`) indexes only on `artistId`, silently dropping every `venueId`-keyed evidence line, so a blank venue always false-FAILs `BLANK_NOT_EVIDENCED` regardless of what was actually searched. This is an already-logged defect (`validator-venue-evidence-loader-artistid-only`, CTO-INBOX 2026-08-14) and matches the exclusion RUN-REPORT-00 applied for the same reason; not re-logged.

```
35 records · 14 clean · 0 FAIL · 44 WARN   [mode=gate]
```

0 FAIL. Batch ships.

Remaining WARN, not blocking:
- `STUB_NO_BIO` / `STUB_NO_IMAGE` on all 20 verified venues — expected under FP.2 (Google-only search sufficient for venues, no bio required, no image fetched unless disambiguating). Not a defect.
- `NAME_BILLING` ("contains ' - '") on **Blackshale Bar & Kitchen - Beeston** and **Totally Tapped - Craft beer specialist** — both names are the venue's own stored/display form, not a promo tail added by this run. No action.
- `STUB_NO_BIO` / `STUB_NO_IMAGE` on **Unit 17** — pre-existing (bio was already empty before this firing); this firing only corrected `genres`/`actType` on that record (see below), did not touch bio/image.

## Field corrections under contact

- **Unit 17** (`a7741d63-4109-4afa-a86c-f77ccde57dde`) — `actType` corrected from unset to `["originals"]` and `genres` corrected to include `Indie` (was `["Rock"]`, page confirms an indie-rock originals act, own page/website both corroborate). §0.18 outranks default-to-covers where evidence points away.

## Errors made and corrected this firing (full disclosure)

1. **Wrong venue write (self-caught, self-corrected).** While manually re-sorting a large `list_venues` dump by `createdAt` to implement oldest-first backlog order, mis-transcribed one id and wrote BSDCofficial's Facebook URL to `4c748361-a22e-4faf-a7ee-8117615a9708` ("BAR 98", Pontardawe) instead of the intended `4c553608-7bfd-4716-9b6f-74f1e5eaffc0` ("Burton and South Derbyshire College"). Caught because the `edit_venue` response echoed back the wrong venue name. Fixed: reverted BAR 98's `socialMediaUrls` to `[]`, confirmed via `get_by_id`; wrote the correct id; confirmed via `get_by_id`. BAR 98 is excluded from this firing's records/ledger entirely — it was never a real target and carries no evidence entry beyond the correction note. Logged as `bv2a-firing1319z-verify-id-before-live-write` (CTO-INBOX, RULE).
2. **Guessed (unconfirmed) Facebook URL, self-caught, self-corrected.** For **The Score Puppets**, Facebook's own page-search UI showed the right page in plain text but `get_page_text` returns no hrefs on that surface. Guessed the vanity URL `facebook.com/thescorepuppets/` from the name and wrote it without resolving — it 404'd on revisit. Fixed by using `javascript_tool` to read the real `<a href>` from the search-results DOM (stripping the query string to clear the tool's `=`-output guard), which revealed the true page: `facebook.com/breon.acoustic` (a repurposed handle). Corrected via `edit_artist`, confirmed via `get_by_id`. Logged as `bv2a-firing1319z-never-guess-fb-vanity-url` (CTO-INBOX, RULE).

Both errors were caught and fixed within this same firing, before validation; no bad state reached the validator or the ledger.

## Evidenced blanks (both surfaces tried per §2A.1 item 3b for artists; Google-only per FP.2 for venues)

10 venues: West End Club, Walton Working Men's Club, Marsden Social Club, The Focus Centre, Eastwood & District Conservative Club Ltd, Kings Head, Burton Market Hall, Abbey Arcade, Glass & Co., The Royal British Legion (Beeston — 4 competing FB page candidates found, none independently confirmable as current; correctly left blank per the no-guess-between-competing-pages rule).

12 artists: Xclusive, Shot Sundays, Sully and Co, The House Katz, Park 56, Mix 'N' Match, The Electric Gherkins, Glen Franklin, Lovin' It, Retro Knights, L-Squared, Seventh Son (Seventh Son — a real touring band of the same name was found, but evidence did not place it at this act's location; correctly left blank rather than attached on a name match alone).

## Defects / rules raised this firing

- `bv2a-firing1319z-verify-id-before-live-write` (RULE) — get_by_id-verify the target id's name immediately before every edit call built from a manually reconstructed list, not just before reporting.
- `bv2a-firing1319z-never-guess-fb-vanity-url` (RULE) — a URL inferred from a name/label is not evidence; only a URL read from an href or address bar qualifies.

No new DATA/DEFECT items beyond the above — the venue-evidence-loader and edit_venue-facebookUrl-noop defects hit this firing were both already logged by earlier firings today and not duplicated.

## Ledger / snapshot / run-summary / dashboards

- `data/state/enrichment-ledger.jsonl`: 45 `enrich` lines (20 venue-verified, 10 venue-blank, 3 artist-verified, 12 artist-blank) + 1 `snapshot` line appended (2889 → 2935 lines). Snapshot: artistsTotal 3273, artistsMissingSocials 1439, artistsMissingGenres 952, venuesTotal 3205, venuesMissingSocials 81.
- `data/state/run-summary.jsonl`: 1 line appended, outcome `completed`, recordsEnriched 23, skipped 22.
- Both dashboards regenerated: `data/normalized/enrichment/DASHBOARD.html` (2801 records, 97 snapshots) and `data/normalized/DASHBOARD.html`.

## Evidence file

`data/state/enrichment-evidence-2026-08-27-enrichment.jsonl` — this firing's entries appended before every write (lines 28–74 of the shared per-date file), including the two correction lines for the errors above.

## Claim / heartbeat

Claim released (`heldBy: null`, `lastRun: bv2a-enrichment-2026-08-27T13-19-57Z`). Heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-27T13-19-57Z.json` updated to `completed`.
