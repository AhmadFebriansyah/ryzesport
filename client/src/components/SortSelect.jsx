import { URUTAN_OPSI } from '../lib/productFilters.js';

export default function SortSelect({ value, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm font-semibold">
      <span className="hidden sm:inline">Urutkan</span>
      <select
        aria-label="Urutkan produk"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="border border-neutral-300 bg-white px-2 py-2 font-semibold"
      >
        {URUTAN_OPSI.map((opsi) => (
          <option key={opsi.value} value={opsi.value}>
            {opsi.label}
          </option>
        ))}
      </select>
    </label>
  );
}
