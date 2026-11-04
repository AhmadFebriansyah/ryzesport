import bcrypt from 'bcrypt';
import { query } from '../db/pool.js';
import { signToken } from '../middleware/auth.js';

const BCRYPT_ROUNDS = 12;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TELEPON_PATTERN = /^[0-9+\-\s]{8,20}$/;
const UNIQUE_VIOLATION = '23505';
// bcrypt hanya memakai 72 byte pertama.
const MAX_PASSWORD_BYTES = 72;
// Hash pembanding agar waktu respons login sama, baik email terdaftar maupun tidak.
const DUMMY_HASH = bcrypt.hashSync('ryzesport-dummy-password', BCRYPT_ROUNDS);

const toPublicUser = ({ id, email, nama, telepon }) => ({ id, email, nama, telepon });

function normalizeEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

function validateRegister({ nama, email, password, telepon }) {
  if (typeof nama !== 'string' || nama.trim().length < 2 || nama.trim().length > 100) {
    return 'Nama harus 2 sampai 100 karakter.';
  }
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return 'Format email tidak valid.';
  }
  if (typeof password !== 'string' || password.length < 8) {
    return 'Password minimal 8 karakter.';
  }
  if (Buffer.byteLength(password) > MAX_PASSWORD_BYTES) {
    return 'Password terlalu panjang.';
  }
  if (telepon && (typeof telepon !== 'string' || !TELEPON_PATTERN.test(telepon))) {
    return 'Format nomor telepon tidak valid.';
  }
  return null;
}

export async function register(req, res) {
  const body = req.body ?? {};
  const email = normalizeEmail(body.email);
  const message = validateRegister({ ...body, email });
  if (message) {
    return res.status(400).json({ message });
  }

  const passwordHash = await bcrypt.hash(body.password, BCRYPT_ROUNDS);

  try {
    const { rows } = await query(
      `INSERT INTO t_users (email, password_hash, nama, telepon)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, nama, telepon`,
      [email, passwordHash, body.nama.trim(), body.telepon || null],
    );
    return res.status(201).json({ data: { token: signToken(rows[0].id), user: toPublicUser(rows[0]) } });
  } catch (err) {
    if (err.code === UNIQUE_VIOLATION) {
      return res.status(409).json({ message: 'Email sudah terdaftar.' });
    }
    throw err;
  }
}

export async function login(req, res) {
  const body = req.body ?? {};
  const email = normalizeEmail(body.email);
  const password = typeof body.password === 'string' ? body.password : '';

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi.' });
  }

  const { rows } = await query(
    'SELECT id, email, nama, telepon, password_hash FROM t_users WHERE email = $1',
    [email],
  );
  const match = await bcrypt.compare(password, rows[0]?.password_hash ?? DUMMY_HASH);

  if (!rows[0] || !match) {
    return res.status(401).json({ message: 'Email atau password salah.' });
  }

  return res.json({ data: { token: signToken(rows[0].id), user: toPublicUser(rows[0]) } });
}

export async function me(req, res) {
  const { rows } = await query('SELECT id, email, nama, telepon FROM t_users WHERE id = $1', [
    req.userId,
  ]);

  if (rows.length === 0) {
    return res.status(401).json({ message: 'Sesi berakhir. Silakan masuk kembali.' });
  }

  return res.json({ data: toPublicUser(rows[0]) });
}
