import { useState } from 'react';
import { formatRupiah } from '../lib/format.js';
import { HARGA_STEP } from '../lib/productFilters.js';

// Nilai digeser di state lokal dan baru masuk URL saat dilepas, agar API tidak dipanggil terus.
export default function PriceRangeFilter({ batas, hargaMin, hargaMax, onChange }) {
  const [draft, setDraft] = useState(null);
  const min = draft?.min ?? hargaMin ?? batas.min;
  const max = draft?.max ?? hargaMax ?? batas.max;
  const lebar = batas.max - batas.min;

  const commit = () => {
    if (!draft) return;
    setDraft(null);
    onChange(min > batas.min ? min : null, max < batas.max ? max : null);
  };

  return (
    <div>
      <div className="relative h-5">
        <div className="absolute inset-x-0 top-2 h-1 bg-neutral-200" />
        <div
          className="absolute top-2 h-1 bg-neutral-950"
          style={{
            left: `${((min - batas.min) / lebar) * 100}%`,
            right: `${((batas.max - max) / lebar) * 100}%`,
          }}
        />
        <input
          type="range"
          aria-label="Harga minimum"
          min={batas.min}
          max={batas.max}
          step={HARGA_STEP}
          value={min}
          onChange={(event) => setDraft({ min: Math.min(Number(event.target.value), max - HARGA_STEP), max })}
          onPointerUp={commit}
          onKeyUp={commit}
          className="slider-harga"
        />
        <input
          type="range"
          aria-label="Harga maksimum"
          min={batas.min}
          max={batas.max}
          step={HARGA_STEP}
          value={max}
          onChange={(event) => setDraft({ min, max: Math.max(Number(event.target.value), min + HARGA_STEP) })}
          onPointerUp={commit}
          onKeyUp={commit}
          className="slider-harga"
        />
      </div>
      <p className="mt-3 flex justify-between gap-2 text-xs font-semibold">
        <span>{formatRupiah(min)}</span>
        <span>{formatRupiah(max)}</span>
      </p>
    </div>
  );
}
