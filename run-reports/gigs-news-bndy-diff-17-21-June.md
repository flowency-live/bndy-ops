# gigs-news — confirmed vs in bndy (17–21 June 2026)

Compares the curated confirmed list (`gigs-news-confirmed-17-21-June-2026.md`, 35 gigs) against what the new-world
runner actually landed in bndy. Verified via MCP (get_by_external_id / search_event by venue+date), 2026-06-18.

## Headline
- **Confirmed gigs this week:** 35
- **Actually in bndy:** **4** (the only gigs where BOTH venue AND artist already matched deterministically)
- **Missing:** **31** — blocked, not lost. Cause = artist footprint-matcher misses existing same-name artists →
  goes to review → review items were being **dropped** (runner bug, fixed, deploy pending). The venues mostly
  matched fine and were stamped.

## In bndy now (4)
| Date | Artist | Venue | Status |
|------|--------|-------|--------|
| 18 Jun | Roy Pimmy | The White Hart, Woodley | ✅ public event (verified) |
| 20 Jun | the Select Committee | Armed Forces Fest, Handforth | ✅ in runner write set |
| 21 Jun | Between the Vines | the Railway, Greenfield | ✅ in runner write set |
| 21 Jun | the Select Committee | Church House, Sutton | ✅ in runner write set |

## Missing (31) — sample verified, rest by same mechanism
Spot-verified absent in bndy (venue exists + stamped, no event):
- 90 PROOF @ Arden Arms, Stockport (artist **exists** in bndy at 100% — "90 Proof", North West)
- Evolution @ the Stock Dove, Romiley (artist **exists** at 100%)

The artists exist by name (90 Proof, Evolution, and — from sceniceye — Kneeslider, Michelle Lewis all 100%), but
the footprint matcher (ADR-021) doesn't match on name alone, so the gig went to review. With the review-item +
canCreate fixes deployed and the intelligence pass live, these resolve by name+region and the events get created.

Remaining missing (expected, same cause): Blueheart, Baltimore Switch, Jon Casey Blues Band, Andy Lee, James sings
Elvis, Smooth Edge, Haggis Horns, Paul Waldron, Tommy P & the Crew, Dale Murphy, Tracy Morgan, Babalola, Undercover,
Chris G, Nightflight, Nazma, the White Hairs, Salford Angels, Savage Budgiez, Si Peddle, Big Swingy Thing, Off the
Record, Ray Vonn, Midnite Blue (duo), Macy, Steve James, Delorean, Ricky Stone, branded.

## Note on parser vs curated list
The runner parser produced 37 valid rows vs your 35 — the difference is "branded @ the Billy Goat" (listed twice;
parser kept both) and "Jazz at the Railway" (your list correctly excludes it as a recurring jazz night; parser
lets it through). Both are minor and known; the parser is otherwise aligned with your curation.

## This file = the post-deploy acceptance checklist
After the Day-1 work-order (commit+deploy API, deploy signals, clear snapshots, re-run, flip DRY_RUN), re-check
this list: target is the 31 missing drop toward 0 as the intelligence pass resolves the artists and creates the
events. Any that remain missing → inspect that gig's review item / pass-result reason.
