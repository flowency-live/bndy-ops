/**
 * Merge Final 2 Duplicates (Before Enforce Mode)
 *
 * 1. Artist: "Walters & Bligh - Acoustic Duo" → "Walters & Bligh"
 * 2. Event: "The VANZ ROXX" (single) → "Bushtonbury Day 2" (multi-artist lineup)
 */

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });

const DUPLICATES = {
  artist: {
    keeper: { id: 'f0e4328e-9f79-4e54-baf0-2374db1869f5', name: 'Walters & Bligh', created: '2026-05-01' },
    duplicate: { id: 'bf4c443a-6478-4222-8268-483668b67585', name: 'Walters & Bligh - Acoustic Duo', created: '2026-07-11' }
  },
  event: {
    keeper: { id: 'f40fccde-d448-4514-8bc4-6cb7f52cc6d8', title: 'Bushtonbury Day 2 (multi-artist)' },
    duplicate: { id: '7c8b3729-9400-42f8-ad07-6d00e32dada7', title: 'The VANZ ROXX (single artist)' }
  }
};

async function queryEventsByArtist(artistId) {
  const result = await dynamodb.query({
    TableName: 'bndy-events',
    IndexName: 'artistId-date-index',
    KeyConditionExpression: 'artistId = :artistId',
    ExpressionAttributeValues: { ':artistId': artistId }
  }).promise();
  return result.Items;
}

async function updateEvent(eventId, updates) {
  const updateExpr = Object.keys(updates)
    .map((k, i) => `#field${i} = :val${i}`)
    .join(', ');

  const attrNames = Object.keys(updates).reduce((acc, k, i) => {
    acc[`#field${i}`] = k;
    return acc;
  }, {});

  const attrValues = Object.keys(updates).reduce((acc, k, i) => {
    acc[`:val${i}`] = updates[k];
    return acc;
  }, {});

  await dynamodb.update({
    TableName: 'bndy-events',
    Key: { id: eventId },
    UpdateExpression: `SET ${updateExpr}`,
    ExpressionAttributeNames: attrNames,
    ExpressionAttributeValues: attrValues
  }).promise();
}

async function deleteRecord(tableName, id) {
  await dynamodb.delete({
    TableName: tableName,
    Key: { id }
  }).promise();
}

async function getRecord(tableName, id) {
  const result = await dynamodb.get({
    TableName: tableName,
    Key: { id }
  }).promise();
  return result.Item;
}

async function getSentinel(key) {
  const result = await dynamodb.get({
    TableName: 'bndy-unique-keys',
    Key: { key }
  }).promise();
  return result.Item;
}

// === ARTIST MERGE ===
async function mergeArtist() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  Merge Artist Duplicate                                   ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  const { keeper, duplicate } = DUPLICATES.artist;

  console.log(`Keeper:    ${keeper.name} (${keeper.id})`);
  console.log(`Duplicate: ${duplicate.name} (${duplicate.id})\n`);

  // 1. Find events referencing duplicate artist
  console.log('Querying events for duplicate artist...');
  const events = await queryEventsByArtist(duplicate.id);
  console.log(`Found ${events.length} events\n`);

  if (events.length > 0) {
    // 2. Repoint events to keeper
    console.log('Repointing events to keeper artist...');
    for (const event of events) {
      await updateEvent(event.id, { artistId: keeper.id });
      console.log(`  ✓ Repointed: ${event.title || event.id}`);
    }

    // 3. Verify repoint
    console.log('\nVerifying repoint by re-reading...');
    for (const event of events) {
      const updated = await getRecord('bndy-events', event.id);
      if (updated.artistId !== keeper.id) {
        throw new Error(`Repoint verification FAILED for event ${event.id}`);
      }
    }
    console.log('✓ All events verified pointing to keeper\n');
  }

  // 4. Delete duplicate artist
  console.log('Deleting duplicate artist...');
  await deleteRecord('bndy-artists', duplicate.id);

  // 5. Verify deletion
  const deleted = await getRecord('bndy-artists', duplicate.id);
  if (deleted) {
    throw new Error('Delete verification FAILED - artist still exists');
  }
  console.log('✓ Duplicate artist deleted\n');

  // 6. Verify sentinel points to keeper
  const sentinel = await getSentinel('artist#waltersandbligh#west-midlands');
  if (!sentinel) {
    console.log('⚠️  No sentinel found (expected - duplicate had no sentinel)');
  } else if (sentinel.refId !== keeper.id) {
    throw new Error(`Sentinel points to wrong artist: ${sentinel.refId}`);
  } else {
    console.log(`✓ Sentinel confirmed pointing to keeper: ${keeper.id}\n`);
  }

  return { repointed: events.length };
}

// === EVENT MERGE ===
async function mergeEvent() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  Delete Event Duplicate                                   ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  const { keeper, duplicate } = DUPLICATES.event;

  console.log(`Keeper:    ${keeper.title} (${keeper.id})`);
  console.log(`Duplicate: ${duplicate.title} (${duplicate.id})\n`);

  // Event duplicates: keeper is the multi-artist lineup
  // Duplicate is redundant single-artist event
  // No repointing needed - just delete

  console.log('Reading both events to confirm context...');
  const keeperEvent = await getRecord('bndy-events', keeper.id);
  const dupeEvent = await getRecord('bndy-events', duplicate.id);

  console.log('\nKeeper event:');
  console.log(`  Title: ${keeperEvent.title}`);
  console.log(`  Artist: ${keeperEvent.artistId}`);
  console.log(`  Collabs: ${(keeperEvent.collaboratingArtistIds || []).join(', ')}`);
  console.log(`  Venue: ${keeperEvent.venueId}`);
  console.log(`  Date: ${keeperEvent.date}`);

  console.log('\nDuplicate event:');
  console.log(`  Title: ${dupeEvent.title}`);
  console.log(`  Artist: ${dupeEvent.artistId}`);
  console.log(`  Venue: ${dupeEvent.venueId}`);
  console.log(`  Date: ${dupeEvent.date}`);

  // Verify duplicate artist IS in keeper's collaborators
  if (!keeperEvent.collaboratingArtistIds?.includes(dupeEvent.artistId)) {
    throw new Error('Duplicate event artist NOT in keeper collaboratingArtistIds - verify manually');
  }
  console.log('\n✓ Confirmed: duplicate artist is in keeper lineup\n');

  // Delete duplicate event
  console.log('Deleting duplicate event...');
  await deleteRecord('bndy-events', duplicate.id);

  // Verify deletion
  const deleted = await getRecord('bndy-events', duplicate.id);
  if (deleted) {
    throw new Error('Delete verification FAILED - event still exists');
  }
  console.log('✓ Duplicate event deleted\n');

  // Verify sentinel points to keeper
  const sentinel = await getSentinel('event#b30944804e07bfd5046dae969ad6eaa78a6d83cf');
  if (!sentinel) {
    console.log('⚠️  No sentinel found');
  } else if (sentinel.refId !== keeper.id) {
    throw new Error(`Sentinel points to wrong event: ${sentinel.refId}`);
  } else {
    console.log(`✓ Sentinel confirmed pointing to keeper: ${keeper.id}\n`);
  }

  return { deleted: 1 };
}

// === MAIN ===
async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  MERGE FINAL 2 DUPLICATES (Before Enforce Mode)          ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  const artistResults = await mergeArtist();
  const eventResults = await mergeEvent();

  console.log('═'.repeat(60));
  console.log('MERGE COMPLETE');
  console.log('═'.repeat(60));
  console.log('\n📊 RESULTS');
  console.log(`   Artist merge: ${artistResults.repointed} events repointed`);
  console.log(`   Event merge:  ${eventResults.deleted} duplicate deleted`);
  console.log('');
  console.log('✅ Database ready for enforce mode deployment');
  console.log('');
}

main().catch(console.error);
