import { useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ProductImage from '../Components/ProductImage';
import { formatPrice } from '../utils/format';

const FIELDS = [
  { name: 'fullName', label: 'Full name', autoComplete: 'name' },
  { name: 'address', label: 'Street address', autoComplete: 'street-address' },
  { name: 'city', label: 'City', autoComplete: 'address-level2' },
  { name: 'postalCode', label: 'Postal code', autoComplete: 'postal-code' },
  { name: 'country', label: 'Country', autoComplete: 'country-name' },
];

const CheckoutPage = () => {
  const { user } = useAuth();
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState({ fullName: user?.name || '', address: '', city: '', postalCode: '', country: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const placed = useRef(false);

  // Nothing to check out (unless we just placed the order and are mid-redirect)
  if (cartItems.length === 0 && !placed.current) return <Navigate to="/cart" replace />;

  const handleChange = (e) => setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await api.post('/orders', {
        items: cartItems.map((i) => ({ id: i.id, quantity: i.quantity })),
        shippingAddress: address,
      });
      placed.current = true;
      navigate('/orders', { replace: true, state: { placed: true } });
      clearCart();
    } catch (err) {
      setError(getErrorMessage(err, 'Could not place your order.'));
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-green-700">Checkout</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="card space-y-4 p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900">Shipping address</h2>

          {error && (
            <p className="alert-error">
              {error}{' '}
              <Link to="/cart" className="font-semibold underline">
                Review cart
              </Link>
            </p>
          )}

          {FIELDS.map((f) => (
            <div key={f.name}>
              <label htmlFor={f.name} className="label">
                {f.label}
              </label>
              <input
                id={f.name}
                name={f.name}
                autoComplete={f.autoComplete}
                value={address[f.name]}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          ))}

          <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
            <strong>Payment:</strong> Cash on delivery. You pay when your order arrives.
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
            {submitting ? 'Placing order...' : `Place order · ${formatPrice(totalPrice)}`}
          </button>
        </form>

        <aside className="card h-fit p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Your items</h2>
          <ul className="space-y-3">
            {cartItems.map((item) => (
              <li key={item.id} className="flex items-center gap-3 text-sm">
                <ProductImage src={item.image} alt={item.name} className="h-12 w-12 rounded" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-900">{item.name}</p>
                  <p className="text-gray-500">Qty {item.quantity}</p>
                </div>
                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-gray-100 pt-3 text-base font-bold">
            <span>Total</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;
