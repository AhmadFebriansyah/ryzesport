-- Foto Air Force 1 dan ASICS diganti dengan foto Pexels yang lebih bagus.
-- Hanya mengubah data foto, jadi pesanan dan stok tetap utuh. Tidak berdampak pada database baru,
-- karena seed sudah memakai foto ini.

UPDATE t_product_colors pc
SET foto_url = '/produk/px-12611637.jpg',
    foto_ilustrasi = false,
    foto_kredit = 'Pexels',
    foto_lisensi = 'Pexels License',
    foto_sumber_url = 'https://www.pexels.com/photo/a-close-up-shot-of-a-nike-air-force-1-12611637/'
FROM t_products p
WHERE p.id = pc.product_id AND p.slug = 'nike-air-force-1-07-wanita' AND pc.nama_warna = 'Putih';

UPDATE t_product_colors pc
SET foto_url = '/produk/px-12611630.jpg',
    foto_ilustrasi = false,
    foto_kredit = 'HamZa NOUASRIA',
    foto_lisensi = 'Pexels License',
    foto_sumber_url = 'https://www.pexels.com/photo/a-white-nike-shoe-12611630/'
FROM t_products p
WHERE p.id = pc.product_id AND p.slug = 'nike-air-force-1-anak' AND pc.nama_warna = 'Putih';

-- Warna mengikuti foto baru, dan SKU mengikuti warnanya.
UPDATE t_product_variants v
SET sku = replace(v.sku, '-PUTIH-', '-HIJAU-')
FROM t_product_colors pc
JOIN t_products p ON p.id = pc.product_id
WHERE pc.id = v.color_id AND p.slug = 'asics-gel-nimbus-27-pria' AND pc.nama_warna = 'Putih';

UPDATE t_product_colors pc
SET nama_warna = 'Hijau',
    foto_url = '/produk/px-8858120.jpg',
    foto_ilustrasi = true,
    foto_kredit = 'Pexels',
    foto_lisensi = 'Pexels License',
    foto_sumber_url = 'https://www.pexels.com/photo/green-and-blue-asics-running-shoes-8858120/'
FROM t_products p
WHERE p.id = pc.product_id AND p.slug = 'asics-gel-nimbus-27-pria' AND pc.nama_warna = 'Putih';
