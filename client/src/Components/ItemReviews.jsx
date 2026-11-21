import { StarRating } from './StarRating';
import { formatDate } from '../utils/format';

const ItemReviews = ({ reviews = [] }) => {
  // Newest first; reviews created before timestamps existed keep their stored order
  const sorted = [...reviews].reverse();

  return (
    <div className="card p-6">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">Customer Reviews ({reviews.length})</h2>
      {sorted.length > 0 ? (
        <div className="space-y-4">
          {sorted.map((review, index) => (
            <div key={review._id || index} className="border-t border-gray-100 pt-4 first:border-0 first:pt-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-gray-900">{review.author || 'Anonymous'}</p>
                <StarRating value={review.rating} />
              </div>
              {review.createdAt && <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>}
              <p className="mt-2 whitespace-pre-line text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="italic text-gray-500">No reviews yet. Be the first to share your thoughts!</p>
      )}
    </div>
  );
};

export default ItemReviews;
