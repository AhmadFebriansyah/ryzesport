-- Data katalog awal. Harga diambil dari halaman toko resmi dan marketplace Indonesia,
-- jadi hanya acuan dan bisa berbeda dari harga terbaru.
-- Deskripsi ditulis sendiri, bukan salinan dari situs merek.
-- Aman dijalankan ulang: data yang sudah ada tidak ditimpa, jadi stok dan harga hasil
-- perubahan aplikasi tetap utuh.
-- Foto dari Wikimedia Commons dan Pexels, disimpan di client/public/produk. Kredit tampil di /kredit-foto.

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
  product_id, nama_warna, foto_url, foto_ilustrasi, foto_kredit, foto_lisensi, foto_sumber_url, foto_kredit_url
)
SELECT p.id, w.nama_warna, w.foto_url, w.foto_ilustrasi, w.foto_kredit, w.foto_lisensi, w.foto_sumber_url, w.foto_kredit_url
FROM (VALUES
  ('nike-pegasus-41-pria', 'Abu-abu Merah', 'https://images.unsplash.com/photo-1739138053507-0f312a938451?ixid=M3wxMTI0MDAwfDB8MXxzZWFyY2h8Mnx8bmlrZSUyMHBlZ2FzdXN8ZW58MXx8fHwxNzkzODUzMjc2fDA&ixlib=rb-4.1.0&auto=format&fit=max&w=900&q=80', true, 'Zoshua Colah', 'Unsplash License', 'https://unsplash.com/photos/a-pair-of-sneakers-on-a-metal-stand-BRoqOFOrSuE?utm_source=ryzesport&utm_medium=referral', 'https://unsplash.com/@zoshuacolah?utm_source=ryzesport&utm_medium=referral'),
  ('nike-pegasus-41-wanita', 'Putih', 'https://images.unsplash.com/photo-1634316427425-722247ebe036?ixid=M3wxMTI0MDAwfDB8MXxzZWFyY2h8MXx8bmlrZSUyMGtpZHMlMjBzaG9lc3xlbnwxfHx8fDE3OTM4NTMyNzd8MA&ixlib=rb-4.1.0&auto=format&fit=max&w=900&q=80', true, 'David Chavez', 'Unsplash License', 'https://unsplash.com/photos/a-pair-of-white-and-black-shoes-on-a-white-surface-1Us_GlM9j-M?utm_source=ryzesport&utm_medium=referral', 'https://unsplash.com/@designsdavidc?utm_source=ryzesport&utm_medium=referral'),
  ('nike-pegasus-42-anak', 'Putih', 'https://images.unsplash.com/photo-1634316427425-722247ebe036?ixid=M3wxMTI0MDAwfDB8MXxzZWFyY2h8MXx8bmlrZSUyMGtpZHMlMjBzaG9lc3xlbnwxfHx8fDE3OTM4NTMyNzd8MA&ixlib=rb-4.1.0&auto=format&fit=max&w=900&q=80', true, 'David Chavez', 'Unsplash License', 'https://unsplash.com/photos/a-pair-of-white-and-black-shoes-on-a-white-surface-1Us_GlM9j-M?utm_source=ryzesport&utm_medium=referral', 'https://unsplash.com/@designsdavidc?utm_source=ryzesport&utm_medium=referral'),
  ('nike-star-runner-5-anak', 'Hitam', 'https://images.unsplash.com/photo-1611080027147-a1a0b6e05168?ixid=M3wxMTI0MDAwfDB8MXxzZWFyY2h8MTB8fG5pa2UlMjBtZXRjb258ZW58MXx8fHwxNzkzODUzMjc3fDA&ixlib=rb-4.1.0&auto=format&fit=max&w=900&q=80', true, 'Miquel Parera', 'Unsplash License', 'https://unsplash.com/photos/black-and-white-nike-athletic-shoes-on-brown-sand-xag0YpBqNfQ?utm_source=ryzesport&utm_medium=referral', 'https://unsplash.com/@miquel_parera_mila?utm_source=ryzesport&utm_medium=referral'),
  ('asics-gel-nimbus-27-pria', 'Biru Navy', 'https://images.unsplash.com/photo-1644001992668-3b9ed080533a?ixid=M3wxMTI0MDAwfDB8MXxzZWFyY2h8M3x8YXNpY3MlMjBnZWwlMjBuaW1idXN8ZW58MXx8fHwxNzkzODUzMjgxfDA&ixlib=rb-4.1.0&auto=format&fit=max&w=900&q=80', true, 'Gabre Cameron', 'Unsplash License', 'https://unsplash.com/photos/a-black-and-blue-shoe-with-orange-accents-Ux9KIBNO-rQ?utm_source=ryzesport&utm_medium=referral', 'https://unsplash.com/@gabrecameron?utm_source=ryzesport&utm_medium=referral'),
  ('asics-gel-nimbus-27-pria', 'Hijau', '/produk/px-8858120.jpg', true, 'Pexels', 'Pexels License', 'https://www.pexels.com/photo/green-and-blue-asics-running-shoes-8858120/', NULL),
  ('adidas-ultraboost-5-pria', 'Hitam', 'https://images.unsplash.com/photo-1547974009-6fb0db54c905?ixid=M3wxMTI0MDAwfDB8MXxzZWFyY2h8M3x8YWRpZGFzJTIwdWx0cmFib29zdHxlbnwxfHx8fDE3OTM4NTMyNzl8MA&ixlib=rb-4.1.0&auto=format&fit=max&w=900&q=80', true, 'Peng Originals', 'Unsplash License', 'https://unsplash.com/photos/black-adidas-ultra-boost-shoe-on-box-46t8J6BxKM0?utm_source=ryzesport&utm_medium=referral', 'https://unsplash.com/@ulsumaaron?utm_source=ryzesport&utm_medium=referral'),
  ('adidas-ultraboost-5-pria', 'Merah', 'https://images.unsplash.com/photo-1580902394724-b08ff9ba7e8a?ixid=M3wxMTI0MDAwfDB8MXxzZWFyY2h8Mnx8YWRpZGFzJTIwdWx0cmFib29zdHxlbnwxfHx8fDE3OTM4NTMyNzl8MA&ixlib=rb-4.1.0&auto=format&fit=max&w=900&q=80', true, 'Grailify', 'Unsplash License', 'https://unsplash.com/photos/red-and-blue-nike-athletic-shoe-ju4-jsQ8jmk?utm_source=ryzesport&utm_medium=referral', 'https://unsplash.com/@grailify?utm_source=ryzesport&utm_medium=referral'),
  ('nike-metcon-10-pria', 'Abu-abu', 'https://images.unsplash.com/photo-1740218142297-9088613fb3f7?ixid=M3wxMTI0MDAwfDB8MXxzZWFyY2h8NXx8bmlrZSUyMG1ldGNvbnxlbnwxfHx8fDE3OTM4NTMyNzd8MA&ixlib=rb-4.1.0&auto=format&fit=max&w=900&q=80', true, 'Christopher Kirk Dulalia', 'Unsplash License', 'https://unsplash.com/photos/a-close-up-of-a-shoe-on-the-ground-T1p0Jau1xDc?utm_source=ryzesport&utm_medium=referral', 'https://unsplash.com/@kirkdulalia?utm_source=ryzesport&utm_medium=referral'),
  ('nike-metcon-10-wanita', 'Hitam', 'https://images.unsplash.com/photo-1605408499391-6368c628ef42?ixid=M3wxMTI0MDAwfDB8MXxzZWFyY2h8MXx8bmlrZSUyMG1ldGNvbnxlbnwxfHx8fDE3OTM4NTMyNzd8MA&ixlib=rb-4.1.0&auto=format&fit=max&w=900&q=80', true, 'USAMA AKRAM', 'Unsplash License', 'https://unsplash.com/photos/black-and-white-nike-athletic-shoe-g3CMh2nqj_w?utm_source=ryzesport&utm_medium=referral', 'https://unsplash.com/@usama_1248?utm_source=ryzesport&utm_medium=referral'),
  ('adidas-predator-league-indoor-pria', 'Biru Merah', 'https://images.unsplash.com/photo-1612387605830-d452ad0ab7c2?ixid=M3wxMTI0MDAwfDB8MXxzZWFyY2h8NXx8YWRpZGFzJTIwcHJlZGF0b3J8ZW58MXx8fHwxNzkzODUzMjc4fDA&ixlib=rb-4.1.0&auto=format&fit=max&w=900&q=80', true, 'Braden Hopkins', 'Unsplash License', 'https://unsplash.com/photos/red-and-black-nike-athletic-shoes-s6y5jURGxkU?utm_source=ryzesport&utm_medium=referral', 'https://unsplash.com/@bradenh13?utm_source=ryzesport&utm_medium=referral'),
  ('adidas-samba-og-pria', 'Hitam', '/produk/samba-9.jpg', false, 'Pangalau', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Adidas_Samba.jpg', NULL),
  ('adidas-samba-og-pria', 'Putih', 'https://images.unsplash.com/photo-1718220130188-428c7dc27fd2?ixid=M3wxMTI0MDAwfDB8MXxzZWFyY2h8MXx8YWRpZGFzJTIwc2FtYmF8ZW58MXx8fHwxNzkzODUzMjc4fDA&ixlib=rb-4.1.0&auto=format&fit=max&w=900&q=80', false, 'Cris', 'Unsplash License', 'https://unsplash.com/photos/a-pair-of-white-and-black-shoes-on-a-wooden-floor-kpnkWLoM3cE?utm_source=ryzesport&utm_medium=referral', 'https://unsplash.com/@cris_23?utm_source=ryzesport&utm_medium=referral'),
  ('adidas-samba-og-wanita', 'Hitam', '/produk/samba-7.jpg', false, 'Ksharks2', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Adidas_Samba_original_sneaker_March-_2024.jpg', NULL),
  ('adidas-samba-og-wanita', 'Putih', 'https://images.unsplash.com/photo-1695552836001-e34239c9c9d4?ixid=M3wxMTI0MDAwfDB8MXxzZWFyY2h8M3x8YWRpZGFzJTIwc2FtYmF8ZW58MXx8fHwxNzkzODUzMjc4fDA&ixlib=rb-4.1.0&auto=format&fit=max&w=900&q=80', false, 'SJ', 'Unsplash License', 'https://unsplash.com/photos/a-pair-of-white-and-green-adidas-sneakers-j86izBICXHY?utm_source=ryzesport&utm_medium=referral', 'https://unsplash.com/@uxsj_ph?utm_source=ryzesport&utm_medium=referral'),
  ('new-balance-550-pria', 'Putih Marun', '/produk/nb550-10.jpg', false, 'LeDroider', 'CC0', 'https://commons.wikimedia.org/wiki/File:New_Balance_550.jpg', NULL),
  ('puma-suede-classic-xxi-pria', 'Hitam', '/produk/suede-3.jpg', false, 'LeDroider', 'CC0', 'https://commons.wikimedia.org/wiki/File:Puma_Suede.jpg', NULL),
  ('puma-suede-classic-xxi-pria', 'Merah', 'https://images.unsplash.com/photo-1626298051747-1ba4ff5cd5a1?ixid=M3wxMTI0MDAwfDB8MXxzZWFyY2h8N3x8cHVtYSUyMHN1ZWRlfGVufDF8fHx8MTc5Mzg1MzI4MHww&ixlib=rb-4.1.0&auto=format&fit=max&w=900&q=80', false, 'Maria Fernanda Pissioli', 'Unsplash License', 'https://unsplash.com/photos/red-and-white-nike-athletic-shoes-on-black-metal-bar-0SxStKdQ-iM?utm_source=ryzesport&utm_medium=referral', 'https://unsplash.com/@mxpissioli?utm_source=ryzesport&utm_medium=referral'),
  ('puma-suede-classic-wanita', 'Merah', 'https://images.unsplash.com/photo-1626298038175-e9f383124e1f?ixid=M3wxMTI0MDAwfDB8MXxzZWFyY2h8OHx8cHVtYSUyMHN1ZWRlfGVufDF8fHx8MTc5Mzg1MzI4MHww&ixlib=rb-4.1.0&auto=format&fit=max&w=900&q=80', false, 'Maria Fernanda Pissioli', 'Unsplash License', 'https://unsplash.com/photos/red-and-white-nike-athletic-shoes-VOpBKo48lq0?utm_source=ryzesport&utm_medium=referral', 'https://unsplash.com/@mxpissioli?utm_source=ryzesport&utm_medium=referral'),
  ('nike-air-force-1-07-wanita', 'Putih', '/produk/px-12611637.jpg', false, 'Pexels', 'Pexels License', 'https://www.pexels.com/photo/a-close-up-shot-of-a-nike-air-force-1-12611637/', NULL),
  ('nike-air-force-1-anak', 'Putih', '/produk/px-12611630.jpg', false, 'HamZa NOUASRIA', 'Pexels License', 'https://www.pexels.com/photo/a-white-nike-shoe-12611630/', NULL)
) AS w (product_slug, nama_warna, foto_url, foto_ilustrasi, foto_kredit, foto_lisensi, foto_sumber_url, foto_kredit_url)
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
