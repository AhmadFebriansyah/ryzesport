import { useEffect, useRef } from 'react';

export default function CheckoutModal({ open, onClose }) {
  const dialogRef = useRef(null);

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
        Masuk untuk Checkout
      </h2>
      <p className="mt-3 text-neutral-600">
        Checkout memerlukan akun. Isi keranjangmu tetap tersimpan. Halaman masuk dan daftar segera
        tersedia.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="mt-6 min-h-11 w-full bg-neutral-950 px-6 text-sm font-semibold uppercase tracking-wide text-white hover:bg-accent hover:text-neutral-950"
      >
        Tutup
      </button>
    </dialog>
  );
}
