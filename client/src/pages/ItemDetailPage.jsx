import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import ItemInfo from '../Components/ItemInfo';
import ItemDescription from '../Components/ItemDescription';
import ItemReviews from '../Components/ItemReviews';
import ItemImageGallery from '../Components/ItemGallery';
import ItemActions from '../Components/ItemAction';
import ReviewForm from '../Components/ReviewForm';
import Spinner from '../Components/Spinner';

const ItemDetailPage = () => {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    api
      .get(`/items/${id}`)
      .then(({ data }) => !cancelled && setItem(data))
      .catch((err) => {
        if (cancelled) return;
        setItem(null);
        setError(err.response?.status === 404 ? 'Item not found.' : getErrorMessage(err, 'Failed to load the item.'));
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <Spinner label="Loading item..." />;
  if (error || !item) {
    return (
      <div className="card p-10 text-center">
        <p className="mb-4 text-red-500">{error || 'Item not found.'}</p>
        <Link to="/" className="btn-primary">
          Back to shop
        </Link>
      </div>
    );
  }

  const isOwner = user && String(item.user) === String(user.id);
  const hasReviewed = user && item.reviews.some((r) => String(r.user) === String(user.id));

  let reviewSection = null;
  if (!token) {
    reviewSection = (
      <div className="card p-6 text-center text-gray-600">
        <Link to="/login" state={{ from: `/items/${id}` }} className="font-semibold text-green-700 hover:underline">
          Log in
        </Link>{' '}
        to leave a review.
      </div>
    );
  } else if (!isOwner && !hasReviewed) {
    reviewSection = <ReviewForm itemId={item._id} onReviewAdded={setItem} />;
  }

  return (
    <div>
      <Link to="/" className="mb-4 inline-block text-sm text-green-700 hover:underline">
        &larr; Back to shop
      </Link>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <ItemImageGallery image={item.image} name={item.name} />
        <div>
          <ItemInfo
            name={item.name}
            category={item.category}
            price={item.price}
            quantity={item.quantity}
            averageRating={item.averageRating}
            reviewCount={item.reviewCount}
          />
          <ItemActions item={item} />
        </div>
      </div>

      <div className="mt-10 space-y-6">
        <ItemDescription text={item.description} />
        <ItemReviews reviews={item.reviews} />
        {reviewSection}
      </div>
    </div>
  );
};

export default ItemDetailPage;
