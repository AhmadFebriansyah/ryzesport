import { Link } from 'react-router-dom';
import BrandList from '../components/BrandList.jsx';
import HeroSlider from '../components/HeroSlider.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import SegmentCard from '../components/SegmentCard.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { SEGMENT_CARDS } from '../lib/segmentCards.js';

const SECTION_CLASS = 'mx-auto mt-12 max-w-7xl px-4 md:mt-16 md:px-8';
const HEADING_CLASS = 'font-display text-2xl font-black uppercase tracking-tight md:text-3xl';

export default function HomePage() {
  const { data: products, error, loading } = useFetch('/api/products?unggulan=1&limit=4');

  return (
    <>
      <HeroSlider />

      <section className={SECTION_CLASS}>
        <h2 className={HEADING_CLASS}>Kategori Produk</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {SEGMENT_CARDS.map((kartu) => (
            <SegmentCard key={kartu.label} kartu={kartu} />
          ))}
        </div>
      </section>

      <section className={SECTION_CLASS}>
        <h2 className={HEADING_CLASS}>Merek di RyzeSport</h2>
        <BrandList />
      </section>

      <section className={SECTION_CLASS}>
        <div className="flex items-baseline justify-between gap-4">
          <h2 className={HEADING_CLASS}>Produk Unggulan</h2>
          <Link to="/produk" className="whitespace-nowrap text-sm font-semibold hover:text-accent">
            Lihat semua
          </Link>
        </div>
        <div className="mt-6">
          <ProductGrid products={products} error={error} loading={loading} skeletonCount={4} />
        </div>
      </section>
    </>
  );
}
