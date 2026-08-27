#!/usr/bin/env python3
"""
Process 294 events from normalized onthecasemusic data.
Output: JSON with all 289 events to create (5 skipped).
"""

import json
from pathlib import Path

# Configuration
STATE_FILE = Path(r'C:\VSProjects\AllProjectsMD\bndy\10-Projects\bndy-population\data\state\onthecasemusic.json')
EVENTS_FILE = Path(r'C:\VSProjects\AllProjectsMD\bndy\10-Projects\bndy-population\data\normalized\onthecasemusic\2026-04-27\events.json')

# Variant ID overrides
VARIANT_OVERRIDES = {
    "490": "0526e7a2-1185-41c9-af22-a29f90108299",    # Russ Tippins Electric Band -> Russ Tippins
    "28950": "e9e0b454-daf9-4044-a0d1-5f508eb87abf",  # Dogs In A Box Duo -> Dog In A Box
    "31098": "1382449f-bb3c-443c-8458-0bc00531ad0c",  # Rock and Roll Preachers (alias of 1348)
}

# Skip IDs and reasons
SKIP_IDS = {
    "27": "placeholder",    # 4 events
    "30015": "open_mic",    # 1 event
}

def main():
    # Load state
    with open(STATE_FILE) as f:
        state = json.load(f)

    # Load events
    with open(EVENTS_FILE) as f:
        events = json.load(f)

    print(f"Processing {len(events)} events...")

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

    api_calls = []

    for event in events:
        ext_id = event.get('external_id')
        artist_ext_id = event.get('artist_external_id')
        venue_ext_id = event.get('venue_external_id')

        # SKIP: placeholder or open mic
        if artist_ext_id in SKIP_IDS:
            reason = SKIP_IDS[artist_ext_id]
            output['skipped'].append({
                "external_id": ext_id,
                "name": event.get('name'),
                "reason": reason,
            })
            output['summary']['skipped_placeholder_or_openmic'] += 1
            continue

        # RESOLVE: artist UUID
        if artist_ext_id in VARIANT_OVERRIDES:
            artist_id = VARIANT_OVERRIDES[artist_ext_id]
        else:
            artist_info = state['artists'].get(artist_ext_id)
            if not artist_info or 'bndy_id' not in artist_info:
                output['failed'].append({
                    "external_id": ext_id,
                    "error": f"Artist {artist_ext_id} not found or no bndy_id",
                })
                output['summary']['failed'] += 1
                continue
            artist_id = artist_info['bndy_id']

        # RESOLVE: venue UUID
        venue_info = state['venues'].get(venue_ext_id)
        if not venue_info or 'bndy_id' not in venue_info:
            output['failed'].append({
                "external_id": ext_id,
                "error": f"Venue {venue_ext_id} not found or no bndy_id",
            })
            output['summary']['failed'] += 1
            continue
        venue_id = venue_info['bndy_id']

        # BUILD: create_event call
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
            "isPublic": True,  # CRITICAL
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

        api_calls.append({
            "external_id": ext_id,
            "call": call,
        })

        output['events'][ext_id] = {
            "bndy_id": None,
            "operation": "create",
            "is_public_set": True,
        }
        output['summary']['created_new'] += 1

    print(f"\nResults:")
    print(f"  Skipped: {output['summary']['skipped_placeholder_or_openmic']}")
    print(f"  To create: {output['summary']['created_new']}")
    print(f"  Failed: {output['summary']['failed']}")

    # Save outputs
    out_path = Path(r'C:\Users\jason\AppData\Roaming\Claude\local-agent-mode-sessions\e137f721-cf4a-45fc-be80-35fff477ad5f\b242da0e-22b2-4ff6-a9be-4f562903ec94\local_b23872fd-5aa3-4478-9e63-ed74cf9f81b7\outputs')

    with open(out_path / 'api_calls.json', 'w') as f:
        json.dump(api_calls, f, indent=2)

    with open(out_path / 'output_template.json', 'w') as f:
        json.dump(output, f, indent=2)

    print(f"\nSaved {len(api_calls)} API calls")
    print(f"Output files:")
    print(f"  - {out_path / 'api_calls.json'}")
    print(f"  - {out_path / 'output_template.json'}")

if __name__ == '__main__':
    main()
