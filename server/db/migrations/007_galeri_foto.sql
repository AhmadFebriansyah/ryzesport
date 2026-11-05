-- Fitur 3D dihapus. Foto tambahan per warna dipakai untuk galeri di halaman detail,
-- dan foto utama tetap di t_product_colors.

ALTER TABLE t_products DROP COLUMN model_url;

CREATE TABLE t_product_photos (
  id              BIGSERIAL PRIMARY KEY,
  color_id        BIGINT NOT NULL REFERENCES t_product_colors (id) ON DELETE CASCADE,
  foto_url        TEXT NOT NULL,
  foto_kredit     TEXT NOT NULL,
  foto_kredit_url TEXT,
  foto_lisensi    TEXT NOT NULL,
  foto_sumber_url TEXT NOT NULL,
  urutan          INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (color_id, foto_url)
);

CREATE TRIGGER t_product_photos_set_updated_at
  BEFORE UPDATE ON t_product_photos
  FOR EACH ROW EXECUTE FUNCTION f_set_updated_at();
