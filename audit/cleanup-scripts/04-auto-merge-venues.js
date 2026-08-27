/**
 * Auto-Merge Venue Place ID Duplicates
 *
 * Merges 9 venue duplicate clusters based on same google_place_id.
 * For each cluster, keeps the best record (validated, more complete data)
 * and migrates all events from duplicates.
 *
 * Source: deep-audit-2026-07-27.json venues.placeIdDuplicates
 */

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });

const VENUES_TABLE = 'bndy-venues';
const EVENTS_TABLE = 'bndy-events';

// Merge decisions (keep the better record in each cluster)
const MERGE_PLAN = [
  {
    name: 'Newcastle-under-Lyme Markets',
    placeId: 'ChIJA0U5bOJnekgRWK9Suwck1rY',
    keepId: '7c9c361b-6e6f-4aed-89e5-16521b007b47', // validated=true, has external_ids
    deleteId: 'bfdf63f6-6b17-4ee7-aa84-880a794130dd',
    reason: 'Keep validated record with external_ids'
  },
  {
    name: 'Stone Cricket Club',
    placeId: 'ChIJhysokYxlekgR-2b_Xm-bBlU',
    keepId: '020a9f02-b2c6-43cc-aab7-ada9d825b6f8', // has external_ids
    deleteId: '3ecb8752-e7f2-4cee-aefe-5280e873f17b',
    reason: 'Keep record with external_ids'
  },
  {
    name: 'The Furlong',
    placeId: 'ChIJmaaQe95CekgRS6hR9HEk6_k',
    keepId: 'd186e8da-662f-401f-9b0f-cbae9b63401c', // has external_ids
    deleteId: '39079840-13c7-4428-adff-8ee0d89bba0f',
    reason: 'Keep record with external_ids'
  },
  {
    name: 'The Lion, Sandbach',
    placeId: 'ChIJ-yJ9p3NZekgR5j0osqyVQwY',
    keepId: '378aac2f-ffb5-4893-a8a3-a6d5576aeb21', // has enrichment, older
    deleteId: '40977b9f-769f-4f9f-81fd-87c3f9fc653a',
    reason: 'Keep enriched record (created earlier)'
  },
  {
    name: 'New Finney Gardens',
    placeId: 'ChIJjQ3TV95pekgRhWrYsHCZXnU',
    keepId: '88edfa74-bbd3-4734-aea2-cd0a9343f05c', // has external_ids, created via wizard
    deleteId: 'e768ed6f-910c-43f9-843a-f7f08d0c5d3b',
    reason: 'Keep record with external_ids from wizard'
  },
  {
    name: 'The Witton Chimes',
    placeId: 'ChIJXQlS1Mj5ekgRmMgWk1DsCMI',
    keepId: 'ef0f632d-600d-4d29-979c-d90f41b08a71', // has external_ids, enriched
    deleteId: '67e1f48b-8458-4cae-a846-0ab68cd27725',
    reason: 'Keep enriched record with external_ids'
  },
  {
    name: 'The Top Pub - Brown Edge',
    placeId: 'ChIJkxoqiNtDekgRBUyUAv3v1tk',
    keepId: '20eced38-130a-4378-9e45-c8218a3216e7', // has external_ids, enriched
    deleteId: 'afcf412e-536f-45fc-9e75-cbb30f716fed',
    reason: 'Keep enriched record with external_ids'
  },
  {
    name: 'The Space Invader',
    placeId: 'ChIJrXtlwk9RekgRvM0CNChHFao',
    keepId: 'd6347b1f-4fb2-40bb-8508-3f30ecf541cf', // older, has social_media_urls
    deleteId: '9b9e4b2a-fd0e-48bc-aacd-799a940d055e',
    reason: 'Keep older record with social media'
  },
  {
    name: 'The Jug',
    placeId: 'ChIJYWRRGeNnekgRP4Afy03cHHc',
    keepId: 'KFWFxYJASE6UQJQKV0eN', // validated=true, enriched, has name_variants
    deleteId: '6916dbc7-2d8f-40f8-8080-c5098727a5f6',
    reason: 'Keep validated enriched record with name variants'
  }
];

async function getVenue(venueId) {
  const result = await dynamodb.get({
    TableName: VENUES_TABLE,
    Key: { id: venueId }
  }).promise();
  return result.Item;
}

async function getVenueEvents(venueId) {
  const result = await dynamodb.query({
    TableName: EVENTS_TABLE,
    IndexName: 'venueId-date-index',
    KeyConditionExpression: 'venueId = :venueId',
    ExpressionAttributeValues: { ':venueId': venueId }
  }).promise();
  return result.Items || [];
}

async function updateEvent(eventId, newVenueId) {
  await dynamodb.update({
    TableName: EVENTS_TABLE,
    Key: { id: eventId },
    UpdateExpression: 'SET venueId = :venueId',
    ExpressionAttributeValues: { ':venueId': newVenueId }
  }).promise();
}

async function deleteVenue(venueId) {
  await dynamodb.delete({
    TableName: VENUES_TABLE,
    Key: { id: venueId }
  }).promise();
}

async function mergeCluster(cluster) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Merging: ${cluster.name}`);
  console.log(`Place ID: ${cluster.placeId}`);
  console.log(`Reason: ${cluster.reason}`);
  console.log(`${'='.repeat(60)}`);

  // 1. Verify both venues exist
  const goodVenue = await getVenue(cluster.keepId);
  const badVenue = await getVenue(cluster.deleteId);

  if (!goodVenue) {
    console.log(`❌ KEEP venue not found: ${cluster.keepId}`);
    return { success: false, eventsUpdated: 0 };
  }

  if (!badVenue) {
    console.log(`⚠️  DELETE venue not found: ${cluster.deleteId} (may already be deleted)`);
    return { success: true, eventsUpdated: 0 };
  }

  console.log(`\nKEEP:   ${goodVenue.name} (${cluster.keepId})`);
  console.log(`        validated=${goodVenue.validated}, created=${goodVenue.created_at}`);
  console.log(`DELETE: ${badVenue.name} (${cluster.deleteId})`);
  console.log(`        validated=${badVenue.validated}, created=${badVenue.created_at}`);

  // 2. Get events for duplicate venue
  const events = await getVenueEvents(cluster.deleteId);
  console.log(`\nFound ${events.length} events to migrate`);

  if (events.length > 0) {
    // 3. Update each event to point to kept venue
    for (const event of events) {
      console.log(`  Migrating event: ${event.id} (${event.title || event.date})`);
      await updateEvent(event.id, cluster.keepId);
    }
    console.log(`✅ Migrated ${events.length} events`);
  }

  // 4. Delete duplicate venue
  console.log(`\nDeleting duplicate venue: ${cluster.deleteId}`);
  await deleteVenue(cluster.deleteId);
  console.log(`✅ Venue deleted`);

  return { success: true, eventsUpdated: events.length };
}

async function main() {
  console.log(`\nVenue Place ID Duplicate Merge`);
  console.log(`==============================\n`);
  console.log(`Merging ${MERGE_PLAN.length} venue duplicate clusters\n`);

  const results = {
    total: MERGE_PLAN.length,
    succeeded: 0,
    failed: 0,
    totalEventsUpdated: 0
  };

  for (const cluster of MERGE_PLAN) {
    try {
      const result = await mergeCluster(cluster);
      if (result.success) {
        results.succeeded++;
        results.totalEventsUpdated += result.eventsUpdated;
      } else {
        results.failed++;
      }
    } catch (error) {
      console.log(`\n❌ ERROR merging ${cluster.name}:`);
      console.log(error.message);
      results.failed++;
    }
  }

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log(`SUMMARY`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Total clusters:    ${results.total}`);
  console.log(`Succeeded:         ${results.succeeded}`);
  console.log(`Failed:            ${results.failed}`);
  console.log(`Events migrated:   ${results.totalEventsUpdated}`);
  console.log(`Venues deleted:    ${results.succeeded}`);
}

// Dry-run mode
const DRY_RUN = process.argv.includes('--execute') ? false : true;

if (DRY_RUN) {
  console.log('🔍 DRY RUN MODE - No changes will be made');
  console.log('Run with --execute to perform actual merge\n');

  (async () => {
    console.log(`Would merge ${MERGE_PLAN.length} venue clusters:\n`);
    for (const cluster of MERGE_PLAN) {
      const goodVenue = await getVenue(cluster.keepId);
      const badVenue = await getVenue(cluster.deleteId);
      const events = badVenue ? await getVenueEvents(cluster.deleteId) : [];

      console.log(`${cluster.name} (${cluster.placeId})`);
      console.log(`  KEEP:   ${goodVenue ? goodVenue.name : 'NOT FOUND'} (${cluster.keepId})`);
      console.log(`  DELETE: ${badVenue ? badVenue.name : 'NOT FOUND'} (${cluster.deleteId})`);
      console.log(`  Events to migrate: ${events.length}`);
      console.log(`  Reason: ${cluster.reason}\n`);
    }
  })().catch(console.error);
} else {
  main().catch(console.error);
}
