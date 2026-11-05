import { lazy, Suspense, useState } from 'react';
import IllustrationTag from './IllustrationTag.jsx';

// Viewer 3D cukup berat, jadi hanya diunduh saat pengunjung membukanya.
const Shoe3DViewer = lazy(() => import('./Shoe3DViewer.jsx'));

export default function ProductGallery({ photo, namaLengkap }) {
  const [show3D, setShow3D] = useState(false);
  const alt = `${namaLengkap} warna ${photo.nama_warna}`;

  return (
    <div>
      <div className="relative aspect-square bg-neutral-100">
        {show3D ? (
          <Suspense
            fallback={
              <p className="absolute inset-x-0 top-1/2 text-center text-sm font-semibold text-neutral-500">
                Memuat model 3D...
              </p>
            }
          >
            <Shoe3DViewer alt={`Model 3D contoh untuk ${namaLengkap}`} />
          </Suspense>
        ) : (
          <button
            type="button"
            onClick={() => setShow3D(true)}
            aria-label={`Lihat ${namaLengkap} dalam 360 derajat`}
            className="group block h-full w-full cursor-zoom-in"
          >
            <img
              src={photo.foto_url}
              alt={alt}
              width="800"
              height="800"
              className="h-full w-full object-contain"
            />
            <span className="absolute left-2 top-2 bg-neutral-950 px-2 py-1 text-xs font-semibold text-white group-hover:bg-accent group-hover:text-neutral-950">
              Klik untuk putar 360°
            </span>
          </button>
        )}
        {!show3D && photo.foto_ilustrasi ? <IllustrationTag /> : null}
      </div>

      {show3D ? (
        <div className="mt-2 flex items-start justify-between gap-4 text-sm">
          <p className="text-neutral-600">
            Geser untuk memutar. Ini model 3D contoh, bentuknya bukan {namaLengkap} yang asli.
          </p>
          <button
            type="button"
            onClick={() => setShow3D(false)}
            className="min-h-9 whitespace-nowrap font-semibold underline hover:text-accent"
          >
            Lihat foto
          </button>
        </div>
      ) : null}
    </div>
  );
}
