-- Beranda menampilkan produk unggulan. model_url menunjuk file 3D milik produk itu sendiri,
-- dan kosong berarti produk hanya punya foto.

ALTER TABLE t_products
  ADD COLUMN is_unggulan BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN model_url TEXT;

UPDATE t_products
SET is_unggulan = true
WHERE slug IN (
  'nike-air-force-1-07-wanita',
  'adidas-samba-og-pria',
  'puma-suede-classic-xxi-pria',
  'new-balance-550-pria'
);
