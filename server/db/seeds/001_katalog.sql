-- Data katalog awal. Semua nama produk fiktif.
-- Aman dijalankan ulang: data yang sudah ada tidak ditimpa, jadi stok dan harga hasil
-- perubahan aplikasi tetap utuh.
-- foto_url masih placeholder sampai foto asli di-upload ke Cloudinary.

INSERT INTO t_categories (nama, slug) VALUES
  ('Running', 'running'),
  ('Sport', 'sport'),
  ('Casual', 'casual')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO t_products (nama, slug, deskripsi, harga, category_id)
SELECT p.nama, p.slug, p.deskripsi, p.harga, c.id
FROM (VALUES
  ('Ryze Velocity 3', 'ryze-velocity-3', 'running',
   'Sepatu lari harian dengan bantalan responsif dan upper mesh yang ringan untuk jarak menengah hingga jauh.', 1299000),
  ('Ryze Stride Pro', 'ryze-stride-pro', 'running',
   'Dirancang untuk mengejar waktu terbaik. Sol tipis, pantulan kuat, dan bobot yang sangat ringan.', 1749000),
  ('Ryze Tempo Lite', 'ryze-tempo-lite', 'running',
   'Pilihan ringan untuk latihan tempo dan lari santai setiap hari, nyaman sejak pemakaian pertama.', 899000),
  ('Ryze Court Elite', 'ryze-court-elite', 'sport',
   'Sepatu lapangan dengan cengkeraman sol karet dan penopang samping untuk gerakan cepat ke segala arah.', 1199000),
  ('Ryze Apex Trainer', 'ryze-apex-trainer', 'sport',
   'Stabil untuk angkat beban, lincah untuk latihan interval. Satu pasang untuk semua sesi di gym.', 1099000),
  ('Ryze Strike Hoop', 'ryze-strike-hoop', 'sport',
   'Sepatu basket dengan potongan mid-top, bantalan tumit tebal, dan penguncian kaki yang mantap.', 1549000),
  ('Ryze Urban One', 'ryze-urban-one', 'casual',
   'Siluet bersih bergaya minimalis yang mudah dipadukan dengan pakaian apa pun, dari kantor sampai akhir pekan.', 799000),
  ('Ryze Drift Knit', 'ryze-drift-knit', 'casual',
   'Upper rajut lentur tanpa tali yang praktis dipakai dan tetap sejuk sepanjang hari.', 699000),
  ('Ryze Canvas Low', 'ryze-canvas-low', 'casual',
   'Sepatu kanvas potongan rendah dengan sol karet klasik untuk gaya santai sehari-hari.', 549000)
) AS p (nama, slug, category_slug, deskripsi, harga)
JOIN t_categories c ON c.slug = p.category_slug
ON CONFLICT (slug) DO NOTHING;

INSERT INTO t_product_colors (product_id, nama_warna, foto_url)
SELECT
  p.id,
  w.nama_warna,
  'https://placehold.co/800x800/' || w.latar || '/' || w.teks || '.png?text='
    || replace(p.nama || ' ' || w.nama_warna, ' ', '+')
FROM (VALUES
  ('ryze-velocity-3', 'Hitam', '111111', 'FFFFFF'),
  ('ryze-velocity-3', 'Putih', 'F2F2F2', '111111'),
  ('ryze-velocity-3', 'Merah', 'C8102E', 'FFFFFF'),
  ('ryze-stride-pro', 'Hitam', '111111', 'FFFFFF'),
  ('ryze-stride-pro', 'Oranye', 'E8590C', 'FFFFFF'),
  ('ryze-tempo-lite', 'Abu-abu', '8A8D91', 'FFFFFF'),
  ('ryze-tempo-lite', 'Biru Navy', '14284B', 'FFFFFF'),
  ('ryze-court-elite', 'Putih', 'F2F2F2', '111111'),
  ('ryze-court-elite', 'Hijau', '1F7A4D', 'FFFFFF'),
  ('ryze-apex-trainer', 'Hitam', '111111', 'FFFFFF'),
  ('ryze-apex-trainer', 'Abu-abu', '8A8D91', 'FFFFFF'),
  ('ryze-strike-hoop', 'Hitam', '111111', 'FFFFFF'),
  ('ryze-strike-hoop', 'Merah', 'C8102E', 'FFFFFF'),
  ('ryze-strike-hoop', 'Putih', 'F2F2F2', '111111'),
  ('ryze-urban-one', 'Putih', 'F2F2F2', '111111'),
  ('ryze-urban-one', 'Krem', 'E6DCC8', '111111'),
  ('ryze-drift-knit', 'Abu-abu', '8A8D91', 'FFFFFF'),
  ('ryze-drift-knit', 'Biru Navy', '14284B', 'FFFFFF'),
  ('ryze-canvas-low', 'Hitam', '111111', 'FFFFFF'),
  ('ryze-canvas-low', 'Krem', 'E6DCC8', '111111')
) AS w (product_slug, nama_warna, latar, teks)
JOIN t_products p ON p.slug = w.product_slug
ON CONFLICT (product_id, nama_warna) DO NOTHING;

-- Setiap warna punya semua ukuran. Stok dibuat bervariasi dari SKU (hasil selalu sama),
-- sebagian bernilai 0 agar tombol nonaktif saat stok habis bisa diuji.
INSERT INTO t_product_variants (color_id, ukuran, stok, sku)
SELECT
  v.color_id,
  v.ukuran,
  abs(hashtextextended(v.sku, 0)) % 13,
  v.sku
FROM (
  SELECT
    c.id AS color_id,
    u.ukuran,
    upper(p.slug || '-' || replace(c.nama_warna, ' ', '-') || '-' || u.ukuran) AS sku
  FROM t_product_colors c
  JOIN t_products p ON p.id = c.product_id
  CROSS JOIN unnest(ARRAY[39, 40, 41, 42, 42.5, 43, 44]) AS u (ukuran)
) v
ON CONFLICT DO NOTHING;
