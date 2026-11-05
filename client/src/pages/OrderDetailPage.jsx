import { Link, Navigate, useParams } from 'react-router-dom';
import OrderStatusBadge from '../components/OrderStatusBadge.jsx';
import OrderStatusHistory from '../components/OrderStatusHistory.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { useSession } from '../hooks/useSession.js';
import { formatRupiah, formatWaktu } from '../lib/format.js';
import { KURIR, METODE_BAYAR, optionLabel } from '../lib/orders.js';
import { getToken } from '../lib/session.js';

export default function OrderDetailPage() {
  const { noOrder } = useParams();
  const { user, ready } = useSession();
  const url = user ? `/api/orders/${encodeURIComponent(noOrder)}` : null;
  const { data: order, error } = useFetch(url, getToken());

  if (ready && !user) {
    const next = encodeURIComponent(`/pesanan/${noOrder}`);
    return <Navigate to={`/masuk?next=${next}`} replace />;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-12">
      <Link to="/pesanan" className="text-sm font-semibold hover:text-accent">
        ← Pesanan Saya
      </Link>

      {error ? (
        <p className="py-12 text-center text-neutral-500">{error}</p>
      ) : !order ? (
        <div className="mt-6 h-64 animate-pulse bg-neutral-100" aria-busy="true" aria-label="Memuat pesanan" />
      ) : (
        <>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <h1 className="min-w-0 break-all font-display text-2xl font-black tracking-tight md:text-4xl">
              {order.no_order}
            </h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="mt-1 text-sm text-neutral-500">Dibuat {formatWaktu(order.created_at)}</p>

          <div className="mt-6 grid gap-8 lg:grid-cols-3 lg:gap-12">
            <div className="lg:col-span-2">
              <h2 className="font-semibold">Produk</h2>
              <ul className="mt-2 border-t border-neutral-200">
                {order.items.map((item) => (
                  <li key={item.id} className="flex gap-4 border-b border-neutral-200 py-4">
                    <Link to={`/produk/${item.slug}`} className="w-20 shrink-0">
                      <img
                        src={item.foto_url}
                        alt={item.nama}
                        width="80"
                        height="80"
                        loading="lazy"
                        className="aspect-square w-full bg-neutral-100 object-cover"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link to={`/produk/${item.slug}`} className="font-semibold leading-snug hover:text-accent">
                        {item.nama}
                      </Link>
                      <p className="mt-1 text-sm text-neutral-500">
                        {item.nama_warna} · Ukuran {item.ukuran} · {item.qty} pasang
                      </p>
                      <p className="mt-1 text-sm text-neutral-500">
                        {formatRupiah(item.harga_saat_beli)} per pasang
                      </p>
                    </div>
                    <p className="whitespace-nowrap font-semibold">
                      {formatRupiah(item.harga_saat_beli * item.qty)}
                    </p>
                  </li>
                ))}
              </ul>

              <h2 className="mt-8 font-semibold">Riwayat Status</h2>
              <OrderStatusHistory riwayat={order.riwayat} />
            </div>

            <aside className="h-fit bg-neutral-100 p-6 text-sm">
              <h2 className="text-base font-semibold">Pengiriman</h2>
              <p className="mt-2 font-semibold">{order.nama_penerima}</p>
              <p className="text-neutral-600">{order.telepon_penerima}</p>
              <p className="mt-1 whitespace-pre-line break-words text-neutral-600">{order.alamat_penerima}</p>
              <p className="mt-3 text-neutral-600">Kurir: {optionLabel(KURIR, order.kurir)}</p>
              <p className="break-all text-neutral-600">Resi: {order.no_resi ?? 'Belum tersedia'}</p>

              <h2 className="mt-6 text-base font-semibold">Pembayaran</h2>
              <p className="mt-2 text-neutral-600">
                {optionLabel(METODE_BAYAR, order.metode_bayar)} (simulasi)
              </p>
              <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-neutral-300 pt-4">
                <p className="font-semibold">Total</p>
                <p className="text-xl font-semibold">{formatRupiah(order.total)}</p>
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}
