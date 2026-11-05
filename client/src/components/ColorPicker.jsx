import { colorHasStock } from '../lib/variants.js';

function colorStyle(active) {
  if (active) return 'border-neutral-950 bg-neutral-950 text-white';
  return 'border-neutral-300 hover:border-neutral-950 disabled:border-neutral-200 disabled:text-neutral-400 disabled:line-through';
}

export default function ColorPicker({ colors, selectedId, selectedSize, onSelect }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold">Warna</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {colors.map((color) => {
          const active = color.id === selectedId;
          const tersedia = colorHasStock(color, selectedSize);

          return (
            <button
              key={color.id}
              type="button"
              disabled={!tersedia}
              aria-pressed={active}
              aria-label={tersedia ? color.nama_warna : `${color.nama_warna}, tidak tersedia`}
              onClick={() => onSelect(color.id)}
              className={`min-h-11 border px-4 text-sm font-semibold disabled:cursor-not-allowed ${colorStyle(active)}`}
            >
              {color.nama_warna}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
