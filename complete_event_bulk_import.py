#!/usr/bin/env python3
"""
Complete event bulk import processor for onthecasemusic.
Processes all 294 events, handles variants, skips, and generates API calls.
"""

import json
import sys
from pathlib import Path
from typing import Dict, List, Any

def main():
    # Paths
    state_file = Path(r'C:\VSProjects\AllProjectsMD\bndy\10-Projects\bndy-population\data\state\onthecasemusic.json')
    events_file = Path(r'C:\VSProjects\AllProjectsMD\bndy\10-Projects\bndy-population\data\normalized\onthecasemusic\2026-04-27\events.json')
    output_dir = Path(r'C:\Users\jason\AppData\Roaming\Claude\local-agent-mode-sessions\e137f721-cf4a-45fc-be80-35fff477ad5f\b242da0e-22b2-4ff6-a9be-4f562903ec94\local_b23872fd-5aa3-4478-9e63-ed74cf9f81b7\outputs')

    # Load data
    print("Loading state and events...")
    with open(state_file) as f:
        state = json.load(f)
    with open(events_file) as f:
        events = json.load(f)

    print(f"Loaded {len(events)} events")

    # Config
    SKIP_IDS = {"27": "placeholder", "30015": "open_mic"}
    VARIANT_OVERRIDES = {
        "490": "0526e7a2-1185-41c9-af22-a29f90108299",    # Russ Tippins Electric Band
        "28950": "e9e0b454-daf9-4044-a0d1-5f508eb87abf",  # Dogs In A Box Duo
        "31098": "1382449f-bb3c-443c-8458-0bc00531ad0c",  # Rock and Roll Preachers
    }

    # Process
    output = {
        "summary": {
            "total_events_in_source": len(events),
            "skipped_placeholder_or_openmic": 0,
            "created_new": 0,
            "pre_existing_skipped": 0,
            "failed": 0,
        },
        "skipped": [],
        "events": {},
        "failed": [],
    }

    batch_1 = []  # First 150
    batch_2 = []  # Next 150
    batch_3 = []  # Final batch

    for idx, event in enumerate(events):
        ext_id = event.get('external_id')
        artist_ext_id = event.get('artist_external_id')
        venue_ext_id = event.get('venue_external_id')

        # Skip check
        if artist_ext_id in SKIP_IDS:
            reason = SKIP_IDS[artist_ext_id]
            output['skipped'].append({
                "external_id": ext_id,
                "name": event.get('name'),
                "reason": reason,
            })
            output['summary']['skipped_placeholder_or_openmic'] += 1
            continue

        # Resolve artist
        if artist_ext_id in VARIANT_OVERRIDES:
            artist_id = VARIANT_OVERRIDES[artist_ext_id]
        else:
            artist_info = state['artists'].get(artist_ext_id)
            if not artist_info or 'bndy_id' not in artist_info:
                output['failed'].append({
                    "external_id": ext_id,
                    "error": f"Artist {artist_ext_id} not found",
                })
                output['summary']['failed'] += 1
                continue
            artist_id = artist_info['bndy_id']

        # Resolve venue
        venue_info = state['venues'].get(venue_ext_id)
        if not venue_info or 'bndy_id' not in venue_info:
            output['failed'].append({
                "external_id": ext_id,
                "error": f"Venue {venue_ext_id} not found",
            })
            output['summary']['failed'] += 1
            continue
        venue_id = venue_info['bndy_id']

        # Build call
        date = event.get('date')
        start_time = event.get('start_time') or "21:00"
        title = event.get('title')
        price = event.get('price')
        url = event.get('url')

        call = {
            "artistId": artist_id,
            "venueId": venue_id,
            "date": date,
            "startTime": start_time,
            "title": title,
            "isPublic": True,
            "externalIds": [{"source": "onthecasemusic", "id": ext_id}],
        }

        if price and price != "FREE":
            call["price"] = price
        if price == "FREE":
            call["ticketed"] = False
        elif price and price.startswith("£"):
            call["ticketed"] = True
        if url:
            call["eventUrl"] = url

        api_call = {"external_id": ext_id, "call": call}

        # Batch distribution
        if idx < 150:
            batch_1.append(api_call)
        elif idx < 250:
            batch_2.append(api_call)
        else:
            batch_3.append(api_call)

        output['events'][ext_id] = {
            "bndy_id": None,
            "operation": "create",
            "is_public_set": True,
        }
        output['summary']['created_new'] += 1

    # Save outputs
    with open(output_dir / 'batch_1.json', 'w') as f:
        json.dump(batch_1, f, indent=2)
    with open(output_dir / 'batch_2.json', 'w') as f:
        json.dump(batch_2, f, indent=2)
    with open(output_dir / 'batch_3.json', 'w') as f:
        json.dump(batch_3, f, indent=2)
    with open(output_dir / 'output_template.json', 'w') as f:
        json.dump(output, f, indent=2)

    print(f"\nResults:")
    print(f"  Batch 1: {len(batch_1)} events")
    print(f"  Batch 2: {len(batch_2)} events")
    print(f"  Batch 3: {len(batch_3)} events")
    print(f"  Skipped: {output['summary']['skipped_placeholder_or_openmic']}")
    print(f"  Failed: {output['summary']['failed']}")
    print(f"  Total to create: {output['summary']['created_new']}")
    print(f"\nFiles saved to {output_dir}")

if __name__ == '__main__':
    main()
