import React from 'react';

const ItemReviews = ({ reviews }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Customer Reviews</h2>
      {reviews && reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div key={index} className="border-t pt-4">
              <div className="flex justify-between items-center">
                <p className="font-medium text-gray-900">{review.author}</p>
                <span className="text-yellow-500 text-sm">
                  {'★'.repeat(review.rating)}{' '}
                  <span className="text-gray-500 ml-1">{review.rating}/5</span>
                </span>
              </div>
              <p className="text-gray-700 mt-2">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">No reviews yet.</p>
      )}
    </div>
  );
};

export default ItemReviews;
