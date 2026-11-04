import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 text-center md:px-8">
      <h1 className="font-display text-5xl font-black uppercase tracking-tight">404</h1>
      <p className="mt-4 text-neutral-500">Halaman tidak ditemukan.</p>
      <Link to="/" className="mt-6 inline-block font-semibold hover:text-accent">
        Kembali ke beranda
      </Link>
    </div>
  );
}
