/**
 * Auto-Merge Event Natural Key Duplicates
 *
 * Merges 14 event duplicate clusters based on same natural key.
 * For each cluster, keeps the best record (has external_ids, community_wizard source, older)
 * and deletes the duplicate.
 *
 * Source: deep-audit-2026-07-27.json events.naturalKeyDuplicates
 */

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });

const EVENTS_TABLE = 'bndy-events';

// Merge decisions based on analysis
const MERGE_PLAN = [
  {
    title: 'Off The Rails @ Nags Head',
    date: '2026-07-04',
    keepId: 'b891046c-8b7b-46bf-a7c1-709dc3b2bfe5',
    deleteId: '3beaacd6-bf65-4bfd-9436-26b774e308de',
    reason: 'Keep event with external_ids'
  },
  {
    title: 'The Ant Hill Mob @ Measham Top Club',
    date: '2026-06-27',
    keepId: 'ff573256-67f4-4596-bf60-7e90c14e315f',
    deleteId: '42ff7eb2-fac0-4f2e-8fb4-00957feae66b',
    reason: 'Keep event with external_ids'
  },
  {
    title: 'The Ant Hill Mob @ The Greyhound Inn',
    date: '2026-07-11',
    keepId: '86b938f2-b1e5-498b-8c0f-cd3eb998dec9',
    deleteId: '2033d6ef-ea24-4d23-acf4-9451aad82765',
    reason: 'Keep event with external_ids'
  },
  {
    title: 'Stone Cold Sober...Ish @ Swan Inn',
    date: '2026-06-19',
    keepId: '9c7f313e-12c5-43e8-b653-9bd9146939d8',
    deleteId: 'c2e9610a-0123-4c49-a232-5b5d41316524',
    reason: 'Keep community_wizard over mcp_ai_import'
  },
  {
    title: 'M J Acoustic @ The Bridge Inn',
    date: '2026-06-14',
    keepId: 'be1830c6-bd8d-40dd-be3b-17a70afe4221',
    deleteId: 'f3bedc4c-1008-46a6-902e-abaa79100c27',
    reason: 'Keep community_wizard over mcp_ai_import'
  },
  {
    title: 'Craig Harrison @ The Bankers Draught',
    date: '2026-06-20',
    keepId: '30e428b4-1fcd-459c-8cd0-1bffc18def1b',
    deleteId: 'a88492d9-df38-4888-9eb4-05762d8a7064',
    reason: 'Keep community_wizard over mcp_ai_import'
  },
  {
    title: 'Electric Landlady @ The Cock Inn',
    date: '2026-06-22',
    keepId: '4ce4daf4-bc3f-4494-8755-bcf2ef2e42fa',
    deleteId: '56ffbe79-075b-40c0-a792-a6b9a80f7095',
    reason: 'Keep community_wizard over mcp_ai_import'
  },
  {
    title: 'Armed Project @ The Rigger',
    date: '2026-06-27',
    keepId: '32f23942-cc03-4ba6-bbee-4720dd550582',
    deleteId: '718317d6-b13e-4b69-a63f-33635014d5bf',
    reason: 'Keep event with external_ids'
  },
  {
    title: 'Dan Toft and Mel @ The Bankers Draught',
    date: '2026-06-13',
    keepId: 'b5c6da1b-000e-4f8d-8509-b1ef5c9fb807',
    deleteId: '76615379-101d-4d4a-9cfa-0b9ded1731c6',
    reason: 'Keep community_wizard over mcp_ai_import'
  },
  {
    title: 'Newman Rockets @ Queen\'s Hotel',
    date: '2026-06-28',
    keepId: '87f16b15-b93f-4d7e-8618-8edbee61f58f',
    deleteId: '31e82776-a894-4ed7-8fa9-498770803ba7',
    reason: 'Keep older event'
  },
  {
    title: 'Circa 81 @ The Bush At Brown Edge',
    date: '2026-06-14',
    keepId: '76f72e2a-315c-4af7-ab7e-7f5a8320b344',
    deleteId: '2c7a3e78-1282-43b2-9823-c5fa801acd0e',
    reason: 'Keep older event'
  },
  {
    title: 'Crosshair @ The Bridge Inn',
    date: '2026-06-22',
    keepId: '66e89020-53f7-42a5-8734-9a7f20206090',
    deleteId: '1af19823-b8b1-4405-9b46-0095728b3311',
    reason: 'Keep community_wizard over mcp_ai_import'
  },
  {
    title: 'Ant Clowes Duo @ The Hollybush Inn',
    date: '2026-06-15',
    keepId: '8bed9b18-32f5-4d9e-9887-fff815bd87ae',
    deleteId: '00c392a2-691e-4bb0-9866-e7da6a568def',
    reason: 'Keep older event'
  },
  {
    title: 'Danny & Friends',
    date: '2026-05-30',
    keepId: '521e095a-7763-4fdc-9eea-d1601a836bcb',
    deleteId: '92c30945-2a50-4fb9-9ea7-b5d9144a1b0a',
    reason: 'Keep older event'
  }
];

async function getEvent(eventId) {
  const result = await dynamodb.get({
    TableName: EVENTS_TABLE,
    Key: { id: eventId }
  }).promise();
  return result.Item;
}

async function deleteEvent(eventId) {
  await dynamodb.delete({
    TableName: EVENTS_TABLE,
    Key: { id: eventId }
  }).promise();
}

async function mergeCluster(cluster) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Merging: ${cluster.title} (${cluster.date})`);
  console.log(`Reason: ${cluster.reason}`);
  console.log(`${'='.repeat(60)}`);

  // 1. Verify both events exist
  const goodEvent = await getEvent(cluster.keepId);
  const badEvent = await getEvent(cluster.deleteId);

  if (!goodEvent) {
    console.log(`❌ KEEP event not found: ${cluster.keepId}`);
    return { success: false };
  }

  if (!badEvent) {
    console.log(`⚠️  DELETE event not found: ${cluster.deleteId} (may already be deleted)`);
    return { success: true };
  }

  console.log(`\nKEEP:   ${goodEvent.title || goodEvent.id} (${cluster.keepId})`);
  console.log(`        created: ${goodEvent.createdAt}, source: ${goodEvent.source}`);
  console.log(`DELETE: ${badEvent.title || badEvent.id} (${cluster.deleteId})`);
  console.log(`        created: ${badEvent.createdAt}, source: ${badEvent.source}`);

  // 2. Delete duplicate event
  console.log(`\nDeleting duplicate event: ${cluster.deleteId}`);
  await deleteEvent(cluster.deleteId);
  console.log(`✅ Event deleted`);

  return { success: true };
}

async function main() {
  console.log(`\nEvent Natural Key Duplicate Merge`);
  console.log(`==================================\n`);
  console.log(`Merging ${MERGE_PLAN.length} event duplicate clusters\n`);

  const results = {
    total: MERGE_PLAN.length,
    succeeded: 0,
    failed: 0
  };

  for (const cluster of MERGE_PLAN) {
    try {
      const result = await mergeCluster(cluster);
      if (result.success) {
        results.succeeded++;
      } else {
        results.failed++;
      }
    } catch (error) {
      console.log(`\n❌ ERROR merging ${cluster.title}:`);
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
  console.log(`Events deleted:    ${results.succeeded}`);
}

// Dry-run mode
const DRY_RUN = process.argv.includes('--execute') ? false : true;

if (DRY_RUN) {
  console.log('🔍 DRY RUN MODE - No changes will be made');
  console.log('Run with --execute to perform actual merge\n');

  (async () => {
    console.log(`Would merge ${MERGE_PLAN.length} event clusters:\n`);
    for (const cluster of MERGE_PLAN) {
      const goodEvent = await getEvent(cluster.keepId);
      const badEvent = await getEvent(cluster.deleteId);

      console.log(`${cluster.title} (${cluster.date})`);
      console.log(`  KEEP:   ${goodEvent ? goodEvent.title : 'NOT FOUND'} (${cluster.keepId})`);
      console.log(`  DELETE: ${badEvent ? badEvent.title : 'NOT FOUND'} (${cluster.deleteId})`);
      console.log(`  Reason: ${cluster.reason}\n`);
    }
  })().catch(console.error);
} else {
  main().catch(console.error);
}
