import { formatRupiah } from '../lib/format.js';
import { SEGMENT_LABELS } from '../lib/segments.js';

export default function ProductCard({ product }) {
  const namaLengkap = `${product.merek} ${product.nama}`;

  return (
    <article>
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        <img
          src={product.foto_url}
          alt={namaLengkap}
          width="800"
          height="800"
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div className="absolute left-2 top-2 flex flex-col items-start gap-1 text-xs font-semibold">
          {product.is_trending ? (
            <span className="bg-accent px-2 py-1 text-neutral-950">Trending</span>
          ) : null}
          {product.tersedia ? null : (
            <span className="bg-neutral-950 px-2 py-1 text-white">Stok habis</span>
          )}
        </div>
      </div>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-accent">
        {product.kategori} · {SEGMENT_LABELS[product.segmen]}
      </p>
      <h3 className="mt-1 font-semibold leading-snug">{namaLengkap}</h3>
      <p className="mt-1 text-sm text-neutral-500">{product.jumlah_warna} warna</p>
      <p className="mt-1 font-semibold">{formatRupiah(product.harga)}</p>
    </article>
  );
}
