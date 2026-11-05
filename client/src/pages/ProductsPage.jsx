import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ActiveFilterTags from '../components/ActiveFilterTags.jsx';
import ProductFilters from '../components/ProductFilters.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import SortSelect from '../components/SortSelect.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { useFilterOptions } from '../hooks/useFilterOptions.js';
import { activeTags, withParams } from '../lib/productFilters.js';

const GRID_CLASS = 'grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [panelOpen, setPanelOpen] = useState(false);
  const options = useFilterOptions();

  const query = searchParams.toString();
  const { data: products, error, loading } = useFetch(query ? `/api/products?${query}` : '/api/products');
  const jumlahFilter = activeTags(searchParams, options).length;
  const jumlahProduk = products?.length ?? 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
      <nav aria-label="Breadcrumb" className="text-sm text-neutral-500">
        <Link to="/" className="hover:text-accent">
          Beranda
        </Link>{' '}
        / <span className="font-semibold text-neutral-950">Produk</span>
      </nav>
      <h1 className="mt-2 font-display text-4xl font-black uppercase tracking-tight md:text-5xl">Produk</h1>

      <div className="mt-6 lg:grid lg:grid-cols-[15rem_1fr] lg:gap-10">
        <aside
          aria-label="Filter produk"
          className={`fixed inset-0 z-20 overflow-y-auto bg-white px-4 pb-24 pt-4 lg:static lg:z-auto lg:block lg:p-0 ${
            panelOpen ? '' : 'hidden'
          }`}
        >
          <div className="flex items-center justify-between lg:hidden">
            <h2 className="font-display text-2xl font-black uppercase tracking-tight">Filter</h2>
            <button
              type="button"
              aria-label="Tutup filter"
              onClick={() => setPanelOpen(false)}
              className="px-2 text-2xl leading-none"
            >
              ×
            </button>
          </div>
          <ProductFilters searchParams={searchParams} options={options} onChange={setSearchParams} />
          <div className="fixed inset-x-0 bottom-0 border-t border-neutral-200 bg-white p-4 lg:hidden">
            <button
              type="button"
              onClick={() => setPanelOpen(false)}
              className="w-full bg-neutral-950 py-3 text-sm font-semibold text-white"
            >
              Lihat {jumlahProduk} produk
            </button>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPanelOpen(true)}
                className="border border-neutral-950 px-4 py-2 text-sm font-semibold lg:hidden"
              >
                Filter{jumlahFilter > 0 ? ` (${jumlahFilter})` : ''}
              </button>
              <p aria-live="polite" className="text-sm text-neutral-500">
                {loading ? 'Memuat...' : `${jumlahProduk} produk`}
              </p>
            </div>
            <SortSelect
              value={searchParams.get('urut') ?? ''}
              onChange={(urut) => setSearchParams(withParams(searchParams, { urut }))}
            />
          </div>

          <div className="mt-4">
            <ActiveFilterTags searchParams={searchParams} options={options} onChange={setSearchParams} />
          </div>

          <div className="mt-6">
            <ProductGrid
              products={products}
              error={error}
              loading={loading}
              skeletonCount={6}
              emptyText="Produk tidak ditemukan. Coba kurangi filter."
              gridClass={GRID_CLASS}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
