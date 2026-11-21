import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import ProductImage from '../Components/ProductImage';
import Spinner from '../Components/Spinner';
import { formatDate, formatPrice } from '../utils/format';

const STATUS_STYLES = {
  processing: 'bg-yellow-100 text-yellow-800',
  shipped: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-200 text-gray-600',
};

const OrdersPage = () => {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get('/orders')
      .then(({ data }) => !cancelled && setOrders(data))
      .catch((err) => !cancelled && setError(getErrorMessage(err, 'Failed to load your orders.')))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCancel = async (order) => {
    if (!window.confirm('Cancel this order? The items will be returned to stock.')) return;
    setError('');
    setCancellingId(order._id);
    try {
      const { data } = await api.patch(`/orders/${order._id}/cancel`);
      setOrders((prev) => prev.map((o) => (o._id === data._id ? data : o)));
    } catch (err) {
      setError(getErrorMessage(err, 'Could not cancel the order.'));
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <Spinner label="Loading your orders..." />;

  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold text-green-700">My Orders</h1>

      {location.state?.placed && <p className="alert-success mb-4">Thank you! Your order has been placed.</p>}
      {error && <p className="alert-error mb-4">{error}</p>}

      {orders.length === 0 && !error ? (
        <div className="card p-10 text-center text-gray-500">
          <p>You have not placed any orders yet.</p>
          <Link to="/" className="btn-primary mt-4">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <article key={order._id} className="card overflow-hidden">
              <header className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-gray-500">Placed {formatDate(order.createdAt)}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[order.status]}`}>
                  {order.status}
                </span>
              </header>

              <ul className="divide-y divide-gray-100 px-4">
                {order.items.map((line) => (
                  <li key={line.item} className="flex items-center gap-3 py-3 text-sm">
                    <ProductImage src={line.image} alt={line.name} className="h-14 w-14 rounded" />
                    <div className="min-w-0 flex-1">
                      <Link to={`/items/${line.item}`} className="truncate font-medium text-gray-900 hover:text-green-700">
                        {line.name}
                      </Link>
                      <p className="text-gray-500">
                        {line.quantity} &times; {formatPrice(line.price)}
                      </p>
                    </div>
                    <span className="font-medium">{formatPrice(line.price * line.quantity)}</span>
                  </li>
                ))}
              </ul>

              <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-4 py-3 text-sm">
                <p className="text-gray-500">
                  Ship to {order.shippingAddress.fullName}, {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                  {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-base font-bold text-gray-900">{formatPrice(order.totalPrice)}</span>
                  {order.status === 'processing' && (
                    <button className="btn-danger" disabled={cancellingId === order._id} onClick={() => handleCancel(order)}>
                      {cancellingId === order._id ? 'Cancelling...' : 'Cancel order'}
                    </button>
                  )}
                </div>
              </footer>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default OrdersPage;
