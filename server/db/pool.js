import 'dotenv/config';
import pg from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL belum diisi. Salin server/.env.example ke server/.env lalu isi.');
}

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  idleTimeoutMillis: 10_000,
  // Neon perlu waktu untuk bangun dari kondisi suspend.
  connectionTimeoutMillis: 10_000,
});

// Neon memutus koneksi idle saat suspend. Tanpa handler ini proses Node ikut mati.
pool.on('error', (err) => {
  console.error('Koneksi database idle terputus:', err.message);
});

export const query = (text, params) => pool.query(text, params);
