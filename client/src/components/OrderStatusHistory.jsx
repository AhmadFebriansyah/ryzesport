import { formatWaktu } from '../lib/format.js';
import { STATUS_LABELS } from '../lib/orders.js';

export default function OrderStatusHistory({ riwayat }) {
  // Terbaru di atas, agar status saat ini langsung terbaca.
  const urutan = [...riwayat].reverse();

  return (
    <ol className="mt-3 border-l-2 border-neutral-200">
      {urutan.map((entri, index) => (
        <li key={entri.id} className="relative pb-5 pl-5 last:pb-0">
          <span
            aria-hidden="true"
            className={`absolute -left-[7px] top-1.5 h-3 w-3 rounded-full ${index === 0 ? 'bg-accent' : 'bg-neutral-300'}`}
          />
          <p className="font-semibold">{STATUS_LABELS[entri.status] ?? entri.status}</p>
          <p className="text-sm text-neutral-500">{formatWaktu(entri.waktu)}</p>
          {entri.catatan ? <p className="mt-1 text-sm text-neutral-600">{entri.catatan}</p> : null}
        </li>
      ))}
    </ol>
  );
}
