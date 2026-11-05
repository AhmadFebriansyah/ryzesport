import { apiRequest } from './api.js';

const CART_KEY = 'ryzesport_cart_v1';

const listeners = new Set();
let cache = null;
let serverToken = null;
// Antrian agar perubahan keranjang sampai ke server sesuai urutan klik.
let syncQueue = Promise.resolve();

const isValidItem = (item) =>
  typeof item?.variantId === 'string' && Number.isInteger(item.qty) && item.qty > 0 && item.qty < 100;

function readCart() {
  try {
    const items = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(items) ? items.filter(isValidItem) : [];
  } catch {
    return [];
  }
}

function writeCart(items, { sync = true } = {}) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    return false;
  }
  cache = items;
  listeners.forEach((listener) => listener());

  if (sync && serverToken) {
    const token = serverToken;
    syncQueue = syncQueue
      .then(() => apiRequest('/api/cart', { method: 'PUT', body: { items }, token }))
      .catch((err) => console.error('Gagal menyimpan keranjang:', err.message));
  }
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

// Menunggu perubahan terakhir sampai ke server sebelum checkout membaca keranjang di database.
export function flushCart() {
  return syncQueue;
}

// Dipakai setelah checkout berhasil. Server sudah mengosongkan keranjangnya sendiri.
export function clearCart() {
  writeCart([], { sync: false });
}

// Setelah masuk: isi localStorage digabung ke database, lalu database menjadi acuan.
export async function connectCart(token) {
  serverToken = token;
  try {
    const items = await apiRequest('/api/cart/merge', {
      method: 'POST',
      body: { items: getCart() },
      token,
    });
    writeCart(items, { sync: false });
  } catch (err) {
    // Masalah keranjang tidak boleh menghalangi user masuk.
    console.error('Gagal menggabungkan keranjang:', err.message);
  }
}

// Saat halaman dibuka ulang dengan sesi aktif, keranjang diambil dari database.
export async function restoreCart(token) {
  const items = await apiRequest('/api/cart', { token });
  serverToken = token;
  writeCart(items, { sync: false });
}

// Keranjang milik akun tidak boleh tertinggal di browser setelah keluar.
export function disconnectCart() {
  serverToken = null;
  writeCart([], { sync: false });
}
