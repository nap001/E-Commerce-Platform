import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import api, { getErrorMessage } from '../api/client';
import ItemCard from './ItemCards';
import Spinner from './Spinner';

const MyItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get('/items/myitems')
      .then(({ data }) => !cancelled && setItems(data))
      .catch((err) => !cancelled && setError(getErrorMessage(err, 'Failed to load your items.')))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    setError('');
    setDeletingId(item._id);
    try {
      await api.delete(`/items/${item._id}`);
      setItems((prev) => prev.filter((i) => i._id !== item._id));
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to delete the item.'));
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <Spinner label="Loading your items..." />;

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green-700">My Items</h1>
        <Link to="/sell" className="btn-primary">
          Sell new item
        </Link>
      </div>

      {error && <p className="alert-error mb-4">{error}</p>}

      {items.length === 0 && !error ? (
        <div className="card p-10 text-center text-gray-500">
          <p>You have not listed any items yet.</p>
          <Link to="/sell" className="btn-primary mt-4">
            List your first item
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              actions={
                <>
                  <Link to={`/items/${item._id}/edit`} className="btn-secondary flex-1">
                    <FiEdit2 /> Edit
                  </Link>
                  <button className="btn-danger flex-1" disabled={deletingId === item._id} onClick={() => handleDelete(item)}>
                    <FiTrash2 /> {deletingId === item._id ? 'Deleting...' : 'Delete'}
                  </button>
                </>
              }
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default MyItems;
