import { randomBytes } from 'node:crypto';
import { query, withTransaction } from '../db/pool.js';

const TELEPON_PATTERN = /^[0-9+\-\s]{8,20}$/;
const KURIR = ['JNT', 'JNE'];
const METODE_BAYAR = ['BCA', 'BRI', 'MANDIRI', 'BSI', 'QRIS'];

class CheckoutError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const isText = (value, min, max) =>
  typeof value === 'string' && value.trim().length >= min && value.trim().length <= max;

function validateCheckout({ nama_penerima, telepon, alamat, kurir, metode_bayar }) {
  if (!isText(nama_penerima, 2, 100)) return 'Nama penerima harus 2 sampai 100 karakter.';
  if (typeof telepon !== 'string' || !TELEPON_PATTERN.test(telepon)) {
    return 'Format nomor telepon tidak valid.';
  }
  if (!isText(alamat, 10, 500)) return 'Alamat lengkap harus 10 sampai 500 karakter.';
  if (!KURIR.includes(kurir)) return 'Pilih kurir yang tersedia.';
  if (!METODE_BAYAR.includes(metode_bayar)) return 'Pilih metode pembayaran yang tersedia.';
  return null;
}

function generateNoOrder() {
  const tanggal = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  return `RS-${tanggal}-${randomBytes(4).toString('hex').toUpperCase()}`;
}

async function placeOrder(client, userId, form) {
  // Mengunci keranjang mencegah klik ganda membuat dua pesanan.
  const { rows: carts } = await client.query(
    'SELECT id FROM t_carts WHERE user_id = $1 FOR UPDATE',
    [userId],
  );
  if (carts.length === 0) {
    throw new CheckoutError(400, 'Keranjangmu masih kosong.');
  }
  const cartId = carts[0].id;

  // Varian dikunci berurutan id agar dua checkout bersamaan tidak saling menunggu (deadlock).
  const { rows: items } = await client.query(
    `SELECT
       v.id AS variant_id,
       v.ukuran::float AS ukuran,
       v.stok,
       ci.qty,
       p.harga,
       p.is_active,
       b.nama || ' ' || p.nama AS nama
     FROM t_cart_items ci
     JOIN t_product_variants v ON v.id = ci.variant_id
     JOIN t_product_colors pc ON pc.id = v.color_id
     JOIN t_products p ON p.id = pc.product_id
     JOIN t_brands b ON b.id = p.brand_id
     WHERE ci.cart_id = $1
     ORDER BY v.id
     FOR UPDATE OF v`,
    [cartId],
  );
  if (items.length === 0) {
    throw new CheckoutError(400, 'Keranjangmu masih kosong.');
  }

  const kurang = items.find((item) => !item.is_active || item.stok < item.qty);
  if (kurang) {
    throw new CheckoutError(
      409,
      `Stok ${kurang.nama} ukuran ${kurang.ukuran} tidak cukup. Tersisa ${kurang.is_active ? kurang.stok : 0}.`,
    );
  }

  const total = items.reduce((sum, item) => sum + item.harga * item.qty, 0);
  const noOrder = generateNoOrder();
  const ids = items.map((item) => item.variant_id);
  const qtys = items.map((item) => item.qty);

  const { rows: orders } = await client.query(
    `INSERT INTO t_orders (
       no_order, user_id, nama_penerima, telepon_penerima, alamat_penerima, kurir, metode_bayar, total
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id`,
    [
      noOrder,
      userId,
      form.nama_penerima.trim(),
      form.telepon.trim(),
      form.alamat.trim(),
      form.kurir,
      form.metode_bayar,
      total,
    ],
  );
  const orderId = orders[0].id;

  await client.query(
    `INSERT INTO t_order_items (order_id, variant_id, qty, harga_saat_beli)
     SELECT $1, i.variant_id, i.qty, i.harga
     FROM unnest($2::bigint[], $3::int[], $4::int[]) AS i (variant_id, qty, harga)`,
    [orderId, ids, qtys, items.map((item) => item.harga)],
  );

  await client.query(
    `UPDATE t_product_variants v
     SET stok = v.stok - i.qty
     FROM unnest($1::bigint[], $2::int[]) AS i (variant_id, qty)
     WHERE v.id = i.variant_id`,
    [ids, qtys],
  );

  await client.query(
    `INSERT INTO t_order_status_history (order_id, status, catatan)
     VALUES ($1, 'MENUNGGU_PEMBAYARAN', 'Pesanan dibuat')`,
    [orderId],
  );

  await client.query('DELETE FROM t_cart_items WHERE cart_id = $1', [cartId]);

  return { no_order: noOrder, total };
}

export async function createOrder(req, res) {
  const form = req.body ?? {};
  const message = validateCheckout(form);
  if (message) {
    return res.status(400).json({ message });
  }

  try {
    const order = await withTransaction((client) => placeOrder(client, req.userId, form));
    return res.status(201).json({ data: order });
  } catch (err) {
    if (err instanceof CheckoutError) {
      return res.status(err.status).json({ message: err.message });
    }
    throw err;
  }
}

const NO_ORDER_PATTERN = /^RS-\d{8}-[0-9A-F]{8}$/;
const MAX_PESANAN = 50;

// Satu kueri untuk semua pesanan, agar daftar tidak menjalankan kueri per pesanan.
async function readItems(orderIds) {
  const { rows } = await query(
    `SELECT
       oi.id,
       oi.order_id,
       oi.qty,
       oi.harga_saat_beli,
       v.ukuran::float AS ukuran,
       pc.nama_warna,
       pc.foto_url,
       p.slug,
       b.nama || ' ' || p.nama AS nama
     FROM t_order_items oi
     JOIN t_product_variants v ON v.id = oi.variant_id
     JOIN t_product_colors pc ON pc.id = v.color_id
     JOIN t_products p ON p.id = pc.product_id
     JOIN t_brands b ON b.id = p.brand_id
     WHERE oi.order_id = ANY($1::bigint[])
     ORDER BY oi.id`,
    [orderIds],
  );

  const items = new Map();
  for (const { order_id: orderId, ...item } of rows) {
    items.set(orderId, [...(items.get(orderId) ?? []), item]);
  }
  return items;
}

export async function listOrders(req, res) {
  const { rows } = await query(
    `SELECT id, no_order, status, total, no_resi, created_at
     FROM t_orders
     WHERE user_id = $1
     ORDER BY created_at DESC, id DESC
     LIMIT $2`,
    [req.userId, MAX_PESANAN],
  );
  const items = await readItems(rows.map((order) => order.id));

  res.json({
    data: rows.map(({ id, ...order }) => ({ ...order, items: items.get(id) ?? [] })),
  });
}

export async function getOrder(req, res) {
  const { noOrder } = req.params;

  if (!NO_ORDER_PATTERN.test(noOrder)) {
    return res.status(400).json({ message: 'Nomor pesanan tidak valid.' });
  }

  // Pesanan milik user lain dijawab 404, agar keberadaannya tidak terbongkar.
  const { rows } = await query(
    `SELECT
       id, no_order, status, total, no_resi, kurir, metode_bayar,
       nama_penerima, telepon_penerima, alamat_penerima, created_at
     FROM t_orders
     WHERE no_order = $1 AND user_id = $2`,
    [noOrder, req.userId],
  );
  if (rows.length === 0) {
    return res.status(404).json({ message: 'Pesanan tidak ditemukan.' });
  }

  const { id, ...order } = rows[0];
  const [items, riwayat] = await Promise.all([
    readItems([id]),
    query(
      `SELECT id, status, catatan, waktu
       FROM t_order_status_history
       WHERE order_id = $1
       ORDER BY waktu, id`,
      [id],
    ),
  ]);

  return res.json({
    data: { ...order, items: items.get(id) ?? [], riwayat: riwayat.rows },
  });
}
