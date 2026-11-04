import { query } from '../db/pool.js';

const SLUG_PATTERN = /^[a-z0-9-]+$/;
const MAX_LIMIT = 50;
const SEGMEN = { pria: 'PRIA', wanita: 'WANITA', anak: 'ANAK' };

// Warna terlaris dulu. Warna yang sama larisnya diacak dengan hash agar katalog tetap bervariasi
// tetapi tidak berubah setiap halaman dimuat. Konstanta ini tanpa input user.
const URUTAN_WARNA = `(
    SELECT coalesce(sum(oi.qty), 0)
    FROM t_order_items oi
    JOIN t_orders o ON o.id = oi.order_id
    JOIN t_product_variants sv ON sv.id = oi.variant_id
    WHERE sv.color_id = pc.id AND o.status <> 'DIBATALKAN'
  ) DESC, hashtextextended(pc.id::text, 0)`;

export async function getProduct(req, res) {
  const { slug } = req.params;

  if (!SLUG_PATTERN.test(slug)) {
    return res.status(400).json({ message: 'Produk tidak valid.' });
  }

  const { rows } = await query(
    `SELECT
       p.id,
       p.nama,
       p.slug,
       p.deskripsi,
       p.harga,
       p.segmen,
       p.is_trending,
       b.nama AS merek,
       c.nama AS kategori,
       c.slug AS kategori_slug
     FROM t_products p
     JOIN t_categories c ON c.id = p.category_id
     JOIN t_brands b ON b.id = p.brand_id
     WHERE p.slug = $1 AND p.is_active`,
    [slug],
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: 'Produk tidak ditemukan.' });
  }

  const { rows: warna } = await query(
    `SELECT
       pc.id,
       pc.nama_warna,
       pc.foto_url,
       json_agg(
         json_build_object('id', v.id::text, 'ukuran', v.ukuran, 'stok', v.stok)
         ORDER BY v.ukuran
       ) AS varian
     FROM t_product_colors pc
     JOIN t_product_variants v ON v.color_id = pc.id
     WHERE pc.product_id = $1
     GROUP BY pc.id
     ORDER BY ${URUTAN_WARNA}`,
    [rows[0].id],
  );

  res.json({ data: { ...rows[0], warna } });
}

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
         (array_agg(pc.foto_url ORDER BY ${URUTAN_WARNA}))[1] AS foto_url,
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
