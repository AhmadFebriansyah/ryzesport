import { Link } from 'react-router-dom';
import { formatRupiah, formatWaktu } from '../lib/format.js';
import OrderStatusBadge from './OrderStatusBadge.jsx';

export default function OrderCard({ order }) {
  const [pertama, ...lainnya] = order.items;

  return (
    <li className="border-b border-neutral-200">
      <Link to={`/pesanan/${order.no_order}`} className="group block py-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="min-w-0 break-all font-semibold group-hover:text-accent">{order.no_order}</p>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="mt-1 text-sm text-neutral-500">{formatWaktu(order.created_at)}</p>

        <div className="mt-3 flex items-center gap-4">
          <img
            src={pertama.foto_url}
            alt=""
            width="80"
            height="80"
            loading="lazy"
            className="h-20 w-20 shrink-0 bg-neutral-100 object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="font-semibold leading-snug">{pertama.nama}</p>
            <p className="mt-1 text-sm text-neutral-500">
              {pertama.nama_warna} · Ukuran {pertama.ukuran} · {pertama.qty} pasang
            </p>
            {lainnya.length > 0 ? (
              <p className="mt-1 text-sm text-neutral-500">+{lainnya.length} produk lainnya</p>
            ) : null}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="text-sm text-neutral-500">
            {order.no_resi ? `Resi ${order.no_resi}` : 'Resi belum tersedia'}
          </p>
          <p className="font-semibold">{formatRupiah(order.total)}</p>
        </div>
      </Link>
    </li>
  );
}
