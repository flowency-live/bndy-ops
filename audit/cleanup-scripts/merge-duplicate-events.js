/**
 * Merge Duplicate Events (9 clusters)
 * Same venue + artist + date = keep older, delete newer
 */

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });
const fs = require('fs');

async function deleteEvent(eventId) {
  await dynamodb.delete({
    TableName: 'bndy-events',
    Key: { id: eventId }
  }).promise();
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  Merge Duplicate Events (9 clusters)                     ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  const duplicates = JSON.parse(fs.readFileSync(
    'C:/Users/jason/Documents/Claude/Projects/bndy/audit/event-duplicates.json',
    'utf8'
  ));

  const results = { total: duplicates.length, merged: 0, failed: 0 };

  for (const cluster of duplicates) {
    console.log(`\nMerging: ${cluster.events[0].title || '(no title)'}`);
    console.log(`Natural Key: ${cluster.naturalKey}`);
    console.log(`Count: ${cluster.count} events`);

    // Keep first (older), delete rest
    const [keeper, ...toDelete] = cluster.events;
    console.log(`  KEEP: ${keeper.id}`);

    for (const event of toDelete) {
      try {
        await deleteEvent(event.id);
        console.log(`  ✓ Deleted: ${event.id}`);
        results.merged++;
      } catch (error) {
        console.error(`  ✗ Failed: ${event.id} - ${error.message}`);
        results.failed++;
      }
    }
  }

  console.log(`\n${'═'.repeat(60)}`);
  console.log('MERGE REPORT');
  console.log(`${'═'.repeat(60)}`);
  console.log(`Duplicate clusters: ${results.total}`);
  console.log(`Events deleted:     ${results.merged}`);
  console.log(`Failed:             ${results.failed}`);
  console.log('');
  console.log(`After orphan deletion: Events should be ~3,328`);
  console.log(`After merge:          Events should be ~${3328 - results.merged}`);
}

main().catch(console.error);
