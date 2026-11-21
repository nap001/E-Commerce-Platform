import { Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import ItemDetailPage from './pages/ItemDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SellPage from './pages/SellPage';
import EditItemPage from './pages/EditItemPage';
import MyItemsPage from './pages/MyItemsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import NotFoundPage from './pages/NotFoundPage';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './Components/ProtectedRoute';

const App = () => (
  <Routes>
    {/* Routes without navbar */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    {/* Routes with navbar (wrapped in layout) */}
    <Route element={<MainLayout />}>
      <Route path="/" element={<Homepage />} />
      <Route path="/items/:id" element={<ItemDetailPage />} />
      <Route path="/cart" element={<CartPage />} />

      {/* Require a logged-in user */}
      <Route path="/sell" element={<ProtectedRoute><SellPage /></ProtectedRoute>} />
      <Route path="/items/:id/edit" element={<ProtectedRoute><EditItemPage /></ProtectedRoute>} />
      <Route path="/my-items" element={<ProtectedRoute><MyItemsPage /></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />

      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
);

export default App;
