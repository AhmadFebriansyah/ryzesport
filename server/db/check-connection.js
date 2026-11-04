import { pool } from './pool.js';

try {
  const { rows } = await pool.query(
    'SELECT current_database() AS database, current_user AS "user", version() AS version',
  );
  const { rows: tables } = await pool.query(
    "SELECT count(*)::int AS jumlah FROM information_schema.tables WHERE table_schema = 'public'",
  );
  console.log('Koneksi berhasil:', rows[0]);
  console.log('Jumlah tabel di schema public:', tables[0].jumlah);
} catch (err) {
  console.error('Koneksi gagal:', err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
