import { Link } from 'react-router-dom';
import { fotoDefault, fotoSrcSet, kreditUrl, UNSPLASH_URL } from '../lib/heroSlides.js';
import { productsPath } from '../lib/segments.js';

export default function SegmentCard({ kartu }) {
  const { label, foto, alt, posisi, pilihan, fotografer, username } = kartu;

  return (
    <article className="relative aspect-[4/5] overflow-hidden bg-neutral-950 text-white md:aspect-[3/4]">
      <img
        src={fotoDefault(foto)}
        srcSet={fotoSrcSet(foto)}
        sizes="(min-width: 768px) 33vw, 100vw"
        alt={alt}
        loading="lazy"
        style={{ objectPosition: posisi }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-black/55 to-transparent" />

      <p className="absolute right-3 top-3 text-xs text-white">
        Foto:{' '}
        <a href={kreditUrl(username)} target="_blank" rel="noreferrer" className="underline">
          {fotografer}
        </a>{' '}
        /{' '}
        <a href={UNSPLASH_URL} target="_blank" rel="noreferrer" className="underline">
          Unsplash
        </a>
      </p>

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4">
        <h3 className="mb-1 text-center font-display text-3xl font-black uppercase tracking-tight">{label}</h3>
        {pilihan.map(({ teks, params }) => (
          <Link
            key={teks}
            to={productsPath(params)}
            className="bg-white py-3 text-center text-sm font-semibold text-neutral-950 hover:bg-accent"
          >
            {teks}
          </Link>
        ))}
      </div>
    </article>
  );
}
