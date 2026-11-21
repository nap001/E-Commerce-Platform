import { Link } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import ProductImage from '../Components/ProductImage';
import { formatPrice } from '../utils/format';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice, itemCount } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="card mx-auto max-w-xl p-10 text-center">
        <h1 className="mb-2 text-2xl font-bold text-green-700">Your cart is empty</h1>
        <p className="mb-6 text-gray-600">Browse the shop and add something you like.</p>
        <Link to="/" className="btn-primary">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green-700">Your Cart ({itemCount})</h1>
        <button onClick={clearCart} className="text-sm text-gray-500 hover:text-red-600 hover:underline">
          Clear cart
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {cartItems.map((item) => (
            <div key={item.id} className="card flex flex-wrap items-center gap-4 p-4">
              <Link to={`/items/${item.id}`}>
                <ProductImage src={item.image} alt={item.name} className="h-20 w-20 rounded-lg" />
              </Link>

              <div className="min-w-40 flex-1">
                <Link to={`/items/${item.id}`} className="font-semibold text-gray-900 hover:text-green-700">
                  {item.name}
                </Link>
                <p className="text-sm text-gray-500">{formatPrice(item.price)} each</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="btn-secondary px-2.5"
                  aria-label={`Decrease quantity of ${item.name}`}
                >
                  <FiMinus />
                </button>
                <span className="w-8 text-center font-medium" aria-live="polite">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                  className="btn-secondary px-2.5"
                  aria-label={`Increase quantity of ${item.name}`}
                  title={item.quantity >= item.stock ? 'No more stock available' : undefined}
                >
                  <FiPlus />
                </button>
              </div>

              <div className="w-24 text-right">
                <p className="font-semibold text-green-700">{formatPrice(item.price * item.quantity)}</p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="mt-1 inline-flex items-center gap-1 text-sm text-red-500 hover:underline"
                >
                  <FiTrash2 /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="card h-fit p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Order summary</h2>
          <dl className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <dt>Items ({itemCount})</dt>
              <dd>{formatPrice(totalPrice)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Shipping</dt>
              <dd>Free</dd>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-bold text-gray-900">
              <dt>Total</dt>
              <dd>{formatPrice(totalPrice)}</dd>
            </div>
          </dl>
          <Link to="/checkout" className="btn-primary mt-6 w-full py-3">
            Proceed to checkout
          </Link>
          <Link to="/" className="mt-3 block text-center text-sm text-green-700 hover:underline">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
