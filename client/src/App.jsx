import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import OrderDetailPage from './pages/OrderDetailPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import PhotoCreditsPage from './pages/PhotoCreditsPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="produk" element={<ProductsPage />} />
        <Route path="produk/:slug" element={<ProductDetailPage />} />
        <Route path="keranjang" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="checkout/selesai" element={<CheckoutSuccessPage />} />
        <Route path="pesanan" element={<OrdersPage />} />
        <Route path="pesanan/:noOrder" element={<OrderDetailPage />} />
        <Route path="masuk" element={<LoginPage />} />
        <Route path="daftar" element={<RegisterPage />} />
        <Route path="kredit-foto" element={<PhotoCreditsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
