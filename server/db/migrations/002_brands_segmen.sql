-- Konsep toko berubah menjadi multi-merek: tambah merek, segmen pembeli, dan penanda trending.

CREATE TYPE e_segmen AS ENUM ('PRIA', 'WANITA', 'ANAK');

CREATE TABLE t_brands (
  id         BIGSERIAL PRIMARY KEY,
  nama       TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER t_brands_set_updated_at
  BEFORE UPDATE ON t_brands
  FOR EACH ROW EXECUTE FUNCTION f_set_updated_at();

-- Katalog fiktif lama dibuang karena kolom baru wajib terisi. Warna dan varian ikut terhapus.
-- Jika sudah ada pesanan, FK RESTRICT di t_order_items menggagalkan migration ini.
DELETE FROM t_products;

ALTER TABLE t_products
  ADD COLUMN brand_id    BIGINT NOT NULL REFERENCES t_brands (id) ON DELETE RESTRICT,
  ADD COLUMN segmen      e_segmen NOT NULL,
  ADD COLUMN is_trending BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX t_products_brand_id_idx ON t_products (brand_id);
