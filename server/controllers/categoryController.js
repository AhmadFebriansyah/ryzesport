import { query } from '../db/pool.js';

export async function listCategories(_req, res) {
  const { rows } = await query('SELECT id, nama, slug FROM t_categories ORDER BY id');
  res.json({ data: rows });
}
