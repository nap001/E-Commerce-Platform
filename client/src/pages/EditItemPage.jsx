import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import ItemForm from '../Components/ItemForm';
import Spinner from '../Components/Spinner';

const EditItemPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    api
      .get(`/items/${id}`)
      .then(({ data }) => !cancelled && setItem(data))
      .catch((err) => !cancelled && setError(getErrorMessage(err, 'Failed to load the item.')))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <Spinner label="Loading item..." />;

  const notAllowed = item && user && String(item.user) !== String(user.id) && !user.isAdmin;
  if (error || !item || notAllowed) {
    return (
      <div className="card p-10 text-center">
        <p className="mb-4 text-red-500">{notAllowed ? 'You can only edit your own items.' : error || 'Item not found.'}</p>
        <Link to="/my-items" className="btn-primary">
          Back to my items
        </Link>
      </div>
    );
  }

  const handleUpdate = async (payload) => {
    await api.put(`/items/${id}`, payload);
    navigate(`/items/${id}`);
  };

  return (
    <ItemForm
      title="Edit Item"
      submitLabel="Save changes"
      initialValues={{ ...item, price: String(item.price), quantity: String(item.quantity) }}
      onSubmit={handleUpdate}
    />
  );
};

export default EditItemPage;
