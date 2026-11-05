import { useSyncExternalStore } from 'react';
import { Link } from 'react-router-dom';
import { getToast, hideToast, subscribeToast } from '../lib/toast.js';

export default function CartToast() {
  const toast = useSyncExternalStore(subscribeToast, getToast);

  // Pembungkus selalu ada, agar pembaca layar mengumumkan isinya saat muncul.
  return (
    <div role="status" className="pointer-events-none fixed inset-x-4 top-28 z-30 flex justify-end md:right-8">
      {toast ? (
        <div
          key={toast.id}
          className="toast-masuk pointer-events-auto flex w-full max-w-sm gap-3 border border-neutral-200 bg-white p-3 shadow-lg"
        >
          <img src={toast.foto} alt="" width="64" height="64" className="size-16 shrink-0 bg-neutral-100 object-cover" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Masuk ke keranjang</p>
            <p className="truncate text-sm">{toast.nama}</p>
            <p className="truncate text-xs text-neutral-500">{toast.detail}</p>
            <Link
              to="/keranjang"
              onClick={hideToast}
              className="mt-1 inline-block text-sm font-semibold underline hover:text-accent"
            >
              Lihat Keranjang
            </Link>
          </div>
          <button
            type="button"
            aria-label="Tutup notifikasi"
            onClick={hideToast}
            className="h-fit px-1 text-lg leading-none"
          >
            ×
          </button>
        </div>
      ) : null}
    </div>
  );
}
