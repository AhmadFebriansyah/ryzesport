-- Foto produk asli menggantikan placeholder. Warna katalog disesuaikan dengan foto yang tersedia.

-- Warna lama dibuang bersama katalognya karena nama warnanya tidak sesuai foto.
-- Jika sudah ada pesanan, FK RESTRICT di t_order_items menggagalkan migration ini.
DELETE FROM t_products;

ALTER TABLE t_product_colors
  -- true jika foto memakai seri atau model lain, sehingga UI wajib memberi label.
  ADD COLUMN foto_ilustrasi  BOOLEAN NOT NULL DEFAULT false,
  -- Lisensi foto mewajibkan kredit penulis, lisensi, dan sumber.
  ADD COLUMN foto_kredit     TEXT NOT NULL,
  ADD COLUMN foto_lisensi    TEXT NOT NULL,
  ADD COLUMN foto_sumber_url TEXT NOT NULL;
