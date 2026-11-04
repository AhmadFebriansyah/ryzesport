import { Link } from 'react-router-dom';
import { productsPath, SEGMENTS } from '../lib/segments.js';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-8 md:py-4">
        <Link to="/" className="font-display text-xl font-black tracking-tight">
          RYZE<span className="text-accent">SPORT</span>
        </Link>
        <nav className="flex justify-between text-sm font-semibold md:gap-8">
          <Link to="/produk" className="whitespace-nowrap hover:text-accent">
            Semua
          </Link>
          {SEGMENTS.map(({ label, params }) => (
            <Link key={label} to={productsPath(params)} className="whitespace-nowrap hover:text-accent">
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
