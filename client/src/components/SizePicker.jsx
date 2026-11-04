function sizeStyle(active, habis) {
  if (active && habis) return 'border-neutral-950 bg-neutral-200 text-neutral-500 line-through';
  if (active) return 'border-neutral-950 bg-neutral-950 text-white';
  if (habis) return 'border-neutral-200 text-neutral-400 line-through';
  return 'border-neutral-300 hover:border-neutral-950';
}

export default function SizePicker({ variants, sizes, selectedSize, onSelect }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold">Ukuran (EU)</legend>
      <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-6">
        {sizes.map((size) => {
          const variant = variants?.find((item) => item.ukuran === size);
          const habis = variant?.stok === 0;
          return (
            <button
              key={size}
              type="button"
              disabled={!variant || habis}
              aria-pressed={size === selectedSize}
              aria-label={habis ? `Ukuran ${size}, stok habis` : `Ukuran ${size}`}
              onClick={() => onSelect(size)}
              className={`min-h-11 border text-sm font-semibold disabled:cursor-not-allowed ${sizeStyle(
                size === selectedSize,
                habis,
              )} ${variant ? '' : 'text-neutral-400'}`}
            >
              {size}
            </button>
          );
        })}
      </div>
      {variants ? null : <p className="mt-2 text-sm text-neutral-500">Pilih warna terlebih dulu.</p>}
    </fieldset>
  );
}
