import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import { productsPath, SEGMENTS } from '../lib/segments.js';
import AccountMenu from './AccountMenu.jsx';
import IconCart from './IconCart.jsx';
import SearchBar from './SearchBar.jsx';

const NAV_LINK_CLASS = 'whitespace-nowrap py-3 hover:text-accent';

export default function Navbar() {
  const cart = useCart();
  const jumlah = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <header className="sticky top-0 z-10 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 md:gap-8 md:px-8">
        <Link to="/" className="shrink-0 font-display text-lg font-black tracking-tight md:text-2xl">
          RYZE<span className="text-accent">SPORT</span>
        </Link>
        <SearchBar />
        <div className="flex shrink-0 items-center md:gap-2">
          <AccountMenu />
          <Link
            to="/keranjang"
            aria-label={`Keranjang, ${jumlah} barang`}
            title="Keranjang"
            data-cart-target
            className="relative p-2 hover:text-accent"
          >
            <IconCart className="size-6" />
            {jumlah > 0 ? (
              <span key={jumlah} className="badge-pop absolute right-0 top-0 min-w-4.5 rounded-full bg-accent px-1 text-center text-[11px] font-bold leading-4.5 text-neutral-950">
                {jumlah}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
      <div className="bg-neutral-950 text-white">
        <nav className="mx-auto flex max-w-7xl justify-between px-4 text-sm font-semibold uppercase tracking-wide md:justify-center md:gap-16 md:px-8">
          <Link to="/produk" className={NAV_LINK_CLASS}>
            Semua
          </Link>
          {SEGMENTS.map(({ label, params }) => (
            <Link key={label} to={productsPath(params)} className={NAV_LINK_CLASS}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
