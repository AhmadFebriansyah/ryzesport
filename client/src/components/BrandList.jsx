import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch.js';
import { brandLogo } from '../lib/brandLogos.js';
import { productsPath } from '../lib/segments.js';

export default function BrandList() {
  const { data: brands, error } = useFetch('/api/brands');

  if (error) {
    return <p className="mt-6 text-neutral-500">{error}</p>;
  }

  if (!brands) {
    return <div className="mt-6 h-24 animate-pulse bg-neutral-100" aria-busy="true" aria-label="Memuat merek" />;
  }

  return (
    <ul className="mt-6 flex flex-wrap items-center gap-4">
      {brands.map((brand) => {
        const logo = brandLogo(brand.slug);

        return (
          <li key={brand.id} className="flex-1 basis-[calc(50%-0.5rem)] md:basis-0">
            <Link
              to={productsPath({ merek: brand.slug })}
              className="flex h-24 items-center justify-center grayscale transition hover:grayscale-0"
            >
              {logo ? (
                <img src={logo} alt={brand.nama} loading="lazy" className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="font-display text-xl font-black tracking-tight">{brand.nama}</span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
