# bndy Duplicate-Artist Remediation — WORKSHEET SUMMARY
_Generated 2026-07-03 from direct DynamoDB dumps (bndy-artists 2106, bndy-events 4551). READ-ONLY so far — no mutations performed._

## Headline
- **121** duplicate-artist groups (normalised + fuzzy), vs 96 in the exact-name report — normalisation caught 25 more.
- **108** auto-merge · **13** staged for your ruling.
- Auto-merge executes: **57** events reassigned to keeper · **72** duplicate events deleted · **1** collaborator-list fix (manual, MCP can't edit `collaboratingArtistIds`) · **129** duplicate artist records deleted.
- Validation: all 13 named examples present ✅ · all 96 report groups' ids captured ✅ · all 6 plan-named keepers match my heuristic ✅

## Staged for your ruling (13) — NOT touched by auto-merge
| Group | Events | Why staged | Recommendation |
|---|---|---|---|
| The Ant Hill Mob | 23 | distinct regions ['BURTON', 'NW'] | Burton vs Northwich (~2hrs apart) |
| Trilogy Rock Band | 22 | distinct regions ['NW', 'STAFFS'] | NW vs Staffs — but you pre-adjudicated keeper XJ2gV4… → confirm to promote |
| Undercover / Undercover Band | 20 | distinct regions ['NE', 'SUSSEX'] | NE vs Sussex — likely distinct acts |
| The VANZ Band / The Vanz / VANZ Acoustic Duo | 17 | multiple ACTS incl. Roxx — Jason to direct (ADR-023) | Vanz act-family (Band/Duo/Acoustic/Roxx) — how do you want acts modelled? |
| The Flames | 14 | common-word name, no shared venue to confirm | common name, no shared venue |
| ALIBI / Alibi / The Alibi | 12 | distinct regions ['HANTS', 'STAFFS'] | Hants vs Staffs |
| The VANZ ROXX / Vanz Roxx | 5 | multiple ACTS incl. Roxx — Jason to direct (ADR-023) | Vanz "Roxx" act — see above |
| The Power 3 / the Power 3 | 3 | distinct regions ['NW', 'STAFFS'] | NW vs Staffs |
| Eleventh Hour / The Eleventh Hour | 2 | distinct regions ['NW', 'STAFFS'] | NW vs Staffs |
| Elvis | 2 | common-word name, no shared venue to confirm | common name, no shared venue |
| Festival Blues Band / The Festival Blues Band | 2 | distinct regions ['NW', 'STAFFS'] | NW vs Staffs |
| Giroscope | 2 | common-word name, no shared venue to confirm | common name, no shared venue |
| Kimmi | 1 | distinct regions ['DERBY', 'NE'] | Derby vs NE |

## Auto-merge — the 108 groups (top 15 by event volume)
| Keeper | Records | Events | Naming |
|---|---|---|---|
| Danny Brab | 3 | 85 | — |
| Tubesnake | 3 | 43 | — |
| The Select Committee | 2 | 40 | — |
| The Zone | 4 | 38 | — |
| Blind Tiger | 2 | 32 | — |
| Crosshair | 2 | 32 | — |
| Ant Clowes Duo | 2 | 22 | rename keeper -> "Ant Clowes" |
| Dog In A Box | 2 | 17 | — |
| Brydon Trio | 2 | 14 | — |
| Hybrids | 2 | 13 | — |
| Star Breaker | 4 | 12 | — |
| Trilo3y | 2 | 11 | — |
| The Pluckers Acoustic Duo | 2 | 10 | rename keeper -> "The Pluckers" |
| Roy Pimmy | 3 | 9 | — |
| C&C Duo | 2 | 9 | — |

_Full detail (every member id, event, and per-event op) is in `dedup-worksheet.json`._

## Venue duplicates — noted, NOT part of this job
69 same-name venue groups, but 61 are the same pub name in different towns (correctly distinct). Only these have same-CITY collisions worth a follow-up pass:
- **The Red Lion**: 2×Derby
- **Royal Oak**: 2×Stoke-on-Trent
- **Travellers Rest**: 3×Stoke-on-Trent
- **Stone Cricket Club**: 2×Stone
- **The Furlong**: 2×Stoke-on-Trent
- **The Top Pub - Brown Edge**: 2×Stoke-on-Trent
- **The Jug**: 2×Newcastle
- **The Ashcombury Music Festival**: 2×Stoke-on-Trent

## Open decisions before I execute
1. **Go / no-go** on the 108 auto-merge groups (I'll test-fire the 3 write routes first).
2. **Naming**: for qualifier merges (e.g. Ant Clowes Duo → 'Ant Clowes'), rename keeper to the plain core per ADR-023? Default yes.
3. **Staged 13**: your ruling per row above — or leave all staged for a later pass.