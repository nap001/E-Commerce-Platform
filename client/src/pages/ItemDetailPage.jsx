import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import ItemInfo from '../components/ItemInfo';
import ItemDescription from '../components/ItemDescription';
import ItemReviews from '../Components/ItemReviews';
import ItemImageGallery from '../Components/ItemGallery';
import ItemActions from '../Components/ItemAction';
import ReviewForm from '../Components/ReviewForm';
const ItemDetailPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/items/${id}`)
      .then((res) => {
        setItem(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching item:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!item) return <p className="p-6 text-red-500">Item not found.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ItemImageGallery image={item.image} />
        <div>
          <ItemInfo
            name={item.name}
            category={item.category}
            price={item.price}
            quantity={item.quantity}
          />
          <ItemActions 
          item = {item}
          stock={item.quantity} />
        </div>
      </div>

      <div className="mt-10 space-y-8">
        <ItemDescription text={item.description} />
        <ItemReviews reviews={item.reviews} />
        <ReviewForm itemId={item._id} onReviewAdded={() => {
          axios
            .get(`${import.meta.env.VITE_API_URL}/api/items/${id}`)
            .then((res) => setItem(res.data))
            .catch((err) => console.error('Error refreshing item:', err));
        }} />
      </div>
    </div>
  );
};

export default ItemDetailPage;
