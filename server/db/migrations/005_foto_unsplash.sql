-- Foto produk diganti dengan foto Unsplash yang lebih bagus.
-- Foto ditampilkan langsung dari images.unsplash.com sesuai panduan API Unsplash, dan kredit
-- fotografer wajib memuat tautan, jadi ada kolom baru untuk tautannya.
-- Hanya mengubah data foto dan nama warna, jadi pesanan dan stok tetap utuh.

ALTER TABLE t_product_colors ADD COLUMN foto_kredit_url TEXT;

-- SKU mengikuti warna yang namanya berubah. Dijalankan sebelum nama warnanya diubah.
UPDATE t_product_variants v
SET sku = replace(v.sku, '-PUTIH-', '-ABU-ABU-MERAH-')
FROM t_product_colors pc
JOIN t_products p ON p.id = pc.product_id
WHERE pc.id = v.color_id AND p.slug = 'nike-pegasus-41-pria' AND pc.nama_warna = 'Putih';

UPDATE t_product_variants v
SET sku = replace(v.sku, '-ABU-ABU-', '-HITAM-')
FROM t_product_colors pc
JOIN t_products p ON p.id = pc.product_id
WHERE pc.id = v.color_id AND p.slug = 'nike-metcon-10-wanita' AND pc.nama_warna = 'Abu-abu';

UPDATE t_product_variants v
SET sku = replace(v.sku, '-HITAM-BIRU-', '-BIRU-MERAH-')
FROM t_product_colors pc
JOIN t_products p ON p.id = pc.product_id
WHERE pc.id = v.color_id AND p.slug = 'adidas-predator-league-indoor-pria' AND pc.nama_warna = 'Hitam Biru';

UPDATE t_product_colors pc
SET nama_warna = w.warna_baru,
    foto_url = w.foto_url,
    foto_ilustrasi = w.foto_ilustrasi,
    foto_kredit = w.foto_kredit,
    foto_kredit_url = w.foto_kredit_url,
    foto_lisensi = 'Unsplash License',
    foto_sumber_url = w.foto_sumber_url
FROM t_products p
JOIN (VALUES
  ('nike-pegasus-41-pria', 'Putih', 'Abu-abu Merah', 'https://images.unsplash.com/photo-1739138053507-0f312a938451?ixid=M3wxMTI0MDAwfDB8MXxzZWFyY2h8Mnx8bmlrZSUyMHBlZ2FzdXN8ZW58MXx8fHwxNzkzODUzMjc2fDA&ixlib=rb-4.1.0&auto=format&fit=max&w=900&q=80', true, 'Zoshua Colah', 'https://unsplash.com/@zoshuacolah?utm_source=ryzesport&utm_medium=referral', 'https://unsplash.com/photos/a-pair-of-sneakers-on-a-metal-stand-BRoqOFOrSuE?utm_source=ryzesport&utm_medium=referral'),
  ('nike-pegasus-41-wanita', 'Putih', 'Putih', 'https://images.unsplash.com/photo-1634316427425-722247ebe036?ixid=M3wxMTI0MDAwfDB8MXxzZWFyY2h8MXx8bmlrZSUyMGtpZHMlMjBzaG9lc3xlbnwxfHx8fDE3OTM4NTMyNzd8MA&ixlib=rb-4.1.0&auto=format&fit=max&w=900&q=80', true, 'David Chavez', 'https://unsplash.com/@designsdavidc?utm_source=ryzesport&utm_medium=referral', 'https://unsplash.com/photos/a-pair-of-white-and-black-shoes-on-a-white-surface-1Us_GlM9j-M?utm_source=ryzesport&utm_medium=referral'),
  ('nike-pegasus-42-anak', 'Putih', 'Putih', 'https://images.unsplash.com/photo-1634316427425-722247ebe036?ixid=M3wxMTI0MDAwfDB8MXxzZWFyY2h8MXx8bmlrZSUyMGtpZHMlMjBzaG9lc3xlbnwxfHx8fDE3OTM4NTMyNzd8MA&ixlib=rb-4.1.0&auto=format&fit=max&w=900&q=80', true, 'David Chavez', 'https://unsplash.com/@designsdavidc?utm_source=ryzesport&utm_medium=referral', 'https://unsplash.com/photos/a-pair-of-white-and-black-shoes-on-a-white-surface-1Us_GlM9j-M?utm_source=ryzesport&utm_medium=referral'),
  ('nike-star-runner-5-anak', 'Hitam', 'Hitam', 'https://images.unsplash.com/photo-1611080027147-a1a0b6e05168?ixid=M3wxMTI0MDAwfDB8MXxzZWFyY2h8MTB8fG5pa2UlMjBtZXRjb258ZW58MXx8fHwxNzkzODUzMjc3fDA&ixlib=rb-4.1.0&auto=format&fit=max&w=900&q=80', true, 'Miquel Parera', 'https://unsplash.com/@miquel_parera_mila?utm_source=ryzesport&utm_medium=referral', 'https://unsplash.com/photos/black-and-white-nike-athletic-shoes-on-brown-sand-xag0YpBqNfQ?utm_source=ryzesport&utm_medium=referral'),
  ('asics-gel-nimbus-27-pria', 'Biru Navy', 'Biru Navy', 'https://images.unsplash.com/photo-1644001992668-3b9ed080533a?ixid=M3wxMTI0MDAwfDB8MXxzZWFyY2h8M3x8YXNpY3MlMjBnZWwlMjBuaW1idXN8ZW58MXx8fHwxNzkzODUzMjgxfDA&ixlib=rb-4.1.0&auto=format&fit=max&w=900&q=80', true, 'Gabre Cameron', 'https://unsplash.com/@gabrecameron?utm_source=ryzesport&utm_medium=referral', 'https://unsplash.com/photos/a-black-and-blue-shoe-with-orange-accents-Ux9KIBNO-rQ?utm_source=ryzesport&utm_medium=referral'),
  ('adidas-ultraboost-5-pria', 'Hitam', 'Hitam', 'https://images.unsplash.com/photo-1547974009-6fb0db54c905?ixid=M3wxMTI0MDAwfDB8MXxzZWFyY2h8M3x8YWRpZGFzJTIwdWx0cmFib29zdHxlbnwxfHx8fDE3OTM4NTMyNzl8MA&ixlib=rb-4.1.0&auto=format&fit=max&w=900&q=80', true, 'Peng Originals', 'https://unsplash.com/@ulsumaaron?utm_source=ryzesport&utm_medium=referral', 'https://unsplash.com/photos/black-adidas-ultra-boost-shoe-on-box-46t8J6BxKM0?utm_source=ryzesport&utm_medium=referral'),
  ('adidas-ultraboost-5-pria', 'Merah', 'Merah', 'https://images.unsplash.com/photo-1580902394724-b08ff9ba7e8a?ixid=M3wxMTI0MDAwfDB8MXxzZWFyY2h8Mnx8YWRpZGFzJTIwdWx0cmFib29zdHxlbnwxfHx8fDE3OTM4NTMyNzl8MA&ixlib=rb-4.1.0&auto=format&fit=max&w=900&q=80', true, 'Grailify', 'https://unsplash.com/@grailify?utm_source=ryzesport&utm_medium=referral', 'https://unsplash.com/photos/red-and-blue-nike-athletic-shoe-ju4-jsQ8jmk?utm_source=ryzesport&utm_medium=referral'),
  ('nike-metcon-10-pria', 'Abu-abu', 'Abu-abu', 'https://images.unsplash.com/photo-1740218142297-9088613fb3f7?ixid=M3wxMTI0MDAwfDB8MXxzZWFyY2h8NXx8bmlrZSUyMG1ldGNvbnxlbnwxfHx8fDE3OTM4NTMyNzd8MA&ixlib=rb-4.1.0&auto=format&fit=max&w=900&q=80', true, 'Christopher Kirk Dulalia', 'https://unsplash.com/@kirkdulalia?utm_source=ryzesport&utm_medium=referral', 'https://unsplash.com/photos/a-close-up-of-a-shoe-on-the-ground-T1p0Jau1xDc?utm_source=ryzesport&utm_medium=referral'),
  ('nike-metcon-10-wanita', 'Abu-abu', 'Hitam', 'https://images.unsplash.com/photo-1605408499391-6368c628ef42?ixid=M3wxMTI0MDAwfDB8MXxzZWFyY2h8MXx8bmlrZSUyMG1ldGNvbnxlbnwxfHx8fDE3OTM4NTMyNzd8MA&ixlib=rb-4.1.0&auto=format&fit=max&w=900&q=80', true, 'USAMA AKRAM', 'https://unsplash.com/@usama_1248?utm_source=ryzesport&utm_medium=referral', 'https://unsplash.com/photos/black-and-white-nike-athletic-shoe-g3CMh2nqj_w?utm_source=ryzesport&utm_medium=referral'),
  ('adidas-predator-league-indoor-pria', 'Hitam Biru', 'Biru Merah', 'https://images.unsplash.com/photo-1612387605830-d452ad0ab7c2?ixid=M3wxMTI0MDAwfDB8MXxzZWFyY2h8NXx8YWRpZGFzJTIwcHJlZGF0b3J8ZW58MXx8fHwxNzkzODUzMjc4fDA&ixlib=rb-4.1.0&auto=format&fit=max&w=900&q=80', true, 'Braden Hopkins', 'https://unsplash.com/@bradenh13?utm_source=ryzesport&utm_medium=referral', 'https://unsplash.com/photos/red-and-black-nike-athletic-shoes-s6y5jURGxkU?utm_source=ryzesport&utm_medium=referral'),
  ('adidas-samba-og-pria', 'Putih', 'Putih', 'https://images.unsplash.com/photo-1718220130188-428c7dc27fd2?ixid=M3wxMTI0MDAwfDB8MXxzZWFyY2h8MXx8YWRpZGFzJTIwc2FtYmF8ZW58MXx8fHwxNzkzODUzMjc4fDA&ixlib=rb-4.1.0&auto=format&fit=max&w=900&q=80', false, 'Cris', 'https://unsplash.com/@cris_23?utm_source=ryzesport&utm_medium=referral', 'https://unsplash.com/photos/a-pair-of-white-and-black-shoes-on-a-wooden-floor-kpnkWLoM3cE?utm_source=ryzesport&utm_medium=referral'),
  ('adidas-samba-og-wanita', 'Putih', 'Putih', 'https://images.unsplash.com/photo-1695552836001-e34239c9c9d4?ixid=M3wxMTI0MDAwfDB8MXxzZWFyY2h8M3x8YWRpZGFzJTIwc2FtYmF8ZW58MXx8fHwxNzkzODUzMjc4fDA&ixlib=rb-4.1.0&auto=format&fit=max&w=900&q=80', false, 'SJ', 'https://unsplash.com/@uxsj_ph?utm_source=ryzesport&utm_medium=referral', 'https://unsplash.com/photos/a-pair-of-white-and-green-adidas-sneakers-j86izBICXHY?utm_source=ryzesport&utm_medium=referral'),
  ('puma-suede-classic-xxi-pria', 'Merah', 'Merah', 'https://images.unsplash.com/photo-1626298051747-1ba4ff5cd5a1?ixid=M3wxMTI0MDAwfDB8MXxzZWFyY2h8N3x8cHVtYSUyMHN1ZWRlfGVufDF8fHx8MTc5Mzg1MzI4MHww&ixlib=rb-4.1.0&auto=format&fit=max&w=900&q=80', false, 'Maria Fernanda Pissioli', 'https://unsplash.com/@mxpissioli?utm_source=ryzesport&utm_medium=referral', 'https://unsplash.com/photos/red-and-white-nike-athletic-shoes-on-black-metal-bar-0SxStKdQ-iM?utm_source=ryzesport&utm_medium=referral'),
  ('puma-suede-classic-wanita', 'Merah', 'Merah', 'https://images.unsplash.com/photo-1626298038175-e9f383124e1f?ixid=M3wxMTI0MDAwfDB8MXxzZWFyY2h8OHx8cHVtYSUyMHN1ZWRlfGVufDF8fHx8MTc5Mzg1MzI4MHww&ixlib=rb-4.1.0&auto=format&fit=max&w=900&q=80', false, 'Maria Fernanda Pissioli', 'https://unsplash.com/@mxpissioli?utm_source=ryzesport&utm_medium=referral', 'https://unsplash.com/photos/red-and-white-nike-athletic-shoes-VOpBKo48lq0?utm_source=ryzesport&utm_medium=referral')
) AS w (slug, warna_lama, warna_baru, foto_url, foto_ilustrasi, foto_kredit, foto_kredit_url, foto_sumber_url)
  ON w.slug = p.slug
WHERE p.id = pc.product_id AND pc.nama_warna = w.warna_lama;
