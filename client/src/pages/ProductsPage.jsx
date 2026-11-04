import { useSearchParams } from 'react-router-dom';
import CategoryFilter from '../components/CategoryFilter.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import SegmentFilter from '../components/SegmentFilter.jsx';

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const filters = {
    segmen: searchParams.get('segmen'),
    trending: searchParams.get('trending'),
    kategori: searchParams.get('kategori'),
  };
  const query = searchParams.toString();
  const url = query ? `/api/products?${query}` : '/api/products';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <h1 className="font-display text-4xl font-black uppercase tracking-tight md:text-5xl">
        Produk
      </h1>
      <div className="mt-6 flex flex-col gap-2">
        <SegmentFilter {...filters} />
        <CategoryFilter {...filters} />
      </div>
      <div className="mt-8">
        <ProductGrid url={url} />
      </div>
    </div>
  );
}
