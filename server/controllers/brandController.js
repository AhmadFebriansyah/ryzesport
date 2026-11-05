import { query } from '../db/pool.js';

// Hanya merek yang punya produk aktif, supaya tautannya tidak berakhir di halaman kosong.
export async function listBrands(_req, res) {
  const { rows } = await query(
    `SELECT b.id, b.nama, b.slug, count(*)::int AS jumlah_produk
     FROM t_brands b
     JOIN t_products p ON p.brand_id = b.id AND p.is_active
     GROUP BY b.id
     ORDER BY lower(b.nama)`,
  );
  res.json({ data: rows });
}
