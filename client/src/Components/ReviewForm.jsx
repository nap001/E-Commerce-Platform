import { useState } from 'react';
import api, { getErrorMessage } from '../api/client';
import { StarInput } from './StarRating';

/** Posts a review. `onReviewAdded` receives the updated item returned by the API. */
const ReviewForm = ({ itemId, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const { data } = await api.post(`/items/${itemId}/reviews`, { rating, comment });
      onReviewAdded(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to submit review.'));
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 p-6">
      <h3 className="text-lg font-semibold text-green-700">Leave a Review</h3>

      {error && <p className="alert-error">{error}</p>}

      <div>
        <span className="label">Rating</span>
        <StarInput value={rating} onChange={setRating} />
      </div>

      <div>
        <label htmlFor="comment" className="label">
          Comment
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="input"
          rows={4}
          maxLength={1000}
          required
        />
      </div>

      <button type="submit" disabled={submitting} className="btn-primary">
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;
