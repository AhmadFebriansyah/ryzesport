import { query, withTransaction } from '../db/pool.js';

const ID_PATTERN = /^[1-9]\d{0,17}$/;
const MAX_ITEMS = 100;
const MAX_QTY = 99;

// Mengembalikan null jika input tidak valid. Varian yang sama digabung jumlahnya.
function parseItems(items) {
  if (!Array.isArray(items) || items.length > MAX_ITEMS) return null;

  const totals = new Map();
  for (const item of items) {
    const { variantId, qty } = item ?? {};
    if (typeof variantId !== 'string' || !ID_PATTERN.test(variantId)) return null;
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) return null;
    totals.set(variantId, (totals.get(variantId) ?? 0) + qty);
  }
  return { ids: [...totals.keys()], qtys: [...totals.values()] };
}

async function ensureCart(client, userId) {
  const { rows } = await client.query(
    `INSERT INTO t_carts (user_id) VALUES ($1)
     ON CONFLICT (user_id) DO UPDATE SET updated_at = now()
     RETURNING id`,
    [userId],
  );
  return rows[0].id;
}

// Hanya varian aktif yang masih punya stok yang masuk, dan jumlahnya dibatasi stok.
async function insertItems(client, cartId, { ids, qtys }) {
  await client.query(
    `INSERT INTO t_cart_items (cart_id, variant_id, qty)
     SELECT $1, v.id, LEAST(i.qty, v.stok)
     FROM unnest($2::bigint[], $3::int[]) AS i (variant_id, qty)
     JOIN t_product_variants v ON v.id = i.variant_id
     JOIN t_product_colors pc ON pc.id = v.color_id
     JOIN t_products p ON p.id = pc.product_id
     WHERE p.is_active AND v.stok > 0
     ON CONFLICT (cart_id, variant_id) DO UPDATE
       SET qty = LEAST(
         t_cart_items.qty + EXCLUDED.qty,
         (SELECT stok FROM t_product_variants WHERE id = EXCLUDED.variant_id)
       )`,
    [cartId, ids, qtys],
  );
}

async function readItems(run, userId) {
  const { rows } = await run(
    `SELECT ci.variant_id AS "variantId", ci.qty
     FROM t_cart_items ci
     JOIN t_carts c ON c.id = ci.cart_id
     WHERE c.user_id = $1
     ORDER BY ci.id`,
    [userId],
  );
  return rows;
}

export async function getCart(req, res) {
  res.json({ data: await readItems(query, req.userId) });
}

// Dipanggil setelah login: isi localStorage ditambahkan ke keranjang di database.
export async function mergeCart(req, res) {
  const parsed = parseItems(req.body?.items);
  if (!parsed) {
    return res.status(400).json({ message: 'Isi keranjang tidak valid.' });
  }

  const items = await withTransaction(async (client) => {
    const cartId = await ensureCart(client, req.userId);
    await insertItems(client, cartId, parsed);
    return readItems((text, params) => client.query(text, params), req.userId);
  });

  res.json({ data: items });
}

export async function replaceCart(req, res) {
  const parsed = parseItems(req.body?.items);
  if (!parsed) {
    return res.status(400).json({ message: 'Isi keranjang tidak valid.' });
  }

  const items = await withTransaction(async (client) => {
    const cartId = await ensureCart(client, req.userId);
    await client.query('DELETE FROM t_cart_items WHERE cart_id = $1', [cartId]);
    await insertItems(client, cartId, parsed);
    return readItems((text, params) => client.query(text, params), req.userId);
  });

  res.json({ data: items });
}
