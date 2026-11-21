import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiCheck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ItemActions = ({ item }) => {
  const { addToCart, cartItems } = useCart();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const id = item._id;
  const stock = item.quantity;
  const inCart = cartItems.find((i) => i.id === id)?.quantity || 0;
  const remaining = Math.max(stock - inCart, 0);
  const isOwner = user && String(item.user) === String(user.id);

  if (isOwner) {
    return (
      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
        This is your listing.{' '}
        <Link to={`/items/${id}/edit`} className="font-semibold text-green-700 hover:underline">
          Edit item
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    addToCart({ id, name: item.name, price: item.price, image: item.image, stock }, quantity);
    setQuantity(1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div className="mt-6 space-y-3">
      {stock > 0 && remaining > 0 && (
        <div className="flex items-center gap-3">
          <label htmlFor="qty" className="text-sm font-medium text-gray-700">
            Quantity
          </label>
          <select id="qty" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="input w-24">
            {Array.from({ length: Math.min(remaining, 10) }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      )}

      <button onClick={handleAdd} disabled={stock <= 0 || remaining <= 0} className="btn-primary w-full py-3">
        {justAdded ? (
          <>
            <FiCheck /> Added to cart
          </>
        ) : stock <= 0 ? (
          'Out of stock'
        ) : remaining <= 0 ? (
          'Maximum quantity in cart'
        ) : (
          <>
            <FiShoppingCart /> Add to cart
          </>
        )}
      </button>

      {inCart > 0 && (
        <p className="text-center text-sm text-gray-600">
          {inCart} in your cart &middot;{' '}
          <Link to="/cart" className="font-semibold text-green-700 hover:underline">
            View cart
          </Link>
        </p>
      )}
    </div>
  );
};

export default ItemActions;
