import { useFetch } from './useFetch.js';

export function useFilterOptions() {
  const { data: brands } = useFetch('/api/brands');
  const { data: categories } = useFetch('/api/categories');
  const { data: facets } = useFetch('/api/products/filters');

  return { brands, categories, facets };
}
