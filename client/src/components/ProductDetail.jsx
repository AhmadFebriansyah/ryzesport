import { useState } from 'react';
import { addToCart } from '../lib/cart.js';
import { formatRupiah } from '../lib/format.js';
import { SEGMENT_LABELS } from '../lib/segments.js';
import ColorPicker from './ColorPicker.jsx';
import IllustrationTag from './IllustrationTag.jsx';
import SizePicker from './SizePicker.jsx';

function buttonLabel(color, size, variant) {
  if (!color) return 'Pilih warna';
  if (size === null) return 'Pilih ukuran';
  if (!variant || variant.stok === 0) return 'Stok habis';
  return 'Tambah ke Keranjang';
}

export default function ProductDetail({ product }) {
  const [colorId, setColorId] = useState(null);
  const [size, setSize] = useState(null);
  const [notice, setNotice] = useState(null);

  const color = product.warna.find((item) => item.id === colorId);
  const variant = color?.varian.find((item) => item.ukuran === size);
  const canAdd = Boolean(variant && variant.stok > 0);
  const sizes = product.warna[0].varian.map((item) => item.ukuran);
  const namaLengkap = `${product.merek} ${product.nama}`;
  const foto = color ?? product.warna[0];

  function handleSelectColor(id) {
    setColorId(id);
    setNotice(null);
  }

  function handleSelectSize(value) {
    setSize(value);
    setNotice(null);
  }

  function handleAdd() {
    setNotice(
      addToCart(variant)
        ? 'Produk ditambahkan ke keranjang.'
        : 'Jumlah di keranjang sudah mencapai stok yang tersedia.',
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-12">
      <div className="relative aspect-square bg-neutral-100">
        <img
          src={foto.foto_url}
          alt={`${namaLengkap} warna ${foto.nama_warna}`}
          width="800"
          height="800"
          className="h-full w-full object-contain"
        />
        {foto.foto_ilustrasi ? <IllustrationTag /> : null}
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">
          {product.kategori} · {SEGMENT_LABELS[product.segmen]}
        </p>
        <h1 className="mt-2 font-display text-3xl font-black uppercase tracking-tight md:text-4xl">
          {namaLengkap}
        </h1>
        <p className="mt-3 text-xl font-semibold">{formatRupiah(product.harga)}</p>
        <p className="mt-4 text-neutral-600">{product.deskripsi}</p>

        <div className="mt-6 flex flex-col gap-6">
          <ColorPicker colors={product.warna} selectedId={colorId} onSelect={handleSelectColor} />
          <SizePicker
            variants={color?.varian}
            sizes={sizes}
            selectedSize={size}
            onSelect={handleSelectSize}
          />
        </div>

        <button
          type="button"
          disabled={!canAdd}
          onClick={handleAdd}
          className="mt-8 min-h-14 w-full bg-accent px-8 text-sm font-semibold uppercase tracking-wide text-neutral-950 hover:bg-neutral-950 hover:text-white disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500"
        >
          {buttonLabel(color, size, variant)}
        </button>
        <p role="status" className="mt-3 min-h-6 text-sm font-semibold">
          {notice}
        </p>
      </div>
    </div>
  );
}
