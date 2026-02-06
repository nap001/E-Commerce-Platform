import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiShoppingCart, FiPlusCircle, FiList } from 'react-icons/fi'; // ➕🛒📋
import { useCart } from '../context/CartContext';
const Navbar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const { cartItems } = useCart(); // 👈 get cart

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      {/* Brand logo */}
      <div className="text-2xl font-bold text-green-600">
        <Link to="/">E_NapMerce</Link>
      </div>

      {/* Navigation links */}
      <div className="flex space-x-6 text-gray-700 font-medium items-center">
        <Link to="/" className="hover:text-green-600 transition">Home</Link>
        <Link to="/shop" className="hover:text-green-600 transition">Shop</Link>
        <Link to="/about" className="hover:text-green-600 transition">About</Link>
        <Link to="/contact" className="hover:text-green-600 transition">Contact</Link>

        <Link to="/cart" className="relative">
          <FiShoppingCart className="text-2xl hover:text-green-600 transition" />
          
          {/* 🔴 Red dot if cart is not empty */}
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
          )}
        </Link>

        {/* ➕ Sell Item icon */}
        <Link to="/sell" className="relative">
          <FiPlusCircle className="text-2xl hover:text-green-600 transition" title="Sell Item" />
        </Link>

        {/* 📋 My Items icon */}
        <Link to="/my-items" className="relative">
          <FiList className="text-2xl hover:text-green-600 transition" title="My Items" />
        </Link>

        {/* Auth buttons */}
        {token ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
