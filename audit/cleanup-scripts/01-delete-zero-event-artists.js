/**
 * Delete Zero-Event Artists
 *
 * Deletes 28 artists that have never had an event listed in bndy.
 * All are from mcp_ai_import source, created in July 2026.
 * Safe to delete - no data loss, no events reference these artists.
 *
 * Source: cleanup-lists-2026-07-27.json
 */

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });

const ARTISTS_TABLE = 'bndy-artists';
const EVENTS_TABLE = 'bndy-events';

// IDs from cleanup-lists-2026-07-27.json
const ZERO_EVENT_ARTIST_IDS = [
  "3df91a2c-5841-4a6f-abfe-6845a4db2e1a",
  "8dd59e5f-9082-4f82-9cf3-c5b77b84f05d",
  "7eba42e0-3bd1-455f-957e-2a3e3d2068a8",
  "f4d1a4ba-f85e-4834-a997-baa116030d5d",
  "c1da8d55-3f85-4958-a9f1-3f79f412cdf6",
  "fa310697-95d1-4cbf-8163-16c66fd092bf",
  "6613b6e9-bf3f-4401-8efd-35487f6ac0d5",
  "c90e4f14-f96b-4ec7-83ea-83d94d8acee1",
  "8dc7855e-e880-437f-a5ab-984e584f5191",
  "e1a3e37a-2d76-45b4-932e-acda30f4fe82",
  "c333bbfb-38b1-4481-9768-bf75cb653ad8",
  "cd782942-f8a7-478e-9502-2974cef03ddf",
  "9e7c81a8-c53a-4d3d-a33f-0d43064a495f",
  "5b1c63a7-e11d-4ccf-8795-94ab8653e444",
  "4ac2abdf-d825-432a-8024-5e556e3dd1ac",
  "573290e5-7a15-4c27-9bee-bd17436b15af",
  "a145f51c-700e-42eb-88b5-3b76d6428a98",
  "3f413663-b4a8-4952-8309-2ed6163134cd",
  "0680a88c-54c5-4d03-b798-705d42bd3d13",
  "0ec74a04-6177-492c-9cf2-584eb2436843",
  "557b8949-9bbf-4fa3-8eae-0f0dd675c2ee",
  "a92c706a-f0cf-4684-920a-8fcf232ed712",
  "2577824a-f188-45c2-8cd5-ffada271b81a",
  "eade84c1-475b-455d-b226-a581833d835d",
  "911b76b6-c2f4-4be5-9f88-475351f969d3",
  "be7355ed-f45e-465c-8e82-b3fa8e162472",
  "ac86423e-290a-4f73-b8c1-becb84e2c468",
  "0e9a38a4-64af-4975-9020-ff08e9293d42"
];

async function verifyNoEvents(artistId) {
  const result = await dynamodb.query({
    TableName: EVENTS_TABLE,
    IndexName: 'artistId-date-index',
    KeyConditionExpression: 'artistId = :artistId',
    ExpressionAttributeValues: { ':artistId': artistId },
    Limit: 1,
    Select: 'COUNT'
  }).promise();

  return result.Count === 0;
}

async function deleteArtist(artistId) {
  await dynamodb.delete({
    TableName: ARTISTS_TABLE,
    Key: { id: artistId }
  }).promise();
}

async function main() {
  console.log(`Zero-Event Artist Cleanup`);
  console.log(`========================\n`);
  console.log(`Target: ${ZERO_EVENT_ARTIST_IDS.length} artists\n`);

  let deleted = 0;
  let skipped = 0;
  const errors = [];

  for (const artistId of ZERO_EVENT_ARTIST_IDS) {
    try {
      // Double-check artist has no events
      const hasNoEvents = await verifyNoEvents(artistId);

      if (!hasNoEvents) {
        console.log(`⚠️  SKIP ${artistId} - has events (safety check)`);
        skipped++;
        continue;
      }

      // Delete artist
      await deleteArtist(artistId);
      console.log(`✅ DELETED ${artistId}`);
      deleted++;

    } catch (error) {
      console.error(`❌ ERROR ${artistId}: ${error.message}`);
      errors.push({ artistId, error: error.message });
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Deleted: ${deleted}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Errors: ${errors.length}`);

  if (errors.length > 0) {
    console.log(`\nErrors:`);
    errors.forEach(e => console.log(`  ${e.artistId}: ${e.error}`));
  }
}

// Dry-run mode
const DRY_RUN = process.argv.includes('--execute') ? false : true;

if (DRY_RUN) {
  console.log('🔍 DRY RUN MODE - No deletions will be performed');
  console.log('Run with --execute to perform actual deletions\n');
  console.log(`Would delete ${ZERO_EVENT_ARTIST_IDS.length} zero-event artists\n`);
} else {
  main().catch(console.error);
}
