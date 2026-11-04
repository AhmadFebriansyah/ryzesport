-- Data katalog awal. Harga diambil dari halaman toko resmi dan marketplace Indonesia,
-- jadi hanya acuan dan bisa berbeda dari harga terbaru.
-- Deskripsi ditulis sendiri, bukan salinan dari situs merek.
-- Aman dijalankan ulang: data yang sudah ada tidak ditimpa, jadi stok dan harga hasil
-- perubahan aplikasi tetap utuh.
-- Foto dari Wikimedia Commons, disimpan di client/public/produk. Kredit tampil di /kredit-foto.

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
  ('Suede Classic', 'puma-suede-classic-wanita', 'puma', 'casual', 'WANITA', false, 1299000,
   'Upper suede lembut dengan garis samping yang khas, sepatu kasual klasik untuk gaya santai sehari-hari.'),
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

INSERT INTO t_product_colors (
  product_id, nama_warna, foto_url, foto_ilustrasi, foto_kredit, foto_lisensi, foto_sumber_url
)
SELECT p.id, w.nama_warna, w.foto_url, w.foto_ilustrasi, w.foto_kredit, w.foto_lisensi, w.foto_sumber_url
FROM (VALUES
  ('nike-pegasus-41-pria', 'Putih', '/produk/pegasus-1.jpg', true, 'Ssu', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Nike_Zoom_Pegasus_38_running_shoe.jpg'),
  ('nike-pegasus-41-wanita', 'Putih', '/produk/pegasus-1.jpg', true, 'Ssu', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Nike_Zoom_Pegasus_38_running_shoe.jpg'),
  ('nike-pegasus-42-anak', 'Putih', '/produk/pegasus-1.jpg', true, 'Ssu', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Nike_Zoom_Pegasus_38_running_shoe.jpg'),
  ('nike-star-runner-5-anak', 'Hitam', '/produk/pegasus-0.jpg', true, 'GautamSudhanshu', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Nike_Running_Shoes.jpg'),
  ('asics-gel-nimbus-27-pria', 'Biru Navy', '/produk/nimbus-8.jpg', true, 'Petar Milošević', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Asics_Gel-Cumulus_22.jpg'),
  ('asics-gel-nimbus-27-pria', 'Putih', '/produk/nimbus-11.jpg', true, 'LeDroider', 'CC0', 'https://commons.wikimedia.org/wiki/File:Asics_GT-2160.jpg'),
  ('adidas-ultraboost-5-pria', 'Hitam', '/produk/ultraboost-3.jpg', true, 'Dough4872', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Adidas_Ultra_Boost_4_running_shoes.jpeg'),
  ('adidas-ultraboost-5-pria', 'Merah', '/produk/ultraboost-5.jpg', true, 'Wet Af', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Adidas_Ultra_Boost_2015_model_.jpg'),
  ('nike-metcon-10-pria', 'Abu-abu', '/produk/metcon-0.jpg', true, 'ajay_suresh', 'CC BY 2.0', 'https://commons.wikimedia.org/wiki/File:Gym_Shoes_-_Nike_Metcon_(51080442242).jpg'),
  ('nike-metcon-10-wanita', 'Abu-abu', '/produk/metcon-0.jpg', true, 'ajay_suresh', 'CC BY 2.0', 'https://commons.wikimedia.org/wiki/File:Gym_Shoes_-_Nike_Metcon_(51080442242).jpg'),
  ('adidas-predator-league-indoor-pria', 'Hitam Biru', '/produk/predator-10.jpg', true, 'Pangalau', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Adidas_Predator_AdiPower_Firm_Ground_(Robin_van_Persie)_01.jpg'),
  ('adidas-samba-og-pria', 'Hitam', '/produk/samba-9.jpg', false, 'Pangalau', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Adidas_Samba.jpg'),
  ('adidas-samba-og-pria', 'Putih', '/produk/samba-10.jpg', false, 'LeDroider', 'CC0', 'https://commons.wikimedia.org/wiki/File:Adidas_Samba_OG.jpg'),
  ('adidas-samba-og-wanita', 'Hitam', '/produk/samba-7.jpg', false, 'Ksharks2', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Adidas_Samba_original_sneaker_March-_2024.jpg'),
  ('adidas-samba-og-wanita', 'Putih', '/produk/samba-8.jpg', false, 'Ksharks2', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Adidas_Samba_In_White_March_2024.jpg'),
  ('new-balance-550-pria', 'Putih Marun', '/produk/nb550-10.jpg', false, 'LeDroider', 'CC0', 'https://commons.wikimedia.org/wiki/File:New_Balance_550.jpg'),
  ('puma-suede-classic-xxi-pria', 'Hitam', '/produk/suede-3.jpg', false, 'LeDroider', 'CC0', 'https://commons.wikimedia.org/wiki/File:Puma_Suede.jpg'),
  ('puma-suede-classic-xxi-pria', 'Merah', '/produk/suede-2.jpg', false, 'DavidIvar', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Puma_suede_red.jpg'),
  ('puma-suede-classic-wanita', 'Merah', '/produk/suede-1.jpg', false, 'Vincent van der Heijden', 'CC BY 2.0', 'https://commons.wikimedia.org/wiki/File:Puma_shoes.jpg'),
  ('nike-air-force-1-07-wanita', 'Putih', '/produk/af1-0.jpg', false, 'Juicyfroot', 'CC BY-SA 3.0', 'https://commons.wikimedia.org/wiki/File:NikeAirForceOne07.jpg'),
  ('nike-air-force-1-anak', 'Putih', '/produk/af1-10.jpg', false, 'Fallout86453', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Nike_Air_Force_1%27s.jpg')
) AS w (product_slug, nama_warna, foto_url, foto_ilustrasi, foto_kredit, foto_lisensi, foto_sumber_url)
JOIN t_products p ON p.slug = w.product_slug
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
    upper(p.slug || '-' || replace(c.nama_warna, ' ', '-') || '-' || u.ukuran) AS sku
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
