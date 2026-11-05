import { useFetch } from '../hooks/useFetch.js';

export default function PhotoCreditsPage() {
  const { data: credits, error, loading } = useFetch('/api/products/photo-credits');

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-8 md:py-12">
      <h1 className="font-display text-4xl font-black uppercase tracking-tight">Kredit Foto</h1>
      <p className="mt-4 text-neutral-600">
        Foto produk berasal dari Unsplash, Pexels, dan Wikimedia Commons, dipakai sesuai lisensinya.
        Foto berlabel ilustrasi menunjukkan seri atau model yang berbeda dari produk.
      </p>
      <p className="mt-4 text-neutral-600">
        Model 3D:{' '}
        <a
          href="https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/MaterialsVariantsShoe"
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-accent"
        >
          Materials Variants Shoe
        </a>{' '}
        oleh Shopify, CC BY 4.0. Tekstur diperkecil agar lebih ringan.
      </p>

      {loading ? (
        <div className="mt-8 h-32 animate-pulse bg-neutral-100" aria-busy="true" aria-label="Memuat kredit" />
      ) : error ? (
        <p className="py-12 text-center text-neutral-500">{error}</p>
      ) : (
        <ul className="mt-8 border-t border-neutral-200">
          {credits.map((credit) => (
            <li key={credit.foto_url} className="flex items-center gap-4 border-b border-neutral-200 py-3">
              <img
                src={credit.foto_url}
                alt=""
                width="64"
                height="64"
                loading="lazy"
                className="h-16 w-16 shrink-0 bg-neutral-100 object-cover"
              />
              <p className="min-w-0 text-sm">
                {credit.foto_kredit_url ? (
                  <a
                    href={credit.foto_kredit_url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold underline hover:text-accent"
                  >
                    {credit.foto_kredit}
                  </a>
                ) : (
                  <span className="font-semibold">{credit.foto_kredit}</span>
                )}
                <br />
                <span className="text-neutral-500">{credit.foto_lisensi}</span> ·{' '}
                <a href={credit.foto_sumber_url} target="_blank" rel="noreferrer" className="underline hover:text-accent">
                  Sumber
                </a>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
