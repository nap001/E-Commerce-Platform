import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const desktopLink = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-100 hover:text-green-700'
  }`;

const mobileLink = ({ isActive }) =>
  `block rounded-lg px-3 py-2 text-base font-medium ${isActive ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'
  }`;

const Navbar = () => {
  const { token, user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/', label: 'Home', end: true },
    ...(token
      ? [
        { to: '/sell', label: 'Sell' },
        { to: '/my-items', label: 'My Items' },
        { to: '/orders', label: 'Orders' },
      ]
      : []),
  ];

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="text-2xl font-bold text-green-600" onClick={() => setOpen(false)}>
          E_NapMerce
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={desktopLink}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/cart"
            className="relative rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-green-700"
            aria-label={`Cart, ${itemCount} item${itemCount === 1 ? '' : 's'}`}
          >
            <FiShoppingCart className="text-2xl" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>

          <div className="hidden items-center gap-3 md:flex">
            {token ? (
              <>
                {user && <span className="max-w-32 truncate text-sm text-gray-600">Hi, {user.name}</span>}
                <button onClick={handleLogout} className="btn-secondary">
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </button>
        </div>
      </nav>

      {/* Mobile navigation */}
      {open && (
        <div className="space-y-1 border-t border-gray-100 bg-white px-4 py-3 md:hidden">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={mobileLink} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
          <div className="flex gap-2 pt-2">
            {token ? (
              <button onClick={handleLogout} className="btn-secondary w-full">
                <FiLogOut /> Logout{user ? ` (${user.name})` : ''}
              </button>
            ) : (
              <>
                <Link to="/login" className="btn-secondary flex-1" onClick={() => setOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="btn-primary flex-1" onClick={() => setOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
