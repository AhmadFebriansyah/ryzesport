import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '../hooks/useSession.js';

const NEXT_SEARCH = '?next=/keranjang';

export default function CheckoutModal({ open, onClose }) {
  const dialogRef = useRef(null);
  const { user } = useSession();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="checkout-modal-title"
      className="m-auto w-[calc(100%-2rem)] max-w-sm p-6 backdrop:bg-black/60"
    >
      <h2 id="checkout-modal-title" className="font-display text-2xl font-black uppercase tracking-tight">
        {user ? 'Segera Tersedia' : 'Masuk untuk Checkout'}
      </h2>
      <p className="mt-3 text-neutral-600">
        {user
          ? 'Halaman checkout sedang disiapkan. Keranjangmu sudah tersimpan di akunmu.'
          : 'Checkout memerlukan akun. Isi keranjangmu tetap tersimpan setelah masuk.'}
      </p>
      {user ? null : (
        <div className="mt-6 flex flex-col gap-2">
          <Link
            to={`/masuk${NEXT_SEARCH}`}
            className="flex min-h-11 items-center justify-center bg-accent px-6 text-sm font-semibold uppercase tracking-wide text-neutral-950 hover:bg-neutral-950 hover:text-white"
          >
            Masuk
          </Link>
          <Link
            to={`/daftar${NEXT_SEARCH}`}
            className="flex min-h-11 items-center justify-center border border-neutral-950 px-6 text-sm font-semibold uppercase tracking-wide hover:bg-neutral-950 hover:text-white"
          >
            Daftar
          </Link>
        </div>
      )}
      <button
        type="button"
        onClick={onClose}
        className="mt-4 min-h-11 w-full text-sm font-semibold underline hover:text-accent"
      >
        Tutup
      </button>
    </dialog>
  );
}
