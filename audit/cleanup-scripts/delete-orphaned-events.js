/**
 * Delete Orphaned Events (192)
 * Events missing venueId, artistId, or date (likely from deleted artists)
 */

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });

async function scanAllEvents() {
  const items = [];
  let lastKey = null;

  do {
    const result = await dynamodb.scan({
      TableName: 'bndy-events',
      ExclusiveStartKey: lastKey
    }).promise();

    items.push(...result.Items);
    lastKey = result.LastEvaluatedKey;
  } while (lastKey);

  return items;
}

async function deleteEvent(eventId) {
  await dynamodb.delete({
    TableName: 'bndy-events',
    Key: { id: eventId }
  }).promise();
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  Delete Orphaned Events (192)                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log('Scanning events...\n');
  const events = await scanAllEvents();

  const orphaned = events.filter(e => !e.venueId || !e.artistId || !e.date);
  console.log(`Found ${orphaned.length} orphaned events\n`);

  const results = { total: orphaned.length, deleted: 0, failed: 0 };

  for (const event of orphaned) {
    try {
      await deleteEvent(event.id);
      results.deleted++;
      if (results.deleted % 50 === 0) {
        console.log(`Deleted ${results.deleted}/${orphaned.length}...`);
      }
    } catch (error) {
      results.failed++;
      console.error(`✗ Failed: ${event.id} - ${error.message}`);
    }
  }

  console.log(`\n${'═'.repeat(60)}`);
  console.log('DELETION REPORT');
  console.log(`${'═'.repeat(60)}`);
  console.log(`Total:    ${results.total}`);
  console.log(`Deleted:  ${results.deleted}`);
  console.log(`Failed:   ${results.failed}`);
  console.log('');
  console.log(`Events: 3,520 → ${3520 - results.deleted}`);
}

main().catch(console.error);
