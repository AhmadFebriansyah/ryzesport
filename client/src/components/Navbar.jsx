import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import { productsPath, SEGMENTS } from '../lib/segments.js';

export default function Navbar() {
  const cart = useCart();
  const jumlah = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-8 gap-y-3 px-4 py-3 md:flex-nowrap md:px-8 md:py-4">
        <Link to="/" className="font-display text-xl font-black tracking-tight">
          RYZE<span className="text-accent">SPORT</span>
        </Link>
        <nav className="order-last flex w-full justify-between text-sm font-semibold md:order-none md:ml-auto md:w-auto md:gap-8">
          <Link to="/produk" className="whitespace-nowrap hover:text-accent">
            Semua
          </Link>
          {SEGMENTS.map(({ label, params }) => (
            <Link key={label} to={productsPath(params)} className="whitespace-nowrap hover:text-accent">
              {label}
            </Link>
          ))}
        </nav>
        <Link to="/keranjang" className="whitespace-nowrap text-sm font-semibold hover:text-accent">
          Keranjang ({jumlah})
        </Link>
      </div>
    </header>
  );
}
