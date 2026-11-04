const CART_KEY = 'ryzesport_cart_v1';

const listeners = new Set();
let cache = null;

function readCart() {
  try {
    const items = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function writeCart(items) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    return false;
  }
  cache = items;
  listeners.forEach((listener) => listener());
  return true;
}

export function getCart() {
  cache ??= readCart();
  return cache;
}

export function subscribeCart(listener) {
  // Event storage hanya muncul dari tab lain, jadi keranjang antar tab tetap sama.
  function handleStorage(event) {
    if (event.key === CART_KEY || event.key === null) {
      cache = null;
      listener();
    }
  }

  listeners.add(listener);
  window.addEventListener('storage', handleStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', handleStorage);
  };
}

// Mengembalikan false jika jumlah sudah mencapai stok atau browser menolak penyimpanan.
export function addToCart(variant) {
  const items = getCart();
  const existing = items.find((item) => item.variantId === variant.id);

  if ((existing?.qty ?? 0) >= variant.stok) {
    return false;
  }

  return writeCart(
    existing
      ? items.map((item) => (item === existing ? { ...item, qty: item.qty + 1 } : item))
      : [...items, { variantId: variant.id, qty: 1 }],
  );
}

export function setCartQty(variantId, qty) {
  writeCart(getCart().map((item) => (item.variantId === variantId ? { ...item, qty } : item)));
}

export function removeFromCart(variantIds) {
  const removed = new Set(variantIds);
  if (removed.size > 0) {
    writeCart(getCart().filter((item) => !removed.has(item.variantId)));
  }
}
