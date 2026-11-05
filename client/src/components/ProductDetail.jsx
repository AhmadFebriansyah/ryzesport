import { useRef, useState } from 'react';
import { addToCart } from '../lib/cart.js';
import { flyToCart } from '../lib/flyToCart.js';
import { formatRupiah } from '../lib/format.js';
import { SEGMENT_LABELS } from '../lib/segments.js';
import { showToast } from '../lib/toast.js';
import { allSizes, colorHasStock, sizeHasStock } from '../lib/variants.js';
import ColorPicker from './ColorPicker.jsx';
import ProductGallery from './ProductGallery.jsx';
import SizePicker from './SizePicker.jsx';

function buttonLabel(adaStok, color, size) {
  if (!adaStok) return 'Stok habis';
  if (!color && size === null) return 'Pilih warna dan ukuran';
  if (!color) return 'Pilih warna';
  if (size === null) return 'Pilih ukuran';
  return 'Tambah ke Keranjang';
}

// Pilihan yang tidak tersedia nonaktif, jadi user perlu tahu cara membatalkan pilihan lawannya.
function selectionHint(colors, sizes, color, size) {
  if (size !== null && colors.some((item) => !colorHasStock(item, size))) {
    return `Warna yang dicoret tidak tersedia di ukuran ${size}. Klik ukuran ${size} lagi untuk membatalkan.`;
  }
  if (color && sizes.some((item) => !sizeHasStock(colors, item, color))) {
    return `Ukuran yang dicoret tidak tersedia untuk warna ${color.nama_warna}. Klik warnanya lagi untuk membatalkan.`;
  }
  return null;
}

export default function ProductDetail({ product }) {
  const [colorId, setColorId] = useState(null);
  const [size, setSize] = useState(null);
  const [notice, setNotice] = useState(null);
  const addButton = useRef(null);

  const color = product.warna.find((item) => item.id === colorId) ?? null;
  const variant = color?.varian.find((item) => item.ukuran === size);
  const canAdd = Boolean(variant && variant.stok > 0);
  const adaStok = product.warna.some((item) => colorHasStock(item));
  const sizes = allSizes(product.warna);
  const namaLengkap = `${product.merek} ${product.nama}`;
  const foto = color ?? product.warna[0];
  const hint = selectionHint(product.warna, sizes, color, size);

  function handleSelectColor(id) {
    setColorId(id === colorId ? null : id);
    setNotice(null);
  }

  function handleSelectSize(value) {
    setSize(value === size ? null : value);
    setNotice(null);
  }

  function handleAdd() {
    if (!addToCart(variant)) {
      setNotice('Jumlah di keranjang sudah mencapai stok yang tersedia.');
      return;
    }

    setNotice(null);
    flyToCart(color.foto_url, addButton.current);
    showToast({
      foto: color.foto_url,
      nama: namaLengkap,
      detail: `${color.nama_warna} · Ukuran ${size}`,
    });
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-12">
      <ProductGallery key={foto.id} photo={foto} namaLengkap={namaLengkap} />

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
          <ColorPicker
            colors={product.warna}
            selectedId={colorId}
            selectedSize={size}
            onSelect={handleSelectColor}
          />
          <SizePicker
            colors={product.warna}
            sizes={sizes}
            selectedColor={color}
            selectedSize={size}
            onSelect={handleSelectSize}
          />
        </div>
        {hint ? <p className="mt-3 text-sm text-neutral-500">{hint}</p> : null}

        <button
          ref={addButton}
          type="button"
          disabled={!canAdd}
          onClick={handleAdd}
          className="mt-8 min-h-14 w-full bg-accent px-8 text-sm font-semibold uppercase tracking-wide text-neutral-950 hover:bg-neutral-950 hover:text-white disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500"
        >
          {buttonLabel(adaStok, color, size)}
        </button>
        <p role="status" className="mt-3 min-h-6 text-sm font-semibold">
          {notice}
        </p>
      </div>
    </div>
  );
}
