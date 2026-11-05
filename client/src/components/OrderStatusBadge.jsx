import { STATUS_LABELS } from '../lib/orders.js';

const WARNA = {
  SELESAI: 'bg-neutral-950 text-white',
  DIBATALKAN: 'bg-neutral-200 text-neutral-600',
};

export default function OrderStatusBadge({ status }) {
  return (
    <span
      className={`inline-block px-2 py-1 text-xs font-semibold ${WARNA[status] ?? 'bg-accent text-neutral-950'}`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
