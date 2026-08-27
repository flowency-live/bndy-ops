/**
 * Backfill Sentinels (Final Step Before Enforce Mode)
 *
 * Generate sentinel records in bndy-unique-keys for:
 * - 1,233 artists (using artistUniqueKey)
 * - All venues (using venuePlaceKey)
 * - 3,328 events (using eventUniqueKeys)
 *
 * Collision handling: Log and skip (should be zero after cleanup)
 */

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });

const {
  artistUniqueKey,
  venuePlaceKey,
  eventUniqueKeys
} = require('C:/VSProjects/bndy-serverless-api/shared/identity/identity');

const TABLES = {
  artists: 'bndy-artists',
  venues: 'bndy-venues',
  events: 'bndy-events',
  sentinels: 'bndy-unique-keys'
};

// Scan helper
async function scanTable(tableName) {
  const items = [];
  let lastKey = null;

  do {
    const result = await dynamodb.scan({
      TableName: tableName,
      ExclusiveStartKey: lastKey
    }).promise();

    items.push(...result.Items);
    lastKey = result.LastEvaluatedKey;

    if (items.length % 500 === 0) {
      process.stdout.write(`\r  Scanned ${items.length}...`);
    }
  } while (lastKey);

  console.log(`\r  Scanned ${items.length} total`);
  return items;
}

// Check if sentinel exists
async function sentinelExists(key) {
  const result = await dynamodb.get({
    TableName: TABLES.sentinels,
    Key: { key }
  }).promise();

  return result.Item;
}

// Write sentinel
async function writeSentinel(key, refId, entityType) {
  await dynamodb.put({
    TableName: TABLES.sentinels,
    Item: {
      key,
      refId,
      entityType,
      createdAt: new Date().toISOString(),
      source: 'backfill'
    }
  }).promise();
}

// === ARTIST BACKFILL ===
async function backfillArtists() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  Backfill Artist Sentinels                                ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log('Scanning artists...');
  const artists = await scanTable(TABLES.artists);

  const results = {
    total: artists.length,
    keys: 0,
    written: 0,
    collisions: 0,
    skipped: 0,
    errors: []
  };

  for (const artist of artists) {
    try {
      // Generate unique key
      const key = artistUniqueKey(artist.name, artist.location);

      if (!key) {
        // Unresolvable location
        results.skipped++;
        continue;
      }

      results.keys++;

      const existing = await sentinelExists(key);

      if (existing) {
        if (existing.refId !== artist.id) {
          // Collision with different artist
          console.log(`\n⚠️  COLLISION: ${key}`);
          console.log(`    Existing: ${existing.refId}`);
          console.log(`    Attempted: ${artist.id} (${artist.name})`);
          results.collisions++;
        } else {
          // Already exists for this artist (idempotent)
          results.skipped++;
        }
      } else {
        // Write new sentinel
        await writeSentinel(key, artist.id, 'artist');
        results.written++;
      }

      if ((results.written + results.skipped) % 100 === 0) {
        process.stdout.write(`\r  Processed ${results.written + results.skipped}/${artists.length} artists...`);
      }
    } catch (error) {
      results.errors.push({
        id: artist.id,
        name: artist.name,
        error: error.message
      });
      console.error(`\n✗ Failed: ${artist.name} (${artist.id}) - ${error.message}`);
    }
  }

  console.log('\n');
  return results;
}

// === VENUE BACKFILL ===
async function backfillVenues() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  Backfill Venue Sentinels                                 ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log('Scanning venues...');
  const venues = await scanTable(TABLES.venues);

  const results = {
    total: venues.length,
    written: 0,
    collisions: 0,
    skipped: 0,
    missingPlaceId: 0,
    errors: []
  };

  for (const venue of venues) {
    try {
      const placeId = venue.place_id || venue.googlePlaceId || venue.google_place_id;

      if (!placeId) {
        results.missingPlaceId++;
        console.log(`\n⚠️  Missing place_id: ${venue.name} (${venue.id})`);
        continue;
      }

      const key = venuePlaceKey(placeId);
      const existing = await sentinelExists(key);

      if (existing) {
        if (existing.refId !== venue.id) {
          // Collision with different venue
          console.log(`\n⚠️  COLLISION: ${key}`);
          console.log(`    Existing: ${existing.refId}`);
          console.log(`    Attempted: ${venue.id} (${venue.name})`);
          results.collisions++;
        } else {
          // Already exists for this venue (idempotent)
          results.skipped++;
        }
      } else {
        // Write new sentinel
        await writeSentinel(key, venue.id, 'venue');
        results.written++;
      }

      if ((results.written + results.skipped) % 50 === 0) {
        process.stdout.write(`\r  Processed ${results.written + results.skipped}/${venues.length} venues...`);
      }
    } catch (error) {
      results.errors.push({
        id: venue.id,
        name: venue.name,
        error: error.message
      });
      console.error(`\n✗ Failed: ${venue.name} (${venue.id}) - ${error.message}`);
    }
  }

  console.log('\n');
  return results;
}

// === EVENT BACKFILL ===
async function backfillEvents() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  Backfill Event Sentinels                                 ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log('Scanning events...');
  const events = await scanTable(TABLES.events);

  const results = {
    total: events.length,
    keys: 0,
    written: 0,
    collisions: 0,
    skipped: 0,
    missingFields: 0,
    errors: []
  };

  for (const event of events) {
    try {
      if (!event.venueId || !event.date) {
        results.missingFields++;
        console.log(`\n⚠️  Missing required fields: ${event.id}`);
        continue;
      }

      // Generate unique keys (natural key + collab keys)
      const keys = eventUniqueKeys(event);

      if (!keys || keys.length === 0) {
        results.missingFields++;
        console.log(`\n⚠️  No keys generated: ${event.id}`);
        continue;
      }

      results.keys += keys.length;

      // Write each sentinel
      for (const key of keys) {
        const existing = await sentinelExists(key);

        if (existing) {
          if (existing.refId !== event.id) {
            // Collision with different event
            console.log(`\n⚠️  COLLISION: ${key}`);
            console.log(`    Existing: ${existing.refId}`);
            console.log(`    Attempted: ${event.id}`);
            results.collisions++;
          } else {
            // Already exists for this event (idempotent)
            results.skipped++;
          }
        } else {
          // Write new sentinel
          await writeSentinel(key, event.id, 'event');
          results.written++;
        }
      }

      if ((results.written + results.skipped) % 100 === 0) {
        process.stdout.write(`\r  Processed ${results.written + results.skipped} keys...`);
      }
    } catch (error) {
      results.errors.push({
        id: event.id,
        error: error.message
      });
      console.error(`\n✗ Failed: ${event.id} - ${error.message}`);
    }
  }

  console.log('\n');
  return results;
}

// === MAIN ===
async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  SENTINEL BACKFILL (Final Step Before Enforce Mode)      ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  const artistResults = await backfillArtists();
  const venueResults = await backfillVenues();
  const eventResults = await backfillEvents();

  // Final report
  console.log('═'.repeat(60));
  console.log('SENTINEL BACKFILL COMPLETE');
  console.log('═'.repeat(60));
  console.log('\n📊 ARTISTS');
  console.log(`   Total artists:    ${artistResults.total}`);
  console.log(`   Keys generated:   ${artistResults.keys}`);
  console.log(`   Sentinels written: ${artistResults.written}`);
  console.log(`   Already existed:  ${artistResults.skipped}`);
  console.log(`   Collisions:       ${artistResults.collisions} ${artistResults.collisions > 0 ? '⚠️' : '✅'}`);
  console.log(`   Errors:           ${artistResults.errors.length}`);

  console.log('\n📍 VENUES');
  console.log(`   Total venues:     ${venueResults.total}`);
  console.log(`   Sentinels written: ${venueResults.written}`);
  console.log(`   Already existed:  ${venueResults.skipped}`);
  console.log(`   Collisions:       ${venueResults.collisions} ${venueResults.collisions > 0 ? '⚠️' : '✅'}`);
  console.log(`   Missing place_id: ${venueResults.missingPlaceId}`);
  console.log(`   Errors:           ${venueResults.errors.length}`);

  console.log('\n🎫 EVENTS');
  console.log(`   Total events:     ${eventResults.total}`);
  console.log(`   Keys generated:   ${eventResults.keys}`);
  console.log(`   Sentinels written: ${eventResults.written}`);
  console.log(`   Already existed:  ${eventResults.skipped}`);
  console.log(`   Collisions:       ${eventResults.collisions} ${eventResults.collisions > 0 ? '⚠️' : '✅'}`);
  console.log(`   Missing fields:   ${eventResults.missingFields}`);
  console.log(`   Errors:           ${eventResults.errors.length}`);

  console.log('\n' + '═'.repeat(60));

  const totalCollisions = artistResults.collisions + venueResults.collisions + eventResults.collisions;
  const totalErrors = artistResults.errors.length + venueResults.errors.length + eventResults.errors.length;

  if (totalCollisions === 0 && totalErrors === 0) {
    console.log('✅ SENTINEL BACKFILL SUCCESSFUL');
    console.log('   Zero collisions detected');
    console.log('   Ready to enable GATE_MODE=enforce');
  } else {
    console.log('⚠️  REVIEW REQUIRED');
    if (totalCollisions > 0) {
      console.log(`   ${totalCollisions} collisions detected - investigate before enforce mode`);
    }
    if (totalErrors > 0) {
      console.log(`   ${totalErrors} errors occurred - review logs`);
    }
  }

  console.log('');
}

main().catch(console.error);
