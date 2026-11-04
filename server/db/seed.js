import 'dotenv/config';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const SEEDS_DIR = fileURLToPath(new URL('./seeds/', import.meta.url));

const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL_UNPOOLED belum diisi. Salin server/.env.example ke server/.env lalu isi.');
}

const client = new pg.Client({ connectionString, connectionTimeoutMillis: 10_000 });

try {
  await client.connect();
  const files = (await readdir(SEEDS_DIR)).filter((f) => f.endsWith('.sql')).sort();

  await client.query('BEGIN');
  for (const file of files) {
    await client.query(await readFile(path.join(SEEDS_DIR, file), 'utf8'));
    console.log(`Dijalankan: ${file}`);
  }
  await client.query('COMMIT');
  console.log('Seed selesai.');
} catch (err) {
  await client.query('ROLLBACK').catch(() => {});
  console.error('Seed gagal:', err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
