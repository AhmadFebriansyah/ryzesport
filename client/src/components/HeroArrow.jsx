export default function HeroArrow({ arah, onClick }) {
  const kanan = arah === 'kanan';

  return (
    <button
      type="button"
      aria-label={kanan ? 'Geser ke kanan' : 'Geser ke kiri'}
      onClick={onClick}
      className={`absolute bottom-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-neutral-950 hover:bg-accent md:bottom-auto md:top-1/2 md:-translate-y-1/2 ${kanan ? 'right-4' : 'right-[4.25rem] md:left-4 md:right-auto'}`}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <path d={kanan ? 'M9 5l7 7-7 7' : 'M15 5l-7 7 7 7'} />
      </svg>
    </button>
  );
}
