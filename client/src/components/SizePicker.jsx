import { sizeHasStock } from '../lib/variants.js';

function sizeStyle(active) {
  if (active) return 'border-neutral-950 bg-neutral-950 text-white';
  return 'border-neutral-300 hover:border-neutral-950 disabled:border-neutral-200 disabled:text-neutral-400 disabled:line-through';
}

export default function SizePicker({ colors, sizes, selectedColor, selectedSize, onSelect }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold">Ukuran (EU)</legend>
      <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-6">
        {sizes.map((size) => {
          const tersedia = sizeHasStock(colors, size, selectedColor);

          return (
            <button
              key={size}
              type="button"
              disabled={!tersedia}
              aria-pressed={size === selectedSize}
              aria-label={tersedia ? `Ukuran ${size}` : `Ukuran ${size}, tidak tersedia`}
              onClick={() => onSelect(size)}
              className={`min-h-11 border text-sm font-semibold disabled:cursor-not-allowed ${sizeStyle(size === selectedSize)}`}
            >
              {size}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
