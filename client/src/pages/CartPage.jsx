import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem.jsx';
import CheckoutModal from '../components/CheckoutModal.jsx';
import { useCartItems } from '../hooks/useCartItems.js';
import { useSession } from '../hooks/useSession.js';
import { formatRupiah } from '../lib/format.js';

export default function CartPage() {
  const { items, total, adaStokHabis, error, loading } = useCartItems();
  const { user } = useSession();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  function handleCheckout() {
    if (user) {
      navigate('/checkout');
    } else {
      setModalOpen(true);
    }
  }

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
            <button
              type="button"
              disabled={adaStokHabis}
              onClick={handleCheckout}
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
