import { Link, Navigate } from 'react-router-dom';
import OrderCard from '../components/OrderCard.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { useSession } from '../hooks/useSession.js';
import { getToken } from '../lib/session.js';

export default function OrdersPage() {
  const { user, ready } = useSession();
  const { data: orders, error } = useFetch(user ? '/api/orders' : null, getToken());

  if (ready && !user) {
    return <Navigate to="/masuk?next=/pesanan" replace />;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-8 md:py-12">
      <h1 className="font-display text-4xl font-black uppercase tracking-tight md:text-5xl">
        Pesanan Saya
      </h1>

      {error ? (
        <p className="py-12 text-center text-neutral-500">{error}</p>
      ) : !orders ? (
        <div className="mt-8 h-40 animate-pulse bg-neutral-100" aria-busy="true" aria-label="Memuat pesanan" />
      ) : orders.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-neutral-500">Kamu belum punya pesanan.</p>
          <Link to="/produk" className="mt-4 inline-block font-semibold hover:text-accent">
            Mulai belanja
          </Link>
        </div>
      ) : (
        <ul className="mt-6 border-t border-neutral-200">
          {orders.map((order) => (
            <OrderCard key={order.no_order} order={order} />
          ))}
        </ul>
      )}
    </div>
  );
}
