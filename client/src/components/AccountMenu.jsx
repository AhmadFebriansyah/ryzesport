import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '../hooks/useSession.js';
import { logout } from '../lib/session.js';
import IconUser from './IconUser.jsx';

const ICON_CLASS = 'block p-2 hover:text-accent';
const ITEM_CLASS = 'block w-full px-4 py-3 text-left text-sm font-semibold hover:bg-neutral-100';

export default function AccountMenu() {
  const { user } = useSession();
  const [open, setOpen] = useState(false);
  const menu = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    function handlePointerDown(event) {
      if (!menu.current.contains(event.target)) setOpen(false);
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  if (!user) {
    return (
      <Link to="/masuk" aria-label="Masuk" title="Masuk" className={ICON_CLASS}>
        <IconUser className="size-6" />
      </Link>
    );
  }

  // Halaman yang wajib login mengalihkan sendiri ke /masuk.
  function handleLogout() {
    setOpen(false);
    logout();
  }

  return (
    <div ref={menu} className="relative">
      <button
        type="button"
        aria-label="Menu akun"
        aria-expanded={open}
        title="Akun"
        onClick={() => setOpen(!open)}
        className={ICON_CLASS}
      >
        <IconUser className="size-6" />
      </button>
      {open ? (
        <div className="absolute right-0 top-full z-20 w-56 border border-neutral-200 bg-white shadow-lg">
          <p className="truncate border-b border-neutral-200 px-4 py-3 text-sm text-neutral-500">
            Halo, <span className="font-semibold text-neutral-950">{user.nama}</span>
          </p>
          <Link to="/pesanan" onClick={() => setOpen(false)} className={ITEM_CLASS}>
            Pesanan Saya
          </Link>
          <button type="button" onClick={handleLogout} className={ITEM_CLASS}>
            Keluar
          </button>
        </div>
      ) : null}
    </div>
  );
}
