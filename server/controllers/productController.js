import { query } from '../db/pool.js';

const SLUG_PATTERN = /^[a-z0-9-]+$/;
const MAX_LIMIT = 50;
const MAX_KATA_KUNCI = 100;
const MAX_PILIHAN = 30;
const MAX_HARGA = 2147483647;
const UKURAN_PATTERN = /^\d{1,2}(\.\d)?$/;
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

// Foto kartu mengikuti warna yang difilter. Konstanta ini tanpa input user.
const WARNA_TERPILIH_DULU = `(string_to_array(lower(pc.nama_warna), ' ') && $9::text[]) DESC`;

// Konstanta tanpa input user. Kunci dari query string hanya dipakai untuk memilih salah satunya.
const URUTAN_PRODUK = {
  terbaru: 'p.created_at DESC, p.id DESC',
  harga_terendah: 'p.harga ASC, p.id',
  harga_tertinggi: 'p.harga DESC, p.id',
};

const isSlug = (nilai) => SLUG_PATTERN.test(nilai);
const isValidList = (list, isValid) => list !== null && list.every(isValid);

// Filter bisa berisi beberapa nilai dipisah koma, contoh merek=nike,puma. Hasil null berarti tidak valid.
function parseList(value) {
  if (value === undefined) return [];
  if (typeof value !== 'string') return null;
  const list = value.split(',').filter(Boolean);
  return list.length > MAX_PILIHAN ? null : list;
}

// Hasil NaN berarti tidak valid.
function parseHarga(value) {
  if (value === undefined) return null;
  const harga = Number(value);
  return Number.isInteger(harga) && harga >= 0 && harga <= MAX_HARGA ? harga : NaN;
}

export async function listPhotoCredits(_req, res) {
  const { rows } = await query(
    `SELECT DISTINCT ON (foto_url) foto_url, foto_kredit, foto_kredit_url, foto_lisensi, foto_sumber_url
     FROM (
       SELECT foto_url, foto_kredit, foto_kredit_url, foto_lisensi, foto_sumber_url FROM t_product_colors
       UNION ALL
       SELECT foto_url, foto_kredit, foto_kredit_url, foto_lisensi, foto_sumber_url FROM t_product_photos
     ) semua_foto
     ORDER BY foto_url`,
  );
  res.json({ data: rows });
}

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
       pc.foto_ilustrasi,
       COALESCE(
         (SELECT json_agg(ph.foto_url ORDER BY ph.urutan, ph.id) FROM t_product_photos ph WHERE ph.color_id = pc.id),
         '[]'
       ) AS foto_tambahan,
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

export async function listProductFilters(_req, res) {
  const { rows: harga } = await query(
    'SELECT min(harga)::int AS min, max(harga)::int AS max FROM t_products WHERE is_active',
  );
  const { rows: ukuran } = await query(
    `SELECT DISTINCT v.ukuran
     FROM t_product_variants v
     JOIN t_product_colors pc ON pc.id = v.color_id
     JOIN t_products p ON p.id = pc.product_id
     WHERE p.is_active
     ORDER BY v.ukuran`,
  );
  res.json({ data: { harga: harga[0], ukuran: ukuran.map((row) => Number(row.ukuran)) } });
}

export async function listProducts(req, res) {
  const { q, trending, unggulan, limit, urut } = req.query;
  const kategori = parseList(req.query.kategori);
  const merek = parseList(req.query.merek);
  const segmen = parseList(req.query.segmen);
  const ukuran = parseList(req.query.ukuran);
  const warna = parseList(req.query.warna);
  const hargaMin = parseHarga(req.query.harga_min);
  const hargaMax = parseHarga(req.query.harga_max);

  if (!isValidList(kategori, isSlug)) {
    return res.status(400).json({ message: 'Kategori tidak valid.' });
  }

  if (!isValidList(merek, isSlug)) {
    return res.status(400).json({ message: 'Merek tidak valid.' });
  }

  if (!isValidList(warna, isSlug)) {
    return res.status(400).json({ message: 'Warna tidak valid.' });
  }

  if (!isValidList(ukuran, (nilai) => UKURAN_PATTERN.test(nilai))) {
    return res.status(400).json({ message: 'Ukuran tidak valid.' });
  }

  if (Number.isNaN(hargaMin) || Number.isNaN(hargaMax)) {
    return res.status(400).json({ message: 'Rentang harga tidak valid.' });
  }

  if (hargaMin !== null && hargaMax !== null && hargaMin > hargaMax) {
    return res.status(400).json({ message: 'Harga minimum melebihi harga maksimum.' });
  }

  if (urut !== undefined && !Object.hasOwn(URUTAN_PRODUK, urut)) {
    return res.status(400).json({ message: 'Urutan tidak valid.' });
  }

  if (q !== undefined && (typeof q !== 'string' || q.length > MAX_KATA_KUNCI)) {
    return res.status(400).json({ message: `Kata pencarian maksimal ${MAX_KATA_KUNCI} karakter.` });
  }
  // % dan _ di-escape agar diperlakukan sebagai huruf biasa oleh ILIKE.
  const kataKunci = q?.trim().replace(/[\\%_]/g, '\\$&') || null;

  if (!isValidList(segmen, (nilai) => Object.hasOwn(SEGMEN, nilai))) {
    return res.status(400).json({ message: 'Segmen harus pria, wanita, atau anak.' });
  }

  if (trending !== undefined && trending !== '1') {
    return res.status(400).json({ message: 'Filter trending tidak valid.' });
  }

  if (unggulan !== undefined && unggulan !== '1') {
    return res.status(400).json({ message: 'Filter unggulan tidak valid.' });
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
       warna.foto_ilustrasi,
       warna.jumlah_warna,
       warna.tersedia
     FROM t_products p
     JOIN t_categories c ON c.id = p.category_id
     JOIN t_brands b ON b.id = p.brand_id
     CROSS JOIN LATERAL (
       SELECT
         (array_agg(pc.foto_url ORDER BY ${WARNA_TERPILIH_DULU}, ${URUTAN_WARNA}))[1] AS foto_url,
         (array_agg(pc.foto_ilustrasi ORDER BY ${WARNA_TERPILIH_DULU}, ${URUTAN_WARNA}))[1] AS foto_ilustrasi,
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
       AND (cardinality($1::text[]) = 0 OR c.slug = ANY($1))
       AND (cardinality($2::e_segmen[]) = 0 OR p.segmen = ANY($2))
       AND (NOT $3::boolean OR p.is_trending)
       AND (NOT $5::boolean OR p.is_unggulan)
       AND (cardinality($6::text[]) = 0 OR b.slug = ANY($6))
       AND ($7::text IS NULL OR concat_ws(' ', b.nama, p.nama, c.nama) ILIKE '%' || $7 || '%')
       AND (
         (cardinality($8::numeric[]) = 0 AND cardinality($9::text[]) = 0)
         OR EXISTS (
           SELECT 1
           FROM t_product_colors fc
           JOIN t_product_variants fv ON fv.color_id = fc.id
           WHERE fc.product_id = p.id
             AND (cardinality($8::numeric[]) = 0 OR (fv.ukuran = ANY($8) AND fv.stok > 0))
             AND (cardinality($9::text[]) = 0 OR string_to_array(lower(fc.nama_warna), ' ') && $9::text[])
         )
       )
       AND ($10::int IS NULL OR p.harga >= $10)
       AND ($11::int IS NULL OR p.harga <= $11)
     ORDER BY ${URUTAN_PRODUK[urut] ?? 'p.id'}
     LIMIT $4`,
    [
      kategori,
      segmen.map((nilai) => SEGMEN[nilai]),
      trending === '1',
      parsedLimit,
      unggulan === '1',
      merek,
      kataKunci,
      ukuran,
      warna,
      hargaMin,
      hargaMax,
    ],
  );

  res.json({ data: rows });
}
