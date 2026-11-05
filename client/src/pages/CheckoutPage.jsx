import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import ChoiceField from '../components/ChoiceField.jsx';
import PaymentField from '../components/PaymentField.jsx';
import TextField from '../components/TextField.jsx';
import { useCartItems } from '../hooks/useCartItems.js';
import { useSession } from '../hooks/useSession.js';
import { apiRequest } from '../lib/api.js';
import { clearCart, flushCart } from '../lib/cart.js';
import { formatRupiah } from '../lib/format.js';
import { KURIR } from '../lib/orders.js';
import { getToken } from '../lib/session.js';

export default function CheckoutPage() {
  const { user, ready } = useSession();
  const { items, total, adaStokHabis, error, loading } = useCartItems();
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [noOrder, setNoOrder] = useState(null);

  // Keranjang dikosongkan setelah halaman berpindah, agar tidak terhitung sebagai keranjang kosong.
  useEffect(() => {
    if (noOrder) clearCart();
  }, [noOrder]);

  if (noOrder) {
    return <Navigate to={`/checkout/selesai?no=${encodeURIComponent(noOrder)}`} replace />;
  }
  if (ready && !user) {
    return <Navigate to="/masuk?next=/checkout" replace />;
  }
  if (!ready || loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="h-64 animate-pulse bg-neutral-100" aria-busy="true" aria-label="Memuat checkout" />
      </div>
    );
  }
  if (error) {
    return <p className="px-4 py-24 text-center text-neutral-500">{error}</p>;
  }
  if (items.length === 0 || adaStokHabis) {
    return <Navigate to="/keranjang" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    // Dibaca sebelum await, karena event.currentTarget kosong setelah handler berpindah giliran.
    const body = Object.fromEntries(new FormData(event.currentTarget));
    setSubmitError(null);
    setSubmitting(true);

    try {
      await flushCart();
      const order = await apiRequest('/api/orders', {
        method: 'POST',
        body,
        token: getToken(),
      });
      setNoOrder(order.no_order);
    } catch (err) {
      setSubmitError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-12">
      <h1 className="font-display text-4xl font-black uppercase tracking-tight md:text-5xl">
        Checkout
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-8 lg:grid-cols-3 lg:gap-12">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <TextField
            label="Nama penerima"
            name="nama_penerima"
            autoComplete="name"
            defaultValue={user.nama}
            required
            minLength={2}
            maxLength={100}
          />
          <TextField
            label="Telepon"
            name="telepon"
            type="tel"
            autoComplete="tel"
            defaultValue={user.telepon ?? ''}
            required
          />
          <label className="block">
            <span className="text-sm font-semibold">Alamat lengkap</span>
            <textarea
              name="alamat"
              autoComplete="street-address"
              required
              minLength={10}
              maxLength={500}
              rows={4}
              className="mt-1 w-full border border-neutral-300 px-3 py-2 focus:border-neutral-950 focus:outline-none"
            />
          </label>
          <ChoiceField legend="Kurir" name="kurir" options={KURIR} />
          <PaymentField />
        </div>

        <aside className="h-fit bg-neutral-100 p-6">
          <h2 className="font-semibold">Ringkasan</h2>
          <ul className="mt-3 flex flex-col gap-3 text-sm">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between gap-4">
                <span>
                  {item.merek} {item.nama}
                  <span className="block text-neutral-500">
                    {item.nama_warna} · Ukuran {item.ukuran} · {item.qty} pasang
                  </span>
                </span>
                <span className="whitespace-nowrap font-semibold">
                  {formatRupiah(item.harga * item.qty)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-neutral-300 pt-4">
            <p className="font-semibold">Total</p>
            <p className="text-xl font-semibold">{formatRupiah(total)}</p>
          </div>
          {submitError ? (
            <div role="alert" className="mt-4 text-sm font-semibold text-accent">
              <p>{submitError}</p>
              <Link to="/keranjang" className="underline">
                Kembali ke keranjang
              </Link>
            </div>
          ) : null}
          <button
            type="submit"
            disabled={submitting}
            className="mt-6 min-h-14 w-full bg-accent px-8 text-sm font-semibold uppercase tracking-wide text-neutral-950 hover:bg-neutral-950 hover:text-white disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500"
          >
            {submitting ? 'Memproses...' : 'Buat Pesanan'}
          </button>
          <p className="mt-3 text-sm text-neutral-600">
            Ini simulasi. Tidak ada uang yang ditagih.
          </p>
        </aside>
      </form>
    </div>
  );
}
