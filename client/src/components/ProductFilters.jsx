import { getList, HARGA_STEP, toggleValue, WARNA_FILTER, withParams } from '../lib/productFilters.js';
import { SEGMENTS } from '../lib/segments.js';
import FilterCheckbox from './FilterCheckbox.jsx';
import FilterGroup from './FilterGroup.jsx';
import PriceRangeFilter from './PriceRangeFilter.jsx';

const SEGMENT_OPTIONS = SEGMENTS.filter(({ params }) => params.segmen);

const pressedClass = (pressed) =>
  pressed ? 'border-neutral-950 bg-neutral-950 text-white' : 'border-neutral-300 hover:border-neutral-950';

export default function ProductFilters({ searchParams, options, onChange }) {
  const { brands, categories, facets } = options;
  const isChecked = (key, value) => getList(searchParams, key).includes(value);
  const toggle = (key, value) => onChange(toggleValue(searchParams, key, value));

  const hargaMin = Number(searchParams.get('harga_min')) || null;
  const hargaMax = Number(searchParams.get('harga_max')) || null;
  const batasHarga = facets && {
    min: Math.floor(facets.harga.min / HARGA_STEP) * HARGA_STEP,
    max: Math.ceil(facets.harga.max / HARGA_STEP) * HARGA_STEP,
  };

  return (
    <>
      <FilterGroup title="Untuk">
        {SEGMENT_OPTIONS.map(({ label, params }) => (
          <FilterCheckbox
            key={label}
            label={label}
            checked={isChecked('segmen', params.segmen)}
            onChange={() => toggle('segmen', params.segmen)}
          />
        ))}
        <FilterCheckbox
          label="Trending"
          checked={isChecked('trending', '1')}
          onChange={() => toggle('trending', '1')}
        />
      </FilterGroup>

      <FilterGroup title="Merek">
        {brands?.map((brand) => (
          <FilterCheckbox
            key={brand.id}
            label={brand.nama}
            checked={isChecked('merek', brand.slug)}
            onChange={() => toggle('merek', brand.slug)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Harga">
        {batasHarga ? (
          <PriceRangeFilter
            batas={batasHarga}
            hargaMin={hargaMin}
            hargaMax={hargaMax}
            onChange={(min, max) => onChange(withParams(searchParams, { harga_min: min, harga_max: max }))}
          />
        ) : null}
      </FilterGroup>

      <FilterGroup title="Ukuran">
        <div className="grid grid-cols-4 gap-2">
          {facets?.ukuran.map((ukuran) => {
            const value = String(ukuran);
            const pressed = isChecked('ukuran', value);

            return (
              <button
                key={value}
                type="button"
                aria-pressed={pressed}
                onClick={() => toggle('ukuran', value)}
                className={`border py-2 text-sm font-semibold ${pressedClass(pressed)}`}
              >
                {value}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Jenis Sepatu">
        {categories?.map((category) => (
          <FilterCheckbox
            key={category.id}
            label={category.nama}
            checked={isChecked('kategori', category.slug)}
            onChange={() => toggle('kategori', category.slug)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Warna">
        <div className="flex flex-wrap gap-3">
          {WARNA_FILTER.map(({ value, label, hex }) => {
            const pressed = isChecked('warna', value);

            return (
              <button
                key={value}
                type="button"
                aria-pressed={pressed}
                aria-label={label}
                title={label}
                onClick={() => toggle('warna', value)}
                style={{ backgroundColor: hex }}
                className={`size-8 rounded-full border border-neutral-300 ${
                  pressed ? 'ring-2 ring-neutral-950 ring-offset-2' : 'hover:ring-2 hover:ring-neutral-300 hover:ring-offset-2'
                }`}
              />
            );
          })}
        </div>
      </FilterGroup>
    </>
  );
}
