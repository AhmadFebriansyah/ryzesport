const UKURAN = 80;

// Foto produk terbang dari tombol ke ikon keranjang di navbar.
export function flyToCart(src, fromElement) {
  const target = document.querySelector('[data-cart-target]');
  if (!target || !fromElement || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const from = fromElement.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  const left = from.left + from.width / 2 - UKURAN / 2;
  const top = from.top + from.height / 2 - UKURAN / 2;
  const x = to.left + to.width / 2 - UKURAN / 2 - left;
  const y = to.top + to.height / 2 - UKURAN / 2 - top;

  const foto = document.createElement('img');
  foto.src = src;
  foto.alt = '';
  foto.className = 'pointer-events-none fixed z-40 rounded-full object-cover shadow-lg';
  Object.assign(foto.style, { left: `${left}px`, top: `${top}px`, width: `${UKURAN}px`, height: `${UKURAN}px` });
  document.body.append(foto);

  const animasi = foto.animate(
    [
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${x}px, ${y}px) scale(0.2)`, opacity: 0.6 },
    ],
    { duration: 700, easing: 'cubic-bezier(0.5, 0, 0.3, 1)' },
  );
  animasi.finished.finally(() => foto.remove()).catch(() => {});
}
