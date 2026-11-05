import ProductCard from './ProductCard.jsx';

const GRID_CLASS = 'grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4';

export default function ProductGrid({
  products,
  error,
  loading,
  skeletonCount = 8,
  emptyText = 'Belum ada produk.',
  gridClass = GRID_CLASS,
}) {
  if (loading) {
    return (
      <div className={gridClass} aria-busy="true" aria-label="Memuat produk">
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
    return <p className="py-12 text-center text-neutral-500">{emptyText}</p>;
  }

  return (
    <div className={gridClass}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
