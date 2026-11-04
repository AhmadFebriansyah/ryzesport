import { useFetch } from '../hooks/useFetch.js';
import { productsPath } from '../lib/segments.js';
import FilterLink from './FilterLink.jsx';

export default function CategoryFilter({ segmen, trending, kategori }) {
  const { data: categories } = useFetch('/api/categories');
  const keepSegment = {
    ...(segmen ? { segmen } : {}),
    ...(trending ? { trending } : {}),
  };

  return (
    <div className="flex flex-wrap gap-2">
      <FilterLink to={productsPath(keepSegment)} active={!kategori}>
        Semua kategori
      </FilterLink>
      {categories?.map((category) => (
        <FilterLink
          key={category.id}
          to={productsPath({ ...keepSegment, kategori: category.slug })}
          active={category.slug === kategori}
        >
          {category.nama}
        </FilterLink>
      ))}
    </div>
  );
}
