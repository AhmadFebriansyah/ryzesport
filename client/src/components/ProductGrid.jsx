import { useFetch } from '../hooks/useFetch.js';
import ProductCard from './ProductCard.jsx';

const GRID_CLASS = 'grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4';

export default function ProductGrid({ url, skeletonCount = 8 }) {
  const { data: products, error, loading } = useFetch(url);

  if (loading) {
    return (
      <div className={GRID_CLASS} aria-busy="true" aria-label="Memuat produk">
        {Array.from({ length: skeletonCount }, (_, i) => (
          <div key={i} className="aspect-square animate-pulse bg-neutral-100" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="py-12 text-center text-neutral-500">{error}</p>;
  }

  if (products.length === 0) {
    return <p className="py-12 text-center text-neutral-500">Belum ada produk.</p>;
  }

  return (
    <div className={GRID_CLASS}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
