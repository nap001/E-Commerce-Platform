import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ItemCard from './ItemCards';

const MyItems = () => {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/items/myitems`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setItems(res.data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    if (token) {
      fetchMyItems();
    } else {
      setError('Please log in to view your items.');
    }
  }, [token]);

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10">
      <h2 className="text-2xl font-bold text-green-700 mb-6">My Items</h2>

      {error && <p className="text-red-500">{error}</p>}

      {items.length === 0 && !error ? (
        <p className="text-gray-500">You have not added any items yet.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {items.map((item) => (
            <ItemCard
              key={item._id}
              id={item._id}
              name={item.name}
              image={item.image}
              description={item.description}
              category={item.category}
              price={item.price}
              quantity={item.quantity}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyItems;
