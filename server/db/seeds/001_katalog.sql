-- Data katalog awal. Harga diambil dari halaman toko resmi dan marketplace Indonesia,
-- jadi hanya acuan dan bisa berbeda dari harga terbaru.
-- Deskripsi ditulis sendiri, bukan salinan dari situs merek.
-- Aman dijalankan ulang: data yang sudah ada tidak ditimpa, jadi stok dan harga hasil
-- perubahan aplikasi tetap utuh.
-- foto_url masih placeholder sampai foto asli di-upload ke Cloudinary.

INSERT INTO t_categories (nama, slug) VALUES
  ('Running', 'running'),
  ('Sport', 'sport'),
  ('Casual', 'casual')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO t_brands (nama, slug) VALUES
  ('Nike', 'nike'),
  ('adidas', 'adidas'),
  ('Puma', 'puma'),
  ('New Balance', 'new-balance'),
  ('ASICS', 'asics')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO t_products (nama, slug, deskripsi, harga, category_id, brand_id, segmen, is_trending)
SELECT p.nama, p.slug, p.deskripsi, p.harga, c.id, b.id, p.segmen::e_segmen, p.is_trending
FROM (VALUES
  ('Pegasus 41', 'nike-pegasus-41-pria', 'nike', 'running', 'PRIA', true, 2099000,
   'Sepatu lari harian serbaguna dengan bantalan empuk yang tetap responsif, cocok untuk latihan rutin maupun jarak jauh.'),
  ('Gel-Nimbus 27', 'asics-gel-nimbus-27-pria', 'asics', 'running', 'PRIA', false, 2599000,
   'Bantalan tebal untuk kenyamanan maksimal di jarak jauh, pilihan tepat bagi pelari yang mengutamakan peredam benturan.'),
  ('Ultraboost 5', 'adidas-ultraboost-5-pria', 'adidas', 'running', 'PRIA', false, 3000000,
   'Sol tengah yang memantul dengan upper rajut lentur, nyaman untuk lari santai maupun dipakai seharian.'),
  ('Metcon 10', 'nike-metcon-10-pria', 'nike', 'sport', 'PRIA', true, 2379000,
   'Dasar sol lebar dan stabil untuk angkat beban, dengan bantalan ringan yang tetap nyaman saat latihan intensitas tinggi.'),
  ('Dropset 4', 'adidas-dropset-4-pria', 'adidas', 'sport', 'PRIA', false, 2400000,
   'Sepatu latihan kokoh untuk sesi gym, menopang kaki saat beban berat dan tetap lentur untuk gerakan dinamis.'),
  ('Predator League Indoor', 'adidas-predator-league-indoor-pria', 'adidas', 'sport', 'PRIA', false, 1400000,
   'Sepatu futsal bersol karet untuk lapangan dalam ruangan, memberi cengkeraman dan kontrol bola yang baik.'),
  ('Samba OG', 'adidas-samba-og-pria', 'adidas', 'casual', 'PRIA', true, 2000000,
   'Siluet klasik bersol karet yang mudah dipadukan dengan gaya santai maupun rapi.'),
  ('550', 'new-balance-550-pria', 'new-balance', 'casual', 'PRIA', true, 1999000,
   'Sneakers bergaya retro dengan potongan rendah dan siluet tebal yang kuat untuk pemakaian sehari-hari.'),
  ('Suede Classic XXI', 'puma-suede-classic-xxi-pria', 'puma', 'casual', 'PRIA', false, 1299000,
   'Upper suede lembut dengan tampilan bersih, sepatu kasual sederhana yang cocok untuk berbagai kesempatan.'),
  ('Pegasus 41', 'nike-pegasus-41-wanita', 'nike', 'running', 'WANITA', false, 2099000,
   'Versi wanita dari sepatu lari harian yang serbaguna, empuk di setiap langkah dan responsif saat mempercepat tempo.'),
  ('Metcon 10', 'nike-metcon-10-wanita', 'nike', 'sport', 'WANITA', false, 2379000,
   'Stabil saat mengangkat beban dan cukup ringan untuk latihan interval, pasangan yang tepat untuk sesi gym.'),
  ('Air Force 1 ''07', 'nike-air-force-1-07-wanita', 'nike', 'casual', 'WANITA', true, 1729000,
   'Sneakers ikonik bersol tebal dengan tampilan bersih yang cocok dipadukan dengan pakaian apa pun.'),
  ('Samba OG', 'adidas-samba-og-wanita', 'adidas', 'casual', 'WANITA', true, 2000000,
   'Sepatu bergaya klasik dengan profil ramping yang mudah dipadukan untuk tampilan santai sehari-hari.'),
  ('Suede XL', 'puma-suede-xl-wanita', 'puma', 'casual', 'WANITA', false, 1659000,
   'Tampilan suede klasik dengan proporsi lebih besar dan tali lebar untuk gaya streetwear yang menonjol.'),
  ('Pegasus 42', 'nike-pegasus-42-anak', 'nike', 'running', 'ANAK', true, 1549000,
   'Sepatu lari untuk anak yang lebih besar, ringan dan empuk untuk bermain maupun olahraga di sekolah.'),
  ('Star Runner 5', 'nike-star-runner-5-anak', 'nike', 'running', 'ANAK', false, 769000,
   'Sepatu ringan untuk anak yang aktif, fleksibel mengikuti gerakan dan mudah dipakai setiap hari.'),
  ('Air Force 1', 'nike-air-force-1-anak', 'nike', 'casual', 'ANAK', true, 1219000,
   'Gaya sneakers klasik dalam ukuran anak, kokoh untuk aktivitas harian dan mudah dipadukan.')
) AS p (nama, slug, brand_slug, category_slug, segmen, is_trending, harga, deskripsi)
JOIN t_categories c ON c.slug = p.category_slug
JOIN t_brands b ON b.slug = p.brand_slug
ON CONFLICT (slug) DO NOTHING;

INSERT INTO t_product_colors (product_id, nama_warna, foto_url)
SELECT
  p.id,
  w.nama_warna,
  'https://placehold.co/800x800/' || w.latar || '/' || w.teks || '.png?text='
    || replace(b.nama || ' ' || p.nama || ' ' || w.nama_warna, ' ', '+')
FROM (VALUES
  ('Hitam', '111111', 'FFFFFF'),
  ('Putih', 'F2F2F2', '111111')
) AS w (nama_warna, latar, teks)
CROSS JOIN t_products p
JOIN t_brands b ON b.id = p.brand_id
ON CONFLICT (product_id, nama_warna) DO NOTHING;

-- Ukuran mengikuti segmen. Stok dibuat bervariasi dari SKU (hasil selalu sama),
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
    upper(p.slug || '-' || c.nama_warna || '-' || u.ukuran) AS sku
  FROM t_product_colors c
  JOIN t_products p ON p.id = c.product_id
  JOIN (VALUES
    ('PRIA'::e_segmen, ARRAY[40, 41, 42, 42.5, 43, 44, 45]::numeric[]),
    ('WANITA'::e_segmen, ARRAY[36, 37, 38, 39, 40, 41]::numeric[]),
    ('ANAK'::e_segmen, ARRAY[30, 31, 32, 33, 34, 35]::numeric[])
  ) AS s (segmen, ukuran_list) ON s.segmen = p.segmen
  CROSS JOIN LATERAL unnest(s.ukuran_list) AS u (ukuran)
) v
ON CONFLICT DO NOTHING;
