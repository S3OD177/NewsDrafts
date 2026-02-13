const base = process.env.APP_BASE_URL || 'http://localhost:3000';

async function main() {
  const res = await fetch(`${base}/api/cron/ingest`, {
    method: 'POST',
    headers: {
      'x-cron-secret': process.env.CRON_SECRET || '',
    },
  });

  console.log('status', res.status);
  console.log(await res.text());
}

main();
