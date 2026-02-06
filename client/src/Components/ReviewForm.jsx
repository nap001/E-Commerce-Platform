// components/ReviewForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Assuming token is needed

const ReviewForm = ({ itemId, onReviewAdded }) => {
  const { token, user } = useAuth(); // Assumes user info is in context
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/items/${itemId}/reviews`,
        {
          author:'Anonymous',
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess('Review submitted!');
      setRating(5);
      setComment('');
      onReviewAdded(); // optional callback to refresh reviews
    } catch (err) {
      console.error(err);
      setError('Failed to submit review');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mt-6 space-y-4">
      <h3 className="text-lg font-semibold text-green-700">Leave a Review</h3>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <div>
        <label className="block font-medium">Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border rounded px-3 py-2 w-full"
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} {r === 1 ? 'star' : 'stars'}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border rounded px-3 py-2 w-full"
          rows={4}
          required
        />
      </div>

      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
