import { query } from '../db/pool.js';

const SLUG_PATTERN = /^[a-z0-9-]+$/;
const MAX_LIMIT = 50;
const SEGMEN = { pria: 'PRIA', wanita: 'WANITA', anak: 'ANAK' };

export async function listProducts(req, res) {
  const { kategori, segmen, trending, limit } = req.query;

  if (kategori !== undefined) {
    if (typeof kategori !== 'string' || !SLUG_PATTERN.test(kategori)) {
      return res.status(400).json({ message: 'Kategori tidak valid.' });
    }
    const { rowCount } = await query('SELECT 1 FROM t_categories WHERE slug = $1', [kategori]);
    if (rowCount === 0) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan.' });
    }
  }

  if (segmen !== undefined && !Object.hasOwn(SEGMEN, segmen)) {
    return res.status(400).json({ message: 'Segmen harus pria, wanita, atau anak.' });
  }

  if (trending !== undefined && trending !== '1') {
    return res.status(400).json({ message: 'Filter trending tidak valid.' });
  }

  let parsedLimit = MAX_LIMIT;
  if (limit !== undefined) {
    parsedLimit = Number(limit);
    if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > MAX_LIMIT) {
      return res.status(400).json({ message: `Limit harus angka 1 sampai ${MAX_LIMIT}.` });
    }
  }

  const { rows } = await query(
    `SELECT
       p.id,
       p.nama,
       p.slug,
       p.harga,
       p.segmen,
       p.is_trending,
       b.nama AS merek,
       c.nama AS kategori,
       c.slug AS kategori_slug,
       warna.foto_url,
       warna.jumlah_warna,
       warna.tersedia
     FROM t_products p
     JOIN t_categories c ON c.id = p.category_id
     JOIN t_brands b ON b.id = p.brand_id
     CROSS JOIN LATERAL (
       SELECT
         (array_agg(pc.foto_url ORDER BY pc.id))[1] AS foto_url,
         count(*)::int AS jumlah_warna,
         EXISTS (
           SELECT 1
           FROM t_product_variants v
           JOIN t_product_colors vc ON vc.id = v.color_id
           WHERE vc.product_id = p.id AND v.stok > 0
         ) AS tersedia
       FROM t_product_colors pc
       WHERE pc.product_id = p.id
     ) warna
     WHERE p.is_active
       AND ($1::text IS NULL OR c.slug = $1)
       AND ($2::e_segmen IS NULL OR p.segmen = $2)
       AND (NOT $3::boolean OR p.is_trending)
     ORDER BY p.id
     LIMIT $4`,
    [kategori ?? null, segmen ? SEGMEN[segmen] : null, trending === '1', parsedLimit],
  );

  res.json({ data: rows });
}
