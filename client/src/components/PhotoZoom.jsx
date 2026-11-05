import { useEffect, useRef, useState } from 'react';
import { fotoBesar } from '../lib/photos.js';
import PhotoThumbnails from './PhotoThumbnails.jsx';

const SKALA_ZOOM = 2.5;

const persen = (nilai) => Math.min(100, Math.max(0, nilai * 100));

// Dihitung dari ukuran asli foto, karena ukuran di layar ikut berubah saat diperbesar.
function posisiPointer(event) {
  const area = event.currentTarget;
  const foto = area.firstElementChild;
  const box = area.getBoundingClientRect();
  const x = persen((event.clientX - box.left - foto.offsetLeft) / foto.offsetWidth);
  const y = persen((event.clientY - box.top - foto.offsetTop) / foto.offsetHeight);
  return `${x}% ${y}%`;
}

export default function PhotoZoom({ photos, alt, index, onChange, onClose }) {
  const dialogRef = useRef(null);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');

  useEffect(() => {
    dialogRef.current.showModal();
  }, []);

  function pilihFoto(next) {
    setZoomed(false);
    onChange((next + photos.length) % photos.length);
  }

  function handleKeyDown(event) {
    if (photos.length < 2) return;
    if (event.key === 'ArrowRight') pilihFoto(index + 1);
    if (event.key === 'ArrowLeft') pilihFoto(index - 1);
  }

  function toggleZoom(event) {
    setOrigin(posisiPointer(event));
    setZoomed(!zoomed);
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onKeyDown={handleKeyDown}
      aria-label={alt}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-white"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-4 p-4 text-sm font-semibold">
          <p aria-live="polite">
            {index + 1} / {photos.length}
          </p>
          <button
            type="button"
            onClick={() => dialogRef.current.close()}
            className="min-h-11 px-2 underline hover:text-accent"
          >
            Tutup
          </button>
        </div>

        <div className="relative min-h-0 flex-1 overflow-hidden">
          <button
            type="button"
            aria-label={zoomed ? 'Perkecil foto' : 'Perbesar foto'}
            aria-pressed={zoomed}
            onClick={toggleZoom}
            onPointerMove={(event) => {
              if (zoomed) setOrigin(posisiPointer(event));
            }}
            style={{ touchAction: zoomed ? 'none' : 'manipulation' }}
            className={`relative flex h-full w-full items-center justify-center ${zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
          >
            <img
              src={fotoBesar(photos[index])}
              alt={alt}
              style={{ transform: `scale(${zoomed ? SKALA_ZOOM : 1})`, transformOrigin: origin }}
              className="max-h-full max-w-full transition-transform duration-200"
            />
          </button>
        </div>

        <div className="flex flex-col items-center gap-3 p-4">
          <p className="text-sm text-neutral-500">
            {zoomed ? 'Geser untuk melihat detail. Klik lagi untuk memperkecil.' : 'Klik foto untuk zoom.'}
          </p>
          {photos.length > 1 ? (
            <PhotoThumbnails photos={photos} index={index} onSelect={pilihFoto} />
          ) : null}
        </div>
      </div>
    </dialog>
  );
}
