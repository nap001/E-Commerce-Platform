import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import ItemDetailPage from './pages/ItemDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SellPage from './pages/SellPage';
import MyItemsPage from './pages/MyItemsPage';
import CartPage from './pages/CartPage';
import MainLayout from './layouts/MainLayout';
const App = () => {
  return (
    <Routes>
      {/* Routes without navbar */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Routes with navbar (wrapped in layout) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Homepage />} />
        <Route path="/items/:id" element={<ItemDetailPage />} />
        <Route path="/sell" element={<SellPage />} />
        <Route path="/my-items" element={<MyItemsPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Route>
    </Routes>
  );
};

export default App;
