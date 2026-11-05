import { useEffect, useState } from 'react';
import { HERO_SLIDES } from '../lib/heroSlides.js';
import HeroArrow from './HeroArrow.jsx';
import HeroSlide from './HeroSlide.jsx';

const JEDA_SLIDE_MS = 5000;
const KE_KANAN = 1;
const KE_KIRI = -1;

function geser({ aktif }, arah) {
  const jumlah = HERO_SLIDES.length;
  return { aktif: (aktif + arah + jumlah) % jumlah, sebelumnya: aktif, arah };
}

function kelasAnimasi(index, { aktif, sebelumnya, arah }) {
  if (sebelumnya === null) return '';
  if (index === aktif) return arah === KE_KANAN ? 'hero-masuk-dari-kiri' : 'hero-masuk-dari-kanan';
  if (index === sebelumnya) return arah === KE_KANAN ? 'hero-keluar-ke-kanan' : 'hero-keluar-ke-kiri';
  return '';
}

export default function HeroSlider() {
  const [slide, setSlide] = useState({ aktif: 0, sebelumnya: null, arah: KE_KANAN });
  const { aktif } = slide;

  function pilihSlide(next) {
    if (next === aktif) return;
    setSlide({ aktif: next, sebelumnya: aktif, arah: next > aktif ? KE_KANAN : KE_KIRI });
  }

  useEffect(() => {
    const timer = setTimeout(() => setSlide((s) => geser(s, KE_KANAN)), JEDA_SLIDE_MS);
    return () => clearTimeout(timer);
  }, [aktif]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Sorotan RyzeSport"
      className="relative isolate h-[34rem] overflow-hidden bg-neutral-950 md:h-[38rem] xl:h-[44rem]"
    >
      <div className="absolute inset-x-0 top-4 z-10 text-white md:top-6">
        <h1 className="mx-auto max-w-7xl px-4 font-display text-sm font-black uppercase tracking-tight md:px-20 md:text-lg">
          Melangkah Tanpa Batas
        </h1>
      </div>

      {HERO_SLIDES.map((item, index) => (
        <HeroSlide
          key={item.id}
          slide={item}
          aktif={index === aktif}
          animasi={kelasAnimasi(index, slide)}
        />
      ))}

      <HeroArrow arah="kiri" onClick={() => setSlide((s) => geser(s, KE_KIRI))} />
      <HeroArrow arah="kanan" onClick={() => setSlide((s) => geser(s, KE_KANAN))} />

      <div className="absolute bottom-3 left-0 z-10 w-full text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 md:px-20">
          {HERO_SLIDES.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Tampilkan ${item.judul}`}
              aria-current={index === aktif}
              onClick={() => pilihSlide(index)}
              className="flex h-11 w-7 items-center md:w-11"
            >
              <span className={`h-1 w-full bg-current ${index === aktif ? '' : 'opacity-40'}`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
