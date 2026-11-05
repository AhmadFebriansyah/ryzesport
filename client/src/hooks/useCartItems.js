import { useEffect, useState } from 'react';
import { removeFromCart } from '../lib/cart.js';
import { useCart } from './useCart.js';
import { useFetch } from './useFetch.js';

export function useCartItems() {
  const cart = useCart();
  // Mengubah atau menghapus item tidak perlu memuat ulang daftar. Detail hanya diambil lagi jika ada
  // item baru, misalnya keranjang dari database yang tiba setelah halaman dimuat.
  const [requestedIds, setRequestedIds] = useState(() => cart.map((item) => item.variantId));
  if (cart.some((item) => !requestedIds.includes(item.variantId))) {
    setRequestedIds(cart.map((item) => item.variantId));
  }
  const { data: variants, error, loading } = useFetch(
    requestedIds.length > 0 ? `/api/variants?ids=${requestedIds.join(',')}` : null,
  );

  // Varian yang sudah tidak dijual dibuang dari keranjang.
  useEffect(() => {
    if (!variants) return;
    const found = new Set(variants.map((variant) => variant.id));
    removeFromCart(requestedIds.filter((id) => !found.has(id)));
  }, [variants, requestedIds]);

  const items = cart.flatMap((entry) => {
    const variant = variants?.find((item) => item.id === entry.variantId);
    if (!variant) return [];
    return [{ ...variant, qty: Math.min(entry.qty, variant.stok), qtyDisimpan: entry.qty }];
  });

  return {
    items,
    total: items.reduce((sum, item) => sum + item.harga * item.qty, 0),
    adaStokHabis: items.some((item) => item.stok === 0),
    error,
    loading,
  };
}
