export default function ColorPicker({ colors, selectedId, onSelect }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold">Warna</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {colors.map((color) => {
          const active = color.id === selectedId;
          return (
            <button
              key={color.id}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(color.id)}
              className={`min-h-11 border px-4 text-sm font-semibold ${
                active
                  ? 'border-neutral-950 bg-neutral-950 text-white'
                  : 'border-neutral-300 hover:border-neutral-950'
              }`}
            >
              {color.nama_warna}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
