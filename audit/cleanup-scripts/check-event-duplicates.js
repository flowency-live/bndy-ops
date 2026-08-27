/**
 * Check for Event Natural-Key Duplicates
 *
 * Events are unique by naturalKey = sha1(venueId | artistId | date)
 * Per identity.js lines 275-283, this is computed not stored.
 */

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });

const { eventNaturalKey } = require('C:/VSProjects/bndy-serverless-api/shared/identity/identity');

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

    if (items.length % 500 === 0) {
      console.log(`Scanned ${items.length} events...`);
    }
  } while (lastKey);

  return items;
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  Check Event Natural-Key Duplicates                      ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log('Scanning all events...\n');
  const events = await scanAllEvents();
  console.log(`\nTotal events: ${events.length}\n`);

  // Compute natural keys and group by key
  const keyMap = new Map();

  for (const event of events) {
    if (!event.venueId || !event.artistId || !event.date) {
      console.log(`⚠️  Event missing required fields: ${event.id}`);
      continue;
    }

    try {
      const naturalKey = eventNaturalKey(event.venueId, event.artistId, event.date);

      if (!keyMap.has(naturalKey)) {
        keyMap.set(naturalKey, []);
      }
      keyMap.get(naturalKey).push(event);
    } catch (error) {
      console.log(`⚠️  Error computing key for event ${event.id}: ${error.message}`);
    }
  }

  // Find duplicates
  const duplicates = [];
  for (const [key, eventList] of keyMap.entries()) {
    if (eventList.length > 1) {
      duplicates.push({
        naturalKey: key,
        count: eventList.length,
        events: eventList.map(e => ({
          id: e.id,
          title: e.title,
          venueId: e.venueId,
          artistId: e.artistId,
          date: e.date,
          created: e.created_at
        }))
      });
    }
  }

  console.log('═'.repeat(80));
  console.log('DUPLICATE CHECK RESULTS');
  console.log('═'.repeat(80));
  console.log(`Total events:           ${events.length}`);
  console.log(`Unique natural keys:    ${keyMap.size}`);
  console.log(`Duplicate clusters:     ${duplicates.length}`);
  console.log('');

  if (duplicates.length === 0) {
    console.log('✅ ZERO event duplicates - ready for sentinel backfill!');
  } else {
    console.log('⚠️  Event duplicates found:\n');
    for (const dup of duplicates) {
      console.log(`Natural Key: ${dup.naturalKey}`);
      console.log(`Count: ${dup.count} events\n`);
      for (const event of dup.events) {
        console.log(`  - ${event.title || '(no title)'}`);
        console.log(`    ID: ${event.id}`);
        console.log(`    Venue: ${event.venueId}`);
        console.log(`    Artist: ${event.artistId}`);
        console.log(`    Date: ${event.date}`);
        console.log(`    Created: ${event.created}`);
        console.log('');
      }
    }

    // Export for merge script
    const fs = require('fs');
    const exportPath = 'C:/Users/jason/Documents/Claude/Projects/bndy/audit/event-duplicates.json';
    fs.writeFileSync(exportPath, JSON.stringify(duplicates, null, 2));
    console.log(`Duplicates exported: ${exportPath}`);
  }
}

main().catch(console.error);
