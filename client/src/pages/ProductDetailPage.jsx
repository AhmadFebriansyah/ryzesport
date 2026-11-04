import { Link, useParams } from 'react-router-dom';
import ProductDetail from '../components/ProductDetail.jsx';
import { useFetch } from '../hooks/useFetch.js';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { data: product, error, loading } = useFetch(`/api/products/${encodeURIComponent(slug)}`);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <Link to="/produk" className="text-sm font-semibold hover:text-accent">
        ← Semua produk
      </Link>
      <div className="mt-6">
        {loading ? (
          <div
            className="aspect-square animate-pulse bg-neutral-100 md:w-1/2"
            aria-busy="true"
            aria-label="Memuat produk"
          />
        ) : error ? (
          <p className="py-12 text-center text-neutral-500">{error}</p>
        ) : (
          <ProductDetail key={product.id} product={product} />
        )}
      </div>
    </div>
  );
}
