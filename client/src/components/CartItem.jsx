import { Link } from 'react-router-dom';
import { removeFromCart, setCartQty } from '../lib/cart.js';
import { formatRupiah } from '../lib/format.js';

const STEP_BUTTON = 'h-11 w-11 font-semibold disabled:cursor-not-allowed disabled:text-neutral-300';

export default function CartItem({ item }) {
  const namaLengkap = `${item.merek} ${item.nama}`;
  const habis = item.stok === 0;

  return (
    <li className="flex gap-4 border-b border-neutral-200 py-4">
      <Link to={`/produk/${item.slug}`} className="w-24 shrink-0 md:w-32">
        <img
          src={item.foto_url}
          alt={namaLengkap}
          width="128"
          height="128"
          className="aspect-square w-full bg-neutral-100 object-cover"
        />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <Link to={`/produk/${item.slug}`} className="font-semibold leading-snug hover:text-accent">
            {namaLengkap}
          </Link>
          <p className="whitespace-nowrap font-semibold">
            {habis ? '-' : formatRupiah(item.harga * item.qty)}
          </p>
        </div>
        <p className="mt-1 text-sm text-neutral-500">
          {item.nama_warna} · Ukuran {item.ukuran}
        </p>
        <p className="mt-1 text-sm text-neutral-500">{formatRupiah(item.harga)}</p>

        {habis ? <p className="mt-2 text-sm font-semibold text-accent">Stok habis</p> : null}
        {!habis && item.qtyDisimpan > item.stok ? (
          <p className="mt-2 text-sm font-semibold text-accent">Stok tersisa {item.stok}</p>
        ) : null}

        <div className="mt-2 flex items-center justify-between gap-4">
          {habis ? (
            <span />
          ) : (
            <div className="flex items-center border border-neutral-300">
              <button
                type="button"
                aria-label={`Kurangi jumlah ${namaLengkap}`}
                disabled={item.qty <= 1}
                onClick={() => setCartQty(item.id, item.qty - 1)}
                className={STEP_BUTTON}
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-semibold" aria-live="polite">
                {item.qty}
              </span>
              <button
                type="button"
                aria-label={`Tambah jumlah ${namaLengkap}`}
                disabled={item.qty >= item.stok}
                onClick={() => setCartQty(item.id, item.qty + 1)}
                className={STEP_BUTTON}
              >
                +
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => removeFromCart([item.id])}
            className="min-h-11 text-sm font-semibold underline hover:text-accent"
          >
            Hapus
          </button>
        </div>
      </div>
    </li>
  );
}
