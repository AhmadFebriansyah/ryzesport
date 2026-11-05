import { Link, useSearchParams } from 'react-router-dom';

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const noOrder = searchParams.get('no');

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="font-display text-4xl font-black uppercase tracking-tight">Pesanan Dibuat</h1>
      <p className="mt-4 text-neutral-600">Nomor pesananmu:</p>
      <p className="mt-1 text-xl font-semibold">{noOrder}</p>
      <p className="mt-4 text-neutral-600">
        Status pesanan: Menunggu Pembayaran. Ini simulasi, jadi tidak ada pembayaran yang perlu
        dilakukan.
      </p>
      <Link
        to={`/pesanan/${encodeURIComponent(noOrder ?? '')}`}
        className="mt-8 inline-block bg-accent px-8 py-4 text-sm font-semibold uppercase tracking-wide text-neutral-950 hover:bg-neutral-950 hover:text-white"
      >
        Lihat Pesanan
      </Link>
      <Link to="/produk" className="mt-4 block text-sm font-semibold hover:text-accent">
        Lanjut belanja
      </Link>
    </div>
  );
}
