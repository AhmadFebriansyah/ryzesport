import 'dotenv/config';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const MIGRATIONS_DIR = fileURLToPath(new URL('./migrations/', import.meta.url));
const LOCK_ID = 20261104;

const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL_UNPOOLED belum diisi. Salin server/.env.example ke server/.env lalu isi.');
}

// Setiap file berjalan dalam satu transaksi. Lock mencegah dua proses migrate jalan bersamaan.
async function inTransaction(client, fn) {
  await client.query('BEGIN');
  try {
    await client.query('SELECT pg_advisory_xact_lock($1)', [LOCK_ID]);
    const result = await fn();
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  }
}

async function ensureMigrationsTable(client) {
  await inTransaction(client, () =>
    client.query(`
      CREATE TABLE IF NOT EXISTS t_schema_migrations (
        id         BIGSERIAL PRIMARY KEY,
        filename   TEXT NOT NULL UNIQUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `),
  );
}

async function applyMigration(client, filename) {
  const sql = await readFile(path.join(MIGRATIONS_DIR, filename), 'utf8');

  return inTransaction(client, async () => {
    const { rowCount } = await client.query(
      'SELECT 1 FROM t_schema_migrations WHERE filename = $1',
      [filename],
    );
    if (rowCount > 0) return false;

    await client.query(sql);
    await client.query('INSERT INTO t_schema_migrations (filename) VALUES ($1)', [filename]);
    return true;
  });
}

const client = new pg.Client({ connectionString, connectionTimeoutMillis: 10_000 });

try {
  await client.connect();
  await ensureMigrationsTable(client);

  const files = (await readdir(MIGRATIONS_DIR)).filter((f) => f.endsWith('.sql')).sort();
  let applied = 0;

  for (const file of files) {
    if (await applyMigration(client, file)) {
      console.log(`Diterapkan: ${file}`);
      applied += 1;
    } else {
      console.log(`Dilewati (sudah ada): ${file}`);
    }
  }

  console.log(`Selesai. ${applied} migration baru diterapkan.`);
} catch (err) {
  console.error('Migration gagal:', err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
