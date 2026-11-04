-- Skema awal RyzeSport.
-- Dijalankan oleh db/migrate.js dalam satu transaksi, jadi tidak perlu BEGIN/COMMIT di sini.

CREATE TYPE e_status_pesanan AS ENUM (
  'MENUNGGU_PEMBAYARAN',
  'DIBAYAR',
  'DIPROSES',
  'DIKIRIM',
  'SELESAI',
  'DIBATALKAN'
);

CREATE TYPE e_kurir AS ENUM ('JNT', 'JNE');

-- Simulasi saja, tidak ada payment gateway asli.
CREATE TYPE e_metode_bayar AS ENUM ('BCA', 'BRI', 'VIRTUAL_ACCOUNT');

CREATE FUNCTION f_set_updated_at() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Pengguna

CREATE TABLE t_users (
  id            BIGSERIAL PRIMARY KEY,
  -- Backend wajib menyimpan email dalam huruf kecil agar unik tanpa beda kapitalisasi.
  email         TEXT NOT NULL UNIQUE CHECK (email = lower(email)),
  password_hash TEXT NOT NULL,
  nama          TEXT NOT NULL,
  telepon       TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE t_addresses (
  id             BIGSERIAL PRIMARY KEY,
  user_id        BIGINT NOT NULL REFERENCES t_users (id) ON DELETE CASCADE,
  label          TEXT,
  nama_penerima  TEXT NOT NULL,
  telepon        TEXT NOT NULL,
  alamat_lengkap TEXT NOT NULL,
  is_default     BOOLEAN NOT NULL DEFAULT false,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX t_addresses_user_id_idx ON t_addresses (user_id);

-- Satu user hanya boleh punya satu alamat utama.
CREATE UNIQUE INDEX t_addresses_satu_default_idx ON t_addresses (user_id) WHERE is_default;

-- Katalog

CREATE TABLE t_categories (
  id         BIGSERIAL PRIMARY KEY,
  nama       TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE t_products (
  id          BIGSERIAL PRIMARY KEY,
  nama        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  deskripsi   TEXT,
  harga       INTEGER NOT NULL CHECK (harga >= 0),
  category_id BIGINT NOT NULL REFERENCES t_categories (id) ON DELETE RESTRICT,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX t_products_category_id_idx ON t_products (category_id);

CREATE TABLE t_product_colors (
  id         BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES t_products (id) ON DELETE CASCADE,
  nama_warna TEXT NOT NULL,
  foto_url   TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (product_id, nama_warna)
);

CREATE TABLE t_product_variants (
  id         BIGSERIAL PRIMARY KEY,
  color_id   BIGINT NOT NULL REFERENCES t_product_colors (id) ON DELETE CASCADE,
  -- NUMERIC agar mendukung setengah ukuran (42.5) dan terurut benar.
  ukuran     NUMERIC(3, 1) NOT NULL CHECK (ukuran > 0),
  -- CHECK ini pengaman terakhir agar stok tidak pernah minus saat checkout bersamaan.
  stok       INTEGER NOT NULL DEFAULT 0 CHECK (stok >= 0),
  sku        TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (color_id, ukuran)
);

-- Keranjang user yang sudah login

CREATE TABLE t_carts (
  id         BIGSERIAL PRIMARY KEY,
  user_id    BIGINT NOT NULL UNIQUE REFERENCES t_users (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE t_cart_items (
  id         BIGSERIAL PRIMARY KEY,
  cart_id    BIGINT NOT NULL REFERENCES t_carts (id) ON DELETE CASCADE,
  variant_id BIGINT NOT NULL REFERENCES t_product_variants (id) ON DELETE CASCADE,
  qty        INTEGER NOT NULL CHECK (qty > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Dipakai ON CONFLICT saat menggabungkan keranjang localStorage ke database.
  UNIQUE (cart_id, variant_id)
);

CREATE INDEX t_cart_items_variant_id_idx ON t_cart_items (variant_id);

-- Pesanan

CREATE TABLE t_orders (
  id               BIGSERIAL PRIMARY KEY,
  no_order         TEXT NOT NULL UNIQUE,
  -- RESTRICT: riwayat pesanan tidak boleh hilang saat akun dihapus.
  user_id          BIGINT NOT NULL REFERENCES t_users (id) ON DELETE RESTRICT,
  -- Salinan saat checkout, bukan FK: perubahan t_addresses tidak boleh mengubah pesanan lama.
  nama_penerima    TEXT NOT NULL,
  telepon_penerima TEXT NOT NULL,
  alamat_penerima  TEXT NOT NULL,
  kurir            e_kurir NOT NULL,
  metode_bayar     e_metode_bayar NOT NULL,
  no_resi          TEXT,
  total            INTEGER NOT NULL CHECK (total >= 0),
  status           e_status_pesanan NOT NULL DEFAULT 'MENUNGGU_PEMBAYARAN',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- SELESAI ikut dicek karena pesanan hanya bisa selesai setelah dikirim.
  CONSTRAINT t_orders_resi_wajib_saat_dikirim CHECK (
    status NOT IN ('DIKIRIM', 'SELESAI')
    OR (no_resi IS NOT NULL AND btrim(no_resi) <> '')
  )
);

-- Untuk menu "Pesanan Saya": daftar pesanan user, terbaru lebih dulu.
CREATE INDEX t_orders_user_id_created_at_idx ON t_orders (user_id, created_at DESC);

CREATE TABLE t_order_items (
  id              BIGSERIAL PRIMARY KEY,
  order_id        BIGINT NOT NULL REFERENCES t_orders (id) ON DELETE CASCADE,
  -- RESTRICT: varian yang pernah dibeli tidak bisa dihapus. Nonaktifkan produknya lewat is_active.
  variant_id      BIGINT NOT NULL REFERENCES t_product_variants (id) ON DELETE RESTRICT,
  qty             INTEGER NOT NULL CHECK (qty > 0),
  -- Snapshot harga, jangan ambil dari t_products.
  harga_saat_beli INTEGER NOT NULL CHECK (harga_saat_beli >= 0),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (order_id, variant_id)
);

CREATE INDEX t_order_items_variant_id_idx ON t_order_items (variant_id);

CREATE TABLE t_order_status_history (
  id         BIGSERIAL PRIMARY KEY,
  order_id   BIGINT NOT NULL REFERENCES t_orders (id) ON DELETE CASCADE,
  status     e_status_pesanan NOT NULL,
  catatan    TEXT,
  waktu      TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX t_order_status_history_order_id_waktu_idx
  ON t_order_status_history (order_id, waktu);

-- Trigger updated_at untuk semua tabel di atas

DO $$
DECLARE
  nama_tabel TEXT;
BEGIN
  FOREACH nama_tabel IN ARRAY ARRAY[
    't_users', 't_addresses', 't_categories', 't_products', 't_product_colors',
    't_product_variants', 't_carts', 't_cart_items', 't_orders', 't_order_items',
    't_order_status_history'
  ]
  LOOP
    EXECUTE format(
      'CREATE TRIGGER %I BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION f_set_updated_at()',
      nama_tabel || '_set_updated_at',
      nama_tabel
    );
  END LOOP;
END;
$$;
