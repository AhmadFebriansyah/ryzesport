import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import { useSession } from '../hooks/useSession.js';
import { productsPath, SEGMENTS } from '../lib/segments.js';
import { logout } from '../lib/session.js';

export default function Navbar() {
  const cart = useCart();
  const { user, ready } = useSession();
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
        <div className="flex items-center gap-4 text-sm font-semibold">
          {ready && !user ? (
            <Link to="/masuk" className="whitespace-nowrap hover:text-accent">
              Masuk
            </Link>
          ) : null}
          {user ? (
            <button type="button" onClick={logout} className="whitespace-nowrap hover:text-accent">
              Keluar
            </button>
          ) : null}
          <Link to="/keranjang" className="whitespace-nowrap hover:text-accent">
            Keranjang ({jumlah})
          </Link>
        </div>
      </div>
    </header>
  );
}
