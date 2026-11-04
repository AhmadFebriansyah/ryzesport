import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import CartPage from './pages/CartPage.jsx';
import HomePage from './pages/HomePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="produk" element={<ProductsPage />} />
        <Route path="produk/:slug" element={<ProductDetailPage />} />
        <Route path="keranjang" element={<CartPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
