/**
 * Delete Solo Artists (except Danny Brab and Rachel Shenton)
 *
 * Removes all solo artist records and their events from the database.
 * Keeps only Danny Brab and Rachel Shenton as requested.
 * Reduces backfill processing and focuses on bands/groups.
 *
 * Date: 2026-07-27
 */

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });

const ARTISTS_TABLE = 'bndy-artists';
const EVENTS_TABLE = 'bndy-events';

// Artists to keep (solo singers we want to preserve)
const KEEP_ARTISTS = ['Danny Brab', 'Rachel Shenton'];

async function scanAllArtists() {
  const items = [];
  let lastEvaluatedKey = null;

  do {
    const params = {
      TableName: ARTISTS_TABLE,
      ExclusiveStartKey: lastEvaluatedKey
    };

    const result = await dynamodb.scan(params).promise();
    items.push(...result.Items);
    lastEvaluatedKey = result.LastEvaluatedKey;

    console.log(`Scanned ${items.length} artists so far...`);
  } while (lastEvaluatedKey);

  return items;
}

function isSoloArtist(artist) {
  // Check artist_type field
  if (artist.artist_type === 'solo' || artist.artist_type === 'singer') {
    return true;
  }

  // Check actType field (might be 'solo', 'acoustic solo', etc.)
  if (artist.actType && typeof artist.actType === 'string' && artist.actType.toLowerCase().includes('solo')) {
    return true;
  }

  // If not explicitly marked, return false (default to keeping)
  return false;
}

async function getArtistEvents(artistId) {
  const items = [];
  let lastEvaluatedKey = null;

  do {
    const params = {
      TableName: EVENTS_TABLE,
      IndexName: 'artistId-date-index',
      KeyConditionExpression: 'artistId = :artistId',
      ExpressionAttributeValues: { ':artistId': artistId },
      ExclusiveStartKey: lastEvaluatedKey
    };

    const result = await dynamodb.query(params).promise();
    items.push(...result.Items);
    lastEvaluatedKey = result.LastEvaluatedKey;
  } while (lastEvaluatedKey);

  return items;
}

async function deleteEvent(eventId) {
  await dynamodb.delete({
    TableName: EVENTS_TABLE,
    Key: { id: eventId }
  }).promise();
}

async function deleteArtist(artistId) {
  await dynamodb.delete({
    TableName: ARTISTS_TABLE,
    Key: { id: artistId }
  }).promise();
}

async function main() {
  console.log(`Solo Artist Cleanup`);
  console.log(`===================\n`);
  console.log(`Keeping: ${KEEP_ARTISTS.join(', ')}`);
  console.log(`Deleting: All other solo artists + their events\n`);

  // 1. Get all artists
  console.log('Step 1: Scanning all artists...\n');
  const allArtists = await scanAllArtists();
  console.log(`Total artists: ${allArtists.length}\n`);

  // 2. Filter for solo artists (excluding keepers)
  const soloArtists = allArtists.filter(artist => {
    // Skip if in keep list
    if (KEEP_ARTISTS.includes(artist.name)) {
      return false;
    }
    return isSoloArtist(artist);
  });

  console.log(`Found ${soloArtists.length} solo artists to delete\n`);

  // 3. Process each solo artist
  let artistsDeleted = 0;
  let eventsDeleted = 0;
  const errors = [];

  for (const artist of soloArtists) {
    try {
      console.log(`Processing: ${artist.name} (${artist.id})`);
      console.log(`  Type: ${artist.artist_type || 'unknown'}, Act: ${artist.actType || 'none'}`);

      // Get and delete all events for this artist
      const events = await getArtistEvents(artist.id);
      console.log(`  Found ${events.length} events`);

      for (const event of events) {
        await deleteEvent(event.id);
        eventsDeleted++;
      }

      // Delete the artist
      await deleteArtist(artist.id);
      artistsDeleted++;
      console.log(`  ✅ Deleted artist + ${events.length} events\n`);

    } catch (error) {
      console.error(`  ❌ ERROR: ${error.message}\n`);
      errors.push({ artist: artist.name, error: error.message });
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Artists deleted: ${artistsDeleted}/${soloArtists.length}`);
  console.log(`Events deleted: ${eventsDeleted}`);
  console.log(`Errors: ${errors.length}`);

  if (errors.length > 0) {
    console.log(`\nErrors:`);
    errors.forEach(e => console.log(`  ${e.artist}: ${e.error}`));
  }

  // 4. Verify keepers are still there
  console.log(`\nVerifying kept artists:`);
  for (const keepName of KEEP_ARTISTS) {
    const kept = allArtists.find(a => a.name === keepName);
    if (kept && isSoloArtist(kept)) {
      console.log(`  ✅ ${keepName} - preserved`);
    }
  }
}

// Dry-run mode
const DRY_RUN = process.argv.includes('--execute') ? false : true;

if (DRY_RUN) {
  console.log('🔍 DRY RUN MODE - No deletions will be performed');
  console.log('Run with --execute to perform actual deletions\n');

  (async () => {
    const allArtists = await scanAllArtists();
    const soloArtists = allArtists.filter(artist => {
      if (KEEP_ARTISTS.includes(artist.name)) return false;
      return isSoloArtist(artist);
    });

    console.log(`\nWould delete ${soloArtists.length} solo artists:`);
    console.log(`Sample (first 10):`);
    soloArtists.slice(0, 10).forEach(a => {
      console.log(`  - ${a.name} (${a.artist_type || 'unknown'})`);
    });

    if (soloArtists.length > 10) {
      console.log(`  ... and ${soloArtists.length - 10} more`);
    }

    const keepArtists = allArtists.filter(a => KEEP_ARTISTS.includes(a.name) && isSoloArtist(a));
    console.log(`\nWould keep ${keepArtists.length} solo artists:`);
    keepArtists.forEach(a => console.log(`  - ${a.name}`));
  })().catch(console.error);
} else {
  main().catch(console.error);
}
