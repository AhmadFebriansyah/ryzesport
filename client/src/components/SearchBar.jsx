import { useNavigate, useSearchParams } from 'react-router-dom';
import { productsPath } from '../lib/segments.js';
import IconSearch from './IconSearch.jsx';

export default function SearchBar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') ?? '';

  function handleSubmit(event) {
    event.preventDefault();
    const kata = new FormData(event.currentTarget).get('q').trim();
    navigate(productsPath(kata ? { q: kata } : {}));
  }

  // key membuat isi kolom ikut berubah saat kata pencarian di URL berubah atau dihapus.
  return (
    <form key={q} role="search" onSubmit={handleSubmit} className="relative min-w-0 flex-1">
      <input
        type="search"
        name="q"
        defaultValue={q}
        maxLength={100}
        placeholder="Cari produk atau merek"
        aria-label="Cari produk atau merek"
        className="w-full text-ellipsis rounded-full border border-neutral-300 py-2 pl-3 pr-8 outline-none md:pl-4 md:pr-10 focus:border-neutral-950"
      />
      <button type="submit" aria-label="Cari" className="absolute inset-y-0 right-0 px-2 hover:text-accent md:px-3">
        <IconSearch className="size-5" />
      </button>
    </form>
  );
}
