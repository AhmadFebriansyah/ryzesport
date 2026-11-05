import { Outlet } from 'react-router-dom';
import CartToast from './CartToast.jsx';
import Footer from './Footer.jsx';
import Navbar from './Navbar.jsx';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartToast />
    </div>
  );
}
