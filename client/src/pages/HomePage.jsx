import { Link } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid.jsx';
import { productsPath, SEGMENTS } from '../lib/segments.js';

const SECTION_CLASS = 'mx-auto mt-12 max-w-7xl px-4 md:mt-16 md:px-8';
const HEADING_CLASS = 'font-display text-2xl font-black uppercase tracking-tight md:text-3xl';

export default function HomePage() {
  return (
    <>
      <section className="bg-neutral-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-32">
          <h1 className="font-display text-5xl font-black uppercase leading-none tracking-tight md:text-8xl">
            Melangkah
            <br />
            <span className="text-accent">Tanpa Batas</span>
          </h1>
          <p className="mt-6 max-w-md text-neutral-300">
            Sepatu running, sport, dan casual dari merek favoritmu, untuk pria, wanita, dan anak.
          </p>
          <Link
            to="/produk"
            className="mt-8 inline-block bg-accent px-8 py-4 text-sm font-semibold uppercase tracking-wide text-neutral-950 hover:bg-white"
          >
            Belanja Sekarang
          </Link>
        </div>
      </section>

      <section className={SECTION_CLASS}>
        <h2 className={HEADING_CLASS}>Belanja Untuk</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {SEGMENTS.map(({ label, params }) => (
            <Link
              key={label}
              to={productsPath(params)}
              className="bg-neutral-100 p-6 font-display text-xl font-black uppercase tracking-tight hover:bg-neutral-950 hover:text-white md:p-8 md:py-16 md:text-2xl"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

      <section className={SECTION_CLASS}>
        <div className="flex items-baseline justify-between gap-4">
          <h2 className={HEADING_CLASS}>Sedang Trending</h2>
          <Link
            to={productsPath({ trending: '1' })}
            className="whitespace-nowrap text-sm font-semibold hover:text-accent"
          >
            Lihat semua
          </Link>
        </div>
        <div className="mt-6">
          <ProductGrid url="/api/products?trending=1&limit=4" skeletonCount={4} />
        </div>
      </section>
    </>
  );
}
