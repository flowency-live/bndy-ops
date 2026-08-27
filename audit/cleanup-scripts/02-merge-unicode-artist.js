/**
 * Merge Unicode Artist → Searchable Name
 *
 * Merges unsearchable "ÜL†RᛟɣᛨɸLE†" artist into searchable "Ultraviolet" artist.
 * Updates all events to reference the kept record.
 * Adds stylized name to aliases array.
 *
 * Source: cleanup-lists-2026-07-27.json
 */

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });

const ARTISTS_TABLE = 'bndy-artists';
const EVENTS_TABLE = 'bndy-events';

const DELETE_ID = "87f59213-c6fc-42de-a720-657bf443c539"; // ÜL†RᛟɣᛨɸLE†
const KEEP_ID = "30c4ade9-64f3-4ed2-a792-17cb157b4288";   // Ultraviolet

async function getArtist(artistId) {
  const result = await dynamodb.get({
    TableName: ARTISTS_TABLE,
    Key: { id: artistId }
  }).promise();
  return result.Item;
}

async function getArtistEvents(artistId) {
  const result = await dynamodb.query({
    TableName: EVENTS_TABLE,
    IndexName: 'artistId-date-index',
    KeyConditionExpression: 'artistId = :artistId',
    ExpressionAttributeValues: { ':artistId': artistId }
  }).promise();
  return result.Items || [];
}

async function updateEvent(eventId, newArtistId) {
  await dynamodb.update({
    TableName: EVENTS_TABLE,
    Key: { id: eventId },
    UpdateExpression: 'SET artistId = :artistId',
    ExpressionAttributeValues: { ':artistId': newArtistId }
  }).promise();
}

async function addAliasToArtist(artistId, alias) {
  await dynamodb.update({
    TableName: ARTISTS_TABLE,
    Key: { id: artistId },
    UpdateExpression: 'SET aliases = list_append(if_not_exists(aliases, :empty_list), :alias)',
    ExpressionAttributeValues: {
      ':alias': [alias],
      ':empty_list': []
    }
  }).promise();
}

async function deleteArtist(artistId) {
  await dynamodb.delete({
    TableName: ARTISTS_TABLE,
    Key: { id: artistId }
  }).promise();
}

async function main() {
  console.log(`Unicode Artist Merge`);
  console.log(`===================\n`);

  // 1. Get both artists
  const badArtist = await getArtist(DELETE_ID);
  const goodArtist = await getArtist(KEEP_ID);

  if (!badArtist) {
    console.log(`❌ Delete artist not found: ${DELETE_ID}`);
    return;
  }

  if (!goodArtist) {
    console.log(`❌ Keep artist not found: ${KEEP_ID}`);
    return;
  }

  console.log(`DELETE: ${badArtist.name} (${DELETE_ID})`);
  console.log(`KEEP:   ${goodArtist.name} (${KEEP_ID})\n`);

  // 2. Get events for bad artist
  const events = await getArtistEvents(DELETE_ID);
  console.log(`Found ${events.length} events to migrate\n`);

  if (events.length === 0) {
    console.log(`⚠️  No events to migrate - artist has no events`);
  } else {
    // 3. Update each event
    for (const event of events) {
      console.log(`  Migrating event: ${event.id} (${event.title || event.date})`);
      await updateEvent(event.id, KEEP_ID);
    }
    console.log(`✅ Migrated ${events.length} events\n`);
  }

  // 4. Add stylized name as alias to kept artist
  console.log(`Adding "${badArtist.name}" as alias to "${goodArtist.name}"`);
  await addAliasToArtist(KEEP_ID, badArtist.name);
  console.log(`✅ Alias added\n`);

  // 5. Delete bad artist
  console.log(`Deleting artist: ${badArtist.name} (${DELETE_ID})`);
  await deleteArtist(DELETE_ID);
  console.log(`✅ Artist deleted\n`);

  console.log(`=== Merge Complete ===`);
  console.log(`Kept: ${goodArtist.name} (${KEEP_ID})`);
  console.log(`Events migrated: ${events.length}`);
  console.log(`Alias added: "${badArtist.name}"`);
}

// Dry-run mode
const DRY_RUN = process.argv.includes('--execute') ? false : true;

if (DRY_RUN) {
  console.log('🔍 DRY RUN MODE - No changes will be made');
  console.log('Run with --execute to perform actual merge\n');

  (async () => {
    const badArtist = await getArtist(DELETE_ID);
    const goodArtist = await getArtist(KEEP_ID);
    const events = await getArtistEvents(DELETE_ID);

    if (badArtist && goodArtist) {
      console.log(`Would merge:`);
      console.log(`  DELETE: ${badArtist.name} (${DELETE_ID})`);
      console.log(`  KEEP:   ${goodArtist.name} (${KEEP_ID})`);
      console.log(`  Events to migrate: ${events.length}`);
    } else {
      console.log(`⚠️  Missing artist records - cannot merge`);
    }
  })().catch(console.error);
} else {
  main().catch(console.error);
}
