import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem.jsx';
import CheckoutModal from '../components/CheckoutModal.jsx';
import { useCart } from '../hooks/useCart.js';
import { useFetch } from '../hooks/useFetch.js';
import { removeFromCart } from '../lib/cart.js';
import { formatRupiah } from '../lib/format.js';

export default function CartPage() {
  const cart = useCart();
  // Detail cukup diambil sekali. Mengubah atau menghapus item tidak perlu memuat ulang daftar.
  const [requestedIds] = useState(() => cart.map((item) => item.variantId));
  const [modalOpen, setModalOpen] = useState(false);
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
  const total = items.reduce((sum, item) => sum + item.harga * item.qty, 0);
  const adaStokHabis = items.some((item) => item.stok === 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <h1 className="font-display text-4xl font-black uppercase tracking-tight md:text-5xl">
        Keranjang
      </h1>

      {loading ? (
        <div className="mt-8 h-32 animate-pulse bg-neutral-100" aria-busy="true" aria-label="Memuat keranjang" />
      ) : error ? (
        <p className="py-12 text-center text-neutral-500">{error}</p>
      ) : items.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-neutral-500">Keranjangmu masih kosong.</p>
          <Link to="/produk" className="mt-4 inline-block font-semibold hover:text-accent">
            Mulai belanja
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-8 lg:grid-cols-3 lg:gap-12">
          <ul className="border-t border-neutral-200 lg:col-span-2">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </ul>

          <aside className="h-fit bg-neutral-100 p-6">
            <div className="flex items-baseline justify-between gap-4">
              <p className="font-semibold">Total</p>
              <p className="text-xl font-semibold">{formatRupiah(total)}</p>
            </div>
            <p className="mt-1 text-sm text-neutral-500">Belum termasuk ongkos kirim.</p>
            <button
              type="button"
              disabled={adaStokHabis}
              onClick={() => setModalOpen(true)}
              className="mt-6 min-h-14 w-full bg-accent px-8 text-sm font-semibold uppercase tracking-wide text-neutral-950 hover:bg-neutral-950 hover:text-white disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500"
            >
              Checkout
            </button>
            {adaStokHabis ? (
              <p className="mt-3 text-sm text-neutral-600">
                Hapus produk yang stoknya habis untuk melanjutkan.
              </p>
            ) : null}
          </aside>
        </div>
      )}

      <CheckoutModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
