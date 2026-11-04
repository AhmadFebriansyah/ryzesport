import { query } from '../db/pool.js';

const ID_PATTERN = /^[1-9]\d{0,17}$/;
const MAX_IDS = 100;

// Dipakai keranjang tamu: localStorage hanya menyimpan id dan qty, harga selalu dari database.
export async function listVariants(req, res) {
  const { ids } = req.query;
  const parsedIds = typeof ids === 'string' ? ids.split(',') : [];

  if (
    parsedIds.length === 0 ||
    parsedIds.length > MAX_IDS ||
    !parsedIds.every((id) => ID_PATTERN.test(id))
  ) {
    return res.status(400).json({ message: 'Daftar varian tidak valid.' });
  }

  const { rows } = await query(
    `SELECT
       v.id,
       v.ukuran::float AS ukuran,
       v.stok,
       pc.nama_warna,
       pc.foto_url,
       p.nama,
       p.slug,
       p.harga,
       b.nama AS merek
     FROM t_product_variants v
     JOIN t_product_colors pc ON pc.id = v.color_id
     JOIN t_products p ON p.id = pc.product_id
     JOIN t_brands b ON b.id = p.brand_id
     WHERE v.id = ANY($1::bigint[]) AND p.is_active`,
    [parsedIds],
  );

  res.json({ data: rows });
}
