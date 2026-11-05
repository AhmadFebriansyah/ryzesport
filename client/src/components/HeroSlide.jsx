import { Link } from 'react-router-dom';
import { fotoDefault, fotoSrcSet, kreditUrl, UNSPLASH_URL } from '../lib/heroSlides.js';

export default function HeroSlide({ slide, aktif, animasi }) {
  const { label, judul, teks, tautan, tombol, foto, dasar, alt, posisi, posisiDesktop, fotografer, username } = slide;

  return (
    <div
      inert={!aktif}
      aria-hidden={!aktif}
      style={{ backgroundColor: dasar, '--dasar': dasar }}
      className={`absolute inset-0 overflow-hidden text-white ${aktif ? 'z-[1]' : ''} ${animasi || (aktif ? '' : 'invisible')}`}
    >
      <img
        src={fotoDefault(foto)}
        srcSet={fotoSrcSet(foto)}
        sizes="100vw"
        alt={alt}
        style={{ '--posisi': posisi, '--posisi-desktop': posisiDesktop }}
        className="absolute inset-x-0 top-0 h-[62%] w-full object-cover [object-position:var(--posisi)] md:inset-y-0 md:left-auto md:right-0 md:h-full md:w-[72%] md:[object-position:var(--posisi-desktop)]"
      />
      <div className="hero-lapis absolute inset-0" />

      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-20 md:justify-center md:px-20 md:pb-8">
        <p className="text-sm font-semibold uppercase tracking-widest">{label}</p>
        <p className="mt-2 max-w-xl font-display text-4xl font-black uppercase leading-none tracking-tight md:text-6xl xl:text-7xl">
          {judul}
        </p>
        <p className="mt-3 max-w-md text-neutral-100 md:mt-4 md:text-lg">{teks}</p>
        <Link
          to={tautan}
          className="mt-5 self-start bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wide text-neutral-950 hover:bg-accent md:mt-8 md:px-8 md:py-4"
        >
          {tombol}
        </Link>
      </div>

      <p className="absolute left-4 top-10 text-xs text-white/80 md:bottom-5 md:left-auto md:right-8 md:top-auto">
        Foto:{' '}
        <a href={kreditUrl(username)} target="_blank" rel="noreferrer" className="underline hover:text-white">
          {fotografer}
        </a>{' '}
        /{' '}
        <a href={UNSPLASH_URL} target="_blank" rel="noreferrer" className="underline hover:text-white">
          Unsplash
        </a>
      </p>
    </div>
  );
}
