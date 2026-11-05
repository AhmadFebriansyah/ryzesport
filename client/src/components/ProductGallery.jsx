import { useState } from 'react';
import IllustrationTag from './IllustrationTag.jsx';
import PhotoThumbnails from './PhotoThumbnails.jsx';
import PhotoZoom from './PhotoZoom.jsx';

export default function ProductGallery({ photo, namaLengkap }) {
  const [index, setIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const photos = [photo.foto_url, ...photo.foto_tambahan];
  const alt = `${namaLengkap} warna ${photo.nama_warna}`;

  return (
    <div>
      <div className="relative aspect-square bg-neutral-100">
        <button
          type="button"
          onClick={() => setZoomOpen(true)}
          aria-label={`Buka foto ${alt} ukuran penuh`}
          className="group block h-full w-full cursor-zoom-in"
        >
          <img
            src={photos[index]}
            alt={alt}
            width="800"
            height="800"
            className="h-full w-full object-contain"
          />
          <span className="absolute left-2 top-2 bg-neutral-950 px-2 py-1 text-xs font-semibold text-white group-hover:bg-accent group-hover:text-neutral-950">
            Klik untuk zoom
          </span>
        </button>
        {photo.foto_ilustrasi ? <IllustrationTag /> : null}
      </div>

      {photos.length > 1 ? (
        <div className="mt-2">
          <PhotoThumbnails photos={photos} index={index} onSelect={setIndex} />
        </div>
      ) : null}

      {zoomOpen ? (
        <PhotoZoom
          photos={photos}
          alt={alt}
          index={index}
          onChange={setIndex}
          onClose={() => setZoomOpen(false)}
        />
      ) : null}
    </div>
  );
}
