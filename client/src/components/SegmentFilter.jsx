import { productsPath, SEGMENTS } from '../lib/segments.js';
import FilterLink from './FilterLink.jsx';

export default function SegmentFilter({ segmen, trending, kategori }) {
  const keepKategori = kategori ? { kategori } : {};

  return (
    <div className="flex flex-wrap gap-2">
      <FilterLink to={productsPath(keepKategori)} active={!segmen && !trending}>
        Semua
      </FilterLink>
      {SEGMENTS.map(({ label, params }) => (
        <FilterLink
          key={label}
          to={productsPath({ ...params, ...keepKategori })}
          active={params.segmen ? params.segmen === segmen : Boolean(trending)}
        >
          {label}
        </FilterLink>
      ))}
    </div>
  );
}
