const CART_KEY = 'ryzesport_cart_v1';

function readCart() {
  try {
    const items = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

// Mengembalikan false jika jumlah sudah mencapai stok atau browser menolak penyimpanan.
export function addToCart(variant) {
  const items = readCart();
  const existing = items.find((item) => item.variantId === variant.id);

  if ((existing?.qty ?? 0) >= variant.stok) {
    return false;
  }

  if (existing) {
    existing.qty += 1;
  } else {
    items.push({ variantId: variant.id, qty: 1 });
  }

  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    return true;
  } catch {
    return false;
  }
}
